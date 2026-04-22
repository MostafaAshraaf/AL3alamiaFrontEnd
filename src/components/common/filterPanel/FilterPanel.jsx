import styles from "./FilterPanel.module.css";

const FilterPanel = ({
  mainCategory,
  setMainCategory,
  accessoryType,
  setAccessoryType,
  printerBrand,
  setPrinterBrand,
  printerType,
  setPrinterType,
  searchTerm,
  setSearchTerm,
  resetFilters,
  options,
  resultCount,
  isOptionDisabled,
}) => {
  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <h3>Filters</h3>
        <button className={styles.resetBtn} onClick={resetFilters}>
          Reset All
        </button>
      </div>

      {/* Search */}
      <div className={styles.filterGroup}>
        <label>Search</label>
        <input
          type="text"
          placeholder="Product name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Category */}
      <div className={styles.filterGroup}>
        <label>Category</label>
        <div className={styles.buttonGroup}>
          {["all", "accessories", "printers-inks"].map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${
                mainCategory === cat ? styles.active : ""
              } ${isOptionDisabled("main", cat) ? styles.disabled : ""}`}
              onClick={() => setMainCategory(cat)}
              disabled={isOptionDisabled("main", cat)}
            >
              {cat === "all"
                ? "All Products"
                : cat === "accessories"
                ? "Accessories"
                : "Printers & Inks"}
            </button>
          ))}
        </div>
      </div>

      {/* Accessory sub‑categories */}
      {mainCategory === "accessories" && (
        <div className={styles.filterGroup}>
          <label>Accessory Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.filterBtn} ${
                accessoryType === "all" ? styles.active : ""
              }`}
              onClick={() => setAccessoryType("all")}
            >
              All
            </button>
            {options.accessoryTypes.map((type) => (
              <button
                key={type}
                className={`${styles.filterBtn} ${
                  accessoryType === type ? styles.active : ""
                } ${
                  isOptionDisabled("accessoryType", type) ? styles.disabled : ""
                }`}
                onClick={() => setAccessoryType(type)}
                disabled={isOptionDisabled("accessoryType", type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Printers & Inks filters */}
      {mainCategory === "printers-inks" && (
        <>
          <div className={styles.filterGroup}>
            <label>Brand</label>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.filterBtn} ${
                  printerBrand === "all" ? styles.active : ""
                }`}
                onClick={() => setPrinterBrand("all")}
              >
                All Brands
              </button>
              {options.brands.map((brand) => (
                <button
                  key={brand}
                  className={`${styles.filterBtn} ${
                    printerBrand === brand ? styles.active : ""
                  } ${
                    isOptionDisabled("printerBrand", brand)
                      ? styles.disabled
                      : ""
                  }`}
                  onClick={() => setPrinterBrand(brand)}
                  disabled={isOptionDisabled("printerBrand", brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Product Type</label>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.filterBtn} ${
                  printerType === "all" ? styles.active : ""
                }`}
                onClick={() => setPrinterType("all")}
              >
                All Types
              </button>
              {options.printerTypes.map((type) => (
                <button
                  key={type}
                  className={`${styles.filterBtn} ${
                    printerType === type ? styles.active : ""
                  } ${
                    isOptionDisabled("printerType", type) ? styles.disabled : ""
                  }`}
                  onClick={() => setPrinterType(type)}
                  disabled={isOptionDisabled("printerType", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Active filters summary */}
      {(mainCategory !== "all" ||
        accessoryType !== "all" ||
        printerBrand !== "all" ||
        printerType !== "all") && (
        <div className={styles.activeFilters}>
          <span>Active filters:</span>
          {mainCategory !== "all" && (
            <span className={styles.badge}>
              {mainCategory === "accessories" ? "Accessories" : "Printers & Inks"}
              <button onClick={() => setMainCategory("all")}>✕</button>
            </span>
          )}
          {mainCategory === "accessories" && accessoryType !== "all" && (
            <span className={styles.badge}>
              {accessoryType}
              <button onClick={() => setAccessoryType("all")}>✕</button>
            </span>
          )}
          {mainCategory === "printers-inks" && printerBrand !== "all" && (
            <span className={styles.badge}>
              {printerBrand}
              <button onClick={() => setPrinterBrand("all")}>✕</button>
            </span>
          )}
          {mainCategory === "printers-inks" && printerType !== "all" && (
            <span className={styles.badge}>
              {printerType}
              <button onClick={() => setPrinterType("all")}>✕</button>
            </span>
          )}
        </div>
      )}

      <div className={styles.resultCount}>
        <strong>{resultCount}</strong> product{resultCount !== 1 ? "s" : ""} found
      </div>
    </div>
  );
};

export default FilterPanel;