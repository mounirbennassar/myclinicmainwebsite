# MyClinic — Private VM Deployment Guide (10.97.100.10)

**Server:** `appadmin@10.97.100.10` (private IP, empty Ubuntu VM)
**You work from:** a Windows VM inside the same network (PowerShell)
**Repo:** https://github.com/mounirbennassar/myclinicmainwebsite (private, branch `main`)
**Date:** 2026-07-03

---

## 0. How this deployment works (read first)

The VM has a **private IP only**. GitHub's cloud runners (`ubuntu-latest`)
live on the public internet and **can never SSH into 10.97.100.10** — so the
old `deploy.yml` (SSH-from-GitHub) cannot work here.

Instead we install a **self-hosted GitHub Actions runner ON the VM**. The
runner makes *outbound HTTPS* connections to github.com (allowed by the
network), waits for jobs, and runs the deploy locally on the server:

```
you push to main ──► GitHub ──► runner on the VM picks up the job (outbound HTTPS)
                                 └─► cd /opt/myclinic
                                     git pull → docker compose up -d --build
                                     health checks → done ✅
```

The workflow file for this is already in the repo:
`.github/workflows/deploy-vm.yml` (runs on labels `self-hosted, myclinic-vm`).
No SSH keys, no secrets needed — the job already runs on the server.

The stack itself is unchanged from the handover doc: 4 containers
(`web` :3000, `portal` :3001, `backend` :8020 internal, `db` :5432
loopback), all ports bound to 127.0.0.1, nginx as the only public entry.

**Legend for every command block below:**
- 🪟 = run in **PowerShell on the Windows VM**
- 🐧 = run **on the server** (inside the SSH session)

---

## 1. Windows VM — check your tools

Open **PowerShell** (Start → type `powershell`).

```powershell
# 🪟 confirm ssh + scp exist (built into Windows 10/11)
ssh -V
scp
```

If `ssh` is not found: Settings → Apps → Optional Features → Add →
**OpenSSH Client**.

Tip: in PowerShell, **right-click = paste**. You'll paste a lot below.

---

## 2. Connect to the server & sanity checks

```powershell
# 🪟 connect (type the appadmin password when asked)
ssh appadmin@10.97.100.10
```

You are now on the server. Verify basics:

```bash
# 🐧 OS version — should be Ubuntu (24.04 ideally)
lsb_release -a

# 🐧 you can sudo
sudo whoami        # → root

# 🐧 resources: need ≥ 2 GB RAM and ≥ 20 GB free disk
free -h
df -h /

# 🐧 outbound HTTPS to GitHub and Docker Hub works (CRITICAL)
curl -sI https://github.com | head -1          # → HTTP/2 200 (or 301)
curl -sI https://registry-1.docker.io | head -1
```

> ❗ If the `curl` checks fail, stop here — ask the infra team to allow
> outbound HTTPS (443) to github.com, *.githubusercontent.com,
> registry-1.docker.io, auth.docker.io, production.cloudflare.docker.com.
> Nothing below works without it.

(Optional but recommended) make SSH sessions painless with a key:

```powershell
# 🪟 in a SECOND PowerShell window, one-time:
ssh-keygen -t ed25519          # press Enter through the prompts
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh appadmin@10.97.100.10 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
# from now on: ssh appadmin@10.97.100.10 logs in without a password
```

---

## 3. Install Docker + git on the server

