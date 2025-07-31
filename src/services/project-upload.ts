/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types for the project upload API responses
export interface ProjectUploadApiResponse {
  message: string;
  project: ProjectUploadData;
}

export interface ProjectUploadStepResponse {
  message: string;
  current_step: number;
  completed_steps: number[];
  status: "draft" | "submitted";
  project: ProjectUploadData;
}

export interface ProjectUploadApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProjectUploadData {
  id: number;
  sponsor_id: number;
  currency: string;
  sponsor_name: string;
  sponsor_logo?: string;
  project_name: string;
  project_subtitle: string;
  project_summary: string;
  years_operating: string;
  historical_portfolio_activity: string;
  assets_under_management: string;
  number_of_realized_projects: string;
  rc_brown_capital_offerings: string;
  projected_valuation: string;
  timeline_of_completion_months: number;
  total_capital_required: string;
  total_debt_allocation_percent: number;
  debt_investment_tenure_months: number;
  projected_returns_equity_percent: number;
  total_equity_percent: number;
  property_address: string;
  location_description: string;
  occupancy: string;
  about_property: string;
  detailed_project_description: string;
  has_anchor_tenant: boolean;
  anchor_tenant_details?: string;
  has_anchor_buyer: boolean;
  anchor_buyer_details?: string;
  percent_leased: number;
  sq_ft_leased: number;
  investment_hold_period_years: number;
  acquisition_date: string;
  closing_date: string;
  target_exit_date_debt: string;
  target_exit_date_equity: string;
  offer_live_date: string;
  offer_closing_date: string;
  funds_due_date: string;
  target_escrow_closing_date: string;
  targeted_distribution_start_date: string;
  distributions_anticipated_begin_date: string;
  frequency_of_distributions: string;
  sponsor_background: string;
  years_in_operation: string;
  historical_portfolio_activity_amount: string;
  projects_under_management_amount: string;
  total_square_feet_managed: string;
  deals_funded_by_rc_brown: number;
  number_of_properties_under_management: number;
  total_number_of_realized_projects: number;
  number_properties_developed: number;
  number_properties_built_sold: number;
  highest_budget_for_project: string;
  average_length_of_completion_months: number;
  full_track_record?: string;
  total_capitalization: string;
  debt_allocation: string;
  equity_allocation: string;
  sponsor_co_invest_range: string;
  offer_deadline: string;
  location: string;
  asset_type: string;
  strategy: string;
  objective: string;
  debt_allocation_percent: number;
  debt_distribution_period: string;
  debt_target_distribution_start_date: string;
  debt_target_distribution_end_date: string;
  debt_minimum_investment_amount: number;
  debt_maximum_investment_amount: number;
  debt_expected_minimum_annual_return: number;
  debt_expected_maximum_annual_return: number;
  debt_target_hold_period_years: number;
  debt_exit_date: string;
  equity_allocation_percent: number;
  equity_distribution_period: string;
  equity_target_distribution_start_date: string;
  equity_minimum_investment: number;
  equity_maximum_investment: number;
  equity_expected_minimum_return: number;
  equity_expected_maximum_return: number;
  equity_target_hold_period_years: number;
  equity_exit_date: string;
  budget_sheet_property_address: string;
  city: string;
  state: string;
  zip_code: string;
  in_depth_description_of_work: string;
  project_timeline_months: number;
  adding_square_footage: boolean;
  square_footage_expansion_plan?: string;
  total_construction_cost: string;
  taxes: string;
  insurance: string;
  management: string;
  repairs: string;
  utilities: string;
  interest: string;
  total_expense: string;
  total_rental_income: string;
  total_equity_appreciation: string;
  status: "draft" | "submitted";
  current_step: number;
  completed_steps: number[];
  is_draft: boolean;
  [key: string]: any;
}

export interface ProjectDocument {
  id: number;
  project_id: number;
  category: "site_documents" | "closing_documents" | "offering_information" | "sponsor_information" | "additional";
  subcategory?: string;
  document_name?: string;
  file_path: string;
  file_type: string;
  original_filename: string;
  notes?: string;
}

export interface PhysicalDescription {
  id: number;
  project_id: number;
  description_title: string;
  description: string;
}

// Base validation schema for project upload data
const baseProjectUploadSchema = z.object({
  // Common fields
  is_draft: z.boolean().optional(),
  current_step: z.number().optional(),
  completed_steps: z.array(z.number()).optional(),
});

