// Login Screen Module
import { store } from '../store.js';
import { router } from '../router.js';

export default {
  render(container) {
    container.innerHTML = `
      <div class="auth-page-wrapper fade-in">
        <!-- Left Side Premium Info Panel -->
        <div class="auth-info-side">
          <div class="auth-bg-shapes">
            <div class="shape-1"></div>
            <div class="shape-2"></div>
            <div class="shape-3"></div>
          </div>
          <div class="auth-info-content fade-in" style="animation-delay: 0.2s;">
            <div class="auth-logo-large">
              <div class="logo-icon-large">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path>
                  <path d="M18 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4"></path>
                  <circle cx="8" cy="12" r="2"></circle>
                </svg>
              </div>
              <div class="logo-text-large">VendorBridge AI</div>
            </div>
            
            <h1 class="auth-info-title">The Future of Enterprise Procurement</h1>
            <p class="auth-info-desc">Streamline your entire source-to-pay lifecycle with AI-driven insights, automated RFQ comparisons, and seamless vendor collaboration across your entire supply chain.</p>
            
            <div class="auth-features">
              <div class="feature-item">
                <div class="feature-icon">✨</div>
                <span>Smart Vendor Onboarding & Management</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <span>Automated Quotation Comparison Matrices</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <span>1-Click Purchase Orders & Invoicing</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Form Panel -->
        <div class="auth-form-side">
          <div class="auth-container">
            <div class="auth-card">
              <div class="auth-header" style="text-align: left;">
                <h2 style="font-size: 28px; margin-bottom: 6px;">Welcome Back</h2>
                <p id="auth-subtitle">Sign in to your organization workspace</p>
              </div>

              <!-- Alert message -->
              <div id="auth-alert" style="display: none; padding: 10px 14px; margin-bottom: 20px; border-radius: 8px; font-size: 13px; font-weight: 500;"></div>

              <!-- Sign In Form -->
              <form id="login-form">
                <div class="form-group">
                  <label style="display: block; margin-bottom: 8px;">Login As</label>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
                    <button type="button" class="role-select-btn login-role-btn active" data-role="admin">
                      <span class="role-select-icon">🛡️</span>
                      <span class="role-select-label" style="font-size: 12px;">Admin</span>
                    </button>
                    <button type="button" class="role-select-btn login-role-btn" data-role="manager">
                      <span class="role-select-icon">✍️</span>
                      <span class="role-select-label" style="font-size: 12px;">Manager</span>
                    </button>
                    <button type="button" class="role-select-btn login-role-btn" data-role="officer">
                      <span class="role-select-icon">🏢</span>
                      <span class="role-select-label" style="font-size: 12px;">Officer</span>
                    </button>
                    <button type="button" class="role-select-btn login-role-btn" data-role="vendor">
                      <span class="role-select-icon">📦</span>
                      <span class="role-select-label" style="font-size: 12px;">Vendor</span>
                    </button>
                  </div>
                  <input type="hidden" id="login-role" value="admin">
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input type="email" id="email" class="form-control" placeholder="name@company.com" required>
                </div>
                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <label style="margin: 0;">Password</label>
                    <a href="#" id="btn-forgot-password-view" style="font-size: 13px;">Forgot Password?</a>
                  </div>
                  <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 10px;">Sign In</button>
              </form>

              <!-- Sign Up Form (Hidden by default) -->
              <form id="signup-form" style="display: none;">
                <div class="form-group">
                  <label for="signup-name">Your Name</label>
                  <input type="text" id="signup-name" class="form-control" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                  <label for="signup-email">Email Address</label>
                  <input type="email" id="signup-email" class="form-control" placeholder="name@company.com" required>
                </div>
                <div class="form-group">
                  <label for="signup-password">Password</label>
                  <input type="password" id="signup-password" class="form-control" placeholder="Create secure password" required>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="vendor-company">Company Name</label>
                    <input type="text" id="vendor-company" class="form-control" placeholder="e.g. Apex Industrial Ltd" required>
                  </div>
                  <div class="form-group">
                    <label for="vendor-gst">GST Number</label>
                    <input type="text" id="vendor-gst" class="form-control" placeholder="e.g. 27AAACA1111A1Z1" required>
                  </div>
                </div>
                <div class="form-group">
                  <label style="display: block; margin-bottom: 8px;">Select Account Type</label>
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
                    <button type="button" class="role-select-btn active" data-role="officer">
                      <span class="role-select-icon">🏢</span>
                      <span class="role-select-label">Officer</span>
                    </button>
                    <button type="button" class="role-select-btn" data-role="vendor">
                      <span class="role-select-icon">📦</span>
                      <span class="role-select-label">Vendor</span>
                    </button>
                    <button type="button" class="role-select-btn" data-role="manager">
                      <span class="role-select-icon">✍️</span>
                      <span class="role-select-label">Manager</span>
                    </button>
                  </div>
                  <input type="hidden" id="signup-role" value="officer">
                </div>

                <!-- Additional Vendor details -->
                <div id="vendor-details-fields" style="display: none; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
                  <div class="form-group">
                    <label for="vendor-category">Industry Category</label>
                    <select id="vendor-category" class="form-control">
                      <option value="Industrial Equipment">Industrial Equipment</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Office Stationery & IT">Office Stationery & IT</option>
                      <option value="Logistics Services">Logistics Services</option>
                    </select>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="vendor-phone">Contact Phone</label>
                      <input type="text" id="vendor-phone" class="form-control" placeholder="+1-555-0100">
                    </div>
                    <div class="form-group">
                      <label for="vendor-address">Office Address</label>
                      <input type="text" id="vendor-address" class="form-control" placeholder="123 Corporate Ave">
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 16px;">Create Account</button>
              </form>

              <!-- Forgot Password Form (Hidden by default) -->
              <form id="forgot-form" style="display: none;">
                <div class="form-group">
                  <label for="forgot-email">Email Address</label>
                  <input type="email" id="forgot-email" class="form-control" placeholder="name@company.com" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 10px;">Send Reset Instructions</button>
              </form>

              <!-- Toggle Views footer -->
              <div class="auth-footer-text">
                <span id="footer-prompt">Don't have an account?</span>
                <a href="#" id="auth-toggle-link">Sign Up</a>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    const loginForm = container.querySelector('#login-form');
    const signupForm = container.querySelector('#signup-form');
    const forgotForm = container.querySelector('#forgot-form');
    const authToggleLink = container.querySelector('#auth-toggle-link');
    const btnForgotPasswordView = container.querySelector('#btn-forgot-password-view');
    const footerPrompt = container.querySelector('#footer-prompt');
    const authSubtitle = container.querySelector('#auth-subtitle');
    const authAlert = container.querySelector('#auth-alert');
    const signupRole = container.querySelector('#signup-role');
    const loginRole = container.querySelector('#login-role');
    const vendorFields = container.querySelector('#vendor-details-fields');

    let currentMode = 'login'; // login, signup, forgot

    const showAlert = (message, type = 'danger') => {
      authAlert.innerText = message;
      authAlert.style.display = 'block';
      if (type === 'danger') {
        authAlert.style.backgroundColor = 'var(--color-danger-bg)';
        authAlert.style.color = 'var(--color-danger)';
        authAlert.style.border = '1px solid rgba(239, 68, 68, 0.2)';
      } else {
        authAlert.style.backgroundColor = 'var(--color-success-bg)';
        authAlert.style.color = 'var(--color-success)';
        authAlert.style.border = '1px solid rgba(16, 185, 129, 0.2)';
      }
    };

    const hideAlert = () => {
      authAlert.style.display = 'none';
    };

    // Toggle Role-based Signup fields via visual button choices
    const signupRoleButtons = container.querySelectorAll('#signup-form .role-select-btn');
    signupRoleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const clickedBtn = e.currentTarget;
        const selectedRole = clickedBtn.getAttribute('data-role');
        
        signupRoleButtons.forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        signupRole.value = selectedRole;
        
        if (selectedRole === 'vendor') {
          vendorFields.style.display = 'block';
          vendorFields.querySelectorAll('input').forEach(i => i.setAttribute('required', 'true'));
        } else {
          vendorFields.style.display = 'none';
          vendorFields.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
        }
      });
    });

    // Toggle Role-based Login fields
    const loginRoleButtons = container.querySelectorAll('.login-role-btn');
    loginRoleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const clickedBtn = e.currentTarget;
        const selectedRole = clickedBtn.getAttribute('data-role');
        
        loginRoleButtons.forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        if (loginRole) {
          loginRole.value = selectedRole;
        }
      });
    });

    // Toggle forms
    authToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      hideAlert();
      if (currentMode === 'login' || currentMode === 'forgot') {
        currentMode = 'signup';
        loginForm.style.display = 'none';
        forgotForm.style.display = 'none';
        signupForm.style.display = 'block';
        authSubtitle.innerText = 'Create your secure procurement profile';
        footerPrompt.innerText = 'Already have an account?';
        authToggleLink.innerText = 'Sign In';
      } else {
        currentMode = 'login';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        forgotForm.style.display = 'none';
        authSubtitle.innerText = 'Sign in to your organization workspace';
        footerPrompt.innerText = "Don't have an account?";
        authToggleLink.innerText = 'Sign Up';
      }
    });

    btnForgotPasswordView.addEventListener('click', (e) => {
      e.preventDefault();
      hideAlert();
      currentMode = 'forgot';
      loginForm.style.display = 'none';
      signupForm.style.display = 'none';
      forgotForm.style.display = 'block';
      authSubtitle.innerText = 'Recover your account password';
      footerPrompt.innerText = 'Remember your password?';
      authToggleLink.innerText = 'Sign In';
    });

    // Submit actions
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAlert();
      const email = container.querySelector('#email').value.trim();
      const password = container.querySelector('#password').value;
      const role = container.querySelector('#login-role') ? container.querySelector('#login-role').value : null;

      const res = store.login(email, password, role);
      if (res.success) {
        window.location.hash = '#dashboard';
      } else {
        showAlert(res.error, 'danger');
      }
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAlert();
      const name = container.querySelector('#signup-name').value.trim();
      const email = container.querySelector('#signup-email').value.trim();
      const password = container.querySelector('#signup-password').value;
      const role = signupRole.value;

      const companyDetails = {
        companyName: container.querySelector('#vendor-company').value.trim(),
        gst: container.querySelector('#vendor-gst').value.trim().toUpperCase(),
        category: role === 'vendor' ? container.querySelector('#vendor-category').value : 'General',
        phone: role === 'vendor' ? container.querySelector('#vendor-phone').value.trim() : 'N/A',
        address: role === 'vendor' ? container.querySelector('#vendor-address').value.trim() : 'N/A'
      };

      const res = store.signup(name, email, password, role, companyDetails);
      if (res.success) {
        window.location.hash = '#dashboard';
      } else {
        showAlert(res.error, 'danger');
      }
    });

    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAlert();
      const email = container.querySelector('#forgot-email').value.trim();
      const res = store.forgotPassword(email);
      if (res.success) {
        showAlert(res.message, 'success');
        container.querySelector('#forgot-email').value = '';
      } else {
        showAlert(res.error, 'danger');
      }
    });

  }
};
