import re

with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'lang-btn' in line or 'lang-selector' in line or 'language' in line.lower():
            print(f"{i}: {line.strip()}")
