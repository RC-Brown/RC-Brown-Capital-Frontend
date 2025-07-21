/* eslint-disable @typescript-eslint/no-explicit-any */
import { BusinessInformationInput, CompanyRepresentativeInput } from "@/src/services/onboarding";

/**
 * Field mapping configuration for business information sections
 * Maps frontend form field names to backend API field names
 */
export const BUSINESS_INFO_FIELD_MAPPING = {
  // Company Overview (Step 1)
  company_currency: "preferred_currency",
  company_description: "company_history", // Enhanced field with text and files
  primary_focus: "primary_focus", // Array field

  // Project Track Record (Step 2)
  project_docs: "project_docs", // File field
  average_roi: "average_roi",
  projected_completion_time: "projected_completion_time", // String field
  actual_completion_time: "actual_completion_time",
  completed_projects: "project_details", // Custom component data

  // Investment Details (Step 3)
  typical_funding_structure: "funding_structure",
  investments_exited: "exit_strategy",
  investment_size: "investment_size_range",
  capital_raised: "raised_capital_before",
  capital_raise_relationship: "investor_relationship",
  capital_issues: "issues_with_payments",
  capital_issues_details: "payment_issues_details",

  // Risk & Compliance (Step 4)
  project_over_budget: "over_budget_projects",
  project_over_budget_details: "over_budget_handling",
  capital_percentage: "capital_percentage",
  investment_interests: "interested_investment_types",
  legal_or_compliance_issues: "legal_issues",
  legal_or_compliance_issues_details: "legal_issues_details",
  legal_compliance_measures: "compliance_details",

  // Communication & Final (Step 5)
  preferred_update_rate: "update_frequency",
  social_media: "social_links",
  supporting_documents: "supporting_documents",
  testimonials: "testimonials", // Custom field
  reference_links: "references",
  terms_accepted: "terms_accepted",
};

/**
 * Field mapping configuration for company representative sections
 * Maps frontend form field names to backend API field names
 */
export const COMPANY_REPRESENTATIVE_FIELD_MAPPING = {
  // Personal Details (Step 1)
  relationship_with_company: "relationship", // Backend expects 'relationship' not 'position'
  first_name: "first_name",
  last_name: "last_name",
  country: "country", // Optional field
  means_of_identification: "identification_type", // Backend expects 'identification_type'
  bvn: "bvn", // Optional field
  nin: "nin", // Optional field
  ssn: "ssn", // Optional field
  address: "address", // Custom component data
  utility_bill: "utility_bill", // File field

  // Company Bank Details (Step 2)
  currency_of_account: "account_currency", // Backend expects 'account_currency'
  bank_name: "bank_name", // Keep as bank_name
  bank_branch: "bank_branch",
  swift_code: "swift_code",
  routing_number: "routing_number", // Keep as routing_number
  account_number: "account_number",
  iban: "iban",
  bank_terms_accepted: "terms_accepted",
};

/**
 * Transform frontend form data to backend API format
 */
export function transformFormDataToApi(
  formData: Record<string, any>,
  userId: number
  // currentSection: number
): BusinessInformationInput {
  const apiData: BusinessInformationInput = {
    user_id: userId,
  };

  // Apply field mappings
  Object.entries(formData).forEach(([frontendKey, value]) => {
    const backendKey = BUSINESS_INFO_FIELD_MAPPING[frontendKey as keyof typeof BUSINESS_INFO_FIELD_MAPPING];

    if (backendKey) {
      if (backendKey.includes(".")) {
        const [parentKey, childKey] = backendKey.split(".");
        if (!apiData[parentKey as keyof BusinessInformationInput]) {
          (apiData as any)[parentKey] = {};
        }
        (apiData as any)[parentKey][childKey] = value;
      }
      // Handle enhanced-textarea fields (text + files)
      else if (frontendKey === "company_description" && typeof value === "object" && value?.text) {
        (apiData as any)[backendKey] = {
          text: value.text,
          files: value.files || [],
        };
      }
      // Handle array fields
      else if (frontendKey === "primary_focus" && typeof value === "string") {
        (apiData as any)[backendKey] = [value];
      } else if (typeof value === "object" && value?.selectedValue) {
        if (value.selectedValue === "other" && value.otherValue) {
          (apiData as any)[backendKey] = {
            type: value.selectedValue,
            custom: value.otherValue,
          };
        } else {
          (apiData as any)[backendKey] = {
            type: value.selectedValue,
          };
        }
      }
      // Handle regular fields
      else {
        (apiData as any)[backendKey] = value;
      }
    } else {
      // Keep unmapped fields as-is (fallback)
      (apiData as any)[frontendKey] = value;
    }
  });

  return apiData;
}

