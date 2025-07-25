"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";

interface CurrencyContextType {
  selectedCurrency: string;
  currencySymbol: string;
  updateCurrency: (currency: string) => void;
  formatCurrency: (amount: string | number, includeSymbol?: boolean) => string;
  getCurrencySymbol: (currencyCode?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Currency symbol mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { formData } = useOnboardingStoreWithUser();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD"); // Default fallback

  // Get currency from form data - prioritize company_currency over project_currency for Business Information phase
  useEffect(() => {
    const projectCurrency = formData.project_currency;
    const companyCurrency = formData.company_currency;

    if (companyCurrency && typeof companyCurrency === "string") {
      setSelectedCurrency(companyCurrency);
    } else if (projectCurrency && typeof projectCurrency === "string") {
      setSelectedCurrency(projectCurrency);
    }
  }, [formData.project_currency, formData.company_currency]);

  const getCurrencySymbol = (currencyCode?: string): string => {
    const code = currencyCode || selectedCurrency;
    return CURRENCY_SYMBOLS[code] || "$"; // Default to $ if not found
  };

  const currencySymbol = getCurrencySymbol();

  const updateCurrency = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const formatCurrency = (amount: string | number, includeSymbol = true): string => {
    const symbol = includeSymbol ? currencySymbol : "";
    const amountStr = typeof amount === "number" ? amount.toString() : amount;

    // Remove any existing currency symbols from the amount
    const cleanAmount = amountStr.replace(/[\$₦€£]/g, "").trim();

    return `${symbol}${cleanAmount}`;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    currencySymbol,
    updateCurrency,
    formatCurrency,
    getCurrencySymbol,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

// Hook for components that need currency but don't want to throw if context is missing
export function useCurrencySafe() {
  const context = useContext(CurrencyContext);
  return (
    context || {
      selectedCurrency: "USD",
      currencySymbol: "$",
      updateCurrency: () => {},
      formatCurrency: (amount: string | number) => `$${amount}`,
      getCurrencySymbol: () => "$",
    }
  );
}
