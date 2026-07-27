import { renderExploreView } from '../views/explore.js';
import { renderMapView } from '../views/map.js';
import { renderFavoritesView } from '../views/favorites.js';
import { renderMessagesView } from '../views/messages.js';
import { renderPublishView } from '../views/publish.js';
import { renderAlertsView } from '../views/alerts.js';
import { renderAnalyticsView } from '../views/analytics.js';
import { renderBrokerView } from '../views/broker.js';
import { renderAcademyView } from '../views/academy.js';
import { renderGlossaryView } from '../views/glossary.js';

const routes = {
  'explore': renderExploreView,
  'map': renderMapView,
  'favorites': renderFavoritesView,
  'messages': renderMessagesView,
  'publish': renderPublishView,
  'alerts': renderAlertsView,
  'analytics': renderAnalyticsView,
  'broker': renderBrokerView,
  'academy': renderAcademyView,
  'glossary': renderGlossaryView
};

export class Router {
  constructor(rootContainerId) {
    this.root = document.getElementById(rootContainerId);
    this.init();
  }

  init() {
    // Interceptar clics en enlaces de la sidebar y bottom nav
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('.sidebar-link, .bottom-nav-btn');
      if (link && link.dataset.view) {
        const viewName = link.dataset.view;
        if (routes[viewName]) {
          e.preventDefault();
          this.navigate(viewName);
          
          // Actualizar UI activa en navegación
          document.querySelectorAll('.sidebar-link, .bottom-nav-btn').forEach(el => el.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });

    // Cargar la vista inicial por defecto si existe el contenedor
    if (this.root) {
      this.navigate('explore');
    }
  }

  navigate(viewName) {
    const renderFn = routes[viewName];
    if (renderFn && this.root) {
      // 1. Limpiar contenedor e inyectar nuevo HTML
      this.root.innerHTML = renderFn();

      // Asegurar que la vista inyectada tenga la clase active y sea visible
      const injectedView = this.root.firstElementChild;
      if (injectedView) {
        injectedView.classList.add('active');
        if (injectedView.style.display === 'none') {
          injectedView.style.display = 'block';
        }
      }
      
      // 2. ESTADO GLOBAL REACTIVO: Aplicar idioma y moneda inmediatamente a la vista inyectada
      if (typeof window.applyGlobalState === 'function') {
        window.applyGlobalState(this.root);
      }

      // 3. CICLO DE VIDA: Emitir evento global para que ui.js reconecte los listeners
      window.dispatchEvent(new CustomEvent(`view:${viewName}:loaded`));
    }
  }
}

// Robust auto-initialization handling both loading & already-loaded DOM states
function initAppRouter() {
  if (!window.appRouter) {
    window.appRouter = new Router('router-view-container');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAppRouter);
} else {
  initAppRouter();
}
