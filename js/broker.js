/**
 * broker.js — Orquestador principal del Panel Broker PRO v7
 * Incluye: Leads + Scoring, Radar Particulares, Matchmaking, Export CSV, Embudos
 */

// ===== ESTILOS PREMIUM =====
const injectPremiumStyles = () => {
  if (document.getElementById('broker-premium-styles')) return;
  const style = document.createElement('style');
  style.id = 'broker-premium-styles';
  style.innerHTML = `
    .broker-mesh-bg { position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(at 10% 20%,rgba(255,42,95,.07) 0%,transparent 50%),radial-gradient(at 80% 70%,rgba(255,42,95,.04) 0%,transparent 50%);filter:blur(60px);animation:meshDrift 18s ease-in-out infinite alternate; }
    @keyframes meshDrift { 0%{transform:scale(1)} 100%{transform:scale(1.08) translate(15px,10px)} }
    .text-gradient { background:var(--accent-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
    .vip-badge { font-size:.72rem;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.35);padding:3px 9px;border-radius:20px;color:#D4AF37;letter-spacing:1px;font-weight:800; }
    .premium-locked-overlay { position:absolute;inset:0;background:rgba(15,23,42,.75);backdrop-filter:blur(14px);z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem; }
    .premium-locked-overlay.hidden { display:none; }
    .broker-content-wrapper { position:relative;z-index:10;max-width:1200px;margin:0 auto;width:100%;padding:2rem 0 5rem; }
    .broker-header { margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px; }
    .broker-main-title { font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:2rem;display:flex;align-items:center;gap:12px;margin-bottom:6px; }
    .broker-subtitle { color:var(--text2);font-size:1rem;font-weight:500; }
    /* KPI Strip */
    .broker-kpi-strip { display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:2rem; }
    .broker-kpi-card { background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:1.2rem 1.4rem;display:flex;align-items:center;gap:14px;box-shadow:0 4px 20px rgba(0,0,0,.04); }
    .dark-mode .broker-kpi-card { box-shadow:0 4px 20px rgba(0,0,0,.2); }
    .broker-kpi-icon { width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0; }
    .broker-kpi-val { font-size:1.5rem;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;line-height:1;color:var(--text); }
    .broker-kpi-label { color:var(--text2);font-size:.8rem;font-weight:600;margin-top:3px; }
    /* Tabs */
    .broker-tabs { display:flex;gap:10px;margin-bottom:2.5rem;overflow-x:auto;padding-bottom:5px;scrollbar-width:none; }
    .broker-tabs::-webkit-scrollbar { display:none; }
    .glass-btn { background:var(--surface2);border:1px solid var(--border);padding:11px 18px;font-weight:700;font-size:.95rem;color:var(--text2);cursor:pointer;border-radius:12px;transition:all .25s;display:flex;align-items:center;gap:7px;position:relative;font-family:inherit;white-space:nowrap; }
    .glass-btn:hover { background:var(--surface);color:var(--text);border-color:var(--accent); }
    .glass-btn.active { color:var(--accent);background:var(--surface);border-color:rgba(255,42,95,.25);box-shadow:0 4px 15px rgba(255,42,95,.06); }
    .tab-underline { position:absolute;bottom:-1px;left:50%;transform:translateX(-50%);width:0;height:3px;background:var(--accent-gradient);border-radius:3px 3px 0 0;transition:width .3s; }
    .glass-btn.active .tab-underline { width:45%; }
    .broker-tab-content { display:none; }
    .broker-tab-content.active { display:block; }
    /* Cards */
    .glass-card { background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:0 6px 30px rgba(0,0,0,.04);transition:transform .3s cubic-bezier(.25,.8,.25,1),box-shadow .3s;position:relative;overflow:hidden; }
    .dark-mode .glass-card { box-shadow:0 6px 30px rgba(0,0,0,.25); }
    /* Lead cards */
    .leads-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:1.8rem;flex-wrap:wrap;gap:10px; }
    .leads-title { font-size:1.3rem;font-weight:800;color:var(--text); }
    .leads-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;min-height:300px; }
    .lead-card { padding:1.6rem;display:flex;flex-direction:column; }
    .lead-avatar { width:46px;height:46px;border-radius:13px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0; }
    .lead-name { font-weight:800;font-size:1.05rem;color:var(--text);display:flex;align-items:center;gap:8px;flex-wrap:wrap;row-gap:4px; }
    .lead-tag-new { font-size:.62rem;background:var(--accent);color:white;padding:2px 7px;border-radius:8px;font-weight:800; }
    .lead-budget { color:#10b981;font-weight:800;font-size:1.2rem;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap; }
    /* Score badges */
    .score-hot { background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.2);padding:3px 10px;border-radius:100px;font-size:.72rem;font-weight:800; }
    .score-warm { background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);padding:3px 10px;border-radius:100px;font-size:.72rem;font-weight:800; }
    .score-cold { background:rgba(56,189,248,.1);color:#38bdf8;border:1px solid rgba(56,189,248,.2);padding:3px 10px;border-radius:100px;font-size:.72rem;font-weight:800; }
    /* Match badge */
    .match-badge { background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:#10b981;border-radius:12px;padding:.8rem 1.2rem;font-weight:700;font-size:.88rem;display:flex;align-items:center;gap:8px;margin-top:1rem; }
    /* Owner radar */
    .owner-card { border-left:4px solid #f59e0b; }
    .owner-tag { background:rgba(245,158,11,.1);color:#f59e0b;border-radius:100px;padding:2px 8px;font-size:.7rem;font-weight:800; }
    /* Funnel */
    .funnel-hero-card { display:flex;padding:2.5rem;margin-bottom:2.5rem;align-items:center;gap:2rem;background:linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%); }
    .funnel-hero-content { flex:1; }
    .funnel-title { font-size:1.6rem;font-weight:800;margin-bottom:12px; }
    .funnel-desc { color:var(--text2);line-height:1.7;font-size:1rem;margin-bottom:1.8rem; }
    .funnel-input-group { display:flex;gap:10px;flex-wrap:wrap; }
    .glass-input-wrapper { flex:1;min-width:200px; }
    .glass-input { width:100%;padding:14px 18px;border-radius:12px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-weight:700;font-size:1rem;transition:all .3s;box-sizing:border-box; }
    .glass-input:focus { outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(255,42,95,.1); }
    .copy-link-btn { padding:14px 24px;border-radius:12px;font-weight:700;border:none; }
    .funnel-hero-graphic { width:130px;height:130px;border-radius:50%;background:var(--surface);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:3.5rem;position:relative;flex-shrink:0; }
    .graphic-circle { position:absolute;inset:-14px;border-radius:50%;border:2px dashed var(--accent);opacity:.3;animation:rotate 18s linear infinite; }
    @keyframes rotate { 100%{transform:rotate(360deg)} }
    /* Stats */
    .stats-section-title { font-size:1.3rem;font-weight:800;margin-bottom:1.4rem; }
    .funnel-stats-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px; }
    .stat-card { padding:1.8rem;display:flex;flex-direction:column; }
    .stat-icon-wrapper { width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1rem; }
    .stat-number { font-size:2.4rem;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;line-height:1.1;color:var(--text); }
    .stat-label { color:var(--text2);font-weight:600;margin-top:8px;font-size:.92rem; }
    /* Live Indicator */
    .live-indicator { display:flex;align-items:center;font-size:.85rem;font-weight:700;color:var(--accent);background:rgba(255,42,95,.08);padding:6px 14px;border-radius:20px; }
    .live-dot { width:8px;height:8px;background:var(--accent);border-radius:50%;display:inline-block;margin-right:8px;flex-shrink:0; }
    .pulse-animation { animation:pulseAccent 2s infinite; }
    @keyframes pulseAccent { 0%{box-shadow:0 0 0 0 rgba(255,42,95,.4)} 70%{box-shadow:0 0 0 7px rgba(255,42,95,0)} 100%{box-shadow:0 0 0 0 rgba(255,42,95,0)} }
    /* Scanner */
    .scanner-card { padding:4rem 2rem;text-align:center;color:var(--text2);display:flex;flex-direction:column;align-items:center;justify-content:center; }
    .scanner-icon { width:38px;height:38px;margin-bottom:1rem;opacity:.45; }
    .scanner-text { font-weight:600; }
    .scanner-line { position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent-gradient);opacity:.5;animation:scan 2.5s ease-in-out infinite; }
    @keyframes scan { 0%{transform:translateY(0);opacity:.5} 50%{opacity:.8} 100%{transform:translateY(180px);opacity:0} }
    /* Stagger */
    .stagger-in { opacity:0;transform:translateY(18px);transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.8,.2,1); }
    .stagger-in.visible { opacity:1;transform:translateY(0); }
    /* Tilt */
    .tilt-card { transition:transform .25s cubic-bezier(.25,.8,.25,1),box-shadow .25s; }
    .tilt-card:hover { box-shadow:0 20px 40px rgba(0,0,0,.08); }
    .dark-mode .tilt-card:hover { box-shadow:0 20px 40px rgba(0,0,0,.3); }
    .magnetic-btn { transition:transform .15s cubic-bezier(.2,.8,.2,1); }
    .magnetic-btn:hover { transform:scale(1.04); }
    /* Toggle buttons */
    .toggle-group { display:flex;background:var(--surface2);border-radius:12px;padding:4px;gap:4px; }
    .toggle-btn { padding:8px 16px;border:none;border-radius:9px;font-weight:700;font-size:.85rem;cursor:pointer;font-family:inherit;color:var(--text2);background:transparent;transition:all .2s; }
    .toggle-btn.active { background:var(--surface);color:var(--text);box-shadow:0 2px 8px rgba(0,0,0,.08); }
    /* Radar owner card */
    .radar-card { padding:1.4rem;margin-bottom:10px;border-left:3px solid #f59e0b;cursor:pointer;transition:all .2s; }
    .radar-card:hover { transform:translateX(4px); }
    
    /* Responsive fixes */
    @media (max-width:768px) {
      .broker-content-wrapper { padding-bottom: 8rem !important; }
      .broker-main-title { font-size:1.7rem; }
      .broker-kpi-strip { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .broker-kpi-card { padding:1rem; gap: 8px; }
      .broker-kpi-val { font-size:1.3rem; }
      .funnel-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .stat-card { padding:1.2rem; }
      .stat-number { font-size:1.9rem; }
      .funnel-hero-card { flex-direction:column; padding:1.5rem; align-items: stretch; gap:1.2rem; }
      .funnel-hero-graphic { margin:0 auto; }
      .leads-grid { grid-template-columns: 1fr; }
      .funnel-input-group { flex-direction:column; }
    }
    @media (max-width:480px) {
      .funnel-stats-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  injectPremiumStyles();

  // TAB SWITCHING
  const brokerTabs = document.querySelectorAll('.broker-tab-btn');
  const brokerContents = document.querySelectorAll('.broker-tab-content');

  brokerTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      brokerTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      brokerContents.forEach(c => {
        if (c.id === target) { c.style.display = 'block'; c.classList.add('active'); triggerStagger(c); }
        else { c.style.display = 'none'; c.classList.remove('active'); }
      });
      if (target === 'broker-funnels') startCountUp();
      if (target === 'broker-valuation' && window.renderValuationTab) window.renderValuationTab();
      if (target === 'broker-notifs' && window._brokerAlertsModule) window._brokerAlertsModule.renderNotifs();
      if (target === 'broker-alert-config' && window._brokerAlertsModule) window._brokerAlertsModule.renderAlerts();
      if (target === 'broker-leads') refreshLeadsView();
    });
  });

  // Auto-init cuando se navega al panel
  const navBroker = document.getElementById('nav-broker');
  if (navBroker) {
    navBroker.addEventListener('click', () => {
      setTimeout(() => {
        triggerStagger(document.getElementById('view-broker'));
        window.initBrokerLeads();
      }, 100);
    });
  }

  setupTiltCards();
});

// ===== LEAD SCORING =====
function calculateLeadScore(lead) {
  let score = 0;
  const now = Date.now();

  // Actividad reciente (< 24h = +40 pts, < 72h = +20, < 7d = +10)
  const hoursSinceActive = (now - (lead.timestamp || now)) / 3600000;
  if (hoursSinceActive < 24) score += 40;
  else if (hoursSinceActive < 72) score += 20;
  else if (hoursSinceActive < 168) score += 10;

  // Vistas de propiedades
  score += Math.min((lead.viewCount || 1) * 5, 30);

  // Presupuesto definido (no "consultar")
  if (lead.budget && lead.budget > 0) score += 20;

  // Zonas múltiples buscadas (indica búsqueda activa)
  if (lead.zonesViewed && lead.zonesViewed > 1) score += 10;

  if (score >= 70) return { label: 'Caliente', class: 'score-hot', score };
  if (score >= 40) return { label: 'Tibio', class: 'score-warm', score };
  return { label: 'Frío', class: 'score-cold', score };
}

// ===== MATCHMAKING INVERSO =====
function matchLeadsToProperty(prop) {
  const leads = window._cachedBrokerLeads || [];
  return leads.filter(lead => {
    // Match por tipo
    if (lead.type && prop.type && lead.type !== prop.type) return false;
    // Match por zona (fuzzy)
    if (lead.zone && prop.address) {
      const zoneWords = lead.zone.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3);
      const propAddr = prop.address.toLowerCase();
      if (!zoneWords.some(w => propAddr.includes(w))) return false;
    }
    // Match por presupuesto (lead.budget >= prop.price * 0.9)
    if (lead.budget && prop.price && lead.budget < prop.price * 0.9) return false;
    return true;
  });
}

// ===== LEADS EN VIVO =====
let leadsListenerActive = false;
let _leadsUnsubscribe = null;
window._cachedBrokerLeads = [];
let _showOnlyOwners = false;

window.initBrokerLeads = async function() {
  if (leadsListenerActive) return;

  const uid = window.firebaseAuth?.currentUser?.uid;
  if (!uid) {
    // Aún no hay sesión, esperar al evento de auth
    return;
  }

  if (typeof firebase === 'undefined') {
    window._cachedBrokerLeads = [];
    refreshLeadsView();
    return;
  }

  leadsListenerActive = true;

  try {
    const db = firebase.firestore();
    const leadsRef = db.collection('broker_leads');

    // Verificar si hay datos
    const snap = await leadsRef.limit(1).get();

    // Escuchar en tiempo real (sin orderBy para evitar índice requerido)
    if (_leadsUnsubscribe) _leadsUnsubscribe();
    _leadsUnsubscribe = leadsRef.limit(50).onSnapshot(snapshot => {
      window._cachedBrokerLeads = [];
      snapshot.forEach(doc => window._cachedBrokerLeads.push(doc.data()));
      // Ordenar localmente por timestamp descendente
      window._cachedBrokerLeads.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      refreshLeadsView();
    }, (error) => {
      console.error('Error escuchando broker leads:', error);
      leadsListenerActive = false;
      window._cachedBrokerLeads = [];
      refreshLeadsView();
    });

  } catch (err) {
    console.error('Error inicializando broker leads:', err);
    leadsListenerActive = false;
    window._cachedBrokerLeads = [];
    refreshLeadsView();
  }
};

// Resetear listener al cerrar sesión
document.addEventListener('geohogar:auth:loggedout', () => {
  leadsListenerActive = false;
  if (_leadsUnsubscribe) { _leadsUnsubscribe(); _leadsUnsubscribe = null; }
  window._cachedBrokerLeads = [];
  refreshLeadsView();
});

function refreshLeadsView() {
  const listEl = document.getElementById('broker-leads-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  const allLeads = window._cachedBrokerLeads || [];
  let leads = allLeads;
  if (_showOnlyOwners) leads = leads.filter(l => l.isOwner);

  // Update KPI strip
  updateKPIStrip(allLeads);

  if (leads.length === 0) {
    listEl.innerHTML = `
      <div class="glass-card scanner-card" style="grid-column:1/-1;">
        <div style="width:52px;height:52px;border-radius:16px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
          ${_showOnlyOwners 
            ? '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
            : '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.1 12.85a19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>'}
        </div>
        <p style="font-weight:700;">${_showOnlyOwners ? 'Sin dueños directos activos' : 'No hay compradores activos'}</p>
      </div>`;
    return;
  }

  leads.forEach((lead, i) => renderLeadCard(listEl, lead, i));
  triggerStagger(listEl);
  updateMatchStats();
}

function updateKPIStrip(allLeads) {
  const total = allLeads.length;
  const hot = allLeads.filter(l => calculateLeadScore(l).score >= 70).length;
  const owners = allLeads.filter(l => l.isOwner).length;
  const props = window.appData?.properties?.filter(p => p.userId === window._currentUserId) || [];
  const matchCount = props.length > 0 ? matchLeadsToProperty(props[0]).length : 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('kpi-total-leads', total || '—');
  set('kpi-hot-leads', hot || '—');
  set('kpi-owner-leads', owners || '—');
  set('kpi-matches', matchCount || '—');
}

window.setLeadFilter = function(ownersOnly) {
  _showOnlyOwners = ownersOnly;
  document.getElementById('toggle-all-leads')?.classList.toggle('active', !ownersOnly);
  document.getElementById('toggle-owner-leads')?.classList.toggle('active', ownersOnly);
  refreshLeadsView();
};

function renderLeadCard(container, lead, index) {
  const isNew = (Date.now() - (lead.timestamp || 0)) < 3600000;
  const score = calculateLeadScore(lead);
  const card = document.createElement('div');
  card.className = `glass-card tilt-card lead-card stagger-in${lead.isOwner ? ' owner-card' : ''}`;

  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.2rem;">
      <div class="lead-avatar" style="background:${lead.isOwner ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)'}; border-color:${lead.isOwner ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)'}">
        ${lead.isOwner 
          ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
          : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'}
      </div>
      <div style="flex:1;min-width:0;">
        <div class="lead-name">
          ${lead.name}
          ${isNew ? '<span class="lead-tag-new">NUEVO</span>' : ''}
          ${lead.isOwner ? '<span class="owner-tag">DUEÑO DIRECTO</span>' : ''}
        </div>
        <div style="color:var(--text2);font-size:.88rem;margin-top:4px;">
          ${lead.isOwner 
            ? `Publica: <strong style="color:var(--text);">${lead.type}</strong> en <strong style="color:var(--text);">${lead.zone}</strong>`
            : `Busca: <strong style="color:var(--text);">${lead.type}</strong> en <strong style="color:var(--text);">${lead.zone}</strong>`}
        </div>
      </div>
      <span class="${score.class}">${score.label}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:1.2rem;">
      <div>
        <div style="font-size:.78rem;color:var(--text2);margin-bottom:3px;">${lead.isOwner ? 'Precio pedido' : 'Presupuesto máx.'}</div>
        <div class="lead-budget">US$ ${(lead.budget || 0).toLocaleString()}</div>
      </div>
      <div style="font-size:.8rem;color:var(--text2);">${isNew ? '<span style="color:var(--accent);font-weight:700;">● Activo ahora</span>' : getTimeAgoSimple(lead.timestamp)}</div>
    </div>
    ${lead.isOwner ? `
      <div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2);border-radius:12px;padding:.8rem 1rem;font-size:.85rem;color:var(--text2);margin-bottom:1rem;display:flex;align-items:flex-start;gap:8px;">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div><strong style="color:#f59e0b;">Estrategia:</strong> Contactar al dueño y ofrecerle intermediación. Si lleva más de 30 días publicado, es posible captar en exclusividad.</div>
      </div>` : ''}
    <button class="btn-primary magnetic-btn" onclick="contactLead('${lead.id}', '${lead.name?.replace(/'/g,"''")}', ${!!lead.isOwner})" style="width:100%;border-radius:12px;padding:12px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      ${lead.isOwner ? 'Ofrecer Intermediación' : 'Contactar Lead'}
    </button>
  `;
  container.appendChild(card);
}

