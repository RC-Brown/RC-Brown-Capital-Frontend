"use client";

import React from "react";
import { useProjectUploadIntegration } from "@/src/lib/hooks/use-project-upload-integration";
import {
  useProjectDocuments,
  useUploadProjectDocument,
  useDeleteProjectDocument,
} from "@/src/lib/hooks/use-project-upload-mutations";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormField, FormFieldRef } from "@/src/components/onboarding/form-field";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

/**
 * Complete Project Upload Integration Example
 * This demonstrates the full end-to-end integration
 */
export function ProjectUploadIntegrationExample() {
  const {
    formData,
    errors,
    isLoading,
    handleNext,
    handleSaveAndExit,
    handleFieldChange,
    getCurrentPhaseData,
    getProjectUploadStepNumber,
  } = useProjectUploadIntegration();

  // Document management hooks
  const { data: documents, isLoading: isLoadingDocuments } = useProjectDocuments(1); // Assuming project ID 1
  const uploadDocument = useUploadProjectDocument();
  const deleteDocument = useDeleteProjectDocument();

  // State for current section
  const [currentSection, setCurrentSection] = React.useState(0);
  const [showCongrats, setShowCongrats] = React.useState(false);

  // Get phase data
  const phase = getCurrentPhaseData();
  const currentSectionData = phase?.sections[currentSection];

  // Form field refs
  const formFieldRefs = React.useRef<Record<string, FormFieldRef | null>>({});

  // Handle next section
  const handleNextSection = async () => {
    if (!currentSectionData) return;

    const success = await handleNext(currentSectionData);
    if (success) {
      // Show congratulations if section has a message
      if (currentSectionData.congratsMessage) {
        setShowCongrats(true);
        return;
      }

      // Move to next section or complete
      if (currentSection < phase.sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        // Project upload complete
        console.log("Project upload completed!");
      }
    }
  };

  // Handle save and exit
  const handleSaveAndExitClick = async () => {
    if (!currentSectionData) return;
    await handleSaveAndExit(currentSectionData);
  };

  // Handle back
  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Document upload handlers
  const handleFileUpload = async (file: File) => {
    try {
      await uploadDocument.mutateAsync({
        projectId: 1,
        file,
        category: "site_documents",
        fileType: "pdf",
        subcategory: "title_deed",
        documentName: "Title Deed",
        notes: "Original scanned copy",
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteDocument.mutateAsync({
        projectId: 1,
        documentId,
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (!phase || !currentSectionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{phase.title}</h1>
          <p className='text-gray-600'>{phase.description}</p>
        </div>
        <div className='text-sm text-gray-500'>Step {getProjectUploadStepNumber(currentSectionData.key)} of 10</div>
      </div>

      {/* Progress */}
      <div className='h-2 w-full rounded-full bg-gray-200'>
        <div
          className='h-2 rounded-full bg-blue-600 transition-all duration-300'
          style={{ width: `${((currentSection + 1) / phase.sections.length) * 100}%` }}
        />
      </div>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSectionData.title}</CardTitle>
          {currentSectionData.description && <CardDescription>{currentSectionData.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {currentSectionData.fields?.map((field) => (
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

          {/* Action Buttons */}
          <div className='flex justify-between pt-6'>
            <Button onClick={handleBack} variant='outline' disabled={currentSection === 0 || isLoading}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back
            </Button>

            <div className='flex space-x-4'>
              <Button onClick={handleSaveAndExitClick} variant='outline' disabled={isLoading}>
                Save & Exit
              </Button>

              <Button onClick={handleNextSection} disabled={isLoading} size='lg' className='px-9 text-xs'>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <span className='mr-2'>
                      {currentSection === phase.sections.length - 1 ? "Submit project" : "Next"}
                    </span>
                    <ArrowRightIcon className='size-4 stroke-[3px]' />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Management Example */}
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Example of document upload and management functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='document_upload'>Upload Document</Label>
              <Input
                type='file'
                accept='.pdf,.doc,.docx'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
            </div>

            {isLoadingDocuments ? (
              <p>Loading documents...</p>
            ) : (
              <div className='space-y-2'>
                <h4 className='font-medium'>Uploaded Documents:</h4>
                {documents?.map((doc) => (
                  <div key={doc.id} className='flex items-center justify-between rounded border p-2'>
                    <div>
                      <p className='font-medium'>{doc.document_name || doc.original_filename}</p>
                      <p className='text-sm text-gray-500'>
                        {doc.category} - {doc.file_type}
                      </p>
                    </div>
                    <Button size='sm' variant='destructive' onClick={() => handleDeleteDocument(doc.id)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Data Display (for debugging) */}
      <Card>
        <CardHeader>
          <CardTitle>Form Data (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='max-h-40 overflow-auto rounded bg-gray-100 p-4 text-xs'>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Congratulations Modal */}
      {showCongrats && currentSectionData.congratsMessage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <Card className='w-96'>
            <CardHeader>
              <CardTitle>{currentSectionData.congratsMessage.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4'>{currentSectionData.congratsMessage.description}</p>
              <Button
                onClick={() => {
                  setShowCongrats(false);
                  handleNextSection();
                }}
                className='w-full'
              >
                {currentSectionData.congratsMessage.ctaText}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/**
 * Simple Form Example
 * This shows how to use the integration with a simple form
 */
export function SimpleProjectUploadForm() {
  const { formData, errors, isLoading, handleFieldChange, handleNext } = useProjectUploadIntegration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock section data for sponsor-info
    const sectionData = {
      key: "sponsor-info",
      title: "Sponsor Info",
      fields: [
        {
          key: "project_currency",
          label: "Project Currency",
          validation: { required: true },
        },
        {
          key: "sponsor_name",
          label: "Sponsor Name",
          validation: { required: true, minLength: 2 },
        },
      ],
    };

    const success = await handleNext(sectionData);
    if (success) {
      console.log("Form submitted successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='project_currency'>Project Currency</Label>
        <Select
          value={String(formData.project_currency || "")}
          onValueChange={(value) => handleFieldChange("project_currency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select currency' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='USD'>USD</SelectItem>
            <SelectItem value='NGN'>NGN</SelectItem>
          </SelectContent>
        </Select>
        {errors.project_currency && <p className='text-sm text-red-500'>{errors.project_currency}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='sponsor_name'>Sponsor Name</Label>
        <Input
          value={String(formData.sponsor_name || "")}
          onChange={(e) => handleFieldChange("sponsor_name", e.target.value)}
          placeholder='Enter sponsor name'
        />
        {errors.sponsor_name && <p className='text-sm text-red-500'>{errors.sponsor_name}</p>}
      </div>

      <Button type='submit' disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
}
