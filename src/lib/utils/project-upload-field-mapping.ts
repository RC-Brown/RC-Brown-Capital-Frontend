/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectUploadInput } from "@/src/services/project-upload";

/**
 * Field mapping configuration for project upload sections
 * Maps frontend form field names to backend API field names
 */
export const PROJECT_UPLOAD_FIELD_MAPPING = {
  // Sponsor Info (Step 1)
  project_currency: "currency",
  sponsor_name: "sponsor_name",
  sponsor_logo: "sponsor_logo",

  // Project Overview (Step 2)
  project_name: "project_name",
  project_subtitle: "project_subtitle",
  project_summary: "project_summary",
  years_operating: "years_operating",
  historical_portfolio_activity: "historical_portfolio_activity",
  assets_under_management: "assets_under_management",
  number_of_realized_projects: "realized_projects",
  rc_brown_capital_offerings: "rc_brown_capital_offerings",

  // Project Consideration (Step 3)
  business_plan_ratings: "business_plan_ratings",
  definitions_document: "definitions_document",
  deal_snapshots: "deal_snapshots",
  risk_considerations: "risk_considerations",

  // The Deal (Step 4) - Key Deal Points
  key_deal_points: "key_deal_points",

  // The Deal (Step 4) - Property Details
  property_address: "property_address",
  location_description: "location_description",
  occupancy_status: "occupancy",
  about_property: "about_property",
  detailed_project_description: "detailed_project_description",
  anchor_tenant: "has_anchor_tenant",
  anchor_tenant_details: "anchor_tenant_details",
  anchor_buyer: "has_anchor_buyer",
  anchor_buyer_details: "anchor_buyer_details",
  percentage_leased: "percent_leased",
  sq_ft_leased: "sq_ft_leased",

  // Investment Returns (Step 5)
  investment_hold_period: "investment_hold_period_years",
  acquisition_date: "acquisition_date",
  closing_date: "closing_date",
  target_exit_date_debt: "target_exit_date_debt",
  target_exit_date_equity: "target_exit_date_equity",
  business_plan_the_property: "business_plan_the_property",
  offer_live_date: "offer_live_date",
  offer_closing_date: "offer_closing_date",
  funds_due_date: "funds_due_date",
  target_escrow_closing_date: "target_escrow_closing_date",
  targeted_distribution_start_date_debt: "targeted_distribution_start_date",
  targeted_distribution_start_date_equity: "targeted_distribution_start_date",
  funds_modification_notice: "funds_modification_notice",
  distributions_begin_date: "distributions_anticipated_begin_date",
  distribution_frequency: "frequency_of_distributions",

  // The Sponsor (Step 6)
  sponsor_background: "sponsor_background",
  years_in_operation: "years_in_operation",
  historical_portfolio_activity_amount: "historical_portfolio_activity_amount",
  asset_under_management_amount: "asset_under_management_amount",
  total_square_feet_managed: "total_square_feet_managed",
  deals_funded_by_rc_brown: "deals_funded_by_rc_brown",
  number_properties_under_management: "number_properties_under_management",
  total_realized_projects: "total_realized_projects",
  number_properties_developed: "number_properties_developed",
  number_properties_built_sold: "number_properties_built_sold",
  highest_budget_for_project: "highest_budget_for_project",
  average_length_of_completion_months: "average_length_of_completion_months",
  track_record_documents: "track_record_documents",

  // Custom component field mappings for The Sponsor section
  sponsor_background_section: "sponsor_background_section",
  about_sponsor_section: "about_sponsor_section",
  sponsor_metrics: "sponsor_metrics",
  track_record_attachment: "track_record_attachment",

  // Physical Descriptions (Step 7)
  physical_descriptions: "physical_descriptions",
  site_documents: "site_documents",
  closing_documents: "closing_documents",
  offering_information: "offering_information",
  sponsor_information_docs: "sponsor_information_docs",

  // Investment Structure (Step 8)
  investment_structure_preamble: "investment_structure_preamble",
  what_are_you_offering: "what_are_you_offering",
  offer_details_table: "offer_details_table",
  debt_details_form: "debt_details_form",
  expenses_revenue_form: "expenses_revenue_form",
  equity_details_form: "equity_details_form",

  // Budget Sheet (Step 9)
  budget_tabs: "budget_tabs",
  budget_table: "budget_table",

  // Expenses & Revenue (Step 10)
  media_assets_upload: "media_assets_upload",
  fund_wallet: "fund_wallet",
  acknowledge_sign_docs: "acknowledge_sign_docs",

  // Common fields
  is_draft: "is_draft",
  current_step: "current_step",
  completed_steps: "completed_steps",
};

