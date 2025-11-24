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

comuni_sorted = sorted(comuni, key=lambda c: c.get("abitanti", 0))
n = len(comuni_sorted)
# split the comuni into easy, medium, hard
easy   = comuni_sorted[:n//3] 
medium =  comuni_sorted[n//3:n*2//3] 
hard =  comuni_sorted[n*2//3:] 
print(comuni_sorted[n//3])

def dump_json(data: list[dict], file: Path):
    with file.open("w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

dump_json(easy, easy_file)
dump_json(medium, medium_file)
dump_json(hard, hard_file)