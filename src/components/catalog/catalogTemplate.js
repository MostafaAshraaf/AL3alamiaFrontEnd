// catalogTemplate.js
// Pure JS function — takes products array + options, returns full HTML string

const CATEGORY_ORDER = [
  "Printers",
  "Cartridges",
  "Drums",
  "Chips",
  "Inks",
  "Mouse",
  "Keyboard",
  "Mouse Pad",
  "Game Pad",
  "Speakers",
];

const CATEGORY_ICONS = {
  Printers: "🖨️",
  Cartridges: "🖨️",
  Drums: "⚙️",
  Chips: "📟",
  Inks: "💧",
  Mouse: "🖱️",
  Keyboard: "⌨️",
  "Mouse Pad": "🟫",
  "Game Pad": "🎮",
  Speakers: "🔊",
};

const fmtPrice = (price) => Number(price).toLocaleString("en-EG") + " EGP";

const imgSrc = (product, baseUrl = "") =>
  product.image ? `${baseUrl}${product.image}` : ""; // ── Cover Page ────────────────────────────────────────────────────────────────
const coverPage = (baseUrl) => `
  <div class="page cover-page">
    <div class="cover-bg-pattern"></div>
    <div class="cover-top-bar"></div>
    <div class="cover-inner">
      <div class="cover-logo-wrap">
        <img src="${baseUrl}/logo.png" alt="AL 3ALAMIA" class="cover-logo-img">
      </div>
      <div class="cover-headline">
        <h1 class="cover-title">Product<br>Catalog</h1>
        <div class="cover-year">◆ &nbsp; 2026 &nbsp; ◆</div>
        <p class="cover-tagline">Printer Inks &amp; Computer Accessories</p>
      </div>
      <div class="cover-divider">
        <div class="divider-line"></div>
        <div class="divider-diamond"></div>
        <div class="divider-line"></div>
      </div>
      <div class="cover-contact">
        <div class="contact-item"><span class="contact-icon">📞</span><span>01121301515 &nbsp;|&nbsp; 01122299637</span></div>
        <div class="contact-item"><span class="contact-icon">✉️</span><span>al3alamia.pcstuff@gmail.com</span></div>
        <div class="contact-item"><span class="contact-icon">📘</span><span>facebook.com/AL3ALAMIA.Store</span></div>
      </div>
    </div>
    <div class="cover-ribbon"><span>جودة &nbsp;·&nbsp; ثقة &nbsp;·&nbsp; ابتكار</span></div>
  </div>`;

// ── About Page ────────────────────────────────────────────────────────────────
const aboutPage = (totalProducts, baseUrl) => `
  <div class="page about-page">
    <div class="about-page-top-bar"></div>
    <div class="about-header ltr">
      <div class="about-header-text">
        <div class="section-label">WHO WE ARE</div>
        <h2 class="about-title">About Al3alamia Store</h2>
      </div>
        <img src="${baseUrl}/logo.png" alt="AL 3ALAMIA" class="about-logo-img">    </div>
    <div class="about-body">
      <div class="about-intro-card">
        <div class="about-quote-mark">"</div>
        <p class="about-intro-text">
          شركة العالمية لاستيراد وتوريد أحبار الطابعات وإكسسوارات الكمبيوتر.
          تأسست الشركة عام <strong>2010</strong> ومنذ ذلك الحين نلتزم
          بتقديم أعلى معايير الجودة والموثوقية، مما مكننا من كسب ثقة عملائنا
          في مختلف أنحاء جمهورية مصر العربية.
        </p>
      </div>
      <div class="about-two-col">
        <div class="about-card">
          <div class="about-card-icon">🏛️</div>
          <h3 class="about-card-title">الوضع القانوني</h3>
          <ul class="about-list">
            <li><span class="check">✔</span><span><strong>السجل التجاري</strong><br/>شركة مسجلة رسميًا وفقًا للقوانين</span></li>
            <li><span class="check">✔</span><span><strong>البطاقة الضريبية</strong><br/>ملتزمون بالكامل باللوائح الضريبية والشفافية</span></li>
          </ul>
        </div>
        <div class="about-card">
          <div class="about-card-icon">🤝</div>
          <h3 class="about-card-title">أهم عملائنا</h3>
          <ul class="about-list">
            <li><span class="check">✔</span><span>شركة مياه الشرب والصرف الصحي</span></li>
            <li><span class="check">✔</span><span>جامعة القاهرة</span></li>
            <li><span class="check">✔</span><span>نادي النيل الرياضي</span></li>
            <li><span class="check">✔</span><span>وزارة الشباب والرياضة</span></li>
            <li><span class="check">✔</span><span>الهيئة العامة لتعليم الكبار</span></li>
          </ul>
        </div>
      </div>
      <div class="about-stats">
        <div class="stat-item"><div class="stat-number">15+</div><div class="stat-label">Years Experience</div></div>
        <div class="stat-sep"></div>
        <div class="stat-item"><div class="stat-number">8</div><div class="stat-label">Product Categories</div></div>
        <div class="stat-sep"></div>
        <div class="stat-item"><div class="stat-number">${totalProducts}+</div><div class="stat-label">Products Available</div></div>
        <div class="stat-sep"></div>
        <div class="stat-item"><div class="stat-number">5+</div><div class="stat-label">Government Clients</div></div>
      </div>
    </div>
  </div>`;

