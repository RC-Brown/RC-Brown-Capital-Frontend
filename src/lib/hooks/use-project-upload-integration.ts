import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import { useSaveProjectUploadStep, useProjectUpload } from "./use-project-upload-mutations";
import { ProjectUploadInput } from "@/src/services/project-upload";
import { transformFormToBackendData, transformBackendToFormData } from "@/src/lib/utils/project-upload-field-mapping";
import { sponsorOnboardingSchema } from "@/src/lib/data/sponsor-onboarding-schema";
import { OnboardingField, FormFieldValue } from "@/src/types/onboarding";
import { toast } from "sonner";

/**
 * Hook that integrates project upload with the existing form system
 */
export function useProjectUploadIntegration() {
  const router = useRouter();
  const { data: session } = useSession();
  const store = useOnboardingStoreWithUser();
  const { formData, updateFormData, markSectionCompleted } = store;

  // Project upload hooks
  const saveProjectUploadStep = useSaveProjectUploadStep();
  const { data: projectData, isLoading: isLoadingProjectData } = useProjectUpload();

  // State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load project data when available
  useEffect(() => {
    if (projectData && !isLoadingProjectData) {
      const formDataFromBackend = transformBackendToFormData(projectData);
      updateFormData(formDataFromBackend);
    }
  }, [projectData, isLoadingProjectData, updateFormData]);

  /**
   * Get step number for project upload sections
   */
  const getProjectUploadStepNumber = useCallback((sectionKey: string): number => {
    const stepMapping: Record<string, number> = {
      "sponsor-info": 1,
      "project-overview": 2,
      "project-consideration": 3,
      "the-deal": 4,
      "investment-returns": 5,
      "the-sponsor": 6,
      "physical-descriptions": 7,
      "investment-structure": 8,
      "budget-sheet": 9,
      "media-acknowledgement": 10,
    };

    return stepMapping[sectionKey] || 1;
  }, []);

  /**
   * Validate section data
   */
  const validateSectionData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentSectionData: any): boolean => {
      if (!currentSectionData?.fields) return true;

      const newErrors: Record<string, string> = {};
      let hasErrors = false;

      currentSectionData.fields.forEach((field: OnboardingField) => {
        const value = formData[field.key];
        const validation = field.validation;

        if (validation?.required && (!value || (typeof value === "string" && value.trim() === ""))) {
          newErrors[field.key] = `${field.label} is required`;
          hasErrors = true;
        }

        if (validation?.minLength && typeof value === "string" && value.length < validation.minLength) {
          newErrors[field.key] = `${field.label} must be at least ${validation.minLength} characters`;
          hasErrors = true;
        }

        if (validation?.maxLength && typeof value === "string" && value.length > validation.maxLength) {
          newErrors[field.key] = `${field.label} must not exceed ${validation.maxLength} characters`;
          hasErrors = true;
        }
      });

      setErrors(newErrors);
      return !hasErrors;
    },
    [formData]
  );

  /**
   * Save project upload step
   */
  const saveStep = useCallback(
    async (sectionKey: string, isDraft: boolean = false) => {
      if (!session?.user?.id) {
        toast.error("User session not available");
        return false;
      }

      try {
        const step = getProjectUploadStepNumber(sectionKey);
        const apiData = transformFormToBackendData(formData as ProjectUploadInput);

        await saveProjectUploadStep.mutateAsync({
          step,
          data: {
            ...apiData,
            is_draft: isDraft,
            current_step: step,
          },
        });

        // Mark section as completed if not draft
        if (!isDraft) {
          markSectionCompleted(sectionKey);
        }

        return true;
      } catch (error) {
        console.error("Failed to save project upload step:", error);
        return false;
      }
    },
    [session?.user?.id, formData, getProjectUploadStepNumber, saveProjectUploadStep, markSectionCompleted]
  );

  /**
   * Handle next step
   */
  const handleNext = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (currentSectionData: any) => {
      if (!validateSectionData(currentSectionData)) {
        return false;
      }

      const success = await saveStep(currentSectionData.key, false);
      if (!success) {
        return false;
      }

      return true;
    },
    [validateSectionData, saveStep]
  );

  /**
   * Handle save and exit
   */
  const handleSaveAndExit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (currentSectionData: any) => {
      const success = await saveStep(currentSectionData.key, true);
      if (success) {
        toast.success("Progress saved successfully!");
        router.push("/onboarding/sponsor");
      }
      return success;
    },
    [saveStep, router]
  );

  /**
   * Handle field change
   */
  const handleFieldChange = useCallback(
    (fieldKey: string, value: unknown) => {
      updateFormData({ [fieldKey]: value as FormFieldValue });

      // Clear error for this field
      if (errors[fieldKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
      }
    },
    [updateFormData, errors]
  );

  /**
   * Get current phase data
   */
  const getCurrentPhaseData = useCallback(() => {
    const phase = sponsorOnboardingSchema.phases.find((p) => p.slug === "project-upload");
    return phase;
  }, []);

  return {
    // State
    formData,
    errors,
    isLoading: saveProjectUploadStep.isPending || isLoadingProjectData,

    // Functions
    validateSectionData,
    saveStep,
    handleNext,
    handleSaveAndExit,
    handleFieldChange,
    getCurrentPhaseData,
    getProjectUploadStepNumber,

    // Utilities
    updateFormData,
    markSectionCompleted,
  };
}
