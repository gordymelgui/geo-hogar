import re

# 1. Update index.html
with open(r'c:\Users\jordy\Desktop\app hipo\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix Confianza Macro badge and description
html = html.replace('Oficial REDIEX / BCP', 'Hipo Sentiment Score')
html = html.replace('title="Basado en REDIEX, Forbes, etc."', 'title="Basado en sentimiento de noticias del mercado"')

# Fix Forbes mention in ROI comparative
html = html.replace('Comparativa ROI Regional (Forbes)', 'Comparativa ROI Regional')
html = html.replace('Compara el retorno promedio estimado de la app vs. referencias externas de prensa especializada (Forbes Paraguay y REDIEX).', 'Compara el retorno promedio estimado de propiedades en la app vs. el promedio del mercado regional.')

with open(r'c:\Users\jordy\Desktop\app hipo\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update app.js
with open(r'c:\Users\jordy\Desktop\app hipo\js\app.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace("confidenceScore > 80 ? 'Nivel Alto (Forbes/REDIEX)' : 'Nivel Medio'", "confidenceScore > 80 ? 'Mercado Optimista' : 'Mercado Estable'")

with open(r'c:\Users\jordy\Desktop\app hipo\js\app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Attributions fixed!")
