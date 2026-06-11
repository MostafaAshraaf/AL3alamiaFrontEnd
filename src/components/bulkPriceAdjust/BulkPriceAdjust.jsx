import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase/config";
import { useQueryClient } from "@tanstack/react-query";
import { successMessage } from "../../redux/toasts";
import styles from "./bulkPriceAdjust.module.css";

// Price fields the admin can adjust
const PRICE_FIELDS = [
  { key: "price",  label: "User Price",     color: "#6FCF97" },
  { key: "code",   label: "Purchase Price", color: "#56CCF2" },
  { key: "supply", label: "Supply Price",   color: "#F2994A" },
];

/**
 * Applies adjustment to a single numeric value.
 * mode: "percent" | "fixed"
 * direction: "increase" | "decrease"
 */
const applyAdjustment = (original, value, mode, direction) => {
  if (!original && original !== 0) return original; // keep undefined/null as-is
  const delta =
    mode === "percent"
      ? Math.round((original * value) / 100)
      : Math.round(value);
  const result = direction === "increase" ? original + delta : original - delta;
  return Math.max(0, result); // never go below 0
};

const BulkPriceAdjust = ({ products, onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  // Which price fields to adjust
  const [selectedFields, setSelectedFields] = useState({
    price: true,
    code: false,
    supply: false,
  });

  // Adjustment config
  const [mode, setMode]           = useState("percent"); // "percent" | "fixed"
  const [direction, setDirection] = useState("increase"); // "increase" | "decrease"
  const [value, setValue]         = useState("");

  // Filter by product type (optional)
  const [filterType, setFilterType] = useState("all");

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview]     = useState(null); // null | array of preview rows

  // Unique types in the products list
  const availableTypes = ["all", ...new Set(products.map((p) => p.type).filter(Boolean))];

  const getTargetProducts = () =>
    filterType === "all"
      ? products
      : products.filter((p) => p.type === filterType);

  const activeFields = PRICE_FIELDS.filter((f) => selectedFields[f.key]);

  const toggleField = (key) =>
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));

  // Build preview rows
  const handlePreview = () => {
    const numVal = parseFloat(value);
    if (!numVal || numVal <= 0) return;

    const targets = getTargetProducts();
    const rows = targets.slice(0, 8).map((p) => {
      const changes = {};
      for (const f of activeFields) {
        const orig = p[f.key];
        if (orig !== undefined) {
          changes[f.key] = {
            before: orig,
            after: applyAdjustment(orig, numVal, mode, direction),
          };
        }
      }
      return { name: p.name, changes };
    });

    setPreview({ rows, total: targets.length });
  };

  // Commit to Firebase
  const handleApply = async () => {
    const numVal = parseFloat(value);
    if (!numVal || numVal <= 0 || activeFields.length === 0) return;

    const targets = getTargetProducts();
    if (!window.confirm(`Apply price changes to ${targets.length} products?`)) return;

    setIsLoading(true);
    try {
      // Batch update: one update call per product
      const promises = targets.map((product) => {
        const updates = {};
        for (const f of activeFields) {
          const orig = product[f.key];
          if (orig !== undefined) {
            updates[f.key] = applyAdjustment(orig, numVal, mode, direction);
          }
        }
        updates.updatedAt = new Date().toISOString();
        return update(ref(database, `products/${product.fireId}`), updates);
      });

      await Promise.all(promises);
      queryClient.invalidateQueries(["products"]);
      successMessage(`✅ Updated prices for ${targets.length} products`);
      onSuccess?.();
    } catch (err) {
      console.error("Bulk update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const numVal = parseFloat(value);
  const isValid = numVal > 0 && activeFields.length > 0;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.headerIcon}>📊</span>
            <div>
              <h2 className={styles.title}>Bulk Price Adjustment</h2>
              <p className={styles.subtitle}>{products.length} products in database</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>

          {/* Step 1 — Select fields */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>1 · Price fields to adjust</label>
            <div className={styles.fieldToggles}>
              {PRICE_FIELDS.map((f) => (
                <button
                  key={f.key}
                  className={`${styles.fieldToggle} ${selectedFields[f.key] ? styles.fieldToggleActive : ""}`}
                  style={selectedFields[f.key] ? { borderColor: f.color, color: f.color } : {}}
                  onClick={() => toggleField(f.key)}
                >
                  {f.label}
                  <span className={styles.fieldKey}>({f.key})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — Direction + Mode */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>2 · Direction &amp; mode</label>
            <div className={styles.row}>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleBtn} ${direction === "increase" ? styles.toggleIncrease : ""}`}
                  onClick={() => setDirection("increase")}
                >
                  ▲ Increase
                </button>
                <button
                  className={`${styles.toggleBtn} ${direction === "decrease" ? styles.toggleDecrease : ""}`}
                  onClick={() => setDirection("decrease")}
                >
                  ▼ Decrease
                </button>
              </div>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleBtn} ${mode === "percent" ? styles.toggleActive : ""}`}
                  onClick={() => setMode("percent")}
                >
                  % Percent
                </button>
                <button
                  className={`${styles.toggleBtn} ${mode === "fixed" ? styles.toggleActive : ""}`}
                  onClick={() => setMode("fixed")}
                >
                  # Fixed Amount
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 — Value */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              3 · {direction === "increase" ? "Increase" : "Decrease"} by
            </label>
            <div className={styles.inputRow}>
              <input
                type="number"
                min="0"
                step={mode === "percent" ? "0.1" : "1"}
                placeholder={mode === "percent" ? "e.g. 10" : "e.g. 50"}
                value={value}
                onChange={(e) => { setValue(e.target.value); setPreview(null); }}
                className={styles.valueInput}
              />
              <span className={styles.valueSuffix}>
                {mode === "percent" ? "%" : "ج.م"}
              </span>
            </div>
          </div>

          {/* Step 4 — Filter by type (optional) */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>4 · Filter by type (optional)</label>
            <select
              className={styles.typeSelect}
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPreview(null); }}
            >
              {availableTypes.map((t) => (
                <option key={t} value={t}>{t === "all" ? "All types" : t}</option>
              ))}
            </select>
            <span className={styles.typeCount}>
              {getTargetProducts().length} products affected
            </span>
          </div>

          {/* Preview */}
          {isValid && (
            <button className={styles.previewBtn} onClick={handlePreview}>
              👁 Preview changes
            </button>
          )}

          {preview && (
            <div className={styles.preview}>
              <p className={styles.previewTitle}>
                Preview — showing {preview.rows.length} of {preview.total} products
              </p>
              <div className={styles.previewTable}>
                <div className={styles.previewHeader}>
                  <span>Product</span>
                  {activeFields.map((f) => (
                    <span key={f.key} style={{ color: f.color }}>{f.label}</span>
                  ))}
                </div>
                {preview.rows.map((row, i) => (
                  <div key={i} className={styles.previewRow}>
                    <span className={styles.previewName}>{row.name}</span>
                    {activeFields.map((f) => {
                      const change = row.changes[f.key];
                      return change ? (
                        <span key={f.key} className={styles.previewChange}>
                          <s className={styles.before}>{change.before}</s>
                          <span className={styles.arrow}>→</span>
                          <strong className={styles.after} style={{ color: f.color }}>
                            {change.after}
                          </strong>
                        </span>
                      ) : (
                        <span key={f.key} className={styles.noChange}>—</span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={!isValid || isLoading}
          >
            {isLoading
              ? "Updating..."
              : `Apply to ${getTargetProducts().length} products`}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BulkPriceAdjust;