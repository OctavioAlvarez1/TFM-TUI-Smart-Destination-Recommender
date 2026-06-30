# Solution Architecture and Technical Design

## Horizon — TUI Smart Destination Recommender

---

# 1. Architecture Overview

The proposed solution is an intelligent recommendation platform capable of redistributing tourist demand by analyzing traveler preferences, destination sustainability, and congestion indicators.

The architecture has been designed under principles of scalability, modularity, and data orientation, allowing the system to evolve from an MVP toward an enterprise solution deployed across multiple markets.

The platform is composed of five main layers:

1. Data Sources
2. Data Platform
3. Artificial Intelligence Engine
4. Services and APIs Layer
5. Visualization and Monitoring

> **Note:** The MVP implementation uses CSV-based storage and a local FastAPI server rather than a cloud data platform. The Data Lake, Feature Store, and cloud infrastructure described in later sections represent the production-scale enterprise architecture. The MVP tech stack is Python, FastAPI, Pandas, Uvicorn (backend) and React 19, TypeScript, Vite, Material UI v9, Framer Motion, and Leaflet (frontend), with data stored in 5 CSV files and an optional Streamlit dashboard.

---

# 2. High-Level Architecture

## General Flow

```
Data Sources
    ↓
Ingestion and Processing
    ↓
Data Lake
    ↓
Feature Store
    ↓
Recommendation Engine
    ↓
Recommendation APIs
    ↓
TUI Digital Channels
    ↓
Impact and Sustainability Dashboard
```

---

# 3. Data Sources

The platform consumes information from different business domains.

## Booking Data

Historical information including:
- Reserved destinations.
- Travel dates.
- Length of stay.
- Number of passengers.
- Accommodation type.

## Customer Data

- Declared preferences.
- Booking history.
- Digital interactions.
- Customer segmentation.

## Inventory Data

- Hotel availability.
- Occupancy.
- Available activities.
- Destination capacity.

## External Data

- Climate indicators (AEMET, available via `AEMET_API_KEY` environment variable).
- Local events.
- Tourism calendars.
- Open tourism data.

## Sustainability Data

- Tourist congestion indices (INE EOH Table 49371 — monthly hotel occupancy by province).
- Estimated capacity per destination.
- Environmental indicators.
- Tourist pressure metrics.

## Open Data Integrated in the MVP

- **INE EOH Table 49371** — monthly hotel occupancy data, fetched via `data/scripts/fetch_open_data.py` and stored in `data/enriched/ine_eoh_monthly.csv`.
- **FRONTUR Table 23988** — international arrivals by autonomous community, stored in `data/enriched/frontur_ccaa.csv`.

---

# 4. Data Platform

## Data Lake

The Data Lake centralizes all structured and semi-structured platform information.

Objectives:
- Scalable storage.
- Data historization.
- Information reprocessing.
- Governance and traceability.

Recommended layers:

### Raw Layer
Data stored without transformation.

### Curated Layer
Clean and standardized data.

### Business Layer
Information ready for analytical consumption and model training.

---

# 5. Feature Store

The Feature Store enables reuse of variables calculated by Artificial Intelligence models.

## User Features

- Previously visited destinations.
- Travel preferences.
- Preferred tourism type.
- Booking seasonality.

## Destination Features

- Historical popularity.
- Occupancy level.
- Sustainability index.
- Available capacity.

## Contextual Features

- Search date.
- Season.
- Expected weather.
- Nearby events.

The Feature Store ensures consistency between training and inference.

---

# 6. Artificial Intelligence Engine

The core of the solution is a hybrid recommendation engine.

## Affinity Component

Determines which destinations have the highest probability of being relevant for each user.

## Sustainability Component

Calculates the potential impact of each recommendation on the distribution of tourist demand.

## Popularity Component

Scores destinations based on booking volume (70% weight) and average rating (30% weight), producing a normalized 0–100 value.

## Congestion Component

Uses monthly INE data to calculate a congestion score per destination. Higher scores indicate higher congestion. The congestion score is used directly in the formula — a more congested destination scores worse.