// Step-specific validation schemas
const step1Schema = baseProjectUploadSchema.extend({
  // Sponsor Info (Step 1)
  currency: z.string().min(1, "Project currency is required"),
  sponsor_name: z
    .string()
    .min(2, "Sponsor name must be at least 2 characters")
    .max(100, "Sponsor name must not exceed 100 characters"),
  sponsor_logo: z
    .any()
    .refine((val) => val && (Array.isArray(val) ? val.length > 0 : true), "Sponsor logo is required"),
});

const step2Schema = baseProjectUploadSchema.extend({
  // Project Overview (Step 2)
  project_name: z.string().min(1, "Project name is required"),
  project_subtitle: z.string().min(1, "Project subtitle is required"),
  project_summary: z.string().min(1, "Project summary is required"),
  years_operating: z.string().min(1, "Years operating is required"),
  historical_portfolio_activity: z.string().min(1, "Historical portfolio activity is required"),
  assets_under_management: z.string().min(1, "Assets under management is required"),
  realized_projects: z.string().min(1, "Number of realized projects is required"),
  rc_brown_capital_offerings: z.string().min(1, "RC Brown Capital offerings is required"),
});

const step3Schema = baseProjectUploadSchema.extend({
  // Project Consideration (Step 3)
  business_plan_ratings: z.any().optional(),
  definitions_document: z.any().optional(),
  deal_snapshots: z.any().optional(),
  risk_considerations: z.any().optional(),
});

const step4Schema = baseProjectUploadSchema.extend({
  // The Deal (Step 4) - Key Deal Points
  key_deal_points: z.any().optional(),

  // The Deal (Step 4) - Property Details
  property_address: z.any().optional(),
  location_description: z.string().optional(),
  occupancy_status: z.string().optional(),
  about_property: z.string().optional(),
  detailed_project_description: z.string().optional(),
  anchor_tenant: z.string().optional(),
  anchor_tenant_details: z.string().optional(),
  anchor_buyer: z.string().optional(),
  anchor_buyer_details: z.string().optional(),
  percentage_leased: z.string().optional(),
  sq_ft_leased: z.string().optional(),

  // Backend expected fields for Step 4
  projected_valuation: z.number().optional(),
  timeline_of_completion_months: z.number().optional(),
  total_capital_required: z.number().optional(),
  total_debt_allocation_percent: z.number().optional(),
  debt_investment_tenure_months: z.number().optional(),
  projected_returns_equity_percent: z.number().optional(),
  total_equity_percent: z.number().optional(),
  properties: z.array(z.any()).optional(),
});

const step5Schema = baseProjectUploadSchema.extend({
  // Investment Returns (Step 5)
  investment_hold_period: z.string().optional(),
  acquisition_date: z.string().optional(),
  closing_date: z.string().optional(),
  target_exit_date_debt: z.string().optional(),
  target_exit_date_equity: z.string().optional(),
  business_plan_the_property: z.any().optional(),
  offer_live_date: z.string().optional(),
  offer_closing_date: z.string().optional(),
  funds_due_date: z.string().optional(),
  target_escrow_closing_date: z.string().optional(),
  targeted_distribution_start_date_debt: z.string().optional(),
  targeted_distribution_start_date_equity: z.string().optional(),
  funds_modification_notice: z.any().optional(),
  distributions_begin_date: z.string().optional(),
  distribution_frequency: z.string().optional(),
});

const step6Schema = baseProjectUploadSchema.extend({
  // The Sponsor (Step 6)
  sponsor_background: z.string().min(1, "Sponsor background is required"),
  years_in_operation: z.number().min(0, "Years in operation must be at least 0"),
  historical_portfolio_activity_amount: z.number().min(0, "Historical portfolio activity amount must be at least 0"),
  asset_under_management_amount: z.number().min(0, "Asset under management amount must be at least 0"),
  total_square_feet_managed: z.number().min(0, "Total square feet managed must be at least 0"),
  deals_funded_by_rc_brown: z.number().min(0, "Deals funded by RC Brown must be at least 0"),
  number_properties_under_management: z.number().min(0, "Number of properties under management must be at least 0"),
  total_realized_projects: z.number().min(0, "Total realized projects must be at least 0"),
  number_properties_developed: z.number().min(0, "Number of properties developed must be at least 0"),
  number_properties_built_sold: z.number().min(0, "Number of properties built/sold must be at least 0"),
  highest_budget_for_project: z.number().min(0, "Highest budget for project must be at least 0"),
  average_length_of_completion_months: z.number().min(1, "Average length of completion must be at least 1 month"),
  track_record_documents: z.array(z.any()).min(1, "At least one track record document is required"),
});

