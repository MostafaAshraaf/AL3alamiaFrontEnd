// quoteTemplate.js
// Generates a printable Arabic RTL price quote HTML string

const fmtPrice = (price) =>
  Number(price).toLocaleString("ar-EG") + " ج.م";

const fmtDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --black: #0a0a0a; --dark: #111111; --dark2: #1a1a1a; --dark3: #222222;
  --gold: #c9a227; --gold-lt: #e0bc55; --gold-dk: #a07d1c; --gold-pale: #f5e6b8;
  --white: #ffffff; --off-white: #f5f0e8; --muted: #8a7a5a;
  --border: #2e2a22; --border-gold: rgba(201,162,39,0.35);
  --card-bg: #161410;
  --font-head: 'Playfair Display', Georgia, serif;
  --font-body: 'Tajawal', 'Segoe UI', sans-serif;
  --font-mono: 'DM Mono', 'Courier New', monospace;
}
html { -webkit-text-size-adjust: 100%; }
body { font-family: var(--font-body); background: #050505; color: var(--off-white); direction: rtl; }

@page { size: A4; margin: 0; }
.page { width: 210mm; min-height: 297mm; background: var(--dark); position: relative; overflow: hidden; page-break-after: always; break-after: page; display: flex; flex-direction: column; }

/* Top bar */
.top-bar { height: 5px; background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt), var(--gold), var(--gold-dk)); flex-shrink: 0; }

