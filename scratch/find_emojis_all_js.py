import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('js'):
    for file in files:
        if file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                for idx, line in enumerate(f, 1):
                    emojis = []
                    for char in line:
                        cp = ord(char)
                        if (0x2600 <= cp <= 0x27BF) or (0x1F000 <= cp <= 0x1F9FF) or (0x1FA00 <= cp <= 0x1FAFF):
                            emojis.append(f"{char}(U+{cp:04X})")
                    if emojis:
                        print(f"{path}:{idx}: {' '.join(emojis)} | {line.strip()}")
