export function renderAlertsView() {
  return `
<section class="view" id="view-alerts">
        <div class="alerts-page">

          <!-- Header -->
          <div class="alerts-page-header">
            <div>
              <h2 data-i18n="alerts_header_title">Centro de Alertas</h2>
              <p data-i18n="alerts_header_desc">Configurá qué novedades querés recibir y cuándo</p>
            </div>
            <button class="btn-primary" id="btn-new-alert" style="flex-shrink:0">
              <svg viewBox="0 0 24 24"
                style="width:18px;height:18px;stroke:white;stroke-width:2.5;fill:none;margin-right:6px">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span data-i18n="new_alert">Nueva alerta</span>
            </button>
          </div>

          <!-- Create Alert Form Card -->
          <div class="alert-form-card" id="alert-form-card">
            <div class="alert-form-title">
              <svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:var(--accent);stroke-width:2;fill:none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span data-i18n="create_new_alert">Crear nueva alerta</span>
            </div>

            <div class="alert-type-grid" id="alert-type-grid">
              <button class="alert-type-btn active" data-type="price_drop">
                <span class="alert-type-icon"></span>
                <span class="alert-type-label" data-i18n="alert_type_price_drop">Baja de precio</span>
                <span class="alert-type-hint" data-i18n="alert_type_price_drop_desc">Cuando una propiedad baja su precio
                  en X%</span>
              </button>
              <button class="alert-type-btn" data-type="new_listing">
                <span class="alert-type-icon"></span>
                <span class="alert-type-label" data-i18n="alert_type_new_listing">Nueva propiedad</span>
                <span class="alert-type-hint" data-i18n="alert_type_new_listing_desc">Cuando aparece un nuevo inmueble
                  que coincide con tu búsqueda</span>
              </button>
              <button class="alert-type-btn" data-type="fav_update">
                <span class="alert-type-icon"></span>
                <span class="alert-type-label" data-i18n="alert_type_fav_update">Favs. actualizados</span>
                <span class="alert-type-hint" data-i18n="alert_type_fav_update_desc">Cuando haya cambios en inmuebles de
                  tus favoritos</span>
              </button>
              <button class="alert-type-btn premium-locked" data-type="flipping"
                style="background: rgba(212, 175, 55, 0.05); border: 1px dashed rgba(212, 175, 55, 0.5);">
                <span class="alert-type-icon"></span>
                <span class="alert-type-label" style="color: #D4AF37; font-weight: 800;"
                  data-i18n="alert_type_flipping">Flipping & Remates <span
                    style="font-size: 0.7rem; background: #D4AF37; color: white; padding: 2px 6px; border-radius: 10px; margin-left: 5px;">PRO</span></span>
                <span class="alert-type-hint" data-i18n="alert_type_flipping_desc">Notifica cuando se publique una
                  propiedad un 20% por debajo de la tasación promedio de su zona</span>
              </button>
              <button class="alert-type-btn" data-type="zone_rise">
                <span class="alert-type-icon"></span>
                <span class="alert-type-label" data-i18n="alert_type_zone_rise">Zona en alza</span>
                <span class="alert-type-hint" data-i18n="alert_type_zone_rise_desc">Cuando el precio promedio de una
                  zona sube X%, para comprar antes</span>
              </button>
            </div>

            <div class="alert-form-fields">
              <div class="alert-field-row">
                <div class="alert-field">
                  <label data-i18n="alert_field_zone">Zona / Barrio</label>
                  <select id="alert-zone">
                    <option value="" data-i18n="alert_zone_all">Todas las zonas</option>
                    <option value="Asunción Centro" data-i18n="city_asuncion_centro">Asunción Centro</option>
                    <option value="San Lorenzo" data-i18n="city_san_lorenzo">San Lorenzo</option>
                    <option value="Fernando de la Mora" data-i18n="city_fernando">Fernando de la Mora</option>
                    <option value="Luque" data-i18n="city_luque">Luque</option>
                    <option value="Lambaré" data-i18n="city_lambare">Lambaré</option>
                    <option value="Capiatá" data-i18n="city_capiata">Capiatá</option>
                    <option value="Villa Elisa" data-i18n="city_villa_elisa">Villa Elisa</option>
                    <option value="Mariano Roque Alonso" data-i18n="city_mra">Mariano Roque Alonso</option>
                  </select>
                </div>
                <div class="alert-field">
                  <label data-i18n="filter_type">Tipo de propiedad</label>
                  <select id="alert-prop-type">
                    <option value="" data-i18n="alert_type_any">Cualquier tipo</option>
                    <option value="Departamento" data-i18n="cat_depto">Departamento</option>
                    <option value="Casa" data-i18n="cat_casa">Casa</option>
                    <option value="PH" data-i18n="cat_ph">PH</option>
                    <option value="Terreno" data-i18n="cat_terreno">Terreno</option>
                    <option value="Oficina" data-i18n="cat_oficina">Oficina</option>
                  </select>
                </div>
                <div class="alert-field">
                  <label data-i18n="filter_op">Operación</label>
                  <select id="alert-op">
                    <option value="Venta" data-i18n="op_venta">Venta</option>
                  </select>
                </div>
              </div>

              <div class="alert-field-row">
                <div class="alert-field">
                  <label data-i18n="filter_pmin">Precio mín. (USD)</label>
                  <input type="number" id="alert-pmin" data-i18n="placeholder_min" placeholder="Sin mínimo" min="0" />
                </div>
                <div class="alert-field">
                  <label data-i18n="filter_pmax">Precio máx. (USD)</label>
                  <input type="number" id="alert-pmax" data-i18n="placeholder_no_limit" placeholder="Sin máximo"
                    min="0" />
                </div>
                <div class="alert-field">
                  <label data-i18n="alert_field_threshold">% de baja para notificar</label>
                  <select id="alert-threshold">
                    <option value="1" data-i18n="alert_threshold_any">Cualquier baja</option>
                    <option value="3">≥ 3%</option>
                    <option value="5" selected>≥ 5%</option>
                    <option value="10">≥ 10%</option>
                    <option value="15">≥ 15%</option>
                  </select>
                </div>
              </div>

              <div class="alert-field-row">
                <div class="alert-field" style="flex:2">
                  <label data-i18n="alert_field_name">Nombre de la alerta</label>
                  <input type="text" id="alert-name" data-i18n="alert_name_placeholder"
                    placeholder="Ej: Dptos baratos en Asunción" />
                </div>
                <div class="alert-field">
                  <label data-i18n="alert_field_freq">Frecuencia</label>
                  <select id="alert-freq">
                    <option value="instant" data-i18n="alert_freq_instant">Inmediata</option>
                    <option value="daily" data-i18n="alert_freq_daily" selected>Diaria</option>
                    <option value="weekly" data-i18n="alert_freq_weekly">Semanal</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="alert-form-actions">
              <button class="btn-secondary" id="alert-cancel-btn" data-i18n="alert_cancel">Cancelar</button>
              <button class="btn-primary" id="alert-save-btn">
                <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span data-i18n="alert_save_btn">Guardar alerta</span>
              </button>
            </div>
          </div>

          <!-- Active Alerts List -->
          <div class="alerts-section-title" data-i18n="alerts_active_title">Alertas activas</div>
          <div id="alerts-list" class="alerts-list"></div>

          <!-- Empty state -->
          <div id="alerts-empty" class="alerts-empty" style="display:none">
            <div class="alerts-empty-icon"></div>
            <h3 data-i18n="alerts_empty">Sin alertas activas</h3>
            <p data-i18n="alerts_empty_desc">Creá tu primera alerta y te avisamos cuando haya novedades que te interesen
            </p>
          </div>

        </div>
      </section>
`;
}
