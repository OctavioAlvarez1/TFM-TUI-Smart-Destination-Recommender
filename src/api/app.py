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

from src.api.models import (
    RecommendationRequest
)

from src.recommendation.recommendation_engine import (
    RecommendationEngine
)

app = FastAPI(
    title="TUI Smart Destination Recommender API",
    version="1.0"
)

engine = RecommendationEngine()


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