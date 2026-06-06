// Main Application Entry Point
import './style.css';
import { store } from './store.js';
import { router } from './router.js';

// Import Screen Modules
import loginScreen from './screens/login.js';
import dashboardScreen from './screens/dashboard.js';
import vendorsScreen from './screens/vendors.js';
import rfqsScreen from './screens/rfqs.js';
import quotationsScreen from './screens/quotations.js';
import comparisonScreen from './screens/comparison.js';
import approvalsScreen from './screens/approvals.js';
import documentsScreen from './screens/documents.js';
import logsScreen from './screens/logs.js';
import reportsScreen from './screens/reports.js';

const screens = {
  '#login': loginScreen,
  '#dashboard': dashboardScreen,
  '#vendors': vendorsScreen,
  '#rfqs': rfqsScreen,
  '#quotations': quotationsScreen,
  '#comparison': comparisonScreen,
  '#approvals': approvalsScreen,
  '#documents': documentsScreen,
  '#logs': logsScreen,
  '#reports': reportsScreen
};

// Main DOM mounting container
const appContainer = document.getElementById('app');

// Initialize App
function initApp() {
  // Bind to router changes
  window.addEventListener('router:change', (e) => {
    const { route, params } = e.detail;
    renderLayoutAndScreen(route, params);
  });

  // Re-render layout on database store changes
  window.addEventListener('statechange', () => {
    const currentHash = window.location.hash || '#dashboard';
    const { route, params } = router.parseHash(currentHash);
    renderLayoutAndScreen(route, params);
  });

  // Start routing
  router.init();
}

// Render dynamic screen and wrapper framework
function renderLayoutAndScreen(route, params) {
  const user = store.getCurrentUser();

  // If route is login, render login screen without layout frame
  if (route === '#login') {
    appContainer.className = '';
    appContainer.innerHTML = `<div id="screen-container"></div>`;
    screens['#login'].render(document.getElementById('screen-container'));
    return;
  }

  // Ensure shell structure exists
  if (!document.querySelector('.app-shell')) {
    renderMainShell(user);
    bindShellEvents();
  }
  
  // Always update header, profile, notifications, and menu links
  updateMainShellHeaderAndSidebar(user);

  // Highlight active menu in sidebar
  document.querySelectorAll('.menu-item').forEach(item => {
    const link = item.querySelector('a');
    if (link && link.getAttribute('href') === route) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Render the specific screen inside the shell
  const screenContainer = document.getElementById('content-container');
  if (screenContainer && screens[route]) {
    screens[route].render(screenContainer, params);
  }

  // Synchronize global search highlight operations if applicable
  applyGlobalSearchFilter();
}

// Create the overall HTML dashboard grid shell
function renderMainShell(user) {
  appContainer.className = 'app-shell';
  appContainer.innerHTML = `
    <!-- Sidebar nav -->
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-white);">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path>
            <path d="M18 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4"></path>
            <circle cx="8" cy="12" r="2"></circle>
          </svg>
        </div>
        <span class="logo-text">VendorBridge</span>
      </div>
      
      <ul class="sidebar-menu" id="sidebar-menu-list">
        <!-- Rendered based on user permissions -->
      </ul>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar" id="user-avatar-initials">VB</div>
          <div class="user-info">
            <div class="user-name" id="user-display-name">Guest User</div>
            <span class="user-role-badge" id="user-display-role">Guest</span>
          </div>
          <button class="btn-logout" id="btn-logout" title="Sign Out">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Panel -->
    <main class="main-panel">
      <!-- Header bar -->
      <header class="header" style="display: flex; align-items: center; gap: 16px;">
        <button id="global-back-btn" title="Go Back" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-main); cursor: pointer; transition: all 0.2s ease;">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
        </button>
        
        <div class="header-search">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--text-dim);"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input type="text" id="global-search" placeholder="Quick search screen...">
        </div>

        <div class="header-actions">
          <!-- Evaluator Quick Switcher -->
          <div class="role-switcher-container">
            <span class="role-switcher-label">TEST ROLE:</span>
            <select class="role-switcher-select" id="role-switcher-select">
              <option value="officer">Officer (David)</option>
              <option value="vendor">Vendor (Apex)</option>
              <option value="manager">Manager (Elena)</option>
              <option value="admin">Admin (Sarah)</option>
            </select>
          </div>

          <!-- Notification Bell -->
          <div class="notification-bell" id="bell-container">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div class="bell-badge" id="bell-badge-unread" style="display: none;"></div>

            <!-- Notifications Dropdown panel -->
            <div class="notification-panel" id="header-notify-panel">
              <div class="notification-panel-header">
                <span>Alert Inbox</span>
                <span class="notification-panel-clear" id="btn-clear-notify">Mark All Read</span>
              </div>
              <div class="notification-list" id="header-notify-list">
                <!-- Loaded dynamically -->
              </div>
              <div style="padding: 10px; border-top: 1px solid var(--border-color); text-align: center;">
                <a href="#logs" style="font-size: 11px; font-weight: 600; color: var(--color-primary);">View Audit Logs</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Mount for screens -->
      <div class="content-body" id="content-container"></div>
    </main>
  `;
}

// Bind top-level buttons and dropdowns of layout
function bindShellEvents() {
  // Global Back Button
  const backBtn = document.getElementById('global-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      // Optional: Prevent going back to login if logged in
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.hash = '#dashboard';
      }
    });
    
    // Add hover effect via JS since inline styles are used
    backBtn.addEventListener('mouseenter', () => backBtn.style.backgroundColor = 'var(--bg-hover)');
    backBtn.addEventListener('mouseleave', () => backBtn.style.backgroundColor = 'var(--bg-card)');
  }

  // Logout Trigger
  document.getElementById('btn-logout').addEventListener('click', () => {
    store.logout();
    window.location.hash = '#login';
  });

  // Role Switcher change trigger
  const switcher = document.getElementById('role-switcher-select');
  switcher.addEventListener('change', (e) => {
    const targetRole = e.target.value;
    store.switchRole(targetRole);
    window.location.hash = '#dashboard';
  });

  // Notifications Bell open toggle
  const bell = document.getElementById('bell-container');
  const panel = document.getElementById('header-notify-panel');

  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('active');
  });

  // Close dropdown on click outside
  document.addEventListener('click', () => {
    panel.classList.remove('active');
  });

  panel.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent closing when clicking inside panel
  });

  // Clear notifications
  document.getElementById('btn-clear-notify').addEventListener('click', () => {
    store.markNotificationsRead();
    panel.classList.remove('active');
  });

  // Global search highlight filter hook
  document.getElementById('global-search').addEventListener('input', () => {
    applyGlobalSearchFilter();
  });
}