// Type definitions for better type safety
interface CompanyHistory {
  text?: string;
  files?: File[];
}

interface TypeCustomObject {
  type: string;
  custom?: string;
}

// Type guards
function isCompanyHistory(value: unknown): value is CompanyHistory {
  return typeof value === "object" && value !== null && "text" in value;
}

function isTypeCustomObject(value: unknown): value is TypeCustomObject {
  return typeof value === "object" && value !== null && "type" in value;
}

/**
 * Transform backend API data to frontend form format
 */
export function transformApiDataToForm(apiData: Record<string, unknown>): Record<string, any> {
  const formData: Record<string, any> = {};

  // Reverse mapping from API to form
  const reverseMapping = Object.fromEntries(
    Object.entries(BUSINESS_INFO_FIELD_MAPPING).map(([front, back]) => [back, front])
  );

  Object.entries(apiData).forEach(([apiKey, value]) => {
    const formKey = reverseMapping[apiKey];

    if (formKey) {
      if (apiKey === "company_history" && isCompanyHistory(value)) {
        // Handle enhanced format with text and files
        const companyHistory = value as CompanyHistory & { files?: File[] };
        if (companyHistory.files && Array.isArray(companyHistory.files)) {
          formData["company_description"] = {
            text: companyHistory.text || "",
            files: companyHistory.files,
          };
        } else {
          // Backward compatibility: just text
          formData["company_description"] = companyHistory.text || "";
        }
      }
      // Handle array fields
      else if (apiKey === "primary_focus" && Array.isArray(value) && value.length > 0) {
        formData["primary_focus"] = value[0];
      } else if (apiKey === "projected_completion_time" && typeof value === "string") {
        formData["projected_completion_time"] = value;
      } else if (isTypeCustomObject(value)) {
        if (value.custom) {
          formData[formKey] = {
            selectedValue: value.type,
            otherValue: value.custom,
          };
        } else {
          formData[formKey] = {
            selectedValue: value.type,
            otherValue: "",
          };
        }
      } else {
        formData[formKey] = value;
      }
    } else {
      // Keep unmapped fields as-is
      formData[apiKey] = value;
    }
  });

  return formData;
}

/**
 * Transform company representative form data to backend API format
 */
