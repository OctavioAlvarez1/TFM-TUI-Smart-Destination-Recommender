# Horizon — User Manual

> Complete guide to using the Horizon Smart Destination Recommender.

---

## 1. Getting Started

### Start the System

You need two terminal windows running simultaneously.

**Terminal 1 — Backend API:**
```bash
# From the project root
python -m uvicorn src.api.app:app --reload --port 8000
```
You should see: `Uvicorn running on http://127.0.0.1:8000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 2. The Four Pages

### Destinations (Home)

The main page where you search for personalized recommendations.

**How to use:**

1. **Traveler Profile field** — Type a user ID from `U001` to `U100`.
   - After 400ms, the bar auto-loads the traveler's profile as chips:
     - Travel style (Nature / Relax / Culture / Family / Nightlife / Adventure)
     - Budget level (Low / Medium / High)
     - Eco preference (Low / Medium / High)
     - Country and age group

2. **Travel Month field** — Select the month you plan to travel.
   - The congestion scoring adjusts automatically: summer months penalise beach destinations, winter months may favour Canary Islands.

3. **Destinations field** — How many recommendations to show (default: 5, max: 20).

4. **Click Search** — Results appear ranked by final score.

**Reading a Recommendation Card:**

```
┌─────────────────────────────────────────────────────────────────┐
│  #1  │  Picos de Europa                         Spain           │
│  82  │  ★ Excellent sustainability                              │
│      │  ● High confidence   ▲ Moderate congestion              │
│ Rank │  ┌──────────┬──────────┬──────────┬──────────┐          │
│Score │  │Preference│Sustain.  │Popularity│Congestion│          │
│      │  │   78     │   91     │   65     │   85     │          │
│      │  └──────────┴──────────┴──────────┴──────────┘          │
│      │  Why Horizon Recommended This:                           │
│      │  ✓ Matches your Nature travel style                      │
│      │  ✓ Excellent sustainability rating                       │
│      │  ✓ Less-visited in your travel month                     │
│      │  Best Months to Visit: Jan · Feb · Mar                   │
└─────────────────────────────────────────────────────────────────┘
```

- **Rank number** — coloured gold/silver/bronze for top 3
- **Score** — final weighted score (0–100)
- **Metric tiles** — the four individual component scores
- **Explanations** — plain-language reasons for the recommendation
- **Best Months** — the 3 months with lowest congestion for that destination

**Demand Redistribution Banner:**

After searching, a banner appears showing how many destinations were penalised (congestion > 80) in the selected month. This is Horizon's active redistribution — those destinations receive a −10% scoring penalty so alternatives surface higher in the list.

---

### Insights

Analytical view of Spain's tourism concentration problem.

**Sections:**

| Section | What It Shows |
|---|---|
| **Stats header** | 96.8M tourists / 85% concentration / 134.7B€ impact / 22.5M summer arrivals |
| **Spain Congestion Map** | Interactive Leaflet map — circle size and colour indicate congestion level for the selected month. If you ran a search on the Destinations page, your recommended destinations are highlighted. Click the month in the Destinations page and navigate here to see the impact. |
| **Low Season Optimizer** | Cards for each destination showing: peak month to avoid, and 2 best low-season months with congestion scores. The "−X% congestion" chip shows the drop from peak to best month. |
| **Monthly Congestion Heatmap** | Click any month header to highlight it. Red-dot cells trigger Horizon's congestion penalty. The table shows all monitored destinations × 12 months. |
| **Redistribution Scenarios** | Side-by-side comparisons: over-saturated destination (red) vs. what Horizon recommends instead (green/yellow). |

**Reading the Heatmap:**

| Colour | Score Range | Meaning |
|---|---|---|
| Green | 0–30 | Low — ideal time to visit |
| Yellow | 31–60 | Moderate — acceptable |
| Orange | 61–80 | High — expect crowds |
| Red | 81–100 | Very High — Horizon applies −10% penalty |

A red dot in a cell means that destination triggers the redistribution penalty for that month.

---

### Analytics

Governance dashboard — system-level view. Everything on this page is driven by the **selected month**.

**Sections:**

- **Hero KPI cards** — 4 glassmorphism stat cards inside the hero: destinations monitored (20), traveler profiles (100), high-congestion months, and destinations at risk for the currently selected month. The SVG area chart at the bottom of the hero shows the monthly redistribution penalty pattern across the year.

- **Monthly Chart** — Clickable bar chart with all 12 months. Click any bar to change the selected month — all sections below update instantly to reflect the new month. The selected bar glows to indicate your active selection.

- **Sustainability & Congestion Ranking** — Heat tile grid sorted by best combined profile (most sustainable + least congested) for the selected month. Each tile shows the destination name, sustainability score, congestion score, and destination type. Use the sidebar on the left to filter by type: All / Beach / City / Nature / Mixed. Tiles reorder smoothly when the month or filter changes.

- **Status Breakdown** — Animated count cards showing how many of the 20 destinations fall into each category for the selected month: Overloaded (congestion ≥ 92) / High Pressure (≥ 80) / Moderate / Opportunity (low congestion, high peak at other times). Values animate when the month changes.

- **All 20 Destinations Table** — Full monitoring table filtered by status chip. Each row shows: destination, type, congestion score for the selected month, sustainability score, and a colour-coded status badge. Click the filter chips at the top to narrow the view.

---

### About

Project context and methodology.

**Sections:**

- **The Challenge** — explains why standard recommenders cause over-tourism
- **AI Scoring Formula** — animated weight bars + the code formula + description of each component
- **5-Layer Architecture** — the system layers from data ingestion to governance
- **Project Scope** — in-scope (Reto 2) vs. out-of-scope (Retos 1, 3, 4)

---

## 3. Dark / Light Mode

Click the **moon/sun icon** in the top-right corner of the header to toggle between dark and light mode. The preference persists across sessions (stored in localStorage).

---

## 4. Traveler Profiles

The system includes 100 synthetic, GDPR-compliant traveler profiles (`U001`–`U100`).

| Field | Values |
|---|---|
| `travel_style` | Nature · Relax · Culture · Family · Nightlife · Adventure |
| `budget_level` | Low · Medium · High |
| `sustainability_preference` | Low · Medium · High |
| `age_group` | 18-25 · 26-35 · 36-50 · 51-65 · 65+ |

**Interesting profiles to try:**

| User ID | Profile |
|---|---|
| `U001` | Nature traveler · Medium budget · High eco preference |
| `U010` | Culture traveler · High budget · Medium eco preference |
| `U025` | Family · Low budget · High eco preference |
| `U050` | Adventure · Medium budget · High eco preference |
| `U075` | Relax · High budget · Low eco preference |

---

## 5. Understanding Scores

### Final Score Formula

```
Final Score = 0.45 × Preference + 0.25 × Sustainability + 0.15 × Popularity + 0.15 × Congestion
```

### Component Scores

**Preference Score (45% weight)**
Measures how well the destination matches the traveler's profile:
- Travel style match (beach/city/nature/mixed aligns with user preference)
- Budget compatibility
- Sustainability preference alignment

**Sustainability Score (25% weight)**
Based on `sustainability_scores.csv`:
- Carbon footprint of the destination
- Support for local businesses (% of local vs. chain spending)
- Public transport availability
- Overall ESG score

Classification:
- Excellent ≥ 85 → +5% score boost
- Good 70–84
- Moderate 55–69
- Poor < 55 → −10% score penalty

**Popularity Score (15% weight)**
Derived from `bookings_history.csv`:
```
Popularity = 0.70 × booking_volume + 0.30 × average_rating
```
Normalised to 0–100.

**Congestion Score (15% weight)**
Monthly congestion from `congestion_scores.csv` (INE EOH hotel occupancy data):
- < 40 → +5% boost (under-visited — Horizon actively promotes)
- > 80 → −10% penalty (over-saturated — redistribution trigger)

### Confidence Score

```
Confidence = 0.50 × preference_score + 0.30 × popularity_score + 0.20 × sustainability_score
```

Indicates how strongly Horizon recommends this destination for this specific traveler.

---

## 6. The 20 Monitored Destinations

| ID | Destination | Region | Type |
|---|---|---|---|
| D001 | Mallorca | Balearic Islands | Beach |
| D002 | Ibiza | Balearic Islands | Beach |
| D003 | Menorca | Balearic Islands | Beach |
| D004 | Tenerife | Canary Islands | Mixed |
| D005 | Gran Canaria | Canary Islands | Mixed |
| D006 | Lanzarote | Canary Islands | Nature |
| D007 | Costa del Sol | Andalusia | Beach |
| D008 | Marbella | Andalusia | Beach |
| D009 | Malaga | Andalusia | City |
| D010 | Valencia | Valencian Community | City |
| D011 | Alicante | Valencian Community | Beach |
| D012 | Benidorm | Valencian Community | Beach |
| D013 | Barcelona | Catalonia | City |
| D014 | Madrid | Community of Madrid | City |
| D015 | Seville | Andalusia | City |
| D016 | Granada | Andalusia | City |
| D017 | Bilbao | Basque Country | City |
| D018 | San Sebastián | Basque Country | Mixed |
| D019 | Picos de Europa | Asturias | Nature |
| D020 | Sierra Nevada | Andalusia | Nature |

Destinations D019 and D020 are Horizon's primary **redistribution targets** — low congestion year-round, high sustainability, currently under-visited.

---

## 7. Alternative Dashboard (Streamlit)

A separate Streamlit dashboard provides an alternative view:

```bash
streamlit run src/dashboard/app.py
```

Opens at `http://localhost:8501`. This is a read-only view — it does not affect the FastAPI backend.

