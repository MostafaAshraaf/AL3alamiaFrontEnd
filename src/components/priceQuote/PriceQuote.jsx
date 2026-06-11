import { useState } from "react";
import { useProducts } from "../../redux/products/productsApis";
import styles from "./priceQuote.module.css";

// Brand accent colors matching the original Python script
const BRAND_COLORS = {
  hp: "#0057A8",
  samsung: "#1428A0",
  canon: "#CC0000",
  lexmark: "#6B1FA1",
  brother: "#005BAB",
  kyocera: "#D4122C",
  toshiba: "#555555",
  ricoh: "#B8470B",
  sharp: "#007A8A",
  xerox: "#C08000",
  epson: "#3C76AF",
  konica: "#6A3C96",
  oki: "#2E7D32",
  pantum: "#5D4037",
};

const getBrandColor = (brand) => {
  if (!brand) return "#444444";
  const b = brand.toLowerCase();
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (b.includes(key)) return color;
  }
  return "#444444";
};

// Extract page count from Arabic description
// Looks for text between "يدعم حتى" and "صفحة"
const extractPages = (description) => {
  if (!description) return "";
  const match = description.match(/يدعم حتى\s*([\d,،]+)\s*صفحة/);
  return match ? match[1].replace(/،/g, ",") : "";
};

// Product types included in the price quote
const QUOTE_TYPES = ["Cartridges", "Drums", "Inks", "Chips"];

// Arabic labels for each type
const TYPE_LABELS = {
  Cartridges: "حبارات",
  Drums: "درام",
  Inks: "حبر",
  Chips: "شيبات",
};

/**
 * Groups an array of products by their `inspiredBy` field.
 * Returns an array of { brand, color, rows } objects.
 */
const groupByBrand = (products) => {
  const map = {};
  for (const p of products) {
    const brand = p.inspiredBy || "Other";
    if (!map[brand]) map[brand] = [];
    map[brand].push(p);
  }
  return Object.entries(map).map(([brand, rows]) => ({
    brand,
    color: getBrandColor(brand),
    rows,
  }));
};

// ─── HTML generation ──────────────────────────────────────────────────────────

const buildCSS = () => `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&family=Tajawal:wght@400;500;700&display=swap');
  :root{--gold:#C9A84C;--gold-light:#F0D080;--gold-dark:#8B6914;--black:#0A0A0A;--dark:#1A1A1A;--mid:#2C2C2C;--text:#E8E0D0;--text-muted:#9A8E78}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--black);color:var(--text);font-family:'Cairo','Tajawal',sans-serif;min-height:100vh;direction:rtl}
  .bg-pattern{position:fixed;inset:0;background:radial-gradient(ellipse at 20% 20%,rgba(201,168,76,.06) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(201,168,76,.04) 0%,transparent 50%);pointer-events:none;z-index:0}
  .container{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:2rem 1.5rem 4rem}
  .header{display:flex;align-items:center;flex-wrap:wrap;gap:.4rem;padding-bottom:1.5rem;margin-bottom:1.5rem;border-bottom:1px solid rgba(201,168,76,.3)}
  .logo-wrapper{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .logo-img{height:90px;background:#fff;border:0;padding:4px}
  .logo-area{display:flex;flex-direction:column}
  .logo-name{font-size:26px;font-weight:900;letter-spacing:2px;background:linear-gradient(135deg,var(--gold-light),var(--gold),var(--gold-dark));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .logo-ar{font-size:13px;color:var(--text-muted);margin-top:4px;font-weight:500}
  .logo-tagline{font-size:10px;color:var(--gold-dark);margin-top:5px;letter-spacing:1px;text-transform:uppercase}
  .contact-block{margin-right:auto;text-align:left;font-size:12px;color:var(--text-muted);line-height:2.1;padding:8px 16px;border-radius:28px}
  .contact-block a{color:var(--gold);text-decoration:none;font-weight:600;font-size:13px;display:block}
  .quote-badge{width:100%;text-align:center;font-size:18px;font-weight:800;color:var(--gold);letter-spacing:1px;border:1px solid rgba(201,168,76,.3);border-radius:10px;padding:10px;margin-bottom:1.5rem;background:rgba(201,168,76,.05)}
  .tab-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:1.5rem}
  .tab-btn{padding:6px 18px;border-radius:20px;border:1px solid rgba(201,168,76,.25);background:transparent;font-size:12px;cursor:pointer;color:var(--text-muted);font-family:inherit;transition:all .2s}
  .tab-btn:hover{border-color:var(--gold);color:var(--gold)}
  .tab-btn.active{background:var(--gold);border-color:var(--gold);color:var(--black);font-weight:700}
  .print-btn{margin-right:auto;padding:6px 18px;border-radius:8px;border:1px solid rgba(201,168,76,.4);background:rgba(201,168,76,.1);color:var(--gold);font-family:inherit;font-size:12px;cursor:pointer;font-weight:600;transition:all .2s}
  .print-btn:hover{background:var(--gold);color:var(--black)}
  .table-group{display:none}
  .table-group.active{display:block}
  .section{margin-bottom:1.2rem;border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,.12)}
  .section-header{display:flex;align-items:center;gap:10px;padding:10px 18px;font-size:15px;font-weight:700;color:#fff;letter-spacing:.5px}
  .brand-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.6);flex-shrink:0}
  .brand-count{margin-right:auto;font-size:11px;font-weight:500;background:rgba(255,255,255,.15);padding:2px 10px;border-radius:20px}
  table{width:100%;border-collapse:collapse;background:var(--dark)}
  thead tr{background:rgba(201,168,76,.08)}
  th{padding:9px 14px;font-size:11px;font-weight:700;color:var(--text-muted);text-align:right;letter-spacing:.8px;border-bottom:1px solid rgba(201,168,76,.15)}
  td{padding:9px 14px;font-size:13px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--text)}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover{background:rgba(201,168,76,.04)}
  .td-price{font-weight:700;font-size:14px;color:#6FCF97;letter-spacing:.3px}
  .td-price::after{content:' ج.م';font-size:9px;font-weight:400;color:var(--gold-dark)}
  .footer{margin-top:2rem;padding:1.2rem 1.5rem;background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.2);border-radius:12px;font-size:13px;color:var(--text-muted);line-height:2.1}
  .footer-title{color:var(--gold);font-weight:700;margin-bottom:.7rem;font-size:14px}
  .footer ul{padding-right:1.2rem}
  .empty-type{padding:2rem;text-align:center;color:var(--text-muted);font-size:14px;background:var(--dark);border-radius:12px;border:1px solid rgba(201,168,76,.1)}
  @media print{
    body{background:#fff;color:#111}
    .bg-pattern,.tab-bar,.print-btn{display:none!important}
    .container{padding:1rem}
    table{background:#fff}
    th{color:#555}
    td{color:#222;border-bottom:1px solid #ddd}
    .section{border:1px solid #ddd}
    .td-price{color:#2a7a00}
    .td-price::after{color:#666}
    .footer{background:#f9f7f2;border-color:#ddd}
    .table-group{display:block!important}
    .quote-badge{border:1px solid #ddd;color:#8B6914;background:#fffbf0}
  }
  @media(max-width:650px){
    .header{flex-direction:column;align-items:flex-start}
    .contact-block{text-align:right;width:100%}
  }
`;

