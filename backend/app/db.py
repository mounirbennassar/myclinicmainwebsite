"""asyncpg pool against Neon Postgres.

Neon's pooled DSNs carry query params (sslmode, channel_binding) that asyncpg
doesn't accept, so the DSN is normalized here and SSL is forced explicitly.
statement_cache_size=0 keeps prepared statements out of pgbouncer's way.
"""
import ssl
from datetime import date, datetime
from typing import Any
from urllib.parse import urlsplit, urlunsplit
from uuid import UUID

import asyncpg
import certifi

from .config import settings

_pool: asyncpg.Pool | None = None


def ssl_context() -> ssl.SSLContext:
    # certifi's bundle: python.org macOS builds don't ship system CA certs.
    return ssl.create_default_context(cafile=certifi.where())


def _normalized_dsn() -> str:
    url = settings.database_url
    if not url:
        raise RuntimeError("DATABASE_URL is not set (backend/.env or ../.env.local)")
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))


async def init_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        ctx = ssl_context()
        _pool = await asyncpg.create_pool(
            dsn=_normalized_dsn(),
            ssl=ctx,
            min_size=1,
            max_size=5,
            statement_cache_size=0,
            command_timeout=30,
        )
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


def pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("DB pool not initialized")
    return _pool


def _jsonable(v: Any) -> Any:
    if isinstance(v, UUID):
        return str(v)
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    if isinstance(v, list):
        return [_jsonable(x) for x in v]
    return v


def row_dict(row: asyncpg.Record) -> dict[str, Any]:
    return {k: _jsonable(v) for k, v in dict(row).items()}


async def query(text: str, *params: Any) -> list[dict[str, Any]]:
    rows = await pool().fetch(text, *params)
    return [row_dict(r) for r in rows]


async def query_one(text: str, *params: Any) -> dict[str, Any] | None:
    row = await pool().fetchrow(text, *params)
    return row_dict(row) if row is not None else None


async def execute(text: str, *params: Any) -> str:
    return await pool().execute(text, *params)
