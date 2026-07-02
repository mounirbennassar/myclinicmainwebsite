# ── FastAPI backend ─────────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY sql ./sql

# Uploaded images live here — mounted as a named volume in docker-compose so
# they survive redeploys.
RUN mkdir -p /app/uploads

EXPOSE 8020

# Migrations are idempotent, so they run on every start before the server.
CMD ["sh", "-c", "python -m app.migrate && uvicorn app.main:app --host 0.0.0.0 --port 8020 --workers 2"]
