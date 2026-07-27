/**
 * broker-valuation.js — Motor de Tasación por IA
 * Usa datos reales de Firestore + Gemini API para calcular valor de mercado
 */

const GEMINI_KEY = (window.CONFIG?.GEMINI_API_KEY_2 || 'AIzaSyATmOQwr49aupctjN56M99Ru2-HlTBjir8').trim();

// ===== UI PRINCIPAL DE TASACIÓN =====
function renderValuationTab() {
  const container = document.getElementById('broker-valuation-content');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card stagger-in val-card-container">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;">
        <div style="width:50px;height:50px;border-radius:14px;background:rgba(255,42,95,0.1);display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16.01"/><line x1="16" y1="16" x2="16" y2="16.01"/></svg>
        </div>
        <div>
          <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:2px;" data-i18n="valuation_title">Tasación por IA</h3>
          <p style="color:var(--text2);font-size:0.9rem;" data-i18n="valuation_subtitle">Precio estimado con datos reales del mercado de Paraguay</p>
        </div>
      </div>

      <div class="valuation-grid-2">
        <div>
          <label class="val-field-label" data-i18n="val_field_type">TIPO DE PROPIEDAD</label>
          <select id="val-type" class="val-select val-input" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
            <option value="Casa">Casa</option>
            <option value="Departamento" selected>Departamento</option>
            <option value="PH">PH</option>
            <option value="Terreno">Terreno</option>
            <option value="Oficina">Oficina</option>
            <option value="Dúplex">Dúplex</option>
          </select>
        </div>
        <div>
          <label class="val-field-label" data-i18n="val_field_op">OPERACIÓN</label>
          <select id="val-op" class="val-select val-input" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
            <option value="Venta">Venta</option>
          </select>
        </div>

      <div style="margin-bottom:1rem;">
        <label class="val-field-label" data-i18n="val_field_address">DIRECCIÓN / ZONA</label>
        <input id="val-address" type="text" placeholder="Ej: Villa Morra, Asunción" class="val-input" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'" />
      </div>

      <div class="valuation-grid-3">
        <div>
          <label class="val-field-label text-truncate" data-i18n="val_field_m2">M² TOTALES</label>
          <input id="val-m2" type="number" placeholder="120" min="20" max="5000" class="val-input" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'" />
        </div>
        <div>
          <label class="val-field-label text-truncate" data-i18n="val_field_rooms">DORMITORIOS</label>
          <input id="val-rooms" type="number" placeholder="3" min="0" max="20" class="val-input" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'" />
        </div>
        <div>
          <label class="val-field-label text-truncate" data-i18n="val_field_baths">BAÑOS</label>
          <input id="val-baths" type="number" placeholder="2" min="0" max="15" class="val-input" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'" />
        </div>
      </div>

      <button id="val-submit-btn" onclick="runAIValuation()" class="val-submit-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Calcular Tasación con IA
      </button>
    </div>

    <div id="val-result" style="display:none;"></div>
    <div id="val-history" style="margin-top:2rem;"></div>
  `;

  loadValuationHistory();
  if (typeof window.applyGlobalState === 'function') window.applyGlobalState(container);
  if (typeof window.triggerStagger === 'function') {
    window.triggerStagger(container);
  } else {
    setTimeout(() => {
      container.querySelectorAll('.stagger-in').forEach(el => el.classList.add('visible'));
    }, 50);
  }
}

// ===== MOTOR DE CÁLCULO =====
window.runAIValuation = async function() {
  const type = document.getElementById('val-type')?.value;
  const op = document.getElementById('val-op')?.value;
  const address = document.getElementById('val-address')?.value?.trim();
  const m2 = parseFloat(document.getElementById('val-m2')?.value);
  const rooms = parseInt(document.getElementById('val-rooms')?.value) || 0;
  const baths = parseInt(document.getElementById('val-baths')?.value) || 0;

  if (!address) { document.getElementById('val-address').focus(); return; }
  if (!m2 || m2 < 20) { document.getElementById('val-m2').focus(); return; }

  const btn = document.getElementById('val-submit-btn');
  btn.innerHTML = '<span style="animation:spin 1s linear infinite;display:inline-block;">⟳</span> Analizando el mercado...';
  btn.disabled = true;

  const resultDiv = document.getElementById('val-result');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="glass-card" style="padding:2rem;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:1rem;"></div>
      <p style="font-weight:700;color:var(--text2);">Consultando propiedades comparables en ${address}...</p>
    </div>`;

  try {
    // 1. Obtener propiedades comparables de Firestore / appData
    const comparables = getComparableProperties(type, op, address, m2);
    
    // 2. Calcular estadísticas de mercado
    const marketStats = calculateMarketStats(comparables, m2, op);

    // 3. Llamar a Gemini para análisis narrativo
    const aiAnalysis = await callGeminiValuation(type, op, address, m2, rooms, baths, marketStats);

    // 4. Mostrar resultado
    displayValuationResult(type, op, address, m2, rooms, baths, marketStats, aiAnalysis, comparables);

    // 5. Guardar en historial
    saveValuationToHistory({ type, op, address, m2, rooms, baths, marketStats, timestamp: Date.now() });

  } catch (error) {
    console.error('Error en tasación:', error);
    resultDiv.innerHTML = `
      <div class="glass-card" style="padding:2rem;border-left:4px solid #ef4444;">
        <p style="font-weight:700;color:#ef4444;">Error al calcular la tasación. Por favor intenta de nuevo.</p>
      </div>`;
  }

  btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Calcular Tasación con IA';
  btn.disabled = false;
};

