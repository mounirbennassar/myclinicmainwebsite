"""Thin authenticated proxy over the Anantya.ai WhatsApp Business API.
Keeps the API key server-side; mirrors the old /api/whatsapp/* routes."""
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from ..config import settings
from ..security import ADMIN_ROLES, CurrentUser, require_roles

router = APIRouter(
    prefix="/api/whatsapp",
    tags=["whatsapp"],
    dependencies=[Depends(require_roles(*ADMIN_ROLES))],
)


async def _anantya(
    path: str,
    method: str = "GET",
    query: dict[str, Any] | None = None,
    json_body: Any | None = None,
    files: Any | None = None,
    data: Any | None = None,
) -> JSONResponse:
    if not settings.anantya_api_key:
        raise HTTPException(status_code=503, detail="ANANTYA_API_KEY is not configured")

    params = {k: v for k, v in (query or {}).items() if v not in (None, "")}
    async with httpx.AsyncClient(base_url=settings.anantya_base_url, timeout=30) as client:
        res = await client.request(
            method,
            path,
            params=params,
            json=json_body,
            files=files,
            data=data,
            headers={"X-API-Key": settings.anantya_api_key, "accept": "application/json"},
        )
    try:
        payload = res.json()
    except Exception:
        payload = None
    body = {"ok": res.is_success, "status": res.status_code, "data": payload, "raw": res.text}
    return JSONResponse(body, status_code=200 if res.is_success else 502)


@router.get("/templates")
async def templates():
    return await _anantya("/api/Campaign/GetTemplates")


@router.post("/campaign-history")
async def campaign_history():
    return await _anantya("/api/Campaign/GetCampaignHistory", method="POST", json_body={})


@router.get("/contact-exist")
async def contact_exist(contactNo: str):
    return await _anantya("/api/Contacts/contactexist", query={"contactNo": contactNo})


@router.get("/contacts")
async def contacts(channelName: str, id: int = 0):
    return await _anantya("/api/Contacts/getcontacts", query={"channelName": channelName, "id": id})


@router.get("/messages")
async def messages(contactNo: str, channelName: str, id: int = 0):
    return await _anantya(
        "/api/Messages/getmessages", query={"contactNo": contactNo, "channelName": channelName, "id": id}
    )


@router.get("/message-status")
async def message_status(msgId: int):
    return await _anantya("/api/Messages/getStatus", query={"msgId": msgId})


@router.post("/send-text")
async def send_text(request: Request):
    body = await request.json()
    contact_no = (body.get("contactNo") or "").strip()
    msg_text = body.get("msgText")
    if not contact_no or not msg_text:
        raise HTTPException(status_code=400, detail="contactNo and msgText are required")
    return await _anantya(
        "/api/Messages/sendtext", method="POST", json_body={"contactNo": contact_no, "msgText": msg_text}
    )


@router.post("/send-template")
async def send_template(request: Request):
    # Accepts JSON { templateId, contactNo, contactName, attribute1..13 } and
    # converts it to the multipart form Anantya expects, templateId in query.
    body = await request.json()
    try:
        template_id = int(body.get("templateId"))
    except (TypeError, ValueError):
        template_id = 0
    contact_no = (body.get("contactNo") or "").strip()
    if not template_id or not contact_no:
        raise HTTPException(status_code=400, detail="templateId and contactNo are required")

    data: dict[str, str] = {"ContactNo": contact_no}
    contact_name = (body.get("contactName") or "").strip()
    if contact_name:
        data["ContactName"] = contact_name
    if body.get("extraParams"):
        data["ExtraParams"] = str(body["extraParams"])
    for i in range(1, 14):
        value = body.get(f"attribute{i}")
        if value not in (None, ""):
            data[f"Attribute{i}"] = str(value)

    return await _anantya(
        "/api/Campaign/SendSingleTemplateMessage",
        method="POST",
        query={"templateId": template_id},
        data=data,
    )
