# Deployment

Four Docker services, orchestrated by `docker-compose.yml` — the database is
self-hosted on the server, no external database service required. The admin
dashboard lives on its own subdomain (**portal.myclinic.com.sa**) served by a
dedicated container:

```
  myclinicsa.com.sa ──────► ┌────────────────────────────┐
        │ nginx (SSL)       │ web    (Next.js, :3000)    │──┐
        │                   └────────────────────────────┘  │ /api/* rewrite
  portal.myclinic.com.sa ─► ┌────────────────────────────┐  │
                            │ portal (Next.js, :3001)    │──┤
                            └────────────────────────────┘  │
                            ┌───────────────────────────────▼┐  ┌──────────────────┐
                            │ backend (FastAPI, :8020)       │─►│ db (Postgres 17) │
                            │  auth · leads CRM · team ·     │  │  pgdata volume   │
                            │  doctors · UTM · content CMS   │  └──────────────────┘
                            │  /app/uploads volume           │
                            └────────────────────────────────┘
```

`web` and `portal` run the **same image** in different modes: the portal
serves the dashboard (`/` → `/dashboard`, responses noindexed), while the main
site redirects any `/login` / `/dashboard` hit to `PORTAL_URL`. All published
ports bind to 127.0.0.1 only — nginx is the sole public entry point.

Two named volumes persist across deploys: `pgdata` (the database) and
`uploads` (uploaded images). **Never run `docker compose down -v`** — it
deletes both.

## Server prerequisites (Ubuntu 22.04/24.04)

```bash
sudo apt-get update && sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh          # Docker Engine + compose plugin
sudo usermod -aG docker $USER && newgrp docker
```

## First-time setup

```bash
sudo mkdir -p /opt/myclinic && sudo chown $USER /opt/myclinic
git clone https://github.com/mounirbennassar/myclinicmainwebsite.git /opt/myclinic
cd /opt/myclinic
cp .env.example .env && nano .env    # set POSTGRES_PASSWORD, DATABASE_URL(s), JWT_SECRET, ANANTYA_*
docker compose up -d --wait db       # start the database first
# (optional) import existing data — see "Migrating data" below
docker compose up -d --build         # build + start everything (~5–10 min first time)
curl -s http://127.0.0.1:3000/api/health   # → {"ok":true}
```

Schema migrations run automatically on every backend start (idempotent), so a
fresh empty database bootstraps itself.

> **Why the db must be up before building:** `next build` pre-renders the
> doctor pages from the database. The web image build runs with host
> networking and reaches Postgres through the loopback-published port
> (`DATABASE_URL_BUILD` in `.env`).

## Migrating data from another Postgres (e.g. the old Neon database)

One command, runs inside the db container (no client tools needed on the host):

```bash
docker compose exec -T db sh -c \
  "pg_dump '<SOURCE_DATABASE_URL>' --no-owner --no-privileges | psql -q -U myclinic -d myclinic"
```

Then rebuild the web image so the statically generated doctor pages pick up
the imported data: `docker compose up -d --build`.

## Automatic deploys (GitHub Actions)

Every push to `main` triggers `.github/workflows/deploy.yml`, which SSHes into
the server, `git reset --hard origin/main`, ensures the db is up, rebuilds,
and health-checks the result.

One-time setup — add repository secrets (GitHub → Settings → Secrets and
variables → Actions):

| Secret           | Value                                             |
|------------------|---------------------------------------------------|
| `DEPLOY_HOST`    | server IP / hostname                              |
| `DEPLOY_USER`    | SSH user that owns `/opt/myclinic`                |
| `DEPLOY_SSH_KEY` | private key (generate: `ssh-keygen -t ed25519`)   |
| `DEPLOY_PORT`    | optional, defaults to 22                          |
| `DEPLOY_PATH`    | optional, defaults to `/opt/myclinic`             |

Put the matching public key in the server's `~/.ssh/authorized_keys`.

## Reverse proxy (nginx + SSL)

DNS: point both the main domain and the `portal.` subdomain at the server.

```nginx
# Main website → web container
server {
    server_name myclinicsa.com.sa www.myclinicsa.com.sa;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Dashboard portal → portal container
server {
    server_name portal.myclinic.com.sa;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10m;   # dashboard image uploads go up to 8 MB
    }
}
```

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo certbot --nginx -d myclinicsa.com.sa -d www.myclinicsa.com.sa -d portal.myclinic.com.sa
```

## Day-2 operations

```bash
cd /opt/myclinic
docker compose ps                        # status
docker compose logs -f web|backend|db    # logs
docker compose up -d --build             # manual deploy
docker compose restart backend           # restart one service

# Nightly-worthy backups:
docker compose exec -T db pg_dump -U myclinic myclinic | gzip > db-$(date +%F).sql.gz
docker run --rm -v myclinic_uploads:/u -v $PWD:/backup alpine \
  tar czf /backup/uploads-$(date +%F).tgz -C /u .

# Restore a database backup:
gunzip -c db-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -q -U myclinic -d myclinic
```

Invariants: `JWT_SECRET` must never change between deploys (it logs out every
dashboard user); `POSTGRES_PASSWORD` must match the `DATABASE_URL`s in `.env`;
the `pgdata` and `uploads` volumes must never be deleted.
