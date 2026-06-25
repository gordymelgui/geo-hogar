import subprocess
import os

js_dir = "c:\\Users\\jordy\\Desktop\\app hipo\\js"
files = [os.path.join(js_dir, f) for f in os.listdir(js_dir) if f.endswith('.js')]

for file in files:
    print(f"Checking {os.path.basename(file)}...")
    res = subprocess.run(["node", "--check", file], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in {os.path.basename(file)}:")
        print(res.stderr)
    else:
        print(f"{os.path.basename(file)} is OK.")
