with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
target = 'js/ui.js'
idx = content.find(target)
print('idx:', idx)
print(repr(content[idx-30:idx+80]))