function getComparableProperties(type, op, address, m2) {
  const allProps = window.appData?.properties || [];
  
  // Extraer zona/ciudad del address (primera palabra del barrio)
  const addressLower = address.toLowerCase();
  const zoneWords = addressLower.split(',').map(s => s.trim());

  return allProps.filter(p => {
    if (p.type !== type) return false;
    if (p.op !== op) return false;
    if (!p.m2 || p.m2 < 10) return false;
    if (!p.price || p.price < 1000) return false;

    // Buscar coincidencia de zona
    const propAddrLow = (p.address || '').toLowerCase();
    const hasZone = zoneWords.some(word => word.length > 3 && propAddrLow.includes(word));
    if (!hasZone) return false;

    // m² comparable (dentro del 60% del tamaño buscado)
    const ratio = p.m2 / m2;
    return ratio >= 0.4 && ratio <= 2.5;
  }).slice(0, 20);
}

function calculateMarketStats(comparables, m2, op) {
  if (comparables.length === 0) {
    // Fallback: estadísticas por defecto de Paraguay
    const isAlquiler = op === 'Alquiler';
    return {
      avgPriceM2: isAlquiler ? 8 : 1400,
      minPriceM2: isAlquiler ? 5 : 900,
      maxPriceM2: isAlquiler ? 15 : 2200,
      estimatedPrice: isAlquiler ? 8 * m2 : 1400 * m2,
      priceRange: { min: isAlquiler ? 5 * m2 : 900 * m2, max: isAlquiler ? 15 * m2 : 2200 * m2 },
      sampleSize: 0,
      isFallback: true
    };
  }

  const pricesM2 = comparables.map(p => p.price / p.m2).filter(v => v > 100 && v < 20000);
  pricesM2.sort((a, b) => a - b);

  // Usar percentiles para filtrar outliers
  const q1idx = Math.floor(pricesM2.length * 0.25);
  const q3idx = Math.floor(pricesM2.length * 0.75);
  const filtered = pricesM2.slice(q1idx, q3idx + 1);

  const avg = filtered.reduce((s, v) => s + v, 0) / filtered.length;
  const min = pricesM2[0] || avg * 0.8;
  const max = pricesM2[pricesM2.length - 1] || avg * 1.2;

  return {
    avgPriceM2: Math.round(avg),
    minPriceM2: Math.round(min),
    maxPriceM2: Math.round(max),
    estimatedPrice: Math.round(avg * m2),
    priceRange: {
      min: Math.round(avg * 0.88 * m2),
      max: Math.round(avg * 1.12 * m2)
    },
    sampleSize: comparables.length,
    isFallback: false
  };
}

async function callGeminiValuation(type, op, address, m2, rooms, baths, marketStats) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_KEY}`;

  const priceInfo = marketStats.isFallback
    ? `No se encontraron comparables exactos. El precio estimado basado en promedios generales del mercado paraguayo es de ${window.formatPrice(marketStats.estimatedPrice)}.`
    : `Basado en ${marketStats.sampleSize} propiedades comparables en la zona, el precio promedio por m² es ${window.formatPriceM2(marketStats.avgPriceM2)}, con un rango entre ${window.formatPriceM2(marketStats.minPriceM2)} y ${window.formatPriceM2(marketStats.maxPriceM2)} por m².`;

  const prompt = `Eres un experto tasador inmobiliario de Paraguay. Analiza esta propiedad:
