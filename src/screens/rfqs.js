// RFQ Creation & Listing Screen Module
import { store } from '../store.js';

export default {
  render(container) {
    const user = store.getCurrentUser();
    if (!user) return;

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Request for Quotations (RFQ)</h1>
            <p>Initiate sourcing cycles, manage dynamic specs, and track vendor invitations.</p>
          </div>
          <div class="page-header-actions" id="rfq-actions-container">
            <!-- Dynamic header buttons based on role & view -->
          </div>
        </div>

        <div id="rfq-content-area">
          <!-- Views toggled between List and Create form -->
        </div>
      </div>
    `;

    this.showRFQList(container, user);
  },

  showRFQList(container, user) {
    const rfqContentArea = container.querySelector('#rfq-content-area');
    const actionContainer = container.querySelector('#rfq-actions-container');
    const rfqs = store.getRFQs();
    const vendors = store.getVendors();
    const quotes = store.getQuotations();

    // Setup action buttons in header
    if (user.role === 'officer') {
      actionContainer.innerHTML = `
        <button class="btn btn-primary" id="btn-show-create-rfq">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
          Issue New RFQ
        </button>
      `;
      container.querySelector('#btn-show-create-rfq').addEventListener('click', () => {
        this.showCreateRFQForm(container, user);
      });
    } else {
      actionContainer.innerHTML = '';
    }

    // Filter RFQs based on role
    let displayedRFQs = rfqs;
    if (user.role === 'vendor') {
      // Vendors only see RFQs they are invited to
      displayedRFQs = rfqs.filter(r => r.assignedVendors.includes(user.vendorId));
    }

    rfqContentArea.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${user.role === 'vendor' ? 'My Sourcing Assignments' : 'Sourcing Pipelines'}</h3>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>RFQ ID</th>
                  <th>RFQ Title</th>
                  <th>Invited Vendors</th>
                  <th>Quotations</th>
                  <th>Deadline Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${displayedRFQs.length === 0 ? '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">No RFQs found in your directory.</td></tr>' : 
                  displayedRFQs.map(r => {
                    const rfqQuotes = quotes.filter(q => q.rfqId === r.id);
                    const vendorAssignedList = r.assignedVendors.map(vId => vendors.find(v => v.id === vId)?.name || vId).join(', ');
                    
                    let actionButton = '';
                    if (user.role === 'officer') {
                      if (r.status === 'Under Comparison') {
                        actionButton = `<a href="#comparison?rfqId=${r.id}" class="btn btn-secondary btn-sm">Compare Quotes</a>`;
                      } else if (r.status === 'In Approval') {
                        actionButton = `<span style="font-size: 11px; color: var(--text-warning); font-weight: 500;">In Approval Workflow</span>`;
                      } else if (r.status === 'Approved') {
                        // Check if invoice generated or PO generated
                        const po = store.getPurchaseOrders().find(p => p.rfqId === r.id);
                        if (po) {
                          actionButton = `<a href="#documents?poId=${po.id}" class="btn btn-secondary btn-sm">View PO</a>`;
                        } else {
                          actionButton = `<span style="font-size: 11px; color: var(--text-success); font-weight: 500;">Approved</span>`;
                        }
                      } else if (r.status === 'Completed') {
                        const inv = store.getInvoices().find(i => i.rfqId === r.id);
                        if (inv) {
                          actionButton = `<a href="#documents?invoiceId=${inv.id}" class="btn btn-secondary btn-sm">View Invoice</a>`;
                        } else {
                          actionButton = `<span style="font-size: 11px; color: var(--text-dim);">Completed</span>`;
                        }
                      } else {
                        actionButton = `<span style="font-size: 11px; color: var(--text-dim);">Awaiting Submissions</span>`;
                      }
                    } else if (user.role === 'vendor') {
                      const hasQuote = rfqQuotes.find(q => q.vendorId === user.vendorId);
                      if (r.status === 'Active') {
                        actionButton = `<a href="#quotations?rfqId=${r.id}" class="btn ${hasQuote ? 'btn-secondary' : 'btn-primary'} btn-sm">
                          ${hasQuote ? 'Edit Quotation' : 'Submit Quotation'}
                        </a>`;
                      } else {
                        actionButton = `<span style="font-size: 11px; color: var(--text-dim);">${r.status} (Bidding Closed)</span>`;
                      }
                    }

                    return `
                      <tr>
                        <td><strong>${r.id}</strong></td>
                        <td>
                          <div style="font-weight: 600; color: var(--text-white);">${r.title}</div>
                          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${r.description}</div>
                          <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Items: ${r.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</div>
                        </td>
                        <td>
                          <div style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px;" title="${vendorAssignedList}">
                            ${vendorAssignedList}
                          </div>
                        </td>
                        <td>${rfqQuotes.length} / ${r.assignedVendors.length}</td>
                        <td>${r.deadline}</td>
                        <td><span class="badge ${
                          r.status === 'Active' ? 'badge-active' : 
                          r.status === 'Under Comparison' ? 'badge-comparison' : 
                          r.status === 'In Approval' ? 'badge-pending' : 
                          r.status === 'Completed' ? 'badge-completed' : 'badge-draft'
                        }">${r.status}</span></td>
                        <td>${actionButton}</td>
                      </tr>
                    `;
                  }).join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  showCreateRFQForm(container, user) {
    const rfqContentArea = container.querySelector('#rfq-content-area');
    const actionContainer = container.querySelector('#rfq-actions-container');
    const activeVendors = store.getVendors().filter(v => v.status === 'Active');

    // Update Header Actions to show back button
    actionContainer.innerHTML = `
      <button class="btn btn-secondary" id="btn-back-to-rfq-list">
        Back to Directory
      </button>
    `;
    container.querySelector('#btn-back-to-rfq-list').addEventListener('click', () => {
      this.showRFQList(container, user);
    });

    rfqContentArea.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Initiate Request for Quotation</h3>
        </div>
        <div class="card-body">
          <form id="create-rfq-form">
            <div class="form-group">
              <label for="rfq-title">RFQ Project Title</label>
              <input type="text" id="rfq-title" class="form-control" placeholder="e.g. Annual Raw Steel Sourcing Q3" required>
            </div>
            <div class="form-group">
              <label for="rfq-description">Detailed Description & Project Guidelines</label>
              <textarea id="rfq-description" class="form-control" rows="3" placeholder="Enter instructions, specifications, delivery expectations..." required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group" style="grid-column: span 2;">
                <label for="rfq-deadline">Response Submission Deadline</label>
                <input type="date" id="rfq-deadline" class="form-control" required>
              </div>
            </div>

            <!-- Dynamic Line Items Section -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
              <h4 style="font-size: 14px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;">RFQ Line Items</h4>
              <div id="rfq-items-rows-container">
                <!-- Dynamically added item rows -->
                <div class="form-row item-row" style="margin-bottom: 12px;" data-row-idx="0">
                  <div class="form-group" style="flex: 2; margin: 0;">
                    <input type="text" class="form-control item-name" placeholder="Item/Service Name" required>
                  </div>
                  <div class="form-group" style="width: 100px; margin: 0;">
                    <input type="number" class="form-control item-qty" placeholder="Qty" min="1" required>
                  </div>
                  <div class="form-group" style="flex: 2; margin: 0;">
                    <input type="text" class="form-control item-specs" placeholder="Specs (e.g. Grade, Size)">
                  </div>
                  <button type="button" class="btn btn-danger btn-remove-item-row" style="padding: 10px; height: 42px;">🗑️</button>
                </div>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-add-item-row" style="margin-top: 8px;">
                + Add Another Item
              </button>
            </div>

            <!-- Vendor Assignment Section -->
            <div style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
              <h4 style="font-size: 14px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;">Assign Sourcing Vendors</h4>
              <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Select vendor representatives to invite. Invited vendors will receive dashboard bidding tasks.</p>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; max-height: 200px; overflow-y: auto; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background-color: var(--bg-input);">
                ${activeVendors.length === 0 ? '<div style="color: var(--text-dim); grid-column: span 3; text-align: center;">No active vendors found. Please register vendors first.</div>' : 
                  activeVendors.map(v => `
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px; border-radius: 4px;">
                      <input type="checkbox" class="rfq-vendor-checkbox" value="${v.id}" style="width: 16px; height: 16px;">
                      <span style="font-size: 13px; font-weight: 500;">${v.name} (${v.category})</span>
                    </label>
                  `).join('')
                }
              </div>
            </div>

            <div class="form-actions" style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
              <button type="button" class="btn btn-secondary" id="btn-cancel-create-rfq">Cancel</button>
              <button type="submit" class="btn btn-primary">Publish RFQ</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Bind forms and triggers
    const containerRows = rfqContentArea.querySelector('#rfq-items-rows-container');
    const addItemBtn = rfqContentArea.querySelector('#btn-add-item-row');
    const form = rfqContentArea.querySelector('#create-rfq-form');
    const cancelBtn = rfqContentArea.querySelector('#btn-cancel-create-rfq');

    let rowCount = 1;

    addItemBtn.addEventListener('click', () => {
      const newRow = document.createElement('div');
      newRow.className = 'form-row item-row';
      newRow.style.marginBottom = '12px';
      newRow.setAttribute('data-row-idx', rowCount);
      newRow.innerHTML = `
        <div class="form-group" style="flex: 2; margin: 0;">
          <input type="text" class="form-control item-name" placeholder="Item/Service Name" required>
        </div>
        <div class="form-group" style="width: 100px; margin: 0;">
          <input type="number" class="form-control item-qty" placeholder="Qty" min="1" required>
        </div>
        <div class="form-group" style="flex: 2; margin: 0;">
          <input type="text" class="form-control item-specs" placeholder="Specs (e.g. Grade, Size)">
        </div>
        <button type="button" class="btn btn-danger btn-remove-item-row" style="padding: 10px; height: 42px;">🗑️</button>
      `;

      newRow.querySelector('.btn-remove-item-row').addEventListener('click', () => {
        newRow.remove();
      });

      containerRows.appendChild(newRow);
      rowCount++;
    });

    // Bind remove button of initial row
    rfqContentArea.querySelectorAll('.btn-remove-item-row').forEach(b => {
      b.addEventListener('click', (e) => {
        if (rfqContentArea.querySelectorAll('.item-row').length > 1) {
          e.currentTarget.closest('.item-row').remove();
        } else {
          alert('You must include at least one item.');
        }
      });
    });

    cancelBtn.addEventListener('click', () => {
      this.showRFQList(container, user);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect items
      const itemRows = rfqContentArea.querySelectorAll('.item-row');
      const items = Array.from(itemRows).map(row => ({
        name: row.querySelector('.item-name').value.trim(),
        qty: parseInt(row.querySelector('.item-qty').value),
        specs: row.querySelector('.item-specs').value.trim()
      }));

      // Collect vendors
      const checkedVendors = Array.from(rfqContentArea.querySelectorAll('.rfq-vendor-checkbox:checked')).map(cb => cb.value);

      if (checkedVendors.length === 0) {
        alert('You must assign at least one vendor to the RFQ.');
        return;
      }

      const rfqData = {
        title: rfqContentArea.querySelector('#rfq-title').value.trim(),
        description: rfqContentArea.querySelector('#rfq-description').value.trim(),
        deadline: rfqContentArea.querySelector('#rfq-deadline').value,
        items,
        assignedVendors: checkedVendors
      };

      store.createRFQ(rfqData);
      alert('RFQ created successfully and sent to invited vendors!');
      this.showRFQList(container, user);
    });
  }
};
