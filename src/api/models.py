"""
Pydantic request/response models for the recommendations API.
Defines RecommendationRequest (user_id, month, top_n) and
RecommendationResponse (ranked list of scored destinations).
"""

from pydantic import BaseModel


class RecommendationRequest(
    BaseModel
):
    user_id: str
    month: int
    top_n: int = 5