import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  saveBusinessInformationStep,
  saveCompanyRepresentativeStep,
  getBusinessInformation,
  getCompanyRepresentative,
  uploadSupportingDocuments,
  getOnboardingProgress,
  BusinessInformationInput,
  CompanyRepresentativeInput,
} from "@/src/services/onboarding";
import { useOnboardingStore } from "@/src/lib/store/onboarding-store";
import { toast } from "sonner";

// Query keys for React Query
export const onboardingKeys = {
  all: ["onboarding"] as const,
  businessInfo: () => [...onboardingKeys.all, "business-info"] as const,
  companyRep: () => [...onboardingKeys.all, "company-rep"] as const,
  progress: () => [...onboardingKeys.all, "progress"] as const,
};

/**
 * Hook to save business information step
 */
export function useSaveBusinessInformationStep() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { updateFormData, markSectionCompleted } = useOnboardingStore();

  return useMutation({
    mutationFn: async ({
      step,
      data,
      // sectionKey,
    }: {
      step: number;
      data: BusinessInformationInput;
      sectionKey?: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await saveBusinessInformationStep(step, data, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data, variables) => {
      // Update Zustand store with the saved data
      updateFormData(data.data);

      // Mark section as completed if provided
      if (variables.sectionKey) {
        markSectionCompleted(variables.sectionKey);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: onboardingKeys.businessInfo() });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });

      // Show success message
      // toast.success(data.message || "Step saved successfully!");
    },
    onError: (error: Error) => {
      if (error instanceof Error) {
        toast(error.message);
      }
    },
  });
}

/**
 * Hook to get business information
 */
export function useBusinessInformation() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: onboardingKeys.businessInfo(),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await getBusinessInformation(session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to save company representative step
 */
export function useSaveCompanyRepresentativeStep() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { updateFormData, markSectionCompleted } = useOnboardingStore();

  return useMutation({
    mutationFn: async ({
      step,
      data,
      // sectionKey,
    }: {
      step: number;
      data: CompanyRepresentativeInput;
      sectionKey?: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await saveCompanyRepresentativeStep(step, data, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data, variables) => {
      updateFormData(data.data);

      if (variables.sectionKey) {
        markSectionCompleted(variables.sectionKey);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: onboardingKeys.companyRep() });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });

      // Show success message
      // toast.success(data.message || "Company representative step saved successfully!");
    },
    onError: (error: Error) => {
      if (error instanceof Error) {
        toast(error.message);
      }
    },
  });
}

/**
 * Hook to get company representative information
 */
export function useCompanyRepresentative() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: onboardingKeys.companyRep(),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await getCompanyRepresentative(session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to upload supporting documents
 */
export function useUploadSupportingDocuments() {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      files,
      documentType,
    }: {
      files: File[];
      documentType: "licenses" | "tax_certificate" | "others";
    }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await uploadSupportingDocuments(files, documentType, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (fileUrls, variables) => {
      toast.success(`${variables.files.length} file(s) uploaded successfully!`);
    },
    onError: (error: Error) => {
      if (error instanceof Error) {
        toast(error.message);
      }
    },
  });
}

/**
 * Hook to get onboarding progress
 */
export function useOnboardingProgress() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: onboardingKeys.progress(),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await getOnboardingProgress(session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    enabled: !!session?.accessToken,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Comprehensive hook that combines multiple onboarding mutations
 */
export function useOnboardingMutations() {
  const saveStep = useSaveBusinessInformationStep();
  const uploadDocuments = useUploadSupportingDocuments();

  return {
    saveStep,
    uploadDocuments,
    // Convenience methods
    saveStepAsync: saveStep.mutateAsync,
    uploadDocumentsAsync: uploadDocuments.mutateAsync,
    isLoading: saveStep.isPending || uploadDocuments.isPending,
    isError: saveStep.isError || uploadDocuments.isError,
    error: saveStep.error || uploadDocuments.error,
  };
}

/**
 * Hook for saving and continuing to next section
 */
export function useSaveAndContinue() {
  const { currentSection, setCurrentSection } = useOnboardingStore();
  const saveStep = useSaveBusinessInformationStep();

  const saveAndContinue = async (
    step: number,
    data: BusinessInformationInput,
    sectionKey: string,
    totalSections: number
  ) => {
    try {
      await saveStep.mutateAsync({ step, data, sectionKey });

      if (currentSection < totalSections - 1) {
        setCurrentSection(currentSection + 1);
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }

      return false;
    }
  };

  return {
    saveAndContinue,
    isLoading: saveStep.isPending,
    error: saveStep.error,
  };
}

/**
 * Hook for saving as draft
 */
export function useSaveAsDraft() {
  const saveStep = useSaveBusinessInformationStep();
  const { updateFormData } = useOnboardingStore();

  const saveAsDraft = async (step: number, data: BusinessInformationInput) => {
    try {
      const draftData = { ...data, is_draft: true };
      await saveStep.mutateAsync({ step, data: draftData });

      updateFormData(draftData);

      toast.success("Draft saved successfully!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
        return false;
      }

      return false;
    }
  };

  return {
    saveAsDraft,
    isLoading: saveStep.isPending,
    error: saveStep.error,
  };
}
