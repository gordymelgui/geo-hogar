import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        # Scan for characters in typical emoji ranges:
        # e.g., 0x2600 to 0x27BF, and 0x1F000 to 0x1FFFF
        emojis = []
        for char in line:
            cp = ord(char)
            if (0x2600 <= cp <= 0x27BF) or (0x1F000 <= cp <= 0x1F9FF) or (0x1FA00 <= cp <= 0x1FAFF):
                emojis.append(f"{char}(U+{cp:04X})")
        if emojis:
            print(f"Line {idx}: {' '.join(emojis)} | {line.strip()}")
