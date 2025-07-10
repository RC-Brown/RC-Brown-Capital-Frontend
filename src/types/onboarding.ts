export interface OnboardingField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "file" | "multi-file" | "multi-text" | "custom-component";
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  multiTextOptions?: string[];
  allowOther?: boolean;
  customComponent?: string;
  gridSpan?: 1 | 2; // Optional grid span configuration
  layout?: "default" | "inline"; // Layout option for special cases
  condition?: {
    // Optional condition for showing this field
    dependsOn: string; // The field key this depends on
    value: string | string[]; // The value(s) that trigger this field to show
  };
  validation: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    fileTypes?: string[];
    maxFileSize?: number;
    maxFiles?: number;
  };
}

export interface OnboardingSection {
  key: string;
  title: string;
  description?: string;
  fields: OnboardingField[];
  congratsMessage?: {
    title: string;
    description: string;
    ctaText: string;
  };
}

export interface OnboardingPhase {
  key: string;
  title: string;
  slug: string;
  description: string;
  sections: OnboardingSection[];
  isCompleted?: boolean;
}

export interface OnboardingSchema {
  phases: OnboardingPhase[];
}

// Union type for all possible form field values
export type FormFieldValue =
  | string // text, textarea, simple select/radio
  | number // numeric fields like user_id
  | boolean // checkboxes
  | File[] // file uploads
  | { selectedValue: string; otherValue: string } // select/radio with allowOther
  | Record<string, string> // multi-text fields, social media, etc.
  | Record<string, unknown> // complex custom components
  | unknown[] // arrays for various custom components
  | null
  | undefined;

export interface OnboardingFormData {
  [key: string]: FormFieldValue;
}

export interface OnboardingState {
  currentPhase: number;
  currentSection: number;
  formData: OnboardingFormData;
  completedSections: string[];
  lastSavedAt: Date | null;
}

// Additional types for API integration
export interface OnboardingProgress {
  current_step: number;
  completed_steps: number[];
  phase_progress: {
    [phaseKey: string]: {
      current_section: number;
      completed_sections: string[];
    };
  };
}

export interface SaveStepResponse {
  status: boolean;
  message: string;
  current_step: number;
  completed_steps: number[];
  is_draft: boolean;
  data: OnboardingFormData;
}

export interface OnboardingApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Business Information specific types
export interface BusinessOverviewData {
  company_currency: string;
  business_type: string;
  years_in_business: string;
  company_description: string;
  primary_focus: string;
}

export interface ProjectTrackRecordData {
  completed_projects: Record<string, unknown>[];
  project_docs: File[];
  average_roi: string;
  projected_completion_time: string;
  actual_completion_time: string;
}

export interface InvestmentDetailsData {
  typical_funding_structure: {
    type: string;
    custom?: string;
  };
  investments_exited: {
    type: string;
    custom?: string;
  };
  investment_size: string;
  capital_raised: boolean;
  capital_raise_relationship?: {
    type: string;
    custom?: string;
  };
  capital_issues: boolean;
  capital_issues_details?: string;
}

export interface RiskComplianceData {
  project_over_budget: boolean;
  project_over_budget_details?: string;
  capital_percentage: string;
  investment_interests: {
    options: string[];
    custom?: string;
  };
  legal_or_compliance_issues: boolean;
  legal_or_compliance_issues_details?: string;
  legal_compliance_measures?: string;
}

export interface CommunicationFinalData {
  preferred_update_rate: string;
  social_media: Record<string, string>;
  supporting_documents: File[];
  testimonials: string;
  reference_links: Record<string, string>[];
  terms_accepted: boolean;
}
