/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { SectionProgressTracker } from "@/src/components/molecules/progress-tracker";
import { FormField, FormFieldRef } from "@/src/components/onboarding/form-field";
import { CongratulationsPopup } from "@/src/components/molecules/congratulations-popup";
import { SaveAndExitPopup } from "@/src/components/molecules/save-and-exit-popup";
import { sponsorOnboardingSchema } from "@/src/lib/data/sponsor-onboarding-schema";
import { useOnboardingStore } from "@/src/lib/store/onboarding-store";
import {
  useSaveBusinessInformationStep,
  useSaveCompanyRepresentativeStep,
} from "@/src/lib/hooks/use-onboarding-mutations";
import { BusinessInformationInput, CompanyRepresentativeInput } from "@/src/services/onboarding";
import {
  transformFormDataToApi,
  getSectionStepNumber,
  transformCompanyRepDataToApi,
  getCompanyRepSectionStepNumber,
} from "@/src/lib/utils/onboarding-field-mapping";
import { OnboardingField } from "@/src/types/onboarding";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface FormPageProps {
  params: Promise<{
    phase: string;
  }>;
}

interface CongratsMessage {
  title: string;
  description: string;
  ctaText: string;
}

export default function FormPage({ params }: FormPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const {
    currentSection,
    formData,
    completedSections,
    updateFormData,
    markSectionCompleted,
    setCurrentSection,
    setCurrentPhase,
  } = useOnboardingStore();

  // Backend integration hooks
  const saveBusinessStepMutation = useSaveBusinessInformationStep();
  const saveCompanyRepStepMutation = useSaveCompanyRepresentativeStep();

  // All state hooks
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [currentCongratsMessage, setCurrentCongratsMessage] = useState<CongratsMessage | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showSaveAndExit, setShowSaveAndExit] = useState(false);
  const formFieldRefs = useRef<Record<string, FormFieldRef | null>>({});

  // Find phase and current section data
  const phase = sponsorOnboardingSchema.phases.find((p) => p.slug === resolvedParams.phase);
  const phaseIndex = sponsorOnboardingSchema.phases.findIndex((p) => p.slug === resolvedParams.phase);
  const currentSectionData = phase?.sections[currentSection];

  // Function to check if a field should be shown based on conditions
  const shouldShowField = useCallback(
    (field: OnboardingField): boolean => {
      if (!field.condition) return true;

      const dependentValue = formData[field.condition.dependsOn];
      const targetValues = Array.isArray(field.condition.value) ? field.condition.value : [field.condition.value];

      const actualValue =
        typeof dependentValue === "object" &&
        dependentValue !== null &&
        !Array.isArray(dependentValue) &&
        "selectedValue" in dependentValue
          ? (dependentValue as { selectedValue: string }).selectedValue
          : dependentValue;

      return targetValues.includes(actualValue as string);
    },
    [formData]
  );

  // Real-time validation function wrapped in useCallback
  const validateSectionDataRealtime = useCallback(() => {
    if (!currentSectionData || !currentSectionData.fields) return;

    const currentSectionFields = currentSectionData.fields.filter(shouldShowField);
    const realtimeErrors: Record<string, string> = {};

    currentSectionFields.forEach((field) => {
      const value = formData[field.key];

      // Only show validation errors for fields that have been touched/have content
      if (value !== undefined && value !== "" && value !== null) {
        // Basic validations
        if (typeof value === "string") {
          if (field.validation.minLength && value.length < field.validation.minLength) {
            realtimeErrors[field.key] = `Minimum ${field.validation.minLength} characters required`;
          }

          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            realtimeErrors[field.key] = `Maximum ${field.validation.maxLength} characters allowed`;
          }

          if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
            realtimeErrors[field.key] = "Invalid format";
          }
        }

        // Custom component validations
        if (field.type === "custom-component" && field.validation.required) {
          if (Array.isArray(value) && value.length === 0) {
            realtimeErrors[field.key] = "This field is required";
          } else if (typeof value === "object" && value !== null && Object.keys(value).length === 0) {
            realtimeErrors[field.key] = "This field is required";
          } else if (typeof value === "boolean" && value === false) {
            realtimeErrors[field.key] = "This field is required";
          }
        }
      }
    });

    // Preserve existing errors for required fields that are still empty
    // This prevents the real-time validation from clearing errors that were set by manual validation
    currentSectionFields.forEach((field) => {
      const value = formData[field.key];
      const hasExistingError = errors[field.key];

      // If field is required, empty, and has an existing error, preserve it
      if (
        field.validation.required &&
        hasExistingError &&
        (!value ||
          value === "" ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "object" && value !== null && Object.keys(value).length === 0))
      ) {
        realtimeErrors[field.key] = hasExistingError;
      }
    });

    // Only update errors if they've changed to avoid unnecessary re-renders
    const errorKeys = Object.keys(realtimeErrors).sort();
    const currentErrorKeys = Object.keys(errors).sort();

    if (
      JSON.stringify(errorKeys) !== JSON.stringify(currentErrorKeys) ||
      JSON.stringify(realtimeErrors) !== JSON.stringify(errors)
    ) {
      setErrors(realtimeErrors);
    }
  }, [currentSectionData, shouldShowField, formData, errors]);

  // Set default values for radio and select fields when section changes
  useEffect(() => {
    if (currentSectionData) {
      const defaultValues: Record<string, unknown> = {};

      currentSectionData.fields.forEach((field) => {
        const hasCurrentValue =
          formData[field.key] !== undefined && formData[field.key] !== null && formData[field.key] !== "";

        if (!hasCurrentValue) {
          // Set default for radio fields - always use first option
          if (field.type === "radio" && Array.isArray(field.options) && field.options.length > 0) {
            if (field.allowOther) {
              // For radio fields with allowOther, use object format
              defaultValues[field.key] = {
                selectedValue: field.options[0].value,
                otherValue: "",
              };
            } else {
              // For regular radio fields, use string value
              defaultValues[field.key] = field.options[0].value;
            }
          }

          // Set default for select fields without placeholder - use first option
          if (
            field.type === "select" &&
            !field.placeholder &&
            Array.isArray(field.options) &&
            field.options.length > 0
          ) {
            if (field.allowOther) {
              // For select fields with allowOther, use object format
              defaultValues[field.key] = {
                selectedValue: field.options[0].value,
                otherValue: "",
              };
            } else {
              // For regular select fields, use string value
              defaultValues[field.key] = field.options[0].value;
            }
          }
        }
      });

      if (Object.keys(defaultValues).length > 0) {
        updateFormData(defaultValues as Record<string, any>);
      }
    }
  }, [currentSection, updateFormData, currentSectionData, formData]);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection]);

  // Real-time validation with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isValidating) {
        setIsValidating(true);
        // Perform validation without blocking UI
        validateSectionDataRealtime();
        setIsValidating(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData, currentSection, isValidating, validateSectionDataRealtime]);

  // Early return AFTER all hooks have been called
  if (!phase || !currentSectionData) {
    router.push("/onboarding/sponsor");
    return null;
  }

  const validateSectionData = () => {
    // Get only the fields for the current section that are visible
    if (!currentSectionData || !currentSectionData.fields) return false;

    const currentSectionFields = currentSectionData.fields.filter(shouldShowField);
    const sectionFormData: Record<string, unknown> = {};

    // Extract only the data relevant to current section
    currentSectionFields.forEach((field) => {
      if (formData[field.key] !== undefined) {
        sectionFormData[field.key] = formData[field.key];
      }
    });

    // Basic validation for required fields first
    const basicErrors: Record<string, string> = {};
    currentSectionFields.forEach((field) => {
      const value = formData[field.key];

      // Trigger custom component validation
      if (field.type === "custom-component") {
        const fieldRef = formFieldRefs.current[field.key];
        if (fieldRef) {
          const isValid = fieldRef.validateCustomComponent();
          if (!isValid && field.validation.required) {
            basicErrors[field.key] = "Please complete all required fields";
          }
        }
      }

      // Check if field is required and empty
      if (field.validation.required) {
        if (
          !value ||
          value === "" ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "object" && Object.keys(value).length === 0)
        ) {
          basicErrors[field.key] = "This field is required";
        }
      }

      // Additional validations for non-empty values
      if (value && typeof value === "string") {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          basicErrors[field.key] = `Minimum ${field.validation.minLength} characters required`;
        }

        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          basicErrors[field.key] = `Maximum ${field.validation.maxLength} characters allowed`;
        }

        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          basicErrors[field.key] = "Invalid format";
        }
      }
    });

    if (Object.keys(basicErrors).length > 0) {
      setErrors(basicErrors);
      toast.error("Please fill in all required fields");
      return false;
    }

    // Clear errors if validation passes
    setErrors({});
    return true;
  };

  const getCurrentStep = () => {
    if (resolvedParams.phase === "business-information") {
      return getSectionStepNumber(currentSectionData.key);
    } else if (resolvedParams.phase === "company-representative") {
      return getCompanyRepSectionStepNumber(currentSectionData.key);
    }

    return 1; // Default to step 1 for other phases
  };

  // Convert form data to API format
  const convertToApiFormat = (): BusinessInformationInput | CompanyRepresentativeInput => {
    if (!session?.user?.id) {
      throw new Error("User ID not available");
    }

    if (resolvedParams.phase === "business-information") {
      return transformFormDataToApi(formData, parseInt(session.user.id));
    } else if (resolvedParams.phase === "company-representative") {
      return transformCompanyRepDataToApi(formData, parseInt(session.user.id));
    }

    // Fallback for other phases
    return transformFormDataToApi(formData, parseInt(session.user.id));
  };

  const handleNext = async () => {
    if (!validateSectionData()) return;

    // Save to backend for phases that have backend integration
    if (resolvedParams.phase === "business-information") {
      try {
        const apiData = convertToApiFormat() as BusinessInformationInput;
        const step = getCurrentStep();

        await saveBusinessStepMutation.mutateAsync({
          step,
          data: apiData,
          sectionKey: currentSectionData.key,
        });

        // The mutation success handler in the hook will update the store automatically
      } catch (error) {
        console.error("Failed to save business information step:", error);
        // Error toast is handled by the mutation hook
        return;
      }
    } else if (resolvedParams.phase === "company-representative") {
      try {
        const apiData = convertToApiFormat() as CompanyRepresentativeInput;
        const step = getCurrentStep();

        await saveCompanyRepStepMutation.mutateAsync({
          step,
          data: apiData,
          sectionKey: currentSectionData.key,
        });

        // The mutation success handler in the hook will update the store automatically
      } catch (error) {
        console.error("Failed to save company representative step:", error);
        // Error toast is handled by the mutation hook
        return;
      }
    } else {
      // For other phases, just mark section as completed locally
      markSectionCompleted(currentSectionData.key);
    }

    // Show congratulations if section has a message
    if (currentSectionData.congratsMessage) {
      setCurrentCongratsMessage(currentSectionData.congratsMessage);
      setShowCongrats(true);
      return;
    }

    // Move to next section or phase
    proceedToNext();
  };

  const proceedToNext = () => {
    console.log({
      currentSection,
      phase,
      phaseIndex,
      phaseSectionsLength: phase.sections.length,
    });
    if (currentSection < phase.sections.length - 1) {
      // Move to next section
      setCurrentSection(currentSection + 1);
    } else {
      // Move to next phase - always redirect to main onboarding page
      const nextPhaseIndex = phaseIndex + 1;
      if (nextPhaseIndex < sponsorOnboardingSchema.phases.length) {
        setCurrentPhase(nextPhaseIndex);
        setCurrentSection(0);
      }
      // Always redirect to onboarding sponsor page to show next phase
      router.push("/onboarding/sponsor");
    }
  };

  const handleSaveAndExit = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Saving your progress...");

      // Save to backend for phases that have backend integration
      if (resolvedParams.phase === "business-information") {
        const apiData = convertToApiFormat() as BusinessInformationInput;
        const step = getCurrentStep();

        // Save as draft
        await saveBusinessStepMutation.mutateAsync({
          step,
          data: { ...apiData, is_draft: true },
          sectionKey: currentSectionData.key,
        });
      } else if (resolvedParams.phase === "company-representative") {
        const apiData = convertToApiFormat() as CompanyRepresentativeInput;
        const step = getCurrentStep();

        // Save as draft
        await saveCompanyRepStepMutation.mutateAsync({
          step,
          data: { ...apiData, is_draft: true },
          sectionKey: currentSectionData.key,
        });
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success popup
      setShowSaveAndExit(true);
    } catch (error) {
      toast.error("Failed to save progress. Please try again.");
      console.error("Save and exit error:", error);
    }
  };

  const handleSaveAndExitConfirm = () => {
    setShowSaveAndExit(false);
    router.push("/onboarding/sponsor");
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      router.push(`/onboarding/sponsor/${resolvedParams.phase}`);
    }
  };

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    updateFormData({ [fieldKey]: value } as any);
    // Clear error when user starts typing
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-6'>
          {/* Left Sidebar - Progress Tracker */}
          <div className='lg:col-span-2'>
            <div className='sticky top-28'>
              <Card className='rounded-2xl border-none bg-white px-4 shadow-none'>
                <CardContent className='px-6 pb-6 pt-3'>
                  <div className='mb-4 flex items-center justify-between'>
                    <Button variant='ghost' onClick={handleBack} className='h-auto p-0 font-normal'>
                      <span className='flex items-center space-x-2'>
                        <ArrowLeft className='size-4' />
                        <span className='text-sm text-text-muted'>Back</span>
                      </span>
                    </Button>
                    <Button
                      variant='outline'
                      className='rounded-xl px-3 text-sm font-normal text-text-muted has-[>svg]:py-2'
                      onClick={handleSaveAndExit}
                      disabled={saveBusinessStepMutation.isPending || saveCompanyRepStepMutation.isPending}
                    >
                      {(saveBusinessStepMutation.isPending || saveCompanyRepStepMutation.isPending) && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Save & Exit
                    </Button>
                  </div>

                  <SectionProgressTracker
                    sections={phase.sections}
                    currentSection={currentSection}
                    completedSections={completedSections}
                    onSectionClick={(sectionIndex) => {
                      if (completedSections.includes(phase.sections[sectionIndex].key)) {
                        setCurrentSection(sectionIndex);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-4'>
            <Card className='rounded-2xl border-none bg-white px-6 shadow-none'>
              <CardHeader>
                <div className='flex items-center justify-between border-b border-black/10 pb-6'>
                  <div>
                    <CardTitle className='text-xl font-semibold -tracking-[3%] text-primary'>
                      {currentSectionData.title}
                    </CardTitle>
                    <p className='mt-1 text-base text-text-muted'>{currentSectionData.description}</p>
                  </div>
                  <div className='text-sm text-text-muted/70'>
                    {currentSection + 1} OF {phase.sections.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6 xl:pr-24'>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {currentSectionData?.fields?.filter(shouldShowField)?.map((field) => (
                    <div
                      key={field.key}
                      className={`${
                        field.gridSpan === 2 || (field.gridSpan !== 1 && field.type !== "select")
                          ? "lg:col-span-2"
                          : "lg:col-span-1"
                      }`}
                    >
                      <FormField
                        ref={(ref) => {
                          formFieldRefs.current[field.key] = ref;
                        }}
                        field={field}
                        value={formData[field.key]}
                        onChange={(value) => handleFieldChange(field.key, value)}
                        error={errors[field.key]}
                        spans2Columns={field.gridSpan === 2 || (field.gridSpan !== 1 && field.type !== "select")}
                      />
                    </div>
                  ))}
                </div>

                <div className='flex justify-end pt-6'>
                  <Button
                    onClick={handleNext}
                    size='lg'
                    className='px-9 text-xs'
                    disabled={saveBusinessStepMutation.isPending || saveCompanyRepStepMutation.isPending}
                  >
                    {saveBusinessStepMutation.isPending || saveCompanyRepStepMutation.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className='mr-2'>Next</span> <ArrowRightIcon className='size-4 stroke-[3px]' />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Congratulations Popup */}
      <CongratulationsPopup
        isOpen={showCongrats}
        title={currentCongratsMessage?.title || ""}
        description={currentCongratsMessage?.description || ""}
        ctaText={currentCongratsMessage?.ctaText || "Continue"}
        sectionKey={currentSectionData?.key}
        onContinue={() => {
          setShowCongrats(false);
          proceedToNext();
        }}
      />

      {/* Save and Exit Popup */}
      <SaveAndExitPopup isOpen={showSaveAndExit} onConfirm={handleSaveAndExitConfirm} />
    </div>
  );
}
