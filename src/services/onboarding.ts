/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types for the onboarding API responses
export interface OnboardingApiResponse {
  status: boolean;
  message: string;
  current_step: number;
  completed_steps: number[];
  is_draft: boolean;
  data: BusinessInformationData | CompanyRepresentativeData;
}

export interface OnboardingApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface BusinessInformationData {
  id: number;
  user_id: number;
  preferred_currency?: string;
  business_type?: string;
  years_in_business?: string;
  company_history?: {
    text?: string;
    file?: string;
  };
  primary_focus?: string[];
  project_details?: ProjectDetail[];
  average_roi?: string;
  projected_completion_time?: string;
  actual_completion_time?: string;
  funding_structure?: {
    type?: string;
    custom?: string;
  };
  exit_strategy?: {
    type?: string;
    custom?: string;
  };
  investment_currency?: string;
  investment_size_range?: string;
  raised_capital_before?: boolean;
  investor_relationship?: {
    type?: string;
  };
  issues_with_payments?: boolean;
  payment_issues_details?: string;
  over_budget_projects?: boolean;
  over_budget_handling?: string;
  capital_percentage?: string;
  interested_investment_types?: {
    options?: string[];
    custom?: string;
  };
  legal_issues?: boolean;
  legal_issues_details?: string;
  compliance_details?: string;
  update_frequency?: string;
  social_links?: Record<string, string>;
  supporting_documents?: {
    licenses?: string[];
    tax_certificate?: string[];
    others?: string[];
  };
  references?: Reference[];
  terms_accepted?: boolean;
  [key: string]: any;
}

export interface CompanyRepresentativeData {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  linkedin_url?: string;
  bio?: string;
  profile_picture?: string;
  experience_years?: number;
  notable_projects?: string[];
  certifications?: string[];
  terms_accepted?: boolean;
  is_draft?: boolean;
  [key: string]: any;
}

export interface ProjectDetail {
  project_name?: string;
  project_type?: string;
  address?: string;
  project_size?: string;
  total_cost?: string;
  start_date?: string;
  end_date?: string;
  attachments?: string[];
}

export interface Reference {
  name?: string;
  relationship?: string;
  contact_info?: string;
  testimonial?: {
    type?: string;
    value?: string;
  };
}

// Validation schema for business information data
const businessInformationSchema = z.object({
  user_id: z.number().positive("User ID is required"),
  preferred_currency: z.string().optional(),
  business_type: z.string().optional(),
  years_in_business: z.string().optional(),
  company_history: z.any().optional(),
  primary_focus: z.array(z.string()).optional(),
  project_details: z.array(z.any()).optional(),
  average_roi: z.string().optional(),
  projected_completion_time: z.string().optional(),
  actual_completion_time: z.string().optional(),
  funding_structure: z
    .union([
      z.string(),
      z.object({
        selectedValue: z.string(),
        otherValue: z.string().optional(),
      }),
      z.object({
        type: z.string(),
        custom: z.string().optional(),
      }),
    ])
    .optional(),
  exit_strategy: z
    .union([
      z.string(),
      z.object({
        selectedValue: z.string(),
        otherValue: z.string().optional(),
      }),
      z.object({
        type: z.string(),
        custom: z.string().optional(),
      }),
    ])
    .optional(),
  investment_currency: z.string().optional(),
  investment_size_range: z.string().optional(),
  raised_capital_before: z.boolean().optional(),
  investor_relationship: z
    .union([
      z.string(),
      z.object({
        selectedValue: z.string(),
        otherValue: z.string().optional(),
      }),
      z.object({
        type: z.string(),
        custom: z.string().optional(),
      }),
    ])
    .optional(),
  issues_with_payments: z.boolean().optional(),
  payment_issues_details: z.string().optional(),
  over_budget_projects: z.boolean().optional(),
  over_budget_handling: z.string().optional(),
  capital_percentage: z.string().optional(),
  interested_investment_types: z
    .union([
      z.string(),
      z.object({
        selectedValue: z.string(),
        otherValue: z.string().optional(),
      }),
      z.object({
        type: z.string(),
        custom: z.string().optional(),
      }),
      z.object({
        options: z.array(z.string()),
        custom: z.string().optional(),
      }),
    ])
    .optional(),
  legal_issues: z.boolean().optional(),
  legal_issues_details: z.string().optional(),
  compliance_details: z.string().optional(),
  update_frequency: z.string().optional(),
  social_links: z.record(z.string()).optional(),
  supporting_documents: z.any().optional(),
  references: z.array(z.any()).optional(),
  terms_accepted: z.boolean().optional(),
  is_draft: z.boolean().optional(),
});

