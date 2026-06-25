/**
 * broker-alerts.js — Sistema de Alertas Exclusivo del Broker PRO
 * Colección Firestore: broker_alerts / broker_notifications
 * COMPLETAMENTE AISLADO de alerts.js (plan gratuito)
 */

// ===== ESTADO INTERNO =====
let brokerAlertsUnsubscribe = null;
let brokerNotifsUnsubscribe = null;
let currentBrokerUserId = null;
let _brokerAlerts = [];
let _brokerNotifs = [];
let _unreadBrokerCount = 0;
let _brokerSystemInitialized = false;

// Cache de promedios por zona (se actualiza cada 10 min)
let _zonePriceCache = {};
let _zonePriceCacheTime = 0;

// ===== MOTOR DE PRECIO/M² POR ZONA =====
function getZoneAvgPriceM2(propType, address, op) {
  if (Date.now() - _zonePriceCacheTime > 600000) {
    _zonePriceCache = {};
    _zonePriceCacheTime = Date.now();
  }

  const zone = extractZoneFromAddress(address);
  const cacheKey = `${propType}|${zone}|${op || 'Venta'}`;
  if (_zonePriceCache[cacheKey] !== undefined) return _zonePriceCache[cacheKey];

  const allProps = window.appData?.properties || [];
  const comparables = allProps.filter(p => {
    if (p.type !== propType) return false;
    if (p.m2 <= 0 || p.price <= 0) return false;
    if ((p.op || 'Venta') !== (op || 'Venta')) return false;
    const pZone = extractZoneFromAddress(p.address || '');
    return pZone === zone || (zone.length > 4 && (p.address || '').toLowerCase().includes(zone));
  });

  if (comparables.length < 3) {
    const fallback = allProps.filter(p => p.type === propType && p.m2 > 0 && p.price > 100);
    if (fallback.length < 3) { _zonePriceCache[cacheKey] = null; return null; }
    const avg = fallback.reduce((s, p) => s + p.price / p.m2, 0) / fallback.length;
    _zonePriceCache[cacheKey] = Math.round(avg);
    return _zonePriceCache[cacheKey];
  }

  const prices = comparables.map(p => p.price / p.m2).sort((a, b) => a - b);
  const q1 = prices[Math.floor(prices.length * 0.25)];
  const q3 = prices[Math.floor(prices.length * 0.75)];
  const filtered = prices.filter(v => v >= q1 && v <= q3);
  const avg = filtered.reduce((s, v) => s + v, 0) / filtered.length;
  _zonePriceCache[cacheKey] = Math.round(avg);
  return _zonePriceCache[cacheKey];
}

function extractZoneFromAddress(address) {
  if (!address) return '';
  const parts = address.toLowerCase().split(',').map(s => s.trim());
  const meaningful = parts.filter(p => p.length > 3 && !/^\d+$/.test(p));
  return meaningful[0] || parts[0] || '';
}

window.getZoneAvgPriceM2 = getZoneAvgPriceM2;
window.extractZoneFromAddress = extractZoneFromAddress;

// ===== OBTENER UID ACTUAL (siempre fresco) =====
function getCurrentUID() {
  // Prioridad: Auth de Firebase (lo más fiable), luego variable en memoria
  return window.firebaseAuth?.currentUser?.uid || currentBrokerUserId || null;
}

// ===== ESCUCHAR AUTENTICACIÓN =====
document.addEventListener('geohogar:auth:loggedin', (e) => {
  currentBrokerUserId = e.detail.user.uid;
  _brokerSystemInitialized = false; // Permitir re-init si cambia usuario
  initBrokerAlertsSystem(currentBrokerUserId);
  if (window.initBrokerLeads) window.initBrokerLeads();
});