// Sync content elements of Header & Sidebar based on active role
function updateMainShellHeaderAndSidebar(user) {
  if (!user) return;

  // 1. Sync User Profile details
  const avatar = document.getElementById('user-avatar-initials');
  const nameDisplay = document.getElementById('user-display-name');
  const roleDisplay = document.getElementById('user-display-role');

  if (avatar) avatar.innerText = user.name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
  if (nameDisplay) nameDisplay.innerText = user.name;
  if (roleDisplay) roleDisplay.innerText = user.title;

  // Sync test switcher select value
  const switcher = document.getElementById('role-switcher-select');
  if (switcher && switcher.value !== user.role) {
    switcher.value = user.role;
  }
  
  // Hide Back button on dashboard
  const backBtn = document.getElementById('global-back-btn');
  if (backBtn) {
    if (window.location.hash === '#dashboard' || window.location.hash === '') {
      backBtn.style.display = 'none';
    } else {
      backBtn.style.display = 'flex';
    }
  }

  // 2. Sync Notifications count badge
  const unreadBadge = document.getElementById('bell-badge-unread');
  const notifyList = document.getElementById('header-notify-list');
  const notifications = store.getNotifications().filter(n => {
    if (!n.targetRole) return true;
    if (n.targetRole === user.role) {
      if (user.role === 'vendor') {
        return n.targetVendorId === user.vendorId;
      }
      return true;
    }
    return false;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  if (unreadCount > 0) {
    unreadBadge.style.display = 'block';
  } else {
    unreadBadge.style.display = 'none';
  }

  if (notifyList) {
    if (notifications.length === 0) {
      notifyList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-dim); font-size: 11px;">No alerts.</div>`;
    } else {
      notifyList.innerHTML = notifications.slice(0, 5).map(n => `
        <div class="notification-item ${!n.read ? 'unread' : ''}">
          <span class="notification-item-text">${n.text}</span>
          <span class="notification-item-date">${n.date}</span>
        </div>
      `).join('');
    }
  }

  // 3. Render Navigation items based on role
  const menuList = document.getElementById('sidebar-menu-list');
  if (menuList) {
    let menuHTML = `
      <li class="menu-item">
        <a href="#dashboard">
          <span>📊</span> Dashboard
        </a>
      </li>
    `;

    if (user.role === 'officer') {
      menuHTML += `
        <li class="menu-item">
          <a href="#vendors">
            <span>🤝</span> Vendors
          </a>
        </li>
        <li class="menu-item">
          <a href="#rfqs">
            <span>📝</span> RFQ Center
          </a>
        </li>
        <li class="menu-item">
          <a href="#documents">
            <span>📁</span> Documents Hub
          </a>
        </li>
        <li class="menu-item">
          <a href="#reports">
            <span>📈</span> Analytics
          </a>
        </li>
        <li class="menu-item">
          <a href="#logs">
            <span>🔍</span> Audit Trail
          </a>
        </li>
      `;
    } else if (user.role === 'vendor') {
      menuHTML += `
        <li class="menu-item">
          <a href="#rfqs">
            <span>📥</span> Assigned Bids
          </a>
        </li>
        <li class="menu-item">
          <a href="#documents">
            <span>💼</span> PO & Invoices
          </a>
        </li>
      `;
    } else if (user.role === 'manager') {
      menuHTML += `
        <li class="menu-item">
          <a href="#vendors">
            <span>🤝</span> Vendors
          </a>
        </li>
        <li class="menu-item">
          <a href="#approvals">
            <span>✍️</span> Sign Approvals
          </a>
        </li>
        <li class="menu-item">
          <a href="#documents">
            <span>📁</span> Sourced Documents
          </a>
        </li>
        <li class="menu-item">
          <a href="#reports">
            <span>📈</span> Spend Analytics
          </a>
        </li>
      `;
    } else if (user.role === 'admin') {
      menuHTML += `
        <li class="menu-item">
          <a href="#vendors">
            <span>🤝</span> Manage Vendors
          </a>
        </li>
        <li class="menu-item">
          <a href="#documents">
            <span>📁</span> Sourced Documents
          </a>
        </li>
        <li class="menu-item">
          <a href="#reports">
            <span>📈</span> Org Analytics
          </a>
        </li>
        <li class="menu-item">
          <a href="#logs">
            <span>🔍</span> System Audit
          </a>
        </li>
      `;
    }

    menuList.innerHTML = menuHTML;
  }
}

// Global Search highlighting functionality
function applyGlobalSearchFilter() {
  const query = document.getElementById('global-search')?.value.toLowerCase().trim();
  const content = document.getElementById('content-container');
  if (!content) return;

  // Clear previous highlights
  const previousHighlights = content.querySelectorAll('.highlighted-text');
  previousHighlights.forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.innerText), el);
    parent.normalize(); // merge text nodes
  });

  if (!query) return;

  // Function to recursively traverse DOM nodes and wrap matching text
  function highlightTextNodes(node) {
    if (node.nodeType === 3) { // Text Node
      const text = node.nodeValue;
      const index = text.toLowerCase().indexOf(query);
      if (index >= 0 && text.trim().length > 0) {
        const span = document.createElement('span');
        span.className = 'highlighted-text';
        
        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);
        
        span.innerText = match;
        
        const parent = node.parentNode;
        // Don't double highlight or highlight input fields/scripts/styles
        const tag = parent.tagName.toLowerCase();
        if (tag !== 'span' && tag !== 'script' && tag !== 'style' && tag !== 'textarea' && tag !== 'button' && tag !== 'input') {
          const beforeNode = document.createTextNode(before);
          const afterNode = document.createTextNode(after);
          
          parent.insertBefore(beforeNode, node);
          parent.insertBefore(span, node);
          parent.insertBefore(afterNode, node);
          parent.removeChild(node);
        }
      }
    } else if (node.nodeType === 1 && node.childNodes && !/(style|script)/i.test(node.tagName)) {
      // Traverse children backwards because child removal/insertion modifies children length
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        highlightTextNodes(node.childNodes[i]);
      }
    }
  }

  highlightTextNodes(content);
}

// Run the application
initApp();
