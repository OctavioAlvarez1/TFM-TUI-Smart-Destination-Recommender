# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TUI Smart Destination Recommender is a full-stack AI system that recommends sustainable travel destinations. It combines a Python recommendation engine (FastAPI + Streamlit) with a React/TypeScript frontend.

## Commands

### Backend

```bash
# Start FastAPI server (from project root)
python -m uvicorn src.api.app:app --reload --port 8000

# Start Streamlit dashboard
streamlit run src/dashboard/app.py

# Run all tests
python -m pytest tests/

# Run a single test file
python -m pytest tests/test_recommendation_engine.py -v

# Install Python dependencies
pip install -r requirements.txt
```

### Frontend

```bash
# From the frontend/ directory:
npm install
npm run dev       # Dev server at localhost:5173
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Architecture

### Backend — `src/`

The recommendation engine is a pipeline of independent scoring modules all orchestrated by `RecommendationEngine`:

```
src/
├── api/app.py              # FastAPI entry point (POST /recommendations, GET /health)
├── dashboard/app.py        # Streamlit UI (separate process, read-only view)
├── config/settings.py      # Paths to the 5 raw CSV files (resolved via pathlib)
├── data/loader.py          # Loads and merges all CSV datasets
├── recommendation/         # Core scoring modules
│   ├── engine.py           # Orchestrator — calls all sub-engines, returns ranked list
│   ├── popularity.py       # 70% booking volume + 30% ratings
│   ├── sustainability.py   # Classifies: Excellent/Good/Moderate/Poor
│   ├── congestion.py       # Monthly overtourism penalties
│   └── scoring.py          # Preference matching against user profile
├── explainability/         # Human-readable explanation generation
└── utils/                  # Shared helpers
```

**Final scoring formula** (in `recommendation/engine.py`):
```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

Business rules applied on top:
- Sustainability > 85 → +5% boost; Sustainability < 50 → −10% penalty
- Congestion < 40 → +5% boost; Congestion > 80 → −10% penalty

### Data — `data/raw/`

Five CSV files are the only data store (no database):
- `destinations.csv` — 20 destinations with attribute scores (beach, culture, nature, nightlife, family, price)
- `users.csv` — 100 synthetic users (travel_style, budget_level, sustainability_preference)
- `bookings_history.csv` — ~1000 bookings for popularity calculation
- `sustainability_scores.csv` — carbon, local business, public transport, overall scores
- `congestion_scores.csv` — monthly congestion levels per destination

### Frontend — `frontend/src/`

Single-page React app calling the FastAPI backend:

```
frontend/src/
├── main.tsx            # React entry point
├── App.tsx             # Root component with ThemeProvider
├── pages/Home.tsx      # Main page (recommendation form + results)
├── api/                # Axios client pointing to localhost:8000
├── components/         # Layout, charts, dashboard cards, common UI
├── theme/              # MUI theme configuration (dark/light)
└── types/              # TypeScript interfaces matching API response shape
```

The frontend expects the FastAPI server at `http://localhost:8000`. CORS is configured for `localhost:5173`.

### Tests — `tests/`

One test file per backend module (pytest). Tests use the actual CSV data from `data/raw/` via `settings.py` — no mocking of data access. Run from the project root so `src/config/settings.py` resolves paths correctly.
