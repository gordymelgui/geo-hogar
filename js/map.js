window.mapInstance = null;
let markersLayer = null;
let heatmapLayer = null;
let poiLayer = null;

window.initMap = function() {
  if (window.mapInstance) {
    window.mapInstance.invalidateSize();
    return;
  }
  window.mapInstance = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([-25.2867, -57.6191], 13);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(window.mapInstance);
  
  markersLayer = L.layerGroup().addTo(window.mapInstance);
  heatmapLayer = L.layerGroup().addTo(window.mapInstance);
  poiLayer    = L.layerGroup().addTo(window.mapInstance);
  
  const heatZones = [
    { coords: [-25.281, -57.563], color: '#ff2a5f', radius: 1000 },
    { coords: [-25.295, -57.625], color: '#ff2a5f', radius: 800 },
    { coords: [-25.248, -57.518], color: '#38bdf8', radius: 1200 }
  ];
  heatZones.forEach(zone => {
    L.circle(zone.coords, { color: 'none', fillColor: zone.color, fillOpacity: 0.15, radius: zone.radius }).addTo(heatmapLayer);
    L.circle(zone.coords, { color: 'none', fillColor: zone.color, fillOpacity: 0.3, radius: zone.radius / 2.5 }).addTo(heatmapLayer);
  });
  
  if (window.appData && window.appData.properties) {
    window.filterMapMarkers(window._currentMapCriteria || {});
  }

  const drawBtn = document.getElementById('btn-draw-map');
  if (drawBtn) {
    drawBtn.onclick = () => {
      drawBtn.innerHTML = `<span>${window.t('drawBtn_drawing')}</span>`;
      drawBtn.style.background = '#ff2a5f';
      setTimeout(() => {
        drawBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg><span>${window.t('drawBtn_draw')}</span>`;
        drawBtn.style.background = '#1e293b';
        openZoneAlertModal();
      }, 1500);
    };
  }
  // ===== MAP CONTROL BUTTONS =====

  // 1. Centrar en propiedades
  const centerBtn = document.getElementById('map-center-btn');
  if (centerBtn) {
    centerBtn.onclick = () => {
      if (!markersLayer) return;
      const layers = Object.values(markersLayer._layers);
      if (layers.length === 0) return;
      const group = L.featureGroup(layers);
      window.mapInstance.fitBounds(group.getBounds(), { padding: [50, 50], animate: true, duration: 0.8 });
      centerBtn.classList.add('active');
      setTimeout(() => centerBtn.classList.remove('active'), 1200);
    };
  }

  // 2. Toggle satélite / calles
  let isSatellite = false;
  let currentTileLayer = null;
  const streetTile = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const satelliteTile = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  // Save reference to the base tile layer
  window.mapInstance.eachLayer(l => { if (l._url) currentTileLayer = l; });

  const satelliteBtn = document.getElementById('map-satellite-btn');
  if (satelliteBtn) {
    satelliteBtn.onclick = () => {
      isSatellite = !isSatellite;
      if (currentTileLayer) window.mapInstance.removeLayer(currentTileLayer);
      currentTileLayer = L.tileLayer(isSatellite ? satelliteTile : streetTile, { maxZoom: 19 }).addTo(window.mapInstance);
      satelliteBtn.classList.toggle('active', isSatellite);
      satelliteBtn.title = isSatellite ? window.t('map_street_view') : window.t('map_satellite_view');
    };
  }

  // 3. Toggle zonas de demanda (heatmap circles)
  let heatVisible = true;
  const heatToggle = document.getElementById('map-heatmap-toggle');
  if (heatToggle) {
    heatToggle.classList.add('active'); // on by default
    heatToggle.onclick = () => {
      heatVisible = !heatVisible;
      if (heatVisible) {
        heatmapLayer && window.mapInstance.addLayer(heatmapLayer);
      } else {
        heatmapLayer && window.mapInstance.removeLayer(heatmapLayer);
      }
      heatToggle.classList.toggle('active', heatVisible);
      heatToggle.title = heatVisible ? window.t('map_heatmap_hide') : window.t('map_heatmap_show');
    };
  }
  
  // Viewport bounds synchronization listener
  window.mapInstance.on('moveend', () => {
    window.updateSidebarListFromMapBounds();
  });
  
  // Set initial map properties
  if (window.appData && window.appData.properties) {
    window._currentMapProperties = window.appData.properties;
  }
  
  setupInvestorMapFilters();

  // Mobile: allow vertical scroll to pass through the Leaflet map
  // (Leaflet sets touch-action:none by default which blocks page scroll)
  if (window.innerWidth <= 1024) {
    setTimeout(() => {
      const leafletContainer = document.querySelector('#map .leaflet-container');
      if (leafletContainer) {
        leafletContainer.style.touchAction = 'pan-x pinch-zoom';
      }
      const mapEl = document.getElementById('map');
      if (mapEl) mapEl.style.touchAction = 'pan-x pinch-zoom';
    }, 200);
  }
};

// ===== VIEWPORT BOUNDS SYNC =====
window.updateSidebarListFromMapBounds = function() {
  if (!window.mapInstance) return;
  const bounds = window.mapInstance.getBounds();
  const activeProps = window._currentMapProperties || (window.appData && window.appData.properties) || [];
  
  const visibleProps = activeProps.filter(p => {
    const lat = parseFloat(p.lat);
    const lng = parseFloat(p.lng);
    if (isNaN(lat) || isNaN(lng)) return false;
    try {
      return bounds.contains([lat, lng]);
    } catch (e) {
      return false;
    }
  });

  
  if (window.renderMapList) {
    window.renderMapList(visibleProps);
  }
};

// ===== INVESTOR MAP FILTERS SETUP =====
function setupInvestorMapFilters() {
  const roiBtn = document.getElementById('filter-roi-btn');
  const marketBtn = document.getElementById('filter-market-value-btn');
  const radarBtn = document.getElementById('filter-radar-broker-btn');
  
  if (!roiBtn || !marketBtn) return;
  
  roiBtn.onclick = (e) => {
    e.preventDefault();
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    if (!isPremium) {
      if (window.showPremiumPaywall) window.showPremiumPaywall();
      return;
    }
    roiBtn.classList.toggle('active');
    // Sync to explore view button
    const expBtn = document.getElementById('explore-roi-btn');
    if (expBtn) {
      if (roiBtn.classList.contains('active')) expBtn.classList.add('active');
      else expBtn.classList.remove('active');
    }
    window.filterMapMarkers(window._currentMapCriteria || {});
  };
  
  marketBtn.onclick = (e) => {
    e.preventDefault();
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    if (!isPremium) {
      if (window.showPremiumPaywall) window.showPremiumPaywall();
      return;
    }
    marketBtn.classList.toggle('active');
    // Sync to explore view button
    const expBtn = document.getElementById('explore-market-value-btn');
    if (expBtn) {
      if (marketBtn.classList.contains('active')) expBtn.classList.add('active');
      else expBtn.classList.remove('active');
    }
    window.filterMapMarkers(window._currentMapCriteria || {});
  };

  if (radarBtn) {
    radarBtn.onclick = (e) => {
      e.preventDefault();
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        if (window.showPremiumPaywall) window.showPremiumPaywall();
        return;
      }
      radarBtn.classList.toggle('active');
      window.filterMapMarkers(window._currentMapCriteria || {});
    };
  }
}

// ===== AI MAP FILTER =====
// criteria: { type, maxPrice, minPrice, maxM2, minM2, rooms, op, poiType, location }
window.filterMapMarkers = function(criteria = {}) {
  if (!window.appData) return;
  window._currentMapCriteria = criteria;
  poiLayer && poiLayer.clearLayers();

  let props = window._currentFilteredProperties || window.appData.properties;


  const feedSource = window.currentFeedSource || 'organic';
  if (feedSource === 'organic') {
    props = props.filter(p => !p.isScraped);
  }


  if (criteria.type)     props = props.filter(p => p.type.toLowerCase().includes(criteria.type.toLowerCase()));
  if (criteria.op)       props = props.filter(p => p.op.toLowerCase().includes(criteria.op.toLowerCase()));
  if (criteria.maxPrice) props = props.filter(p => p.price <= criteria.maxPrice);
  if (criteria.minPrice) props = props.filter(p => p.price >= criteria.minPrice);
  if (criteria.maxM2)    props = props.filter(p => p.m2 <= criteria.maxM2);
  if (criteria.minM2)    props = props.filter(p => p.m2 >= criteria.minM2);
  if (criteria.rooms)    props = props.filter(p => p.rooms >= criteria.rooms);

  if (criteria.location) {
    const normLoc = criteria.location.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    props = props.filter(p => {
      const normAddr = p.address.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const normTitle = p.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return normAddr.includes(normLoc) || normTitle.includes(normLoc);
    });
  }

  // Aplicar Filtros de Inversionistas
  const roiBtn = document.getElementById('filter-roi-btn');
  const marketBtn = document.getElementById('filter-market-value-btn');
  const radarBtn = document.getElementById('filter-radar-broker-btn');
  const roiActive = roiBtn && roiBtn.classList.contains('active');
  const marketActive = marketBtn && marketBtn.classList.contains('active');
  const radarActive = radarBtn && radarBtn.classList.contains('active');

  if (roiActive) {
    props = props.filter(p => p.roi && p.roi >= 7.0);
  }
  if (marketActive) {
    props = props.filter(p => p.isUnderpriced === true);
  }
  if (radarActive) {
    props = props.filter(p => p.publisherType === 'broker');
  }

  renderMapMarkers(props, criteria.highlight);

  // Auto zoom/center to fit active filtered markers on the map
  if (props.length > 0 && window.mapInstance && markersLayer) {
    setTimeout(() => {
      const layers = Object.values(markersLayer._layers);
      if (layers.length > 0) {
        const group = L.featureGroup(layers);
        window.mapInstance.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15, animate: true, duration: 0.8 });
      }
    }, 50);
  }

  // Simulate POI markers
  if (criteria.poiType) {
    const poiData = getPOISimulation(criteria.poiType);
    poiData.forEach(poi => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:white;border:2px solid #38bdf8;border-radius:10px;padding:4px 10px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.15)">${poi.icon} ${poi.name}</div>`,
        iconSize: [120, 32], iconAnchor: [60, 16]
      });
      L.marker(poi.coords, { icon }).addTo(poiLayer);
      // Draw radius circle
      L.circle(poi.coords, { color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.08, radius: 800, weight: 1.5, dashArray: '6,4' }).addTo(poiLayer);
    });
    // Filter props near any POI
    if (poiData.length > 0) {
      props = props.filter(p => {
        return poiData.some(poi => {
          const d = L.latLng(p.lat, p.lng).distanceTo(L.latLng(poi.coords[0], poi.coords[1]));
          return d <= 2000;
        });
      });
      renderMapMarkers(props, true);
    }
  }

  // Save active filtered properties for viewport bound synchronization
  window._currentMapProperties = props;

  // Update map sidebar list using viewport bounds
  if (window.updateSidebarListFromMapBounds) {
    window.updateSidebarListFromMapBounds();
  } else if (window.renderMapList) {
    window.renderMapList(props);
  }

  // Show filter badge on map
  const badgeCriteria = { ...criteria };
  if (roiActive) badgeCriteria.roi = 'ROI > 7%';
  if (marketActive) badgeCriteria.discount = window.t('underpriced');
  showMapFilterBadge(badgeCriteria, props.length);
  
  return props;
};

