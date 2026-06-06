// Activity Logs & Notifications Screen Module
import { store } from '../store.js';

export default {
  render(container) {
    const user = store.getCurrentUser();
    if (!user) return;

    // Automatically mark notifications as read when opening this screen
    store.markNotificationsRead();

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Activity Audit Logs</h1>
            <p>Full auditing trail for compliance checking, notification feeds, and database actions.</p>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Left side: Notification alerts feed -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent System Notifications</h3>
            </div>
            <div class="card-body">
              <div id="notifications-container" style="display: flex; flex-direction: column; gap: 12px;">
                <!-- Renders notifications dynamically -->
              </div>
            </div>
          </div>

          <!-- Right side: Centralized audit trail -->
          <div class="card">
            <div class="card-header" style="flex-direction: column; align-items: stretch; gap: 12px; padding: 16px 24px;">
              <h3 class="card-title">Security & Sourcing Audit Trail</h3>
              <input type="text" id="log-search" class="form-control" placeholder="Filter audit stream (e.g. 'PO', 'Elena', 'Login')...">
            </div>
            <div class="card-body" style="padding: 0;">
              <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
                <table class="table">
                  <thead>
                    <tr>
                      <th style="width: 140px;">Timestamp</th>
                      <th>Action Type</th>
                      <th>Actor</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody id="logs-tbody">
                    <!-- Logs dynamically loaded -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderNotifications(container, user);
    this.renderLogsList(container);

    // Bind log search filter
    container.querySelector('#log-search').addEventListener('input', () => {
      this.renderLogsList(container);
    });
  },

  renderNotifications(container, user) {
    const notifyContainer = container.querySelector('#notifications-container');
    const allNotifications = store.getNotifications();

    // Filter notifications based on role
    const filtered = allNotifications.filter(n => {
      if (!n.targetRole) return true; // global
      if (n.targetRole === user.role) {
        if (user.role === 'vendor') {
          return n.targetVendorId === user.vendorId;
        }
        return true;
      }
      return false;
    });

    if (filtered.length === 0) {
      notifyContainer.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 40px;">No recent notifications.</div>`;
      return;
    }

    notifyContainer.innerHTML = filtered.map(n => `
      <div style="background-color: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; display: flex; align-items: flex-start; gap: 12px;">
        <div style="width: 24px; height: 24px; border-radius: 50%; background-color: var(--color-primary-glow); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">
          🔔
        </div>
        <div style="flex: 1;">
          <p style="font-size: 13px; color: var(--text-white); font-weight: 500; line-height: 1.4;">${n.text}</p>
          <span style="font-size: 10px; color: var(--text-dim); margin-top: 4px; display: block;">${n.date}</span>
        </div>
      </div>
    `).join('');
  },

  renderLogsList(container) {
    const query = container.querySelector('#log-search').value.toLowerCase();
    const tbody = container.querySelector('#logs-tbody');
    const logs = store.getActivityLogs();

    const filtered = logs.filter(l => {
      const userStr = l.user ? String(l.user).toLowerCase() : '';
      const actionStr = l.action ? String(l.action).toLowerCase() : '';
      const detailsStr = l.details ? String(l.details).toLowerCase() : '';
      const dateStr = l.date ? String(l.date).toLowerCase() : '';

      return userStr.includes(query) || 
             actionStr.includes(query) || 
             detailsStr.includes(query) ||
             dateStr.includes(query);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-dim); padding: 30px;">No audit records match query.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(l => `
      <tr>
        <td style="font-size: 12px; color: var(--text-dim); font-family: monospace;">${l.date}</td>
        <td><strong style="color: var(--color-primary); font-size: 13px;">${l.action}</strong></td>
        <td style="font-size: 13px;">${l.user}</td>
        <td style="font-size: 13px; color: var(--text-muted);">${l.details}</td>
      </tr>
    `).join('');
  }
};
