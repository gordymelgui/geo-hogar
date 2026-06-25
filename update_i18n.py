import re

file_path = 'js/i18n.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# ES
content = re.sub(r'underpriced: ".*?",', 'underpriced: "Oportunidad de Precio",\n    underpriced_tooltip: "El precio por m² de esta propiedad se encuentra por debajo del promedio estimado para su zona y categoría.",', content)
content = re.sub(r'underpriced_short: ".*?",', 'underpriced_short: "Oportunidad",', content)
content = re.sub(r'card_opportunity_badge: ".*?",', 'card_opportunity_badge: "Oportunidad -{pct}%",', content)
content = re.sub(r'card_opportunity_badge_short: ".*?",', 'card_opportunity_badge_short: "Oportunidad -{pct}%",', content)
content = re.sub(r'modal_insight_low: ".*?",', 'modal_insight_low: "Precio de Oportunidad (Excelente opción) 💎",', content)
content = re.sub(r'modal_insight_high: ".*?",', 'modal_insight_high_scraped: "Precio por encima de la media (Sugerencia: Negociar)",\n    modal_insight_high_native: "Precio Premium (Inmueble de alta gama o exclusivo)",\n    tooltip_premium_desc: "Este valor se calcula comparando el precio por metro cuadrado con el promedio del mercado de la zona.",', content, count=1)

# EN
content = re.sub(r'modal_insight_high: ".*?",', 'modal_insight_high_scraped: "Above average price (Tip: Negotiate)",\n    modal_insight_high_native: "Premium Price (High-end or exclusive property)",\n    tooltip_premium_desc: "This value is calculated by comparing the price per square meter with the market average in the area.",', content, count=1)

# DE
content = re.sub(r'modal_insight_high: ".*?",', 'modal_insight_high_scraped: "Überdurchschnittlicher Preis (Tipp: Verhandeln)",\n    modal_insight_high_native: "Premium-Preis (Hochwertige oder exklusive Immobilie)",\n    tooltip_premium_desc: "Dieser Wert wird berechnet, indem der Quadratmeterpreis mit dem Marktdurchschnitt in der Region verglichen wird.",', content, count=1)

# PT
content = re.sub(r'modal_insight_high: ".*?"', 'modal_insight_high_scraped: "Preço acima da média (Sugestão: Negociar)",\n    modal_insight_high_native: "Preço Premium (Imóvel de alto padrão ou exclusivo)",\n    tooltip_premium_desc: "Este valor é calculado comparando o preço por metro quadrado com a média de mercado da região."', content, count=1)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
