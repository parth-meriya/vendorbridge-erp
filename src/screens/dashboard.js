// Dashboard Screen Module
import { store } from '../store.js';

export default {
  render(container) {
    const user = store.getCurrentUser();
    if (!user) return;

    // Get statistics based on role
    const vendors = store.getVendors();
    const rfqs = store.getRFQs();
    const quotes = store.getQuotations();
    const pos = store.getPurchaseOrders();
    const invoices = store.getInvoices();

    let dashboardContent = '';

    if (user.role === 'officer') {
      dashboardContent = this.renderOfficerDashboard(user, rfqs, vendors, pos, quotes);
    } else if (user.role === 'vendor') {
      dashboardContent = this.renderVendorDashboard(user, rfqs, pos, invoices, quotes);
    } else if (user.role === 'manager') {
      dashboardContent = this.renderManagerDashboard(user, rfqs, pos, vendors);
    } else if (user.role === 'admin') {
      dashboardContent = this.renderAdminDashboard(user, vendors, rfqs, store.getActivityLogs());
    }

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Welcome Back, ${user.name}</h1>
            <p>${user.title} • Procurement Command Center</p>
          </div>
          <div class="page-header-actions">
            ${this.getQuickActionButton(user.role)}
          </div>
        </div>

        ${dashboardContent}
      </div>
    `;

    this.bindEvents(container, user.role);
  },

  getQuickActionButton(role) {
    if (role === 'officer') {
      return `<a href="#rfqs" class="btn btn-primary">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
                Create New RFQ
              </a>`;
    }
    if (role === 'vendor') {
      return `<a href="#rfqs" class="btn btn-primary">View Assigned RFQs</a>`;
    }
    if (role === 'manager') {
      return `<a href="#approvals" class="btn btn-primary">View Approvals Inbox</a>`;
    }
    if (role === 'admin') {
      return `<a href="#vendors" class="btn btn-primary">Manage Registered Vendors</a>`;
    }
    return '';
  },

  renderOfficerDashboard(user, rfqs, vendors, pos, quotes) {
    const activeRFQs = rfqs.filter(r => r.status === 'Active' || r.status === 'Under Comparison').length;
    const pendingApprovals = rfqs.filter(r => r.status === 'In Approval').length;
    const activeVendors = vendors.filter(v => v.status === 'Active').length;
    const recentPOs = pos.slice(0, 5);
    const activeRFQsList = rfqs.filter(r => r.status === 'Active' || r.status === 'Under Comparison').slice(0, 5);

    return `
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span>ACTIVE RFQs</span>
            <div class="metric-icon-box primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${activeRFQs}</span>
          <div class="metric-change positive">Active Sourcing Cycles</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>IN APPROVAL</span>
            <div class="metric-icon-box warning">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5 .5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${pendingApprovals}</span>
          <div class="metric-change neutral">Awaiting Manager Signoff</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>ACTIVE VENDORS</span>
            <div class="metric-icon-box success">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m16-10a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${activeVendors}</span>
          <div class="metric-change positive">Qualified Partners</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>TOTAL PO VALUE</span>
            <div class="metric-icon-box info">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">₹${pos.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          <div class="metric-change positive">Approved Spend</div>
        </div>
      </div>

      <!-- Main Panels -->
      <div class="dashboard-grid">
        <!-- Panel 1: Sourcing pipeline -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Active Sourcing Pipelines</h3>
            <a href="#rfqs" style="font-size: 13px;">View All</a>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>RFQ Title</th>
                    <th>Submissions</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeRFQsList.length === 0 ? '<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No active RFQs. Create one to begin.</td></tr>' : 
                    activeRFQsList.map(r => {
                      const rfqQuotes = quotes.filter(q => q.rfqId === r.id);
                      return `
                        <tr>
                          <td><strong>${r.id}</strong></td>
                          <td>${r.title}</td>
                          <td>${rfqQuotes.length} / ${r.assignedVendors.length} submitted</td>
                          <td>${r.deadline}</td>
                          <td><span class="badge ${r.status === 'Active' ? 'badge-active' : 'badge-comparison'}">${r.status}</span></td>
                          <td>
                            ${r.status === 'Under Comparison' 
                              ? `<a href="#comparison?rfqId=${r.id}" class="btn btn-secondary btn-sm">Compare Quotes</a>`
                              : `<span style="color: var(--text-dim); font-size: 12px;">Waiting for Quotes</span>`
                            }
                          </td>
                        </tr>
                      `;
                    }).join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Panel 2: Recent POs list -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Purchase Orders</h3>
            <a href="#documents" style="font-size: 13px;">View All</a>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${recentPOs.length === 0 ? '<div style="text-align: center; color: var(--text-dim); padding: 20px;">No purchase orders generated.</div>' : 
                recentPOs.map(po => `
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 12px;">
                    <div>
                      <div style="font-weight: 600; font-size: 14px;"><a href="#documents?poId=${po.id}">${po.id}</a></div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Vendor: ${po.vendorName}</div>
                      <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Date: ${po.date}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: 700; font-size: 14px; color: var(--text-white);">₹${po.totalAmount.toFixed(2)}</div>
                      <span class="badge badge-active" style="font-size: 9px; padding: 2px 6px; margin-top: 4px;">${po.status}</span>
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderVendorDashboard(user, rfqs, pos, invoices, quotes) {
    const myVendorId = user.vendorId;
    const vendorQuotes = quotes.filter(q => q.vendorId === myVendorId);
    const vendorPOs = pos.filter(p => p.vendorId === myVendorId);
    const vendorInvoices = invoices.filter(i => i.vendorId === myVendorId);
    const assignedRFQs = rfqs.filter(r => r.assignedVendors.includes(myVendorId) && (r.status === 'Active' || r.status === 'Under Comparison'));

    const pendingBids = assignedRFQs.filter(r => !vendorQuotes.some(q => q.rfqId === r.id)).length;
    const activePOs = vendorPOs.filter(p => p.status === 'Sent').length;
    const unpaidInvoices = vendorInvoices.filter(i => i.status === 'Unpaid').length;

    return `
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span>RFQ INVITATIONS</span>
            <div class="metric-icon-box primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"></path></svg>
            </div>
          </div>
          <span class="metric-value">${assignedRFQs.length}</span>
          <div class="metric-change warning">${pendingBids} Awaiting Your Quotation</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>ACTIVE POs</span>
            <div class="metric-icon-box success">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
          </div>
          <span class="metric-value">${activePOs}</span>
          <div class="metric-change positive">Purchase Orders to Invoice</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>UNPAID INVOICES</span>
            <div class="metric-icon-box danger">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${unpaidInvoices}</span>
          <div class="metric-change negative">Awaiting Payment Settlement</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>TOTAL SALES INVOICED</span>
            <div class="metric-icon-box info">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">₹${vendorInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          <div class="metric-change positive">Life-time Revenue</div>
        </div>
      </div>

      <!-- Main Panels -->
      <div class="dashboard-grid">
        <!-- Assigned RFQs -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Assigned Sourcing RFQs</h3>
            <a href="#rfqs" style="font-size: 13px;">View All</a>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Title</th>
                    <th>Deadline</th>
                    <th>Your Quote Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${assignedRFQs.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 20px;">No active RFQ assignments.</td></tr>' : 
                    assignedRFQs.map(r => {
                      const quote = vendorQuotes.find(q => q.rfqId === r.id);
                      return `
                        <tr>
                          <td><strong>${r.id}</strong></td>
                          <td>${r.title}</td>
                          <td>${r.deadline}</td>
                          <td>
                            ${quote 
                              ? `<span class="badge badge-active" style="background-color: rgba(16,185,129,0.15); color: var(--color-success)">Submitted (₹${quote.subtotal.toFixed(2)})</span>` 
                              : `<span class="badge badge-pending">Awaiting Bid</span>`
                            }
                          </td>
                          <td>
                            ${quote 
                              ? `<a href="#quotations?rfqId=${r.id}" class="btn btn-secondary btn-sm">Edit Quote</a>`
                              : `<a href="#quotations?rfqId=${r.id}" class="btn btn-primary btn-sm">Submit Quotation</a>`
                            }
                          </td>
                        </tr>
                      `;
                    }).join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Active POs -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Purchase Orders Awaiting Invoicing</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${vendorPOs.filter(po => po.status === 'Sent').length === 0 ? '<div style="text-align: center; color: var(--text-dim); padding: 20px;">No pending POs to invoice.</div>' : 
                vendorPOs.filter(po => po.status === 'Sent').map(po => `
                  <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; background-color: rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <span style="font-weight: 700; color: var(--text-white); font-size: 14px;">${po.id}</span>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Project: ${po.rfqTitle}</div>
                      </div>
                      <div style="font-weight: 700; color: var(--text-white);">₹${po.totalAmount.toFixed(2)}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border-color);">
                      <span style="font-size: 11px; color: var(--text-dim);">Date: ${po.date}</span>
                      <button class="btn btn-primary btn-sm btn-generate-invoice" data-poid="${po.id}">Generate Invoice</button>
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderManagerDashboard(user, rfqs, pos, vendors) {
    const pendingApprovals = rfqs.filter(r => r.status === 'In Approval');
    const recentPOs = pos.slice(0, 5);
    const recentDecisions = rfqs.filter(r => r.status === 'Approved' || r.status === 'Completed' || r.status === 'Rejected').slice(0, 5);

    return `
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span>PENDING SIGN-OFFS</span>
            <div class="metric-icon-box warning">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5 .5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${pendingApprovals.length}</span>
          <div class="metric-change warning">Procurement approvals pending</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>TOTAL PURCHASE ORDERS</span>
            <div class="metric-icon-box success">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
          </div>
          <span class="metric-value">${pos.length}</span>
          <div class="metric-change positive">Issued Orders</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>CONTRACTED SPEND</span>
            <div class="metric-icon-box info">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">₹${pos.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          <div class="metric-change positive">Total Approved Budget</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>REGISTERED VENDORS</span>
            <div class="metric-icon-box primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m16-10a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${vendors.length}</span>
          <div class="metric-change neutral">Active & Pending vendor profiles</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Pending Approvals Inbox -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pending Approvals Inbox</h3>
            <a href="#approvals" style="font-size: 13px;">View All Inbox</a>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Project Description</th>
                    <th>Submitted By</th>
                    <th>Target Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingApprovals.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 20px;">Inbox is empty. No approvals pending.</td></tr>' : 
                    pendingApprovals.map(r => {
                      const selectedQuote = store.getQuotations().find(q => q.id === r.selectedQuotationId);
                      const estVal = selectedQuote ? selectedQuote.subtotal * 1.18 : 0; // estimate with tax
                      return `
                        <tr>
                          <td><strong>${r.id}</strong></td>
                          <td>
                            <div style="font-weight: 600;">${r.title}</div>
                            <div style="font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">Vendor Selected: ${selectedQuote?.vendorName || 'Unknown'}</div>
                          </td>
                          <td>${r.createdBy}</td>
                          <td><strong>₹${estVal.toFixed(2)}</strong></td>
                          <td>
                            <a href="#approvals?rfqId=${r.id}" class="btn btn-primary btn-sm">Review & Sign</a>
                          </td>
                        </tr>
                      `;
                    }).join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Approvals log -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Workflow Decisions</h3>
            <a href="#approvals" style="font-size: 13px;">View All</a>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${recentDecisions.length === 0 ? '<div style="text-align: center; color: var(--text-dim); padding: 20px;">No decisions made yet.</div>' : 
                recentDecisions.map(r => `
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 12px;">
                    <div>
                      <div style="font-weight: 600; font-size: 14px;"><a href="#approvals?rfqId=${r.id}">${r.id}</a></div>
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Project: ${r.title}</div>
                      <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Action by: ${user.name}</div>
                    </div>
                    <div style="text-align: right;">
                      <span class="badge ${r.status === 'Rejected' ? 'badge-suspended' : 'badge-completed'}" style="font-size: 9px; padding: 2px 6px; margin-top: 4px;">${r.status === 'Rejected' ? 'Declined' : 'Approved'}</span>
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminDashboard(user, vendors, rfqs, logs) {
    const pendingVendors = vendors.filter(v => v.status === 'Pending');
    const recentLogs = logs.slice(0, 8);

    return `
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span>TOTAL VENDORS</span>
            <div class="metric-icon-box primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m16-10a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${vendors.length}</span>
          <div class="metric-change warning">${pendingVendors.length} Profiles Pending Review</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>TOTAL RFQs ISSUED</span>
            <div class="metric-icon-box success">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path></svg>
            </div>
          </div>
          <span class="metric-value">${rfqs.length}</span>
          <div class="metric-change positive">System RFQ Records</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>ACTIVE SECURITY RULES</span>
            <div class="metric-icon-box info">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5 .5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
          </div>
          <span class="metric-value">4 Roles</span>
          <div class="metric-change positive">Role-based Access Enforcement</div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span>SYSTEM HEALTH</span>
            <div class="metric-icon-box success">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
          <span class="metric-value">99.9%</span>
          <div class="metric-change positive">LocalStorage Sync OK</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Vendor Approvals Management -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">New Vendor Account Approvals</h3>
            <a href="#vendors" style="font-size: 13px;">View All Vendors</a>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                    <th>Category</th>
                    <th>GST Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingVendors.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 20px;">No pending vendor approvals.</td></tr>' : 
                    pendingVendors.map(v => `
                      <tr>
                        <td><strong>${v.id}</strong></td>
                        <td>
                          <div style="font-weight: 600;">${v.name}</div>
                          <div style="font-size: 11px; color: var(--text-muted);">${v.email}</div>
                        </td>
                        <td>${v.category}</td>
                        <td><code style="background-color: var(--bg-surface); padding: 2px 4px; border-radius: 4px; font-size: 11px;">${v.gst}</code></td>
                        <td>
                          <div style="display: flex; gap: 8px;">
                            <button class="btn btn-primary btn-sm btn-approve-vendor" data-vendorid="${v.id}" style="padding: 4px 8px; font-size: 11px;">Approve</button>
                            <button class="btn btn-danger btn-sm btn-suspend-vendor" data-vendorid="${v.id}" style="padding: 4px 8px; font-size: 11px;">Reject</button>
                          </div>
                        </td>
                      </tr>
                    `).join('')
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- System Activity logs -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Real-Time ERP Audit Stream</h3>
            <a href="#logs" style="font-size: 13px;">Full Audit Log</a>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 14px; max-height: 380px; overflow-y: auto;">
              ${recentLogs.map(log => `
                <div style="border-left: 2px solid var(--color-primary); padding-left: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <strong style="font-size: 12px; color: var(--text-white);">${log.action}</strong>
                    <span style="font-size: 9px; color: var(--text-dim);">${log.date}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${log.details}</div>
                  <div style="font-size: 9px; color: var(--color-primary); margin-top: 1px;">By: ${log.user}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, role) {
    // Vendor specific binds (e.g. Generate Invoice button)
    if (role === 'vendor') {
      container.querySelectorAll('.btn-generate-invoice').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const poId = e.currentTarget.getAttribute('data-poid');
          const res = store.generateInvoice(poId);
          if (res.success) {
            alert(`Invoice ${res.invoice.id} has been generated successfully for PO ${poId}.`);
            window.location.hash = `#documents?invoiceId=${res.invoice.id}`;
          } else {
            alert(`Error: ${res.error}`);
          }
        });
      });
    }

    // Admin specific binds
    if (role === 'admin') {
      container.querySelectorAll('.btn-approve-vendor').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const vId = e.currentTarget.getAttribute('data-vendorid');
          store.updateVendorStatus(vId, 'Active');
          this.render(container); // rerender screen
        });
      });

      container.querySelectorAll('.btn-suspend-vendor').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const vId = e.currentTarget.getAttribute('data-vendorid');
          store.updateVendorStatus(vId, 'Suspended');
          this.render(container); // rerender screen
        });
      });
    }
  }
};

