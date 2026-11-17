/**
 * ============================================================================
 * VERSATILE AIR CONDITIONER SYSTEMS (VACS) — SMART PRICING & DISCOUNT CONFIG
 * ============================================================================
 * HOW TO UPDATE PRICES OR DISCOUNTS ANYTIME:
 *
 * 1. QUICKEST WAY (Category / Star-Level Discount):
 *    Change the percentage in `categoryDiscounts` below (e.g., change "5 Star": 19 to 22).
 *    Any model without a fixed `sellingPrice` will automatically recalculate!
 *
 * 2. EXACT MODEL PRICE OVERRIDE:
 *    In `modelPrices` below, update `mrp` (original price shown crossed-out)
 *    and `sellingPrice` (final discounted offer price).
 *    The website automatically calculates the % OFF badge, total ₹ saved, and monthly EMI!
 *
 * 3. SERVICES & AMC RATES:
 *    Update `serviceRates` and `amcRates` below to change service/AMC prices site-wide.
 * ============================================================================
 */

window.VACS_PRICING_CONFIG = {
  // Storefront Promotional Banner & Offer Settings
  promoSettings: {
    offerTitle: "Authorized Showroom Deal",
    seasonalTag: "Hyderabad Summer Special • Up to 26% OFF on MRP",
    gstNote: "Inclusive of GST • Official Daikin Tax Invoice & Brand Warranty",
    noCostEmiMonths: 6,
    standardEmiMonths: 12,
    maxExchangeBonus: 5000,
    installationCharges: {
      standardSplit: 1500,
      outdoorWallStand: 750,
      extraCopperPerFoot: 280,
      includedCopperMeters: 3,
      siteSurveyFee: 0 // Free site survey in Hyderabad
    }
  },

  // Default Discount Percentage (%) if sellingPrice is not explicitly set
  categoryDiscounts: {
    "5 Star": 19,
    "4 Star": 20,
    "3 Star": 24,
    "2 Star": 19,
    "Cassette AC": 17,
    "Ductable AC": 15,
    "VRV Systems": 14,
    "Air Purifiers": 22,
    "default": 18
  },

  // Individual Model Pricing (MRP = Crossed-out Original Price, sellingPrice = After-Discount Price)
  modelPrices: {
    // --- 5 STAR INVERTER SPLIT ACs ---
    "ftku35xv16vaa": { mrp: 53900, sellingPrice: 42900, tag: "Popular 1.0T 5-Star" },
    "ftku50xv16mka": { mrp: 65800, sellingPrice: 51900, tag: "High Throw 72 Ft" },
    "ftkm35xv16vaa": { mrp: 55900, sellingPrice: 44500, tag: "Bestseller 1.0T" },
    "ftkm50xv16mka": { mrp: 68200, sellingPrice: 53900, tag: "#1 Premium 1.5T" },
    "ftkm60xv16maa": { mrp: 91300, sellingPrice: 73500, tag: "Heavy Duty 1.8T" },
    "jtkj35uv16wa":  { mrp: 57790, sellingPrice: 45900, tag: "Streamer Purifier" },
    "jtkj50uv16va":  { mrp: 70050, sellingPrice: 55400, tag: "Waizu Flagship" },
    "jtkj60uv16ua":  { mrp: 87560, sellingPrice: 69900, tag: "Large Room Flagship" },
    "ftkf35xv16maa": { mrp: 66900, sellingPrice: 52900, tag: "Ultra High ISEER" },
    "ftkf50xv16maa": { mrp: 89800, sellingPrice: 71500, tag: "Super Efficiency" },
    "ftkf60xv16laa": { mrp: 110700, sellingPrice: 88900, tag: "Max Cooling 1.8T" },
    "ftkr35xv16vaa": { mrp: 58500, sellingPrice: 46400, tag: "Wi-Fi Smart AC" },
    "ftkr50xv16mka": { mrp: 71000, sellingPrice: 56200, tag: "Voice + Wi-Fi IoT" },
    "ftkr60xv16maa": { mrp: 94200, sellingPrice: 75400, tag: "Smart 1.8T IoT" },

    // --- HOT & COLD INVERTER SPLIT ACs (5-Star & 4-Star) ---
    "ftxf50xv16vaa": { mrp: 85600, sellingPrice: 67900, tag: "Hot & Cold 5-Star" },
    "ftxf35uv16wa":  { mrp: 61800, sellingPrice: 48900, tag: "Hot & Cold 1.0T" },
    "ftxf50uv16va":  { mrp: 73900, sellingPrice: 58400, tag: "Hot & Cold 1.5T" },
    "ftht35xv16waa": { mrp: 51500, sellingPrice: 40900, tag: "All-Weather 1.0T" },
    "ftht50xv16vaa": { mrp: 61600, sellingPrice: 48900, tag: "All-Weather 1.5T" },
    "ftht60xv16uaa": { mrp: 72200, sellingPrice: 57500, tag: "All-Weather 1.8T" },
    "ftht71xv16maa": { mrp: 86600, sellingPrice: 68900, tag: "All-Weather 2.0T" },

    // --- 3 STAR INVERTER SPLIT ACs (HIGHEST VOLUME VALUE RANGE) ---
    "ftkl35xv16waa": { mrp: 48500, sellingPrice: 35900, tag: "Top Value 1.0T" },
    "ftkl50xv16vka": { mrp: 56100, sellingPrice: 41490, tag: "#1 Most Bought 1.5T" },
    "ftkl60xv16vaa": { mrp: 68700, sellingPrice: 52400, tag: "Hall Special 1.8T" },
    "ftkl71xv16maa": { mrp: 82500, sellingPrice: 63900, tag: " Jumbo 2.0T Split" },
    "ftkl90xv16laa": { mrp: 121000, sellingPrice: 94900, tag: "Heavy 2.6 Ton Split" },
    "ftkn35xv16waa": { mrp: 51100, sellingPrice: 37900, tag: "Compact 3-Star" },
    "ftkn50xv16vka": { mrp: 58200, sellingPrice: 42900, tag: "Energy Saver 1.5T" },
    "ftkc35xv16waa": { mrp: 47800, sellingPrice: 35490, tag: "5-Yr PCB Warranty" },

    // --- 2 STAR NON-INVERTER FIXED SPEED SPLIT ACs ---
    "ftq28xv16wba":  { mrp: 36000, sellingPrice: 28900, tag: "Compact 0.8 Ton" },
    "ftq35xv16wba":  { mrp: 45400, sellingPrice: 36400, tag: "Heavy Duty Fixed" },
    "ftq50xv16uca":  { mrp: 55900, sellingPrice: 44500, tag: "Commercial Fixed 1.5T" },

    // --- COMMERCIAL CASSETTE ACs ---
    "fcvfq50av16":   { mrp: 89500, sellingPrice: 73900, tag: "4-Way 1.5T Cassette" },
    "fcvfq71av16":   { mrp: 104500, sellingPrice: 86500, tag: "4-Way 2.0T Cassette" },
    "fkcaq71av16":   { mrp: 98000, sellingPrice: 81400, tag: "1-Way Designer" },
    "fcmf100arv16":  { mrp: 145000, sellingPrice: 119900, tag: "5-Star 3.0T Cassette" },

    // --- COMMERCIAL DUCTABLE ACs ---
    "fdmrn55av16":   { mrp: 178000, sellingPrice: 151000, tag: "5.5 TR Ductable" },
    "fdmrn85av16":   { mrp: 254000, sellingPrice: 215900, tag: "8.5 TR Ductable" },
    "fdmrn11av16":   { mrp: 318000, sellingPrice: 269900, tag: "11.0 TR Twin-Scroll" },

    // --- VRV CENTRALIZED & VRV ALPHA SYSTEMS ---
    "vrv-home-series": { mrp: 240000, sellingPrice: 198000, tag: "Villa Multi-Split" },
    "vrv-s-series":    { mrp: 380000, sellingPrice: 318000, tag: "Compact VRV-S" },
    "vrv-alpha-10hp":  { mrp: 365000, sellingPrice: 299000, tag: "VRV Alpha 6–20 HP" },
    "vrv-alpha-26hp":  { mrp: 540000, sellingPrice: 445000, tag: "VRV Alpha 22–26 HP" },
    "vrv-alpha-multi": { mrp: 920000, sellingPrice: 765000, tag: "VRV Alpha 28–60 HP" },
    "vrv-hrv-vam":     { mrp: 96000,  sellingPrice: 78500,  tag: "HRV Fresh Air Unit" },

    // --- STREAMER AIR PURIFIERS ---
    "mc40xvm6":      { mrp: 24990, sellingPrice: 18990, tag: "335 Sq.Ft HEPA" },
    "mc55xvm6":      { mrp: 32800, sellingPrice: 24990, tag: "500 Sq.Ft + Remote" }
  },

  // Configurable Service Rates (Shown on services.html & index.html)
  serviceRates: {
    "jet-wash": {
      name: "Foam & High-Pressure Jet Wet Servicing",
      unit: "per Split AC",
      mrp: 799,
      sellingPrice: 499,
      note: "2+ ACs Combo: ₹449/AC"
    },
    "gas-refill": {
      name: "Complete R-32 / R-410A Gas Charging",
      unit: "Full Refill + Leak Test",
      mrp: 2800,
      sellingPrice: 2199,
      note: "Includes Nitrogen Test & Vacuuming"
    },
    "pcb-repair": {
      name: "Inverter PCB Diagnostics & Inspection",
      unit: "Doorstep Visit",
      mrp: 499,
      sellingPrice: 299,
      note: "Adjusted 100% if repair approved"
    },
    "installation": {
      name: "Standard Split AC Installation",
      unit: "Authorized Setup",
      mrp: 1800,
      sellingPrice: 1500,
      note: "Outdoor L-Stand ₹750 extra"
    }
  },

  // Configurable AMC Rates (Shown on amc.html)
  amcRates: {
    "standard-split": {
      name: "Standard Non-Comprehensive AMC",
      unit: "per Year (1.0 - 1.5 Ton)",
      mrp: 2200,
      sellingPrice: 1499,
      subNote: "2.0 Ton: ₹1,899/yr • Cassette: ₹2,799/yr"
    },
    "comprehensive-split": {
      name: "Total Peace-of-Mind Comprehensive AMC",
      unit: "per Year (1.0 - 1.5 Ton)",
      mrp: 4500,
      sellingPrice: 3499,
      subNote: "2.0 Ton: ₹3,999/yr • Cassette: ₹5,499/yr (Includes Free Gas & Spares)"
    },
    "commercial-vrv": {
      name: "Commercial Cassette / Ductable / VRV AMC",
      unit: "per TR / Year",
      mrp: 3200,
      sellingPrice: 2499,
      subNote: "Custom fleet discounts for 5+ units"
    }
  }
};

