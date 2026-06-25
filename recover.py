import json
import re

log_file = r"C:\Users\jordy\.gemini\antigravity\brain\959f97ad-8d48-4cd0-aa9d-bd238c566eff\.system_generated\logs\overview.txt"
with open(log_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Search for the full index.html content which was logged by view_file
m = re.search(r'("<!DOCTYPE html>.*?</html>\\n")', content, flags=re.DOTALL)
if m:
    # m.group(1) is a JSON string representation, so we json.loads it to get the raw text
    html_text = json.loads(m.group(1))
    with open('index.html', 'w', encoding='utf-8') as out:
        out.write(html_text)
    print("Recovered index.html successfully.")
else:
    print("Could not find the original index.html in the log.")
