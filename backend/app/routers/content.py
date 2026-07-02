"""Content CMS — blog + news posts and editable site pages.

Managed by super_admin / admin / content_manager. Public read endpoints serve
the Next.js site (published content only, cacheable)."""
import re
import time
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from .. import db
from ..config import settings
from ..security import CONTENT_ROLES, CurrentUser, require_roles

router = APIRouter(prefix="/api/content", tags=["content"])

POST_TYPES = ("blog", "news")
POST_STATUSES = ("draft", "published", "archived")
PAGE_STATUSES = ("draft", "published")

POST_COLS = (
    "id, type, slug, title_en, title_ar, excerpt_en, excerpt_ar, body_en, body_ar,"
    " cover_image_url, tags, status, published_at, author_id, author_name, created_at, updated_at"
)
PAGE_COLS = (
    "id, slug, title_en, title_ar, body_en, body_ar, meta_description, status,"
    " updated_by, created_at, updated_at"
)


def _str(v: Any) -> str | None:
    return v.strip() if isinstance(v, str) and v.strip() else None


def _arr(v: Any) -> list[str]:
    return [x.strip() for x in v if isinstance(x, str) and x.strip()] if isinstance(v, list) else []


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower().strip()).strip("-")[:80]
    return slug or "untitled"


async def _unique_slug(table: str, desired: str, exclude_id: str | None = None) -> str:
    base = _slugify(desired)
    slug, i = base, 2
    while True:
        clash = await db.query_one(
            f"select id from {table} where slug = $1 and ($2::uuid is null or id <> $2::uuid)",
            slug, exclude_id,
        )
        if clash is None:
            return slug
        slug = f"{base}-{i}"
        i += 1


# ═══ Public read endpoints (used by the Next.js site) ═══════════════════════
@router.get("/public/posts")
async def public_posts(type: str = "blog", limit: int = 50, offset: int = 0):
    if type not in POST_TYPES:
        raise HTTPException(status_code=400, detail="Invalid type")
    limit = max(1, min(limit, 100))
    posts = await db.query(
        "select id, type, slug, title_en, title_ar, excerpt_en, excerpt_ar, cover_image_url,"
        " tags, published_at, author_name from posts"
        " where type = $1 and status = 'published'"
        " order by published_at desc nulls last, created_at desc limit $2 offset $3",
        type, limit, max(0, offset),
    )
    return JSONResponse({"posts": posts}, headers={"Cache-Control": "public, max-age=300"})


@router.get("/public/posts/{slug}")
async def public_post(slug: str):
    post = await db.query_one(
        f"select {POST_COLS} from posts where slug = $1 and status = 'published'", slug
    )
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return JSONResponse({"post": post}, headers={"Cache-Control": "public, max-age=300"})


@router.get("/public/pages/{slug}")
async def public_page(slug: str):
    page = await db.query_one(
        f"select {PAGE_COLS} from site_pages where slug = $1 and status = 'published'", slug
    )
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return JSONResponse({"page": page}, headers={"Cache-Control": "public, max-age=300"})


