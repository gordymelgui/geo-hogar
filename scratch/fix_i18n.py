import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace "es: \n" and the similar ones.
# The text literally is "es: \n" and then some glossary, and then "{"
# We want "es: {" followed by glossary, and then NO "{".
def fix_lang(content, lang):
    # Find the "lang: \n" literal
    bad_str = lang + r": \n"
    if bad_str in content:
        # replace the first instance
        content = content.replace(bad_str, lang + ": {", 1)
        # now find the first "{" after this replacement, which belongs to the original "es: {"
        # We can find it by looking for the end of the glossary string which ends with "...,\n{"
        # We can just replace ",\n{" with ",\n" since the glossary ends with ",\n" and then the old "{"
        content = content.replace(',\n{', ',\n', 1)
    return content

content = fix_lang(content, 'es')
content = fix_lang(content, 'en')
content = fix_lang(content, 'pt')
content = fix_lang(content, 'de')

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
