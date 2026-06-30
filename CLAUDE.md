# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Horizon** is a full-stack AI system that recommends sustainable travel destinations in Spain. It addresses over-tourism concentration (85% of visitors go to 10% of destinations) by using a weighted scoring formula to surface less-saturated, more sustainable alternatives.

- **Backend**: Python · FastAPI · pandas (recommendation engine + REST API)
- **Frontend**: React 19 · TypeScript · Vite · Material UI v9 (dark/light mode SPA)
- **Data**: 5 CSV files + open data from INE (EOH) and FRONTUR

## Commands

### Backend

```bash
# Start FastAPI server (from project root)
python -m uvicorn src.api.app:app --reload --port 8000

# Start Streamlit dashboard (separate process, optional)
streamlit run src/dashboard/app.py

# Run all tests
python -m pytest tests/

# Run a single test file
python -m pytest tests/test_recommendation_engine.py -v

# Install Python dependencies
pip install -r requirements.txt

# Refresh open data from INE/FRONTUR APIs
python data/scripts/fetch_open_data.py

# Run full stack with Docker (backend on :8000, frontend on :80)
docker compose up --build
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

Independent scoring modules orchestrated by `RecommendationEngine`:

```
src/
├── api/
│   ├── app.py              # FastAPI entry point — POST /recommendations, GET /health, GET /users/:id, POST /chat
│   ├── models.py           # Pydantic request/response models
│   └── rag.py              # RAG chatbot — FAISS + text-embedding-3-small + GPT-4o-mini; POST /chat
├── config/settings.py      # Absolute paths to all 5 CSVs (pathlib — no hardcoding)
├── data/data_loader.py     # Centralised CSV → DataFrame access layer
├── recommendation/
│   ├── recommendation_engine.py  # Orchestrator — calls all sub-engines, returns ranked list
│   ├── scoring.py          # Final weighted formula + business rule boosts/penalties
│   ├── popularity.py       # 70% booking volume + 30% average rating → 0-100
│   ├── sustainability.py   # Classifies Excellent/Good/Moderate/Poor, applies boosts
│   ├── congestion.py       # Monthly INE data → congestion score, applies redistribution penalty
│   ├── confidence.py       # 0.50×pref + 0.30×pop + 0.20×sust → confidence score
│   └── explainability.py   # Plain-language explanation strings per recommendation
├── dashboard/app.py        # Streamlit UI (separate process, read-only)
└── utils/                  # Shared helpers
```

**Scoring formula** (`recommendation/scoring.py`):
```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

Business rules (multiplicative):
- Sustainability > 85 → ×1.05 (+5%); Sustainability < 50 → ×0.90 (−10%)
- Congestion < 40 → ×1.05 (+5%); Congestion > 80 → ×0.90 (−10% redistribution trigger)

### Data — `data/raw/`

No database — all state is in 5 CSV files:
- `destinations.csv` — 20 destinations: beach/culture/nature/nightlife/family/price attributes
- `users.csv` — 100 synthetic GDPR-compliant traveler profiles
- `bookings_history.csv` — ~1,000 bookings for popularity calculation
- `sustainability_scores.csv` — carbon, local business, public transport, overall scores
- `congestion_scores.csv` — 12 monthly congestion values per destination (from INE EOH)

Open data in `data/enriched/`:
- `frontur_ccaa.csv` — FRONTUR international arrivals by CCAA
- `ine_eoh_monthly.csv` — INE hotel occupancy monthly by province

### Frontend — `frontend/src/`

Single-page app with page-state router (no React Router):

