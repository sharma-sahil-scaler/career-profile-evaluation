"""
Mock Scaler Backend for Local Testing of CPE
This is a lightweight mock that simulates Scaler's API responses
for local development and testing purposes only.

Add to .gitignore - NOT for production use!
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import os
import json

app = FastAPI(title="Mock Scaler Backend", version="1.0")

# Add CORS for local frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite database for testing
DB_PATH = "/tmp/mock_scaler_test.db"


def init_db():
    """Initialize test database"""
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()


init_db()


# Request/Response Models
class UserData(BaseModel):
    id: str
    email: str
    name: str


class InitialDataResponse(BaseModel):
    user: Optional[UserData] = None
    is_authenticated: bool = False


class HealthResponse(BaseModel):
    status: str
    service: str


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "mock-scaler-backend"
    }


@app.get("/csrf-token")
async def get_csrf_token():
    """CSRF token endpoint for frontend authentication"""
    return {
        "csrf_token": "mock-csrf-token-12345",
        "status": "ok"
    }


@app.get("/users/sign_in/mobile")
async def mobile_signin():
    """Mobile sign-in endpoint - returns sign-in page"""
    return {
        "status": "ok",
        "message": "Mobile sign-in endpoint",
        "redirect": "/career-profile-tool/"
    }


@app.post("/generate-jwt")
async def generate_jwt():
    """Generate JWT token for authentication"""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse("mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")


@app.get("/api/initial-data", response_model=InitialDataResponse)
async def get_initial_data():
    """
    Mock endpoint that returns initial user data
    Frontend calls this to check if user is logged in
    Returns a logged-in user for local testing
    """
    return {
        "user": {
            "id": "test-user-123",
            "email": "test@scaler.com",
            "name": "Test User"
        },
        "is_authenticated": True
    }


@app.get("/api/v3/users")
async def get_user_v3():
    """
    Scaler v3 API endpoint to get current user data
    Frontend calls this after getting JWT token
    """
    return {
        "data": {
            "id": "test-user-123",
            "email": "test@scaler.com",
            "name": "Test User",
            "attributes": {
                "phone_verified": True,
                "id": "test-user-123",
                "email": "test@scaler.com",
                "name": "Test User"
            }
        }
    }


@app.get("/api/user/{user_id}", response_model=UserData)
async def get_user(user_id: str):
    """Get user data by ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = c.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": row["id"],
        "email": row["email"],
        "name": row["name"]
    }


@app.post("/api/auth/verify")
async def verify_token(token: str):
    """Mock token verification"""
    return {
        "valid": True,
        "user_id": "test-user-123"
    }


@app.post("/api/cpe/evaluate")
async def evaluate_profile(payload: dict):
    """
    Mock CPE evaluation endpoint
    This just echoes back success - the actual evaluation is done by our CPE backend
    """
    return {
        "status": "queued",
        "evaluation_id": "eval-" + str(hash(json.dumps(payload, sort_keys=True)))[:8]
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Mock Scaler Backend on http://localhost:8001")
    print("   Health check: http://localhost:8001/health")
    uvicorn.run(app, host="0.0.0.0", port=8001)