document.addEventListener('geohogar:auth:loggedout', () => {
  currentBrokerUserId = null;
  _brokerSystemInitialized = false;
  if (brokerAlertsUnsubscribe) { brokerAlertsUnsubscribe(); brokerAlertsUnsubscribe = null; }
  if (brokerNotifsUnsubscribe) { brokerNotifsUnsubscribe(); brokerNotifsUnsubscribe = null; }
  _brokerAlerts = [];
  _brokerNotifs = [];
  renderBrokerAlertsPanel();
  renderBrokerNotifsPanel();
});

async function initBrokerAlertsSystem(userId) {
  if (_brokerSystemInitialized) return;
  _brokerSystemInitialized = true;

  if (typeof firebase === 'undefined') {
    _brokerAlerts = [];
    _brokerNotifs = [];
    renderBrokerAlertsPanel();
    renderBrokerNotifsPanel();
    return;
  }

  const db = firebase.firestore();
  const alertsRef = db.collection('broker_alerts');
  const notifsRef = db.collection('broker_notifications');

  // Removed auto-seed for production

  // Suscribirse a alertas en tiempo real
  if (brokerAlertsUnsubscribe) brokerAlertsUnsubscribe();
  brokerAlertsUnsubscribe = alertsRef
    .where('userId', '==', userId)
    .onSnapshot(snapshot => {
      _brokerAlerts = [];
      snapshot.forEach(doc => _brokerAlerts.push({ ...doc.data(), _docId: doc.id }));
      _brokerAlerts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      renderBrokerAlertsPanel();
    }, err => {
      console.error('Broker: error escuchando alertas:', err);
    });

  // Suscribirse a notificaciones SIN orderBy (evita el error de índice)
  if (brokerNotifsUnsubscribe) brokerNotifsUnsubscribe();
  brokerNotifsUnsubscribe = notifsRef
    .where('userId', '==', userId)
    .limit(50)
    .onSnapshot(snapshot => {
      _brokerNotifs = [];
      snapshot.forEach(doc => _brokerNotifs.push({ ...doc.data(), _docId: doc.id }));
      // Ordenar localmente para no necesitar índice compuesto en Firebase
      _brokerNotifs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      _brokerNotifs = _brokerNotifs.slice(0, 30);
      _unreadBrokerCount = _brokerNotifs.filter(n => n.unread).length;
      renderBrokerNotifsPanel();
      updateBrokerNotifBadge();
    }, err => {
      console.error('Broker: error escuchando notificaciones:', err);
    });

  // Iniciar el motor de detección de oportunidades
  startBrokerOpportunityEngine(userId);
}

// ===== MOTOR DE OPORTUNIDADES =====
function startBrokerOpportunityEngine(userId) {
  if (typeof firebase === 'undefined') return;
  const db = firebase.firestore();
  const propsRef = db.collection('properties');

  try {
    propsRef.limit(100).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added' || change.type === 'modified') {
          const prop = change.doc.data();
          checkPropAgainstBrokerAlerts(prop, userId);
        }
      });
    }, error => {
      console.warn('Broker: no se puede escuchar propiedades:', error.message);
    });
  } catch (err) {
    console.warn('Broker: error al inicializar motor de oportunidades:', err);
  }
}

