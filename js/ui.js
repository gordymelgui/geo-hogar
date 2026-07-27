
window.closeAcademy = function() {
  const academyView = document.getElementById('view-academy');
  if (academyView) {
    academyView.style.display = 'none';
    academyView.classList.remove('active');
  }
  document.querySelectorAll('.view').forEach(v => {
    if (v.id === 'view-explore') {
      v.classList.add('active');
    } else {
      v.classList.remove('active');
    }
  });
  document.querySelectorAll('.sidebar-link').forEach(l => {
    if (l.id === 'nav-explore') {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });
};
document.addEventListener('DOMContentLoaded', () => {
  const exploreGrid = document.getElementById('properties-grid');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const overlayBg = document.getElementById('overlay-bg');
  
  // Define global normalizer and zone mapping helpers on window so app.js can use them too
  window.normalizeString = function(str) {
    if (!str) return '';
    let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // Standardize Ykua Sati / Ycua Sati spelling variations
    s = s.replace(/ykua/g, 'ycua');
    s = s.replace(/ykuá/g, 'ycua');
    s = s.replace(/ycuasati/g, 'ycua sati');
    s = s.replace(/ykuasati/g, 'ycua sati');
    return s.trim();
  };

  window.getNormalizedZoneName = function(zone) {
    if (!zone) return window.t ? window.t('chart_other') : 'Otros';
    const cleanZone = window.fixUtf8Encoding ? window.fixUtf8Encoding(zone) : zone;
    const z = window.normalizeString(cleanZone);
    if (z.includes('ycua sati') || z.includes('ykua sati')) return 'Ycuá Satí';
    if (z.includes('villa morra')) return 'Villa Morra';
    if (z.includes('las lomas') || z.includes('lomas')) return 'Las Lomas';
    if (z.includes('mburucuya')) return 'Mburucuyá';
    if (z.includes('herrera')) return 'Herrera';
    if (z.includes('trinidad')) return 'Trinidad';
    if (z.includes('los laureles') || z.includes('laureles')) return 'Los Laureles';
    if (z.includes('recoleta')) return 'Recoleta';
    if (z.includes('centro')) return 'Centro';
    if (z.includes('luque')) return 'Luque';
    if (z.includes('lambare')) return 'Lambaré';
    if (z.includes('san lorenzo')) return 'San Lorenzo';
    if (z.includes('fernando de la mora') || z.includes('fernando')) return 'Fernando de la Mora';
    if (z.includes('jara') || z.includes('barrio jara')) return 'Barrio Jara';
    if (z.includes('mercedes') || z.includes('las mercedes')) return 'Las Mercedes';
    if (z.includes('san vicente')) return 'San Vicente';
    if (z.includes('nemby') || z.includes('ñemby')) return 'Ñemby';
    if (z.includes('manora')) return 'Manorá';
    if (z.includes('mcal') || z.includes('estigarribia')) return 'Mcal. Estigarribia';
    
    return cleanZone.trim();
  };

  // Filtro unificado de Explorar — con debounce para evitar spam de llamadas
  let _filterDebounceTimer = null;
  function applyExploreFilters(sync = false) {
    if (_filterDebounceTimer) clearTimeout(_filterDebounceTimer);
    if (sync) {
        _doApplyExploreFilters();
    } else {
        _filterDebounceTimer = setTimeout(_doApplyExploreFilters, 60);
    }
  }
  function _doApplyExploreFilters() {
    const normalize = window.normalizeString;
    
    // Obtener categoría activa
    const activeCatBtn = document.querySelector('.cat-btn.active');
    const cat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : '';
    
    // Obtener país activo
    const activeCountryBtn = document.querySelector('.country-pill.active');
    const country = activeCountryBtn ? activeCountryBtn.getAttribute('data-country') : '';
    
    // Obtener filtros de inversión
    const roiActive = document.getElementById('explore-roi-btn')?.classList.contains('active') || 
                      document.getElementById('filter-roi-btn')?.classList.contains('active');
    const marketActive = document.getElementById('explore-market-value-btn')?.classList.contains('active') || 
                          document.getElementById('filter-market-value-btn')?.classList.contains('active');

    // Obtener término de búsqueda
    const searchVal = document.getElementById('global-search')?.value || '';
    const term = normalize(searchVal);
    const searchTerms = term.split(/\s+/).filter(t => t.length > 0);
    
    // Obtener valores de filtros avanzados
    const advType = document.getElementById('f-type')?.value || '';
    const advOp = 'Venta';
    const advCity = document.getElementById('f-city')?.value || '';
    const rate = window.exchangeRates?.[window.currentCurrency] || 1;
    
    const pminVal = parseFloat(document.getElementById('f-pmin')?.value);
    const pmaxVal = parseFloat(document.getElementById('f-pmax')?.value);
    const pminRaw = isNaN(pminVal) ? 0 : pminVal;
    const pmaxRaw = isNaN(pmaxVal) ? Infinity : pmaxVal;
    const pmin = pminRaw / rate;
    const pmax = pmaxRaw / rate;
    const mmin = parseFloat(document.getElementById('f-mmin')?.value) || 0;
    const advRooms = document.querySelector('#f-rooms .pill.active')?.dataset.val || '';

    if (!window.appData || !window.appData.properties) return;
    
    const filtered = window.appData.properties.filter(p => {


      // 1. Filtrar por categoría
      if (cat) {
        if (cat === 'Casa') {
          if (p.type !== 'Casa' && p.type !== 'Dúplex') return false;
        } else {
          if (p.type !== cat) return false;
        }
      }
      
      // 2. Filtrar por país
      if (country) {
        const pCountry = p.country || ((p.address || '').toLowerCase().includes('argentina') ? 'Argentina' : 'Paraguay');
        if (pCountry.toLowerCase() !== country.toLowerCase()) return false;
      }
      
      // 3. Filtrar por buscador global / mapa (insensible al idioma)
      if (searchTerms.length > 0) {
        const title = normalize(p.title || '');
        const addr = normalize(p.address || '');
        const neigh = normalize(p.neighborhood || '');
        const city = normalize(p.city || '');
        const type = normalize(p.type || '');
        const translatedType = normalize(window.translatePropType ? window.translatePropType(p.type) : '');
        const desc = normalize(p.description || '');

        const match = searchTerms.every(t => {
          const flexTerm = t.endsWith('s') ? t.slice(0, -1) : t;
          
          const check = (term) => title.includes(term) || addr.includes(term) || neigh.includes(term) || city.includes(term) || type.includes(term) || (translatedType && translatedType.includes(term)) || desc.includes(term);

          if (check(flexTerm)) return true;
          // Manejar sinónimos de Paraguay
          if (flexTerm === 'ycua' && check('ykua')) return true;
          if (flexTerm === 'ykua' && check('ycua')) return true;

          return false;
        });
        if (!match) return false;
      }
      
      // 4. Filtrar por Inversión (ROI/Bajo Valor)
      if (roiActive && (!p.roi || p.roi < 7.0)) return false;
      if (marketActive && p.isUnderpriced !== true) return false;

      // 5. Filtrar por origen de datos
      const feedSource = window.currentFeedSource || 'organic';
      if (feedSource === 'organic' && p.isScraped) return false;
      // Radar PRO (scraped): mostrar data combinada (nativas + scrapeadas), sin filtro.

      // 6. Filtros Avanzados (Operación, Ciudad, Precio, M2, Ambientes)
      if (advType) {
        if (advType === 'Casa') {
          if (p.type !== 'Casa' && p.type !== 'Dúplex') return false;
        } else {
          if (p.type !== advType) return false;
        }
      }
      if (advOp && p.op !== advOp) return false;
      if (advCity) {
        const normCity = normalize(advCity);
        const pCity = normalize(p.city);
        const pNeigh = normalize(p.neighborhood);
        const pAddr = normalize(p.address);
        if (!pCity.includes(normCity) && !pNeigh.includes(normCity) && !pAddr.includes(normCity)) return false;
      }
      if (p.price < pmin || p.price > pmax) return false;
      if (p.m2 < mmin) return false;
      if (advRooms && p.rooms < parseInt(advRooms)) return false;

      return true;
    });
    
    const globalClearBtn = document.getElementById('global-clear-filters-btn');
    if (globalClearBtn) {
      const isActive = cat || (country && country !== 'Paraguay') || searchTerms.length > 0 || advType || advCity || pmin > 0 || pmax < Infinity || mmin > 0 || advRooms || roiActive || marketActive;
      globalClearBtn.style.display = isActive ? 'flex' : 'none';
    }

    window._currentFilteredProperties = filtered;
    renderProperties(filtered, document.getElementById('properties-grid'));
    
    // Market/Analytics uses its OWN independent dataset — never affected by explore filters
    applyMarketFilters();
    
    const countEl = document.getElementById('results-count');
    if (countEl) countEl.innerText = window.t('results_count', { count: filtered.length });

    // Sincronizar con el Mapa si está inicializado
    if (window.mapInstance && window.renderMapMarkers) {
      window._currentMapProperties = filtered.filter(p => !p.isScraped || window.currentFeedSource !== 'organic');
      window.renderMapMarkers(window._currentMapProperties);
      if (window.updateSidebarListFromMapBounds) {
        window.updateSidebarListFromMapBounds();
      }
    }
    
    // Toggle Radar PRO information banner visibility
    const infoBanner = document.getElementById('radar-info-banner');
    if (infoBanner) {
      if (window.currentFeedSource === 'scraped') {
        infoBanner.classList.remove('hidden');
      } else {
        infoBanner.classList.add('hidden');
      }
    }
  }
  window.applyExploreFilters = applyExploreFilters;

  // ===== MARKET INDEPENDENT FILTERS =====
  // Market section has its own state, completely independent from explore/map filters
  let _marketOp = '';
  let _marketType = '';
  let _marketZone = '';

  function applyMarketFilters() {
    if (!window.appData || !window.appData.properties) return;
    // Always start from the FULL dataset, never from explore-filtered props
    let allProps = window.appData.properties.slice();
    if (window.currentDataSourceFilter && window.currentDataSourceFilter !== 'all') {
      allProps = allProps.filter(p => p.dataSource === window.currentDataSourceFilter);
    }
    if (_marketOp) allProps = allProps.filter(p => p.op === _marketOp);
    if (_marketType) allProps = allProps.filter(p => p.type === _marketType);
    if (_marketZone) {
      const zNorm = _marketZone.toLowerCase();
      allProps = allProps.filter(p => (p.address || '').toLowerCase().includes(zNorm));
    }
    renderMarketPulse(allProps);
    updateMarketKPIs(allProps);
  }
  window.applyMarketFilters = applyMarketFilters;

  // Bind market filter controls (injected by renderMarketFilterBar below)
  window._setMarketFilter = function(key, val) {
    if (key === 'op') _marketOp = val;
    if (key === 'type') _marketType = val;
    if (key === 'zone') _marketZone = val;
    applyMarketFilters();
  };

  // ===== UPDATE MARKET KPIs (stat cards) FROM INDEPENDENT DATA =====
  function updateMarketKPIs(props) {
    if (!props || !props.length) return;
    const saleProps = props.filter(p => p.op === 'Venta' && p.m2 > 0);
    const avgPriceM2 = saleProps.length
      ? Math.round(saleProps.reduce((s, p) => s + p.price / p.m2, 0) / saleProps.length)
      : 0;
    const roiProps = props.filter(p => p.roi > 0);
    const avgRoi = roiProps.length
      ? parseFloat((roiProps.reduce((s, p) => s + p.roi, 0) / roiProps.length).toFixed(1))
      : 0;
    const underpricedCount = props.filter(p => p.isUnderpriced).length;

    const elPrice = document.getElementById('stat-avg-price');
    if (elPrice && avgPriceM2 > 0) elPrice.textContent = window.formatPrice(avgPriceM2);
    const elRoi = document.getElementById('stat-avg-roi');
    if (elRoi && avgRoi > 0) elRoi.textContent = `${avgRoi}%`;
    const elUnderpriced = document.getElementById('stat-underpriced-count');
    if (elUnderpriced) elUnderpriced.textContent = underpricedCount;
    const elCount = document.getElementById('stat-properties-count');
    if (elCount) elCount.textContent = props.length;
  }
  window.updateMarketKPIs = updateMarketKPIs;

  // ===== RENDER MARKET FILTER BAR (DEPRECATED) =====
  function renderMarketFilterBar() {
    // Deprecated functionality, removed.
  }
  window.renderMarketFilterBar = renderMarketFilterBar;

  // ===== MODAL DE AVISO LEGAL =====
  function showLegalDisclaimerModal(onAccept) {
    let overlay = document.getElementById('legal-disclaimer-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'legal-disclaimer-modal-overlay';
      overlay.className = 'premium-modal-overlay hidden';
      overlay.style.zIndex = '99999';
      overlay.innerHTML = `
        <div class="premium-modal-card" style="max-width: 400px; padding: 2rem 1.5rem; text-align: center;">

          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; font-family: 'Plus Jakarta Sans', sans-serif;">Aviso Legal Importante</h2>
          <p style="color: var(--text2); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem;">Las métricas de ROI y Valor de Mercado del Radar son estimaciones algorítmicas basadas en datos públicos. GeoHogar no provee asesoría financiera. Realiza tu propia diligencia debida antes de invertir.</p>
          <button id="legal-disclaimer-accept-btn" class="btn btn-primary" style="width: 100%; border-radius: 50px; padding: 12px; font-weight: 700;">Aceptar y Continuar</button>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    
    const acceptBtn = overlay.querySelector('#legal-disclaimer-accept-btn');
    acceptBtn.onclick = () => {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.classList.add('hidden');
        if (onAccept) onAccept();
      }, 300);
    };

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('active'), 10);
  }

  // ===== RENDER MARKET NEWS =====
  function renderMarketNews(newsArray) {
    const container = document.getElementById('market-news-list');
    if (!container) return;

    if (!newsArray || newsArray.length === 0) {
      container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text2); grid-column: 1/-1;">Aún no hay noticias disponibles del mercado.</div>';
      return;
    }

    container.innerHTML = '';
    newsArray.forEach(news => {
      const card = document.createElement('div');
      card.style.cssText = 'background: var(--background); border-radius: 12px; padding: 1.25rem; border: 1px solid var(--border); transition: transform 0.2s; cursor: pointer; display: flex; flex-direction: column; gap: 8px;';
      card.onmouseover = () => card.style.transform = 'translateY(-2px)';
      card.onmouseout = () => card.style.transform = 'translateY(0)';
      card.onclick = () => window.open(news.link || '#', '_blank');

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text2); font-weight: 700;">
          <span style="color: var(--primary); text-transform: uppercase;">${news.source}</span>
          <span>${news.date || 'Reciente'}</span>
        </div>
        <h4 style="margin: 0; font-size: 1rem; color: var(--text); line-height: 1.4;">${news.title}</h4>
        <p style="margin: 0; font-size: 0.85rem; color: var(--text2); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${news.excerpt}</p>
      `;
      container.appendChild(card);
    });
  }
  window.renderMarketNews = renderMarketNews;

  // ===== RENDER PULSO DE MERCADO DINÁMICO =====
  function renderMarketPulse(props) {
    const container = document.querySelector('.market-cards');
    if (!container) return;
    
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);

    const zones = {};
    props.forEach(p => {
      const parts = (p.address || '').split(',');
      let zoneName = '';
      if (parts.length >= 3) {
        zoneName = parts[1].trim();
      } else {
        zoneName = (parts[0] || '').trim();
      }

      if (['argentina', 'paraguay'].includes(zoneName.toLowerCase())) {
        return;
      }

      if (!zones[zoneName]) {
        zones[zoneName] = {
          name: zoneName,
          count: 0,
          totalPriceSale: 0,
          totalM2Sale: 0,
          saleCount: 0,
          totalRoi: 0,
          roiCount: 0,
          underpricedCount: 0
        };
      }

      const z = zones[zoneName];
      z.count++;
      if (p.op === 'Venta' && p.m2 > 0) {
        z.totalPriceSale += p.price;
        z.totalM2Sale += p.m2;
        z.saleCount++;
      }
      if (p.roi) {
        z.totalRoi += p.roi;
        z.roiCount++;
      }
      if (p.isUnderpriced) {
        z.underpricedCount++;
      }
    });

    const zonesList = Object.values(zones).map(z => {
      const avgPriceM2 = z.saleCount > 0 ? Math.round(z.totalPriceSale / z.totalM2Sale) : 0;
      const avgRoi = z.roiCount > 0 ? parseFloat((z.totalRoi / z.roiCount).toFixed(1)) : 0;
      
      let demandLabel = 'Demanda media';
      let trendClass = 'up';
      if (avgRoi > 8.0) {
        demandLabel = 'Muy alta demanda';
      } else if (z.underpricedCount > 0) {
        demandLabel = 'Oportunidad';
        trendClass = 'down';
      } else if (avgRoi > 6.5) {
        demandLabel = 'Alta demanda';
      }

      const changeVal = avgRoi > 0 ? parseFloat(((avgRoi - 5.2) * 0.7).toFixed(1)) : 0.2;
      const changeText = changeVal >= 0 ? `▲ ${changeVal}%` : `▼ ${Math.abs(changeVal)}%`;

      return {
        name: z.name,
        priceM2: avgPriceM2,
        roi: avgRoi,
        demandLabel,
        trendClass,
        changeText,
        propertiesCount: z.count
      };
    });

    let sortedZones = zonesList.filter(z => z.priceM2 > 0);
    sortedZones.sort((a, b) => b.roi - a.roi);

    const topZones = sortedZones.slice(0, 4);

    container.innerHTML = '';
    if (topZones.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text2); padding: 2rem 0; font-weight: 600;">No hay datos de mercado disponibles para los filtros actuales.</p>';
      return;
    }

    topZones.forEach(z => {
      const card = document.createElement('div');
      card.className = `market-card ${z.trendClass}`;
      const barPercent = Math.min(100, Math.max(30, Math.round(z.roi * 10)));
      card.innerHTML = `
        <div class="market-card-header">
          <span class="market-zone">${z.name}</span>
          <span class="market-change">${z.changeText}</span>
        </div>
        <div class="market-price">${window.formatPriceM2(z.priceM2)}</div>
        <div class="market-bar">
          <div class="market-bar-fill" style="width:${barPercent}%"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem; font-size:0.75rem;">
          <span class="market-label">${z.demandLabel}</span>
          ${isPremium ? `<span style="color:var(--text2); font-weight:700;">ROI: ${z.roi > 0 ? z.roi + '%' : 'N/A'}</span>` : ''}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Categorías interactivas — filtro unificado
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Sincronizar con el filtro avanzado f-type para evitar incoherencias y cruces nulos
      const fType = document.getElementById('f-type');
      if (fType) {
        fType.value = btn.getAttribute('data-cat') || '';
      }

      applyExploreFilters();
    });
  });

  // Pastillas de países — filtro unificado
  const countryPills = document.querySelectorAll('.country-pill');
  countryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      countryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyExploreFilters();
    });
  });

  // Filtros de Inversión Inteligentes en Explorar
  const expRoiBtn = document.getElementById('explore-roi-btn');
  const expMarketBtn = document.getElementById('explore-market-value-btn');

  if (expRoiBtn) {
    expRoiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        window.showPremiumPaywall();
        return;
      }
      expRoiBtn.classList.toggle('active');
      const mapBtn = document.getElementById('filter-roi-btn');
      if (mapBtn) {
        if (expRoiBtn.classList.contains('active')) mapBtn.classList.add('active');
        else mapBtn.classList.remove('active');
      }
      applyExploreFilters();
    });
  }

  if (expMarketBtn) {
    expMarketBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        window.showPremiumPaywall();
        return;
      }
      expMarketBtn.classList.toggle('active');
      const mapBtn = document.getElementById('filter-market-value-btn');
      if (mapBtn) {
        if (expMarketBtn.classList.contains('active')) mapBtn.classList.add('active');
        else mapBtn.classList.remove('active');
      }
      applyExploreFilters();
    });
  }

  // Filtros - Pastillas de ambientes
  const roomPills = document.querySelectorAll('#f-rooms .pill');
  roomPills.forEach(pill => {
    pill.addEventListener('click', () => {
      roomPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Buscador Global Inteligente — filtro unificado y sincronizado con el mapa
  const globalSearch = document.getElementById('global-search');
  const mapSearchInput = document.getElementById('map-search-input');
  const mapSearchClear = document.getElementById('map-search-clear-btn');

  if (globalSearch) {
    globalSearch.addEventListener('input', () => {
      if (mapSearchInput) {
        mapSearchInput.value = globalSearch.value;
        if (mapSearchClear) mapSearchClear.classList.toggle('hidden', globalSearch.value === '');
      }
      applyExploreFilters();
    });

    const triggerSearchLead = () => {
      const val = globalSearch.value.trim();
      
      const filterPanel = document.getElementById('filter-panel');
      if (filterPanel && !filterPanel.classList.contains('hidden')) {
        filterPanel.classList.add('hidden');
      }
      globalSearch.blur();

      if (window.smartCenterMap && val) {
         window.smartCenterMap(val);
      }
      
      const count = window._currentFilteredProperties ? window._currentFilteredProperties.length : 0;
      if (val && window.showToast) {
        window.showToast(window.t('toast_props_found', { count: count }) || `Búsqueda activada (${count} resultados)`);
      }

      if (val.length >= 3 && /[aeiouáéíóú]/i.test(val)) {
        if (window.firebaseAuth && window.firebaseDb) {
          const u = window.firebaseAuth.currentUser;
          if (u) {
             const leadZone = val || 'General';
             const cat = document.querySelector('.cat-btn.active')?.dataset.cat || 'Inmueble';
             const rate = window.exchangeRates?.[window.currentCurrency] || 1;
             const pmaxVal = parseFloat(document.getElementById('f-pmax')?.value);
             const budget = (pmaxVal && !isNaN(pmaxVal) && pmaxVal > 0) ? Math.round(pmaxVal / rate) : 0;
             
             window.firebaseDb.collection('broker_leads').doc(u.uid).set({
                userId: u.uid,
                name: window.currentUserProfile?.name || u.displayName || 'Usuario',
                budget: budget,
                zone: leadZone,
                type: cat,
                op: 'Venta',
                isOwner: window.currentUserProfile?.userType === 'owner',
                timestamp: Date.now()
             }, { merge: true }).catch(e => console.warn('No se pudo generar lead:', e));
          }
        }
      }
    };

    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearchLead();
      }
    });

    const searchSubmitBtn = document.getElementById('search-submit-btn');
    if (searchSubmitBtn) {
      searchSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerSearchLead();
      });
    }
  }

  const SMART_ZONES = {
    'ycua sati': [-25.2828, -57.5629],
    'villa morra': [-25.2934, -57.5796],
    'las mercedes': [-25.2811, -57.6086],
    'eje corporativo': [-25.2828, -57.5629],
    'carmelitas': [-25.2798, -57.5724],
    'manora': [-25.2801, -57.5670],
    'mburucuya': [-25.2678, -57.5631],
    'barrio jara': [-25.2770, -57.6025],
    'san cristobal': [-25.2915, -57.5658],
    'sajonia': [-25.2886, -57.6536],
    'centro': [-25.2822, -57.6351],
    'asuncion': [-25.2865, -57.6360],
    'san lorenzo': [-25.3396, -57.5088],
    'luque': [-25.2667, -57.4833],
    'fernando de la mora': [-25.3262, -57.5457],
    'lambare': [-25.3387, -57.6053]
  };

  window.smartCenterMap = async function(query) {
    if (!window.mapInstance || !query) return false;
    const q = window.normalizeString ? window.normalizeString(query).toLowerCase() : query.toLowerCase();
    
    const checkEmpty = () => {
      if (window._currentFilteredProperties && window._currentFilteredProperties.length === 0 && window.showToast) {
        window.showToast(window.t('empty_state_props') || 'No se encontraron propiedades.', 'warn');
      }
    };

    // 1. Búsqueda ultra-rápida (Hardcoded)
    for (const [zone, coords] of Object.entries(SMART_ZONES)) {
      if (q.includes(zone)) {
        window.mapInstance.setView(coords, 15, { animate: true, duration: 1.0 });
        checkEmpty();
        return true;
      }
    }

    // 2. Geocoding Inteligente via OpenStreetMap
    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Paraguay')}&limit=1`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        window.mapInstance.setView([lat, lon], 14, { animate: true, duration: 1.0 });
        checkEmpty();
        return true;
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }

    checkEmpty();
    return false;
  };

  function handleSearchEnter(e) {
      if (e.key === 'Enter' && window.mapInstance) {
         let boundsValid = false;
         if (window.markersGroup) {
             const bounds = window.markersGroup.getBounds();
             if (bounds.isValid()) {
                 window.mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                 boundsValid = true;
             }
         }
         if (!boundsValid && window.smartCenterMap) {
             window.smartCenterMap(e.target.value);
         }
         e.target.blur();
      }
  }

  if (globalSearch) {
    globalSearch.addEventListener('keydown', handleSearchEnter);
  }

  if (mapSearchInput) {
    mapSearchInput.addEventListener('input', () => {
      if (globalSearch) globalSearch.value = mapSearchInput.value;
      if (mapSearchClear) mapSearchClear.classList.toggle('hidden', mapSearchInput.value === '');
      applyExploreFilters();
    });
    
    mapSearchInput.addEventListener('keydown', handleSearchEnter);
  }

  if (mapSearchClear) {
    mapSearchClear.addEventListener('click', (e) => {
      e.stopPropagation();
      if (globalSearch) globalSearch.value = '';
      if (mapSearchInput) mapSearchInput.value = '';
      mapSearchClear.classList.add('hidden');
      applyExploreFilters();
    });
  }

  // Render Propiedades
  function renderProperties(props, container) {
    if (!container) return;
    
    // SORT PROPERTIES: Broker & Premium first
    props.sort((a, b) => {
      const getPriority = (type) => {
        if (type === 'broker') return 2;
        if (type === 'premium') return 1;
        return 0;
      };
      return getPriority(b.publisherType) - getPriority(a.publisherType);
    });

    container.innerHTML = '';
    if (props.length === 0) {
      container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><h3>${window.t('empty_explore')}</h3><p style="max-width:350px">${window.t('empty_explore_desc')}</p></div>`;
      return;
    }
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    props.forEach((prop, index) => {
      const isFav = window.appData.favorites.has(prop.id);
      const opClass = prop.op === 'Venta' ? 'venta' : 'alquiler';
      const card = document.createElement('div');
      const isScrapedLocked = prop.isScraped && !isPremium;
      card.className = 'property-card' + (isScrapedLocked ? ' scraped-locked' : '');
      card.style.animationDelay = `${index * 40}ms`;
      card.onclick = (e) => {
        if (e.target.closest('.glossary-info-icon, .btn-fav')) {
          return;
        }
        if (isScrapedLocked) {
          if (window.checkPremiumAccess && window.checkPremiumAccess('consume')) {
            openPropertyModal(prop);
          }
        } else {
          openPropertyModal(prop);
        }
      };
      
      // ROI & Opportunity badges are strictly premium features. Do not show them for standard users.
      const roiBadge = (prop.roi && isPremium) ? 
        `<span class="clean-badge badge-premium-green"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>ROI ${prop.roi}%</span>` : '';
      
      const discountBadge = (prop.isUnderpriced && isPremium) ? 
        `<span class="clean-badge badge-premium-orange"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg>-${prop.discount}%</span>` : '';

      const imageBrokerBadge = (prop.publisherType === 'broker') ?
        `<span class="clean-badge badge-gf-gold" style="position: absolute; top: 12px; left: 12px; z-index: 10; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4); border: 1px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(4px);"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:2px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>GF</span>` : 
        (prop.publisherType === 'premium' ? `<span class="clean-badge badge-premium-gold" style="position: absolute; top: 12px; left: 12px; z-index: 10; box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(4px);">Premium</span>` : '');

      const typeBadge = `<span class="clean-badge badge-type">${window.translatePropType ? window.translatePropType(prop.type) : prop.type}</span>`;
      const opBadge = `<span class="clean-badge badge-op ${prop.op === 'Venta' ? 'bg-red-soft' : 'bg-blue-soft'}">${prop.op === 'Venta' ? window.t('op_venta') : window.t('op_alquiler')}</span>`;
      let sourceBadge = '';
      if (prop.dataSource === 'radar') sourceBadge = `<span class="source-badge algo" style="font-size:0.65rem; padding:2px 6px">${window.t('source_radar')}</span>`;
      else if (prop.dataSource === 'official') sourceBadge = `<span class="source-badge verified" style="font-size:0.65rem; padding:2px 6px">${window.t('source_official')}</span>`;
      else if (prop.dataSource === 'estimation') sourceBadge = `<span class="source-badge est" style="font-size:0.65rem; padding:2px 6px">${window.t('source_estimation')}</span>`;

      let aiBadges = '';
      if (prop.aiTags && prop.aiTags.length > 0) {
        prop.aiTags.forEach(tag => {
          aiBadges += `<span class="clean-badge badge-premium-gold" style="box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${tag}</span>`;
        });
      }

      // Render the card HTML
      card.innerHTML = `
        <div class="prop-img-wrap">
          ${imageBrokerBadge}
          <img src="${prop.img}" alt="${prop.title}" loading="lazy">
          <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${prop.id}" onclick="event.stopPropagation(); toggleFav(${prop.id}, this)">
            ${isFav ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" style="color: #ff2a5f; display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>' : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text2); display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>'}
          </button>
        </div>
        <div class="prop-info" style="padding-top: 14px;">
          <div class="prop-price" style="margin-bottom: 2px; display: flex; justify-content: space-between; align-items: center;">
            <span>${window.formatPrice(prop.price)}</span>
            ${(prop.lat && prop.lng) ? `<a href="https://www.google.com/maps?q=${prop.lat},${prop.lng}" target="_blank" onclick="event.stopPropagation();" style="color: var(--text2); text-decoration: none;" title="Abrir en Maps"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></a>` : ''}
          </div>
          <div class="prop-clean-badges">
            ${sourceBadge}
            ${typeBadge}
            ${opBadge}
            ${roiBadge}
            ${discountBadge}
          </div>
          <div class="prop-clean-badges" style="margin-top:4px;">
            ${aiBadges}
          </div>
          <div class="prop-title">${prop.title}</div>
          <div class="prop-address" style="margin-top: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${prop.address}
          </div>
          <div class="prop-features" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="feat-chip">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                ${prop.rooms} ${window.t('card_rooms')}
              </span>
              <span class="feat-chip">
                <svg viewBox="0 0 24 24"><path d="M4 12h16M4 12a2 2 0 0 1-2-2V6h2"/><path d="M20 12v8H4v-8"/><path d="M6 12V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/></svg>
                ${prop.baths} ${window.t('card_baths')}
              </span>
              <span class="feat-chip">
                <svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                ${prop.m2} ${window.t('card_m2')}
              </span>
            </div>
            <button class="btn-compare-card ${(window._selectedCompareIds && window._selectedCompareIds.has(prop.id)) ? 'active' : ''}" onclick="event.stopPropagation(); window.toggleCompareProp(${prop.id}, this)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 9"/><polyline points="8 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              ${(window._selectedCompareIds && window._selectedCompareIds.has(prop.id)) ? 'Comparando' : 'Comparar'}
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  window.renderProperties = renderProperties;

  window.toggleFav = function(id, btnElement) {
    let isAdded = false;
    if (window.appData.favorites.has(id)) {
      window.appData.favorites.delete(id);
      btnElement.classList.remove('active');
      btnElement.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text2); display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>';
    } else {
      window.appData.favorites.add(id);
      btnElement.classList.add('active');
      btnElement.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" style="color: #ff2a5f; display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>';
      isAdded = true;
    }
    updateFavBadges();
    if (document.getElementById('view-favorites').classList.contains('active')) renderFavorites();

    // Persist to Firestore!
    if (typeof firebase !== 'undefined') {
      const currentUser = firebase.auth().currentUser;
      if (currentUser && window.saveUserFavorites) {
        const favsArray = Array.from(window.appData.favorites);
        window.saveUserFavorites(currentUser.uid, favsArray)
          .then(() => {
            showToast(isAdded ? window.t('toast_fav_added') : window.t('toast_fav_removed'));
          })
          .catch(err => console.error("Error guardando favoritos:", err));
      }
    } else {
      showToast(isAdded ? window.t('toast_fav_added_local') : window.t('toast_fav_removed_local'));
    }
  };

  // ===== COMPARADOR LADO A LADO =====
  window._selectedCompareIds = new Set();

  window.toggleCompareProp = function(id, btnElement) {
    if (window._selectedCompareIds.has(id)) {
      window._selectedCompareIds.delete(id);
      if (btnElement) {
        btnElement.classList.remove('active');
        btnElement.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 9"/><polyline points="8 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> Comparar`;
      }
    } else {
      if (window._selectedCompareIds.size >= 4) {
        if (window.showToast) window.showToast('Puedes comparar hasta 4 propiedades simultáneamente', 'error');
        return;
      }
      window._selectedCompareIds.add(id);
      if (btnElement) {
        btnElement.classList.add('active');
        btnElement.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 9"/><polyline points="8 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> Comparando`;
      }
    }
    updateCompareBar();
  };

  function updateCompareBar() {
    let bar = document.getElementById('geo-compare-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'geo-compare-bar';
      bar.className = 'geo-compare-bar';
      document.body.appendChild(bar);
    }

    const count = window._selectedCompareIds.size;
    if (count === 0) {
      bar.classList.remove('show');
      return;
    }

    bar.innerHTML = `
      <div class="geo-compare-count">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84a375" stroke-width="2.5"><polyline points="16 3 21 3 21 9"/><polyline points="8 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        <span>${count}/4 Inmuebles seleccionados</span>
      </div>
      <button class="btn-compare-action" onclick="window.openCompareModal()">Comparar Lado a Lado</button>
      <button onclick="window._selectedCompareIds.clear(); window.updateCompareBar(); if(window.renderProperties) window.renderProperties(window._currentFilteredProperties || window.appData.properties);" style="background:none; border:none; color:var(--text2); font-size:0.8rem; font-weight:700; cursor:pointer;">Limpiar</button>
    `;
    bar.classList.add('show');
  }
  window.updateCompareBar = updateCompareBar;

  window.openCompareModal = function() {
    const ids = Array.from(window._selectedCompareIds);
    if (ids.length === 0) return;
    const allProps = window.appData?.properties || [];
    const props = ids.map(id => allProps.find(p => p.id === id)).filter(Boolean);

    let modalOverlay = document.getElementById('compare-modal-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'compare-modal-overlay';
      modalOverlay.className = 'modal-overlay hidden';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="modal-card" style="max-width: 1080px; width: 95vw; padding: 2rem;">
        <button class="modal-close" onclick="document.getElementById('compare-modal-overlay').classList.add('hidden')">&times;</button>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:1.5rem;">
          <div>
            <h2 style="margin:0; font-size:1.4rem; font-weight:800; color:var(--text);">Comparador Lado a Lado de Propiedades</h2>
            <p style="margin:4px 0 0 0; font-size:0.85rem; color:var(--text2);">Análisis comparativo unificado de m², ROI, expensas y precios</p>
          </div>
          <button class="btn-primary" onclick="window.print()" style="background:#84a375; border:none; display:flex; align-items:center; gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar Informe PDF
          </button>
        </div>

        <div style="overflow-x:auto;">
          <table class="compare-modal-table">
            <thead>
              <tr>
                <th>Característica</th>
                ${props.map(p => `
                  <td style="min-width:200px; text-align:center;">
                    <img src="${p.img}" style="width:100%; height:130px; object-fit:cover; border-radius:12px; margin-bottom:8px;">
                    <strong style="display:block; font-size:0.95rem; color:var(--text);">${p.title}</strong>
                    <span style="font-size:0.8rem; color:var(--text2);">${p.address}</span>
                  </td>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Precio Total</th>
                ${props.map(p => `<td style="font-weight:800; font-size:1.1rem; color:var(--accent); text-align:center;">${window.formatPrice(p.price)}</td>`).join('')}
              </tr>
              <tr>
                <th>Precio / m²</th>
                ${props.map(p => `<td style="font-weight:700; text-align:center;">${window.formatPriceM2(p.priceM2 || Math.round(p.price / (p.m2 || 1)))}</td>`).join('')}
              </tr>
              <tr>
                <th>Superficie</th>
                ${props.map(p => `<td style="font-weight:700; text-align:center;">${p.m2} m²</td>`).join('')}
              </tr>
              <tr>
                <th>Dormitorios / Baños</th>
                ${props.map(p => `<td style="text-align:center;">${p.rooms} dorm. | ${p.baths} baños</td>`).join('')}
              </tr>
              <tr>
                <th>ROI Estimativo</th>
                ${props.map(p => `<td style="font-weight:800; color:#10b981; text-align:center;">${p.roi ? p.roi + '%' : '6.5% est.'}</td>`).join('')}
              </tr>
              <tr>
                <th>Expensas Estimadas</th>
                ${props.map(p => `<td style="text-align:center;">${window.formatPrice(p.expensas || Math.round(p.m2 * 1.2))} / mes</td>`).join('')}
              </tr>
              <tr>
                <th>Tipo y Fuente</th>
                ${props.map(p => `<td style="font-size:0.8rem; color:var(--text2); text-align:center;">${p.type} (${p.op})<br><span class="clean-badge badge-type" style="margin-top:4px;">${p.dataSource || 'Radar'}</span></td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('active');
  };

  function updateFavBadges() {
    const count = window.appData.favorites.size;
    const badge = document.getElementById('fav-badge');
    const bnavBadge = document.getElementById('bnav-fav-badge');
    const label = document.getElementById('fav-count-label');
    if (badge) { badge.textContent = count; badge.style.display = count > 0 ? '' : 'none'; }
    if (bnavBadge) { bnavBadge.textContent = count; bnavBadge.style.display = count > 0 ? 'flex' : 'none'; }
    if (label) label.textContent = window.t('fav_count_label', { count });
    
    const heroFavs = document.getElementById('hero-favs-count');
    if (heroFavs) heroFavs.textContent = count;
  }
  window.updateFavBadges = updateFavBadges;

  function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('favorites-empty');
    const stats = document.getElementById('fav-stats');
    if (!grid) return;
    const favProps = window.appData.properties.filter(p => window.appData.favorites.has(p.id));
    const prevEmpty = document.getElementById('favorites-empty');
    if (prevEmpty) prevEmpty.remove();
    grid.querySelectorAll('.property-card').forEach(c => c.remove());
    if (favProps.length === 0) {
      if (!document.getElementById('favorites-empty')) {
        const e = document.createElement('div');
        e.className = 'empty-state'; e.id = 'favorites-empty';
        e.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><h3>Sin favoritos aún</h3><p>Guardá propiedades tocando el corazón de favoritos para verlas aquí</p>';
        grid.appendChild(e);
      }
      if (stats) stats.style.display = 'none';
    } else {
      if (stats) {
        stats.style.display = 'flex';
        document.getElementById('fav-total').textContent = favProps.length;
        document.getElementById('fav-venta').textContent = favProps.filter(p=>p.op==='Venta').length;
        document.getElementById('fav-alquiler').textContent = favProps.filter(p=>p.op==='Alquiler').length;
      }
      renderProperties(favProps, grid);
    }
  }

  // Abrir Modal de Propiedad
  function openPropertyModal(prop) {
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    document.getElementById('modal-gallery').innerHTML = `<img src="${prop.img}" alt="Gallery">`;
    let titleBadge = '';
    if (prop.dataSource === 'radar') titleBadge = `<span class="source-badge algo" style="margin-right:8px;">${window.t('source_radar')}</span>`;
    else if (prop.dataSource === 'official') titleBadge = `<span class="source-badge verified" style="margin-right:8px;">${window.t('source_official')}</span>`;
    else if (prop.dataSource === 'estimation') titleBadge = `<span class="source-badge est" style="margin-right:8px;">${window.t('source_estimation')}</span>`;
    document.getElementById('modal-title').innerHTML = `${titleBadge}${prop.title}`;
    document.getElementById('modal-address').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${prop.address}`;
    document.getElementById('modal-price').innerText = window.formatPrice(prop.price);
    
    document.getElementById('modal-features').innerHTML = `
      <div class="spec-chip">
        <div class="spec-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <div><div class="spec-val">${prop.rooms}</div><div class="spec-label">${window.t('filter_rooms')}</div></div>
      </div>
      <div class="spec-chip">
        <div class="spec-icon"><svg viewBox="0 0 24 24"><path d="M4 12h16M4 12a2 2 0 0 1-2-2V6h2"/><path d="M20 12v8H4v-8"/><path d="M6 12V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/></svg></div>
        <div><div class="spec-val">${prop.baths}</div><div class="spec-label">${window.t('pub_field_baths')}</div></div>
      </div>
      <div class="spec-chip">
        <div class="spec-icon"><svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg></div>
        <div><div class="spec-val">${prop.m2} m²</div><div class="spec-label">${window.t('modal_total_m2')}</div></div>
      </div>
      ${(prop.roi && isPremium) ? 
        `<div class="spec-chip roi-chip">
          <div class="spec-icon"><svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
          <div>
            <div class="spec-val">${prop.roi}%<span class="glossary-info-icon" data-glossary="roi" title="${window.t ? window.t('view_explanations_tooltip') : '?'}" style="margin-left:4px;cursor:pointer;opacity:.85">?</span></div>
            <div class="spec-label">${window.t('modal_rentability')}</div>
          </div>
        </div>` : ''}
      ${(prop.isUnderpriced && isPremium) ? 
        `<div class="spec-chip discount-chip">
          <div class="spec-icon"><svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
          <div>
            <div class="spec-val">-${prop.discount}%<span class="glossary-info-icon" data-glossary="underpriced" title="${window.t ? window.t('view_explanations_tooltip') : '?'}" style="margin-left:4px;cursor:pointer;opacity:.85">?</span></div>
            <div class="spec-label">${window.t('modal_below_market')}</div>
          </div>
        </div>` : ''}
    `;
    
    document.getElementById('modal-desc').innerHTML = prop.description || window.t('modal_default_desc', { type: window.translatePropType ? window.translatePropType(prop.type) : prop.type, rooms: prop.rooms });
    
    const gmapsLink = document.getElementById('modal-gmaps-link');
    if (gmapsLink) {
      gmapsLink.href = `https://www.google.com/maps?q=${prop.lat},${prop.lng}`;
    }
    
    const agentCard = document.querySelector('.agent-card');
    const isReferenceOnly = !!prop.isScraped;

    if (isReferenceOnly) {
      if (agentCard) agentCard.style.display = 'none';
      
      // Mostrar u obtener la caja informativa de referencia métrica
      let refBox = document.getElementById('modal-reference-box');
      if (!refBox) {
        refBox = document.createElement('div');
        refBox.id = 'modal-reference-box';
        refBox.style.cssText = 'background:var(--surface2); border:1.5px dashed var(--border); border-radius:16px; padding:1.5rem; text-align:center; margin-bottom:1.5rem;';
        if (agentCard && agentCard.parentNode) {
          agentCard.parentNode.insertBefore(refBox, agentCard);
        }
      }
      refBox.style.display = 'block';

      if (prop.isScraped) {
        let portalName = "Portal Externo";
        if (prop.link && prop.link.includes("infocasas")) {
          portalName = "InfoCasas Paraguay";
        } else if (prop.link && prop.link.includes("clasipar")) {
          portalName = "Clasipar";
        }
        refBox.innerHTML = `
          <div style="width:40px;height:40px;border-radius:12px;background:rgba(99,102,241,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          </div>
          <h4 style="margin:0; font-weight:700; font-size:1rem; color:var(--text); font-family: 'Plus Jakarta Sans', sans-serif;">${window.t('modal_ref_external')}</h4>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin:6px 0 0 0; line-height:1.4;">
            ${window.t('modal_ref_external_desc', { portal: portalName })}
          </p>
        `;
      } else {
        refBox.innerHTML = `
          <div style="width:40px;height:40px;border-radius:12px;background:rgba(16,185,129,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <h4 style="margin:0; font-weight:700; font-size:1rem; color:var(--text); font-family: 'Plus Jakarta Sans', sans-serif;">${window.t('modal_ref_market')}</h4>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin:6px 0 0 0; line-height:1.4;">
            ${window.t('modal_ref_market_desc')}
          </p>
        `;
      }
    } else {
      if (agentCard) agentCard.style.display = 'flex';
      
      const refBox = document.getElementById('modal-reference-box');
      if (refBox) refBox.style.display = 'none';

      const agentAvatar = document.getElementById('modal-agent-avatar');
      const agentNameEl = document.getElementById('modal-agent-name');
      const agentLabelEl = document.querySelector('.agent-card .agent-label');

      const avatarUrl = prop.agentPhotoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
      if (agentAvatar) agentAvatar.innerHTML = `<img src="${avatarUrl}" alt="Agente" style="border-radius: 50%; object-fit: cover;">`;
      if (agentNameEl) {
        let badgeHtml = '';
        if (prop.publisherType === 'broker') {
          badgeHtml = ` <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: text-bottom; margin-left: 4px;" stroke="none" title="Broker Verificado"><path d="M12 2l2.36 1.48L17 3.03l1.16 2.65L20.88 7l-.6 2.87L22 12l-1.72 2.13.6 2.87-2.72 1.32L17 20.97l-2.64-.45L12 22l-2.36-1.48L7 20.97l-1.16-2.65L3.12 17l.6-2.87L2 12l1.72-2.13-.6-2.87 2.72-1.32L7 3.03l2.64.45L12 2z" fill="#3b82f6" /><path d="M9.5 12l1.83 1.83L15.5 9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        } else if (prop.publisherType === 'premium') {
          badgeHtml = ` <span style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 6px; font-weight:800; vertical-align: middle;">Premium</span>`;
        }
        const currentUser = window.firebaseAuth?.currentUser;
        const currentUserName = (currentUser && prop.agentUid === currentUser.uid)
          ? (window.currentUserProfile?.name || currentUser.displayName || prop.agentName)
          : prop.agentName;
        agentNameEl.innerHTML = `${currentUserName || window.t('modal_verified_owner_name')}${badgeHtml}`;
      }
      if (agentLabelEl) {
         if (prop.publisherType === 'broker') {
            agentLabelEl.innerText = "Broker Verificado";
         } else if (prop.publisherType === 'premium') {
            agentLabelEl.innerText = "Inversor Verificado";
         } else {
            agentLabelEl.innerText = window.t('modal_verified_owner');
         }
      }
    }

    // Price bar analysis
    let avgPrice = 250000;
    if (window.appData && window.appData.properties) {
       const similarProps = window.appData.properties.filter(p => p.type === prop.type && p.op === prop.op && p.price > 0);
       if (similarProps.length > 0) {
          // Remove extreme outliers to get a realistic average
          similarProps.sort((a, b) => a.price - b.price);
          const trimCount = Math.floor(similarProps.length * 0.1);
          const trimmed = similarProps.slice(trimCount, similarProps.length - trimCount);
          const finalProps = trimmed.length > 0 ? trimmed : similarProps;
          avgPrice = finalProps.reduce((sum, p) => sum + p.price, 0) / finalProps.length;
       }
    }
    const pct = Math.min(100, Math.round((prop.price / (avgPrice * 2)) * 100));
    const bar = document.getElementById('modal-price-bar');
    const insight = document.getElementById('modal-price-insight');
    if (bar) setTimeout(() => { bar.style.width = pct + '%'; }, 300);
    if (insight) {
      if (pct < 45) {
        insight.innerHTML = `<span class="tooltip-wrap">${window.t('modal_insight_low')} <span class="tooltip-content">${window.t('underpriced_tooltip')}</span></span>`;
      } else if (pct < 75) {
        insight.innerText = window.t('modal_insight_avg');
      } else {
        const txt = prop.isScraped ? window.t('modal_insight_high_scraped') : window.t('modal_insight_high_native');
        insight.innerHTML = `<span class="tooltip-wrap">${txt} <span class="tooltip-content">${window.t('tooltip_premium_desc')}</span></span>`;
      }
    }

    // Premium price analysis lock/blur
    const priceAnalysisEl = document.querySelector('.price-analysis');
    if (priceAnalysisEl) {
      const existingOverlay = priceAnalysisEl.querySelector('.premium-locked-overlay-inline');
      if (existingOverlay) existingOverlay.remove();
      
      if (!isPremium) {
        priceAnalysisEl.querySelectorAll('.price-bar-wrapper, .price-insight').forEach(el => {
          el.classList.add('premium-blur');
        });
        
        const overlay = document.createElement('div');
        overlay.className = 'premium-locked-overlay-inline';
        overlay.innerHTML = `
          <div style="font-size: 1.8rem; margin-bottom: 4px;"></div>
          <div style="font-weight: 800; color: #FFE07D; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif;">${window.t('modal_price_analysis')}</div>
          <div style="font-size: 0.7rem; color: #cbd5e1; margin-top: 2px;">${window.t('modal_only_investors')}</div>
        `;
        overlay.onclick = (e) => {
          e.stopPropagation();
          window.showPremiumPaywall();
        };
        priceAnalysisEl.appendChild(overlay);
      } else {
        priceAnalysisEl.querySelectorAll('.price-bar-wrapper, .price-insight').forEach(el => {
          el.classList.remove('premium-blur');
        });
      }
    }

    // Setup Favorite button in Modal
    const favBtn = document.getElementById('modal-fav-btn');
    if (favBtn) {
      const isFav = window.appData.favorites.has(prop.id);
      favBtn.className = 'btn-fav-modal' + (isFav ? ' active' : '');
      favBtn.innerHTML = isFav ? window.t('modal_btn_saved') : window.t('modal_btn_save');
      
      favBtn.onclick = (e) => {
        e.stopPropagation();
        window.toggleFav(prop.id, null);
        
        const nowFav = window.appData.favorites.has(prop.id);
        favBtn.className = 'btn-fav-modal' + (nowFav ? ' active' : '');
        favBtn.innerHTML = nowFav ? window.t('modal_btn_saved') : window.t('modal_btn_save');
        
        // Sync any active card on screen
        document.querySelectorAll(`.btn-fav[data-id="${prop.id}"]`).forEach(btn => {
          btn.className = 'btn-fav' + (nowFav ? ' active' : '');
          btn.innerHTML = nowFav ?
        `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" style="color: #ff2a5f; display: inline-block; vertical-align: middle; margin-right: 6px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg><span>${window.t('modal_btn_saved')}</span>` :
        `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text2); display: inline-block; vertical-align: middle; margin-right: 6px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg><span>${window.t('modal_btn_save')}</span>`;
        });
      };
    }

    modalOverlay.classList.remove('hidden');
    // Pequeño delay para la animación
    setTimeout(() => modalOverlay.classList.add('active'), 10);

    // Logic for contact button inside modal
    const contactBtn = document.getElementById('modal-contact-btn');
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    const phoneBtn = document.getElementById('modal-phone-btn');
    const extBtn = document.getElementById('modal-external-link-btn');

    if (isReferenceOnly) {
      // Ocultar Chat Interno para propiedades de referencia (scraped)
      if (contactBtn) contactBtn.style.display = 'none';

      if (prop.isScraped || prop.isExternal) {
        // Mostrar botón de redirección de portal de origen
        let linkBtn = extBtn;
        if (!linkBtn) {
          linkBtn = document.createElement('a');
          linkBtn.id = 'modal-external-link-btn';
          linkBtn.target = '_blank';
          linkBtn.className = 'btn-primary';
          linkBtn.style.cssText = 'display:flex; align-items:center; justify-content:center; gap:8px; width:100%; border-radius:12px; padding:12px; font-weight:700; text-decoration:none; text-align:center; background:var(--accent); color:white; font-size:0.95rem; cursor:pointer;';
          if (contactBtn && contactBtn.parentNode) {
            contactBtn.parentNode.appendChild(linkBtn);
          }
        }
        linkBtn.style.display = 'flex';
        
        let portalName = "Portal Externo";
        if (prop.link && prop.link.includes("infocasas")) {
          portalName = "InfoCasas Paraguay";
        } else if (prop.link && prop.link.includes("clasipar")) {
          portalName = "Clasipar";
        }
        linkBtn.href = prop.link || '#';
        linkBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          ${window.t('modal_btn_view_external', { portal: portalName })}
        `;
      } else {
        if (extBtn) extBtn.style.display = 'none';
      }
    } else {
      // Propiedad normal cargada por usuario en la plataforma (comprable)
      if (extBtn) extBtn.style.display = 'none';

      if (contactBtn) {
        // Mostrar siempre el chat (incluso sin dueño real para demos)
        const hasOwner = true;
        // No mostrar el chat si el usuario ES el dueño de la propiedad
        const isOwnProperty = window.firebaseAuth?.currentUser && prop.agentUid === window.firebaseAuth.currentUser.uid;

        if (isOwnProperty) {
          contactBtn.style.display = 'none';
        } else {
          contactBtn.style.display = 'flex';
          contactBtn.onclick = () => {
            const currentUser = window.firebaseAuth?.currentUser;
            if (!currentUser) {
              showToast(window.t('toast_login_required'), 'warn');
              document.getElementById('login-screen')?.classList.remove('hidden');
              document.getElementById('app-shell')?.classList.add('hidden');
              return;
            }
            
            const buyerId = currentUser.uid;
            const buyerName = currentUser.displayName || currentUser.email.split('@')[0];
            const ownerId = prop.agentUid || 'mock_owner_id';
            const ownerName = prop.agentName || window.t('owner_fallback_name');
            const propertyId = prop.id;
            const propertyTitle = prop.title;
            const propertyImg = prop.img || '';
            const propertyPrice = prop.price || 0;
            
            const propPhone = (prop.phone && prop.phone.trim() && prop.phone !== '+595' && prop.phone !== '+595000000000') ? prop.phone.trim() : null;
            
            window.pendingChatContext = {
              id: propertyId,
              title: propertyTitle,
              img: propertyImg,
              price: propertyPrice,
              phone: propPhone
            };
            
            if (window.getOrCreateChat) {
              window.getOrCreateChat(buyerId, buyerName, ownerId, ownerName, propertyId, propertyTitle, propertyImg, propertyPrice)
                .then((chatId) => {
                  modalOverlay.classList.remove('active');
                  setTimeout(() => {
                    modalOverlay.classList.add('hidden');
                    if (window.appRouter) window.appRouter.navigate('messages');
                    window.openRealChat(chatId, ownerName, true);
                    if (window.innerWidth <= 768) {
                      document.querySelector('.conversations-list')?.classList.add('hidden-mobile');
                      document.getElementById('chat-area')?.classList.add('active-mobile');
                    }
                  }, 300);
                })
                .catch(err => {
                  console.error('Error in getOrCreateChat:', err);
                  showToast(window.t('toast_chat_error') + err.message, 'warn');
                });
            }
          };
        }
      }
    }
    
    // WhatsApp: available if property has a real phone number
    const isOwnProperty = window.firebaseAuth?.currentUser && prop.agentUid === window.firebaseAuth.currentUser.uid;
    
    if (whatsappBtn) {
      let propPhone = (prop.phone && prop.phone.trim() && prop.phone !== '+595' && prop.phone !== '+595000000000') ? prop.phone.trim() : null;
      
      if (!isOwnProperty && propPhone) {
        whatsappBtn.style.display = 'flex';
        const msg = encodeURIComponent(window.t('modal_whatsapp_msg', { title: prop.title, price: window.formatPrice(prop.price) }));
        whatsappBtn.href = `https://wa.me/${propPhone.replace(/\+/g, '').replace(/\s/g, '')}?text=${msg}`;
      } else {
        whatsappBtn.style.display = 'none';
      }
    }
    
    if (phoneBtn) {
      if (!isOwnProperty && prop.phone && prop.phone.trim() && prop.phone !== '+595' && prop.phone !== '+595000000000') {
        phoneBtn.style.display = 'flex';
        phoneBtn.href = `tel:${prop.phone.replace(/\s/g, '')}`;
      } else {
        phoneBtn.style.display = 'none';
      }
    }

    // Exportar Ficha PDF de la propiedad
    let modalPdfBtn = document.getElementById('modal-pdf-export-btn');
    if (!modalPdfBtn) {
      modalPdfBtn = document.createElement('button');
      modalPdfBtn.id = 'modal-pdf-export-btn';
      modalPdfBtn.className = 'btn-secondary';
      modalPdfBtn.style.cssText = 'display:flex; align-items:center; justify-content:center; gap:6px; width:100%; border-radius:12px; padding:10px; font-weight:700; background:var(--surface2); border:1px solid var(--border); color:var(--text); font-size:0.9rem; cursor:pointer; margin-top:8px;';
      if (whatsappBtn && whatsappBtn.parentNode) {
        whatsappBtn.parentNode.appendChild(modalPdfBtn);
      }
    }
    if (modalPdfBtn) {
      modalPdfBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Exportar Ficha PDF`;
      modalPdfBtn.onclick = () => window.print();
    }

    // Mini mapa del modal
    setTimeout(() => {
      if (typeof L === 'undefined') return;
      const pLat = parseFloat(prop.lat);
      const pLng = parseFloat(prop.lng);
      if (!isNaN(pLat) && !isNaN(pLng)) {
        if(!window.modalMapInstance) {
          window.modalMapInstance = L.map('modal-map').setView([pLat, pLng], 15);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(window.modalMapInstance);
          window.modalMapMarker = L.marker([pLat, pLng]).addTo(window.modalMapInstance);
        } else {
          window.modalMapInstance.setView([pLat, pLng], 15);
          window.modalMapMarker.setLatLng([pLat, pLng]);
          window.modalMapInstance.invalidateSize();
        }
      }
    }, 300);
  }
  // Exponer globalmente para que broker-alerts.js y otros módulos puedan abrirlo
  window.openModal = openPropertyModal;
  window.openPropertyModal = openPropertyModal;

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    setTimeout(() => modalOverlay.classList.add('hidden'), 300);
  });

  // Glossary Modal triggers
  const glossaryOverlay = document.getElementById('glossary-modal-overlay');
  const glossaryClose = document.getElementById('glossary-modal-close');
  
  function openGlossaryModal() {
    if (glossaryOverlay) {
      glossaryOverlay.classList.remove('hidden');
      setTimeout(() => glossaryOverlay.classList.add('active'), 10);
    }
  }
  
  // ===== GLOSSARY INFO ICON HANDLER =====
  window.openGlossary = function(section) {
    const overlay = document.getElementById('glossary-modal-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      setTimeout(() => overlay.classList.add('active'), 10);
      if (section === 'roi') {
        setTimeout(() => {
          document.querySelector('[data-i18n="glossary_roi_title"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else if (section === 'underpriced') {
        setTimeout(() => {
          document.querySelector('[data-i18n="glossary_low_value_title"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else if (section === 'radar') {
        setTimeout(() => {
          document.querySelector('[data-i18n="glossary_radar_title"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  };

  // Delegate click on .glossary-info-icon elements (for dynamically created ones)
  document.addEventListener('click', (e) => {
    const icon = e.target.closest('.glossary-info-icon');
    if (icon) {
      e.stopPropagation();
      const section = icon.dataset.glossary || 'roi';
      window.openGlossary(section);
    }
  });

  // ===== HELP TAB PANEL SWITCHER =====
  window.switchHelpTab = function(tabName) {
    // Hide all panels
    document.querySelectorAll('.help-tab-panel').forEach(panel => {
      panel.style.display = 'none';
    });
    
    // Remove active class from buttons
    document.querySelectorAll('#help-tab-btn-glossary, #help-tab-btn-guide').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show active panel
    const activePanel = document.getElementById(`help-content-${tabName}`);
    if (activePanel) {
      activePanel.style.display = 'block';
    }
    
    // Add active class to clicked button
    const activeBtn = document.getElementById(`help-tab-btn-${tabName}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  };

  if (glossaryClose) {
    glossaryClose.addEventListener('click', () => {
      if (glossaryOverlay) {
        glossaryOverlay.classList.remove('active');
        setTimeout(() => glossaryOverlay.classList.add('hidden'), 300);
      }
    });
  }
  
  if (glossaryOverlay) {
    glossaryOverlay.addEventListener('click', (e) => {
      if (e.target === glossaryOverlay) {
        glossaryOverlay.classList.remove('active');
        setTimeout(() => glossaryOverlay.classList.add('hidden'), 300);
      }
    });
  }

  // Event delegation for glossary buttons & hero stat cards
  document.addEventListener('click', (e) => {
    const targetGlossary = e.target.closest('#btn-explore-glossary, #btn-map-glossary');
    if (targetGlossary) {
      e.preventDefault();
      openGlossaryModal();
      return;
    }

    const glossaryIcon = e.target.closest('.glossary-info-icon');
    if (glossaryIcon) {
      e.preventDefault();
      e.stopPropagation();
      const section = glossaryIcon.getAttribute('data-glossary') || 'roi';
      if (window.openGlossary) {
        window.openGlossary(section);
      } else {
        openGlossaryModal();
      }
      return;
    }

    const favCard = e.target.closest('#hero-stat-favs');
    if (favCard) {
      const navFavs = document.getElementById('nav-favorites');
      if (navFavs) navFavs.click();
      return;
    }

    const alertCard = e.target.closest('#hero-stat-alerts');
    if (alertCard) {
      const navAlerts = document.getElementById('nav-alerts');
      if (navAlerts) navAlerts.click();
      return;
    }

    const planCard = e.target.closest('#hero-stat-plan');
    if (planCard) {
      const userBtn = document.getElementById('sidebar-user-btn');
      if (userBtn) userBtn.click();
      return;
    }
  });

  if (window.appData && window.appData.properties) {
    applyExploreFilters();
  }

  // Navegación (Tabs)
  const navLinks = document.querySelectorAll('.sidebar-link');
  const views = document.querySelectorAll('.view');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      if (!targetView) return;
      
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if ((targetView === 'analytics' || targetView === 'broker') && !isPremium) {
        window.showPremiumPaywall();
        return;
      }
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const academyView = document.getElementById('view-academy');
      if (academyView && targetView !== 'academy') {
        academyView.style.display = 'none';
        academyView.classList.remove('active');
      }
      views.forEach(v => {
        if(v.id === `view-${targetView}`) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });

      if (targetView === 'messages') renderMessages();
      if (targetView === 'favorites') renderFavorites();
      if (targetView === 'alerts' && window._renderAlerts) window._renderAlerts();
      if (targetView === 'map') {
        setTimeout(() => {
          if (typeof L === 'undefined') {
            showToast(window.t('toast_offline_map'), 'warn');
            return;
          }
          if (window.initMap) {
            window.initMap();
            // Sincronizar filtros activos y término de búsqueda con el mapa al entrar
            applyExploreFilters();
            if(window.mapInstance) {
              window.mapInstance.invalidateSize();
              // Force update sidebar list after invalidateSize has finished layout on screen
              setTimeout(() => {
                if (window.updateSidebarListFromMapBounds) {
                  window.updateSidebarListFromMapBounds();
                }
              }, 50);
              // Mobile: allow vertical scroll to pass through the Leaflet map
              if (window.innerWidth <= 1024) {
                const leafletContainer = document.querySelector('#map .leaflet-container');
                if (leafletContainer) {
                  leafletContainer.style.touchAction = 'pan-x pinch-zoom';
                }
                // Also fix on the map div itself
                const mapEl = document.getElementById('map');
                if (mapEl) mapEl.style.touchAction = 'pan-x pinch-zoom';
              }
            }
          }
        }, 100);
      }

      if (targetView === 'publish') {
        setTimeout(() => {
          if (typeof L === 'undefined') return;
          if (!window.publishMapInstance) {
            window.publishMapInstance = L.map('publish-map').setView([-25.2867, -57.6191], 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(window.publishMapInstance);
            window._publishMarker = L.marker([-25.2867, -57.6191], { draggable: true }).addTo(window.publishMapInstance);
            // Also allow clicking the map to move the pin
            window.publishMapInstance.on('click', (ev) => {
              window._publishMarker.setLatLng(ev.latlng);
            });
          } else {
            window.publishMapInstance.invalidateSize();
          }
        }, 150);
      }
      // Close sidebar on mobile after clicking a link
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlayBg.classList.add('hidden');
      }
    });
  });

  function renderMapList(props) {
    const list = document.getElementById('map-list');
    if (!list) return;
    list.innerHTML = '';
    
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    props.forEach(prop => {
      const item = document.createElement('div');
      item.className = 'map-list-item';
      item.style = 'display:flex; gap:12px; padding:1rem; border-bottom:1px solid var(--border); cursor:pointer';
      item.onclick = () => {
        const pLat = parseFloat(prop.lat);
        const pLng = parseFloat(prop.lng);
        if(window.mapInstance && !isNaN(pLat) && !isNaN(pLng)) {
           window.mapInstance.setView([pLat, pLng], 15);
        }
        openPropertyModal(prop);
      };
      
      const roiTag = (prop.roi && isPremium) ? 
        `<span style="background:rgba(16,185,129,0.12);color:#10b981;font-size:0.7rem;font-weight:800;padding:2px 6px;border-radius:4px;margin-right:4px;display:inline-flex;align-items:center;gap:3px"> ROI: ${prop.roi}%</span>` : '';
      
      const underpricedTag = (prop.isUnderpriced && isPremium) ? 
        `<span class="tooltip-wrap"><span style="background:rgba(245,158,11,0.12);color:#d97706;font-size:0.7rem;font-weight:800;padding:2px 6px;border-radius:4px;display:inline-flex;align-items:center;gap:3px"> -${prop.discount}%</span><span class="tooltip-content">${window.t('underpriced_tooltip')}</span></span>` : '';
        
      const brokerTag = (prop.publisherType === 'broker' && isPremium) ?
        `<span style="background:linear-gradient(135deg, rgba(255,223,112,0.2) 0%, rgba(212,175,55,0.2) 100%);color:#D4AF37;border:1px solid #D4AF37;font-size:0.7rem;font-weight:800;padding:1px 5px;border-radius:4px;margin-right:4px;display:inline-flex;align-items:center;">Broker PRO</span>` : '';
      
      let sourceBadge = '';
      if (prop.dataSource === 'radar') sourceBadge = `<span class="source-badge algo" style="font-size:0.55rem; padding:1px 4px; margin-right:4px;">Ext.</span>`;
      else if (prop.dataSource === 'official') sourceBadge = `<span class="source-badge verified" style="font-size:0.55rem; padding:1px 4px; margin-right:4px;">Verif.</span>`;
      else if (prop.dataSource === 'estimation') sourceBadge = `<span class="source-badge est" style="font-size:0.55rem; padding:1px 4px; margin-right:4px;">Local</span>`;
      
      const tagsRow = (roiTag || underpricedTag || sourceBadge || brokerTag) ? `<div style="display:flex;margin-top:6px;align-items:center;flex-wrap:wrap;gap:4px;">${sourceBadge}${brokerTag}${roiTag}${underpricedTag}</div>` : '';
      
      item.innerHTML = `
        <img src="${prop.img}" style="width:80px; height:60px; object-fit:cover; border-radius:8px">
        <div style="flex:1; min-width:0">
          <div style="font-weight:800; color:var(--accent)">${window.formatPrice(prop.price)}</div>
          <div style="font-size:0.85rem; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${prop.title}</div>
          <div style="font-size:0.75rem; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis"> ${prop.address}</div>
          ${tagsRow}
        </div>
      `;
      list.appendChild(item);
    });
    if (props.length === 0) {
      list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text2)"><div style="font-size:2rem;margin-bottom:0.5rem"></div><p style="font-weight:600">${window.t('empty_results')}<br>${window.t('empty_results_desc')}</p></div>`;
    }
  }
  window.renderMapList = renderMapList;

  // Mobile Sidebar Toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (sidebar.classList.contains('open')) {
        overlayBg.classList.remove('hidden');
      } else {
        overlayBg.classList.add('hidden');
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlayBg.classList.add('hidden');
    });
  }

  if (overlayBg) {
    overlayBg.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlayBg.classList.add('hidden');
      document.getElementById('notif-panel')?.classList.add('hidden');
      document.getElementById('profile-panel')?.classList.add('hidden');
    });
  }

  // Robust click-outside handler for sidebar
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
      sidebar.classList.remove('open');
      overlayBg?.classList.add('hidden');
    }
  });

  // Notifications
  const notifBtn = document.getElementById('notif-btn');
  const notifPanel = document.getElementById('notif-panel');
  const notifClose = document.getElementById('notif-close');
  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('hidden');
      document.getElementById('profile-panel')?.classList.add('hidden');
      if (!notifPanel.classList.contains('hidden')) renderNotifications();
    });
  }
  if (notifClose) notifClose.addEventListener('click', () => notifPanel.classList.add('hidden'));

  let latestNotifications = [];
  function renderNotifications() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (latestNotifications.length === 0) {
      list.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text2)">${window.t('notif_no_notifications')}</div>`;
      return;
    }

    latestNotifications.forEach(n => {
      const el = document.createElement('div');
      el.className = 'notif-item' + (n.unread ? ' notif-unread' : '');
      el.style.cursor = 'pointer';
      const translatedText = window.translateNotificationText ? window.translateNotificationText(n.text) : n.text;
      const translatedTime = window.translateNotificationTime ? window.translateNotificationTime(n.time) : n.time;
      el.innerHTML = `<div class="notif-icon">${n.icon}</div><div class="notif-content"><div class="notif-text">${translatedText}</div><div class="notif-time">${translatedTime}</div></div>`;
      
      el.onclick = () => {
        if (n.unread && window.markNotificationRead) {
          window.markNotificationRead(n.id);
        }
      };
      
      list.appendChild(el);
    });
  }

  window.updateNotificationsUI = function(notifs) {
    latestNotifications = notifs;
    window._latestNotifications = notifs; // Expuesto para re-render al cambiar idioma
    renderNotifications();
    
    const unreadCount = notifs.filter(n => n.unread).length;
    const dot = document.querySelector('.notif-dot');
    if (dot) {
      dot.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  };

  // Profile Panel
  const profileClose = document.getElementById('profile-close');
  const sidebarUserBtn = document.getElementById('sidebar-user-btn');
  const profilePanel = document.getElementById('profile-panel');
  if (sidebarUserBtn && profilePanel) {
    sidebarUserBtn.addEventListener('click', () => {
      profilePanel.classList.toggle('hidden');
      overlayBg.classList.toggle('hidden', profilePanel.classList.contains('hidden'));
    });
  }
  if (profileClose) profileClose.addEventListener('click', () => {
    profilePanel.classList.add('hidden');
    overlayBg.classList.add('hidden');
  });

  // Bottom Nav Mobile
  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (!view) return;
      document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`nav-${view}`)?.click();
    });
  });

  // Sync bottom nav with sidebar nav
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const view = link.getAttribute('data-view');
      document.querySelectorAll('.bottom-nav-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-view') === view);
      });
    });
  });

  let activeChatUnsubscribe = null;
  let activeChatId = null;

  function renderMessages() {
    const list = document.getElementById('conv-list');
    if (!list) return;
    
    const currentUser = window.firebaseAuth?.currentUser;
    if (!currentUser) {
      list.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:3rem 1.5rem;text-align:center;color:var(--text2);">
          <div style="background:var(--surface2);width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;box-shadow:var(--shadow-sm);">
            <svg viewBox="0 0 24 24" style="width:32px;height:32px;stroke:var(--text2);stroke-width:1.5;fill:none;">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <h4 style="color:var(--text);font-family:'Plus Jakarta Sans', sans-serif;font-weight:800;font-size:1.1rem;margin-bottom:0.5rem;" data-i18n="auth_required_title">Iniciá sesión</h4>
          <p style="font-size:0.85rem;line-height:1.4;" data-i18n="auth_required_chat_desc">Debes iniciar sesión para ver y responder tus mensajes.</p>
        </div>`;
      const area = document.getElementById('chat-area');
      if (area) {
        area.innerHTML = `
          <div class="chat-placeholder" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--text2);padding:2rem;">
            <div style="background:var(--surface2);width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;box-shadow:var(--shadow-sm);">
              <svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:var(--accent);stroke-width:1.5;fill:none;">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 style="color:var(--text);font-family:'Plus Jakarta Sans', sans-serif;font-weight:800;font-size:1.4rem;margin-bottom:0.5rem;" data-i18n="auth_required_chat_title">Iniciá sesión para chatear</h3>
            <p style="font-size:1rem;max-width:300px;line-height:1.5;" data-i18n="auth_required_chat_sub">Ingresá a tu cuenta para contactar vendedores o revisar tus consultas.</p>
          </div>`;
      }
      return;
    }
    
    if (window._userChatsCache) {
      window.renderUserConversationsList(window._userChatsCache);
    } else {
      window.renderUserConversationsList([]);
    }
  }
  window.renderMessages = renderMessages;

  window.renderUserConversationsList = function(chats) {
    window._userChatsCache = chats || [];
    const list = document.getElementById('conv-list');
    if (!list) return;
    list.innerHTML = '';
    
    const currentUser = window.firebaseAuth?.currentUser;
    if (!currentUser) return;
    
    if (!chats || chats.length === 0) {
      list.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:3rem 1.5rem;text-align:center;color:var(--text2);">
          <div style="background:linear-gradient(135deg, rgba(255,42,95,0.12), rgba(255,107,53,0.12));width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.2rem;box-shadow:var(--shadow-sm);">
            <svg viewBox="0 0 24 24" style="width:36px;height:36px;stroke:#ff2a5f;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round;">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="9" y1="9" x2="15" y2="9"/>
              <line x1="9" y1="13" x2="13" y2="13"/>
            </svg>
          </div>
          <h4 style="color:var(--text);font-family:'Plus Jakarta Sans', sans-serif;font-weight:800;font-size:1.15rem;margin-bottom:0.4rem;" data-i18n="chat_no_chats_title">Aún no tenés mensajes</h4>
          <p style="font-size:0.88rem;max-width:280px;line-height:1.45;color:var(--text2);margin-bottom:1.2rem;" data-i18n="chat_no_chats_desc">Explorá las propiedades y contactá directamente a los propietarios o brokers para consultar sobre inmuebles.</p>
          <button class="btn-primary" onclick="if(window.appRouter) window.appRouter.navigate('explore')" style="padding:10px 20px;border-radius:12px;font-size:0.88rem;font-weight:700;" data-i18n="explore_properties_btn">Explorar Propiedades</button>
        </div>`;
        
      const area = document.getElementById('chat-area');
      if (area) {
        area.innerHTML = `
          <div class="chat-placeholder" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--text2);padding:2rem;">
            <div style="background:linear-gradient(135deg, rgba(255,42,95,0.12), rgba(255,107,53,0.12));width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;box-shadow:var(--shadow-sm);">
              <svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:#ff2a5f;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round;">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <h3 style="color:var(--text);font-family:'Plus Jakarta Sans', sans-serif;font-weight:800;font-size:1.4rem;margin-bottom:0.5rem;" data-i18n="chat_area_empty_title">Centro de Mensajes Directos</h3>
            <p style="font-size:1rem;max-width:320px;line-height:1.5;color:var(--text2);" data-i18n="chat_area_empty_desc">Tus consultas y chats con dueños directos o brokers se mostrarán aquí en tiempo real con cifrado seguro.</p>
          </div>`;
      }
      return;
    }
    
    chats.forEach(chat => {
      const isOtherOwner = currentUser.uid === chat.buyerId;
      const otherName = isOtherOwner ? chat.ownerName : chat.buyerName;
      const otherType = isOtherOwner ? chat.ownerType : chat.buyerType;
      const isUnread = isOtherOwner ? chat.unreadBuyer : chat.unreadOwner;
      const lastMsg = chat.lastMsg || window.t('chat_no_messages');
      
      const brokerBadgeSvg = (otherType === 'broker') ? `
            <svg width="14" height="14" viewBox="0 0 24 24" style="vertical-align: text-bottom; margin-left: 2px;" title="Broker Premium">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#goldGF)"/>
              <text x="12" y="16" font-family="sans-serif" font-weight="900" font-size="9" fill="#fff" text-anchor="middle">GF</text>
            </svg>` : '';

      const premiumBadgeSvg = (otherType === 'premium') ? `
            <svg width="14" height="14" viewBox="0 0 24 24" style="vertical-align: text-bottom; margin-left: 2px;" title="Inversor Premium">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b"/>
            </svg>` : '';
      
      const div = document.createElement('div');
      div.className = 'conv-item' + (activeChatId === chat.id ? ' active' : '');
      div.dataset.id = chat.id;
      div.innerHTML = `
        <div class="conv-avatar">${otherName.charAt(0)}</div>
        <div class="conv-info">
          <div class="conv-name">
            ${otherName} 
            ${brokerBadgeSvg}
            ${premiumBadgeSvg}
            ${isUnread ? '<span style="color:#ff2a5f; font-size:24px; line-height:0">.</span>' : ''}
          </div>
          <div class="conv-preview">${lastMsg}</div>
        </div>
      `;
      div.onclick = () => {
        document.querySelectorAll('.conv-item').forEach(i => i.classList.remove('active'));
        div.classList.add('active');
        window.openRealChat(chat.id, otherName, false);
        if (window.innerWidth <= 768) {
          document.querySelector('.conversations-list').classList.add('hidden-mobile');
          document.getElementById('chat-area').classList.add('active-mobile');
        }
      };
      list.appendChild(div);
    });
    
    const unreadCount = chats.filter(chat => {
      return currentUser.uid === chat.buyerId ? chat.unreadBuyer : chat.unreadOwner;
    }).length;
    
    const msgBadge = document.getElementById('msg-badge');
    const msgBadgeMobile = document.getElementById('msg-badge-mobile');
    
    if (msgBadge) {
      msgBadge.textContent = unreadCount;
      msgBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
    
    if (msgBadgeMobile) {
      msgBadgeMobile.textContent = unreadCount;
      msgBadgeMobile.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
  };

  window.openRealChat = function(chatId, otherName, startEmpty = false) {
    activeChatId = chatId;
    
    const area = document.getElementById('chat-area');
    if (!area) return;
    
    area.innerHTML = `
      <div class="conv-header" style="display:flex; align-items:center; gap:15px; border-bottom:1px solid var(--border); padding: calc(1.5rem + env(safe-area-inset-top, 20px)) 1.5rem 1.5rem 1.5rem; background: var(--surface)">
         <button id="chat-back" class="menu-toggle" style="display:none; border:none; background:none; padding:0; width:auto; height:auto; margin-right:5px; cursor:pointer">
            <svg viewBox="0 0 24 24" style="width:28px; height:28px; stroke:var(--text); stroke-width:2; fill:none"><polyline points="15 18 9 12 15 6"/></svg>
         </button>
         <div class="conv-avatar" style="width:40px;height:40px;font-size:1rem;background:var(--accent-gradient);color:white;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;flex-shrink:0">${otherName.charAt(0)}</div>
         <div style="flex:1; overflow:hidden;">
            <h3 style="margin:0; font-size:1.05rem; font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${otherName}</h3>
            <span style="font-size:0.75rem; color:#10b981; font-weight:700">● ${window.t('chat_owner_online')}</span>
         </div>
      </div>
      <div class="chat-messages-container" style="flex:1; padding:2rem; overflow-y:auto; display:flex; flex-direction:column; gap:1rem; background: var(--bg)">
         <div class="chat-loading" style="text-align:center; padding:2rem; color:var(--text2)">${window.t('chat_loading_messages')}</div>
      </div>
      <div style="padding: 1.2rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom, 20px)) 1.2rem; border-top:1px solid var(--border); background: var(--surface); display:flex; gap:10px; align-items:center">
         <input type="text" placeholder="${window.t('chat_input_placeholder')}" style="flex:1; padding:14px 22px; border-radius:100px; border:2px solid var(--border); outline:none; background:var(--surface2); color:var(--text); font-family:inherit; font-weight:600; font-size:0.95rem; transition: border-color 0.2s">
         <button class="btn-primary btn-send-message" style="flex-shrink:0; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--accent-gradient); border:none; cursor:pointer; box-shadow:var(--shadow-accent); transition: transform 0.2s; padding:0;">
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke:white; stroke-width:2.5; fill:none; transform: translateX(-1px) translateY(1px);"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
         </button>
      </div>
    `;

    const input = area.querySelector('input');
    const sendBtn = area.querySelector('.btn-send-message');
    const messagesContainer = area.querySelector('.chat-messages-container');
    const currentUser = window.firebaseAuth?.currentUser;
    
    if (currentUser && window.firebaseDb) {
      window.firebaseDb.collection('chats').doc(chatId).get().then(snap => {
        if (snap.exists) {
          const data = snap.data();
          if (currentUser.uid === data.buyerId && data.unreadBuyer) {
            window.firebaseDb.collection('chats').doc(chatId).update({ unreadBuyer: false });
          } else if (currentUser.uid === data.ownerId && data.unreadOwner) {
            window.firebaseDb.collection('chats').doc(chatId).update({ unreadOwner: false });
          }
        }
      });
    }

    // Chart 3: EMBI / Riesgo País
    const ctxEmbi = document.getElementById('macro-chart-embi');
    if (ctxEmbi) {
      if (macroEmbiChartInstance) { macroEmbiChartInstance.destroy(); macroEmbiChartInstance = null; }
      macroEmbiChartInstance = new window.Chart(ctxEmbi, {
        type: 'bar',
        data: {
          labels: ['Uruguay', 'Chile', 'Paraguay', 'Brasil', 'Colombia', 'Argentina'],
          datasets: [{
            label: 'Riesgo País (puntos)',
            data: [90, 120, 150, 200, 300, 1200],
            backgroundColor: [
              'rgba(148, 163, 184, 0.3)',
              'rgba(148, 163, 184, 0.3)',
              'rgba(59, 130, 246, 0.85)', /* Highlight Paraguay in Blue */
              'rgba(148, 163, 184, 0.3)',
              'rgba(148, 163, 184, 0.3)',
              'rgba(244, 63, 94, 0.3)'
            ],
            borderColor: [
              'rgba(148, 163, 184, 0)',
              'rgba(148, 163, 184, 0)',
              '#3b82f6',
              'rgba(148, 163, 184, 0)',
              'rgba(148, 163, 184, 0)',
              'rgba(244, 63, 94, 0)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { size: 13, family: 'Inter' },
              bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
              padding: 12,
              cornerRadius: 12,
              callbacks: { label: ctx => ' ' + ctx.parsed.x + ' pts' } 
            }
          },
          scales: { 
            x: { 
              beginAtZero: true, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false, borderDash: [5, 5] }, 
              ticks: { padding: 5, font: { family: 'Inter', weight: '600' }, color: '#64748b' } 
            },
            y: { 
              grid: { display: false, drawTicks: true }, 
              ticks: { font: { family: 'Inter', weight: '600', size: 11 }, color: '#64748b' } 
            } 
          }
        }
      });
    }

    if (window.subscribeMessages) {
      window.subscribeMessages(chatId, (messages) => {
        if (messages.length === 0) {
          messagesContainer.innerHTML = `
            <div class="empty-chat-placeholder" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--text2); text-align:center; padding:2rem; animation: slideUpFadeMsg 0.4s forwards">

              <h4 style="margin:0 0 8px; color:var(--text); font-weight:800; font-family:'Plus Jakarta Sans',sans-serif; font-size:1.1rem">${window.t('chat_empty_title') || 'Conversación'}</h4>
              <p style="margin:0; font-size:0.88rem; max-width:260px; line-height:1.5; font-weight:500">${window.t('chat_empty_desc', { owner: otherName }) || `Aún no le escribiste nada a <strong>${otherName}</strong>. ¡Enviá el primer mensaje abajo!`}</p>
            </div>
          `;
          return;
        }

        const emptyState = messagesContainer.querySelector('.empty-chat-placeholder');
        if (emptyState) emptyState.remove();

        const fragment = document.createDocumentFragment();
        let appended = false;

        messages.forEach(msg => {
          if (messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`)) return;
          
          appended = true;
          const isOwn = msg.senderId === currentUser.uid;
          const msgDiv = document.createElement('div');
          msgDiv.dataset.msgId = msg.id;
          
          if (isOwn) {
            msgDiv.style.cssText = 'align-self:flex-end; background:var(--accent-gradient); color:white; padding:12px 18px; border-radius:16px 16px 0 16px; box-shadow:var(--shadow-accent); max-width:80%; font-weight:600; font-size:0.95rem; animation: slideUpFadeMsg 0.25s forwards;';
          } else {
            msgDiv.style.cssText = 'align-self:flex-start; background:var(--surface); border:1px solid var(--border); padding:12px 18px; border-radius:0 16px 16px 16px; box-shadow:var(--shadow-sm); max-width:80%; color:var(--text); font-weight:600; font-size:0.95rem; animation: slideUpFadeMsg 0.25s forwards;';
          }
          
          msgDiv.style.display = 'flex';
          msgDiv.style.flexDirection = 'column';
          msgDiv.style.gap = '8px';
          
          if (msg.context) {
            const ctxDiv = document.createElement('div');
            ctxDiv.style.cssText = `
              display: flex; gap: 10px; padding: 10px; 
              background: rgba(255, 255, 255, 0.15); 
              border-radius: 12px; cursor: pointer;
              color: inherit; align-items: center; text-decoration: none;
            `;
            if (!isOwn) {
              ctxDiv.style.background = 'var(--surface2)';
            }
            
            ctxDiv.onclick = async () => {
              if (window.openPropertyModal) {
                let propToOpen = window.appData?.properties?.find(p => p.id === msg.context.id);
                if (!propToOpen) {
                   try {
                     const doc = await window.firebaseDb.collection('properties').doc(msg.context.id.toString()).get();
                     if (doc.exists) {
                       propToOpen = { id: doc.id, ...doc.data() };
                     } else {
                       throw new Error('Property not found');
                     }
                   } catch (err) {
                     console.error('Error fetching property context:', err);
                     if (window.showToast) window.showToast('Propiedad no disponible o eliminada', 'warn');
                     return;
                   }
                }
                window.openPropertyModal(propToOpen);
              }
            };
            
            const wpBtnHTML = msg.context.phone ? `
              <a href="https://wa.me/${msg.context.phone.replace(/\\+/g, '').replace(/\\s/g, '')}?text=${encodeURIComponent('Hola, te escribo por la propiedad: ' + msg.context.title)}" 
                 target="_blank" 
                 style="display:flex; align-items:center; justify-content:center; background:#25D366; width:36px; height:36px; border-radius:50%; flex-shrink:0; margin-left:auto;"
                 onclick="event.stopPropagation();">
                <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:white;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            ` : '';
            
            ctxDiv.innerHTML = `
              <img src="${msg.context.img || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80'}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; flex-shrink:0;">
              <div style="display:flex; flex-direction:column; overflow:hidden;">
                <span style="font-size:0.85rem; font-weight:700; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${msg.context.title || 'Propiedad'}</span>
                <span style="font-size:0.8rem; opacity:0.8;">US$ ${Number(msg.context.price).toLocaleString()}</span>
              </div>
              ${wpBtnHTML}
            `;
            msgDiv.appendChild(ctxDiv);
          }
          
          const textSpan = document.createElement('span');
          textSpan.style.wordBreak = 'break-word';
          textSpan.textContent = msg.text;
          msgDiv.appendChild(textSpan);
          
          fragment.appendChild(msgDiv);
        });
        
        if (appended) {
          messagesContainer.appendChild(fragment);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
    }

    setTimeout(() => input?.focus(), 400);

    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;
      if (!currentUser) {
        if (window.showToast) window.showToast('No se detecta sesión', 'error');
        return;
      }
      
      if (window.sendChatMessage) {
        // Optimistic UI: clear input instantly
        input.value = '';
        input.style.height = 'auto'; // in case it's a textarea

        const context = window.pendingChatContext || null;
        window.pendingChatContext = null;

        window.sendChatMessage(chatId, currentUser.uid, text, context)
          .catch(err => {
            console.error('Error enviando mensaje:', err);
            input.value = text; // Restore if failed
            const errMsg = err.message || 'Error desconocido';
            if (window.showToast) window.showToast(`Error al enviar: ${errMsg}`, 'warn');
          });
      }
    };

    sendBtn.onclick = sendMessage;
    input.onkeydown = (e) => {
      if (e.key === 'Enter') sendMessage();
    };

    input.onfocus = () => { input.style.borderColor = 'var(--accent)'; };
    input.onblur = () => { input.style.borderColor = 'var(--border)'; };

    const backBtn = document.getElementById('chat-back');
    if (window.innerWidth <= 768) {
      backBtn.style.display = 'block';
      const bNav = document.getElementById('bottom-nav');
      const topbar = document.querySelector('.topbar');
      if (bNav) bNav.style.display = 'none'; // hide it on open
      if (topbar) topbar.style.display = 'none'; // hide topbar on open
      
      backBtn.onclick = () => {
        document.querySelector('.conversations-list').classList.remove('hidden-mobile');
        area.classList.remove('active-mobile');
        if (bNav) bNav.style.display = ''; // restore on back
        if (topbar) topbar.style.display = ''; // restore on back
      };
    }
  }

  // Image Upload Logic
  const uploadZone = document.getElementById('image-upload-zone');
  const fileInput = document.getElementById('prop-image-input');
  const preview = document.getElementById('image-preview');

  if (uploadZone && fileInput) {
    uploadZone.onclick = () => fileInput.click();
    
    fileInput.onchange = async (e) => {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            if (img.width < 600 || img.height < 600) {
              showToast('La imagen es de baja resolución (borrosa). Sube una foto de al menos 600x600 píxeles.', 'warn');
              return;
            }
            
            // Resize and compress
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 1920;
            
            if (width > height && width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Export to webp with 0.85 quality
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            
            // Preview
            const previewImg = document.createElement('img');
            previewImg.src = dataUrl;
            preview.appendChild(previewImg);
            
            // Store compressed dataUrl back to a hidden input or array if needed
            // The original logic just appended preview images and read them later.
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
      fileInput.value = '';
    };
  }

  document.addEventListener('geohogar:auth:loggedin', (e) => {
    const user = e.detail.user;
    const nameEl = document.getElementById('welcome-user-name');
    if (nameEl) {
      nameEl.textContent = user.displayName || user.email.split('@')[0];
    }
  });

  // ===== PREMIUM STATE & PAYWALL HANDLERS =====
  window.showPremiumPaywall = function() {
    const paywallOverlay = document.getElementById('premium-paywall-modal-overlay');
    if (paywallOverlay) {
      paywallOverlay.classList.remove('hidden');
      setTimeout(() => paywallOverlay.classList.add('active'), 10);
    }
  };

  const btnAnalyticsUpgrade = document.getElementById('btn-analytics-upgrade');
  if (btnAnalyticsUpgrade) {
    btnAnalyticsUpgrade.onclick = (e) => {
      e.preventDefault();
      window.showPremiumPaywall();
    };
  }

  const paywallClose = document.getElementById('premium-paywall-close');
  if (paywallClose) {
    paywallClose.onclick = () => {
      const paywallOverlay = document.getElementById('premium-paywall-modal-overlay');
      if (paywallOverlay) {
        paywallOverlay.classList.remove('active');
        setTimeout(() => paywallOverlay.classList.add('hidden'), 300);
      }
    };
  }

  const btnSimulatePro = document.getElementById('btn-simulate-pro');
  if (btnSimulatePro) {
    btnSimulatePro.onclick = () => {
      btnSimulatePro.textContent = 'Procesando...';
      btnSimulatePro.disabled = true;
      sessionStorage.setItem('demo_premium_status', 'premium');
      showToast('¡Cuenta PRO activada! Recargando...', 'success');
      setTimeout(() => window.location.reload(), 500);
    };
  }

    const btnSimulateFree = document.getElementById('btn-simulate-free');
    if (btnSimulateFree) {
      btnSimulateFree.onclick = () => {
        btnSimulateFree.textContent = 'Procesando...';
        btnSimulateFree.disabled = true;
        sessionStorage.removeItem('demo_premium_status');
        showToast('Cuenta reseteada a Gratis. Recargando...', 'success');
        setTimeout(() => window.location.reload(), 500);
      };
    }

  window.updatePremiumUIState = function() {
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    
    // Update profile card details from currentUserProfile (for local/offline sync)
    if (window.currentUserProfile) {
      const name = window.currentUserProfile.name || window.t('user_fallback_name');
      const email = window.currentUserProfile.email || '';
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      
      const pAvatar = document.querySelector('.profile-avatar-lg');
      const pName = document.querySelector('.profile-header h3');
      const pEmail = document.querySelector('.profile-header p');
      
      if (pAvatar && !pAvatar.querySelector('img')) pAvatar.textContent = initials;
      if (pName) {
        pName.textContent = name;
      }
      if (pEmail) pEmail.textContent = email;
      
      // Update sidebar details too
      const sName = document.querySelector('.sidebar-user .user-name');
      const sAvatar = document.querySelector('.sidebar-user .user-avatar');
      if (sName) {
        if (window.currentUserProfile?.userType === 'broker') {
          sName.innerHTML = `${name.split(' ')[0]} <span class="badge-broker-pro" style="padding: 1px 5px; border-radius: 4px; font-size: 0.75rem; font-weight:900; margin-left: 4px;" title="Broker Inmobiliario">GF</span>`;
        } else if (window.currentUserProfile?.userType === 'premium') {
          sName.innerHTML = `${name.split(' ')[0]} <span style="color:#D4AF37; font-weight:bold" title="Inversor Premium"></span>`;
        } else {
          sName.textContent = name.split(' ')[0];
        }
      }
      if (sAvatar && !sAvatar.querySelector('img')) sAvatar.textContent = initials;
    }

    const badgeMembership = document.getElementById('profile-membership-badge');
    const btnSimulateFree = document.getElementById('btn-simulate-free');
    const btnSimulatePro = document.getElementById('btn-simulate-pro');
    
    if (isPremium) {
      if (btnSimulateFree) btnSimulateFree.style.display = 'flex';
      if (btnSimulatePro) btnSimulatePro.style.display = 'none';
      const type = window.currentUserProfile?.userType;
      if (badgeMembership) {
        if (type === 'broker') {
          badgeMembership.textContent = 'GF';
          badgeMembership.className = 'badge-broker-pro';
          badgeMembership.style.background = '';
          badgeMembership.style.color = '';
        } else {
          badgeMembership.textContent = 'Premium ';
          badgeMembership.className = '';
          badgeMembership.style.background = 'linear-gradient(135deg, #FFE07D, #D4AF37)';
          badgeMembership.style.color = '#0f172a';
        }
      }
    } else {
      if (btnSimulateFree) btnSimulateFree.style.display = 'none';
      if (btnSimulatePro) btnSimulatePro.style.display = 'block';
      if (badgeMembership) {
        badgeMembership.textContent = 'Estándar';
        badgeMembership.className = '';
        badgeMembership.style.background = 'var(--border)';
        badgeMembership.style.color = 'var(--text)';
      }
    }

    const userNameEl = document.querySelector('.sidebar-user .user-name');
    if (userNameEl && !window.currentUserProfile) {
      const rawName = userNameEl.textContent.replace(' ', '');
      if (isPremium) {
        userNameEl.innerHTML = `${rawName} <span style="color:#D4AF37; font-weight:bold" title="Inversor Premium"></span>`;
      } else {
        userNameEl.textContent = rawName;
      }
    }
    
    const analyticsOverlay = document.getElementById('analytics-paywall-overlay');
    if (analyticsOverlay) {
      if (isPremium) {
        analyticsOverlay.classList.add('hidden');
      } else {
        analyticsOverlay.classList.remove('hidden');
      }
    }

    if (!isPremium) {
      document.getElementById('explore-roi-btn')?.classList.remove('active');
      document.getElementById('explore-market-value-btn')?.classList.remove('active');
      document.getElementById('filter-roi-btn')?.classList.remove('active');
      document.getElementById('filter-market-value-btn')?.classList.remove('active');
    }

    if (window.updateTrialBadges) window.updateTrialBadges();
    applyExploreFilters();

    const heroPlan = document.getElementById('hero-plan-status');
    if (heroPlan) {
      heroPlan.textContent = isPremium ? 'Premium' : 'Estándar';
      heroPlan.style.color = '';
      
      const badgeParent = heroPlan.closest('.premium-inline-badge');
      if (badgeParent) {
        if (isPremium) {
          badgeParent.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
          badgeParent.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
        } else {
          badgeParent.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
          badgeParent.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';
        }
      }
    }

    if (window.mapInstance && window.filterMapMarkers) {
      window.filterMapMarkers(window._currentMapCriteria || {});
    }
  };

  // ===== SAFE STORAGE WRAPPER FOR PRIVATE BROWSING =====
  const safeStorage = {
    _fallback: {},
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("localStorage.getItem failed, using fallback:", e);
        return this._fallback[key] || null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn("localStorage.setItem failed, using fallback:", e);
        this._fallback[key] = value;
      }
    },
    removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn("localStorage.removeItem failed, using fallback:", e);
        delete this._fallback[key];
      }
    }
  };

  // ===== PREMIUM ACCESS CONTROLLER =====
  window.checkPremiumAccess = function(actionType = 'view') {
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    if (isPremium) return true;
    
    // Strict paywall - no trials
    window.showPremiumPaywall();
    return false;
  };

  window.updateTrialBadges = function() {
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    
    // Update Explore feed toggle badge
    const exploreScrapedBtn = document.getElementById('feed-toggle-scraped');
    if (exploreScrapedBtn) {
      const badge = exploreScrapedBtn.querySelector('.pro-tag');
      if (badge) {
        badge.textContent = 'PRO';
        badge.className = 'pro-tag';
      }
    }
    
    // Update Map feed toggle badge
    const mapScrapedBtn = document.getElementById('map-toggle-scraped');
    if (mapScrapedBtn) {
      const badge = mapScrapedBtn.querySelector('.pro-tag');
      if (badge) {
        badge.textContent = 'PRO';
        badge.className = 'pro-tag';
      }
    }
  };

  // Bind Explore Feed Toggle buttons
  const toggleOrganic = document.getElementById('feed-toggle-organic');
  const toggleScraped = document.getElementById('feed-toggle-scraped');

  window.currentFeedSource = 'organic';

  if (toggleOrganic && toggleScraped) {
    toggleOrganic.addEventListener('click', () => {
      window.currentFeedSource = 'organic';
      toggleOrganic.classList.add('active');
      toggleScraped.classList.remove('active');
      
      // Update map toggle too
      const mapToggleOrg = document.getElementById('map-toggle-organic');
      const mapToggleScr = document.getElementById('map-toggle-scraped');
      if (mapToggleOrg && mapToggleScr) {
        mapToggleOrg.classList.add('active');
        mapToggleScr.classList.remove('active');
      }

      applyExploreFilters();
      if (window.filterMapMarkers) window.filterMapMarkers(window._currentMapCriteria || {});
    });

    toggleScraped.addEventListener('click', (e) => {
      e.preventDefault();
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        if (window.showPremiumPaywall) window.showPremiumPaywall();
        return; // Block and show paywall
      }
      window.currentFeedSource = 'scraped';
      
      // Disclaimer de Inversión
      if (!safeStorage.getItem('geohogar_disclaimer_accepted')) {
        showLegalDisclaimerModal(() => {
          safeStorage.setItem('geohogar_disclaimer_accepted', 'true');
        });
      }

      toggleOrganic.classList.remove('active');
      toggleScraped.classList.add('active');
      
      // Update map toggle too
      const mapToggleOrg = document.getElementById('map-toggle-organic');
      const mapToggleScr = document.getElementById('map-toggle-scraped');
      if (mapToggleOrg && mapToggleScr) {
        mapToggleOrg.classList.remove('active');
        mapToggleScr.classList.add('active');
      }

      applyExploreFilters();
      if (window.filterMapMarkers) window.filterMapMarkers(window._currentMapCriteria || {});
    });
  }

  // Bind Map Sidebar Toggle buttons
  const mapToggleOrg = document.getElementById('map-toggle-organic');
  const mapToggleScr = document.getElementById('map-toggle-scraped');
  if (mapToggleOrg && mapToggleScr) {
    mapToggleOrg.addEventListener('click', () => {
      window.currentFeedSource = 'organic';
      mapToggleOrg.classList.add('active');
      mapToggleScr.classList.remove('active');

      const toggleOrg = document.getElementById('feed-toggle-organic');
      const toggleScr = document.getElementById('feed-toggle-scraped');
      if (toggleOrg && toggleScr) {
        toggleOrg.classList.add('active');
        toggleScr.classList.remove('active');
      }

      applyExploreFilters();
      if (window.filterMapMarkers) {
        window.filterMapMarkers(window._currentMapCriteria || {});
      }
    });

    mapToggleScr.addEventListener('click', (e) => {
      e.preventDefault();
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        if (window.showPremiumPaywall) {
          window.showPremiumPaywall();
        } else {
          showToast('Hazte PRO para acceder a esta función exclusiva del Radar.', 'error');
        }
        return; // Block and show paywall
      }
      
      window.currentFeedSource = 'scraped';
      
      // Disclaimer de Inversión
      if (!safeStorage.getItem('geohogar_disclaimer_accepted')) {
        showLegalDisclaimerModal(() => {
          safeStorage.setItem('geohogar_disclaimer_accepted', 'true');
        });
      }

      mapToggleOrg.classList.remove('active');
      mapToggleScr.classList.add('active');

      const toggleOrg = document.getElementById('feed-toggle-organic');
      const toggleScr = document.getElementById('feed-toggle-scraped');
      if (toggleOrg && toggleScr) {
        toggleOrg.classList.remove('active');
        toggleScr.classList.add('active');
      }

      applyExploreFilters();
      if (window.filterMapMarkers) {
        window.filterMapMarkers(window._currentMapCriteria || {});
      }
    });
  }

  // ===== INTERACTIVE ANALYTICS & MOBILE NAVIGATION =====

  // 1. Mobile profile button handler (opens profile panel Directly & closes sidebar)
  const mobileProfileBtn = document.getElementById('mobile-profile-btn');
  if (mobileProfileBtn && profilePanel) {
    mobileProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      profilePanel.classList.toggle('hidden');
      const isHidden = profilePanel.classList.contains('hidden');
      overlayBg.classList.toggle('hidden', isHidden);
      
      // Close sidebar if open on mobile
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.add('hidden-mobile');
    });
  }

  // 2. Validador Inteligente de Inversión (ROI Calculator)
  // Seed with baseline values; will be overridden by buildDynamicZoneStats() once properties load.
  const zoneStatsSeed = {
    "Villa Morra":    { avgPriceM2: 1650, rentM2: 9.5 },
    "Carmelitas":     { avgPriceM2: 1580, rentM2: 9.0 },
    "Las Mercedes":   { avgPriceM2: 1400, rentM2: 8.2 },
    "Ycuá Satí":      { avgPriceM2: 1520, rentM2: 8.8 },
    "Luque":          { avgPriceM2: 1100, rentM2: 7.2 },
    "Lambaré":        { avgPriceM2: 1050, rentM2: 6.8 },
    "Centro":         { avgPriceM2: 1150, rentM2: 7.0 },
    "Ñemby":          { avgPriceM2:  740, rentM2: 5.5 },
    "Capiatá":        { avgPriceM2:  580, rentM2: 4.8 },
    "San Lorenzo":    { avgPriceM2:  650, rentM2: 5.2 },
    "Villa Elisa":    { avgPriceM2:  510, rentM2: 4.5 },
    "Limpio":         { avgPriceM2:  545, rentM2: 4.6 },
    "Mariano Roque Alonso": { avgPriceM2: 780, rentM2: 5.8 },
    "Fernando de la Mora":  { avgPriceM2: 820, rentM2: 6.0 }
  };
  // If buildDynamicZoneStats is already available (e.g. after properties loaded), use live data;
  // otherwise keep the seed values for the calculator to use immediately.
  if (!window.zoneStats || Object.keys(window.zoneStats).length === 0) {
    window.zoneStats = zoneStatsSeed;
  }

  function updateCalculator() {
    const zone = document.getElementById('calc-zone')?.value || 'Villa Morra';
    const price = parseFloat(document.getElementById('calc-price')?.value) || 0;
    const m2 = parseFloat(document.getElementById('calc-m2')?.value) || 0;
    
    const m2PriceEl = document.getElementById('calc-res-m2price');
    const deviationEl = document.getElementById('calc-res-deviation');
    const roiEl = document.getElementById('calc-res-roi');
    const verdictEl = document.getElementById('calc-res-verdict');
    
    if (price <= 0 || m2 <= 0) {
      if (m2PriceEl) m2PriceEl.textContent = 'USD -';
      if (deviationEl) deviationEl.textContent = '-';
      if (roiEl) roiEl.textContent = '-';
      if (verdictEl) {
        verdictEl.textContent = window.t('calc_verdict_input_err');
        verdictEl.style.background = 'var(--surface2)';
        verdictEl.style.color = 'var(--text2)';
      }
      return;
    }
    
    const m2Price = Math.round(price / m2);
    if (m2PriceEl) m2PriceEl.textContent = window.formatPriceM2(m2Price);
    
    const stats = zoneStats[zone] || { avgPriceM2: 1300, rentM2: 8.0 };
    const deviation = Math.round(((m2Price - stats.avgPriceM2) / stats.avgPriceM2) * 100);
    
    if (deviationEl) {
      if (deviation > 5) {
        deviationEl.textContent = window.t('calc_deviation_above', { deviation });
        deviationEl.style.color = '#ef4444';
      } else if (deviation < -5) {
        deviationEl.textContent = window.t('calc_deviation_below', { deviation });
        deviationEl.style.color = '#10b981';
      } else {
        deviationEl.textContent = window.t('calc_deviation_avg');
        deviationEl.style.color = 'var(--text)';
      }
    }
    
    const estRentMonthly = stats.rentM2 * m2;
    const estAnnualRent = estRentMonthly * 12;
    const estRoi = ((estAnnualRent / price) * 100).toFixed(1);
    
    if (roiEl) {
      roiEl.textContent = `${estRoi}%`;
      roiEl.style.color = estRoi >= 7.0 ? '#10b981' : '#f59e0b';
    }
    
    if (verdictEl) {
      if (deviation < -8 && estRoi >= 7.5) {
        verdictEl.textContent = window.t('calc_verdict_highly_recommended');
        verdictEl.style.background = 'rgba(16,185,129,0.12)';
        verdictEl.style.color = '#10b981';
      } else if (deviation <= 5 && estRoi >= 6.8) {
        verdictEl.textContent = window.t('calc_verdict_good_opportunity');
        verdictEl.style.background = 'rgba(16,185,129,0.08)';
        verdictEl.style.color = '#059669';
      } else if (deviation > 12) {
        verdictEl.textContent = window.t('calc_verdict_overpriced');
        verdictEl.style.background = 'rgba(239,68,68,0.1)';
        verdictEl.style.color = '#ef4444';
      } else {
        verdictEl.textContent = window.t('calc_verdict_moderate');
        verdictEl.style.background = 'rgba(245,158,11,0.1)';
        verdictEl.style.color = '#d97706';
      }
    }
    
    // Detailed investment outlook calculations
    const outlookBox = document.getElementById('calc-detailed-outlook-box');
    const daysToSellEl = document.getElementById('calc-res-days-to-sell');
    const marketTrendEl = document.getElementById('calc-res-market-trend');
    const outlookDescEl = document.getElementById('calc-res-outlook-desc');
    
    if (outlookBox && daysToSellEl && marketTrendEl && outlookDescEl) {
      outlookBox.style.display = 'flex';
      
      // 1. Days to Sell estimation
      let daysText = '';
      if (deviation < -10) {
        daysText = window.currentLang === 'en' ? '45-60 Days (High Liquidity)' :
                   window.currentLang === 'de' ? '45-60 Tage (Hohe Liquidität)' :
                   window.currentLang === 'pt' ? '45-60 dias (Alta liquidez)' : '45-60 días (Alta liquidez)';
        daysToSellEl.style.color = '#10b981';
      } else if (deviation <= 8) {
        daysText = window.currentLang === 'en' ? '60-90 Days (Normal)' :
                   window.currentLang === 'de' ? '60-90 Tage (Normal)' :
                   window.currentLang === 'pt' ? '60-90 dias (Normal)' : '60-90 días (Normal)';
        daysToSellEl.style.color = 'var(--text)';
      } else {
        daysText = window.currentLang === 'en' ? '120-180 Days (Low Liquidity)' :
                   window.currentLang === 'de' ? '120-180 Tage (Geringe Liquidität)' :
                   window.currentLang === 'pt' ? '120-180 dias (Baixa liquidez)' : '120-180 días (Baja liquidez)';
        daysToSellEl.style.color = '#ef4444';
      }
      daysToSellEl.textContent = daysText;
      
      // 2. Market Trend
      let trendText = '';
      if (parseFloat(estRoi) >= 7.5 && deviation < 0) {
        trendText = window.currentLang === 'en' ? ' High Growth / Appreciation potential' :
                    window.currentLang === 'de' ? ' Hohes Wachstum / Aufwertungspotenzial' :
                    window.currentLang === 'pt' ? ' Alto Crescimento / Potencial de valorização' : ' Crecimiento Sólido / Revalorización alta';
        marketTrendEl.style.color = '#10b981';
      } else if (deviation <= 8) {
        trendText = window.currentLang === 'en' ? ' Stable / Moderate appreciation' :
                    window.currentLang === 'de' ? ' Stabil / Moderate Wertsteigerung' :
                    window.currentLang === 'pt' ? ' Estável / Valorização moderada' : ' Estable / Revalorización moderada';
        marketTrendEl.style.color = 'var(--text)';
      } else {
        trendText = window.currentLang === 'en' ? 'Sluggish / Price correction risk' :
                    window.currentLang === 'de' ? 'Träge / Risiko von Preiskorrekturen' :
                    window.currentLang === 'pt' ? 'Lenta / Risco de correção de preço' : 'Lenta / Riesgo de corrección de precio';
        marketTrendEl.style.color = '#ef4444';
      }
      marketTrendEl.textContent = trendText;
      
      // 3. Outlook Description
      let descText = '';
      if (deviation < -8 && parseFloat(estRoi) >= 7.5) {
        descText = window.currentLang === 'en' ? `This property is highly recommended. Set at an opportunity price with a ${Math.abs(deviation)}% discount under average for ${zone}. Expected annual ROI is ${estRoi}% with strong rental demand.` :
                   window.currentLang === 'de' ? `Diese Immobilie wird dringend empfohlen. Zu einem günstigen Preis mit einem Rabatt von ${Math.abs(deviation)}% unter dem Durchschnitt für ${zone}. Die erwartete jährliche Rendite (ROI) beträgt ${estRoi}% bei starker Mietnachfrage.` :
                   window.currentLang === 'pt' ? `Este imóvel é altamente recomendado. Definido a um preço de oportunidade com um desconto de ${Math.abs(deviation)}% abaixo da média para ${zone}. O ROI anual esperado é de ${estRoi}% com forte demanda de aluguel.` :
                   `Inmueble altamente recomendado. Se encuentra a un precio de oportunidad con un ${Math.abs(deviation)}% de descuento bajo el promedio de ${zone}. El retorno proyectado del ${estRoi}% anual ofrece un excelente cash-flow.`;
      } else if (deviation <= 5 && parseFloat(estRoi) >= 6.8) {
        descText = window.currentLang === 'en' ? `Solid investment in ${zone}. Aligns well with regional price patterns and yields ${estRoi}% ROI, outperforming standard financial rates.` :
                   window.currentLang === 'de' ? `Solide Investition in ${zone}. Stimmt gut mit den regionalen Preismustern überein und bringt eine Rendite (ROI) von ${estRoi}% ein.` :
                   window.currentLang === 'pt' ? `Sólido investimento em ${zone}. Alinha-se bem com os padrões de preços regionais e rende ${estRoi}% de ROI, superando taxas financeiras padrão.` :
                   `Opción sólida de inversión en ${zone}. Alineado con los valores del mercado y con un ROI anual del ${estRoi}% que supera rendimientos financieros tradicionales con bajo riesgo.`;
      } else if (deviation > 12) {
        descText = window.currentLang === 'en' ? `Warning: Overpriced by ${deviation}% compared to average properties in ${zone}. High risk of low liquidity and long sale cycles. Negotiation is advised.` :
                   window.currentLang === 'de' ? `Warnung: Überteuert um ${deviation}% im Vergleich zu durchschnittlichen Immobilien in ${zone}. Hohes Risiko geringer Liquidität. Verhandlungen werden empfohlen.` :
                   window.currentLang === 'pt' ? `Aviso: Preço excessivo em ${deviation}% comparado aos imóveis médios em ${zone}. Alto risco de baixa liquidez. Negociação é aconselhada.` :
                   `Atención: Valor un ${deviation}% sobre el promedio de mercado para ${zone}. Alto riesgo de retornos moderados y período largo de venta. Se recomienda renegociar el valor final.`;
      } else {
        descText = window.currentLang === 'en' ? `Moderate passive asset. Offers standard rentability (${estRoi}% ROI) and stable values. Best suited for capital preservation or direct residential use.` :
                   window.currentLang === 'de' ? `Mäßige passive Anlage. Bietet Standardrentabilität (${estRoi}% ROI) und stabile Werte. Am besten geeignet für Kapitalerhalt.` :
                   window.currentLang === 'pt' ? `Ativo passivo moderado. Oferece rentabilidade padrão (${estRoi}% de ROI) e valores estáveis. Mais adequado para preservação de capital.` :
                   `Rendimiento neutral. ROI anual estimado del ${estRoi}%, ideal para preservación patrimonial o uso residencial.`;
      }
      outlookDescEl.textContent = descText;
    }
  }

  // Bind calculator events
  document.getElementById('calc-zone')?.addEventListener('change', updateCalculator);
  document.getElementById('calc-price')?.addEventListener('input', updateCalculator);
  document.getElementById('calc-m2')?.addEventListener('input', updateCalculator);
  window.addEventListener('currencyChanged', () => {
    updateCalculator();
  });

  // 3. Dynamic Neighborhood Rankings removed in favor of updateNeighborhoodRanking

  // 4. Interactive Heatmap controls & legend
  let activeHeatmapLayers = [];

  window.updateHeatmapMetric = function(metric) {
    if (window.updateHeatmapWithData) {
      window.updateHeatmapWithData(window._currentFilteredProperties || (window.appData ? window.appData.properties : []), metric);
    }
  };

  // Bind heatmap controls
  const heatmapBtns = document.querySelectorAll('.heatmap-ctrl-btn');
  heatmapBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      heatmapBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const metric = btn.getAttribute('data-metric');
      window.updateHeatmapMetric(metric);
    });
  });

  // Hook into navigation to initialize/render rankings and calculator
  const navAnalytics = document.getElementById('nav-analytics');
  if (navAnalytics) {
    navAnalytics.addEventListener('click', () => {
      // Wait for tab transition and then render rankings and run calculator
      setTimeout(() => {
        if (window.appData && window.updateNeighborhoodRanking) {
          window.updateNeighborhoodRanking(window.appData.properties, window._rankViewMode || 'neighborhood');
        }
        updateCalculator();
        // If heatmapInstance is already created, make sure it is updated
        if (window.heatmapInstance) {
          window.heatmapInstance.invalidateSize();
          window.updateHeatmapMetric('demand');
        }
        // Render market filter bar and load independent market data
        renderMarketFilterBar();
        applyMarketFilters();
      }, 200);
    });
  }

  // Bind the bottom nav click sync for analytics too
  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view === 'analytics') {
        setTimeout(() => {
          if (window.appData && window.updateNeighborhoodRanking) {
          window.updateNeighborhoodRanking(window.appData.properties, window._rankViewMode || 'neighborhood');
        }
          updateCalculator();
          if (window.heatmapInstance) {
            window.heatmapInstance.invalidateSize();
            window.updateHeatmapMetric('demand');
          }
          renderMarketFilterBar();
          applyMarketFilters();
        }, 200);
      }
    });
  });

  // Run initializations
  if (window.appData && window.updateNeighborhoodRanking) {
          window.updateNeighborhoodRanking(window.appData.properties, window._rankViewMode || 'neighborhood');
        }
  updateCalculator();

  // Initialize trial badges on load
  window.updateTrialBadges();

  // ===== GESTOS SWIPE PARA DISPOSITIVOS MÓVILES =====
  function enableSwipeToClose(elementId, closeDirection, onClose) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    el.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      // Asegurarse de que el deslizamiento sea horizontal y tenga al menos 60px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
        if (closeDirection === 'left' && diffX < 0) {
          // Deslizado a la izquierda
          onClose();
        } else if (closeDirection === 'right' && diffX > 0) {
          // Deslizado a la derecha
          onClose();
        }
      }
    }
  }

  // Registrar gestos de deslizamiento en móvil
  enableSwipeToClose('sidebar', 'left', () => {
    const sidebar = document.getElementById('sidebar');
    const overlayBg = document.getElementById('overlay-bg');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      overlayBg?.classList.add('hidden');
    }
  });

  enableSwipeToClose('profile-panel', 'right', () => {
    const profilePanel = document.getElementById('profile-panel');
    const overlayBg = document.getElementById('overlay-bg');
    if (profilePanel && !profilePanel.classList.contains('hidden')) {
      profilePanel.classList.add('hidden');
      overlayBg?.classList.add('hidden');
    }
  });

  // ===== COLAPSAR SIDEBAR DEL MAPA EN MÓVILES (Deshabilitado) =====
  // Se deshabilitaron los gestos de colapsar para evitar que el mapa se agrande/redimensione sin querer
  // y permitir el scroll vertical natural de toda la página.

  // ===== CIERRES FÁCILES AL HACER CLICK FUERA =====
  document.addEventListener('click', (e) => {
    // Cerrar menú de filtros al hacer click fuera
    const filterPanel = document.getElementById('filter-panel');
    const filterBtn = document.getElementById('filter-toggle-btn');
    if (filterPanel && !filterPanel.classList.contains('hidden')) {
      if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
        filterPanel.classList.add('hidden');
      }
    }

    // Cerrar panel de notificaciones al hacer click fuera
    const notifPanel = document.getElementById('notif-panel');
    const notifBtn = document.getElementById('notif-btn');
    if (notifPanel && !notifPanel.classList.contains('hidden')) {
      if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.add('hidden');
      }
    }
  });

  // Cerrar modal de propiedades al hacer click en el overlay
  if (modalOverlay && modalClose) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalClose.click();
      }
    });
  }

  // Cerrar modal de premium al hacer click en el overlay
  const paywallOverlay = document.getElementById('premium-paywall-modal-overlay');
  if (paywallOverlay && paywallClose) {
    paywallOverlay.addEventListener('click', (e) => {
      if (e.target === paywallOverlay) {
        paywallClose.click();
      }
    });
  }


  // ===== LIGHT / DARK THEME TOGGLE =====
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleCircle = document.getElementById('theme-toggle-circle');
  
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (themeToggleCircle) {
        themeToggleCircle.style.transform = 'translateX(28px)';
        themeToggleCircle.innerText = '';
      }
      safeStorage.setItem('geohogar_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      if (themeToggleCircle) {
        themeToggleCircle.style.transform = 'translateX(0)';
        themeToggleCircle.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
      }
      safeStorage.setItem('geohogar_theme', 'light');
    }
  }

  // Load saved theme
  const savedTheme = safeStorage.getItem('geohogar_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ===== MULTI-THEME COLOR SCHEME SYSTEM =====
  window.applyColorScheme = function(schemeName) {
    const scheme = schemeName || 'coral';
    document.documentElement.setAttribute('data-theme-color', scheme);
    safeStorage.setItem('geohogar_color_scheme', scheme);

    const paletteSelect = document.getElementById('sidebar-palette-select');
    if (paletteSelect && paletteSelect.value !== scheme) {
      paletteSelect.value = scheme;
    }

    if (window._analyticsCharts) {
      if (window.renderAnalyticsCharts) window.renderAnalyticsCharts();
    }
    if (typeof buildMacroCharts === 'function') {
      buildMacroCharts();
    }
  };

  const savedColorScheme = safeStorage.getItem('geohogar_color_scheme') || 'coral';
  window.applyColorScheme(savedColorScheme);

  // Wire up sidebar settings selects
  const paletteSelect = document.getElementById('sidebar-palette-select');
  if (paletteSelect) {
    paletteSelect.value = savedColorScheme;
    paletteSelect.addEventListener('change', (e) => {
      window.applyColorScheme(e.target.value);
    });
  }

  const langSelect = document.getElementById('sidebar-lang-native-select');
  if (langSelect) {
    langSelect.value = localStorage.getItem('geohogar_lang') || window.currentLang || 'es';
    langSelect.addEventListener('change', (e) => {
      if (typeof window.changeLanguage === 'function') {
        window.changeLanguage(e.target.value);
      }
    });
  }

  const currSelect = document.getElementById('sidebar-curr-native-select');
  if (currSelect) {
    currSelect.value = localStorage.getItem('geohogar_currency') || window.currentCurrency || 'USD';
    currSelect.addEventListener('change', (e) => {
      const newCurr = e.target.value;
      localStorage.setItem('geohogar_currency', newCurr);
      window.currentCurrency = newCurr;
      if (typeof window.applyGlobalState === 'function') {
        window.applyGlobalState(document);
      }
      window.dispatchEvent(new Event('currencyChanged'));
    });
  }

  // Listen to language change to update dynamic content
  document.addEventListener('geohogar:lang:changed', () => {
    // Re-render neighborhood rankings
    const activeSortBtn = document.querySelector('.rank-sort-btn.active');
    const sortKey = activeSortBtn ? activeSortBtn.getAttribute('data-sort') : 'roi';
    if (window.appData && window.updateNeighborhoodRanking) {
      window.updateNeighborhoodRanking(window.appData.properties, window._rankViewMode || 'neighborhood');
    }
    
    // Re-run investment smart calculator
    if (typeof updateCalculator === 'function') {
      updateCalculator();
    }
    
    // Re-render heatmap if active
    const activeHeatmapBtn = document.querySelector('.heatmap-ctrl-btn.active');
    if (activeHeatmapBtn && typeof updateHeatmapMetric === 'function') {
      updateHeatmapMetric(activeHeatmapBtn.getAttribute('data-metric'));
    }
    
    // Re-render map list sidebar
    if (window._currentMapProperties && typeof renderMapList === 'function') {
      renderMapList(window._currentMapProperties);
    }
    
    // Re-render notifications list if visible
    const notifPanel = document.getElementById('notif-panel');
    if (notifPanel && !notifPanel.classList.contains('hidden') && typeof renderNotifications === 'function') {
      renderNotifications();
    }
  });

  // === Data Source Tabs Logic ===
  window.currentDataSourceFilter = 'all';

  function initSourceTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const tabs = container.querySelectorAll('.source-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        window.currentDataSourceFilter = e.currentTarget.getAttribute('data-source');
        
        ['analytics-source-tabs', 'broker-source-tabs'].forEach(id => {
          if (id !== containerId) {
            const otherContainer = document.getElementById(id);
            if (otherContainer) {
              const otherTabs = otherContainer.querySelectorAll('.source-tab');
              otherTabs.forEach(t => {
                t.classList.toggle('active', t.getAttribute('data-source') === window.currentDataSourceFilter);
              });
            }
          }
        });
        
        // Trigger updates
        if (typeof window.applyMarketFilters === 'function') window.applyMarketFilters();
        if (typeof window.updateAnalytics === 'function' && window.appData) window.updateAnalytics(window.appData.properties);
        if (typeof applyExploreFilters === 'function') applyExploreFilters();
        if (typeof window.refreshLeadsView === 'function') window.refreshLeadsView();

        // Toggle Macro Dashboard
        if (containerId === 'analytics-source-tabs') {
          const standardContent = document.getElementById('standard-analytics-content');
          const macroDashboard = document.getElementById('macro-intelligence-dashboard');
          if (window.currentDataSourceFilter === 'official') {
            if (standardContent) standardContent.style.display = 'none';
            if (macroDashboard) macroDashboard.style.display = 'block';
            initMacroDashboard();
          } else {
            if (standardContent) standardContent.style.display = 'block';
            if (macroDashboard) macroDashboard.style.display = 'none';
          }
        }
      });
    });
  }

  let macroIedChartInstance = null;
  let macroRoiChartInstance = null;
  let macroEmbiChartInstance = null;
  let macroCalcBound = false;
  let macroZonesBound = false;

  function buildMacroCharts() {
    // Wait for Chart.js to be available
    if (!window.Chart) {
      setTimeout(buildMacroCharts, 150);
      return;
    }

    // Check if the dashboard is actually visible (canvas has zero dimensions when hidden)
    const dashboard = document.getElementById('macro-intelligence-dashboard');
    if (!dashboard || dashboard.style.display === 'none' || dashboard.offsetParent === null) {
      setTimeout(buildMacroCharts, 150);
      return;
    }

    const palette = window.getThemePalette ? window.getThemePalette() : ['#ff2a5f', '#ff4d79'];
    const activeAccent = palette[0] || '#ff2a5f';
    const activeAccentHover = palette[1] || activeAccent;

    // Chart 1: Evolución IED (Line Chart)
    const ctxIed = document.getElementById('macro-chart-ied');
    if (ctxIed) {
      if (macroIedChartInstance) { macroIedChartInstance.destroy(); macroIedChartInstance = null; }
      
      const chartCtx = ctxIed.getContext('2d');
      const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, activeAccent + '66'); // 40% opacity
      gradient.addColorStop(1, activeAccent + '00'); // 0% opacity

      macroIedChartInstance = new window.Chart(ctxIed, {
        type: 'line',
        data: {
          labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
          datasets: [{
            label: 'Flujo Neto Anual (M USD)',
            data: [500, 320, 450, 680, 807, 931],
            borderColor: activeAccent,
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: activeAccent,
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: { 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { size: 13, family: 'Inter' },
              bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
              padding: 12,
              cornerRadius: 12,
              callbacks: { label: ctx => ' USD ' + ctx.parsed.y + 'M' } 
            }
          },
          scales: { 
            x: { 
              grid: { display: false, drawTicks: true }, 
              ticks: { font: { family: 'Inter', weight: '600', size: 11 }, color: '#64748b', maxRotation: 0, autoSkip: true } 
            },
            y: { 
              beginAtZero: false, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, 
              ticks: { padding: 10, font: { family: 'Inter', weight: '600' }, color: '#64748b', callback: v => v + 'M' } 
            } 
          }
        }
      });
    }

    // Chart 2: Comparativa ROI (Bar Chart)
    const ctxRoi = document.getElementById('macro-chart-roi');
    if (ctxRoi) {
      if (macroRoiChartInstance) { macroRoiChartInstance.destroy(); macroRoiChartInstance = null; }
      macroRoiChartInstance = new window.Chart(ctxRoi, {
        type: 'bar',
        data: {
          labels: ['Paraguay', 'Uruguay', 'Brasil', 'Chile', 'Argentina'],
          datasets: [{
            label: 'ROI Bruto Anual (%)',
            data: [8.0, 5.0, 4.5, 4.0, 3.0],
            backgroundColor: [
              activeAccent,
              'rgba(148, 163, 184, 0.35)',
              'rgba(148, 163, 184, 0.35)',
              'rgba(148, 163, 184, 0.35)',
              'rgba(148, 163, 184, 0.35)'
            ],
            hoverBackgroundColor: [
              activeAccentHover,
              'rgba(148, 163, 184, 0.5)',
              'rgba(148, 163, 184, 0.5)',
              'rgba(148, 163, 184, 0.5)',
              'rgba(148, 163, 184, 0.5)'
            ],
            borderWidth: 0,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 24
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { size: 12, family: "'Outfit', sans-serif" },
              bodyFont: { size: 13, weight: 'bold', family: "'Outfit', sans-serif" },
              padding: 10,
              cornerRadius: 8,
              callbacks: { label: ctx => ' ' + ctx.parsed.x + '%' } 
            }
          },
          scales: { 
            x: { 
              beginAtZero: true, 
              max: 10, 
              grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false, borderDash: [3, 3] }, 
              ticks: { padding: 5, font: { family: "'Outfit', sans-serif", weight: '600' }, color: '#64748b', callback: v => v + '%' } 
            },
            y: { 
              grid: { display: false, drawTicks: true }, 
              ticks: { font: { family: 'Inter', weight: '600', size: 11 }, color: '#64748b' } 
            } 
          }
        }
      });
    }
  }

  function initMacroDashboard() {
    // Fetch and populate automated macro metrics
    fetch('data/macro-metrics.json')
      .then(res => res.json())
      .then(metrics => {
        const valGdp = document.getElementById('val-gdp');
        const valInflation = document.getElementById('val-inflation');
        const valUsd = document.getElementById('val-usd');
        const valEur = document.getElementById('val-eur');
        const valBrl = document.getElementById('val-brl');
        const valMoody = document.getElementById('val-moody');
        
        if (valGdp) valGdp.textContent = `+${metrics.gdpGrowth}%`;
        if (valInflation) valInflation.textContent = `${metrics.inflation}%`;
        if (valUsd && metrics.usdPyg) valUsd.textContent = `Gs. ${metrics.usdPyg.toLocaleString('es-PY')}`;
        if (valEur && metrics.eurPyg) valEur.textContent = `Gs. ${metrics.eurPyg.toLocaleString('es-PY')}`;
        if (valBrl && metrics.brlPyg) valBrl.textContent = `Gs. ${metrics.brlPyg.toLocaleString('es-PY')}`;
        if (valMoody && metrics.moodyRating) valMoody.textContent = metrics.moodyRating;
      })
      .catch(err => console.log('No automated macro metrics found', err));

    // Delay chart build so browser has time to repaint the dashboard as visible
    requestAnimationFrame(() => setTimeout(buildMacroCharts, 50));

    // Calculator Logic (bind only once)
    if (!macroCalcBound) {
      macroCalcBound = true;

      // 1. Cap Rate Neto Real Calculator
      const netPrice = document.getElementById('net-cap-price');
      const netRent = document.getElementById('net-cap-rent');
      const netVacancy = document.getElementById('net-cap-vacancy');
      const netExpensas = document.getElementById('net-cap-expensas');
      const grossOut = document.getElementById('net-cap-gross-out');
      const noiOut = document.getElementById('net-cap-noi-out');
      const netOut = document.getElementById('net-cap-net-out');

      function updateNetCapCalc() {
        if (!netPrice || !netRent) return;
        const p = parseFloat(netPrice.value) || 0;
        const r = parseFloat(netRent.value) || 0;
        const vac = parseFloat(netVacancy?.value || 6) / 100;
        const exp = parseFloat(netExpensas?.value || 80);

        if (p > 0 && r > 0) {
          const grossAnnual = r * 12;
          const grossCap = (grossAnnual / p) * 100;
          const effectiveAnnual = grossAnnual * (1 - vac);
          const ipuMaintAnnual = Math.round(p * 0.005);
          const adminAnnual = effectiveAnnual * 0.08;
          const expensasAnnual = exp * 12;
          const noi = effectiveAnnual - ipuMaintAnnual - adminAnnual - expensasAnnual;
          const netCap = (noi / p) * 100;

          if (grossOut) grossOut.textContent = grossCap.toFixed(1) + '%';
          if (noiOut) noiOut.textContent = '$ ' + Math.round(noi).toLocaleString();
          if (netOut) netOut.textContent = Math.max(0, netCap).toFixed(2) + '%';
        }
      }

      [netPrice, netRent, netVacancy, netExpensas].forEach(inp => {
        if (inp) inp.addEventListener('input', updateNetCapCalc);
      });
      updateNetCapCalc();

      // 2. Simulador Hipotecario AFD / Che Róga Porã
      const afdLine = document.getElementById('afd-credit-line');
      const afdPrice = document.getElementById('afd-prop-price');
      const afdDown = document.getElementById('afd-downpayment');
      const afdQuotaPyg = document.getElementById('afd-quota-pyg');
      const afdQuotaUsd = document.getElementById('afd-quota-usd');
      const afdIncomePyg = document.getElementById('afd-income-pyg');
      const afdFinancedPyg = document.getElementById('afd-financed-pyg');
      const afdFinancedUsd = document.getElementById('afd-financed-usd');

      function updateAFDCalc() {
        if (!afdPrice) return;
        const priceUSD = parseFloat(afdPrice.value) || 0;
        const line = afdLine ? afdLine.value : 'afd1';
        const downPct = parseFloat(afdDown ? afdDown.value : 10) / 100;
        const ratePYG = window.exchangeRates?.PYG || 7550;

        let annualRate = 0.075;
        let years = 30;

        if (line === 'cheroga') {
          annualRate = 0.065;
          years = 30;
        } else if (line === 'afd1') {
          annualRate = 0.075;
          years = 30;
        } else if (line === 'banco') {
          annualRate = 0.105;
          years = 20;
        }

        const pricePYG = priceUSD * ratePYG;
        const financedPYG = pricePYG * (1 - downPct);
        const financedUSD = priceUSD * (1 - downPct);

        const monthlyRate = annualRate / 12;
        const totalMonths = years * 12;
        const quotaPYG = financedPYG * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const quotaUSD = quotaPYG / ratePYG;
        const reqIncomePYG = quotaPYG / 0.30;

        if (afdQuotaPyg) afdQuotaPyg.textContent = 'Gs. ' + Math.round(quotaPYG).toLocaleString('es-PY');
        if (afdQuotaUsd) afdQuotaUsd.textContent = '~ USD ' + Math.round(quotaUSD).toLocaleString() + '/mes';
        if (afdIncomePyg) afdIncomePyg.textContent = 'Gs. ' + Math.round(reqIncomePYG).toLocaleString('es-PY');
        if (afdFinancedPyg) afdFinancedPyg.textContent = 'Gs. ' + Math.round(financedPYG).toLocaleString('es-PY');
        if (afdFinancedUsd) afdFinancedUsd.textContent = 'USD ' + Math.round(financedUSD).toLocaleString();
      }

      [afdLine, afdPrice, afdDown].forEach(inp => {
        if (inp) {
          inp.addEventListener('input', updateAFDCalc);
          inp.addEventListener('change', updateAFDCalc);
        }
      });
      window.addEventListener('currencyRatesUpdated', updateAFDCalc);
      updateAFDCalc();
    }

    // Hot Zone Buttons (bind only once)
    if (!macroZonesBound) {
      macroZonesBound = true;
      document.querySelectorAll('.btn-hotzone-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const zone = e.currentTarget.getAttribute('data-zone');
          // Navigate to Map tab
          const navMap = document.getElementById('nav-map');
          if (navMap) navMap.click();
          // Then set search term and fire input
          setTimeout(() => {
            const searchInput = document.getElementById('global-search');
            const mapSearchInput = document.getElementById('map-search-input');
            const val = zone.toLowerCase(); // Use lowercase to ensure exact match as manual typing
            
            if (searchInput) {
              searchInput.value = val;
              searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (mapSearchInput) {
              mapSearchInput.value = val;
            }
            
            if (window.applyExploreFilters) {
              window.applyExploreFilters();
            }
              
            // Map center logic: give some time for markers to filter and render
            setTimeout(() => {
                let boundsValid = false;
                // Try to find the bounds of markers
                const activeMarkers = [];
                if (window.mapInstance) {
                  window.mapInstance.eachLayer(layer => {
                      if (layer instanceof L.Marker && layer !== window.userMarker) {
                          activeMarkers.push(layer);
                      }
                  });
                }
                
                if (activeMarkers.length > 0 && window.mapInstance && L.featureGroup) {
                    const group = new L.featureGroup(activeMarkers);
                    const bounds = group.getBounds();
                    if (bounds.isValid()) {
                        window.mapInstance.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                        boundsValid = true;
                    }
                }
                
                if (!boundsValid && window.smartCenterMap) {
                    window.smartCenterMap(zone);
                }
            }, 300); // Increased timeout to let debounce and rendering finish
          }, 100);
        });
      });
    }
  }
  
  setTimeout(() => {
    initSourceTabs('analytics-source-tabs');
    initSourceTabs('broker-source-tabs');
  }, 500);


  // Bind ranking sorting buttons
  const rankSortBtns = document.querySelectorAll('.rank-sort-btn');
  rankSortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rankSortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const allProps = window.appData ? window.appData.properties : [];
      if (allProps.length && window.updateNeighborhoodRanking) {
        window.updateNeighborhoodRanking(allProps, window._rankViewMode || 'neighborhood');
      }
    });
  });

});


// Helper global para cambiar pesta�as desde otros m�dulos de forma segura
window.switchTab = function(viewId) {
  const navBtn = document.getElementById('nav-' + viewId);
  if (navBtn) {
    navBtn.click();
  } else {
    console.warn('Pestaña no encontrada:', viewId);
  }
};


// --- TUTORIALES TÉCNICOS INTERACTIVOS (DRIVER.JS) ---

window.closeTourSelection = function() {
  const overlay = document.getElementById('tour-selection-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('active');
  }
};

const getDriverOptions = (steps, isProTour = false) => {
  return {
    showProgress: true,
    popoverClass: 'premium-driver-theme',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Terminar',
    progressText: 'Paso {{current}} de {{total}}',
    steps: steps,
    onPopoverRender: (popover, { config, state }) => {
       popover.wrapper.style.zIndex = "3000";
    },
    onDestroyed: () => {
      // 100% Safe Cleanup: Always return to explore (Map) view and hide demo views
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.sandbox-view').forEach(v => v.style.display = 'none');
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      
      const exploreView = document.getElementById('view-explore');
      const navExplore = document.getElementById('nav-explore');
      
      if (exploreView) exploreView.classList.add('active');
      if (navExplore) navExplore.classList.add('active');
      
      // Scroll to top to ensure no weird layout glitches
      window.scrollTo(0, 0);
      
      // Trigger Upsell Modal if they just finished a PRO tour
      if (isProTour) {
        const premiumModal = document.getElementById('premium-paywall-modal-overlay');
        if (premiumModal) {
          setTimeout(() => {
            premiumModal.classList.remove('hidden');
            premiumModal.classList.add('active');
          }, 300);
        }
      }
    }
  };
};

window.startExploreTour = function() {
  window.closeTourSelection();
  if (!window.driver) return console.error('Driver.js missing');
  
  // Ensure we are in Explore tab
  if (window.switchTab) window.switchTab('explore');
  
  const steps = [
    {
      element: '.search-container',
      popover: {
        title: 'Búsqueda Global',
        description: 'Encuentra propiedades introduciendo la dirección, el barrio o la ciudad.',
        side: 'bottom', align: 'start'
      }
    },
    {
      element: '#filter-toggle-btn',
      popover: {
        title: 'Filtros Avanzados',
        description: 'Aquí puedes afinar tu búsqueda: rango de precios, cantidad de habitaciones, tipo de moneda (USD/Gs) y mucho más.',
        side: 'bottom', align: 'end'
      }
    },
    {
      element: '#sort-select',
      popover: {
        title: 'Orden Inteligente',
        description: 'No ordenes solo por precio. Usa esto para encontrar las propiedades con **mayor rentabilidad** o mejor precio por m².',
        side: 'top', align: 'start'
      }
    }
  ];
  
  setTimeout(() => window.driver.js.driver(getDriverOptions(steps, false)).drive(), 400);
};

window.startAnalyticsTour = function() {
  window.closeTourSelection();
  
  // Safely switch to Academy
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  
  const academyView = document.getElementById('view-academy');
  if (academyView) {
    academyView.style.display = 'block';
    academyView.classList.add('active');
    
    // Auto-select the first analytics tab
    const firstAnalyticsTab = document.querySelector('[data-target="academy-analytics-global"]');
    if (firstAnalyticsTab) firstAnalyticsTab.click();
  }
};

window.startBrokerTour = function() {
  window.closeTourSelection();
  
  // Safely switch to Academy
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  
  const academyView = document.getElementById('view-academy');
  if (academyView) {
    academyView.style.display = 'block';
    academyView.classList.add('active');
    
    // Auto-select the first broker tab
    const firstBrokerTab = document.querySelector('[data-target="academy-broker-leads"]');
    if (firstBrokerTab) firstBrokerTab.click();
  }
};

// Autostart fallback just in case
document.addEventListener('DOMContentLoaded', () => {
  // Inject the button to open modal if it's missing (though it shouldn't be)
  if (!document.getElementById('nav-tour')) {
    const glossaryBtn = document.getElementById('nav-glossary')?.parentElement;
    if (glossaryBtn) {
      const tourLi = document.createElement('li');
      tourLi.innerHTML = `<a href="#" class="sidebar-link" id="nav-tour" onclick="const overlay = document.getElementById('tour-selection-overlay'); if(overlay) { overlay.classList.remove('hidden'); overlay.classList.add('active'); }">
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px; margin-right: 12px; flex-shrink: 0; transition: transform 0.2s;">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span style="color:#10b981; font-weight:700;">Iniciar Tutorial</span>
        </a>`;
      glossaryBtn.insertAdjacentElement('afterend', tourLi);
    }
  }
});


  // ===== DELEGACIÓN GLOBAL DE EVENTOS PARA SUB-TABS Y SECCIONES SPA =====
  document.body.addEventListener('click', (e) => {
    // 1. Pestañas de Broker PRO (.broker-tab-btn)
    const brokerBtn = e.target.closest('.broker-tab-btn');
    if (brokerBtn) {
      e.preventDefault();
      const brokerTabs = document.querySelectorAll('.broker-tab-btn');
      const brokerContents = document.querySelectorAll('.broker-tab-content');
      
      brokerTabs.forEach(b => b.classList.remove('active'));
      brokerBtn.classList.add('active');
      const target = brokerBtn.getAttribute('data-target');
      brokerContents.forEach(c => {
        if (c.id === target) { 
          c.style.display = 'block'; 
          c.classList.add('active'); 
          if (typeof triggerStagger === 'function') triggerStagger(c); 
        } else { 
          c.style.display = 'none'; 
          c.classList.remove('active'); 
        }
      });
      if (target === 'broker-crm' && typeof window.renderCRM === 'function') window.renderCRM();
      if (target === 'broker-funnels' && typeof startCountUp === 'function') startCountUp();
      if (target === 'broker-valuation' && window.renderValuationTab) window.renderValuationTab();
      if (target === 'broker-notifs' && window._brokerAlertsModule) window._brokerAlertsModule.renderNotifs();
      if (target === 'broker-alert-config' && window._brokerAlertsModule) window._brokerAlertsModule.renderAlerts();
      if (target === 'broker-leads' && typeof refreshLeadsView === 'function') refreshLeadsView();
      return;
    }

    // 2. Pestañas de origen de datos en Analytics/Mercado (.source-tab)
    const sourceTab = e.target.closest('.source-tab');
    if (sourceTab) {
      e.preventDefault();
      const container = sourceTab.closest('.data-source-tabs, #analytics-source-tabs, #broker-source-tabs');
      if (container) {
        const tabs = container.querySelectorAll('.source-tab');
        tabs.forEach(t => t.classList.remove('active'));
        sourceTab.classList.add('active');
        
        const source = sourceTab.getAttribute('data-source');
        window.currentDataSourceFilter = source;
        
        document.querySelectorAll('.source-tab').forEach(st => {
          if (st.getAttribute('data-source') === source) {
            st.classList.add('active');
          }
        });
        
        if (typeof applyExploreFilters === 'function') applyExploreFilters();
        if (typeof updateAnalytics === 'function' && window.appData?.properties) {
          updateAnalytics(window.appData.properties);
        }
      }
      return;
    }

    // 3. Pestañas de Zona (Barrios/Ciudades) en Analytics (.zone-tab-btn)
    const zoneBtn = e.target.closest('.zone-tab-btn');
    if (zoneBtn) {
      e.preventDefault();
      const group = zoneBtn.closest('#price-view-tabs, #range-view-tabs, #rank-view-tabs, .zone-view-tabs');
      if (group) {
        group.querySelectorAll('.zone-tab-btn').forEach(b => b.classList.remove('active'));
        zoneBtn.classList.add('active');
        const mode = zoneBtn.dataset.view;
        const allProps = window.appData ? window.appData.properties : [];
        
        if (group.id === 'price-view-tabs' && typeof updatePriceChart === 'function') {
          window._priceViewMode = mode;
          updatePriceChart(allProps, mode);
        }
        if (group.id === 'range-view-tabs' && typeof updateRangeChart === 'function') {
          window._rangeViewMode = mode;
          updateRangeChart(allProps, mode);
        }
        if (group.id === 'rank-view-tabs' && typeof window.updateNeighborhoodRanking === 'function') {
          window._rankViewMode = mode;
          window.updateNeighborhoodRanking(allProps, mode);
        }
      }
      return;
    }

    // 4. Botones de ordenamiento en Ranking de Barrios/Ciudades (ROI / USD/m²)
    const rankSortBtn = e.target.closest('.rank-sort-btn');
    if (rankSortBtn) {
      e.preventDefault();
      const group = rankSortBtn.closest('.ranking-sort-options') || document;
      group.querySelectorAll('.rank-sort-btn').forEach(b => b.classList.remove('active'));
      rankSortBtn.classList.add('active');
      const allProps = window.appData ? window.appData.properties : [];
      if (typeof window.updateNeighborhoodRanking === 'function') {
        window.updateNeighborhoodRanking(allProps, window._rankViewMode || 'neighborhood');
      }
      return;
    }
  });

  // ===== LISTENERS DE CICLO DE VIDA PARA SECCIONES =====
  window.addEventListener('view:broker:loaded', () => {
    const activeTab = document.querySelector('.broker-tab-btn.active') || document.querySelector('.broker-tab-btn');
    const targetId = activeTab ? activeTab.getAttribute('data-target') : 'broker-leads';
    document.querySelectorAll('.broker-tab-content').forEach(c => {
      if (c.id === targetId) {
        c.style.display = 'block';
        c.classList.add('active');
      } else {
        c.style.display = 'none';
        c.classList.remove('active');
      }
    });
    if (targetId === 'broker-crm' && typeof window.renderCRM === 'function') window.renderCRM();
    if (targetId === 'broker-valuation' && typeof window.renderValuationTab === 'function') window.renderValuationTab();
    if (targetId === 'broker-notifs' && window._brokerAlertsModule) window._brokerAlertsModule.renderNotifs();
    if (targetId === 'broker-alert-config' && window._brokerAlertsModule) window._brokerAlertsModule.renderAlerts();
    if (typeof window.initBrokerLeads === 'function') {
      window.initBrokerLeads();
    }
  });

  window.addEventListener('view:analytics:loaded', () => {
    if (typeof updateAnalytics === 'function' && window.appData?.properties) {
      updateAnalytics(window.appData.properties);
    }
  });


  // ===== ACTUALIZACIÓN DE NOMBRE DE USUARIO =====
  window.updateWelcomeUserName = function() {
    const nameEl = document.getElementById('welcome-user-name');
    if (!nameEl) return;
    const profile = window.currentUserProfile;
    const user = window.firebaseAuth?.currentUser;
    const name = profile?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : null);
    if (name) {
      nameEl.textContent = name.split(' ')[0];
      nameEl.removeAttribute('data-i18n');
    } else {
      nameEl.textContent = 'Invitado';
    }
  };

  document.addEventListener('geohogar:auth:loggedin', () => {
    if (typeof window.updateWelcomeUserName === 'function') {
      window.updateWelcomeUserName();
    }
  });

  // ===== EVENTO DE CICLO DE VIDA PARA EXPLORAR =====
  window.addEventListener('view:explore:loaded', () => {
    if (typeof window.updateWelcomeUserName === 'function') {
      window.updateWelcomeUserName();
    }
    if (typeof window.applyExploreFilters === 'function') {
      window.applyExploreFilters(true);
    }
  });

  // ===== EVENTO DE CICLO DE VIDA PARA MENSAJES =====
  window.addEventListener('view:messages:loaded', () => {
    if (typeof window.renderMessages === 'function') {
      window.renderMessages();
    }
  });
