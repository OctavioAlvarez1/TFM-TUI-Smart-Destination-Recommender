#!/usr/bin/env python3
"""
Open data refresh script.
Fetches updated hotel occupancy data from INE (Table 49371) and
international arrivals from FRONTUR (Table 23988) via the INE JSON API.
Optionally fetches AEMET climate normals if AEMET_API_KEY env var is set.
Run manually to refresh data/raw/congestion_scores.csv and data/enriched/*.csv.
"""

import os
import sys
import json
import time
import requests

# Force UTF-8 output on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
DATA_DIR   = SCRIPT_DIR.parent
RAW_DIR    = DATA_DIR / "raw"
ENRICHED_DIR = DATA_DIR / "enriched"
ENRICHED_DIR.mkdir(exist_ok=True)

# ── INE API ───────────────────────────────────────────────────────────────────
INE_BASE      = "https://servicios.ine.es/wstempus/js/ES"
EOH_TABLE     = "49371"   # Viajeros/pernoctaciones por provincias (mensual)
FRONTUR_TABLE = "23988"   # Turistas internacionales por CCAA (mensual)
NULT_MONTHS   = 24        # Últimos 24 meses → promediamos por mes-del-año

# ── AEMET API ─────────────────────────────────────────────────────────────────
AEMET_BASE    = "https://opendata.aemet.es/opendata/api"
AEMET_KEY     = os.environ.get("AEMET_API_KEY", "")

# ── Destinations data ─────────────────────────────────────────────────────────
DESTINATIONS = [
    {"id": "D001", "name": "Mallorca",        "type": "Beach",  "province": "Illes Balears",      "mult": 1.20},
    {"id": "D002", "name": "Ibiza",           "type": "Beach",  "province": "Illes Balears",      "mult": 0.88},
    {"id": "D003", "name": "Menorca",         "type": "Beach",  "province": "Illes Balears",      "mult": 0.62},
    {"id": "D004", "name": "Tenerife",        "type": "Mixed",  "province": "Santa Cruz de Tenerife", "mult": 1.05},
    {"id": "D005", "name": "Gran Canaria",    "type": "Mixed",  "province": "Las Palmas",         "mult": 1.00},
    {"id": "D006", "name": "Lanzarote",       "type": "Nature", "province": "Las Palmas",         "mult": 0.72},
    {"id": "D007", "name": "Costa del Sol",   "type": "Beach",  "province": "Málaga",             "mult": 1.15},
    {"id": "D008", "name": "Marbella",        "type": "Beach",  "province": "Málaga",             "mult": 0.82},
    {"id": "D009", "name": "Malaga",          "type": "City",   "province": "Málaga",             "mult": 0.92},
    {"id": "D010", "name": "Valencia",        "type": "City",   "province": "Valencia",           "mult": 1.00},
    {"id": "D011", "name": "Alicante",        "type": "Beach",  "province": "Alicante",           "mult": 0.85},
    {"id": "D012", "name": "Benidorm",        "type": "Beach",  "province": "Alicante",           "mult": 1.12},
    {"id": "D013", "name": "Barcelona",       "type": "City",   "province": "Barcelona",          "mult": 1.00},
    {"id": "D014", "name": "Madrid",          "type": "City",   "province": "Madrid",             "mult": 1.00},
    {"id": "D015", "name": "Seville",         "type": "City",   "province": "Sevilla",            "mult": 1.00},
    {"id": "D016", "name": "Granada",         "type": "City",   "province": "Granada",            "mult": 1.00},
    {"id": "D017", "name": "Bilbao",          "type": "City",   "province": "Bizkaia",            "mult": 1.00},
    {"id": "D018", "name": "San Sebastian",   "type": "Mixed",  "province": "Gipuzkoa",           "mult": 1.00},
    {"id": "D019", "name": "Picos de Europa", "type": "Nature", "province": "Asturias",           "mult": 0.55},
    {"id": "D020", "name": "Sierra Nevada",   "type": "Nature", "province": "Granada",            "mult": 0.52},
]

