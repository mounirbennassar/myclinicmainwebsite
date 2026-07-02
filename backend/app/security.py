"""Auth: JWT session cookie + bcrypt passwords + role guards.

Token format is byte-compatible with the previous Next.js implementation
(jose HS256, cookie name "session", 7-day expiry, same claim set), so sessions
issued by either side keep working during/after the migration.

Like the old proxy.ts, every authenticated request re-resolves the user from
the DB (with a short TTL cache) so role/city/deactivation edits made by a
super admin take effect on the next request without re-login.
"""
import secrets
import time
from dataclasses import dataclass, field
from typing import Any

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request, Response

from .config import settings
from . import db

COOKIE_NAME = "session"
JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60

ROLES = ("super_admin", "admin", "agent", "marketing", "content_manager")

ROLE_LABELS = {
    "super_admin": "Super Admin",
    "admin": "Admin",
    "agent": "Agent",
    "marketing": "Marketing",
    "content_manager": "Content Manager",
}

# Roles allowed to manage site content (pages / blog / news).
CONTENT_ROLES = ("super_admin", "admin", "content_manager")
# Roles allowed to see the lead pipeline (agents see only their assignments).
LEAD_VIEW_ROLES = ("super_admin", "admin", "marketing", "agent")
# Roles allowed on UTM links + reports surfaces.
MARKETING_ROLES = ("super_admin", "admin", "marketing")
# Roles allowed to administer team / doctors / WhatsApp.
ADMIN_ROLES = ("super_admin", "admin")


@dataclass
class CurrentUser:
    id: str
    email: str
    name: str
    role: str
    allowed_cities: list[str] = field(default_factory=list)
    is_active: bool = True
    can_export: bool = False

    @property
    def role_label(self) -> str:
        return ROLE_LABELS.get(self.role, self.role)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=10)).decode()


def compare_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except ValueError:
        return False


def generate_password(length: int = 12) -> str:
    chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    return "".join(chars[b % len(chars)] for b in secrets.token_bytes(length))


def sign_token(user: dict[str, Any]) -> str:
    now = int(time.time())
    can_export = True if user["role"] in ("super_admin", "admin") else bool(user.get("can_export"))
    payload = {
        "sub": str(user["id"]),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "allowed_cities": user.get("allowed_cities") or [],
        "can_export": can_export,
        "iat": now,
        "exp": now + JWT_EXPIRY_SECONDS,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def verify_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        COOKIE_NAME,
        token,
        max_age=JWT_EXPIRY_SECONDS,
        httponly=True,
        samesite="lax",
        path="/",
        # The cookie rides on the Next.js origin (API is same-origin via
        # rewrite); `secure` is safe to set unconditionally except on
        # plain-http localhost, where browsers still accept it for localhost.
        secure=False,
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/")


# ── Fresh-user cache (mirrors proxy.ts's 5s TTL) ───────────────────────────
_user_cache: dict[str, tuple[float, dict[str, Any]]] = {}
_CACHE_TTL = 5.0


async def _fetch_fresh_user(user_id: str) -> dict[str, Any] | None:
    hit = _user_cache.get(user_id)
    if hit and hit[0] > time.monotonic():
        return hit[1]
    row = await db.query_one(
        "select id, email, name, role, allowed_cities, is_active, can_export"
        " from team_members where id = $1::uuid",
        user_id,
    )
    if row is None:
        return None
    _user_cache[user_id] = (time.monotonic() + _CACHE_TTL, row)
    return row


def invalidate_user_cache(user_id: str | None = None) -> None:
    if user_id is None:
        _user_cache.clear()
    else:
        _user_cache.pop(user_id, None)


async def get_current_user(request: Request) -> CurrentUser:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    payload = verify_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = str(payload["sub"])
    try:
        fresh = await _fetch_fresh_user(user_id)
    except Exception:
        # DB hiccup — degrade to JWT claims like the old proxy did.
        fresh = None
    else:
        # Lookup worked but the account is gone: a deleted user must not keep
        # riding a still-valid token (the old proxy allowed this; we don't).
        if fresh is None:
            raise HTTPException(status_code=401, detail="Unauthorized")

    if fresh is not None:
        if not fresh.get("is_active"):
            raise HTTPException(status_code=401, detail="Unauthorized")
        role = fresh["role"]
        return CurrentUser(
            id=user_id,
            email=fresh["email"],
            name=fresh["name"],
            role=role,
            allowed_cities=fresh.get("allowed_cities") or [],
            is_active=True,
            can_export=True if role in ("super_admin", "admin") else bool(fresh.get("can_export")),
        )

    return CurrentUser(
        id=user_id,
        email=str(payload.get("email") or ""),
        name=str(payload.get("name") or ""),
        role=str(payload.get("role") or "agent"),
        allowed_cities=list(payload.get("allowed_cities") or []),
        can_export=bool(payload.get("can_export")),
    )


def require_roles(*roles: str):
    async def dep(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user

    return dep
