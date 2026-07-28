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
    let targetView = routes[viewName] ? viewName : 'explore';
    
    // SECURITY CHECK: Prevent unauthorized access to Premium views (Single Source of Truth)
    const premiumRoutes = ['broker', 'analytics'];
    if (premiumRoutes.includes(targetView)) {
      const isPremium = !!(window.currentUserProfile && window.currentUserProfile.isPremium);
      if (!isPremium) {
        if (typeof window.enforcePremiumAccess === 'function') {
          window.enforcePremiumAccess();
        } else if (typeof window.showPremiumPaywall === 'function') {
          window.showPremiumPaywall();
        }
        if (typeof window.resetToHomeView === 'function') {
          window.resetToHomeView();
        }
        return; // Halt navigation entirely
      }
    }

    const renderFn = routes[targetView];
    if (renderFn && this.root) {
      // Topbar search bar is ONLY visible on Explore & Map
      const searchBar = document.getElementById('main-search-bar');
      if (searchBar) {
        const isSearchable = (targetView === 'explore' || targetView === 'map');
        searchBar.style.display = isSearchable ? 'flex' : 'none';
      }

      this.root.innerHTML = renderFn();

      const injectedView = this.root.firstElementChild;
      if (injectedView) {
        injectedView.classList.add('active');
        if (injectedView.style.display === 'none') {
          injectedView.style.display = 'block';
        }
      }
      
      if (typeof window.applyGlobalState === 'function') {
        window.applyGlobalState(this.root);
      }

      window.dispatchEvent(new CustomEvent(`view:${targetView}:loaded`));
    }
  }
}

window.resetToHomeView = function() {
  if (window.appRouter && typeof window.appRouter.navigate === 'function') {
    window.appRouter.navigate('explore');
  }

  document.querySelectorAll('.sidebar-link, .bottom-nav-btn').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.view === 'explore' || el.getAttribute('href') === '#explore') {
      el.classList.add('active');
    }
  });

  const searchBar = document.getElementById('main-search-bar');
  if (searchBar) searchBar.style.display = 'flex';

  document.querySelectorAll('.sidebar-settings-accordion').forEach(el => el.removeAttribute('open'));

  const globalSearch = document.getElementById('global-search');
  if (globalSearch) globalSearch.value = '';

  window.scrollTo({ top: 0, behavior: 'instant' });
};

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