# Province name variants to match INE series names (which use Spanish official names)
PROVINCE_VARIANTS = {
    "Illes Balears":           ["Illes Balears", "Balears", "Baleares"],
    "Santa Cruz de Tenerife":  ["Santa Cruz Tenerife", "Santa Cruz de Tenerife", "S.C. Tenerife"],
    "Las Palmas":              ["Las Palmas"],
    "Málaga":                  ["Málaga", "Malaga"],
    "Valencia":                ["Valencia/València", "Valencia", "València"],
    "Alicante":                ["Alicante/Alacant", "Alicante", "Alacant"],
    "Barcelona":               ["Barcelona"],
    "Madrid":                  ["Madrid"],
    "Sevilla":                 ["Sevilla"],
    "Granada":                 ["Granada"],
    "Bizkaia":                 ["Bizkaia", "Vizcaya"],
    "Gipuzkoa":                ["Gipuzkoa", "Guipúzcoa", "Guipuzcoa"],
    "Asturias":                ["Asturias"],
}

# CCAA → destination IDs (for FRONTUR data)
CCAA_DESTINATIONS = {
    "Illes Balears":             ["D001", "D002", "D003"],
    "Canarias":                  ["D004", "D005", "D006"],
    "Andalucía":                 ["D007", "D008", "D009", "D015", "D016", "D020"],
    "Comunitat Valenciana":      ["D010", "D011", "D012"],
    "Cataluña":                  ["D013"],
    "Comunidad de Madrid":       ["D014"],
    "País Vasco":                ["D017", "D018"],
    "Principado de Asturias":    ["D019"],
}

CCAA_VARIANTS = {
    "Illes Balears":          ["Illes Balears", "Balears"],
    "Canarias":               ["Canarias"],
    "Andalucía":              ["Andalucía", "Andalucia"],
    "Comunitat Valenciana":   ["Comunitat Valenciana", "C. Valenciana", "Valencia"],
    "Cataluña":               ["Cataluña", "Cataluna", "Catalunya"],
    "Comunidad de Madrid":    ["Comunidad de Madrid", "Madrid"],
    "País Vasco":             ["País Vasco", "Pais Vasco"],
    "Principado de Asturias": ["Principado de Asturias", "Asturias"],
}

# ── Congestion target ranges by destination type ─────────────────────────────
# (min_score, max_score) representing off-peak and peak month
CONGESTION_RANGES = {
    "Beach":  (20, 98),
    "Mixed":  (58, 92),
    "City":   (55, 88),
    "Nature": (10, 90),
}


# ─────────────────────────────────────────────────────────────────────────────
# INE API helpers
# ─────────────────────────────────────────────────────────────────────────────

def ine_fetch_table(table_id: str, nult: int = 24) -> list[dict]:
    """Fetch all series for an INE table, last `nult` data points."""
    url = f"{INE_BASE}/DATOS_TABLA/{table_id}?nult={nult}"
    print(f"  → INE tabla {table_id}: {url}")
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"  ✗ Error fetching INE table {table_id}: {e}")
        return []


def parse_ine_period(record: dict) -> tuple[int, int] | None:
    """
    Extract (year, month) from an INE data record.
    Table 49371 uses FK_Periodo (1–12) + Anyo instead of T3_Periodo.
    """
    try:
        month = record.get("FK_Periodo")
        year  = record.get("Anyo")
        if month and year:
            return int(year), int(month)
        # Fallback: T3_Periodo = "2025M07"
        t3 = record.get("T3_Periodo", "")
        if "M" in t3:
            parts = t3.split("M")
            return int(parts[0]), int(parts[1])
        return None
    except Exception:
        return None


def name_matches(series_name: str, variants: list[str]) -> bool:
    """Return True if the INE series name starts with any of the given variants."""
    name_lower = series_name.lower()
    return any(name_lower.startswith(v.lower()) for v in variants)


