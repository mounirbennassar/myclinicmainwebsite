"""Leads / appointments — the CRM pipeline behind the dashboard.

Access model (mirrors the old Next.js routes, plus the marketing role):
  - POST is public (landing pages) or authenticated (manual entry).
  - GET: super_admin sees all; admin + marketing see their allowed cities;
    agents see only leads assigned to them (within their cities).
  - PATCH: status changes by any lead-facing role (scoped); assignment only
    by admin/super_admin.
  - DELETE: super_admin only.
"""
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from .. import db
from ..security import CurrentUser, get_current_user

router = APIRouter(prefix="/api/appointments", tags=["leads"])

ALLOWED_VERTICALS = {"medical", "dental", "pediatric"}
ALLOWED_DENTAL_SERVICES = {
    "general", "implants", "orthodontics", "veneers", "oral-surgery",
    "pediatric", "root-canal", "whitening", "crowns-bridges", "gums",
    "emergency", "laser", "special-needs", "seniors", "holistic", "gbt-cleaning",
}


async def _optional_user(request: Request) -> CurrentUser | None:
    try:
        return await get_current_user(request)
    except HTTPException:
        return None


def _clip(v: Any, n: int) -> str | None:
    if not isinstance(v, str) or not v.strip():
        return None
    return v.strip()[:n]


@router.post("")
async def create_lead(request: Request):
    body = await request.json()
    city, name, phone = body.get("city"), body.get("name"), body.get("phone")
    if not city or not name or not phone:
        raise HTTPException(status_code=400, detail="All fields are required")

    data: dict[str, Any] = {"city": city, "name": name, "phone": phone}

    vertical = body.get("vertical")
    v = vertical if isinstance(vertical, str) and vertical in ALLOWED_VERTICALS else "medical"
    data["vertical"] = v
    service = body.get("service")
    if v == "dental" and isinstance(service, str) and service in ALLOWED_DENTAL_SERVICES:
        data["service"] = service

    if body.get("manual"):
        user = await _optional_user(request)
        if user is None:
            raise HTTPException(status_code=401, detail="Unauthorized")
        if body.get("channel"):
            data["channel"] = body["channel"]
        if body.get("note"):
            data["note"] = body["note"]
        data["created_by"] = f"{user.name or 'Unknown'} ({user.role_label})"
    else:
        data["channel"] = "Website"
        note = body.get("note")
        if isinstance(note, str) and note.strip():
            data["note"] = note[:2000]

        utm = body.get("utm")
        if isinstance(utm, dict):
            for key in ("source", "medium", "campaign", "term", "content"):
                if utm.get(key):
                    data[f"utm_{key}"] = str(utm[key])[:100]

            ref_slug = _clip(utm.get("ref"), 40)
            if ref_slug:
                link = await db.query_one("select id from utm_links where slug = $1", ref_slug)
                if link:
                    data["utm_link_id"] = link["id"]
            # Fall back to the source+medium+campaign tuple so raw ?utm_… URLs
            # (bypassing /go/<slug>) still attribute to the originating link.
            if "utm_link_id" not in data and utm.get("source") and utm.get("medium") and utm.get("campaign"):
                conds = ["source = $1", "medium = $2", "campaign = $3"]
                vals: list[Any] = [str(utm["source"])[:100], str(utm["medium"])[:100], str(utm["campaign"])[:100]]
                if utm.get("term"):
                    vals.append(str(utm["term"])[:100])
                    conds.append(f"term = ${len(vals)}")
                if utm.get("content"):
                    vals.append(str(utm["content"])[:100])
                    conds.append(f"content = ${len(vals)}")
                match = await db.query_one(
                    f"select id from utm_links where {' and '.join(conds)} order by created_at desc limit 1",
                    *vals,
                )
                if match:
                    data["utm_link_id"] = match["id"]

        if body.get("referrer"):
            data["referrer"] = str(body["referrer"])[:500]

    cols = list(data.keys())
    placeholders = ", ".join(f"${i + 1}" for i in range(len(cols)))
    row = await db.query_one(
        f"insert into appointments ({', '.join(cols)}) values ({placeholders}) returning *",
        *[data[c] for c in cols],
    )
    return {"success": True, "data": row}


