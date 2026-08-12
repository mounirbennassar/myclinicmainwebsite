# Centralising leads: Supabase → the VM's Postgres

Until now there were two lead pipelines:

| | Landing pages | Main site |
|---|---|---|
| Domain | `myclinicsa.com.sa` (Vercel) | `myclinic.com.sa` (the VM) |
| Repo | `Clients/myclinic/lp` | this one |
| Leads land in | Supabase | Postgres on the VM |

Two databases meant two dashboards and no single view of a campaign. This
change makes the **VM's Postgres the only lead store**: the landing pages keep
their own forms and URLs, but their public write routes forward server-to-server
to `https://myclinic.com.sa/api/...`.

There are two halves, and they are independent — the import can run before or
after the landing pages are redeployed, because it is idempotent.

---

## 1. Import the historical Supabase data

**What moves** — `utm_links` → `appointments` → `utm_clicks` (that order: they
are foreign-keyed). At the time of writing the source holds 78 links, 5,885
leads and 151,045 clicks.

**What does not move** — `team_members`. The VM's copy of that table has
diverged (`005_multi_roles.sql` added `roles text[]`) and importing the old
single-role rows would resurrect stale password hashes. Create accounts in the
portal instead.

The import must run **on the VM**: the db container publishes `127.0.0.1:5432`
only, so nothing off-box can reach the database. It needs outbound HTTPS to
Supabase, `python3` and `docker compose` — the VM has all three.

### Step 1 — back up first

Non-negotiable. It is the undo button for everything below.

```bash
cd /opt/myclinic
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > ~/db-before-lead-import-$(date +%F).sql.gz
ls -lh ~/db-before-lead-import-*.sql.gz
```

### Step 2 — check the source is reachable

```bash
cd /opt/myclinic
export SUPABASE_URL='https://sxqqbxhrbyrktynrnmtf.supabase.co'
export SUPABASE_SERVICE_KEY='<service-role key from the lp project .env.local>'
python3 scripts/import-supabase-leads.py --dry-run
```

### Step 3 — record the current row counts

So you can prove afterwards what the import added.

```bash
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA -c "
  select '\''appointments'\'', count(*) from appointments
  union all select '\''utm_links'\'', count(*) from utm_links
  union all select '\''utm_clicks'\'', count(*) from utm_clicks;"'
```

### Step 4 — import

One command. It streams the SQL straight into `psql`, so no file of patient data
is ever written to disk.

```bash
cd /opt/myclinic
python3 scripts/import-supabase-leads.py \
  | docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Progress prints on stderr as it reads; the final row counts print at the end.
`ON_ERROR_STOP=1` plus the script's single `begin;…commit;` means a failure
anywhere rolls the whole thing back — you will not get a half-import.

**The single quotes around the `psql` command matter.** `POSTGRES_USER` and
`POSTGRES_DB` are set inside the db container, not in the host shell.
Interpolating them outside silently connects as the wrong user.

### Step 5 — verify

```bash
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA -c "
  select count(*) filter (where channel = '\''Website'\'') as website_leads,
         count(*) as total,
         min(created_at)::date as earliest,
         max(created_at)::date as latest
  from appointments;"'
```

Then open **portal.myclinic.com.sa → Leads** and confirm the older landing-page
enquiries are listed, and **→ UTM** that the campaigns show their click counts.

Safe to re-run: every insert is `ON CONFLICT DO NOTHING`. Both databases descend
from this same Supabase, so rows predating the split share their uuids and are
skipped rather than duplicated. Running it twice is a no-op.

---

## 2. Point the landing pages at the central backend

In the **lp repo**, the public write routes now forward instead of writing to
Supabase:

| Route | Behaviour |
|---|---|
| `POST /api/appointments` | Public form submissions forward to `myclinic.com.sa/api/appointments`. Dashboard manual entry (`manual: true`) still writes locally. |
| `POST /api/utm/track` | Click pings forward to the central `/api/utm/track` (a faithful port — same payload, same skip semantics, same IP-hash de-duplication). |

Both fall back to the local Supabase write if the central backend is
unreachable, so a transient failure cannot lose a patient enquiry. Anything that
lands locally that way is swept up the next time the import in part 1 runs.

The browser still posts to the landing pages' own same-origin `/api/...` paths,
so there is no CORS preflight and **the forms themselves did not change**.

Override the target with `CENTRAL_BACKEND_ORIGIN` (defaults to
`https://myclinic.com.sa`) to aim a preview deployment somewhere else.

### The main site gained two attribution safeguards

The lp route had two server-side safeguards the main site's route lacked; they
are ported so forwarded leads keep full attribution:

1. **`mc_ref` cookie backstop** — `/go/<slug>` drops a 90-day cookie, so a form
   submitted days later (in-app browser hop, new tab, cleared session) still
   credits the link that earned it.
2. **`utm_*` backfill** — when a link resolves but the raw `utm_*` fields never
   arrived, they are filled from the link definition so the lead shows its
   source and campaign everywhere, not only via `utm_link_id`.

---

## Still split — decide before retiring Supabase

* **`/go/<slug>` short links on the lp domain** still resolve and log clicks
  against Supabase, because building the destination URL needs to *read*
  `utm_links` and the central backend exposes no public slug-resolver. Options:
  redirect `myclinicsa.com.sa/go/*` to `myclinic.com.sa/go/*` (one extra hop; the
  `mc_ref` cookie would then be set on the main domain, so it stops backstopping
  lp-hosted destinations), or add a public resolver endpoint. Not yet done.
* **New UTM links must be created in the portal** from now on. A link created in
  the lp dashboard exists only in Supabase, so leads citing its slug will not
  resolve centrally.
* **The lp dashboard is now stale** for leads — it reads Supabase, which stops
  receiving them. `portal.myclinic.com.sa` is the real dashboard.

## Running the commands from Windows

The VM is **Ubuntu with Docker** — there is no PowerShell on it, and no
PowerShell equivalent of these commands. What you do from PowerShell is *connect*
to it; Windows 10+ ships the OpenSSH client, so `ssh` works natively:

```powershell
ssh <user>@10.97.100.10
```

That drops you into bash on the VM, where every command above is run verbatim.
To run one without an interactive session:

```powershell
ssh <user>@10.97.100.10 "cd /opt/myclinic && docker compose ps"
```

Keep the service-role key out of your shell history — paste it into the
`export` line inside the SSH session rather than into a PowerShell one-liner.
