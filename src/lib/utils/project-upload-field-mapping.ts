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
  // General Info
  offerings: "offerings",
  total_capitalization: "total_capitalization",
  sponsor_co_invest_range: "sponsor_co_invest_range",
  debt_allocation: "debt_allocation",
  equity_allocation: "equity_allocation",
  offer_deadline: "offer_deadline",
  location: "location",
  asset_type: "asset_type",
  strategy: "strategy",
  objective: "objective",

  // Debt Details
  debt_allocation_percent: "debt_allocation_percent",
  debt_distribution_period: "debt_distribution_period",
  debt_target_distribution_start_date: "debt_target_distribution_start_date",
  debt_minimum_investment_amount: "debt_minimum_investment_amount",
  debt_maximum_investment_amount: "debt_maximum_investment_amount",
  debt_return_on_investment: "debt_return_on_investment",
  debt_expected_min_annual_return: "debt_expected_min_annual_return",
  debt_expected_max_annual_return: "debt_expected_max_annual_return",
  debt_target_hold_period_years: "debt_target_hold_period_years",
  debt_exit_date: "debt_exit_date",

  // Equity Details
  equity_allocation_percent: "equity_allocation_percent",
  equity_distribution_frequency: "equity_distribution_frequency",
  equity_target_distribution_start_date: "equity_target_distribution_start_date",
  equity_minimum_investment: "equity_minimum_investment",
  equity_maximum_investment: "equity_maximum_investment",
  equity_return_on_investment: "equity_return_on_investment",
  equity_expected_min_return: "equity_expected_min_return",
  equity_expected_max_return: "equity_expected_max_return",
  equity_target_hold_period_years: "equity_target_hold_period_years",
  equity_exit_date: "equity_exit_date",

  // Expenses
  expenses_taxes: "expenses_taxes",
  expenses_insurance: "expenses_insurance",
  expenses_management: "expenses_management",
  expenses_repairs: "expenses_repairs",
  expenses_utilities: "expenses_utilities",
  expenses_interest: "expenses_interest",
  expenses_total: "expenses_total",
  expenses_total_rental_income: "expenses_total_rental_income",
  expenses_additional: "expenses_additional",

  // Budget Sheet (Step 9)
  budget_sheet_property_address: "budget_sheet_property_address",
  city: "city",
  state: "state",
  zip_code: "zip_code",
  in_depth_description_of_work: "in_depth_description_of_work",
  project_timeline_months: "project_timeline_months",
  adding_square_footage: "adding_square_footage",
  square_footage_expansion_plan: "square_footage_expansion_plan",
  budget_items: "budget_items",

  // Media and Acknowledgement (Step 10)
  picture_uploads: "picture_uploads",
  slides_uploads: "slides_uploads",
  video_uploads: "video_uploads",
  fund_wallet_amount: "fund_wallet_amount",
  signed_acknowledgement_form: "signed_acknowledgement_form",

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
  // Transform form data to backend format

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
        // Map all required fields with proper validation
        backendData["projected_valuation"] = parseFloat(keyDealPoints.projected_valuation) || 0;
        backendData["timeline_of_completion_months"] = parseInt(keyDealPoints.timeline_completion?.split("_")[0]) || 0;
        backendData["total_capital_required"] = parseFloat(keyDealPoints.total_capital_required) || 0;
        backendData["total_debt_allocation_percent"] = parseFloat(keyDealPoints.total_debt_allocation) || 0;
        backendData["debt_investment_tenure"] = keyDealPoints.debt_investment_tenure || "";
        backendData["debt_yield_percent"] = parseFloat(keyDealPoints.percentage_yield_debt) || 0;
        backendData["debt_periodic_payment"] = keyDealPoints.periodic_payments === "yes" ? "monthly" : "at_maturity";
        backendData["equity_investment_tenure"] = keyDealPoints.equity_investment_tenure || "";
        backendData["projected_returns_equity_percent"] = parseFloat(keyDealPoints.projected_returns_equity) || 0;
        backendData["equity_periodic_payment"] = keyDealPoints.periodic_payments === "yes" ? "monthly" : "at_maturity";
        backendData["total_equity_allocation"] = parseFloat(keyDealPoints.total_equity) || 0;
      } else if (
        frontendKey === "acquisition_date" ||
        frontendKey === "closing_date" ||
        frontendKey === "target_exit_date_debt" ||
        frontendKey === "target_exit_date_equity" ||
        frontendKey === "offer_live_date" ||
        frontendKey === "offer_closing_date" ||
        frontendKey === "funds_due_date" ||
        frontendKey === "target_escrow_closing_date" ||
        frontendKey === "targeted_distribution_start_date_debt" ||
        frontendKey === "targeted_distribution_start_date_equity" ||
        frontendKey === "distributions_begin_date"
      ) {
        // Ensure dates are in the correct format (YYYY-MM-DD)
        try {
          if (!value) {
            backendData[backendKey] = null;
          } else {
            // If value is already in YYYY-MM-DD format, use it directly
            if (/^\d{4}-\d{2}-\d{2}$/.test(value as string)) {
              backendData[backendKey] = value;
            } else {
              // Try to parse and format the date
              const date = new Date(value as string);
              if (isNaN(date.getTime())) {
                backendData[backendKey] = null;
              } else {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                backendData[backendKey] = `${year}-${month}-${day}`;
              }
            }
          }
        } catch (error) {
          console.error(`Error formatting date for ${frontendKey}:`, error);
          backendData[backendKey] = null;
        }
      } else if (frontendKey === "investment_hold_period") {
        // Ensure investment hold period is an integer
        backendData[backendKey] = parseInt(value as string) || 1;
      } else if (frontendKey === "distribution_frequency") {
        // Validate distribution frequency matches backend enum
        const validFrequencies = ["monthly", "quarterly", "annually", "at_maturity"];
        backendData[backendKey] = validFrequencies.includes(value as string) ? value : "monthly";
      } else if (frontendKey === "sponsor_background_section" && typeof value === "string") {
        // SponsorBackgroundSection returns a simple string
        backendData["sponsor_background"] = value || "";
      } else if (frontendKey === "sponsor_metrics" && typeof value === "object" && value !== null) {
        // SponsorMetricsTable returns a complex object with individual metrics
        const metrics = value as Record<string, string>;

        // Map all required fields exactly as backend expects
        backendData["sponsor_background"] = backendData["sponsor_background"] || ""; // Ensure this exists
        backendData["years_in_operation"] = parseInt(metrics.yearsInOperation) || 0;
        backendData["historical_portfolio_activity_amount"] = parseFloat(metrics.historicalPortfolioActivity || "0");
        backendData["asset_under_management_amount"] = parseFloat(metrics.projectsUnderManagement || "0");
        backendData["total_square_feet_managed"] = parseFloat(metrics.totalSquareFeetManaged || "0");
        backendData["deals_funded_by_rc_brown"] = parseInt(metrics.dealsFundedByRC) || 0;
        backendData["number_properties_under_management"] = parseInt(metrics.propertiesUnderManagement) || 0;
        backendData["total_realized_projects"] = parseInt(metrics.totalRealizedProjects) || 0;
        backendData["number_properties_developed"] = parseInt(metrics.propertiesDeveloped) || 0;
        backendData["number_properties_built_sold"] = parseInt(metrics.propertiesBuiltAndSold) || 0;
        backendData["highest_budget_for_project"] = parseFloat(metrics.highestBudgetProject || "0");
        backendData["average_length_of_completion_months"] = parseInt(metrics.averageCompletionLength) || 0;
      } else if (frontendKey === "track_record_attachment") {
        // Handle track record documents (required field)

        let files: File[] = [];

        if (value instanceof File) {
          files = [value];
        } else if (Array.isArray(value)) {
          // Filter out empty objects and ensure we have actual File objects
          files = value.filter((file): file is File => {
            return file instanceof File || (file && typeof file === "object" && Object.keys(file).length > 0);
          });
        }

        // Ensure we have at least one file as it's required
        if (files.length > 0) {
          backendData["track_record_documents"] = files;
        } else {
          console.warn("track_record_documents is required but no valid files were provided");
          // Since this is required, provide a default empty array
          backendData["track_record_documents"] = [];
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

        // Filter out empty descriptions and ensure required fields
        const validDescriptions = physicalDescriptions
          .filter((desc) => desc.description_title && desc.description && desc.description.trim() !== "")
          .map((desc) => ({
            description_title: desc.description_title.trim(),
            description: desc.description.trim(),
          }));

        // Backend requires at least one description
        backendData[backendKey] =
          validDescriptions.length > 0
            ? validDescriptions
            : [
                {
                  description_title: "General Description",
                  description: "Property description pending",
                },
              ];
      } else if (frontendKey === "site_documents" && typeof value === "object" && value !== null) {
        // SiteDocumentsUpload returns an object with floor_plan, survey_plan, site_plan, stacking_plan, others arrays
        const siteDocuments = value as {
          floor_plan: File[];
          survey_plan: File[];
          site_plan: File[];
          stacking_plan: File[];
          others: File[];
        };

        // Filter out empty arrays and ensure files are valid
        const validatedDocs = Object.entries(siteDocuments).reduce(
          (acc, [key, files]) => {
            if (Array.isArray(files)) {
              const validFiles = files.filter((file) => file instanceof File);
              if (validFiles.length > 0) {
                acc[key] = validFiles;
              }
            }
            return acc;
          },
          {} as Record<string, File[]>
        );

        // Backend requires at least one document category
        backendData[backendKey] =
          Object.keys(validatedDocs).length > 0
            ? validatedDocs
            : {
                others: [], // Provide empty array for optional category
              };
      } else if (frontendKey === "closing_documents" && Array.isArray(value)) {
        // ClosingDocuments returns an array of { document_name: string, files: File[] }
        const closingDocuments = value as Array<{ document_name: string; files: File[] }>;

        // Filter out empty documents and ensure files are valid
        const validDocuments = closingDocuments
          .filter((doc) => doc.document_name && doc.files && doc.files.length > 0)
          .map((doc) => ({
            document_name: doc.document_name,
            files: doc.files.filter((file) => file instanceof File),
          }))
          .filter((doc) => doc.files.length > 0);

        // Backend expects this to be nullable
        if (validDocuments.length > 0) {
          backendData[backendKey] = validDocuments;
        }
      } else if (frontendKey === "offering_information" && Array.isArray(value)) {
        // OfferingInformation returns an array of { document_name: string, files: File[] }
        const offeringDocuments = value as Array<{ document_name: string; files: File[] }>;

        // Filter out empty documents and ensure files are valid
        const validDocuments = offeringDocuments
          .filter((doc) => doc.document_name && doc.files && doc.files.length > 0)
          .map((doc) => ({
            document_name: doc.document_name,
            files: doc.files.filter((file) => file instanceof File),
          }))
          .filter((doc) => doc.files.length > 0);

        // Backend expects this to be nullable
        if (validDocuments.length > 0) {
          backendData[backendKey] = validDocuments;
        }
      } else if (frontendKey === "project_timeline_months") {
        backendData[backendKey] = parseInt(value as string) || 1;
      } else if (frontendKey === "adding_square_footage") {
        backendData[backendKey] = value === true || value === "true";
      } else if (frontendKey === "budget_items" && Array.isArray(value)) {
        // Transform budget items array
        backendData[backendKey] = value.map((item) => ({
          line_item: item.line_item || "",
          description: item.description || "",
          scope_of_work: item.scope_of_work || "",
          budget_amount: parseFloat(item.budget_amount?.toString() || "0") || 0,
        }));
      } else if (
        frontendKey === "picture_uploads" ||
        frontendKey === "slides_uploads" ||
        frontendKey === "video_uploads"
      ) {
        // Handle file uploads - pass the File objects directly
        if (Array.isArray(value) && value.length > 0) {
          backendData[backendKey] = value;
        }
      } else if (frontendKey === "fund_wallet_amount") {
        // Convert fund wallet amount to number
        backendData[backendKey] = parseFloat(value as string) || 0;
      } else if (frontendKey === "signed_acknowledgement_form") {
        // Handle signed acknowledgement form file
        if (value instanceof File) {
          backendData[backendKey] = value;
        }
      } else {
        backendData[backendKey] = value;
      }
    }
  });

  // Special handling for Step 4 - Create properties array
  if (formData.property_address || formData.location_description || formData.occupancy_status) {
    const property = {
      property_address: formData.property_address || "",
      location_description: formData.location_description || "",
      occupancy: formData.occupancy_status || "",
      about_property: formData.about_property || "",
      detailed_project_description: formData.detailed_project_description || "",
      has_anchor_tenant: formData.anchor_tenant === "yes",
      anchor_tenant_details: formData.anchor_tenant_details || "",
      has_anchor_buyer: formData.anchor_buyer === "yes",
      anchor_buyer_details: formData.anchor_buyer_details || "",
      percent_leased: parseFloat(formData.percentage_leased as string) || 0,
      sq_ft_leased: formData.sq_ft_leased || "",
    };

    backendData.properties = [property];
  }

  // Handle key deal points financial data
  if (formData.key_deal_points && typeof formData.key_deal_points === "object") {
    const keyDealPoints = formData.key_deal_points as Record<string, string>;

    backendData.projected_valuation = parseFloat(keyDealPoints.projected_valuation) || 0;
    backendData.timeline_of_completion_months = parseInt(keyDealPoints.timeline_completion) || 0;
    backendData.total_capital_required = parseFloat(keyDealPoints.total_capital_required) || 0;
    backendData.total_debt_allocation_percent = parseFloat(keyDealPoints.total_debt_allocation) || 0;
    backendData.debt_investment_tenure = keyDealPoints.debt_investment_tenure || "";
    backendData.debt_yield_percent = parseFloat(keyDealPoints.debt_yield) || 0;
    backendData.debt_periodic_payment = keyDealPoints.debt_periodic_payment || "";
    backendData.equity_investment_tenure = keyDealPoints.equity_investment_tenure || "";
    backendData.projected_returns_equity_percent = parseFloat(keyDealPoints.projected_returns_equity) || 0;
    backendData.equity_periodic_payment = keyDealPoints.equity_periodic_payment || "";
    backendData.total_equity_allocation = parseFloat(keyDealPoints.total_equity) || 0;
  }

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
        formData[frontendKey] = parseInt(value?.toString() || "0");
      } else if (
        frontendKey === "acquisition_date" ||
        frontendKey === "closing_date" ||
        frontendKey === "target_exit_date_debt" ||
        frontendKey === "target_exit_date_equity" ||
        frontendKey === "offer_live_date" ||
        frontendKey === "offer_closing_date" ||
        frontendKey === "funds_due_date" ||
        frontendKey === "target_escrow_closing_date" ||
        frontendKey === "targeted_distribution_start_date_debt" ||
        frontendKey === "targeted_distribution_start_date_equity" ||
        frontendKey === "distributions_begin_date"
      ) {
        // Ensure dates are in the correct format (YYYY-MM-DD)
        try {
          if (!value) {
            formData[frontendKey] = "";
          } else {
            // If value is already in YYYY-MM-DD format, use it directly
            if (/^\d{4}-\d{2}-\d{2}$/.test(value.toString())) {
              formData[frontendKey] = value.toString();
            } else {
              // Try to parse and format the date
              const date = new Date(value.toString());
              if (isNaN(date.getTime())) {
                formData[frontendKey] = "";
              } else {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                formData[frontendKey] = `${year}-${month}-${day}`;
              }
            }
          }
        } catch (error) {
          console.error(`Error formatting date for ${frontendKey}:`, error);
          formData[frontendKey] = "";
        }
      } else if (frontendKey === "distribution_frequency") {
        // Ensure distribution frequency matches backend enum
        formData[frontendKey] = value || "monthly";
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
      // General Info
      "offerings",
      "total_capitalization",
      "sponsor_co_invest_range",
      "debt_allocation",
      "equity_allocation",
      "offer_deadline",
      "location",
      "asset_type",
      "strategy",
      "objective",

      // Debt Details
      "debt_allocation_percent",
      "debt_distribution_period",
      "debt_target_distribution_start_date",
      "debt_minimum_investment_amount",
      "debt_maximum_investment_amount",
      "debt_return_on_investment",
      "debt_expected_min_annual_return",
      "debt_expected_max_annual_return",
      "debt_target_hold_period_years",
      "debt_exit_date",

      // Equity Details
      "equity_allocation_percent",
      "equity_distribution_frequency",
      "equity_target_distribution_start_date",
      "equity_minimum_investment",
      "equity_maximum_investment",
      "equity_return_on_investment",
      "equity_expected_min_return",
      "equity_expected_max_return",
      "equity_target_hold_period_years",
      "equity_exit_date",

      // Expenses
      "expenses_taxes",
      "expenses_insurance",
      "expenses_management",
      "expenses_repairs",
      "expenses_utilities",
      "expenses_interest",
      "expenses_total",
      "expenses_total_rental_income",
      "expenses_additional",
    ],
    9: [
      "budget_sheet_property_address",
      "city",
      "state",
      "zip_code",
      "in_depth_description_of_work",
      "project_timeline_months",
      "adding_square_footage",
      "square_footage_expansion_plan",
      "budget_items",
    ],
    10: ["picture_uploads", "slides_uploads", "video_uploads", "fund_wallet_amount", "signed_acknowledgement_form"],
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
