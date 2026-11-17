/**
 * Versatile Air Conditioner Systems (VACS)
 * 3-Product Comparison Engine
 */

class ProductComparator {
  constructor() {
    this.selectedIds = [];
    this.productsData = [];
    this.init();
  }

  async init() {
    // 1. Check window.VACS_PRODUCTS_DATA (instant, zero CORS)
    if (window.VACS_PRODUCTS_DATA && Array.isArray(window.VACS_PRODUCTS_DATA) && window.VACS_PRODUCTS_DATA.length > 0) {
      this.productsData = window.VACS_PRODUCTS_DATA;
    } else {
      try {
        const resp = await fetch('data/products.json');
        this.productsData = await resp.json();
      } catch (e) {
        console.warn('Could not load products.json for comparison', e);
      }
    }

    this.renderBar();
    this.bindEvents();
  }

  bindEvents() {
    // Listen for compare checkbox changes
    document.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('compare-checkbox')) {
        const productId = e.target.dataset.id;
        if (e.target.checked) {
          this.addProduct(productId, e.target);
        } else {
          this.removeProduct(productId);
        }
      }
    });

    // Launch comparison modal button
    const launchBtn = document.getElementById('launchCompareModalBtn');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => this.openModal());
    }

    // Close modal button
    const closeBtn = document.getElementById('closeCompareModalBtn');
    const overlay = document.getElementById('compareModalOverlay');
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    }

    // Clear all
    const clearBtn = document.getElementById('clearCompareBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAll());
    }
  }

  addProduct(id, checkboxEl) {
    if (this.selectedIds.includes(id)) return;

    if (this.selectedIds.length >= 3) {
      alert('You can compare a maximum of 3 Daikin models simultaneously. Please remove one item to add this model.');
      if (checkboxEl) checkboxEl.checked = false;
      return;
    }

    this.selectedIds.push(id);
    this.updateUI();
  }

  removeProduct(id) {
    this.selectedIds = this.selectedIds.filter(item => item !== id);
    // Uncheck corresponding checkbox on screen
    const cb = document.querySelector(`.compare-checkbox[data-id="${id}"]`);
    if (cb) cb.checked = false;
    this.updateUI();
  }

  clearAll() {
    this.selectedIds = [];
    document.querySelectorAll('.compare-checkbox').forEach(cb => cb.checked = false);
    this.updateUI();
    const overlay = document.getElementById('compareModalOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  updateUI() {
    const bar = document.getElementById('compareBar');
    const countEl = document.getElementById('compareCount');
    const itemsList = document.getElementById('compareItemsList');
    const launchBtn = document.getElementById('launchCompareModalBtn');

    if (!bar) return;

    document.body.classList.toggle('compare-bar-open', this.selectedIds.length > 0);

    if (this.selectedIds.length > 0) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }

    if (countEl) countEl.textContent = this.selectedIds.length;

    if (launchBtn) {
      launchBtn.disabled = this.selectedIds.length < 2;
      launchBtn.textContent = this.selectedIds.length < 2 ? 'Select at least 2 models' : `Compare Models (${this.selectedIds.length}/3)`;
    }

    if (itemsList) {
      itemsList.innerHTML = '';
      this.selectedIds.forEach(id => {
        const prod = this.productsData.find(p => p.id === id) || { model: id };
        const pill = document.createElement('div');
        pill.className = 'compare-item-pill';
        pill.innerHTML = `
          <span><strong>${prod.model}</strong> (${prod.tonnage || ''})</span>
          <button class="compare-remove-btn" title="Remove" onclick="window.vacsComparator.removeProduct('${id}')">&times;</button>
        `;
        itemsList.appendChild(pill);
      });
    }
  }

  openModal() {
    const overlay = document.getElementById('compareModalOverlay');
    const modalBody = document.getElementById('compareModalBody');
    if (!overlay || !modalBody) return;

    const selectedProds = this.productsData.filter(p => this.selectedIds.includes(p.id));

    if (selectedProds.length < 2) {
      alert('Please select at least 2 models to compare.');
      return;
    }

    const getPr = (p) => window.VACS_Pricing ? window.VACS_Pricing.getProductPrice(p) : {
      sellingFormatted: '₹' + p.mrp,
      mrpFormatted: '₹' + p.mrp,
      savingsFormatted: '₹8,000',
      discountPercent: 18,
      noCostEmiFormatted: '₹6,500/mo'
    };

    // Build side-by-side comparison table
    let html = `
      <div style="overflow-x: auto;">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature / Parameter</th>
              ${selectedProds.map(p => {
                const pr = getPr(p);
                return `
                <th style="text-align: center; width: ${75 / selectedProds.length}%;">
                  <div style="font-size: 0.9rem; font-weight: 700; color: #0f172a;">${p.model}</div>
                  <div style="font-size: 0.72rem; color: #0284c7; margin-bottom: 0.4rem;">${p.series}</div>
                  <img src="${p.image || 'assets/images/FTKM_Series.jpg'}" alt="${p.model}" style="max-height: 65px; margin: 0 auto 0.4rem; object-fit: contain;">
                  <div style="display: flex; align-items: baseline; justify-content: center; gap: 0.35rem; flex-wrap: wrap;">
                    <span class="price-selling" style="font-size: 1rem;">${pr.sellingFormatted}</span>
                    <span class="price-mrp-strike" style="font-size: 0.75rem;">${pr.mrpFormatted}</span>
                  </div>
                  <div style="margin-top: 3px;"><span class="price-discount-pill">Save ${pr.savingsFormatted} (${pr.discountPercent}% OFF)</span></div>
                  <a href="product.html?id=${p.id}" class="btn btn-outline btn-sm" style="margin-top: 0.45rem; display: inline-block;">View Details</a>
                </th>
              `;
              }).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Showroom Offer Price</td>
              ${selectedProds.map(p => {
                const pr = getPr(p);
                return `<td><strong style="color: #0f172a;">${pr.sellingFormatted}</strong> <span class="price-mrp-strike">${pr.mrpFormatted}</span></td>`;
              }).join('')}
            </tr>
            <tr>
              <td>No-Cost EMI (6M)</td>
              ${selectedProds.map(p => `<td><strong>${getPr(p).noCostEmiFormatted}</strong></td>`).join('')}
            </tr>
            <tr>
              <td>Ideal Room Size</td>
              ${selectedProds.map(p => `<td>${p.room_size || '110 – 160 sq.ft'}</td>`).join('')}
            </tr>
            <tr>
              <td>Capacity (Tonnage)</td>
              ${selectedProds.map(p => `<td><strong>${p.tonnage}</strong></td>`).join('')}
            </tr>
            <tr>
              <td>Star Rating / Tech</td>
              ${selectedProds.map(p => `<td><span class="badge ${p.is_inverter ? 'badge-inverter' : 'badge-mrp'}">${p.star_rating} ${p.is_inverter ? 'Inverter' : 'Fixed Speed'}</span></td>`).join('')}
            </tr>
            <tr>
              <td>ISEER Efficiency</td>
              ${selectedProds.map(p => `<td><strong>${p.iseer || 'Standard'}</strong></td>`).join('')}
            </tr>
            <tr>
              <td>Cooling Capacity (kW)</td>
              ${selectedProds.map(p => `<td>${p.cooling_capacity_kw || 'N/A'} kW</td>`).join('')}
            </tr>
            <tr>
              <td>Annual Power (kWh)</td>
              ${selectedProds.map(p => `<td>${p.annual_power_kwh || 'N/A'} Units/yr</td>`).join('')}
            </tr>
            <tr>
              <td>Condenser & Gas</td>
              ${selectedProds.map(p => `<td>${p.copper || '100% Copper'} • R-32 Eco</td>`).join('')}
            </tr>
            <tr>
              <td>Warranty Coverage</td>
              ${selectedProds.map(p => `<td>${p.warranty || '5 Yrs PCB + 10 Yrs Compressor'}</td>`).join('')}
            </tr>
            <tr>
              <td>Direct WhatsApp Deal</td>
              ${selectedProds.map(p => {
                const pr = getPr(p);
                return `
                <td style="text-align: center;">
                  <button class="btn btn-primary btn-sm" data-wa-action="quote" data-model="${p.model}" data-offer-price="${pr.sellingFormatted}" data-mrp-price="${pr.mrpFormatted}">Get Best Deal</button>
                </td>
              `;
              }).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    modalBody.innerHTML = html;
    overlay.classList.add('active');

    // Rebind WhatsApp triggers in modal
    if (window.initWhatsAppButtons) {
      window.initWhatsAppButtons();
    }
  }

  renderBar() {
    if (document.getElementById('compareBar')) return;

    const bar = document.createElement('div');
    bar.id = 'compareBar';
    bar.className = 'compare-bar';
    bar.innerHTML = `
      <div class="container compare-bar-content">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 0.8125rem; font-weight: 600; color: #0f172a;">Compare Models:</span>
          <div id="compareItemsList" class="compare-items-list"></div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button id="clearCompareBtn" class="btn btn-outline btn-sm">Clear All</button>
          <button id="launchCompareModalBtn" class="btn btn-primary btn-sm" disabled>Compare Models</button>
        </div>
      </div>
    `;
    document.body.appendChild(bar);

    // Modal Overlay
    const modal = document.createElement('div');
    modal.id = 'compareModalOverlay';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Daikin Air Conditioner Comparison</h3>
          <button id="closeCompareModalBtn" class="modal-close-btn">&times;</button>
        </div>
        <div id="compareModalBody" class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vacsComparator = new ProductComparator();
});
