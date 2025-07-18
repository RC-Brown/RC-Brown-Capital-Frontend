"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

interface SponsorMetricsData {
  yearsInOperation?: string;
  historicalPortfolioActivity?: string;
  projectsUnderManagement?: string;
  totalSquareFeetManaged?: string;
  dealsFundedByRC?: string;
  propertiesUnderManagement?: string;
  totalRealizedProjects?: string;
  propertiesDeveloped?: string;
  propertiesBuiltAndSold?: string;
  highestBudgetProject?: string;
  averageCompletionLength?: string;
}

interface SponsorMetricsTableProps {
  value?: SponsorMetricsData;
  onChange: (value: SponsorMetricsData) => void;
  error?: string;
}

const metricsConfig = [
  {
    key: "yearsInOperation",
    label: "Years in Operation",
    type: "select",
    options: [
      { label: "1 year", value: "1" },
      { label: "2 years", value: "2" },
      { label: "3 years", value: "3" },
      { label: "4 years", value: "4" },
      { label: "5 years", value: "5" },
      { label: "6+ years", value: "6+" },
    ],
    info: "How long you been active in real estate",
  },
  {
    key: "historicalPortfolioActivity",
    label: "Historical Portfolio Activity ($)",
    type: "text",
    placeholder: "e.g $25,000,000",
    info: "Total past investment volume handled across all projects",
  },
  {
    key: "projectsUnderManagement",
    label: "Projects currently under Management",
    type: "text",
    placeholder: "e.g $100,000,000",
    info: "Current total value of properties/assets the sponsor manages.",
  },
  {
    key: "totalSquareFeetManaged",
    label: "Total Square Feet Managed",
    type: "text",
    placeholder: "e.g 500,000 SQ FT",
    info: "Combined size of all properties under the sponsor's management.",
  },
  {
    key: "dealsFundedByRC",
    label: "Deals Funded by RC Brown Capital",
    type: "select",
    options: [
      { label: "0", value: "0" },
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5+", value: "5+" },
    ],
    info: "Number of projects RC Brown Capital has backed with funding.",
  },
  {
    key: "propertiesUnderManagement",
    label: "Properties under Management",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Active number of properties the sponsor is currently overseeing.",
  },
  {
    key: "totalRealizedProjects",
    label: "Total Number of Realized Projects",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Number of projects that have been fully completed and exited.",
  },
  {
    key: "propertiesDeveloped",
    label: "Number of Properties Developed",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Properties the sponsor has overseen from start to finish (development stage).",
  },
  {
    key: "propertiesBuiltAndSold",
    label: "Number of Properties Built and Sold",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Properties physically constructed by the sponsor and successfully sold.",
  },
  {
    key: "highestBudgetProject",
    label: "Highest Budget for a Project $",
    type: "text",
    placeholder: "e.g $100,000,000",
    info: "The largest single-project budget the sponsor has worked with.",
  },
  {
    key: "averageCompletionLength",
    label: "Average Length of Completion",
    type: "select",
    options: [
      { label: "6 Months", value: "6" },
      { label: "12 Months", value: "12" },
      { label: "18 Months", value: "18" },
      { label: "24 Months", value: "24" },
      { label: "30 Months", value: "30" },
      { label: "36+ Months", value: "36+" },
    ],
    info: "Typical number of months taken to complete a development project.",
  },
];

export function SponsorMetricsTable({ value = {}, onChange, error }: SponsorMetricsTableProps) {
  const [metrics, setMetrics] = useState<SponsorMetricsData>(value);

  const handleMetricChange = (key: string, newValue: string) => {
    const updatedMetrics = { ...metrics, [key]: newValue };
    setMetrics(updatedMetrics);
    onChange(updatedMetrics);
  };

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b'>
              <th className='p-3 text-left font-medium text-text-muted'>Category</th>
              <th className='p-3 text-left font-medium text-text-muted'>Input</th>
              <th className='p-3 text-left font-medium text-text-muted'>Brief info</th>
            </tr>
          </thead>
          <tbody>
            {metricsConfig.map((metric) => (
              <tr key={metric.key} className='border-b'>
                <td className='p-3 text-sm text-text-muted/80'>{metric.label}</td>
                <td className='p-3'>
                  {metric.type === "select" ? (
                    <Select
                      value={metrics[metric.key as keyof SponsorMetricsData] || ""}
                      onValueChange={(value) => handleMetricChange(metric.key, value)}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          error && "border-red-500",
                          "border border-black/10 py-6 shadow-none placeholder:text-xs"
                        )}
                      >
                        <SelectValue
                          placeholder={
                            metric.key === "yearsInOperation"
                              ? "2 years"
                              : metric.key === "dealsFundedByRC"
                                ? "2"
                                : metric.key === "propertiesUnderManagement"
                                  ? "2"
                                  : metric.key === "totalRealizedProjects"
                                    ? "2"
                                    : metric.key === "propertiesDeveloped"
                                      ? "2"
                                      : metric.key === "propertiesBuiltAndSold"
                                        ? "2"
                                        : metric.key === "averageCompletionLength"
                                          ? "12 Months"
                                          : "Select"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        {metric.options?.map((option) => (
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
                  ) : (
                    <Input
                      type='text'
                      placeholder={metric.placeholder || "Enter value"}
                      value={metrics[metric.key as keyof SponsorMetricsData] || ""}
                      onChange={(e) => handleMetricChange(metric.key, e.target.value)}
                      className={cn(
                        error && "border-red-500",
                        "border border-black/10 py-6 shadow-none placeholder:text-xs"
                      )}
                    />
                  )}
                </td>
                <td className='p-3 text-sm text-text-muted/80'>{metric.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