export type BusinessInformationInput = z.infer<typeof businessInformationSchema>;

// Validation schema for company representative data
const companyRepresentativeSchema = z.object({
  user_id: z.number().positive("User ID is required"),
  first_name: z.string().min(2, "First name must be at least 2 characters").optional(),
  last_name: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  identification_type: z.string().optional(),
  country: z.string().optional(),
  bvn: z.string().optional(),
  nin: z.string().optional(),
  ssn: z.string().optional(),
  address: z
    .union([
      z.string(),
      z.object({
        address: z.string(),
        useCompanyAddress: z.boolean().optional(),
      }),
    ])
    .optional(),
  utility_bill: z.any().optional(),
  currency_of_account: z.string().optional(),
  account_currency: z.string().optional(),
  bank_name: z.string().optional(),
  bank_branch: z.string().optional(),
  swift_code: z.string().optional(),
  sort_code: z.string().optional(),
  routing_number: z.string().optional(),
  account_number: z.string().optional(),
  iban: z.string().optional(),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  bio: z.string().optional(),
  profile_picture: z.any().optional(),
  experience_years: z.number().min(0).optional(),
  notable_projects: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  terms_accepted: z.boolean().optional(),
  is_draft: z.boolean().optional(),
});

/**
 * Validate company representative data based on current step
 */
