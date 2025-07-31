import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjectUploadMutations, useProjectUpload } from "./use-project-upload-mutations";
import { ProjectUploadInput, projectUploadSchema } from "@/src/services/project-upload";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook for project upload form handling
 * @param step - Current step number (1-10)
 * @param sectionKey - Current section key
 */
export function useProjectUploadForm(step: number, sectionKey?: string) {
  const { saveStep, isLoading, error } = useProjectUploadMutations();
  const { data: projectData, isLoading: isLoadingData } = useProjectUpload();
  const { updateFormData, markSectionCompleted } = useOnboardingStoreWithUser();
  const router = useRouter();

  const form = useForm<ProjectUploadInput>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      currency: "",
      sponsor_name: "",
    },
  });

  // Load existing data when available
  React.useEffect(() => {
    if (projectData && !isLoadingData) {
      // Transform backend data to form format
      const formData = transformBackendToFormData(projectData);
      form.reset(formData);
    }
  }, [projectData, isLoadingData, form]);

  // Cleanup project ID on unmount if user navigates away from project upload
  React.useEffect(() => {
    return () => {
      // Only clear if we're not in the middle of a project upload flow
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/onboarding/sponsor/project-upload/")) {
        localStorage.removeItem("project-upload-id");
      }
    };
  }, []);

  const onSubmit = async (data: ProjectUploadInput) => {
    try {
      const result = await saveStep.mutateAsync({
        step,
        data,
      });

      // Update store with saved data
      updateFormData(result.project);

      // Persist project ID after first step
      if (step === 1 && result.project?.id) {
        localStorage.setItem("project-upload-id", result.project.id.toString());
      }

      // Mark section as completed if provided
      if (sectionKey) {
        markSectionCompleted(sectionKey);
      }

      // Navigate to next step or show success
      const currentStep = "current_step" in result ? result.current_step : step;
      if (currentStep < 10) {
        // Navigate to next step
        router.push(`/onboarding/sponsor/project-upload/${currentStep + 1}`);
      } else {
        // Project upload complete - clean up stored project ID
        localStorage.removeItem("project-upload-id");
        router.push("/onboarding/sponsor/project-upload/complete");
      }
    } catch (error) {
      console.error("Failed to save step:", error);
    }
  };

  const onSaveDraft = async (data: ProjectUploadInput) => {
    try {
      await saveStep.mutateAsync({
        step,
        data,
      });

      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const handleAutoSave = async () => {
    const data = form.getValues();
    if (form.formState.isDirty && !isLoading) {
      await onSaveDraft(data);
    }
  };

  const clearProjectId = () => {
    localStorage.removeItem("project-upload-id");
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onSaveDraft: form.handleSubmit(onSaveDraft),
    handleAutoSave,
    clearProjectId,
    isLoading: isLoading || isLoadingData,
    error,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    reset: form.reset,
  };
}

/**
 * Transform backend data to form data format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformBackendToFormData(backendData: any): ProjectUploadInput {
  return {
    // Sponsor Info (Step 1)
    currency: backendData.currency || "",
    sponsor_name: backendData.sponsor_name || "",
    sponsor_logo: backendData.sponsor_logo || null,

    // Project Overview (Step 2)
    project_name: backendData.project_name || "",
    project_subtitle: backendData.project_subtitle || "",
    project_summary: backendData.project_summary || "",
    years_operating: backendData.years_operating || "",
    historical_portfolio_activity: backendData.historical_portfolio_activity || "",
    assets_under_management: backendData.assets_under_management || "",
    number_of_realized_projects: backendData.number_of_realized_projects || "",
    rc_brown_capital_offerings: backendData.rc_brown_capital_offerings || "",

    // Project Consideration (Step 3)
    business_plan_ratings: Array.isArray(backendData.business_plan_ratings)
      ? backendData.business_plan_ratings
      : [
          { category: "leverage", rating: "" },
          { category: "occupancy", rating: "" },
          { category: "capex_hard_cost", rating: "" },
          { category: "target_noi_growth", rating: "" },
        ],
    definitions_document: backendData.definitions_document || null,
    deal_snapshots: backendData.deal_snapshots || null,
    risk_considerations: backendData.risk_considerations || [],

    // The Deal (Step 4) - Key Deal Points
    key_deal_points: backendData.key_deal_points || {
      projected_valuation: backendData.projected_valuation || "",
      timeline_completion: backendData.timeline_of_completion_months || "",
      total_capital_required: backendData.total_capital_required || "",
      total_debt_allocation: backendData.total_debt_allocation_percent?.toString() || "",
      debt_investment_tenure: backendData.debt_investment_tenure_months || "",
      percentage_yield_debt: backendData.percentage_yield_debt?.toString() || "",
      equity_investment_tenure: backendData.equity_investment_tenure || "",
      projected_returns_equity: backendData.projected_returns_equity_percent?.toString() || "",
      total_equity: backendData.total_equity_percent?.toString() || "",
    },

    // The Deal (Step 4) - Property Details
    property_address: backendData.property_address || null,
    location_description: backendData.location_description || "",
    occupancy_status: backendData.occupancy || "",
    about_property: backendData.about_property || "",
    detailed_project_description: backendData.detailed_project_description || "",
    anchor_tenant: backendData.has_anchor_tenant ? "yes" : "no",
    anchor_tenant_details: backendData.anchor_tenant_details || "",
    anchor_buyer: backendData.has_anchor_buyer ? "yes" : "no",
    anchor_buyer_details: backendData.anchor_buyer_details || "",
    percentage_leased: backendData.percent_leased?.toString() || "",
    sq_ft_leased: backendData.sq_ft_leased?.toString() || "",

    // Investment Returns (Step 5)
    investment_hold_period: backendData.investment_hold_period_years?.toString() || "",
    acquisition_date: backendData.acquisition_date || "",
    closing_date: backendData.closing_date || "",
    target_exit_date_debt: backendData.target_exit_date_debt || "",
    target_exit_date_equity: backendData.target_exit_date_equity || "",
    business_plan_the_property: backendData.business_plan_the_property || null,
    offer_live_date: backendData.offer_live_date || "",
    offer_closing_date: backendData.offer_closing_date || "",
    funds_due_date: backendData.funds_due_date || "",
    target_escrow_closing_date: backendData.target_escrow_closing_date || "",
    targeted_distribution_start_date_debt: backendData.targeted_distribution_start_date || "",
    targeted_distribution_start_date_equity: backendData.targeted_distribution_start_date || "",
    funds_modification_notice: backendData.funds_modification_notice || null,
    distributions_begin_date: backendData.distributions_anticipated_begin_date || "",
    distribution_frequency: backendData.frequency_of_distributions || "",

    // The Sponsor (Step 6)
    sponsor_background: backendData.sponsor_background || "",

    // Physical Descriptions (Step 7)
    physical_descriptions: backendData.physical_descriptions || [],

    // Investment Structure (Step 8)
    investment_structure_preamble: backendData.investment_structure_preamble || null,
    what_are_you_offering: backendData.what_are_you_offering || "",
    offer_details_table: backendData.offer_details_table || null,
    debt_details_form: backendData.debt_details_form || null,
    expenses_revenue_form: backendData.expenses_revenue_form || null,
    equity_details_form: backendData.equity_details_form || null,

    // Budget Sheet (Step 9)
    budget_tabs: backendData.budget_tabs || null,
    budget_table: backendData.budget_table || null,

    // Expenses & Revenue (Step 10)
    media_assets_upload: backendData.media_assets_upload || null,
    fund_wallet: backendData.fund_wallet || null,
    acknowledge_sign_docs: backendData.acknowledge_sign_docs || null,

    // Common fields - these are handled separately by the form hook
  };
}

/**
 * Hook for specific project upload sections
 */
export function useSponsorInfoForm() {
  return useProjectUploadForm(1, "sponsor-info");
}

export function useProjectOverviewForm() {
  return useProjectUploadForm(2, "project-overview");
}

export function useProjectConsiderationForm() {
  return useProjectUploadForm(3, "project-consideration");
}

export function useTheDealForm() {
  return useProjectUploadForm(4, "the-deal");
}

export function useInvestmentReturnsForm() {
  return useProjectUploadForm(5, "investment-returns");
}

export function useTheSponsorForm() {
  return useProjectUploadForm(6, "the-sponsor");
}

export function usePhysicalDescriptionsForm() {
  return useProjectUploadForm(7, "physical-descriptions");
}

export function useInvestmentStructureForm() {
  return useProjectUploadForm(8, "investment-structure");
}

export function useBudgetSheetForm() {
  return useProjectUploadForm(9, "budget-sheet");
}

export function useExpensesRevenueForm() {
  return useProjectUploadForm(10, "expenses-revenue");
}
