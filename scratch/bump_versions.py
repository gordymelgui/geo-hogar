import re

path = 'index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def bump_version(match):
    prefix = match.group(1)
    version = match.group(2)
    new_version = f"{float(version) + 1.0:.1f}"
    return f"{prefix}{new_version}"

# Replaces ?v=1.2 with ?v=2.2, etc.
new_content = re.sub(r'(\?v=)(\d+\.\d+)', bump_version, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Bumped cache versions in index.html")
