"""
=====================================================
API Models
=====================================================

Purpose
-------
Pydantic models for API requests
and responses.

Author
------
Octavio Alvarez
"""

from pydantic import BaseModel


class RecommendationRequest(
    BaseModel
):
    user_id: str
    month: int
    top_n: int = 5