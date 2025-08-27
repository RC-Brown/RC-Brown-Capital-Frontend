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
  years_of_active_operation: "years_of_active_operation",
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
  occupancy: "occupancy",
  about_property: "about_property",
  detailed_project_description: "detailed_project_description",
  anchor_tenant: "has_anchor_tenant",
  anchor_tenant_details: "anchor_tenant_details",
  anchor_buyer: "has_anchor_buyer",
  anchor_buyer_details: "anchor_buyer_details",
  has_anchor_tenant: "has_anchor_tenant",
  has_anchor_buyer: "has_anchor_buyer",
  percentage_leased: "percent_leased",
  percent_leased: "percent_leased",
  sq_ft_leased: "sq_ft_leased",

  // Investment Returns (Step 5)
  investment_hold_period: "investment_hold_period",
  acquisition_date: "acquisition_date",
  closing_date: "closing_date",
  target_exit_date_debt: "target_exit_date_debt",
  target_exit_date_equity: "target_exit_date_equity",
  business_plan_the_property: "business_plan_the_property",
  offer_live_date: "offer_live_date",
  offer_closing_date: "offer_closing_date",
  funds_due_date: "funds_due_date",
  target_escrow_closing_date: "target_escrow_closing_date",
  targeted_distribution_start_date_debt: "targeted_distribution_start_date_debt",
  targeted_distribution_start_date_equity: "targeted_distribution_start_date_equity",
  funds_modification_notice: "funds_modification_notice",
  distributions_begin_date: "distributions_anticipated_begin_date",
  distribution_frequency: "frequency_of_distributions",

  // The Sponsor (Step 6)
  sponsor_background: "sponsor_background",
  years_in_operation: "years_in_operation",
  historical_portfolio_activity_amount: "historical_portfolio_activity_amount",
  project_under_management_amount: "project_under_management_amount",
  total_square_feet_managed: "total_square_feet_managed",
  deals_funded_by_rc_brown: "deals_funded_by_rc_brown",
  number_properties_under_management: "number_of_properties_under_management",
  total_realized_projects: "total_number_of_realized_projects",
  number_properties_developed: "number_of_properties_developed",
  number_properties_built_sold: "number_of_properties_built_sold",
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

  // Step 8 specific fields that were missing
  investment_structure_preamble: "investment_structure_preamble",
  what_are_you_offering: "what_are_you_offering",
  offer_details_table: "offer_details_table",
  debt_details_form: "debt_details_form",
  expenses_revenue_form: "expenses_revenue_form",
  equity_details_form: "equity_details_form",
  sponsor_co_invest: "sponsor_co_invest",

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
      if (frontendKey === "signed_acknowledgement_form") {
        // Handle signed acknowledgement form file
        if (value instanceof File) {
          backendData[backendKey] = value;
        }
      } else if (frontendKey === "sponsor_logo") {
        // Handle sponsor logo file - extract first file from array
        console.log("🔍 [DEBUG] Processing sponsor_logo field:", {
          frontendKey,
          value,
          isArray: Array.isArray(value),
          length: Array.isArray(value) ? value.length : "N/A",
        });
        if (Array.isArray(value) && value.length > 0) {
          const firstFile = value[0];
          console.log("🔍 [DEBUG] First file in array:", {
            firstFile,
            isFile: firstFile instanceof File,
            type: typeof firstFile,
          });
          if (firstFile instanceof File) {
            backendData[backendKey] = firstFile;
            console.log("🔍 [DEBUG] Successfully set sponsor_logo file");
          } else {
            console.warn("⚠️ [WARNING] First item in sponsor_logo array is not a File:", firstFile);
          }
        } else {
          console.warn("⚠️ [WARNING] sponsor_logo value is not an array or is empty:", value);
        }
      } else if (
        frontendKey === "picture_uploads" ||
        frontendKey === "slides_uploads" ||
        frontendKey === "video_uploads"
      ) {
        // Handle media upload arrays - extract files from arrays
        if (Array.isArray(value) && value.length > 0) {
          const files = value.filter((item) => item instanceof File);
          if (files.length > 0) {
            backendData[backendKey] = files;
          }
        }
      } else if (
        frontendKey === "track_record_documents" ||
        frontendKey === "site_documents" ||
        frontendKey === "closing_documents" ||
        frontendKey === "offering_information"
      ) {
        // Handle document upload arrays - extract files from arrays
        if (Array.isArray(value) && value.length > 0) {
          const files = value.filter((item) => item instanceof File);
          if (files.length > 0) {
            backendData[backendKey] = files;
          }
        }
      } else if (frontendKey === "offer_details_table" && typeof value === "object" && value !== null) {
        // Handle offer_details_table - extract individual fields and map them to backend
        const offerDetails = value as Record<string, any>;

        // Map individual fields from offer_details_table to backend fields
        if (offerDetails.total_capitalization) {
          backendData["total_capitalization"] = offerDetails.total_capitalization;
        }
        if (offerDetails.debt_allocation) {
          backendData["debt_allocation"] = offerDetails.debt_allocation;
        }
        if (offerDetails.equity_allocation) {
          backendData["equity_allocation"] = offerDetails.equity_allocation;
        }
        if (offerDetails.sponsor_co_invest) {
          backendData["sponsor_co_invest"] = offerDetails.sponsor_co_invest;
        }
        if (offerDetails.offer_deadline) {
          backendData["offer_deadline"] = offerDetails.offer_deadline;
        }
        if (offerDetails.location) {
          backendData["location"] = offerDetails.location;
        }
        if (offerDetails.asset_type) {
          backendData["asset_type"] = offerDetails.asset_type;
        }
        if (offerDetails.strategy) {
          backendData["strategy"] = offerDetails.strategy;
        }
        if (offerDetails.objective) {
          backendData["objective"] = offerDetails.objective;
        }
      } else {
        // Regular field mapping
        backendData[backendKey] = value;
      }
    }
  });

  // Special handling for step 8 - transform to new backend format
  if (
    formData.what_are_you_offering ||
    formData.offer_details_table ||
    formData.debt_details_form ||
    formData.equity_details_form ||
    formData.expenses_revenue_form
  ) {
    const step8Data = transformStep8ToBackendFormat(formData);

    // Merge the transformed data into backendData
    Object.assign(backendData, step8Data);
  }

  // Special handling for step 9 - transform to new backend format
  if (formData.budget_tabs || formData.budget_table) {
    const transformedStep9Data = transformStep9ToBackendFormat(formData);

    // Merge the transformed data into backendData
    Object.assign(backendData, transformedStep9Data);
  }

  // Special handling for step 10 - transform to new backend format
  if (formData.media_assets_upload || formData.fund_wallet || formData.acknowledge_sign_docs) {
    const transformedStep10Data = transformStep10ToBackendFormat(formData);

    // Merge the transformed data into backendData
    Object.assign(backendData, transformedStep10Data);
  }

  // Ensure percent_leased is set at root level
  if (formData.percentage_leased !== undefined) {
    backendData.percent_leased = (formData.percentage_leased as string) || "";
  } else if (formData.properties && Array.isArray(formData.properties) && formData.properties.length > 0) {
    // Extract percent_leased from the first property if not provided directly
    const firstProperty = formData.properties[0];
    if (firstProperty && typeof firstProperty === "object") {
      backendData.percent_leased = firstProperty.percent_leased || "";
    }
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
      } else if (frontendKey === "has_anchor_tenant") {
        formData[frontendKey] = value;
      } else if (frontendKey === "has_anchor_buyer") {
        formData[frontendKey] = value;
      } else if (frontendKey === "percent_leased") {
        formData[frontendKey] = value;
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
            // Handle acquisition_date special case - convert back to q1_2025 format for frontend
            if (frontendKey === "acquisition_date" && /^\d{4}-\d{2}-\d{2}$/.test(value.toString())) {
              const date = new Date(value.toString());
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              // Convert month to quarter
              const quarter = Math.ceil(month / 3);
              formData[frontendKey] = `q${quarter}_${year}`;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(value.toString())) {
              // If value is already in YYYY-MM-DD format, use it directly
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
      } else if (frontendKey === "total_square_feet_managed") {
        // Parse string back to object format for SizeInput component
        if (typeof value === "string" && value.includes(" ")) {
          const parts = value.split(" ");
          const size = parts[0];
          const unit = parts.slice(1).join(" "); // Handle units with spaces like "sq ft"
          formData[frontendKey] = { size, unit };
        } else {
          formData[frontendKey] = value;
        }
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
      "years_of_active_operation",
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
      "occupancy",
      "about_property",
      "detailed_project_description",
      "anchor_tenant",
      "anchor_tenant_details",
      "anchor_buyer",
      "anchor_buyer_details",
      "has_anchor_tenant",
      "has_anchor_buyer",
      "percentage_leased",
      "percent_leased",
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

      // Step 8 specific fields that were missing
      "investment_structure_preamble",
      "what_are_you_offering",
      "offer_details_table",
      "debt_details_form",
      "expenses_revenue_form",
      "equity_details_form",
      "sponsor_co_invest",

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

/**
 * Transform step 8 data from source format to backend format
 */
export function transformStep8ToBackendFormat(sourceData: any): any {
  const offerDetailsTable = sourceData.offer_details_table || {};
  const debtDetailsForm = sourceData.debt_details_form || {};
  const equityDetailsForm = sourceData.equity_details_form || {};
  const expensesRevenueForm = sourceData.expenses_revenue_form || {};

  const transformOfferings = (offering: string): string => {
    if (!offering) return "both";
    if (offering === "both_equity_and_debt") return "both";
    if (offering === "equity_only") return "equity";
    if (offering === "debt_only") return "debt";
    return "both";
  };

  const transformSponsorCoInvest = (coInvest: string): string => {
    if (!coInvest) return "0%";
    if (coInvest === "<=5.0") return "0% - 5%";
    if (coInvest === "5.1-10.0") return "5.1% - 10%";
    if (coInvest === "10.1-15.0") return "10.1% - 15%";
    if (coInvest === "15.1-20.0") return "15.1% - 20%";
    if (coInvest === ">20.0") return ">20%";
    return coInvest;
  };

  const totalCapitalization = parseFloat(offerDetailsTable.total_capitalization || "0");
  const debtAllocationPercent = parseFloat(offerDetailsTable.debt_allocation || "0");
  const equityAllocationPercent = parseFloat(offerDetailsTable.equity_allocation || "0");

  const debtAmount = (debtAllocationPercent / 100) * totalCapitalization;
  const equityAmount = (equityAllocationPercent / 100) * totalCapitalization;

  const backendData = {
    offerings: transformOfferings(sourceData.what_are_you_offering),
    total_capitalization: offerDetailsTable.total_capitalization || "0",
    sponsor_co_invest_range: transformSponsorCoInvest(offerDetailsTable.sponsor_co_invest),
    debt_allocation_percent: `${offerDetailsTable.debt_allocation || "0"}%`,
    equity_allocation_percent: `${offerDetailsTable.equity_allocation || "0"}%`,
    offer_deadline: offerDetailsTable.offer_deadline || "",
    location: offerDetailsTable.location || "",
    asset_type: offerDetailsTable.asset_type || "",
    strategy: offerDetailsTable.strategy || "",
    objective: offerDetailsTable.objective || "",
    debt_details: {
      amount: debtAmount.toString(),
      distribution_period: debtDetailsForm.distribution_period || "annually",
      target_distribution_start_date: debtDetailsForm.target_distribution_start || "",
      minimum_investment_amount: debtDetailsForm.min_investment_amount || "0",
      maximum_investment_amount: debtDetailsForm.max_investment_amount || "0",
      maximum_return_on_investment_percent: `${debtDetailsForm.max_return_on_investment || "0"}%`,
      minimum_return_on_investment_percent: `${debtDetailsForm.min_return_on_investment || "0"}%`,
      expected_min_annual_return: `${debtDetailsForm.min_return_on_investment || "0"}%`,
      expected_max_annual_return: `${debtDetailsForm.max_return_on_investment || "0"}%`,
      target_hold_period_years: debtDetailsForm.target_hold_period || "0",
      exit_date: debtDetailsForm.exit_date || "",
    },
    equity_details: {
      allocation_amount: equityAmount.toString(),
      distribution_frequency: equityDetailsForm.distribution_frequency || "annually",
      target_distribution_start_date: equityDetailsForm.target_distribution_start || "",
      minimum_investment: equityDetailsForm.minimum_investment || "0",
      maximum_investment: equityDetailsForm.maximum_investment || "0",
      return_on_investment: `${equityDetailsForm.return_on_investment || "0"}%`,
      expected_min_return: `${equityDetailsForm.expected_min_return_percentage || "0"}%`,
      expected_max_return: `${equityDetailsForm.expected_max_return_percentage || "0"}%`,
      target_hold_period_years: equityDetailsForm.target_hold_period || "0",
      exit_date: equityDetailsForm.exit_date || "",
    },
    expenses_taxes: expensesRevenueForm.taxes || "0",
    expenses_insurance: expensesRevenueForm.insurance || "0",
    expenses_management: expensesRevenueForm.management || "0",
    expenses_repairs: expensesRevenueForm.repairs || "0",
    expenses_utilities: expensesRevenueForm.utilities || "0",
    expenses_interest: expensesRevenueForm.interest || "0",
    expenses_total: expensesRevenueForm.totalExpense || "0",
    expenses_total_equity_appreciation: expensesRevenueForm.totalEquityAppreciation || "0",
    expenses_total_rental_income: expensesRevenueForm.totalRentalIncome || "0",
    expenses_additional: expensesRevenueForm.additionalExpenses || [],
  };

  return backendData;
}

/**
 * Transform step 9 data from source format to backend format
 */
export function transformStep9ToBackendFormat(sourceData: any): any {
  const budgetTabs = sourceData.budget_tabs || {};
  const budgetTable = sourceData.budget_table || {};

  // Extract data from budget tabs
  const propertyAddress = budgetTabs["property-address"] || {};
  const descriptionWork = budgetTabs["description-work"] || {};
  const projectTimeline = budgetTabs["project-timeline"] || {};

  // Transform budget table data to the expected format
  const budgetItems = Object.entries(budgetTable).map(([lineItem, itemData]: [string, any]) => ({
    line_item: lineItem,
    description: itemData.description || "",
    scope_of_work: itemData.scope || "",
    budget_amount: parseFloat(itemData.budget?.replace(/[^0-9.-]+/g, "") || "0"),
  }));

  const backendData = {
    budget_sheet_property_address: propertyAddress.address || "",
    city: propertyAddress.city || "",
    state: propertyAddress.state || "",
    zip_code: propertyAddress.zipCode || "",
    in_depth_description_of_work: descriptionWork.description || "",
    project_timeline_months: parseInt(projectTimeline.projectMonths || "0", 10),
    adding_square_footage:
      projectTimeline.addingSquareFootage === "true" || projectTimeline.addingSquareFootage === true,
    square_footage_expansion_plan: projectTimeline.expansionMethod || "",
    budget_items: budgetItems,
  };

  return backendData;
}

/**
 * Transform step 10 data from source format to backend format
 */
export function transformStep10ToBackendFormat(sourceData: any): any {
  console.log("🔍 [STEP 10 DEBUG] Input data:", sourceData);

  const mediaAssetsUpload = sourceData.media_assets_upload || {};
  const fundWallet = sourceData.fund_wallet || {};
  const acknowledgeSignDocs = sourceData.acknowledge_sign_docs || {};

  console.log("🔍 [STEP 10 DEBUG] mediaAssetsUpload:", mediaAssetsUpload);
  console.log("🔍 [STEP 10 DEBUG] fundWallet:", fundWallet);
  console.log("🔍 [STEP 10 DEBUG] acknowledgeSignDocs:", acknowledgeSignDocs);

  const backendData = {
    picture_uploads: mediaAssetsUpload.picture_uploads || [],
    slides_uploads: mediaAssetsUpload.slides_uploads || [],
    video_uploads: mediaAssetsUpload.video_uploads || [],
    signed_acknowledgement_form: acknowledgeSignDocs.signedDocumentFile || null,
    fund_wallet_amount: fundWallet.amount || "0",
  };

  console.log("🔍 [STEP 10 DEBUG] Transformed data:", backendData);
  return backendData;
}
