with open('js/i18n.js', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if 'es: {' in line:
            print(f"es: {idx}")
        elif 'en: {' in line:
            print(f"en: {idx}")
        elif 'de: {' in line:
            print(f"de: {idx}")
        elif 'pt: {' in line:
            print(f"pt: {idx}")
