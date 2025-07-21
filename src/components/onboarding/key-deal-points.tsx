"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

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

interface KeyDealPointsProps {
  value?: KeyDealPointsData;
  onChange: (value: KeyDealPointsData) => void;
  error?: string;
}

export function KeyDealPoints({ value = {}, onChange, error }: KeyDealPointsProps) {
  const updateField = (field: keyof KeyDealPointsData, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const debtTenureOptions = [
    { label: "One year", value: "1_year" },
    { label: "Two years", value: "2_years" },
    { label: "Three years", value: "3_years" },
    { label: "Four years", value: "4_years" },
    { label: "Five years", value: "5_years" },
    { label: "Six years", value: "6_years" },
    { label: "Seven years", value: "7_years" },
    { label: "Eight years", value: "8_years" },
    { label: "Nine years", value: "9_years" },
    { label: "Ten years", value: "10_years" },
  ];

  return (
    <div>
      <div className='space-y-4 rounded-lg px-8 py-6 shadow-lg'>
        <h4 className='font-medium'>The Deal (Key Deal Points)</h4>

        <div className='relative space-y-6'>
          {/* Vertical separator line */}
          <div className='absolute left-[28%] top-0 hidden h-full w-px bg-gray-200 md:block'></div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Projected Valuation</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Estimated property value upon completion'
                value={value.projected_valuation || ""}
                onChange={(e) => updateField("projected_valuation", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Timeline of Completion (Months)*</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter timeline in months'
                value={value.timeline_completion || ""}
                onChange={(e) => updateField("timeline_completion", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Total Capital Required *</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter total capital required'
                value={value.total_capital_required || ""}
                onChange={(e) => updateField("total_capital_required", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Total Debt Allocation (%)</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter debt allocation percentage'
                value={value.total_debt_allocation || ""}
                onChange={(e) => updateField("total_debt_allocation", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Debt Investment Tenure</Label>
            <div className='md:col-span-2'>
              <Select
                value={value.debt_investment_tenure || ""}
                onValueChange={(selectedValue) => updateField("debt_investment_tenure", selectedValue)}
              >
                <SelectTrigger className='border border-black/60 py-6 shadow-none placeholder:text-xs'>
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

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Percentage Yield - Debt (%)</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter yield percentage'
                value={value.percentage_yield_debt || ""}
                onChange={(e) => updateField("percentage_yield_debt", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Equity Investment Tenure *</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter equity investment tenure'
                value={value.equity_investment_tenure || ""}
                onChange={(e) => updateField("equity_investment_tenure", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Projected Returns - Equity (%) *</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter projected equity returns'
                value={value.projected_returns_equity || ""}
                onChange={(e) => updateField("projected_returns_equity", e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
            <Label className='pr-4 text-xs font-normal text-text-muted'>Total Equity (%) *</Label>
            <div className='md:col-span-2'>
              <Input
                className='border border-black/60 py-6 shadow-none placeholder:text-xs'
                placeholder='Enter total equity percentage'
                value={value.total_equity || ""}
                onChange={(e) => updateField("total_equity", e.target.value)}
              />
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
