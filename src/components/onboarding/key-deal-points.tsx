"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tooltip } from "../ui/tooltip";
import { cn } from "@/src/lib/utils";
import { PercentageInput } from "./percentage-input";

type DebtTenure =
  | "1_year"
  | "2_years"
  | "3_years"
  | "4_years"
  | "5_years"
  | "6_years"
  | "7_years"
  | "8_years"
  | "9_years"
  | "10_years";

interface KeyDealPointsData {
  projected_valuation?: string;
  timeline_completion?: string;
  total_capital_required?: string;
  total_debt_allocation?: string;
  debt_investment_tenure?: DebtTenure;
  percentage_yield_debt?: string;
  equity_investment_tenure?: string;
  projected_returns_equity?: string;
  total_equity?: string;
  [key: string]: string | DebtTenure | undefined;
}

interface FieldErrors {
  timeline_completion?: string;
  total_capital_required?: string;
  equity_investment_tenure?: string;
  projected_returns_equity?: string;
  total_equity?: string;
}

interface KeyDealPointsProps {
  value?: KeyDealPointsData;
  onChange: (value: KeyDealPointsData) => void;
  error?: string;
}

export interface KeyDealPointsRef {
  validate: () => boolean;
}

export const KeyDealPoints = forwardRef<KeyDealPointsRef, KeyDealPointsProps>(
  ({ value = {}, onChange, error }, ref) => {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    // Expose validation method to parent
    useImperativeHandle(ref, () => ({
      validate: () => {
        return validateAllFields();
      },
    }));

    const updateField = (field: keyof KeyDealPointsData, newValue: string) => {
      const updatedValue = { ...value, [field]: newValue };
      onChange(updatedValue);

      // Clear error for this field when user starts typing
      if (fieldErrors[field as keyof FieldErrors]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

    // Validate required fields
    const validateField = (field: keyof KeyDealPointsData, value: string | undefined): string => {
      if (!value || value.trim() === "") {
        switch (field) {
          case "timeline_completion":
            return "Timeline of completion is required";
          case "total_capital_required":
            return "Total capital required is required";
          case "equity_investment_tenure":
            return "Equity Investment Tenure is required";
          case "projected_returns_equity":
            return "Projected Returns - Equity is required";
          case "total_equity":
            return "Total Equity is required";
          default:
            return "";
        }
      }
      return "";
    };

    // Validate all required fields
    const validateAllFields = (): boolean => {
      const errors: FieldErrors = {};

      errors.timeline_completion = validateField("timeline_completion", value.timeline_completion);
      errors.total_capital_required = validateField("total_capital_required", value.total_capital_required);
      errors.equity_investment_tenure = validateField("equity_investment_tenure", value.equity_investment_tenure);
      errors.projected_returns_equity = validateField("projected_returns_equity", value.projected_returns_equity);
      errors.total_equity = validateField("total_equity", value.total_equity);

      setFieldErrors(errors);

      return !Object.values(errors).some((error) => error);
    };

    // Validate on mount and when value changes
    useEffect(() => {
      if (error) {
        validateAllFields();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, value]);

    const debtTenureOptions = [
      { label: "One year", value: "1_year" },
      { label: "Two years", value: "2_years" },
      { label: "Three years", value: "3_years" },
      { label: "Four years", value: "4_years" },
    ];

    const equityTenureOptions = [
      { label: "One year", value: "1_year" },
      { label: "Two years", value: "2_years" },
      { label: "Three years", value: "3_years" },
      { label: "Four years", value: "4_years" },
    ];

    const timelineOfCompletionOptions = [
      { label: "12 months", value: "12_months" },
      { label: "18 months", value: "18_months" },
      { label: "24 months", value: "24_months" },
      { label: "30 months", value: "30_months" },
      { label: "> 36 months", value: "36_months" },
    ];

    return (
      <div>
        <div className='space-y-4 rounded-lg py-6 pl-8 pr-12 shadow-lg'>
          <h4 className='font-medium'>The Deal (Key Deal Points)</h4>

          <div className='relative space-y-6'>
            {/* Vertical separator line */}
            <div className='absolute left-[33%] top-0 hidden h-full w-px bg-gray-200 md:block'></div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Tooltip content='Projected Valuation upon completion'>
                <span className='pr-4 text-xs font-normal text-text-muted'>Projected Valuation</span>
              </Tooltip>
              <div className='ml-9 md:col-span-2'>
                <Input
                  className='border border-black/10 py-6 shadow-none placeholder:text-xs'
                  placeholder='Estimated property value upon completion'
                  value={value.projected_valuation || ""}
                  onChange={(e) => updateField("projected_valuation", e.target.value)}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Timeline of Completion (Months)*</Label>
              <div className='ml-9 md:col-span-2'>
                <Select
                  value={value.timeline_completion || ""}
                  onValueChange={(selectedValue) => updateField("timeline_completion", selectedValue)}
                >
                  <SelectTrigger
                    className={cn(
                      "border border-black/10 py-6 text-xs text-text-muted/80 shadow-none placeholder:text-xs data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
                      fieldErrors.timeline_completion && "border-red-500"
                    )}
                  >
                    <SelectValue
                      placeholder='Select timeline of completion'
                      className='text-xs font-normal placeholder:text-xs data-[placeholder]:text-xs'
                    />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {timelineOfCompletionOptions.map((option) => (
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
                {fieldErrors.timeline_completion && (
                  <p className='mt-1 text-xs text-red-500'>{fieldErrors.timeline_completion}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Total Capital Required *</Label>
              <div className='ml-9 md:col-span-2'>
                <Input
                  className={cn(
                    "border border-black/10 py-6 shadow-none placeholder:text-xs",
                    fieldErrors.total_capital_required && "border-red-500"
                  )}
                  placeholder='Enter total capital required'
                  value={value.total_capital_required || ""}
                  onChange={(e) => updateField("total_capital_required", e.target.value)}
                />
                {fieldErrors.total_capital_required && (
                  <p className='mt-1 text-xs text-red-500'>{fieldErrors.total_capital_required}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Tooltip content='Percentage of funds borrowed compared to total project cost'>
                <span className='pr-4 text-xs font-normal text-text-muted'>Total Debt Allocation (%)</span>
              </Tooltip>
              <div className='ml-9 md:col-span-2'>
                <PercentageInput
                  value={value.total_debt_allocation || ""}
                  onChange={(newValue) => updateField("total_debt_allocation", newValue)}
                  placeholder='Enter debt allocation percentage'
                  className='border border-black/10 py-6 shadow-none placeholder:text-xs'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Debt Investment Tenure</Label>
              <div className='ml-9 md:col-span-2'>
                <Select
                  value={value.debt_investment_tenure || ""}
                  onValueChange={(selectedValue) => updateField("debt_investment_tenure", selectedValue)}
                >
                  <SelectTrigger className='border border-black/10 py-6 text-xs text-text-muted/80 shadow-none placeholder:text-xs data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'>
                    <SelectValue
                      placeholder='Select debt investment tenure'
                      className='text-xs font-normal placeholder:text-xs data-[placeholder]:text-xs'
                    />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {debtTenureOptions.map((option) => (
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
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Percentage Yield - Debt (%)</Label>
              <div className='ml-9 md:col-span-2'>
                <PercentageInput
                  value={value.percentage_yield_debt || ""}
                  onChange={(newValue) => updateField("percentage_yield_debt", newValue)}
                  placeholder='Enter yield percentage'
                  className='border border-black/10 py-6 shadow-none placeholder:text-xs'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Equity Investment Tenure *</Label>
              <div className='ml-9 md:col-span-2'>
                <Select
                  value={value.equity_investment_tenure || ""}
                  onValueChange={(selectedValue) => updateField("equity_investment_tenure", selectedValue)}
                >
                  <SelectTrigger
                    className={cn(
                      "border border-black/10 py-6 text-xs text-text-muted/80 shadow-none placeholder:text-xs data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
                      fieldErrors.equity_investment_tenure && "border-red-500"
                    )}
                  >
                    <SelectValue
                      placeholder='Select equity investment tenure'
                      className='text-xs font-normal placeholder:text-xs data-[placeholder]:text-xs'
                    />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {equityTenureOptions.map((option) => (
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
                {fieldErrors.equity_investment_tenure && (
                  <p className='mt-1 text-xs text-red-500'>{fieldErrors.equity_investment_tenure}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Projected Returns - Equity (%) *</Label>
              <div className='ml-9 md:col-span-2'>
                <PercentageInput
                  value={value.projected_returns_equity || ""}
                  onChange={(newValue) => updateField("projected_returns_equity", newValue)}
                  placeholder='Enter projected equity returns'
                  className={cn(
                    "border border-black/10 py-6 shadow-none placeholder:text-xs",
                    fieldErrors.projected_returns_equity && "border-red-500"
                  )}
                />
                {fieldErrors.projected_returns_equity && (
                  <p className='mt-1 text-xs text-red-500'>{fieldErrors.projected_returns_equity}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 md:items-center'>
              <Label className='pr-4 text-xs font-normal text-text-muted'>Total Equity (%) *</Label>
              <div className='ml-9 md:col-span-2'>
                <PercentageInput
                  value={value.total_equity || ""}
                  onChange={(newValue) => updateField("total_equity", newValue)}
                  placeholder='Enter total equity percentage'
                  className={cn(
                    "border border-black/10 py-6 shadow-none placeholder:text-xs",
                    fieldErrors.total_equity && "border-red-500"
                  )}
                />
                {fieldErrors.total_equity && <p className='mt-1 text-xs text-red-500'>{fieldErrors.total_equity}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8 font-semibold text-text-muted'> Business Plan: The Property</div>

        {/* Error Display */}
        {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

KeyDealPoints.displayName = "KeyDealPoints";
