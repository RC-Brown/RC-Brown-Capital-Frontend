"use client";

import React from "react";
import { useSponsorInfoForm } from "@/src/lib/hooks/use-project-upload-form";
import {
  useProjectDocuments,
  useUploadProjectDocument,
  useDeleteProjectDocument,
  useProjectUploadMutations,
} from "@/src/lib/hooks/use-project-upload-mutations";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

/**
 * Example component demonstrating project upload integration
 */
export function ProjectUploadExample() {
  const { form, onSubmit, onSaveDraft, isLoading, error, formState } = useSponsorInfoForm();

  // Example of using document upload hooks
  const { data: documents, isLoading: isLoadingDocuments } = useProjectDocuments(1); // Assuming project ID 1
  const uploadDocument = useUploadProjectDocument();
  const deleteDocument = useDeleteProjectDocument();

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

  return (
    <div className='space-y-6 p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Project Upload - Sponsor Info</CardTitle>
          <CardDescription>Example of using the project upload form hooks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Project Currency</Label>
                <Select value={form.watch("currency")} onValueChange={(value) => form.setValue("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USD'>USD</SelectItem>
                    <SelectItem value='NGN'>NGN</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.currency && (
                  <p className='text-sm text-red-500'>{formState.errors.currency.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='sponsor_name'>Sponsor Name</Label>
                <Input {...form.register("sponsor_name")} placeholder='Enter sponsor name' />
                {formState.errors.sponsor_name && (
                  <p className='text-sm text-red-500'>{formState.errors.sponsor_name.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='sponsor_logo'>Sponsor Logo</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    form.setValue("sponsor_logo", file);
                  }
                }}
              />
              {formState.errors.sponsor_logo && (
                <p className='text-sm text-red-500'>
                  {String(formState.errors.sponsor_logo?.message || "Invalid sponsor logo")}
                </p>
              )}
            </div>

            <div className='flex space-x-4'>
              <Button type='button' onClick={onSaveDraft} disabled={isLoading} variant='outline'>
                {isLoading ? "Saving..." : "Save Draft"}
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? "Saving..." : "Continue"}
              </Button>
            </div>

            {error && <div className='text-sm text-red-500'>Error: {error.message}</div>}
          </form>
        </CardContent>
      </Card>

      {/* Document Upload Example */}
      <Card>
        <CardHeader>
          <CardTitle>Document Upload Example</CardTitle>
          <CardDescription>Example of using document upload hooks</CardDescription>
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
    </div>
  );
}

/**
 * Example of using the comprehensive mutations hook
 */
export function ProjectUploadMutationsExample() {
  const {
    // saveStep,
    // uploadDocument,
    // deleteDocument,
    // addPhysicalDescription,
    // deletePhysicalDescription,
    saveStepAsync,
    uploadDocumentAsync,
    isLoading,
    error,
  } = useProjectUploadMutations();

  const handleSaveStep = async () => {
    try {
      const result = await saveStepAsync({
        step: 1,
        data: {
          currency: "USD",
          sponsor_name: "Example Corp",
          sponsor_logo: null,
        },
      });
      console.log("Step saved:", result);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleUploadDocument = async () => {
    // Create a mock file for demonstration
    const mockFile = new File(["mock content"], "test.pdf", { type: "application/pdf" });

    try {
      const result = await uploadDocumentAsync({
        projectId: 1,
        file: mockFile,
        category: "site_documents",
        fileType: "pdf",
        subcategory: "title_deed",
        documentName: "Test Document",
        notes: "Test upload",
      });
      console.log("Document uploaded:", result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Upload Mutations Example</CardTitle>
        <CardDescription>Example of using the comprehensive mutations hook</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Button onClick={handleSaveStep} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Step"}
          </Button>

          <Button onClick={handleUploadDocument} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Document"}
          </Button>

          {error && <div className='text-sm text-red-500'>Error: {error.message}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
