/**
 * Versatile Air Conditioner Systems (VACS)
 * Core Application Script - Mobile Optimized, WhatsApp Lead Engine & Smart Price Configurator
 */

const VACS_CONFIG = {
  businessName: 'Versatile Air Conditioner Systems',
  proprietor: 'CH. SANTHOSH',
  phones: ['9700063938', '9010424305'],
  landline: '',
  email: 'info@versatileairconditioners.com',
  address: 'LIG.30/9, KPHB, 4th Phase, Beside Foot Over Bridge, Kukatpally, Hyderabad, Telangana - 500072',
  whatsappPhone: '919700063938'
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFloatingQuickContact();
  initWhatsAppButtons();
  initContactForms();
  initServiceAndAmcCalculators();
  initPriceConfiguratorModal();
  initYear();
});

// Mobile Navigation Drawer with Backdrop & Submenu Accordion
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  if (!toggleBtn || !mainNav) return;

  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const openDrawer = () => {
    mainNav.classList.add('mobile-active');
    backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.innerHTML = '<svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  };

  const closeDrawer = () => {
    mainNav.classList.remove('mobile-active');
    backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 9.5h16M4 14h16M4 18.5h16"></path></svg>';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainNav.classList.contains('mobile-active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const parentLink = dropdown.querySelector('.nav-link');
    if (parentLink) {
      parentLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 1040) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  mainNav.querySelectorAll('.dropdown-item, .nav-link:not(.nav-dropdown > .nav-link)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1040) {
        closeDrawer();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040 && mainNav.classList.contains('mobile-active')) {
      closeDrawer();
    }
  });
}

function generateWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${VACS_CONFIG.whatsappPhone}?text=${encoded}`;
}

// Bind quick WhatsApp inquiry triggers (Idempotent)
function initWhatsAppButtons() {
  document.querySelectorAll('[data-wa-action]').forEach(btn => {
    if (btn.dataset.waBound === 'true') return;
    btn.dataset.waBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.waAction || 'general';
      const model = btn.dataset.model || '';
      const offerPrice = btn.dataset.offerPrice || '';
      const mrpPrice = btn.dataset.mrpPrice || '';

      let msg = `Hello CH. Santhosh (Versatile Air Conditioner Systems), I am looking for Daikin Air Conditioners in Hyderabad.`;

      if (action === 'quote' && model) {
        const priceInfo = offerPrice ? ` (Website Offer: ${offerPrice}, MRP: ${mrpPrice})` : '';
        msg = `Hello Versatile Air Conditioner Systems, I want the best showroom deal and installation details for Daikin Model: *${model}*${priceInfo} in Hyderabad.`;
      } else if (action === 'service') {
        msg = `Hello VACS Team, I would like to book an Authorized Daikin AC Service / Jet Wash visit in Hyderabad.`;
      } else if (action === 'amc') {
        msg = `Hello VACS Team, I am interested in an Annual Maintenance Contract (AMC) for my Daikin ACs in Hyderabad.`;
      }

      window.open(generateWhatsAppUrl(msg), '_blank');
    });
  });
}

window.initWhatsAppButtons = initWhatsAppButtons;

// Static Contact Form submission -> WhatsApp
function initContactForms() {
  const form = document.getElementById('vacsContactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || '';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'General Inquiry';
      const location = form.querySelector('[name="location"]')?.value || 'Hyderabad';
      const notes = form.querySelector('[name="notes"]')?.value || '';

      const msg = `*New Customer Inquiry - VACS Website*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Requirement:* ${service}\n*Location:* ${location}${notes ? '\n*Details:* ' + notes : ''}\n\nPlease share quotation and availability.`;

      window.open(generateWhatsAppUrl(msg), '_blank');
      form.reset();
    });
  }
}

// Interactive Multi-AC Service & AMC Fleet Cost Calculators on services.html & amc.html
function initServiceAndAmcCalculators() {
  const srvForm = document.getElementById('serviceBookingCalcForm');
  if (srvForm) {
    const updateSrv = () => {
      const type = document.getElementById('srvTypeSelect')?.value || 'jet-wash';
      const qty = parseInt(document.getElementById('srvUnitCount')?.value || '2', 10);
      const pr = window.VACS_Pricing ? window.VACS_Pricing.getServicePrice(type) : { mrp: 799, sellingPrice: 499, name: 'AC Service' };

      // Extra 10% bulk discount if 2 or more units for jet-wash
      const unitOffer = (type === 'jet-wash' && qty >= 2) ? 449 : pr.sellingPrice;
      const totalMrp = pr.mrp * qty;
      const totalOffer = unitOffer * qty;
      const totalSaved = Math.max(0, totalMrp - totalOffer);

      const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

      setEl('srvCalcTotalOffer', fmt(totalOffer));
      setEl('srvCalcTotalMrp', fmt(totalMrp));
      setEl('srvCalcSaved', `You Save ${fmt(totalSaved)}`);

      const btn = document.getElementById('srvCalcBookWaBtn');
      if (btn) {
        btn.onclick = () => {
          const msg = `Hello VACS Team, I want to book *${pr.name}* for *${qty} AC(s)* (Estimated Offer: ${fmt(totalOffer)} vs Regular ${fmt(totalMrp)}). Please confirm technician slot in Hyderabad.`;
          window.open(generateWhatsAppUrl(msg), '_blank');
        };
      }
    };
    srvForm.querySelectorAll('select, input').forEach(el => {
      el.addEventListener('change', updateSrv);
      el.addEventListener('input', updateSrv);
    });
    updateSrv();
  }

  const amcForm = document.getElementById('amcFleetCalcForm');
  if (amcForm) {
    const updateAmc = () => {
      const plan = document.getElementById('amcPlanSelect')?.value || 'comprehensive-split';
      const qty = parseInt(document.getElementById('amcUnitCount')?.value || '2', 10);
      const pr = window.VACS_Pricing ? window.VACS_Pricing.getAmcPrice(plan) : { mrp: 4500, sellingPrice: 3499, name: 'Comprehensive AMC' };

      // Fleet multi-unit discount: 5% off for 2-4 units, 10% off for 5+ units
      const fleetFactor = qty >= 5 ? 0.90 : (qty >= 2 ? 0.95 : 1.0);
      const totalMrp = pr.mrp * qty;
      const totalOffer = Math.round(pr.sellingPrice * qty * fleetFactor);
      const totalSaved = Math.max(0, totalMrp - totalOffer);

      const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

      setEl('amcCalcTotalOffer', fmt(totalOffer) + ' / Year');
      setEl('amcCalcTotalMrp', fmt(totalMrp));
      setEl('amcCalcSaved', `Total Savings: ${fmt(totalSaved)} ${qty >= 2 ? '(Includes Multi-AC Fleet Discount)' : ''}`);

      const btn = document.getElementById('amcCalcBookWaBtn');
      if (btn) {
        btn.onclick = () => {
          const msg = `Hello CH. Santhosh (VACS), I want an AMC Contract Quote:\n• Plan: ${pr.name}\n• Number of ACs: ${qty}\n• Website Estimate: ${fmt(totalOffer)}/yr (MRP ${fmt(totalMrp)})\nPlease arrange inspection in Hyderabad.`;
          window.open(generateWhatsAppUrl(msg), '_blank');
        };
      }
    };
    amcForm.querySelectorAll('select, input').forEach(el => {
      el.addEventListener('change', updateAmc);
      el.addEventListener('input', updateAmc);
    });
    updateAmc();
  }
}

// Built-in Visual Price & Discount Configurator Modal (for easy owner price updates)
function initPriceConfiguratorModal() {
  const modal = document.createElement('div');
  modal.id = 'priceAdminModalOverlay';
  modal.className = 'price-admin-modal-overlay';
  modal.innerHTML = `
    <div class="price-admin-modal">
      <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
        <div>
          <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a;">Smart Pricing & Discount Configurator</h3>
          <p style="font-size: 0.72rem; color: #64748b;">Modify category discounts or model prices below. Preview live or download updated <code>data/pricing-config.js</code>.</p>
        </div>
        <button id="closePriceAdminBtn" style="background: none; border: 1px solid #cbd5e1; border-radius: 4px; width: 28px; height: 28px; cursor: pointer; font-size: 1.1rem; line-height: 1;">&times;</button>
      </div>
      <div style="padding: 1.25rem; overflow-y: auto; flex: 1; font-size: 0.8125rem;" id="priceAdminBody"></div>
      <div style="padding: 0.85rem 1.25rem; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <button id="resetPriceConfigBtn" class="btn btn-outline btn-sm">Reset to Default</button>
        <div style="display: flex; gap: 0.5rem;">
          <button id="applyPriceLiveBtn" class="btn btn-outline btn-sm" style="border-color: #0284c7; color: #0284c7;">Apply & Preview Live</button>
          <button id="downloadPriceConfigBtn" class="btn btn-primary btn-sm">Download pricing-config.js</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  window.openPriceConfigurator = () => {
    const cfg = window.VACS_Pricing ? window.VACS_Pricing.getConfig() : window.VACS_PRICING_CONFIG;
    if (!cfg) return;
    const body = document.getElementById('priceAdminBody');
    const products = window.VACS_PRODUCTS_DATA || [];

    body.innerHTML = `
      <div style="margin-bottom: 1.25rem; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 0.85rem;">
        <div style="font-weight: 700; color: #0369a1; margin-bottom: 0.35rem;">Quick Bulk Discount Adjuster (%)</div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.75rem; color: #334155;">Apply flat discount % across all models from MRP:</span>
          <input type="number" id="bulkDiscountInput" value="20" min="1" max="60" class="form-control" style="width: 80px; padding: 0.25rem 0.5rem;">
          <button type="button" id="applyBulkDiscBtn" class="btn btn-primary btn-sm">Recalculate All Selling Prices</button>
        </div>
      </div>

      <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 6px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 0.55rem;">Model</th>
              <th style="padding: 0.55rem;">Category / Spec</th>
              <th style="padding: 0.55rem;">Actual MRP (₹)</th>
              <th style="padding: 0.55rem;">After-Discount Price (₹)</th>
              <th style="padding: 0.55rem;">Auto Discount</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const pr = window.VACS_Pricing.getProductPrice(p);
              return `
                <tr style="border-bottom: 1px solid #f1f5f9;" data-admin-row="${p.id}">
                  <td style="padding: 0.45rem 0.55rem; font-weight: 700; color: #0f172a;">${p.model}</td>
                  <td style="padding: 0.45rem 0.55rem; color: #64748b;">${p.tonnage} • ${p.star_rating}</td>
                  <td style="padding: 0.45rem 0.55rem;">
                    <input type="number" class="form-control admin-mrp-inp" value="${pr.mrp}" style="width: 105px; padding: 0.25rem 0.4rem;">
                  </td>
                  <td style="padding: 0.45rem 0.55rem;">
                    <input type="number" class="form-control admin-sell-inp" value="${pr.sellingPrice}" style="width: 105px; padding: 0.25rem 0.4rem;">
                  </td>
                  <td style="padding: 0.45rem 0.55rem;">
                    <span class="price-discount-pill admin-disc-Preview">${pr.discountPercent}% OFF (Save ₹${(pr.mrp - pr.sellingPrice).toLocaleString('en-IN')})</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Bind live row calculation
    body.querySelectorAll('tr[data-admin-row]').forEach(row => {
      const mrpInp = row.querySelector('.admin-mrp-inp');
      const sellInp = row.querySelector('.admin-sell-inp');
      const badge = row.querySelector('.admin-disc-Preview');
      const updateBadge = () => {
        const m = parseInt(mrpInp.value, 10) || 0;
        const s = parseInt(sellInp.value, 10) || 0;
        const sv = Math.max(0, m - s);
        const pct = m > 0 ? Math.round((sv / m) * 100) : 0;
        badge.textContent = `${pct}% OFF (Save ₹${sv.toLocaleString('en-IN')})`;
      };
      mrpInp.addEventListener('input', updateBadge);
      sellInp.addEventListener('input', updateBadge);
    });

    const bulkBtn = document.getElementById('applyBulkDiscBtn');
    if (bulkBtn) {
      bulkBtn.onclick = () => {
        const pct = parseFloat(document.getElementById('bulkDiscountInput')?.value || '20');
        body.querySelectorAll('tr[data-admin-row]').forEach(row => {
          const mrpInp = row.querySelector('.admin-mrp-inp');
          const sellInp = row.querySelector('.admin-sell-inp');
          const m = parseInt(mrpInp.value, 10) || 0;
          sellInp.value = Math.round((m * (100 - pct)) / 100 / 10) * 10;
          sellInp.dispatchEvent(new Event('input'));
        });
      };
    }

    modal.classList.add('open');
  };

  const collectUpdatedConfig = () => {
    const cfg = JSON.parse(JSON.stringify(window.VACS_PRICING_CONFIG));
    document.querySelectorAll('tr[data-admin-row]').forEach(row => {
      const id = row.getAttribute('data-admin-row');
      const m = parseInt(row.querySelector('.admin-mrp-inp').value, 10) || 0;
      const s = parseInt(row.querySelector('.admin-sell-inp').value, 10) || 0;
      if (!cfg.modelPrices[id]) cfg.modelPrices[id] = {};
      cfg.modelPrices[id].mrp = m;
      cfg.modelPrices[id].sellingPrice = s;
    });
    return cfg;
  };

  document.getElementById('closePriceAdminBtn')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  document.getElementById('applyPriceLiveBtn')?.addEventListener('click', () => {
    const updated = collectUpdatedConfig();
    localStorage.setItem('vacs_custom_pricing_v1', JSON.stringify(updated));
    window.VACS_PRICING_CONFIG = updated;
    modal.classList.remove('open');
    window.location.reload();
  });

  document.getElementById('resetPriceConfigBtn')?.addEventListener('click', () => {
    localStorage.removeItem('vacs_custom_pricing_v1');
    modal.classList.remove('open');
    window.location.reload();
  });

  document.getElementById('downloadPriceConfigBtn')?.addEventListener('click', () => {
    const updated = collectUpdatedConfig();
    localStorage.setItem('vacs_custom_pricing_v1', JSON.stringify(updated));
    const blob = new Blob([
      `// Updated via VACS Smart Pricing Configurator on ${new Date().toLocaleDateString()}\n` +
      `window.VACS_PRICING_CONFIG = ${JSON.stringify(updated, null, 2)};\n`
    ], { type: 'application/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pricing-config.js';
    a.click();
  });

  // Auto-open if URL has ?admin=price
  if (new URLSearchParams(window.location.search).get('admin') === 'price') {
    setTimeout(() => window.openPriceConfigurator(), 300);
  }
}

function initYear() {
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Homepage Panoramic Banner Slide Switcher
  window.switchHomeBanner = (slideNum) => {
    const s1 = document.getElementById('panoSlide1');
    const s2 = document.getElementById('panoSlide2');
    const dots = document.querySelectorAll('.pano-dot');
    if (!s1 || !s2) return;
    if (slideNum === 2) {
      s1.classList.remove('active');
      s2.classList.add('active');
      dots[0]?.classList.remove('active');
      dots[1]?.classList.add('active');
    } else {
      s2.classList.remove('active');
      s1.classList.add('active');
      dots[1]?.classList.remove('active');
      dots[0]?.classList.add('active');
    }
  };
}

// Floating Bottom-Right Quick Contact Widget + Mobile Drawer Contact Footer
function initFloatingQuickContact() {
  // 1. Add mobile-only quick contact block inside mobile navigation drawer
  const mainNav = document.querySelector('.main-nav');
  if (mainNav && !mainNav.querySelector('.mobile-drawer-cta')) {
    const mobileCta = document.createElement('div');
    mobileCta.className = 'mobile-drawer-cta';
    mobileCta.innerHTML = `
      <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; margin-bottom: 0.45rem; text-transform: uppercase; letter-spacing: 0.04em;">
        Showroom Helpline • KPHB, Hyderabad
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        <a href="tel:+919700063938" class="btn btn-outline btn-sm" style="justify-content: center; height: 38px;">
          📞 Call 97000 63938
        </a>
        <button type="button" class="btn btn-whatsapp btn-sm" data-wa-action="general" style="justify-content: center; height: 38px;">
          💬 WhatsApp Us
        </button>
      </div>
    `;
    mainNav.appendChild(mobileCta);
  }

  // 2. Add subtle bottom-right Floating Quick-Contact Pill
  if (!document.getElementById('vacsFloatingDock')) {
    const dock = document.createElement('div');
    dock.id = 'vacsFloatingDock';
    dock.className = 'vacs-floating-dock';
    dock.innerHTML = `
      <a href="tel:+919700063938" class="floating-pill-call" title="Call CH. Santhosh (+91 97000 63938)">
        <svg viewBox="0 0 20 20" fill="currentColor" style="width: 15px; height: 15px;"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
        <span>97000 63938</span>
      </a>
      <button type="button" class="floating-pill-wa" data-wa-action="general" title="Chat on WhatsApp for Instant AC / VRV Quote">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.802-.413-1.424-.595-2.348-2.029-2.42-2.123-.072-.095-.572-.76-.572-1.448s.361-1.026.49-1.168c.129-.142.28-.179.375-.179.094 0 .189.001.272.006.088.006.205-.034.321.246.12.29.414 1.008.45 1.082.036.074.06.16.012.256-.048.096-.073.156-.145.241-.072.085-.153.19-.219.255-.073.072-.149.15-.064.296.085.145.378.625.811 1.011.558.497 1.029.65 1.174.722.146.072.23.06.315-.037.085-.096.363-.423.46-.568.097-.145.193-.12.325-.072.133.048.841.396.986.469.145.072.241.108.277.169.036.06.036.353-.108.758z"/></svg>
        <span>WhatsApp Quote</span>
      </button>
    `;
    document.body.appendChild(dock);
  }
}