// ── Category Cover ────────────────────────────────────────────────────────────
const categoryCover = (cat, count) => {
  const icon = CATEGORY_ICONS[cat] || "📦";
  return `
  <div class="page cat-cover-page">
    <div class="cat-cover-bg"></div>
    <div class="cat-cover-content">
      <div class="cat-cover-icon">${icon}</div>
      <h2 class="cat-cover-name">${cat}</h2>
      <div class="cat-cover-count">${count} Products</div>
      <div class="cat-cover-bar"></div>
    </div>
    <div class="cat-cover-bottom-bar"></div>
  </div>`;
};

// ── Product Cards ─────────────────────────────────────────────────────────────
const productCardNormal = (p, showPrices, baseUrl) => {
  const name = p.name || "";
  const description = p.description || "";
  const brand = p.inspiredBy || p.brand || "";
  const priceDisplay = showPrices
    ? `<span class="product-price">${fmtPrice(p.price)}</span>`
    : `<span class="product-price-text">متوفر والسعر يحدد على حسب الكمية</span>`;

  return `
    <div class="product-card" data-product-id="${p.id || p.fireId || ""}">
      <div class="product-img-wrap">
        <img src="${imgSrc(p, baseUrl)}" alt="${name}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="img-fallback" style="display:none">${p.type || ""}</div>
      </div>
      <div class="product-info">
        <h4 class="product-name">${name}</h4>
        <p class="product-description">${description}</p>
        <div class="product-footer">
          ${priceDisplay}
          <span class="product-brand">${brand}</span>
        </div>
      </div>
    </div>`;
};

const productCardPrinter = (p, showPrices, baseUrl) => {
  const name = p.name || "";
  const description = p.description || "";
  const brand = p.inspiredBy || p.brand || "";
  const priceDisplay = showPrices
    ? `<span class="printer-price">${fmtPrice(p.price)}</span>`
    : `<span class="printer-price-text">متوفر والسعر يحدد على حسب الكمية</span>`;

  return `
    <div class="printer-card" data-product-id="${p.id || p.fireId || ""}">
      <div class="printer-img-wrap">
        <img src="${imgSrc(p, baseUrl)}" alt="${name}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="img-fallback" style="display:none">Printer</div>
      </div>
      <div class="printer-info">
        <div class="printer-badge">Printer</div>
        <h4 class="printer-name">${name}</h4>
        <p class="printer-description">${description}</p>
        <div class="printer-footer">
          ${priceDisplay}
          <span class="printer-brand">${brand}</span>
        </div>
      </div>
    </div>`;
};

// ── Product Pages ─────────────────────────────────────────────────────────────
const normalCategoryPages = (cat, productsList, showPrices, baseUrl) => {
  const icon = CATEGORY_ICONS[cat] || "📦";
  const perPage = 6;
  const chunks = [];
  for (let i = 0; i < productsList.length; i += perPage)
    chunks.push(productsList.slice(i, i + perPage));

  return chunks
    .map(
      (chunk, idx) => `
  <div class="page products-page" data-category="${cat}">
    <div class="page-header">
      <div class="page-header-left">
        <span class="page-cat-icon">${icon}</span>
        <span class="page-cat-name">${cat}</span>
      </div>
      <div class="page-header-right">
        <img src="${baseUrl}/logo.png" alt="AL 3ALAMIA" class="page-header-logo">
        <span class="page-num">${idx + 1} / ${chunks.length}</span>
      </div>
    </div>
    <div class="products-grid">
      ${chunk.map((p) => productCardNormal(p, showPrices, baseUrl)).join("")}
    </div>
    <div class="page-footer-bar"></div>
  </div>`,
    )
    .join("");
};

