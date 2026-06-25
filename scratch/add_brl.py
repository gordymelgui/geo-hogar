import re

HTML_PATH = r'c:\Users\jordy\Desktop\app hipo\index.html'

with open(HTML_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

old_block = """              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--text2); font-weight: 600;">🇪🇺 EUR</span>
                <span id="val-eur" style="font-weight: 800; color: var(--text);">--</span>
              </div>"""

new_block = """              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--text2); font-weight: 600;">🇪🇺 EUR</span>
                <span id="val-eur" style="font-weight: 800; color: var(--text);">--</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--text2); font-weight: 600;">🇧🇷 BRL</span>
                <span id="val-brl" style="font-weight: 800; color: var(--text);">--</span>
              </div>"""

html = html.replace(old_block, new_block)

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print("BRL block added to index.html successfully")