@router.get("")
async def list_leads(user: CurrentUser = Depends(get_current_user)):
    if user.role == "content_manager":
        raise HTTPException(status_code=403, detail="Forbidden")

    agent_id = user.id if user.role == "agent" else None
    if user.role != "super_admin" and not user.allowed_cities:
        return {"data": []}

    conds: list[str] = []
    params: list[Any] = []
    if user.role != "super_admin":
        params.append(user.allowed_cities)
        conds.append(f"city = ANY(${len(params)}::text[])")
    if agent_id:
        params.append(agent_id)
        conds.append(f"assigned_to = ${len(params)}::uuid")

    where = f"where {' and '.join(conds)}" if conds else ""
    data = await db.query(f"select * from appointments {where} order by created_at desc", *params)
    return {"data": data}


class LeadPatch(BaseModel):
    id: str
    status: str | None = None
    assigned_to: str | None = None
    assigned_to_name: str | None = None
    model_config = {"extra": "allow"}


@router.patch("")
async def update_lead(body: LeadPatch, request: Request, user: CurrentUser = Depends(get_current_user)):
    if user.role == "content_manager":
        raise HTTPException(status_code=403, detail="Forbidden")
    if not body.id:
        raise HTTPException(status_code=400, detail="Missing id")

    if user.role != "super_admin":
        appt = await db.query_one("select assigned_to, city from appointments where id = $1::uuid", body.id)
        if appt is None:
            raise HTTPException(status_code=403, detail="Forbidden")
        if user.role == "agent" and appt["assigned_to"] != user.id:
            raise HTTPException(status_code=403, detail="Forbidden")
        if appt["city"] not in user.allowed_cities:
            raise HTTPException(status_code=403, detail="Forbidden")

    updates: dict[str, Any] = {}
    if body.status:
        updates["status"] = body.status
        updates["status_changed_by"] = f"{user.name or 'Unknown'} ({user.role_label})"
        updates["status_changed_at"] = "now()"

    raw = await request.json()
    if "assigned_to" in raw and user.role in ("super_admin", "admin"):
        updates["assigned_to"] = body.assigned_to or None
        updates["assigned_to_name"] = body.assigned_to_name or None

    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update")

    sets: list[str] = []
    vals: list[Any] = []
    for col, val in updates.items():
        if col == "status_changed_at":
            sets.append("status_changed_at = now()")
            continue
        cast = "::uuid" if col == "assigned_to" else ""
        vals.append(val)
        sets.append(f"{col} = ${len(vals)}{cast}")
    vals.append(body.id)
    row = await db.query_one(
        f"update appointments set {', '.join(sets)} where id = ${len(vals)}::uuid"
        " returning status_changed_by, status_changed_at, assigned_to, assigned_to_name",
        *vals,
    )

    out: dict[str, Any] = {"success": True}
    if row:
        if "status" in updates:
            out["status_changed_by"] = row["status_changed_by"]
            out["status_changed_at"] = row["status_changed_at"]
        if "assigned_to" in updates:
            out["assigned_to"] = row["assigned_to"]
            out["assigned_to_name"] = row["assigned_to_name"]
    return out


@router.delete("")
async def delete_leads(request: Request, user: CurrentUser = Depends(get_current_user)):
    if user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Only super admins can delete leads")

    body = await request.json()
    lead_id, ids = body.get("id"), body.get("ids")
    if not lead_id and not (isinstance(ids, list) and ids):
        raise HTTPException(status_code=400, detail="Missing id or ids")

    if isinstance(ids, list) and ids:
        await db.execute("delete from appointments where id = ANY($1::uuid[])", ids)
    else:
        await db.execute("delete from appointments where id = $1::uuid", lead_id)
    return {"success": True}
