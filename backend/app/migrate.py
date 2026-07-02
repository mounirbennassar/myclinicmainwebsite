"""Run the SQL files in backend/sql/ in order: python -m app.migrate

Every migration is written to be idempotent, so re-running the whole set is
safe. There is intentionally no migrations table — this matches how the
project's earlier .mjs migration scripts worked.
"""
import asyncio
from pathlib import Path

import asyncpg

from .db import _normalized_dsn, ssl_context

SQL_DIR = Path(__file__).resolve().parent.parent / "sql"


async def main() -> None:
    conn = await asyncpg.connect(dsn=_normalized_dsn(), ssl=ssl_context(), statement_cache_size=0)
    try:
        for path in sorted(SQL_DIR.glob("*.sql")):
            print(f"→ {path.name}")
            await conn.execute(path.read_text())
        print("✓ migrations applied")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
