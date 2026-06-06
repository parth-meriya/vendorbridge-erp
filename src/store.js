// State Store for VendorBridge ERP using localStorage

const STORAGE_KEY = 'vendorbridge_state';

// Predefined mock data for initial load
const SEED_DATA = {
  users: [
    { email: 'admin@vendorbridge.com', password: 'admin123', role: 'admin', name: 'Sarah Jenkins', title: 'System Administrator', id: 'USR-001' },
    { email: 'officer@vendorbridge.com', password: 'officer123', role: 'officer', name: 'David Miller', title: 'Procurement Officer', id: 'USR-002' },
    { email: 'manager@vendorbridge.com', password: 'manager123', role: 'manager', name: 'Elena Rostova', title: 'VP of Procurement', id: 'USR-003' },
    { email: 'vendorA@vendorbridge.com', password: 'vendor123', role: 'vendor', name: 'John Doe (Apex)', title: 'Account Manager (Apex Industrial)', id: 'USR-004', vendorId: 'VND-001' },
    { email: 'vendorB@vendorbridge.com', password: 'vendor123', role: 'vendor', name: 'Jane Smith (Global)', title: 'Director (Global Materials)', id: 'USR-005', vendorId: 'VND-002' },
    { email: 'vendorC@vendorbridge.com', password: 'vendor123', role: 'vendor', name: 'Robert Johnson (Zenith)', title: 'Sales Rep (Zenith Supplies)', id: 'USR-006', vendorId: 'VND-003' }
  ],
  vendors: [
    { id: 'VND-001', name: 'Apex Industrial Ltd', category: 'Industrial Equipment', gst: '27AAACA1111A1Z1', email: 'vendorA@vendorbridge.com', phone: '+1 (555) 0199', address: '100 Industrial Parkway, Sector 4', rating: 4.8, status: 'Active' },
    { id: 'VND-002', name: 'Global Materials Corp', category: 'Raw Materials', gst: '27AAACG2222B2Z2', email: 'vendorB@vendorbridge.com', phone: '+1 (555) 0288', address: '45 Supply Chain Blvd, Suite 200', rating: 4.5, status: 'Active' },
    { id: 'VND-003', name: 'Zenith Supplies Inc', category: 'Office Stationery & IT', gst: '27AAACZ3333C3Z3', email: 'vendorC@vendorbridge.com', phone: '+1 (555) 0377', address: '88 Commerce Ave, Floor 12', rating: 4.2, status: 'Active' },
    { id: 'VND-004', name: 'Synergy Logistics', category: 'Logistics Services', gst: '27AAACS4444D4Z4', email: 'logistics@synergy.com', phone: '+1 (555) 0466', address: '12 Transit Depot Road', rating: 3.9, status: 'Pending' },
    { id: 'VND-005', name: 'Vertex Enterprises', category: 'Raw Materials', gst: '27AAACV5555E5Z5', email: 'contact@vertex.com', phone: '+1 (555) 0555', address: '77 manufacturing Plaza', rating: 4.6, status: 'Suspended' }
  ],
  rfqs: [
    {
      id: 'RFQ-001',
      title: 'High-Grade Steel Pipes Procurement',
      description: 'Procurement of premium grade seamless carbon steel pipes for plumbing and gas infrastructure works in Block C.',
      items: [
        { id: 1, name: 'Seamless Carbon Steel Pipe 4-inch (Schedule 40)', qty: 250, specs: 'ASTM A53, Grade B' },
        { id: 2, name: 'Flanged Tee Connector 4-inch', qty: 50, specs: 'Class 150 ANSI Flanged' }
      ],
      deadline: '2026-06-20',
      assignedVendors: ['VND-001', 'VND-002'],
      createdDate: '2026-06-01',
      createdBy: 'David Miller',
      status: 'Under Comparison', // Active, Under Comparison, In Approval, Approved, Completed, Rejected
      approvalRemarks: '',
      approvedBy: '',
      approvalTimeline: [
        { status: 'Draft', date: '2026-06-01', user: 'David Miller', note: 'RFQ drafts saved' },
        { status: 'Active', date: '2026-06-01', user: 'David Miller', note: 'RFQ published and vendors notified' }
      ]
    },
    {
      id: 'RFQ-002',
      title: 'IT Hardware Refurbishment (Laptops & Monitors)',
      description: 'Procurement of developer laptops and 4K displays for the software engineering team onboarding in Q3.',
      items: [
        { id: 1, name: 'Developer Laptop - 32GB RAM, 1TB SSD', qty: 15, specs: 'Intel i7 or Apple M3, 14-inch' },
        { id: 2, name: 'UltraSharp 27" 4K USB-C Monitor', qty: 20, specs: 'IPS Panel, 99% sRGB, Height Adjustable' }
      ],
      deadline: '2026-06-25',
      assignedVendors: ['VND-003'],
      createdDate: '2026-06-05',
      createdBy: 'David Miller',
      status: 'Active',
      approvalRemarks: '',
      approvedBy: '',
      approvalTimeline: [
        { status: 'Active', date: '2026-06-05', user: 'David Miller', note: 'RFQ published' }
      ]
    },
    {
      id: 'RFQ-003',
      title: 'Office Safety & Sanitation Kits',
      description: 'Annual stocking of medical safety kits, sanitizer dispensers, and emergency equipment for corporate offices.',
      items: [
        { id: 1, name: 'Industrial Safety First Aid Kit', qty: 10, specs: 'OSHA Compliant, 50-person capacity' },
        { id: 2, name: 'Automatic Sanitizer Dispenser Station', qty: 30, specs: 'Touchless, steel floor stand' }
      ],
      deadline: '2026-05-30',
      assignedVendors: ['VND-003', 'VND-001'],
      createdDate: '2026-05-15',
      createdBy: 'David Miller',
      status: 'Completed',
      approvalRemarks: 'Pricing is very competitive and meets our delivery timelines.',
      approvedBy: 'Elena Rostova',
      approvalTimeline: [
        { status: 'Active', date: '2026-05-15', user: 'David Miller', note: 'RFQ published' },
        { status: 'Under Comparison', date: '2026-05-20', user: 'David Miller', note: 'Quotations received and compared' },
        { status: 'In Approval', date: '2026-05-21', user: 'David Miller', note: 'Submitted for manager approval' },
        { status: 'Approved', date: '2026-05-22', user: 'Elena Rostova', note: 'Approved: Zenith Supplies selected.' },
        { status: 'Completed', date: '2026-05-25', user: 'David Miller', note: 'PO and Invoice issued, project closed.' }
      ]
    }
  ],
  quotations: [
    {
      id: 'QTN-001',
      rfqId: 'RFQ-001',
      vendorId: 'VND-001',
      vendorName: 'Apex Industrial Ltd',
      items: [
        { itemId: 1, unitPrice: 120.00, totalPrice: 30000.00 },
        { itemId: 2, unitPrice: 45.00, totalPrice: 2250.00 }
      ],
      subtotal: 32250.00,
      leadTimeDays: 7,
      notes: 'Premium structural grades. Delivered in wooden pallets. Price includes shipping.',
      status: 'Submitted', // Submitted, Selected, Rejected
      submittedDate: '2026-06-03'
    },
    {
      id: 'QTN-002',
      rfqId: 'RFQ-001',
      vendorId: 'VND-002',
      vendorName: 'Global Materials Corp',
      items: [
        { itemId: 1, unitPrice: 115.00, totalPrice: 28750.00 },
        { itemId: 2, unitPrice: 50.00, totalPrice: 2500.00 }
      ],
      subtotal: 31250.00,
      leadTimeDays: 12,
      notes: 'ASTM standard certified. Extra protective wrapping. Excludes local unloading costs.',
      status: 'Submitted',
      submittedDate: '2026-06-04'
    },
    {
      id: 'QTN-003',
      rfqId: 'RFQ-003',
      vendorId: 'VND-003',
      vendorName: 'Zenith Supplies Inc',
      items: [
        { itemId: 1, unitPrice: 80.00, totalPrice: 800.00 },
        { itemId: 2, unitPrice: 40.00, totalPrice: 1200.00 }
      ],
      subtotal: 2000.00,
      leadTimeDays: 3,
      notes: 'Ready stock. Immediate delivery in 72 hours.',
      status: 'Selected',
      submittedDate: '2026-05-18'
    }
  ],
  purchaseOrders: [
    {
      id: 'PO-2026-0001',
      rfqId: 'RFQ-003',
      rfqTitle: 'Office Safety & Sanitation Kits',
      quotationId: 'QTN-003',
      vendorId: 'VND-003',
      vendorName: 'Zenith Supplies Inc',
      date: '2026-05-22',
      items: [
        { name: 'Industrial Safety First Aid Kit', qty: 10, unitPrice: 80.00, total: 800.00 },
        { name: 'Automatic Sanitizer Dispenser Station', qty: 30, unitPrice: 40.00, total: 1200.00 }
      ],
      subtotal: 2000.00,
      taxRate: 0.18, // 18% GST
      taxAmount: 360.00,
      totalAmount: 2360.00,
      status: 'Approved', // Sent, Completed
      createdBy: 'David Miller',
      approvedBy: 'Elena Rostova'
    }
  ],
  invoices: [
    {
      id: 'INV-2026-0001',
      poId: 'PO-2026-0001',
      rfqId: 'RFQ-003',
      rfqTitle: 'Office Safety & Sanitation Kits',
      vendorId: 'VND-003',
      vendorName: 'Zenith Supplies Inc',
      date: '2026-05-25',
      items: [
        { name: 'Industrial Safety First Aid Kit', qty: 10, unitPrice: 80.00, total: 800.00 },
        { name: 'Automatic Sanitizer Dispenser Station', qty: 30, unitPrice: 40.00, total: 1200.00 }
      ],
      subtotal: 2000.00,
      taxAmount: 360.00,
      totalAmount: 2360.00,
      status: 'Paid', // Unpaid, Paid
      emailSent: true,
      printCount: 1
    }
  ],
  activityLogs: [
    { date: '2026-06-05 14:30', user: 'David Miller', action: 'Create RFQ', details: 'Created RFQ-002: IT Hardware Refurbishment (Laptops & Monitors)' },
    { date: '2026-06-04 11:15', user: 'Jane Smith', action: 'Submit Quotation', details: 'Submitted quote QTN-002 for RFQ-001 (₹31,250.00)' },
    { date: '2026-06-03 09:45', user: 'John Doe', action: 'Submit Quotation', details: 'Submitted quote QTN-001 for RFQ-001 (₹32,250.00)' },
    { date: '2026-05-25 16:00', user: 'Robert Johnson', action: 'Create Invoice', details: 'Generated invoice INV-2026-0001 for PO-2026-0001' },
    { date: '2026-05-22 10:00', user: 'Elena Rostova', action: 'Approve Quotation', details: 'Approved QTN-003 for RFQ-003 and generated PO-2026-0001' },
    { date: '2026-05-20 15:30', user: 'David Miller', action: 'Submit for Approval', details: 'Submitted RFQ-003 vendor quotes for approval' }
  ],
  currentUser: null,
  notifications: [
    { id: 1, text: 'RFQ-001: 2 Quotations received and ready for comparison.', read: false, date: '2026-06-04' },
    { id: 2, text: 'RFQ-002: Invite sent to Zenith Supplies Inc.', read: false, date: '2026-06-05' }
  ]
};

