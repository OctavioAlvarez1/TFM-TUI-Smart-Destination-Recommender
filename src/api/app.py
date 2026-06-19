"""
=====================================================
TUI Smart Destination Recommender
REST API
=====================================================

Purpose
-------
Expose recommendation services
through FastAPI endpoints.

Author
------
Octavio Alvarez
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi import HTTPException

from src.api.models import (
    RecommendationRequest
)

from src.recommendation.recommendation_engine import (
    RecommendationEngine
)

from src.data.data_loader import DataLoader

app = FastAPI(
    title="TUI Smart Destination Recommender API",
    version="1.0"
)

# =====================================================
# CORS Configuration
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Recommendation Engine
# =====================================================

engine = RecommendationEngine()
_users_df = DataLoader.load_users()

# =====================================================
# Endpoints
# =====================================================

@app.get("/")
def root():
    """
    Root endpoint.
    """

    return {
        "application":
            "TUI Smart Destination Recommender",

        "status":
            "running"
    }


@app.get("/health")
def health():
    """
    Health check endpoint.
    """

    return {
        "status":
            "ok"
    }


@app.post("/recommendations")
def get_recommendations(
    request: RecommendationRequest
):
    """
    Generate recommendations.
    """

    recommendations = (
        engine.recommend(
            user_id=request.user_id,
            month=request.month,
            top_n=request.top_n
        )
    )

    return {
        "recommendations":
            recommendations
    }


@app.get("/users/{user_id}")
def get_user(user_id: str):
    """
    Return profile for a single user.
    """
    row = _users_df[_users_df["user_id"] == user_id]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    record = row.iloc[0].to_dict()
    return {
        "user_id":                   record.get("user_id"),
        "country":                   record.get("country"),
        "age_group":                 record.get("age_group"),
        "budget_level":              record.get("budget_level"),
        "travel_style":              record.get("travel_style"),
        "sustainability_preference": record.get("sustainability_preference"),
    }


@app.get("/users")
def list_users():
    """
    Return all user IDs.
    """
    return {"user_ids": _users_df["user_id"].tolist()}