window.contactLead = function(leadId, name, isOwner) {
  const msg = isOwner
    ? `Hola, vi que tenés una propiedad publicada. Soy corredor inmobiliario y me gustaría hablar sobre la posibilidad de ayudarte a venderla en mejores condiciones.`
    : `Hola ${name}, vi que estás buscando propiedades. Como broker inmobiliario tengo opciones que pueden interesarte.`;
  navigator.clipboard?.writeText(msg);
  if (window.showToast) window.showToast('Mensaje copiado para WhatsApp', 'success');
};

// ===== MATCHMAKING: barra de buscadores compatibles =====
function updateMatchStats() {
  const props = window.appData?.properties || [];
  if (props.length === 0) return;

  // Tomar la prop más reciente del broker
  const myProps = props.filter(p => p.userId === window._currentUserId);
  if (myProps.length === 0) return;

  const lastProp = myProps[0];
  const matched = matchLeadsToProperty(lastProp);
  if (matched.length === 0) return;

  const leadsGrid = document.getElementById('broker-leads-list');
  if (!leadsGrid) return;

  const existing = document.getElementById('broker-match-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'broker-match-banner';
  banner.style.cssText = 'grid-column:1/-1;margin-bottom:1rem;';
  banner.innerHTML = `
    <div class="glass-card" style="padding:1.4rem;border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.04);">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <div style="flex:1;">
          <div style="font-weight:800;margin-bottom:3px;">Matchmaking: <span style="color:#10b981;">${matched.length} buscador${matched.length !== 1 ? 'es' : ''}</span> compatible${matched.length !== 1 ? 's' : ''} con tu última propiedad</div>
          <div style="font-size:.85rem;color:var(--text2);">&ldquo;${lastProp.title}&rdquo; &mdash; ${matched.filter(l => !l.isOwner).map(l => l.name).slice(0,3).join(', ')}${matched.length > 3 ? ` y ${matched.length - 3} más` : ''}</div>
        </div>
        <button onclick="filterMatchedLeads()" style="background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;border-radius:10px;padding:10px 18px;font-weight:700;cursor:pointer;">Ver compatibles</button>
      </div>
    </div>`;
  leadsGrid.insertBefore(banner, leadsGrid.firstChild);
}

window.filterMatchedLeads = function() {
  const props = window.appData?.properties?.filter(p => p.userId === window._currentUserId) || [];
  if (!props.length) return;
  const matched = matchLeadsToProperty(props[0]);
  const ids = new Set(matched.map(l => l.id));
  const listEl = document.getElementById('broker-leads-list');
  if (!listEl) return;
  listEl.innerHTML = '';
  const filteredLeads = (window._cachedBrokerLeads || []).filter(l => ids.has(l.id));
  filteredLeads.forEach((l, i) => renderLeadCard(listEl, l, i));
  triggerStagger(listEl);
  if (window.showToast) window.showToast(`Mostrando ${filteredLeads.length} leads compatibles`, 'success');
};

// ===== EXPORT CSV =====
window.exportLeadsCSV = function() {
  const leads = window._cachedBrokerLeads || [];
  if (leads.length === 0) { if (window.showToast) window.showToast('No hay leads para exportar', 'error'); return; }
  const header = ['Nombre', 'Tipo', 'Zona', 'Presupuesto USD', 'Score', 'Tipo cuenta', 'Fecha'];
  const rows = leads.map(l => {
    const score = calculateLeadScore(l);
    return [
      l.name || '',
      l.type || '',
      l.zone || '',
      l.budget || 0,
      score.score,
      l.isOwner ? 'Dueño directo' : 'Comprador',
      new Date(l.timestamp || Date.now()).toLocaleDateString('es-PY')
    ];
  });
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `leads_broker_${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
  if (window.showToast) window.showToast(`${leads.length} leads exportados`, 'success');
};

// ===== MARK ALL READ =====
window.markAllBrokerNotifsRead = async function() {
  if (typeof firebase === 'undefined') return;
  const db = firebase.firestore();
  const snap = await db.collection('broker_notifications').where('userId', '==', window._currentUserId).where('unread', '==', true).get();
  const batch = db.batch();
  snap.forEach(doc => batch.update(doc.ref, { unread: false }));
  await batch.commit();
  if (window.showToast) window.showToast('Notificaciones marcadas como leídas', 'success');
};

document.addEventListener('geohogar:auth:loggedin', e => { window._currentUserId = e.detail.user.uid; });

// ===== HELPERS =====
function triggerStagger(container) {
  if (!container) return;
  const els = container.querySelectorAll('.stagger-in');
  els.forEach(el => el.classList.remove('visible'));
  setTimeout(() => { els.forEach((el, i) => { setTimeout(() => el.classList.add('visible'), i * 65); }); }, 40);
}

function setupTiltCards() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x > -40 && x < r.width + 40 && y > -40 && y < r.height + 40) {
        const rx = ((y - r.height/2)/(r.height/2)) * -3;
        const ry = ((x - r.width/2)/(r.width/2)) * 3;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.01,1.01,1.01)`;
      } else { card.style.transform = ''; }
    });
  });
}

function startCountUp() {
  document.querySelectorAll('.count-up').forEach(counter => {
    if (counter._done) return; counter._done = true;
    const target = +counter.getAttribute('data-target');
    let cur = 0; const inc = target / 120;
    const tick = () => { cur += inc; if (cur < target) { counter.innerText = Math.ceil(cur); requestAnimationFrame(tick); } else { counter.innerText = target; } };
    tick();
  });
}

function getTimeAgoSimple(ts) {
  if (!ts) return '';
  const d = Date.now() - ts;
  const h = Math.floor(d / 3600000);
  if (h < 1) return 'Hace unos minutos';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h/24)}d`;
}

// Mocks removed for production
