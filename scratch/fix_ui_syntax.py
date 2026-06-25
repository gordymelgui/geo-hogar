import re

JS_PATH = r'c:\Users\jordy\Desktop\app hipo\js\ui.js'

with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Fix the syntax error by removing the backslash before 'neighborhood'
js = js.replace(r"\'neighborhood\'", "'neighborhood'")

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Syntax fixed in ui.js")
