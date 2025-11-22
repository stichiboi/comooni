#!/usr/bin/python3

"""
    get_page_images.py

    MediaWiki API Demos
    Demo of `Images` module: Send a GET request to obtain a JSON
	object listing all of the image files embedded on a single page

    MIT License
"""

import requests

S = requests.Session()

URL = "https://en.wikipedia.org/w/api.php"

PARAMS = {
    "action": "query",
    "format": "json",
    "titles": "Prato Sesia",
    "prop": "images", 
    "iiprop": "url", 
    "iilimit": 100
}

R = S.get(url=URL, params=PARAMS, headers = {
        "User-Agent": "ComuniPageviewsBot/1.0 (contatto: giulia.maineri@example.com)"
    })
DATA = R.json()

PAGES = DATA['query']['pages']

for k, v in PAGES.items():
    for img in v['images']:
        print(img["title"])