async function checkPropAgainstBrokerAlerts(prop, userId) {
  if (!_brokerAlerts.length) return;

  for (const alert of _brokerAlerts) {
    if (!alert.active) continue;
    if (alert.userId !== userId) continue;

    let match = true;

    if (alert.zone && !((prop.address || '').toLowerCase().includes(alert.zone.toLowerCase()))) {
      match = false;
    }
    if (alert.propType && prop.type !== alert.propType) match = false;

    if (alert.alertType === 'underpriced') {
      const avgM2 = getZoneAvgPriceM2(prop.type, prop.address, prop.op);
      if (avgM2 === null) { match = false; continue; }
      const propM2 = prop.m2 > 0 ? prop.price / prop.m2 : 0;
      if (propM2 === 0 || propM2 >= avgM2 * 0.85) match = false;
    }
    if (alert.alertType === 'overpriced') {
      const avgM2 = getZoneAvgPriceM2(prop.type, prop.address, prop.op);
      if (avgM2 === null) { match = false; continue; }
      const propM2 = prop.m2 > 0 ? prop.price / prop.m2 : 0;
      if (propM2 === 0 || propM2 <= avgM2 * 1.20) match = false;
    }

    if (match) {
      const notifId = `broker_notif_${alert.id}_${prop.id}_${Date.now()}`;
      const db = firebase.firestore();
      const existingSnap = await db.collection('broker_notifications')
        .where('propId', '==', String(prop.id))
        .where('alertId', '==', String(alert.id))
        .limit(1).get();
      if (!existingSnap.empty) continue;

      const notifData = {
        id: notifId,
        userId,
        alertId: String(alert.id),
        alertName: alert.name,
        alertType: alert.alertType,
        propId: String(prop.id),
        propTitle: prop.title,
        propAddress: prop.address,
        propPrice: prop.price,
        propType: prop.type,
        propImg: prop.img || '',
        message: buildBrokerNotifMessage(alert, prop),
        timestamp: Date.now(),
        unread: true
      };
      await db.collection('broker_notifications').doc(notifId).set(notifData);
    }
  }
}

function buildBrokerNotifMessage(alert, prop) {
  const price = prop.price ? `US$ ${prop.price.toLocaleString()}` : 'Sin precio';
  if (alert.alertType === 'underpriced') {
    const disc = prop.discount || '?';
    return ` Oportunidad: "${prop.title}" está ${disc}% por debajo del mercado en ${prop.address}. Precio: ${price}.`;
  }
  if (alert.alertType === 'overpriced') {
    return ` Posible captación: "${prop.title}" en ${prop.address} tiene alto precio por m². Podría estar interesado en vender. Precio: ${price}.`;
  }
  return ` Nueva propiedad en tu zona: "${prop.title}" por ${price} en ${prop.address}.`;
}

// ===== CRUD DE ALERTAS BROKER =====
window.saveBrokerAlert = async function(alertData) {
  // Siempre obtenemos el UID en el momento del guardado, no del cierre del modal
  const uid = getCurrentUID();
  if (!uid) {
    console.error('Broker Alerts: usuario no autenticado al guardar.');
    if (window.showToast) window.showToast('Error: inicia sesión para guardar alertas', 'error');
    return;
  }

  // Forzar el userId correcto en el objeto que se guarda
  alertData.userId = uid;
  alertData.createdAt = alertData.createdAt || Date.now();

  if (typeof firebase === 'undefined') {
    if (window.showToast) window.showToast('Error: Firebase no disponible', 'error');
    return;
  }

  try {
    const db = firebase.firestore();
    await db.collection('broker_alerts').doc(String(alertData.id)).set(alertData);
    // El listener onSnapshot actualizará la UI automáticamente
  } catch (error) {
    console.error('Error guardando alerta broker:', error);
    if (window.showToast) window.showToast('Error al guardar la alerta: ' + error.message, 'error');
    throw error;
  }
};

window.deleteBrokerAlert = async function(alertId) {
  if (typeof firebase === 'undefined') return;
  try {
    const db = firebase.firestore();
    await db.collection('broker_alerts').doc(String(alertId)).delete();
    if (window.showToast) window.showToast('Alerta eliminada', 'success');
  } catch (error) {
    console.error('Error eliminando alerta broker:', error);
    if (window.showToast) window.showToast('Error al eliminar la alerta', 'error');
  }
};

window.toggleBrokerAlert = async function(alertId, active) {
  if (typeof firebase === 'undefined') return;
  try {
    const db = firebase.firestore();
    await db.collection('broker_alerts').doc(String(alertId)).update({ active });
  } catch (error) {
    console.error('Error actualizando alerta broker:', error);
    if (window.showToast) window.showToast('Error al actualizar la alerta', 'error');
  }
};

