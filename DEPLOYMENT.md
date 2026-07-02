# Deployment

Two Docker services, orchestrated by `docker-compose.yml`:

```
                        ┌────────────────────────────┐
  internet ── nginx ──► │ web (Next.js, port 3000)   │
              (SSL)     │  · site + dashboard UI     │
                        │  · rewrites /api/* ──────┐ │
                        └──────────────────────────┼─┘
                        ┌──────────────────────────▼─┐
                        │ backend (FastAPI, :8020)   │──► Neon Postgres (cloud)
                        │  · auth, leads CRM, team,  │
                        │    doctors, UTM, content   │
                        │  · /app/uploads volume     │
                        └────────────────────────────┘
```

Only port 3000 is published; the backend is reachable exclusively through the
web container's `/api/*` rewrite. Uploaded images persist in the `uploads`
named volume.

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
cp .env.example .env && nano .env    # fill in DATABASE_URL, JWT_SECRET, ANANTYA_*
docker compose up -d --build         # first build takes ~5–10 min
curl -s http://127.0.0.1:3000/api/health   # → {"ok":true}
```

Database migrations run automatically on every backend start (idempotent).

## Automatic deploys (GitHub Actions)

Every push to `main` triggers `.github/workflows/deploy.yml`, which SSHes into
the server, `git reset --hard origin/main`, `docker compose up -d --build`,
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

```nginx
server {
    server_name example.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10m;   # image uploads go up to 8 MB
    }
}
```

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

## Day-2 operations

```bash
cd /opt/myclinic
docker compose ps                        # status
docker compose logs -f web|backend       # logs
docker compose up -d --build             # manual deploy
docker compose restart backend           # restart one service
docker run --rm -v myclinic_uploads:/u -v $PWD:/backup alpine \
  tar czf /backup/uploads-$(date +%F).tgz -C /u .   # back up uploaded images
```

`JWT_SECRET` must never change between deploys (it invalidates all dashboard
sessions), and the `uploads` volume must never be removed (`docker compose
down -v` would delete uploaded images).
