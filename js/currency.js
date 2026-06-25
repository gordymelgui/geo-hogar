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
  window.currentCurrency = curr;
  localStorage.setItem('geohogar_currency', curr);
  
  // Actualizar todos los selectores visuales de moneda en la UI
  document.querySelectorAll('.current-curr-text').forEach(el => {
    el.textContent = curr;
  });

  // Re-renderizar las propiedades en la vista Explorar
  if (window.applyExploreFilters) {
    window.applyExploreFilters();
  }
  
  // Re-renderizar los marcadores en el mapa
  if (window.renderMapMarkers && window.appData && window.appData.properties) {
    window.renderMapMarkers(window.appData.properties);
  }
  
  // Disparar evento para otras lógicas (como gráficos)
  window.dispatchEvent(new Event('currencyChanged'));
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

// Escuchador de eventos inicial de la UI
document.addEventListener('DOMContentLoaded', () => {
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
