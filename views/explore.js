export function renderExploreView() {
  return `
      <section class="view active" id="view-explore">
        <div class="explore-hero-card">
          <div class="hero-bg-shapes">
            <div class="hero-shape shape-1"></div>
            <div class="hero-shape shape-2"></div>
          </div>
          <div class="hero-content">
            <span class="welcome-label" data-i18n="welcome_back">Bienvenido de vuelta </span>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 2px 0 6px 0;">
              <h1 id="welcome-user-name" data-i18n="loading_user" style="margin: 0;">Cargando usuario...</h1>
              <div id="hero-stat-plan" class="premium-inline-badge" style="cursor: pointer;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span id="hero-plan-status" data-i18n="status_standard">Estándar</span>
              </div>
            </div>
            <p class="hero-subtitle" data-i18n="hero_subtitle" style="margin-bottom: 0;">Explorá las mejores
              oportunidades inmobiliarias y análisis en tiempo real de Paraguay.</p>
          </div>
        </div>

        <!-- Filtros de Inversión Inteligentes -->
        <div class="smart-filters-row">
          <div style="display: flex; align-items: center; gap: 6px; margin-right: 6px; flex-shrink: 0;">
            <span class="smart-filters-title" style="margin-right: 0;" data-i18n="investment_filters"> Filtros de
              Inversión</span>
            <button id="btn-explore-glossary"
              style="background: none; border: none; padding: 4px; color: var(--text2); display: flex; align-items: center; justify-content: center; cursor: pointer;"
              title="Ver explicaciones">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>
          <button class="smart-pill" id="explore-roi-btn"><svg viewBox="0 0 24 24" width="15" height="15" fill="none"
              stroke="currentColor" stroke-width="2.5" class="pill-icon">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg> <span data-i18n="high_roi">Alta Rentabilidad (>7%)</span></button>
          <button class="smart-pill" id="explore-market-value-btn"><svg viewBox="0 0 24 24" width="15" height="15"
              fill="none" stroke="currentColor" stroke-width="2.5" class="pill-icon">
              <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" />
            </svg> <span data-i18n="underpriced">Bajo Valor (Oportunidad)</span></button>
        </div>

        <!-- Categorías rápidas -->
        <div class="quick-cats">
          <button class="cat-btn active" data-cat="">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span data-i18n="cat_all">Todos</span>
          </button>
          <button class="cat-btn" data-cat="Casa">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span data-i18n="cat_casa">Casas</span>
          </button>
          <button class="cat-btn" data-cat="Departamento">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="9" y1="22" x2="9" y2="16" />
              <line x1="15" y1="22" x2="15" y2="16" />
              <line x1="9" y1="16" x2="15" y2="16" />
              <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zm-6 4h2v2H8v-2zm6 0h2v2h-2v-2z" />
            </svg>
            <span data-i18n="cat_depto">Departamentos</span>
          </button>
          <button class="cat-btn" data-cat="Dúplex">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M2 20V9l5-4 5 4v11H2zm10 0V9l5-4 5 4v11H12z" />
            </svg>
            <span data-i18n="cat_duplex">Dúplex</span>
          </button>
          <button class="cat-btn" data-cat="Penthouse">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="12 2 22 8.5 12 15 2 8.5 12 2" />
              <path d="M2 8.5v6.5l10 6 10-6v-6.5" />
            </svg>
            <span data-i18n="cat_penthouse">Penthouse</span>
          </button>
          <button class="cat-btn" data-cat="PH">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 21h18M3 7v14M21 7v14M6 7h12V3H6v4zM9 12h2v3H9v-3zm4 0h2v3h-2v-3z" />
            </svg>
            <span data-i18n="cat_ph">PH</span>
          </button>
          <button class="cat-btn" data-cat="Terreno">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path
                d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-2.5-4-5.5c-.5 3-2 3.9-4 5.5S6 13 6 15a7 7 0 0 0 7 7z" />
            </svg>
            <span data-i18n="cat_terreno">Terrenos</span>
          </button>
          <button class="cat-btn" data-cat="Oficina">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span data-i18n="cat_oficina">Oficinas</span>
          </button>
          <button class="cat-btn" data-cat="Local">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
              <path d="M12 2v10" />
            </svg>
            <span data-i18n="cat_local">Locales</span>
          </button>
          <button class="cat-btn" data-cat="Galpón">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 21h18M3 10l9-6 9 6v11H3V10z" />
              <path d="M9 21v-8h6v8" />
            </svg>
            <span data-i18n="cat_galpon">Galpones</span>
          </button>
          <button class="cat-btn" data-cat="Estancia">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94.77z" />
              <path d="M10.7 13.3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3.77 3.77a6 6 0 0 1 7.94-.77z" />
            </svg>
            <span data-i18n="cat_estancia">Estancias</span>
          </button>
        </div>

        <!-- Feed Toggle (Organic vs Premium Scraped Radar) -->
        <div class="feed-toggle-container">
          <button class="feed-toggle-btn active" id="feed-toggle-organic" data-source="organic">
            <span data-i18n="community_ads"> Anuncios de la Comunidad</span>
          </button>
          <button class="feed-toggle-btn" id="feed-toggle-scraped" data-source="scraped">
            <span data-i18n="radar_opps"> Radar de Oportunidades</span>
            <span class="pro-tag" data-i18n="pro_tag">PRO</span>
          </button>
        </div>

        <!-- Info Banner explaining Radar PRO -->
        <div id="radar-info-banner" class="hidden"
          style="background: linear-gradient(135deg, rgba(255, 224, 125, 0.12), rgba(212, 175, 55, 0.12)); border: 1.5px solid #d4af37; border-radius: 18px; padding: 1.2rem; margin: 1rem 0 1.5rem 0; display: flex; align-items: flex-start; gap: 12px; box-shadow: 0 4px 15px rgba(212,175,55,0.05);">
          <div style="font-size: 1.5rem; line-height: 1;"></div>
          <div style="text-align: left;">
            <h4
              style="margin: 0 0 4px; font-weight: 800; color: #b45309; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem;"
              data-i18n="radar_info_title">Radar de Oportunidades PRO</h4>
            <p style="margin: 0; font-size: 0.82rem; color: #92400e; line-height: 1.4; font-weight: 500;"
              data-i18n="radar_info_desc">
              Este radar recopila y analiza en tiempo real publicaciones inmobiliarias de múltiples portales en
              Paraguay. Filtra y destaca automáticamente propiedades que se encuentran <strong>subvaluadas</strong>
              (bajo el precio promedio por m² de su zona) o que ofrecen una <strong>alta rentabilidad (ROI estimado
                &gt;7% anual)</strong>.
            </p>
          </div>
        </div>

        <!-- Propiedades destacadas -->
        <div class="section-header">
          <h2 data-i18n="featured_properties">Propiedades Destacadas</h2>
          <span class="results-count" id="results-count">-- resultados</span>
        </div>
        <div class="properties-grid" id="properties-grid"></div>

        <!-- Market Pulse -->
        <div class="section-header" style="margin-top:2.5rem">
          <h2 data-i18n="market_pulse">Pulso del Mercado</h2>
          <span class="badge-live" data-i18n="live">● EN VIVO</span>
        </div>
        <div class="market-cards">
          <div class="market-card up">
            <div class="market-card-header">
              <span class="market-zone">Villa Morra</span>
              <span class="market-change">▲ 3.2%</span>
            </div>
            <div class="market-price">USD 1,650 <small>/m²</small></div>
            <div class="market-bar">
              <div class="market-bar-fill" style="width:78%"></div>
            </div>
            <span class="market-label" data-i18n="market_high_demand">Alta demanda</span>
          </div>
          <div class="market-card up">
            <div class="market-card-header">
              <span class="market-zone">Carmelitas</span>
              <span class="market-change">▲ 1.8%</span>
            </div>
            <div class="market-price">USD 1,580 <small>/m²</small></div>
            <div class="market-bar">
              <div class="market-bar-fill" style="width:65%"></div>
            </div>
            <span class="market-label" data-i18n="market_medium_demand">Demanda media</span>
          </div>
          <div class="market-card down">
            <div class="market-card-header">
              <span class="market-zone">Asunción Centro</span>
              <span class="market-change">▼ 0.5%</span>
            </div>
            <div class="market-price">USD 1,150 <small>/m²</small></div>
            <div class="market-bar">
              <div class="market-bar-fill" style="width:42%"></div>
            </div>
            <span class="market-label" data-i18n="market_opportunity">Oportunidad</span>
          </div>
          <div class="market-card up">
            <div class="market-card-header">
              <span class="market-zone">Las Mercedes</span>
              <span class="market-change">▲ 2.1%</span>
            </div>
            <div class="market-price">USD 1,400 <small>/m²</small></div>
            <div class="market-bar">
              <div class="market-bar-fill" style="width:88%"></div>
            </div>
            <span class="market-label" data-i18n="market_very_high_demand">Muy alta demanda</span>
          </div>
        </div>
      </section>
  `;
}
