import os
import re

# Simple regex for emojis: typical ranges of unicode
# Or we can just scan HTML and JS files for characters outside normal range or specific emoji patterns.
# Let's inspect the files.

extensions = ('.html', '.js', '.css')

def has_emoji(text):
    # Match emojis
    # See: https://stackoverflow.com/questions/112090/how-to-find-out-if-a-character-is-an-emoji-in-python
    # A simple way is to check for character codes in emoji blocks:
    for char in text:
        codepoint = ord(char)
        # Check standard emoji ranges:
        # Miscellaneous Symbols and Pictographs: 1F300-1F5FF
        # Emoticons: 1F600-1F64F
        # Transport and Map Symbols: 1F680-1F6FF
        # Supplemental Symbols and Pictographs: 1F900-1F9FF
        # Symbols and Pictographs Extended-A: 1FA70-1FAFF
        # Dingbats: 2700-27BF
        # Miscellaneous Symbols: 2600-26FF
        if (0x1F300 <= codepoint <= 0x1F5FF) or \
           (0x1F600 <= codepoint <= 0x1F64F) or \
           (0x1F680 <= codepoint <= 0x1F6FF) or \
           (0x1F900 <= codepoint <= 0x1F9FF) or \
           (0x1FA70 <= codepoint <= 0x1FAFF) or \
           (0x2700 <= codepoint <= 0x27BF) or \
           (0x2600 <= codepoint <= 0x26FF):
            return True
    return False

for root, dirs, files in os.walk('.'):
    # exclude some folders
    if 'node_modules' in root or '.git' in root or '.firebase' in root:
        continue
    for file in files:
        if file.endswith(extensions):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        if has_emoji(line):
                            print(f"{path}:{line_num}: {line.strip()}")
            except Exception as e:
                pass
