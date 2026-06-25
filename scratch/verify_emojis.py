import sys
sys.stdout.reconfigure(encoding='utf-8')

files_to_check = ['index.html', 'js/ui.js', 'js/app.js', 'js/firebase-db.js', 'js/i18n.js']

print("Verifying emojis and hearts in critical files:")
for path in files_to_check:
    with open(path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f, 1):
            for char in line:
                cp = ord(char)
                # Check for:
                # ⚖ (U+2696), ✨ (U+2728), ❤ (U+2764), ♥ (U+2665), ♡ (U+2661)
                # Note: We keep stars ★ (U+2605) and ☆ (U+2606) for confidence level
                if cp in [0x2696, 0x2728, 0x2764, 0x2665, 0x2661]:
                    print(f"{path}:{idx}: Emoji/heart found: {char}(U+{cp:04X}) | {line.strip()[:80]}")