const printerPages = (productsList, showPrices, baseUrl) => {
  const perPage = 4;
  const chunks = [];
  for (let i = 0; i < productsList.length; i += perPage)
    chunks.push(productsList.slice(i, i + perPage));

  return chunks
    .map(
      (chunk, idx) => `
  <div class="page products-page printers-page" data-category="Printers">
    <div class="page-header">
      <div class="page-header-left">
        <span class="page-cat-icon">🖨️</span>
        <span class="page-cat-name">Printers</span>
      </div>
      <div class="page-header-right">
            <div class="page-header-logo-text">AL<span>3</span>ALAMIA</div>
        <span class="page-num">${idx + 1} / ${chunks.length}</span>
      </div>
    </div>
    <div class="printers-list">
      ${chunk.map((p) => productCardPrinter(p, showPrices, baseUrl)).join("")}
    </div>
    <div class="page-footer-bar"></div>
  </div>`,
    )
    .join("");
};

// ── Search Script ─────────────────────────────────────────────────────────────
const searchScript = (allProducts) => `
<script>
const productIndex = ${JSON.stringify(allProducts)};

function searchProducts(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return productIndex.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.type.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q)
  );
}
function scrollToProduct(productId) {
  document.getElementById('searchOverlay').classList.remove('active');
  const card = document.querySelector(\`[data-product-id="\${productId}"]\`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'box-shadow 0.4s';
    card.style.boxShadow = '0 0 0 2px #c9a227';
    setTimeout(() => { card.style.boxShadow = ''; }, 2000);
  }
}
function renderResults(results) {
  const c = document.getElementById('searchResults');
  if (!results.length) {
    c.innerHTML = '<div class="no-results">No products found.</div>';
    return;
  }
  c.innerHTML = results.map(p => \`
<div class="result-item" onclick="scrollToProduct('\${p.id}')" style="cursor:pointer">
      <img src="\${p.image}" alt="\${p.name}" class="result-img"
        onerror="this.style.opacity='0'">
      <div class="result-info">
        <div class="result-name">\${p.name}</div>
        <div class="result-type">\${p.type} • \${p.brand}</div>
        <div class="result-desc">\${p.description.substring(0,80)}\${p.description.length > 80 ? '...' : ''}</div>
      </div>
    </div>
  \`).join('');
}

function openSearch() {
  document.getElementById('searchOverlay').classList.add('active');
  document.getElementById('searchInput').focus();
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('searchInput').addEventListener('input', function (e) {
    renderResults(searchProducts(e.target.value));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
  });
});
</script>`;

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --black: #0a0a0a; --dark: #111111; --dark2: #1a1a1a; --dark3: #222222;
  --gold: #c9a227; --gold-lt: #e0bc55; --gold-dk: #a07d1c; --gold-pale: #f5e6b8;
  --white: #ffffff; --off-white: #f5f0e8; --muted: #8a7a5a;
  --border: #2e2a22; --border-gold: rgba(201,162,39,0.35);
  --card-bg: #161410; --shadow: 0 2px 16px rgba(0,0,0,.6);
  --font-head: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --font-mono: 'DM Mono', 'Courier New', monospace;
}
html { -webkit-text-size-adjust: 100%; }
body { font-family: var(--font-body); background: #050505; color: var(--off-white); }

@page { size: A4; margin: 0; }
.page { width: 210mm; min-height: 297mm; background: var(--dark); position: relative; overflow: hidden; page-break-after: always; break-after: page; }
.ltr { text-align: left; direction: ltr; }

/* Logo text style */
.cover-logo-text, .about-logo-text, .page-header-logo-text {
  font-family: var(--font-head); font-weight: 900; color: var(--white); letter-spacing: 2px;
}
.cover-logo-text { font-size: 48px; text-shadow: 0 2px 24px rgba(201,162,39,.5); }
.cover-logo-text span, .about-logo-text span, .page-header-logo-text span { color: var(--gold); }
.about-logo-text { font-size: 22px; flex-shrink: 0; }
.page-header-logo-text { font-size: 13px; opacity: .85; }
.cover-logo-img { width: 180px; height: 180px; object-fit: contain; filter: drop-shadow(0 4px 32px rgba(201,162,39,.4)); }
.about-logo-img { width: 70px; height: 70px; object-fit: contain; filter: drop-shadow(0 2px 12px rgba(201,162,39,.3)); }
.page-header-logo { width: 36px; height: 36px; object-fit: contain; opacity: .8; }
/* Search overlay */
.search-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
.search-overlay.active { display: flex; }
.search-modal { width: 90%; max-width: 800px; max-height: 85vh; background: var(--dark2); border: 1px solid var(--gold); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
.search-header { padding: 20px 24px; background: var(--black); border-bottom: 1px solid var(--border-gold); display: flex; justify-content: space-between; align-items: center; }
.search-header h3 { color: var(--gold); font-family: var(--font-head); font-size: 20px; }
.search-close { background: none; border: none; color: var(--off-white); font-size: 28px; cursor: pointer; padding: 0 8px; }
.search-close:hover { color: var(--gold); }
.search-input-wrapper { padding: 20px 24px 16px; }
.search-input-wrapper input { width: 100%; padding: 14px 18px; background: var(--card-bg); border: 1px solid var(--border-gold); border-radius: 40px; color: var(--off-white); font-size: 16px; outline: none; }
.search-input-wrapper input:focus { border-color: var(--gold); }
.search-input-wrapper input::placeholder { color: var(--muted); }
.search-results { padding: 0 24px 24px; max-height: 55vh; overflow-y: auto; }
.result-item { background: var(--card-bg); border: 1px solid var(--border-gold); border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; display: flex; gap: 14px; align-items: center; }
.result-item:hover { border-color: var(--gold); }
.result-img { width: 50px; height: 50px; object-fit: contain; flex-shrink: 0; }
.result-name { color: var(--white); font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.result-type { color: var(--gold); font-size: 11px; font-weight: 500; }
.result-desc { color: var(--muted); font-size: 11px; margin-top: 2px; }
.no-results { text-align: center; padding: 40px; color: var(--muted); }
.search-trigger-btn { position: fixed; bottom: 30px; right: 30px; background: linear-gradient(135deg, var(--gold-dk), var(--gold)); color: var(--black); border: none; width: 56px; height: 56px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 99; box-shadow: 0 4px 20px rgba(201,162,39,.4); display: flex; align-items: center; justify-content: center; }

/* Cover */
.cover-page { background: var(--black); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cover-bg-pattern { position: absolute; inset: 0; background-image: radial-gradient(ellipse at 50% 30%, rgba(201,162,39,.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(201,162,39,.06) 0%, transparent 50%), repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(201,162,39,.02) 60px, rgba(201,162,39,.02) 61px); }
.cover-top-bar { position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt), var(--gold), var(--gold-dk)); }
.cover-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 60px 24px 80px; text-align: center; width: 100%; }
.cover-logo-wrap { display: flex; align-items: center; justify-content: center; padding: 16px 32px; border: 2px solid var(--border-gold); border-radius: 12px; background: rgba(201,162,39,.05); }
.cover-headline { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.cover-title { font-family: var(--font-head); font-size: clamp(32px, 8vw, 60px); font-weight: 900; color: var(--white); line-height: 1.05; letter-spacing: -1px; }
.cover-year { font-size: 13px; letter-spacing: 6px; color: var(--gold); font-weight: 600; }
.cover-tagline { font-size: 14px; color: rgba(245,230,184,.7); letter-spacing: 1px; }
.cover-divider { display: flex; align-items: center; gap: 12px; width: 220px; }
.divider-line { flex: 1; height: 1px; background: var(--border-gold); }
.divider-diamond { width: 8px; height: 8px; background: var(--gold); transform: rotate(45deg); }
.cover-contact { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.contact-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(245,230,184,.80); }
.contact-icon { font-size: 16px; }
.cover-ribbon { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(90deg, #0d0b07, #1a1508, #0d0b07); border-top: 1px solid var(--border-gold); padding: 12px 16px; text-align: center; font-size: 12px; letter-spacing: 5px; color: var(--gold); font-weight: 600; }

/* About */
.about-page { padding: 12mm 10mm 8mm; background: var(--dark); display: flex; flex-direction: column; }
.about-page-top-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt), var(--gold), var(--gold-dk)); }
.about-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8mm; padding-bottom: 5mm; border-bottom: 1px solid var(--border-gold); margin-top: 5mm; gap: 12px; }
.about-header-text { flex: 1; }
.section-label { font-size: 10px; letter-spacing: 4px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
.about-title { font-family: var(--font-head); font-size: 30px; color: var(--white); font-weight: 900; }
.about-body { display: flex; flex-direction: column; gap: 6mm; flex: 1; }
.about-intro-card { background: linear-gradient(135deg, #1a1508, #0f0d08); border: 1px solid var(--border-gold); border-radius: 14px; padding: 8mm 10mm; position: relative; overflow: hidden; }
.about-intro-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.about-quote-mark { font-family: var(--font-head); font-size: 60px; line-height: .7; color: var(--gold); opacity: .5; margin-bottom: -8px; }
.about-intro-text { font-size: 13px; line-height: 1.8; color: rgba(245,230,184,.88); direction: rtl; }
.about-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.about-card { background: var(--card-bg); border-radius: 12px; padding: 6mm; border: 1px solid var(--border-gold); border-left: 3px solid var(--gold); }
.about-card-icon { font-size: 22px; margin-bottom: 4px; }
.about-card-title { font-size: 15px; font-weight: 700; color: var(--gold); margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid var(--border-gold); direction: rtl; }
.about-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.about-list li { display: flex; gap: 6px; align-items: flex-start; font-size: 12px; color: var(--off-white); direction: rtl; }
.check { color: var(--gold); font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.about-stats { display: flex; background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border-gold); overflow: hidden; }
.stat-item { flex: 1; text-align: center; padding: 5mm 2mm; }
.stat-number { font-family: var(--font-head); font-size: 30px; font-weight: 900; color: var(--gold); }
.stat-label { font-size: 11px; color: var(--muted); font-weight: 500; margin-top: 2px; }
.stat-sep { width: 1px; background: var(--border-gold); margin: 10px 0; }

/* Category Cover */
.cat-cover-page { background: var(--black); display: flex; align-items: center; justify-content: center; }
.cat-cover-bg { position: absolute; inset: 0; background-image: radial-gradient(ellipse at 50% 50%, rgba(201,162,39,.15) 0%, transparent 65%), repeating-linear-gradient(60deg, transparent, transparent 70px, rgba(201,162,39,.02) 70px, rgba(201,162,39,.02) 71px); }
.cat-cover-content { position: relative; z-index: 2; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.cat-cover-icon { font-size: 80px; filter: drop-shadow(0 4px 16px rgba(201,162,39,.4)); }
.cat-cover-name { font-family: var(--font-head); font-size: 54px; font-weight: 900; color: var(--white); letter-spacing: -1px; }
.cat-cover-count { font-size: 14px; letter-spacing: 3px; color: var(--gold); font-weight: 600; }
.cat-cover-bar { width: 80px; height: 3px; background: linear-gradient(90deg, var(--gold-dk), var(--gold-lt), var(--gold-dk)); border-radius: 2px; }
.cat-cover-bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt), var(--gold), var(--gold-dk)); }

/* Product Pages */
.products-page { padding: 7mm 8mm 5mm; display: flex; flex-direction: column; background: var(--dark2); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4mm; padding-bottom: 3mm; border-bottom: 1px solid var(--border-gold); }
.page-header-left { display: flex; align-items: center; gap: 6px; }
.page-cat-icon { font-size: 20px; }
.page-cat-name { font-family: var(--font-head); font-size: 22px; font-weight: 700; color: var(--gold); }
.page-header-right { display: flex; align-items: center; gap: 8px; }
.page-num { font-size: 10px; color: var(--gold); font-weight: 500; letter-spacing: 1px; background: var(--card-bg); padding: 3px 8px; border-radius: 20px; border: 1px solid var(--border-gold); }
.page-footer-bar { margin-top: auto; padding-top: 3mm; height: 3px; background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt), var(--gold), var(--gold-dk)); border-radius: 2px; }

