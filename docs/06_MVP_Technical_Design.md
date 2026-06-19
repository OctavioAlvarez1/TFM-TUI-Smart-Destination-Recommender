# MVP Technical Design and Functional Prototype

## 1. MVP Objective

The MVP validates the project's core hypothesis:

> "Personalised recommendations that incorporate sustainability criteria can redistribute part of the tourist demand without negatively affecting the user experience."

The MVP demonstrates the technical and business viability of the solution. **As of June 2026, the MVP is fully built and operational.**

---

## 2. MVP Scope

The system focuses exclusively on tourist destinations in Spain. The built system:

- Builds traveller profiles from user preferences and booking history.
- Calculates affinity levels between users and destinations.
- Calculates sustainability indicators per destination.
- Generates personalised, ranked recommendations.
- Provides plain-language explanations for each recommendation.
- Visualises impact metrics across 4 frontend pages.

**Frontend pages (all built):**
- **Destinations / Home** — Search form, recommendation results, KPI dashboard.
- **Insights** — Congestion map (Leaflet), Low Season Optimizer, congestion heatmap, redistribution scenarios.
- **Analytics** — Governance dashboard — penalised destinations, status breakdown, full destination table.
- **About** — Project context, scoring formula, architecture, project scope.

Additional features implemented: dark/light mode with localStorage persistence, interactive Leaflet map with CartoCDN tile switching, and Framer Motion animations.

---

## 3. Components Implemented

### Component 1: Tourism Dataset

The unified dataset contains information on:

**Destinations (20 total)**
Examples: Barcelona, Valencia, Malaga, Asturias, Cantabria, Zaragoza, Seville, Granada.

Variables: region, tourism type, popularity, capacity, congestion index, available activities, sustainability score, carbon score, local business score, public transport score.

**Data files (all in `data/raw/`):**
- `destinations.csv` — 20 destinations with beach/culture/nature/nightlife/family/price attributes.
- `users.csv` — 100 synthetic GDPR-compliant traveller profiles.
- `bookings_history.csv` — ~1,000 bookings for popularity calculation.
- `sustainability_scores.csv` — 20 records (carbon, local business, public transport, overall scores).
- `congestion_scores.csv` — 240 records (12 monthly congestion values per destination, from INE EOH).

**Open data integrated (`data/enriched/`):**
- `frontur_ccaa.csv` — FRONTUR Table 23988, international arrivals by CCAA.
- `ine_eoh_monthly.csv` — INE EOH Table 49371, hotel occupancy monthly by province.

### Component 2: User Profiling

Each user has a profile with the following variables:
- Beach preference.
- Nature preference.
- Cultural preference.
- Gastronomic preference.
- Budget.
- Travel period.

Example user profile: Beach: 9, Culture: 8, Nature: 3, Gastronomy: 7.

### Component 3: Affinity Engine

The engine calculates similarity between user and destination using content-based recommendation.

Advantages:
- Easy to explain.
- Does not require large historical data volumes.
- Ideal for MVP with cold-start users.

Result: Affinity Score between 0 and 100.

Implementation: `src/recommendation/popularity.py` — 70% booking volume + 30% average rating.

### Component 4: Sustainability Engine

Each destination has a Sustainability Score.

Variables:
- **Congestion** — Higher congestion → lower score.
- **Available capacity** — Higher capacity → higher score.
- **Regional diversification** — Less-visited destinations receive better scores.

Classifications: Excellent / Good / Moderate / Poor.

Result: Sustainability Score between 0 and 100.

Implementation: `src/recommendation/sustainability.py`

### Component 5: Ranking Engine

The ranking engine combines all sub-scores using the following weighted formula:

