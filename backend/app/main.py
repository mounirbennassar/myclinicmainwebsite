"""MyClinic backend — FastAPI service behind the Next.js `/api/*` rewrite.

The Next.js app proxies every /api/* request here (same origin, cookies
intact), so route paths intentionally mirror the old Next route handlers.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from . import db
from .config import settings
from .routers import auth, content, doctors, leads, team, utm, whatsapp


# StaticFiles checks the directory at mount time (module import), so create it
# eagerly rather than in the lifespan hook.
settings.uploads_dir.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.init_pool()
    yield
    await db.close_pool()


app = FastAPI(title="MyClinic API", docs_url="/api/docs", openapi_url="/api/openapi.json", lifespan=lifespan)

# Same-origin in production (Next rewrite). CORS only matters when the Next
# dev server and uvicorn are hit directly on different ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The dashboard UI was written against the old Next.js route handlers, which
# reported failures as { "error": "..." } — keep that shape.
@app.exception_handler(StarletteHTTPException)
async def http_error_shape(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse({"error": str(exc.detail)}, status_code=exc.status_code)


app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(team.router)
app.include_router(doctors.router)
app.include_router(utm.router)
app.include_router(content.router)
app.include_router(whatsapp.router)

app.mount("/api/uploads", StaticFiles(directory=settings.uploads_dir), name="uploads")


@app.get("/api/health")
async def health() -> dict:
    return {"ok": True}
