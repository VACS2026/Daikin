/**
 * Versatile Air Conditioner Systems (VACS)
 * Universal E-Cart Product Detail Renderer with Dynamic Pricing & Delivery Checker
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = (params.get('id') || 'ftkm50xv16mka').toLowerCase();

  let products = [];
  if (window.VACS_PRODUCTS_DATA && Array.isArray(window.VACS_PRODUCTS_DATA) && window.VACS_PRODUCTS_DATA.length > 0) {
    products = window.VACS_PRODUCTS_DATA;
  } else {
    try {
      const resp = await fetch('data/products.json');
      products = await resp.json();
    } catch (e) {
      console.error('Error loading products for detail view:', e);
    }
  }

  if (products.length > 0) {
    const product = products.find(p => p.id.toLowerCase() === productId) || products[0];
    renderProductDetail(product, products);
  }

  initDeliveryPincodeChecker();
});

function getPriceObj(p) {
  if (window.VACS_Pricing) {
    return window.VACS_Pricing.getProductPrice(p);
  }
  const mrp = parseInt(String(p.mrp || '55000').replace(/[^0-9]/g, ''), 10) || 55000;
  const sellingPrice = Math.round(mrp * 0.81);
  const savings = mrp - sellingPrice;
  return {
    mrp,
    sellingPrice,
    savings,
    discountPercent: 19,
    mrpFormatted: '₹' + mrp.toLocaleString('en-IN'),
    sellingFormatted: '₹' + sellingPrice.toLocaleString('en-IN'),
    savingsFormatted: '₹' + savings.toLocaleString('en-IN'),
    noCostEmiFormatted: '₹' + Math.round(sellingPrice / 6).toLocaleString('en-IN') + '/mo',
    stdEmiFormatted: '₹' + Math.round(sellingPrice / 12).toLocaleString('en-IN') + '/mo',
    tag: p.star_rating || 'Authorized Offer'
  };
}

function renderProductDetail(p, allProducts) {
  const pr = getPriceObj(p);

  // Update document title
  document.title = `${p.model} (${pr.sellingFormatted} | ${pr.discountPercent}% OFF) Daikin ${p.tonnage} ${p.star_rating} AC in Hyderabad - VACS`;

  // Breadcrumbs
  const bcEl = document.getElementById('productBreadcrumb');
  if (bcEl) {
    bcEl.innerHTML = `
      <a href="index.html">Home</a> &nbsp;/&nbsp;
      <a href="products.html">Catalog</a> &nbsp;/&nbsp;
      <a href="products.html?category=${encodeURIComponent(p.category)}">${p.category}</a> &nbsp;/&nbsp;
      <span style="color: #0f172a; font-weight: 600;">${p.model}</span>
    `;
  }

  // Model & Titles
  const titleEl = document.getElementById('productTitle');
  const seriesEl = document.getElementById('productSeries');
  const badgeEl = document.getElementById('productStarBadge');
  const imgEl = document.getElementById('productImg');
  const roomBadgeEl = document.getElementById('productRoomBadge');

  if (titleEl) titleEl.textContent = p.title || `Daikin ${p.model} ${p.tonnage} Air Conditioner`;
  if (seriesEl) seriesEl.textContent = `${p.series} • Model: ${p.model}`;
  if (badgeEl) {
    badgeEl.className = `badge ${p.is_inverter ? 'badge-inverter' : 'badge-mrp'}`;
    badgeEl.textContent = `${p.star_rating} ${p.is_inverter && !p.star_rating.includes('Inverter') ? 'Inverter' : ''}`;
  }
  if (roomBadgeEl) {
    roomBadgeEl.textContent = `Ideal Room: ${p.room_size || '120 – 180 sq.ft'}`;
  }
  if (imgEl) {
    imgEl.src = p.image || 'assets/images/FTKM_Series.jpg';
    imgEl.alt = p.model;
  }

  // Render E-Cart Price Block on Product Detail Page
  const priceBox = document.getElementById('productPriceBox');
  if (priceBox) {
    priceBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.65rem;">
        <div>
          <div style="font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #0284c7; margin-bottom: 0.2rem;">
            Authorized VACS Showroom DealPrice
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap;">
            <span class="price-selling" style="font-size: 1.65rem;">${pr.sellingFormatted}</span>
            <span class="price-mrp-strike" style="font-size: 1rem;">MRP ${pr.mrpFormatted}</span>
            <span class="price-discount-pill" style="font-size: 0.75rem; padding: 0.18rem 0.55rem;">${pr.discountPercent}% OFF</span>
          </div>
          <div style="font-size: 0.78rem; color: #059669; font-weight: 600; margin-top: 0.2rem;">
            You Save ${pr.savingsFormatted} on Official MRP • Inclusive of 28% GST
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-star">✓ In Stock at KPHB Showroom</span>
          <div style="font-size: 0.72rem; color: #475569; margin-top: 0.25rem;">Same-Day Delivery in Hyderabad</div>
        </div>
      </div>

      <!-- EMI, Exchange & Installation Quick Strip -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 0.5rem; padding-top: 0.65rem; border-top: 1px dashed #cbd5e1; font-size: 0.75rem;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.45rem 0.6rem;">
          <div style="color: #64748b; font-size: 0.68rem;">No-Cost EMI (6M)</div>
          <div style="font-weight: 700; color: #0f172a;">${pr.noCostEmiFormatted} <span style="font-weight: 400; color: #64748b;">(or ${pr.stdEmiFormatted} 12M)</span></div>
        </div>
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.45rem 0.6rem;">
          <div style="color: #64748b; font-size: 0.68rem;">Old AC Trade-In Exchange</div>
          <div style="font-weight: 700; color: #059669;">Up to ₹5,000 Off Extra</div>
        </div>
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.45rem 0.6rem;">
          <div style="color: #64748b; font-size: 0.68rem;">Ideal Room Size</div>
          <div style="font-weight: 700; color: #0284c7;">${p.room_size || '120 – 180 sq.ft'}</div>
        </div>
      </div>
    `;
  } else {
    const mrpEl = document.getElementById('productMrp');
    if (mrpEl) {
      mrpEl.innerHTML = `${pr.sellingFormatted} <span class="price-mrp-strike" style="font-size: 0.95rem;">MRP ${pr.mrpFormatted}</span> <span class="price-discount-pill">${pr.discountPercent}% OFF</span>`;
    }
  }

  // Highlights list
  const hlContainer = document.getElementById('productHighlightsList');
  if (hlContainer && p.highlights) {
    hlContainer.innerHTML = p.highlights.map(hl => `
      <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.8125rem;">
        <svg style="width: 14px; height: 14px; color: #0284c7; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span>${hl}</span>
      </li>
    `).join('');
  }

  // Primary Action Button (WhatsApp Quote with Offer & MRP details)
  const waBtn = document.getElementById('productWaQuoteBtn');
  if (waBtn) {
    waBtn.onclick = () => {
      const msg = `Hello CH. Santhosh (Versatile Air Conditioner Systems), I want to book / get the final deal for:\n` +
                  `• Model: Daikin ${p.model} (${p.tonnage}, ${p.star_rating})\n` +
                  `• Website Offer Price: ${pr.sellingFormatted} (MRP ${pr.mrpFormatted} — ${pr.discountPercent}% OFF)\n` +
                  `Please share delivery & installation slot for my location in Hyderabad.`;
      window.open(`https://wa.me/919700063938?text=${encodeURIComponent(msg)}`, '_blank');
    };
  }

  // PDF spec download trigger
  const pdfBtn = document.getElementById('productPdfBtn');
  if (pdfBtn) {
    pdfBtn.onclick = () => {
      const msg = `Hello VACS, please share the official Technical Specification Brochure PDF and final quotation for Daikin ${p.model} (${pr.sellingFormatted}).`;
      window.open(`https://wa.me/919700063938?text=${encodeURIComponent(msg)}`, '_blank');
    };
  }

  // Render 4-Tier Specifications Table
  renderSpecTables(p, pr);

  // Render Related Models
  renderRelatedModels(p, allProducts);
}

function initDeliveryPincodeChecker() {
  const btn = document.getElementById('checkPincodeBtn');
  const inp = document.getElementById('pincodeInput');
  const res = document.getElementById('pincodeResultText');
  if (!btn || !inp || !res) return;

  const check = () => {
    const val = inp.value.trim();
    if (!val) {
      res.innerHTML = `<span style="color: #dc2626;">Please enter a Hyderabad pincode (e.g. 500072) or locality name.</span>`;
      return;
    }
    const isHydPin = /^50\d{4}$/.test(val);
    const isAreaName = val.length >= 3 && !/^\d+$/.test(val);

    if (isHydPin || isAreaName) {
      res.innerHTML = `<span style="color: #059669; font-weight: 600;">✓ Express Same-Day Delivery & Authorized Daikin Installation available in <strong>${val}</strong>! (Dispatched from KPHB 4th Phase Showroom)</span>`;
    } else {
      res.innerHTML = `<span style="color: #0284c7; font-weight: 600;">✓ Delivery available across Greater Hyderabad & Telangana for <strong>${val}</strong>. Contact +91 97000 63938 for dispatch schedule.</span>`;
    }
  };

  btn.addEventListener('click', check);
  inp.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      check();
    }
  });
}

function renderSpecTables(p, pr) {
  const container = document.getElementById('specTablesContainer');
  if (!container) return;

  const s = p.specs || {};
  const cat = p.category || 'Split AC';

  // Render any extra model-specific spec rows from p.specs
  const customSpecRows = Object.entries(s).map(([k, v]) => `
    <tr><td class="spec-key">${k}</td><td class="spec-val">${v}</td></tr>
  `).join('');

  let module2Html = '';
  let module3Html = '';

  if (cat === 'VRV Systems') {
    module2Html = `
      <div class="spec-section-card">
        <div class="spec-header">VRV Alpha / Central System Architecture</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Indoor Unit Compatibility</td><td class="spec-val">Connect up to 64 IDUs (Round Flow Cassette, Slim Ducted FXDQ, High-Static FXMQ-PB, Wall FXAQ)</td></tr>
            <tr><td class="spec-key">Indoor Connection Ratio</td><td class="spec-val"><strong>50% to 200%</strong> Total Capacity Index</td></tr>
            <tr><td class="spec-key">Ref. Temperature Control</td><td class="spec-val"><strong>VRT Smart II</strong> Coordinated IDU + ODU Demand Control</td></tr>
            <tr><td class="spec-key">Max Piping &amp; Height Drop</td><td class="spec-val"><strong>1,000 m</strong> Total Piping • <strong>190 m</strong> Equivalent Length • <strong>110 m</strong> Vertical Height</td></tr>
            <tr><td class="spec-key">Centralized Control &amp; BMS</td><td class="spec-val">Intelligent Touch Manager (iTM), BACnet / Modbus BMS &amp; HRV Interlock Ready</td></tr>
          </tbody>
        </table>
      </div>
    `;
    module3Html = `
      <div class="spec-section-card">
        <div class="spec-header">Outdoor Module &amp; Reliability Engineering</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Compressor Technology</td><td class="spec-val">Daikin 4D Inverter Scroll Compressor with Concentrated Winding Motor &amp; Oil Control</td></tr>
            <tr><td class="spec-key">Heat Exchanger</td><td class="spec-val">High-Efficiency Subcooling Plate Heat Exchanger + Anti-Corrosion Blue Fin Coils</td></tr>
            <tr><td class="spec-key">PCB Protection &amp; Cooling</td><td class="spec-val"><strong>IP55 Sealed Box</strong> (Lizard/Dust/Water Proof) + <strong>3 Refrigerant Cooling Circuits</strong></td></tr>
            <tr><td class="spec-key">Operating Ambient Range</td><td class="spec-val">Cooling: <strong>-5°C DB to 52°C DB</strong> • Heating: <strong>-25°C WB to 15.5°C WB</strong></td></tr>
            <tr><td class="spec-key">Outdoor Fan &amp; Quiet Mode</td><td class="spec-val">Upgraded <strong>IP44 DC Fan Motor</strong> • Night Quiet Mode down to <strong>45 dB(A)</strong></td></tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (cat === 'Cassette AC') {
    module2Html = `
      <div class="spec-section-card">
        <div class="spec-header">Ceiling Cassette Indoor Unit Specifications</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Decoration Panel Style</td><td class="spec-val">Fresh Pure White 360° Round Flow / 4-Way / 1-Way Designer Panel (950 × 950 mm)</td></tr>
            <tr><td class="spec-key">Airflow Distribution</td><td class="spec-val">360° Uniform Draft-Free Ceiling Airflow with Individual Flap Control</td></tr>
            <tr><td class="spec-key">Built-in Drain Lift Pump</td><td class="spec-val"><strong>High-Head DC Drain Pump Included</strong> (Up to 850 mm vertical condensate lift)</td></tr>
            <tr><td class="spec-key">Indoor Sound Level</td><td class="spec-val">Low 28 dBA to 37 dBA Whisper-Quiet Commercial Operation</td></tr>
            <tr><td class="spec-key">Air Filtration</td><td class="spec-val">Long-Life Mold-Proof Polypropylene Net Filter</td></tr>
          </tbody>
        </table>
      </div>
    `;
    module3Html = `
      <div class="spec-section-card">
        <div class="spec-header">Outdoor Unit &amp; Compressor Engineering</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Compressor Type</td><td class="spec-val">Daikin Hermetically Sealed Swing / Scroll Inverter Compressor</td></tr>
            <tr><td class="spec-key">Refrigerant &amp; Condenser</td><td class="spec-val">Eco-Friendly R-32 • 100% Grooved Copper Coils with Anti-Corrosion Treatment</td></tr>
            <tr><td class="spec-key">Max Piping Length</td><td class="spec-val">Up to 30 m – 50 m Length / 15 m – 30 m Elevation Difference</td></tr>
            <tr><td class="spec-key">Operating Ambient Range</td><td class="spec-val">Heavy-Duty Cooling up to 50°C – 52°C Outdoor Ambient</td></tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (cat === 'Ductable AC') {
    module2Html = `
      <div class="spec-section-card">
        <div class="spec-header">Ceiling Concealed Ductable Unit Specifications</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Indoor Unit Configuration</td><td class="spec-val">Low-Height Ceiling Concealed High-Static Ductable Unit</td></tr>
            <tr><td class="spec-key">Blower &amp; Static Pressure</td><td class="spec-val">Centrifugal Twin-Blower Optimized for Multi-Diffuser GI Ducting</td></tr>
            <tr><td class="spec-key">Control Interface</td><td class="spec-val">Microprocessor Wired LCD Wall Thermostat with Fault Diagnostics</td></tr>
            <tr><td class="spec-key">Thermal &amp; Acoustic Lining</td><td class="spec-val">Fiberglass / Nitrile Insulated Casing for Condensation-Free Quiet Operation</td></tr>
          </tbody>
        </table>
      </div>
    `;
    module3Html = `
      <div class="spec-section-card">
        <div class="spec-header">Outdoor Unit &amp; Scroll Compressor Engineering</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Compressor Type</td><td class="spec-val">Daikin Heavy-Duty Hermetically Sealed Scroll Compressor (Single / Twin Circuit)</td></tr>
            <tr><td class="spec-key">Power Supply &amp; Protection</td><td class="spec-val">3-Phase, 380–415V, 50Hz with Phase Reversal &amp; High/Low Pressure Cutouts</td></tr>
            <tr><td class="spec-key">Condenser Coil</td><td class="spec-val">100% Inner-Grooved Copper Tubes with Hydrophilic Blue Fin Protection</td></tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (cat === 'Air Purifiers') {
    module2Html = `
      <div class="spec-section-card">
        <div class="spec-header">Streamer Discharge &amp; HEPA Filtration Architecture</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Purification Technology</td><td class="spec-val"><strong>Patented Daikin Flash Streamer</strong> + Active Plasma Ion Discharge</td></tr>
            <tr><td class="spec-key">Primary Dust Filter</td><td class="spec-val"><strong>10-Year Electrostatic HEPA Filter</strong> (Captures 99.97% of 0.3µm fine particles)</td></tr>
            <tr><td class="spec-key">Deodorizing Filter</td><td class="spec-val">Lifetime Regenerative Deodorizing Catalyst (No replacement required)</td></tr>
            <tr><td class="spec-key">Air Quality Sensors</td><td class="spec-val">High-Sensitivity Triple Detection (PM 2.5, General Dust &amp; Odor Sensor)</td></tr>
            <tr><td class="spec-key">Sound Pressure Level</td><td class="spec-val">19 dBA (Quiet Mode) to 53 dBA (Turbo Mode)</td></tr>
          </tbody>
        </table>
      </div>
    `;
    module3Html = '';
  } else {
    // Default: Split AC
    module2Html = `
      <div class="spec-section-card">
        <div class="spec-header">Indoor Unit &amp; Air Quality Specifications</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Front Panel Finish</td><td class="spec-val">Fresh Pure White / Matte Corporate Finish</td></tr>
            <tr><td class="spec-key">Airflow Distribution</td><td class="spec-val">Coanda Airflow + 3D / Power Chill Mode (${s['Air Throw'] || 'Up to 16–22 meters'})</td></tr>
            <tr><td class="spec-key">Air Purification Filters</td><td class="spec-val">${s['PM 2.5'] || 'PM 2.5 Micro-Dust Filter + Dew Clean Self-Cleaning Coil'}</td></tr>
            <tr><td class="spec-key">Indoor Noise Level (Quiet Mode)</td><td class="spec-val">Low 29 dBA to 38 dBA</td></tr>
            <tr><td class="spec-key">Indoor Unit Net Dimensions (H × W × D)</td><td class="spec-val">298 mm × 800–885 mm × 229 mm</td></tr>
            <tr><td class="spec-key">Indoor Unit Net Weight</td><td class="spec-val">9.5 Kg to 11.5 Kg</td></tr>
          </tbody>
        </table>
      </div>
    `;
    module3Html = `
      <div class="spec-section-card">
        <div class="spec-header">Outdoor Unit &amp; Compressor Engineering</div>
        <table class="spec-table">
          <tbody>
            <tr><td class="spec-key">Compressor Type</td><td class="spec-val">Daikin Patented Swing / Neo-Swing Compressor (Frictionless Low Vibration)</td></tr>
            <tr><td class="spec-key">Refrigerant Type</td><td class="spec-val">R-32 Eco-Friendly Zero Ozone Depletion Refrigerant</td></tr>
            <tr><td class="spec-key">Condenser Coil Material</td><td class="spec-val">100% Grooved Copper Tubes with Anti-Corrosion Blue Fin Coating</td></tr>
            <tr><td class="spec-key">Outdoor Unit Dimensions (H × W × D)</td><td class="spec-val">550–595 mm × 675–845 mm × 284–300 mm</td></tr>
            <tr><td class="spec-key">Outdoor Unit Weight</td><td class="spec-val">24.5 Kg to 32.0 Kg</td></tr>
            <tr><td class="spec-key">Voltage Stabilizer Requirement</td><td class="spec-val">Built-in Stabilizer-Free Operation (160V to 264V Wide Range)</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Module 1: General & Performance -->
    <div class="spec-section-card">
      <div class="spec-header">General, Pricing &amp; Performance Specifications</div>
      <table class="spec-table">
        <tbody>
          <tr><td class="spec-key">Model Number</td><td class="spec-val"><strong>${p.model}</strong></td></tr>
          <tr><td class="spec-key">Product Category &amp; Series</td><td class="spec-val">${cat} • ${p.series}</td></tr>
          <tr><td class="spec-key">Showroom Offer Price vs MRP</td><td class="spec-val"><strong style="color: #0f172a;">${pr.sellingFormatted}</strong> <span class="price-mrp-strike">MRP ${pr.mrpFormatted}</span> <span class="price-discount-pill">Save ${pr.savingsFormatted} (${pr.discountPercent}% OFF)</span></td></tr>
          <tr><td class="spec-key">Recommended Coverage Area</td><td class="spec-val"><strong>${p.room_size || '120 – 180 sq.ft'}</strong></td></tr>
          <tr><td class="spec-key">Nominal Capacity</td><td class="spec-val">${p.tonnage}</td></tr>
          <tr><td class="spec-key">Energy Rating / Technology</td><td class="spec-val">${p.star_rating} ${p.is_inverter && !p.star_rating.includes('Inverter') ? 'Inverter' : ''}</td></tr>
          ${p.iseer ? `<tr><td class="spec-key">Rated Efficiency (ISEER)</td><td class="spec-val">${p.iseer}</td></tr>` : ''}
          ${customSpecRows}
        </tbody>
      </table>
    </div>

    ${module2Html}
    ${module3Html}

    <!-- Module 4: Warranty & Installation Terms -->
    <div class="spec-section-card">
      <div class="spec-header">Warranty Coverage &amp; Authorized Installation Terms</div>
      <table class="spec-table">
        <tbody>
          <tr><td class="spec-key">Manufacturer Warranty</td><td class="spec-val"><strong>${p.warranty || '5 Years Comprehensive on PCB/Coils/Motors + 10 Years on Inverter Compressor'}</strong></td></tr>
          <tr><td class="spec-key">Installation &amp; Commissioning</td><td class="spec-val">${p.installation_details || 'Standard Installation ₹1,500 by Authorized VACS Technicians'}</td></tr>
          <tr><td class="spec-key">Authorized Dealer &amp; Service Partner</td><td class="spec-val"><strong>Versatile Air Conditioner Systems (CH. SANTHOSH)</strong> — KPHB 4th Phase, Hyderabad</td></tr>
          <tr><td class="spec-key">Direct Support Helpline</td><td class="spec-val"><a href="tel:+919700063938" style="color:#0284c7; font-weight:600;">+91 97000 63938</a> / <a href="tel:+919010424305" style="color:#0284c7; font-weight:600;">+91 90104 24305</a></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderRelatedModels(currentProduct, allProducts) {
  const container = document.getElementById('relatedProductsGrid');
  if (!container) return;

  const related = allProducts
    .filter(p => p.id !== currentProduct.id && (p.category === currentProduct.category || p.tonnage === currentProduct.tonnage))
    .slice(0, 4);

  container.innerHTML = related.map(p => {
    const pr = getPriceObj(p);
    return `
      <div class="product-card">
        <div class="product-card-top">
          <span class="badge ${p.is_inverter ? 'badge-inverter' : 'badge-mrp'}">${p.star_rating}</span>
          <span class="price-discount-pill">${pr.discountPercent}% OFF</span>
        </div>
        <a href="product.html?id=${p.id}" class="product-image-wrapper" style="height: 115px;">
          <img src="${p.image || 'assets/images/FTKM_Series.jpg'}" alt="${p.model}">
        </a>
        <div class="product-series">${p.series}</div>
        <h4 style="font-size: 0.9375rem; font-weight: 700; margin-bottom: 0.15rem;"><a href="product.html?id=${p.id}">${p.model}</a></h4>
        <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 0.5rem;">${p.tonnage} • ${p.room_size || '120–180 sq.ft'}</div>
        <div class="ecart-price-block" style="padding: 0.5rem 0.65rem; margin-bottom: 0.5rem;">
          <div class="ecart-price-row">
            <span class="price-selling" style="font-size: 1rem;">${pr.sellingFormatted}</span>
            <span class="price-mrp-strike" style="font-size: 0.75rem;">${pr.mrpFormatted}</span>
          </div>
          <div style="font-size: 0.68rem; color: #059669; font-weight: 600;">Save ${pr.savingsFormatted}</div>
        </div>
        <a href="product.html?id=${p.id}" class="btn btn-outline btn-sm" style="width: 100%;">View Offer & Specs</a>
      </div>
    `;
  }).join('');
}