```bash
# 🐧
sudo apt-get update && sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Log out and back in so the docker group applies:

```bash
# 🐧
exit
```
```powershell
# 🪟
ssh appadmin@10.97.100.10
```
```bash
# 🐧 verify — must work WITHOUT sudo:
docker version
docker compose version
```

---

## 4. Create a GitHub token for the server (repo is private)

The server needs read access to clone/pull the repo. Do this in a browser
(on the Windows VM or anywhere):

1. GitHub → click your avatar → **Settings** → **Developer settings** →
   **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Fill in:
   - **Token name:** `myclinic-vm-deploy`
   - **Expiration:** 1 year (set a calendar reminder to rotate it!)
   - **Repository access:** *Only select repositories* → `myclinicmainwebsite`
   - **Permissions → Repository permissions → Contents: Read-only**
3. **Generate token** and copy it — it looks like `github_pat_XXXX...`.
   You will paste it into the clone URL in the next step.

---

## 5. Clone the project to /opt/myclinic

```bash
# 🐧 replace <TOKEN> with the token from step 4
sudo mkdir -p /opt/myclinic && sudo chown $USER /opt/myclinic
git clone https://<TOKEN>@github.com/mounirbennassar/myclinicmainwebsite.git /opt/myclinic
cd /opt/myclinic
git log --oneline -3     # sanity: you see the latest commits
```

The token is stored inside the clone URL (`.git/config`), so future
`git fetch` / `git pull` — including the ones the deploy workflow runs —
work without asking for credentials.

---

## 6. Create the .env file

The real values are NOT in the repo (secrets). Get them from the current
production server's `/opt/myclinic/.env`, or from Mounir's secure copy.

```bash
# 🐧
cd /opt/myclinic
nano .env
```

Paste the full .env content (right-click in PowerShell pastes), then
`Ctrl+O`, `Enter`, `Ctrl+X` to save. The shape (see `.env.example`):

```
POSTGRES_USER=myclinic
POSTGRES_PASSWORD=<long random string>
POSTGRES_DB=myclinic
POSTGRES_PORT=5432
DATABASE_URL=postgresql://myclinic:<password>@db:5432/myclinic
DATABASE_URL_BUILD=postgresql://myclinic:<password>@127.0.0.1:5432/myclinic
PORTAL_URL=https://portal.myclinic.com.sa
JWT_SECRET=<must be IDENTICAL to the old server's value — changing it logs everyone out>
ANANTYA_BASE_URL=<WhatsApp gateway URL>
ANANTYA_API_KEY=<WhatsApp gateway key>
CLOUDINARY_CLOUD_NAME=ubhucgne
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
```

> ❗ `JWT_SECRET` and `POSTGRES_PASSWORD` must match what the imported
> database/users expect. Copy them exactly from the old server.

> ❗ The `CLOUDINARY_*` pair is what the dashboard's doctor-photo upload signs
> with. Omit them and the portal rejects every photo upload with "Image
> uploads are not configured (missing Cloudinary credentials)" — the rest of
> the site is unaffected, so the gap only shows up when someone edits a
> doctor. They live in Mounir's `.env.local` and the Cloudinary console
> (Settings → API Keys).

Lock it down:

```bash
# 🐧
chmod 600 /opt/myclinic/.env
```

---

## 7. Start the database and import the production data

The web image build pre-renders doctor pages **from the database**, so the
DB must be up **and populated** before the first full build.

```bash
# 🐧 start Postgres only
cd /opt/myclinic
docker compose up -d --wait db
```

Now import the existing data (~3,000 leads, 314 doctors, team accounts).
Two ways — pick the one that fits:

**Option A — new VM can reach the old server directly** (test with
`curl -sI https://myclinicsa.com.sa | head -1`; if the old DB URL is
reachable, this is one command):

```bash
# 🐧 <SOURCE_DATABASE_URL> is provided securely by Mounir
docker compose exec -T db sh -c \
  "pg_dump '<SOURCE_DATABASE_URL>' --no-owner --no-privileges | psql -q -U myclinic -d myclinic"
```

