export function renderMapView() {
  return `
      <section class="view active" id="view-map">
        <div class="map-container">
          <!-- Floating Map Search Bar -->
          <div class="map-search-container">
            <svg class="map-search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="map-search-input" data-i18n="map_search_placeholder"
              placeholder="Buscar en el mapa..." autocomplete="off" />
            <button class="map-search-clear hidden" id="map-search-clear-btn" data-i18n-title="clear_search_tooltip"
              title="Limpiar búsqueda">✕</button>
          </div>
          <div id="map"></div>
          <div class="map-sidebar">
            <div class="map-sidebar-header" id="map-sidebar-header-btn">
              <span class="mobile-drag-handle"></span>
              <div style="display:flex; flex-direction:column; gap:8px; width: 100%;">
                <h3 data-i18n="props_in_view">Propiedades en vista</h3>
                <div class="main-map-legend" id="main-map-legend">
                  <div class="main-map-legend-item" id="prop-legend-item">
                    <span class="legend-color"
                      style="background:#0f1e36; border: 2px solid #ff2a5f; box-shadow:0 0 4px rgba(0,0,0,0.3); border-radius: 4px; width: 16px; height: 10px;"></span>
                    <span data-i18n="map_legend_prop">Propiedad</span>
                  </div>
                  <div class="main-map-legend-item" id="opp-legend-item">
                    <span class="legend-color"
                      style="background:#0f1e36; border: 2px solid #f59e0b; box-shadow:0 0 4px rgba(245,158,11,0.5); border-radius: 4px; width: 16px; height: 10px;"></span>
                    <span>Oportunidad (PRO)</span>
                  </div>
                  <div class="main-map-legend-item" id="broker-legend-item">
                    <span class="legend-color"
                      style="background: linear-gradient(135deg, #FFDF70 0%, #D4AF37 50%, #FFDF70 100%); border: 1px solid rgba(255,255,255,0.4); box-shadow:0 0 8px rgba(212,175,55,0.7); border-radius: 4px; width: 16px; height: 10px;"></span>
                    <span>Broker (Destacado)</span>
                  </div>
                  <div class="main-map-legend-item" id="hotzone-legend-item">
                    <span class="legend-color"
                      style="background:#ff2a5f;box-shadow:0 0 8px rgba(255,42,95,0.6); filter: blur(1.5px); width: 12px; height: 12px;"></span>
                    <span data-i18n="map_legend_hotzone">Alta Demanda (Zona Caliente)</span>
                  </div>
                  <div class="main-map-legend-item" id="roi-heatmap-legend-item">
                    <span class="legend-color"
                      style="background:#10b981;box-shadow:0 0 8px rgba(16,185,129,0.6); filter: blur(1.5px); width: 12px; height: 12px;"></span>
                    <span>Zona Alto Rendimiento (ROI >7%)</span>
                  </div>
                  <div class="main-map-legend-item" id="underpriced-heatmap-legend-item">
                    <span class="legend-color"
                      style="background:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,0.6); filter: blur(1.5px); width: 12px; height: 12px;"></span>
                    <span>Zona de Oportunidad (Bajo Valor)</span>
                  </div>
                  <div class="main-map-legend-item" id="poi-legend-item">
                    <span class="legend-color"
                      style="background:transparent; border: 2px dashed #38bdf8; box-shadow:0 0 8px rgba(56,189,248,0.6); width: 12px; height: 12px;"></span>
                    <span id="poi-legend-text">Punto de Interés</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Map Feed Toggle -->
            <div class="map-feed-toggle-container">
              <button class="map-toggle-btn active" id="map-toggle-organic" data-source="organic"
                data-i18n="map_community">
                Comunidad
              </button>
              <button class="map-toggle-btn" id="map-toggle-scraped" data-source="scraped">
                <span data-i18n="map_radar"> Radar PRO</span>
                <span class="pro-tag" data-i18n="pro_badge">PRO</span>
              </button>
            </div>
            <!-- Filtros del Inversor (ROI, Bajo Valor) -->
            <div class="investor-filter-panel"
              style="padding:1.2rem 1.5rem; border-bottom:1px solid var(--border); background:var(--surface2)">
              <h4
                style="margin:0 0 0.8rem; font-size:0.85rem; font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; color:var(--text2); text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:6px">
                <span data-i18n="investment_filters"> Filtros de Inversión</span>
                <button id="btn-map-glossary"
                  style="background: none; border: none; padding: 2px; color: var(--text2); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; vertical-align: middle;"
                  data-i18n-title="view_explanations_tooltip" title="Ver explicaciones">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
              </h4>
              <div style="display:flex; gap:10px; flex-wrap:wrap">
                <button class="investor-pill" id="filter-roi-btn"><svg viewBox="0 0 24 24" width="14" height="14"
                    fill="none" stroke="currentColor" stroke-width="2.5" class="pill-icon">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg> <span data-i18n="high_roi">Alta Rentabilidad (>7%)</span></button>
                <button class="investor-pill" id="filter-market-value-btn"><svg viewBox="0 0 24 24" width="14"
                    height="14" fill="none" stroke="currentColor" stroke-width="2.5" class="pill-icon">
                    <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" />
                  </svg> <span data-i18n="underpriced_short">Bajo Valor (Desc.)</span></button>
                <button class="investor-pill premium-locked" id="filter-radar-broker-btn"
                  style="background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05)); border: 1px solid #D4AF37; color: #D4AF37;"><svg
                    viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"
                    class="pill-icon">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v20M2 12h20M12 12l5-5" />
                  </svg> <span data-i18n="radar_broker">Radar Broker</span></button>
              </div>
            </div>
            <div id="map-list" class="map-list"></div>
          </div>
          <div class="map-controls">
            <!-- Centrar en propiedades -->
            <button class="map-ctrl-btn" id="map-center-btn" data-i18n-title="map_tooltip_center"
              title="Centrar en propiedades">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </button>
            <!-- Toggle satélite -->
            <button class="map-ctrl-btn" id="map-satellite-btn" data-i18n-title="map_tooltip_satellite"
              title="Vista satélite">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                <path
                  d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            <!-- Toggle heatmap -->
            <button class="map-ctrl-btn" id="map-heatmap-toggle" data-i18n-title="map_tooltip_heatmap"
              title="Zonas de demanda">
              <svg viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" fill-opacity="0.3" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </section>
  `;
}
