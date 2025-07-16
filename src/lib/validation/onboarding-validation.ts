import { z } from "zod";

// Base field validations
const requiredBoolean = z.boolean().refine((val) => val === true, "This field is required");

// Helper for fields with allowOther (can be string or object)
const stringOrAllowOtherObject = (message = "This field is required") =>
  z.union([
    z.string().min(1, message),
    z.object({
      selectedValue: z.string().min(1, message),
      otherValue: z.string().optional(),
    }),
  ]);

const optionalStringOrAllowOtherObject = () =>
  z
    .union([
      z.string(),
      z.object({
        selectedValue: z.string(),
        otherValue: z.string().optional(),
      }),
    ])
    .optional();

// Custom component schemas
const BusinessPlanRatingSchema = z.object({
  leverage: z.enum(["low", "medium", "high"], {
    required_error: "Please select a leverage rating",
  }),
  occupancy: z.enum(["low", "medium", "high"], {
    required_error: "Please select an occupancy rating",
  }),
  capex_hard_cost: z.enum(["low", "medium", "high"], {
    required_error: "Please select a capex/hard cost rating",
  }),
  target_noi_growth: z.enum(["low", "medium", "high"], {
    required_error: "Please select a target NOI growth rating",
  }),
});

const DealSnapshotItemSchema = z.object({
  id: z.string(),
  header: z.string().min(1, "Header is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const DealSnapshotSchema = z.array(DealSnapshotItemSchema).min(1, "At least one deal point is required");

const RiskConsiderationItemSchema = z.object({
  id: z.string(),
  risk: z.string().min(1, "Risk description is required"),
  severity: z.enum(["low", "medium", "high"], {
    required_error: "Please select risk severity",
  }),
  mitigation: z.string().min(10, "Mitigation strategy is required"),
});

const RiskConsiderationsSchema = z
  .array(RiskConsiderationItemSchema)
  .min(1, "At least one risk consideration is required");

const AddressInputSchema = z.object({
  address: z.string().min(5, "Please enter a valid address"),
  useCompanyAddress: z.boolean().optional(),
});

const ProjectDetailsItemSchema = z.object({
  id: z.string(),
  projectName: z.string().min(1, "Project name is required"),
  projectType: z.string().min(1, "Project type is required"),
  address: z.string().min(1, "Address is required"),
  projectSize: z.string().min(1, "Project size is required"),
  totalCost: z.string().min(1, "Total cost is required"),
  startDate: z.string().min(1, "Start date is required"),
  completedDate: z.string().min(1, "Completion date is required"),
});

const ProjectDetailsSchema = z.array(ProjectDetailsItemSchema).min(1, "At least one project is required");

const SupportingDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  category: z.string(),
  size: z.number(),
});

const SupportingDocumentsSchema = z.array(SupportingDocumentSchema).optional();

const ReferenceLinksSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Reference title is required"),
      url: z.string().url("Please enter a valid URL"),
      description: z.string().optional(),
    })
  )
  .optional();

const SponsorMetricsSchema = z
  .object({
    totalProjects: z.string().min(1, "Total projects is required"),
    totalValue: z.string().min(1, "Total value is required"),
    averageROI: z.string().min(1, "Average ROI is required"),
    successRate: z.string().min(1, "Success rate is required"),
  })
  .refine(() =>
    // data
    {
      // Add custom validation logic here if needed
      return true;
    }, "Invalid sponsor metrics data");

const OfferDetailsSchema = z
  .object({
    totalRaise: z.string().min(1, "Total raise amount is required"),
    minimumInvestment: z.string().min(1, "Minimum investment is required"),
    targetROI: z.string().min(1, "Target ROI is required"),
    investmentPeriod: z.string().min(1, "Investment period is required"),
  })
  .refine(() =>
    // data
    {
      // Add custom validation logic here if needed
      return true;
    }, "Invalid offer details");

