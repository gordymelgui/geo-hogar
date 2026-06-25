with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add theme_mode to all 4 languages

# ES
content = content.replace(
    'welcome_back: "Bienvenido de vuelta 👋",',
    'welcome_back: "Bienvenido de vuelta 👋",\n    theme_mode: "Tema Visual",\n    theme_light: "Modo Claro",\n    theme_dark: "Modo Oscuro",\n    calc_days_to_sell: "Tiempo de Venta Estimado:",\n    calc_market_trend: "Tendencia del Mercado:",\n    calc_recommendation_outlook: "Perspectiva de Inversión:",'
)

# EN
content = content.replace(
    'welcome_back: "Welcome back 👋",',
    'welcome_back: "Welcome back 👋",\n    theme_mode: "Visual Theme",\n    theme_light: "Light Mode",\n    theme_dark: "Dark Mode",\n    calc_days_to_sell: "Estimated Days to Sell:",\n    calc_market_trend: "Market Trend:",\n    calc_recommendation_outlook: "Investment Outlook:",'
)

# DE
content = content.replace(
    'welcome_back: "Willkommen zurück 👋",',
    'welcome_back: "Willkommen zurück 👋",\n    theme_mode: "Farbschema",\n    theme_light: "Heller Modus",\n    theme_dark: "Dunkler Modus",\n    calc_days_to_sell: "Geschätzte Verkaufszeit:",\n    calc_market_trend: "Markttrend:",\n    calc_recommendation_outlook: "Investitionsausblick:",'
)

# PT
content = content.replace(
    'welcome_back: "Bem-vindo de volta 👋",',
    'welcome_back: "Bem-vindo de volta 👋",\n    theme_mode: "Tema Visual",\n    theme_light: "Modo Claro",\n    theme_dark: "Modo Escuro",\n    calc_days_to_sell: "Tempo de Venda Estimado:",\n    calc_market_trend: "Tendência de Mercado:",\n    calc_recommendation_outlook: "Perspectiva de Investimento:",'
)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('i18n updated successfully!')
