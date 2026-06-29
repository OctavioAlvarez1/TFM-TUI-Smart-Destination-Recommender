"""
Pydantic request/response models for the recommendations and chat APIs.

RecommendationRequest  — user_id, month, top_n
ChatMessage            — role ("user" | "assistant"), content
ChatRequest            — message + optional history
ChatResponse           — reply string
"""

from pydantic import BaseModel


# =====================================================
# Recommendations
# =====================================================

class RecommendationRequest(BaseModel):
    user_id: str
    month: int
    top_n: int = 5


# =====================================================
# Chat / RAG
# =====================================================

class ChatMessage(BaseModel):
    role: str       # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
