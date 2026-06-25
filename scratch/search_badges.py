with open('js/ui.js', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if 'badge' in line.lower() or 'tag' in line.lower() or 'label' in line.lower() or 'rentab' in line.lower() or 'descuento' in line.lower():
            print(f"{idx}: {line.strip()}")
