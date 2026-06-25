import os

files_to_check = ['index.html', 'sw.js', 'manifest.json']
updated_files = []

for path in files_to_check:
    if not os.path.exists(path): continue
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(path, 'r', encoding='utf-16') as f:
            content = f.read()
    
    new_content = content.replace('GeoFind', 'GeoHogar').replace('geofind', 'geohogar').replace('GEOFIND', 'GEOHOGAR')
    
    if new_content != content:
        encoding_to_use = 'utf-8'
        try:
            with open(path, 'r', encoding='utf-8') as f: f.read()
        except UnicodeDecodeError:
            encoding_to_use = 'utf-16'
            
        with open(path, 'w', encoding=encoding_to_use) as f:
            f.write(new_content)
        updated_files.append(path)

for p in updated_files:
    print(f"Updated {p}")
