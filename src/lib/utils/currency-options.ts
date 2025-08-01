import { useCurrencySafe } from "@/src/lib/context/currency-context";

// Currency-specific investment size options
const CURRENCY_BUDGET_OPTIONS = {
  NGN: [
    { label: "₦250M - ₦500M", value: "₦250M-₦500M" },
    { label: "₦500M - ₦1BN", value: "₦500M-₦1BN" },
    { label: "Above ₦1BN", value: "Above-₦1BN" },
  ],
  USD: [
    { label: "$150K - $500K", value: "$150K-$500K" },
    { label: "$500K - $1M", value: "$500K-$1M" },
    { label: "$1M - $3M", value: "$1M-$3M" },
  ],
  EUR: [
    { label: "€150K - €500K", value: "€150K-€500K" },
    { label: "€500K - €1M", value: "€500K-€1M" },
    { label: "€1M - €3M", value: "€1M-€3M" },
  ],
  GBP: [
    { label: "£500K - £1M", value: "£500K-£1M" },
    { label: "£1M - £3M", value: "£1M-£3M" },
    { label: "£3M - £4.5M", value: "£3M-£4.5M" },
    { label: "Above £4.5M", value: "Above-£4.5M" },
  ],
};

// Utility function to generate investment size options with dynamic currency
export const getInvestmentSizeOptions = (currencySymbol: string = "$") => [
  { label: `${currencySymbol}500K - ${currencySymbol}1M`, value: `${currencySymbol}500K-${currencySymbol}1M` },
  { label: `${currencySymbol}1M - ${currencySymbol}5M`, value: `${currencySymbol}1M-${currencySymbol}5M` },
  { label: `${currencySymbol}5M+`, value: `${currencySymbol}5M+` },
];

// New function that returns currency-specific options based on currency code
export const getCurrencySpecificInvestmentOptions = (currencyCode: string = "USD") => {
  return CURRENCY_BUDGET_OPTIONS[currencyCode as keyof typeof CURRENCY_BUDGET_OPTIONS] || getInvestmentSizeOptions("$");
};

// Hook to get dynamic investment size options
export const useInvestmentSizeOptions = () => {
  const { selectedCurrency } = useCurrencySafe();
  return getCurrencySpecificInvestmentOptions(selectedCurrency);
};

// Function to replace currency symbols in any string
export const replaceCurrencySymbols = (text: string, currencySymbol: string = "$") => {
  return text.replace(/\$[0-9A-Za-z\s\-+]+/g, (match) => {
    const amount = match.replace("$", "");
    return `${currencySymbol}${amount}`;
  });
};
