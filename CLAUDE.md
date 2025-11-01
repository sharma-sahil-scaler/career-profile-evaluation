# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Free Profile Evaluation is a full-stack application that provides AI-powered career profile evaluations for tech professionals in the Indian market. It uses ChatGPT (GPT-4) to generate personalized career assessments, recommendations, and roadmaps based on user input.

**Key Innovation**: PostgreSQL-based intelligent caching layer that uses SHA256 hash-based deduplication to reduce OpenAI API costs by 50-99%.

## Architecture

### Three-Tier Clean Architecture

```
API Layer (src/api/)
    ↓
Service Layer (src/services/)
    ↓
Repository Layer (src/repositories/)
    ↓
Database (PostgreSQL)
```

**Critical Design Principle**: Each layer has a single responsibility and communicates only with adjacent layers. Never bypass layers (e.g., API → Repository directly).

### Backend Structure (`backend/src/`)

- **`api/main.py`**: FastAPI application with API routes mounted under `/api` prefix:
  - `POST /api/evaluate` - Main evaluation endpoint
  - `GET /api/health` - Health check for monitoring/load balancers

- **`services/`**: Business logic modules
  - `run_poc.py` - Orchestrates entire evaluation pipeline, handles OpenAI API calls and caching
  - `quick_wins_logic.py`, `scoring_logic.py`, `timeline_logic.py`, etc. - Specialized evaluation components

- **`repositories/`**: Data access layer
  - `cache_repository.py` - PostgreSQL cache operations with connection pooling

- **`models/`**: Pydantic data models
  - `models.py` - Validated response schemas
  - `models_raw.py` - Raw OpenAI response schemas

- **`config/`**: Centralized configuration
  - `settings.py` - Environment-based settings using pydantic-settings
  - `exceptions.py` - Custom exception hierarchy
  - `logging_config.py` - Structured JSON/text logging

- **`utils/`**: Helper utilities
  - `label_mappings.py` - Role/company label conversions
  - `validate_response.py` - Response validation

### Hash-Based Caching System

**How it Works**:
1. User submits profile evaluation request
2. Backend normalizes payload (sorted JSON keys) and generates SHA256 hash
3. Check PostgreSQL cache using `cache_key` + `model` composite lookup
4. Cache HIT: Return stored response (instant, zero OpenAI cost)
5. Cache MISS: Call OpenAI API, store response with hash, return result

**Implementation Details**:
- Cache key: SHA256 of `json.dumps(payload, sort_keys=True)`
- Storage: JSONB column in PostgreSQL for efficient querying
- Schema: `response_cache` table with composite unique constraint on (cache_key, model)
- Critical: JSONB returns as dict from psycopg2, must convert to JSON string before validation

### Frontend

React SPA with development proxy and production Nginx routing. All API calls use `/api/*` prefix.

### API Routing Architecture

**Base Path**: All application routes are under `/career-profile-tool`

**Development Environment**:
- Frontend: `http://localhost:3000/career-profile-tool/`
- Backend: `http://localhost:8000/career-profile-tool/api/*`
- Request flow: Frontend → React dev proxy → `localhost:8000/career-profile-tool/api/*` → FastAPI