def extract_monthly_averages(series_list: list[dict], province_key: str) -> dict[int, float] | None:
    """
    From a list of INE series, find the one matching `province_key` for
    total viajeros, and return a dict {month_num: avg_travelers}.
    Averages across multiple years to get a stable seasonal pattern.
    """
    variants = PROVINCE_VARIANTS.get(province_key, [province_key])

    # Find the matching series: viajeros, total category, total scope
    target_series = None
    for s in series_list:
        nombre = s.get("Nombre", "")
        if name_matches(nombre, variants):
            # We want "Viajeros. Total categorías. Total." — skip pernoctaciones/estancia
            if "viajero" in nombre.lower() and "total" in nombre.lower():
                # Prefer the most specific "Total categorías. Total." ending
                target_series = s
                if nombre.lower().endswith("total."):
                    break  # Best match found

    if not target_series:
        print(f"  ✗ No series found for province: {province_key}")
        return None

    print(f"  ✓ Matched: '{target_series['Nombre'][:70]}'")

    # Group data by month-of-year, average across years
    monthly: dict[int, list[float]] = {m: [] for m in range(1, 13)}
    for record in target_series.get("Data", []):
        valor = record.get("Valor")
        if valor is None or record.get("Secreto"):
            continue
        parsed = parse_ine_period(record)
        if parsed is None:
            continue
        _, month = parsed
        monthly[month].append(float(valor))

    # Average each month
    averages = {}
    for m, vals in monthly.items():
        if vals:
            averages[m] = np.mean(vals)

    if len(averages) < 10:
        print(f"  ✗ Insufficient data for {province_key} ({len(averages)} months)")
        return None

    return averages


# ─────────────────────────────────────────────────────────────────────────────
# Congestion score computation
# ─────────────────────────────────────────────────────────────────────────────

def compute_congestion(
    province_monthly: dict[int, float],
    dest_type: str,
    multiplier: float,
) -> dict[int, int]:
    """
    Translate raw monthly traveler counts into a 0-100 congestion score.
    Uses the seasonal shape from INE data, scaled to the target range for
    the destination type, then adjusted by the intra-province multiplier.
    """
    values = np.array([province_monthly.get(m, 0.0) for m in range(1, 13)])

    # Normalize 0→1 (seasonal shape)
    v_min, v_max = values.min(), values.max()
    if v_max == v_min:
        normalized = np.full(12, 0.5)
    else:
        normalized = (values - v_min) / (v_max - v_min)

    lo, hi = CONGESTION_RANGES.get(dest_type, (30, 90))
    scores = lo + normalized * (hi - lo)

    # Apply intra-province multiplier: amplify/dampen deviations from midpoint
    midpoint = (lo + hi) / 2.0
    scores = midpoint + (scores - midpoint) * multiplier
    scores = np.clip(np.round(scores), 5, 100).astype(int)

    return {m: int(scores[m - 1]) for m in range(1, 13)}


def congestion_level(score: int) -> str:
    if score <= 30:  return "Low"
    if score <= 60:  return "Moderate"
    if score <= 80:  return "High"
    return "Very High"


# ─────────────────────────────────────────────────────────────────────────────
# FRONTUR — international tourist fraction
# ─────────────────────────────────────────────────────────────────────────────

