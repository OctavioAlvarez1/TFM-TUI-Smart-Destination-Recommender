# Data Sources

This project uses **real open data from official Spanish government sources** as the primary input for the recommendation engine, complemented by synthetic data for user profiles and booking history.

## Open Data Sources

### 1. INE — Encuesta de Ocupación Hotelera (EOH)
**Used for:** `congestion_scores.csv` — monthly congestion scores for all 20 destinations

| Field | Value |
|---|---|
| Source | Instituto Nacional de Estadística (INE) |
| Dataset | Encuesta de Ocupación Hotelera — Viajeros y pernoctaciones por provincias |
| Table ID | 49371 |
| Frequency | Monthly |
| Coverage | 2025–present |
| License | Open Data — Reutilización de información del sector público |
| URL | https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177015 |
| API | `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/49371?nult=24` |

**Methodology:** Monthly traveler volumes per province are normalized to a 0–100 congestion index. The seasonal shape (low/peak months) is derived directly from INE data. Intra-province multipliers differentiate destinations sharing the same province (e.g., Mallorca vs. Menorca within Illes Balears). Target congestion ranges by destination type: Beach (20–98), Mixed (58–92), City (55–88), Nature (10–90).

**Coverage:** 13/13 provinces, 20/20 destinations.

---

### 2. INE — FRONTUR (Movimientos Turísticos en Fronteras)
**Used for:** `sustainability_scores.csv` — carbon footprint scores derived from international tourist fraction

| Field | Value |
|---|---|
| Source | Instituto Nacional de Estadística (INE) |
| Dataset | Movimientos Turísticos en Fronteras — Turistas por Comunidad Autónoma |
| Table ID | 23988 |
| Frequency | Monthly |
| Coverage | 2016–present |
| License | Open Data — Reutilización de información del sector público |
| URL | https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176996 |
| API | `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/23988?nult=24` |

**Methodology:** International tourist arrivals per Autonomous Community are used to estimate the fraction of tourists arriving by air (international flights). A higher international fraction implies greater aviation-related carbon emissions. Carbon score formula: `carbon_score = 100 - (international_fraction × 55)`. Example: Canary Islands (84% international) → carbon score 54; Asturias (18% international) → carbon score 90.

Raw FRONTUR data saved to `data/enriched/frontur_ccaa.csv`.

---

### 3. AEMET — Open Data (Optional)
**Used for:** `data/enriched/aemet_climate.csv` — 30-year climate normals by province

| Field | Value |
|---|---|
| Source | Agencia Estatal de Meteorología (AEMET) |
| Dataset | Climatologías Normales 30 años — temperatura, precipitación, insolación |
| Authentication | Free API key required |
| Registration | https://opendata.aemet.es/centrodedescargas/altaUsuario |
| API | `https://opendata.aemet.es/opendata/api/valores/climatologicos/mensualesanuales/datos/anioini/{year}/aniofin/{year}/estacion/{id}` |

**Activation:** Once you have an API key, run:
```bash
# Windows PowerShell
$env:AEMET_API_KEY = "your_key"
python data/scripts/fetch_open_data.py

# Linux / macOS
AEMET_API_KEY=<your_key> python data/scripts/fetch_open_data.py
```

**Note on rate limits:** AEMET's free API key has a strict per-hour quota. If the script reports 429 errors, wait ~1 hour and retry. The script handles rate limit retries automatically with a 20s backoff.

The script fetches monthly climate values for 2014–2023, averages them by month-of-year to derive seasonal normals, and saves to `data/enriched/aemet_climate.csv`. Climate data is used to apply a seasonality pressure modifier to local business sustainability scores: destinations with >8 warm months per year experience higher year-round tourism pressure.

---

## Synthetic Data

The following files use synthetic (generated) data, as no publicly accessible open dataset covers these dimensions without violating privacy regulations:

| File | Content | Note |
|---|---|---|
| `users.csv` | 100 traveler profiles with preferences | GDPR-compliant synthetic profiles |
| `bookings_history.csv` | ~1,000 booking records | Seasonality calibrated against FRONTUR patterns |
| `destinations.csv` | Attribute scores per destination | Beach/culture/nature/nightlife/family scores |

> **Why not Booking.com / Airbnb data?** Their Terms of Service prohibit scraping. Additionally, Spain has strict data protection regulations (LOPDGDD, aligned with GDPR). Using INE and AEMET official open data is both legally compliant and methodologically more rigorous for academic work.

---

## Regenerating Data

To refresh all CSV files with the latest real data from INE and AEMET:

```bash
# From project root — INE only (no authentication required)
python data/scripts/fetch_open_data.py

# With AEMET climate data (free key from https://opendata.aemet.es)
AEMET_API_KEY=<your_key> python data/scripts/fetch_open_data.py
```

The script fetches the most recent 24 months of INE data, computes seasonal averages by month-of-year, and overwrites `data/raw/congestion_scores.csv` and `data/raw/sustainability_scores.csv`. Raw fetched data is preserved in `data/enriched/`.

---

## Data Flow

```
INE EOH (Table 49371)          →  Province monthly travelers
                                   ↓ normalize + destination multiplier
                               congestion_scores.csv

INE FRONTUR (Table 23988)      →  International tourist fraction per CCAA
                                   ↓ carbon score formula
                               sustainability_scores.csv (carbon_score column)

AEMET Climate Normals          →  Monthly temperature / precipitation (optional)
(optional, requires API key)       ↓ warm-season pressure modifier
                               sustainability_scores.csv (local_business_score)
```

---

## 4. RAG Vector Index

**Used by:** `src/api/rag.py` — the `POST /chat` endpoint.

Three CSV files from `data/raw/` are used at runtime to build an in-memory FAISS vector store that powers the RAG chatbot:

| File | Role |
|---|---|
| `destinations.csv` | Core destination attributes: type, scores, region, price |
| `sustainability_scores.csv` | Carbon, local business, public transport, and overall sustainability scores |
| `congestion_scores.csv` | Monthly congestion values and congestion level labels |

**How it works:**

On the first `POST /chat` request, `rag.py` reads these three files and merges them by `destination_id`. Each of the 20 destinations becomes a rich-text document containing all its attributes as a formatted string. These documents are embedded via OpenAI `text-embedding-3-small` and indexed in a `faiss.IndexFlatIP` (inner-product / cosine similarity) vector store held in memory.

Subsequent chat queries embed the user's question with the same model, retrieve the top-k most relevant destination documents via similarity search, and pass them as context to GPT-4o-mini to generate a grounded, factual answer.

**Requirements:**

- `OPENAI_API_KEY` environment variable must be set before starting the server.
- If the key is missing, the endpoint returns a graceful fallback message without crashing.
- The index is built once per server process. Restarting the server triggers a rebuild on the next `/chat` request.
