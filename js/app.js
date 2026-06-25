document.addEventListener('DOMContentLoaded', () => {
  // Initialize Global App State safely since data.js is removed
  if (!window.appData) {
    window.appData = {
      properties: [],
      favorites: new Set()
    };
  }
  const filterBtn = document.getElementById('filter-toggle-btn');
  const filterPanel = document.getElementById('filter-panel');
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', () => filterPanel.classList.toggle('hidden'));
  }

  // Filter Apply
  document.getElementById('filter-apply')?.addEventListener('click', () => {
    // Sincronizar visualmente los tags rápidos (cat-btn) con lo seleccionado en f-type
    const fType = document.getElementById('f-type');
    if (fType) {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      if (fType.value) {
        const matchingCat = document.querySelector(`.cat-btn[data-cat="${fType.value}"]`);
        if (matchingCat) matchingCat.classList.add('active');
      }
    }

    if (window.applyExploreFilters) {
      window.applyExploreFilters();
    }
    filterPanel.classList.add('hidden');
    const count = window._currentMapProperties ? window._currentMapProperties.length : 0;
    showToast(window.t('toast_props_found', { count: count }));
  });

  document.getElementById('filter-clear')?.addEventListener('click', () => {
    document.getElementById('f-type').value = '';
    document.getElementById('f-op').value = '';
    document.getElementById('f-city').value = '';
    document.getElementById('f-pmin').value = '';
    document.getElementById('f-pmax').value = '';
    document.getElementById('f-mmin').value = '';
    document.querySelectorAll('#f-rooms .pill').forEach(p => p.classList.remove('active'));
    document.querySelector('#f-rooms .pill[data-val=""]')?.classList.add('active');
    
    // Reset country pills
    document.querySelectorAll('.country-pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.country-pill[data-country="Paraguay"]')?.classList.add('active');
    
    // Reset category buttons
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.cat-btn[data-cat=""]')?.classList.add('active');
    
    // Reset global search input
    const searchInput = document.getElementById('global-search');
    if (searchInput) searchInput.value = '';

    if (window.applyExploreFilters) {
      window.applyExploreFilters();
    } else {
      renderFiltered(window.appData.properties);
      const countEl = document.getElementById('results-count');
      if (countEl) countEl.innerText = window.t('results_count', { count: window.appData.properties.length });
    }
  });

  // Publish Form
  document.getElementById('publish-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title   = document.getElementById('pub-title')?.value.trim();
    const type    = document.getElementById('pub-type')?.value;
    const op      = document.getElementById('pub-op')?.value;
    const price   = parseFloat(document.getElementById('pub-price')?.value);
    const m2      = parseFloat(document.getElementById('pub-m2')?.value);
    const rooms   = parseInt(document.getElementById('pub-rooms')?.value) || 1;
    const baths   = parseInt(document.getElementById('pub-baths')?.value) || 1;
    const address = document.getElementById('pub-address')?.value.trim();
    const desc    = document.getElementById('pub-desc')?.value.trim();

    if (!title || !price || !address || !m2) {
      showToast(window.t('toast_fields_required'), 'warn'); return;
    }

    // Coordinates from draggable map marker
    let lat = -25.2867, lng = -57.6191;
    if (window._publishMarker) {
      const ll = window._publishMarker.getLatLng();
      lat = ll.lat; lng = ll.lng;
    }

    // Use uploaded photo or default stock image
    const previewEl = document.getElementById('image-preview');
    const firstImg = previewEl?.querySelector('img');
    const imgSrc = firstImg ? firstImg.src
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

    // Investment calculations (ROI & Discount)
    const addressLower = address.toLowerCase();
    let detectedZone = null;
    if (window.zoneStats) {
      const zones = Object.keys(window.zoneStats);
      for (const z of zones) {
        if (addressLower.includes(z.toLowerCase())) {
          detectedZone = z;
          break;
        }
      }
    }
    const stats = (window.zoneStats && detectedZone) ? window.zoneStats[detectedZone] : { avgPriceM2: 1300, rentM2: 8.0 };
    
    const zoneMarketAvg = stats.avgPriceM2;
    const marketValue = m2 * zoneMarketAvg;
    const isUnderpriced = price < marketValue * 0.92;
    const discount = isUnderpriced ? Math.round(((marketValue - price) / marketValue) * 100) : 0;
    
    const estRentMonthly = stats.rentM2 * m2;
    const estAnnualRent = estRentMonthly * 12;
    const roi = parseFloat(((estAnnualRent / price) * 100).toFixed(1));

    // Build property object
    const user = window.firebaseAuth?.currentUser;
    const fallbackName = user ? (user.phoneNumber || (user.email ? user.email.split('@')[0] : 'Propietario Verificado')) : 'Propietario Verificado';
    const finalAgentName = user?.displayName || fallbackName;

    const newProp = {
      id: Date.now(), title, type, op, price, m2, rooms, baths,
      address, description: desc || `${type} de ${rooms} ambientes en venta. ${m2}m² totales.`,
      lat, lng, img: imgSrc,
      agentName: finalAgentName,
      agentEmail: user?.email || '',
      agentUid: user?.uid || '',
      isOwn: true,
      roi: roi,
      isUnderpriced: isUnderpriced,
      discount: discount
    };

    if (window.publishProperty) {
      window.publishProperty(newProp)
        .then(() => {
          // Reset form & preview
          e.target.reset();
          if (previewEl) previewEl.innerHTML = '';

          showToast(window.t('toast_published_success'));
          setTimeout(() => {
            document.getElementById('nav-explore')?.click();
            const viewExplore = document.getElementById('view-explore');
            if (viewExplore) viewExplore.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1000);
        })
        .catch(err => {
          showToast(window.t('toast_publish_server_err'), 'warn');
        });
    } else {
      // Fallback
      window.appData.properties.unshift(newProp);
      const grid = document.getElementById('properties-grid');
      if (grid) {
        const allProps = window.appData.properties;
        const countEl = document.getElementById('results-count');
        if (countEl) countEl.innerText = window.t('results_count', { count: allProps.length });
        renderFiltered(allProps);
      }
      e.target.reset();
      if (previewEl) previewEl.innerHTML = '';
      showToast(window.t('toast_published_local'));
    }
  });

  // Toggle Google Sheets Sync Collapsible
  const btnToggleSheetsSync = document.getElementById('btn-toggle-sheets-sync');
  const sheetsSyncContent = document.getElementById('sheets-sync-content');
  const sheetsChevron = document.getElementById('sheets-chevron');
  if (btnToggleSheetsSync && sheetsSyncContent) {
    btnToggleSheetsSync.addEventListener('click', () => {
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        if (window.showPremiumPaywall) window.showPremiumPaywall();
        return;
      }
      
      sheetsSyncContent.classList.toggle('hidden');
      if (sheetsChevron) {
        const isHidden = sheetsSyncContent.classList.contains('hidden');
        sheetsChevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  }

  // Sincronizar Catálogo Completo desde Google Sheets
  const btnSyncSheets = document.getElementById('btn-sync-sheets');
  const sheetsSyncUrlInput = document.getElementById('sheets-sync-url');
  
  if (btnSyncSheets && sheetsSyncUrlInput) {
    btnSyncSheets.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        if (window.showPremiumPaywall) window.showPremiumPaywall();
        return;
      }
      
      const urlOrId = sheetsSyncUrlInput.value.trim();
      if (!urlOrId) {
        showToast(window.t('toast_sheets_sync_err'), 'warn');
        return;
      }
      
      btnSyncSheets.disabled = true;
      btnSyncSheets.innerHTML = ' Sincronizando...';
      
      try {
        const count = await window.syncPropertiesFromGoogleSheet(urlOrId);
        showToast(window.t('toast_sheets_sync_success', { count }));
        sheetsSyncUrlInput.value = '';
        
        // Redirigir a Explorar
        setTimeout(() => {
          document.getElementById('nav-explore')?.click();
          const viewExplore = document.getElementById('view-explore');
          if (viewExplore) viewExplore.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
      } catch (err) {
        showToast(window.t('toast_error', { message: err.message }), 'warn');
      } finally {
        btnSyncSheets.disabled = false;
        btnSyncSheets.innerHTML = ' Sincronizar Catálogo';
      }
    });
  }

      // Analytics nav - init charts and always update with full market data (independent from explore filters)
      document.getElementById('nav-analytics')?.addEventListener('click', () => {
        setTimeout(() => {
          const props = window.appData ? window.appData.properties : [];
          initCharts(props);
          updateAnalyticsKPIs(props);
          if (window.heatmapInstance) window.heatmapInstance.invalidateSize();
          if (window.applyMarketFilters) window.applyMarketFilters();
        }, 100);
      });

  // ===== ALERTS SYSTEM =====
  initAlertsUI();
  window.renderFiltered = renderFiltered;
});

