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
      // Debug logging for track_record_documents related fields
      if (frontendKey === "track_record_attachment" || frontendKey === "sponsor_information_docs") {
        console.log(`Processing field: ${frontendKey} -> ${backendKey}`);
        console.log(`Value:`, value);
      }
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
        frontendKey === "project_under_management_amount" ||
        frontendKey === "deals_funded_by_rc_brown" ||
        frontendKey === "number_of_properties_under_management" ||
        frontendKey === "total_number_of_realized_projects" ||
        frontendKey === "number_of_properties_developed" ||
        frontendKey === "number_of_properties_built_sold" ||
        frontendKey === "highest_budget_for_project" ||
        frontendKey === "average_length_of_completion_months"
      ) {
        backendData[backendKey] = parseFloat(value as string) || 0;
      } else if (frontendKey === "key_deal_points" && typeof value === "object" && value !== null) {
        const keyDealPoints = value as Record<string, string>;
        // Map all required fields with proper validation
        backendData["projected_valuation"] = parseFloat(keyDealPoints.projected_valuation) || 0;
        backendData["timeline_of_completion_months"] = keyDealPoints.timeline_completion || "";
        backendData["total_capital_required"] = keyDealPoints.total_capital_required || "0";
        backendData["total_debt_allocation_percent"] = keyDealPoints.total_debt_allocation || "0";
        backendData["debt_investment_tenure"] = keyDealPoints.debt_investment_tenure || "";
        backendData["debt_yield_percent"] = parseFloat(keyDealPoints.percentage_yield_debt) || 0;
        backendData["debt_periodic_payment"] = keyDealPoints.periodic_payments === "yes" ? "monthly" : "at_maturity";
        backendData["equity_investment_tenure"] = keyDealPoints.equity_investment_tenure || "";
        backendData["projected_returns_equity_percent"] = parseFloat(keyDealPoints.projected_returns_equity) || 0;
        backendData["equity_periodic_payment"] = keyDealPoints.periodic_payments === "yes" ? "monthly" : "at_maturity";
        backendData["total_equity_allocation"] = parseFloat(keyDealPoints.total_equity) || 0;
      } else if (frontendKey === "properties" && Array.isArray(value) && value.length > 0) {
        // Extract occupancy from the first property and map it to root level
        const firstProperty = value[0];
        if (firstProperty && typeof firstProperty === "object") {
          backendData["occupancy"] = firstProperty.occupancy || "";
        }
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
            // Handle acquisition_date special case (q1_2025 format)
            if (frontendKey === "acquisition_date" && typeof value === "string") {
              const match = value.match(/^q(\d)_(\d{4})$/);
              if (match) {
                const quarter = parseInt(match[1]);
                const year = parseInt(match[2]);
                // Convert quarter to month (Q1=01, Q2=04, Q3=07, Q4=10)
                const month = ((quarter - 1) * 3 + 1).toString().padStart(2, "0");
                // Use 15th of the month as default day
                const day = "15";
                backendData[backendKey] = `${year}-${month}-${day}`;
              } else {
                backendData[backendKey] = null;
              }
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(value as string)) {
              // If value is already in YYYY-MM-DD format, use it directly
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
        backendData["project_under_management_amount"] = parseFloat(metrics.projectsUnderManagement || "0");
        // Handle total_square_feet_managed as a string with units
        if (
          metrics.totalSquareFeetManaged &&
          typeof metrics.totalSquareFeetManaged === "object" &&
          "size" in metrics.totalSquareFeetManaged &&
          "unit" in metrics.totalSquareFeetManaged
        ) {
          const sizeData = metrics.totalSquareFeetManaged as { size: string; unit: string };
          backendData["total_square_feet_managed"] = `${sizeData.size} ${sizeData.unit}`;
        } else {
          backendData["total_square_feet_managed"] = metrics.totalSquareFeetManaged || "0";
        }
        backendData["deals_funded_by_rc_brown"] = parseInt(metrics.dealsFundedByRC) || 0;
        backendData["number_of_properties_under_management"] = parseInt(metrics.propertiesUnderManagement) || 0;
        backendData["total_number_of_realized_projects"] = parseInt(metrics.totalRealizedProjects) || 0;
        backendData["number_of_properties_developed"] = parseInt(metrics.propertiesDeveloped) || 0;
        backendData["number_of_properties_built_sold"] = parseInt(metrics.propertiesBuiltAndSold) || 0;
        backendData["highest_budget_for_project"] = parseFloat(metrics.highestBudgetProject || "0");
        backendData["average_length_of_completion_months"] = parseInt(metrics.averageCompletionLength) || 0;
      } else if (frontendKey === "track_record_attachment") {
        // Handle track record documents (required field)
        console.log("Processing track_record_attachment with value:", value);
        console.log("Value type:", typeof value);
        console.log("Value constructor:", value?.constructor?.name);
        console.log("Is Array:", Array.isArray(value));
        console.log("Is File:", value instanceof File);

        let files: File[] = [];

        if (value instanceof File) {
          console.log("Value is a File object");
          files = [value];
        } else if (Array.isArray(value)) {
          console.log("Value is an array, length:", value.length);
          console.log("Array contents:", value);

          // Filter out empty objects and ensure we have actual File objects
          files = value.filter((file): file is File => {
            const isValid = file instanceof File;
            console.log("File validation:", { file, isValid, type: typeof file, constructor: file?.constructor?.name });
            return isValid;
          });

          console.log("Filtered files:", files);
        } else {
          console.log("Value is neither File nor Array:", value);
        }

        // Ensure we have at least one file as it's required
        if (files.length > 0) {
          // Additional validation to ensure no empty objects slip through
          const validFiles = files.filter((file) => file instanceof File && file.size > 0);
          console.log("Valid files after size check:", validFiles);

          if (validFiles.length > 0) {
            backendData["track_record_documents"] = validFiles;
            console.log("Set track_record_documents to:", validFiles);
          } else {
            console.warn("track_record_documents: files found but they appear to be invalid or empty");
            backendData["track_record_documents"] = [];
          }
        } else {
          console.warn("track_record_documents is required but no valid files were provided");
          console.warn("Value received:", value);
          console.warn("Files filtered:", files);
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
      } else if (frontendKey === "sponsor_information_docs" && typeof value === "object" && value !== null) {
        // SponsorInformationDocs returns { trackRecord?: File; additionalDocs?: SponsorDocument[] }
        console.log("Processing sponsor_information_docs with value:", value);
        const sponsorDocs = value as { trackRecord?: File; additionalDocs?: Array<{ file?: File }> };

        const trackRecordFiles: File[] = [];

        // Add track record file if it exists and is valid
        if (sponsorDocs.trackRecord && sponsorDocs.trackRecord instanceof File && sponsorDocs.trackRecord.size > 0) {
          console.log("Found valid trackRecord:", sponsorDocs.trackRecord);
          trackRecordFiles.push(sponsorDocs.trackRecord);
        } else if (sponsorDocs.trackRecord) {
          console.log("Found invalid trackRecord:", sponsorDocs.trackRecord);
          console.log("trackRecord type:", typeof sponsorDocs.trackRecord);
          console.log("trackRecord constructor:", sponsorDocs.trackRecord?.constructor?.name);
          console.log("trackRecord instanceof File:", sponsorDocs.trackRecord instanceof File);
        }

        // Add additional docs files if they exist and are valid
        if (sponsorDocs.additionalDocs) {
          console.log("Found additionalDocs:", sponsorDocs.additionalDocs);
          sponsorDocs.additionalDocs.forEach((doc) => {
            if (doc.file && doc.file instanceof File && doc.file.size > 0) {
              console.log("Found valid additional doc file:", doc.file);
              trackRecordFiles.push(doc.file);
            } else if (doc.file) {
              console.log("Found invalid additional doc file:", doc.file);
              console.log("doc.file type:", typeof doc.file);
              console.log("doc.file constructor:", doc.file?.constructor?.name);
              console.log("doc.file instanceof File:", doc.file instanceof File);
            }
          });
        }

        if (trackRecordFiles.length > 0) {
          // Final validation to ensure no empty objects slip through
          const finalValidFiles = trackRecordFiles.filter((file) => file instanceof File && file.size > 0);
          if (finalValidFiles.length > 0) {
            // Check if track_record_documents already has valid files from track_record_attachment
            const existingFiles = backendData["track_record_documents"];
            if (existingFiles && Array.isArray(existingFiles) && existingFiles.length > 0) {
              const existingValidFiles = existingFiles.filter((file) => file instanceof File && file.size > 0);
              if (existingValidFiles.length > 0) {
                console.log(
                  "Keeping existing valid track_record_documents from track_record_attachment:",
                  existingValidFiles
                );
                // Don't override if we already have valid files
                return;
              }
            }

            console.log("Setting track_record_documents from sponsor_information_docs:", finalValidFiles);
            backendData["track_record_documents"] = finalValidFiles;
          } else {
            console.log("No valid files after final validation in sponsor_information_docs");
            // Don't override track_record_documents if we don't have valid files
            // This prevents empty objects from overriding valid files set by track_record_attachment
          }
        } else {
          console.log("No valid files found in sponsor_information_docs");
          // Don't override track_record_documents if we don't have valid files
          // This prevents empty objects from overriding valid files set by track_record_attachment
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
  } else if (formData.properties && Array.isArray(formData.properties) && formData.properties.length > 0) {
    // If properties array is already provided, use it directly
    backendData.properties = formData.properties;
  }

  // Special handling for Step 5 - Set default values for missing required fields
  if (!backendData.offer_live_date) {
    // If offer_live_date is not provided, set it to the same as offer_closing_date
    // or use a default date based on acquisition_date
    if (backendData.offer_closing_date) {
      backendData.offer_live_date = backendData.offer_closing_date;
    } else if (backendData.acquisition_date) {
      // Set offer_live_date to 30 days before acquisition_date
      const acquisitionDate = new Date(backendData.acquisition_date);
      const offerLiveDate = new Date(acquisitionDate);
      offerLiveDate.setDate(acquisitionDate.getDate() - 30);
      backendData.offer_live_date = offerLiveDate.toISOString().split("T")[0];
    } else {
      // Default to current date
      const today = new Date();
      backendData.offer_live_date = today.toISOString().split("T")[0];
    }
  }

  // Ensure frequency_of_distributions has a default value
  if (!backendData.frequency_of_distributions) {
    backendData.frequency_of_distributions = "quarterly";
  }

  // Final check for track_record_documents
  console.log("Final track_record_documents value:", backendData.track_record_documents);
  if (backendData.track_record_documents && Array.isArray(backendData.track_record_documents)) {
    console.log("track_record_documents array contents:", backendData.track_record_documents);
    console.log("track_record_documents array length:", backendData.track_record_documents.length);
    backendData.track_record_documents.forEach((item: any, index: number) => {
      console.log(`Item ${index}:`, item);
      console.log(`Item ${index} type:`, typeof item);
      console.log(`Item ${index} constructor:`, item?.constructor?.name);
      console.log(`Item ${index} instanceof File:`, item instanceof File);
    });
  }

  // Handle key deal points financial data
  if (formData.key_deal_points && typeof formData.key_deal_points === "object") {
    const keyDealPoints = formData.key_deal_points as Record<string, string>;

    backendData.projected_valuation = parseFloat(keyDealPoints.projected_valuation) || 0;
    backendData.timeline_of_completion_months = keyDealPoints.timeline_completion || "";
    backendData.total_capital_required = keyDealPoints.total_capital_required || "0";
    backendData.total_debt_allocation_percent = keyDealPoints.total_debt_allocation || "0";
    backendData.debt_investment_tenure = keyDealPoints.debt_investment_tenure || "";
    backendData.debt_yield_percent = parseFloat(keyDealPoints.debt_yield) || 0;
    backendData.debt_periodic_payment = keyDealPoints.debt_periodic_payment || "";
    backendData.equity_investment_tenure = keyDealPoints.equity_investment_tenure || "";
    backendData.projected_returns_equity_percent = parseFloat(keyDealPoints.projected_returns_equity) || 0;
    backendData.equity_periodic_payment = keyDealPoints.equity_periodic_payment || "";
    backendData.total_equity_allocation = parseFloat(keyDealPoints.total_equity) || 0;
  }

  // Extract occupancy from properties array and map to root level
  if (formData.occupancy) {
    // If occupancy is provided directly in form data, use it
    backendData.occupancy = formData.occupancy;
  } else if (formData.occupancy_status) {
    // If occupancy_status is provided directly in form data, use it
    backendData.occupancy = formData.occupancy_status;
  } else if (formData.properties && Array.isArray(formData.properties) && formData.properties.length > 0) {
    // Extract occupancy from the first property if not provided directly
    const firstProperty = formData.properties[0];
    if (firstProperty && typeof firstProperty === "object") {
      backendData.occupancy = firstProperty.occupancy || "";
    }
  }

  // Ensure has_anchor_tenant and has_anchor_buyer are set at root level
  if (formData.anchor_tenant !== undefined) {
    backendData.has_anchor_tenant = formData.anchor_tenant === "yes";
  }
  if (formData.anchor_buyer !== undefined) {
    backendData.has_anchor_buyer = formData.anchor_buyer === "yes";
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