**Option B — carry a dump file through the Windows VM** (works even when
the servers can't see each other):

```powershell
# 🪟 1) dump on the OLD server and download it
ssh <olduser>@<old-server-ip> "cd /opt/myclinic && docker compose exec -T db pg_dump -U myclinic myclinic | gzip > /tmp/myclinic.sql.gz"
scp <olduser>@<old-server-ip>:/tmp/myclinic.sql.gz $env:USERPROFILE\Downloads\

# 🪟 2) upload to the NEW server
scp $env:USERPROFILE\Downloads\myclinic.sql.gz appadmin@10.97.100.10:/tmp/
```
```bash
# 🐧 3) import on the new server
cd /opt/myclinic
gunzip -c /tmp/myclinic.sql.gz | docker compose exec -T db psql -q -U myclinic -d myclinic
rm /tmp/myclinic.sql.gz
```

Verify the import:

```bash
# 🐧 should print real counts (≈314 doctors, ≈3000 leads)
docker compose exec -T db psql -U myclinic -d myclinic -c "SELECT count(*) FROM doctors;"
docker compose exec -T db psql -U myclinic -d myclinic -c "SELECT count(*) FROM leads;"
```

---

## 8. First full build & verify

```bash
# 🐧 first build takes ~5–10 minutes
cd /opt/myclinic
docker compose up -d --build
```

Then verify everything:

```bash
# 🐧 all four services running / healthy
docker compose ps

curl -s  http://127.0.0.1:3000/api/health          # → {"ok":true}
curl -sI http://127.0.0.1:3000/ | head -1          # → 200  (website)
curl -sI http://127.0.0.1:3001/login | head -1     # → 200  (portal login)
curl -sI http://127.0.0.1:3001/ | head -1          # → 307  (redirect → /dashboard)
```

> If doctor pages come up empty: data was imported *after* the build —
> rebuild once: `docker compose up -d --build`.

---

## 9. Install the self-hosted GitHub Actions runner  ← the auto-deploy core

1. In a browser: repo → **Settings** → **Actions** → **Runners** →
   **New self-hosted runner** → OS **Linux**, architecture **x64**.
2. GitHub shows a **Download** and **Configure** block with the current
   version, checksum, and a fresh registration token (⚠️ token expires in
   1 hour). **Copy those exact commands** — they look like this:

```bash
# 🐧 — use the commands FROM THE GITHUB PAGE (version/hash/token will differ)
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/download/v2.3XX.X/actions-runner-linux-x64-2.3XX.X.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz
```

3. Configure — GitHub's page gives you `--url` and `--token`; **add the
   name and label flags** exactly as below (the workflow targets the
   `myclinic-vm` label):

```bash
# 🐧
./config.sh --url https://github.com/mounirbennassar/myclinicmainwebsite \
            --token <TOKEN_FROM_GITHUB_PAGE> \
            --name myclinic-vm \
            --labels myclinic-vm \
            --unattended
```

4. Install it as a **service** so it survives reboots:

```bash
# 🐧
sudo ./svc.sh install appadmin
sudo ./svc.sh start
sudo ./svc.sh status        # → active (running)
```

5. Confirm in the browser: repo → Settings → Actions → Runners →
   **myclinic-vm** shows a green **Idle** dot.

*(Optional)* set the deploy path variable if you cloned somewhere other
than `/opt/myclinic`: repo → Settings → Secrets and variables → Actions →
**Variables** tab → New repository variable → `DEPLOY_PATH` = your path.

---

## 10. Test the auto-deploy

**Manual trigger first:**
repo → **Actions** → **“Deploy to VM (self-hosted)”** → **Run workflow** →
branch `main` → Run. Watch the live log: pull → rebuild → health checks →
green ✅.

**Then the real thing** — on your Mac (or wherever you edit code):

```bash
git add -A && git commit -m "test: vm auto-deploy" && git push origin main
```

Within seconds the Actions tab shows the run; 2–6 minutes later the VM is
serving the new code. **That's the full pipeline working.**

> The old workflow (`deploy.yml`, SSH to the old public server) still runs
> on every push too. Keep it while both servers are live; when you cut
> over to the VM permanently, disable it: repo → Actions → “Deploy to
> production” → “…” menu → **Disable workflow** (or delete the file).

---

## 11. nginx reverse proxy + TLS

nginx on the VM is the single public entry point (the public IP
**193.105.25.131** NATs 80/443 straight here). Its config is **tracked in the
repo** — `deploy/nginx/myclinic.conf` — covering the apex, the portal, the
www/ads/testweb → apex 301s, HTTP/2, upstream keepalive and gzip. Edit it in
git, then install:

```bash
# 🐧 after a git pull in /opt/myclinic
cd /opt/myclinic
CERT=$(sudo grep -rhoP 'ssl_certificate\s+\K[^;]+' /etc/nginx/sites-enabled/ | head -1)
KEY=$(sudo grep -rhoP 'ssl_certificate_key\s+\K[^;]+' /etc/nginx/sites-enabled/ | head -1)
echo "cert: $CERT key: $KEY"   # both must be non-empty (the NourNet wildcard)
sudo cp deploy/nginx/myclinic.conf /etc/nginx/sites-available/myclinic
sudo sed -i "s|__SSL_CERT__|$CERT|; s|__SSL_KEY__|$KEY|" /etc/nginx/sites-available/myclinic
sudo ln -sf /etc/nginx/sites-available/myclinic /etc/nginx/sites-enabled/myclinic
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

> The wildcard certificate (`*.myclinic.com.sa` + apex, NourNet-issued, valid
> to 2027-03-06) already lives on the VM; the grep lines copy whatever paths
> the previous config used. If `echo` prints nothing, TLS is terminated by the
> NourNet edge instead — delete the `BEGIN TLS…END TLS` section from the conf
> before installing (the :80 blocks are loop-safe behind an edge because they
> trust `X-Forwarded-Proto`).

**DNS (NourNet panel — ns1/ns2.nour.net.sa):** `myclinic.com.sa`,
`www.myclinic.com.sa`, `ads.myclinic.com.sa` and `portal.myclinic.com.sa` all
point at **193.105.25.131**. (www/ads previously CNAME'd to Vercel; nginx now
answers them with a 301 to the apex, so the site lives on exactly one host.)

---

## 12. GitHub Issues — enable & templates

The repo now ships issue templates in `.github/ISSUE_TEMPLATE/`
(Bug report + Task/change request forms). To turn Issues on:

1. Repo → **Settings** → **General** → scroll to **Features** →
   check **Issues**.
2. (Optional) create labels: repo → **Issues** → **Labels** → the
   templates use `bug` and `task` (`bug` exists by default; add `task`,
   pick any color).
3. Test: repo → **Issues** → **New issue** → you'll see the two template
   forms.

Workflow from now on: client/team files an issue → you fix it locally →
`git push origin main` → the runner deploys it automatically → close the
issue with a comment like `Fixed in <commit>` (or put `Fixes #12` in the
commit message and GitHub closes it for you on push).

