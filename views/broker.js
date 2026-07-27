export function renderBrokerView() {
  return `
<section class="view" id="view-broker" style="position: relative; overflow-x: hidden; background: var(--bg);">

        <!-- Premium Mesh Background -->
        <div class="broker-mesh-bg"></div>

        <!-- Paywall overlay (hidden by default) -->
        <div class="premium-locked-overlay hidden" id="broker-paywall-overlay">
          <div style="font-size:4rem;margin-bottom:1rem;"></div>
          <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:1.8rem;margin-bottom:12px;">
            <span data-i18n="paywall_pro_title">Acceso Exclusivo PRO</span></h2>
          <p style="color:var(--text2);max-width:380px;line-height:1.6;margin-bottom:2rem;">Las herramientas de
            captación de leads, embudos marca blanca y radar predictivo son exclusivas para Brokers Premium.</p>
          <button class="btn-primary"
            style="padding:14px 28px;border-radius:12px;font-weight:700;border:none;cursor:pointer;">Obtener Acceso
            Premium</button>
        </div>

        <div class="broker-content-wrapper">

          <!-- ══ HEADER ══ -->
          <div class="broker-header stagger-in">
            <div>
              <h2 class="broker-main-title">
                <span class="text-gradient">Broker PRO</span>
                <span class="vip-badge">PRO</span>
              </h2>
              <p class="broker-subtitle">Leads · Alertas de Oportunidad · Tasación IA · Embudos</p>
            </div>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <button onclick="if(window.exportLeadsCSV) exportLeadsCSV()"
                style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:9px 16px;font-weight:700;font-size:.85rem;cursor:pointer;color:var(--text2);display:flex;align-items:center;gap:6px;">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Exportar CSV
              </button>
            </div>
          </div>



          <!-- ══ KPI STRIP ══ -->
          <div class="broker-kpi-strip stagger-in">
            <div class="broker-kpi-card">
              <div class="broker-kpi-icon" style="background:rgba(255,42,95,.1);color:var(--accent);">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <div class="broker-kpi-val" id="kpi-total-leads">—</div>
                <div class="broker-kpi-label" data-i18n="kpi_active_leads">Leads activos</div>
              </div>
            </div>
            <div class="broker-kpi-card">
              <div class="broker-kpi-icon" style="background:rgba(239,68,68,.1);color:#ef4444;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                </svg>
              </div>
              <div>
                <div class="broker-kpi-val" id="kpi-hot-leads">—</div>
                <div class="broker-kpi-label" data-i18n="kpi_hot_leads">Leads calientes</div>
              </div>
            </div>
            <div class="broker-kpi-card">
              <div class="broker-kpi-icon" style="background:rgba(245,158,11,.1);color:#f59e0b;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <div class="broker-kpi-val" id="kpi-owner-leads">—</div>
                <div class="broker-kpi-label" data-i18n="kpi_owner_leads">Dueños directos</div>
              </div>
            </div>
            <div class="broker-kpi-card">
              <div class="broker-kpi-icon" style="background:rgba(16,185,129,.1);color:#10b981;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div class="broker-kpi-val" id="kpi-matches">—</div>
                <div class="broker-kpi-label" data-i18n="kpi_matches">Matches con tus props</div>
              </div>
            </div>
          </div>

          <!-- ══ TABS ══ -->
          <div class="broker-tabs stagger-in">
            <button class="broker-tab-btn active glass-btn" data-target="broker-leads">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span data-i18n="tab_live_leads">Leads en vivo</span>
              <div class="tab-underline"></div>
            </button>
            <button class="broker-tab-btn glass-btn" data-target="broker-crm">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span data-i18n="tab_crm_agenda">CRM & Agenda</span>
              <div class="tab-underline"></div>
            </button>
            <button class="broker-tab-btn glass-btn" data-target="broker-notifs">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span data-i18n="tab_notif_center">Centro</span>
              <span id="broker-notif-badge"
                style="display:none;background:var(--accent);color:white;border-radius:100px;padding:1px 7px;font-size:0.7rem;font-weight:800;margin-left:4px;"></span>
              <div class="tab-underline"></div>
            </button>
            <button class="broker-tab-btn glass-btn" data-target="broker-alert-config">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.07 4.93l-1.41 1.41M20 12h-2M17.66 17.66l-1.41-1.41M12 20v-2M6.34 17.66l-1.41 1.41M4 12H2M6.34 6.34L4.93 4.93" />
              </svg>
              <span data-i18n="tab_my_alerts">Mis Alertas</span>
              <div class="tab-underline"></div>
            </button>
            <button class="broker-tab-btn glass-btn" data-target="broker-valuation">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16.01" />
                <line x1="16" y1="16" x2="16" y2="16.01" />
              </svg>
              <span data-i18n="tab_ai_valuation">Tasación IA</span>
              <div class="tab-underline"></div>
            </button>
            <button class="broker-tab-btn glass-btn" data-target="broker-funnels">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Embudos</span>
              <div class="tab-underline"></div>
            </button>
          </div>

          <!-- ── TAB 1: LEADS EN VIVO ── -->
          <div class="broker-tab-content active" id="broker-leads">
            <!-- Controls: filter + export inline in header -->
            <div class="leads-header stagger-in">
              <div>
                <h3 class="leads-title" data-i18n="leads_pool_title">Bolsa de Compradores Activos</h3>
                <p style="color:var(--text2);font-size:.88rem;margin-top:2px;">Compradores y dueños directos buscando
                  propiedades ahora</p>
              </div>
              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <!-- Filter toggle -->
                <div class="toggle-group">
                  <button class="toggle-btn active" id="toggle-all-leads" onclick="setLeadFilter(false)" data-i18n="filter_all_leads">Todos</button>
                  <button class="toggle-btn" id="toggle-owner-leads" onclick="setLeadFilter(true)">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round"
                      style="display:inline-block;vertical-align:middle;margin-right:4px">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Dueño Directo
                  </button>
                </div>
                <div class="live-indicator" data-i18n="indicator_live">
                  <span class="live-dot pulse-animation"></span>
                  <span>En vivo</span>
                </div>
              </div>
            </div>

            <div class="leads-grid" id="broker-leads-list">
              <div id="broker-leads-scanner" class="glass-card stagger-in scanner-card" style="grid-column:1/-1;">
                <div class="scanner-line"></div>
                <svg viewBox="0 0 24 24" class="scanner-icon" stroke="currentColor" fill="none">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <p class="scanner-text">Conectando al mercado de leads...</p>
              </div>
            </div>
          </div>

          <!-- 📝 TAB: CRM & AGENDA 📝 -->
          <div class="broker-tab-content" id="broker-crm" style="display:none;">
            <div class="leads-header stagger-in" style="margin-bottom:1.5rem;">
              <div>
                <h3 class="leads-title">CRM & Agenda</h3>
                <p style="color:var(--text2);font-size:.88rem;margin-top:2px;">Gestión de clientes, seguimiento y
                  calendario</p>
              </div>
              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                <button class="btn-primary" id="btn-show-all-crm"
                  style="padding:10px 16px; border-radius:12px; font-size:0.85rem; background:var(--surface2); color:var(--text); border:1px solid var(--border); display:none;">Ver
                  Todos</button>
                <button class="btn-secondary" id="btn-crm-export"
                  style="padding:10px 16px; border-radius:12px; display:flex; align-items:center; gap:8px; font-size:0.85rem; background:var(--surface2); color:var(--text); border:1px solid var(--border);">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Exportar CSV
                </button>
                <button class="btn-secondary" id="btn-crm-notify"
                  style="padding:10px 16px; border-radius:12px; display:flex; align-items:center; gap:8px; font-size:0.85rem; background:var(--surface2); color:var(--text); border:1px solid var(--border);"
                  title="Activar Notificaciones con Sonido">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
                <button class="btn-primary" id="btn-add-crm-lead"
                  style="padding:10px 16px; border-radius:12px; display:flex; align-items:center; gap:8px; flex-shrink:0;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Añadir Cliente
                </button>
              </div>
            </div>

            <!-- KPIs -->
            <div class="crm-kpis stagger-in"
              style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
              <div class="broker-kpi-card" style="padding:1rem;">
                <div class="broker-kpi-label">Total Clientes</div>
                <div class="broker-kpi-val" id="crm-kpi-total" style="font-size:1.5rem;">0</div>
              </div>
              <div class="broker-kpi-card" style="padding:1rem;">
                <div class="broker-kpi-label">Visitas Pendientes</div>
                <div class="broker-kpi-val" id="crm-kpi-pending" style="font-size:1.5rem; color:#f59e0b;">0</div>
              </div>
              <div class="broker-kpi-card" style="padding:1rem;">
                <div class="broker-kpi-label">Cerrados</div>
                <div class="broker-kpi-val" id="crm-kpi-closed" style="font-size:1.5rem; color:#10b981;">0</div>
              </div>
            </div>

            <div class="crm-layout stagger-in"
              style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:flex-start;">

              <!-- Left: Table -->
              <div class="crm-table-container"
                style="flex: 2 1 600px; background:var(--surface2); border:1px solid var(--border); border-radius:16px; overflow-x:auto;">
                <div id="crm-date-filter-label"
                  style="display:none; padding:12px 16px; background:rgba(255,42,95,0.1); color:var(--accent); font-weight:700; border-bottom:1px solid var(--border); font-size:0.9rem;">
                  Filtrando citas para el: <span id="crm-filter-date-text"></span>
                </div>
                <table class="crm-table" style="width:100%; border-collapse:collapse; text-align:left;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border); background:rgba(0,0,0,0.2);">
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Cliente</th>
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Contacto</th>
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Interés</th>
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Estado</th>
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Fecha /
                        Recordatorio</th>
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Notas</th>
                      <th style="padding:16px; font-size:0.85rem; color:var(--text2); font-weight:600;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="crm-table-body">
                    <!-- Generado por JS -->
                  </tbody>
                </table>
                <div id="crm-empty-state" style="display:none; padding:3rem; text-align:center; color:var(--text2);">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1rem; opacity:0.5;">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h4 style="color:var(--text); font-weight:600; margin-bottom:0.5rem;" id="crm-empty-title">No tienes
                    clientes en tu agenda</h4>
                  <p style="font-size:0.9rem;" id="crm-empty-desc">Haz clic en "Añadir Cliente" para registrar tu primer
                    lead.</p>
                </div>
              </div>

              <!-- Right: Calendar -->
              <div class="crm-calendar-container"
                style="flex: 1 1 300px; background:var(--surface2); border:1px solid var(--border); border-radius:16px; padding:1.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                  <button id="crm-cal-prev"
                    style="background:transparent; border:none; cursor:pointer; color:var(--text2);"><svg
                      viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg></button>
                  <div id="crm-cal-month" style="font-weight:700; font-size:1.1rem;">Mes Año</div>
                  <button id="crm-cal-next"
                    style="background:transparent; border:none; cursor:pointer; color:var(--text2);"><svg
                      viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg></button>
                </div>

                <div class="crm-cal-grid"
                  style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; font-size:0.8rem; margin-bottom:8px; color:var(--text2); font-weight:700;">
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mié</div>
                  <div>Jue</div>
                  <div>Vie</div>
                  <div>Sáb</div>
                  <div>Dom</div>
                </div>
                <div id="crm-cal-days" class="crm-cal-grid"
                  style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px;">
                  <!-- Generado por JS -->
                </div>
              </div>

            </div>
          </div>

          <!-- ── TAB 2: CENTRO DE NOTIFICACIONES ── -->
          <div class="broker-tab-content" id="broker-notifs" style="display:none;">
            <div class="stagger-in"
              style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
              <div>
                <h3 style="font-weight:800;font-size:1.3rem;">Centro de Oportunidades</h3>
                <p style="color:var(--text2);font-size:.88rem;margin-top:3px;">Alertas de precio/m² y propiedades fuera
                  de mercado detectadas por el sistema</p>
              </div>
              <button onclick="markAllBrokerNotifsRead()"
                style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:8px 16px;font-weight:700;font-size:0.85rem;cursor:pointer;color:var(--text2);white-space:nowrap;">
                Marcar leídas
              </button>
            </div>
            <div id="broker-notifs-list" class="stagger-in">
              <!-- Populated by broker-alerts.js -->
            </div>
          </div>

          <!-- ── TAB 3: MIS ALERTAS BROKER ── -->
          <div class="broker-tab-content" id="broker-alert-config" style="display:none;">
            <div class="stagger-in"
              style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
              <div>
                <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:4px;">Alertas de Mercado PRO</h3>
                <p style="color:var(--text2);font-size:0.9rem;">Motor dinámico de precio/m² por zona — alertas aisladas
                  del plan gratuito</p>
              </div>
              <button onclick="openCreateBrokerAlertModal()"
                style="background:var(--accent-gradient);color:white;border:none;border-radius:12px;padding:12px 20px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;">
                + Nueva Alerta
              </button>
            </div>
            <div id="broker-alerts-list" class="stagger-in">
              <!-- Populated by broker-alerts.js -->
            </div>

            <div class="glass-card stagger-in"
              style="padding:1.5rem;margin-top:1.5rem;background:rgba(56,189,248,0.03);border-color:rgba(56,189,248,0.2);">
              <div style="display:flex;gap:12px;align-items:flex-start;">
                <div
                  style="width:36px;height:36px;border-radius:10px;background:rgba(56,189,248,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div>
                  <div style="font-weight:700;margin-bottom:4px;">Alertas completamente aisladas</div>
                  <p style="color:var(--text2);font-size:0.88rem;line-height:1.6;margin:0;">Estas alertas se guardan en
                    <code
                      style="background:var(--surface2);padding:1px 6px;border-radius:4px;font-size:0.8rem;">broker_alerts</code>
                    y son independientes de las alertas del plan gratuito. Usan precio/m² dinámico calculado desde los
                    datos reales del mercado.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── TAB 4: TASACIÓN POR IA ── -->
          <div class="broker-tab-content" id="broker-valuation" style="display:none;">
            <div id="broker-valuation-content">
              <!-- Populated by broker-valuation.js -->
            </div>
          </div>

          <!-- ── TAB 5: EMBUDOS ── -->
          <div class="broker-tab-content" id="broker-funnels" style="display:none;">
            <div class="glass-card tilt-card stagger-in funnel-hero-card">
              <div class="funnel-hero-content">
                <h3 class="funnel-title">Tu enlace de tasación Marca Blanca</h3>
                <p class="funnel-desc">Comparte este enlace en tus redes. Los propietarios tasarán su casa gratis con IA
                  y sus datos te llegarán como leads exclusivos.</p>
                <div class="funnel-input-group">
                  <div class="glass-input-wrapper">
                    <input type="text" id="broker-funnel-link" readonly value="https://geohogar.com/tasar/mi-perfil-pro"
                      class="glass-input" />
                  </div>
                  <button class="btn-primary magnetic-btn copy-link-btn"
                    onclick="navigator.clipboard.writeText(document.getElementById('broker-funnel-link').value); if(window.showToast) showToast('Enlace copiado!', 'success');">
                    Copiar Enlace
                  </button>
                </div>
              </div>
              <div class="funnel-hero-graphic">
                <div class="graphic-circle pulse-animation"></div>
                <div class="graphic-icon" style="display:flex;align-items:center;justify-content:center;">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--accent)" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 class="stats-section-title stagger-in">Métricas de Captación (Mes actual)</h3>
            <div class="funnel-stats-grid stagger-in">
              <div class="glass-card tilt-card stat-card">
                <div class="stat-icon-wrapper" style="color: var(--accent); background: rgba(255, 42, 95, 0.1);">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div class="stat-number count-up" data-target="0">0</div>
                <div class="stat-label">Visitas al embudo</div>
              </div>
              <div class="glass-card tilt-card stat-card">
                <div class="stat-icon-wrapper" style="color: #10b981; background: rgba(16, 185, 129, 0.1);">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div class="stat-number count-up" data-target="0">0</div>
                <div class="stat-label">Tasaciones completadas</div>
              </div>
              <div class="glass-card tilt-card stat-card">
                <div class="stat-icon-wrapper" style="color: #38bdf8; background: rgba(56, 189, 248, 0.1);">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <div class="stat-number count-up" data-target="0">0</div>
                <div class="stat-label">Propiedades captadas</div>
              </div>
            </div>
          </div>

        </div><!-- end broker-content-wrapper -->
      </section>
`;
}
