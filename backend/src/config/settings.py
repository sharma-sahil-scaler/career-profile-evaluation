import os
from typing import List, Optional
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Free Profile Evaluation API"
    app_version: str = "2.0.0"
    environment: str = "development"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000
    openai_api_key: str
    openai_model: str = "gpt-4o"
    openai_timeout: int = 60
    openai_max_retries: int = 3
    openai_retry_delay: float = 1.5
    database_url: str
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_pool_timeout: int = 30
    cache_enabled: bool = True
    cache_ttl: Optional[int] = None 
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    def get_cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]
    log_level: str = "INFO"
    log_format: str = "json"
    aws_region: Optional[str] = None
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    enable_metrics: bool = True
    sentry_dsn: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
