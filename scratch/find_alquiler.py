import os

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.js')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    if 'alquiler' in line.lower() or 'publicar' in line.lower() or 'operación' in line.lower() or 'operacion' in line.lower():
                        print(f"{path}:{i}:{line.strip()[:100]}")
