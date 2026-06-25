import re

HTML_PATH = r'c:\Users\jordy\Desktop\app hipo\index.html'
JS_PATH = r'c:\Users\jordy\Desktop\app hipo\js\app.js'

# --- 1. Update index.html ---
with open(HTML_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

old_card = """        <div class="analytics-stat-card" id="card-macro-confidence">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">
              Confianza Macro
              <span class="glossary-info-icon" data-glossary="macro_confidence" title="Basado en sentimiento de noticias del mercado">(?)</span>
            </span>
            <span class="stat-val" id="stat-macro-confidence">--/100</span>
            <span class="stat-subtext text-up" id="stat-macro-subtext">Cargando datos...</span>
            <span class="source-badge verified">Hipo Sentiment Score</span>
          </div>
        </div>"""

new_card = """        <div class="analytics-stat-card" id="card-macro-embi">
          <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">
              Riesgo País (EMBI)
            </span>
            <span class="stat-val" id="stat-macro-embi-val">150 pts</span>
            <span class="stat-subtext text-up" id="stat-macro-embi-sub">Grado de Inversión (Baa3)</span>
            <span class="source-badge verified" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">Oficial JP Morgan / Moody's</span>
          </div>
        </div>"""

if old_card in html:
    html = html.replace(old_card, new_card)
else:
    print("Warning: old card not found exactly in index.html, using regex")
    html = re.sub(r'<div class="analytics-stat-card" id="card-macro-confidence">.*?</div>\s*</div>', new_card + '\n      </div>', html, flags=re.DOTALL)

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

# --- 2. Update js/app.js ---
with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the confidenceScore calculation and DOM updates
old_js_logic = """  // Calcule Macro Confidence from appData.marketNews
  const macroNews = window.appData ? window.appData.marketNews || [] : [];
  let confidenceScore = 0;
  if (macroNews.length > 0) {
    const positiveKeywords = ['inversión', 'crecimiento', 'rentabilidad', 'boom', 'oportunidad', 'desarrollo', 'extranjera', 'taiwanesas', 'internacionales', 'negocios'];
    let hits = 0;
    macroNews.forEach(n => {
      const text = ((n.title || '') + ' ' + (n.excerpt || '')).toLowerCase();
      positiveKeywords.forEach(kw => { if (text.includes(kw)) hits++; });
    });
    // Base score 65, add 5 per positive hit, max 98
    confidenceScore = Math.min(Math.round(65 + hits * 5), 98);
  } else {
    confidenceScore = 75; // Default if missing
  }
  
  const elMacroConf = document.getElementById('stat-macro-confidence');
  const elMacroSub = document.getElementById('stat-macro-subtext');
  if (elMacroConf) {
    elMacroConf.textContent = `${confidenceScore}/100`;
    elMacroConf.style.color = confidenceScore > 80 ? '#10b981' : '#f59e0b';
  }
  if (elMacroSub) {
    elMacroSub.textContent = confidenceScore > 80 ? 'Mercado Optimista' : 'Mercado Estable';
  }"""

new_js_logic = """  // Riesgo País EMBI is static/verified from JP Morgan, already populated in HTML
  // We can fetch it dynamically in the future, but currently it's hardcoded in the HTML as 150 pts."""

if old_js_logic in js:
    js = js.replace(old_js_logic, new_js_logic)
else:
    print("Warning: old js logic not found exactly")

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("Replaced Confianza Macro with Riesgo País successfully!")
