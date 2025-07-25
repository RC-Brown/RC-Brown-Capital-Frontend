import { OnboardingFormData, OnboardingState } from "@/src/types/onboarding";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSession } from "next-auth/react";

interface OnboardingStore extends OnboardingState {
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  setCurrentPhase: (phase: number) => void;
  setCurrentSection: (section: number) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  markSectionCompleted: (sectionKey: string) => void;
  resetOnboarding: () => void;
  clearUserData: () => void;

  setProgressFromApi: (currentStep: number, completedSteps: number[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFromApiResponse: (data: any) => void;
}

// Store instances cache
const storeInstances = new Map<string, ReturnType<typeof createOnboardingStore>>();

// Factory function to create user-specific stores
const createOnboardingStore = (userEmail: string | null) => {
  const storageKey = userEmail ? `onboarding-storage-${userEmail}` : "onboarding-storage-guest";

  return create<OnboardingStore>()(
    persist(
      (set, get) => ({
        userEmail,
        currentPhase: 1, // Start with Business Information (phase 1)
        currentSection: 0,
        formData: {},
        completedSections: [],
        lastSavedAt: null,

        setUserEmail: (email) => {
          const currentEmail = get().userEmail;
          // If email is different, clear existing data and set new email
          if (currentEmail !== email) {
            set({
              userEmail: email,
              currentPhase: 1,
              currentSection: 0,
              formData: {},
              completedSections: [],
              lastSavedAt: null,
            });
          } else {
            set({ userEmail: email });
          }
        },

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

        clearUserData: () =>
          set({
            userEmail: null,
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
        name: storageKey,
        // Only persist form data and progress, not temporary states
        partialize: (state) => ({
          userEmail: state.userEmail,
          currentPhase: state.currentPhase,
          currentSection: state.currentSection,
          formData: state.formData,
          completedSections: state.completedSections,
          lastSavedAt: state.lastSavedAt,
        }),
      }
    )
  );
};

// Get or create store for a specific user
const getOnboardingStore = (userEmail: string | null) => {
  const key = userEmail || "guest";

  if (!storeInstances.has(key)) {
    storeInstances.set(key, createOnboardingStore(userEmail));
  }

  return storeInstances.get(key)!;
};

// Default store for backward compatibility
export const useOnboardingStore = getOnboardingStore(null);

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

// Hook to initialize store with user email and handle user-specific storage
export const useOnboardingStoreWithUser = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || null;
  const store = getOnboardingStore(userEmail);

  return store();
};

// Function to manually clear storage for a specific user
export const clearUserOnboardingStorage = (email: string) => {
  const storageKey = `onboarding-storage-${email}`;
  if (typeof window !== "undefined") {
    localStorage.removeItem(storageKey);
  }
  // Remove from cache
  storeInstances.delete(email);
};

// Function to get storage key for a user
export const getUserStorageKey = (email: string | null): string => {
  return email ? `onboarding-storage-${email}` : "onboarding-storage-guest";
};
