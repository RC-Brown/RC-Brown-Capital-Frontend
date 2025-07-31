import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  saveProjectUploadStep,
  getProjectUpload,
  uploadProjectDocument,
  getProjectDocuments,
  deleteProjectDocument,
  addPhysicalDescription,
  getPhysicalDescriptions,
  deletePhysicalDescription,
  ProjectUploadInput,
} from "@/src/services/project-upload";
import { toast } from "sonner";

// Query keys for React Query
export const projectUploadKeys = {
  all: ["project-upload"] as const,
  project: () => [...projectUploadKeys.all, "project"] as const,
  documents: (projectId: number) => [...projectUploadKeys.all, "documents", projectId] as const,
  physicalDescriptions: (projectId: number) => [...projectUploadKeys.all, "physical-descriptions", projectId] as const,
};

/**
 * Hook to save project upload step
 */
export function useSaveProjectUploadStep() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ step, data, projectId }: { step: number; data: ProjectUploadInput; projectId?: number }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided and step > 1
      let finalProjectId = projectId;
      if (!finalProjectId && step > 1) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      const result = await saveProjectUploadStep(step, data, session.accessToken, finalProjectId);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: projectUploadKeys.project() });
      queryClient.invalidateQueries({ queryKey: projectUploadKeys.all });

      // Show success message
      toast.success(data.message || "Step saved successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to get project upload data
 */
export function useProjectUpload() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: projectUploadKeys.project(),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      const result = await getProjectUpload(session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    enabled: !!session?.accessToken,
  });
}

/**
 * Hook to upload project document
 */