// Initialize Store
let state = JSON.parse(localStorage.getItem(STORAGE_KEY));
if (!state) {
  state = SEED_DATA;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
} else {
  // Safely merge any new schema arrays that might be missing in older localStorage
  let updated = false;
  for (const key in SEED_DATA) {
    if (state[key] === undefined) {
      state[key] = SEED_DATA[key];
      updated = true;
    }
  }
  if (updated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

// Helpers to save state
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Dispatch a global statechange event for reactivity
  window.dispatchEvent(new CustomEvent('statechange'));
}

export const store = {
  // Get State Data
  getUsers() { return state.users || []; },
  getVendors() { return state.vendors || []; },
  getRFQs() { return state.rfqs || []; },
  getQuotations() { return state.quotations || []; },
  getPurchaseOrders() { return state.purchaseOrders || []; },
  getInvoices() { return state.invoices || []; },
  getActivityLogs() { return state.activityLogs || []; },
  getCurrentUser() { return state.currentUser; },
  getNotifications() { return state.notifications || []; },

  // Auth Operations
  login(email, password, role) {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      if (role && user.role !== role) {
        return { success: false, error: 'Role verification failed. Selected role does not match user account.' };
      }
      state.currentUser = { ...user };
      delete state.currentUser.password; // strip password for security
      this.logActivity(state.currentUser.name, 'Login', 'User logged into the platform');
      save();
      return { success: true, user: state.currentUser };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  logout() {
    if (state.currentUser) {
      this.logActivity(state.currentUser.name, 'Logout', 'User logged out');
      state.currentUser = null;
      save();
    }
  },

  signup(name, email, password, role, companyDetails = {}) {
    const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'User already exists with this email' };
    }

    const userId = `USR-${String(state.users.length + 1).padStart(3, '0')}`;
    let vendorId = null;

    if (role === 'vendor') {
      vendorId = `VND-${String(state.vendors.length + 1).padStart(3, '0')}`;
      const newVendor = {
        id: vendorId,
        name: companyDetails.companyName || name,
        category: companyDetails.category || 'General',
        gst: companyDetails.gst || 'N/A',
        email: email,
        phone: companyDetails.phone || 'N/A',
        address: companyDetails.address || 'N/A',
        rating: 5.0,
        status: 'Pending'
      };
      state.vendors.push(newVendor);
      this.logActivity('System', 'Vendor Registered', `New Vendor: ${newVendor.name} registered.`);
    }

    const newUser = {
      id: userId,
      email,
      password,
      role,
      name,
      title: role === 'vendor' 
        ? `Rep for ${companyDetails.companyName}` 
        : `${role.charAt(0).toUpperCase() + role.slice(1)} @ ${companyDetails.companyName || 'VendorBridge'}`,
      ...(vendorId && { vendorId })
    };

    state.users.push(newUser);
    save();

    // Auto login
    return this.login(email, password, role);
  },

  forgotPassword(email) {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.logActivity('System', 'Password Reset Request', `Reset link request for ${email}`);
      return { success: true, message: `A password reset link has been simulated for ${email}` };
    }
    return { success: false, error: 'No user registered with this email' };
  },

  // Switch Role Utility (Testing UI helper)
  switchRole(role) {
    const templateUser = state.users.find(u => u.role === role);
    if (templateUser) {
      state.currentUser = { ...templateUser };
      delete state.currentUser.password;
      this.logActivity('System', 'Switch Role', `Evaluator switched role to ${role}`);
      save();
      return state.currentUser;
    }
    return null;
  },

  // Vendor Operations
  registerVendor(vendorData) {
    const id = `VND-${String(state.vendors.length + 1).padStart(3, '0')}`;
    const newVendor = {
      id,
      name: vendorData.name,
      category: vendorData.category,
      gst: vendorData.gst,
      email: vendorData.email,
      phone: vendorData.phone,
      address: vendorData.address,
      rating: 5.0,
      status: 'Active'
    };
    state.vendors.push(newVendor);
    this.logActivity(state.currentUser ? state.currentUser.name : 'Admin', 'Register Vendor', `Registered vendor ${vendorData.name}`);
    save();
    return newVendor;
  },

  updateVendorStatus(vendorId, status) {
    const vendor = state.vendors.find(v => v.id === vendorId);
    if (vendor) {
      vendor.status = status;
      this.logActivity(state.currentUser?.name || 'Admin', 'Update Vendor Status', `Status of vendor ${vendor.name} updated to ${status}`);
      save();
    }
  },

  // RFQ Operations
  createRFQ(rfqData) {
    const id = `RFQ-${String(state.rfqs.length + 1).padStart(3, '0')}`;
    const newRFQ = {
      id,
      title: rfqData.title,
      description: rfqData.description,
      items: rfqData.items.map((item, idx) => ({ id: idx + 1, name: item.name, qty: parseInt(item.qty), specs: item.specs })),
      deadline: rfqData.deadline,
      assignedVendors: rfqData.assignedVendors,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: state.currentUser?.name || 'David Miller',
      status: 'Active',
      approvalRemarks: '',
      approvedBy: '',
      approvalTimeline: [
        { status: 'Active', date: new Date().toISOString().split('T')[0], user: state.currentUser?.name || 'David Miller', note: 'RFQ created and published' }
      ]
    };
    state.rfqs.unshift(newRFQ); // add to beginning

    // Send notifications to assigned vendors
    rfqData.assignedVendors.forEach(vId => {
      const v = state.vendors.find(vend => vend.id === vId);
      if (v) {
        state.notifications.unshift({
          id: Date.now() + Math.random(),
          text: `New invitation: RFQ ${id} - ${rfqData.title}`,
          read: false,
          date: new Date().toISOString().split('T')[0],
          targetRole: 'vendor',
          targetVendorId: vId
        });
      }
    });

    this.logActivity(state.currentUser?.name || 'David Miller', 'Create RFQ', `Created RFQ ${id}: ${rfqData.title}`);
    save();
    return newRFQ;
  },

  // Quotation Operations
  submitQuotation(rfqId, itemsPriceMap, leadTimeDays, notes) {
    const rfq = state.rfqs.find(r => r.id === rfqId);
    if (!rfq) return { success: false, error: 'RFQ not found' };

    const vendorId = state.currentUser?.vendorId;
    const vendorName = state.vendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor';

    // check if quotation already exists for this vendor and RFQ
    let quote = state.quotations.find(q => q.rfqId === rfqId && q.vendorId === vendorId);
    const isEdit = !!quote;

    const items = rfq.items.map(item => {
      const unitPrice = parseFloat(itemsPriceMap[item.id]) || 0;
      return {
        itemId: item.id,
        unitPrice: unitPrice,
        totalPrice: unitPrice * item.qty
      };
    });

    const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

    if (isEdit) {
      quote.items = items;
      quote.subtotal = subtotal;
      quote.leadTimeDays = parseInt(leadTimeDays);
      quote.notes = notes;
      quote.submittedDate = new Date().toISOString().split('T')[0];
      this.logActivity(state.currentUser.name, 'Edit Quotation', `Edited quote ${quote.id} for RFQ ${rfqId} (Total: ₹${subtotal.toFixed(2)})`);
    } else {
      const quoteId = `QTN-${String(state.quotations.length + 1).padStart(3, '0')}`;
      quote = {
        id: quoteId,
        rfqId,
        vendorId,
        vendorName,
        items,
        subtotal,
        leadTimeDays: parseInt(leadTimeDays),
        notes,
        status: 'Submitted',
        submittedDate: new Date().toISOString().split('T')[0]
      };
      state.quotations.push(quote);

      // notify officer
      state.notifications.unshift({
        id: Date.now() + Math.random(),
        text: `New quotation submitted by ${vendorName} for RFQ ${rfqId}`,
        read: false,
        date: new Date().toISOString().split('T')[0],
        targetRole: 'officer'
      });

      this.logActivity(state.currentUser.name, 'Submit Quotation', `Submitted quote ${quoteId} for RFQ ${rfqId} (Total: ₹${subtotal.toFixed(2)})`);
    }

    // check if all assigned vendors have submitted to progress state (optional convenience)
    const submittedQuotesForRFQ = state.quotations.filter(q => q.rfqId === rfqId);
    if (submittedQuotesForRFQ.length >= rfq.assignedVendors.length && rfq.status === 'Active') {
      rfq.status = 'Under Comparison';
      rfq.approvalTimeline.push({
        status: 'Under Comparison',
        date: new Date().toISOString().split('T')[0],
        user: 'System',
        note: 'All assigned vendors submitted quotes. Ready for comparison.'
      });
    }

    save();
    return { success: true, quote };
  },

  // Submit Quotation for Approval (Officer does this)
  submitRFQForApproval(rfqId, selectedQuotationId) {
    const rfq = state.rfqs.find(r => r.id === rfqId);
    if (!rfq) return { success: false, error: 'RFQ not found' };

    const quote = state.quotations.find(q => q.id === selectedQuotationId);
    if (!quote) return { success: false, error: 'Quotation not found' };

    rfq.status = 'In Approval';
    rfq.selectedQuotationId = selectedQuotationId;
    rfq.approvalTimeline.push({
      status: 'In Approval',
      date: new Date().toISOString().split('T')[0],
      user: state.currentUser?.name || 'David Miller',
      note: `Quotation ${selectedQuotationId} (${quote.vendorName}) selected and submitted to Manager`
    });

    // notify manager
    state.notifications.unshift({
      id: Date.now() + Math.random(),
      text: `Approval Required: RFQ ${rfqId} comparison finalized. Selected Vendor: ${quote.vendorName}`,
      read: false,
      date: new Date().toISOString().split('T')[0],
      targetRole: 'manager'
    });

    this.logActivity(state.currentUser?.name || 'David Miller', 'Submit for Approval', `Submitted RFQ ${rfqId} (Selected QTN: ${selectedQuotationId})`);
    save();
    return { success: true };
  },

  // Approve or Reject RFQ Selection (Manager does this)
  approveOrRejectRFQ(rfqId, action, remarks) {
    const rfq = state.rfqs.find(r => r.id === rfqId);
    if (!rfq) return { success: false, error: 'RFQ not found' };

    const managerName = state.currentUser?.name || 'Elena Rostova';
    const quote = state.quotations.find(q => q.id === rfq.selectedQuotationId);

    if (action === 'approve') {
      rfq.status = 'Approved';
      rfq.approvalRemarks = remarks;
      rfq.approvedBy = managerName;
      rfq.approvalTimeline.push({
        status: 'Approved',
        date: new Date().toISOString().split('T')[0],
        user: managerName,
        note: `Approved selection. Remarks: ${remarks}`
      });

      // Update Quotation Statuses
      state.quotations.forEach(q => {
        if (q.rfqId === rfqId) {
          q.status = q.id === rfq.selectedQuotationId ? 'Selected' : 'Rejected';
        }
      });

      // Auto generate PO from this approval
      this.generatePurchaseOrder(rfqId);

      // notify officer
      state.notifications.unshift({
        id: Date.now() + Math.random(),
        text: `RFQ ${rfqId} Approved. PO generated for ${quote?.vendorName || 'Selected Vendor'}.`,
        read: false,
        date: new Date().toISOString().split('T')[0],
        targetRole: 'officer'
      });

      this.logActivity(managerName, 'Approve RFQ', `Approved RFQ ${rfqId} and auto-generated PO`);
    } else {
      rfq.status = 'Rejected';
      rfq.approvalRemarks = remarks;
      rfq.approvalTimeline.push({
        status: 'Rejected',
        date: new Date().toISOString().split('T')[0],
        user: managerName,
        note: `Rejected selection. Remarks: ${remarks}`
      });

      // notify officer
      state.notifications.unshift({
        id: Date.now() + Math.random(),
        text: `RFQ ${rfqId} Rejected by Manager: ${remarks}`,
        read: false,
        date: new Date().toISOString().split('T')[0],
        targetRole: 'officer'
      });

      this.logActivity(managerName, 'Reject RFQ', `Rejected RFQ ${rfqId} selection`);
    }

    save();
    return { success: true };
  },

  // Document Operations: Purchase Order & Invoice
  generatePurchaseOrder(rfqId) {
    const rfq = state.rfqs.find(r => r.id === rfqId);
    if (!rfq || rfq.status !== 'Approved') return null;

    const quote = state.quotations.find(q => q.id === rfq.selectedQuotationId);
    if (!quote) return null;

    const poId = `PO-2026-${String(state.purchaseOrders.length + 1).padStart(4, '0')}`;

    // Map items
    const poItems = rfq.items.map(rfqItem => {
      const quoteItem = quote.items.find(qi => qi.itemId === rfqItem.id);
      const unitPrice = quoteItem?.unitPrice || 0;
      return {
        name: rfqItem.name,
        qty: rfqItem.qty,
        unitPrice,
        total: rfqItem.qty * unitPrice
      };
    });

    const subtotal = poItems.reduce((acc, curr) => acc + curr.total, 0);
    const taxRate = 0.18; // 18% GST standard
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const newPO = {
      id: poId,
      rfqId,
      rfqTitle: rfq.title,
      quotationId: quote.id,
      vendorId: quote.vendorId,
      vendorName: quote.vendorName,
      date: new Date().toISOString().split('T')[0],
      items: poItems,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      status: 'Sent', // Sent, Completed
      createdBy: rfq.createdBy,
      approvedBy: rfq.approvedBy
    };

    state.purchaseOrders.push(newPO);

    // Notify vendor
    state.notifications.unshift({
      id: Date.now() + Math.random(),
      text: `New Purchase Order: ${poId} generated for your quote on ${rfq.title}`,
      read: false,
      date: new Date().toISOString().split('T')[0],
      targetRole: 'vendor',
      targetVendorId: quote.vendorId
    });

    save();
    return newPO;
  },

  acceptPO(poId) {
    const po = state.purchaseOrders.find(p => p.id === poId);
    if (po) {
      po.status = 'Accepted';
      this.logActivity(state.currentUser?.name || po.vendorName, 'Accept PO', `Accepted PO ${poId}`);
      save();
      return { success: true };
    }
    return { success: false };
  },

  updatePOShippingStatus(poId, newStatus) {
    const po = state.purchaseOrders.find(p => p.id === poId);
    if (po) {
      po.status = newStatus; // e.g. 'Shipped', 'Delivered'
      this.logActivity(state.currentUser?.name || po.vendorName, 'Update PO Status', `PO ${poId} marked as ${newStatus}`);
      save();
      return { success: true };
    }
    return { success: false };
  },

  generateInvoice(poId) {
    const po = state.purchaseOrders.find(p => p.id === poId);
    if (!po) return { success: false, error: 'Purchase Order not found' };

    // Check if invoice already exists
    const existingInv = state.invoices.find(i => i.poId === poId);
    if (existingInv) return { success: false, error: 'Invoice already generated for this PO' };

    const invId = `INV-2026-${String(state.invoices.length + 1).padStart(4, '0')}`;
    const newInvoice = {
      id: invId,
      poId: po.id,
      rfqId: po.rfqId,
      rfqTitle: po.rfqTitle,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      date: new Date().toISOString().split('T')[0],
      items: po.items,
      subtotal: po.subtotal,
      taxAmount: po.taxAmount,
      totalAmount: po.totalAmount,
      status: 'Unpaid',
      emailSent: false,
      printCount: 0
    };

    state.invoices.push(newInvoice);

    // Set PO as Completed
    po.status = 'Completed';

    // Set RFQ as Completed
    const rfq = state.rfqs.find(r => r.id === po.rfqId);
    if (rfq) {
      rfq.status = 'Completed';
      rfq.approvalTimeline.push({
        status: 'Completed',
        date: new Date().toISOString().split('T')[0],
        user: state.currentUser?.name || 'System',
        note: `Invoice ${invId} generated. Procurement process complete.`
      });
    }

    // notify officer
    state.notifications.unshift({
      id: Date.now() + Math.random(),
      text: `Invoice ${invId} submitted by ${po.vendorName} for PO ${poId}.`,
      read: false,
      date: new Date().toISOString().split('T')[0],
      targetRole: 'officer'
    });

    this.logActivity(state.currentUser?.name || po.vendorName, 'Create Invoice', `Generated invoice ${invId} for PO ${poId}`);
    save();
    return { success: true, invoice: newInvoice };
  },

  payInvoice(invoiceId) {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      invoice.status = 'Paid';
      this.logActivity(state.currentUser?.name || 'System', 'Pay Invoice', `Invoice ${invoiceId} marked as PAID`);
      save();
    }
  },

  logInvoicePrint(invoiceId) {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      invoice.printCount = (invoice.printCount || 0) + 1;
      this.logActivity(state.currentUser?.name || 'System', 'Print Invoice', `Invoice ${invoiceId} printed`);
      save();
    }
  },

  sendInvoiceEmail(invoiceId, targetEmail) {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      invoice.emailSent = true;
      this.logActivity(state.currentUser?.name || 'System', 'Email Invoice', `Invoice ${invoiceId} emailed to ${targetEmail}`);
      save();
      return true;
    }
    return false;
  },

  // Audit Logs & Notifications
  logActivity(user, action, details) {
    const log = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user,
      action,
      details
    };
    state.activityLogs.unshift(log);
    // Keep logs size reasonable
    if (state.activityLogs.length > 200) {
      state.activityLogs.pop();
    }
    save();
  },

  markNotificationsRead() {
    state.notifications.forEach(n => {
      n.read = true;
    });
    save();
  }
};

