# Onboarding Integration Guide

This guide explains how to use the onboarding service integration with React Query, NextAuth, and React Hook Form.

## Overview

The onboarding system consists of several layers:

1. **Service Layer** (`src/services/onboarding.ts`) - Raw API calls
2. **Mutation Hooks** (`src/lib/hooks/use-onboarding-mutations.ts`) - React Query mutations  
3. **Form Hooks** (`src/lib/hooks/use-onboarding-form.ts`) - Form handling with validation
4. **Zustand Store** (`src/lib/store/onboarding-store.ts`) - Local state management
5. **UI Components** - Form components that use the hooks

## Quick Start

### 1. Basic Form Component

```tsx
"use client";

import { useCompanyOverviewForm } from "@/src/lib/hooks/use-onboarding-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function CompanyOverviewForm() {
  const { 
    form, 
    onSubmit, 
    onSaveDraft, 
    isLoading, 
    formState 
  } = useCompanyOverviewForm();

  return (
    <form onSubmit={onSubmit}>
      <Input 
        {...form.register("company_currency")} 
        placeholder="Currency"
      />
      
      <div className="flex space-x-4">
        <Button type="button" onClick={onSaveDraft} disabled={isLoading}>
          Save Draft
        </Button>
        <Button type="submit" disabled={isLoading}>
          Continue
        </Button>
      </div>
    </form>
  );
}
```

### 2. Manual API Calls

```tsx
import { useSaveBusinessInformationStep } from "@/src/lib/hooks/use-onboarding-mutations";

export function ManualApiExample() {
  const saveStep = useSaveBusinessInformationStep();

  const handleSave = async () => {
    await saveStep.mutateAsync({
      step: 1,
      data: {
        user_id: 123,
        preferred_currency: "USD",
        business_type: "real_estate_dev",
        // ... other fields
      },
      sectionKey: "company-overview"
    });
  };

  return (
    <Button onClick={handleSave} disabled={saveStep.isPending}>
      {saveStep.isPending ? "Saving..." : "Save"}
    </Button>
  );
}
```

## Available Hooks

### Form Hooks (Recommended)

These provide complete form handling with validation and API integration:

- `useCompanyOverviewForm()` - Step 1: Company Overview
- `useProjectTrackRecordForm()` - Step 2: Project Track Record  
- `useInvestmentDetailsForm()` - Step 3: Investment Details
- `useRiskComplianceForm()` - Step 4: Risk & Compliance
- `useCommunicationFinalForm()` - Step 5: Communication & Final

#### Form Hook Features

```tsx
const {
  form,                    // React Hook Form instance
  onSubmit,               // Save and continue handler
  onSaveDraft,            // Save as draft handler
  handleAutoSave,         // Manual auto-save trigger
  isLoading,              // Loading state
  error,                  // Error state
  formState,              // React Hook Form state
  watch,                  // Watch form values
  setValue,               // Set form values
  getValues,              // Get current form values
} = useCompanyOverviewForm();
```

### Mutation Hooks (For Custom Logic)

Lower-level hooks for custom implementations:

- `useSaveBusinessInformationStep()` - Save any step
- `useUploadSupportingDocuments()` - Upload files
- `useBusinessInformation()` - Get saved data
- `useOnboardingProgress()` - Get progress info

### Utility Hooks

- `useOnboardingMutations()` - Combined mutations
- `useSaveAndContinue()` - Save and move to next section
- `useSaveAsDraft()` - Save as draft

## Authentication

All hooks automatically use NextAuth session tokens:

```tsx
import { useSession } from "next-auth/react";

// The hooks handle this automatically
const { data: session } = useSession();
const token = session?.accessToken; // Used internally
```

## File Uploads

File uploads are handled automatically:

```tsx
const uploadDocs = useUploadSupportingDocuments();

const handleFileUpload = async (files: File[]) => {
  const urls = await uploadDocs.mutateAsync({
    files,
    documentType: 'licenses' // or 'tax_certificate' or 'others'
  });
  
  // URLs are returned for saving in form
  form.setValue('document_urls', urls);
};
```

## Error Handling

All hooks provide consistent error handling:

```tsx
const { isLoading, error } = useCompanyOverviewForm();

// Display errors
{error && (
  <div className="text-red-600">
    {error.message}
  </div>
)}

// Loading states
<Button disabled={isLoading}>
  {isLoading ? "Saving..." : "Save"}
</Button>
```

## Auto-Save

Implement auto-save functionality:

```tsx
import { useEffect } from "react";

const { handleAutoSave, formState, isLoading } = useCompanyOverviewForm();

useEffect(() => {
  const interval = setInterval(() => {
    if (formState.isDirty && !isLoading) {
      handleAutoSave();
    }
  }, 30000); // Auto-save every 30 seconds

  return () => clearInterval(interval);
}, [formState.isDirty, isLoading, handleAutoSave]);
```

## State Management

The system uses Zustand for local state persistence:

```tsx
import { useOnboardingStore } from "@/src/lib/store/onboarding-store";

const { 
  currentPhase, 
  currentSection, 
  formData, 
  updateFormData,
  markSectionCompleted 
} = useOnboardingStore();
```

## Progress Tracking

Track and display progress:

```tsx
import { useOnboardingProgress } from "@/src/lib/hooks/use-onboarding-mutations";

export function ProgressDisplay() {
  const { data: progress, isLoading } = useOnboardingProgress();
  
  if (isLoading) return <div>Loading progress...</div>;
  
  return (
    <div>
      Current Step: {progress?.current_step}
      Completed Steps: {progress?.completed_steps.join(", ")}
    </div>
  );
}
```

## Form Validation

Each form has built-in Zod validation:

```tsx
// Validation errors are handled automatically
const { formState } = useCompanyOverviewForm();

{formState.errors.company_currency && (
  <p className="text-red-600">
    {formState.errors.company_currency.message}
  </p>
)}
```

## Custom Form Fields

For complex fields, use React Hook Form Controller:

```tsx
import { Controller } from "react-hook-form";

<Controller
  name="business_type"
  control={form.control}
  render={({ field }) => (
    <Select onValueChange={field.onChange} value={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="real_estate_dev">Real Estate Development</SelectItem>
      </SelectContent>
    </Select>
  )}
/>
```

## Best Practices

1. **Use form hooks** for most cases - they handle everything automatically
2. **Handle loading states** - always disable buttons during API calls
3. **Show validation errors** - use formState.errors to display field errors
4. **Implement auto-save** - improve UX with periodic saves
5. **Test error scenarios** - handle network failures gracefully

## Step Mapping

The API uses numbered steps (1-5) for business information:

- Step 1: Company Overview
- Step 2: Project Track Record
- Step 3: Investment Details  
- Step 4: Risk & Compliance
- Step 5: Communication & Final

Each step corresponds to a section in the business information phase.

## Example Project Structure

```
src/
├── services/
│   └── onboarding.ts              # Raw API calls
├── lib/
│   ├── hooks/
│   │   ├── use-onboarding-mutations.ts  # React Query mutations
│   │   └── use-onboarding-form.ts       # Form hooks with validation
│   └── store/
│       └── onboarding-store.ts          # Zustand store
├── components/
│   └── onboarding/
│       ├── company-overview-form.tsx    # Form components
│       └── ...
└── types/
    └── onboarding.ts              # TypeScript types
```

This integration provides a complete, type-safe, and user-friendly onboarding system that handles all the complexity of form management, API calls, authentication, and state persistence. 