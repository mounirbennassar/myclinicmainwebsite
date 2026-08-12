#!/usr/bin/env python3
"""Centralise the landing-pages leads: Supabase → the VM's Postgres.

Emits one idempotent SQL script on stdout. Nothing is written to disk and no
credentials appear in the output, so the normal way to run it is to pipe it
straight into psql on the VM:

    cd /opt/myclinic
    SUPABASE_URL='https://<project>.supabase.co' \
    SUPABASE_SERVICE_KEY='<service-role key>' \
    python3 scripts/import-supabase-leads.py \
      | docker compose exec -T db sh -c \
          'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'

Note the single quotes around the psql command: POSTGRES_USER / POSTGRES_DB are
set inside the db container (from .env), not in the host shell, so the expansion
has to happen in there. Interpolating them outside is how this silently
connects as the wrong user.

Why it has to run on the VM: the db container publishes 127.0.0.1:5432 only
(docker-compose.yml) and the VM is on a private network, so no external process
can reach the database. This script needs outbound HTTPS to Supabase and a
local docker socket — the VM has both.

What it copies, in foreign-key order:

    utm_links → appointments → utm_clicks

`team_members` is deliberately excluded. The VM's copy of that table has
diverged (005_multi_roles.sql added `roles text[]`) and importing the old
single-role rows would resurrect stale password hashes. Create accounts in the
portal instead.

Safe to run repeatedly:

  * every insert is ON CONFLICT DO NOTHING. Both databases descend from this
    same Supabase, so rows predating the split share their uuids and are
    skipped rather than duplicated;
  * rows land in temp staging tables first, where references to rows that only
    ever existed in Supabase are repaired before they reach the real tables;
  * the whole apply is a single transaction — it lands completely or not at all.

Options:
  --dry-run   Report source row counts and exit without emitting SQL.
"""

import base64
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

# Rows per INSERT. Large enough that 150k+ utm_clicks applies quickly, small
# enough that no single statement becomes unwieldy.
BATCH = 500
PAGE = 1000

# Column lists are the VM schema (backend/sql/001_baseline.sql), which is
# column-for-column what Supabase holds — migrations 002-005 left these three
# tables untouched.
TABLES = [
    {
        "name": "utm_links",
        # Sorted by creation, not id: a uuid ordering is meaningless.
        "order": "created_at",
        "cols": ["id", "slug", "destination_url", "source", "medium", "campaign",
                 "term", "content", "label", "created_by", "created_by_id", "created_at"],
        # created_by_id references team_members, which we do not import, so it
        # dangles for links created by a Supabase-only account. Null it rather
        # than lose the link.
        "null_dangling": [("created_by_id", "team_members")],
    },
    {
        "name": "appointments",
        "order": "created_at",
        "cols": ["id", "created_at", "city", "name", "phone", "channel", "note",
                 "vertical", "service", "created_by", "status", "status_changed_by",
                 "status_changed_at", "assigned_to", "assigned_to_name",
                 "utm_source", "utm_medium", "utm_campaign", "utm_term",
                 "utm_content", "utm_link_id", "referrer"],
        "null_dangling": [
            ("utm_link_id", "utm_links"),
            # assigned_to points at a team_members row we are not importing.
            # assigned_to_name is free text and survives, so the audit trail
            # still reads.
            ("assigned_to", "team_members"),
        ],
    },
    {
        "name": "utm_clicks",
        "order": "clicked_at",
        "cols": ["id", "link_id", "clicked_at", "referrer", "user_agent",
                 "ip_hash", "country"],
        # link_id is NOT NULL, so a click whose link is missing cannot be
        # nulled — it has to be dropped from staging instead.
        "drop_dangling": [("link_id", "utm_links")],
    },
]


def env(name):
    value = os.environ.get(name, "").strip()
    if not value:
        sys.exit(f"error: {name} is not set (see the header of this file)")
    return value


def check_service_key():
    """Refuse the anon key.

    Both Supabase keys are JWTs that look alike, and the wrong one fails
    *silently*: row-level security returns an empty list rather than an error,
    so the import would report success and move nothing. Read the role out of
    the token and stop here instead.
    """
    token = env("SUPABASE_SERVICE_KEY")
    try:
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)  # JWTs drop base64 padding
        role = json.loads(base64.urlsafe_b64decode(payload)).get("role")
    except Exception:
        sys.exit("error: SUPABASE_SERVICE_KEY is not a readable JWT — copy it again")

    if role != "service_role":
        sys.exit(
            f"error: that is the '{role}' key, which cannot read these tables.\n"
            "       Use the value of SUPABASE_SERVICE_ROLE_KEY from the lp repo's\n"
            "       .env.local — NOT NEXT_PUBLIC_SUPABASE_ANON_KEY."
        )