## Intelligent Ranking

Combines all components to generate the final recommendation. The actual implemented formula is:

```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

Business rules applied multiplicatively:
- Sustainability > 85 → ×1.05 (+5% green boost)
- Sustainability < 50 → ×0.90 (−10% penalty)
- Congestion < 40 → ×1.05 (+5% under-visited bonus)
- Congestion > 80 → ×0.90 (−10% redistribution penalty)

The result is a prioritized list of recommended destinations for each user.

---

# 7. Sustainability Scoring Engine

A dedicated engine measures tourist sustainability.

## Objectives

- Detect saturated destinations.
- Prioritize destinations with available capacity.
- Incentivize demand redistribution.

## Input Variables

- Occupancy level.
- Estimated maximum capacity.
- Seasonality.
- Historical visitor flow.
- Environmental indicators.

## Output

Each destination receives a Sustainability Score (0–100) used by the recommendation engine. Scores are classified as:
- Excellent (> 85)
- Good (70–85)
- Moderate (50–70)
- Poor (< 50)

---

# 8. APIs and Services Layer

The platform exposes decoupled services through APIs.

## Recommendation API

`POST /recommendations` — generates personalized recommendations.

## User Profile API

`GET /users/{id}` — retrieves consolidated traveler information.

## Health API

`GET /health` — service health check.

## Chat / RAG API

`POST /chat` — conversational AI endpoint. Accepts `{"message": str, "history": [...]}` and returns `{"reply": str}`. Implemented in `src/api/rag.py` using FAISS (`IndexFlatIP`) for semantic retrieval over destination data and `gpt-4o-mini` for response generation. Requires `OPENAI_API_KEY` environment variable; degrades gracefully if missing.

This architecture facilitates integration with TUI web applications, mobile apps, and internal systems.

---

# 9. Consumption Channels

Recommendations can be integrated into:

## TUI Website

During the search and booking process.

## Mobile Application

Personalized experiences for travelers.

## Marketing Campaigns

Personalized recommendations via email or push notifications.

## Travel Agents

Support tools for customer service.

---

# 10. Executive Dashboard

A dashboard has been built to monitor the impact of the solution.

## Main Indicators

- Demand redistribution.
- Reduction of tourist pressure.
- Secondary destination occupancy.
- Recommendation acceptance rate.
- Economic impact.
- Sustainability indicators.

The dashboard allows measurement of both business results and environmental and social impact. The MVP includes a Streamlit-based dashboard (backend) and an Analytics governance page in the React frontend.

---

# 11. Scalability and Evolution

The architecture has been designed to evolve progressively.

## Phase 1 — MVP (Complete)

- Basic recommendations via weighted scoring formula.
- Tourist congestion index using INE and FRONTUR open data.
- React frontend with four pages: Destinations, Insights, Analytics, About.
- FastAPI backend with CSV-based data.
- Streamlit impact dashboard.
- RAG chatbot (`src/api/rag.py`) with floating ChatWidget on all pages.
- Docker deployment via `docker-compose.yml` (backend on :8000, frontend on :80).

## Phase 2 — Production

- Advanced personalization.
- Continuous learning models.
- Real-time integration with booking systems.
- Cloud data platform (Data Lake + Feature Store).

## Phase 3 — Global Platform

- Multiple countries.
- Dynamic optimization.
- Real-time contextual recommendations.

---

# 12. Expected Benefits

## For TUI

- Better utilization of tourism inventory.
- Increased occupancy in secondary destinations.
- Competitive differentiation.
- Fulfillment of ESG objectives.

## For Travelers

- Discovery of new destinations.
- Personalized experiences.
- Lower exposure to saturated destinations.

## For Local Communities

- More balanced distribution of visitors.
- Less pressure on infrastructure.
- Greater regional economic impact.

## For Sustainability

- Reduction of overtourism.
- More efficient use of tourism resources.
- Contribution to Sustainable Development Goal 8.9.
