import requests, os, sys
sys.stdout.reconfigure(encoding="utf-8")

key = os.environ.get("AEMET_API_KEY", "")
headers = {"api_key": key}
params  = {"api_key": key}
base    = "https://opendata.aemet.es/opendata/api"

# Try monthly climatological values for a real year (different endpoint family)
test_station = "0076"  # Barcelona airport
print(f"=== Testing monthly values for station {test_station} ===")

paths = [
    f"valores/climatologicos/mensual/datos/estacion/{test_station}/anioini/2022/aniofin/2023",
    f"valores/climatologicos/mensual/datos/anioini/2022/aniofin/2023/estacion/{test_station}",
    f"valores/climatologicos/mensual/datos/estacion/{test_station}",
]
for path in paths:
    url = f"{base}/{path}"
    r = requests.get(url, headers=headers, params=params, timeout=20)
    print(f"HTTP {r.status_code} | {path[:70]}")
    if r.status_code == 200:
        rj = r.json()
        datos_url = rj.get("datos")
        if datos_url:
            r2 = requests.get(datos_url, timeout=20)
            data = r2.json() if r2.status_code == 200 else []
            print(f"  ✓ {len(data)} records. First: {data[0] if data else 'empty'}")
    elif r.status_code != 404:
        print(f"  Body: {r.text[:200]}")