```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

**Business rules (multiplicative):**
- Sustainability > 85 → ×1.05 (+5% boost)
- Sustainability < 50 → ×0.90 (−10% penalty)
- Congestion < 40 → ×1.05 (+5% boost for low-congestion destinations)
- Congestion > 80 → ×0.90 (−10% redistribution trigger)

Generates a ranked list of recommendations (default: top 5).

Implementation: `src/recommendation/scoring.py`

**Confidence score** (shown per recommendation):
```
Confidence = 0.50 × Preference + 0.30 × Popularity + 0.20 × Sustainability
```

Implementation: `src/recommendation/confidence.py`

### Component 6: Explainability Engine

Each recommendation includes an automatically generated plain-language explanation.

Example:
> "Valencia was recommended because it matches your beach and gastronomy preferences and has a lower congestion level than Barcelona for your selected travel period."

Implementation: `src/recommendation/explainability.py`

### Component 7: Dashboard and Frontend

**React 19 frontend** (`frontend/`) — Visualises:

Business metrics:
- Simulated bookings.
- Conversion.

Sustainability metrics:
- Demand redistribution.
- Congestion index.

AI metrics:
- Top recommended destinations.
- Acceptance Rate.

**Streamlit dashboard** (`src/dashboard/app.py`) — Optional separate process at localhost:8501. Read-only view of the same metrics.

---

## 4. MVP Architecture

```
User
  |
React 19 Frontend (localhost:5173)
  |
FastAPI REST API (localhost:8000)
  |
RecommendationEngine (orchestrator)
  |
┌─────────────────────────────────────────┐
│  Preference  Sustainability  Popularity  │
│  Congestion  Confidence  Explainability  │
└─────────────────────────────────────────┘
  |
5 CSV files in data/raw/
```

---

## 5. Technology Stack

The MVP is built with the following stack:

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, Uvicorn |
| Data processing | Pandas |
| Frontend | React 19, TypeScript, Vite |
| UI components | Material UI v9, Framer Motion |
| Map | Leaflet (CartoCDN tiles, dark/light) |
| API | REST — POST /recommendations, GET /health, GET /users/{id} |
| Data storage | 5 CSV files in `data/raw/` |
| Open data | INE EOH + FRONTUR via `fetch_open_data.py` |
| Optional dashboard | Streamlit (separate process, localhost:8501) |
| Tests | Pytest (one file per module, real CSV data, no mocking) |
| Dev tools | GitHub, uvicorn --reload |

---

## 6. User Flow

1. The user selects preferences on the search form (Destinations page).
2. The system builds the user profile from submitted preferences.
3. The API calls the RecommendationEngine, which computes all sub-scores.
4. The ranking engine applies the weighted formula and business rules.
5. Recommendations are returned with scores, confidence, and plain-language explanations.
6. The user can explore congestion patterns on the Insights page and governance data on Analytics.

---

## 7. MVP Metrics

**Technical**
- Response time (target: under 500 ms locally).
- Recommendation precision.
- Destination coverage.

**Business**
- Acceptance Rate.
- Alternative destinations selected.

**Sustainability**
- Simulated congestion reduction.
- Increase in bookings at secondary destinations.

---

## 8. Deliverables

All deliverables are complete as of June 2026.

| Deliverable | Status |
|---|---|
| Source code (GitHub repository) | DELIVERED |
| REST API (FastAPI, localhost:8000) | DELIVERED |
| React 19 frontend (4 pages) | DELIVERED |
| Streamlit dashboard (optional) | DELIVERED |
| 5 CSV datasets in `data/raw/` | DELIVERED |
| Open data integration (INE + FRONTUR) | DELIVERED |
| Pytest test suite (one file per module) | DELIVERED |
| Technical documentation | DELIVERED |

---

## 9. Roadmap

**Phase 1 — MVP: COMPLETED (June 2026)**

Built and operational: recommendation engine, sustainability scoring, congestion scoring, REST API, React 19 frontend, Streamlit dashboard, pytest suite.

**Phase 2 — Pilot: Pending**

Requires real booking integration with TUI systems.
- A/B testing with live users.
- KPI validation against real booking data.
- Weight and algorithm adjustment.

**Phase 3 — Real Data Integration: Partially Complete**

- INE EOH Table 49371: integrated.
- FRONTUR Table 23988: integrated.
- AEMET weather data: available via `AEMET_API_KEY` environment variable (optional, never hardcoded).

**Phase 4 — TUI Integration: Future**

- Full integration with TUI digital channels.
- Enterprise scalability (GCP, BigQuery, Vertex AI, Cloud Run, Looker).
- Global production deployment.

---

## Conclusion

The built MVP successfully validates the business hypothesis using a simple, explainable, and scalable approach. The solution demonstrates how Artificial Intelligence can be used to promote more sustainable tourism without compromising the traveller's experience.

The full-stack implementation — FastAPI backend, React 19 frontend, and CSV-based data layer — provides a working prototype ready for pilot testing with real booking data.
