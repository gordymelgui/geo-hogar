with open('js/i18n.js', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if 'guide_step5_desc' in line:
            print(f"{idx}: {repr(line.strip())}")
