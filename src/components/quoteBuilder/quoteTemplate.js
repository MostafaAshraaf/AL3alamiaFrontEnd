// quoteTemplate.js
// Generates a printable Arabic RTL price quote HTML string

const fmtPrice = (price) => Number(price).toLocaleString("ar-EG") + " ج.م";

const fmtDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Escapes free-text user input before inserting into HTML (custom terms, etc.)
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
/*! 
     * Light Print-Friendly Quote Template
     * خلفية بيضاء / فاتحة ، مصممة للطباعة بوضوح واقتصاد في الحبر
     */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      /* لوحة ألوان فاتحة ونظيفة */
      --white: #ffffff;
      --paper: #fefef7;
      --off-white: #fafaf5;
      --gray-50: #f9f9f8;
      --gray-100: #f0f0ea;
      --gray-200: #e4e4dc;
      --gray-300: #cbcbc1;
      --gray-600: #6b6b5e;
      --gray-700: #4a4a40;
      --gray-800: #2e2e28;
      --gray-900: #1c1c18;
      
      --gold: #b8860b;
      --gold-light: #e6c87a;
      --gold-soft: #f7e9cd;
      --gold-pale: #fef5e6;
      --gold-border: #dbb45c;
      
      --accent-green: #2c6e2f;
      --accent-blue: #2c5f8a;
      
      --font-head: 'Playfair Display', Georgia, serif;
      --font-body: 'Tajawal', 'Segoe UI', sans-serif;
      --font-mono: 'DM Mono', 'Courier New', monospace;
    }

    body {
      font-family: var(--font-body);
      background: #e2e2da;
      color: var(--gray-800);
      direction: rtl;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    @page {
      size: A4;
      margin: 1.2cm;
    }

.page {
  width: 210mm;
  min-height: 100vh; /* Changed from 297mm to allow growth */
  background: var(--white);
  background-image: linear-gradient(to bottom, var(--paper), var(--white));
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: visible; /* Changed from hidden */
  page-break-after: avoid;
  break-after: page;
  display: flex;
  flex-direction: column;
}

    /* Bars with soft warm gold */
    .top-bar {
      height: 6px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light), #d7aa4a, var(--gold));
      flex-shrink: 0;
    }
    .bottom-bar {
      height: 6px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light), #d7aa4a, var(--gold));
      flex-shrink: 0;
      margin-top: auto;
    }

    /* Header */
    .quote-header {
      padding: 2mm 7mm 2mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--gold-soft);
      flex-wrap: wrap;
      gap: 12px;
      background: var(--white);
    }

    .header-logo {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    .header-logo img {
      height: 70px;
      width: auto;
      max-width: 180px;
      object-fit: contain;
      filter: drop-shadow(0 2px 5px rgba(0,0,0,0.05));
    }
    .no-logo {
      width: 70px;
      height: 70px;
      background: var(--gold-pale);
      border: 1px solid var(--gold-border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold);
      font-size: 30px;
    }
    .header-company {
      text-align: right;
    }
    .company-name {
      font-size: 18px;
      font-weight: 800;
      color: var(--gray-900);
      margin-bottom: 4px;
      letter-spacing: -0.2px;
    }
    .company-description {
      font-size: 14px;
      color: var(--gray-600);
      margin-bottom: 6px;
    }
    .company-detail {
      font-size: 14px;
      color: var(--gray-700);
      line-height: 1.6;
    }

    .header-quote-info {
      text-align: left;
      direction: ltr;
    }
    .quote-title-ar {
      font-size: 28px;
      font-weight: 900;
      color: var(--gray-900);
      font-family: var(--font-head);
      direction: rtl;
      text-align: right;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }
    .quote-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
      background: var(--gold-pale);
      border: 1px solid var(--gold-border);
      border-radius: 18px;
      padding: 10px 16px;
      direction: rtl;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .quote-badge-row {
      display: flex;
      gap: 12px;
      align-items: baseline;
      font-size: 16px;
    }
    .badge-label {
      color: var(--gray-600);
      font-weight: 500;
    }
    .badge-value {
      color: var(--gold);
      font-weight: 800;
      font-family: var(--font-mono);
    }

    /* Recipient */
    .recipient-section {
      padding: 3mm 3mm;
      border-bottom: 1px solid var(--gray-200);
      background: var(--white);
      display: flex;
      // align-items: center;
      gap: 20px;
    }
    .section-eyebrow {
      font-size: 18px;
      letter-spacing: 2px;
      color: var(--gold);
      font-weight: 900;
      // margin-bottom: 8px;
      text-transform: uppercase;
    }
    .recipient-grid {
      display: flex;
      gap: 10px;
      font-size: 18px;
      font-weight: 900;
    }

    /* Products table - clean & light */
    .products-section {
      padding: 2mm 12mm;
      flex: 1;
      background: var(--white);
    }
    .products-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 18px;
    }
    .products-table thead tr {
      background: var(--gray-100);
      border-bottom: 2px solid var(--gold-light);
    }
    .products-table th {
      padding: 10px 10px;
      font-size: 14px;
      font-weight: 800;
      color: var(--gray-800);
      text-align: right;
      letter-spacing: 0.3px;
    }
    .products-table td {
      padding: 9px 10px;
      font-size: 16px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
      text-align: right;
      vertical-align: middle;
    }
    .products-table tbody tr:nth-child(even) {
      background-color: var(--gray-50);
    }
    .products-table tbody tr:hover {
      background-color: var(--gold-pale);
    }
    .td-num {
      color: var(--gray-500);
      font-size: 11px;
      font-family: var(--font-mono);
      text-align: center;
    }
    .td-name {
      font-weight: 700;
      color: var(--gray-800);
    }
    .td-desc {
      font-weight: 400;
      font-size: 13px;
      color: var(--gray-600);
      margin-top: 3px;
      line-height: 1.5;
      unicode-bidi: plaintext;
      white-space: pre-wrap;
    }
    .td-qty {
      text-align: center;
      font-family: var(--font-mono);
      color: var(--accent-green);
      font-weight: 600;
    }
    .td-price, .td-total {
      font-family: var(--font-mono);
      font-weight: 600;
      white-space: nowrap;
    }
    .td-price {
      color: var(--gold);
    }
    .td-total {
      color: var(--gray-800);
      font-weight: 700;
    }

    /* Totals */
    .totals-section {
      padding: 5mm 12mm;
      border-top: 1px solid var(--gray-200);
      background: var(--white);
    }
    .totals-wrap {
      display: flex;
      justify-content: flex-start;
    }
    .totals-box {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 20px;
      overflow: hidden;
      min-width: 260px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 18px;
      border-bottom: 1px solid var(--gray-200);
      gap: 32px;
    }
    .totals-row:last-child {
      border-bottom: none;
    }
    .totals-row.grand {
      background: var(--gold-pale);
    }
    .totals-label {
      font-size: 12px;
      color: var(--gray-700);
      font-weight: 500;
    }
    .totals-value {
      font-size: 13px;
      font-weight: 700;
      color: var(--gold);
      font-family: var(--font-mono);
    }
    .totals-row.grand .totals-label {
      color: var(--gray-800);
      font-weight: 800;
    }
    .totals-row.grand .totals-value {
      color: var(--accent-blue);
      font-size: 15px;
    }

    /* Validity pill */
    .validity-section {
      padding: 4mm 12mm;
      background: var(--white);
    }
    .validity-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--gold-pale);
      border: 1px solid var(--gold-border);
      border-radius: 40px;
      padding: 6px 18px;
      font-size: 12px;
      color: var(--gray-700);
    }
    .validity-pill strong {
      color: var(--gold);
      font-weight: 800;
    }

    /* Terms */
    .terms-section {
      padding: 5mm 12mm;
      border-top: 1px solid var(--gray-200);
      background: var(--white);
    }
    .terms-title {
      font-size: 12px;
      font-weight: 800;
      color: var(--gray-800);
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .terms-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .terms-list li {
      font-size: 14px;
      color: var(--gray-900);
      line-height: 1.55;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .terms-list li::before {
      content: '✦';
      color: var(--gold);
      font-size: 9px;
      margin-top: 2px;
    }

    /* Footer */
    .quote-footer {
      padding: 5mm 12mm 6mm;
      border-top: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      background: var(--white);
    }
    .footer-sig {
      text-align: center;
    }
    .footer-sig-line {
      width: 130px;
      height: 1px;
      background: var(--gray-300);
      margin: 0 auto 5px;
    }
    .footer-sig-label {
      font-size: 16px;
      color: var(--gray-600);
    }
    .footer-brand {
      font-size: 16px;
      color: var(--gray-600);
      text-align: left;
      direction: ltr;
    }
    .footer-brand span {
      color: var(--gold);
      font-weight: 800;
    }

@media print {
  body {
    background: white;
    padding: 0;
    margin: 0;
  }
  
  .page {
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    width: 100%;
    min-height: 0; /* Reset for print */
    overflow: visible;
    break-after: page; /* Force page break after each .page */
    page-break-after: always;
  }
  
  /* Ensure table breaks properly across pages */
  .products-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .products-table thead {
    display: table-header-group; /* Ensures header repeats on each page */
  }
  
  .products-table tbody tr {
    page-break-inside: avoid; /* Prevents rows from splitting across pages */
  }
  
  .products-table tbody tr:last-child {
    page-break-after: auto;
  }
  
  .products-table tbody tr:hover {
    background-color: transparent;
  }
  
  .totals-box, .quote-badge {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  /* Prevent page breaks inside key sections */
  .recipient-section,
  .totals-section,
  .terms-section,
  .validity-section,
  .quote-footer {
    page-break-inside: avoid;
  }
  
  /* Let products section grow and break naturally */
  .products-section {
    page-break-inside: auto;
  }
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
  conditions = {
    noVatInvoice: true,
    noDiscounts: true,
    priceValidity: true,
    cashPayment: true,
  },
  showTax = true,
  showTotals = true, // ADD THIS - defaults to true for backward compatibility
  customTerms = [],
}) => {
  const logoSrc = customLogo || `/logo.png`;

  // Format sender display
  const senderDisplayName = senderCompany.nameEn
    ? `${senderCompany.name}`
    : senderCompany.name;

  const senderDescription = senderCompany.description || "";

  // ── Totals ──
  const grandTotal = items.reduce(
    (sum, item) => sum + item.quotedPrice * item.quantity,
    0,
  );

  // ── Products table rows with page break hints ──
  const tableRows = items
    .map((item, idx) => {
      const showDesc =
        item.showDescription && item.description && item.description.trim();
      const descHtml = showDesc
        ? `<div class="td-desc">${escapeHtml(item.description.trim()).replace(/\n/g, "<br>")}</div>`
        : "";

      // Add page break after every 15 rows to prevent orphaned rows
      const pageBreak =
        idx > 0 && idx % 15 === 0
          ? ' style="page-break-before: always; break-before: page;"'
          : "";

      return `
    <tr${pageBreak}>
      <td class="td-num">${idx + 1}</td>
      <td class="td-name">${escapeHtml(item.displayName)}${descHtml}</td>
      <td class="td-qty">${item.quantity}</td>
      <td class="td-price">${fmtPrice(item.quotedPrice)}</td>
      <td class="td-total">${fmtPrice(item.quotedPrice * item.quantity)}</td>
    </tr>`;
    })
    .join("");

  // ── Tax rows (conditional based on the showTax switch) ──
  const taxRows = showTax
    ? `
    <div class="totals-row grand">
      <span class="totals-label">الفاتورة الضريبية 14%</span>
      <span class="totals-value">${fmtPrice(grandTotal * 0.14)}</span>
    </div>
    <div class="totals-row grand">
      <span class="totals-label">الإجمالي بعد الفاتورة الضريبية 14%</span>
      <span class="totals-value">${fmtPrice(grandTotal + grandTotal * 0.14)}</span>
    </div>
  `
    : "";

  // ── Build conditions list based on selected items ──
  const conditionItems = [];

  if (conditions.noVatInvoice) {
    conditionItems.push("الأسعار لا تشمل فاتورة الضريبة.");
  }
  if (conditions.noDiscounts) {
    conditionItems.push("الأسعار لا تشمل أي خصومات مثل 1% أو 8%.");
  }
  if (conditions.priceValidity) {
    conditionItems.push(
      "الأسعار بالجنيه المصري وقابلة للتغيير دون إشعار مسبق بعد انتهاء مدة صلاحية العرض.",
    );
  }
  if (conditions.cashPayment) {
    conditionItems.push("يجب دفع أول معاملة نقدًا.");
  }

  // Append any additional free-text terms entered for this specific offer
  customTerms.forEach((term) => {
    if (term && term.trim()) conditionItems.push(term.trim());
  });

  const conditionsSection =
    conditionItems.length > 0
      ? `
    <!-- Terms -->
    <div class="terms-section">
      <div class="terms-title">الشروط والأحكام</div>
      <ul class="terms-list">
        ${conditionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `
      : "";

  // ── Totals section (conditional based on showTotals) ──
  const totalsSection = showTotals
    ? `
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
        ${taxRows}
      </div>
    </div>
  </div>
  `
    : "";

  // ── Recipient grid ──
  const recipientFields = [
    { label: "شركة", value: recipientCompany.name },
  ]
    .filter((f) => f.value)
    .map(
      (f) => `
    <div class="recipient-card">
      <div class="recipient-card-label">${f.label}</div>
      <div class="recipient-card-value">${f.value}</div>
    </div>`,
    )
    .join("");

  // Logo HTML
  const logoHtml = logoSrc
    ? `<img src="${logoSrc}" alt="${senderCompany.name}">`
    : `<div class="no-logo">🏢</div>`;

  // Sender details HTML
  const senderDetailsHtml = `
    <div class="company-name">${senderDisplayName}</div>
    ${senderDescription ? `<div class="company-description">${senderDescription}</div>` : ""}
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
    <div class="section-eyebrow">السادة / مقدم إليه : </div>
    <div class="recipient-grid">${recipientCompany.name}</div>
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

  ${totalsSection}
  ${conditionsSection}

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