window.clearMapFilter = function() {
  poiLayer && poiLayer.clearLayers();
  
  const roiBtn = document.getElementById('filter-roi-btn');
  const marketBtn = document.getElementById('filter-market-value-btn');
  const radarBtn = document.getElementById('filter-radar-broker-btn');
  if (roiBtn) roiBtn.classList.remove('active');
  if (marketBtn) marketBtn.classList.remove('active');
  if (radarBtn) radarBtn.classList.remove('active');
  
  // Clear map search inputs
  const mapSearchInput = document.getElementById('map-search-input');
  if (mapSearchInput) mapSearchInput.value = '';
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) globalSearch.value = '';
  const clearBtn = document.getElementById('map-search-clear-btn');
  if (clearBtn) clearBtn.classList.add('hidden');
  
  window._currentMapCriteria = {};
  
  if (window.applyExploreFilters) {
    window.applyExploreFilters();
  } else if (window.appData) {
    renderMapMarkers(window.appData.properties);
    if (window.renderMapList) window.renderMapList(window.appData.properties);
  }
  document.getElementById('map-filter-badge')?.remove();
};

function getPOISimulation(type) {
  const pois = {
    hospital: [
      { name: 'Hospital Central', coords: [-25.291, -57.576], icon: '' },
      { name: 'Clínica San Roque', coords: [-25.272, -57.551], icon: '' }
    ],
    escuela: [
      { name: 'Escuela Nacional', coords: [-25.285, -57.561], icon: '' },
      { name: 'Colegio San José', coords: [-25.268, -57.548], icon: '' }
    ],
    universidad: [
      { name: 'UNA', coords: [-25.295, -57.638], icon: '' },
      { name: 'UCA', coords: [-25.278, -57.579], icon: '' }
    ],
    supermercado: [
      { name: 'Stock Center', coords: [-25.283, -57.569], icon: '' },
      { name: 'Superseis', coords: [-25.273, -57.553], icon: '' }
    ],
    parque: [
      { name: 'Parque Carlos A. López', coords: [-25.290, -57.625], icon: '' },
      { name: 'Parque Caballero', coords: [-25.275, -57.570], icon: '' }
    ]
  };
  const key = Object.keys(pois).find(k => type.toLowerCase().includes(k));
  return key ? pois[key] : [];
}

