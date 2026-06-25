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
if last_brace_idx != -1 and 'rank-sort-btn' not in js:
    js = js[:last_brace_idx] + RANK_LOGIC + '\n' + js[last_brace_idx:]

# Fix 2: Update the header padding to account for the mobile notch (safe-area-inset-top)
# We look for the exact string: padding:1.5rem; background: var(--surface)">
js = js.replace(
    'padding:1.5rem; background: var(--surface)">',
    'padding: calc(1.5rem + env(safe-area-inset-top, 20px)) 1.5rem 1.5rem 1.5rem; background: var(--surface)">'
)

# Fix 3: Update the input area padding to account for the bottom bar (safe-area-inset-bottom)
# We look for the exact string: padding:1.2rem; border-top:1px solid var(--border);
js = js.replace(
    'padding:1.2rem; border-top:1px solid var(--border);',
    'padding: 1.2rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom, 20px)) 1.2rem; border-top:1px solid var(--border);'
)

# Fix 4: Hide .bottom-nav when chat is active
BACK_BTN_LOGIC_OLD = """
    const backBtn = document.getElementById('chat-back');
    if (window.innerWidth <= 768) {
      backBtn.style.display = 'block';
      backBtn.onclick = () => {
        document.querySelector('.conversations-list').classList.remove('hidden-mobile');
        area.classList.remove('active-mobile');
      };
    }
"""

BACK_BTN_LOGIC_NEW = """
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

# Try varying whitespace in case it changed slightly
import textwrap
js = re.sub(
    r"const backBtn = document.getElementById\('chat-back'\);\s*if \(window.innerWidth <= 768\) \{\s*backBtn.style.display = 'block';\s*backBtn.onclick = \(\) => \{\s*document.querySelector\('\.conversations-list'\).classList.remove\('hidden-mobile'\);\s*area.classList.remove\('active-mobile'\);\s*\};\s*\}",
    BACK_BTN_LOGIC_NEW.strip(),
    js
)

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("ui.js updated successfully")