/* Header */
.quote-header { padding: 8mm 10mm 6mm; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-gold); flex-shrink: 0; }
.header-logo { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.header-logo img { height: 70px; width: auto; max-width: 180px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(201,162,39,.3)); }
.header-logo .no-logo { width: 70px; height: 70px; background: rgba(201,162,39,0.08); border: 1px dashed var(--border-gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 24px; }
.header-company { text-align: right; }
.company-name { font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 4px; }
.company-description { font-size: 10px; color: var(--muted); margin-bottom: 6px; }
.company-detail { font-size: 11px; color: var(--muted); line-height: 1.7; }

.header-quote-info { text-align: left; direction: ltr; }
.quote-title-ar { font-size: 28px; font-weight: 900; color: var(--white); direction: rtl; text-align: right; font-family: var(--font-body); margin-bottom: 6px; }
.quote-badge { display: inline-flex; flex-direction: column; align-items: flex-end; gap: 3px; background: var(--card-bg); border: 1px solid var(--border-gold); border-radius: 8px; padding: 8px 12px; direction: rtl; }
.quote-badge-row { display: flex; gap: 8px; align-items: center; font-size: 11px; }
.badge-label { color: var(--muted); }
.badge-value { color: var(--gold); font-weight: 700; font-family: var(--font-mono); }

/* Recipient */
.recipient-section { padding: 5mm 10mm; border-bottom: 1px solid var(--border-gold); flex-shrink: 0; }
.section-eyebrow { font-size: 10px; letter-spacing: 3px; color: var(--gold); font-weight: 700; margin-bottom: 6px; }
.recipient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.recipient-card { background: var(--card-bg); border: 1px solid var(--border-gold); border-radius: 8px; padding: 5px 10px; }
.recipient-card-label { font-size: 10px; color: var(--muted); margin-bottom: 2px; }
.recipient-card-value { font-size: 13px; font-weight: 600; color: var(--white); }

/* Products table */
.products-section { padding: 5mm 10mm; flex: 1; }
.products-table { width: 100%; border-collapse: collapse; }
.products-table thead tr { background: linear-gradient(90deg, #1a1508, #0f0d08); border-bottom: 2px solid var(--gold); }
.products-table th { padding: 8px 10px; font-size: 11px; font-weight: 700; color: var(--gold); text-align: right; letter-spacing: 0.5px; white-space: nowrap; }
.products-table td { padding: 7px 10px; font-size: 12px; color: var(--off-white); border-bottom: 1px solid var(--border); text-align: right; vertical-align: middle; }
.products-table tbody tr:nth-child(even) { background: rgba(201,162,39,.03); }
.products-table tbody tr:hover { background: rgba(201,162,39,.06); }
.td-num { color: var(--muted); font-size: 11px; font-family: var(--font-mono); text-align: center; }
.td-name { font-weight: 600; color: var(--white); }
.td-qty { text-align: center; font-family: var(--font-mono); color: var(--gold-lt); }
.td-price { font-family: var(--font-mono); color: var(--gold); font-weight: 600; white-space: nowrap; }
.td-total { font-family: var(--font-mono); color: var(--white); font-weight: 700; white-space: nowrap; }

/* Totals */
.totals-section { padding: 4mm 10mm; border-top: 1px solid var(--border-gold); flex-shrink: 0; }
.totals-wrap { display: flex; justify-content: flex-start; }
.totals-box { background: var(--card-bg); border: 1px solid var(--border-gold); border-radius: 10px; overflow: hidden; min-width: 220px; }
.totals-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 14px; border-bottom: 1px solid var(--border); gap: 24px; }
.totals-row:last-child { border-bottom: none; }
.totals-row.grand { background: linear-gradient(90deg, #1a1508, #0f0d08); }
.totals-label { font-size: 12px; color: var(--muted); white-space: nowrap; }
.totals-value { font-size: 13px; font-weight: 700; color: var(--gold); font-family: var(--font-mono); white-space: nowrap; }
.totals-row.grand .totals-label { color: var(--off-white); font-weight: 700; font-size: 13px; }
.totals-row.grand .totals-value { color: var(--gold-lt); font-size: 15px; }

/* Validity */
.validity-section { padding: 3mm 10mm; flex-shrink: 0; }
.validity-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,162,39,.08); border: 1px solid var(--border-gold); border-radius: 20px; padding: 5px 14px; font-size: 11px; color: var(--muted); }
.validity-pill strong { color: var(--gold); }

/* Terms */
.terms-section { padding: 4mm 10mm; border-top: 1px solid var(--border); flex-shrink: 0; }
.terms-title { font-size: 11px; font-weight: 700; color: var(--gold); margin-bottom: 5px; letter-spacing: 1px; }
.terms-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.terms-list li { font-size: 10px; color: var(--muted); line-height: 1.6; display: flex; gap: 6px; align-items: flex-start; }
.terms-list li::before { content: '◆'; color: var(--gold-dk); font-size: 8px; margin-top: 3px; flex-shrink: 0; }

/* Footer */
.quote-footer { padding: 4mm 10mm 5mm; border-top: 1px solid var(--border-gold); display: flex; justify-content: space-between; align-items: flex-end; flex-shrink: 0; }
.footer-sig { text-align: center; }
.footer-sig-line { width: 120px; height: 1px; background: var(--border-gold); margin: 0 auto 4px; }
.footer-sig-label { font-size: 10px; color: var(--muted); }
.footer-brand { font-size: 10px; color: var(--muted); text-align: left; direction: ltr; }
.footer-brand span { color: var(--gold); font-weight: 700; }

/* Bottom bar */
.bottom-bar { height: 4px; background: linear-gradient(90deg, var(--gold-dk), var(--gold), var(--gold-lt), var(--gold), var(--gold-dk)); flex-shrink: 0; margin-top: auto; }

@media print {
  body { background: black; }
  .page { width: 210mm; min-height: 297mm; margin: 0; }
}
@media screen {
  body { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .page { box-shadow: 0 8px 40px rgba(201,162,39,.15), 0 2px 8px rgba(0,0,0,.8); border-radius: 4px; }
}
`;

// ── Main Export ───────────────────────────────────────────────────────────────
export const generateQuoteHTML = ({
  senderCompany,
  recipientCompany,
  items,
  validityDays,
  quoteNumber,
  quoteDate,
  baseUrl = "",
  customLogo = null,
}) => {
  const logoSrc = customLogo || `${baseUrl}/logo.png`;

  // Format sender display
  const senderDisplayName = senderCompany.nameEn 
    ? `${senderCompany.name} (${senderCompany.nameEn})` 
    : senderCompany.name;
  
  const senderDescription = senderCompany.description || "";

  // ── Totals ──
  const grandTotal = items.reduce(
    (sum, item) => sum + item.quotedPrice * item.quantity,
    0
  );

  // ── Products table rows ──
  const tableRows = items
    .map(
      (item, idx) => `
    <tr>
      <td class="td-num">${idx + 1}</td>
      <td class="td-name">${item.displayName}</td>
      <td class="td-qty">${item.quantity}</td>
      <td class="td-price">${fmtPrice(item.quotedPrice)}</td>
      <td class="td-total">${fmtPrice(item.quotedPrice * item.quantity)}</td>
    </tr>`
    )
    .join("");

  // ── Recipient grid ──
  const recipientFields = [
    { label: "اسم الشركة", value: recipientCompany.name },
    { label: "العنوان", value: recipientCompany.address },
    { label: "رقم التليفون", value: recipientCompany.phone },
    { label: "مسؤول المشتريات", value: recipientCompany.managerName },
    { label: "تليفون المسؤول", value: recipientCompany.managerPhone },
  ]
    .filter((f) => f.value)
    .map(
      (f) => `
    <div class="recipient-card">
      <div class="recipient-card-label">${f.label}</div>
      <div class="recipient-card-value">${f.value}</div>
    </div>`
    )
    .join("");

  // Logo HTML
  const logoHtml = customLogo 
    ? `<img src="${customLogo}" alt="${senderCompany.name}">`
    : `<div class="no-logo">🏢</div>`;

  // Sender details HTML
  const senderDetailsHtml = `
    <div class="company-name">${senderDisplayName}</div>
    ${senderDescription ? `<div class="company-description">${senderDescription}</div>` : ''}
    <div class="company-detail">
      ${senderCompany.phone ? `📞 ${senderCompany.phone}<br>` : ""}
      ${senderCompany.address ? `📍 ${senderCompany.address}` : ""}
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عرض سعر رقم ${quoteNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Playfair+Display:wght@700;900&family=DM+Mono&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
<div class="page">
  <div class="top-bar"></div>

  <!-- Header -->
  <div class="quote-header">
    <div class="header-quote-info">
      <div class="quote-title-ar">عرض سعر</div>
      <div class="quote-badge">
        <div class="quote-badge-row">
          <span class="badge-label">رقم العرض</span>
          <span class="badge-value">${quoteNumber}</span>
        </div>
        <div class="quote-badge-row">
          <span class="badge-label">التاريخ</span>
          <span class="badge-value">${fmtDate(quoteDate)}</span>
        </div>
        <div class="quote-badge-row">
          <span class="badge-label">صالح لمدة</span>
          <span class="badge-value">${validityDays} يوم</span>
        </div>
      </div>
    </div>
    <div class="header-logo">
      ${logoHtml}
      <div class="header-company">
        ${senderDetailsHtml}
      </div>
    </div>
  </div>

  <!-- Recipient -->
  <div class="recipient-section">
    <div class="section-eyebrow">السادة / مقدم إليه</div>
    <div class="recipient-grid">${recipientFields}</div>
  </div>

  <!-- Products -->
  <div class="products-section">
    <table class="products-table">
      <thead>
        <tr>
          <th style="text-align:center;width:32px">#</th>
          <th>اسم المنتج</th>
          <th style="text-align:center;width:50px">الكمية</th>
          <th style="width:110px">سعر الوحدة</th>
          <th style="width:120px">الإجمالي</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>

  <!-- Totals -->
  <div class="totals-section">
    <div class="totals-wrap">
      <div class="totals-box">
        <div class="totals-row">
          <span class="totals-label">عدد الأصناف</span>
          <span class="totals-value">${items.length} صنف</span>
        </div>
        <div class="totals-row">
          <span class="totals-label">إجمالي الكميات</span>
          <span class="totals-value">${items.reduce((s, i) => s + i.quantity, 0)} قطعة</span>
        </div>
        <div class="totals-row grand">
          <span class="totals-label">الإجمالي الكلي</span>
          <span class="totals-value">${fmtPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Validity -->
  <div class="validity-section">
    <div class="validity-pill">
      ⏳ &nbsp; هذا العرض صالح لمدة <strong>${validityDays} يوم</strong> من تاريخ الإصدار
    </div>
  </div>

  <!-- Terms -->
  <div class="terms-section">
    <div class="terms-title">الشروط والأحكام</div>
    <ul class="terms-list">
      <li>الأسعار الواردة في هذا العرض لا تشمل الفاتورة الضريبية، وسيتم إضافة الضريبة عند الطلب.</li>
      <li>الأسعار بالجنيه المصري وقابلة للتغيير دون إشعار مسبق بعد انتهاء مدة صلاحية العرض.</li>
      <li>يُرجى الإشارة إلى رقم عرض السعر عند تأكيد الطلب.</li>
      <li>يتم التسليم بعد الاتفاق على طريقة الدفع والكميات المطلوبة.</li>
    </ul>
  </div>

  <!-- Footer -->
  <div class="quote-footer">
    <div class="footer-sig">
      <div class="footer-sig-line"></div>
      <div class="footer-sig-label">التوقيع والختم</div>
    </div>
    <div class="footer-brand">
      <span>${senderCompany.nameEn || senderCompany.name}</span> &nbsp;·&nbsp; ${new Date().getFullYear()}
    </div>
  </div>

  <div class="bottom-bar"></div>
</div>
</body>
</html>`;
};

// ── Quote number generator ────────────────────────────────────────────────────
export const generateQuoteNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `QT-${year}-${rand}`;
};
