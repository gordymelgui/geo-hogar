with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'class="logo"' in line or "brand" in line.lower() or "emoji" in line.lower():
            print(f"{i}: {line.strip()}")