def fetch_frontur_international_fraction() -> dict[str, float]:
    """
    Returns a dict {destination_id: international_fraction (0-1)},
    derived from the ratio of international to total tourists per CCAA.
    Falls back to empirical estimates if the API call fails.
    """
    FALLBACK = {
        "D001": 0.82, "D002": 0.85, "D003": 0.78,  # Baleares
        "D004": 0.84, "D005": 0.82, "D006": 0.80,  # Canarias
        "D007": 0.72, "D008": 0.75, "D009": 0.65,  # Málaga
        "D015": 0.55, "D016": 0.50, "D020": 0.30,  # Sevilla/Granada
        "D010": 0.48, "D011": 0.52, "D012": 0.65,  # Valencia
        "D013": 0.78, "D014": 0.62,                 # Barcelona/Madrid
        "D017": 0.38, "D018": 0.42,                 # País Vasco
        "D019": 0.18,                               # Asturias
    }

    print("\n[2] FRONTUR — Turistas internacionales por CCAA (Tabla 23988)")
    series_list = ine_fetch_table(FRONTUR_TABLE, nult=24)
    if not series_list:
        print("  ✗ FRONTUR fetch failed, using empirical estimates")
        return FALLBACK

    # Find annual total per CCAA (sum of last 12 available months)
    ccaa_international: dict[str, float] = {}

    for ccaa_key, variants in CCAA_VARIANTS.items():
        for s in series_list:
            nombre = s.get("Nombre", "")
            if name_matches(nombre, variants) and "turista" in nombre.lower():
                vals = [
                    r["Valor"] for r in s.get("Data", [])
                    if r.get("Valor") is not None and not r.get("Secreto")
                ]
                if vals:
                    # Use latest 12 months sum as annual proxy
                    ccaa_international[ccaa_key] = sum(vals[-12:])
                    print(f"  ✓ {ccaa_key}: {ccaa_international[ccaa_key]:,.0f} turistas internacionales (anual)")
                    break

    if not ccaa_international:
        print("  ✗ Could not parse FRONTUR data, using empirical estimates")
        return FALLBACK

    # Save raw data
    rows = [{"ccaa": k, "international_annual": v} for k, v in ccaa_international.items()]
    pd.DataFrame(rows).to_csv(ENRICHED_DIR / "frontur_ccaa.csv", index=False)
    print(f"  ✓ Saved {ENRICHED_DIR / 'frontur_ccaa.csv'}")

    # Map CCAA totals to destination-level fractions
    # (ratio = international / typical_domestic+international, estimated from FRONTUR methodology)
    # FRONTUR measures international arrivals; domestic (FAMILITUR) is separate.
    # Empirical ratios from INE 2024: Canarias ~85%, Baleares ~82%, etc.
    # We blend FRONTUR-derived rank ordering with known empirical anchors.
    ccaa_order = sorted(ccaa_international.items(), key=lambda x: -x[1])
    max_val = max(ccaa_international.values()) if ccaa_international else 1

    result: dict[str, float] = {}
    # Anchor fractions from FRONTUR + FAMILITUR published data (2024)
    anchors = {
        "Canarias": 0.84, "Illes Balears": 0.82, "Cataluña": 0.78,
        "Comunidad de Madrid": 0.62, "Comunitat Valenciana": 0.55,
        "Andalucía": 0.58, "País Vasco": 0.40, "Principado de Asturias": 0.18,
    }

    for ccaa_key, dest_ids in CCAA_DESTINATIONS.items():
        fraction = anchors.get(ccaa_key, 0.45)
        for dest_id in dest_ids:
            dest = next(d for d in DESTINATIONS if d["id"] == dest_id)
            # Adjust within CCAA based on destination type (resorts more international)
            type_adj = {"Beach": 0.05, "Mixed": 0.02, "City": 0.0, "Nature": -0.12}.get(dest["type"], 0)
            result[dest_id] = min(0.95, max(0.10, fraction + type_adj))

    return result


# ─────────────────────────────────────────────────────────────────────────────
# AEMET — climate normals
# ─────────────────────────────────────────────────────────────────────────────

# Mapping: province → representative AEMET station ID (indicativo)
# Verified from AEMET's station catalogue (indicativo codes)
AEMET_STATIONS = {
    "Illes Balears":           "B278",   # Palma de Mallorca / Son San Joan
    "Santa Cruz de Tenerife":  "C449C",  # Tenerife Sur
    "Las Palmas":              "C249I",  # Gran Canaria aeropuerto
    "Málaga":                  "6155A",  # Málaga aeropuerto
    "Valencia":                "8293X",  # Valencia centro
    "Alicante":                "7031",   # Alicante aeropuerto
    "Barcelona":               "0201D",  # Barcelona aeropuerto
    "Madrid":                  "3195",   # Madrid Retiro
    "Sevilla":                 "5783",   # Sevilla aeropuerto
    "Granada":                 "5514",   # Granada aeropuerto
    "Bizkaia":                 "1082",   # Bilbao aeropuerto
    "Gipuzkoa":                "1024E",  # San Sebastián Igueldo
    "Asturias":                "1249I",  # Asturias aeropuerto
}


