import { useState } from "react";
import { generateCatalogHTML } from "./catalogTemplate";
import styles from "./catalogGenerator.module.css";

/**
 * CatalogGenerator
 * Props:
 *   products — the products array already loaded in MarketManage (pass filteredProducts or products)
 */
const CatalogGenerator = ({ products = [] }) => {
  const [showPrices, setShowPrices] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!products.length) return;
    setIsGenerating(true);

    // Small timeout so the button state renders before the heavy work
    setTimeout(() => {
      try {
        const html = generateCatalogHTML(products, {
          showPrices,
          baseUrl: window.location.origin, // automatically gives localhost:5173 or your domain
        });
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, "_blank");

        // Revoke the object URL after the tab has loaded to free memory
        if (newTab) {
          newTab.addEventListener("load", () => URL.revokeObjectURL(url), {
            once: true,
          });
        }
      } catch (err) {
        console.error("Catalog generation error:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  };

  return (
    <div className={styles.wrapper}>
      {/* Price toggle */}
      <label className={styles.toggle}>
        <span className={styles.toggleLabel}>Show Prices</span>
        <div
          className={`${styles.toggleTrack} ${showPrices ? styles.toggleOn : ""}`}
          onClick={() => setShowPrices((prev) => !prev)}
          role="switch"
          aria-checked={showPrices}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowPrices((p) => !p)}
        >
          <div className={styles.toggleThumb} />
        </div>
        <span className={styles.toggleHint}>
          {showPrices ? "Prices visible" : "متوفر والسعر يحدد على حسب الكمية"}
        </span>
      </label>

      {/* Generate button */}
      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={isGenerating || products.length === 0}
        title={
          products.length === 0
            ? "No products loaded"
            : "Open catalog in new tab"
        }
      >
        {isGenerating ? (
          <>
            <span className={styles.spinner} />
            Building…
          </>
        ) : (
          <>
            <span className={styles.btnIcon}>📄</span>
            Create Catalog
          </>
        )}
      </button>

      {products.length === 0 && (
        <span className={styles.hint}>No products loaded yet.</span>
      )}
    </div>
  );
};

export default CatalogGenerator;
