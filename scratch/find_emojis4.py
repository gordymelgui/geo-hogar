import os

extensions = ('.html', '.js', '.css', '.json')

with open('scratch/emojis_found.txt', 'w', encoding='utf-8') as out_f:
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith(extensions):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f, 1):
                        emojis = [c for c in line if ord(c) > 0x2600 and ord(c) < 0x27BF or ord(c) > 0x1F300 and ord(c) < 0x1F9FF]
                        if emojis:
                            out_f.write(f"File {path} line {i} has emojis: {''.join(emojis)}\n")