function showMapFilterBadge(criteria, count) {
  document.getElementById('map-filter-badge')?.remove();
  const parts = [];
  if (criteria.type)     parts.push(criteria.type);
  if (criteria.op)       parts.push(criteria.op);
  if (criteria.maxPrice) parts.push(`\< ${window.formatPrice(criteria.maxPrice)}`);
  if (criteria.minPrice) parts.push(`\> ${window.formatPrice(criteria.minPrice)}`);
  if (criteria.poiType)  parts.push(window.t('map_near_poi', { poiType: criteria.poiType }));
  if (criteria.rooms)    parts.push(window.t('map_rooms_suffix', { rooms: criteria.rooms }));
  if (criteria.roi)      parts.push(criteria.roi);
  if (criteria.discount) parts.push(criteria.discount);
  
  if (!parts.length) return;
  const badge = document.createElement('div');
  badge.id = 'map-filter-badge';
  badge.style.cssText = 'position:absolute;top:78px;left:20px;z-index:20;background:white;border:1px solid var(--border);border-radius:100px;padding:8px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1);font-weight:700;font-size:0.85rem;white-space:nowrap';
  const countSuffix = window.t('map_properties_suffix', { count });
  badge.innerHTML = `<span style="color:var(--accent)"></span> ${parts.join(' · ')} <span style="color:var(--text2);margin-left:4px">${countSuffix}</span> <button onclick="clearMapFilter();this.parentElement.remove()" style="background:var(--surface2);border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;margin-left:4px;display:flex;align-items:center;justify-content:center;font-size:0.9rem">✕</button>`;
  document.querySelector('.map-container')?.appendChild(badge);
}

