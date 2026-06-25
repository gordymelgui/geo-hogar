with open("c:\\Users\\jordy\\Desktop\\app hipo\\js\\firebase-db.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "isAgency" in line:
            print(f"firebase-db.js:{i}: {line.strip()}")

with open("c:\\Users\\jordy\\Desktop\\app hipo\\js\\data.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "isAgency" in line:
            print(f"data.js:{i}: {line.strip()}")
