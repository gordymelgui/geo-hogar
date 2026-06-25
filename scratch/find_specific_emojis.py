import os

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or '.firebase' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.py')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        if '📖' in line or '🚀' in line:
                            print(f"{path}:{line_num}: {line.strip()}")
            except Exception as e:
                pass
