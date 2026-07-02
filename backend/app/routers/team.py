"""Team management. super_admin sees/manages everyone; admins are isolated to
members whose allowed_cities overlap their own scope and can never touch
super_admins."""
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request

from .. import db
from ..security import (
    ADMIN_ROLES,
    ROLES,
    CurrentUser,
    generate_password,
    hash_password,
    invalidate_user_cache,
    require_roles,
)

router = APIRouter(prefix="/api/team", tags=["team"])

MEMBER_COLS = "id, email, name, role, allowed_cities, is_active, can_export, created_at"


@router.get("")
async def list_team(user: CurrentUser = Depends(require_roles(*ADMIN_ROLES))):
    if user.role == "super_admin":
        data = await db.query(f"select {MEMBER_COLS} from team_members order by created_at desc")
        return {"data": data}

    if not user.allowed_cities:
        return {"data": []}
    data = await db.query(
        f"select {MEMBER_COLS} from team_members where allowed_cities && $1::text[] order by created_at desc",
        user.allowed_cities,
    )
    return {"data": data}


@router.post("")
async def create_member(request: Request, user: CurrentUser = Depends(require_roles(*ADMIN_ROLES))):
    body = await request.json()
    email, name = body.get("email"), body.get("name")
    allowed_cities = body.get("allowed_cities") or []
    member_role = body.get("memberRole", "agent")
    can_export = bool(body.get("can_export", False))

    if not email or not name:
        raise HTTPException(status_code=400, detail="Email and name are required")

    if user.role != "super_admin":
        if member_role == "super_admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        if isinstance(allowed_cities, list) and any(c not in user.allowed_cities for c in allowed_cities):
            raise HTTPException(status_code=403, detail="Cannot assign cities outside your scope")

    email = email.strip().lower()
    if not email.endswith("@myclinic.com.sa"):
        raise HTTPException(status_code=400, detail="Only @myclinic.com.sa emails are allowed")

    existing = await db.query_one("select id from team_members where email = $1", email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already exists")

    password = generate_password()
    final_role = member_role if member_role in ROLES else "agent"

    created = await db.query_one(
        "insert into team_members (email, name, password_hash, role, allowed_cities, can_export, is_active)"
        " values ($1, $2, $3, $4, $5::text[], $6, true)"
        f" returning {MEMBER_COLS}",
        email, name, hash_password(password), final_role, allowed_cities, can_export,
    )
    return {"user": created, "generated_password": password}


@router.patch("/{member_id}")
async def update_member(member_id: str, request: Request, user: CurrentUser = Depends(require_roles(*ADMIN_ROLES))):
    body = await request.json()

    if user.role != "super_admin":
        target = await db.query_one(
            "select allowed_cities, role from team_members where id = $1::uuid", member_id
        )
        if target is None or target["role"] == "super_admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        target_cities = target.get("allowed_cities") or []
        if not any(c in user.allowed_cities for c in target_cities):
            raise HTTPException(status_code=403, detail="Forbidden")
        cities = body.get("allowed_cities")
        if isinstance(cities, list) and any(c not in user.allowed_cities for c in cities):
            raise HTTPException(status_code=403, detail="Cannot assign cities outside your scope")

    sets: list[str] = ["updated_at = now()"]
    vals: list[Any] = []

    def set_col(col: str, val: Any, cast: str = "") -> None:
        vals.append(val)
        sets.append(f"{col} = ${len(vals)}{cast}")

    if "name" in body:
        set_col("name", body["name"])
    if "allowed_cities" in body:
        set_col("allowed_cities", body["allowed_cities"], "::text[]")
    if "is_active" in body:
        set_col("is_active", bool(body["is_active"]))
    if "memberRole" in body:
        if body["memberRole"] not in ROLES:
            raise HTTPException(status_code=400, detail="Invalid role")
        set_col("role", body["memberRole"])
    if "can_export" in body:
        set_col("can_export", bool(body["can_export"]))

    new_password: str | None = None
    if body.get("reset_password"):
        new_password = generate_password()
        set_col("password_hash", hash_password(new_password))

    vals.append(member_id)
    await db.execute(
        f"update team_members set {', '.join(sets)} where id = ${len(vals)}::uuid", *vals
    )
    invalidate_user_cache(member_id)

    out: dict[str, Any] = {"success": True}
    if new_password:
        out["generated_password"] = new_password
    return out


@router.delete("/{member_id}")
async def delete_member(member_id: str, user: CurrentUser = Depends(require_roles("super_admin"))):
    if member_id == user.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    await db.execute("delete from team_members where id = $1::uuid", member_id)
    invalidate_user_cache(member_id)
    return {"success": True}
