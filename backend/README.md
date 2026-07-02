# MyClinic Backend (FastAPI)

Python backend serving every `/api/*` route for the Next.js site + dashboard.
The Next.js app rewrites `/api/:path*` to this service (see `next.config.ts`),
so browsers only ever talk to the Next origin — cookies just work.

## Stack

- **FastAPI + uvicorn** — API server (`app/main.py`)
- **asyncpg** — Neon Postgres (same `DATABASE_URL` as before)
- **PyJWT + bcrypt** — session cookies byte-compatible with the old Next.js
  auth (same `JWT_SECRET`, cookie `session`), so existing logins keep working

## Setup

```bash
cd backend
uv venv && uv pip install -r requirements.txt   # or: python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

Config is read from the repo root `.env.local` (shared with Next.js:
`DATABASE_URL`, `JWT_SECRET`, `ANANTYA_*`), then `backend/.env` for overrides.

## Run

```bash
.venv/bin/python -m app.migrate                          # apply sql/ migrations (idempotent)
.venv/bin/uvicorn app.main:app --port 8020 --reload      # dev server
```

API docs: http://127.0.0.1:8020/api/docs

## Roles

| Role              | Access                                                        |
|-------------------|---------------------------------------------------------------|
| `super_admin`     | Everything, all cities                                        |
| `admin`           | Leads, reports, UTM, doctors, team, content — city-scoped     |
| `marketing`       | Leads + CRM staging (view/status), reports, UTM — city-scoped |
| `content_manager` | Pages, blog, news CMS only                                    |
| `agent`           | Only leads assigned to them                                   |

## Layout

```
app/
  main.py        FastAPI app, error shape, static /api/uploads
  config.py      pydantic-settings (.env.local + backend/.env)
  db.py          asyncpg pool + row→JSON helpers
  security.py    JWT/bcrypt, get_current_user, role guards
  migrate.py     python -m app.migrate → runs sql/*.sql in order
  routers/
    auth.py      /api/auth/{login,logout,me}
    leads.py     /api/appointments — the CRM pipeline
    team.py      /api/team — member CRUD, role assignment
    doctors.py   /api/doctors — public list + CRUD + photo upload
    utm.py       /api/utm — short links, click tracking, attribution
    content.py   /api/content — posts (blog/news), pages, uploads
    whatsapp.py  /api/whatsapp — Anantya.ai proxy
sql/             idempotent migrations (001 baseline, 002 roles + CMS)
uploads/         uploaded images (gitignored), served at /api/uploads/*
```

## Production

Run under any process manager, e.g.:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8020 --workers 2
```

and set `BACKEND_ORIGIN=http://127.0.0.1:8020` in the Next.js environment so
the rewrite targets it. Persist `backend/uploads/` (volume) across deploys.
