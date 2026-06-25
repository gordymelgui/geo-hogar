import json
import re

log_file = r"C:\Users\jordy\.gemini\antigravity\brain\959f97ad-8d48-4cd0-aa9d-bd238c566eff\.system_generated\logs\overview.txt"
with open(log_file, 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'("<!DOCTYPE html>.*?")', content, flags=re.DOTALL)
for i, m in enumerate(matches):
    try:
        html_text = json.loads(m)
        with open(f'index_recovered_{i}.html', 'w', encoding='utf-8') as out:
            out.write(html_text)
        print(f"Recovered {i} with length {len(html_text)}")
    except Exception as e:
        print(f"Error {i}: {e}")