```
frontend/src/
├── App.tsx                 # Root — manages page, activeMonth and recommendations state
├── pages/
│   ├── Home.tsx            # Search form + recommendation results + KPI dashboard
│   ├── Insights.tsx        # Congestion map, Low Season Optimizer, heatmap, redistribution scenarios
│   ├── Analytics.tsx       # Governance dashboard — penalised destinations, status breakdown, table
│   └── About.tsx           # Project context, scoring formula, architecture, project scope
├── api/recommendationApi.ts # Axios client → localhost:8000
├── components/
│   ├── home/               # SearchBarHero, FeatureSection, HeroSection, DestinationShowcase
│   ├── recommendations/    # RecommendationCard, Grid, Badges (Sustainability/Confidence/Congestion)
│   ├── map/DestinationMap.tsx  # Leaflet map — switches tile layer between light_all/dark_all
│   ├── dashboard/KpiDashboard.tsx  # Summary metrics after a search
│   ├── chat/ChatWidget.tsx # Floating Fab + Drawer RAG chat UI — present on all pages
│   ├── layout/             # Header, Footer, MainLayout, MegaMenu
│   └── common/             # ThemeToggle, LoadingSpinner, EmptyState, ErrorMessage
├── theme/
│   ├── ThemeProvider.tsx   # Dark/light context + localStorage persistence
│   ├── darkTheme.ts        # background.default:#0B1220, background.paper:#111827
│   └── lightTheme.ts       # Standard MUI light palette
└── types/recommendation.ts # TypeScript interfaces matching API response shape
```

Frontend expects FastAPI at `http://localhost:8000`. CORS allows `localhost:5173`.

### Tests — `tests/`

One pytest file per backend module. Tests use real CSV data from `data/raw/` — no mocking.  
Always run from the **project root** so `src/config/settings.py` resolves paths correctly.

## Key Patterns

### MUI v9 — Dark Mode

All color values must use MUI theme tokens in `sx` props (not hardcoded hex):
- Text: `color: "text.primary"` / `color: "text.secondary"` (never `#0F172A` / `#64748B`)
- Borders: `border: "1px solid"` + `borderColor: "divider"` (never `rgba(226,232,240,.8)`)
- Dynamic backgrounds: use `useTheme()` hook → `const dark = theme.palette.mode === "dark"`
- Inline `style` (not `sx`): must use conditional — `dark ? "#F1F5F9" : "#0F172A"`
- `InputProps` is deprecated in v9 → use `slotProps={{ input: {...}, htmlInput: {...} }}`

### Map Tiles

`DestinationMap.tsx` switches CartoCDN tile URL based on `dark`:
- Light: `light_all/{z}/{x}/{y}{r}.png`
- Dark: `dark_all/{z}/{x}/{y}{r}.png`

### State Sharing

`activeMonth` and `recommendations` live in `App.tsx` and flow down as props. The Insights page uses both to highlight the user's searched destinations on the map and heatmap.

### RAG Chatbot — POST /chat

`src/api/rag.py` implements a retrieval-augmented generation chatbot. On the first `/chat` request it builds a FAISS `IndexFlatIP` from `destinations.csv`, `sustainability_scores.csv`, and `congestion_scores.csv` (one rich-text document per destination, embedded via `text-embedding-3-small`). Queries retrieve top-k documents and pass them as context to GPT-4o-mini.

`OPENAI_API_KEY` must be set as an environment variable before starting the server. If missing, the endpoint returns a graceful fallback message without raising an exception.

### AEMET API Key

Must **only** be set as environment variable `AEMET_API_KEY`. Never hardcode in any file or commit to the repository.

## Documentation

- `docs/guides/USER_MANUAL.md` — end-user guide (how to use the app, score interpretation, troubleshooting)
- `docs/guides/ARCHITECTURE.md` — system architecture, 5-layer design, data flow
- `docs/guides/API_REFERENCE.md` — full REST API spec with examples
- `docs/design/` — 14 TFM design docs (01–14) + DESIGN_SYSTEM.md
- `docs/report/` — TFM_HORIZON.md + TFM_HORIZON.pdf (academic report)
- `docs/README.md` — documentation navigation index
- `data/README_SOURCES.md` — open data sources and refresh instructions