// ---- Alerts Data & UI ----
window._userAlerts = [];

const ALERT_TYPE_META = {
  price_drop:   { icon: '', label: 'Baja de precio' },
  new_listing:  { icon: '', label: 'Nueva propiedad' },
  fav_update:   { icon: '', label: 'Favorito actualizado' },
  zone_rise:    { icon: '', label: 'Zona en alza' },
};
const FREQ_LABEL = { instant: 'Inmediata', daily: 'Diaria', weekly: 'Semanal' };

function initAlertsUI() {
  // Type selector
  document.querySelectorAll('.alert-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('premium-locked')) {
        const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
        if (!isPremium) {
          if (window.showPremiumPaywall) window.showPremiumPaywall();
          return;
        }
      }
      document.querySelectorAll('.alert-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  window.addEventListener('currencyChanged', () => {
    if (window.applyExploreFilters) window.applyExploreFilters();
    if (window.applyMarketFilters) window.applyMarketFilters();
    if (window.renderMapMarkers && window.appData && window.appData.properties) {
       window.renderMapMarkers(window._currentMapProperties || window.appData.properties);
    }
    // Also re-render analytics charts
    const viewAnalytics = document.getElementById('view-analytics');
    if (viewAnalytics && viewAnalytics.classList.contains('active')) {
      if (window.renderAnalyticsCharts) window.renderAnalyticsCharts();
    }
  });

  // New alert button shows/hides form
  document.getElementById('btn-new-alert')?.addEventListener('click', () => {
    const card = document.getElementById('alert-form-card');
    card.style.display = card.style.display === 'none' ? '' : 'none';
  });

  // Cancel button
  document.getElementById('alert-cancel-btn')?.addEventListener('click', () => {
    document.getElementById('alert-form-card').style.display = 'none';
  });

  // Save alert
  document.getElementById('alert-save-btn')?.addEventListener('click', () => {
    const typeBtn = document.querySelector('.alert-type-btn.active');
    const type = typeBtn?.dataset.type || 'price_drop';
    const name = document.getElementById('alert-name').value.trim()
      || (window.t('alert_type_' + type) + ' - ' + (document.getElementById('alert-zone').value || window.t('alert_zone_all')));

    const newAlert = {
      id: Date.now(),
      type,
      icon: ALERT_TYPE_META[type].icon,
      name,
      zone:      document.getElementById('alert-zone').value,
      propType:  document.getElementById('alert-prop-type').value,
      op:        document.getElementById('alert-op').value,
      pmin:      document.getElementById('alert-pmin').value,
      pmax:      document.getElementById('alert-pmax').value,
      threshold: document.getElementById('alert-threshold').value,
      freq:      document.getElementById('alert-freq').value,
      active: true
    };
    
    if (window.saveAlert) {
      window.saveAlert(newAlert)
        .then(() => {
          document.getElementById('alert-form-card').style.display = 'none';
          document.getElementById('alert-name').value = '';
          showToast(window.t('toast_alert_created'));
        })
        .catch(err => {
          console.error("Error creating Firestore alert:", err);
          showToast(window.t('toast_alert_save_err'), 'warn');
        });
    } else {
      window._userAlerts.unshift(newAlert);
      renderAlertsList();
      document.getElementById('alert-form-card').style.display = 'none';
      document.getElementById('alert-name').value = '';
      showToast(window.t('toast_alert_created'));
    }
  });

  renderAlertsList();
}