---

## 13. Backups (set up once, before going live)

```bash
# 🐧
sudo mkdir -p /backup && sudo chown $USER /backup
crontab -e     # choose nano if asked
```

Add these two lines (nightly at 03:15, keeps 14 days):

```
15 3 * * * cd /opt/myclinic && docker compose exec -T db pg_dump -U myclinic myclinic | gzip > /backup/db-$(date +\%F).sql.gz && find /backup -name 'db-*.sql.gz' -mtime +14 -delete
30 3 * * * docker run --rm -v myclinic_uploads:/u -v /backup:/backup alpine tar czf /backup/uploads-$(date +\%F).tgz -C /u . && find /backup -name 'uploads-*.tgz' -mtime +14 -delete
```

> If the uploads volume name differs, check it with `docker volume ls`
> (it is `<project-folder-name>_uploads`, normally `myclinic_uploads`).

Restore a DB backup:

```bash
# 🐧
gunzip -c /backup/db-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -q -U myclinic -d myclinic
```

---

## 14. Day-2 cheat sheet

```bash
# 🐧 all from /opt/myclinic
docker compose ps                    # status of all 4 containers
docker compose logs -f web           # website logs
docker compose logs -f portal        # dashboard logs
docker compose logs -f backend       # API logs
docker compose logs -f db            # database logs
docker compose up -d --build         # manual deploy (same as CI runs)
docker compose restart backend       # restart one service
docker image prune -f                # clean old images

# runner service
sudo ~/actions-runner/svc.sh status | stop | start
```

> ⚠️ **NEVER run `docker compose down -v`** — the `-v` deletes the
> database and uploads volumes.

---

## 15. Troubleshooting

| Symptom | Fix |
|---|---|
| Workflow stuck on “Waiting for a runner” | Runner offline: `sudo ~/actions-runner/svc.sh status` → `start`. Check the label is exactly `myclinic-vm` (Settings → Actions → Runners). |
| Runner job fails with `permission denied … docker.sock` | `sudo usermod -aG docker appadmin`, then `sudo ~/actions-runner/svc.sh stop && sudo ~/actions-runner/svc.sh start`. |
| `git fetch` fails in the workflow (auth error) | The PAT in the clone URL expired — make a new one (step 4) and run: `cd /opt/myclinic && git remote set-url origin https://<NEWTOKEN>@github.com/mounirbennassar/myclinicmainwebsite.git` |
| Web build fails with a DB connection error | DB must be up before building: `docker compose up -d --wait db`. Check `DATABASE_URL_BUILD` uses `127.0.0.1:<POSTGRES_PORT>`. |
| Dashboard login loops / 401 | `JWT_SECRET` in .env differs from the old server — restore the original value. |
| Doctor pages empty | Data imported after the image build — `docker compose up -d --build` once more. |
| Port 5432 busy on host | Set `POSTGRES_PORT` in .env and mirror it inside `DATABASE_URL_BUILD`. |
| curl to github.com fails on server | Corporate firewall — infra team must open outbound 443 to GitHub + Docker Hub domains (step 2). |

---

## 16. Staging environment (same VM, second stack)

