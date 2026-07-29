"""Purge the Next.js containers' ISR caches after a CMS mutation.

The public blog/news pages are pre-rendered by the `web` and `portal`
containers, each holding its own .next cache; without this, a published or
edited post stayed invisible for up to 300s (their ISR timer). Mirrors
app/lib/revalidation.ts: POST /api/revalidate on every peer with the shared
secret. Peers come from REVALIDATE_PEERS (docker-compose.yml); locally it is
unset and this is a no-op.

Failures are logged, never raised — a Next container being down must degrade
to "stale for ≤300s there", not fail the editor's save.
"""
import asyncio
import logging

import httpx

from .config import settings

log = logging.getLogger(__name__)


def _peers() -> list[str]:
    return [p.strip().rstrip("/") for p in settings.revalidate_peers.split(",") if p.strip()]


async def purge_next_cache(paths: list[str] | None = None) -> None:
    peers = _peers()
    key = settings.revalidate_secret or settings.jwt_secret
    if not peers or not key:
        return

    async def _hit(client: httpx.AsyncClient, origin: str) -> None:
        try:
            res = await client.post(
                f"{origin}/api/revalidate",
                json={"paths": paths or []},
                headers={"x-revalidate-key": key},
            )
            if res.status_code != 200:
                log.warning("revalidate peer %s answered %s", origin, res.status_code)
        except httpx.HTTPError as exc:
            log.warning("revalidate peer %s unreachable: %s", origin, exc)

    async with httpx.AsyncClient(timeout=3.0) as client:
        await asyncio.gather(*(_hit(client, origin) for origin in peers))
