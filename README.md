# Versatile Air Conditioner Systems (VACS) - Official Static Website

A high-performance, official corporate static website built for **Versatile Air Conditioner Systems**, an authorized **DAIKIN** Air Conditioners sales, service, and AMC partner in Kukatpally, Hyderabad (Proprietor: **CH. SANTHOSH**).

---

## 🌟 Key Features & Capabilities

1. **Subtle & Official Corporate UI/UX**:
   * Designed with restrained corporate styling (Plus Jakarta Sans typography, soft Daikin blue `#0284c7`, subtle slate neutrals `#0f172a`, and clean hairline borders).
   * No loud or oversaturated colors; readable, executive visual presentation.

2. **Complete Daikin Product Catalog**:
   * Complete database of 37+ Daikin split, cassette, ductable, VRV, and air purifier models stored in `data/products.json`.
   * Real-time multi-facet filtering by Category, Tonnage, Energy Star rating, and Keyword search (`products.html`).

3. **Interactive 3-Model Side-by-Side Comparison Engine**:
   * Floating dock drawer allowing customers to select up to 3 units.
   * Side-by-side comparison modal with 12 technical parameters (`js/compare.js`).

4. **Universal Product Specification Detail Pages**:
   * 4-tier standardized technical tables: General & ISEER, Indoor Unit, Outdoor Swing Compressor, and Warranty & Installation terms (`product.html?id=...`).
   * Downloadable specification PDF trigger.

5. **Interactive Tools**:
   * **Room AC Tonnage Calculator**: Calculates heat load based on room length $\times$ width, ceiling floor, and sunlight exposure.
   * **Electricity Bill Savings Estimator**: Calculates annual financial savings of Daikin 5-star inverters vs old non-inverters.

6. **Services & Annual Maintenance Contracts (AMC)**:
   * Dedicated pages for High-Pressure Jet Pump Wet Wash, R-32 Gas Refill, and Inverter PCB repairs (`services.html`).
   * Transparent Basic vs. Comprehensive AMC comparison matrix and instant booking (`amc.html`).

7. **Instant WhatsApp Lead Dispatch**:
   * Pre-fills exact product models, service requests, and customer contact details directly to CH. Santhosh's WhatsApp (`+91 97000 63938`).

---

## 🚀 How to Deploy to GitHub Pages (Free Hosting with SSL)

This website is **100% static** (pure HTML5, CSS, and Vanilla JavaScript). There are zero build steps, npm dependencies, or server requirements.

### Step 1: Create a GitHub Repository
1. Log into [GitHub](https://github.com/) and click **New Repository**.
2. Name it (for example: `vacs-daikin` or `versatile-air-conditioners`).
3. Set visibility to **Public** (or Private if you have GitHub Pro) and click **Create repository**.

### Step 2: Push These Files to GitHub
Open PowerShell or Terminal in this folder (`c:\Users\SAIKUMAR\Downloads\dikin`) and run:

```bash
git init
git add .
git commit -m "Initial commit of official VACS Daikin website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your GitHub repository, go to **Settings** > **Pages** (in the left sidebar).
2. Under **Build and deployment**:
   * **Source**: Select `Deploy from a branch`.
   * **Branch**: Select `main` and folder `/ (root)`.
3. Click **Save**.
4. In about 30 seconds, your website will be live at:
   `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🌐 How to Connect Your Custom Domain

If you own a custom domain (such as `versatileairconditioners.com` from GoDaddy, Namecheap, Hostinger, etc.):

1. In your GitHub repository under **Settings** > **Pages** > **Custom domain**, type your domain (e.g. `versatileairconditioners.com`) and click **Save**.
2. In your domain registrar's DNS management page, add the following records:
   * **CNAME Record**:
     * Host/Name: `www`
     * Value/Target: `YOUR_GITHUB_USERNAME.github.io`
   * **A Records** (pointing to GitHub's IPs):
     * `185.199.108.153`
     * `185.199.109.153`
     * `185.199.110.153`
     * `185.199.111.153`
3. Check the box **Enforce HTTPS** in GitHub Pages.

---

## ✏️ How to Update Prices & Discounts Anytime (Zero Hardcoded HTML Prices!)

All product prices, discounts, service rates, and AMC plan rates are centrally managed in a single configuration file: **`data/pricing-config.js`**.

### Option A: Visual Price & Discount Configurator (Right in Your Browser!)
1. Scroll to the bottom footer of any page and click **"Manage Prices & Discounts"** (or open `index.html?admin=price`).
2. You can:
   * Apply a **flat bulk discount %** across all models in 1 click (e.g., set `22% OFF` for a Summer Sale).
   * Or edit the **Actual MRP (₹)** and **After-Discount Selling Price (₹)** for any individual model.
3. Click **"Apply & Preview Live"** to immediately see the crossed-out MRP, discounted selling price, `% OFF` badge, savings, and EMI update across the site.
4. Click **"Download `pricing-config.js`"** and replace `data/pricing-config.js` in your folder / GitHub repository!

### Option B: Direct File Edit (`data/pricing-config.js`)
Open `data/pricing-config.js` in any text editor (or directly on GitHub.com):
```javascript
modelPrices: {
  // mrp = Original Price (shown crossed-out)
  // sellingPrice = Final Offer Price (auto-calculates % OFF, Savings & EMI!)
  "ftkl50xv16vka": { mrp: 56100, sellingPrice: 41490, tag: "#1 Most Bought 1.5T" },
  "ftkm50xv16mka": { mrp: 68200, sellingPrice: 53900, tag: "#1 Premium 1.5T" },
}
```
You can also update `serviceRates` (Jet Wash, Gas Refill, Installation) and `amcRates` (Standard & Comprehensive AMC) in the exact same file!

---

## 📞 Showroom Location & Contacts
* **Owner**: CH. SANTHOSH
* **Showroom**: LIG.30/9, KPHB, 4th Phase, Beside Foot Over Bridge, Kukatpally, Hyderabad, Telangana - 500072
* **Mobile**: `+91 97000 63938` / `+91 73863 83906`
* **Landline**: ``
* **Email**: `info@versatileairconditioners.com`
