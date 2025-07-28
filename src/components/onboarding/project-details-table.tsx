"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SizeInput } from "./size-input";
import { CurrencyInput } from "./currency-input";

interface ProjectDetail {
  id: string;
  projectName: string;
  projectType: string;
  address: string;
  projectSize: { size: string; unit: string } | string;
  totalCost: string;
  startDate: string;
  completedDate: string;
}

interface ProjectDetailsTableProps {
  value?: ProjectDetail[];
  onChange: (projects: ProjectDetail[]) => void;
  error?: string;
}

export interface ProjectDetailsTableRef {
  validate: () => boolean;
}

export const ProjectDetailsTable = forwardRef<ProjectDetailsTableRef, ProjectDetailsTableProps>(
  ({ value = [], onChange
    //  error
     }, ref) => {
    const [projects, setProjects] = useState<ProjectDetail[]>(value.length > 0 ? value : [createEmptyProject()]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
      const initialErrors: Record<string, Record<string, string>> = {};
      projects.forEach((project) => {
        initialErrors[project.id] = {};
      });
      setFieldErrors(initialErrors);
    }, [projects]);

    function createEmptyProject(): ProjectDetail {
      return {
        id: Math.random().toString(36).substr(2, 9),
        projectName: "",
        projectType: "",
        address: "",
        projectSize: "",
        totalCost: "",
        startDate: "",
        completedDate: "",
      };
    }

    const validateField = (
      projectId: string,
      field: keyof ProjectDetail,
      value: string | { size: string; unit: string }
    ): string => {
      const requiredFields: (keyof ProjectDetail)[] = [
        "projectName",
        "projectType",
        "address",
        "projectSize",
        "totalCost",
        "startDate",
        "completedDate",
      ];

      if (requiredFields.includes(field)) {
        if (field === "projectSize") {
          if (typeof value === "object" && value?.size && value?.unit) {
            if (!value.size.trim()) {
              return "Project size is required";
            }
          } else if (typeof value === "string" && !value.trim()) {
            return "Project size is required";
          }
        } else if (typeof value === "string" && (!value || value.trim() === "")) {
          return "This field is required";
        }
      }
      return "";
    };

    const validateAllFields = (projectList: ProjectDetail[]): boolean => {
      const newErrors: Record<string, Record<string, string>> = {};
      let hasErrors = false;

      projectList.forEach((project) => {
        newErrors[project.id] = {};

        Object.keys(project).forEach((key) => {
          if (key !== "id") {
            const fieldKey = key as keyof ProjectDetail;
            const error = validateField(project.id, fieldKey, project[fieldKey]);
            if (error) {
              newErrors[project.id][fieldKey] = error;
              hasErrors = true;
            }
          }
        });
      });

      setFieldErrors(newErrors);
      return !hasErrors;
    };

    // Expose validate method to parent
    useImperativeHandle(ref, () => ({
      validate: () => validateAllFields(projects),
    }));

    const updateProject = (
      id: string,
      field: keyof ProjectDetail,
      newValue: string | { size: string; unit: string }
    ) => {
      const updatedProjects = projects.map((project) =>
        project.id === id ? { ...project, [field]: newValue } : project
      );
      setProjects(updatedProjects);
      onChange(updatedProjects);

      // Clear field error when user starts typing
      const error = validateField(id, field, newValue);
      setFieldErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: error,
        },
      }));
    };

    const addProject = () => {
      const newProject = createEmptyProject();
      const newProjects = [...projects, newProject];
      setProjects(newProjects);
      onChange(newProjects);

      setFieldErrors((prev) => ({
        ...prev,
        [newProject.id]: {},
      }));
    };

    const removeProject = (id: string) => {
      if (projects.length > 1) {
        const filteredProjects = projects.filter((project) => project.id !== id);
        setProjects(filteredProjects);
        onChange(filteredProjects);

        // Remove errors for deleted project
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    };

    const projectTypeOptions = [
      { label: "Residential", value: "residential" },
      { label: "Commercial", value: "commercial" },
      { label: "Industrial", value: "industrial" },
      { label: "Mixed Use", value: "mixed_use" },
    ];

    return (
      <div className='space-y-6'>
        {projects.map((project) => (
          <div key={project.id} className='relative space-y-4 overflow-y-hidden rounded-lg px-8 py-6 shadow-lg'>
            <div className='flex items-center justify-between'>
              {/* <h4 className='font-medium'>Project {index + 1}</h4> */}
              {projects.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeProject(project.id)}
                  className='text-red-600 hover:text-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>
            <div className='absolute left-[28%] top-0 hidden h-full w-px bg-gray-200 md:block'></div>
            <div className='relative space-y-6'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`project-name-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Name *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`project-name-${project.id}`}
                    placeholder='e.g. Royal Gardens Estate'
                    value={project.projectName}
                    onChange={(e) => updateProject(project.id, "projectName", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.projectName && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs md:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.projectName && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].projectName}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`project-type-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Type *
                </Label>
                <div className='md:col-span-2'>
                  <Select
                    value={project.projectType}
                    onValueChange={(value) => updateProject(project.id, "projectType", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        fieldErrors[project.id]?.projectType && "border-red-500",
                        "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs data-[placeholder]:text-xs md:text-xs"
                      )}
                    >
                      <SelectValue
                        placeholder='Select project type'
                        className='text-xs font-normal placeholder:text-xs data-[placeholder]:text-xs'
                      />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {projectTypeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='cursor-pointer hover:bg-primary hover:text-white'
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors[project.id]?.projectType && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].projectType}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`address-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Address *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`address-${project.id}`}
                    placeholder='e.g. Royal Gardens Estate'
                    value={project.address}
                    onChange={(e) => updateProject(project.id, "address", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.address && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs md:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.address && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].address}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`project-size-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Size *
                </Label>
                <div className='md:col-span-2'>
                  <SizeInput
                    value={project.projectSize}
                    onChange={(value) => updateProject(project.id, "projectSize", value)}
                    placeholder='Enter size'
                    error={fieldErrors[project.id]?.projectSize}
                    required={true}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`total-cost-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Total Project Cost *
                </Label>
                <div className='md:col-span-2'>
                  <CurrencyInput
                    value={project.totalCost}
                    onChange={(value) => updateProject(project.id, "totalCost", value)}
                    placeholder='e.g. 250,000,000'
                    error={fieldErrors[project.id]?.totalCost}
                    className={cn(
                      fieldErrors[project.id]?.totalCost && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs md:text-xs"
                    )}
                    required={true}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`start-date-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Start Date *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`start-date-${project.id}`}
                    type='date'
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.startDate && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs data-[placeholder]:text-xs md:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.startDate && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].startDate}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`completed-date-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Date Completed *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`completed-date-${project.id}`}
                    type='date'
                    value={project.completedDate}
                    onChange={(e) => updateProject(project.id, "completedDate", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.completedDate && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs data-[placeholder]:text-xs md:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.completedDate && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].completedDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button type='button' variant='outline' onClick={addProject} className='w-full bg-transparent'>
          <span className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            <span className='text-sm font-normal text-text-muted'>Add Another Project</span>
          </span>
        </Button>
      </div>
    );
  }
);

ProjectDetailsTable.displayName = "ProjectDetailsTable";
