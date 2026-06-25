import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for idx in range(1840, 1870):
    if idx < len(lines):
        print(f"{idx+1}: {lines[idx].strip()}")
