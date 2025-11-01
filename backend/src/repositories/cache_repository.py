import hashlib
import json
from contextlib import contextmanager
from typing import Any, Dict, Optional

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

from src.config.exceptions import CacheError, DatabaseError
from src.config.logging_config import get_logger
from src.config.settings import settings

logger = get_logger(__name__)


class CacheRepository:
    def __init__(self):
        self._pool: Optional[pool.SimpleConnectionPool] = None
        self._disabled = False

    def _initialize_pool(self) -> Optional[pool.SimpleConnectionPool]:
        if self._disabled:
            return None

        if self._pool is not None:
            return self._pool

        try:
            self._pool = pool.SimpleConnectionPool(
                minconn=1,
                maxconn=settings.db_pool_size,
                dsn=settings.database_url
            )

            # Test connection
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")

            logger.info("✅ Cache repository initialized successfully")
            return self._pool

        except Exception as exc:
            logger.error(f"Failed to initialize cache: {exc}")
            if not settings.cache_enabled:
                logger.warning("Cache disabled - continuing without caching")
                self._disabled = True
                return None
            raise CacheError(f"Failed to initialize cache: {exc}")

    @contextmanager
    def _get_connection(self):
        pool_instance = self._initialize_pool()

        if pool_instance is None:
            raise CacheError("Database pool not initialized")

        conn = pool_instance.getconn()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            pool_instance.putconn(conn)

    @staticmethod
    def generate_cache_key(payload: Dict[str, Any], model: str) -> str:
        serialized = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def get(self, cache_key: str, model: str) -> Optional[str]:
        if self._disabled or not settings.cache_enabled:
            return None

        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        SELECT response_json
                        FROM response_cache
                        WHERE cache_key = %s AND model = %s
                        """,
                        (cache_key, model)
                    )
                    result = cur.fetchone()

                    if result:
                        logger.info(f"✅ Cache HIT for key: {cache_key[:16]}...")
                        response_data = result['response_json']
                        if isinstance(response_data, dict):
                            return json.dumps(response_data)
                        return response_data

                    logger.info(f"❌ Cache MISS for key: {cache_key[:16]}...")
                    return None

        except Exception as exc:
            logger.warning(f"Cache read failed: {exc}")
            return None

    def set(self, cache_key: str, model: str, response_json: str) -> bool:
        if self._disabled or not settings.cache_enabled:
            return False

        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO response_cache (cache_key, model, response_json)
                        VALUES (%s, %s, %s::jsonb)
                        ON CONFLICT (cache_key, model)
                        DO UPDATE SET
                            response_json = EXCLUDED.response_json,
                            updated_at = CURRENT_TIMESTAMP
                        """,
                        (cache_key, model, response_json)
                    )

            logger.info(f"💾 Cache WRITE for key: {cache_key[:16]}...")
            return True

        except Exception as exc:
            logger.error(f"Cache write failed: {exc}")
            return False

    def delete(self, cache_key: str, model: str) -> bool:
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM response_cache WHERE cache_key = %s AND model = %s",
                        (cache_key, model)
                    )
                    return cur.rowcount > 0

        except Exception as exc:
            logger.error(f"Cache delete failed: {exc}")
            return False

    def clear(self, model: Optional[str] = None) -> int:
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    if model:
                        cur.execute(
                            "DELETE FROM response_cache WHERE model = %s",
                            (model,)
                        )
                    else:
                        cur.execute("DELETE FROM response_cache")

                    deleted_count = cur.rowcount
                    logger.info(f"Cleared {deleted_count} cache entries")
                    return deleted_count

        except Exception as exc:
            logger.error(f"Failed to clear cache: {exc}")
            return 0

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.

        Returns:
            Dictionary with cache statistics
        """
        if self._disabled or not settings.cache_enabled:
            return {"enabled": False, "total_entries": 0}

        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        SELECT
                            COUNT(*) as total_entries,
                            COUNT(DISTINCT model) as unique_models,
                            MAX(created_at) as latest_entry,
                            MIN(created_at) as oldest_entry,
                            pg_size_pretty(
                                SUM(LENGTH(response_json::text))::bigint
                            ) as total_size
                        FROM response_cache
                        """
                    )
                    stats = cur.fetchone()
                    return {
                        "enabled": True,
                        **dict(stats)
                    }

        except Exception as exc:
            logger.error(f"Failed to get cache stats: {exc}")
            return {"enabled": False, "error": str(exc)}

    def health_check(self) -> bool:
        """
        Check if cache/database is healthy.

        Returns:
            True if healthy, False otherwise
        """
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
                    return True
        except Exception:
            return False
