import pandas as pd
import requests
import tqdm
import urllib.parse

# --- 1. Carico il file Excel ---
df = pd.read_excel("comuni.xlsx")
df.columns = df.columns.str.strip()  # tolgo spazi indesiderati


df_prov = pd.read_excel("province-italiane.xlsx")

# --- 2. Ciclo su tutti i comuni ---
comuni = []

for _, row in tqdm.tqdm(df.iterrows()):
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

    prov_row = df_prov.loc[df_prov["Sigla"]==row["sigla_provincia"]]
    if prov_row.empty: 
        prov_row={
            "Provincia": "Unknown", 
            "Regione": "Unknown"
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
with open("comuni.json", "w") as f: 
    json.dump(comuni, f, indent=2, ensure_ascii=False)
