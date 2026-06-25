import sys

def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old not in content:
            print(f"WARNING: Old string not found in {filepath}:\n{old}")
        content = content.replace(old, new)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# ui.js replacements
ui_replacements = [
    (
        "`<span class=\"prop-discount-badge\">💎 ${window.t('card_opportunity_badge', { pct: prop.discount })}</span>` :",
        "`<span class=\"tooltip-wrap\"><span class=\"prop-discount-badge\">💎 ${window.t('card_opportunity_badge', { pct: prop.discount })}</span><span class=\"tooltip-content\">${window.t('underpriced_tooltip')}</span></span>` :"
    ),
    (
        "if (insight) insight.innerText = pct < 45 ? window.t('modal_insight_low') : pct < 75 ? window.t('modal_insight_avg') : window.t('modal_insight_high');",
        """if (insight) {
      if (pct < 45) {
        insight.innerHTML = `<span class="tooltip-wrap">${window.t('modal_insight_low')} <span class="tooltip-content">${window.t('underpriced_tooltip')}</span></span>`;
      } else if (pct < 75) {
        insight.innerText = window.t('modal_insight_avg');
      } else {
        const txt = prop.isScraped ? window.t('modal_insight_high_scraped') : window.t('modal_insight_high_native');
        insight.innerHTML = `<span class="tooltip-wrap">${txt} <span class="tooltip-content">${window.t('tooltip_premium_desc')}</span></span>`;
      }
    }"""
    ),
    (
        "`<span style=\"background:rgba(245,158,11,0.12);color:#d97706;font-size:0.7rem;font-weight:800;padding:2px 6px;border-radius:4px;display:inline-flex;align-items:center;gap:3px\">💎 -${prop.discount}%</span>` :",
        "`<span class=\"tooltip-wrap\"><span style=\"background:rgba(245,158,11,0.12);color:#d97706;font-size:0.7rem;font-weight:800;padding:2px 6px;border-radius:4px;display:inline-flex;align-items:center;gap:3px\">💎 -${prop.discount}%</span><span class=\"tooltip-content\">${window.t('underpriced_tooltip')}</span></span>` :"
    )
]

# map.js replacements
map_replacements = [
    (
        "${prop.isUnderpriced ? `<div style=\"color:#d97706;font-weight:700;font-size:0.8rem;margin-bottom:6px\">💎 ${window.t('map_popup_opportunity', { discount: prop.discount })}</div>` : ''}",
        "${prop.isUnderpriced ? `<div class=\"tooltip-wrap\" style=\"color:#d97706;font-weight:700;font-size:0.8rem;margin-bottom:6px;display:inline-block;\">💎 ${window.t('map_popup_opportunity', { discount: prop.discount })}<span class=\"tooltip-content\">${window.t('underpriced_tooltip')}</span></div><br>` : ''}"
    )
]

modify_file('js/ui.js', ui_replacements)
modify_file('js/map.js', map_replacements)

print('JS modifications done!')
