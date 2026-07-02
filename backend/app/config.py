"""Settings loaded from the environment.

Reads the repo root's .env.local first (shared with the Next.js app so both
sides agree on DATABASE_URL / JWT_SECRET), then backend/.env for backend-only
overrides. Real environment variables win over both files.
"""
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(REPO_ROOT / ".env.local", BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = ""
    jwt_secret: str = ""

    # WhatsApp gateway (Anantya.ai)
    anantya_base_url: str = "https://apiv1.anantya.ai"
    anantya_api_key: str = ""

    # Comma-separated list of non-@myclinic.com.sa emails allowed to log in.
    login_email_exceptions: str = "amr.ali@inception.sa"

    # Where doctor/content image uploads are stored, served at /api/uploads/*.
    uploads_dir: Path = BACKEND_DIR / "uploads"

    @property
    def email_exceptions(self) -> set[str]:
        return {e.strip().lower() for e in self.login_email_exceptions.split(",") if e.strip()}


settings = Settings()
