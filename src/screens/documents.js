// Purchase Order & Invoice Screen Module
import { store } from '../store.js';

export default {
  render(container, params) {
    const user = store.getCurrentUser();
    if (!user) return;

    const poId = params?.poId;
    const invoiceId = params?.invoiceId;

    // 1. Render Specific PO
    if (poId) {
      this.renderPurchaseOrder(container, poId, user);
      return;
    }

    // 2. Render Specific Invoice
    if (invoiceId) {
      this.renderInvoice(container, invoiceId, user);
      return;
    }

    // 3. Render Listing Hub
    this.renderListingHub(container, user);
  },

  renderListingHub(container, user) {
    const pos = store.getPurchaseOrders();
    const invoices = store.getInvoices();

    // Filter documents based on role (vendors only see their own)
    const filteredPOs = user.role === 'vendor' ? pos.filter(p => p.vendorId === user.vendorId) : pos;
    const filteredInvoices = user.role === 'vendor' ? invoices.filter(i => i.vendorId === user.vendorId) : invoices;

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Procurement Documents Hub</h1>
            <p>View, print, and email official Purchase Orders and Vendor Invoices.</p>
          </div>
        </div>

        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
          <button class="btn btn-primary btn-tab-doc active" id="tab-po" style="padding: 8px 16px; font-size: 13px;">Purchase Orders (${filteredPOs.length})</button>
          <button class="btn btn-secondary btn-tab-doc" id="tab-inv" style="padding: 8px 16px; font-size: 13px;">Invoices (${filteredInvoices.length})</button>
        </div>

        <!-- Purchase Orders Tab Content -->
        <div id="po-tab-content" class="card">
          <div class="card-header">
            <h3 class="card-title">Authorized Purchase Orders</h3>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>RFQ Project</th>
                    <th>Vendor Partner</th>
                    <th>Issue Date</th>
                    <th class="text-right">Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredPOs.length === 0 ? '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">No purchase orders issued.</td></tr>' : 
                    filteredPOs.map(po => `
                      <tr>
                        <td><strong><a href="#documents?poId=${po.id}">${po.id}</a></strong></td>
                        <td>${po.rfqTitle}</td>
                        <td>${po.vendorName}</td>
                        <td>${po.date}</td>
                        <td class="text-right"><strong>₹${po.totalAmount.toFixed(2)}</strong></td>
                        <td><span class="badge ${po.status === 'Approved' ? 'badge-pending' : 'badge-completed'}">${po.status}</span></td>
                        <td>
                          <div style="display: flex; gap: 8px; align-items: center;">
                            <a href="#documents?poId=${po.id}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">View PO</a>
                            ${user.role === 'vendor' && po.status === 'Sent'
                              ? `<button class="btn btn-primary btn-sm btn-convert-po" data-poid="${po.id}" style="padding: 3px 8px; font-size: 11px;">Generate Invoice</button>` 
                              : ''
                            }
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

        <!-- Invoices Tab Content (Hidden by default) -->
        <div id="inv-tab-content" class="card" style="display: none;">
          <div class="card-header">
            <h3 class="card-title">Commercial Invoices</h3>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Associated PO</th>
                    <th>Vendor Partner</th>
                    <th>Issue Date</th>
                    <th class="text-right">Invoice Value</th>
                    <th>GST Tax</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredInvoices.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: var(--text-dim); padding: 30px;">No invoices registered in database.</td></tr>' : 
                    filteredInvoices.map(inv => `
                      <tr>
                        <td><strong><a href="#documents?invoiceId=${inv.id}">${inv.id}</a></strong></td>
                        <td><a href="#documents?poId=${inv.poId}">${inv.poId}</a></td>
                        <td>${inv.vendorName}</td>
                        <td>${inv.date}</td>
                        <td class="text-right"><strong>₹${inv.totalAmount.toFixed(2)}</strong></td>
                        <td>₹${inv.taxAmount.toFixed(2)} (18%)</td>
                        <td><span class="badge ${inv.status === 'Paid' ? 'badge-active' : 'badge-suspended'}">${inv.status}</span></td>
                        <td>
                          <div style="display: flex; gap: 8px;">
                            <a href="#documents?invoiceId=${inv.id}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">View Invoice</a>
                            ${(user.role === 'officer' || user.role === 'admin') && inv.status === 'Unpaid'
                              ? `<button class="btn btn-primary btn-sm btn-pay-invoice" data-invid="${inv.id}" style="padding: 3px 8px; font-size: 11px;">Record Payment</button>`
                              : ''
                            }
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
      </div>
    `;

    // Bind tab switching
    const tabPo = container.querySelector('#tab-po');
    const tabInv = container.querySelector('#tab-inv');
    const poContent = container.querySelector('#po-tab-content');
    const invContent = container.querySelector('#inv-tab-content');

    tabPo.addEventListener('click', () => {
      tabPo.classList.add('active');
      tabPo.classList.remove('btn-secondary');
      tabPo.classList.add('btn-primary');

      tabInv.classList.remove('active');
      tabInv.classList.remove('btn-primary');
      tabInv.classList.add('btn-secondary');

      poContent.style.display = 'block';
      invContent.style.display = 'none';
    });

    tabInv.addEventListener('click', () => {
      tabInv.classList.add('active');
      tabInv.classList.remove('btn-secondary');
      tabInv.classList.add('btn-primary');

      tabPo.classList.remove('active');
      tabPo.classList.remove('btn-primary');
      tabPo.classList.add('btn-secondary');

      invContent.style.display = 'block';
      poContent.style.display = 'none';
    });

    // Bind Convert PO buttons
    container.querySelectorAll('.btn-convert-po').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-poid');
        const res = store.generateInvoice(id);
        if (res.success) {
          alert(`Invoice ${res.invoice.id} successfully generated!`);
          this.renderListingHub(container, user);
        } else {
          alert(`Error: ${res.error}`);
        }
      });
    });

    // Bind Pay Invoice buttons
    container.querySelectorAll('.btn-pay-invoice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-invid');
        const confirmPay = confirm(`Do you want to record a full bank transfer payment of ₹${invoices.find(i=>i.id===id).totalAmount.toFixed(2)} to mark invoice ${id} as PAID?`);
        if (confirmPay) {
          store.payInvoice(id);
          this.renderListingHub(container, user);
        }
      });
    });
  },

  renderPurchaseOrder(container, poId, user) {
    const po = store.getPurchaseOrders().find(p => p.id === poId);
    if (!po) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">Purchase Order ${poId} not found.</div></div>`;
      return;
    }

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header no-print">
          <div class="page-title">
            <h1>Purchase Order Details</h1>
            <p>PO ID: <strong>${poId}</strong></p>
          </div>
          <div class="page-header-actions" style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-back-hub">Back to Hub</button>
            <button class="btn btn-secondary btn-print-doc">🖨️ Print PO</button>
            <button class="btn btn-primary btn-download-doc">📥 Download PDF</button>
          </div>
        </div>

        <div class="document-container">
          <div class="doc-watermark">Purchase Order</div>
          <div class="document-header">
            <div class="doc-company-info">
              <h2>VendorBridge ERP</h2>
              <p>Corporate Sourcing Operations Division</p>
              <p>200 Enterprise Boulevard, Tech Park</p>
              <p>Email: procurement@vendorbridge.org</p>
              <p>GSTIN: 27AAACV9999F1Z9</p>
            </div>
            <div class="doc-meta">
              <div class="doc-title">Purchase Order</div>
              <div class="doc-number">ORDER NO: ${po.id}</div>
              <div class="doc-date">Date: ${po.date}</div>
              <div style="margin-top: 8px;">
                <span class="badge badge-completed">${po.status}</span>
              </div>
            </div>
          </div>

          <div class="doc-billing-grid">
            <div class="billing-section">
              <h3>Vendor Partner (Supplier)</h3>
              <p><strong>${po.vendorName}</strong></p>
              <p>Reference ID: ${po.vendorId}</p>
              <p>GSTIN: ${store.getVendors().find(v=>v.id===po.vendorId)?.gst || 'N/A'}</p>
              <p>Contact Email: ${store.getVendors().find(v=>v.id===po.vendorId)?.email || 'N/A'}</p>
            </div>
            <div class="billing-section">
              <h3>Authorized Signatory</h3>
              <p><strong>${po.approvedBy}</strong></p>
              <p>Title: VP of Procurement Operations</p>
              <p>Requested by: ${po.createdBy}</p>
              <p>Project Association: ${po.rfqTitle} (${po.rfqId})</p>
            </div>
          </div>

          <table class="doc-table">
            <thead>
              <tr>
                <th>Item Details / Specifications</th>
                <th class="text-right" style="width: 100px;">Qty</th>
                <th class="text-right" style="width: 150px;">Unit Price</th>
                <th class="text-right" style="width: 150px;">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${po.items.map(item => `
                <tr>
                  <td>
                    <div style="font-weight: 600;">${item.name}</div>
                  </td>
                  <td class="text-right">${item.qty}</td>
                  <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right"><strong>₹${item.total.toFixed(2)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="doc-totals">
            <div class="doc-total-row">
              <span style="color: var(--text-muted);">Subtotal</span>
              <strong>₹${po.subtotal.toFixed(2)}</strong>
            </div>
            <div class="doc-total-row">
              <span style="color: var(--text-muted);">GST Tax Rate</span>
              <span>18.00%</span>
            </div>
            <div class="doc-total-row">
              <span style="color: var(--text-muted);">GST Tax Amount</span>
              <strong>₹${po.taxAmount.toFixed(2)}</strong>
            </div>
            <div class="doc-total-row grand-total">
              <span>Grand Total</span>
              <span>₹${po.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="doc-footer">
            <p>This is a computer-generated official document. Authorized electronically under corporate ERP framework policies.</p>
            <p style="margin-top: 6px; font-weight: 600;">VendorBridge ERP — Simplifying Procurement Workflows</p>
          </div>
        </div>
      </div>
    `;

    this.bindDocEvents(container, po.id, 'po', po.vendorName, po.totalAmount);
  },

  renderInvoice(container, invoiceId, user) {
    const inv = store.getInvoices().find(i => i.id === invoiceId);
    if (!inv) {
      container.innerHTML = `<div class="card"><div class="card-body" style="text-align: center; padding: 40px; color: var(--text-muted);">Invoice ${invoiceId} not found.</div></div>`;
      return;
    }

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header no-print">
          <div class="page-title">
            <h1>Commercial Invoice Details</h1>
            <p>Invoice ID: <strong>${invoiceId}</strong></p>
          </div>
          <div class="page-header-actions" style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-back-hub">Back to Hub</button>
            <button class="btn btn-secondary btn-print-doc">🖨️ Print Invoice</button>
            <button class="btn btn-secondary btn-email-doc">${inv.emailSent ? '📧 Sent' : '✉️ Send Email'}</button>
            <button class="btn btn-primary btn-download-doc">📥 Download PDF</button>
          </div>
        </div>

        <div class="document-container">
          <div class="doc-watermark" style="color: rgba(16, 185, 129, 0.015);">${inv.status}</div>
          <div class="document-header">
            <div class="doc-company-info">
              <h2>${inv.vendorName}</h2>
              <p>Authorized Supply Partner</p>
              <p>Email: sales@${inv.vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</p>
              <p>GSTIN: ${store.getVendors().find(v=>v.id===inv.vendorId)?.gst || 'N/A'}</p>
              <p>Office: ${store.getVendors().find(v=>v.id===inv.vendorId)?.address || 'N/A'}</p>
            </div>
            <div class="doc-meta">
              <div class="doc-title" style="color: var(--color-success);">Tax Invoice</div>
              <div class="doc-number">INVOICE NO: ${inv.id}</div>
              <div class="doc-date">Date: ${inv.date}</div>
              <div style="margin-top: 8px;">
                <span class="badge ${inv.status === 'Paid' ? 'badge-active' : 'badge-suspended'}">${inv.status}</span>
              </div>
            </div>
          </div>

          <div class="doc-billing-grid">
            <div class="billing-section">
              <h3>Billed To (Client)</h3>
              <p><strong>VendorBridge Sourcing Org</strong></p>
              <p>200 Enterprise Boulevard, Tech Park</p>
              <p>GSTIN: 27AAACV9999F1Z9</p>
            </div>
            <div class="billing-section">
              <h3>Billing & Delivery Reference</h3>
              <p>Purchase Order Ref: <strong><a href="#documents?poId=${inv.poId}">${inv.poId}</a></strong></p>
              <p>RFQ Reference: ${inv.rfqTitle} (${inv.rfqId})</p>
              <p>Printed: ${inv.printCount || 0} times</p>
            </div>
          </div>

          <table class="doc-table">
            <thead>
              <tr>
                <th>Description of Supplies</th>
                <th class="text-right" style="width: 100px;">Qty</th>
                <th class="text-right" style="width: 150px;">Unit Price</th>
                <th class="text-right" style="width: 150px;">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items.map(item => `
                <tr>
                  <td>
                    <div style="font-weight: 600;">${item.name}</div>
                  </td>
                  <td class="text-right">${item.qty}</td>
                  <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right"><strong>₹${item.total.toFixed(2)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="doc-totals">
            <div class="doc-total-row">
              <span style="color: var(--text-muted);">Subtotal</span>
              <strong>₹${inv.subtotal.toFixed(2)}</strong>
            </div>
            <div class="doc-total-row">
              <span style="color: var(--text-muted);">GST (18%)</span>
              <strong>₹${inv.taxAmount.toFixed(2)}</strong>
            </div>
            <div class="doc-total-row grand-total" style="border-top-color: var(--color-success);">
              <span>Grand Total</span>
              <span style="color: var(--color-success); font-size: 20px;">₹${inv.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="doc-footer" style="border-top-color: rgba(16, 185, 129, 0.25);">
            <p>Invoice generated on behalf of vendor partner. Payment terms: immediate receipt.</p>
            <p style="margin-top: 6px; font-weight: 600; color: var(--color-success);">Thank you for your business!</p>
          </div>
        </div>

        <!-- Simulated Email Modal Overlay -->
        <div class="modal-overlay" id="email-invoice-modal" style="display: none;">
          <div class="modal-container" style="max-width: 450px;">
            <div class="modal-header">
              <h3 class="modal-title">Send Invoice via Email</h3>
              <button class="modal-close" id="btn-close-email-modal">&times;</button>
            </div>
            <div class="modal-body">
              <form id="email-invoice-form">
                <div class="form-group">
                  <label for="email-to">Recipient Email Address</label>
                  <input type="email" id="email-to" class="form-control" placeholder="finance@vendorbridge.org" required>
                </div>
                <div class="form-group">
                  <label for="email-subject">Subject</label>
                  <input type="text" id="email-subject" class="form-control" value="Official Invoice ${inv.id} from ${inv.vendorName}" required>
                </div>
                <div class="form-group">
                  <label>Message Preview</label>
                  <div style="background-color: var(--bg-input); padding: 12px; border-radius: 8px; font-size: 12px; color: var(--text-muted); line-height: 1.4;">
                    Hello Finance Team,<br><br>
                    Please find attached invoice ${inv.id} of value ₹${inv.totalAmount.toFixed(2)} for deliverables under PO ${inv.poId}.
                  </div>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary btn-sm" id="btn-cancel-email-modal">Cancel</button>
                  <button type="submit" class="btn btn-primary btn-sm">Send Document</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindDocEvents(container, inv.id, 'invoice', inv.vendorName, inv.totalAmount);
  },

  bindDocEvents(container, docId, type, partnerName, totalVal) {
    const backBtn = container.querySelector('.btn-back-hub');
    const printBtn = container.querySelector('.btn-print-doc');
    const downloadBtn = container.querySelector('.btn-download-doc');
    const emailBtn = container.querySelector('.btn-email-doc');

    backBtn.addEventListener('click', () => {
      window.location.hash = '#documents';
    });

    // 1. Print action (logs to audit, increments print count if invoice, opens browser printing)
    printBtn.addEventListener('click', () => {
      if (type === 'invoice') {
        store.logInvoicePrint(docId);
      } else {
        store.logActivity(store.getCurrentUser().name, 'Print PO', `Purchase order ${docId} printed.`);
      }
      window.print();
    });

    // 2. Download Simulation (generates a plain text representation download)
    downloadBtn.addEventListener('click', () => {
      const title = type === 'po' ? 'Purchase Order' : 'Commercial Invoice';
      const fileContent = `
=============================================
${title} - ${docId}
=============================================
Vendor Bridge ERP Systems
Date: ${new Date().toISOString().split('T')[0]}
Partner: ${partnerName}
Value: ₹${totalVal.toFixed(2)} (Incl. 18% GST)
=============================================
This is a simulated digital document copy.
      `;
      
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${docId}_Copy.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      store.logActivity(store.getCurrentUser().name, `Download ${type.toUpperCase()}`, `Downloaded copy of ${docId}`);
      alert(`Simulation: File "${docId}_Copy.txt" compiled and downloaded to disk.`);
    });

    // 3. Email Simulation (only invoices support email option in details bar)
    if (emailBtn) {
      const emailModal = container.querySelector('#email-invoice-modal');
      const closeEmailBtn = container.querySelector('#btn-close-email-modal');
      const cancelEmailBtn = container.querySelector('#btn-cancel-email-modal');
      const emailForm = container.querySelector('#email-invoice-form');

      emailBtn.addEventListener('click', () => {
        emailModal.style.display = 'flex';
      });

      const closeEmail = () => {
        emailModal.style.display = 'none';
      };

      closeEmailBtn.addEventListener('click', closeEmail);
      cancelEmailBtn.addEventListener('click', closeEmail);

      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const targetEmail = container.querySelector('#email-to').value.trim();
        store.sendInvoiceEmail(docId, targetEmail);
        closeEmail();
        alert(`Simulation: Invoice ${docId} successfully dispatched via SMTP gateway to "${targetEmail}".`);
        this.render(container, { invoiceId: docId }); // reload invoice screen to show sent status
      });
    }
  }
};