/**
 * Transform frontend form data to backend API format
 * @param formData - Frontend form data
 * @returns Backend API data
 */
export function transformFormToBackendData(formData: ProjectUploadInput): any {
  const backendData: any = {};

  Object.entries(formData).forEach(([frontendKey, value]) => {
    const backendKey = PROJECT_UPLOAD_FIELD_MAPPING[frontendKey as keyof typeof PROJECT_UPLOAD_FIELD_MAPPING];

    if (backendKey) {
      // Handle special transformations
      if (frontendKey === "anchor_tenant") {
        backendData[backendKey] = value === "yes";
      } else if (frontendKey === "anchor_buyer") {
        backendData[backendKey] = value === "yes";
      } else if (frontendKey === "percentage_leased") {
        backendData[backendKey] = parseFloat(value as string) || 0;
      } else if (frontendKey === "sq_ft_leased") {
        backendData[backendKey] = value as string;
      } else if (frontendKey === "investment_hold_period") {
        backendData[backendKey] = parseInt(value as string) || 0;
      } else if (
        frontendKey === "years_in_operation" ||
        frontendKey === "historical_portfolio_activity_amount" ||
        frontendKey === "asset_under_management_amount" ||
        frontendKey === "total_square_feet_managed" ||
        frontendKey === "deals_funded_by_rc_brown" ||
        frontendKey === "number_properties_under_management" ||
        frontendKey === "total_realized_projects" ||
        frontendKey === "number_properties_developed" ||
        frontendKey === "number_properties_built_sold" ||
        frontendKey === "highest_budget_for_project" ||
        frontendKey === "average_length_of_completion_months"
      ) {
        backendData[backendKey] = parseFloat(value as string) || 0;
      } else if (frontendKey === "key_deal_points" && typeof value === "object" && value !== null) {
        const keyDealPoints = value as Record<string, string>;
        if (keyDealPoints.projected_valuation) {
          backendData["projected_valuation"] = parseFloat(keyDealPoints.projected_valuation) || 0;
        }
        if (keyDealPoints.timeline_completion) {
          backendData["timeline_of_completion_months"] = parseInt(keyDealPoints.timeline_completion) || 0;
        }
        if (keyDealPoints.total_capital_required) {
          backendData["total_capital_required"] = parseFloat(keyDealPoints.total_capital_required) || 0;
        }
        if (keyDealPoints.total_debt_allocation) {
          backendData["total_debt_allocation_percent"] = parseFloat(keyDealPoints.total_debt_allocation) || 0;
        }
        if (keyDealPoints.debt_investment_tenure) {
          backendData["debt_investment_tenure_months"] = parseInt(keyDealPoints.debt_investment_tenure) || 0;
        }
        if (keyDealPoints.projected_returns_equity) {
          backendData["projected_returns_equity_percent"] = parseFloat(keyDealPoints.projected_returns_equity) || 0;
        }
        if (keyDealPoints.total_equity) {
          backendData["total_equity_percent"] = parseFloat(keyDealPoints.total_equity) || 0;
        }
        // Add any other fields as needed
      } else if (frontendKey === "sponsor_background_section" && typeof value === "string") {
        // SponsorBackgroundSection returns a simple string
        backendData["sponsor_background"] = value;
      } else if (frontendKey === "sponsor_metrics" && typeof value === "object" && value !== null) {
        // SponsorMetricsTable returns a complex object with individual metrics
        const metrics = value as Record<string, string>;

        // Map the metrics to backend fields
        if (metrics.yearsInOperation) {
          backendData["years_in_operation"] = parseInt(metrics.yearsInOperation) || 0;
        }
        if (metrics.historicalPortfolioActivity) {
          backendData["historical_portfolio_activity_amount"] = parseFloat(metrics.historicalPortfolioActivity) || 0;
        }
        if (metrics.projectsUnderManagement) {
          backendData["asset_under_management_amount"] = parseFloat(metrics.projectsUnderManagement) || 0;
        }
        if (metrics.totalSquareFeetManaged) {
          backendData["total_square_feet_managed"] = parseFloat(metrics.totalSquareFeetManaged) || 0;
        }
        if (metrics.dealsFundedByRC) {
          backendData["deals_funded_by_rc_brown"] = parseInt(metrics.dealsFundedByRC) || 0;
        }
        if (metrics.propertiesUnderManagement) {
          backendData["number_properties_under_management"] = parseInt(metrics.propertiesUnderManagement) || 0;
        }
        if (metrics.totalRealizedProjects) {
          backendData["total_realized_projects"] = parseInt(metrics.totalRealizedProjects) || 0;
        }
        if (metrics.propertiesDeveloped) {
          backendData["number_properties_developed"] = parseInt(metrics.propertiesDeveloped) || 0;
        }
        if (metrics.propertiesBuiltAndSold) {
          backendData["number_properties_built_sold"] = parseInt(metrics.propertiesBuiltAndSold) || 0;
        }
        if (metrics.highestBudgetProject) {
          backendData["highest_budget_for_project"] = parseFloat(metrics.highestBudgetProject) || 0;
        }
        if (metrics.averageCompletionLength) {
          backendData["average_length_of_completion_months"] = parseInt(metrics.averageCompletionLength) || 0;
        }
      } else if (frontendKey === "sponsor_logo" && Array.isArray(value) && value.length > 0) {
        // Sponsor logo is an array of files, but we only need the first one
        backendData[backendKey] = value[0];
      } else if (frontendKey === "sponsor_logo" && value instanceof File) {
        // Sponsor logo is a File object
        backendData[backendKey] = value;
      } else if (frontendKey === "sponsor_logo" && Array.isArray(value)) {
        // Sponsor logo is an array of files
        backendData[backendKey] = value;
      } else if (frontendKey === "track_record_attachment" && value instanceof File) {
        // Track record attachment is a File object
        backendData["track_record_documents"] = [value];
      } else if (frontendKey === "track_record_attachment" && Array.isArray(value)) {
        // Track record attachment is an array of files
        backendData["track_record_documents"] = value;
      } else if (frontendKey === "sponsor_information_docs" && typeof value === "object" && value !== null) {
        // SponsorInformationDocs returns { trackRecord?: File; additionalDocs?: SponsorDocument[] }
        const sponsorDocs = value as { trackRecord?: File; additionalDocs?: Array<{ file?: File }> };

        const trackRecordFiles: File[] = [];

        // Add track record file if it exists
        if (sponsorDocs.trackRecord) {
          trackRecordFiles.push(sponsorDocs.trackRecord);
        }

        // Add additional docs files if they exist
        if (sponsorDocs.additionalDocs) {
          sponsorDocs.additionalDocs.forEach((doc) => {
            if (doc.file) {
              trackRecordFiles.push(doc.file);
            }
          });
        }

        if (trackRecordFiles.length > 0) {
          backendData["track_record_documents"] = trackRecordFiles;
        }
      } else if (frontendKey === "physical_descriptions" && Array.isArray(value)) {
        // PhysicalDescriptionsTabs returns an array of { description_title: string, description: string }
        const physicalDescriptions = value as Array<{ description_title: string; description: string }>;

        // Filter out empty descriptions and map to backend format
        const validDescriptions = physicalDescriptions.filter(
          (desc) => desc.description_title && desc.description && desc.description.trim() !== ""
        );

        if (validDescriptions.length > 0) {
          backendData[backendKey] = validDescriptions;
        }
      } else if (frontendKey === "site_documents" && typeof value === "object" && value !== null) {
        // SiteDocumentsUpload returns an object with floor_plan, survey_plan, site_plan, stacking_plan, others arrays
        const siteDocuments = value as {
          floor_plan: File[];
          survey_plan: File[];
          site_plan: File[];
          stacking_plan: File[];
          others: File[];
        };

        // Map to backend format
        backendData[backendKey] = siteDocuments;
      } else if (frontendKey === "closing_documents" && Array.isArray(value)) {
        // ClosingDocuments returns an array of { document_name: string, files: File[] }
        const closingDocuments = value as Array<{ document_name: string; files: File[] }>;

        // Filter out empty documents and map to backend format
        const validDocuments = closingDocuments.filter((doc) => doc.document_name && doc.files && doc.files.length > 0);

        if (validDocuments.length > 0) {
          backendData[backendKey] = validDocuments;
        }
      } else if (frontendKey === "offering_information" && Array.isArray(value)) {
        // OfferingInformation returns an array of { document_name: string, files: File[] }
        const offeringDocuments = value as Array<{ document_name: string; files: File[] }>;

        // Filter out empty documents and map to backend format
        const validDocuments = offeringDocuments.filter(
          (doc) => doc.document_name && doc.files && doc.files.length > 0
        );

        if (validDocuments.length > 0) {
          backendData[backendKey] = validDocuments;
        }
      } else {
        backendData[backendKey] = value;
      }
    }
  });

  // Special handling for Step 4 - Create properties array
  // Temporarily disabled due to backend issues
  // if (formData.property_address || formData.location_description || formData.occupancy_status) {
  //   const property = {
  //     property_address: formData.property_address || "",
  //     location_description: formData.location_description || "",
  //     occupancy: formData.occupancy_status || "",
  //     about_the_property: formData.about_property || "",
  //     detailed_project_description: formData.detailed_project_description || "",
  //     sponsors_intention: formData.detailed_project_description || "", // Using same field for now
  //     has_anchor_tenant: formData.anchor_tenant === "yes",
  //     anchor_tenant_details: formData.anchor_tenant_details || "",
  //     has_anchor_buyer: formData.anchor_buyer === "yes",
  //     anchor_buyer_details: formData.anchor_buyer_details || "",
  //     percent_leased: formData.percentage_leased || "",
  //     sq_ft_leased: formData.sq_ft_leased || "",
  //   };

  //   backendData.properties = [property];
  // }

  return backendData;
}

