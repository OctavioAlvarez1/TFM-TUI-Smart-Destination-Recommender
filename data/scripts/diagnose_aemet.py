import sys, os, requests, json
sys.stdout.reconfigure(encoding="utf-8")

key = os.environ.get("AEMET_API_KEY", "")
if not key:
    print("No AEMET_API_KEY set")
    sys.exit(1)

headers = {"api_key": key}
params  = {"api_key": key}
base    = "https://opendata.aemet.es/opendata/api"

# 1) Verify the key works by listing all stations
print("Fetching station inventory...")
r = requests.get(
    f"{base}/valores/climatologicos/inventarioestaciones/todasestaciones/",
    headers=headers, params=params, timeout=20
)
print(f"HTTP {r.status_code}")
if r.status_code != 200:
    print(f"Error: {r.text[:300]}")
    sys.exit(1)

rj = r.json()
datos_url = rj.get("datos")
if not datos_url:
    print(f"No datos URL in response: {rj}")
    sys.exit(1)

r2 = requests.get(datos_url, timeout=20)
stations = r2.json()
print(f"Total stations: {len(stations)}")

# 2) Find relevant stations by province
targets = {
    "Málaga": ["malaga", "málaga"],
    "Baleares": ["baleares", "palma"],
    "Barcelona": ["barcelona"],
    "Tenerife": ["tenerife", "santa cruz"],
    "Sevilla": ["sevilla"],
    "Alicante": ["alicante"],
    "Asturias": ["asturias", "oviedo"],
    "Gipuzkoa": ["gipuzkoa", "guipuzcoa", "donostia", "san sebastian"],
    "Las Palmas": ["las palmas", "gran canaria"],
    "Madrid": ["madrid"],
    "Valencia": ["valencia"],
    "Bizkaia": ["bizkaia", "vizcaya", "bilbao"],
    "Granada": ["granada"],
}

print("\n--- Matching stations ---")
for dest_name, keywords in targets.items():
    matches = []
    for s in stations:
        name = s.get("nombre", "").lower()
        prov = s.get("provincia", "").lower()
        if any(k in name or k in prov for k in keywords):
            matches.append(s)
    if matches:
        print(f"\n{dest_name}:")
        for s in matches[:5]:
            print(f"  indicativo={s.get('indicativo')} | nombre={s.get('nombre')} | prov={s.get('provincia')} | alt={s.get('altitud')}")

# 3) Try the normalesClimatologicos endpoint with a known good station
print("\n\n--- Testing normalesClimatologicos endpoint ---")
# Try a few well-known AEMET station codes
test_ids = ["3129", "3195", "3194", "B228", "B278", "B013X"]
for sid in test_ids:
    url = f"{base}/climatologias/normalesClimatologicos/estacion/{sid}"
    r = requests.get(url, headers=headers, params=params, timeout=20)
    print(f"  {sid}: HTTP {r.status_code} | {r.text[:100]}")
