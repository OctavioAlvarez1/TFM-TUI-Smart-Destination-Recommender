"""
FastAPI application entry point.
Exposes POST /recommendations, GET /health, GET /users/:id, and POST /chat endpoints.
CORS configured for localhost:5173 (React frontend).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.api.models import (
    RecommendationRequest,
    ChatRequest,
    ChatResponse,
)

from src.recommendation.recommendation_engine import RecommendationEngine
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
        "http://localhost:5173",   # Vite dev server
        "http://localhost",        # Docker nginx (port 80)
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Eagerly-initialised singletons
# =====================================================

engine = RecommendationEngine()
_users_df = DataLoader.load_users()

# =====================================================
# Lazy RAG singleton — built only on first /chat call
# because the FAISS index + OpenAI embedding batch is slow.
# =====================================================

_rag = None  # type: ignore[assignment]


def _get_rag():
    """Return the TourismRAG singleton, building it on first access."""
    global _rag
    if _rag is None:
        from src.api.rag import TourismRAG  # local import keeps startup fast
        _rag = TourismRAG()
    return _rag


# =====================================================
# Endpoints
# =====================================================

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "application": "TUI Smart Destination Recommender",
        "status": "running",
    }


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/recommendations")
def get_recommendations(request: RecommendationRequest):
    """Generate destination recommendations for a user."""
    recommendations = engine.recommend(
        user_id=request.user_id,
        month=request.month,
        top_n=request.top_n,
    )
    return {"recommendations": recommendations}


@app.get("/users/{user_id}")
def get_user(user_id: str):
    """Return the profile for a single user."""
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
    """Return all user IDs."""
    return {"user_ids": _users_df["user_id"].tolist()}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """
    RAG-powered chat endpoint.

    Accepts the latest user message plus prior conversation history,
    retrieves relevant destination context via FAISS, and returns a
    GPT-4o-mini generated reply.

    If OPENAI_API_KEY is not configured the RAG module returns a friendly
    fallback message instead of raising an error.
    """
    rag = _get_rag()
    history_dicts = [msg.model_dump() for msg in request.history]
    reply = rag.chat(history=history_dicts, user_message=request.message)
    return ChatResponse(reply=reply)
