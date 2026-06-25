import re

with open(r'c:\Users\jordy\Desktop\app hipo\css\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Clean up duplicated dark themes
# We will find all occurrences of body.dark-theme { ... } and remove them.
css = re.sub(r'body\.dark-theme\s*\{[^}]+\}', '', css)

# 2. Add the true premium variables at the top right after :root
premium_vars = """
body.dark-theme {
  --bg: #0b1121;
  --surface: #131b2f;
  --surface2: #1e293b;
  --text: #f8fafc;
  --text2: #94a3b8;
  --border: rgba(255, 255, 255, 0.06);
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 24px 50px -12px rgba(0, 0, 0, 0.8);
}
"""

# Insert right after the closing brace of :root
css = re.sub(r'(:root\s*\{[^}]+\})', r'\1\n' + premium_vars, css, count=1)

# 3. Fix background: white to background: var(--surface) in .property-card
css = css.replace('background: white;', 'background: var(--surface);')

# 4. Enhance macro cards shadows
css = css.replace('.macro-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }', '.macro-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: rgba(255, 42, 95, 0.3); }')

# Fix background color on macro-card and analytics-card
css = css.replace('background: var(--bg);', 'background: var(--surface);')

with open(r'c:\Users\jordy\Desktop\app hipo\css\style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS Fixed successfully!")