const DebtDetailsSchema = z
  .object({
    debtAmount: z.string().min(1, "Debt amount is required"),
    interestRate: z.string().min(1, "Interest rate is required"),
    loanTerm: z.string().min(1, "Loan term is required"),
    lender: z.string().min(1, "Lender information is required"),
  })
  .refine(() =>
    // data
    {
      // Add custom validation logic here if needed
      return true;
    }, "Invalid debt details");

const EquityDetailsSchema = z
  .object({
    equityAmount: z.string().min(1, "Equity amount is required"),
    equityPercentage: z.string().min(1, "Equity percentage is required"),
    votingRights: z.enum(["yes", "no"]),
    dividendRate: z.string().optional(),
  })
  .refine(() =>
    // data
    {
      // Add custom validation logic here if needed
      return true;
    }, "Invalid equity details");

const BudgetTableSchema = z
  .object({
    acquisitionCost: z.string().min(1, "Acquisition cost is required"),
    renovationCost: z.string().min(1, "Renovation cost is required"),
    operatingExpenses: z.string().min(1, "Operating expenses is required"),
    contingency: z.string().min(1, "Contingency amount is required"),
    totalBudget: z.string().min(1, "Total budget is required"),
  })
  .refine(() =>
    // data
    {
      // Add custom validation logic here if needed
      return true;
    }, "Invalid budget data");

const ExpensesRevenueSchema = z
  .object({
    monthlyRent: z.string().min(1, "Monthly rent is required"),
    occupancyRate: z.string().min(1, "Occupancy rate is required"),
    operatingExpenses: z.string().min(1, "Operating expenses is required"),
    netOperatingIncome: z.string().min(1, "Net operating income is required"),
  })
  .refine(() =>
    // data
    {
      // Add custom validation logic here if needed
      return true;
    }, "Invalid expenses/revenue data");

// Phase schemas
export const BusinessInformationSchema = z.object({
  // Company Overview
  company_currency: z.string().min(1, "Please select a currency"),
  business_type: z.string().min(1, "Please select a business type"),
  years_in_business: z.string().min(1, "Please select years in business"),
  company_description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(500, "Description must not exceed 500 characters"),
  primary_focus: z.string().min(1, "Please select your primary focus"),

  // Project Track Record
  completed_projects: ProjectDetailsSchema,
  project_docs: z.array(z.any()).optional(),
  average_roi: z.string().min(1, "Average ROI is required"),
  projected_completion_time: z.string().optional(),
  actual_completion_time: z.string().optional(),

  // Investment Details
  typical_funding_structure: stringOrAllowOtherObject("Funding structure is required"),
  investments_exited: stringOrAllowOtherObject("Investment exit method is required"),
  investment_size: z.string().min(1, "Investment size is required"),
  capital_raised: z.string().min(1, "Please indicate if you've raised capital"),
  capital_raise_relationship: optionalStringOrAllowOtherObject(),
  capital_issues: z.string().min(1, "Please indicate if you've had capital issues"),
  capital_issues_details: z.string().optional(),

  // Risk & Compliance
  project_over_budget: z.string().min(1, "Please indicate if projects went over budget"),
  project_over_budget_details: z.string().optional(),
  capital_percentage: z.string().optional(),
  investment_interests: optionalStringOrAllowOtherObject(),
  legal_or_compliance_issues: z.string().min(1, "Please indicate if you've had legal/compliance issues"),
  legal_or_compliance_issues_details: z.string().optional(),
  legal_compliance_measures: z.string().optional(),

  // Communication & Final
  preferred_update_rate: z.string().min(1, "Update frequency is required"),
  social_media: z.record(z.string()).optional(),
  supporting_documents: SupportingDocumentsSchema,
  testimonials: z.string().optional(),
  reference_links: ReferenceLinksSchema,
  terms_accepted: z.boolean().optional(),
});

