// Vendor Quotation Submission Screen Module
import { store } from '../store.js';

export default {
  render(container, params) {
    const user = store.getCurrentUser();
    if (!user || user.role !== 'vendor') return;

    const rfqId = params?.rfqId;
    if (!rfqId) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">Error: No RFQ specified. Select an RFQ from the Dashboard or RFQ tab.</div></div>`;
      return;
    }

    const rfq = store.getRFQs().find(r => r.id === rfqId);
    if (!rfq) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">RFQ ${rfqId} not found.</div></div>`;
      return;
    }

    // Check if vendor is assigned
    if (!rfq.assignedVendors.includes(user.vendorId)) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">Access Denied: You are not assigned to this sourcing request.</div></div>`;
      return;
    }

    // Check if quotation already exists to toggle edit mode
    const existingQuote = store.getQuotations().find(q => q.rfqId === rfqId && q.vendorId === user.vendorId);
    const isEdit = !!existingQuote;

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>${isEdit ? 'Update Quotation' : 'Submit Quotation Response'}</h1>
            <p>Project Ref: <strong>${rfqId}</strong> • ${rfq.title}</p>
          </div>
          <div class="page-header-actions">
            <a href="#rfqs" class="btn btn-secondary">Back to RFQs</a>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- RFQ Specifications -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Sourcing Requirements</h3>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Description</div>
                <p style="font-size: 14px; line-height: 1.5; color: var(--text-white);">${rfq.description}</p>
              </div>

              <div class="form-row" style="margin-bottom: 20px;">
                <div>
                  <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Deadline</div>
                  <strong style="font-size: 14px; color: var(--color-warning);">${rfq.deadline}</strong>
                </div>
                <div>
                  <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Issued By</div>
                  <strong style="font-size: 14px; color: var(--text-white);">${rfq.createdBy}</strong>
                </div>
              </div>

              <div>
                <div style="font-size: 12px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Requested Items List</div>
                <div class="table-responsive">
                  <table class="table" style="background-color: var(--bg-input); border-radius: 8px;">
                    <thead>
                      <tr>
                        <th>Item #</th>
                        <th>Required Item & Specs</th>
                        <th class="text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rfq.items.map(item => `
                        <tr>
                          <td>${item.id}</td>
                          <td>
                            <div style="font-weight: 600; color: var(--text-white);">${item.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Specs: ${item.specs || 'N/A'}</div>
                          </td>
                          <td class="text-right"><strong>${item.qty} units</strong></td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quotation Submission Form -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${isEdit ? 'Edit Bidding Quotation' : 'Submit Quotation Proposal'}</h3>
            </div>
            <div class="card-body">
              <form id="submit-quote-form">
                <div style="margin-bottom: 24px;">
                  <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; font-weight: 700;">Itemized Unit Pricing</h4>
                  
                  ${rfq.items.map(item => {
                    const prevItem = existingQuote?.items.find(pi => pi.itemId === item.id);
                    const prevPrice = prevItem ? prevItem.unitPrice : '';
                    return `
                      <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px; border-bottom: 1px dashed var(--border-light); padding-bottom: 12px;">
                        <div style="flex: 1;">
                          <div style="font-size: 13px; font-weight: 600; color: var(--text-white);">${item.name}</div>
                          <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Qty: ${item.qty} units</div>
                        </div>
                        <div style="width: 150px;">
                          <div style="position: relative; display: flex; align-items: center;">
                            <span style="position: absolute; left: 10px; font-size: 14px; color: var(--text-dim);">$</span>
                            <input type="number" step="0.01" class="form-control quote-item-price" 
                              data-itemid="${item.id}" data-qty="${item.qty}"
                              placeholder="0.00" value="${prevPrice}" style="padding-left: 24px;" required>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="form-group">
                  <label for="quote-leadtime">Delivery Lead Time (Days after receiving PO)</label>
                  <input type="number" id="quote-leadtime" class="form-control" 
                    placeholder="e.g. 7" value="${existingQuote ? existingQuote.leadTimeDays : ''}" min="1" required>
                </div>

                <div class="form-group">
                  <label for="quote-notes">Vendor Remarks, Terms & Conditions</label>
                  <textarea id="quote-notes" class="form-control" rows="4" 
                    placeholder="Enter notes on shipping terms, warranty guidelines, shelf life, discount details..." required>${existingQuote ? existingQuote.notes : ''}</textarea>
                </div>

                <!-- Live Subtotal Calculation -->
                <div style="background-color: var(--bg-input); padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: var(--text-muted);">Estimated Quotation Subtotal:</span>
                  <span style="font-size: 20px; font-weight: 800; color: var(--text-white);" id="quote-subtotal-display">₹0.00</span>
                </div>

                <div class="form-actions">
                  <a href="#rfqs" class="btn btn-secondary">Cancel</a>
                  <button type="submit" class="btn btn-primary">${isEdit ? 'Update Bid' : 'Submit Proposal'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container, rfqId);
    this.calculateTotals(container);
  },

  calculateTotals(container) {
    const prices = container.querySelectorAll('.quote-item-price');
    const display = container.querySelector('#quote-subtotal-display');
    
    let subtotal = 0;
    prices.forEach(input => {
      const val = parseFloat(input.value) || 0;
      const qty = parseInt(input.getAttribute('data-qty')) || 0;
      subtotal += val * qty;
    });

    display.innerText = `₹${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  },

  bindEvents(container, rfqId) {
    const form = container.querySelector('#submit-quote-form');
    const prices = container.querySelectorAll('.quote-item-price');

    // recalculate subtotal dynamically on pricing input change
    prices.forEach(input => {
      input.addEventListener('input', () => this.calculateTotals(container));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // build pricing map
      const itemsPriceMap = {};
      prices.forEach(input => {
        const itemId = input.getAttribute('data-itemid');
        itemsPriceMap[itemId] = parseFloat(input.value) || 0;
      });

      const leadTime = container.querySelector('#quote-leadtime').value;
      const notes = container.querySelector('#quote-notes').value.trim();

      const res = store.submitQuotation(rfqId, itemsPriceMap, leadTime, notes);
      if (res.success) {
        alert('Quotation submitted successfully!');
        window.location.hash = '#rfqs';
      } else {
        alert(`Error: ${res.error}`);
      }
    });
  }
};

