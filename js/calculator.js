/**
 * Versatile Air Conditioner Systems (VACS)
 * Complete Customer AC Buying Calculators Suite:
 * 1. Quick Hero Tonnage & Live Price Finder
 * 2. 5-Star vs 3-Star vs Old AC Electricity Bill & ROI Payback Calculator
 * 3. On-Road Total Cost, Copper Kit, Old AC Exchange & Monthly EMI Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalcTabs();
  initTonnageCalculator();
  initEnergySavingsCalculator();
  initOnRoadEmiCalculator();
  initVrvProjectCalculator();
});

// Switch between Calculator Tabs in the Buyer Hub
function initCalcTabs() {
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const tabPanels = document.querySelectorAll('.calc-tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-calc-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

// 1. Room AC Tonnage & Heat Load Calculator
function initTonnageCalculator() {
  const calcForm = document.getElementById('tonnageCalcForm');
  if (!calcForm) return;

  const calculate = (e) => {
    if (e) e.preventDefault();

    const length = parseFloat(document.getElementById('calcLength')?.value) || 12;
    const width = parseFloat(document.getElementById('calcWidth')?.value) || 10;
    const floor = document.getElementById('calcFloor')?.value || 'middle';
    const sunlight = document.getElementById('calcSunlight')?.value || 'normal';
    const occupants = parseInt(document.getElementById('calcOccupants')?.value || '2', 10);

    const area = Math.round(length * width);

    // Base BTU/hr calculation for Indian summer (45°C+ peak ambient in Hyderabad)
    let btu = area * 65;
    if (floor === 'top') btu *= 1.15;
    if (sunlight === 'heavy') btu *= 1.12;
    if (occupants > 2) btu += (occupants - 2) * 600;

    const rawTons = btu / 12000;
    const kwLoad = (btu * 0.000293071).toFixed(1);

    let recommendedTon = '1.0 Ton';
    let filterCategory = 'Split AC';
    let filterTon = '1.0 Ton';
    let modelId = 'ftkm35xv16vaa';
    let valueModelId = 'ftkl35xv16waa';

    if (area <= 90 && rawTons <= 0.85) {
      recommendedTon = '0.8 Ton';
      filterTon = '0.8 Ton';
      modelId = 'ftq28xv16wba';
      valueModelId = 'ftq28xv16wba';
    } else if (rawTons <= 1.15) {
      recommendedTon = '1.0 Ton';
      filterTon = '1.0 Ton';
      modelId = 'ftkm35xv16vaa';
      valueModelId = 'ftkl35xv16waa';
    } else if (rawTons <= 1.6) {
      recommendedTon = '1.5 Ton';
      filterTon = '1.5 Ton';
      modelId = 'ftkm50xv16mka';
      valueModelId = 'ftkl50xv16vka';
    } else if (rawTons <= 1.95) {
      recommendedTon = '1.8 Ton';
      filterTon = '1.8 Ton';
      modelId = 'ftkm60xv16maa';
      valueModelId = 'ftkl60xv16vaa';
    } else if (rawTons <= 2.35) {
      recommendedTon = '2.0 Ton';
      filterTon = '2.0 Ton';
      modelId = 'ftkl71xv16maa';
      valueModelId = 'fcvfq71av16';
    } else {
      recommendedTon = '2.6 – 3.0+ Ton (Heavy / Cassette)';
      filterCategory = 'Cassette AC';
      filterTon = 'all';
      modelId = 'fcmf100arv16';
      valueModelId = 'ftkl90xv16laa';
    }

    // Look up live prices from VACS_Pricing
    const products = window.VACS_PRODUCTS_DATA || [];
    const prod1 = products.find(p => p.id === modelId) || products[0];
    const prod2 = products.find(p => p.id === valueModelId) || products[1];

    const pr1 = (window.VACS_Pricing && prod1) ? window.VACS_Pricing.getProductPrice(prod1) : null;
    const pr2 = (window.VACS_Pricing && prod2) ? window.VACS_Pricing.getProductPrice(prod2) : null;

    const resultBox = document.getElementById('calcResultBox');
    const tonEl = document.getElementById('resultTonnage');
    const modelEl = document.getElementById('resultModel');
    const descEl = document.getElementById('resultDesc');
    const viewBtn = document.getElementById('viewMatchingModelsBtn');

    if (resultBox && tonEl && descEl) {
      tonEl.textContent = `${recommendedTon} (${kwLoad} kW / ${Math.round(btu).toLocaleString('en-IN')} BTU)`;
      if (modelEl && prod1 && pr1) {
        modelEl.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.3rem; margin: 0.35rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
              <span><strong>5-Star Pick:</strong> ${prod1.model}</span>
              <span><strong style="color: #0f172a;">${pr1.sellingFormatted}</strong> <span class="price-mrp-strike" style="font-size: 0.7rem;">${pr1.mrpFormatted}</span></span>
            </div>
            ${prod2 && pr2 && prod2.id !== prod1.id ? `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
              <span><strong>3-Star Value:</strong> ${prod2.model}</span>
              <span><strong style="color: #0f172a;">${pr2.sellingFormatted}</strong> <span class="price-mrp-strike" style="font-size: 0.7rem;">${pr2.mrpFormatted}</span></span>
            </div>` : ''}
          </div>
        `;
      }
      descEl.textContent = `Sized for ${area} sq.ft room (${floor === 'top' ? 'Top floor roof heat' : 'Standard floor'}, ${sunlight === 'heavy' ? 'High sunlight' : 'Normal shade'}).`;
      resultBox.style.display = 'block';

      if (viewBtn) {
        viewBtn.onclick = () => {
          let url = `products?category=${encodeURIComponent(filterCategory)}`;
          if (filterTon !== 'all') url += `&tonnage=${encodeURIComponent(filterTon)}`;
          window.location.href = url;
        };
      }
    }
  };

  calcForm.addEventListener('submit', calculate);
  calcForm.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => calculate());
    el.addEventListener('change', () => calculate());
  });
  calculate();
}

// 2. 5-Star vs 3-Star vs Old Non-Inverter Electricity Bill & Payback Calculator
function initEnergySavingsCalculator() {
  const savingsForm = document.getElementById('savingsCalcForm');
  if (!savingsForm) return;

  const updateSavings = () => {
    const tonCap = parseFloat(document.getElementById('savingsTonnage')?.value || '1.5');
    const hoursPerDay = parseFloat(document.getElementById('dailyHours')?.value) || 8;
    const monthsPerYear = parseFloat(document.getElementById('monthsPerYear')?.value) || 8;
    const tariff = parseFloat(document.getElementById('kwhRate')?.value) || 8.5;

    const totalHoursPerYear = hoursPerDay * 30 * monthsPerYear;

    // Power draw per hour (kWh) based on BEE star rating & compressor modulation
    const scale = tonCap / 1.5;
    const kwOldFixed = 1.65 * scale;     // Old Non-Inverter
    const kw3StarInv = 1.08 * scale;     // Daikin 3-Star Inverter
    const kw5StarInv = 0.78 * scale;     // Daikin 5-Star Inverter

    const billOldYear = Math.round(totalHoursPerYear * kwOldFixed * tariff);
    const bill3StarYear = Math.round(totalHoursPerYear * kw3StarInv * tariff);
    const bill5StarYear = Math.round(totalHoursPerYear * kw5StarInv * tariff);

    const save5vsOldYear = Math.max(0, billOldYear - bill5StarYear);
    const save5vs3Year = Math.max(0, bill3StarYear - bill5StarYear);
    const fiveYearSavingsVsOld = save5vsOldYear * 5;
    const fiveYearSavingsVs3 = save5vs3Year * 5;

    // Price difference payback between 3-Star and 5-Star (~₹11,500 avg difference)
    const priceDiff = tonCap <= 1.0 ? 7800 : (tonCap <= 1.5 ? 11500 : 16500);
    const paybackYears = save5vs3Year > 0 ? (priceDiff / save5vs3Year).toFixed(1) : '2.0';

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('annualSavingsVal', `₹${save5vsOldYear.toLocaleString('en-IN')} / Year`);
    setEl('fiveYearSavingsVal', `₹${fiveYearSavingsVsOld.toLocaleString('en-IN')} in 5 Years`);
    setEl('bill5StarVal', `₹${bill5StarYear.toLocaleString('en-IN')}/yr`);
    setEl('bill3StarVal', `₹${bill3StarYear.toLocaleString('en-IN')}/yr`);
    setEl('billOldVal', `₹${billOldYear.toLocaleString('en-IN')}/yr`);
    setEl('save5vs3Val', `₹${save5vs3Year.toLocaleString('en-IN')}/yr (₹${fiveYearSavingsVs3.toLocaleString('en-IN')} in 5 yrs)`);
    setEl('paybackMonthsVal', `Extra 5-Star cost recovered in ~${paybackYears} years!`);
  };

  savingsForm.querySelectorAll('input, select').forEach(inp => {
    inp.addEventListener('input', updateSavings);
    inp.addEventListener('change', updateSavings);
  });

  updateSavings();
}

// 3. Total On-Road Installation, Copper Pipe, Exchange & Monthly EMI Calculator
function initOnRoadEmiCalculator() {
  const form = document.getElementById('onRoadCalcForm');
  const modelSelect = document.getElementById('calcModelSelect');
  if (!form || !modelSelect) return;

  const products = window.VACS_PRODUCTS_DATA || [];
  const splitAndCassette = products.filter(p => p.category === 'Split AC' || p.category === 'Cassette AC');

  // Populate dropdown with live discounted prices
  if (splitAndCassette.length > 0) {
    modelSelect.innerHTML = splitAndCassette.map(p => {
      const pr = window.VACS_Pricing ? window.VACS_Pricing.getProductPrice(p) : { sellingFormatted: '₹' + p.mrp, mrpFormatted: '₹' + p.mrp };
      const isDefault = p.id === 'ftkm50xv16mka' ? 'selected' : '';
      return `<option value="${p.id}" ${isDefault}>${p.model} (${p.tonnage} ${p.star_rating}) — Offer: ${pr.sellingFormatted} [MRP ${pr.mrpFormatted}]</option>`;
    }).join('');
  }

  const updateOnRoad = () => {
    const selectedId = modelSelect.value;
    const product = products.find(p => p.id === selectedId) || products[0];
    if (!product) return;

    const pr = window.VACS_Pricing ? window.VACS_Pricing.getProductPrice(product) : {
      mrp: 68200,
      sellingPrice: 53900,
      savings: 14300,
      discountPercent: 21
    };

    const extraPipeFeet = parseFloat(document.getElementById('calcExtraPipe')?.value || '0');
    const needStand = document.getElementById('calcOutdoorStand')?.value === 'yes';
    const exchangeValue = parseFloat(document.getElementById('calcExchange')?.value || '0');
    const emiMonths = parseInt(document.getElementById('calcEmiTenure')?.value || '6', 10);

    const stdInstall = product.category === 'Cassette AC' ? 3500 : 1500;
    const standCost = needStand ? 750 : 0;
    const pipeCost = Math.round(extraPipeFeet * 280);
    const totalInstall = stdInstall + standCost + pipeCost;

    const netOnRoad = Math.max(0, pr.sellingPrice + totalInstall - exchangeValue);
    const totalSavingsOverall = pr.savings + exchangeValue;
    const monthlyEmi = emiMonths > 0 ? Math.round(netOnRoad / emiMonths) : netOnRoad;

    const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl('onRoadMrpVal', fmt(pr.mrp));
    setEl('onRoadDiscountVal', `- ${fmt(pr.savings)} (${pr.discountPercent}% OFF)`);
    setEl('onRoadSellingVal', fmt(pr.sellingPrice));
    setEl('onRoadInstallVal', `+ ${fmt(totalInstall)} (Install ₹${stdInstall}${standCost ? ' + Stand ₹750' : ''}${pipeCost ? ' + Pipe ' + fmt(pipeCost) : ''})`);
    setEl('onRoadExchangeVal', exchangeValue > 0 ? `- ${fmt(exchangeValue)}` : '₹0 (No Exchange)');
    setEl('onRoadFinalTotalVal', fmt(netOnRoad));
    setEl('onRoadTotalSavedBadge', `Total Savings: ${fmt(totalSavingsOverall)}`);
    setEl('onRoadEmiResultVal', emiMonths > 0 ? `${fmt(monthlyEmi)} / month (${emiMonths} Months)` : `${fmt(netOnRoad)} (One-Time Payment)`);

    const waBtn = document.getElementById('sendOnRoadEstimateWaBtn');
    if (waBtn) {
      waBtn.onclick = () => {
        const msg = `Hello CH. Santhosh (Versatile Air Conditioner Systems), I calculated an On-Road AC Estimate on your website:\n` +
                    `• Model: Daikin ${product.model} (${product.tonnage}, ${product.star_rating})\n` +
                    `• MRP: ${fmt(pr.mrp)} | Offer Price: ${fmt(pr.sellingPrice)} (${pr.discountPercent}% OFF)\n` +
                    `• Installation & Accessories: ${fmt(totalInstall)}\n` +
                    `• Old AC Exchange: -${fmt(exchangeValue)}\n` +
                    `• Net Estimated Total: ${fmt(netOnRoad)} (${emiMonths > 0 ? emiMonths + 'M EMI @ ' + fmt(monthlyEmi) + '/mo' : 'Full Payment'})\n` +
                    `Please confirm availability and final deal for my location in Hyderabad.`;
        window.open(`https://wa.me/919700063938?text=${encodeURIComponent(msg)}`, '_blank');
      };
    }
  };

  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('change', updateOnRoad);
    el.addEventListener('input', updateOnRoad);
  });

  updateOnRoad();
}

// 4. Interactive VRV Alpha Project HP, Tonnage & Turnkey Budget Calculator (vrv.html)
function initVrvProjectCalculator() {
  const form = document.getElementById('vrvProjectCalcForm');
  if (!form) return;

  const updateVrv = () => {
    const projType = document.getElementById('vrvProjType')?.value || 'villa';
    const areaSqft = Math.max(500, parseFloat(document.getElementById('vrvAreaSqft')?.value || '3200'));
    const zones = Math.max(2, parseInt(document.getElementById('vrvZonesCount')?.value || '8', 10));
    const iduMix = document.getElementById('vrvIduMix')?.value || 'mixed';
    const includeHrv = document.getElementById('vrvHrvOption')?.value === 'yes';

    // Sqft per TR factor based on building type & simultaneity diversity
    const sqftPerTrMap = {
      villa: 135,     // Residential diversity (not all rooms occupied 100% simultaneously)
      office: 115,    // Standard corporate workspace
      showroom: 95,   // High lighting & footfall load
      hospital: 110,  // Clinical zones
      banquet: 75     // High occupancy assembly space
    };

    const sqftPerTr = sqftPerTrMap[projType] || 120;
    const rawTr = areaSqft / sqftPerTr;
    // 1 TR ≈ 1.2 HP in VRV nomenclature (rounded to standard 2 HP increments, min 6 HP)
    const rawHp = Math.max(6, Math.ceil((rawTr * 1.2) / 2) * 2);
    const finalHp = Math.min(60, rawHp);
    const finalTr = (finalHp * 0.83).toFixed(1);

    let seriesTitle = `Daikin VRV Alpha ${finalHp} HP Single Module`;
    if (finalHp <= 6 && projType === 'villa') {
      seriesTitle = `Daikin VRV Home / VRV-S ${finalHp} HP System`;
    } else if (finalHp >= 22 && finalHp <= 26) {
      seriesTitle = `Daikin VRV Alpha ${finalHp} HP Large Single Module (7% Space Saving)`;
    } else if (finalHp > 26) {
      seriesTitle = `Daikin VRV Alpha ${finalHp} HP Multi-Module System (With Backup Function)`;
    }

    // Cost per HP for ODU + IDUs based on IDU style
    const iduCostFactor = iduMix === 'cassette' ? 38500 : (iduMix === 'mixed' ? 36000 : 31500);
    const baseEquipOffer = Math.round((finalHp * iduCostFactor) + (zones * 11500));
    const hrvCost = includeHrv ? 78500 : 0;
    const equipOffer = baseEquipOffer + hrvCost;
    const equipMrp = Math.round(equipOffer / 0.83 / 1000) * 1000;
    const equipSavings = equipMrp - equipOffer;
    const discPct = Math.round((equipSavings / equipMrp) * 100);

    // Turnkey copper piping, REFNET headers/joints, insulation, drain, nitrogen test & commissioning
    const turnkeyExec = Math.round((zones * 13500) + (finalHp * 1800));
    const grandTotal = equipOffer + turnkeyExec;

    const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
    const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    setEl('vrvEstDiscountBadge', `Save ${fmt(equipSavings)} (${discPct}% OFF)`);
    setEl('vrvEstSeriesTitle', seriesTitle);
    setEl('vrvEstCapacitySub', `${finalHp} HP (${finalTr} TR) • Configured for ${zones} Indoor Zones (${areaSqft.toLocaleString('en-IN')} Sq.Ft)${includeHrv ? ' + HRV Fresh Air' : ''}`);
    setEl('vrvEstMrpVal', fmt(equipMrp));
    setEl('vrvEstSavingsVal', `- ${fmt(equipSavings)} (${discPct}% OFF)`);
    setEl('vrvEstEquipVal', fmt(equipOffer));
    setEl('vrvEstTurnkeyVal', `+ ${fmt(turnkeyExec)}`);
    setEl('vrvEstTotalVal', fmt(grandTotal));

    const waBtn = document.getElementById('sendVrvEstimateWaBtn');
    if (waBtn) {
      waBtn.onclick = () => {
        const msg = `Hello CH. Santhosh (Versatile Air Conditioner Systems), I used the VRV Project Calculator on your website:\n` +
                    `• Project Type: ${projType.toUpperCase()} (${areaSqft} Sq.Ft, ${zones} Zones)\n` +
                    `• Recommended System: ${seriesTitle} (${finalHp} HP / ${finalTr} TR)\n` +
                    `• Indoor Unit Style: ${iduMix}${includeHrv ? ' + Daikin HRV Ventilation' : ''}\n` +
                    `• Est. Equipment Offer: ${fmt(equipOffer)} (MRP ${fmt(equipMrp)})\n` +
                    `• Est. Turnkey Execution: ${fmt(turnkeyExec)}\n` +
                    `• Est. Complete Turnkey Project: ${fmt(grandTotal)}\n` +
                    `Please schedule a free site survey and share a detailed BOQ in Hyderabad.`;
        window.open(`https://wa.me/919700063938?text=${encodeURIComponent(msg)}`, '_blank');
      };
    }
  };

  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', updateVrv);
    el.addEventListener('change', updateVrv);
  });

  updateVrv();
}
