from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .. import db
from ..config import settings
from ..security import (
    CurrentUser,
    clear_session_cookie,
    compare_password,
    get_current_user,
    roles_of,
    set_session_cookie,
    sign_token,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginBody(BaseModel):
    email: str = ""
    password: str = ""


@router.post("/login")
async def login(body: LoginBody):
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    email = body.email.strip().lower()
    if not email.endswith("@myclinic.com.sa") and email not in settings.email_exceptions:
        raise HTTPException(status_code=400, detail="Only @myclinic.com.sa emails are allowed")

    user = await db.query_one("select * from team_members where email = $1", email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.get("is_active"):
        raise HTTPException(status_code=401, detail="Account is deactivated")
    if not compare_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = sign_token(user)
    res = JSONResponse(
        {
            "success": True,
            # The login page picks a landing route from these — see homeRoute().
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "roles": roles_of(user),
            },
        }
    )
    set_session_cookie(res, token)
    return res


@router.post("/logout")
async def logout():
    res = JSONResponse({"success": True})
    clear_session_cookie(res)
    return res


@router.get("/me")
async def me(user: CurrentUser = Depends(get_current_user)):
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "roles": user.roles,
            "allowed_cities": user.allowed_cities,
            "is_active": user.is_active,
            "can_export": user.can_export,
        }
    }
