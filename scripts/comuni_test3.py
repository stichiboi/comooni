import pandas as pd
import requests
import tqdm
import urllib.parse
from pathlib import Path
import re
import time
import json




def get_wiki_data(comune):
    #print(f"DEBUG: Processo il comune: {comune}")
    
    url_base = "https://it.wikipedia.org/w/api.php"
    
    # 1. API per l'immagine (prop=pageimages) e contenuto grezzo (rvprop=content)
    params_content = {
        "action": "query", "format": "json", "titles": comune, "redirects": 1,
        "prop": "revisions|pageimages", "rvprop": "content", "pithumbsize": 300 
    }

    # 2. API per il parsing (per risolvere i template come {{Popolazione|ITA}})
    params_parse = {
        "action": "parse", "format": "json", "page": comune,
        "prop": "text", "section": 0  
    }
    
    headers = {
        "User-Agent": "ComuniPageviewsBot/1.0 (contatto: giulia.maineri@example.com)"
    }
    
    popolazione = None
    immagine = None
    
    # --- Estrazione Popolazione (dal testo PARSED) ---
    try:
        parse_url = requests.Request('GET', url_base, params=params_parse).prepare().url
        
        r_parse = requests.get(url_base, params=params_parse, timeout=10, headers=headers)
        
        
        if r_parse.status_code == 200:
            data_parse = r_parse.json()
            parsed_text_html = data_parse.get("parse", {}).get("text", {}).get("*", "")
            # ---  PULIZIA ---
            text_cleaned = re.sub(r'<(style|script).*?>.*?</\1>', ' ', parsed_text_html, flags=re.IGNORECASE | re.DOTALL)
            
            text_cleaned = re.sub(r'<[^>]+>', ' ', text_cleaned)
            
            text_cleaned = re.sub(r'\.mw-parser-output.*?\}', ' ', text_cleaned, flags=re.DOTALL)
            text_cleaned = re.sub(r'\s+', ' ', text_cleaned).strip()
            #i numeri li scrivono tipo 3600 come 3&#160 600
            text_cleaned = text_cleaned.replace("&#160;", " ").replace("&#32;", " ").replace("&nbsp;", " ")
            text_cleaned = re.sub(r"&#91;\s*[0-9]+\s*&#93;", ' ', text_cleaned)
            
            text_cleaned = re.sub(r'\s+', ' ', text_cleaned).strip()
            
            #print(f"DEBUG: Inizio testo pulito (300 caratteri): {text_cleaned[:800].replace('\n', ' ')}...")
            
            match_abitanti_label = re.search(r"([Aa]bitanti)", text_cleaned)

            if match_abitanti_label:
                start_index = match_abitanti_label.end()
                search_window = text_cleaned[start_index : start_index + 30]
                
                #print(f"DEBUG: Finestra di ricerca (30 char): '{search_window.strip()}'")

                match_pop_number = re.search(r"([0-9\s]+)", search_window)
                
                if match_pop_number:
                    pop_str = match_pop_number.group(1).strip()
                    #print(f"DEBUG: : {pop_str}")
                    pop_str_cleaned = pop_str.replace(" ", "")
                    
                    try:
                        popolazione = int(pop_str_cleaned)
                        #print(f"DEBUG: Trovata popolazione numerica finale: {popolazione}")
                    except ValueError:
                        #print(f"DEBUG: Conversione popolazione fallita in finestra: '{pop_str_cleaned}'")
                        popolazione = None 
                else:
                    print("DEBUG: Nessun numero trovato nella finestra di ricerca.")
            else:
                print("DEBUG: Etichetta 'Abitanti' non trovata nel testo pulito.")

        #else:
            #print(f"DEBUG: Errore API PARSE (Status {r_parse.status_code}).")

    except requests.exceptions.RequestException as e:
        print(f"DEBUG: Eccezione nella richiesta PARSE API: {e}")

    # --- Estrazione Immagine (dal contenuto RAW) ---
    try:
        r_content = requests.get(url_base, params=params_content, timeout=10, headers=headers)
        if r_content.status_code == 200:
            data_content = r_content.json()
            pages = data_content.get("query", {}).get("pages", {})
            page = next(iter(pages.values()), None)

            if page and "thumbnail" in page:
                thumb = page["thumbnail"]
                width = thumb.get("width")
                height = thumb.get("height")
                
                if width and height and width > height:
                    immagine = thumb["source"]
                    #print(f"DEBUG: Immagine orizzontale → {immagine}")



    except requests.exceptions.RequestException as e:
        print(f"DEBUG: Eccezione nella richiesta CONTENT API per immagine: {e}")


    #print(f"DEBUG: Risultato finale - Pop: {popolazione}, Img: {immagine is not None}")
    
    return popolazione, immagine


COMUNI_FILE = Path("../resources/comuni.xlsx")
PROVINCE_FILE = Path("../resources/province-italiane.xlsx")
OUTPUT_FILE = Path("../resources/comuni_test3.json")

df_comuni = pd.read_excel(COMUNI_FILE)
df_comuni.columns = df_comuni.columns.str.strip()


df_provincie = pd.read_excel(PROVINCE_FILE)

comuni = []
for _, row in tqdm.tqdm(df_comuni.iterrows()):
    nome_comune = row["denominazione_ita"]
    nome_comune = str(row["denominazione_ita"]).strip()
    nome_encoded = urllib.parse.quote(nome_comune)  # encode per URL
    popolazione, immagine = get_wiki_data(nome_comune)
    
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
    
    #time.sleep(0.01)
    comune_dict = {
        "nome_comune": nome_comune,
        "codice_provincia": row["sigla_provincia"],
        "lat": float(str(row["lat"]).replace(",", ".")),
        "lon": float(str(row["lon"]).replace(",", ".")),
        "superficie_kmq": float(str(row["superficie_kmq"]).replace(",", ".")),
        "flag_capoluogo": row["flag_capoluogo"],
        "pageviews": views, 
        "provincia": prov_row["Provincia"], 
        "regione": prov_row["Regione"], 
        "abitanti": popolazione,     
        "immagine": immagine  
    }
    
    comuni.append(comune_dict)
    with open(OUTPUT_FILE, "w") as f: 
        json.dump(comuni, f, indent=2, ensure_ascii=False)
  