const step7Schema = baseProjectUploadSchema.extend({
  // Physical Descriptions (Step 7)
  physical_descriptions: z
    .array(
      z.object({
        description_title: z.string().min(1, "Description title is required"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .min(1, "At least one physical description is required"),
  site_documents: z
    .object({
      floor_plan: z.array(z.any()).min(1, "At least one floor plan document is required"),
      survey_plan: z.array(z.any()).min(1, "At least one survey plan document is required"),
      site_plan: z.array(z.any()).min(1, "At least one site plan document is required"),
      stacking_plan: z.array(z.any()).min(1, "At least one stacking plan document is required"),
      others: z.array(z.any()).optional(),
    })
    .optional(),
  closing_documents: z
    .array(
      z.object({
        document_name: z.string().min(1, "Document name is required"),
        files: z.array(z.any()).min(1, "At least one file is required"),
      })
    )
    .min(1, "At least one closing document is required")
    .optional(),
  offering_information: z
    .array(
      z.object({
        document_name: z.string().min(1, "Document name is required"),
        files: z.array(z.any()).min(1, "At least one file is required"),
      })
    )
    .min(1, "At least one offering information document is required")
    .optional(),
});

const step8Schema = baseProjectUploadSchema.extend({
  // Investment Structure (Step 8)
  investment_structure_preamble: z.any().optional(),
  what_are_you_offering: z.string().optional(),
  offer_details_table: z.any().optional(),
  debt_details_form: z.any().optional(),
  expenses_revenue_form: z.any().optional(),
  equity_details_form: z.any().optional(),
});

const step9Schema = baseProjectUploadSchema.extend({
  // Budget Sheet (Step 9)
  budget_tabs: z.any().optional(),
  budget_table: z.any().optional(),
});

const step10Schema = baseProjectUploadSchema.extend({
  // Expenses & Revenue (Step 10)
  media_assets_upload: z.any().optional(),
  fund_wallet: z.any().optional(),
  acknowledge_sign_docs: z.any().optional(),
});

// Function to get the appropriate validation schema based on step
function getStepValidationSchema(step: number) {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    case 4:
      return step4Schema;
    case 5:
      return step5Schema;
    case 6:
      return step6Schema;
    case 7:
      return step7Schema;
    case 8:
      return step8Schema;
    case 9:
      return step9Schema;
    case 10:
      return step10Schema;
    default:
      return baseProjectUploadSchema;
  }
}

// Full validation schema for project upload data (for backward compatibility)
const projectUploadSchema = z.object({
  // Sponsor Info (Step 1)
  currency: z.string().min(1, "Project currency is required"),
  sponsor_name: z
    .string()
    .min(2, "Sponsor name must be at least 2 characters")
    .max(100, "Sponsor name must not exceed 100 characters"),
  sponsor_logo: z
    .any()
    .refine((val) => val && (Array.isArray(val) ? val.length > 0 : true), "Sponsor logo is required"),

  // Project Overview (Step 2)
  project_name: z.string().optional(),
  project_subtitle: z.string().optional(),
  project_summary: z.string().optional(),
  years_operating: z.string().optional(),
  historical_portfolio_activity: z.string().optional(),
  assets_under_management: z.string().optional(),
  number_of_realized_projects: z.string().optional(),
  rc_brown_capital_offerings: z.string().optional(),

  // Project Consideration (Step 3)
  business_plan_ratings: z.any().optional(),
  definitions_document: z.any().optional(),
  deal_snapshots: z.any().optional(),
  risk_considerations: z.any().optional(),

  // The Deal (Step 4) - Key Deal Points
  key_deal_points: z.any().optional(),

  // The Deal (Step 4) - Property Details
  property_address: z.any().optional(),
  location_description: z.string().optional(),
  occupancy_status: z.string().optional(),
  about_property: z.string().optional(),
  detailed_project_description: z.string().optional(),
  anchor_tenant: z.string().optional(),
  anchor_tenant_details: z.string().optional(),
  anchor_buyer: z.string().optional(),
  anchor_buyer_details: z.string().optional(),
  percentage_leased: z.string().optional(),
  sq_ft_leased: z.string().optional(),

  // Backend expected fields for Step 4
  projected_valuation: z.number().optional(),
  timeline_of_completion_months: z.number().optional(),
  total_capital_required: z.number().optional(),
  total_debt_allocation_percent: z.number().optional(),
  debt_investment_tenure_months: z.number().optional(),
  projected_returns_equity_percent: z.number().optional(),
  total_equity_percent: z.number().optional(),
  properties: z.array(z.any()).optional(),

  // Investment Returns (Step 5)
  investment_hold_period: z.string().optional(),
  acquisition_date: z.string().optional(),
  closing_date: z.string().optional(),
  target_exit_date_debt: z.string().optional(),
  target_exit_date_equity: z.string().optional(),
  business_plan_the_property: z.any().optional(),
  offer_live_date: z.string().optional(),
  offer_closing_date: z.string().optional(),
  funds_due_date: z.string().optional(),
  target_escrow_closing_date: z.string().optional(),
  targeted_distribution_start_date_debt: z.string().optional(),
  targeted_distribution_start_date_equity: z.string().optional(),
  funds_modification_notice: z.any().optional(),
  distributions_begin_date: z.string().optional(),
  distribution_frequency: z.string().optional(),

  // The Sponsor (Step 6)
  sponsor_background: z.string().optional(),
  years_in_operation: z.number().optional(),
  historical_portfolio_activity_amount: z.number().optional(),
  asset_under_management_amount: z.number().optional(),
  total_square_feet_managed: z.number().optional(),
  deals_funded_by_rc_brown: z.number().optional(),
  number_properties_under_management: z.number().optional(),
  total_realized_projects: z.number().optional(),
  number_properties_developed: z.number().optional(),
  number_properties_built_sold: z.number().optional(),
  highest_budget_for_project: z.number().optional(),
  average_length_of_completion_months: z.number().optional(),
  track_record_documents: z.array(z.any()).optional(),

  // Physical Descriptions (Step 7)
  physical_descriptions: z
    .array(
      z.object({
        description_title: z.string().min(1, "Description title is required"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .optional(),
  site_documents: z
    .object({
      floor_plan: z.array(z.any()).min(1, "At least one floor plan document is required"),
      survey_plan: z.array(z.any()).min(1, "At least one survey plan document is required"),
      site_plan: z.array(z.any()).min(1, "At least one site plan document is required"),
      stacking_plan: z.array(z.any()).min(1, "At least one stacking plan document is required"),
      others: z.array(z.any()).optional(),
    })
    .optional(),
  closing_documents: z
    .array(
      z.object({
        document_name: z.string().min(1, "Document name is required"),
        files: z.array(z.any()).min(1, "At least one file is required"),
      })
    )
    .min(1, "At least one closing document is required")
    .optional(),
  offering_information: z
    .array(
      z.object({
        document_name: z.string().min(1, "Document name is required"),
        files: z.array(z.any()).min(1, "At least one file is required"),
      })
    )
    .min(1, "At least one offering information document is required")
    .optional(),

  // Investment Structure (Step 8)
  investment_structure_preamble: z.any().optional(),
  what_are_you_offering: z.string().optional(),
  offer_details_table: z.any().optional(),
  debt_details_form: z.any().optional(),
  expenses_revenue_form: z.any().optional(),
  equity_details_form: z.any().optional(),

  // Budget Sheet (Step 9)
  budget_tabs: z.any().optional(),
  budget_table: z.any().optional(),

  // Expenses & Revenue (Step 10)
  media_assets_upload: z.any().optional(),
  fund_wallet: z.any().optional(),
  acknowledge_sign_docs: z.any().optional(),
});

export { projectUploadSchema };
export type ProjectUploadInput = z.infer<typeof projectUploadSchema>;

// Union type for all step-specific schemas
export type ProjectUploadStepInput =
  | z.infer<typeof step1Schema>
  | z.infer<typeof step2Schema>
  | z.infer<typeof step3Schema>
  | z.infer<typeof step4Schema>
  | z.infer<typeof step5Schema>
  | z.infer<typeof step6Schema>
  | z.infer<typeof step7Schema>
  | z.infer<typeof step8Schema>
  | z.infer<typeof step9Schema>
  | z.infer<typeof step10Schema>;

/**
 * Save project upload step data
 * @param step - The step number (1-10 for project upload sections)
 * @param data - The form data to save
 * @param token - Authentication token
 * @returns Promise with success/error response
 */
export async function saveProjectUploadStep(
  step: number,
  data: ProjectUploadInput,
  token: string,
  projectId?: number
): Promise<{
  success?: ProjectUploadApiResponse | ProjectUploadStepResponse;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
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

    // Get step-specific validation schema
    const stepSchema = getStepValidationSchema(step);

    // Filter data to only include fields relevant to the current step
    const stepFields = Object.keys(stepSchema.shape);
    const filteredData = Object.fromEntries(Object.entries(cleanedData).filter(([key]) => stepFields.includes(key)));

    const validatedFields = stepSchema.safeParse(filteredData);

    if (!validatedFields.success) {
      return {
        error: "Invalid input data",
        fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { data: validatedData } = validatedFields;

    // Determine if we need to use FormData (for file uploads)
    const hasFiles = hasFileFields(validatedData);
    let requestData: FormData | ProjectUploadStepInput;
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

    // Use different endpoint for step 1 (sponsor info)
    let endpoint: string;
    // let responseType: "ProjectUploadApiResponse" | "ProjectUploadStepResponse";

    if (step === 1) {
      endpoint = `${BASE_URL}/api/sponsor-projects/start`;
      // responseType = "ProjectUploadApiResponse";
    } else {
      if (!projectId) {
        throw new Error("Project ID is required for steps 2-10");
      }
      endpoint = `${BASE_URL}/api/sponsor-projects/${projectId}/save-step/${step}`;
      // responseType = "ProjectUploadStepResponse";
    }

    const response = await axios.post<ProjectUploadApiResponse | ProjectUploadStepResponse>(endpoint, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(contentType === "application/json" && { "Content-Type": "application/json" }),
      },
    });
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
 * Get current project upload data
 * @param token - Authentication token
 * @returns Promise with project upload data
 */
export async function getProjectUpload(token: string): Promise<{ success?: ProjectUploadData; error?: string }> {
  try {
    const response = await axios.get<{ data: ProjectUploadData }>(`${BASE_URL}/api/sponsor-projects/project-upload`, {
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
 * Upload project document
 * @param projectId - Project ID
 * @param file - File to upload
 * @param category - Document category
 * @param subcategory - Document subcategory (optional)
 * @param documentName - Document name (optional)
 * @param fileType - File type
 * @param notes - Notes (optional)
 * @param token - Authentication token
 */
export async function uploadProjectDocument(
  projectId: number,
  file: File,
  category: "site_documents" | "closing_documents" | "offering_information" | "sponsor_information" | "additional",
  fileType: string,
  token: string,
  subcategory?: string,
  documentName?: string,
  notes?: string
): Promise<{ success?: ProjectDocument; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("file_type", fileType);

    if (subcategory) {
      formData.append("subcategory", subcategory);
    }
    if (documentName) {
      formData.append("document_name", documentName);
    }
    if (notes) {
      formData.append("notes", notes);
    }

    const response = await axios.post<{ data: ProjectDocument }>(
      `${BASE_URL}/api/sponsor-projects/project-upload/${projectId}/documents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: response.data.data };
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
 * Get project documents
 * @param projectId - Project ID
 * @param token - Authentication token
 */
export async function getProjectDocuments(
  projectId: number,
  token: string
): Promise<{ success?: ProjectDocument[]; error?: string }> {
  try {
    const response = await axios.get<{ data: ProjectDocument[] }>(
      `${BASE_URL}/api/sponsor-projects/project-upload/${projectId}/documents`,
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
        error: response?.data?.message || "Failed to fetch documents",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Delete project document
 * @param projectId - Project ID
 * @param documentId - Document ID
 * @param token - Authentication token
 */
export async function deleteProjectDocument(
  projectId: number,
  documentId: number,
  token: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await axios.delete(`${BASE_URL}/api/sponsor-projects/project-upload/${projectId}/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Delete failed",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Add physical description
 * @param projectId - Project ID
 * @param descriptionTitle - Description title
 * @param description - Description text
 * @param token - Authentication token
 */
export async function addPhysicalDescription(
  projectId: number,
  descriptionTitle: string,
  description: string,
  token: string
): Promise<{ success?: PhysicalDescription; error?: string }> {
  try {
    const response = await axios.post<{ data: PhysicalDescription }>(
      `${BASE_URL}/api/sponsor-projects/project-upload/${projectId}/physical-descriptions`,
      {
        description_title: descriptionTitle,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return { success: response.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Failed to add physical description",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Get physical descriptions
 * @param projectId - Project ID
 * @param token - Authentication token
 */
export async function getPhysicalDescriptions(
  projectId: number,
  token: string
): Promise<{ success?: PhysicalDescription[]; error?: string }> {
  try {
    const response = await axios.get<{ data: PhysicalDescription[] }>(
      `${BASE_URL}/api/sponsor-projects/project-upload/${projectId}/physical-descriptions`,
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
        error: response?.data?.message || "Failed to fetch physical descriptions",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong" };
  }
}

/**
 * Delete physical description
 * @param projectId - Project ID
 * @param descriptionId - Description ID
 * @param token - Authentication token
 */
export async function deletePhysicalDescription(
  projectId: number,
  descriptionId: number,
  token: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await axios.delete(
      `${BASE_URL}/api/sponsor-projects/project-upload/${projectId}/physical-descriptions/${descriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      return {
        error: response?.data?.message || "Delete failed",
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
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else if (typeof item === "object" && item !== null) {
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