# ═══ Posts management (blog + news) ═════════════════════════════════════════
@router.get("/posts")
async def list_posts(type: str | None = None, status: str | None = None,
                     _: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    conds: list[str] = []
    params: list[Any] = []
    if type in POST_TYPES:
        params.append(type)
        conds.append(f"type = ${len(params)}")
    if status in POST_STATUSES:
        params.append(status)
        conds.append(f"status = ${len(params)}")
    where = f"where {' and '.join(conds)}" if conds else ""
    posts = await db.query(
        f"select {POST_COLS} from posts {where} order by created_at desc", *params
    )
    return {"data": posts}


@router.post("/posts")
async def create_post(request: Request, user: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    b = await request.json()
    post_type = b.get("type")
    title_en = _str(b.get("title_en"))
    if post_type not in POST_TYPES:
        raise HTTPException(status_code=400, detail="type must be 'blog' or 'news'")
    if not title_en:
        raise HTTPException(status_code=400, detail="English title is required")

    status = b.get("status") if b.get("status") in POST_STATUSES else "draft"
    slug = await _unique_slug("posts", _str(b.get("slug")) or title_en)

    post = await db.query_one(
        "insert into posts (type, slug, title_en, title_ar, excerpt_en, excerpt_ar, body_en, body_ar,"
        " cover_image_url, tags, status, published_at, author_id, author_name)"
        " values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::text[],$11,"
        " case when $11 = 'published' then now() else null end, $12::uuid, $13)"
        f" returning {POST_COLS}",
        post_type, slug, title_en, _str(b.get("title_ar")), _str(b.get("excerpt_en")),
        _str(b.get("excerpt_ar")), _str(b.get("body_en")), _str(b.get("body_ar")),
        _str(b.get("cover_image_url")), _arr(b.get("tags")), status, user.id, user.name,
    )
    return {"post": post}


@router.patch("/posts/{post_id}")
async def update_post(post_id: str, request: Request,
                      user: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    b = await request.json()
    existing = await db.query_one("select id, slug, status from posts where id = $1::uuid", post_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Post not found")

    sets: list[str] = ["updated_at = now()"]
    vals: list[Any] = []

    def set_col(col: str, val: Any, cast: str = "") -> None:
        vals.append(val)
        sets.append(f"{col} = ${len(vals)}{cast}")

    if "title_en" in b:
        t = _str(b.get("title_en"))
        if not t:
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        set_col("title_en", t)
    for col in ("title_ar", "excerpt_en", "excerpt_ar", "body_en", "body_ar", "cover_image_url"):
        if col in b:
            set_col(col, _str(b.get(col)))
    if "tags" in b:
        set_col("tags", _arr(b.get("tags")), "::text[]")
    if "type" in b:
        if b["type"] not in POST_TYPES:
            raise HTTPException(status_code=400, detail="Invalid type")
        set_col("type", b["type"])
    if "slug" in b and _str(b.get("slug")):
        set_col("slug", await _unique_slug("posts", str(b["slug"]), exclude_id=post_id))
    if "status" in b:
        if b["status"] not in POST_STATUSES:
            raise HTTPException(status_code=400, detail="Invalid status")
        set_col("status", b["status"])
        # Stamp published_at on the draft → published transition.
        if b["status"] == "published" and existing["status"] != "published":
            sets.append("published_at = coalesce(published_at, now())")

    if len(sets) == 1:
        raise HTTPException(status_code=400, detail="Nothing to update")

    vals.append(post_id)
    post = await db.query_one(
        f"update posts set {', '.join(sets)} where id = ${len(vals)}::uuid returning {POST_COLS}",
        *vals,
    )
    return {"post": post}


@router.delete("/posts/{post_id}")
async def delete_post(post_id: str, _: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    await db.execute("delete from posts where id = $1::uuid", post_id)
    return {"success": True}


# ═══ Site pages management ══════════════════════════════════════════════════
@router.get("/pages")
async def list_pages(_: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    pages = await db.query(f"select {PAGE_COLS} from site_pages order by created_at desc")
    return {"data": pages}


@router.post("/pages")
async def create_page(request: Request, user: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    b = await request.json()
    title_en = _str(b.get("title_en"))
    if not title_en:
        raise HTTPException(status_code=400, detail="English title is required")
    status = b.get("status") if b.get("status") in PAGE_STATUSES else "draft"
    slug = await _unique_slug("site_pages", _str(b.get("slug")) or title_en)

    page = await db.query_one(
        "insert into site_pages (slug, title_en, title_ar, body_en, body_ar, meta_description,"
        " status, updated_by)"
        f" values ($1,$2,$3,$4,$5,$6,$7,$8) returning {PAGE_COLS}",
        slug, title_en, _str(b.get("title_ar")), _str(b.get("body_en")), _str(b.get("body_ar")),
        _str(b.get("meta_description")), status, user.name,
    )
    return {"page": page}


@router.patch("/pages/{page_id}")
async def update_page(page_id: str, request: Request,
                      user: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    b = await request.json()
    sets: list[str] = ["updated_at = now()"]
    vals: list[Any] = []

    def set_col(col: str, val: Any) -> None:
        vals.append(val)
        sets.append(f"{col} = ${len(vals)}")

    if "title_en" in b:
        t = _str(b.get("title_en"))
        if not t:
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        set_col("title_en", t)
    for col in ("title_ar", "body_en", "body_ar", "meta_description"):
        if col in b:
            set_col(col, _str(b.get(col)))
    if "slug" in b and _str(b.get("slug")):
        set_col("slug", await _unique_slug("site_pages", str(b["slug"]), exclude_id=page_id))
    if "status" in b:
        if b["status"] not in PAGE_STATUSES:
            raise HTTPException(status_code=400, detail="Invalid status")
        set_col("status", b["status"])
    set_col("updated_by", user.name)

    vals.append(page_id)
    page = await db.query_one(
        f"update site_pages set {', '.join(sets)} where id = ${len(vals)}::uuid returning {PAGE_COLS}",
        *vals,
    )
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"page": page}


@router.delete("/pages/{page_id}")
async def delete_page(page_id: str, _: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    await db.execute("delete from site_pages where id = $1::uuid", page_id)
    return {"success": True}


# ═══ Image upload (cover images etc.) ═══════════════════════════════════════
@router.post("/upload")
async def upload_image(file: UploadFile, _: CurrentUser = Depends(require_roles(*CONTENT_ROLES))):
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    contents = await file.read()
    if len(contents) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 8 MB")

    safe = re.sub(r"[^a-zA-Z0-9.]+", "-", file.filename or "image").lower()
    dest_dir = Path(settings.uploads_dir) / "content"
    dest_dir.mkdir(parents=True, exist_ok=True)
    name = f"{int(time.time() * 1000)}-{safe}"
    (dest_dir / name).write_bytes(contents)
    return {"url": f"/api/uploads/content/{name}"}
