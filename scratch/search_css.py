with open('css/style.css', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if 'help-tab-panel' in line.lower() or 'help-content' in line.lower() or 'view-glossary' in line.lower():
            print(f"{idx}: {line.strip()}")