export function transformCompanyRepDataToApi(
  formData: Record<string, any>,
  userId: number
): CompanyRepresentativeInput {
  const apiData: CompanyRepresentativeInput = {
    user_id: userId,
  };

  // Apply field mappings
  Object.entries(formData).forEach(([frontendKey, value]) => {
    // Explicitly exclude facial_capture from being sent to backend
    if (frontendKey === "facial_capture") {
      return;
    }

    const backendKey =
      COMPANY_REPRESENTATIVE_FIELD_MAPPING[frontendKey as keyof typeof COMPANY_REPRESENTATIVE_FIELD_MAPPING];

    if (backendKey) {
      if (frontendKey === "address" && typeof value === "object" && value !== null) {
        // Extract address string from the address object
        if (value.address) {
          (apiData as any)[backendKey] = value.address;
        } else {
          (apiData as any)[backendKey] = value;
        }
      } else if (
        frontendKey === "utility_bill" &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        if (value.file && value.file instanceof File) {
          (apiData as any)[backendKey] = value.file;
        } else if (value instanceof File) {
          (apiData as any)[backendKey] = value;
        } else {
          // Skip file metadata objects without actual files
          return;
        }
      } else if (frontendKey === "bank_terms_accepted") {
        (apiData as any)[backendKey] = Boolean(value);
      }
      // Handle regular fields
      else {
        (apiData as any)[backendKey] = value;
      }
    } else {
      // Keep unmapped fields as-is (fallback)
      (apiData as any)[frontendKey] = value;
    }
  });

  // Add sort_code field (duplicate routing_number value since they're often the same)
  if (formData.routing_number) {
    (apiData as any)["sort_code"] = formData.routing_number;
  }

  // Ensure required fields are present (even if empty) to avoid backend validation errors
  const requiredFields = [
    "relationship",
    "identification_type",
    "address",
    // Bank details fields that backend requires
    "bank_name",
    "swift_code",
    "sort_code",
    "iban",
    "routing_number",
    "account_currency",
  ];
  requiredFields.forEach((field) => {
    const apiDataRecord = apiData as Record<string, unknown>;
    if (!(field in apiData) || apiDataRecord[field] === undefined || apiDataRecord[field] === null) {
      apiDataRecord[field] = "";
    }
  });

  // Pre-validate critical required fields before sending to API
  const missingFields: string[] = [];
  const criticalFields = [
    "relationship",
    "identification_type",
    "address",
    "bank_name",
    "swift_code",
    "sort_code",
    "iban",
    "routing_number",
    "account_currency",
  ];

  criticalFields.forEach((field) => {
    const value = (apiData as any)[field];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    console.warn("⚠️ Missing critical fields that backend expects:", missingFields);
  }

  return apiData;
}

/**
 * Transform backend API data to company representative form format
 */
export function transformApiDataToCompanyRepForm(apiData: any): Record<string, any> {
  const formData: Record<string, any> = {};

  // Reverse mapping from API to form
  const reverseMapping = Object.fromEntries(
    Object.entries(COMPANY_REPRESENTATIVE_FIELD_MAPPING).map(([front, back]) => [back, front])
  );

  Object.entries(apiData).forEach(([apiKey, value]) => {
    const formKey = reverseMapping[apiKey];

    if (formKey) {
      formData[formKey] = value;
    } else {
      // Keep unmapped fields as-is
      formData[apiKey] = value;
    }
  });

  return formData;
}

/**
 * Get the section number (1-5) based on section key
 */
export function getSectionStepNumber(sectionKey: string): number {
  const sectionStepMap: Record<string, number> = {
    "company-overview": 1,
    "project-track-record": 2,
    "investment-details": 3,
    "risk-compliance": 4,
    "communication-final": 5,
  };

  return sectionStepMap[sectionKey] || 1;
}

/**
 * Get the section number (1-2) based on company representative section key
 */
export function getCompanyRepSectionStepNumber(sectionKey: string): number {
  const sectionStepMap: Record<string, number> = {
    "personal-details": 1,
    "company-bank-details": 2,
  };

  return sectionStepMap[sectionKey] || 1;
}

/**
 * Validate that required fields for a section are present
 */
export function validateSectionApiData(sectionKey: string, apiData: BusinessInformationInput): string[] {
  const errors: string[] = [];

  switch (sectionKey) {
    case "company-overview":
      if (!apiData.preferred_currency) errors.push("Currency is required");
      if (!apiData.business_type) errors.push("Business type is required");
      if (!apiData.years_in_business) errors.push("Years in business is required");
      break;

    case "project-track-record":
      if (!apiData.average_roi) errors.push("Average ROI is required");
      break;

    case "investment-details":
      if (!apiData.funding_structure) errors.push("Funding structure is required");
      if (!apiData.exit_strategy) errors.push("Exit strategy is required");
      break;

    case "communication-final":
      if (!apiData.terms_accepted) errors.push("Terms must be accepted");
      break;
  }

  return errors;
}

/**
 * Debug helper to show field mapping
 */
export function debugFieldMapping(formData: Record<string, unknown>, userId: number) {
  const apiData = transformFormDataToApi(formData, userId);

  return { formData, apiData };
}
