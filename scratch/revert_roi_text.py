import re

HTML_PATH = r'c:\Users\jordy\Desktop\app hipo\index.html'

with open(HTML_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

# Revert the specific text block
old_text = "Retorno Bruto promedio por inversión de alquiler residencial. Basado en informes de Real Estate regional."
new_text = "Compara el retorno promedio estimado de las propiedades en la app vs. referencias externas del mercado regional."

html = html.replace(old_text, new_text)

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print("Text reverted successfully in index.html")