function validateCompanyRepresentativeStep(step: number, data: any): { success: boolean; errors?: any } {
  // Step 1: Personal Details (using backend field names since data is already transformed)
  if (step === 1) {
    // Check if we have the minimum required data for step 1
    const requiredFields = [
      "user_id",
      "relationship",
      "identification_type",
      "first_name",
      "last_name",
      "country",
      "address",
    ];
    const missingFields = requiredFields.filter((field) => {
      const value = data[field];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    if (missingFields.length > 0) {
      return {
        success: false,
        errors: {
          fieldErrors: missingFields.reduce(
            (acc, field) => {
              acc[field] = [`${field.replace(/_/g, " ")} is required`];
              return acc;
            },
            {} as Record<string, string[]>
          ),
        },
      };
    }

    const stepSchema = z.object({
      user_id: z.number().positive("User ID is required"),
      relationship: z.string().min(1, "Relationship with company is required"),
      identification_type: z.string().min(1, "Identification type is required"),
      first_name: z.string().min(2, "First name must be at least 2 characters"),
      last_name: z.string().min(2, "Last name must be at least 2 characters"),
      country: z.string().min(1, "Country is required"),
      address: z.union([
        z.string().min(5, "Address is required"),
        z.object({
          address: z.string().min(5, "Address is required"),
          useCompanyAddress: z.boolean().optional(),
        }),
      ]),
      utility_bill: z.any().refine(
        (val) => {
          // More flexible validation for utility bill
          if (val === null || val === undefined) return false;
          if (val instanceof File) return true;
          if (typeof val === "object" && val.file instanceof File) return true;
          if (typeof val === "string" && val.trim() !== "") return true;
          return false;
        },
        {
          message: "Utility bill is required",
        }
      ),
      bvn: z.string().optional(),
      nin: z.string().optional(),
      ssn: z.string().optional(),
    });

    const result = stepSchema.safeParse(data);
    return { success: result.success, errors: result.success ? undefined : result.error.flatten() };
  }

  // Step 2: Bank Details (using backend field names since data is already transformed)
  if (step === 2) {
    // Check if we have the minimum required data for step 2
    const requiredFields = [
      "user_id",
      "account_currency",
      "bank_name",
      "bank_branch",
      "swift_code",
      "routing_number",
      "sort_code",
      "account_number",
    ];
    const missingFields = requiredFields.filter((field) => {
      const value = data[field];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    if (missingFields.length > 0) {
      return {
        success: false,
        errors: {
          fieldErrors: missingFields.reduce(
            (acc, field) => {
              acc[field] = [`${field.replace(/_/g, " ")} is required`];
              return acc;
            },
            {} as Record<string, string[]>
          ),
        },
      };
    }

    // Create conditional schema based on country
    const baseSchema = {
      user_id: z.number().positive("User ID is required"),
      account_currency: z.string().min(1, "Currency of account is required"),
      bank_name: z.string().min(1, "Bank name is required"),
      bank_branch: z.string().min(1, "Bank branch is required"),
      swift_code: z.string().min(1, "SWIFT code is required"),
      routing_number: z.string().min(1, "Routing number is required"),
      sort_code: z.string().min(1, "Sort code is required"),
      account_number: z.string().min(1, "Account number is required"),
      terms_accepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    };

    // Add IBAN requirement only for United States
    const stepSchema = z.object({
      ...baseSchema,
      iban:
        data.country === "United States"
          ? z.string().min(1, "IBAN is required for United States accounts")
          : z.string().optional(),
    });

    const result = stepSchema.safeParse(data);
    return { success: result.success, errors: result.success ? undefined : result.error.flatten() };
  }

  // Fallback to basic schema for unknown steps
  const result = companyRepresentativeSchema.safeParse(data);
  return { success: result.success, errors: result.success ? undefined : result.error.flatten() };
}

export type CompanyRepresentativeInput = z.infer<typeof companyRepresentativeSchema>;

/**
 * Save company representative step data
 * @param step - The step number (1-2 for company representative sections)
 * @param data - The form data to save
 * @param token - Authentication token
 * @returns Promise with success/error response
 */
export async function saveCompanyRepresentativeStep(
  step: number,
  data: CompanyRepresentativeInput,
  token: string
): Promise<{ success?: OnboardingApiResponse; error?: string; fieldErrors?: Record<string, string[]> }> {
  try {
    const cleanedData: any = {};
    Object.entries(data).forEach(([key, value]) => {
      // Skip null values for optional fields
      if (value === null) {
        return;
      }

      // Convert string booleans to actual booleans
      if (value === "yes") {
        cleanedData[key] = true;
      } else if (value === "no") {
        cleanedData[key] = false;
      } else {
        cleanedData[key] = value;
      }
    });

    const validation = validateCompanyRepresentativeStep(step, cleanedData);

    if (!validation.success) {
      return {
        error: "Please fix the following validation errors",
        fieldErrors: validation.errors?.fieldErrors as Record<string, string[]>,
      };
    }

    const validatedData = cleanedData;

    // Determine if we need to use FormData (for file uploads)
    const hasFiles = hasFileFields(validatedData);
    let requestData: FormData | CompanyRepresentativeInput;
    let contentType: string;

    if (hasFiles) {
      // Convert to FormData for file uploads
      requestData = convertToFormData(validatedData);
      contentType = "multipart/form-data";
    } else {
      // Use JSON for regular data
      requestData = validatedData;
      contentType = "application/json";
    }

    const response = await axios.post<OnboardingApiResponse>(
      `${BASE_URL}/api/company-representative/save-step/${step}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          ...(contentType === "application/json" && { "Content-Type": "application/json" }),
        },
      }
    );
    return { success: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 422 && response.data?.errors) {
        return {
          error: response.data?.message || "Validation failed",
          fieldErrors: response.data.errors,
        };
      }

      return {
        error: response?.data?.message || "Request failed",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Get current company representative data
 * @param token - Authentication token
 * @returns Promise with company representative data
 */
export async function getCompanyRepresentative(
  token: string
): Promise<{ success?: CompanyRepresentativeData; error?: string }> {
  try {
    const response = await axios.get<{ data: CompanyRepresentativeData }>(`${BASE_URL}/api/company-representative`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return { success: response.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Failed to fetch data",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Save business information step data
 * @param step - The step number (1-5 for business information sections)
 * @param data - The form data to save
 * @param token - Authentication token
 * @returns Promise with success/error response
 */
export async function saveBusinessInformationStep(
  step: number,
  data: BusinessInformationInput,
  token: string
): Promise<{ success?: OnboardingApiResponse; error?: string; fieldErrors?: Record<string, string[]> }> {
  try {
    // Clean and transform the data before validation
    const cleanedData: any = {};
    Object.entries(data).forEach(([key, value]) => {
      // Skip null values for optional fields
      if (value === null) {
        return;
      }

      // Convert string booleans to actual booleans
      if (value === "yes") {
        cleanedData[key] = true;
      } else if (value === "no") {
        cleanedData[key] = false;
      } else {
        cleanedData[key] = value;
      }
    });

    const validatedFields = businessInformationSchema.safeParse(cleanedData);

    if (!validatedFields.success) {
      return {
        error: "Invalid input data",
        fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { data: validatedData } = validatedFields;

    // Determine if we need to use FormData (for file uploads)
    const hasFiles = hasFileFields(validatedData);
    let requestData: FormData | BusinessInformationInput;
    let contentType: string;

    if (hasFiles) {
      // Convert to FormData for file uploads
      requestData = convertToFormData(validatedData);
      contentType = "multipart/form-data";
    } else {
      // Use JSON for regular data
      requestData = validatedData;
      contentType = "application/json";
    }

    const response = await axios.post<OnboardingApiResponse>(
      `${BASE_URL}/api/sponsor-business-information/save-step/${step}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          ...(contentType === "application/json" && { "Content-Type": "application/json" }),
        },
      }
    );
    return { success: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 422 && response.data?.errors) {
        return {
          error: response.data?.message || "Validation failed",
          fieldErrors: response.data.errors,
        };
      }

      return {
        error: response?.data?.message || "Request failed",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Get current business information data
 * @param token - Authentication token
 * @returns Promise with business information data
 */
export async function getBusinessInformation(
  token: string
): Promise<{ success?: BusinessInformationData; error?: string }> {
  try {
    const response = await axios.get<{ data: BusinessInformationData }>(
      `${BASE_URL}/api/sponsor-business-information`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return { success: response.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Failed to fetch data",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Check if the data contains file fields
 */
function hasFileFields(data: any): boolean {
  // Check for common file field patterns
  const checkForFiles = (obj: any): boolean => {
    if (obj instanceof File || obj instanceof FileList) {
      return true;
    }

    if (Array.isArray(obj)) {
      return obj.some((item) => checkForFiles(item));
    }

    if (obj && typeof obj === "object") {
      return Object.values(obj).some((value) => checkForFiles(value));
    }

    return false;
  };

  const hasFiles = checkForFiles(data);
  return hasFiles;
}

/**
 * Convert data to FormData for file uploads
 */
function convertToFormData(data: any): FormData {
  const formData = new FormData();

  const appendToFormData = (key: string, value: any) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((file, index) => {
        formData.append(`${key}[${index}]`, file);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            appendToFormData(`${key}[${index}][${subKey}]`, subValue);
          });
        } else {
          formData.append(`${key}[]`, item);
        }
      });
    } else if (value && typeof value === "object" && !(value instanceof Date)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendToFormData(`${key}[${subKey}]`, subValue);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  };

  Object.entries(data).forEach(([key, value]) => {
    appendToFormData(key, value);
  });

  return formData;
}

/**
 * Upload supporting documents
 * @param files - Files to upload
 * @param documentType - Type of document (licenses, tax_certificate, others)
 * @param token - Authentication token
 */
export async function uploadSupportingDocuments(
  files: File[],
  documentType: "licenses" | "tax_certificate" | "others",
  token: string
): Promise<{ success?: string[]; error?: string }> {
  try {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });

    formData.append("document_type", documentType);

    const response = await axios.post<{ data: { file_urls: string[] } }>(
      `${BASE_URL}/api/sponsor-business-information/upload-documents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: response.data.data.file_urls };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Upload failed",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Get onboarding progress
 * @param token - Authentication token
 */
export async function getOnboardingProgress(
  token: string
): Promise<{ success?: { current_step: number; completed_steps: number[] }; error?: string }> {
  try {
    const response = await axios.get<{
      data: { current_step: number; completed_steps: number[] };
    }>(`${BASE_URL}/api/sponsor-onboarding/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return { success: response.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Failed to fetch progress",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}