def request(path):
    # Read credentials at call time, not import time, so the SQL-building
    # helpers below can be exercised without them.
    base = env("SUPABASE_URL").rstrip("/")
    key = env("SUPABASE_SERVICE_KEY")
    req = urllib.request.Request(
        f"{base}/rest/v1/{path}",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            return json.load(res)
    except urllib.error.HTTPError as e:
        sys.exit(f"error: Supabase read failed ({e.code}): {e.read().decode()[:400]}")
    except urllib.error.URLError as e:
        sys.exit(f"error: cannot reach Supabase ({e.reason}) — check outbound HTTPS")


def fetch_all(table, order):
    """Read every row, paginated. Progress goes to stderr so stdout stays SQL."""
    rows = []
    while True:
        page = request(f"{table}?select=*&order={order}.asc&limit={PAGE}&offset={len(rows)}")
        rows.extend(page)
        sys.stderr.write(f"\r  {table}: {len(rows)} rows")
        if len(page) < PAGE:
            break
    sys.stderr.write("\n")

    # A table that reads as empty means the request was refused, not that the
    # source is empty — all three of these hold data. Stop before emitting the
    # closing `commit;` so psql rolls back whatever already streamed, rather
    # than committing a no-op import that looks like success.
    if not rows:
        sys.exit(
            f"\nerror: {table} came back empty, which should be impossible.\n"
            "       Almost always the key is wrong or lacks access — row-level\n"
            "       security returns an empty list instead of an error.\n"
            "       Nothing was committed."
        )
    return rows


def quote(text):
    # standard_conforming_strings is on by default in every supported Postgres,
    # so a backslash is an ordinary character and only the quote needs doubling.
    # NUL bytes cannot be stored in a text column at all; user agents and
    # referrers are the realistic source of one.
    return "'" + str(text).replace("\x00", "").replace("'", "''") + "'"


def literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        # text[] literal: '{"a","b"}'
        members = ",".join(
            '"' + str(v).replace("\\", "\\\\").replace('"', '\\"') + '"' for v in value
        )
        return quote("{" + members + "}")
    if isinstance(value, dict):
        return quote(json.dumps(value, ensure_ascii=False))
    return quote(value)


def main():
    dry_run = "--dry-run" in sys.argv[1:]

    check_service_key()

    if dry_run:
        for table in TABLES:
            head = request(f"{table['name']}?select=id&limit=1")
            sys.stderr.write(f"  {table['name']}: reachable ({len(head)} sampled)\n")
        sys.stderr.write("dry run — no SQL emitted\n")
        return

    stamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
    out = sys.stdout

    out.write(
        f"-- Landing-pages Supabase → VM Postgres, generated {stamp}\n"
        f"-- Source: {env('SUPABASE_URL')}\n"
        "--\n"
        "-- Idempotent: every insert is ON CONFLICT DO NOTHING and the whole file\n"
        "-- is one transaction. Re-applying inserts only what is genuinely missing.\n"
        "\n"
        "begin;\n\n"
    )

    counts = {}
    for table in TABLES:
        name = table["name"]
        sys.stderr.write(f"reading {name}...\n")
        rows = fetch_all(name, table["order"])
        counts[name] = len(rows)

        stg = f"stg_{name}"
        rule = "-" * max(0, 44 - len(name))
        out.write(f"-- {name} ({len(rows)} rows) {rule}\n")
        # Staging carries the target's columns and types but none of its
        # constraints, so dangling references can be repaired before insert.
        out.write(f"create temp table {stg} (like {name}) on commit drop;\n")

        if not rows:
            out.write("-- (empty in the source)\n\n")
            continue

        cols = table["cols"]
        col_list = ", ".join(cols)
        for start in range(0, len(rows), BATCH):
            batch = rows[start:start + BATCH]
            out.write(f"insert into {stg} ({col_list}) values\n")
            out.write(",\n".join(
                "  (" + ", ".join(literal(row.get(c)) for c in cols) + ")" for row in batch
            ))
            out.write(";\n")

        for col, refs in table.get("null_dangling", []):
            out.write(
                f"update {stg} s set {col} = null\n"
                f" where s.{col} is not null\n"
                f"   and not exists (select 1 from {refs} r where r.id = s.{col});\n"
            )
        for col, refs in table.get("drop_dangling", []):
            out.write(
                f"delete from {stg} s\n"
                f" where s.{col} is null\n"
                f"    or not exists (select 1 from {refs} r where r.id = s.{col});\n"
            )

        # Bare ON CONFLICT DO NOTHING (no target) so it absorbs *any* unique
        # violation — the primary key, but also utm_links.slug, which the two
        # databases may have filled independently since they split.
        out.write(f"insert into {name} select * from {stg} on conflict do nothing;\n\n")

    # Make the apply self-verifying: the final counts print in psql's output.
    out.write(
        "-- result ---------------------------------------------------------------\n"
        "select 'utm_links' as table, count(*) as rows_now from utm_links\n"
        "union all select 'appointments', count(*) from appointments\n"
        "union all select 'utm_clicks',   count(*) from utm_clicks;\n"
        "\ncommit;\n"
    )

    summary = "  ".join(f"{t}={n}" for t, n in counts.items())
    sys.stderr.write(f"\nread from source:  {summary}\n")


if __name__ == "__main__":
    main()
