"""UTM short links + click tracking. Link management is open to marketing as
well as admins; /track stays public (called by landing pages)."""
import hashlib
import re
import secrets
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request

from .. import db
from ..config import settings
from ..security import MARKETING_ROLES, CurrentUser, require_roles

router = APIRouter(prefix="/api/utm", tags=["utm"])

BOT_RE = re.compile(
    r"bot|crawler|spider|crawling|facebookexternalhit|preview|prerender|whatsapp|telegram|slack|linkedin",
    re.I,
)


def _gen_slug(length: int = 6) -> str:
    chars = "abcdefghijkmnpqrstuvwxyz23456789"
    return "".join(chars[b % len(chars)] for b in secrets.token_bytes(length))


def _slugify(value: str) -> str:
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", value.lower().strip()))[:40]


def _s(v: Any, max_len: int = 100) -> str | None:
    if not isinstance(v, str) or not v.strip():
        return None
    return v.strip()[:max_len]


@router.get("")
async def list_links(_: CurrentUser = Depends(require_roles(*MARKETING_ROLES))):
    links = await db.query(
        "select id, slug, destination_url, source, medium, campaign, term, content, label,"
        " created_by, created_at from utm_links order by created_at desc"
    )
    link_ids = [l["id"] for l in links]

    clicks: list[dict] = []
    appts: list[dict] = []
    if link_ids:
        clicks = await db.query(
            "select link_id, clicked_at from utm_clicks where link_id = ANY($1::uuid[])", link_ids
        )
        appts = await db.query(
            "select utm_link_id, status from appointments where utm_link_id = ANY($1::uuid[])", link_ids
        )

    click_by_link: dict[str, dict[str, Any]] = {}
    for c in clicks:
        entry = click_by_link.setdefault(c["link_id"], {"count": 0, "last": None})
        entry["count"] += 1
        if entry["last"] is None or c["clicked_at"] > entry["last"]:
            entry["last"] = c["clicked_at"]

    conv_by_link: dict[str, dict[str, int]] = {}
    for a in appts:
        if not a.get("utm_link_id"):
            continue
        entry = conv_by_link.setdefault(a["utm_link_id"], {"total": 0, "confirmed": 0})
        entry["total"] += 1
        if a["status"] in ("confirmed", "completed"):
            entry["confirmed"] += 1

    enriched = []
    for l in links:
        ce = click_by_link.get(l["id"], {"count": 0, "last": None})
        conv = conv_by_link.get(l["id"], {"total": 0, "confirmed": 0})
        enriched.append({
            **l,
            "clicks": ce["count"],
            "last_click_at": ce["last"],
            "conversions": conv["total"],
            "confirmed_conversions": conv["confirmed"],
        })
    return {"data": enriched}


@router.post("")
async def create_link(request: Request, user: CurrentUser = Depends(require_roles(*MARKETING_ROLES))):
    body = await request.json()
    destination_url = str(body.get("destination_url") or "").strip()
    source = str(body.get("source") or "").strip()
    medium = str(body.get("medium") or "").strip()
    campaign = str(body.get("campaign") or "").strip()
    term = _s(body.get("term")) if body.get("term") else None
    content = _s(body.get("content")) if body.get("content") else None
    label = _s(body.get("label"), 200) if body.get("label") else None
    custom_slug = _slugify(str(body["slug"])) if body.get("slug") else None

    if not destination_url or not source or not medium or not campaign:
        raise HTTPException(status_code=400, detail="destination_url, source, medium, campaign are required")
    if not re.match(r"^https?://[^\s]+$", destination_url):
        raise HTTPException(status_code=400, detail="Invalid destination URL")

    slug = custom_slug or _gen_slug()
    for _ in range(5):
        existing = await db.query_one("select id from utm_links where slug = $1", slug)
        if existing is None:
            break
        if custom_slug:
            raise HTTPException(status_code=409, detail="Slug already in use")
        slug = _gen_slug()

    created_by = f"{user.name or 'Unknown'} ({user.role_label})"
    data = await db.query_one(
        "insert into utm_links (slug, destination_url, source, medium, campaign, term, content,"
        " label, created_by, created_by_id)"
        " values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::uuid)"
        " returning id, slug, destination_url, source, medium, campaign, term, content, label,"
        " created_by, created_at",
        slug, destination_url, source, medium, campaign, term, content, label, created_by, user.id,
    )
    return {"data": data}


@router.post("/track")
async def track_click(request: Request):
    try:
        ua = request.headers.get("user-agent", "")
        if BOT_RE.search(ua):
            return {"ok": True, "skipped": "bot"}

        try:
            body = await request.json()
        except Exception:
            body = {}

        ref = _s(body.get("ref"), 40)
        source, medium, campaign = _s(body.get("source")), _s(body.get("medium")), _s(body.get("campaign"))
        term, content = _s(body.get("term")), _s(body.get("content"))

        if not ref and not (source and medium and campaign):
            return {"ok": True, "skipped": "no-utm"}

        link_id: str | None = None
        if ref:
            link = await db.query_one("select id from utm_links where slug = $1", ref)
            if link:
                link_id = link["id"]

        if link_id is None and source and medium and campaign:
            conds = ["source = $1", "medium = $2", "campaign = $3"]
            vals: list[Any] = [source, medium, campaign]
            if term:
                vals.append(term)
                conds.append(f"term = ${len(vals)}")
            if content:
                vals.append(content)
                conds.append(f"content = ${len(vals)}")
            match = await db.query_one(
                f"select id from utm_links where {' and '.join(conds)} order by created_at desc limit 1",
                *vals,
            )
            if match:
                link_id = match["id"]

        if link_id is None:
            return {"ok": True, "skipped": "no-match"}

        fwd = request.headers.get("x-forwarded-for", "")
        ip = fwd.split(",")[0].strip() if fwd else (request.headers.get("x-real-ip") or "")
        salt = settings.jwt_secret or "utm"
        ip_hash = hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()[:16] if ip else None
        referrer = _s(body.get("referrer"), 500) or request.headers.get("referer")
        country = request.headers.get("x-vercel-ip-country")

        await db.execute(
            "insert into utm_clicks (link_id, referrer, user_agent, ip_hash, country)"
            " values ($1::uuid, $2, $3, $4, $5)",
            link_id, referrer, ua or None, ip_hash, country,
        )
        return {"ok": True, "link_id": link_id}
    except Exception:
        return {"ok": False}


@router.delete("/{link_id}")
async def delete_link(link_id: str, _: CurrentUser = Depends(require_roles(*MARKETING_ROLES))):
    # utm_clicks.link_id cascades, so the link's clicks go with it.
    await db.execute("delete from utm_links where id = $1::uuid", link_id)
    return {"success": True}
