# Horizon — System Architecture

## Overview

Horizon is a full-stack AI system built as a 5-layer pipeline. The backend is a modular Python recommendation engine exposed via FastAPI. The frontend is a React SPA that visualises recommendations and tourism data.

```
┌──────────────────────────────────────────────────────────┐
│                   React SPA (localhost:5173)              │
│  Home · Insights · Analytics · About · ChatWidget (FAB)   │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP (Axios)
                        ▼
┌──────────────────────────────────────────────────────────┐
│              FastAPI Server (localhost:8000)               │
│  POST /recommendations · GET /health · GET /users/:id     │
│  POST /chat                                               │
└───────────┬───────────────────────────┬──────────────────┘
            │                           │
            ▼                           ▼
┌───────────────────────┐  ┌───────────────────────────────┐
│  Recommendation Engine│  │      RAG Chatbot Layer         │
│  (Python — src/       │  │  src/api/rag.py (TourismRAG)  │
│   recommendation/)    │  │  FAISS IndexFlatIP             │
│  Preference · Sustain.│  │  text-embedding-3-small        │
│  Popularity · Congest.│  │  gpt-4o-mini                  │
│  Confidence · Explain.│  └───────────────┬───────────────┘
└───────────┬───────────┘                  │
            └──────────────┬───────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                   Data Layer (CSV Files)                   │
│  destinations.csv · users.csv · bookings_history.csv      │
│  sustainability_scores.csv · congestion_scores.csv        │
└──────────────────────────────────────────────────────────┘
```

---

## 5-Layer System Design

The architecture follows the TUI Care Foundation's 5-layer framework:

| Layer | Name | Responsibility | Horizon Implementation |
|---|---|---|---|
| **L1** | Unified Ingestion (Foundation) | Consolidate data sources | `data/raw/` CSVs + INE/FRONTUR open data via `fetch_open_data.py` |
| **L2** | Prediction Engine (Intelligence) | Demand modelling and scoring | `src/recommendation/` — all engine modules |
| **L3** | Intervention Triggers (Action) | Activate redistribution when thresholds exceeded | Congestion penalty (>80 → −10%) in `scoring.py` |
| **L4** | Personalization (Interface) | Invisible interface matching traveler to destination | Preference scoring + explainability layer; RAG chatbot adds a natural-language NLP interface (`src/api/rag.py`) |
| **L5** | Governance (Control Panel) | Monitoring and KPI tracking | Analytics page + Streamlit dashboard |

---

## Backend Modules

### `src/api/app.py` — Entry Point

- FastAPI application
- CORS configured for `localhost:5173`
- Four endpoints: `POST /recommendations`, `GET /health`, `GET /users/{user_id}`, `POST /chat`

### `src/api/rag.py` — RAG Chatbot

Implements the `TourismRAG` class, which provides a conversational AI interface over the destination data.

**Architecture:**
- **Vector index**: FAISS `IndexFlatIP` (cosine similarity via normalized L2 vectors)
- **Embeddings**: OpenAI `text-embedding-3-small` — one rich-text document per destination, built from `destinations.csv`, `sustainability_scores.csv`, and `congestion_scores.csv`
- **Generation**: `gpt-4o-mini` — top-k retrieved documents are injected as context
- **Lazy initialization**: the FAISS index is built only on the first `POST /chat` call; subsequent calls reuse the in-memory index
- **Graceful degradation**: if `OPENAI_API_KEY` is not set, the endpoint returns a friendly message without raising an exception

**Required dependency**: `OPENAI_API_KEY` environment variable must be set before starting the server.

**New Python dependencies** (`requirements.txt`): `faiss-cpu`, `openai`, `tiktoken`

### `src/api/models.py` — Pydantic Models

```python
class RecommendationRequest:
    user_id: str      # e.g. "U001"
    month: int        # 1-12
    top_n: int        # default 5

class RecommendationResponse:
    destination_id: str
    destination_name: str
    final_score: float
    preference_score: float
    sustainability_score: float
    popularity_score: float
    congestion_score: float
    confidence_score: float
    recommendation_rank: int
    explanations: list[str]
```

### `src/recommendation/recommendation_engine.py` — Orchestrator

Calls all sub-engines in sequence, merges scores, applies the final formula, ranks results, and returns the top-N list.

```
User Request
     │
     ├─► DataLoader.load_user(user_id) ──────────────────► user profile
     ├─► DataLoader.load_destinations() ─────────────────► 20 destinations
     │
     ├─► PreferenceScorer.score(user, destinations) ──────► preference_scores[]
     ├─► SustainabilityEngine.score(destinations) ────────► sustainability_scores[]
     ├─► PopularityEngine.score(bookings, destinations) ──► popularity_scores[]
     ├─► CongestionEngine.score(month, destinations) ─────► congestion_scores[]
     │
     ├─► FinalScorer.compute(all scores + business rules) ► final_scores[]
     ├─► ConfidenceCalculator.compute() ─────────────────► confidence_scores[]
     ├─► ExplainabilityGenerator.generate() ─────────────► explanations[]
     │
     └─► sort by final_score, return top_n
```

### Scoring Formula Detail (`src/recommendation/scoring.py`)

