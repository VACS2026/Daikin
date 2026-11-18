/**
 * Versatile Air Conditioner Systems (VACS)
 * E-Cart Interactive Catalog Engine, Multi-Facet Customer Filtering & Dynamic Pricing
 */

class ProductCatalog {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.activeFilters = {
      search: '',
      category: 'all',
      tonnage: 'all',
      starRating: 'all',
      roomSize: 'all',
      budget: 'all',
      series: 'all',
      sort: 'featured'
    };
    this.init();
  }

  async init() {
    if (window.VACS_PRODUCTS_DATA && Array.isArray(window.VACS_PRODUCTS_DATA) && window.VACS_PRODUCTS_DATA.length > 0) {
      this.products = window.VACS_PRODUCTS_DATA;
      this.onDataLoaded();
      return;
    }

    try {
      const resp = await fetch('data/products.json');
      this.products = await resp.json();
      this.onDataLoaded();
    } catch (e) {
      console.error('Failed to load products catalog:', e);
    }
  }

  onDataLoaded() {
    // 1. If on Homepage, render dynamic Best Sellers & Series Starting Prices
    this.renderHomepageBestSellers();
    this.hydrateSeriesStartingPrices();

    // 2. If on VRV page, render VRV Lineup Grid
    this.renderVrvLineup();

    // 3. If on Catalog page, bind filters and render catalog grid
    if (document.getElementById('catalogProductsGrid')) {
      this.parseUrlParams();
      this.bindFilterControls();
      this.bindQuickChips();
      this.applyFilters();
    }
  }

  renderVrvLineup() {
    const vrvGrid = document.getElementById('vrvLineupGrid');
    if (!vrvGrid) return;
    const vrvProds = this.products.filter(p => p.category === 'VRV Systems');
    vrvGrid.innerHTML = vrvProds.map(p => this.renderCard(p)).join('');
    if (window.initWhatsAppButtons) {
      window.initWhatsAppButtons();
    }
  }

  getPriceObj(p) {
    if (window.VACS_Pricing) {
      return window.VACS_Pricing.getProductPrice(p);
    }
    const mrp = parseInt(String(p.mrp || '50000').replace(/[^0-9]/g, ''), 10) || 50000;
    const sellingPrice = Math.round(mrp * 0.82);
    const savings = mrp - sellingPrice;
    return {
      mrp,
      sellingPrice,
      savings,
      discountPercent: 18,
      mrpFormatted: '₹' + mrp.toLocaleString('en-IN'),
      sellingFormatted: '₹' + sellingPrice.toLocaleString('en-IN'),
      savingsFormatted: '₹' + savings.toLocaleString('en-IN'),
      noCostEmiFormatted: '₹' + Math.round(sellingPrice / 6).toLocaleString('en-IN') + '/mo',
      stdEmiFormatted: '₹' + Math.round(sellingPrice / 12).toLocaleString('en-IN') + '/mo',
      tag: p.star_rating || 'Authorized Offer'
    };
  }

  hydrateSeriesStartingPrices() {
    document.querySelectorAll('[data-series-price]').forEach(el => {
      const seriesFilter = el.getAttribute('data-series-price');
      const matches = this.products.filter(p => {
        if (seriesFilter === '5-star-split') return p.category === 'Split AC' && p.star_rating === '5 Star';
        if (seriesFilter === 'jtkj') return p.series && p.series.includes('JTKJ');
        if (seriesFilter === '3-star-split') return p.category === 'Split AC' && p.star_rating === '3 Star';
        if (seriesFilter === 'commercial') return p.category === 'Cassette AC' || p.category === 'Ductable AC' || p.category === 'VRV Systems';
        return false;
      });

      if (matches.length > 0) {
        const priced = matches.map(m => ({ product: m, price: this.getPriceObj(m) }))
                              .sort((a, b) => a.price.sellingPrice - b.price.sellingPrice);
        const lowest = priced[0].price;
        el.innerHTML = `
          <span style="font-size: 0.7rem; color: #64748b;">Starts at</span>
          <strong style="font-size: 0.95rem; color: #0f172a; margin-left: 3px;">${lowest.sellingFormatted}</strong>
          <span class="price-mrp-strike" style="font-size: 0.75rem; margin-left: 3px;">${lowest.mrpFormatted}</span>
          <span class="price-discount-pill" style="margin-left: 4px;">Up to ${lowest.discountPercent}% OFF</span>
        `;
      }
    });
  }

  renderHomepageBestSellers() {
    const homeGrid = document.getElementById('homepageBestSellers');
    if (!homeGrid) return;

    const featuredIds = [
      'ftkl50xv16vka', // 1.5T 3-Star Best Seller
      'ftkm50xv16mka', // 1.5T 5-Star Premium
      'ftku35xv16vaa', // 1.0T 5-Star Bedroom
      'jtkj50uv16va',  // 1.5T 5-Star Streamer
      'ftkl35xv16waa', // 1.0T 3-Star Value
      'ftxf50uv16va',  // 1.5T 4-Star Hot & Cold
      'fcvfq50av16',   // 1.5T 4-Way Cassette
      'mc55xvm6'       // Streamer Air Purifier
    ];

    const bestSellers = featuredIds
      .map(id => this.products.find(p => p.id.toLowerCase() === id))
      .filter(Boolean);

    homeGrid.innerHTML = bestSellers.map(p => this.renderCard(p)).join('');

    // Bind filter tab buttons on homepage if present
    document.querySelectorAll('[data-home-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-home-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-home-filter');
        let list = bestSellers;
        if (mode === '1.5ton') {
          list = this.products.filter(p => p.category === 'Split AC' && p.tonnage.includes('1.5')).slice(0, 8);
        } else if (mode === '1ton') {
          list = this.products.filter(p => p.category === 'Split AC' && p.tonnage.includes('1.0')).slice(0, 8);
        } else if (mode === '5star') {
          list = this.products.filter(p => p.category === 'Split AC' && p.star_rating === '5 Star').slice(0, 8);
        } else if (mode === 'commercial') {
          list = this.products.filter(p => p.category !== 'Split AC').slice(0, 8);
        }
        homeGrid.innerHTML = list.map(p => this.renderCard(p)).join('');
        if (window.initWhatsAppButtons) window.initWhatsAppButtons();
      });
    });

    if (window.initWhatsAppButtons) {
      window.initWhatsAppButtons();
    }
  }

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) this.activeFilters.category = params.get('category');
    if (params.has('tonnage')) this.activeFilters.tonnage = params.get('tonnage');
    if (params.has('star')) this.activeFilters.starRating = params.get('star');
    if (params.has('room')) this.activeFilters.roomSize = params.get('room');
    if (params.has('budget')) this.activeFilters.budget = params.get('budget');
    if (params.has('series')) this.activeFilters.series = params.get('series');
    if (params.has('q')) this.activeFilters.search = params.get('q').toLowerCase();

    const searchInput = document.getElementById('catalogSearchInput');
    const catSelect = document.getElementById('filterCategory');
    const tonSelect = document.getElementById('filterTonnage');
    const starSelect = document.getElementById('filterStar');
    const roomSelect = document.getElementById('filterRoomSize');
    const budgetSelect = document.getElementById('filterBudget');

    if (searchInput && this.activeFilters.search) searchInput.value = this.activeFilters.search;
    if (catSelect && this.activeFilters.category !== 'all') catSelect.value = this.activeFilters.category;
    if (tonSelect && this.activeFilters.tonnage !== 'all') tonSelect.value = this.activeFilters.tonnage;
    if (starSelect && this.activeFilters.starRating !== 'all') starSelect.value = this.activeFilters.starRating;
    if (roomSelect && this.activeFilters.roomSize !== 'all') roomSelect.value = this.activeFilters.roomSize;
    if (budgetSelect && this.activeFilters.budget !== 'all') budgetSelect.value = this.activeFilters.budget;

    this.syncChips();
  }

  bindQuickChips() {
    const chipsBar = document.getElementById('categoryChipsBar');
    if (!chipsBar) return;

    const chips = chipsBar.querySelectorAll('.chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const type = chip.getAttribute('data-chip');
        this.activeFilters.series = 'all';
        this.activeFilters.tonnage = 'all';
        this.activeFilters.roomSize = 'all';
        this.activeFilters.budget = 'all';

        if (type === 'all') {
          this.activeFilters.category = 'all';
          this.activeFilters.starRating = 'all';
        } else if (type === 'best-deals') {
          this.activeFilters.category = 'all';
          this.activeFilters.starRating = 'all';
          this.activeFilters.sort = 'discount-desc';
        } else if (type === '1.5ton-popular') {
          this.activeFilters.category = 'Split AC';
          this.activeFilters.tonnage = '1.5 Ton';
          this.activeFilters.starRating = 'all';
        } else if (type === 'split-5star') {
          this.activeFilters.category = 'Split AC';
          this.activeFilters.starRating = '5 Star';
        } else if (type === 'split-3star') {
          this.activeFilters.category = 'Split AC';
          this.activeFilters.starRating = '3 Star';
        } else if (type === 'hot-cold') {
          this.activeFilters.category = 'Split AC';
          this.activeFilters.starRating = '4 Star';
        } else if (type === 'cassette') {
          this.activeFilters.category = 'Cassette AC';
          this.activeFilters.starRating = 'all';
        } else if (type === 'ductable') {
          this.activeFilters.category = 'Ductable AC';
          this.activeFilters.starRating = 'all';
        } else if (type === 'vrv') {
          this.activeFilters.category = 'VRV Systems';
          this.activeFilters.starRating = 'all';
        } else if (type === 'purifier') {
          this.activeFilters.category = 'Air Purifiers';
          this.activeFilters.starRating = 'all';
        }

        this.syncSelectDropdowns();
        this.applyFilters();
      });
    });
  }

  syncSelectDropdowns() {
    const catSelect = document.getElementById('filterCategory');
    const starSelect = document.getElementById('filterStar');
    const tonSelect = document.getElementById('filterTonnage');
    const roomSelect = document.getElementById('filterRoomSize');
    const budgetSelect = document.getElementById('filterBudget');
    const sortSelect = document.getElementById('sortCatalog');

    if (catSelect) catSelect.value = this.activeFilters.category;
    if (starSelect) starSelect.value = this.activeFilters.starRating;
    if (tonSelect) tonSelect.value = this.activeFilters.tonnage;
    if (roomSelect) roomSelect.value = this.activeFilters.roomSize;
    if (budgetSelect) budgetSelect.value = this.activeFilters.budget;
    if (sortSelect) sortSelect.value = this.activeFilters.sort;
  }

  bindFilterControls() {
    const searchInput = document.getElementById('catalogSearchInput');
    const catSelect = document.getElementById('filterCategory');
    const tonSelect = document.getElementById('filterTonnage');
    const starSelect = document.getElementById('filterStar');
    const roomSelect = document.getElementById('filterRoomSize');
    const budgetSelect = document.getElementById('filterBudget');
    const sortSelect = document.getElementById('sortCatalog');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.activeFilters.search = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.activeFilters.category = e.target.value;
        this.activeFilters.series = 'all';
        this.syncChips();
        this.applyFilters();
      });
    }

    if (tonSelect) {
      tonSelect.addEventListener('change', (e) => {
        this.activeFilters.tonnage = e.target.value;
        this.applyFilters();
      });
    }

    if (starSelect) {
      starSelect.addEventListener('change', (e) => {
        this.activeFilters.starRating = e.target.value;
        this.syncChips();
        this.applyFilters();
      });
    }

    if (roomSelect) {
      roomSelect.addEventListener('change', (e) => {
        this.activeFilters.roomSize = e.target.value;
        this.applyFilters();
      });
    }

    if (budgetSelect) {
      budgetSelect.addEventListener('change', (e) => {
        this.activeFilters.budget = e.target.value;
        this.applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeFilters.sort = e.target.value;
        this.applyFilters();
      });
    }

    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.activeFilters = {
          search: '',
          category: 'all',
          tonnage: 'all',
          starRating: 'all',
          roomSize: 'all',
          budget: 'all',
          series: 'all',
          sort: 'featured'
        };
        if (searchInput) searchInput.value = '';
        this.syncSelectDropdowns();

        const chipsBar = document.getElementById('categoryChipsBar');
        if (chipsBar) {
          chipsBar.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
          chipsBar.querySelector('[data-chip="all"]')?.classList.add('active');
        }

        this.applyFilters();
      });
    }
  }

  syncChips() {
    const chipsBar = document.getElementById('categoryChipsBar');
    if (!chipsBar) return;
    chipsBar.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));

    if (this.activeFilters.category === 'Split AC' && this.activeFilters.starRating === '5 Star') {
      chipsBar.querySelector('[data-chip="split-5star"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'Split AC' && this.activeFilters.starRating === '3 Star') {
      chipsBar.querySelector('[data-chip="split-3star"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'Split AC' && this.activeFilters.starRating === '4 Star') {
      chipsBar.querySelector('[data-chip="hot-cold"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'Cassette AC') {
      chipsBar.querySelector('[data-chip="cassette"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'Ductable AC') {
      chipsBar.querySelector('[data-chip="ductable"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'VRV Systems') {
      chipsBar.querySelector('[data-chip="vrv"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'Air Purifiers') {
      chipsBar.querySelector('[data-chip="purifier"]')?.classList.add('active');
    } else if (this.activeFilters.category === 'all' && this.activeFilters.starRating === 'all') {
      chipsBar.querySelector('[data-chip="all"]')?.classList.add('active');
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(item => {
      const priceObj = this.getPriceObj(item);

      // Search
      if (this.activeFilters.search) {
        const query = this.activeFilters.search;
        const matches = item.model.toLowerCase().includes(query) ||
                        item.title.toLowerCase().includes(query) ||
                        (item.series && item.series.toLowerCase().includes(query)) ||
                        (item.category && item.category.toLowerCase().includes(query)) ||
                        (item.room_size && item.room_size.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category
      if (this.activeFilters.category !== 'all') {
        if (item.category !== this.activeFilters.category) return false;
      }

      // Series
      if (this.activeFilters.series !== 'all') {
        if (!item.series || !item.series.toLowerCase().includes(this.activeFilters.series.toLowerCase())) {
          return false;
        }
      }

      // Tonnage
      if (this.activeFilters.tonnage !== 'all') {
        if (this.activeFilters.tonnage === '3.0 Ton') {
          const isHeavy = item.tonnage && (item.tonnage.includes('2.6') || item.tonnage.includes('3.0') || item.tonnage.includes('4.0') || item.tonnage.includes('5.5') || item.tonnage.includes('8.') || item.tonnage.includes('11'));
          if (!isHeavy) return false;
        } else if (!item.tonnage || !item.tonnage.includes(this.activeFilters.tonnage.replace(' Ton', ''))) {
          return false;
        }
      }

      // Star Rating
      if (this.activeFilters.starRating !== 'all') {
        if (item.star_rating !== this.activeFilters.starRating) return false;
      }

      // Room Size
      if (this.activeFilters.roomSize !== 'all') {
        if (item.room_category !== this.activeFilters.roomSize) return false;
      }

      // Price Budget (Based on Discounted Selling Price)
      if (this.activeFilters.budget !== 'all') {
        const sp = priceObj.sellingPrice;
        if (this.activeFilters.budget === 'under-40k' && sp >= 40000) return false;
        if (this.activeFilters.budget === '40k-55k' && (sp < 40000 || sp > 55000)) return false;
        if (this.activeFilters.budget === '55k-80k' && (sp < 55000 || sp > 80000)) return false;
        if (this.activeFilters.budget === 'above-80k' && sp <= 80000) return false;
      }

      return true;
    });

    this.sortProducts();
    this.render();
  }

  sortProducts() {
    const parseIseer = (iseerStr) => parseFloat(String(iseerStr || '0').replace(/[^0-9.]/g, '')) || 0;

    if (this.activeFilters.sort === 'price-asc') {
      this.filteredProducts.sort((a, b) => this.getPriceObj(a).sellingPrice - this.getPriceObj(b).sellingPrice);
    } else if (this.activeFilters.sort === 'price-desc') {
      this.filteredProducts.sort((a, b) => this.getPriceObj(b).sellingPrice - this.getPriceObj(a).sellingPrice);
    } else if (this.activeFilters.sort === 'discount-desc') {
      this.filteredProducts.sort((a, b) => this.getPriceObj(b).discountPercent - this.getPriceObj(a).discountPercent);
    } else if (this.activeFilters.sort === 'iseer-desc') {
      this.filteredProducts.sort((a, b) => parseIseer(b.iseer) - parseIseer(a.iseer));
    }
  }

  render() {
    const grid = document.getElementById('catalogProductsGrid');
    const countEl = document.getElementById('catalogResultCount');
    if (!grid) return;

    if (countEl) {
      countEl.textContent = `Showing ${this.filteredProducts.length} of ${this.products.length} Authorized Daikin Models`;
    }

    if (this.filteredProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background-color: #ffffff; border: 1px dashed #cbd5e1; border-radius: 8px;">
          <h3 style="font-size: 1.05rem; color: #1e293b; margin-bottom: 0.4rem;">No Daikin models match your selected filters</h3>
          <p style="font-size: 0.8125rem; color: #64748b; margin-bottom: 0.85rem;">Try clearing one of your room size, budget, or star rating filters to see all available models.</p>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('resetFiltersBtn').click()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredProducts.map(p => this.renderCard(p)).join('');

    if (window.vacsComparator) {
      window.vacsComparator.selectedIds.forEach(id => {
        const cb = document.querySelector(`.compare-checkbox[data-id="${id}"]`);
        if (cb) cb.checked = true;
      });
    }

    if (window.initWhatsAppButtons) {
      window.initWhatsAppButtons();
    }
  }

  renderCard(p) {
    const isChecked = window.vacsComparator && window.vacsComparator.selectedIds.includes(p.id);
    const pr = this.getPriceObj(p);
    const roomText = p.room_size || '110 – 160 sq.ft';
    const copperText = p.copper || '100% Copper';

    return `
      <div class="product-card">
        <div class="product-card-top">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
            <span class="badge ${p.is_inverter ? 'badge-inverter' : 'badge-mrp'}">
              ${p.star_rating} ${p.is_inverter && !p.star_rating.includes('Inverter') ? 'Inverter' : ''}
            </span>
            <span class="price-discount-pill">${pr.discountPercent}% OFF</span>
          </div>
          <label class="compare-checkbox-label" title="Compare specs & price">
            <input type="checkbox" class="compare-checkbox" data-id="${p.id}" ${isChecked ? 'checked' : ''}>
            <span>Compare</span>
          </label>
        </div>

        <a href="product?id=${p.id}" class="product-image-wrapper" style="display: flex;">
          <img src="${p.image || 'assets/images/FTKM_Series.jpg'}" alt="${p.title}" loading="lazy">
        </a>

        <div class="room-suitability-bar">
          <span><strong>Ideal Room:</strong> ${roomText}</span>
          <span>✓ ${copperText}</span>
        </div>

        <div class="product-series">${p.series || p.category} • ${pr.tag}</div>
        <h3 class="product-model"><a href="product?id=${p.id}">${p.model}</a></h3>
        <p class="product-desc">${p.title}</p>

        <div class="product-spec-pills">
          <span class="spec-pill"><strong>Cap:</strong> ${p.tonnage}</span>
          ${p.iseer ? `<span class="spec-pill"><strong>ISEER:</strong> ${p.iseer}</span>` : ''}
          ${p.cooling_capacity_kw ? `<span class="spec-pill"><strong>Cooling:</strong> ${p.cooling_capacity_kw} kW</span>` : ''}
          ${p.annual_power_kwh ? `<span class="spec-pill"><strong>Power:</strong> ${p.annual_power_kwh} U/yr</span>` : ''}
        </div>

        <div class="ecart-price-block">
          <div class="ecart-price-row">
            <span class="price-selling">${pr.sellingFormatted}</span>
            <span class="price-mrp-strike">MRP ${pr.mrpFormatted}</span>
          </div>
          <div class="price-savings-line">
            <span>You Save ${pr.savingsFormatted} (${pr.discountPercent}% OFF)</span>
            <span style="color: #64748b; font-weight: 500;">Incl. GST</span>
          </div>
          <div class="price-emi-line">
            <span>No-Cost EMI <strong>${pr.noCostEmiFormatted}</strong></span>
            <span style="color: #0284c7; font-weight: 600;">✓ In Stock</span>
          </div>
        </div>

        <div class="product-card-actions">
          <a href="product?id=${p.id}" class="btn btn-outline btn-sm">View Details</a>
          <button class="btn btn-primary btn-sm" data-wa-action="quote" data-model="${p.model}" data-offer-price="${pr.sellingFormatted}" data-mrp-price="${pr.mrpFormatted}">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 13px; height: 13px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.802-.413-1.424-.595-2.348-2.029-2.42-2.123-.072-.095-.572-.76-.572-1.448s.361-1.026.49-1.168c.129-.142.28-.179.375-.179.094 0 .189.001.272.006.088.006.205-.034.321.246.12.29.414 1.008.45 1.082.036.074.06.16.012.256-.048.096-.073.156-.145.241-.072.085-.153.19-.219.255-.073.072-.149.15-.064.296.085.145.378.625.811 1.011.558.497 1.029.65 1.174.722.146.072.23.06.315-.037.085-.096.363-.423.46-.568.097-.145.193-.12.325-.072.133.048.841.396.986.469.145.072.241.108.277.169.036.06.036.353-.108.758z"/></svg>
            <span>Get Best Deal</span>
          </button>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vacsCatalog = new ProductCatalog();
});
