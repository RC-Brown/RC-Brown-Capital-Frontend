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
  // Extract individual fields from key_deal_points for backend compatibility
  projected_valuation: "projected_valuation",
  timeline_completion: "timeline_of_completion_months",

  // Additional required fields for Step 4
  total_capital_required: "total_capital_required",
  total_debt_allocation_percent: "total_debt_allocation_percent",
  debt_investment_tenure: "debt_investment_tenure",
  debt_yield_percent: "debt_yield_percent",
  debt_periodic_payment: "debt_periodic_payment",
  equity_investment_tenure: "equity_investment_tenure",
  projected_returns_equity_percent: "projected_returns_equity_percent",
  equity_periodic_payment: "equity_periodic_payment",
  total_equity_allocation: "total_equity_allocation",

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
  budget_tabs: "budget_tabs",
  budget_table: "budget_table",

  // Media and Acknowledgement (Step 10)
  picture_uploads: "picture_uploads",
  slides_uploads: "slides_uploads",
  video_uploads: "video_uploads",
  fund_wallet_amount: "fund_wallet_amount",
  signed_acknowledgement_form: "signed_acknowledgement_form",
  media_assets_upload: "media_assets_upload",

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

  // Map each frontend field to its backend equivalent
  Object.entries(PROJECT_UPLOAD_FIELD_MAPPING).forEach(([frontendKey, backendKey]) => {
    const value = formData[frontendKey as keyof ProjectUploadInput];

    if (value !== undefined && value !== null && value !== "") {
      if (frontendKey === "sponsor_logo") {
        // Handle sponsor logo - extract File from File[]
        if (Array.isArray(value) && value.length > 0) {
          const file = value[0];
          if (file instanceof File) {
            backendData[backendKey] = file;
          } else {
            backendData[backendKey] = value;
          }
        } else {
          backendData[backendKey] = value;
        }
      } else if (
        frontendKey === "picture_uploads" ||
        frontendKey === "slides_uploads" ||
        frontendKey === "video_uploads" ||
        frontendKey === "track_record_documents" ||
        frontendKey === "site_documents" ||
        frontendKey === "closing_documents" ||
        frontendKey === "offering_information"
      ) {
        // Handle other file array fields
        if (Array.isArray(value) && value.length > 0) {
          const files = value.filter((item) => item instanceof File);
          if (files.length > 0) {
            backendData[backendKey] = files;
          } else {
            backendData[backendKey] = value;
          }
        } else {
          backendData[backendKey] = value;
        }
      } else if (frontendKey === "key_deal_points") {
        // Extract key deal points fields to root level
        if (typeof value === "object" && value !== null) {
          const keyDealPoints = value as any;

          // Extract projected_valuation and timeline_completion
          if (keyDealPoints.projected_valuation) {
            backendData.projected_valuation = keyDealPoints.projected_valuation;
          }

          if (keyDealPoints.timeline_completion) {
            // Convert "30_months" to "30 Months"
            const timelineValue = keyDealPoints.timeline_completion;
            if (typeof timelineValue === "string" && timelineValue.includes("_")) {
              const [number, unit] = timelineValue.split("_");
              const formattedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
              backendData.timeline_of_completion_months = `${number} ${formattedUnit}`;
            } else {
              backendData.timeline_of_completion_months = timelineValue;
            }
          }

          // Extract other Step 4 fields
          if (keyDealPoints.total_capital_required) {
            backendData.total_capital_required = keyDealPoints.total_capital_required;
          }

          if (keyDealPoints.total_debt_allocation) {
            backendData.total_debt_allocation_percent = keyDealPoints.total_debt_allocation;
          }

          if (keyDealPoints.debt_investment_tenure) {
            const tenureValue = keyDealPoints.debt_investment_tenure;
            if (typeof tenureValue === "string" && tenureValue.includes("_years")) {
              const years = tenureValue.replace("_years", " years");
              backendData.debt_investment_tenure_months = years;
            } else {
              backendData.debt_investment_tenure_months = tenureValue;
            }
          }

          if (keyDealPoints.percentage_yield_debt) {
            backendData.percentage_yield_debt = keyDealPoints.percentage_yield_debt;
          }

          if (keyDealPoints.equity_investment_tenure) {
            const tenureValue = keyDealPoints.equity_investment_tenure;
            if (typeof tenureValue === "string" && tenureValue.includes("_years")) {
              const years = tenureValue.replace("_years", " years");
              backendData.equity_investment_tenure = years;
            } else {
              backendData.equity_investment_tenure = tenureValue;
            }
          }

          if (keyDealPoints.projected_returns_equity) {
            backendData.projected_returns_equity_percent = keyDealPoints.projected_returns_equity;
          }

          if (keyDealPoints.total_equity) {
            backendData.total_equity_percent = keyDealPoints.total_equity;
          }
        }
      } else if (frontendKey === "sponsor_background_section") {
        // Extract sponsor background from custom component
        if (typeof value === "string") {
          backendData.sponsor_background = value;
        }
      } else if (frontendKey === "sponsor_metrics") {
        // Extract individual metrics from the SponsorMetricsTable custom component
        if (typeof value === "object" && value !== null) {
          const metrics = value as any;

          // Map the metrics to backend fields
          if (metrics.yearsInOperation) {
            backendData.years_in_operation = parseInt(metrics.yearsInOperation) || 0;
          }

          if (metrics.historicalPortfolioActivity) {
            backendData.historical_portfolio_activity_amount = parseFloat(metrics.historicalPortfolioActivity) || 0;
          }

          if (metrics.projectsUnderManagement) {
            backendData.project_under_management_amount = parseFloat(metrics.projectsUnderManagement) || 0;
          }

          if (metrics.totalSquareFeetManaged) {
            backendData.total_square_feet_managed = metrics.totalSquareFeetManaged;
          }

          if (metrics.dealsFundedByRC) {
            backendData.deals_funded_by_rc_brown = parseInt(metrics.dealsFundedByRC) || 0;
          }

          if (metrics.propertiesUnderManagement) {
            backendData.number_of_properties_under_management = parseInt(metrics.propertiesUnderManagement) || 0;
          }

          if (metrics.totalRealizedProjects) {
            backendData.total_number_of_realized_projects = parseInt(metrics.totalRealizedProjects) || 0;
          }

          if (metrics.propertiesDeveloped) {
            backendData.number_of_properties_developed = parseInt(metrics.propertiesDeveloped) || 0;
          }

          if (metrics.propertiesBuiltAndSold) {
            backendData.number_of_properties_built_sold = parseInt(metrics.propertiesBuiltAndSold) || 0;
          }

          if (metrics.highestBudgetProject) {
            backendData.highest_budget_for_project = metrics.highestBudgetProject;
          }

          if (metrics.averageCompletionLength) {
            backendData.average_length_of_completion_months = parseInt(metrics.averageCompletionLength) || 1;
          }
        }
      } else if (frontendKey === "track_record_attachment") {
        // Handle track record documents
        if (Array.isArray(value) && value.length > 0) {
          const files = value.filter((item) => item instanceof File);
          if (files.length > 0) {
            backendData.track_record_documents = files;
          } else {
            backendData.track_record_documents = value;
          }
        } else {
          backendData.track_record_documents = value;
        }
      } else if (frontendKey === "offer_details_table") {
        // Extract offer details to root level
        if (typeof value === "object" && value !== null) {
          const offerDetails = value as any;

          if (offerDetails.total_capitalization) {
            backendData.total_capitalization = offerDetails.total_capitalization;
          }

          if (offerDetails.debt_allocation) {
            backendData.debt_allocation_percent = offerDetails.debt_allocation;
          }

          if (offerDetails.equity_allocation) {
            backendData.equity_allocation_percent = offerDetails.equity_allocation;
          }

          if (offerDetails.offer_deadline) {
            backendData.offer_deadline = offerDetails.offer_deadline;
          }

          if (offerDetails.location) {
            backendData.location = offerDetails.location;
          }

          if (offerDetails.asset_type) {
            backendData.asset_type = offerDetails.asset_type;
          }

          if (offerDetails.strategy) {
            backendData.strategy = offerDetails.strategy;
          }

          if (offerDetails.objective) {
            backendData.objective = offerDetails.objective;
          }

          if (offerDetails.sponsor_co_invest) {
            backendData.sponsor_co_invest_range = offerDetails.sponsor_co_invest;
          }
        }
      } else if (frontendKey === "debt_details_form") {
        // Extract debt details to debt_details object
        if (typeof value === "object" && value !== null) {
          const debtDetails = value as any;

          if (!backendData.debt_details) {
            backendData.debt_details = {};
          }

          // Calculate debt amount from allocation percentage and total capitalization
          if (formData.offer_details_table?.debt_allocation && formData.offer_details_table?.total_capitalization) {
            const debtAllocationPercent = parseFloat(formData.offer_details_table.debt_allocation);
            const totalCapitalization = parseFloat(formData.offer_details_table.total_capitalization);
            if (debtAllocationPercent > 0 && totalCapitalization > 0) {
              const debtAmount = (debtAllocationPercent / 100) * totalCapitalization;
              backendData.debt_details.amount = debtAmount.toString();
            }
          }

          if (debtDetails.distribution_period) {
            backendData.debt_details.distribution_period = debtDetails.distribution_period;
          }

          if (debtDetails.target_distribution_start) {
            backendData.debt_details.target_distribution_start_date = debtDetails.target_distribution_start;
          }

          if (debtDetails.min_investment_amount) {
            backendData.debt_details.minimum_investment_amount = debtDetails.min_investment_amount;
          }

          if (debtDetails.max_investment_amount) {
            backendData.debt_details.maximum_investment_amount = debtDetails.max_investment_amount;
          }

          if (debtDetails.min_return_on_investment) {
            backendData.debt_details.minimum_return_on_investment_percent = debtDetails.min_return_on_investment;
          }

          if (debtDetails.max_return_on_investment) {
            backendData.debt_details.maximum_return_on_investment_percent = debtDetails.max_return_on_investment;
          }

          // Map min_return_on_investment to expected_min_annual_return
          if (debtDetails.min_return_on_investment) {
            backendData.debt_details.expected_min_annual_return = debtDetails.min_return_on_investment;
          }

          // Map max_return_on_investment to expected_max_annual_return
          if (debtDetails.max_return_on_investment) {
            backendData.debt_details.expected_max_annual_return = debtDetails.max_return_on_investment;
          }

          if (debtDetails.target_hold_period) {
            backendData.debt_details.target_hold_period_years = debtDetails.target_hold_period;
          }

          if (debtDetails.exit_date) {
            backendData.debt_details.exit_date = debtDetails.exit_date;
          }
        }
      } else if (frontendKey === "equity_details_form") {
        // Extract equity details to equity_details object
        if (typeof value === "object" && value !== null) {
          const equityDetails = value as any;

          if (!backendData.equity_details) {
            backendData.equity_details = {};
          }

          // Calculate equity amount from allocation percentage and total capitalization
          if (formData.offer_details_table?.equity_allocation && formData.offer_details_table?.total_capitalization) {
            const equityAllocationPercent = parseFloat(formData.offer_details_table.equity_allocation);
            const totalCapitalization = parseFloat(formData.offer_details_table.total_capitalization);
            if (equityAllocationPercent > 0 && totalCapitalization > 0) {
              const equityAmount = (equityAllocationPercent / 100) * totalCapitalization;
              backendData.equity_details.allocation_amount = equityAmount.toString();
            }
          }

          if (equityDetails.allocation_amount) {
            backendData.equity_details.allocation_amount = equityDetails.allocation_amount;
          }

          if (equityDetails.distribution_frequency) {
            backendData.equity_details.distribution_frequency = equityDetails.distribution_frequency;
          }

          if (equityDetails.target_distribution_start) {
            backendData.equity_details.target_distribution_start_date = equityDetails.target_distribution_start;
          }

          if (equityDetails.minimum_investment) {
            backendData.equity_details.minimum_investment = equityDetails.minimum_investment;
          }

          if (equityDetails.maximum_investment) {
            backendData.equity_details.maximum_investment = equityDetails.maximum_investment;
          }

          if (equityDetails.return_on_investment) {
            backendData.equity_details.return_on_investment = equityDetails.return_on_investment;
          }

          // Map expected_min_return_percentage to expected_min_return
          if (equityDetails.expected_min_return_percentage) {
            backendData.equity_details.expected_min_return = equityDetails.expected_min_return_percentage;
          } else if (equityDetails.return_on_investment) {
            // Fallback to return_on_investment if expected_min_return_percentage is not available
            backendData.equity_details.expected_min_return = equityDetails.return_on_investment;
          }

          if (equityDetails.expected_max_return) {
            backendData.equity_details.expected_max_return = equityDetails.expected_max_return;
          } else if (equityDetails.expected_max_return_percentage) {
            // Map expected_max_return_percentage to expected_max_return
            backendData.equity_details.expected_max_return = equityDetails.expected_max_return_percentage;
          } else if (equityDetails.return_on_investment) {
            // Fallback to return_on_investment if expected_max_return_percentage is not available
            backendData.equity_details.expected_max_return = equityDetails.return_on_investment;
          }

          if (equityDetails.target_hold_period) {
            backendData.equity_details.target_hold_period_years = equityDetails.target_hold_period;
          }

          if (equityDetails.exit_date) {
            backendData.equity_details.exit_date = equityDetails.exit_date;
          }
        }
      } else if (frontendKey === "what_are_you_offering") {
        // Map offerings field
        if (value === "both_equity_and_debt") {
          backendData.offerings = "both";
        } else if (value === "equity_only") {
          backendData.offerings = "equity";
        } else if (value === "debt_only") {
          backendData.offerings = "debt";
        } else {
          backendData.offerings = value;
        }
      } else if (frontendKey === "budget_tabs") {
        // Extract budget sheet data from budget_tabs
        if (typeof value === "object" && value !== null) {
          const budgetTabs = value as any;

          // Extract property address data
          const propertyAddress = budgetTabs["property-address"] || {};
          if (propertyAddress.address) {
            backendData.budget_sheet_property_address = propertyAddress.address;
          }
          if (propertyAddress.city) {
            backendData.city = propertyAddress.city;
          }
          if (propertyAddress.state) {
            backendData.state = propertyAddress.state;
          }
          if (propertyAddress.zipCode) {
            backendData.zip_code = propertyAddress.zipCode;
          }

          // Extract description work data
          const descriptionWork = budgetTabs["description-work"] || {};
          if (descriptionWork.description) {
            backendData.in_depth_description_of_work = descriptionWork.description;
          }

          // Extract project timeline data
          const projectTimeline = budgetTabs["project-timeline"] || {};
          if (projectTimeline.projectMonths) {
            backendData.project_timeline_months = parseInt(projectTimeline.projectMonths) || 0;
          }
          if (projectTimeline.addingSquareFootage !== undefined) {
            backendData.adding_square_footage =
              projectTimeline.addingSquareFootage === "true" || projectTimeline.addingSquareFootage === true;
          }
          if (projectTimeline.expansionMethod) {
            backendData.square_footage_expansion_plan = projectTimeline.expansionMethod;
          }
        }
      } else if (frontendKey === "budget_table") {
        // Extract budget table data
        if (typeof value === "object" && value !== null) {
          const budgetTable = value as any;

          // Transform budget table data to the expected format
          const budgetItems = Object.entries(budgetTable).map(([lineItem, itemData]: [string, any]) => ({
            line_item: lineItem,
            description: itemData.description || "",
            scope_of_work: itemData.scope || "",
            budget_amount: parseFloat(itemData.budget?.replace(/[^0-9.-]+/g, "") || "0"),
          }));

          if (budgetItems.length > 0) {
            backendData.budget_items = budgetItems;
          }
        }
      } else if (frontendKey === "media_assets_upload") {
        // Extract media uploads from media_assets_upload object
        if (typeof value === "object" && value !== null) {
          const mediaAssets = value as any;

          if (mediaAssets.picture_uploads) {
            backendData.picture_uploads = mediaAssets.picture_uploads;
          }

          if (mediaAssets.slides_uploads) {
            backendData.slides_uploads = mediaAssets.slides_uploads;
          }

          if (mediaAssets.video_uploads) {
            backendData.video_uploads = mediaAssets.video_uploads;
          }
        }
      } else if (frontendKey === "fund_wallet_amount") {
        // Set default value for fund_wallet_amount if not provided
        if (value && value !== "") {
          backendData.fund_wallet_amount = value;
        } else {
          backendData.fund_wallet_amount = "0"; // Default value
        }
      } else {
        // For all other fields, map directly
        backendData[backendKey] = value;
      }
    }
  });

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
            } else if (/^q[1-4]_\d{4}$/.test(value.toString())) {
              // If value is already in quarter format (q1_2025), preserve it as-is
              formData[frontendKey] = value.toString();
            } else {
              // Try to parse and format the date only if it's not a quarter string
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
      "budget_tabs",
      "budget_table",
    ],
    10: [
      "picture_uploads",
      "slides_uploads",
      "video_uploads",
      "fund_wallet_amount",
      "signed_acknowledgement_form",
      "media_assets_upload",
    ],
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
