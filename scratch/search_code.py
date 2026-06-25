import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("c:\\Users\\jordy\\Desktop\\app hipo\\js\\broker.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "exportLeadsCSV" in line or "matchLeadsToProperty" in line or "CSV" in line:
            print(f"{i}: {line.strip()}")
