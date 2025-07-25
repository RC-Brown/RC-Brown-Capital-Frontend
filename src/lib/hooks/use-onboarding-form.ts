import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import { useBusinessInformation, useSaveAndContinue, useSaveAsDraft } from "./use-onboarding-mutations";
import { BusinessInformationInput } from "@/src/services/onboarding";
import { useEffect } from "react";
import { FormFieldValue } from "@/src/types/onboarding";

// Form schemas for each business information step
export const companyOverviewSchema = z.object({
  company_currency: z.string().min(1, "Currency is required"),
  business_type: z.string().min(1, "Business type is required"),
  years_in_business: z.string().min(1, "Years in business is required"),
  company_description: z.string().min(50, "Description must be at least 50 characters"),
  primary_focus: z.string().min(1, "Primary focus is required"),
});

export const projectTrackRecordSchema = z.object({
  completed_projects: z.array(z.record(z.unknown())),
  project_docs: z.array(z.instanceof(File)).optional(),
  average_roi: z.string().min(1, "Average ROI is required"),
  projected_completion_time: z.string().min(1, "Projected completion time is required"),
  actual_completion_time: z.string().optional(),
});

export const investmentDetailsSchema = z.object({
  typical_funding_structure: z.object({
    type: z.string().min(1, "Funding structure type is required"),
    custom: z.string().optional(),
  }),
  investments_exited: z.object({
    type: z.string().min(1, "Exit strategy type is required"),
    custom: z.string().optional(),
  }),
  investment_size: z.string().min(1, "Investment size is required"),
  capital_raised: z.boolean(),
  capital_raise_relationship: z
    .object({
      type: z.string(),
      custom: z.string().optional(),
    })
    .optional(),
  capital_issues: z.boolean(),
  capital_issues_details: z.string().optional(),
});

export const riskComplianceSchema = z.object({
  project_over_budget: z.boolean(),
  project_over_budget_details: z.string().optional(),
  capital_percentage: z.string().min(1, "Capital percentage is required"),
  investment_interests: z.object({
    options: z.array(z.string()),
    custom: z.string().optional(),
  }),
  legal_or_compliance_issues: z.boolean(),
  legal_or_compliance_issues_details: z.string().optional(),
  legal_compliance_measures: z.string().optional(),
});

export const communicationFinalSchema = z.object({
  preferred_update_rate: z.string().min(1, "Update frequency is required"),
  social_media: z.record(z.string()).optional(),
  supporting_documents: z.array(z.instanceof(File)).optional(),
  testimonials: z.string().optional(),
  reference_links: z.array(z.record(z.string())).optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type CompanyOverviewForm = z.infer<typeof companyOverviewSchema>;
export type ProjectTrackRecordForm = z.infer<typeof projectTrackRecordSchema>;
export type InvestmentDetailsForm = z.infer<typeof investmentDetailsSchema>;
export type RiskComplianceForm = z.infer<typeof riskComplianceSchema>;
export type CommunicationFinalForm = z.infer<typeof communicationFinalSchema>;

/**
 * Main hook for onboarding forms that provides form handling, validation, and API integration
 */
export function useOnboardingForm<T extends Record<string, FormFieldValue>>(
  schema: z.ZodSchema<T>,
  step: number,
  sectionKey: string,
  defaultValues?: Partial<T>
) {
  const { data: session } = useSession();
  const { formData, updateFormData } = useOnboardingStoreWithUser();
  const { data: businessInfo } = useBusinessInformation();
  const saveAndContinue = useSaveAndContinue();
  const saveAsDraft = useSaveAsDraft();

  const form = useForm<T>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...defaultValues,
      ...formData,
      ...businessInfo,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    mode: "onChange",
  });

  // Load saved data when available
  useEffect(() => {
    if (businessInfo || Object.keys(formData).length > 0) {
      const savedData = { ...formData, ...businessInfo };
      Object.keys(savedData).forEach((key) => {
        if (savedData[key] !== undefined && key in form.getValues()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(key as any, savedData[key] as any, { shouldValidate: false });
        }
      });
    }
  }, [businessInfo, formData, form]);

  // Convert form data to API format
  const convertToApiFormat = (formData: T): BusinessInformationInput => {
    if (!session?.user?.id) {
      throw new Error("User ID not available");
    }

    return {
      user_id: parseInt(session.user.id),
      ...formData,
    } as BusinessInformationInput;
  };

  const handleSubmit = async (data: T, shouldContinue: boolean = true) => {
    try {
      const apiData = convertToApiFormat(data);

      if (shouldContinue) {
        // Save and continue to next section
        const success = await saveAndContinue.saveAndContinue(
          step,
          apiData,
          sectionKey,
          5 // Total sections in business information phase
        );
        return success;
      } else {
        // Just save without continuing
        await saveAsDraft.saveAsDraft(step, apiData);
        return true;
      }
    } catch (error) {
      console.error("Form submission error:", error);
      return false;
    }
  };

  const handleSaveAsDraft = async () => {
    const formData = form.getValues();
    updateFormData(formData);

    try {
      const apiData = convertToApiFormat(formData);
      return await saveAsDraft.saveAsDraft(step, apiData);
    } catch (error) {
      console.error("Draft save error:", error);
      return false;
    }
  };

  // Auto-save functionality
  const handleAutoSave = async () => {
    if (form.formState.isDirty) {
      await handleSaveAsDraft();
    }
  };

  return {
    form,
    handleSubmit,
    handleSaveAsDraft,
    handleAutoSave,
    isLoading: saveAndContinue.isLoading || saveAsDraft.isLoading,
    error: saveAndContinue.error || saveAsDraft.error,
    // Convenience methods
    onSubmit: form.handleSubmit((data) => handleSubmit(data as T, true)),
    onSaveDraft: form.handleSubmit((data) => handleSubmit(data as T, false)),
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    formState: form.formState,
  };
}

/**
 * Specific hooks for each business information step
 */

export function useCompanyOverviewForm(defaultValues?: Partial<CompanyOverviewForm>) {
  return useOnboardingForm(companyOverviewSchema, 1, "company-overview", defaultValues);
}

export function useProjectTrackRecordForm(defaultValues?: Partial<ProjectTrackRecordForm>) {
  return useOnboardingForm(projectTrackRecordSchema, 2, "project-track-record", defaultValues);
}

export function useInvestmentDetailsForm(defaultValues?: Partial<InvestmentDetailsForm>) {
  return useOnboardingForm(investmentDetailsSchema, 3, "investment-details", defaultValues);
}

export function useRiskComplianceForm(defaultValues?: Partial<RiskComplianceForm>) {
  return useOnboardingForm(riskComplianceSchema, 4, "risk-compliance", defaultValues);
}

export function useCommunicationFinalForm(defaultValues?: Partial<CommunicationFinalForm>) {
  return useOnboardingForm(communicationFinalSchema, 5, "communication-final", defaultValues);
}
