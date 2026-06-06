// Quotation Comparison Screen Module
import { store } from '../store.js';

export default {
  render(container, params) {
    const user = store.getCurrentUser();
    if (!user || (user.role !== 'officer' && user.role !== 'admin')) return;

    const rfqId = params?.rfqId;
    if (!rfqId) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">Error: No RFQ specified. Select an RFQ from the Dashboard or RFQ directory.</div></div>`;
      return;
    }

    const rfq = store.getRFQs().find(r => r.id === rfqId);
    if (!rfq) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">RFQ ${rfqId} not found.</div></div>`;
      return;
    }

    const vendors = store.getVendors();
    const rfqQuotes = store.getQuotations().filter(q => q.rfqId === rfqId);

    if (rfqQuotes.length === 0) {
      container.innerHTML = `
        <div class="page-header">
          <div class="page-title">
            <h1>Compare Quotations</h1>
            <p>Project Ref: <strong>${rfqId}</strong> • ${rfq.title}</p>
          </div>
          <div class="page-header-actions">
            <a href="#rfqs" class="btn btn-secondary">Back to RFQs</a>
          </div>
        </div>
        <div class="card">
          <div class="card-body" style="text-align: center; padding: 60px 40px; color: var(--text-muted);">
            <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin-bottom: 16px;"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h3>No Quotations Received</h3>
            <p style="margin-top: 8px; font-size: 14px;">Assigned vendors have not yet submitted any proposals for this RFQ. They will appear here once submitted.</p>
          </div>
        </div>
      `;
      return;
    }

    // Identify lowest subtotal and fastest lead times
    const subtotals = rfqQuotes.map(q => q.subtotal);
    const minSubtotal = Math.min(...subtotals);

    const leadTimes = rfqQuotes.map(q => q.leadTimeDays);
    const minLeadTime = Math.min(...leadTimes);

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Compare Quotations</h1>
            <p>Project Ref: <strong>${rfqId}</strong> • ${rfq.title}</p>
          </div>
          <div class="page-header-actions">
            <a href="#rfqs" class="btn btn-secondary">Back to RFQs</a>
          </div>
        </div>

        <!-- Summary Matrix Card -->
        <div class="card" style="margin-bottom: 32px;">
          <div class="card-header">
            <h3 class="card-title">Side-by-Side Sourcing Matrix</h3>
            <span style="font-size: 13px; color: var(--text-muted);">${rfqQuotes.length} Proposals Submitted</span>
          </div>
          <div class="card-body">
            <div class="comparison-grid">
              ${rfqQuotes.map(q => {
                const vendorProfile = vendors.find(v => v.id === q.vendorId);
                const isLowestPrice = q.subtotal === minSubtotal;
                const isFastestDelivery = q.leadTimeDays === minLeadTime;
                const rating = vendorProfile ? vendorProfile.rating : 5.0;
                const ratingStars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

                return `
                  <div class="comparison-column ${isLowestPrice ? 'highlighted' : ''}">
                    <div class="comparison-header">
                      <div class="comparison-vendor-name">${q.vendorName}</div>
                      <div class="comparison-rating" title="Rating: ${rating.toFixed(1)}">
                        <span>${ratingStars}</span>
                        <span style="color: var(--text-muted); font-size: 11px;">(${rating.toFixed(1)})</span>
                      </div>
                      <div class="comparison-price-tag">₹${q.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                      
                      <div class="comparison-badge-container">
                        ${isLowestPrice ? `<span class="lowest-price-badge">Lowest Cost</span>` : ''}
                        ${isFastestDelivery ? `<span class="fastest-delivery-badge">Fastest Delivery</span>` : ''}
                      </div>
                    </div>

                    <div class="comparison-details">
                      <div class="comparison-detail-item">
                        <span class="comparison-detail-label">Lead Time</span>
                        <span class="comparison-detail-value" style="color: ${isFastestDelivery ? 'var(--color-info)' : 'var(--text-white)'};">
                          ${q.leadTimeDays} days
                        </span>
                      </div>
                      <div class="comparison-detail-item">
                        <span class="comparison-detail-label">Compliance GST</span>
                        <span class="comparison-detail-value" style="font-family: monospace;">${vendorProfile?.gst || 'N/A'}</span>
                      </div>
                      <div class="comparison-detail-item" style="flex-direction: column; gap: 4px; border: none;">
                        <span class="comparison-detail-label">Vendor Remarks</span>
                        <p style="font-size: 12px; line-height: 1.4; color: var(--text-muted); font-style: italic; background-color: var(--bg-input); padding: 8px; border-radius: 6px; margin-top: 4px; min-height: 70px;">
                          "${q.notes}"
                        </p>
                      </div>
                    </div>

                    <!-- Item price comparisons -->
                    <div class="comparison-items-breakdown" style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                      <div class="comparison-items-title">Itemized Unit Price (Qty)</div>
                      ${rfq.items.map(item => {
                        const quoteItem = q.items.find(qi => qi.itemId === item.id);
                        const allQuoteItems = rfqQuotes.map(oq => oq.items.find(oqi => oqi.itemId === item.id)?.unitPrice || 999999);
                        const minItemPrice = Math.min(...allQuoteItems);
                        const isMinItemPrice = quoteItem && quoteItem.unitPrice === minItemPrice;

                        return `
                          <div class="comparison-item-row">
                            <span class="comparison-item-name" title="${item.name}">${item.name} (x${item.qty})</span>
                            <strong style="color: ${isMinItemPrice ? 'var(--color-success)' : 'var(--text-white)'};">
                              ₹${quoteItem ? quoteItem.unitPrice.toFixed(2) : 'N/A'}
                            </strong>
                          </div>
                        `;
                      }).join('')}
                    </div>

                    <div style="margin-top: 24px;">
                      ${rfq.status === 'Active' || rfq.status === 'Under Comparison' 
                        ? `<button class="btn btn-primary btn-select-quote" data-quoteid="${q.id}" style="width: 100%;">
                            Select & Submit for Approval
                           </button>` 
                        : rfq.selectedQuotationId === q.id 
                          ? `<div style="background-color: var(--color-success-bg); border: 1px solid var(--color-success); color: var(--color-success); border-radius: 8px; padding: 10px; text-align: center; font-weight: 600; font-size: 13px;">
                              Selected Proposal
                             </div>`
                          : `<div style="background-color: var(--bg-input); color: var(--text-dim); border-radius: 8px; padding: 10px; text-align: center; font-weight: 500; font-size: 13px;">
                              Not Selected
                             </div>`
                      }
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container, rfqId);
  },

  bindEvents(container, rfqId) {
    container.querySelectorAll('.btn-select-quote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quoteId = e.currentTarget.getAttribute('data-quoteid');
        const quote = store.getQuotations().find(q => q.id === quoteId);

        const confirmSubmit = confirm(`Are you sure you want to select the quotation from "${quote.vendorName}" (Total: ₹${quote.subtotal.toFixed(2)}) and submit it to the Manager for review?`);
        if (confirmSubmit) {
          const res = store.submitRFQForApproval(rfqId, quoteId);
          if (res.success) {
            alert('Quotation selected! RFQ has been forwarded to the VP of Procurement for final sign-off.');
            window.location.hash = '#rfqs';
          } else {
            alert(`Error: ${res.error}`);
          }
        }
      });
    });
  }
};

