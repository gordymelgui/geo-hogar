with open('js/ui.js', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if 'notif' in line.lower() or 'unread' in line.lower():
            print(f"{idx}: {line.strip()}")
