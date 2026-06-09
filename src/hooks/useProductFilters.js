import { useMemo, useState } from "react";

// Helper: get unique values from array
const unique = (arr) => [...new Set(arr)];

// Normalize brand strings to deduplicate case variants (e.g. "HP" / "Hp" → "Hp")
const normalizeBrand = (b) =>
  b ? b.trim().charAt(0).toUpperCase() + b.trim().slice(1).toLowerCase() : b;

export const useProductFilters = (products = []) => {
  // Filter state
  const [mainCategory, setMainCategory] = useState("all");
  const [accessoryType, setAccessoryType] = useState("all");
  const [printerBrand, setPrinterBrand] = useState("all");
  const [printerType, setPrinterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // القوائم الموحدة للفحص بحروف صغيرة (ضمان عدم التأثر بأخطاء الداتا)
  const accessoryTypesLower = ["mouse", "keyboard", "mouse pad", "game pad", "speakers"];
  const printerTypesLower = ["printers", "cartridges", "inks", "drums", "chips"];

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
    let baseProducts = products;
    
    // تطبيق البحث أولاً لاستخراج الخيارات المتاحة المرتبطة بكلمة البحث
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      baseProducts = baseProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.inspiredBy?.toLowerCase().includes(term)
      );
    }

    // استخراج الأنواع المتوفرة للإكسسوارات
    const availableAccessoryTypes = unique(
      baseProducts
        .filter((p) => p.type && accessoryTypesLower.includes(p.type.toLowerCase().trim()))
        .map((p) => p.type.trim())
    );

    // المنتجات المتعلقة بالطابعات والأحبار
    const printerInksProducts = baseProducts.filter((p) =>
      p.type && printerTypesLower.includes(p.type.toLowerCase().trim())
    );

    const availableBrands = unique(
      printerInksProducts
        .map((p) => normalizeBrand(p.inspiredBy))
        .filter(Boolean)
    );

    const availablePrinterTypes = unique(
      printerInksProducts.map((p) => p.type.trim())
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

    // 1. الفرز الصارم والآمن حسب الفئة الرئيسية أولاً لمنع الاختلاط بالأنواع الأخرى
    if (mainCategory === "accessories") {
      result = result.filter((p) => p.type && accessoryTypesLower.includes(p.type.toLowerCase().trim()));

      // 2. تطبيق الفلتر الفرعي للاكسسوارات فقط
      if (accessoryType !== "all") {
        result = result.filter((p) => p.type && p.type.toLowerCase().trim() === accessoryType.toLowerCase().trim());
      }
    } 
    else if (mainCategory === "printers-inks") {
      result = result.filter((p) => p.type && printerTypesLower.includes(p.type.toLowerCase().trim()));

      // تطبيق فلاتر الطابعات الفرعية
      if (printerBrand !== "all") {
        result = result.filter((p) => normalizeBrand(p.inspiredBy) === printerBrand);
      }
      if (printerType !== "all") {
        result = result.filter((p) => p.type && p.type.toLowerCase().trim() === printerType.toLowerCase().trim());
      }
    }

    // 3. تطبيق نص البحث على النتيجة النهائية المعزولة فئوياً
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.inspiredBy?.toLowerCase().includes(term)
      );
    }

    // 4. استبعاد المنتجات المنتهية من المخزن
    result = result.filter((p) => p.stock > 0 || p.stock === undefined);

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

    let testResult = products;

    // هنا قمنا بتعديل المنطق ليطابق تماماً دالة التصفية الفعلية (الفئة أولاً ثم البحث)
    if (testFilters.mainCategory === "accessories") {
      testResult = testResult.filter((p) => p.type && accessoryTypesLower.includes(p.type.toLowerCase().trim()));
      if (testFilters.accessoryType !== "all") {
        testResult = testResult.filter((p) => p.type && p.type.toLowerCase().trim() === testFilters.accessoryType.toLowerCase().trim());
      }
    } 
    else if (testFilters.mainCategory === "printers-inks") {
      testResult = testResult.filter((p) => p.type && printerTypesLower.includes(p.type.toLowerCase().trim()));
      if (testFilters.printerBrand !== "all") {
        testResult = testResult.filter((p) => normalizeBrand(p.inspiredBy) === testFilters.printerBrand);
      }
      if (testFilters.printerType !== "all") {
        testResult = testResult.filter((p) => p.type && p.type.toLowerCase().trim() === testFilters.printerType.toLowerCase().trim());
      }
    }

    // تطبيق البحث في النهاية بشكل متطابق ومتزامن مع التصفية
    if (testFilters.searchTerm.trim()) {
      const term = testFilters.searchTerm.toLowerCase();
      testResult = testResult.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.inspiredBy?.toLowerCase().includes(term)
      );
    }

    return testResult.length === 0;
  };

  return {
    mainCategory,
    accessoryType,
    printerBrand,
    printerType,
    searchTerm,
    setMainCategory: setMainCategoryWithReset,
    setAccessoryType,
    setPrinterBrand,
    setPrinterType,
    setSearchTerm,
    resetFilters,
    filteredProducts,
    resultCount,
    options,
    isOptionDisabled,
  };
};
