import os

for root, dirs, files in os.walk('js'):
    for file in files:
        if file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                for idx, line in enumerate(f, 1):
                    if 'glossary' in line.lower() or 'switchhelptab' in line.lower():
                        print(f"{path}:{idx}: {line.strip()}")