```python
# Base formula
final = (
    0.45 * preference_score +
    0.25 * sustainability_score +
    0.15 * popularity_score +
    0.15 * congestion_score
)

# Business rules (applied additively, not multiplicatively)
if sustainability_score > 85:  final *= 1.05   # +5% green boost
if sustainability_score < 50:  final *= 0.90   # -10% penalty
if congestion_score < 40:      final *= 1.05   # +5% under-visited boost
if congestion_score > 80:      final *= 0.90   # -10% redistribution penalty

final_score = min(final, 100)
```

### Congestion Engine (`src/recommendation/congestion.py`)

Uses monthly data from `congestion_scores.csv` (derived from INE EOH table 49371). Each destination has 12 monthly values. The engine:
1. Reads the value for the requested month
2. Normalises to 0–100
3. Passes to the scoring formula

Destinations with congestion > 80 trigger the redistribution penalty — the core mechanism for demand redistribution.

---

## Frontend Architecture

### Page Router (`App.tsx`)

No React Router — navigation is managed via a `page` state variable in the root `App` component. This keeps the bundle small and avoids URL-based routing complexity.

```
App
├── ThemeProvider (dark/light mode context)
├── Header (nav + theme toggle)
├── page === "home"      → <Home />
├── page === "insights"  → <Insights month={activeMonth} recommendations={recs} />
├── page === "analytics" → <Analytics />
└── page === "about"     → <About />
```

### State Sharing

`App.tsx` holds:
- `activeMonth` — shared between Home search and Insights map/heatmap
- `recommendations` — results from the last search, passed to Insights for map highlighting

### Theme System

Two MUI themes defined in `theme/`:
- `darkTheme.ts` — `background.default: #0B1220`, `background.paper: #111827`
- `lightTheme.ts` — standard MUI light palette

`ThemeProvider.tsx` stores the mode in `localStorage` and provides a `useDarkMode()` hook.

### Component Hierarchy

```
Home.tsx
├── SearchBarHero (user input → triggers fetch)
├── KpiDashboard (summary metrics after search)
└── RecommendationGrid
    └── RecommendationCard × N
        ├── SustainabilityBadge
        ├── ConfidenceBadge
        ├── CongestionBadge
        └── Best Months chips

Insights.tsx
├── StatCard × 4
├── DestinationMap (Leaflet)
├── LowSeasonCard × N
├── CongestionHeatmap
└── ScenarioCard × 3

Analytics.tsx
├── KpiCard × 4
├── MonthlyChart (CSS bar chart)
├── Status breakdown (animated progress bars)
└── DestRow × 20 (filterable table)
```

---

## Data Flow — End to End

```
1. User enters U042, month=8, top_n=5 in SearchBarHero
2. Frontend POSTs to localhost:8000/recommendations
3. FastAPI validates request with Pydantic models
4. RecommendationEngine.recommend("U042", 8, 5)
   a. Loads U042 profile: { travel_style: "Nature", budget: "Medium", ... }
   b. Loads all 20 destinations
   c. Scores preference for each destination vs. U042 profile
   d. Reads sustainability scores
   e. Computes popularity from booking history
   f. Reads August congestion scores (index 7 in monthly array)
   g. Applies formula + business rules
   h. Calculates confidence
   i. Generates explanations
   j. Returns top 5, ranked by final_score
5. Frontend renders 5 RecommendationCards
6. Month=8 stored in App state → Insights map highlights the same destinations
```

---

## Data Sources

| Source | Dataset | Access | Used For |
|---|---|---|---|
| INE EOH | Table 49371 — hotel traveler nights by province | Free JSON API | Congestion scores |
| FRONTUR | Table 23988 — international arrivals by CCAA | Free JSON API | Sustainability enrichment |
| AEMET | Climate normals by station | Free API key required | Optional — not in base deployment |
| Synthetic | `users.csv`, `destinations.csv`, `bookings_history.csv` | CSV files | Preference + popularity scoring |

---

## Docker Deployment

The full stack can be run with a single command using Docker Compose.

### Files

| File | Purpose |
|---|---|
| `docker/Dockerfile.backend` | Python 3.11-slim image; runs `uvicorn` on port 8000 |
| `docker/Dockerfile.frontend` | Node 20 build stage → Nginx Alpine image; serves on port 80 |
| `docker-compose.yml` | Orchestrates both services with healthcheck; passes `AEMET_API_KEY` and `OPENAI_API_KEY` as env vars; references `docker/Dockerfile.*` |
| `docker/nginx.conf` | Nginx config for SPA routing — all 404s fall back to `index.html` |

### Usage

```bash
# Build and start both services
AEMET_API_KEY=your_key OPENAI_API_KEY=your_key docker compose up --build

# Frontend → http://localhost (port 80)
# Backend → http://localhost:8000
```

### Environment Variables

| Variable | Required | Used By |
|---|---|---|
| `OPENAI_API_KEY` | Required for Chat Assistant | `src/api/rag.py` — RAG chatbot |
| `AEMET_API_KEY` | Optional | `data/scripts/fetch_open_data.py` — climate data |

---

## Deployment Notes

- The system is designed for local development and academic demonstration
- No database — all data is CSV-based
- FastAPI + React can be deployed locally (manual) or via Docker Compose
- CORS allows `localhost:5173` (Vite dev server), `http://localhost`, and `http://localhost:80` (Docker/Nginx) — update `app.py` for production domains
- API keys (`AEMET_API_KEY`, `OPENAI_API_KEY`) must never be hardcoded — always use environment variables
