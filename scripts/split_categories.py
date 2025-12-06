# TODO: split the comuni.json file into easy.json, medium.json, hard.json
import numpy as np
import json
from pathlib import Path
import math

SCRIPT_DIR = Path(__file__).parent
COMUNI_FILE = SCRIPT_DIR / ".." / "resources" / "comuni_complete.json"
assert COMUNI_FILE.exists(), "Comuni file not found"
OUTPUT_DIRECTORY = SCRIPT_DIR / ".." / "public" / "questions"
OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)

easy_file = OUTPUT_DIRECTORY / "easy.json"
medium_file = OUTPUT_DIRECTORY / "medium.json"
hard_file = OUTPUT_DIRECTORY / "hard.json"

with COMUNI_FILE.open("r") as f:
    comuni = json.load(f)

comuni_sorted = sorted(comuni, key=lambda c: c.get("abitanti", 0) or 0, reverse=True)
n = len(comuni_sorted)
# split the comuni into easy, medium, hard
easy   = comuni_sorted[:n//3] 
medium =  comuni_sorted[n//3:n*2//3] 
hard =  comuni_sorted[n*2//3:] 
print(comuni_sorted[n//3])

pop_list = [c.get("abitanti", 0) or 0 for c in comuni_sorted]
pop_array = np.array(pop_list)
percentiles = np.percentile(pop_array, np.arange(0, 101))
pop_min, pop_max = min(pop_list), max(pop_list)
# pop min = 0 



def assign_score(c, category_comuni):
    log_values = [math.log((c.get("abitanti") or 1)) for c in category_comuni]
    log_min, log_max = min(log_values), max(log_values)
    if log_min==0: log_min = 4 
    pop = c.get("abitanti", 0) or 1
    log_pop = math.log(pop)

    norm = (log_pop - log_min) / (log_max - log_min)
    score = round(50-norm*40)
    c["punteggio"] = round(score)
    return c

# Add score
easy   = [assign_score(c, comuni_sorted[:n//3]) for c in easy]
medium = [assign_score(c, comuni_sorted[n//3:n*2//3] ) for c in medium]
hard   = [assign_score(c, comuni_sorted[n*2//3:]) for c in hard]

def dump_json(data: list[dict], file: Path):
    with file.open("w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

dump_json(easy, easy_file)
dump_json(medium, medium_file)
dump_json(hard, hard_file)