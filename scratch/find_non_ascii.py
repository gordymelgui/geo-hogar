import os

extensions = ('.html', '.js', '.css')

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or '.firebase' in root:
        continue
    for file in files:
        if file.endswith(extensions):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        non_ascii = []
                        for char in line:
                            cp = ord(char)
                            if cp > 127:
                                non_ascii.append(f"{char}(U+{cp:04X})")
                        if non_ascii:
                            # Let's filter to only show actual emojis or symbols (not common Spanish characters like á, é, í, ó, ú, ñ, etc.)
                            filtered = []
                            for na in non_ascii:
                                # Spanish characters:
                                # á: U+00E1, é: U+00E9, í: U+00ED, ó: U+00F3, ú: U+00FA, ñ: U+00F1, ü: U+00FC
                                # Á: U+00C1, É: U+00C9, Í: U+00CD, Ó: U+00D3, Ú: U+00DA, Ñ: U+00D1
                                # ¿: U+00BF, ¡: U+00A1, º: U+00BA, ª: U+00AA
                                if any(x in na for x in ["U+00E1", "U+00E9", "U+00ED", "U+00F3", "U+00FA", "U+00F1", "U+00FC",
                                                         "U+00C1", "U+00C9", "U+00CD", "U+00D3", "U+00DA", "U+00D1",
                                                         "U+00BF", "U+00A1", "U+00BA", "U+00AA", "U+00B2", "U+00B3"]):
                                    continue
                                filtered.append(na)
                            if filtered:
                                print(f"{path}:{line_num}: {' '.join(filtered)} | {line.strip()[:100]}")
            except Exception as e:
                pass
