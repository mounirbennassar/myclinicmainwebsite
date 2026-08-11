"""Doctors directory. Public GET feeds the site's carousels/find-doctor pages
(cached in-process for 5 minutes, like the old route); everything else is
admin-gated. Photo uploads land on local disk, served at /api/uploads/*."""
import re
import time
import unicodedata
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from .. import db
from ..config import settings
from ..security import DOCTOR_ROLES, CurrentUser, require_roles

router = APIRouter(prefix="/api/doctors", tags=["doctors"])

CARD_COLS = (
    "id, slug, name_en, name_ar, image_url, qualification_en, qualification_ar, specialty_raw,"
    " specialties, title, title_ar, languages, gender, branches, cities, is_active, sort_order"
)

# Every writable column, kept as data so create and update cannot drift apart.
# They did: the Arabic and profile columns added in sql/003 were missing here,
# so an admin's Arabic qualifications were accepted and then silently dropped.
# Mirrors DOCTOR_TEXT_COLS / DOCTOR_ARRAY_COLS in app/lib/doctors.ts — the two
# API surfaces write the same table and must accept the same body.
TEXT_COLS = (
    "name_ar", "email", "image_url", "qualification_en", "qualification_ar",
    "specialty_raw", "title", "title_ar", "languages", "gender",
)
ARRAY_COLS = ("specialties", "branches", "cities")

_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 5 * 60


def _cache_get(key: str) -> Any | None:
    hit = _cache.get(key)
    if hit and hit[0] > time.monotonic():
        return hit[1]
    return None


def _cache_put(key: str, value: Any) -> None:
    _cache[key] = (time.monotonic() + _CACHE_TTL, value)


def _str(v: Any) -> str | None:
    return v.strip() if isinstance(v, str) and v.strip() else None


def _arr(v: Any) -> list[str]:
    return [x for x in v if isinstance(x, str) and x.strip()] if isinstance(v, list) else []


async def _unique_slug(name: str, exclude_id: str | None = None) -> str:
    base = re.sub(r"^\s*dr\.?\s*", "", name or "doctor", flags=re.I).lower()
    base = unicodedata.normalize("NFKD", base)
    base = re.sub(r"[̀-ͯ]", "", base)
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")[:60]
    base = f"dr-{base}" if base else "dr-doctor"
    slug, i = base, 2
    while True:
        clash = await db.query_one(
            "select id from doctors where slug = $1 and ($2::uuid is null or id <> $2::uuid)",
            slug, exclude_id,
        )
        if clash is None:
            return slug
        slug = f"{base}-{i}"
        i += 1


# ── Public list (carousels, find-doctor) ────────────────────────────────────
@router.get("")
async def list_doctors(specialty: str | None = None, limit: int | None = None):
    lim = limit if isinstance(limit, int) and limit > 0 else None
    key = f"{specialty or ''}|{lim or ''}"
    body = _cache_get(key)
    if body is None:
        if specialty:
            doctors = await db.query(
                f"select {CARD_COLS} from doctors"
                " where is_active and specialties @> ARRAY[$1]::text[]"
                " order by sort_order desc, name_en asc limit $2",
                specialty, lim or 16,
            )
        else:
            doctors = await db.query(
                f"select {CARD_COLS} from doctors where is_active order by sort_order desc, name_en asc"
            )
        body = {"doctors": doctors}
        _cache_put(key, body)
    return JSONResponse(body, headers={"Cache-Control": "public, max-age=300"})


# ── Admin surfaces ──────────────────────────────────────────────────────────
@router.get("/manage")
async def manage_list(_: CurrentUser = Depends(require_roles(*DOCTOR_ROLES))):
    doctors = await db.query(
        f"select {CARD_COLS}, email from doctors order by sort_order desc, name_en asc"
    )
    return {"doctors": doctors}


@router.post("")
async def create_doctor(request: Request, _: CurrentUser = Depends(require_roles(*DOCTOR_ROLES))):
    b = await request.json()
    name_en = _str(b.get("name_en"))
    if not name_en:
        raise HTTPException(status_code=400, detail="English name is required")

    cols = ["slug", "name_en", *TEXT_COLS, *ARRAY_COLS, "is_active", "sort_order"]
    vals = [
        await _unique_slug(name_en), name_en,
        *(_str(b.get(c)) for c in TEXT_COLS),
        *(_arr(b.get(c)) for c in ARRAY_COLS),
        b.get("is_active") is not False, int(b.get("sort_order") or 0),
    ]
    placeholders = ", ".join(
        f"${i}::text[]" if c in ARRAY_COLS else f"${i}" for i, c in enumerate(cols, 1)
    )
    doctor = await db.query_one(
        f"insert into doctors ({', '.join(cols)}) values ({placeholders}) returning *", *vals
    )
    _cache.clear()
    return {"doctor": doctor}


@router.patch("/{doctor_id}")
async def update_doctor(doctor_id: str, request: Request, _: CurrentUser = Depends(require_roles(*DOCTOR_ROLES))):
    b = await request.json()
    sets: list[str] = []
    vals: list[Any] = []

    def set_col(col: str, val: Any, cast: str = "") -> None:
        vals.append(val)
        sets.append(f"{col} = ${len(vals)}{cast}")

    if "name_en" in b:
        n = _str(b.get("name_en"))
        if not n:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        set_col("name_en", n)
    for col in TEXT_COLS:
        if col in b:
            set_col(col, _str(b.get(col)))
    if "is_active" in b:
        set_col("is_active", bool(b["is_active"]))
    if "sort_order" in b:
        set_col("sort_order", int(b.get("sort_order") or 0))
    for col in ARRAY_COLS:
        if col in b:
            set_col(col, _arr(b.get(col)), "::text[]")

    if not sets:
        raise HTTPException(status_code=400, detail="Nothing to update")

    sets.append("updated_at = now()")
    vals.append(doctor_id)
    doctor = await db.query_one(
        f"update doctors set {', '.join(sets)} where id = ${len(vals)}::uuid returning *", *vals
    )
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    _cache.clear()
    return {"doctor": doctor}


@router.delete("/{doctor_id}")
async def delete_doctor(doctor_id: str, _: CurrentUser = Depends(require_roles(*DOCTOR_ROLES))):
    await db.execute("delete from doctors where id = $1::uuid", doctor_id)
    _cache.clear()
    return {"success": True}


# ── Photo upload ────────────────────────────────────────────────────────────
@router.post("/upload")
async def upload_photo(file: UploadFile, _: CurrentUser = Depends(require_roles(*DOCTOR_ROLES))):
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    contents = await file.read()
    if len(contents) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 8 MB")

    safe = re.sub(r"[^a-zA-Z0-9.]+", "-", file.filename or "photo").lower()
    dest_dir = Path(settings.uploads_dir) / "doctors"
    dest_dir.mkdir(parents=True, exist_ok=True)
    name = f"{int(time.time() * 1000)}-{safe}"
    (dest_dir / name).write_bytes(contents)
    return {"url": f"/api/uploads/doctors/{name}"}