---

## 8. Refreshing Open Data

The congestion scores are derived from real INE hotel occupancy data. To refresh them:

```bash
# Fetch latest INE (EOH) and FRONTUR data
python data/scripts/fetch_open_data.py

# Optional: with AEMET climate data
export AEMET_API_KEY=your_key_here
python data/scripts/fetch_open_data.py
```

Note: AEMET climate normals require a free-tier API key from https://opendata.aemet.es. The INE and FRONTUR data are freely available without authentication.

---

## 9. Troubleshooting

| Problem | Solution |
|---|---|
| Frontend shows "Failed to fetch" | Make sure the FastAPI server is running on port 8000 |
| User profile chips don't appear | Wait 400ms after typing the user ID, or verify the ID is in U001–U100 format |
| Recommendations take > 2s | Normal — the engine scores all 20 destinations for the user profile |
| Map tiles not loading | Check internet connection (tiles load from CartoCDN) |
| No destinations returned | Try a different user ID or month — some combinations may return fewer results |

---

## 10. Running Tests

```bash
# All tests
python -m pytest tests/ -v

# Single module
python -m pytest tests/test_recommendation_engine.py -v
python -m pytest tests/test_scoring.py -v
python -m pytest tests/test_congestion.py -v
```

Tests run from the project root and use the real CSV data — no mocking.
