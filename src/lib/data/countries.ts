// Countries data extracted from countries.json
// All countries are available for selection

export interface CountryOption {
  label: string;
  value: string;
  emoji?: string;
}

// Import countries data
import countriesData from "@/src/data/countries.json";

export const COUNTRY_OPTIONS: CountryOption[] = countriesData.map((country) => ({
  label: `${country.emoji} ${country.name}`,
  value: country.name,
  emoji: country.emoji,
}));

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
