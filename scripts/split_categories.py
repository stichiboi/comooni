# TODO: split the comuni.json file into easy.json, medium.json, hard.json

import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
COMUNI_FILE = SCRIPT_DIR / ".." / "resources" / "comuni.json"
assert COMUNI_FILE.exists(), "Comuni file not found"
OUTPUT_DIRECTORY = SCRIPT_DIR / ".." / "public" / "questions"
OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)

easy_file = OUTPUT_DIRECTORY / "easy.json"
medium_file = OUTPUT_DIRECTORY / "medium.json"
hard_file = OUTPUT_DIRECTORY / "hard.json"

with COMUNI_FILE.open("r") as f:
    comuni = json.load(f)

# split the comuni into easy, medium, hard
easy = [c for c in comuni if (c["pageviews"] or 0) < 10000]
medium = [c for c in comuni if (c["pageviews"] or 0) >= 10000 and (c["pageviews"] or 0) < 100000]
hard = [c for c in comuni if (c["pageviews"] or 0) >= 100000]

def dump_json(data: list[dict], file: Path):
    with file.open("w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

dump_json(easy, easy_file)
dump_json(medium, medium_file)
dump_json(hard, hard_file)