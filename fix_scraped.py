import json, random, re
with open("js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

def replace_match(m):
    if random.random() < 0.4:
        return '"isScraped": true'
    return m.group(0)

new_content = re.sub(r'"isScraped": false', replace_match, content)

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(new_content)