window.markBrokerNotifRead = async function(notifId) {
  if (typeof firebase === 'undefined') return;
  try {
    const db = firebase.firestore();
    await db.collection('broker_notifications').doc(String(notifId)).update({ unread: false });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
  }
};

// ===== RENDER: PANEL DE ALERTAS BROKER =====
function renderBrokerAlertsPanel() {
  const container = document.getElementById('broker-alerts-list');
  if (!container) return;

  if (_brokerAlerts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--text2);">
        <div style="font-size:3rem;margin-bottom:1rem;"></div>
        <h3 style="font-weight:800;color:var(--text);margin-bottom:8px;">Sin alertas configuradas</h3>
        <p style="font-size:0.95rem;">Crea tu primera alerta para detectar oportunidades del mercado.</p>
      </div>`;
    return;
  }

  container.innerHTML = '';
  _brokerAlerts.forEach(alert => {
    const el = document.createElement('div');
    el.className = 'glass-card broker-alert-card';
    el.style.cssText = 'padding:1.4rem;margin-bottom:12px;';
    const typeMap = {
      underpriced: { icon: '', label: 'Subvaluadas' },
      overpriced: { icon: '', label: 'Captar propietarios' },
      new_listing: { icon: '', label: 'Nueva publicación' }
    };
    const tm = typeMap[alert.alertType] || typeMap['new_listing'];

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="font-size:1.8rem;flex-shrink:0;">${tm.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;font-size:1rem;color:var(--text);margin-bottom:6px;">${escapeHtml(alert.name)}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span style="padding:2px 10px;background:var(--surface2);border-radius:100px;font-size:0.75rem;font-weight:700;color:var(--text2);border:1px solid var(--border);">${tm.label}</span>
            ${alert.zone ? `<span style="padding:2px 10px;background:var(--surface2);border-radius:100px;font-size:0.75rem;font-weight:700;color:var(--text2);border:1px solid var(--border);"> ${escapeHtml(alert.zone)}</span>` : ''}
            ${alert.propType ? `<span style="padding:2px 10px;background:var(--surface2);border-radius:100px;font-size:0.75rem;font-weight:700;color:var(--text2);border:1px solid var(--border);"> ${escapeHtml(alert.propType)}</span>` : ''}
            <span style="padding:2px 10px;border-radius:100px;font-size:0.75rem;font-weight:700;background:${alert.active ? 'rgba(16,185,129,0.1)' : 'var(--surface2)'};color:${alert.active ? '#10b981' : 'var(--text2)'};border:1px solid ${alert.active ? 'rgba(16,185,129,0.3)' : 'var(--border)'};">● ${alert.active ? 'Activa' : 'Pausada'}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0;">
          <button onclick="window.toggleBrokerAlert('${alert.id || alert._docId}', ${!alert.active})" style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;cursor:pointer;font-size:1rem;" title="${alert.active ? 'Pausar' : 'Activar'}">${alert.active ? '⏸' : '▶'}</button>
          <button onclick="window.deleteBrokerAlert('${alert.id || alert._docId}')" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;width:36px;height:36px;cursor:pointer;font-size:1rem;" title="Eliminar"></button>
        </div>
      </div>`;
    container.appendChild(el);
  });
}

