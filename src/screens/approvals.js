// Approval Workflow Screen Module
import { store } from '../store.js';

export default {
  render(container, params) {
    const user = store.getCurrentUser();
    if (!user || user.role !== 'manager') return;

    const rfqId = params?.rfqId;
    
    // If no rfqId is provided, render approvals inbox list
    if (!rfqId) {
      this.renderInbox(container);
      return;
    }

    const rfq = store.getRFQs().find(r => r.id === rfqId);
    if (!rfq) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">RFQ ${rfqId} not found.</div></div>`;
      return;
    }

    const selectedQuote = store.getQuotations().find(q => q.id === rfq.selectedQuotationId);
    const otherQuotes = store.getQuotations().filter(q => q.rfqId === rfqId && q.id !== rfq.selectedQuotationId);
    const vendors = store.getVendors();

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Review Procurement Request</h1>
            <p>Project Ref: <strong>${rfqId}</strong> • ${rfq.title}</p>
          </div>
          <div class="page-header-actions">
            <a href="#approvals" class="btn btn-secondary">Back to Inbox</a>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Left side: Document Details & Comparison -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Selected Vendor Details -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Selected Bid Details (Recommendation)</h3>
              </div>
              <div class="card-body">
                ${selectedQuote ? `
                  <div style="background-color: var(--bg-input); padding: 20px; border-radius: 8px; border-left: 4px solid var(--color-primary); margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <div>
                        <h4 style="font-size: 16px; font-weight: 700; color: var(--text-white);">${selectedQuote.vendorName}</h4>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Quote ID: ${selectedQuote.id}</div>
                      </div>
                      <div style="text-align: right;">
                        <span class="badge badge-active" style="background-color: rgba(88,80,236,0.15); color: var(--color-primary);">RECOMMENDED</span>
                        <div style="font-size: 22px; font-weight: 800; color: var(--text-white); margin-top: 6px;">
                          ₹${(selectedQuote.subtotal * 1.18).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                          <span style="font-size: 11px; color: var(--text-dim); font-weight: 500;">(Incl. 18% GST)</span>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 16px; border-top: 1px dashed var(--border-color); padding-top: 12px;">
                      <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Lead Time</div>
                      <strong style="color: var(--text-white);">${selectedQuote.leadTimeDays} Days from PO</strong>
                    </div>
                    <div style="margin-top: 12px;">
                      <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Vendor Proposal Notes</div>
                      <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4; font-style: italic;">"${selectedQuote.notes}"</p>
                    </div>
                  </div>

                  <!-- Itemized Table -->
                  <h4 style="font-size: 13px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;">Recommended Purchase Items</h4>
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Item Name & Specs</th>
                          <th class="text-right">Qty</th>
                          <th class="text-right">Unit Price</th>
                          <th class="text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${rfq.items.map(item => {
                          const quoteItem = selectedQuote.items.find(qi => qi.itemId === item.id);
                          const unitPrice = quoteItem ? quoteItem.unitPrice : 0;
                          return `
                            <tr>
                              <td>
                                <div style="font-weight: 600; color: var(--text-white);">${item.name}</div>
                                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Specs: ${item.specs || 'N/A'}</div>
                              </td>
                              <td class="text-right">${item.qty}</td>
                              <td class="text-right">₹${unitPrice.toFixed(2)}</td>
                              <td class="text-right"><strong>₹${(item.qty * unitPrice).toFixed(2)}</strong></td>
                            </tr>
                          `;
                        }).join('')}
                      </tbody>
                    </table>
                  </div>
                ` : '<div style="color: var(--text-dim); text-align: center;">No quotation selected.</div>'}
              </div>
            </div>

            <!-- Alternative Bids Context -->
            ${otherQuotes.length > 0 ? `
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Comparative Vendor Offers (Unselected)</h3>
                </div>
                <div class="card-body" style="padding: 0;">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Vendor Partner</th>
                        <th>Lead Time</th>
                        <th>Rating</th>
                        <th class="text-right">Quote Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${otherQuotes.map(oq => {
                        const vendorProfile = vendors.find(v => v.id === oq.vendorId);
                        return `
                          <tr>
                            <td>
                              <div style="font-weight: 600; color: var(--text-muted);">${oq.vendorName}</div>
                            </td>
                            <td>${oq.leadTimeDays} days</td>
                            <td>★ ${vendorProfile?.rating.toFixed(1) || 'N/A'}</td>
                            <td class="text-right" style="color: var(--text-muted); font-weight: 500;">
                              ₹${oq.subtotal.toFixed(2)}
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right side: Actions, timeline & remarks -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Actions Card -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Approval Action Center</h3>
              </div>
              <div class="card-body">
                ${rfq.status === 'In Approval' ? `
                  <form id="approval-remarks-form">
                    <div class="form-group">
                      <label for="approval-remarks">Approver Remarks / Auditing Notes</label>
                      <textarea id="approval-remarks" class="form-control" rows="3" 
                        placeholder="Enter justification for approval, budget references, or rejection arguments..." required></textarea>
                    </div>

                    <div style="display: flex; gap: 12px; margin-top: 16px;">
                      <button type="submit" class="btn btn-primary" id="btn-approve-rfq" style="flex: 1; background-color: var(--color-success); border-color: var(--color-success); box-shadow: 0 4px 10px var(--color-success-bg);">
                        Approve & Issue PO
                      </button>
                      <button type="button" class="btn btn-danger" id="btn-reject-rfq" style="flex: 1;">
                        Decline Request
                      </button>
                    </div>
                  </form>
                ` : `
                  <div style="background-color: var(--bg-input); padding: 16px; border-radius: 8px; text-align: center; border: 1px solid var(--border-color);">
                    <div style="font-size: 13px; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Workflow Status</div>
                    <div style="font-size: 18px; font-weight: 700; margin-top: 6px; color: ${
                      rfq.status === 'Approved' || rfq.status === 'Completed' ? 'var(--color-success)' : 'var(--color-danger)'
                    }">
                      ${rfq.status.toUpperCase()}
                    </div>
                    ${rfq.approvalRemarks ? `
                      <div style="font-size: 12px; color: var(--text-muted); margin-top: 12px; text-align: left; padding: 10px; border-top: 1px dashed var(--border-color); font-style: italic;">
                        Remarks: "${rfq.approvalRemarks}"
                      </div>
                    ` : ''}
                    <div style="margin-top: 16px;">
                      <button class="btn btn-secondary btn-sm" id="btn-edit-decision" style="width: 100%;">
                        Edit Approval/Decline Decision
                      </button>
                    </div>
                  </div>
                `}
              </div>
            </div>

            <!-- Workflow Timeline -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Workflow Sourcing Timeline</h3>
              </div>
              <div class="card-body">
                <div class="timeline-flow">
                  ${rfq.approvalTimeline.map((step, idx) => {
                    const isLast = idx === rfq.approvalTimeline.length - 1;
                    const statusClass = step.status === 'Approved' || step.status === 'Completed' ? 'completed' : 
                                        step.status === 'Rejected' ? 'rejected' : 
                                        isLast ? 'active' : 'completed';
                    return `
                      <div class="timeline-step ${statusClass}">
                        <div class="timeline-bullet"></div>
                        <div class="timeline-date">${step.date}</div>
                        <div class="timeline-title">${step.status}</div>
                        <div class="timeline-note">${step.note} (${step.user})</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container, rfqId);
  },

  renderInbox(container) {
    const pendingRFQs = store.getRFQs().filter(r => r.status === 'In Approval');
    const allRFQs = store.getRFQs().filter(r => r.status === 'Approved' || r.status === 'Completed' || r.status === 'Rejected');

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Approvals Inbox</h1>
            <p>Review selection requests, review vendor competitive quotes, and authorize purchase orders.</p>
          </div>
        </div>

        <div class="card" style="margin-bottom: 32px;">
          <div class="card-header">
            <h3 class="card-title">Awaiting Approval Sign-Off</h3>
            <span class="badge badge-pending">${pendingRFQs.length} pending</span>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Procurement Project</th>
                    <th>Selected Vendor</th>
                    <th>Officer</th>
                    <th>Estimated Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingRFQs.length === 0 ? '<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 30px;">Your approvals inbox is clean! No pending sign-offs.</td></tr>' : 
                    pendingRFQs.map(r => {
                      const selectedQuote = store.getQuotations().find(q => q.id === r.selectedQuotationId);
                      const value = selectedQuote ? selectedQuote.subtotal * 1.18 : 0;
                      return `
                        <tr>
                          <td><strong>${r.id}</strong></td>
                          <td>
                            <div style="font-weight: 600; color: var(--text-white);">${r.title}</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Deadline: ${r.deadline}</div>
                          </td>
                          <td>
                            <div style="font-weight: 500;">${selectedQuote?.vendorName || 'Unknown'}</div>
                            <div style="font-size: 10px; color: var(--text-dim);">Rating: ★ ${store.getVendors().find(v => v.id === selectedQuote?.vendorId)?.rating.toFixed(1) || '5.0'}</div>
                          </td>
                          <td>${r.createdBy}</td>
                          <td><strong>₹${value.toFixed(2)}</strong></td>
                          <td>
                            <a href="#approvals?rfqId=${r.id}" class="btn btn-primary btn-sm">Audit & Authorize</a>
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

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Completed Workflows Log</h3>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Procurement Project</th>
                    <th>Approved Vendor</th>
                    <th>Authorized Value</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${allRFQs.length === 0 ? '<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 20px;">No completed workflow entries.</td></tr>' : 
                    allRFQs.map(r => {
                      const selectedQuote = store.getQuotations().find(q => q.id === r.selectedQuotationId);
                      const value = selectedQuote ? selectedQuote.subtotal * 1.18 : 0;
                      return `
                        <tr>
                          <td><strong>${r.id}</strong></td>
                          <td>
                            <div style="font-weight: 600; color: var(--text-muted);">${r.title}</div>
                          </td>
                          <td>${selectedQuote?.vendorName || 'Unknown'}</td>
                          <td>₹${value.toFixed(2)}</td>
                          <td>
                            <span class="badge ${r.status === 'Approved' || r.status === 'Completed' ? 'badge-completed' : 'badge-suspended'}">
                              ${r.status}
                            </span>
                          </td>
                          <td>
                            <a href="#approvals?rfqId=${r.id}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">View Timeline</a>
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
      </div>
    `;
  },

  bindEvents(container, rfqId) {
    const form = container.querySelector('#approval-remarks-form');
    const rejectBtn = container.querySelector('#btn-reject-rfq');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const remarks = container.querySelector('#approval-remarks').value.trim();

        const res = store.approveOrRejectRFQ(rfqId, 'approve', remarks);
        if (res.success) {
          alert(`RFQ ${rfqId} has been successfully approved! A Purchase Order has been generated and sent to the selected vendor.`);
          window.location.hash = '#approvals';
        } else {
          alert(`Error: ${res.error}`);
        }
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        const remarksInput = container.querySelector('#approval-remarks');
        const remarks = remarksInput.value.trim();

        if (!remarks) {
          alert('You must provide remarks justifying your rejection.');
          remarksInput.focus();
          return;
        }

        const confirmReject = confirm(`Are you sure you want to reject the selection for RFQ ${rfqId}?`);
        if (confirmReject) {
          const res = store.approveOrRejectRFQ(rfqId, 'reject', remarks);
          if (res.success) {
            alert(`RFQ ${rfqId} has been rejected. The Procurement Officer has been notified.`);
            window.location.hash = '#approvals';
          } else {
            alert(`Error: ${res.error}`);
          }
        }
      });
    }

    const editDecisionBtn = container.querySelector('#btn-edit-decision');
    if (editDecisionBtn) {
      editDecisionBtn.addEventListener('click', () => {
        const confirmEdit = confirm("Are you sure you want to edit your decision? This will revert the RFQ back to 'In Approval'.");
        if (confirmEdit) {
          const rfqToEdit = store.getRFQs().find(r => r.id === rfqId);
          if (rfqToEdit) {
            rfqToEdit.status = 'In Approval';
            
            // Clean up any POs generated from the previous approval
            const pos = store.getPurchaseOrders();
            const posToKeep = pos.filter(p => p.rfqId !== rfqId);
            pos.length = 0; // Clear array
            pos.push(...posToKeep); // Repopulate with kept items
            
            store.logActivity(store.getCurrentUser().name, 'Edit Decision', `Manager chose to edit their decision for RFQ ${rfqId}`);
            store.saveState();
            
            // Re-render the screen to show the approval form again
            this.render(container, { rfqId });
          }
        }
      });
    }
  }
};

