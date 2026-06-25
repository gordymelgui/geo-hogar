import re

SW_PATH = r'c:\Users\jordy\Desktop\app hipo\sw.js'

with open(SW_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Replace v38 with v39
js = re.sub(r'geohogar-cache-v38', 'geohogar-cache-v39', js)

with open(SW_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Cache version bumped in sw.js")