function renderAlertsList() {
  const list = document.getElementById('alerts-list');
  const empty = document.getElementById('alerts-empty');
  if (!list) return;
  list.innerHTML = '';

  if (!window._userAlerts.length) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  window._userAlerts.forEach(alert => {
    const card = document.createElement('div');
    card.className = 'alert-card' + (alert.active ? '' : ' paused');
    card.dataset.id = alert.id;

    const tags = [];
    if (alert.zone) tags.push(alert.zone);
    if (alert.propType) tags.push(alert.propType);
    if (alert.op) tags.push(alert.op);
    if (alert.pmax) tags.push('\< ' + window.formatPrice(Number(alert.pmax)));
    if (alert.threshold && alert.type === 'price_drop') tags.push('≥ ' + alert.threshold + '% ' + window.t('alert_tag_drop'));
    tags.push(window.t('alert_freq_' + alert.freq));

    const tagsHtml = tags.map((t, i) =>
      `<span class="alert-tag${i === 0 ? ' accent' : ''}">${t}</span>`
    ).join('');

    const typeInfo = ALERT_TYPE_META[alert.type] || ALERT_TYPE_META.price_drop;

    card.innerHTML = `
      <div class="alert-card-icon">${alert.icon || typeInfo.icon}</div>
      <div class="alert-card-info">
        <div class="alert-card-name">${alert.name}</div>
        <div class="alert-card-desc">${window.t('alert_type_' + alert.type)} · ${alert.active ? window.t('alert_state_active') : window.t('alert_state_paused')}</div>
        <div class="alert-card-tags">${tagsHtml}</div>
      </div>
      <div class="alert-card-actions">
        <label class="toggle-switch" title="${alert.active ? window.t('alert_toggle_pause_tooltip') : window.t('alert_toggle_resume_tooltip')}">
          <input type="checkbox" ${alert.active ? 'checked' : ''} />
          <div class="toggle-track"></div>
        </label>
        <button class="alert-delete-btn" title="${window.t('alert_delete_tooltip')}"></button>
      </div>
    `;

    // Toggle active state
    card.querySelector('input[type=checkbox]').addEventListener('change', (e) => {
      const activeState = e.target.checked;
      if (window.toggleAlertActive) {
        window.toggleAlertActive(alert.id, activeState)
          .then(() => {
            alert.active = activeState;
            card.classList.toggle('paused', !activeState);
            card.querySelector('.alert-card-desc').textContent = `${window.t('alert_type_' + alert.type)} · ${activeState ? window.t('alert_state_active') : window.t('alert_state_paused')}`;
            showToast(activeState ? window.t('toast_alert_activated') : window.t('toast_alert_paused'));
          });
      } else {
        alert.active = activeState;
        card.classList.toggle('paused', !alert.active);
        card.querySelector('.alert-card-desc').textContent = `${window.t('alert_type_' + alert.type)} · ${alert.active ? window.t('alert_state_active') : window.t('alert_state_paused')}`;
        showToast(alert.active ? window.t('toast_alert_activated') : window.t('toast_alert_paused'));
      }
    });

    // Delete
    card.querySelector('.alert-delete-btn').addEventListener('click', () => {
      if (window.deleteAlert) {
        window.deleteAlert(alert.id)
          .then(() => {
            card.style.animation = 'slideUpFade 0.3s forwards';
            setTimeout(() => renderAlertsList(), 320);
          });
      } else {
        window._userAlerts = window._userAlerts.filter(a => a.id !== alert.id);
        card.style.animation = 'slideUpFade 0.3s forwards';
        setTimeout(() => renderAlertsList(), 320);
      }
    });

    list.appendChild(card);
  });

  // Update badge
  const active = window._userAlerts.filter(a => a.active).length;
  const badge = document.getElementById('alerts-badge');
  if (badge) {
    badge.textContent = active;
    badge.style.display = active > 0 ? '' : 'none';
  }
  const heroAlertsBadge = document.getElementById('hero-alerts-count');
  if (heroAlertsBadge) {
    heroAlertsBadge.textContent = active;
  }
}

window._renderAlerts = renderAlertsList;

function renderFiltered(props) {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;
  if (window.renderProperties) {
    window.renderProperties(props, grid);
  } else {
    grid.innerHTML = '';
    if (!props.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><h3>${window.t('empty_results')}</h3><p>${window.t('empty_results_desc')}</p></div>`;
      return;
    }
    props.forEach(prop => {
      const isFav = window.appData.favorites.has(prop.id);
      const opClass = prop.op === 'Venta' ? 'venta' : 'alquiler';
      const card = document.createElement('div');
      card.className = 'property-card';
      card.onclick = () => { if(window.openPropertyModal) window.openPropertyModal(prop.id); };
      card.innerHTML = `<div class="prop-img-wrap"><span class="prop-badge">${window.translatePropType ? window.translatePropType(prop.type) : prop.type}</span><span class="prop-op-badge ${opClass}">${prop.op === 'Venta' ? window.t('op_venta') : window.t('op_alquiler')}</span><img src="${prop.img}" alt="${prop.title}" loading="lazy"><button class="btn-fav ${isFav ? 'active' : ''}" data-id="${prop.id}" onclick="event.stopPropagation(); toggleFav(${prop.id}, this)">${isFav ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" style="color: #ff2a5f; display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>' : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text2); display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>'}</button></div><div class="prop-info"><div class="prop-price">${window.formatPrice(prop.price)}</div><div class="prop-title">${prop.title}</div><div class="prop-address"> ${prop.address}</div><div class="prop-features"><span> ${prop.rooms} ${window.t('card_rooms')}</span><span> ${prop.baths} ${window.t('card_baths')}</span><span> ${prop.m2} ${window.t('card_m2')}</span></div></div>`;
      grid.appendChild(card);
    });
  }

  // Track current filtered list and update analytics if open
  window._currentFilteredProperties = props;
  if (window._analyticsCharts && window._analyticsCharts.initialized) {
    updateAnalytics(props);
  }
  // Always update the KPI numbers (even without chart init)
  updateAnalyticsKPIs(props);
}

function showToast(msg, type='success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:${type==='warn'?'#ff7e5f':'#10b981'};color:white;padding:12px 24px;border-radius:100px;font-weight:700;font-size:0.95rem;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.15);animation:slideUpFade 3s forwards`;
  t.textContent = msg;
  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = '@keyframes slideUpFade{0%{opacity:0;transform:translateX(-50%) translateY(20px)}10%{opacity:1;transform:translateX(-50%) translateY(0)}85%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-10px)}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ===== ANALYTICS ENGINE =====
let chartsInitialized = false;

window._analyticsCharts = { initialized: false, priceChart: null, typesChart: null, rangeChart: null, macroChart: null };

/**
 * updateAnalyticsKPIs — Updates the 4 top KPI stat cards. Runs even before charts are initialized.
 */
function updateAnalyticsKPIs(props) {
  // Always use all properties for the market overview
  let allProps = window.appData ? window.appData.properties : [];
  if (window.currentDataSourceFilter && window.currentDataSourceFilter !== 'all') {
    allProps = allProps.filter(p => p.dataSource === window.currentDataSourceFilter);
  }
  props = allProps;
  if (!props || !props.length) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-avg-price', '—');
    set('stat-avg-roi', '—');
    set('stat-underpriced-count', '0');
    set('stat-properties-count', '0');
    return;
  }
  const withPriceM2 = props.map(p => ({ ...p, pm2: p.priceM2 || (p.price && p.m2 && p.m2 > 0 ? p.price / p.m2 : 0) }))
    .filter(p => p.op !== 'Alquiler' && p.pm2 > 0);
  const avgPriceM2 = withPriceM2.length
    ? Math.round(withPriceM2.reduce((s, p) => s + p.pm2, 0) / withPriceM2.length) : 0;
  const withRoi = props.filter(p => p.roi && p.roi > 0);
  const avgRoi = withRoi.length
    ? (withRoi.reduce((s, p) => s + p.roi, 0) / withRoi.length).toFixed(1) : '0.0';
  const underpricedCount = props.filter(p => p.isUnderpriced).length;

  const statAvgPrice = document.getElementById('stat-avg-price');
  const statAvgRoi = document.getElementById('stat-avg-roi');
  const statUnderpricedCount = document.getElementById('stat-underpriced-count');
  const statPropsCount = document.getElementById('stat-properties-count');
  
  if (statAvgPrice) statAvgPrice.textContent = avgPriceM2 ? window.formatPriceM2(avgPriceM2) : '—';
  if (statAvgRoi) statAvgRoi.textContent = avgRoi > 0 ? `${avgRoi}%` : '—';
  if (statUnderpricedCount) statUnderpricedCount.textContent = underpricedCount;
  if (statPropsCount) statPropsCount.textContent = props.length;

  // Riesgo País EMBI is static/verified from JP Morgan, already populated in HTML
  // We can fetch it dynamically in the future, but currently it's hardcoded in the HTML as 150 pts.
}

