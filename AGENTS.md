# Repository Guidelines

## Project Structure & Module Organization
The repository splits into `backend/` (FastAPI) and `frontend/` (React). Backend code lives in `backend/src/`, with HTTP handlers in `api/`, domain services in `services/`, persistence in `repositories/`, and helpers in `utils/`. Configuration stays in `backend/config/`; `backend/main.py` remains a thin entry point. Tests live under `backend/tests/unit/` and `backend/tests/integration/`. The React app keeps routed views and shared components in `frontend/src/`, static assets in `public/`, and deployment files (Dockerfile, `nginx.conf`) in the package root.

## Build, Test, and Development Commands
Run `docker compose up --build` from the repo root for an end-to-end environment. For backend-only work, install dependencies with `uv sync --all-extras` inside `backend/`, then run `uv run uvicorn backend.main:app --reload` on port 8000. Execute backend tests via `uv run pytest backend/tests --maxfail=1`. Frontend setup uses `npm install` (inside `frontend/`), `npm start` for live reload, and `npm run build` for the optimized bundle.

## Coding Style & Naming Conventions
Python code uses 4-space indentation, full type hints, and `snake_case` filenames. Format with Black and lint with Ruff via `uv run black backend/src backend/tests` and `uv run ruff check backend`. Keep services and repositories thin and avoid cross-layer imports. Frontend components use PascalCase filenames (`SkillCard.tsx`), hooks and stores stay camelCase, and styled-components stay co-located with the owning component. API clients live in `frontend/src/api/`.

## Testing Guidelines
Place unit tests in `backend/tests/unit/<feature>/test_<subject>.py` and verify end-to-end flows in `backend/tests/integration/`. Use `pytest.mark.asyncio` for async services and validate caching with fixtures seeded by `init.sql`. Track coverage with `uv run pytest --cov=src`. Frontend behavior tests run with `npm test`; house React Testing Library specs in `frontend/src/__tests__/`.

## Commit & Pull Request Guidelines
Structure commit messages in imperative form, optionally scoping them (`feat(cache): add hashed response key`). Each pull request should link relevant issues, describe the change in 2–3 bullets, list testing evidence (commands + results), and update docs when behavior or configuration shifts. Include screenshots or recordings for UI-affecting work.

## Environment & Security Tips
Secrets load via environment variables managed in `.env` (e.g., `OPENAI_API_KEY`). Keep `.env` files out of version control and rotate keys regularly. Database bootstrap SQL resides in `backend/init.sql`; update it when schema changes and capture notes in the PR. Surface new configuration through `backend/src/config/settings.py` to keep runtime defaults centralized.