const buildSectionsHTML = (sections, priceKey, showPages) => {
  if (!sections.length) {
    return `<div class="empty-type">لا توجد منتجات في هذه الفئة</div>`;
  }

  return sections
    .filter((s) => s.rows.length > 0)
    .map((sec) => {
      const rows = sec.rows
        .map((r) => {
          const pages = extractPages(r.description);
          const price = r[priceKey] ?? "";
          const pagesCell = showPages
            ? `<td>${pages}</td>`
            : "";
          return `<tr>
            <td>${r.name || ""}</td>
            ${pagesCell}
            <td class="td-price">${price}</td>
          </tr>`;
        })
        .join("");

      const pagesHeader = showPages
        ? `<th style="width:25%">عدد الصفحات</th>`
        : "";
      const nameWidth = showPages ? "45%" : "70%";

      return `
        <div class="section">
          <div class="section-header" style="background:${sec.color}">
            <div class="brand-dot"></div>
            ${sec.brand}
            <span class="brand-count">${sec.rows.length} منتج</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:${nameWidth}">اسم المنتج / الموديل</th>
                ${pagesHeader}
                <th style="width:30%">السعر</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    })
    .join("");
};

const buildFullHTML = ({ tablesByType, priceKey, title, subtitle, logoUrl }) => {
  const tabs = QUOTE_TYPES.map((type, i) => {
    const label = TYPE_LABELS[type] || type;
    return `<button class="tab-btn ${i === 0 ? "active" : ""}" onclick="showTab('${type}',this)">${label}</button>`;
  }).join("");

  const groups = QUOTE_TYPES.map((type, i) => {
    const sections = tablesByType[type] || [];
    // Only show pages column for types that have page counts (Cartridges, Chips, Drums)
    const showPages = type !== "Inks";
    const html = buildSectionsHTML(sections, priceKey, showPages);
    return `<div class="table-group ${i === 0 ? "active" : ""}" id="tab-${type}">${html}</div>`;
  }).join("");

  const logoTag = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" class="logo-img" />`
    : "";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — العالمية ستور</title>
<style>${buildCSS()}</style>
</head>
<body>
<div class="bg-pattern"></div>
<div class="container">
  <div class="header">
    <div class="logo-wrapper">
      <div style="background:#fff;border-radius:8px;padding:4px">${logoTag}</div>
      <div class="logo-area">
        <div class="logo-name">AL 3ALAMIA STORE</div>
        <div class="logo-ar">العالمية ستور | توريد أحبار · طابعات · إكسسوارات كمبيوتر</div>
        <div class="logo-tagline">⛭ supplies &amp; printing solutions ⛭</div>
      </div>
    </div>
    <div class="contact-block">
      <span>📍 مول سفنكس، المهندسين، الجيزة</span>
      <a href="tel:01140030112">📞 01140030112</a>
      <a href="tel:01121301515">📞 01121301515</a>
      <a href="tel:01114939714">📞 01114939714</a>
    </div>
  </div>

  <div class="quote-badge">
    ${title} &nbsp;|&nbsp;
    <span style="font-size:14px;font-weight:500;color:var(--text-muted)">${subtitle}</span>
  </div>

  <div class="tab-bar">
    <span style="font-size:11px;color:var(--text-muted);margin-left:6px">📂 الفئة:</span>
    ${tabs}
    <button class="print-btn" onclick="window.print()">🖨 طباعة العرض</button>
  </div>

  ${groups}

  <div class="footer">
    <div class="footer-title">◆ ملاحظات وشروط العرض</div>
    <ul>
      <li>الأسعار بالجنيه المصري ولا تشمل ضريبة القيمة المضافة</li>
      <li>الأسعار لا تشمل تكلفة التوصيل</li>
      <li>العرض ساري لمدة 7 أيام من تاريخ الإصدار</li>
      <li>جميع المنتجات متوافقة (Compatible) ما لم يُذكر خلاف ذلك</li>
      <li>يُرجى التواصل للاستفسار عن الكميات والخصومات الخاصة</li>
      <li>التسليم فوري من المخزون للمنتجات المتاحة</li>
    </ul>
  </div>
</div>

<script>
function showTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.table-group').forEach(g => g.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
}
</script>
</body>
</html>`;
};

// ─── React Component ──────────────────────────────────────────────────────────

const PriceQuote = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const [priceType, setPriceType] = useState("user"); // "user" | "supply"

  const handleGenerate = () => {
    // Filter only the 4 relevant types
    const relevant = products.filter((p) => QUOTE_TYPES.includes(p.type));

    // Build a map: { Cartridges: [{brand, color, rows}], Drums: [...], ... }
    const tablesByType = {};
    for (const type of QUOTE_TYPES) {
      const typeProducts = relevant.filter((p) => p.type === type);
      tablesByType[type] = groupByBrand(typeProducts);
    }

    const isUser = priceType === "user";
    const priceKey = isUser ? "price" : "supply";
    const title = isUser ? "💼 عرض أسعار اليوزر" : "🏭 عرض أسعار التوريد المبدئي";
    const subtitle = isUser
      ? "السعر المقترح للمستخدم النهائي"
      : "سعر التوريد المبدئي";

    // Use absolute URL for logo from public folder
    const logoUrl = `${window.location.origin}/logo.png`;

    const html = buildFullHTML({ tablesByType, priceKey, title, subtitle, logoUrl });

    // Open in new tab
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const tab = window.open(url, "_blank");

    // Clean up blob URL after tab loads
    if (tab) {
      tab.addEventListener("load", () => URL.revokeObjectURL(url), {
        once: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.loadingText}>جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.errorText}>خطأ في تحميل البيانات: {error.message}</span>
      </div>
    );
  }

  // Count relevant products for the summary badge
  const relevantCount = products.filter((p) =>
    QUOTE_TYPES.includes(p.type)
  ).length;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>📋</span>
          <div>
            <h2 className={styles.title}>توليد عرض الأسعار</h2>
            <p className={styles.subtitle}>
              {relevantCount} منتج جاهز للعرض (حبارات · شيبات · درام · حبر)
            </p>
          </div>
        </div>
      </div>

      {/* Price type selector */}
      <div className={styles.selectorRow}>
        <span className={styles.selectorLabel}>نوع السعر:</span>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${priceType === "user" ? styles.toggleActive : ""}`}
            onClick={() => setPriceType("user")}
          >
            💼 سعر اليوزر
          </button>
          <button
            className={`${styles.toggleBtn} ${priceType === "supply" ? styles.toggleActive : ""}`}
            onClick={() => setPriceType("supply")}
          >
            🏭 سعر التوريد
          </button>
        </div>
      </div>

      {/* Type breakdown */}
      <div className={styles.breakdown}>
        {QUOTE_TYPES.map((type) => {
          const count = products.filter((p) => p.type === type).length;
          return (
            <div key={type} className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>{TYPE_LABELS[type]}</span>
              <span className={styles.breakdownCount}>{count} منتج</span>
            </div>
          );
        })}
      </div>

      {/* Generate button */}
      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={relevantCount === 0}
      >
        <span>🖨</span>
        توليد عرض الأسعار — فتح في تبويب جديد
      </button>

      {relevantCount === 0 && (
        <p className={styles.emptyNote}>
          لا توجد منتجات من فئة الحبارات أو الشيبات أو الدرام أو الحبر في قاعدة البيانات.
        </p>
      )}
    </div>
  );
};

export default PriceQuote;