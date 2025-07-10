import { OnboardingFormData, OnboardingState } from "@/src/types/onboarding";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingStore extends OnboardingState {
  setCurrentPhase: (phase: number) => void;
  setCurrentSection: (section: number) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  markSectionCompleted: (sectionKey: string) => void;
  resetOnboarding: () => void;

  setProgressFromApi: (currentStep: number, completedSteps: number[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFromApiResponse: (data: any) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentPhase: 1, // Start with Business Information (phase 1)
      currentSection: 0,
      formData: {},
      completedSections: [],
      lastSavedAt: null,

      setCurrentPhase: (phase) => set({ currentPhase: phase }),

      setCurrentSection: (section) => set({ currentSection: section }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
          lastSavedAt: new Date(),
        })),

      markSectionCompleted: (sectionKey) =>
        set((state) => ({
          completedSections: state.completedSections.includes(sectionKey)
            ? state.completedSections
            : [...state.completedSections, sectionKey],
        })),

      resetOnboarding: () =>
        set({
          currentPhase: 1,
          currentSection: 0,
          formData: {},
          completedSections: [],
          lastSavedAt: null,
        }),

      // New method to update store from API progress response
      setProgressFromApi: (currentStep) => {
        // Map API step numbers to our phase/section structure
        // This depends on how your backend maps steps to sections
        const phaseFromStep = Math.ceil(currentStep / 5); // Assuming 5 steps per phase
        const sectionFromStep = (currentStep - 1) % 5; // Section within phase

        set({
          currentPhase: phaseFromStep,
          currentSection: sectionFromStep,
          // You might want to derive completed sections from completedSteps
        });
      },

      updateFromApiResponse: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
          lastSavedAt: new Date(),
        })),
    }),
    {
      name: "onboarding-storage",
      // Only persist form data and progress, not temporary states
      partialize: (state) => ({
        currentPhase: state.currentPhase,
        currentSection: state.currentSection,
        formData: state.formData,
        completedSections: state.completedSections,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);

// Helper hooks for common use cases
export const useOnboardingProgress = () => {
  const store = useOnboardingStore();
  return {
    currentPhase: store.currentPhase,
    currentSection: store.currentSection,
    completedSections: store.completedSections,
    setCurrentPhase: store.setCurrentPhase,
    setCurrentSection: store.setCurrentSection,
    markSectionCompleted: store.markSectionCompleted,
  };
};

export const useOnboardingFormData = () => {
  const store = useOnboardingStore();
  return {
    formData: store.formData,
    updateFormData: store.updateFormData,
    lastSavedAt: store.lastSavedAt,
  };
};
