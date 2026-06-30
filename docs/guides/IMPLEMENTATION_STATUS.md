# TUI Smart Destination Recommender – Project Context

## New Additions (Latest Release)

The following features have been added since the initial implementation phase:

- **Docker Containerization**: `docker/Dockerfile.backend`, `docker/Dockerfile.frontend` (Node + Nginx), `docker/nginx.conf`, `docker-compose.yml` (root), `.dockerignore`. Run the full stack with `docker compose up --build`. Backend on port 8000, frontend on port 80.
- **RAG Chatbot**: `src/api/rag.py` — FAISS + OpenAI `text-embedding-3-small` + GPT-4o-mini. Endpoint `POST /chat`. Requires `OPENAI_API_KEY` env var; graceful fallback message if missing.
- **ChatWidget**: `frontend/src/components/chat/ChatWidget.tsx` — floating Fab button with a Drawer conversation UI, present on all pages.
- **TFM Report**: `docs/report/TFM_HORIZON.md` + `docs/report/TFM_HORIZON.pdf` — full academic report for the TFM submission.

---

## Project Overview

This project is a complete AI-powered tourism recommendation platform for the TUI Smart Destination Challenge.

The solution recommends sustainable destinations while balancing:

* User preferences
* Sustainability performance
* Destination popularity
* Tourism congestion management

The project follows an enterprise architecture approach and has been built incrementally from design through full-stack deployment.

---

# Documentation Status

The design phase has been completed.

Completed documents:

1. Business Problem & Vision
2. Solution Overview
3. Cloud Architecture
4. Sustainability Framework
5. Congestion Management Strategy
6. AI Recommendation Strategy
7. Data Model & Synthetic Dataset Design
8. Dataset Construction
9. Data Dictionary & Metadata
10. Data Validation & Quality Assurance Report
11. Recommendation Engine Design
12. Real Data Enrichment Strategy
13. Explainable AI Framework
14. Executive Dashboard Design
15. Final Solution Blueprint

Documentation is considered complete and approved.

---

# Current Repository Structure

Main project folders:

```text
data/
docker/
  Dockerfile.backend
  Dockerfile.frontend
  nginx.conf
docs/
frontend/
notebooks/
src/
tests/
docker-compose.yml
```

---

# Data Layer

## Configuration

File:

```text
src/config/settings.py
```

Purpose:

Centralized configuration and dataset paths.

Configured datasets:

* destinations.csv
* users.csv
* bookings_history.csv
* sustainability_scores.csv
* congestion_scores.csv

---

## Data Loader

File:

```text
src/data/data_loader.py
```

Purpose:

Centralized access layer for all datasets.

Implemented methods:

* load_destinations()
* load_users()
* load_bookings()
* load_sustainability()
* load_congestion()

Features:

* CSV loading
* Automatic removal of Excel-generated unnamed columns
* Standardized data access

---

# Datasets

## destinations.csv

Purpose:

Master destination dataset.

Columns:

```text
destination_id
destination_name
region
destination_type
beach_score
culture_score
nature_score
nightlife_score
family_friendly_score
avg_price_per_day
```

Contains:

* 20 destinations

---

## users.csv

Purpose:

Synthetic traveler profiles.

Columns:

```text
user_id
country
age_group
budget_level
travel_style
sustainability_preference
```

Contains:

* 100 synthetic users

Travel styles include:

* Nature
* Relax
* Family
* Nightlife
* Culture

---

## bookings_history.csv

Purpose:

Historical booking behavior.

Columns:

```text
booking_id
user_id
destination_id
booking_date
travel_month
stay_days
total_price
user_rating
```

Used for:

* Popularity calculations
* Historical behavior analysis
* Recommendation confidence

---

## sustainability_scores.csv

Purpose:

Destination sustainability assessment.

Columns:

```text
destination_id
carbon_score
local_business_score
public_transport_score
sustainability_score
```

Used for:

* Sustainability ranking
* Sustainability business rules

---

## congestion_scores.csv

Purpose:

Monthly tourism congestion analysis.

Columns:

```text
destination_id
month
congestion_score
congestion_level
```

Used for:

* Overtourism management
* Seasonal recommendations
* Congestion-aware scoring

---

# Recommendation Engine Architecture

Current implementation follows a modular architecture.

```text
Recommendation Engine
│
├── Data Loader
│
├── Popularity Engine
│
├── Sustainability Engine
│
├── Congestion Engine
│
├── Scoring Engine
│
└── Ranking Logic
```

---

# Implemented Components

## Scoring Engine

File:

```text
src/recommendation/scoring.py
```

Responsibilities:

* Preference Score calculation
* Congestion Adjustment calculation
* Final Score calculation

Official formula:

Final Score =
(0.45 × Preference Score)
+
(0.25 × Sustainability Score)
+
(0.15 × Popularity Score)
+
(0.15 × Congestion Adjustment)

Business rules:

### Sustainability

If Sustainability Score > 85

```text
+5% boost
```

If Sustainability Score < 50

```text
-10% penalty
```

### Congestion

If Congestion Score < 40

```text
+5% boost
```

If Congestion Score > 80

```text
-10% penalty
```

