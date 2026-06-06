// Reports & Analytics Screen Module
import { store } from '../store.js';

export default {
  render(container) {
    const user = store.getCurrentUser();
    if (!user || user.role === 'vendor') return; // Vendors do not see analytics

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title">
            <h1>Procurement Analytics & Reports</h1>
            <p>Review spend metrics, vendor performance tracking, and order trends.</p>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-primary" id="btn-export-csv">📥 Export Spend Report (CSV)</button>
          </div>
        </div>

        <!-- Analytics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <span>TOTAL PROCURED BUDGET</span>
              <span style="color: var(--color-success);">+12% vs last month</span>
            </div>
            <span class="metric-value">₹34,610.00</span>
            <div class="metric-change neutral">E2E Sourced Orders</div>
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <span>AVG LEAD TIME</span>
              <span style="color: var(--color-success);">-2.4 days</span>
            </div>
            <span class="metric-value">7.3 Days</span>
            <div class="metric-change neutral">Fulfillment Cycle Speed</div>
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <span>QUOTE CONVERSION RATE</span>
              <span style="color: var(--color-warning);">+3.1%</span>
            </div>
            <span class="metric-value">84.2%</span>
            <div class="metric-change neutral">Bidding Success Ratio</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Donut chart: Spend by Category -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Spend Distribution by Category</h3>
            </div>
            <div class="card-body">
              <div class="analytics-chart-container">
                <svg width="220" height="220" viewBox="0 0 42 42" class="chart-svg" style="max-width: 220px; transform: rotate(-90deg);">
                  <!-- Base background circle -->
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" stroke-width="4"></circle>
                  
                  <!-- Segment 1: Industrial Equipment (₹32,250 -> 93%) -->
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-primary)" stroke-width="4.5" 
                    stroke-dasharray="93 7" stroke-dashoffset="0" class="chart-segment" data-segment="Industrial Equipment"></circle>
                  
                  <!-- Segment 2: Office & IT (₹2,360 -> 7%) -->
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-success)" stroke-width="4.5" 
                    stroke-dasharray="7 93" stroke-dashoffset="-93" class="chart-segment" data-segment="Office Stationery & IT"></circle>
                </svg>

                <div style="display: flex; flex-direction: column; gap: 10px; margin-left: 32px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 3px; background-color: var(--color-primary);"></div>
                    <span style="font-size: 13px;">Industrial Equipment (93%)<br><strong style="color: var(--text-white);">₹32,250.00</strong></span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 3px; background-color: var(--color-success);"></div>
                    <span style="font-size: 13px;">Office Stationery & IT (7%)<br><strong style="color: var(--text-white);">₹2,360.00</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bar Chart: Vendor Quality Ratings -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Vendor Compliance Ratings</h3>
            </div>
            <div class="card-body">
              <div class="analytics-chart-container" style="height: 220px; align-items: flex-end;">
                <svg viewBox="0 0 300 200" class="chart-svg" style="height: 100%;">
                  <!-- Gridlines -->
                  <line x1="40" y1="30" x2="280" y2="30" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1"></line>
                  <line x1="40" y1="70" x2="280" y2="70" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1"></line>
                  <line x1="40" y1="110" x2="280" y2="110" stroke="var(--border-color)" stroke-dasharray="4 4" stroke-width="1"></line>
                  <line x1="40" y1="150" x2="280" y2="150" stroke="var(--border-color)" stroke-width="1"></line>

                  <!-- Bars -->
                  <!-- Apex (4.8) -->
                  <rect x="60" y="38" width="40" height="112" fill="var(--color-primary)" rx="4"></rect>
                  <text x="80" y="28" fill="var(--text-white)" font-size="11" text-anchor="middle" font-weight="700">4.8</text>
                  <text x="80" y="168" fill="var(--text-muted)" font-size="10" text-anchor="middle">Apex</text>

                  <!-- Global (4.5) -->
                  <rect x="130" y="47" width="40" height="103" fill="var(--color-info)" rx="4"></rect>
                  <text x="150" y="37" fill="var(--text-white)" font-size="11" text-anchor="middle" font-weight="700">4.5</text>
                  <text x="150" y="168" fill="var(--text-muted)" font-size="10" text-anchor="middle">Global</text>

                  <!-- Zenith (4.2) -->
                  <rect x="200" y="56" width="40" height="94" fill="var(--color-success)" rx="4"></rect>
                  <text x="220" y="46" fill="var(--text-white)" font-size="11" text-anchor="middle" font-weight="700">4.2</text>
                  <text x="220" y="168" fill="var(--text-muted)" font-size="10" text-anchor="middle">Zenith</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Line Chart: Monthly Spending Trend -->
        <div class="card" style="margin-top: 24px;">
          <div class="card-header">
            <h3 class="card-title">Monthly Sourcing Procurement Trends</h3>
          </div>
          <div class="card-body">
            <div class="analytics-chart-container" style="height: 240px; padding: 0 16px;">
              <svg viewBox="0 0 700 200" class="chart-svg" style="height: 100%;">
                <!-- Horizontal guidelines -->
                <line x1="50" y1="30" x2="650" y2="30" stroke="var(--border-light)" stroke-width="1" stroke-dasharray="3 3"></line>
                <line x1="50" y1="80" x2="650" y2="80" stroke="var(--border-light)" stroke-width="1" stroke-dasharray="3 3"></line>
                <line x1="50" y1="130" x2="650" y2="130" stroke="var(--border-light)" stroke-width="1" stroke-dasharray="3 3"></line>
                <line x1="50" y1="170" x2="650" y2="170" stroke="var(--border-color)" stroke-width="1.5"></line>

                <!-- Line path representing spend values: Jan(10k), Feb(15k), Mar(12k), Apr(28k), May(34k), Jun(31k) -->
                <path d="M 100 130 L 200 100 L 300 120 L 400 60 L 500 30 L 600 45" 
                  fill="none" stroke="var(--color-primary)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path>
                
                <!-- Glow path -->
                <path d="M 100 130 L 200 100 L 300 120 L 400 60 L 500 30 L 600 45" 
                  fill="none" stroke="var(--color-primary)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.08"></path>

                <!-- Data node dots -->
                <circle cx="100" cy="130" r="5" fill="var(--color-primary)" stroke="var(--bg-card)" stroke-width="2"></circle>
                <circle cx="200" cy="100" r="5" fill="var(--color-primary)" stroke="var(--bg-card)" stroke-width="2"></circle>
                <circle cx="300" cy="120" r="5" fill="var(--color-primary)" stroke="var(--bg-card)" stroke-width="2"></circle>
                <circle cx="400" cy="60" r="5" fill="var(--color-primary)" stroke="var(--bg-card)" stroke-width="2"></circle>
                <circle cx="500" cy="30" r="5" fill="var(--color-primary)" stroke="var(--bg-card)" stroke-width="2"></circle>
                <circle cx="600" cy="45" r="5" fill="var(--color-primary)" stroke="var(--bg-card)" stroke-width="2"></circle>

                <!-- Month labels -->
                <text x="100" y="190" fill="var(--text-muted)" font-size="11" text-anchor="middle">Jan (₹10k)</text>
                <text x="200" y="190" fill="var(--text-muted)" font-size="11" text-anchor="middle">Feb (₹15k)</text>
                <text x="300" y="190" fill="var(--text-muted)" font-size="11" text-anchor="middle">Mar (₹12k)</text>
                <text x="400" y="190" fill="var(--text-muted)" font-size="11" text-anchor="middle">Apr (₹28k)</text>
                <text x="500" y="190" fill="var(--text-muted)" font-size="11" text-anchor="middle">May (₹34k)</text>
                <text x="600" y="190" fill="var(--text-muted)" font-size="11" text-anchor="middle">Jun (₹31k)</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    const exportBtn = container.querySelector('#btn-export-csv');

    exportBtn.addEventListener('click', () => {
      // compile CSV content
      const csvContent = `Vendor ID,Vendor Name,Category,GST,Rating,Status
VND-001,Apex Industrial Ltd,Industrial Equipment,27AAACA1111A1Z1,4.8,Active
VND-002,Global Materials Corp,Raw Materials,27AAACG2222B2Z2,4.5,Active
VND-003,Zenith Supplies Inc,Office Stationery & IT,27AAACZ3333C3Z3,4.2,Active
`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `VendorBridge_Spend_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      store.logActivity(store.getCurrentUser().name, 'Export CSV', 'Exported vendor compliance directory spreadsheet.');
      alert('CSV Spend Report compiled and download started.');
    });
  }
};

