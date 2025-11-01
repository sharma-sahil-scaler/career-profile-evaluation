"""
FastAPI application for Free Profile Evaluation.
Handles HTTP endpoints for profile evaluation.
"""
import logging
import os
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel, ConfigDict

from src.models import FullProfileEvaluationResponse
from src.services.run_poc import run_poc
from src.config.logging_config import setup_logging, get_logger

# Setup logging
setup_logging()
logger = get_logger(__name__)


class QuizResponses(BaseModel):
    currentRole: str
    experience: str
    targetRole: str
    problemSolving: str
    systemDesign: str
    portfolio: str
    mockInterviews: str
    currentCompany: str
    currentSkill: str
    requirementType: str
    targetCompany: str
    # Optional label fields for display (sent from frontend)
    currentRoleLabel: Optional[str] = None
    targetRoleLabel: Optional[str] = None
    targetCompanyLabel: Optional[str] = None
    primaryGoal: Optional[str] = None  # Add primaryGoal field

    model_config = ConfigDict(extra="forbid")


class Goals(BaseModel):
    requirementType: list[str]
    targetCompany: str
    topicOfInterest: list[str]

    model_config = ConfigDict(extra="forbid")


class EvaluationRequest(BaseModel):
    background: str
    quizResponses: QuizResponses
    goals: Goals

    model_config = ConfigDict(extra="forbid")


app = FastAPI(title="Full Profile Evaluation API")

# Create API router for all endpoints
api_router = APIRouter()

# Note: CORS middleware not needed because all requests come through proxy
# - Dev: React dev server proxies /api/* to localhost:8000
# - Prod: Nginx proxies /api/* to backend:8000
# Both configurations result in same-origin requests, eliminating CORS issues


@api_router.post("/evaluate", response_model=FullProfileEvaluationResponse)
async def evaluate_profile(request: EvaluationRequest) -> FullProfileEvaluationResponse:
    logger.info("Received profile evaluation request")

    try:
        result = run_poc(
            input_payload=request.model_dump(),
        )
        logger.info("Profile evaluation completed successfully")
        return result
    except RuntimeError as exc:
        logger.exception("Evaluation failed due to configuration error")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - unexpected path
        logger.exception("Unexpected error while generating evaluation")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate evaluation. Check server logs for details.",
        ) from exc


@api_router.get("/health")
@api_router.head("/health")
async def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}

app.include_router(api_router, prefix="/career-profile-tool/api")

def create_app() -> FastAPI:
    return app