**Production Environment (Elastic Beanstalk + CloudFront)**:
- Frontend: `scaler.com/career-profile-tool/` (routed via CloudFront)
- API: `scaler.com/career-profile-tool/api/*`
- Request flow: CloudFront → Elastic Beanstalk → Nginx → `backend:8000/career-profile-tool/api/*` → FastAPI
- Root (`/`) returns 404 (handled by Scaler's main infrastructure)

**CloudFront Routing Setup**:
- `scaler.com/` → Scaler's main infrastructure
- `scaler.com/career-profile-tool/*` → This Elastic Beanstalk deployment
- Path pattern: `/career-profile-tool/*` routes to this infrastructure
- This allows multiple apps to coexist on the same domain

**Key Benefits**:
- No CORS configuration needed (same-origin in both environments)
- Consistent routing between dev and production
- Can be deployed as subdirectory alongside other applications
- Clean separation of frontend and API routes
- Industry-standard pattern used by Next.js, Vite, etc.

**Implementation Details**:
- React Router: `basename="/career-profile-tool"` in App.js
- React build: `homepage` field in package.json sets PUBLIC_URL
- React dev proxy: Configured in `frontend/src/setupProxy.js` for `/career-profile-tool/api/*`
- Nginx: Serves static files from `/career-profile-tool`, proxies API requests
- FastAPI: All routes mounted under `/career-profile-tool/api` prefix via `APIRouter`

## Development Commands

### Initial Setup

```bash
# 1. Create .env file (copy from .env.example)
echo "OPENAI_API_KEY=sk-proj-xxxxx" > .env

# 2. Start all services
docker compose up --build
```

**Services will be available at**:
- Frontend: http://localhost/career-profile-tool/ (production via Nginx)
- Backend API: http://localhost:8000/career-profile-tool/api/*
- Database: localhost:5432
- Root: http://localhost/ returns 404 (by design - CloudFront routes only `/career-profile-tool/*`)

### Daily Development

```bash
# Start services (uses cached builds)
docker compose up

# Stop services
docker compose down

# Rebuild after code changes
docker compose up --build

# Rebuild specific service
docker compose up --build backend
```

### Monitoring & Debugging

```bash
# View logs (all services)
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Check service health
curl http://localhost:8000/health

# Check service status
docker compose ps

# Access database
docker compose exec postgres psql -U postgres -d profile_cache
```

### Database Operations

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U postgres -d profile_cache

# Inside psql:
# View cache entries
SELECT cache_key, model, created_at FROM response_cache ORDER BY created_at DESC LIMIT 10;

# Check cache statistics
SELECT * FROM cache_statistics;

# View cache hit details
SELECT
  cache_key,
  model,
  jsonb_pretty(response_json) as response,
  created_at
FROM response_cache
WHERE cache_key = 'your_hash_here';

# Count total cache entries
SELECT COUNT(*) FROM response_cache;
```

### Docker Cleanup

```bash
# Remove containers and volumes (clears cache)
docker compose down -v

# Remove all unused Docker resources
docker system prune -a -f

# Remove build cache (largest space saver)
docker builder prune -a -f

# Check Docker disk usage
docker system df
```

## Important Implementation Notes

### Configuration Management

All configuration comes from environment variables via `src/config/settings.py`. Never hardcode:
- API keys
- Database URLs
- Port numbers

Access settings via:
```python
from src.config.settings import settings

api_key = settings.openai_api_key
```

### API Routing

All API endpoints are mounted under `/api` prefix using FastAPI's `APIRouter`:
```python
api_router = APIRouter()

@api_router.post("/evaluate")
async def evaluate_profile(...):
    ...

app.include_router(api_router, prefix="/api")
```

This creates endpoints at `/api/evaluate`, `/api/health`, etc.

### OpenAI API Calls

**Only one place calls OpenAI**: `src/services/run_poc.py` in `call_openai_structured()` function.

Before calling OpenAI, ALWAYS:
1. Generate cache key: `cache_repo.generate_cache_key(payload, model)`
2. Check cache: `cache_repo.get(cache_key, model)`
3. If cached, return immediately (log "Cache HIT")
4. If not cached, call OpenAI
5. Store result: `cache_repo.set(cache_key, model, response_json)`

### Import Paths

All imports use absolute `src.*` paths:
```python
from src.models import FullProfileEvaluationResponse
from src.services.run_poc import run_poc
from src.repositories.cache_repository import CacheRepository
```

Never use relative imports like `from models import ...` or `from ..services import ...`

### Entry Point

`backend/main.py` is the entry point that imports the FastAPI app from `src.api.main`:
```python
from src.api.main import app
```

This separation allows proper package structure while maintaining uvicorn compatibility.

### Error Handling

Use custom exceptions from `src.config.exceptions`:
- `DatabaseError` - Database connection/query failures
- `OpenAIError` - OpenAI API failures
- `CacheError` - Caching layer failures
- `ValidationError` - Pydantic validation failures

All exceptions include status codes and are caught at API layer to return proper HTTP responses.

### Logging

Structured logging configured in `src/config/logging_config.py`:
- Development: text format, INFO level
- Production: JSON format for log aggregation

Never use print statements. Always use logger:
```python
from src.config.logging_config import get_logger
logger = get_logger(__name__)

logger.info("Cache HIT for key: ...")
logger.error("OpenAI API call failed", exc_info=True)
```

## Common Issues

### Import Errors After File Changes

If you move files or rename modules:
1. Update all imports to use `src.*` absolute paths
2. Check `__init__.py` files for exported symbols
3. Rebuild Docker containers: `docker compose up --build`

### Cache Not Working

Check:
1. Database connection: `docker compose logs postgres`
2. Cache repository logs for "Cache HIT" or "Cache MISS"
3. Verify cache entries: `SELECT COUNT(*) FROM response_cache;`

### JSONB Validation Errors

If seeing "JSON input should be string, bytes or bytearray":
- PostgreSQL JSONB returns dict, not string
- Ensure `cache_repository.py` converts dict to JSON string before returning

### Backend Won't Start

Common causes:
1. Missing `OPENAI_API_KEY` in `.env`
2. Missing `DATABASE_URL` environment variable
3. Import errors (check all use `src.*` paths)
4. Database not ready (check `depends_on` in docker-compose.yml)

## Production Deployment

Designed for AWS Elastic Beanstalk + CloudFront deployment:

### Architecture
- **CloudFront**: Routes `scaler.com/career-profile-tool/*` to Elastic Beanstalk
- **Elastic Beanstalk**: Multi-container Docker (frontend Nginx + backend FastAPI)
- **Nginx**: Serves React app at `/career-profile-tool`, proxies API to backend
- **Backend**: FastAPI on port 8000 with `/career-profile-tool/api/*` routes
- **Database**: PostgreSQL RDS for caching

### CloudFront Configuration
```
# Path pattern behavior:
Path Pattern: /career-profile-tool/*
Origin: your-elasticbeanstalk-env.elasticbeanstalk.com
```

### Environment Variables
```
OPENAI_API_KEY=sk-proj-xxxxx
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/dbname
ENVIRONMENT=production
LOG_LEVEL=INFO
LOG_FORMAT=json
```

**Important Notes**:
- Root (`/`) returns 404 by design - only `/career-profile-tool/*` is served
- CORS not needed (same-origin requests via CloudFront)
- All routes must include `/career-profile-tool` base path
- Static assets cached by CloudFront for performance
