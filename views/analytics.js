export function renderAnalyticsView() {
  return `
<section class="view" id="view-analytics" style="position: relative;">
        <div class="premium-locked-overlay hidden" id="analytics-paywall-overlay"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); z-index: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
          <div
            style="width:80px;height:80px;border-radius:24px;background:linear-gradient(135deg,#FFE07D,#D4AF37);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;box-shadow:0 10px 30px rgba(212,175,55,0.4);">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#0f172a" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2
            style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; background: linear-gradient(135deg, #FFE07D, #D4AF37); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-size: 2rem; margin: 0 0 10px;"
            data-i18n="paywall_title">Contenido Exclusivo Premium</h2>
          <p style="color: var(--text2); max-width: 420px; font-weight: 600; line-height: 1.6; margin: 0 0 2rem; font-size: 0.95rem;"
            data-i18n="paywall_desc">El panel de gráficos históricos, mapa de calor y tendencias de oferta está
            reservado para usuarios con membresía de Inversor Premium.</p>
          <button class="btn-primary" id="btn-analytics-upgrade"
            style="padding: 14px 28px; border-radius: 12px; font-weight: 700; background: linear-gradient(135deg, #FFE07D, #D4AF37); color: #0f172a; border: none; box-shadow: 0 8px 20px rgba(212,175,55,0.25); cursor: pointer; transition: transform 0.2s;"
            data-i18n="paywall_upgrade_btn">
            Obtener Acceso Premium
          </button>
        </div>
        <div class="analytics-header">
          <h2 data-i18n="analytics_title">Análisis de Mercado</h2>
          <p data-i18n="analytics_subtitle">Datos actualizados en tiempo real para tomar las mejores decisiones</p>
        </div>

        <!-- Data Source Tabs for Analytics -->
        <div class="data-source-tabs" id="analytics-source-tabs">
          <button class="source-tab active" data-source="all" data-i18n="source_global">Vista Global</button>
          <button class="source-tab" data-source="official" data-i18n="source_verified">Red Verificada</button>
          <button class="source-tab" data-source="radar" data-i18n="source_external">Datos Externos</button>
          <button class="source-tab" data-source="estimation" data-i18n="source_local">Datos Locales</button>
        </div>
        <!-- Macro Intelligence Dashboard (Hidden by default, shown for 'official' / Red Verificada) -->
        <div id="macro-intelligence-dashboard" class="macro-dashboard" style="display: none;">
          <div class="macro-header">
            <div class="macro-title-row">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <h3 style="margin:0;font-size:1.3rem;font-weight:800;" data-i18n="macro_intel_title">Inteligencia Macro (Paraguay)</h3>
            </div>
            <p class="macro-subtitle" style="margin:5px 0 0 0;color:var(--text2);font-size:0.9rem;">Datos oficiales para
              toma de decisiones y validación de inversiones.</p>
          </div>

          <div class="macro-cards-grid">
            <div class="macro-card highlight">
              <div class="macro-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg></div>
              <h4>IED Inmobiliaria</h4>
              <div class="macro-value">USD 931M</div>
              <p class="macro-trend positive">+15% vs 2023</p>
            </div>

            <div class="macro-card">
              <div class="macro-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg></div>
              <h4>Rentabilidad Forbes</h4>
              <div class="macro-value">7.5% - 9%</div>
              <p class="macro-desc">ROI bruto anual (USD)</p>
            </div>

            <div class="macro-card" id="card-moody">
              <div class="macro-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg></div>
              <h4>Grado Inversión</h4>
              <div class="macro-value" id="val-moody">Baa3</div>
              <p class="macro-desc">Moody's (Grado de Inversión)</p>
            </div>

            <div class="macro-card">
              <div class="macro-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg></div>
              <h4>Precio Promedio M²</h4>
              <div class="macro-value">$1,385</div>
              <p class="macro-desc">Asunción (Crecimiento +4%)</p>
            </div>

            <!-- Nuevos Cards Automáticos -->
            <div class="macro-card" id="card-gdp">
              <div class="macro-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg></div>
              <h4>Crecimiento PIB</h4>
              <div class="macro-value" id="val-gdp">--%</div>
              <p class="macro-desc">Banco Mundial</p>
            </div>

            <div class="macro-card" id="card-inflation">
              <div class="macro-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg></div>
              <h4>Inflación IPC</h4>
              <div class="macro-value" id="val-inflation">--%</div>
              <p class="macro-desc">Meta BCP (Banco Mundial)</p>
            </div>

            <div class="macro-card" id="card-currencies" style="padding: 1rem;">
              <h4 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 1v22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Cotizaciones
              </h4>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: var(--text2); font-weight: 600;">🇺🇸 USD</span>
                  <span id="val-usd" style="font-weight: 800; color: var(--text);">--</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: var(--text2); font-weight: 600;">🇪🇺 EUR</span>
                  <span id="val-eur" style="font-weight: 800; color: var(--text);">--</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: var(--text2); font-weight: 600;">🇧🇷 BRL</span>
                  <span id="val-brl" style="font-weight: 800; color: var(--text);">--</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: var(--text2); font-weight: 600;">🇧🇷 BRL</span>
                  <span id="val-brl" style="font-weight: 800; color: var(--text);">--</span>
                </div>
              </div>
              <p class="macro-desc" style="margin-top: 8px;">Yahoo Finance (Actualizado hoy)</p>
            </div>

          </div>

          <div class="macro-charts-row"
            style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <!-- Chart 1: Evolución IED -->
            <div class="analytics-card" style="margin:0;">
              <h3 style="font-size:1.05rem; margin-bottom:1rem;">Evolución IED Inmobiliaria (BCP)</h3>
              <div class="chart-wrapper" style="position: relative; width: 100%; height: 250px;">
                <canvas id="macro-chart-ied"></canvas>
              </div>
            </div>
            <!-- Chart 2: Comparativa ROI -->
            <div class="analytics-card" style="margin:0;">
              <h3 style="font-size:1.05rem; margin-bottom:1rem;">Comparativa ROI Regional</h3>
              <div class="chart-wrapper" style="position: relative; width: 100%; height: 250px;">
                <canvas id="macro-chart-roi"></canvas>
              </div>
            </div>
          </div>

          <!-- Actionable Tools Grid -->
          <h3 style="margin-bottom:1rem; font-size:1.2rem; font-weight:800;">Herramientas de Decisión Inmediata</h3>
          <div class="macro-action-tools-grid"
            style="display:grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; margin-bottom: 2rem;">

            <!-- Tool 1: Termómetro de Mercado -->
            <div class="macro-tool-card"
              style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:1.5rem;">
              <h4 style="margin:0 0 1rem 0; font-size:1rem; display:flex; align-items:center; gap:8px;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
                Termómetro de Mercado
              </h4>
              <div
                style="position:relative; height:120px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <div
                  style="width:100%; background:#e2e8f0; height:12px; border-radius:6px; overflow:hidden; position:relative;">
                  <div
                    style="position:absolute; top:0; left:0; height:100%; width:100%; background:linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #ef4444 100%);">
                  </div>
                  <div
                    style="position:absolute; top:-2px; left:75%; width:4px; height:16px; background:#0f172a; border-radius:2px; box-shadow:0 0 0 2px white; transition:left 0.5s ease;"
                    id="macro-thermometer-needle"></div>
                </div>
                <div
                  style="display:flex; justify-content:space-between; width:100%; margin-top:8px; font-size:0.75rem; color:var(--text2); font-weight:600;">
                  <span>Favorable para Comprar<br>(Precios más bajos)</span>
                  <span style="text-align:right;">Favorable para Vender<br>(Alta demanda y precios)</span>
                </div>
              </div>
              <div
                style="margin-top:1rem; padding:10px; background:rgba(16,185,129,0.1); border-radius:10px; text-align:center;">
                <strong style="color:#10b981; font-size:0.9rem;">Recomendación: ALQUILAR / PLUSVALÍA</strong>
                <p style="margin:4px 0 0 0; font-size:0.8rem; color:var(--text2);">Alta demanda de renta en zonas
                  corporativas.</p>
              </div>
            </div>

            <!-- Tool 2: Calculadora Cap Rate Neto Real -->
            <div class="macro-tool-card"
              style="background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03); position:relative; overflow:hidden;">
              <h4 style="margin:0 0 1rem 0; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Calculadora Cap Rate Neto Real (Costos PY)
              </h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:1rem;">
                <div>
                  <label style="font-size:0.75rem; color:var(--text2); font-weight:600; margin-bottom:4px; display:block;">Precio Prop. ($)</label>
                  <input type="number" id="net-cap-price" value="150000" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); font-weight:700; font-size:0.95rem; color:var(--text);">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:var(--text2); font-weight:600; margin-bottom:4px; display:block;">Alquiler/mes ($)</label>
                  <input type="number" id="net-cap-rent" value="1000" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); font-weight:700; font-size:0.95rem; color:var(--text);">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:var(--text2); font-weight:600; margin-bottom:4px; display:block;">Vacancia Est. (%)</label>
                  <input type="number" id="net-cap-vacancy" value="6" step="0.5" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); font-weight:700; font-size:0.95rem; color:var(--text);">
                </div>
                <div>
                  <label style="font-size:0.75rem; color:var(--text2); font-weight:600; margin-bottom:4px; display:block;">Expensas/mes ($)</label>
                  <input type="number" id="net-cap-expensas" value="80" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); font-weight:700; font-size:0.95rem; color:var(--text);">
                </div>
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px; text-align:center;">
                <div style="background:var(--surface2); padding:10px; border-radius:12px; border:1px solid var(--border);">
                  <span style="font-size:0.68rem; color:var(--text2); font-weight:700; display:block;">ROI BRUTO</span>
                  <strong id="net-cap-gross-out" style="font-size:1.15rem; color:var(--text); font-weight:800;">8.0%</strong>
                </div>
                <div style="background:rgba(16,185,129,0.08); padding:10px; border-radius:12px; border:1px solid rgba(16,185,129,0.2);">
                  <span style="font-size:0.68rem; color:#10b981; font-weight:700; display:block;">NOI ANUAL</span>
                  <strong id="net-cap-noi-out" style="font-size:1.1rem; color:#10b981; font-weight:800;">$ 8,832</strong>
                </div>
                <div style="background:rgba(255,42,95,0.08); padding:10px; border-radius:12px; border:1px solid rgba(255,42,95,0.2);">
                  <span style="font-size:0.68rem; color:#ff2a5f; font-weight:700; display:block;">CAP RATE NETO</span>
                  <strong id="net-cap-net-out" style="font-size:1.15rem; color:#ff2a5f; font-weight:800;">5.89%</strong>
                </div>
              </div>
            </div>

            <!-- Tool 3: Simulador Hipotecario AFD / Che Róga Porã -->
            <div class="macro-tool-card wide"
              style="background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:1.5rem; grid-column: 1 / -1; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:1.2rem;">
                <h4 style="margin:0; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent)" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Simulador de Crédito Hipotecario AFD / Che Róga Porã (Paraguay)
                </h4>
                <span style="font-size:0.75rem; padding:4px 10px; background:rgba(56,189,248,0.12); color:#0284c7; border-radius:8px; font-weight:700;">Líneas Oficiales AFD</span>
              </div>

              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:1.5rem;">
                <div>
                  <label style="font-size:0.8rem; color:var(--text2); font-weight:600; margin-bottom:6px; display:block;">Línea de Crédito</label>
                  <select id="afd-credit-line" style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); background:var(--bg); font-weight:700; font-size:0.88rem; color:var(--text);">
                    <option value="cheroga">Che Róga Porã (6.5% - 30 Años)</option>
                    <option value="afd1" selected>AFD 1ª Vivienda (7.5% - 30 Años)</option>
                    <option value="banco">Hipotecario Bancario (10.5% - 20 Años)</option>
                  </select>
                </div>
                <div>
                  <label style="font-size:0.8rem; color:var(--text2); font-weight:600; margin-bottom:6px; display:block;">Valor Inmueble (USD)</label>
                  <input type="number" id="afd-prop-price" value="65000" style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); background:var(--bg); font-weight:800; font-size:0.95rem; color:var(--text);">
                </div>
                <div>
                  <label style="font-size:0.8rem; color:var(--text2); font-weight:600; margin-bottom:6px; display:block;">Entrega Inicial (%)</label>
                  <select id="afd-downpayment" style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); background:var(--bg); font-weight:700; font-size:0.88rem; color:var(--text);">
                    <option value="0">0% (Financiación 100%)</option>
                    <option value="10" selected>10% Entrega Inicial</option>
                    <option value="20">20% Entrega Inicial</option>
                  </select>
                </div>
              </div>

              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px;">
                <div style="background:linear-gradient(145deg, rgba(56,189,248,0.1), rgba(56,189,248,0.02)); border:1px solid rgba(56,189,248,0.25); border-radius:14px; padding:14px; text-align:center;">
                  <span style="font-size:0.75rem; color:#0284c7; font-weight:700; text-transform:uppercase;">Cuota Mensual (PYG)</span>
                  <strong id="afd-quota-pyg" style="display:block; font-size:1.35rem; color:#0284c7; margin-top:4px;">Gs. 2.980.000</strong>
                  <span id="afd-quota-usd" style="font-size:0.75rem; color:var(--text2); font-weight:600;">~ USD 395/mes</span>
                </div>
                <div style="background:linear-gradient(145deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02)); border:1px solid rgba(16,185,129,0.25); border-radius:14px; padding:14px; text-align:center;">
                  <span style="font-size:0.75rem; color:#10b981; font-weight:700; text-transform:uppercase;">Ingreso Mínimo Familiar</span>
                  <strong id="afd-income-pyg" style="display:block; font-size:1.35rem; color:#10b981; margin-top:4px;">Gs. 9.930.000</strong>
                  <span style="font-size:0.72rem; color:var(--text2);">Cuota máx 30% del ingreso</span>
                </div>
                <div style="background:linear-gradient(145deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02)); border:1px solid rgba(245,158,11,0.25); border-radius:14px; padding:14px; text-align:center;">
                  <span style="font-size:0.75rem; color:#d97706; font-weight:700; text-transform:uppercase;">Monto Financiado</span>
                  <strong id="afd-financed-pyg" style="display:block; font-size:1.35rem; color:#d97706; margin-top:4px;">Gs. 441.000.000</strong>
                  <span id="afd-financed-usd" style="font-size:0.72rem; color:var(--text2);">USD 58,500</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Hot Zones -->
          <h3 style="margin-bottom:1rem; font-size:1.2rem; font-weight:800;">Top Zonas de Inversión Recomendadas</h3>
          <div class="macro-hotzones"
            style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <!-- Hot Zone 1 -->
            <div class="hotzone-card"
              style="background:linear-gradient(145deg, var(--surface), var(--bg)); border:1px solid var(--border); border-radius:16px; padding:1.2rem; position:relative; overflow:hidden;">
              <div
                style="position:absolute; top:0; right:0; background:rgba(255,42,95,0.1); color:var(--accent); font-size:0.7rem; font-weight:800; padding:4px 10px; border-bottom-left-radius:12px;">
                TOP 1</div>
              <h4 style="margin:0 0 4px 0; font-size:1.1rem; color:var(--text);">Eje Corporativo (Ykua Satí)</h4>
              <p style="margin:0 0 12px 0; font-size:0.8rem; color:var(--text2);">Alta liquidez. Demanda ejecutiva y
                expatriados.</p>
              <div
                style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.85rem; font-weight:700;">
                <span>ROI Proyectado: <span style="color:#10b981">8.5%</span></span>
                <span>USD 1,800/m²</span>
              </div>
              <button class="btn-primary-compact w-100 btn-hotzone-filter" data-zone="Ycuá Satí"
                style="width:100%;">Explorar propiedades aquí</button>
            </div>
            <!-- Hot Zone 2 -->
            <div class="hotzone-card"
              style="background:linear-gradient(145deg, var(--surface), var(--bg)); border:1px solid var(--border); border-radius:16px; padding:1.2rem; position:relative; overflow:hidden;">
              <div
                style="position:absolute; top:0; right:0; background:rgba(16,185,129,0.1); color:#10b981; font-size:0.7rem; font-weight:800; padding:4px 10px; border-bottom-left-radius:12px;">
                TOP 2</div>
              <h4 style="margin:0 0 4px 0; font-size:1.1rem; color:var(--text);">Villa Morra</h4>
              <p style="margin:0 0 12px 0; font-size:0.8rem; color:var(--text2);">Epicentro comercial y residencial.
                Gran reventa.</p>
              <div
                style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.85rem; font-weight:700;">
                <span>ROI Proyectado: <span style="color:#10b981">7.8%</span></span>
                <span>USD 1,550/m²</span>
              </div>
              <button class="btn-primary-compact w-100 btn-hotzone-filter" data-zone="Villa Morra"
                style="width:100%;">Explorar propiedades aquí</button>
            </div>
            <!-- Hot Zone 3 -->
            <div class="hotzone-card"
              style="background:linear-gradient(145deg, var(--surface), var(--bg)); border:1px solid var(--border); border-radius:16px; padding:1.2rem; position:relative; overflow:hidden;">
              <div
                style="position:absolute; top:0; right:0; background:rgba(59,130,246,0.1); color:#3b82f6; font-size:0.7rem; font-weight:800; padding:4px 10px; border-bottom-left-radius:12px;">
                TOP 3</div>
              <h4 style="margin:0 0 4px 0; font-size:1.1rem; color:var(--text);">Las Mercedes</h4>
              <p style="margin:0 0 12px 0; font-size:0.8rem; color:var(--text2);">Zona emergente premium. Fuerte demanda
                joven.</p>
              <div
                style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.85rem; font-weight:700;">
                <span>ROI Proyectado: <span style="color:#10b981">8.0%</span></span>
                <span>USD 1,350/m²</span>
              </div>
              <button class="btn-primary-compact w-100 btn-hotzone-filter" data-zone="Las Mercedes"
                style="width:100%;">Explorar propiedades aquí</button>
            </div>
          </div>

          <div class="macro-footer">
            <p style="margin:0;font-size:0.85rem;color:var(--text2);display:flex;align-items:center;gap:6px;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Fuentes: REDIEX, BCP y Forbes (Datos proyectados al 2026). Las rentabilidades son brutas y estimativas.
            </p>
          </div>
        </div>

        <div id="standard-analytics-content">
          <!-- Stats Grid for KPI Overview -->
          <div class="analytics-stats-grid">
            <div class="analytics-stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label" data-i18n="stat_avg_price_label">Precio Promedio m²</span>
                <span class="stat-val" id="stat-avg-price">USD 1,385</span>
                <span class="stat-subtext text-up" data-i18n="stat_price_change">▲ 2.4% este mes</span>
                <span class="source-badge est">Estimación de Oferta</span>
              </div>
            </div>
            <div class="analytics-stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">
                  <span data-i18n="stat_avg_roi_label">Retorno Promedio (ROI)</span>
                  <span class="glossary-info-icon" data-glossary="roi" title="Ver definición de ROI">(?)</span>
                </span>
                <span class="stat-val" id="stat-avg-roi">7.2%</span>
                <span class="stat-subtext text-up" data-i18n="stat_roi_yield">Rendimiento Alto</span>
                <span class="source-badge est">Estimación de Oferta</span>
              </div>
            </div>
            <div class="analytics-stat-card">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">
                  <span data-i18n="stat_opps_label">Oportunidades de Compra</span>
                  <span class="glossary-info-icon" data-glossary="underpriced" title="Ver definición">(?)</span>
                </span>
                <span class="stat-val" id="stat-underpriced-count">77</span>
                <span class="stat-subtext text-accent" data-i18n="stat_discount">Descuento disponible</span>
                <span class="source-badge algo">Algoritmo Radar</span>
              </div>
            </div>
            <div class="analytics-stat-card" id="card-macro-embi">
              <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">
                  Riesgo País (EMBI)
                </span>
                <span class="stat-val" id="stat-macro-embi-val">150 pts</span>
                <span class="stat-subtext text-up" id="stat-macro-embi-sub">Grado de Inversión (Baa3)</span>
                <span class="source-badge verified" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">Oficial
                  JP Morgan / Moody's</span>
              </div>
            </div>
          </div>

          <div class="analytics-grid">
            <!-- Interactive Heatmap Card -->
            <div class="analytics-card wide">
              <div class="heatmap-header-container">
                <h3 data-i18n="heatmap_title">Mapa de Calor Interactivo</h3>
                <div class="heatmap-controls-row">
                  <button class="heatmap-ctrl-btn active" data-metric="demand" data-i18n="heatmap_btn_demand">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px">
                      <path
                        d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                    </svg>Demanda
                  </button>
                  <button class="heatmap-ctrl-btn" data-metric="price" data-i18n="heatmap_btn_price">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>Precios/m²
                  </button>
                  <button class="heatmap-ctrl-btn" data-metric="roi" data-i18n="heatmap_btn_roi">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>Rendimiento (ROI)
                  </button>
                </div>
              </div>
              <div id="heatmap-container" style="height:350px;border-radius:16px;overflow:hidden;margin-bottom:1rem;">
              </div>
              <div id="heatmap-legend" class="heatmap-legend-bar">
                <!-- Dynamic Legend -->
              </div>
            </div>

            <!-- Prices by Neighborhood / City -->
            <div class="analytics-card wide">
              <div class="card-header-flex" style="margin-bottom:1rem; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <div>
                  <h3 data-i18n="chart_prices_title" style="margin-bottom:0.2rem;">Precio Promedio m² por Zona</h3>
                  <span class="chart-subtitle" data-i18n="chart_prices_subtitle" style="display:block; font-size:0.82rem; color:var(--text2); font-weight:500;">Comparación de valores de venta (USD/m²)</span>
                </div>
                <div class="zone-view-tabs" id="price-view-tabs">
                  <button class="zone-tab-btn active" data-view="neighborhood"
                    id="price-tab-neighborhoods" data-i18n="tab_barrios">Barrios</button>
                  <button class="zone-tab-btn" data-view="city" id="price-tab-cities" data-i18n="tab_ciudades">Ciudades</button>
                </div>
              </div>
              <div class="chart-wrapper horizontal-bar-wrapper" style="height: 310px;">
                <canvas id="chart-prices"></canvas>
              </div>
              <p class="chart-explanation" id="price-chart-explanation" data-i18n="chart_prices_desc"
                style="font-size:0.75rem;color:var(--text2);margin-top:0.8rem;text-align:center;">Muestra el precio
                promedio por metro cuadrado de los barrios más demandados, permitiendo identificar zonas subvaluadas.
              </p>
            </div>

            <!-- Macro vs Real ROI Projection -->
            <div class="analytics-card wide">
              <div class="card-header-flex" style="margin-bottom:1rem; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <div>
                  <h3 data-i18n="chart_macro_title" style="margin-bottom:0.2rem;">Rentabilidad Promedio vs. Referencia del Sector</h3>
                  <span class="chart-subtitle" data-i18n="chart_macro_subtitle" style="display:block; font-size:0.82rem; color:var(--text2); font-weight:500;">Retorno ROI estimado (%) en comparación con el mercado</span>
                </div>
              </div>
              <div class="chart-wrapper horizontal-bar-wrapper" style="height: 240px;">
                <canvas id="chart-macro"></canvas>
              </div>
              <p class="chart-explanation" data-i18n="chart_macro_desc"
                style="font-size:0.75rem;color:var(--text2);margin-top:0.8rem;text-align:center;">Compara el retorno
                promedio estimado de las propiedades en la app vs. referencias externas del mercado regional.</p>
            </div>

            <!-- Distribution by type -->
            <div class="analytics-card">
              <h3 data-i18n="chart_types_title" style="margin-bottom:0.2rem;">Distribución de Oferta por Tipo</h3>
              <span class="chart-subtitle" data-i18n="chart_types_subtitle" style="display:block; font-size:0.8rem; color:var(--text2); font-weight:500; margin-bottom:1rem;">Tipos de inmuebles (departamentos, casas, etc.)</span>
              <div class="chart-wrapper" style="height: 280px;">
                <canvas id="chart-types"></canvas>
              </div>
              <p class="chart-explanation" data-i18n="chart_types_desc"
                style="font-size:0.75rem;color:var(--text2);margin-top:0.8rem;text-align:center;">Proporción de tipos de
                propiedades en el mercado (casas, departamentos, terrenos, etc.).</p>
            </div>

            <!-- Price Range Distribution -->
            <div class="analytics-card">
              <div class="card-header-flex" style="margin-bottom:0.8rem; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <div>
                  <h3 data-i18n="chart_price_range_title" style="margin-bottom:0.2rem;">Distribución por Rango de Precio</h3>
                  <span class="chart-subtitle" data-i18n="chart_range_subtitle" style="display:block; font-size:0.8rem; color:var(--text2); font-weight:500;">Volumen de oferta por bandas de valor (USD)</span>
                </div>
                <div class="zone-view-tabs" id="range-view-tabs">
                  <button class="zone-tab-btn active" data-view="neighborhood"
                    id="range-tab-neighborhoods" data-i18n="tab_barrios">Barrios</button>
                  <button class="zone-tab-btn" data-view="city" id="range-tab-cities" data-i18n="tab_ciudades">Ciudades</button>
                </div>
              </div>
              <div class="chart-wrapper horizontal-bar-wrapper" style="height: 310px;">
                <canvas id="chart-ops"></canvas>
              </div>
              <p class="chart-explanation" id="range-chart-explanation"
                style="font-size:0.75rem;color:var(--text2);margin-top:0.8rem;text-align:center;">Volumen de propiedades
                en barrios de Asunción agrupadas por rango de precio (USD).</p>
            </div>

            <!-- Dynamic Neighborhood Rankings -->
            <div class="analytics-card">
              <div class="card-header-flex">
                <h3 data-i18n="rank_neighborhoods_title" style="margin-bottom:0;" id="ranking-section-title">Ranking de
                  Zonas</h3>
                <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                  <div class="zone-view-tabs" id="rank-view-tabs">
                    <button class="zone-tab-btn active" data-view="neighborhood"
                      id="rank-tab-neighborhoods">Barrios</button>
                    <button class="zone-tab-btn" data-view="city" id="rank-tab-cities" data-i18n="rank_cities">Ciudades</button>
                  </div>
                  <div class="ranking-sort-options">
                    <button class="rank-sort-btn active" data-sort="roi" data-i18n="roi_label">ROI</button>
                    <button class="rank-sort-btn" data-sort="price" data-i18n="usd_m2_label">USD/m²</button>
                  </div>
                </div>
              </div>
              <div class="ranking-list" id="neighborhood-ranking-list">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Interactive Calculator -->
            <div class="analytics-card">
              <h3 data-i18n="calc_title" style="display:flex;align-items:center;gap:8px;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="12" y2="14" />
                </svg>
                Validador Inteligente de Inversión
              </h3>
              <p style="font-size:0.8rem; color:var(--text2); margin-top:-0.8rem; margin-bottom:1.2rem; font-weight: 500;"
                data-i18n="calc_subtitle">
                Evaluá al instante el precio y rentabilidad de cualquier propiedad.
              </p>
              <div class="calculator-form">
                <div class="calc-row">
                  <div class="calc-group">
                    <label data-i18n="calc_label_zone">Barrio</label>
                    <select id="calc-zone"
                      style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); background:var(--surface); font-weight:700; color:var(--text)">
                      <option value="Villa Morra">Villa Morra</option>
                      <option value="Carmelitas">Carmelitas</option>
                      <option value="Las Mercedes">Las Mercedes</option>
                      <option value="Ycuá Satí">Ycuá Satí</option>
                      <option value="Luque">Luque</option>
                      <option value="Lambaré">Lambaré</option>
                      <option value="Centro">Asunción Centro</option>
                    </select>
                  </div>
                </div>
                <div class="calc-row" style="display:flex; gap:10px; margin-top:10px">
                  <div class="calc-group" style="flex:1">
                    <label data-i18n="calc_label_price">Precio (USD)</label>
                    <input type="number" id="calc-price" value="120000"
                      style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); font-weight:700" />
                  </div>
                  <div class="calc-group" style="flex:1">
                    <label data-i18n="calc_label_m2">Superficie (m²)</label>
                    <input type="number" id="calc-m2" value="75"
                      style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); font-weight:700" />
                  </div>
                </div>
                <div class="calc-results-box"
                  style="margin-top:1.5rem; padding:1.2rem; background:var(--surface2); border-radius:16px; border:1px solid var(--border);">
                  <div class="calc-res-item" style="display:flex; justify-content:space-between; margin-bottom:8px">
                    <span style="font-size:0.85rem; color:var(--text2); font-weight:600"
                      data-i18n="calc_label_price_m2">Precio por m²:</span>
                    <span id="calc-res-m2price" style="font-weight:800; color:var(--text)">USD 1,600/m²</span>
                  </div>
                  <div class="calc-res-item" style="display:flex; justify-content:space-between; margin-bottom:8px">
                    <span style="font-size:0.85rem; color:var(--text2); font-weight:600"
                      data-i18n="calc_label_deviation">Desvío de Mercado:</span>
                    <span id="calc-res-deviation" style="font-weight:800; color:#10b981">-3% bajo promedio</span>
                  </div>
                  <div class="calc-res-item" style="display:flex; justify-content:space-between; margin-bottom:8px">
                    <span style="font-size:0.85rem; color:var(--text2); font-weight:600" data-i18n="calc_label_roi">ROI
                      Anual Estimado:</span>
                    <span id="calc-res-roi" style="font-weight:800; color:#10b981">7.0%</span>
                  </div>
                  <div class="calc-res-verdict" id="calc-res-verdict"
                    style="margin-top:12px; padding:8px 12px; border-radius:8px; text-align:center; font-size:0.8rem; font-weight:800; background:rgba(16,185,129,0.1); color:#10b981"
                    data-i18n="calc_verdict_placeholder">
                    COMPRA RECOMENDADA (Buen ROI y valor acorde)
                  </div>

                  <!-- Detailed investment outlook block -->
                  <div id="calc-detailed-outlook-box"
                    style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); display: none; flex-direction: column; gap: 8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.8rem; color:var(--text2); font-weight:600"
                        data-i18n="calc_days_to_sell">Tiempo de Venta Estimado:</span>
                      <span id="calc-res-days-to-sell"
                        style="font-weight:700; color:var(--text); font-size:0.8rem;">-</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.8rem; color:var(--text2); font-weight:600"
                        data-i18n="calc_market_trend">Tendencia del Mercado:</span>
                      <span id="calc-res-market-trend"
                        style="font-weight:700; color:var(--text); font-size:0.8rem;">-</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                      <span style="font-size:0.8rem; color:var(--text2); font-weight:600"
                        data-i18n="calc_recommendation_outlook">Perspectiva de Inversión:</span>
                      <p id="calc-res-outlook-desc"
                        style="font-size:0.78rem; color:var(--text); line-height:1.4; margin:0; font-weight:500; text-align:left;">
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
`;
}
