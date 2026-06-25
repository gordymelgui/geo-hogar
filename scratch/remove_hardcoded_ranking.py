import re

JS_PATH = r'c:\Users\jordy\Desktop\app hipo\js\ui.js'

with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Remove zoneRankingData and renderRankings function
pattern1 = r'// 3\. Dynamic Neighborhood Rankings\s*const zoneRankingData = \{.*?function renderRankings\(sortKey = \'roi\'\) \{.*?\}\s*\}'
js = re.sub(pattern1, '// 3. Dynamic Neighborhood Rankings removed in favor of updateNeighborhoodRanking', js, flags=re.DOTALL)

# 2. Replace renderRankings('roi'); with nothing or with update call if needed
js = re.sub(r'renderRankings\(\'roi\'\);', r'''if (window.appData && window.updateNeighborhoodRanking) {
          window.updateNeighborhoodRanking(window.appData.properties, window._rankViewMode || \'neighborhood\');
        }''', js)

# 3. Replace in language changed listener
pattern3 = r'if \(typeof renderRankings === \'function\'\) \{\s*renderRankings\(sortKey\);\s*\}'
replacement3 = r'''if (window.appData && window.updateNeighborhoodRanking) {
      window.updateNeighborhoodRanking(window.appData.properties, window._rankViewMode || 'neighborhood');
    }'''
js = re.sub(pattern3, replacement3, js)

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Hardcoded ranking removed from ui.js successfully")