// ===== RENDER: PANEL DE NOTIFICACIONES BROKER =====
function renderBrokerNotifsPanel() {
  const container = document.getElementById('broker-notifs-list');
  if (!container) return;

  if (_brokerNotifs.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--text2);">
        <div style="font-size:3rem;margin-bottom:1rem;"></div>
        <h3 style="font-weight:800;color:var(--text);margin-bottom:8px;">Sin notificaciones</h3>
        <p>Las oportunidades de mercado aparecerán aquí en tiempo real.</p>
      </div>`;
    return;
  }

  container.innerHTML = '';
  _brokerNotifs.forEach(notif => {
    const el = document.createElement('div');
    el.style.cssText = `display:flex;align-items:flex-start;gap:14px;padding:1.2rem;border-radius:16px;border:1px solid var(--border);background:${notif.unread ? 'var(--surface)' : 'transparent'};margin-bottom:10px;cursor:pointer;transition:all 0.2s;${notif.unread ? 'border-left:3px solid var(--accent);' : ''}`;

    const timeAgo = getTimeAgo(notif.timestamp);
    const propLink = notif.propId ? `<button onclick="window.openPropertyFromBroker('${notif.propId}')" style="margin-top:10px;background:var(--accent-gradient);color:white;border:none;border-radius:10px;padding:8px 16px;font-weight:700;font-size:0.85rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">Ver propiedad →</button>` : '';

    el.innerHTML = `
      <div style="font-size:1.5rem;flex-shrink:0;margin-top:2px;">${notif.alertType === 'underpriced' ? '' : notif.alertType === 'overpriced' ? '' : ''}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:${notif.unread ? '800' : '600'};font-size:0.9rem;color:var(--text);line-height:1.5;margin-bottom:4px;">${notif.message}</div>
        <div style="font-size:0.8rem;color:var(--text2);font-weight:600;">${timeAgo} · Alerta: ${escapeHtml(notif.alertName || '')}</div>
        ${propLink}
      </div>
      ${notif.unread ? `<div style="width:8px;height:8px;background:var(--accent);border-radius:50%;flex-shrink:0;margin-top:6px;"></div>` : ''}
    `;
    el.addEventListener('click', () => {
      if (notif.unread) window.markBrokerNotifRead(notif.id || notif._docId);
    });
    container.appendChild(el);
  });
}

function updateBrokerNotifBadge() {
  const badge = document.getElementById('broker-notif-badge');
  if (!badge) return;
  if (_unreadBrokerCount > 0) {
    badge.textContent = _unreadBrokerCount;
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

// ===== MODAL: CREAR ALERTA BROKER =====
window.openCreateBrokerAlertModal = function() {
  const existing = document.getElementById('broker-alert-create-modal');
  if (existing) existing.remove();

  // Verificar autenticación antes de abrir el modal
  const uid = getCurrentUID();
  if (!uid) {
    if (window.showToast) window.showToast('Debes iniciar sesión para crear alertas', 'error');
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'broker-alert-create-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);z-index:5000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML = `
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:24px;width:100%;max-width:520px;padding:2.5rem;box-shadow:0 30px 60px rgba(0,0,0,0.3);">
      <h3 style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:10px;"> Nueva Alerta Broker</h3>
      
      <div style="margin-bottom:1.2rem;">
        <label style="display:block;font-weight:700;margin-bottom:6px;font-size:0.9rem;color:var(--text);">Nombre de la alerta</label>
        <input id="bca-name" type="text" placeholder="Ej: Oportunidades en Villa Morra" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:1rem;background:var(--surface);color:var(--text);font-family:inherit;box-sizing:border-box;outline:none;" />
      </div>

      <div style="margin-bottom:1.2rem;">
        <label style="display:block;font-weight:700;margin-bottom:6px;font-size:0.9rem;color:var(--text);">Tipo de alerta</label>
        <select id="bca-type" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:1rem;background:var(--surface);color:var(--text);font-family:inherit;box-sizing:border-box;outline:none;">
          <option value="underpriced"> Propiedades subvaluadas (oportunidad de compra)</option>
          <option value="overpriced"> Propiedades sobrevaloradas (captar propietarios)</option>
          <option value="new_listing"> Nueva publicación en zona</option>
        </select>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.2rem;">
        <div>
          <label style="display:block;font-weight:700;margin-bottom:6px;font-size:0.9rem;color:var(--text);">Zona / Barrio</label>
          <input id="bca-zone" type="text" placeholder="Ej: Villa Morra" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:1rem;background:var(--surface);color:var(--text);font-family:inherit;box-sizing:border-box;outline:none;" />
        </div>
        <div>
          <label style="display:block;font-weight:700;margin-bottom:6px;font-size:0.9rem;color:var(--text);">Tipo de propiedad</label>
          <select id="bca-proptype" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:1rem;background:var(--surface);color:var(--text);font-family:inherit;box-sizing:border-box;outline:none;">
            <option value="">Cualquiera</option>
            <option>Casa</option>
            <option>Departamento</option>
            <option>PH</option>
            <option>Terreno</option>
            <option>Oficina</option>
          </select>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:2rem;">
        <button id="bca-cancel" style="flex:1;padding:14px;border:2px solid var(--border);border-radius:12px;background:var(--surface);color:var(--text);font-weight:700;cursor:pointer;font-size:1rem;font-family:inherit;">Cancelar</button>
        <button id="bca-save" style="flex:2;padding:14px;border:none;border-radius:12px;background:var(--accent-gradient);color:white;font-weight:800;cursor:pointer;font-size:1rem;font-family:inherit;box-shadow:0 8px 20px rgba(255,42,95,0.3);"> Crear Alerta</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.getElementById('bca-cancel').addEventListener('click', () => modal.remove());

  document.getElementById('bca-save').addEventListener('click', async () => {
    const nameEl = document.getElementById('bca-name');
    const name = nameEl.value.trim();
    if (!name) {
      nameEl.style.borderColor = 'var(--accent)';
      nameEl.focus();
      return;
    }

    // Capturar el UID en el momento exacto del click (siempre fresco)
    const saveUid = getCurrentUID();
    if (!saveUid) {
      if (window.showToast) window.showToast('Error: sesión expirada. Por favor recarga.', 'error');
      return;
    }

    const saveBtn = document.getElementById('bca-save');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    const alertData = {
      id: Date.now(),
      userId: saveUid,
      name,
      alertType: document.getElementById('bca-type').value,
      zone: document.getElementById('bca-zone').value.trim(),
      propType: document.getElementById('bca-proptype').value,
      active: true,
      createdAt: Date.now()
    };

    try {
      await window.saveBrokerAlert(alertData);
      modal.remove();
      if (window.showToast) window.showToast('Alerta broker creada exitosamente', 'success');
      // Cambiar a la pestaña de alertas para que el usuario vea el resultado
      const alertTab = document.querySelector('.broker-tab-btn[data-target="broker-alert-config"]');
      if (alertTab) alertTab.click();
    } catch (e) {
      saveBtn.disabled = false;
      saveBtn.textContent = ' Crear Alerta';
    }
  });
};

