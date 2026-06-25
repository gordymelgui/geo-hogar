with open('index.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if 'logo' in line.lower() or 'emoji' in line.lower() or '<img' in line.lower():
            print(f"{idx}: {line.strip()}")
