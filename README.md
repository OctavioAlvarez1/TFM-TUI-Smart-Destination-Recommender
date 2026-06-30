# Horizon — Smart Destination Recommender

> AI-powered sustainable travel recommendation system for Spain.  
> Trabajo Final de Máster · Universidad Complutense de Madrid · TUI Care Foundation · Future Shapers Spain

---

## What It Does

Horizon addresses Spain's over-tourism problem: **96.8 million tourists per year**, but 85% of them visit the same 10% of destinations. The system uses a multi-criteria AI engine to recommend sustainable, less-saturated alternatives that match each traveler's preferences — redistributing demand away from congested hotspots.

**Scoring formula:**

```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

Business rules on top:
- Sustainability > 85 → +5% boost · Sustainability < 50 → −10% penalty
- Congestion < 40 → +5% boost · Congestion > 80 → −10% redistribution penalty

---

## Stack

| Layer | Technology |
|---|---|
| API | Python · FastAPI · Uvicorn |
| Recommendation Engine | Python · Pandas · Scikit-learn |
| Alternative Dashboard | Streamlit |
| Frontend | React 19 · TypeScript · Vite |
| UI Components | Material UI v9 |
| Animations | Framer Motion |
| Map | Leaflet · React-Leaflet |
| Data | INE (EOH + FRONTUR) · AEMET · Synthetic CSVs |

---

## Project Structure

```
├── src/                        # Python backend
│   ├── api/                    # FastAPI (POST /recommendations, GET /health, GET /users/:id, POST /chat)
│   ├── recommendation/         # Scoring engines (preference, sustainability, popularity, congestion)
│   ├── dashboard/              # Streamlit alternative UI
│   ├── data/                   # Data loader (CSV → DataFrame)
│   └── config/                 # Path settings
├── frontend/                   # React 19 SPA
│   └── src/
│       ├── pages/              # Home, Insights, Analytics, About
│       ├── components/         # RecommendationCard, SearchBarHero, Map, ChatWidget…
│       ├── api/                # Axios clients → FastAPI
│       └── theme/              # MUI v9 dark/light theme
├── docker/                     # Dockerfile.backend, Dockerfile.frontend, nginx.conf
├── data/
│   ├── raw/                    # 5 CSV files (destinations, users, bookings, sustainability, congestion)
│   ├── enriched/               # INE EOH + FRONTUR open data
│   └── scripts/                # fetch_open_data.py — refresh from INE/AEMET APIs
├── tests/                      # Pytest suite (one file per module)
├── notebooks/                  # Data generation notebooks
└── docs/
    ├── guides/                 # ARCHITECTURE, API_REFERENCE, USER_MANUAL, PROJECT_CONTEXT
    ├── design/                 # 14 TFM design docs (01–14) + DESIGN_SYSTEM
    └── report/                 # TFM_HORIZON.md + TFM_HORIZON.pdf
```

See [docs/README.md](docs/README.md) for a full documentation index.

---

## Quick Start

### Option A — Docker (recommended)

```bash
# Set your OpenAI key for the RAG chatbot (optional — app works without it)
export OPENAI_API_KEY=sk-...

docker compose up --build
```

Backend: `http://localhost:8000` · Frontend: `http://localhost:80`

### Option B — Local Dev

#### Prerequisites: Python 3.11+ · Node.js 20+

```bash
# 1 — Backend
pip install -r requirements.txt
python -m uvicorn src.api.app:app --reload --port 8000

# 2 — Frontend (new terminal)
cd frontend
npm install
npm run dev          # localhost:5173
```

Open `http://localhost:5173` in your browser.

### Optional: Streamlit Dashboard

```bash
streamlit run src/dashboard/app.py
```

---

## Using the App

1. **Enter a Traveler Profile** — type a user ID (e.g. `U001` – `U100`). The search bar auto-loads the traveler's style, budget and sustainability preference.
2. **Select a Travel Month** — the congestion scoring adjusts for the chosen month.
3. **Choose how many Destinations** — set top N (1–20).
4. **Click Search** — results appear ranked by final score with explanations.

### Pages