function formatCompactPrice(priceInUSD) {
  const currency = window.currentCurrency || 'USD';
  const rate = window.exchangeRates ? (window.exchangeRates[currency] || 1) : 1;
  const symbol = window.currencySymbols ? (window.currencySymbols[currency] || '$') : '$';
  const converted = priceInUSD * rate;
  
  if (currency === 'PYG') {
    if (converted >= 1000000000) {
      return `${symbol} ${(converted / 1000000000).toFixed(1)}B`;
    } else if (converted >= 1000000) {
      return `${symbol} ${(converted / 1000000).toFixed(0)}M`;
    } else {
      return `${symbol} ${(converted / 1000).toFixed(0)}K`;
    }
  } else {
    if (converted >= 1000000) {
      return `${symbol} ${(converted / 1000000).toFixed(1)}M`;
    } else {
      return `${symbol} ${(converted / 1000).toFixed(0)}K`;
    }
  }
}

function renderMapMarkers(props, highlight = false) {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  props.forEach(prop => {
    const lat = parseFloat(prop.lat);
    const lng = parseFloat(prop.lng);
    if (isNaN(lat) || isNaN(lng)) return;
    const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
    let customStyle = '';
    if (isPremium) {
      if (prop.roi && prop.roi > 8) {
        customStyle = '--marker-color: #10b981; box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);';
      } else if (prop.isUnderpriced) {
        customStyle = '--marker-color: #f59e0b; box-shadow: 0 0 14px rgba(245, 158, 11, 0.4);';
      }
      
      if (prop.publisherType === 'broker') {
        customStyle = '--marker-color: #D4AF37; background: linear-gradient(135deg, #FFDF70 0%, #D4AF37 50%, #FFDF70 100%); background-size: 200% auto; color: #0f172a; --marker-scale: 1.1; box-shadow: 0 0 20px rgba(212,175,55,0.9); z-index: 1000; animation: pulseBroker 2s ease-in-out infinite alternate, shineBroker 3s linear infinite;';
      } else if (prop.publisherType === 'premium') {
        customStyle = '--marker-color: #f59e0b; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #fff; --marker-scale: 1.05; box-shadow: 0 0 15px rgba(245,158,11,0.6);';
      }
    }
    if (highlight) {
      customStyle = '--marker-color: #ff2a5f; background: #fff0f3; --marker-scale: 1.15; box-shadow: 0 0 15px rgba(255, 42, 95, 0.5);';
    }

    const displayPrice = formatCompactPrice(prop.price);
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="price-marker" style="${customStyle}">${displayPrice}</div>`,
      iconSize: null,
      iconAnchor: null
    });

    const translatedType = window.translatePropType ? window.translatePropType(prop.type) : prop.type;
    const translatedOp = prop.op === 'Venta' ? window.t('op_venta') : window.t('op_alquiler');
    
    // Check premium logic for marker popup details
    let roiHtml = '';
    let underpricedHtml = '';
    
    if (prop.roi && isPremium) {
      roiHtml = `<div style="color:#10b981;font-weight:700;font-size:0.8rem;margin-bottom:2px"> ${window.t('map_popup_roi', { roi: prop.roi })}</div>`;
    }
    
    if (prop.isUnderpriced && isPremium) {
      underpricedHtml = `<div class="tooltip-wrap" style="color:#d97706;font-weight:700;font-size:0.8rem;margin-bottom:6px;display:inline-block;"> ${window.t('map_popup_opportunity', { discount: prop.discount })}<span class="tooltip-content">${window.t('underpriced_tooltip')}</span></div><br>`;
    }

    let brokerHtml = '';
    if (prop.publisherType === 'broker') {
      brokerHtml = `<div style="color:#D4AF37;font-weight:800;font-size:0.8rem;margin-bottom:6px; background: rgba(212, 175, 55, 0.1); display: inline-block; padding: 2px 6px; border-radius: 4px;"> Broker Verificado</div>`;
    } else if (prop.publisherType === 'premium') {
      brokerHtml = `<div style="color:#f59e0b;font-weight:800;font-size:0.8rem;margin-bottom:6px; background: rgba(245, 158, 11, 0.1); display: inline-block; padding: 2px 6px; border-radius: 4px;"> Inversor Premium</div>`;
    }
    
    const popupContent = `
      <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:5px">
        <h4 style="margin:0 0 4px;font-size:0.95rem;font-weight:800">${prop.title}</h4>
        <div style="font-weight:800;color:var(--accent);font-size:1.1rem;margin-bottom:6px">${window.formatPrice(prop.price)}</div>
        ${brokerHtml}
        ${roiHtml}
        ${underpricedHtml}
        <div style="font-size:0.75rem;color:var(--text2);margin-bottom:8px;">${translatedType} · ${translatedOp}</div>
        <button onclick="if(window.openPropertyModal){ const p = window.appData.properties.find(x => x.id == ${prop.id}); if(p) window.openPropertyModal(p); }" style="width: 100%; background: var(--accent); color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 800; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 10px rgba(255, 42, 95, 0.3);">Ver Propiedad</button>
      </div>
    `;

    L.marker([lat, lng], { icon })
      .bindPopup(popupContent, { maxWidth: 220 })
      .addTo(markersLayer);
  });
}
window.renderMapMarkers = renderMapMarkers;

// Re-render map markers when language is changed
document.addEventListener('geohogar:lang:changed', () => {
  if (window.mapInstance && window.appData && window.appData.properties) {
    window.filterMapMarkers(window._currentMapCriteria || {});
  }
});

