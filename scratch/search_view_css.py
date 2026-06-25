with open('css/style.css', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if '.view' in line or 'view-glossary' in line:
            print(f"{idx}: {line.strip()}")
