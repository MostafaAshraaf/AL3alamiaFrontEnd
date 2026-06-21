import { useState, useRef, useEffect } from "react";
import styles from "./quoteBuilder.module.css";
import { generateQuoteHTML, generateQuoteNumber } from "./quoteTemplate";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtEGP = (n) =>
  Number(n).toLocaleString("ar-EG", { minimumFractionDigits: 0 }) + " ج.م";

// AL3ALAMIA Store default info
const AL3ALAMIA_STORE = {
  name: "العالمية ستور",
  nameEn: "AL3ALAMIA Store",
  description: "توريد أحبار · طابعات · إكسسوارات كمبيوتر",
  address: "٣ ش جامعة الدول مول سفنكس ميدان سفنكس المهندسين الجيزة",
  phone: "01140030112 - 01114939714 - 01121301515",
};

// ── Sub-component: Price Picker Dialog ───────────────────────────────────────
const PricePicker = ({ product, onConfirm, onCancel }) => {
  const [mode, setMode] = useState("price"); // "price" | "supply" | "custom"
  const [customVal, setCustomVal] = useState("");
  const [displayName, setDisplayName] = useState(product.name || "");
  const [quantity, setQuantity] = useState(1);

  const priceMap = {
    price: product.price,
    supply: product.supply,
    custom: parseFloat(customVal) || 0,
  };

  const finalPrice = priceMap[mode];

  const handleConfirm = () => {
    if (mode === "custom" && !customVal) return;
    onConfirm({
      id: product.fireId || `manual-${Date.now()}`,
      originalName: product.name,
      displayName: displayName.trim() || product.name,
      quantity: Math.max(1, parseInt(quantity) || 1),
      quotedPrice: finalPrice,
      purchasePrice: product.code, // admin-only visibility
    });
  };

  return (
    <div className={styles.pickerBackdrop}>
      <div className={styles.pickerBox}>
        <div className={styles.pickerHeader}>
          <span className={styles.pickerTitle}>إضافة منتج للعرض</span>
          <button className={styles.pickerClose} onClick={onCancel}>
            ✕
          </button>
        </div>

        {/* Product name display */}
        <div className={styles.pickerProductName}>{product.name}</div>

        {/* Admin-only cost badge */}
        {product.code && (
          <div className={styles.costBadge}>
            سعر الشراء (للمسؤول فقط): <strong>{fmtEGP(product.code)}</strong>
          </div>
        )}

        {/* Display name override */}
        <div className={styles.pickerField}>
          <label className={styles.pickerLabel}>اسم المنتج في العرض</label>
          <div className={styles.nameFieldRow}>
            <input
              className={styles.pickerInput}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="اسم المنتج كما سيظهر في العرض"
            />
            {displayName !== product.name && (
              <button
                className={styles.resetBtn}
                onClick={() => setDisplayName(product.name)}
                title="إعادة الاسم الأصلي"
              >
                ↺
              </button>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className={styles.pickerField}>
          <label className={styles.pickerLabel}>الكمية</label>
          <input
            className={styles.pickerInput}
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Price options */}
        <div className={styles.pickerField}>
          <label className={styles.pickerLabel}>سعر البيع في العرض</label>
          <div className={styles.priceOptions}>
            <label
              className={`${styles.priceOption} ${mode === "price" ? styles.priceOptionActive : ""}`}
            >
              <input
                type="radio"
                name="pmode"
                value="price"
                checked={mode === "price"}
                onChange={() => setMode("price")}
              />
              <span className={styles.priceOptionLabel}>سعر المستخدم</span>
              <span className={styles.priceOptionVal}>
                {fmtEGP(product.price)}
              </span>
            </label>
            <label
              className={`${styles.priceOption} ${mode === "supply" ? styles.priceOptionActive : ""}`}
            >
              <input
                type="radio"
                name="pmode"
                value="supply"
                checked={mode === "supply"}
                onChange={() => setMode("supply")}
              />
              <span className={styles.priceOptionLabel}>سعر التوريد</span>
              <span className={styles.priceOptionVal}>
                {fmtEGP(product.supply)}
              </span>
            </label>
            <label
              className={`${styles.priceOption} ${mode === "custom" ? styles.priceOptionActive : ""}`}
            >
              <input
                type="radio"
                name="pmode"
                value="custom"
                checked={mode === "custom"}
                onChange={() => setMode("custom")}
              />
              <span className={styles.priceOptionLabel}>سعر مخصص</span>
              {mode === "custom" && (
                <input
                  className={styles.customPriceInput}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={customVal}
                  onChange={(e) => setCustomVal(e.target.value)}
                  autoFocus
                />
              )}
            </label>
          </div>
        </div>

        {/* Confirm */}
        <button
          className={styles.pickerConfirm}
          onClick={handleConfirm}
          disabled={mode === "custom" && !customVal}
        >
          ✚ إضافة للعرض
        </button>
      </div>
    </div>
  );
};

// ── Sub-component: Logo Uploader ──────────────────────────────────────────────
const LogoUploader = ({ onLogoChange, currentLogo }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onLogoChange(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onLogoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.logoUploader}>
      <div className={styles.logoPreview}>
        {currentLogo ? (
          <img
            src={currentLogo}
            alt="Company logo"
            className={styles.logoPreviewImg}
          />
        ) : (
          <div className={styles.logoPlaceholder}>📷</div>
        )}
      </div>
      <div className={styles.logoButtons}>
        <button
          type="button"
          className={styles.logoBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          {currentLogo ? "تغيير الشعار" : "رفع شعار"}
        </button>
        {currentLogo && (
          <button
            type="button"
            className={`${styles.logoBtn} ${styles.logoBtnRemove}`}
            onClick={handleRemove}
          >
            إزالة
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div className={styles.logoHint}>اختر شعار شركتك (يظهر في عرض السعر)</div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const QuoteBuilder = ({ products = [] }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1=sender+recipient, 2=products, 3=settings
  // Add these state variables in the main component (around line 100)
  const [showConditions, setShowConditions] = useState(true);
  const [showTax, setShowTax] = useState(true);
  // Company selection
  const [companyType, setCompanyType] = useState("alalamia"); // "alalamia" | "other"
  const [customLogo, setCustomLogo] = useState(null);
  // Settings

  // Individual conditions - ADD THESE
  const [conditions, setConditions] = useState({
    noDiscounts: true,
    priceValidity: true,
    deliveryTerms: true,
    tax: true,
  });
  // Sender
  const [sender, setSender] = useState({
    name: AL3ALAMIA_STORE.name,
    nameEn: AL3ALAMIA_STORE.nameEn,
    description: AL3ALAMIA_STORE.description,
    phone: AL3ALAMIA_STORE.phone,
    address: AL3ALAMIA_STORE.address,
  });

  // Recipient
  const [recipient, setRecipient] = useState({
    name: "",
    address: "",
    phone: "",
    managerName: "",
    managerPhone: "",
  });

  // Products in quote
  const [quoteItems, setQuoteItems] = useState([]);
  const [pickerProduct, setPickerProduct] = useState(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  // Manual product
  const [showManual, setShowManual] = useState(false);
  const [manualItem, setManualItem] = useState({
    name: "",
    price: "",
    quantity: 1,
  });

  // Settings
  const [validityDays, setValidityDays] = useState(7);

  // Quote number (generated once per open)
  const [quoteNumber, setQuoteNumber] = useState("");

  // Handle company type change
  const handleCompanyTypeChange = (type) => {
    setCompanyType(type);
    if (type === "alalamia") {
      setSender({
        name: AL3ALAMIA_STORE.name,
        nameEn: AL3ALAMIA_STORE.nameEn,
        description: AL3ALAMIA_STORE.description,
        phone: AL3ALAMIA_STORE.phone,
        address: AL3ALAMIA_STORE.address,
      });
      setCustomLogo("/logo.png");
    } else {
      setSender({
        name: "",
        nameEn: "",
        description: "",
        phone: "",
        address: "",
      });
    }
  };

  const handleOpen = () => {
    setQuoteNumber(generateQuoteNumber());
    setStep(1);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setCompanyType("alalamia");
    setCustomLogo(null);
    setSender({
      name: AL3ALAMIA_STORE.name,
      nameEn: AL3ALAMIA_STORE.nameEn,
      description: AL3ALAMIA_STORE.description,
      phone: AL3ALAMIA_STORE.phone,
      address: AL3ALAMIA_STORE.address,
    });
    setRecipient({
      name: "",
      address: "",
      phone: "",
      managerName: "",
      managerPhone: "",
    });
    setQuoteItems([]);
    setSearch("");
    setShowManual(false);
    setManualItem({ name: "", price: "", quantity: 1 });
    setValidityDays(7);
    // Reset conditions
    setConditions({
      noDiscounts: true,
      priceValidity: true,
      deliveryTerms: true,
      tax: true,
    });
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (pickerProduct) setPickerProduct(null);
        else handleClose();
      }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pickerProduct]);

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()),
  );

  const addItemFromPicker = (item) => {
    setQuoteItems((prev) => {
      const existing = prev.findIndex((i) => i.id === item.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = item;
        return updated;
      }
      return [...prev, item];
    });
    setPickerProduct(null);
  };

  const removeItem = (id) =>
    setQuoteItems((prev) => prev.filter((i) => i.id !== id));

  const updateItem = (id, field, value) => {
    setQuoteItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              [field]:
                field === "quantity"
                  ? Math.max(1, parseInt(value) || 1)
                  : value,
            }
          : i,
      ),
    );
  };

  const addManualItem = () => {
    if (!manualItem.name.trim() || !manualItem.price) return;
    setQuoteItems((prev) => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        originalName: manualItem.name.trim(),
        displayName: manualItem.name.trim(),
        quantity: Math.max(1, parseInt(manualItem.quantity) || 1),
        quotedPrice: parseFloat(manualItem.price),
        purchasePrice: null,
        isManual: true,
      },
    ]);
    setManualItem({ name: "", price: "", quantity: 1 });
    setShowManual(false);
  };

  const grandTotal = quoteItems.reduce(
    (s, i) => s + i.quotedPrice * i.quantity,
    0,
  );

  const handleGenerate = () => {
    if (!recipient.name.trim()) {
      alert("يرجى إدخال اسم الشركة المستلِمة");
      return;
    }
    if (quoteItems.length === 0) {
      alert("يرجى إضافة منتج واحد على الأقل");
      return;
    }

    const html = generateQuoteHTML({
      senderCompany: sender,
      recipientCompany: recipient,
      items: quoteItems,
      validityDays,
      quoteNumber,
      quoteDate: new Date().toISOString(),
      baseUrl: window.location.origin,
      customLogo: companyType === "other" ? customLogo : null,
      conditions: conditions, // Pass individual conditions
    });

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  // ── Step validation ──
  const step1Valid =
    recipient.name.trim().length > 0 &&
    (companyType === "alalamia" ||
      (companyType === "other" && sender.name.trim().length > 0));
  const step2Valid = quoteItems.length > 0;

  if (!open) {
    return (
      <button className={styles.triggerBtn} onClick={handleOpen}>
        📋 عرض سعر
      </button>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* ── Modal Header ── */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <span className={styles.modalIcon}>📋</span>
            <div>
              <div className={styles.modalTitle}>إنشاء عرض سعر</div>
              <div className={styles.modalSubtitle}>{quoteNumber}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* ── Step Tabs ── */}
        <div className={styles.stepTabs}>
          {[
            { n: 1, label: "بيانات الشركات" },
            { n: 2, label: "المنتجات" },
            { n: 3, label: "إعدادات وإصدار" },
          ].map(({ n, label }) => (
            <button
              key={n}
              className={`${styles.stepTab} ${step === n ? styles.stepTabActive : ""} ${step > n ? styles.stepTabDone : ""}`}
              onClick={() => {
                if (n === 2 && !step1Valid) return;
                if (n === 3 && (!step1Valid || !step2Valid)) return;
                setStep(n);
              }}
            >
              <span className={styles.stepNum}>{step > n ? "✓" : n}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ── Step 1: Company Info ── */}
        {step === 1 && (
          <div className={styles.stepContent}>
            {/* Company Selector */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                🏢 اختيار الشركة المُرسِلة
              </div>
              <div className={styles.companySelector}>
                <label
                  className={`${styles.companyOption} ${companyType === "alalamia" ? styles.companyOptionActive : ""}`}
                >
                  <input
                    type="radio"
                    name="companyType"
                    value="alalamia"
                    checked={companyType === "alalamia"}
                    onChange={() => handleCompanyTypeChange("alalamia")}
                  />
                  <div>
                    <div className={styles.companyOptionTitle}>
                      AL3ALAMIA Store
                    </div>
                    <div className={styles.companyOptionDesc}>
                      العالمية ستور (الإعدادات الافتراضية)
                    </div>
                  </div>
                </label>
                <label
                  className={`${styles.companyOption} ${companyType === "other" ? styles.companyOptionActive : ""}`}
                >
                  <input
                    type="radio"
                    name="companyType"
                    value="other"
                    checked={companyType === "other"}
                    onChange={() => handleCompanyTypeChange("other")}
                  />
                  <div>
                    <div className={styles.companyOptionTitle}>شركة أخرى</div>
                    <div className={styles.companyOptionDesc}>
                      إدخال بيانات وشعار مخصص
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Sender */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                🏢 بيانات شركتنا (المُرسِل)
                {companyType !== "alalamia" && (
                  <span className={styles.required}> *</span>
                )}
              </div>
              {companyType === "other" && (
                <>
                  <div className={styles.fieldGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>اسم الشركة *</label>
                      <input
                        className={styles.fieldInput}
                        value={sender.name}
                        onChange={(e) =>
                          setSender({ ...sender, name: e.target.value })
                        }
                        placeholder="مثال: العالمية للتقنية"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>
                        اسم الشركة (إنجليزي)
                      </label>
                      <input
                        className={styles.fieldInput}
                        value={sender.nameEn}
                        onChange={(e) =>
                          setSender({ ...sender, nameEn: e.target.value })
                        }
                        placeholder="Company Name"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>رقم التليفون</label>
                      <input
                        className={styles.fieldInput}
                        value={sender.phone}
                        onChange={(e) =>
                          setSender({ ...sender, phone: e.target.value })
                        }
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                  </div>
                  <LogoUploader
                    onLogoChange={setCustomLogo}
                    currentLogo={customLogo}
                  />
                </>
              )}
              {companyType === "alalamia" && (
                <div className={styles.alalamiaInfo}>
                  <div className={styles.alalamiaName}>
                    {AL3ALAMIA_STORE.name}
                  </div>
                  <div className={styles.alalamiaDesc}>
                    {AL3ALAMIA_STORE.description}
                  </div>
                  <div className={styles.alalamiaContact}>
                    <span>📞 {AL3ALAMIA_STORE.phone}</span>
                    <span>📍 {AL3ALAMIA_STORE.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recipient */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                🏭 بيانات الشركة المستلِمة{" "}
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.fieldGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>اسم الشركة *</label>
                  <input
                    className={styles.fieldInput}
                    value={recipient.name}
                    onChange={(e) =>
                      setRecipient({ ...recipient, name: e.target.value })
                    }
                    placeholder="اسم الشركة المستلِمة"
                  />
                </div>
              </div>
            </div>

            <div className={styles.stepFooter}>
              <button
                className={styles.nextBtn}
                onClick={() => setStep(2)}
                disabled={!step1Valid}
              >
                التالي: إضافة المنتجات ←
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Products ── */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.productsLayout}>
              {/* Left: Search & Add */}
              <div className={styles.searchPanel}>
                <div className={styles.sectionTitle}>🔍 بحث عن منتج</div>
                <input
                  ref={searchRef}
                  className={styles.searchInput}
                  placeholder="ابحث بالاسم أو البراند..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <div className={styles.searchResults}>
                  {search.trim() === "" && (
                    <div className={styles.searchHint}>
                      اكتب للبحث في {products.length} منتج
                    </div>
                  )}
                  {search.trim() !== "" && filteredProducts.length === 0 && (
                    <div className={styles.searchHint}>لا توجد نتائج</div>
                  )}
                  {filteredProducts.slice(0, 15).map((p) => {
                    const alreadyAdded = quoteItems.some(
                      (i) => i.id === p.fireId,
                    );
                    return (
                      <div
                        key={p.fireId}
                        className={`${styles.searchResultItem} ${alreadyAdded ? styles.searchResultAdded : ""}`}
                        onClick={() => !alreadyAdded && setPickerProduct(p)}
                      >
                        <div className={styles.resultName}>{p.name}</div>
                        <div className={styles.resultMeta}>
                          {p.brand} · {fmtEGP(p.price)}
                        </div>
                        {alreadyAdded && (
                          <span className={styles.addedBadge}>✓ مضاف</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Manual product */}
                <div className={styles.manualSection}>
                  <button
                    className={styles.manualToggle}
                    onClick={() => setShowManual(!showManual)}
                  >
                    {showManual
                      ? "▲ إخفاء"
                      : "＋ إضافة منتج غير موجود في القاعدة"}
                  </button>
                  {showManual && (
                    <div className={styles.manualForm}>
                      <input
                        className={styles.fieldInput}
                        placeholder="اسم المنتج *"
                        value={manualItem.name}
                        onChange={(e) =>
                          setManualItem({ ...manualItem, name: e.target.value })
                        }
                      />
                      <div className={styles.manualRow}>
                        <input
                          className={styles.fieldInput}
                          type="number"
                          placeholder="السعر *"
                          min="0"
                          value={manualItem.price}
                          onChange={(e) =>
                            setManualItem({
                              ...manualItem,
                              price: e.target.value,
                            })
                          }
                        />
                        <input
                          className={styles.fieldInput}
                          type="number"
                          placeholder="الكمية"
                          min="1"
                          value={manualItem.quantity}
                          onChange={(e) =>
                            setManualItem({
                              ...manualItem,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        className={styles.manualAddBtn}
                        onClick={addManualItem}
                        disabled={!manualItem.name.trim() || !manualItem.price}
                      >
                        ✚ إضافة
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Quote items list */}
              <div className={styles.quoteList}>
                <div className={styles.sectionTitle}>
                  🧾 منتجات العرض
                  {quoteItems.length > 0 && (
                    <span className={styles.itemCount}>
                      {quoteItems.length} صنف
                    </span>
                  )}
                </div>
                {quoteItems.length === 0 ? (
                  <div className={styles.emptyList}>لم تُضَف منتجات بعد</div>
                ) : (
                  <div className={styles.quoteItems}>
                    {quoteItems.map((item) => (
                      <div key={item.id} className={styles.quoteItem}>
                        <div className={styles.quoteItemHeader}>
                          <span className={styles.quoteItemName}>
                            {item.displayName}
                          </span>
                          {item.displayName !== item.originalName && (
                            <span
                              className={styles.renamedBadge}
                              title={`الأصلي: ${item.originalName}`}
                            >
                              ✎
                            </span>
                          )}
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.id)}
                          >
                            ✕
                          </button>
                        </div>
                        {item.purchasePrice && (
                          <div className={styles.costHint}>
                            سعر الشراء: {fmtEGP(item.purchasePrice)}
                          </div>
                        )}
                        <div className={styles.quoteItemControls}>
                          <div className={styles.controlGroup}>
                            <label>الكمية</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(item.id, "quantity", e.target.value)
                              }
                              className={styles.inlineInput}
                            />
                          </div>
                          <div className={styles.controlGroup}>
                            <label>السعر</label>
                            <input
                              type="number"
                              min="0"
                              value={item.quotedPrice}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quotedPrice",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className={styles.inlineInput}
                            />
                          </div>
                          <div className={styles.controlGroup}>
                            <label>الإجمالي</label>
                            <span className={styles.itemTotal}>
                              {fmtEGP(item.quotedPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                        {/* Display name edit */}
                        <div className={styles.displayNameRow}>
                          <label>الاسم في العرض</label>
                          <div className={styles.nameFieldRow}>
                            <input
                              className={styles.inlineNameInput}
                              value={item.displayName}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "displayName",
                                  e.target.value,
                                )
                              }
                            />
                            {item.displayName !== item.originalName && (
                              <button
                                className={styles.resetBtn}
                                onClick={() =>
                                  updateItem(
                                    item.id,
                                    "displayName",
                                    item.originalName,
                                  )
                                }
                                title="إعادة الاسم الأصلي"
                              >
                                ↺
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {quoteItems.length > 0 && (
                  <div className={styles.grandTotalBar}>
                    <span>الإجمالي الكلي</span>
                    <span className={styles.grandTotalVal}>
                      {fmtEGP(grandTotal)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.stepFooter}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>
                → السابق
              </button>
              <button
                className={styles.nextBtn}
                onClick={() => setStep(3)}
                disabled={!step2Valid}
              >
                التالي: إعدادات العرض ←
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Settings & Generate ── */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>⚙️ إعدادات العرض</div>
              <div className={styles.fieldGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>رقم العرض</label>
                  <div className={styles.quoteNumRow}>
                    <input
                      className={`${styles.fieldInput} ${styles.monoInput}`}
                      value={quoteNumber}
                      readOnly
                    />
                    <button
                      className={styles.regenBtn}
                      onClick={() => setQuoteNumber(generateQuoteNumber())}
                      title="توليد رقم جديد"
                    >
                      ⟳
                    </button>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    صلاحية العرض (بالأيام)
                  </label>
                  <input
                    className={styles.fieldInput}
                    type="number"
                    min="1"
                    value={validityDays}
                    onChange={(e) =>
                      setValidityDays(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                  />
                </div>
              </div>

              {/* Toggle options */}
              <div
                className={styles.sectionTitle}
                style={{ marginTop: "20px" }}
              >
                📋 خيارات العرض
              </div>

              {/* Individual Conditions - Clean version */}
              <div className={styles.checkboxGrid}>
                <div className={styles.fieldGroupCheckbox}>
                  <input
                    type="checkbox"
                    id="condNoDiscounts"
                    checked={conditions.noDiscounts}
                    onChange={(e) =>
                      setConditions({
                        ...conditions,
                        noDiscounts: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="condNoDiscounts">
                    لا تشمل الخصومات (1% أو 8%)
                  </label>
                </div>

                <div className={styles.fieldGroupCheckbox}>
                  <input
                    type="checkbox"
                    id="condPriceValidity"
                    checked={conditions.priceValidity}
                    onChange={(e) =>
                      setConditions({
                        ...conditions,
                        priceValidity: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="condPriceValidity">
                    الأسعار قابلة للتغيير بعد انتهاء الصلاحية
                  </label>
                </div>

                <div className={styles.fieldGroupCheckbox}>
                  <input
                    type="checkbox"
                    id="condDeliveryTerms"
                    checked={conditions.deliveryTerms}
                    onChange={(e) =>
                      setConditions({
                        ...conditions,
                        deliveryTerms: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="condDeliveryTerms">
                    التسليم بعد الاتفاق على الدفع والكميات
                  </label>
                </div>

                <div className={styles.fieldGroupCheckbox}>
                  <input
                    type="checkbox"
                    id="condTax"
                    checked={conditions.tax}
                    onChange={(e) =>
                      setConditions({ ...conditions, tax: e.target.checked })
                    }
                  />
                  <label htmlFor="condTax">عرض الفاتورة الضريبية (14%)</label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className={styles.summaryBox}>
              <div className={styles.summaryTitle}>ملخص العرض</div>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>مقدم من</span>
                  <span>
                    {companyType === "alalamia"
                      ? AL3ALAMIA_STORE.name
                      : sender.name || "—"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>مقدم إلى</span>
                  <span>{recipient.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>عدد الأصناف</span>
                  <span>{quoteItems.length} صنف</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>إجمالي الكميات</span>
                  <span>
                    {quoteItems.reduce((s, i) => s + i.quantity, 0)} قطعة
                  </span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>الإجمالي الكلي</span>
                  <span>{fmtEGP(grandTotal)}</span>
                </div>
                {conditions.tax && (
                  <>
                    <div className={styles.summaryRow}>
                      <span>الفاتورة الضريبية (14%)</span>
                      <span>{fmtEGP(grandTotal * 0.14)}</span>
                    </div>
                    <div
                      className={`${styles.summaryRow} ${styles.summaryTotal}`}
                    >
                      <span>الإجمالي بعد الضريبة</span>
                      <span>{fmtEGP(grandTotal + grandTotal * 0.14)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.stepFooter}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>
                → السابق
              </button>
              <button className={styles.generateBtn} onClick={handleGenerate}>
                🖨️ إنشاء وفتح العرض
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Price Picker Dialog ── */}
      {pickerProduct && (
        <PricePicker
          product={pickerProduct}
          onConfirm={addItemFromPicker}
          onCancel={() => setPickerProduct(null)}
        />
      )}
    </div>
  );
};

export default QuoteBuilder;
