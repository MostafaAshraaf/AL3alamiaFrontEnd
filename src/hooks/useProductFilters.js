import { useMemo, useState } from "react";

// Helper: get unique values from array
const unique = (arr) => [...new Set(arr)];

export const useProductFilters = (products = []) => {
  // Filter state
  const [mainCategory, setMainCategory] = useState("all");
  const [accessoryType, setAccessoryType] = useState("all");
  const [printerBrand, setPrinterBrand] = useState("all");
  const [printerType, setPrinterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Reset dependent filters when main category changes
  const setMainCategoryWithReset = (value) => {
    setMainCategory(value);
    if (value !== "accessories") setAccessoryType("all");
    if (value !== "printers-inks") {
      setPrinterBrand("all");
      setPrinterType("all");
    }
  };

  // Available options for each level (computed from current products)
  const options = useMemo(() => {
    // First, apply search filter to get base product set
    let baseProducts = products;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      baseProducts = baseProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.inspiredBy?.toLowerCase().includes(term)
      );
    }

    // Accessory types (from products with type in accessory list)
    const accessoryTypes = [
      "Mouse",
      "Keyboard",
      "Mouse Pad",
      "Game Pad",
      "cables",
      "Speakers",
    ];
    const availableAccessoryTypes = unique(
      baseProducts
        .filter((p) => accessoryTypes.includes(p.type))
        .map((p) => p.type)
    );

    // Printers & Inks related
    const printerInksProducts = baseProducts.filter((p) =>
      ["Printers", "Cartridges", "Inks"].includes(p.type)
    );

    // Brands from inspiredBy field
    const availableBrands = unique(
      printerInksProducts.map((p) => p.inspiredBy).filter(Boolean)
    );

    // Printer types (Printers, Cartridges, Inks) that exist
    const availablePrinterTypes = unique(
      printerInksProducts.map((p) => p.type)
    );

    return {
      accessoryTypes: availableAccessoryTypes,
      brands: availableBrands,
      printerTypes: availablePrinterTypes,
    };
  }, [products, searchTerm]);

  // Filtered products based on all criteria
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.inspiredBy?.toLowerCase().includes(term)
      );
    }

    // 2. Main category
    if (mainCategory === "accessories") {
      const accessoryTypes = [
        "Mouse",
        "Keyboard",
        "Mouse Pad",
        "Game Pad",
        "cables",
        "Speakers",
      ];
      result = result.filter((p) => accessoryTypes.includes(p.type));
    } else if (mainCategory === "printers-inks") {
      result = result.filter((p) =>
        ["Printers", "Cartridges", "Inks"].includes(p.type)
      );
    }

    // 3. Accessory sub‑type
    if (mainCategory === "accessories" && accessoryType !== "all") {
      result = result.filter((p) => p.type === accessoryType);
    }

    // 4. Printer brand
    if (mainCategory === "printers-inks" && printerBrand !== "all") {
      result = result.filter((p) => p.inspiredBy === printerBrand);
    }

    // 5. Printer type
    if (mainCategory === "printers-inks" && printerType !== "all") {
      result = result.filter((p) => p.type === printerType);
    }

    return result;
  }, [
    products,
    searchTerm,
    mainCategory,
    accessoryType,
    printerBrand,
    printerType,
  ]);

  // Count of results
  const resultCount = filteredProducts.length;

  // Helper to clear all filters
  const resetFilters = () => {
    setMainCategory("all");
    setAccessoryType("all");
    setPrinterBrand("all");
    setPrinterType("all");
    setSearchTerm("");
  };

  // Determine if a filter option should be disabled (no results if selected)
  const isOptionDisabled = (level, value) => {
    // Create a temporary filter state with this option selected
    let testFilters = {
      mainCategory,
      accessoryType,
      printerBrand,
      printerType,
      searchTerm,
    };
    if (level === "main") testFilters.mainCategory = value;
    if (level === "accessoryType") {
      testFilters.mainCategory = "accessories";
      testFilters.accessoryType = value;
    }
    if (level === "printerBrand") {
      testFilters.mainCategory = "printers-inks";
      testFilters.printerBrand = value;
    }
    if (level === "printerType") {
      testFilters.mainCategory = "printers-inks";
      testFilters.printerType = value;
    }

    // Re-run filtering logic (simplified version)
    let testResult = products;
    if (testFilters.searchTerm.trim()) {
      const term = testFilters.searchTerm.toLowerCase();
      testResult = testResult.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.inspiredBy?.toLowerCase().includes(term)
      );
    }
    if (testFilters.mainCategory === "accessories") {
      testResult = testResult.filter((p) =>
        ["Mouse", "Keyboard", "Mouse Pad", "Game Pad", "cables", "Speakers"].includes(p.type)
      );
      if (testFilters.accessoryType !== "all") {
        testResult = testResult.filter((p) => p.type === testFilters.accessoryType);
      }
    } else if (testFilters.mainCategory === "printers-inks") {
      testResult = testResult.filter((p) =>
        ["Printers", "Cartridges", "Inks"].includes(p.type)
      );
      if (testFilters.printerBrand !== "all") {
        testResult = testResult.filter((p) => p.inspiredBy === testFilters.printerBrand);
      }
      if (testFilters.printerType !== "all") {
        testResult = testResult.filter((p) => p.type === testFilters.printerType);
      }
    }
    return testResult.length === 0;
  };

  return {
    // State
    mainCategory,
    accessoryType,
    printerBrand,
    printerType,
    searchTerm,
    // Setters
    setMainCategory: setMainCategoryWithReset,
    setAccessoryType,
    setPrinterBrand,
    setPrinterType,
    setSearchTerm,
    resetFilters,
    // Data
    filteredProducts,
    resultCount,
    options,
    isOptionDisabled,
  };
};