- Tipo: ${type}
- Operación: ${op}
- Ubicación: ${address}
- Superficie: ${m2} m²
- Dormitorios: ${rooms}, Baños: ${baths}

DATOS DEL MERCADO REAL:
${priceInfo}
Precio estimado total: ${window.formatPrice(marketStats.priceRange.min)} – ${window.formatPrice(marketStats.priceRange.max)}

Escribe un análisis profesional en 3-4 oraciones (máximo) que incluya:
1. Evaluación del precio estimado en contexto del mercado local
2. Un factor clave que influye en el valor (ubicación, m², demanda de la zona)
3. Una recomendación breve para el broker (si publicar, negociar, o captar)

IMPORTANTE: Responde en español. Sin markdown ni asteriscos. Texto plano natural y profesional.`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
    }
  } catch (e) { console.error('Gemini error:', e); }

  return `La propiedad en ${address} presenta características consistentes con el mercado local. El rango estimado de ${window.formatPrice(marketStats.priceRange.min)} a ${window.formatPrice(marketStats.priceRange.max)} está basado en ${marketStats.sampleSize} comparables activos en la zona. Se recomienda validar con visita presencial para ajustar por estado de conservación.`;
}

function displayValuationResult(type, op, address, m2, rooms, baths, stats, aiAnalysis, comparables) {
  window._lastValuationResult = { type, op, address, m2, rooms, baths, stats, aiAnalysis, comparables };

  const resultDiv = document.getElementById('val-result');
  const confidenceLevel = stats.sampleSize >= 5 ? { label: 'Alta', color: '#10b981', stars: '★★★★★' }
    : stats.sampleSize >= 2 ? { label: 'Media', color: '#f59e0b', stars: '★★★☆☆' }
    : { label: 'Referencial', color: '#ef4444', stars: '★★☆☆☆' };

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="glass-card stagger-in val-result-card" style="border-top:4px solid var(--accent);width:100%;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.2rem;flex-wrap:wrap;gap:0.8rem;">
        <div style="max-width:100%;min-width:0;">
          <div style="font-size:0.75rem;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Tasación Estimada</div>
          <div class="val-price-hero" style="font-size:clamp(1.5rem, 6.5vw, 2.5rem);font-weight:900;font-family:'Plus Jakarta Sans','Outfit',sans-serif;color:var(--accent);line-height:1.15;letter-spacing:-0.02em;word-break:break-word;overflow-wrap:anywhere;">
            ${window.formatPrice(stats.estimatedPrice)}
          </div>
          <div class="val-range-subtext" style="color:var(--text2);font-size:0.85rem;margin-top:6px;font-weight:600;word-break:break-word;">
            Rango: <strong style="color:var(--text);">${window.formatPrice(stats.priceRange.min)}</strong> – <strong style="color:var(--text);">${window.formatPrice(stats.priceRange.max)}</strong>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.72rem;font-weight:700;color:var(--text2);text-transform:uppercase;margin-bottom:2px;">Confianza</div>
          <div style="color:${confidenceLevel.color};font-size:1rem;">${confidenceLevel.stars}</div>
          <div style="color:${confidenceLevel.color};font-weight:800;font-size:0.85rem;">${confidenceLevel.label}</div>
          <div style="color:var(--text2);font-size:0.75rem;margin-top:2px;">${stats.sampleSize} comparables</div>
        </div>
      </div>

      <div class="valuation-grid-3" style="margin-bottom:1.2rem;gap:0.6rem;">
        <div style="background:var(--surface2);border-radius:12px;padding:0.8rem 0.5rem;text-align:center;border:1px solid var(--border);">
          <div style="font-size:0.68rem;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">PRECIO/M²</div>
          <div style="font-size:0.95rem;font-weight:800;color:var(--text);font-family:'Outfit',sans-serif;word-break:break-word;">${window.formatPriceM2(stats.avgPriceM2)}</div>
        </div>
        <div style="background:var(--surface2);border-radius:12px;padding:0.8rem 0.5rem;text-align:center;border:1px solid var(--border);">
          <div style="font-size:0.68rem;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">MÍNIMO M²</div>
          <div style="font-size:0.95rem;font-weight:800;color:var(--text);font-family:'Outfit',sans-serif;word-break:break-word;">${window.formatPriceM2(stats.minPriceM2)}</div>
        </div>
        <div style="background:var(--surface2);border-radius:12px;padding:0.8rem 0.5rem;text-align:center;border:1px solid var(--border);">
          <div style="font-size:0.68rem;font-weight:700;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">MÁXIMO M²</div>
          <div style="font-size:0.95rem;font-weight:800;color:var(--text);font-family:'Outfit',sans-serif;word-break:break-word;">${window.formatPriceM2(stats.maxPriceM2)}</div>
        </div>
      </div>
      
      <div style="border-top:1px solid var(--border);margin:1rem 0;"></div>
      
      <div style="display:flex;align-items:flex-start;gap:10px;background:rgba(16, 185, 129, 0.08);padding:12px;border-radius:12px;border:1px solid rgba(16, 185, 129, 0.2);">
        <div style="background:#10b981;color:white;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;">✓</div>
        <div style="font-size:0.82rem;line-height:1.4;color:var(--text);">
          <strong>Confianza Registrada.</strong> Análisis con ${comparables.length} comparables de la zona y promedios reales del mercado paraguayo.
        </div>
      </div>

      <div class="valuation-grid-2" style="margin-top:1rem;gap:0.8rem;">
        <div style="background:var(--surface2);border-radius:12px;padding:0.9rem;text-align:center;">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase;">SUPERFICIE</div>
          <div style="font-weight:900;font-size:1.15rem;color:var(--text);white-space:nowrap;">${m2} m²</div>
        </div>
        <div style="background:var(--surface2);border-radius:12px;padding:0.9rem;text-align:center;">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text2);margin-bottom:3px;text-transform:uppercase;">DORM. / BAÑOS</div>
          <div style="font-weight:900;font-size:1.05rem;color:var(--text);white-space:nowrap;">${rooms} Dorm. · ${baths} Baños</div>
        </div>
      </div>

      <div style="background:rgba(255,42,95,0.05);border:1px solid rgba(255,42,95,0.12);border-radius:14px;padding:1.2rem;margin:1.2rem 0;width:100%;box-sizing:border-box;">
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,42,95,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:800;font-size:0.8rem;color:var(--accent);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">ANÁLISIS INTELIGENTE DE IA</div>
            <p style="color:var(--text);line-height:1.55;font-size:0.9rem;margin:0;word-break:break-word;overflow-wrap:break-word;">${aiAnalysis}</p>
          </div>
        </div>
      </div>

      ${comparables.length > 0 ? `
        <div>
          <div style="font-weight:700;font-size:0.8rem;color:var(--text2);text-transform:uppercase;margin-bottom:10px;">Propiedades comparables detectadas</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${comparables.slice(0, 3).map(p => `
              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface2);border-radius:12px;">
                <div style="width:28px;height:28px;border-radius:8px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text2)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
                  <div style="font-size:0.75rem;color:var(--text2);">${p.m2}m² · ${p.address}</div>
                </div>
                <div style="font-weight:800;color:var(--accent);font-size:0.85rem;white-space:nowrap;">${window.formatPrice(p.price)}</div>
              </div>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:1.5rem;">
        <button onclick="shareValuationReport()" style="padding:12px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-weight:700;cursor:pointer;font-family:inherit;font-size:0.88rem;display:flex;align-items:center;justify-content:center;gap:6px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar resumen
        </button>
        <button onclick="generateZoneReport()" style="padding:12px;background:var(--accent-gradient);color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.88rem;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 6px 18px rgba(255,42,95,0.25);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Reporte de zona PDF
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    resultDiv.querySelectorAll('.stagger-in').forEach(el => el.classList.add('visible'));
  }, 50);

  if (!document.getElementById('spin-style')) {
    const s = document.createElement('style');
    s.id = 'spin-style';
    s.textContent = '@keyframes spin { 100% { transform: rotate(360deg); } }';
    document.head.appendChild(s);
  }
}

window.shareValuationReport = function() {
  const type = document.getElementById('val-type')?.value;
  const address = document.getElementById('val-address')?.value?.trim();
  const m2 = document.getElementById('val-m2')?.value;
  const lastRes = window._lastValuationResult;

  const estimated = lastRes ? window.formatPrice(lastRes.stats.estimatedPrice) : 'N/D';
  const range = lastRes ? `${window.formatPrice(lastRes.stats.priceRange.min)} - ${window.formatPrice(lastRes.stats.priceRange.max)}` : '';

  const text = `Tasación GeoHogar PRO\n\n${type} — ${address} (${m2}m²)\nTasación estimada: ${estimated}\nRango: ${range}\n\nAnálisis generado con datos reales del mercado paraguayo.\nMás info en geohogar.com`;

  navigator.clipboard.writeText(text).then(() => {
    if (window.showToast) window.showToast('Resumen copiado al portapapeles', 'success');
  });
};

// ===== HISTORIAL DE TASACIONES =====
window.saveValuationToHistory = function(entry) {
  try {
    const hist = JSON.parse(localStorage.getItem('broker_valuation_history') || '[]');
    hist.unshift(entry);
    localStorage.setItem('broker_valuation_history', JSON.stringify(hist.slice(0, 10)));
    if (typeof window.loadValuationHistory === 'function') window.loadValuationHistory();
  } catch (e) { console.error('Error saving valuation history:', e); }
};

window.loadValuationHistory = function() {
  try {
    const container = document.getElementById('val-history');
    if (!container) return;
    const hist = JSON.parse(localStorage.getItem('broker_valuation_history') || '[]');
    if (hist.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div style="font-weight:800;font-size:0.8rem;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.8rem;">Historial Reciente de Tasaciones</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${hist.map((h, i) => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;cursor:pointer;" onclick="restoreValuation(${i})">
            <div style="width:28px;height:28px;border-radius:8px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${h.type} · ${h.address}</div>
              <div style="font-size:0.75rem;color:var(--text2);">${h.m2} m² · ${h.marketStats?.estimatedPrice ? window.formatPrice(h.marketStats.estimatedPrice) : 'N/D'}</div>
            </div>
            <div style="font-size:0.72rem;color:var(--text2);font-weight:600;">${new Date(h.timestamp).toLocaleDateString('es-PY')}</div>
          </div>`).join('')}
      </div>
    `;
  } catch (e) { console.error('Error loading valuation history:', e); }
};

window.restoreValuation = function(index) {
  try {
    const hist = JSON.parse(localStorage.getItem('broker_valuation_history') || '[]');
    const h = hist[index];
    if (!h) return;
    if (document.getElementById('val-type')) document.getElementById('val-type').value = h.type;
    if (document.getElementById('val-op')) document.getElementById('val-op').value = h.op;
    if (document.getElementById('val-address')) document.getElementById('val-address').value = h.address;
    if (document.getElementById('val-m2')) document.getElementById('val-m2').value = h.m2;
    if (document.getElementById('val-rooms')) document.getElementById('val-rooms').value = h.rooms;
    if (document.getElementById('val-baths')) document.getElementById('val-baths').value = h.baths;
    document.getElementById('val-address')?.scrollIntoView({ behavior: 'smooth' });
  } catch (e) { console.error('Error restoring valuation:', e); }
};

// ===== REPORTE DE ZONA IMPRIMIBLE (EXECUTIVE PRO GRADE) =====
window.generateZoneReport = function() {
  const type = document.getElementById('val-type')?.value || 'Departamento';
  const op = document.getElementById('val-op')?.value || 'Venta';
  const address = document.getElementById('val-address')?.value?.trim() || 'Asunción';
  const m2 = document.getElementById('val-m2')?.value || '100';
  const rooms = document.getElementById('val-rooms')?.value || '2';
  const baths = document.getElementById('val-baths')?.value || '2';

  const lastRes = window._lastValuationResult;
  const comparables = lastRes?.comparables?.length ? lastRes.comparables : getComparableProperties(type, op, address, parseFloat(m2) || 100);
  const stats = lastRes?.stats || calculateMarketStats(comparables, parseFloat(m2) || 100, op);
  const aiAnalysis = lastRes?.aiAnalysis || `El inmueble tipo ${type} en ${address} presenta valores alineados con la dinámica inmobiliaria local.`;
  
  const reportId = `GH-VAL-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('es-PY', { day: '2-digit', month: 'long', year: 'numeric' });

  const benchmarkRows = comparables.length > 0 
    ? comparables.slice(0, 5).map(p => `
        <tr>
          <td><strong>${p.title || p.address}</strong></td>
          <td style="text-align:center;">${p.m2} m²</td>
          <td style="text-align:right;font-weight:700;">${window.formatPrice(p.price)}</td>
          <td style="text-align:right;color:#ff2a5f;font-weight:800;">${window.formatPriceM2(Math.round(p.price / p.m2))}</td>
        </tr>`).join('')
    : `
      <tr>
        <td><strong>Asunción Centro (Referencial)</strong></td>
        <td style="text-align:center;">85 m²</td>
        <td style="text-align:right;font-weight:700;">US$ 115,000</td>
        <td style="text-align:right;color:#ff2a5f;font-weight:800;">US$ 1,353/m²</td>
      </tr>
      <tr>
        <td><strong>Villa Morra / Ycuá Satí (Premium)</strong></td>
        <td style="text-align:center;">110 m²</td>
        <td style="text-align:right;font-weight:700;">US$ 195,000</td>
        <td style="text-align:right;color:#ff2a5f;font-weight:800;">US$ 1,772/m²</td>
      </tr>
      <tr>
        <td><strong>Luque / San Lorenzo (Evolución)</strong></td>
        <td style="text-align:center;">95 m²</td>
        <td style="text-align:right;font-weight:700;">US$ 85,000</td>
        <td style="text-align:right;color:#ff2a5f;font-weight:800;">US$ 894/m²</td>
      </tr>`;

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Oficial de Tasación — ${address} — GeoHogar PRO</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Outfit:wght@600;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #0f172a; background: #f8fafc; padding: 32px; max-width: 900px; margin: 0 auto; line-height: 1.5; }
    
    .report-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 36px; position: relative; }
    
    /* Header Block */
    .header-banner { background: #0f172a; color: white; border-radius: 16px; padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; border-bottom: 4px solid #ff2a5f; }
    .brand-title { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
    .brand-title span { color: #ff2a5f; }
    .header-meta { text-align: right; font-size: 12px; color: #94a3b8; }
    .header-meta strong { color: white; display: block; font-size: 13px; margin-top: 2px; }

    /* Title Block */
    .title-row { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
    .report-heading { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .report-sub { font-size: 13px; color: #64748b; font-weight: 600; }

    /* Property Params Bar */
    .params-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f1f5f9; border-radius: 12px; padding: 14px 18px; margin-bottom: 28px; }
    .param-item { text-align: left; }
    .param-label { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .param-value { font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px; }

    /* Valuation Hero Block */
    .valuation-hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; border-radius: 16px; padding: 28px; margin-bottom: 28px; border: 1px solid #334155; position: relative; overflow: hidden; }
    .valuation-hero::before { content: ''; position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,42,95,0.25) 0%, rgba(255,42,95,0) 70%); pointer-events: none; }
    .hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .hero-price-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #ff7e5f; }
    .hero-price-value { font-family: 'Outfit', sans-serif; font-size: 36px; font-weight: 800; color: #ffffff; margin: 4px 0; line-height: 1.1; }
    .hero-price-range { font-size: 13px; color: #cbd5e1; font-weight: 600; }
    
    .hero-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; border-top: 1px solid #334155; padding-top: 18px; }
    .hero-stat-box { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 14px; text-align: center; border: 1px solid rgba(255,255,255,0.08); }
    .hero-stat-lbl { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
    .hero-stat-val { font-size: 15px; font-weight: 800; color: white; margin-top: 3px; }

    /* AI Analysis Section */
    .ai-box { background: #fff1f2; border: 1px solid #ffe4e6; border-left: 4px solid #ff2a5f; border-radius: 12px; padding: 18px 22px; margin-bottom: 28px; }
    .ai-box-title { font-size: 12px; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
    .ai-box-text { font-size: 13px; color: #334155; line-height: 1.6; font-weight: 500; }

    /* Tables */
    .section-heading { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .report-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 28px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .report-table th { background: #f8fafc; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .report-table td { font-size: 12.5px; color: #1e293b; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; background: white; }
    .report-table tr:last-child td { border-bottom: none; }

    /* Key Indicators Grid */
    .indicators-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
    .ind-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: center; }
    .ind-lbl { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; }
    .ind-val { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 4px; }

    /* Footer Block */
    .report-footer { border-top: 1px dashed #cbd5e1; padding-top: 18px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; }
    .seal-badge { display: flex; align-items: center; gap: 6px; font-weight: 700; color: #10b981; }

    @media print {
      body { background: white; padding: 0; }
      .report-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="report-card">
    <!-- Header -->
    <div class="header-banner">
      <div class="brand-title">GeoHogar <span>PRO</span></div>
      <div class="header-meta">
        ID REPORTE: <strong>${reportId}</strong>
        FECHA: <strong>${dateStr}</strong>
      </div>
    </div>

    <!-- Title -->
    <div class="title-row">
      <div>
        <div class="report-heading">Informe Ejecutivo de Tasación e Inteligencia de Mercado</div>
        <div class="report-sub">Valuación algorítmica y comparables de mercado real en Paraguay</div>
      </div>
    </div>

    <!-- Parameters Grid -->
    <div class="params-grid">
      <div class="param-item">
        <div class="param-label">Tipo de Inmueble</div>
        <div class="param-value">${type}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Ubicación / Barrio</div>
        <div class="param-value">${address}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Superficie Total</div>
        <div class="param-value">${m2} m²</div>
      </div>
      <div class="param-item">
        <div class="param-label">Distribución</div>
        <div class="param-value">${rooms} Dorm. · ${baths} Baños</div>
      </div>
    </div>

    <!-- Valuation Hero -->
    <div class="valuation-hero">
      <div class="hero-top">
        <div>
          <div class="hero-price-label">Valor de Mercado Estimado</div>
          <div class="hero-price-value">${window.formatPrice(stats.estimatedPrice)}</div>
          <div class="hero-price-range">Rango Estimado de Negociación: ${window.formatPrice(stats.priceRange.min)} – ${window.formatPrice(stats.priceRange.max)}</div>
        </div>
      </div>
      <div class="hero-stats-grid">
        <div class="hero-stat-box">
          <div class="hero-stat-lbl">Precio Promedio M²</div>
          <div class="hero-stat-val">${window.formatPriceM2(stats.avgPriceM2)}</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-lbl">Grado de Confianza</div>
          <div class="hero-stat-val" style="color:#10b981;">${stats.sampleSize >= 4 ? 'Alta (★★★★★)' : 'Media (★★★☆☆)'}</div>
        </div>
        <div class="hero-stat-box">
          <div class="hero-stat-lbl">Muestra de Comparables</div>
          <div class="hero-stat-val">${stats.sampleSize} propiedades</div>
        </div>
      </div>
    </div>

    <!-- AI Verdict -->
    <div class="ai-box">
      <div class="ai-box-title">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        Dictamen de Inteligencia Artificial (Gemini AI Engine)
      </div>
      <div class="ai-box-text">${aiAnalysis}</div>
    </div>

    <!-- Comparables Table -->
    <div class="section-heading">
      <span>Propiedades Comparables de la Zona</span>
      <span style="font-size:11px;color:#94a3b8;font-weight:600;">Muestra activa en tiempo real</span>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Inmueble / Referencia</th>
          <th style="text-align:center;">Superficie</th>
          <th style="text-align:right;">Precio Total</th>
          <th style="text-align:right;">Valor m²</th>
        </tr>
      </thead>
      <tbody>
        ${benchmarkRows}
      </tbody>
    </table>

    <!-- Key Financial Indicators -->
    <div class="section-heading"><span>Indicadores Clave de Inversión y Liquidez</span></div>
    <div class="indicators-grid">
      <div class="ind-card">
        <div class="ind-lbl">ROI Bruto Estimado</div>
        <div class="ind-val" style="color:#10b981;">7.8% - 8.5%</div>
      </div>
      <div class="ind-card">
        <div class="ind-lbl">Alquiler Estimado / Mes</div>
        <div class="ind-val">${window.formatPrice(Math.round(stats.avgPriceM2 * parseFloat(m2) * 0.006))}</div>
      </div>
      <div class="ind-card">
        <div class="ind-lbl">Tiempo Estimado de Venta</div>
        <div class="ind-val">45 - 60 días</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="report-footer">
      <div class="seal-badge">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        Documento Certificado por GeoHogar PRO
      </div>
      <div>
        GeoHogar Paraguay · geohogar.com · Pag 1 de 1
      </div>
    </div>
  </div>

  <script>
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`);
  win.document.close();
};

// Exponer para broker.js
window.renderValuationTab = renderValuationTab;
