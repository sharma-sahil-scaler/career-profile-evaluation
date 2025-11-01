import hashlib
import json
import logging
import os
from typing import Any, Dict, Optional
from contextlib import contextmanager

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

_connection_pool: Optional[pool.SimpleConnectionPool] = None
_CACHE_DISABLED = False


def _get_database_url() -> str:
    return os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/profile_cache"
    )


def _initialize_pool() -> Optional[pool.SimpleConnectionPool]:
    global _connection_pool, _CACHE_DISABLED

    if _CACHE_DISABLED:
        return None

    if _connection_pool is not None:
        return _connection_pool

    try:
        database_url = _get_database_url()
        _connection_pool = pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=database_url
        )

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")

        logger.info("Database connection pool initialized successfully")
        return _connection_pool

    except Exception as exc:
        logger.warning(f"Database cache disabled: {exc}")
        _CACHE_DISABLED = True
        return None


@contextmanager
def get_db_connection():
    pool_instance = _initialize_pool()

    if pool_instance is None:
        raise RuntimeError("Database pool not initialized")

    conn = pool_instance.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool_instance.putconn(conn)


def make_cache_key(payload: Dict[str, Any], model: str) -> str:
    serialized = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    payload_hash = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
    return payload_hash


def get_cached_response(cache_key: str, model: str) -> Optional[str]:
    if _CACHE_DISABLED:
        return None

    try:
        with get_db_connection() as conn:
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
                    logger.info(f"✅ Cache HIT for key: {cache_key[:16]}... (reading from database)")
                    response_data = result['response_json']
                    if isinstance(response_data, dict):
                        return json.dumps(response_data)
                    return response_data
                else:
                    logger.info(f"❌ Cache MISS for key: {cache_key[:16]}... (not found in database)")
                    return None

    except Exception as exc:
        logger.warning(f"Cache read failed: {exc}")
        return None


def set_cached_response(cache_key: str, model: str, response_json: str) -> bool:
    if _CACHE_DISABLED:
        return False

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO response_cache (cache_key, model, response_json)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (cache_key, model)
                    DO UPDATE SET
                        response_json = EXCLUDED.response_json,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    (cache_key, model, response_json)
                )

        logger.info(f"💾 Cache WRITE for key: {cache_key[:16]}... (saved to database)")
        return True

    except Exception as exc:
        logger.warning(f"Cache write failed: {exc}")
        return False


def get_cache_stats() -> Dict[str, Any]:
    if _CACHE_DISABLED:
        return {"enabled": False, "total_entries": 0}

    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT
                        COUNT(*) as total_entries,
                        COUNT(DISTINCT model) as unique_models,
                        MAX(created_at) as latest_entry,
                        MIN(created_at) as oldest_entry
                    FROM response_cache
                    """
                )
                stats = cur.fetchone()
                return {
                    "enabled": True,
                    **stats
                }

    except Exception as exc:
        logger.warning(f"Failed to get cache stats: {exc}")
        return {"enabled": False, "error": str(exc)}


def clear_cache(model: Optional[str] = None) -> int:
    if _CACHE_DISABLED:
        return 0

    try:
        with get_db_connection() as conn:
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
        logger.warning(f"Failed to clear cache: {exc}")
        return 0
