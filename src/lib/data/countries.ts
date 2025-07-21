// Countries data extracted from countries.json
// All countries are available for selection

export interface CountryOption {
  label: string;
  value: string;
  emoji?: string;
  isSupported?: boolean;
}

// Import countries data
import countriesData from "@/src/data/countries.json";

// Supported countries (only these specific countries are supported)
const SUPPORTED_COUNTRIES = ["Nigeria", "France", "United Kingdom", "United States"];

export const COUNTRY_OPTIONS: CountryOption[] = countriesData
  .map((country) => ({
    label: `${country.emoji} ${country.name}`,
    value: country.name,
    emoji: country.emoji,
    isSupported: SUPPORTED_COUNTRIES.includes(country.name),
  }))
  // Sort: supported countries first, then alphabetically by country name
  .sort((a, b) => {
    // If one is supported and the other isn't, supported comes first
    if (a.isSupported && !b.isSupported) return -1;
    if (!a.isSupported && b.isSupported) return 1;

    // If both are supported or both are unsupported, sort alphabetically
    return a.value.localeCompare(b.value);
  });

// Helper function to get country by name
export const getCountryByName = (countryName: string) => {
  return COUNTRY_OPTIONS.find((country) => country.value === countryName);
};

// Helper function to get country by ISO code
export const getCountryByIso = (isoCode: string) => {
  const country = countriesData.find((c) => c.iso2 === isoCode || c.iso3 === isoCode);
  return country
    ? {
        label: `${country.emoji} ${country.name}`,
        value: country.name,
        emoji: country.emoji,
      }
    : undefined;
};