| Page | Description |
|---|---|
| **Destinations** | Run searches, view ranked recommendation cards with score breakdowns |
| **Insights** | Spain congestion map, Low Season Optimizer, monthly heatmap, redistribution scenarios |
| **Analytics** | Governance dashboard — penalised destinations, redistribution activity, destination status |
| **About** | Project context, scoring formula, 5-layer architecture, project scope |

---

## API Reference

**Base URL:** `http://localhost:8000`

### `POST /recommendations`

```json
// Request
{ "user_id": "U001", "month": 7, "top_n": 5 }

// Response (array)
[{
  "destination_id": "D019",
  "destination_name": "Picos de Europa",
  "final_score": 82.4,
  "preference_score": 78.0,
  "sustainability_score": 91.0,
  "popularity_score": 65.0,
  "congestion_score": 85.0,
  "confidence_score": 76.5,
  "recommendation_rank": 1,
  "explanations": ["Matches your Nature travel style", "Excellent sustainability rating"]
}]
```

### `POST /chat` — RAG Chatbot

```json
// Request
{ "message": "¿Qué destinos sostenibles recomiendas en verano?", "history": [] }

// Response
{ "reply": "Para el verano te recomiendo..." }
```

Requires `OPENAI_API_KEY` env variable. Returns a graceful fallback if not set.

### `GET /health`

Returns `{ "status": "ok" }`.

### `GET /users/{user_id}`

Returns the traveler profile for a given user ID.

Full API docs: [docs/guides/API_REFERENCE.md](docs/guides/API_REFERENCE.md)

---

## Data

All data lives in `data/raw/` as CSV files — no database required.

| File | Records | Description |
|---|---|---|
| `destinations.csv` | 20 | Destination attributes (beach, culture, nature, nightlife, family, price) |
| `users.csv` | 100 | Synthetic GDPR-compliant traveler profiles |
| `bookings_history.csv` | ~1,000 | Historical bookings for popularity scoring |
| `sustainability_scores.csv` | 20 | Carbon, local business, transport, overall scores |
| `congestion_scores.csv` | 20 × 12 | Monthly congestion levels (from INE EOH hotel data) |

### Refreshing Open Data

```bash
# Set env variable (never hardcode)
export AEMET_API_KEY=your_key_here   # optional

# Fetch latest INE + FRONTUR data
python data/scripts/fetch_open_data.py
```

---

## Tests

```bash
# Run all tests
python -m pytest tests/

# Run a single module
python -m pytest tests/test_recommendation_engine.py -v
```

Tests use real CSV data — no mocking. Always run from the project root.

---

## Documentation

| Path | Description |
|---|---|
| [docs/guides/ARCHITECTURE.md](docs/guides/ARCHITECTURE.md) | System architecture, 5-layer design, data flow |
| [docs/guides/API_REFERENCE.md](docs/guides/API_REFERENCE.md) | Full REST API spec with curl/JS/Python examples |
| [docs/guides/USER_MANUAL.md](docs/guides/USER_MANUAL.md) | End-user guide — scores, pages, troubleshooting |
| [docs/report/TFM_HORIZON.pdf](docs/report/TFM_HORIZON.pdf) | Academic report (PDF) |
| [docs/design/](docs/design/) | 14 TFM design docs — business case, AI design, data model, cloud arch, engine design, frontend, dashboard, blueprint |
| [docs/README.md](docs/README.md) | Full documentation index |

---

## Alignment with SDG 8.9

This project is built in response to the TUI Care Foundation's **Future Shapers Spain** challenge (Reto 2 — AI Recommendation & Demand Redistribution), targeting UN SDG 8.9:

> *"By 2030, devise and implement policies to promote sustainable tourism that creates jobs and promotes local culture and products."*

**Targets:**
- 5–10% demand shift from saturated to sustainable destinations
- 200+ alternative destinations with growth potential identified
- 20–30% recommendation acceptance rate
- +10% annual growth in bookings for less-visited destinations

---

## License

Academic project — Universidad Complutense de Madrid · 2026.  
Open data: INE (CC BY 4.0), FRONTUR (CC BY 4.0).