// ===== HELPERS =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getTimeAgo(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Ahora mismo';
  if (min < 60) return `Hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

window.openPropertyFromBroker = function(propId) {
  const prop = (window.appData?.properties || []).find(p => String(p.id) === String(propId));
  if (!prop) {
    if (window.showToast) window.showToast('No se encontró la propiedad', 'warn');
    return;
  }
  // Navegar a explorar primero para asegurar que el modal sea visible
  const navExplore = document.getElementById('nav-explore');
  if (navExplore) navExplore.click();
  // Esperar a que la vista esté activa y luego abrir el modal
  setTimeout(() => {
    if (window.openModal) window.openModal(prop);
    else if (window.openPropertyModal) window.openPropertyModal(prop);
    // Como último recurso, disparar el click en el modal overlay directamente
    else {
      const allProps = window.appData?.properties || [];
      const idx = allProps.findIndex(p => String(p.id) === String(propId));
      if (idx >= 0) {
        const cards = document.querySelectorAll('.property-card');
        if (cards[idx]) cards[idx].click();
      }
    }
  }, 200);
};

// Mocks removed for production

// Exponer para uso externo
window._brokerAlertsModule = {
  renderAlerts: renderBrokerAlertsPanel,
  renderNotifs: renderBrokerNotifsPanel,
  getAlerts: () => _brokerAlerts,
  getNotifs: () => _brokerNotifs,
  getUnreadCount: () => _unreadBrokerCount
};
