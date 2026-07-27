export function renderPublishView() {
  return `
<section class="view" id="view-publish" style="position: relative;">
        <div class="publish-content-wrapper publish-container">
          <div class="publish-header">
            <h2 data-i18n="publish_title">Publicar Propiedad</h2>
            <p data-i18n="publish_subtitle">Completá los datos y llegá a miles de compradores</p>
          </div>

          <!-- Tarjeta de Sincronización Masiva con Google Sheets (Colapsable) -->
          <div class="google-sheets-sync-collapsible">
            <button type="button" id="btn-toggle-sheets-sync" class="collapsible-header"
              style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.5rem; background: transparent; border: none; font-family: inherit; cursor: pointer; text-align: left; outline: none;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--text)" stroke-width="2"
                  style="flex-shrink: 0;">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <div>
                  <h3
                    style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; font-weight: 800; color: var(--text); margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span data-i18n="sheets_sync_title">Sincronización Masiva (Google Sheets)</span>
                    <span
                      style="font-size: 0.7rem; background: #D4AF37; color: white; padding: 2px 6px; border-radius: 6px; font-weight: 800;">
                      PRO</span>
                  </h3>
                  <p style="font-size: 0.8rem; color: var(--text2); margin: 2px 0 0 0;" data-i18n="sheets_sync_desc">
                    Cargar propiedades desde una planilla de cálculo pública</p>
                </div>
              </div>
              <svg id="sheets-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--text2)"
                stroke-width="2.5" style="transition: transform 0.3s; flex-shrink: 0;">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div id="sheets-sync-content" class="hidden"
              style="padding: 0 1.5rem 1.5rem 1.5rem; border-top: 1px solid var(--border); background: rgba(255,255,255,0.4);">
              <p style="font-size: 0.85rem; color: var(--text2); line-height: 1.5; margin: 1rem 0 1.2rem 0;"
                data-i18n="sheets_sync_help">
                Podés gestionar todas tus propiedades en tiempo real usando Google Sheets. Creá una planilla con las
                columnas requeridas (id, title, type, op, price, m2, rooms, baths, address, description, lat, lng,
                image), publicala como CSV en la web y pegá el enlace aquí.
              </p>
              <div class="sync-card-body" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <input type="text" id="sheets-sync-url" data-i18n="sheets_sync_placeholder"
                  placeholder="Pegá el enlace de tu Google Sheet publicado..."
                  style="flex: 1; min-width: 250px; padding: 12px 16px; border: 2px solid var(--border); border-radius: 10px; font-size: 0.9rem;" />
                <button type="button" id="btn-sync-sheets" class="btn-primary-compact" data-i18n="sync_btn">
                  Sincronizar</button>
              </div>
            </div>
          </div>

          <div class="publish-form-body">
            <form id="publish-form">
              <div class="form-section-title" data-i18n="photos_section"> Fotos de la propiedad</div>
              <div class="image-upload-zone" id="image-upload-zone">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p data-i18n="upload_photos_label"><strong>Subí fotos</strong> o arrastrá aquí</p>
                <p style="font-size:0.8rem" data-i18n="upload_photos_sub">JPG, PNG, WebP — máx. 5 fotos</p>
                <input type="file" id="prop-image-input" accept="image/*" multiple style="display:none" />
              </div>
              <div class="image-preview" id="image-preview"></div>

              <div class="form-section-title" data-i18n="data_section"> Datos del inmueble</div>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label data-i18n="pub_field_title">Título del aviso *</label>
                  <input type="text" id="pub-title" data-i18n="pub_placeholder_title"
                    placeholder="Ej: Hermoso departamento en Asunción con vista al río" required />
                </div>
                <div class="form-group">
                  <label data-i18n="pub_field_type">Tipo de propiedad *</label>
                  <select id="pub-type" required>
                    <option value="Casa" data-i18n="cat_casa">Casa</option>
                    <option value="Departamento" data-i18n="cat_depto" selected>Departamento</option>
                    <option value="Dúplex" data-i18n="cat_duplex">Dúplex</option>
                    <option value="Penthouse" data-i18n="cat_penthouse">Penthouse</option>
                    <option value="PH" data-i18n="cat_ph">PH</option>
                    <option value="Terreno" data-i18n="cat_terreno">Terreno</option>
                    <option value="Oficina" data-i18n="cat_oficina">Oficina</option>
                    <option value="Local" data-i18n="cat_local">Local</option>
                    <option value="Galpón" data-i18n="cat_galpon">Galpón</option>
                    <option value="Estancia" data-i18n="cat_estancia">Estancia</option>
                  </select>
                </div>
                <div class="form-group">
                  <label data-i18n="pub_field_op">Operación *</label>
                  <select id="pub-op" required>
                    <option value="Venta" data-i18n="op_venta">Venta</option>
                  </select>
                </div>
                <div class="form-group">
                  <label data-i18n="pub_field_price">Precio (USD) *</label>
                  <input type="number" id="pub-price" placeholder="150000" min="1" required />
                </div>
                <div class="form-group">
                  <label data-i18n="pub_field_m2">Superficie total (m²) *</label>
                  <input type="number" id="pub-m2" placeholder="80" min="1" required />
                </div>
                <div class="form-group">
                  <label data-i18n="pub_field_rooms">Ambientes *</label>
                  <input type="number" id="pub-rooms" placeholder="3" min="1" max="20" required />
                </div>
                <div class="form-group">
                  <label data-i18n="pub_field_baths">Baños</label>
                  <input type="number" id="pub-baths" placeholder="2" min="1" max="10" value="1" />
                </div>
                <div class="form-group full-width">
                  <label data-i18n="pub_field_address">Dirección *</label>
                  <input type="text" id="pub-address" data-i18n="pub_placeholder_address"
                    placeholder="Ej: Av. Mariscal López 1234, Asunción" required />
                </div>
                <div class="form-group full-width">
                  <label data-i18n="pub_field_desc">Descripción</label>
                  <textarea id="pub-desc" rows="4" data-i18n="pub_placeholder_desc"
                    placeholder="Describí las características más destacadas..."></textarea>
                </div>
                <div class="form-group full-width">
                  <label data-i18n="pub_field_map">Ubicación en el mapa <span
                      style="font-size:0.8rem;color:var(--text2);font-weight:500">— arrastrá el marcador para
                      ajustar</span></label>
                  <div id="publish-map" class="publish-map-container"></div>
                </div>
              </div>
              <button type="submit" class="btn-primary btn-large" id="pub-submit-btn" data-i18n="pub_submit">
                Publicar propiedad
              </button>
            </form>
          </div>
        </div>
      </section>
`;
}
