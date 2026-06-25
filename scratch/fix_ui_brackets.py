import re

JS_PATH = r'c:\Users\jordy\Desktop\app hipo\js\ui.js'

with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Fix the stray closing brackets
js = js.replace('// 3. Dynamic Neighborhood Rankings removed in favor of updateNeighborhoodRanking);\n  });', '// 3. Dynamic Neighborhood Rankings removed in favor of updateNeighborhoodRanking')
js = js.replace('// 3. Dynamic Neighborhood Rankings removed in favor of updateNeighborhoodRanking);\r\n  });', '// 3. Dynamic Neighborhood Rankings removed in favor of updateNeighborhoodRanking')

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Stray brackets fixed in ui.js")
