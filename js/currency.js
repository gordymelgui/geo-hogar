// currency.js

// Tasa de cambio de referencia para conversiones
window.exchangeRates = {
  USD: 1,
  PYG: 7500,
  BRL: 5.5
};

// Símbolos y formatos
window.currencySymbols = {
  USD: 'US$',
  PYG: 'Gs.',
  BRL: 'R$'
};

// Inicializar moneda actual
window.currentCurrency = localStorage.getItem('geohogar_currency') || 'USD';

// Función para cambiar de moneda
window.changeCurrency = function(curr) {
  const oldCurr = window.currentCurrency || 'USD';
  window.currentCurrency = curr;
  localStorage.setItem('geohogar_currency', curr);
  
  const oldRate = window.exchangeRates[oldCurr] || 1;
  const newRate = window.exchangeRates[curr] || 1;
  
  const pminInput = document.getElementById('f-pmin');
  if (pminInput && pminInput.value) {
    const pminUsd = parseFloat(pminInput.value) / oldRate;
    pminInput.value = Math.round(pminUsd * newRate);
  }
  
  const pmaxInput = document.getElementById('f-pmax');
  if (pmaxInput && pmaxInput.value) {
    const pmaxUsd = parseFloat(pmaxInput.value) / oldRate;
    pmaxInput.value = Math.round(pmaxUsd * newRate);
  }

  if (typeof window.applyGlobalState === 'function') {
    window.applyGlobalState(document);
  }

  const props = window.appData?.properties;

  if (typeof window.applyExploreFilters === 'function') {
    window.applyExploreFilters();
  }

  if (typeof window.renderMapMarkers === 'function' && props) {
    window.renderMapMarkers(props);
  }

  if (typeof window.updateAnalytics === 'function' && props) {
    window.updateAnalytics(props);
  }

  if (typeof window.updateNeighborhoodRanking === 'function' && props) {
    window.updateNeighborhoodRanking(props, window._rankViewMode || 'neighborhood');
  }

  if (typeof window.renderValuationTab === 'function') {
    window.renderValuationTab();
  }

  window.dispatchEvent(new Event('currencyChanged'));
  document.dispatchEvent(new CustomEvent('geohogar:currency:changed', { detail: { currency: curr } }));
};

// Formateador global de precios
window.formatPrice = function(usdValue) {
  if (!usdValue || isNaN(usdValue)) return '';
  const rate = window.exchangeRates[window.currentCurrency] || 1;
  const symbol = window.currencySymbols[window.currentCurrency] || 'US$';
  const converted = Math.round(usdValue * rate);
  
  // Dar formato con separador de miles
  return `${symbol} ${converted.toLocaleString('es-PY')}`;
};

// Formateador global de precios por metro cuadrado
window.formatPriceM2 = function(usdValueM2) {
  if (!usdValueM2 || isNaN(usdValueM2)) return '';
  const rate = window.exchangeRates[window.currentCurrency] || 1;
  const symbol = window.currencySymbols[window.currentCurrency] || 'US$';
  const converted = Math.round(usdValueM2 * rate);
  return `${symbol} ${converted.toLocaleString('es-PY')}/m²`;
};

window.fetchLiveExchangeRates = async function() {
  try {
    const cached = localStorage.getItem('geohogar_live_rates');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - (parsed.timestamp || 0) < 3600000 && parsed.rates) {
        Object.assign(window.exchangeRates, parsed.rates);
      }
    }
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        window.exchangeRates.PYG = Math.round(data.rates.PYG || 7550);
        window.exchangeRates.BRL = parseFloat((data.rates.BRL || 5.5).toFixed(2));
        localStorage.setItem('geohogar_live_rates', JSON.stringify({
          rates: window.exchangeRates,
          timestamp: Date.now()
        }));
        console.log("Cotización de divisas en vivo sincronizada:", window.exchangeRates);
        if (typeof window.changeCurrency === 'function') {
          window.changeCurrency(window.currentCurrency);
        }
      }
    }
  } catch (err) {
    console.warn("Sincronización en vivo de divisas fallback a tasa de referencia:", err);
  }
};

// Escuchador de eventos inicial de la UI
document.addEventListener('DOMContentLoaded', () => {
  window.fetchLiveExchangeRates();
  // Inicializar estado visual
  window.changeCurrency(window.currentCurrency);
  
  const setupCurrencyDropdown = (btnId, dropdownId) => {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);
    if (!btn || !dropdown) return;
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Cerrar otros dropdowns si existen
      document.querySelectorAll('.curr-dropdown.show, .lang-dropdown.show').forEach(d => {
        if(d !== dropdown) d.classList.remove('show');
      });
      document.querySelectorAll('.curr-btn, .lang-btn').forEach(b => {
        if(b !== btn) b.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.lang-selector').forEach(s => {
        s.classList.remove('active');
      });
      
      btn.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('show');
    });

    dropdown.querySelectorAll('.curr-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const curr = opt.getAttribute('data-curr');
        window.changeCurrency(curr);
        
        dropdown.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  };

  setupCurrencyDropdown('sidebar-curr-btn', 'sidebar-curr-dropdown');
  setupCurrencyDropdown('topbar-curr-btn', 'topbar-curr-dropdown');

  // Cerrar al hacer click afuera
  document.addEventListener('click', () => {
    document.querySelectorAll('.curr-dropdown').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.curr-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });
});