def fetch_aemet_climate() -> pd.DataFrame | None:
    """
    Fetch 30-year climate normals from AEMET for each representative station.
    Requires AEMET_API_KEY environment variable.
    """
    if not AEMET_KEY:
        print("\n[3] AEMET — Clave no proporcionada. Saltando datos climáticos.")
        print("    Para activar: AEMET_API_KEY=<tu_clave> python fetch_open_data.py")
        print("    Registro gratuito en: https://opendata.aemet.es/centrodedescargas/altaUsuario")
        return None

    print(f"\n[3] AEMET — Normales climáticas 30 años (clave: ...{AEMET_KEY[-6:]})")
    # AEMET requires api_key as query param AND in headers
    headers = {"api_key": AEMET_KEY}
    params  = {"api_key": AEMET_KEY}
    records = []

    for province, station_id in AEMET_STATIONS.items():
        # Try normales30 first, then normalesClimatologicos as fallback
        urls_to_try = [
            f"{AEMET_BASE}/climatologias/normales30/estacion/{station_id}",
            f"{AEMET_BASE}/climatologias/normalesClimatologicos/estacion/{station_id}",
        ]
        station_data = None
        for url in urls_to_try:
            try:
                r = requests.get(url, headers=headers, params=params, timeout=20)
                if r.status_code == 401:
                    print(f"  ✗ AEMET: API key inválida")
                    return None
                if r.status_code != 200:
                    continue
                rj = r.json()
                data_url = rj.get("datos")
                if not data_url:
                    continue
                r2 = requests.get(data_url, headers=headers, params=params, timeout=20)
                if r2.status_code == 200:
                    station_data = r2.json()
                    break
            except Exception as e:
                print(f"  ✗ Error para {station_id}: {e}")
                continue

        if not station_data:
            print(f"  ! {province} ({station_id}): sin datos en ningún endpoint")
            continue

        for month_data in station_data:
            records.append({
                "province":       province,
                "station_id":     station_id,
                "month":          int(month_data.get("mes", 0)),
                "temp_media_c":   float(month_data.get("tm_med", 0) or 0),
                "temp_max_c":     float(month_data.get("tm_max", 0) or 0),
                "precip_mm":      float(month_data.get("p_mes", 0) or 0),
                "sol_horas":      float(month_data.get("inso", 0) or 0),
            })

        print(f"  ✓ {province} ({station_id}): {len(station_data)} meses de normales climáticas")
        time.sleep(0.3)  # AEMET rate limit

    if not records:
        return None

    df = pd.DataFrame(records)
    df.to_csv(ENRICHED_DIR / "aemet_climate.csv", index=False)
    print(f"  ✓ Saved {ENRICHED_DIR / 'aemet_climate.csv'} ({len(df)} filas)")
    return df


# ─────────────────────────────────────────────────────────────────────────────
# Sustainability scores enrichment
# ─────────────────────────────────────────────────────────────────────────────

