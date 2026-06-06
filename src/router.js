// Hash-based Client-Side Router for VendorBridge ERP
import { store } from './store.js';

// Define route permissions: default is open if authenticated
const routes = {
  '#login': { role: [], guestOnly: true },
  '#dashboard': { role: ['admin', 'officer', 'manager', 'vendor'] },
  '#vendors': { role: ['admin', 'officer', 'manager'] },
  '#rfqs': { role: ['officer', 'vendor'] },
  '#quotations': { role: ['vendor'] },
  '#comparison': { role: ['officer', 'admin'] },
  '#approvals': { role: ['manager'] },
  '#documents': { role: ['officer', 'vendor', 'manager', 'admin'] },
  '#logs': { role: ['admin', 'officer'] },
  '#reports': { role: ['admin', 'manager', 'officer'] }
};

export const router = {
  currentRoute: '',
  currentParams: {},

  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    
    // Initial routing
    if (!window.location.hash) {
      window.location.hash = '#dashboard';
    } else {
      this.handleRouting();
    }
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  parseHash(hashString) {
    const parts = hashString.split('?');
    const route = parts[0];
    const params = {};

    if (parts[1]) {
      const searchParams = new URLSearchParams(parts[1]);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    return { route, params };
  },

  async handleRouting() {
    const hash = window.location.hash || '#dashboard';
    const { route, params } = this.parseHash(hash);
    
    const user = store.getCurrentUser();
    const routeConfig = routes[route];

    // 1. Check if route exists
    if (!routeConfig) {
      window.location.hash = '#dashboard';
      return;
    }

    // 2. Guest Guard (redirect to dashboard if logged in and try to access login)
    if (routeConfig.guestOnly && user) {
      window.location.hash = '#dashboard';
      return;
    }

    // 3. Auth Guard (redirect to login if not logged in)
    if (!routeConfig.guestOnly && !user) {
      window.location.hash = '#login';
      return;
    }

    // 4. Role Guard (check permissions)
    if (user && routeConfig.role.length > 0 && !routeConfig.role.includes(user.role)) {
      alert(`Access Denied: Your role '${user.role}' does not have permission to access ${route}.`);
      window.location.hash = '#dashboard';
      return;
    }

    this.currentRoute = route;
    this.currentParams = params;

    // Trigger page render callback
    window.dispatchEvent(new CustomEvent('router:change', {
      detail: { route, params }
    }));
  }
};
