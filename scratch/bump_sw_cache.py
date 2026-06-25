import re

SW_PATH = r'c:\Users\jordy\Desktop\app hipo\sw.js'

with open(SW_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Replace v37 with v38
js = re.sub(r'geohogar-cache-v37', 'geohogar-cache-v38', js)

with open(SW_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Cache version bumped in sw.js")
