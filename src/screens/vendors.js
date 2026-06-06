// Vendor Management Screen Module
import { store } from '../store.js';

export default {
  render(container) {
    const user = store.getCurrentUser();
    if (!user) return;

    const vendors = store.getVendors();
    const categories = [...new Set(vendors.map(v => v.category))];

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Vendor Directory</h1>
            <p>Monitor status, compliance, and category ratings for registered supply chain partners.</p>
          </div>
          <div class="page-header-actions">
            ${(user.role === 'admin') 
              ? `<button class="btn btn-primary" id="btn-add-vendor-modal">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
                  Register New Vendor
                 </button>` 
              : ''
            }
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-body" style="padding: 16px 24px;">
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 250px;">
                <input type="text" id="vendor-search" class="form-control" placeholder="Search by company name, GST details, or contact person...">
              </div>
              <div style="width: 180px;">
                <select id="vendor-filter-category" class="form-control">
                  <option value="">All Categories</option>
                  ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>
              <div style="width: 180px;">
                <select id="vendor-filter-status" class="form-control">
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Vendor List Grid -->
        <div class="card">
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table" id="vendors-table">
                <thead>
                  <tr>
                    <th>Vendor ID</th>
                    <th>Company Name</th>
                    <th>Category</th>
                    <th>Compliance (GST)</th>
                    <th>Rating</th>
                    <th>Status</th>
                    ${user.role === 'admin' ? '<th>Actions</th>' : ''}
                  </tr>
                </thead>
                <tbody id="vendors-tbody">
                  <!-- Vendor list rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Register Vendor Modal (Hidden by default) -->
        <div class="modal-overlay" id="add-vendor-modal" style="display: none;">
          <div class="modal-container">
            <div class="modal-header">
              <h3 class="modal-title">Register New Vendor Profile</h3>
              <button class="modal-close" id="btn-close-vendor-modal">&times;</button>
            </div>
            <div class="modal-body">
              <form id="register-vendor-form">
                <div class="form-group">
                  <label for="reg-name">Company Name</label>
                  <input type="text" id="reg-name" class="form-control" placeholder="e.g. Apex Industrial Supplies" required>
                </div>
                <div class="form-group">
                  <label for="reg-category">Industry Category</label>
                  <select id="reg-category" class="form-control" required>
                    <option value="Industrial Equipment">Industrial Equipment</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Office Stationery & IT">Office Stationery & IT</option>
                    <option value="Logistics Services">Logistics Services</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="reg-gst">GST Identification Number (GSTIN)</label>
                  <input type="text" id="reg-gst" class="form-control" placeholder="e.g. 27AAACA1111A1Z1" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Enter a valid 15-character GSTIN format" required>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="reg-email">Business Email</label>
                    <input type="email" id="reg-email" class="form-control" placeholder="sales@vendor.com" required>
                  </div>
                  <div class="form-group">
                    <label for="reg-phone">Contact Phone</label>
                    <input type="text" id="reg-phone" class="form-control" placeholder="+1 (555) 0123" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="reg-address">Corporate Address</label>
                  <input type="text" id="reg-address" class="form-control" placeholder="Suite, Building, Street, City" required>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" id="btn-cancel-vendor-modal">Cancel</button>
                  <button type="submit" class="btn btn-primary">Submit Profile</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderVendorList(container, user.role);
    this.bindEvents(container, user.role);
  },

  renderVendorList(container, role) {
    const searchVal = container.querySelector('#vendor-search').value.toLowerCase();
    const categoryVal = container.querySelector('#vendor-filter-category').value;
    const statusVal = container.querySelector('#vendor-filter-status').value;
    const tbody = container.querySelector('#vendors-tbody');

    const filtered = store.getVendors().filter(v => {
      const matchSearch = v.name.toLowerCase().includes(searchVal) || 
                          v.gst.toLowerCase().includes(searchVal) ||
                          v.id.toLowerCase().includes(searchVal) ||
                          v.email.toLowerCase().includes(searchVal);
      const matchCategory = !categoryVal || v.category === categoryVal;
      const matchStatus = !statusVal || v.status === statusVal;

      return matchSearch && matchCategory && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${role === 'admin' ? 7 : 6}" style="text-align: center; color: var(--text-dim); padding: 30px;">No vendors found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(v => {
      const ratingStars = '★'.repeat(Math.round(v.rating)) + '☆'.repeat(5 - Math.round(v.rating));
      return `
        <tr>
          <td><strong>${v.id}</strong></td>
          <td>
            <div style="font-weight: 600; color: var(--text-white);">${v.name}</div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">
              <span>📞 ${v.phone}</span> • <span>✉️ ${v.email}</span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; font-style: italic;">📍 ${v.address}</div>
          </td>
          <td>${v.category}</td>
          <td><code style="background-color: var(--bg-surface); padding: 3px 6px; border-radius: 4px; font-size: 11px;">${v.gst}</code></td>
          <td>
            <span style="color: var(--color-warning); font-weight: 600;">${v.rating.toFixed(1)}</span>
            <span style="color: var(--color-warning); font-size: 12px; margin-left: 4px;">${ratingStars}</span>
          </td>
          <td>
            <span class="badge ${v.status === 'Active' ? 'badge-active' : v.status === 'Pending' ? 'badge-pending' : 'badge-suspended'}">
              ${v.status}
            </span>
          </td>
          ${role === 'admin' 
            ? `<td>
                <div style="display: flex; gap: 6px;">
                  ${v.status !== 'Active' ? `<button class="btn btn-primary btn-sm btn-status-activate" data-vendorid="${v.id}" style="padding: 3px 8px; font-size: 11px;">Activate</button>` : ''}
                  ${v.status !== 'Suspended' ? `<button class="btn btn-danger btn-sm btn-status-suspend" data-vendorid="${v.id}" style="padding: 3px 8px; font-size: 11px;">Suspend</button>` : ''}
                </div>
              </td>` 
            : ''
          }
        </tr>
      `;
    }).join('');

    // Rebind grid buttons since we rerendered the HTML
    this.bindGridActions(container);
  },

  bindEvents(container, role) {
    const modal = container.querySelector('#add-vendor-modal');
    const openBtn = container.querySelector('#btn-add-vendor-modal');
    const closeBtn = container.querySelector('#btn-close-vendor-modal');
    const cancelBtn = container.querySelector('#btn-cancel-vendor-modal');
    const form = container.querySelector('#register-vendor-form');

    const searchInput = container.querySelector('#vendor-search');
    const categorySelect = container.querySelector('#vendor-filter-category');
    const statusSelect = container.querySelector('#vendor-filter-status');

    // Filter Listeners
    searchInput.addEventListener('input', () => this.renderVendorList(container, role));
    categorySelect.addEventListener('change', () => this.renderVendorList(container, role));
    statusSelect.addEventListener('change', () => this.renderVendorList(container, role));

    // Modal display toggle
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    const closeModal = () => {
      modal.style.display = 'none';
      form.reset();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Register vendor form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const vendorData = {
          name: container.querySelector('#reg-name').value.trim(),
          category: container.querySelector('#reg-category').value,
          gst: container.querySelector('#reg-gst').value.trim().toUpperCase(),
          email: container.querySelector('#reg-email').value.trim(),
          phone: container.querySelector('#reg-phone').value.trim(),
          address: container.querySelector('#reg-address').value.trim()
        };

        store.registerVendor(vendorData);
        closeModal();
        this.renderVendorList(container, role); // Rerender vendor grid
      });
    }
  },

  bindGridActions(container) {
    // Activate vendor status buttons
    container.querySelectorAll('.btn-status-activate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vendorId = e.currentTarget.getAttribute('data-vendorid');
        store.updateVendorStatus(vendorId, 'Active');
        this.renderVendorList(container, store.getCurrentUser().role);
      });
    });

    // Suspend vendor status buttons
    container.querySelectorAll('.btn-status-suspend').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vendorId = e.currentTarget.getAttribute('data-vendorid');
        store.updateVendorStatus(vendorId, 'Suspended');
        this.renderVendorList(container, store.getCurrentUser().role);
      });
    });
  }
};