A full copy of the stack at `/opt/myclinic-staging`, deployed automatically on
every push to the `staging` branch (`.github/workflows/deploy-staging.yml`).
Ports: web `0.0.0.0:3100`, portal `0.0.0.0:3101`, db `127.0.0.1:5437` — browse
from the office network at `http://10.97.100.10:3100` (portal `:3101`).
Production on 3000/3001 is completely separate (own volumes, own image tag).

One-time setup (🐧 server, one line at a time):

```bash
git clone -b staging https://github.com/mounirbennassar/myclinicmainwebsite.git /opt/myclinic-staging
cp /opt/myclinic/.env /opt/myclinic-staging/.env
sed -i -e 's/^POSTGRES_PORT=.*/POSTGRES_PORT=5437/' -e 's/127\.0\.0\.1:5436/127.0.0.1:5437/' -e 's|^PORTAL_URL=.*|PORTAL_URL=http://10.97.100.10:3101|' /opt/myclinic-staging/.env
printf 'WEB_IMAGE=myclinic-web-staging\nWEB_BIND=0.0.0.0:3100\nPORTAL_BIND=0.0.0.0:3101\n' >> /opt/myclinic-staging/.env
chmod 600 /opt/myclinic-staging/.env
cd /opt/myclinic-staging && docker compose up -d --wait db
docker exec myclinic-db-1 pg_dump -U myclinic myclinic | docker exec -i myclinic-staging-db-1 psql -q -U myclinic -d myclinic
docker compose up -d --build
```

Refresh staging data from production anytime (staging DB is wiped first):

```bash
cd /opt/myclinic-staging && docker compose down && docker volume rm myclinic-staging_pgdata && docker compose up -d --wait db
docker exec myclinic-db-1 pg_dump -U myclinic myclinic | docker exec -i myclinic-staging-db-1 psql -q -U myclinic -d myclinic
cd /opt/myclinic-staging && docker compose up -d
```

Workflow: feature branch → merge/push to `staging` → auto-deploys → review at
`:3100` / `:3101` → PR `staging → main` → merge → production auto-deploys.

## 14. Retiring Vercel & Supabase (post-cutover cleanup, 2026-07)

The apex moved to this VM on 2026-07-29; Vercel and its Supabase database are
now legacy. Retire them **in this order** — the database holds a few edits
made on the Vercel dashboard that never reached the VM (split-brain), and
they must be extracted first:

1. **Extract the drift**: Actions → **Diff VM database vs external Postgres**
   → Run. Backfill anything it reports as external-only into the VM's
   Postgres (`UPDATE … WHERE col IS NULL` guards), re-run until clean.
2. **DNS**: repoint `www` and `ads` from Vercel's CNAMEs to A 193.105.25.131
   (NourNet panel). Wait for propagation (`dig +short www.myclinic.com.sa`).
3. **Vercel**: once www/ads resolve to the VM, delete the project (or at
   least remove the myclinic.com.sa domains from it). Nothing references it
   after that — `x-vercel-ip-country` in the UTM tracker simply reads null.
4. **Supabase**: after step 1 is clean, delete the project (its egress grace
   ends **2026-08-21** — do it before then) and delete the GitHub repository
   secret `NEW_DATABASE_URL`.
5. **Neon** (the pre-Supabase database, dead since ~2026-07-20): contains
   dashboard edits from 2026-07-05 → 07-20 that may never have been merged
   anywhere. If the console still lets you export, extract before deleting;
   otherwise accept the loss and delete.

## Quick checklist

- [ ] §2 SSH works, outbound HTTPS to GitHub/Docker Hub confirmed
- [ ] §3 Docker + git installed, `docker version` works without sudo
- [ ] §4 Fine-grained PAT created (Contents: read-only)
- [ ] §5 Repo cloned to `/opt/myclinic`
- [ ] §6 `.env` in place (JWT_SECRET copied exactly)
- [ ] §7 DB started + production data imported (counts verified)
- [ ] §8 `docker compose up -d --build` → all 4 healthy, curls pass
- [ ] §9 Runner installed as service, shows **Idle** in GitHub
- [ ] §10 Manual workflow run green, then push-to-deploy tested
- [ ] §11 nginx installed from deploy/nginx/myclinic.conf (TLS paths substituted)
- [ ] §12 Issues enabled, templates visible
- [ ] §13 Backup cron installed
- [ ] §14 Vercel + Supabase retired (drift extracted first), Neon decided

Questions → Mounir (clicksalesmedia@gmail.com)
