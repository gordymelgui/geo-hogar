with open('js/ui.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'price' in line and ('US$' in line or 'format' in line or 'prop.' in line):
            print(f"{i}: {line.strip()}")