---

## Preference Mapping

Current mapping:

| Travel Style | Destination Attribute |
| ------------ | --------------------- |
| Nature       | nature_score          |
| Relax        | beach_score           |
| Family       | family_friendly_score |
| Nightlife    | nightlife_score       |
| Culture      | culture_score         |

Preference score is normalized to a 0–100 scale.

---

## Popularity Engine

File:

```text
src/recommendation/popularity.py
```

Purpose:

Calculate destination popularity.

Popularity components:

* Booking volume (70%)
* Average rating (30%)

Output:

```text
popularity_score
```

Normalized between:

```text
0 – 100
```

---

## Sustainability Engine

File:

```text
src/recommendation/sustainability.py
```

Implemented functions:

* get_sustainability_score()
* classify_sustainability()
* get_score_multiplier()

Classifications:

```text
Excellent
Good
Moderate
Poor
```

---

## Congestion Engine

File:

```text
src/recommendation/congestion.py
```

Implemented functions:

* get_congestion_score()
* classify_congestion()
* get_congestion_adjustment()
* get_score_multiplier()

Purpose:

Support congestion-aware recommendations.

---

## Recommendation Engine

File:

```text
src/recommendation/recommendation_engine.py
```

Current functionality:

```python
engine.recommend(
    user_id="U001",
    month=7,
    top_n=5
)
```

Process:

1. Load user profile
2. Evaluate all destinations
3. Calculate preference score
4. Calculate popularity score
5. Retrieve sustainability score
6. Retrieve congestion score
7. Calculate final score
8. Rank destinations
9. Return Top-N recommendations

Current output:

```python
[
    {
        "destination_id": "...",
        "destination_name": "...",
        "final_score": ...,
        "preference_score": ...,
        "popularity_score": ...,
        "sustainability_score": ...,
        "congestion_score": ...
    }
]
```

---

## Explainability Engine

File:

```text
src/recommendation/explainability.py
```

Generates plain-language explanation strings for each recommendation, surfacing the dominant scoring factors to the user.

Status: **Completed**

---

## Confidence Score Engine

File:

```text
src/recommendation/confidence.py
```

Formula: `0.50 × preference + 0.30 × popularity + 0.20 × sustainability`

Output: per-recommendation confidence score (0–100).

Status: **Completed**

---

## FastAPI REST API

Files:

```text
src/api/app.py
src/api/models.py
```

Endpoints:

* `POST /recommendations` — ranked destination list for a user/month
* `GET /health` — liveness check
* `GET /users/:id` — user profile lookup
* `POST /chat` — RAG-powered chatbot (see below)

Status: **Completed**

---

## RAG Chatbot

File:

```text
src/api/rag.py
```

Technology: FAISS IndexFlatIP + OpenAI `text-embedding-3-small` + GPT-4o-mini.

Endpoint: `POST /chat`

Behavior: On first request, builds an in-memory FAISS vector store from `destinations.csv`, `sustainability_scores.csv`, and `congestion_scores.csv`. Subsequent queries use similarity search to retrieve context and generate answers via GPT-4o-mini.

Requires: `OPENAI_API_KEY` environment variable. If missing, returns a graceful fallback message.

Status: **Completed**

---

## Streamlit Dashboard

File:

```text
src/dashboard/app.py
```

Separate process (read-only). Start with:

```bash
streamlit run src/dashboard/app.py
```

Status: **Completed**

---

## React SPA Frontend

Directory:

```text
frontend/
```

Stack: React 19 · TypeScript · Vite · Material UI v9 · Leaflet

Pages: Home, Insights, Analytics, About

Key components: ChatWidget (RAG chat), DestinationMap (Leaflet), RecommendationCard, KpiDashboard

Status: **Completed**

---

## Docker Deployment

Files:

```text
docker/Dockerfile.backend
docker/Dockerfile.frontend
docker/nginx.conf
docker-compose.yml
.dockerignore
```

Run the full stack:

```bash
docker compose up --build
```

Backend available at `http://localhost:8000`. Frontend available at `http://localhost:80`.

Status: **Completed**

---

# Tests Implemented

Files:

```text
tests/test_loader.py
tests/test_scoring.py
tests/test_popularity.py
tests/test_sustainability.py
tests/test_congestion.py
tests/test_recommendation_engine.py
```

Status:

All tests executed successfully.

---

# Current Project Status

Completed:

* Project structure
* Configuration layer
* Data loading layer
* Dataset validation
* Popularity Engine
* Sustainability Engine
* Congestion Engine
* Scoring Engine
* Recommendation Engine MVP
* Explainability Engine
* Confidence Score Engine
* Streamlit Dashboard
* FastAPI REST API
* React SPA Frontend
* Docker containerization
* RAG Chatbot (`POST /chat`)
* TFM Report (`docs/report/TFM_HORIZON.md` + `docs/report/TFM_HORIZON.pdf`)

---

# Important Notes

The full stack is deployed and functional. All design documents (01–15) have been implemented.

The goal has been achieved:

* Full consistency between documentation and code.
* No divergence from the original architecture.
* Enterprise-grade project quality.
* Readiness for final presentation and TFM submission.
