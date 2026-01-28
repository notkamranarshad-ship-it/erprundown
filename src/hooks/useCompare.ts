import { useState, useEffect, useCallback } from "react";

const COMPARE_STORAGE_KEY = "erprundown_compare_list";
const MAX_COMPARE_ITEMS = 4;

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
    } catch {
      // Storage not available
    }
  }, [compareList]);

  const addToCompare = useCallback((vendorSlug: string) => {
    setCompareList((prev) => {
      if (prev.includes(vendorSlug)) return prev;
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      return [...prev, vendorSlug];
    });
  }, []);

  const removeFromCompare = useCallback((vendorSlug: string) => {
    setCompareList((prev) => prev.filter((slug) => slug !== vendorSlug));
  }, []);

  const toggleCompare = useCallback((vendorSlug: string) => {
    setCompareList((prev) => {
      if (prev.includes(vendorSlug)) {
        return prev.filter((slug) => slug !== vendorSlug);
      }
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      return [...prev, vendorSlug];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback(
    (vendorSlug: string) => compareList.includes(vendorSlug),
    [compareList]
  );

  const canAddMore = compareList.length < MAX_COMPARE_ITEMS;

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    isInCompare,
    canAddMore,
    maxItems: MAX_COMPARE_ITEMS,
  };
}