// ─── Known Metro Cities ────────────────────────────────────────────────
const KNOWN_CITIES = new Set([
  'Asunción', 'Asuncion', 'Luque', 'Lambaré', 'Lambare', 'San Lorenzo',
  'Capiatá', 'Capiata', 'Villa Elisa', 'Limpio', 'Ñemby', 'Nemby',
  'Mariano Roque Alonso', 'Fernando de la Mora', 'Minga Guazú', 'Ciudad del Este',
  'Encarnación', 'Encarnacion', 'Itauguá', 'Itaugua', 'Areguá', 'Aregua',
  'J. Augusto Saldivar', 'Nueva Italia', 'Ypacaraí', 'Ypacarai'
]);

/**
 * Extracts the CITY of a property. Always returns the city field if available,
 * falling back to address parsing. Never returns a neighborhood name as a city.
 */
function getPropCity(p) {
  if (p.city && p.city.trim()) {
    const c = p.city.trim();
    // If the city stored is actually a neighborhood name that differs from known cities,
    // try to map it back to its actual city via the neighborhood field.
    if (KNOWN_CITIES.has(c)) return c;
    // city value isn't a known city → fall back to Asunción (most common scraper error)
    return 'Asunción';
  }
  if (p.address) {
    const parts = p.address.split(',').map(s => s.trim()).filter(s => s);
    for (let i = parts.length - 1; i >= 0; i--) {
      if (KNOWN_CITIES.has(parts[i])) return parts[i];
    }
  }
  return 'Otros';
}

/**
 * Extracts the NEIGHBORHOOD of a property. Uses the neighborhood field first.
 * If the neighborhood equals the city (e.g. "Luque" / "Luque") it keeps it as-is
 * because that city doesn't have sub-neighborhoods in the dataset.
 */
function getPropNeighborhood(p) {
  if (p.neighborhood && p.neighborhood.trim()) {
    const n = p.neighborhood.trim();
    return window.getNormalizedZoneName ? window.getNormalizedZoneName(n) : n;
  }
  // Fallback to city
  return getPropCity(p);
}

/**
 * getPropZone — legacy helper kept for heatmap & other callers.
 * Returns neighborhood when available, city otherwise.
 */
function getPropZone(p) {
  return getPropNeighborhood(p);
}

/**
 * buildDynamicZoneStats — computes live avgPriceM2 and rentM2 per zone
 * from actual property data. Replaces the hardcoded static object.
 * Returns an object keyed by neighborhood/city name.
 */
function buildDynamicZoneStats(props) {
  if (!props || !props.length) return {};
  const map = {}; // key → { saleTotal, saleCount, rentTotal, rentCount }

  props.forEach(p => {
    const zone = getPropNeighborhood(p);
    if (!map[zone]) map[zone] = { saleTotal: 0, saleCount: 0, rentTotal: 0, rentCount: 0 };

    const pm2 = p.priceM2 || (p.price && p.m2 && p.m2 > 0 ? p.price / p.m2 : 0);
    if (p.op === 'Venta' && pm2 > 50) {
      map[zone].saleTotal += pm2;
      map[zone].saleCount++;
    } else if (p.op === 'Alquiler' && p.m2 > 0) {
      const rentPerM2 = p.price / p.m2; // USD/m²/month
      if (rentPerM2 > 0.5 && rentPerM2 < 50) { // sanity bounds
        map[zone].rentTotal += rentPerM2;
        map[zone].rentCount++;
      }
    }
  });

  // Build stats; fallback rent based on typical 0.6% monthly yield if missing
  const stats = {};
  Object.entries(map).forEach(([zone, v]) => {
    const avgPriceM2 = v.saleCount > 0 ? Math.round(v.saleTotal / v.saleCount) : 1300;
    const rentM2 = v.rentCount > 0
      ? parseFloat((v.rentTotal / v.rentCount).toFixed(2))
      : parseFloat((avgPriceM2 * 0.006).toFixed(2)); // 0.6% monthly fallback
    stats[zone] = { avgPriceM2, rentM2 };
  });
  return stats;
}

/** State: which view (neighborhood / city) is active for each chart group */
window._priceViewMode = 'neighborhood'; // 'neighborhood' | 'city'
window._rangeViewMode = 'neighborhood';
window._rankViewMode = 'neighborhood';


/**
 * updateAnalytics — Recalculates all charts and KPI cards using live property data.
 */
