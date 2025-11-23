import pandas as pd
import requests
import tqdm
import urllib.parse
from pathlib import Path

COMUNI_FILE = Path("../resources/comuni.xlsx")
PROVINCE_FILE = Path("../resources/province-italiane.xlsx")
OUTPUT_FILE = Path("../resources/comuni.json")

df_comuni = pd.read_excel(COMUNI_FILE)
df_comuni.columns = df_comuni.columns.str.strip()


df_provincie = pd.read_excel(PROVINCE_FILE)

comuni = []

for _, row in tqdm.tqdm(df_comuni.iterrows()):
    nome_comune = row["denominazione_ita"]
    nome_comune = str(row["denominazione_ita"]).strip()
    nome_encoded = urllib.parse.quote(nome_comune)  # encode per URL
    
    # API Wikipedia Pageviews (periodo: 2024-08-01 → 2025-07-31)
    url = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/it.wikipedia/all-access/user/{nome_encoded}/monthly/2024080100/2025073100"
    headers = {
        "User-Agent": "ComuniPageviewsBot/1.0 (contatto: giulia.maineri@example.com)"
    }
    
    try:
        r = requests.get(url,  headers=headers, timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            views = sum(item.get("views",0) for item in items)
        else:
            views = None
    except Exception as e:
        views = None

    prov_row = df_provincie.loc[df_provincie["Sigla"]==row["sigla_provincia"]]
    if prov_row.empty: 
        prov_row={
            "provincia": "Napoli", 
            "regione": "Campania"
        }
    else:
        prov_row = prov_row.iloc[0]
    
    comune_dict = {
        "nome_comune": nome_comune,
        "codice_provincia": row["sigla_provincia"],
        "lat": float(str(row["lat"]).replace(",", ".")),
        "lon": float(str(row["lon"]).replace(",", ".")),
        "superficie_kmq": float(str(row["superficie_kmq"]).replace(",", ".")),
        "flag_capoluogo": row["flag_capoluogo"],
        "pageviews": views, 
        "provincia": prov_row["Provincia"], 
        "regione": prov_row["Regione"]
    }
    
    comuni.append(comune_dict)
  

# --- 3. Stampo o salvo il risultato ---
import json
with open(OUTPUT_FILE, "w") as f: 
    json.dump(comuni, f, indent=2, ensure_ascii=False)