/**
 * Transform backend API data to frontend form format
 * @param backendData - Backend API data
 * @returns Frontend form data
 */
export function transformBackendToFormData(backendData: any): ProjectUploadInput {
  const formData: any = {};

  Object.entries(PROJECT_UPLOAD_FIELD_MAPPING).forEach(([frontendKey, backendKey]) => {
    const value = backendData[backendKey];

    if (value !== undefined) {
      // Handle special transformations
      if (frontendKey === "anchor_tenant") {
        formData[frontendKey] = value ? "yes" : "no";
      } else if (frontendKey === "anchor_buyer") {
        formData[frontendKey] = value ? "yes" : "no";
      } else if (frontendKey === "percentage_leased" || frontendKey === "sq_ft_leased") {
        formData[frontendKey] = value?.toString() || "";
      } else if (frontendKey === "investment_hold_period") {
        formData[frontendKey] = value?.toString() || "";
      } else {
        formData[frontendKey] = value;
      }
    }
  });

  return formData as ProjectUploadInput;
}

/**
 * Get step-specific field mappings
 * @param step - Step number (1-10)
 * @returns Object with step-specific field mappings
 */
export function getStepFieldMapping(step: number): Record<string, string> {
  const stepMappings: Record<number, string[]> = {
    1: ["project_currency", "sponsor_name", "sponsor_logo"],
    2: [
      "project_name",
      "project_subtitle",
      "project_summary",
      "years_operating",
      "historical_portfolio_activity",
      "assets_under_management",
      "number_of_realized_projects",
      "rc_brown_capital_offerings",
    ],
    3: ["business_plan_ratings", "definitions_document", "deal_snapshots", "risk_considerations"],
    4: [
      "key_deal_points",
      "property_address",
      "location_description",
      "occupancy_status",
      "about_property",
      "detailed_project_description",
      "anchor_tenant",
      "anchor_tenant_details",
      "anchor_buyer",
      "anchor_buyer_details",
      "percentage_leased",
      "sq_ft_leased",
    ],
    5: [
      "investment_hold_period",
      "acquisition_date",
      "closing_date",
      "target_exit_date_debt",
      "target_exit_date_equity",
      "business_plan_the_property",
      "offer_live_date",
      "offer_closing_date",
      "funds_due_date",
      "target_escrow_closing_date",
      "targeted_distribution_start_date_debt",
      "targeted_distribution_start_date_equity",
      "funds_modification_notice",
      "distributions_begin_date",
      "distribution_frequency",
    ],
    6: ["sponsor_background_section", "about_sponsor_section", "sponsor_metrics", "track_record_attachment"],
    7: [
      "physical_descriptions",
      "site_documents",
      "closing_documents",
      "offering_information",
      "sponsor_information_docs",
    ],
    8: [
      "investment_structure_preamble",
      "what_are_you_offering",
      "offer_details_table",
      "debt_details_form",
      "expenses_revenue_form",
      "equity_details_form",
    ],
    9: ["budget_tabs", "budget_table"],
    10: ["media_assets_upload", "fund_wallet", "acknowledge_sign_docs"],
  };

  const stepFields = stepMappings[step] || [];
  const stepMapping: Record<string, string> = {};

  stepFields.forEach((field) => {
    const backendField = PROJECT_UPLOAD_FIELD_MAPPING[field as keyof typeof PROJECT_UPLOAD_FIELD_MAPPING];
    if (backendField) {
      stepMapping[field] = backendField;
    }
  });

  return stepMapping;
}