function updateAnalytics(props) {
  // Use all properties for the market overview, but respect the dataSource layer filter
  let allProps = window.appData ? window.appData.properties : [];
  if (window.currentDataSourceFilter && window.currentDataSourceFilter !== 'all') {
    allProps = allProps.filter(p => p.dataSource === window.currentDataSourceFilter);
  }
  props = allProps;
  if (!props || !props.length) {
    updateAnalyticsKPIs(props);
    if (window._analyticsCharts.initialized) {
      ['priceChart', 'rangeChart', 'typesChart', 'opsChart'].forEach(key => {
        if (window._analyticsCharts[key]) {
          window._analyticsCharts[key].data.labels = ['Sin datos'];
          window._analyticsCharts[key].data.datasets[0].data = [0];
          if (window._analyticsCharts[key].data.datasets[0].backgroundColor) {
             window._analyticsCharts[key].data.datasets[0].backgroundColor = '#cbd5e1';
          }
          window._analyticsCharts[key].update('active');
        }
      });
      // heatmap
      if (window._heatmapLayers) {
        window._heatmapLayers.forEach(l => { try { window.heatmapInstance.removeLayer(l); } catch(e){} });
      }
      window._heatmapLayers = [];
    }
    return;
  }

  // Rebuild dynamic zoneStats from live data
  const dynStats = buildDynamicZoneStats(props);
  window.zoneStats = Object.keys(dynStats).length ? dynStats : window.zoneStats;

  updateAnalyticsKPIs(props);
  if (!window._analyticsCharts.initialized) return;

  updatePriceChart(props, window._priceViewMode || 'neighborhood');
  updateRangeChart(props, window._rangeViewMode || 'neighborhood');

  // --- Distribution by Type ---
  const typeMap = {};
  props.forEach(p => {
    const t = window.translatePropType ? window.translatePropType(p.type) : (p.type || 'Otro');
    typeMap[t] = (typeMap[t] || 0) + 1;
  });
  const typeEntries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const typeColors = ['#ff2a5f','#38bdf8','#10b981','#f59e0b','#6366f1','#ec4899'];
  if (window._analyticsCharts.typesChart && typeEntries.length > 0) {
    window._analyticsCharts.typesChart.data.labels = typeEntries.map(([k]) => k);
    window._analyticsCharts.typesChart.data.datasets[0].data = typeEntries.map(([, v]) => v);
    window._analyticsCharts.typesChart.data.datasets[0].backgroundColor = typeEntries.map((_, i) => typeColors[i % typeColors.length]);
    window._analyticsCharts.typesChart.update('active');
  }

  // --- Macro Projection vs Real ROI ---
  if (window._analyticsCharts.macroChart) {
    let projectedRoi = 8.5; // default
    const macroNews = window.appData ? window.appData.marketNews || [] : [];
    const textCombined = macroNews.map(n => (n.title || '') + ' ' + (n.excerpt || '')).join(' ');
    const roiMatch = textCombined.match(/(\d+(?:\.\d+)?)\s*%\s*al\s*(\d+(?:\.\d+)?)\s*%/i);
    if (roiMatch) {
      projectedRoi = (parseFloat(roiMatch[1]) + parseFloat(roiMatch[2])) / 2;
    }
    const roiProps = props.filter(p => p.roi > 0);
    const realRoi = roiProps.length ? (roiProps.reduce((s, p) => s + p.roi, 0) / roiProps.length) : 0;
    
    window._analyticsCharts.macroChart.data.datasets[0].data = [realRoi.toFixed(1), projectedRoi.toFixed(1)];
    window._analyticsCharts.macroChart.update('active');
  }

  // --- Update Heatmap ---
  updateHeatmapWithData(props, window._currentHeatmapMetric || 'demand');

  // --- Update Neighborhood Ranking ---
  updateNeighborhoodRanking(props, window._rankViewMode || 'neighborhood');
}

/**
 * updatePriceChart — redraws the price/m² horizontal bar chart for the given view mode.
 * mode: 'neighborhood' | 'city'
 */
