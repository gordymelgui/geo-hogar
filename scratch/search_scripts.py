with open('index.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if '<script' in line.lower():
            print(f"{idx}: {line.strip()}")
