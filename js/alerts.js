/**
 * GeoHogar — Sistema de Alertas de Zona
 * Permite al usuario definir zonas de interés y recibir notificaciones
 * de nuevas propiedades publicadas o cambios de precio en esas zonas.
 */

// ===== DATA =====
window.zoneAlerts = window.zoneAlerts || [];
window.priceAlerts = window.priceAlerts || [];

// Simulate stored alerts from previous session
if (window.zoneAlerts.length === 0) {
  window.zoneAlerts = [
    { id: 1, name: 'Villa Morra', city: 'Asunción', type: 'Departamento', maxPrice: 250000, active: true, created: '2026-05-15' },
    { id: 2, name: 'Asunción Centro', city: 'Asunción', type: 'Departamento', maxPrice: 200000, active: true, created: '2026-05-10' }
  ];
}

// ===== MODAL UI =====
function openZoneAlertModal() {
  const existing = document.getElementById('zone-alert-modal');
  if (existing) { existing.classList.add('active'); return; }

  const modal = document.createElement('div');
  modal.id = 'zone-alert-modal';
  modal.className = 'zone-alert-overlay';
  modal.innerHTML = `
    <div class="zone-alert-panel">
      <div class="zone-alert-header">
        <div>
          <h2 data-i18n="alerts_modal_title"> Alertas de Zona</h2>
          <p data-i18n="alerts_modal_subtitle">Recibí notificaciones cuando se publiquen propiedades en tus zonas de interés</p>
        </div>
        <button class="zone-alert-close" id="zone-alert-close">✕</button>
      </div>
      
      <div class="zone-alert-tabs">
        <button class="zone-tab active" data-tab="mis-alertas" data-i18n="tab_my_alerts">Mis Alertas</button>
        <button class="zone-tab" data-tab="nueva-alerta" data-i18n="tab_new_alert">+ Nueva Alerta</button>
        <button class="zone-tab" data-tab="precio"> <span data-i18n="tab_price">Precio</span></button>
      </div>

      <div class="zone-tab-content active" id="tab-mis-alertas">
        <div id="alertas-list"></div>
      </div>

      <div class="zone-tab-content" id="tab-nueva-alerta">
        <div class="zone-form">
          <div class="zone-form-group">
            <label data-i18n="form_zone_name">Nombre de la zona</label>
            <input type="text" id="za-name" data-i18n="form_zone_name_placeholder" placeholder="Ej: Villa Morra, Las Mercedes, Eje Corporativo..." />
          </div>
          <div class="zone-form-row">
            <div class="zone-form-group">
              <label data-i18n="filter_city">Ciudad</label>
              <select id="za-city">
                <option value="" data-i18n="city_all">Todas</option>
                <option>Asunción</option>
                <option>Luque</option>
                <option>San Lorenzo</option>
                <option>Lambaré</option>
                <option>Fernando de la Mora</option>
                <option>Ciudad del Este</option>
              </select>
            </div>
            <div class="zone-form-group">
              <label data-i18n="form_type_optional">Tipo (opcional)</label>
              <select id="za-type">
                <option value="" data-i18n="type_any">Cualquiera</option>
                <option value="Casa" data-i18n="cat_casa">Casa</option>
                <option value="Departamento" data-i18n="cat_depto">Departamento</option>
                <option value="PH" data-i18n="cat_ph">PH</option>
                <option value="Terreno" data-i18n="cat_terreno">Terreno</option>
                <option value="Oficina" data-i18n="cat_oficina">Oficina</option>
              </select>
            </div>
          </div>
          <div class="zone-form-group">
            <label data-i18n="form_max_price">Precio máximo (USD)</label>
            <input type="number" id="za-price" data-i18n="placeholder_no_limit" placeholder="Sin límite" />
          </div>
          <div class="zone-form-group">
            <label data-i18n="form_notify_when">Notificar cuando</label>
            <div class="zone-checkbox-group">
              <label class="zone-checkbox"><input type="checkbox" id="za-new" checked> <span data-i18n="notif_new_property">Nueva propiedad publicada</span></label>
              <label class="zone-checkbox"><input type="checkbox" id="za-price-drop"> <span data-i18n="notif_price_drop">Baja de precio</span></label>
              <label class="zone-checkbox"><input type="checkbox" id="za-featured"> <span data-i18n="notif_featured">Propiedad destacada</span></label>
            </div>
          </div>
          <button class="zone-save-btn" id="za-save"> <span data-i18n="btn_create_alert">Crear Alerta</span></button>
        </div>
      </div>

      <div class="zone-tab-content" id="tab-precio">
        <div class="price-alert-info">
          <div class="price-alert-icon"></div>
          <h3 data-i18n="price_alerts_title">Alertas de Precio</h3>
          <p data-i18n="price_alerts_desc">Guardá propiedades con ♥ y te avisamos automáticamente cuando bajen de precio o haya nuevas ofertas.</p>
        </div>
        <div id="price-alerts-list"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);

  // Translate static nodes inside the modal if language is not Spanish
  const currentLang = localStorage.getItem('geohogar_lang') || 'es';
  if (currentLang !== 'es' && window.changeLanguage) {
    window.changeLanguage(currentLang);
  }

  // Close
  document.getElementById('zone-alert-close').addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  });

  // Tabs
  modal.querySelectorAll('.zone-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.zone-tab').forEach(t => t.classList.remove('active'));
      modal.querySelectorAll('.zone-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
      if (tab.dataset.tab === 'mis-alertas') renderAlertsList();
      if (tab.dataset.tab === 'precio') renderPriceAlertsList();
    });
  });

  // Save alert
  document.getElementById('za-save').addEventListener('click', () => {
    const name = document.getElementById('za-name').value.trim();
    if (!name) { document.getElementById('za-name').focus(); return; }
    const alert = {
      id: Date.now(),
      name,
      city: document.getElementById('za-city').value,
      type: document.getElementById('za-type').value,
      maxPrice: parseInt(document.getElementById('za-price').value) || null,
      notifyNew: document.getElementById('za-new').checked,
      notifyDrop: document.getElementById('za-price-drop').checked,
      notifyFeatured: document.getElementById('za-featured').checked,
      active: true,
      created: new Date().toLocaleDateString('es-AR')
    };
    window.zoneAlerts.push(alert);
    document.getElementById('za-name').value = '';
    document.getElementById('za-price').value = '';
    // Switch to list tab
    modal.querySelector('[data-tab="mis-alertas"]')?.click();
    showInAppNotification(window.t('toast_alert_created_title'), window.t('toast_alert_created_body', { name }), 'success');
  });

  renderAlertsList();
  renderPriceAlertsList();
}

function renderAlertsList() {
  const list = document.getElementById('alertas-list');
  if (!list) return;
  if (window.zoneAlerts.length === 0) {
    list.innerHTML = `<div class="zone-empty"><div style="font-size:2.5rem;margin-bottom:1rem"></div><h3>${window.t('alerts_empty')}</h3><p>${window.t('alerts_empty_desc')}</p></div>`;
    return;
  }
  list.innerHTML = '';
  window.zoneAlerts.forEach(a => {
    const el = document.createElement('div');
    el.className = 'alert-item';
    const isCasa = a.type === 'Casa' || a.type === 'cat_casa';
    const isDepto = a.type === 'Departamento' || a.type === 'cat_depto';
    const typeIcon = isCasa ? '' : isDepto ? '' : '';
    const displayType = a.type ? (window.translatePropType ? window.translatePropType(a.type) : a.type) : '';
    const displayState = a.active ? window.t('alert_state_active') : window.t('alert_state_paused');
    
    el.innerHTML = `
      <div class="alert-item-icon">${typeIcon}</div>
      <div class="alert-item-info">
        <div class="alert-item-name">${a.name} ${a.city ? `<span style="color:var(--text2);font-weight:500">· ${a.city}</span>` : ''}</div>
        <div class="alert-item-meta">
          ${a.type ? `<span class="alert-tag">${displayType}</span>` : ''}
          ${a.maxPrice ? `<span class="alert-tag">≤ US$${a.maxPrice.toLocaleString()}</span>` : ''}
          <span class="alert-tag ${a.active ? 'active' : ''}">● ${displayState}</span>
        </div>
      </div>
      <div class="alert-item-actions">
        <button class="alert-toggle" data-id="${a.id}" title="${a.active ? window.t('alert_toggle_pause_tooltip') : window.t('alert_toggle_resume_tooltip')}">${a.active ? '⏸' : '▶'}</button>
        <button class="alert-delete" data-id="${a.id}" title="${window.t('alert_delete_tooltip')}"></button>
      </div>
    `;
    list.appendChild(el);
  });

  list.querySelectorAll('.alert-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = window.zoneAlerts.find(x => x.id == btn.dataset.id);
      if (a) { a.active = !a.active; renderAlertsList(); }
    });
  });
  list.querySelectorAll('.alert-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      window.zoneAlerts = window.zoneAlerts.filter(x => x.id != btn.dataset.id);
      renderAlertsList();
    });
  });
}

function renderPriceAlertsList() {
  const list = document.getElementById('price-alerts-list');
  if (!list) return;
  const favs = Array.from(window.appData?.favorites || []);
  const favProps = (window.appData?.properties || []).filter(p => favs.includes(p.id));
  if (favProps.length === 0) {
    list.innerHTML = `<div class="zone-empty"><div style="font-size:2rem;margin-bottom:0.5rem">❤</div><p style="font-weight:600">${window.t('empty_price_alerts_desc')}</p></div>`;
    return;
  }
  list.innerHTML = `<div style="padding:0 0 1rem;font-size:0.85rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px">${window.t('monitoring_prices')}</div>`;
  favProps.forEach(p => {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px;background:var(--surface2);border-radius:14px;margin-bottom:10px';
    el.innerHTML = `<img src="${p.img}" style="width:60px;height:45px;object-fit:cover;border-radius:8px"><div style="flex:1"><div style="font-weight:700;font-size:0.9rem">${p.title}</div><div style="font-size:0.85rem;color:var(--accent);font-weight:800">US$ ${p.price.toLocaleString()}</div></div><span style="font-size:0.75rem;color:#10b981;font-weight:700;background:rgba(16,185,129,0.1);padding:4px 10px;border-radius:100px">● ${window.t('monitoring_active')}</span>`;
    list.appendChild(el);
  });
}

// ===== IN-APP NOTIFICATION SYSTEM =====
function showInAppNotification(title, body, type = 'info', duration = 5000) {
  // No mostrar notificaciones mientras se muestra el login
  const loginScreen = document.getElementById('login-screen');
  if (loginScreen && !loginScreen.classList.contains('hidden')) return;

  const container = document.getElementById('notif-container') || createNotifContainer();
  const n = document.createElement('div');
  n.className = `inapp-notif inapp-notif-${type}`;
  const icons = { success: '', info: '', price: '', new: '', warn: '' };
  n.innerHTML = `
    <div class="inapp-notif-icon">${icons[type] || ''}</div>
    <div class="inapp-notif-body">
      <div class="inapp-notif-title">${title}</div>
      <div class="inapp-notif-text">${body}</div>
    </div>
    <button class="inapp-notif-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(n);
  setTimeout(() => n.classList.add('show'), 10);
  setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 400); }, duration);

  // Also add to notification panel list
  addToNotifPanel(icons[type] || '', `${title}: ${body}`);
}