function updatePriceChart(props, mode) {
  const getZone = mode === 'city' ? getPropCity : getPropNeighborhood;
  const map = {};
  props.forEach(p => {
    const zone = getZone(p);
    if (mode === 'neighborhood' && KNOWN_CITIES.has(zone)) return; // Exclude city fallbacks
    if (!map[zone]) map[zone] = { total: 0, count: 0 };
    const pm2 = p.priceM2 || (p.price && p.m2 && p.m2 > 0 ? p.price / p.m2 : 0);
    if (p.op !== 'Alquiler' && pm2 > 50) { map[zone].total += pm2; map[zone].count++; }
  });

  const zonesSorted = Object.entries(map)
    .filter(([, v]) => v.count > 0)
    .map(([name, v]) => ({ name, avg: Math.round(v.total / v.count) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, mode === 'city' ? 10 : 8);

  const priceColors = ['#ff2a5f','#f97316','#f59e0b','#10b981','#38bdf8','#6366f1','#a855f7','#ec4899','#14b8a6','#fb7185'];
  if (window._analyticsCharts.priceChart) {
    if (zonesSorted.length > 0) {
      window._analyticsCharts.priceChart.data.labels = zonesSorted.map(z => z.name);
      window._analyticsCharts.priceChart.data.datasets[0].data = zonesSorted.map(z => z.avg);
      window._analyticsCharts.priceChart.data.datasets[0].backgroundColor = zonesSorted.map((_, i) => priceColors[i % priceColors.length] + 'cc');
      window._analyticsCharts.priceChart.data.datasets[0].borderColor = zonesSorted.map((_, i) => priceColors[i % priceColors.length]);
    } else {
      window._analyticsCharts.priceChart.data.labels = ['Sin datos'];
      window._analyticsCharts.priceChart.data.datasets[0].data = [0];
    }
    window._analyticsCharts.priceChart.update('active');
  }

  // Update explanation text
  const expEl = document.getElementById('price-chart-explanation');
  if (expEl) {
    expEl.textContent = mode === 'city'
      ? 'Precio promedio por m² en cada ciudad del área metropolitana de Paraguay.'
      : 'Precio promedio por m² de los barrios más activos. Ideal para detectar zonas subvaluadas.';
  }
}

/**
 * updateRangeChart — redraws the price-range distribution bar chart.
 * mode: 'neighborhood' (only Asunción neighborhoods) | 'city' (all cities)
 */
function updateRangeChart(props, mode) {
  const ranges = [
    { label: '<50k', min: 0, max: 50000 },
    { label: '50k–100k', min: 50000, max: 100000 },
    { label: '100k–200k', min: 100000, max: 200000 },
    { label: '200k–400k', min: 200000, max: 400000 },
    { label: '400k–700k', min: 400000, max: 700000 },
    { label: '>700k', min: 700000, max: Infinity }
  ];

  // For neighborhood view: only show properties in Asunción with valid neighborhood
  const filtered = mode === 'city'
    ? props.filter(p => p.op !== 'Alquiler')
    : props.filter(p => p.op !== 'Alquiler' && getPropCity(p) === 'Asunción' && !KNOWN_CITIES.has(getPropNeighborhood(p)));

  const zoneCounts = {};
  filtered.forEach(p => {
    const z = mode === 'city' ? getPropCity(p) : getPropNeighborhood(p);
    zoneCounts[z] = (zoneCounts[z] || 0) + 1;
  });

  const sortedZones = Object.entries(zoneCounts).sort((a,b) => b[1] - a[1]);
  const topZones = sortedZones.slice(0, 6).map(e => e[0]);
  const priceColors = ['#ff2a5f','#f97316','#f59e0b','#10b981','#38bdf8','#6366f1','#a855f7'];

  const datasetsMap = {};
  topZones.forEach((z, i) => {
    datasetsMap[z] = {
      label: z,
      data: Array(ranges.length).fill(0),
      backgroundColor: priceColors[i % priceColors.length],
      borderRadius: 4,
      barThickness: 'flex',
      maxBarThickness: 40
    };
  });

  if (sortedZones.length > 6) {
    datasetsMap['Otros'] = {
      label: 'Otros',
      data: Array(ranges.length).fill(0),
      backgroundColor: '#cbd5e1',
      borderRadius: 4,
      barThickness: 'flex',
      maxBarThickness: 40
    };
  }

  ranges.forEach((r, rIdx) => {
    const propsInRange = filtered.filter(p => p.price >= r.min && p.price < r.max);
    propsInRange.forEach(p => {
      const z = mode === 'city' ? getPropCity(p) : getPropNeighborhood(p);
      if (datasetsMap[z]) datasetsMap[z].data[rIdx]++;
      else if (datasetsMap['Otros']) datasetsMap['Otros'].data[rIdx]++;
    });
  });

  if (window._analyticsCharts.rangeChart) {
    if (filtered.length > 0) {
      window._analyticsCharts.rangeChart.data.labels = ranges.map(r => r.label);
      window._analyticsCharts.rangeChart.data.datasets = Object.values(datasetsMap);
    } else {
      window._analyticsCharts.rangeChart.data.labels = ['Sin datos'];
      window._analyticsCharts.rangeChart.data.datasets = [{
        label: 'Sin datos',
        data: [0],
        backgroundColor: '#cbd5e1'
      }];
    }
    if (window._analyticsCharts.rangeChart.options.scales.x) {
      window._analyticsCharts.rangeChart.options.scales.x.stacked = true;
      window._analyticsCharts.rangeChart.options.scales.y.stacked = true;
    }
    window._analyticsCharts.rangeChart.update('active');
  }

  const expEl = document.getElementById('range-chart-explanation');
  if (expEl) {
    expEl.textContent = mode === 'city'
      ? 'Distribución de propiedades en venta por rango de precio, desglosado por ciudades.'
      : 'Distribución de propiedades en venta en Asunción por rango de precio (USD), desglosado por barrios.';
  }
}


window.updateAnalytics = updateAnalytics;
window.updateNeighborhoodRanking = updateNeighborhoodRanking;

window.renderAnalyticsCharts = function() {
  let props = window.appData ? window.appData.properties : [];
  if (window.currentDataSourceFilter && window.currentDataSourceFilter !== 'all') {
    props = props.filter(p => p.dataSource === window.currentDataSourceFilter);
  }
  updateAnalytics(props);
};

function updateHeatmapWithData(props, metric) {
  if (!window.heatmapInstance || typeof L === 'undefined') return;
  if (window._heatmapLayers) {
    window._heatmapLayers.forEach(l => { try { window.heatmapInstance.removeLayer(l); } catch(e){} });
  }
  window._heatmapLayers = [];

  const zones = {};
  props.forEach(p => {
    const lat = parseFloat(p.lat);
    const lng = parseFloat(p.lng);
    if (isNaN(lat) || isNaN(lng) || !lat || !lng) return;
    const zone = getPropZone(p);
    if (!zones[zone]) zones[zone] = { lats: [], lngs: [], rois: [], prices: [], count: 0 };
    zones[zone].lats.push(lat);
    zones[zone].lngs.push(lng);
    zones[zone].rois.push(p.roi || 0);
    zones[zone].prices.push(p.priceM2 || 0);
    zones[zone].count++;
  });

  if (!Object.keys(zones).length) return;

  const values = Object.values(zones).map(z => {
    if (metric === 'roi') return z.rois.filter(r => r > 0).reduce((a, b) => a + b, 0) / Math.max(z.rois.filter(r => r > 0).length, 1);
    if (metric === 'price') return z.prices.filter(p => p > 0).reduce((a, b) => a + b, 0) / Math.max(z.prices.filter(p => p > 0).length, 1);
    return z.count;
  });
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);

  Object.entries(zones).forEach(([zone, data]) => {
    const centerLat = data.lats.reduce((a, b) => a + b, 0) / data.lats.length;
    const centerLng = data.lngs.reduce((a, b) => a + b, 0) / data.lngs.length;
    let val, color, opacity;

    if (metric === 'roi') {
      const roiArr = data.rois.filter(r => r > 0);
      val = roiArr.length ? roiArr.reduce((a, b) => a + b, 0) / roiArr.length : 0;
      const norm = (val - minVal) / Math.max(maxVal - minVal, 0.01);
      color = norm > 0.65 ? '#10b981' : norm > 0.35 ? '#f59e0b' : '#ef4444';
      opacity = 0.35 + norm * 0.3;
    } else if (metric === 'price') {
      const prArr = data.prices.filter(p => p > 0);
      val = prArr.length ? prArr.reduce((a, b) => a + b, 0) / prArr.length : 0;
      const norm = (val - minVal) / Math.max(maxVal - minVal, 0.01);
      color = norm > 0.65 ? '#6366f1' : norm > 0.35 ? '#38bdf8' : '#10b981';
      opacity = 0.35 + norm * 0.3;
    } else {
      val = data.count;
      const norm = (val - minVal) / Math.max(maxVal - minVal, 0.01);
      color = norm > 0.65 ? '#ff2a5f' : norm > 0.35 ? '#f97316' : '#38bdf8';
      opacity = 0.35 + norm * 0.35;
    }

    const maxCount = Math.max(...Object.values(zones).map(z => z.count), 1);
    const radius = 700 + (data.count / maxCount) * 1600;

    const circle = L.circle([centerLat, centerLng], {
      color: 'none', fillColor: color, fillOpacity: opacity, radius
    }).addTo(window.heatmapInstance);

    let tooltipText = '';
    if (metric === 'roi') {
      const roiArr = data.rois.filter(r => r > 0);
      const avgR = roiArr.length ? (roiArr.reduce((a, b) => a + b, 0) / roiArr.length).toFixed(1) : 'N/A';
      tooltipText = `${zone}: ROI ${avgR}% (${data.count} prop.)`;
    } else if (metric === 'price') {
      const prArr = data.prices.filter(p => p > 0);
      const avgP = prArr.length ? Math.round(prArr.reduce((a, b) => a + b, 0) / prArr.length) : 'N/A';
      tooltipText = `${zone}: ${typeof avgP === 'number' ? window.formatPriceM2(avgP) : avgP}`;
    } else {
      tooltipText = `${zone}: ${data.count} propiedades`;
    }

    circle.bindTooltip(tooltipText, { permanent: false, direction: 'center', className: 'heatmap-tooltip' });
    window._heatmapLayers.push(circle);
  });

  updateHeatmapLegend(metric);
}

function updateHeatmapLegend(metric) {
  const legend = document.getElementById('heatmap-legend');
  if (!legend) return;
  const t = window.t || (key => key);
  if (metric === 'demand') {
    legend.innerHTML = `<span class="legend-dot" style="background:#38bdf8"></span> ${t('legend_demand_moderate')} &nbsp; <span class="legend-dot" style="background:#f97316"></span> ${t('legend_demand_high')} &nbsp; <span class="legend-dot" style="background:#ff2a5f"></span> ${t('legend_demand_very_high')}`;
  } else if (metric === 'price') {
    legend.innerHTML = `<span class="legend-dot" style="background:#10b981"></span> ${t('legend_price_accessible')} &nbsp; <span class="legend-dot" style="background:#38bdf8"></span> ${t('legend_price_medium')} &nbsp; <span class="legend-dot" style="background:#6366f1"></span> ${t('legend_price_premium')}`;
  } else {
    legend.innerHTML = `<span class="legend-dot" style="background:#ef4444"></span> ${t('legend_roi_low')} &nbsp; <span class="legend-dot" style="background:#f59e0b"></span> ${t('legend_roi_solid')} &nbsp; <span class="legend-dot" style="background:#10b981"></span> ${t('legend_roi_excellent')}`;
  }
}

function updateNeighborhoodRanking(props, viewMode) {
  const rankList = document.getElementById('neighborhood-ranking-list');
  if (!rankList) return;
  const mode = viewMode || window._rankViewMode || 'neighborhood';
  const sortMode = document.querySelector('.rank-sort-btn.active')?.dataset.sort || 'roi';
  const getZone = mode === 'city' ? getPropCity : getPropNeighborhood;
  
  const titleEl = document.getElementById('ranking-section-title');
  if (titleEl) {
    titleEl.textContent = mode === 'city' ? 'Ranking de Ciudades' : 'Ranking de Barrios';
  }

  const zoneMap = {};
  props.forEach(p => {
    const zone = getZone(p);
    if (mode === 'neighborhood' && KNOWN_CITIES.has(zone)) return; // Exclude city fallbacks
    if (!zoneMap[zone]) zoneMap[zone] = { rois: [], prices: [], rents: [], count: 0 };
    if (p.roi && p.roi > 0) zoneMap[zone].rois.push(p.roi);
    
    const pm2 = p.priceM2 || (p.price && p.m2 && p.m2 > 0 ? p.price / p.m2 : 0);
    if (p.op !== 'Alquiler' && pm2 > 0) zoneMap[zone].prices.push(pm2);
    
    // Attempt to gather rent data for the subtext
    if (p.op === 'Alquiler' && p.price > 0) zoneMap[zone].rents.push(p.price);
    else if (p.rentPrice && p.rentPrice > 0) zoneMap[zone].rents.push(p.rentPrice);
    
    zoneMap[zone].count++;
  });

  let entries = Object.entries(zoneMap).filter(([, v]) => v.count >= 1).map(([name, v]) => {
    const avgPrice = v.prices.length ? Math.round(v.prices.reduce((a, b) => a + b, 0) / v.prices.length) : 0;
    // Fallback rent: if no direct rentals, estimate it as 0.6% of an average 50m2 property
    const avgRent = v.rents.length ? Math.round(v.rents.reduce((a, b) => a + b, 0) / v.rents.length) : Math.round(avgPrice * 50 * 0.006);
    return {
      name,
      avgRoi: v.rois.length ? (v.rois.reduce((a, b) => a + b, 0) / v.rois.length) : 0,
      avgPrice,
      avgRent,
      count: v.count
    };
  });
  
  if (sortMode === 'roi') entries.sort((a, b) => b.avgRoi - a.avgRoi);
  else entries.sort((a, b) => b.avgPrice - a.avgPrice);
  entries = entries.slice(0, 7);
  const maxVal = entries.length ? (sortMode === 'roi' ? entries[0].avgRoi : entries[0].avgPrice) : 1;

  rankList.innerHTML = entries.map((e, index) => {
    const val = sortMode === 'roi' ? e.avgRoi : e.avgPrice;
    const width = Math.max(Math.round((val / Math.max(maxVal, 1)) * 100), 4);
    const displayVal = sortMode === 'roi' ? `${e.avgRoi.toFixed(1)}%` : window.formatPriceM2(e.avgPrice);
    
    let subtext = '';
    if (sortMode === 'roi') {
      const rentStr = e.avgRent > 0 ? window.formatPrice(e.avgRent) : '---';
      subtext = window.t ? window.t('ranking_avg_rent', { amount: rentStr }) : `Alquiler prom: USD ${rentStr}/mes`;
    } else {
      subtext = `${e.count} prop. registradas`;
    }

    let displayName = e.name;
    if (window.translateZoneName) {
      displayName = window.translateZoneName(e.name);
    }

    return `
      <div class="ranking-item">
        <div class="rank-number">#${index + 1}</div>
        <div class="rank-zone-info">
          <div class="rank-zone-name">${displayName}</div>
          <div class="rank-bar-wrap">
            <div class="rank-bar-fill" style="width: ${width}%"></div>
          </div>
        </div>
        <div class="rank-value-container">
          <div class="rank-value">${displayVal}</div>
          <div class="rank-subtext" style="font-size:0.68rem; opacity:0.8;">${subtext}</div>
        </div>
      </div>
    `;
  }).join('');
}

function initCharts(passedProps) {
  const chartPrices = document.getElementById('chart-prices');
  if (!chartPrices) return;

  // Usa las props pasadas, o appData (nunca usar _currentFilteredProperties para el mercado total)
  let props = passedProps;
  if (!props || props.length === 0) {
     props = window.appData && window.appData.properties ? window.appData.properties : [];
  }
  if (window.currentDataSourceFilter && window.currentDataSourceFilter !== 'all') {
    props = props.filter(p => p.dataSource === window.currentDataSourceFilter);
  }

  // If already initialized, just update data
  if (window._analyticsCharts.initialized) {
    updateAnalytics(props);
    return;
  }

  Chart.defaults.font.family = "'Outfit', sans-serif";
  Chart.defaults.color = '#64748b';

  // Build dynamic zone stats from live data at startup
  const dynStats = buildDynamicZoneStats(props);
  if (Object.keys(dynStats).length) window.zoneStats = dynStats;

  // --- Compute initial data (neighborhoods by default) ---
  const neighborhoodMap = {};
  props.forEach(p => {
    const zone = getPropNeighborhood(p);
    if (!neighborhoodMap[zone]) neighborhoodMap[zone] = { total: 0, count: 0 };
    const pm2 = p.priceM2 || (p.price && p.m2 && p.m2 > 0 ? p.price / p.m2 : 0);
    if (p.op !== 'Alquiler' && pm2 > 50) { neighborhoodMap[zone].total += pm2; neighborhoodMap[zone].count++; }
  });
  const zonesSorted = Object.entries(neighborhoodMap)
    .filter(([, v]) => v.count > 0)
    .map(([name, v]) => ({ name, avg: Math.round(v.total / v.count) }))
    .sort((a, b) => b.avg - a.avg).slice(0, 8);
  const priceColors = ['#ff2a5f','#f97316','#f59e0b','#10b981','#38bdf8','#6366f1','#a855f7','#ec4899'];

  // 1. Price/m² by Neighborhood (Horizontal Bar)
  window._analyticsCharts.priceChart = new Chart(chartPrices, {
    type: 'bar',
    data: {
      labels: zonesSorted.map(z => z.name),
      datasets: [{
        label: 'USD/m²',
        data: zonesSorted.map(z => z.avg),
        backgroundColor: zonesSorted.map((_, i) => priceColors[i % priceColors.length] + 'cc'),
        borderColor: zonesSorted.map((_, i) => priceColors[i % priceColors.length]),
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 36
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${window.formatPriceM2(ctx.parsed.x)}` } }
      },
      scales: {
        x: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { font: { size: 10 }, callback: v => window.formatPrice(v, true) } },
        y: { grid: { display: false }, border: { display: false }, ticks: { autoSkip: false, font: { size: 10, weight: '600' } } }
      }
    }
  });

  // 2. Distribution by Type (Doughnut)
  const chartTypesEl = document.getElementById('chart-types');
  const typeMap = {};
  props.forEach(p => {
    const t = window.translatePropType ? window.translatePropType(p.type) : (p.type || 'Otro');
    typeMap[t] = (typeMap[t] || 0) + 1;
  });
  const typeEntries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const typeColors = ['#ff2a5f','#38bdf8','#10b981','#f59e0b','#6366f1','#ec4899'];

  window._analyticsCharts.typesChart = new Chart(chartTypesEl, {
    type: 'doughnut',
    data: {
      labels: typeEntries.map(([k]) => k),
      datasets: [{
        data: typeEntries.map(([, v]) => v),
        backgroundColor: typeEntries.map((_, i) => typeColors[i % typeColors.length]),
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      animation: { duration: 700, easing: 'easeInOutQuart' },
      plugins: {
        legend: { position: 'bottom', labels: { padding: 10, boxWidth: 10, font: { size: 10, weight: '600' } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} prop.` } }
      }
    }
  });

  // 3. Price Range Distribution (defaults to Asunción neighborhoods)
  const chartOpsEl = document.getElementById('chart-ops');
  const initRanges = [
    { label: '<50k', min: 0, max: 50000 },
    { label: '50k–100k', min: 50000, max: 100000 },
    { label: '100k–200k', min: 100000, max: 200000 },
    { label: '200k–400k', min: 200000, max: 400000 },
    { label: '400k–700k', min: 400000, max: 700000 },
    { label: '>700k', min: 700000, max: Infinity }
  ];
  window._analyticsCharts.rangeChart = new Chart(chartOpsEl, {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutBounce' },
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: "'Outfit', sans-serif" }, boxWidth: 12, padding: 10 } },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            footer: (tooltipItems) => {
              let sum = 0;
              tooltipItems.forEach(function(tooltipItem) { sum += tooltipItem.parsed.y; });
              return 'Total: ' + sum + ' prop.';
            }
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { autoSkip: false } },
        y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } }
      }
    }
  });
  
  // Populate dynamically initially
  updateRangeChart(props, 'neighborhood');

  // 4. Macro Projection vs Real ROI (Bar Chart)
  const chartMacro = document.getElementById('chart-macro');
  if (chartMacro) {
    // Extract macro projected ROI from text if available, fallback to 8.5%
    let projectedRoi = 8.5; // default
    const macroNews = window.appData ? window.appData.marketNews || [] : [];
    const textCombined = macroNews.map(n => (n.title || '') + ' ' + (n.excerpt || '')).join(' ');
    // Look for patterns like "7% al 9%" or "8%"
    const roiMatch = textCombined.match(/(\d+(?:\.\d+)?)\s*%\s*al\s*(\d+(?:\.\d+)?)\s*%/i);
    if (roiMatch) {
      projectedRoi = (parseFloat(roiMatch[1]) + parseFloat(roiMatch[2])) / 2;
    }
    
    // Compute Real average ROI from props
    const roiProps = props.filter(p => p.roi > 0);
    const realRoi = roiProps.length ? (roiProps.reduce((s, p) => s + p.roi, 0) / roiProps.length) : 0;
    
    window._analyticsCharts.macroChart = new Chart(chartMacro, {
      type: 'bar',
      data: {
        labels: ['Promedio App', 'Ref. Mercado'],
        datasets: [{
          label: 'ROI (%)',
          data: [realRoi.toFixed(1), projectedRoi.toFixed(1)],
          backgroundColor: ['#10b981cc', '#38bdf8cc'],
          borderColor: ['#10b981', '#38bdf8'],
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y}%` } }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, maxRotation: 0, minRotation: 0 } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { callback: v => v + '%' } }
        }
      }
    });
  }

  window._analyticsCharts.initialized = true;

  // ─── Wire up Zone-View Tabs (Barrios / Ciudades) ──────────────────────────────
  function wireZoneTabs(tabGroupId, stateKey, onSwitch) {
    const group = document.getElementById(tabGroupId);
    if (!group) return;
    group.querySelectorAll('.zone-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.zone-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window[stateKey] = btn.dataset.view;
        const allProps = window.appData ? window.appData.properties : [];
        if (allProps.length) onSwitch(allProps, btn.dataset.view);
      });
    });
  }

  wireZoneTabs('price-view-tabs', '_priceViewMode', (allProps, mode) => {
    updatePriceChart(allProps, mode);
  });
  wireZoneTabs('range-view-tabs', '_rangeViewMode', (allProps, mode) => {
    updateRangeChart(allProps, mode);
  });
  wireZoneTabs('rank-view-tabs', '_rankViewMode', (allProps, mode) => {
    updateNeighborhoodRanking(allProps, mode);
  });


  // 4. Interactive Heatmap
  setTimeout(() => {
    if (typeof L !== 'undefined' && document.getElementById('heatmap-container') && !window.heatmapInstance) {
      window.heatmapInstance = L.map('heatmap-container', {
        zoomControl: true, dragging: true, scrollWheelZoom: true
      }).setView([-25.2867, -57.6191], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(window.heatmapInstance);

      document.querySelectorAll('.heatmap-ctrl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.heatmap-ctrl-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          window._currentHeatmapMetric = btn.dataset.metric;
          const currentProps = window._currentFilteredProperties || (window.appData ? window.appData.properties : []);
          updateHeatmapWithData(currentProps, btn.dataset.metric);
        });
      });

      window._currentHeatmapMetric = 'demand';
      updateHeatmapWithData(props, 'demand');
    }
  }, 500);
}