/* Normal Grid */
.products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; flex: 1; align-content: start; }
.product-card { background: var(--card-bg); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid var(--border-gold); break-inside: avoid; page-break-inside: avoid; }
.product-card::before { content: ''; display: block; height: 2px; background: linear-gradient(90deg, var(--gold-dk), var(--gold-lt), var(--gold-dk)); }
.product-img-wrap { width: 100%; height: 140px; background: linear-gradient(135deg, #0f0d08, #1a1508); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.product-img-wrap img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.img-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 12px; }
.product-info { padding: 6px 8px 8px; display: flex; flex-direction: column; flex: 1; gap: 4px; }
.product-name { font-size: 14px; font-weight: 700; color: var(--white); line-height: 1.3; text-align: center; word-break: break-word; }
.product-description { font-size: 12px; color: var(--muted); line-height: 1.5; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; }
.product-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 5px; border-top: 1px solid var(--border-gold); gap: 4px; flex-wrap: wrap; }
.product-price { font-size: 13px; font-weight: 700; color: var(--gold); font-family: var(--font-mono); }
.product-price-text { font-size: 10px; font-weight: 600; color: var(--gold); direction: rtl; }
.product-brand { font-size: 9px; font-weight: 600; letter-spacing: 1px; color: var(--gold); background: rgba(201,162,39,.1); padding: 2px 5px; border-radius: 4px; border: 1px solid var(--border-gold); }

/* Printer Layout */
.printers-list { display: flex; flex-direction: column; gap: 4mm; flex: 1; }
.printer-card { background: var(--card-bg); border-radius: 10px; border: 1px solid var(--border-gold); display: flex; overflow: hidden; break-inside: avoid; page-break-inside: avoid; position: relative; }
.printer-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold-dk), var(--gold-lt)); }
.printer-img-wrap { width: 160px; min-height: 130px; flex-shrink: 0; background: linear-gradient(135deg, #0f0d08, #1a1508); display: flex; align-items: center; justify-content: center; border-right: 1px solid var(--border-gold); }
.printer-img-wrap img { max-width: 150px; max-height: 120px; object-fit: contain; padding: 8px; }
.printer-info { padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
.printer-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2px; color: var(--black); background: var(--gold); padding: 2px 8px; border-radius: 4px; width: fit-content; }
.printer-name { font-size: 17px; font-weight: 700; color: var(--white); word-break: break-word; }
.printer-description { font-size: 12px; color: var(--muted); line-height: 1.6; flex: 1; word-break: break-word; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.printer-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px solid var(--border-gold); gap: 4px; flex-wrap: wrap; }
.printer-price { font-size: 15px; font-weight: 700; color: var(--gold); font-family: var(--font-mono); }
.printer-price-text { font-size: 10px; font-weight: 600; color: var(--gold); direction: rtl; }
.printer-brand { font-size: 10px; font-weight: 600; color: var(--gold); letter-spacing: 1px; background: rgba(201,162,39,.1); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-gold); }

@media print {
  body { background: black; }
  .page { width: 210mm; min-height: 297mm; margin: 0; page-break-after: always; break-after: page; }
  .product-card, .printer-card { break-inside: avoid; page-break-inside: avoid; }
  .search-trigger-btn, .search-overlay { display: none !important; }
}
@media screen {
  body { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .page { box-shadow: 0 8px 40px rgba(201,162,39,.15), 0 2px 8px rgba(0,0,0,.8); border-radius: 4px; }
}
`;

// ── Main Export ───────────────────────────────────────────────────────────────
export const generateCatalogHTML = (
  products,
  { showPrices = false, baseUrl = "" } = {},
) => {
  // Group by type
  const grouped = {};
  for (const p of products) {
    const type = p.type || "Other";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(p);
  }

  // Build all product index for search
  const allProducts = products.map((p) => ({
    id: p.id || p.fireId || "",
    name: p.name || "",
    type: p.type || "",
    description: p.description || "",
    brand: p.inspiredBy || p.brand || "",
    image: p.image ? `${baseUrl}${p.image}` : "",
  }));

  // Assemble sections
  const sections = [coverPage(baseUrl), aboutPage(products.length, baseUrl)];

  for (const cat of CATEGORY_ORDER) {
    if (!grouped[cat] || grouped[cat].length === 0) continue;
    sections.push(categoryCover(cat, grouped[cat].length));
    if (cat === "Printers") {
      sections.push(printerPages(grouped[cat], showPrices, baseUrl));
    } else {
      sections.push(
        normalCategoryPages(cat, grouped[cat], showPrices, baseUrl),
      );
    }
  }

  const bodyContent = sections.join("\n");

  const searchUI = `
  <button class="search-trigger-btn" onclick="openSearch()">🔍</button>
  <div id="searchOverlay" class="search-overlay">
    <div class="search-modal">
      <div class="search-header">
        <h3>🔍 Search Products</h3>
        <button class="search-close" onclick="closeSearch()">✕</button>
      </div>
      <div class="search-input-wrapper">
        <input type="text" id="searchInput" placeholder="Search by name, brand, or type..." autocomplete="off">
      </div>
      <div id="searchResults" class="search-results"></div>
    </div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AL 3ALAMIA Store — Product Catalog 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
${bodyContent}
${searchUI}
${searchScript(allProducts)}
</body>
</html>`;
};