function createNotifContainer() {
  const c = document.createElement('div');
  c.id = 'notif-container';
  c.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:360px;';
  document.body.appendChild(c);
  return c;
}

function addToNotifPanel(icon, text) {
  const list = document.getElementById('notif-list');
  if (!list) return;
  const el = document.createElement('div');
  el.className = 'notif-item notif-unread';
  const translatedText = window.translateNotificationText ? window.translateNotificationText(text) : text;
  el.innerHTML = `<div class="notif-icon">${icon}</div><div class="notif-content"><div class="notif-text">${translatedText}</div><div class="notif-time">${window.t('notif_time_now')}</div></div>`;
  list.insertBefore(el, list.firstChild);
  // Show red dot on bell
  const dot = document.querySelector('.notif-dot');
  if (dot) { dot.style.background = '#ff2a5f'; dot.style.transform = 'scale(1.3)'; }
}

// Re-render lists on language change event
document.addEventListener('geohogar:lang:changed', () => {
  if (typeof renderAlertsList === 'function') renderAlertsList();
  if (typeof renderPriceAlertsList === 'function') renderPriceAlertsList();
});

// Expose globally
window.openZoneAlertModal = openZoneAlertModal;
window.showInAppNotification = showInAppNotification;

// Iniciar estilos de alertas
document.addEventListener('DOMContentLoaded', () => {
  injectAlertStyles();
});