/**
 * Smart Pricing Helper API (`window.VACS_Pricing`)
 * Used across Catalog, Homepage, Product Detail, Compare Modal, Calculators, Services & AMC
 */
window.VACS_Pricing = {
  getConfig() {
    // Allow optional browser localStorage override for instant admin testing
    try {
      const saved = localStorage.getItem('vacs_custom_pricing_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.assign({}, window.VACS_PRICING_CONFIG, parsed);
      }
    } catch (e) {}
    return window.VACS_PRICING_CONFIG;
  },

  formatINR(num) {
    const n = Math.round(Number(num) || 0);
    return '₹' + n.toLocaleString('en-IN');
  },

  parseNum(val) {
    if (typeof val === 'number') return val;
    return parseInt(String(val || '0').replace(/[^0-9]/g, ''), 10) || 0;
  },

  getProductPrice(product) {
    const cfg = this.getConfig();
    const id = (product.id || '').toLowerCase();
    const override = (cfg.modelPrices && cfg.modelPrices[id]) || {};

    const mrp = override.mrp || this.parseNum(product.mrp) || 50000;
    let sellingPrice = override.sellingPrice;

    if (!sellingPrice) {
      const catDisc = cfg.categoryDiscounts[product.star_rating] ||
                      cfg.categoryDiscounts[product.category] ||
                      cfg.categoryDiscounts.default || 18;
      sellingPrice = Math.round((mrp * (100 - catDisc)) / 100 / 10) * 10;
    }

    const savings = Math.max(0, mrp - sellingPrice);
    const discountPercent = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
    const noCostMonths = (cfg.promoSettings && cfg.promoSettings.noCostEmiMonths) || 6;
    const stdMonths = (cfg.promoSettings && cfg.promoSettings.standardEmiMonths) || 12;

    const noCostEmi = Math.round(sellingPrice / noCostMonths);
    const stdEmi = Math.round(sellingPrice / stdMonths);

    return {
      mrp,
      sellingPrice,
      savings,
      discountPercent,
      mrpFormatted: this.formatINR(mrp),
      sellingFormatted: this.formatINR(sellingPrice),
      savingsFormatted: this.formatINR(savings),
      noCostEmiFormatted: this.formatINR(noCostEmi) + '/mo',
      stdEmiFormatted: this.formatINR(stdEmi) + '/mo',
      tag: override.tag || (product.is_inverter ? `${product.star_rating} Inverter` : product.star_rating)
    };
  },

  getServicePrice(key) {
    const cfg = this.getConfig();
    const item = (cfg.serviceRates && cfg.serviceRates[key]) || { mrp: 799, sellingPrice: 499, unit: '' };
    const savings = Math.max(0, item.mrp - item.sellingPrice);
    const discountPercent = item.mrp > 0 ? Math.round((savings / item.mrp) * 100) : 0;
    return {
      ...item,
      savings,
      discountPercent,
      mrpFormatted: this.formatINR(item.mrp),
      sellingFormatted: this.formatINR(item.sellingPrice),
      savingsFormatted: this.formatINR(savings)
    };
  },

  getAmcPrice(key) {
    const cfg = this.getConfig();
    const item = (cfg.amcRates && cfg.amcRates[key]) || { mrp: 2200, sellingPrice: 1499, unit: '' };
    const savings = Math.max(0, item.mrp - item.sellingPrice);
    const discountPercent = item.mrp > 0 ? Math.round((savings / item.mrp) * 100) : 0;
    return {
      ...item,
      savings,
      discountPercent,
      mrpFormatted: this.formatINR(item.mrp),
      sellingFormatted: this.formatINR(item.sellingPrice),
      savingsFormatted: this.formatINR(savings)
    };
  },

  // Hydrate any declarative [data-service-price] or [data-amc-price] elements in DOM
  hydrateDeclarativePrices() {
    document.querySelectorAll('[data-service-price]').forEach(el => {
      const key = el.getAttribute('data-service-price');
      const p = this.getServicePrice(key);
      el.innerHTML = `
        <div class="config-price-inline">
          <span class="price-selling">${p.sellingFormatted}</span>
          <span class="price-mrp-strike">${p.mrpFormatted}</span>
          <span class="price-discount-pill">${p.discountPercent}% OFF</span>
        </div>
        <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">${p.unit}${p.note ? ' • ' + p.note : ''}</div>
      `;
    });

    document.querySelectorAll('[data-amc-price]').forEach(el => {
      const key = el.getAttribute('data-amc-price');
      const p = this.getAmcPrice(key);
      el.innerHTML = `
        <div class="config-price-inline" style="margin-bottom: 0.25rem;">
          <span class="price-selling" style="font-size: 1.5rem;">${p.sellingFormatted}</span>
          <span class="price-mrp-strike" style="font-size: 0.95rem;">${p.mrpFormatted}</span>
          <span class="price-discount-pill">Save ${p.savingsFormatted} (${p.discountPercent}% OFF)</span>
        </div>
        <div style="font-size: 0.75rem; color: #475569; font-weight: 500;">${p.unit}</div>
        ${p.subNote ? `<div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">${p.subNote}</div>` : ''}
      `;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.VACS_Pricing) {
    window.VACS_Pricing.hydrateDeclarativePrices();
  }
});
