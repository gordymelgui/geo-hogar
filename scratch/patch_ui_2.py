import re

JS_PATH = r'c:\Users\jordy\Desktop\app hipo\js\ui.js'

with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Fix 1: Restore the rank-sort-btn logic at the bottom of the script
RANK_LOGIC = """
  // Bind ranking sorting buttons
  const rankSortBtns = document.querySelectorAll('.rank-sort-btn');
  rankSortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rankSortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const allProps = window.appData ? window.appData.properties : [];
      if (allProps.length && window.updateNeighborhoodRanking) {
        window.updateNeighborhoodRanking(allProps, window._rankViewMode || 'neighborhood');
      }
    });
  });
"""
# Insert before the last "});"
last_brace_idx = js.rfind('});')
if last_brace_idx != -1 and 'rankSortBtns' not in js:
    js = js[:last_brace_idx] + RANK_LOGIC + '\n' + js[last_brace_idx:]

# Fix 2: Hide .topbar when chat is active in openRealChat (along with .bottom-nav)
BACK_BTN_LOGIC_OLD_1 = """
    const backBtn = document.getElementById('chat-back');
    if (window.innerWidth <= 768) {
      backBtn.style.display = 'block';
      const bNav = document.getElementById('bottom-nav');
      if (bNav) bNav.style.display = 'none'; // hide it on open
      
      backBtn.onclick = () => {
        document.querySelector('.conversations-list').classList.remove('hidden-mobile');
        area.classList.remove('active-mobile');
        if (bNav) bNav.style.display = ''; // restore on back
      };
    }
"""

BACK_BTN_LOGIC_NEW = """
    const backBtn = document.getElementById('chat-back');
    if (window.innerWidth <= 768) {
      backBtn.style.display = 'block';
      const bNav = document.getElementById('bottom-nav');
      const topbar = document.querySelector('.topbar');
      if (bNav) bNav.style.display = 'none'; // hide it on open
      if (topbar) topbar.style.display = 'none'; // hide topbar on open
      
      backBtn.onclick = () => {
        document.querySelector('.conversations-list').classList.remove('hidden-mobile');
        area.classList.remove('active-mobile');
        if (bNav) bNav.style.display = ''; // restore on back
        if (topbar) topbar.style.display = ''; // restore on back
      };
    }
"""

# The previous script might have inserted slightly different whitespace, so we'll do a robust replacement
js = re.sub(
    r"const backBtn = document.getElementById\('chat-back'\);\s*if \(window.innerWidth <= 768\) \{\s*backBtn.style.display = 'block';\s*const bNav = document.getElementById\('bottom-nav'\);\s*if \(bNav\) bNav.style.display = 'none';[^\}]+backBtn.onclick = \(\) => \{[^}]+\};\s*\}",
    BACK_BTN_LOGIC_NEW.strip(),
    js
)

# And also we need to hide it from the places where it's called from property details
# Wait, openRealChat handles hiding the bottom-nav NOW, but earlier we saw in ui.js lines 1024 and 1601 that they ALSO hide it.
# Actually, the caller ONLY sets active-mobile. The backBtn is set inside openRealChat. 
# So openRealChat is the best place to hide them immediately!
# But wait, does openRealChat hide bottom-nav immediately in our NEW logic? Yes: if (topbar) topbar.style.display = 'none';

# Let's write the modified JS
with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("ui.js patched successfully")