function injectAlertStyles() {
  const s = document.createElement('style');
  s.textContent = `
    /* Zone Alert Modal */
    .zone-alert-overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(6px);
      z-index: 3000; display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s; pointer-events: none;
    }
    .zone-alert-overlay.active { opacity: 1; pointer-events: auto; }
    .zone-alert-panel {
      background: white; width: 95%; max-width: 560px; max-height: 88vh;
      border-radius: 28px; overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 30px 60px -12px rgba(0,0,0,0.4);
      transform: translateY(30px) scale(0.97); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .zone-alert-overlay.active .zone-alert-panel { transform: translateY(0) scale(1); }
    .zone-alert-header { background: linear-gradient(135deg,#ff2a5f,#ff7e5f); padding: 2rem 2rem 1.5rem; color: white; display: flex; justify-content: space-between; align-items: flex-start; }
    .zone-alert-header h2 { font-family: 'Plus Jakarta Sans',sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; }
    .zone-alert-header p { font-size: 0.88rem; opacity: 0.85; max-width: 360px; }
    .zone-alert-close { background: rgba(255,255,255,0.2); border: none; width: 36px; height: 36px; border-radius: 50%; color: white; cursor: pointer; font-size: 1rem; flex-shrink: 0; transition: background 0.2s; }
    .zone-alert-close:hover { background: rgba(255,255,255,0.35); }
    .zone-alert-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); background: white; }
    .zone-tab { flex: 1; padding: 1rem; border: none; background: none; cursor: pointer; font-weight: 700; font-size: 0.9rem; color: var(--text2); font-family: inherit; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .zone-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .zone-tab-content { display: none; flex: 1; overflow-y: auto; padding: 1.5rem; }
    .zone-tab-content.active { display: block; }
    .zone-form-group { margin-bottom: 1.2rem; }
    .zone-form-group label { display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; color: var(--text); }
    .zone-form-group input, .zone-form-group select { width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 12px; font-family: inherit; font-size: 0.95rem; outline: none; background: var(--surface2); transition: all 0.2s; }
    .zone-form-group input:focus, .zone-form-group select:focus { border-color: var(--accent); background: white; box-shadow: 0 0 0 3px rgba(255,42,95,0.1); }
    .zone-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .zone-checkbox-group { display: flex; flex-direction: column; gap: 10px; }
    .zone-checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
    .zone-checkbox input { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; }
    .zone-save-btn { width: 100%; padding: 14px; background: var(--accent-gradient); color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; font-family: inherit; margin-top: 0.5rem; transition: all 0.2s; box-shadow: var(--shadow-accent); }
    .zone-save-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px -5px rgba(255,42,95,0.4); }
    .alert-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--surface2); border-radius: 16px; margin-bottom: 10px; }
    .alert-item-icon { font-size: 1.5rem; width: 40px; text-align: center; flex-shrink: 0; }
    .alert-item-info { flex: 1; min-width: 0; }
    .alert-item-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; }
    .alert-item-meta { display: flex; gap: 6px; flex-wrap: wrap; }
    .alert-tag { padding: 2px 10px; background: white; border: 1px solid var(--border); border-radius: 100px; font-size: 0.75rem; font-weight: 700; color: var(--text2); }
    .alert-tag.active { color: #10b981; background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); }
    .alert-item-actions { display: flex; gap: 6px; }
    .alert-toggle, .alert-delete { background: white; border: 1px solid var(--border); border-radius: 10px; width: 34px; height: 34px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .alert-toggle:hover { background: var(--accent); border-color: var(--accent); }
    .alert-delete:hover { background: #fee2e2; border-color: #fca5a5; }
    .zone-empty { text-align: center; padding: 3rem 1rem; color: var(--text2); }
    .zone-empty h3 { font-size: 1.1rem; font-weight: 800; color: var(--text); margin-bottom: 0.5rem; }
    .price-alert-info { text-align: center; padding: 2rem 1rem; }
    .price-alert-icon { font-size: 3rem; margin-bottom: 1rem; }
    .price-alert-info h3 { font-family: 'Plus Jakarta Sans',sans-serif; font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem; }
    .price-alert-info p { color: var(--text2); font-size: 0.95rem; line-height: 1.6; max-width: 320px; margin: 0 auto 1.5rem; }
    .simulate-btn-wrap { margin-top: 1.5rem; }

    /* In-App Notifications (toast-style) */
    .inapp-notif {
      background: white; border-radius: 16px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12); border: 1px solid var(--border);
      transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      border-left: 4px solid var(--accent); min-width: 300px;
    }
    .inapp-notif.show { transform: translateX(0); }
    .inapp-notif-price { border-left-color: #10b981; }
    .inapp-notif-new   { border-left-color: #38bdf8; }
    .inapp-notif-success { border-left-color: #10b981; }
    .inapp-notif-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
    .inapp-notif-body { flex: 1; min-width: 0; }
    .inapp-notif-title { font-weight: 800; font-size: 0.9rem; color: var(--text); margin-bottom: 3px; }
    .inapp-notif-text { font-size: 0.82rem; color: var(--text2); font-weight: 600; line-height: 1.4; }
    .inapp-notif-close { background: none; border: none; cursor: pointer; color: var(--text2); font-size: 1rem; padding: 0; flex-shrink: 0; opacity: 0.6; }
    .inapp-notif-close:hover { opacity: 1; }

    @media (max-width: 768px) {
      .zone-form-row { grid-template-columns: 1fr; }
      #notif-container { right: 10px; left: 10px; max-width: none; top: 70px; }
      .inapp-notif { min-width: auto; }
    }
  `;
  document.head.appendChild(s);
}
