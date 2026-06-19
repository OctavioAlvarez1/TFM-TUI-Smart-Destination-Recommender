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
| API | `https://opendata.aemet.es/opendata/api/climatologias/normales30/estacion/{id}` |

**Activation:** Once you have an API key, run:
```bash
AEMET_API_KEY=<your_key> python data/scripts/fetch_open_data.py
```

Climate data (temperature, precipitation, sunshine hours) is used to apply a seasonality pressure modifier to local business sustainability scores: destinations with >8 warm months per year experience higher year-round tourism pressure.

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
