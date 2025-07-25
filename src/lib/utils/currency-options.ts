import { useCurrencySafe } from "@/src/lib/context/currency-context";

// Utility function to generate investment size options with dynamic currency
export const getInvestmentSizeOptions = (currencySymbol: string = "$") => [
  { label: `${currencySymbol}500K - ${currencySymbol}1M`, value: `${currencySymbol}500K-${currencySymbol}1M` },
  { label: `${currencySymbol}1M - ${currencySymbol}5M`, value: `${currencySymbol}1M-${currencySymbol}5M` },
  { label: `${currencySymbol}5M+`, value: `${currencySymbol}5M+` },
];

// Hook to get dynamic investment size options
export const useInvestmentSizeOptions = () => {
  const { currencySymbol } = useCurrencySafe();
  return getInvestmentSizeOptions(currencySymbol);
};

// Function to replace currency symbols in any string
export const replaceCurrencySymbols = (text: string, currencySymbol: string = "$") => {
  return text.replace(/\$[0-9A-Za-z\s\-+]+/g, (match) => {
    const amount = match.replace("$", "");
    return `${currencySymbol}${amount}`;
  });
};
