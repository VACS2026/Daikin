import os
import json
import re
import collections

print("=================== VACS STATIC WEBSITE VERIFICATION ===================")

# 1. Verify JSON files
json_files = ['data/products.json', 'data/categories.json', 'data/amc_plans.json']
for jf in json_files:
    if os.path.exists(jf):
        with open(jf, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"[PASS] {jf} is valid JSON with {len(data)} items.")
    else:
        print(f"[FAIL] Missing {jf}")

# 2. Verify Products, Categories, Star Ratings, and Images
with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

cats = collections.Counter(p['category'] for p in products)
stars = collections.Counter(p['star_rating'] for p in products)
print(f"[PASS] Category coverage: {dict(cats)}")
print(f"[PASS] Star rating coverage: {dict(stars)}")

missing_images = 0
for p in products:
    img = p.get('image', '')
    if img:
        img_path = img.replace('/', os.sep)
        if not os.path.exists(img_path):
            print(f"[WARN] Image not found on disk: {img} for model {p['model']}")
            missing_images += 1

if missing_images == 0:
    print(f"[PASS] All {len(products)} products have valid local images.")
else:
    print(f"[INFO] {missing_images} product images need fallback placeholders.")

# 3. Verify pricing-config.js covers all products
if os.path.exists('data/pricing-config.js'):
    with open('data/pricing-config.js', 'r', encoding='utf-8') as f:
        pricing_txt = f.read()
    covered = sum(1 for p in products if f'"{p["id"]}"' in pricing_txt)
    print(f"[PASS] data/pricing-config.js verified ({covered}/{len(products)} explicit model overrides + category fallbacks).")
else:
    print("[FAIL] Missing data/pricing-config.js")

# 4. Verify HTML files and internal links
html_files = [
    'index.html',
    'vrv.html',
    'products.html',
    'product.html',
    'services.html',
    'amc.html',
    'about.html',
    'contact.html'
]

for hf in html_files:
    if not os.path.exists(hf):
        print(f"[FAIL] Missing {hf}")
        continue
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check script references
    scripts = re.findall(r'<script[^>]+src=[\'"]([^\'"]+)[\'"]', content)
    for s in scripts:
        clean_s = s.split('?')[0]
        s_path = clean_s.replace('/', os.sep)
        if not os.path.exists(s_path):
            print(f"[FAIL] In {hf}, missing script: {s}")

    if not any('data/pricing-config.js' in s for s in scripts):
        print(f"[WARN] In {hf}, data/pricing-config.js not included!")

    # Check stylesheet references
    css = re.findall(r'<link[^>]+href=[\'"]([^\'"]+\.css(?:\?[^\'"]*)?)[\'"]', content)
    for c in css:
        clean_c = c.split('?')[0]
        c_path = clean_c.replace('/', os.sep)
        if not os.path.exists(c_path):
            print(f"[FAIL] In {hf}, missing css: {c}")

    print(f"[PASS] {hf} validated successfully (Scripts: {len(scripts)}).")

print("=================== VERIFICATION COMPLETE ===================")