export function useUploadProjectDocument() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      projectId,
      file,
      category,
      fileType,
      subcategory,
      documentName,
      notes,
    }: {
      projectId?: number;
      file: File;
      category: "site_documents" | "closing_documents" | "offering_information" | "sponsor_information" | "additional";
      fileType: string;
      subcategory?: string;
      documentName?: string;
      notes?: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided
      let finalProjectId = projectId;
      if (!finalProjectId) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      if (!finalProjectId) {
        throw new Error("Project ID is required for document upload");
      }

      const result = await uploadProjectDocument(
        finalProjectId,
        file,
        category,
        fileType,
        session.accessToken,
        subcategory,
        documentName,
        notes
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data, variables) => {
      // Invalidate documents query
      queryClient.invalidateQueries({ queryKey: projectUploadKeys.documents(variables.projectId || 0) });

      toast.success("Document uploaded successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to get project documents
 */
export function useProjectDocuments(projectId?: number) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: projectUploadKeys.documents(projectId || 0),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided
      let finalProjectId = projectId;
      if (!finalProjectId) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      if (!finalProjectId) {
        throw new Error("Project ID is required to fetch documents");
      }

      const result = await getProjectDocuments(finalProjectId, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    enabled: !!session?.accessToken && (!!projectId || !!localStorage.getItem("project-upload-id")),
  });
}

/**
 * Hook to delete project document
 */
export function useDeleteProjectDocument() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ projectId, documentId }: { projectId?: number; documentId: number }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided
      let finalProjectId = projectId;
      if (!finalProjectId) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      if (!finalProjectId) {
        throw new Error("Project ID is required to delete document");
      }

      const result = await deleteProjectDocument(finalProjectId, documentId, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data, variables) => {
      // Invalidate documents query
      queryClient.invalidateQueries({ queryKey: projectUploadKeys.documents(variables.projectId || 0) });

      toast.success("Document deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to add physical description
 */
export function useAddPhysicalDescription() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      projectId,
      descriptionTitle,
      description,
    }: {
      projectId?: number;
      descriptionTitle: string;
      description: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided
      let finalProjectId = projectId;
      if (!finalProjectId) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      if (!finalProjectId) {
        throw new Error("Project ID is required to add physical description");
      }

      const result = await addPhysicalDescription(finalProjectId, descriptionTitle, description, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data, variables) => {
      // Invalidate physical descriptions query
      queryClient.invalidateQueries({ queryKey: projectUploadKeys.physicalDescriptions(variables.projectId || 0) });

      toast.success("Physical description added successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to get physical descriptions
 */
export function usePhysicalDescriptions(projectId?: number) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: projectUploadKeys.physicalDescriptions(projectId || 0),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided
      let finalProjectId = projectId;
      if (!finalProjectId) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      if (!finalProjectId) {
        throw new Error("Project ID is required to fetch physical descriptions");
      }

      const result = await getPhysicalDescriptions(finalProjectId, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    enabled: !!session?.accessToken && (!!projectId || !!localStorage.getItem("project-upload-id")),
  });
}

/**
 * Hook to delete physical description
 */
export function useDeletePhysicalDescription() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ projectId, descriptionId }: { projectId?: number; descriptionId: number }) => {
      if (!session?.accessToken) {
        throw new Error("No authentication token available");
      }

      // Get project ID from localStorage if not provided
      let finalProjectId = projectId;
      if (!finalProjectId) {
        const storedProjectId = localStorage.getItem("project-upload-id");
        if (storedProjectId) {
          finalProjectId = parseInt(storedProjectId, 10);
        }
      }

      if (!finalProjectId) {
        throw new Error("Project ID is required to delete physical description");
      }

      const result = await deletePhysicalDescription(finalProjectId, descriptionId, session.accessToken);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.success!;
    },
    onSuccess: (data, variables) => {
      // Invalidate physical descriptions query
      queryClient.invalidateQueries({ queryKey: projectUploadKeys.physicalDescriptions(variables.projectId || 0) });

      toast.success("Physical description deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Utility function to clear stored project ID
 */
export const clearStoredProjectId = () => {
  localStorage.removeItem("project-upload-id");
};

/**
 * Utility function to get stored project ID
 */
export const getStoredProjectId = (): number | null => {
  const storedId = localStorage.getItem("project-upload-id");
  return storedId ? parseInt(storedId, 10) : null;
};

/**
 * Utility function to check if we're in a project upload flow
 */
export const isInProjectUploadFlow = (): boolean => {
  return !!localStorage.getItem("project-upload-id");
};

/**
 * Comprehensive hook that combines multiple project upload mutations
 */
export function useProjectUploadMutations() {
  const saveStep = useSaveProjectUploadStep();
  const uploadDocument = useUploadProjectDocument();
  const deleteDocument = useDeleteProjectDocument();
  const addPhysicalDesc = useAddPhysicalDescription();
  const deletePhysicalDesc = useDeletePhysicalDescription();

  return {
    saveStep,
    uploadDocument,
    deleteDocument,
    addPhysicalDescription: addPhysicalDesc,
    deletePhysicalDescription: deletePhysicalDesc,
    // Convenience methods
    saveStepAsync: saveStep.mutateAsync,
    uploadDocumentAsync: uploadDocument.mutateAsync,
    deleteDocumentAsync: deleteDocument.mutateAsync,
    addPhysicalDescriptionAsync: addPhysicalDesc.mutateAsync,
    deletePhysicalDescriptionAsync: deletePhysicalDesc.mutateAsync,
    // Utility methods
    clearStoredProjectId,
    getStoredProjectId,
    isInProjectUploadFlow,
    isLoading:
      saveStep.isPending ||
      uploadDocument.isPending ||
      deleteDocument.isPending ||
      addPhysicalDesc.isPending ||
      deletePhysicalDesc.isPending,
    isError:
      saveStep.isError ||
      uploadDocument.isError ||
      deleteDocument.isError ||
      addPhysicalDesc.isError ||
      deletePhysicalDesc.isError,
    error:
      saveStep.error ||
      uploadDocument.error ||
      deleteDocument.error ||
      addPhysicalDesc.error ||
      deletePhysicalDesc.error,
  };
}
