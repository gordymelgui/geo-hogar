import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("c:\\Users\\jordy\\Desktop\\app hipo\\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i in range(1230, 1260):
        if i < len(lines):
            print(f"{i+1}: {lines[i].strip()}")