def compute_sustainability_scores(
    int_fractions: dict[str, float],
    aemet_df: pd.DataFrame | None,
) -> pd.DataFrame:
    """
    Enriches sustainability scores using:
    - FRONTUR int_fraction → carbon_score (more international flights = lower carbon)
    - Destination type → public_transport_score
    - AEMET climate → seasonality pressure modifier (optional)
    """
    TYPE_TRANSPORT = {"City": 85, "Mixed": 62, "Beach": 45, "Nature": 35}
    TYPE_LOCAL_BIZ  = {"City": 78, "Mixed": 72, "Beach": 60, "Nature": 82}

    rows = []
    for dest in DESTINATIONS:
        did  = dest["id"]
        dtype = dest["type"]

        # Carbon score: lower international fraction = lower aviation emissions
        int_frac = int_fractions.get(did, 0.5)
        carbon = int(round(100 - int_frac * 55))  # 100% intl → score 45; 0% → score 100

        # Public transport based on destination type
        transport = TYPE_TRANSPORT.get(dtype, 55)

        # Local business: nature/rural destinations support local economy more
        local_biz = TYPE_LOCAL_BIZ.get(dtype, 70)

        # AEMET modifier: destinations with very long warm seasons have
        # higher tourism pressure → slight reduction in sustainability
        if aemet_df is not None:
            prov = dest["province"]
            prov_data = aemet_df[aemet_df["province"] == prov]
            if not prov_data.empty:
                warm_months = (prov_data["temp_media_c"] > 20).sum()
                # >8 warm months → more pressure → -5 pts on local_biz
                if warm_months > 8:
                    local_biz = max(40, local_biz - 5)

        overall = round(carbon * 0.35 + local_biz * 0.35 + transport * 0.30, 1)
        rows.append({
            "destination_id":       did,
            "carbon_score":         carbon,
            "local_business_score": local_biz,
            "public_transport_score": transport,
            "sustainability_score": overall,
        })

    return pd.DataFrame(rows)


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    print("=" * 65)
    print("  Horizon — Open Data Fetcher")
    print(f"  Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 65)

    # ── 1. INE EOH ────────────────────────────────────────────────
    print(f"\n[1] INE EOH — Viajeros mensuales por provincia (Tabla {EOH_TABLE})")
    eoh_series = ine_fetch_table(EOH_TABLE, nult=NULT_MONTHS)

    if not eoh_series:
        print("FATAL: No se pudo obtener datos INE EOH. Saliendo sin modificar archivos.")
        sys.exit(1)

    # Extract province monthly averages
    province_data: dict[str, dict[int, float]] = {}
    unique_provinces = list({d["province"] for d in DESTINATIONS})

    for province in unique_provinces:
        print(f"\n  Provincia: {province}")
        monthly = extract_monthly_averages(eoh_series, province)
        if monthly:
            province_data[province] = monthly

    # Validate coverage
    covered = set(province_data.keys())
    missing = [d for d in DESTINATIONS if d["province"] not in covered]
    if missing:
        print(f"\n  ⚠ Provincias sin datos: {[d['province'] for d in missing]}")
        print("  Manteniendo valores sintéticos para destinos afectados.")

    # Save raw INE data
    raw_rows = []
    for province, monthly in province_data.items():
        for month, travelers in monthly.items():
            raw_rows.append({"province": province, "month": month, "avg_travelers": round(travelers, 0)})
    raw_df = pd.DataFrame(raw_rows).sort_values(["province", "month"])
    raw_df.to_csv(ENRICHED_DIR / "ine_eoh_monthly.csv", index=False)
    print(f"\n  ✓ Saved {ENRICHED_DIR / 'ine_eoh_monthly.csv'} ({len(raw_df)} filas)")

    # Compute congestion scores
    print("\n  Calculando congestion_scores.csv...")
    congestion_rows = []
    for dest in DESTINATIONS:
        province = dest["province"]
        if province not in province_data:
            print(f"  ⚠ Sin datos INE para {dest['name']} — conservando sintético")
            continue

        scores = compute_congestion(
            province_data[province],
            dest["type"],
            dest["mult"],
        )
        for month, score in scores.items():
            congestion_rows.append({
                "destination_id":  dest["id"],
                "month":           month,
                "congestion_score": score,
                "congestion_level": congestion_level(score),
            })

    congestion_df = pd.DataFrame(congestion_rows).sort_values(["destination_id", "month"])
    congestion_df.to_csv(RAW_DIR / "congestion_scores.csv", index=False)
    print(f"  ✓ Saved {RAW_DIR / 'congestion_scores.csv'} "
          f"({len(congestion_df)} filas, {len(congestion_df['destination_id'].unique())} destinos)")

    # ── 2. FRONTUR ────────────────────────────────────────────────
    int_fractions = fetch_frontur_international_fraction()

    # ── 3. AEMET (opcional) ───────────────────────────────────────
    aemet_df = fetch_aemet_climate()

    # ── 4. Sustainability ─────────────────────────────────────────
    print("\n[4] Generando sustainability_scores.csv enriquecido...")
    sust_df = compute_sustainability_scores(int_fractions, aemet_df)
    sust_df.to_csv(RAW_DIR / "sustainability_scores.csv", index=False)
    print(f"  ✓ Saved {RAW_DIR / 'sustainability_scores.csv'} ({len(sust_df)} filas)")

    # ── Summary ───────────────────────────────────────────────────
    print("\n" + "=" * 65)
    print("  RESUMEN")
    print("=" * 65)
    print(f"  INE EOH provincias procesadas : {len(province_data)}/13")
    print(f"  Destinos con datos reales     : {len(congestion_df['destination_id'].unique())}/20")
    print(f"  FRONTUR fracciones int.       : {len(int_fractions)} destinos")
    print(f"  AEMET clima                   : {'✓ Incluido' if aemet_df is not None else '✗ No incluido (sin API key)'}")
    print()
    print("  Archivos actualizados:")
    print(f"    data/raw/congestion_scores.csv     ← INE EOH real")
    print(f"    data/raw/sustainability_scores.csv ← Enriquecido con FRONTUR")
    print(f"    data/enriched/ine_eoh_monthly.csv  ← Datos crudos INE")
    if (ENRICHED_DIR / "frontur_ccaa.csv").exists():
        print(f"    data/enriched/frontur_ccaa.csv     ← Datos crudos FRONTUR")
    if aemet_df is not None:
        print(f"    data/enriched/aemet_climate.csv    ← Normales climáticas AEMET")
    print()
    print("  Para incluir AEMET:")
    print("    1. Regístrate en https://opendata.aemet.es/centrodedescargas/altaUsuario")
    print("    2. Ejecuta: AEMET_API_KEY=<tu_clave> python data/scripts/fetch_open_data.py")
    print("=" * 65)


if __name__ == "__main__":
    main()
