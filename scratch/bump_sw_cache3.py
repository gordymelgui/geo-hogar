import re

SW_PATH = r'c:\Users\jordy\Desktop\app hipo\sw.js'

with open(SW_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Replace v39 with v40
js = re.sub(r'geohogar-cache-v39', 'geohogar-cache-v40', js)

with open(SW_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Cache version bumped to v40 in sw.js")