export const CompanyRepresentativeSchema = z.object({
  // Personal Details
  relationship_with_company: z.string().min(1, "Relationship with company is required"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  country: z.string().min(1, "Country is required"),
  means_of_identification: z.string().min(1, "Means of identification is required"),
  bvn: z.string().optional(),
  nin: z.string().optional(),
  ssn: z.string().optional(),
  address: AddressInputSchema,
  utility_bill: z.any().optional(),

  // Company Bank Details
  currency_of_account: z.string().min(1, "Account currency is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  bank_branch: z.string().min(1, "Bank branch is required"),
  swift_code: z.string().optional(),
  routing_number: z.string().optional(),
  account_number: z.string().min(1, "Account number is required"),
  iban: z.string().optional(),
  bank_terms_accepted: requiredBoolean,
});

export const ProjectUploadSchema = z.object({
  // Sponsor Info
  project_currency: z.string().min(1, "Project currency is required"),
  sponsor_name: z
    .string()
    .min(2, "Sponsor name must be at least 2 characters")
    .max(100, "Sponsor name must not exceed 100 characters"),
  sponsor_logo: z.any().optional(),

  // Project Overview
  project_name: z.string().min(1, "Project name is required"),
  project_subtitle: z.string().min(1, "Project subtitle is required"),
  project_summary: z.string().min(1, "Project summary is required"),
  years_operating: z.string().min(1, "Years operating is required"),
  historical_portfolio_activity: z.string().min(1, "Historical portfolio activity is required"),
  assets_under_management: z.string().min(1, "Assets under management is required"),
  number_of_realized_projects: z.string().min(1, "Number of realized projects is required"),
  rc_brown_capital_offerings: z.string().min(1, "RC Brown Capital offerings is required"),

  // Project Consideration
  business_plan_rating: BusinessPlanRatingSchema,
  definitions_document: z.boolean().optional(),
  deal_snapshot: DealSnapshotSchema,
  risk_considerations: RiskConsiderationsSchema,

  // The Deal
  key_deal_points: z.any().optional(),
  business_plan_property_title: z.string().optional(),
  property_address: AddressInputSchema,
  location_description: z
    .string()
    .min(10, "Location description must be at least 10 characters")
    .max(500, "Location description must not exceed 500 characters"),
  occupancy_status: z.string().min(1, "Occupancy status is required"),
  about_property: z
    .string()
    .min(50, "Property description must be at least 50 characters")
    .max(1000, "Property description must not exceed 1000 characters"),
  detailed_project_description: z
    .string()
    .min(100, "Project description must be at least 100 characters")
    .max(2000, "Project description must not exceed 2000 characters"),
  anchor_tenant: z.string().min(1, "Anchor tenant information is required"),
  anchor_tenant_details: z.string().optional(),
  anchor_buyer: z.string().min(1, "Anchor buyer information is required"),
  anchor_buyer_details: z.string().optional(),
  percentage_leased: z.string().optional(),
  sq_ft_leased: z.string().optional(),

  // Investment Returns
  investment_hold_period: z.string().min(1, "Investment hold period is required"),
  acquisition_date: z.string().min(1, "Acquisition date is required"),
  closing_date: z.string().min(1, "Closing date is required"),
  target_exit_date_debt: z.string().min(1, "Target exit date for debt is required"),
  target_exit_date_equity: z.string().min(1, "Target exit date for equity is required"),
  business_plan_property_section: z.string().optional(),
  offer_live_date: z.string().min(1, "Offer live date is required"),
  offer_closing_date: z.string().min(1, "Offer closing date is required"),
  funds_due_date: z.string().min(1, "Funds due date is required"),
  target_escrow_closing_date: z.string().min(1, "Target escrow closing date is required"),
  targeted_distribution_start_date: z.string().min(1, "Targeted distribution start date is required"),
  funds_modification_notice: z.boolean().optional(),
  investment_return_structure_section: z.string().optional(),
  distributions_begin_date: z.string().min(1, "Distribution begin date is required"),
  distribution_frequency: z.string().min(1, "Distribution frequency is required"),

  // The Sponsor
  sponsor_background_section: z.string().optional(),
  sponsor_background: z
    .string()
    .min(100, "Sponsor background must be at least 100 characters")
    .max(2000, "Sponsor background must not exceed 2000 characters"),
  about_sponsor_section: z.string().optional(),
  sponsor_metrics: SponsorMetricsSchema,
  track_record_attachment: z.any().optional(),

  // Physical Descriptions
  physical_descriptions_tabs: z.any().optional(),
  site_documents_section: z.string().optional(),
  site_documents: z.any().optional(),
  documents_section: z.string().optional(),
  closing_documents: z.any().optional(),
  offering_information: z.any().optional(),
  sponsor_information_docs: z.any().optional(),

  // Investment Structure
  offer_details_section: z.string().optional(),
  offer_details_table: OfferDetailsSchema,
  debt_details_section: z.string().optional(),
  debt_details_form: DebtDetailsSchema,
  equity_details_section: z.string().optional(),
  equity_details_form: EquityDetailsSchema,
  screening_notice: z.boolean().optional(),

  // Budget Sheet
  budget_tabs: z.any().optional(),
  budget_table: BudgetTableSchema,

  // Expenses & Revenue
  expenses_revenue_form: ExpensesRevenueSchema,
  media_assets_upload: z.any().optional(),
  fund_wallet: z.any().optional(),
  acknowledge_sign_docs: z.any().optional(),
  submit_project: z.any().optional(),
});

// Main schema union
export const OnboardingValidationSchema = z.union([
  BusinessInformationSchema,
  CompanyRepresentativeSchema,
  ProjectUploadSchema,
]);

// Export individual schemas for component validation
export {
  BusinessPlanRatingSchema,
  DealSnapshotSchema,
  RiskConsiderationsSchema,
  AddressInputSchema,
  ProjectDetailsSchema,
  SupportingDocumentsSchema,
  ReferenceLinksSchema,
  SponsorMetricsSchema,
  OfferDetailsSchema,
  DebtDetailsSchema,
  EquityDetailsSchema,
  BudgetTableSchema,
  ExpensesRevenueSchema,
};

// Helper function to validate specific section
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateSection(sectionKey: string, formData: Record<string, any>) {
  try {
    const phase = getCurrentPhase(sectionKey);

    if (phase === "business-information") {
      const result = BusinessInformationSchema.safeParse(formData);
      return {
        success: result.success,
        errors: result.success ? {} : formatZodErrors(result.error),
      };
    } else if (phase === "company-representative") {
      const result = CompanyRepresentativeSchema.safeParse(formData);
      return {
        success: result.success,
        errors: result.success ? {} : formatZodErrors(result.error),
      };
    } else if (phase === "project-upload") {
      const result = ProjectUploadSchema.safeParse(formData);
      return {
        success: result.success,
        errors: result.success ? {} : formatZodErrors(result.error),
      };
    }

    return { success: true, errors: {} };
  } catch (error) {
    console.error("Validation error:", error);
    return { success: false, errors: { general: "Validation error occurred" } };
  }
}

// Helper function to determine phase from section key
function getCurrentPhase(sectionKey: string): string {
  const businessSections = [
    "company-overview",
    "project-track-record",
    "investment-details",
    "risk-compliance",
    "communication-final",
  ];

  const companySections = ["personal-details", "company-bank-details"];

  const projectSections = [
    "sponsor-info",
    "project-overview",
    "project-consideration",
    "the-deal",
    "investment-returns",
    "the-sponsor",
    "physical-descriptions",
    "investment-structure",
    "budget-sheet",
    "expenses-revenue",
  ];

  if (businessSections.includes(sectionKey)) return "business-information";
  if (companySections.includes(sectionKey)) return "company-representative";
  if (projectSections.includes(sectionKey)) return "project-upload";

  return "unknown";
}

// Helper function to format zod errors
function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    formattedErrors[path] = issue.message;
  });

  return formattedErrors;
}
