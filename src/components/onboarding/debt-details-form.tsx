import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { Info } from "lucide-react";

type DistributionPeriod = "monthly" | "quarterly" | "semi_annually" | "annually";
type TargetHoldPeriod = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

interface DebtDetailsData {
  debt_allocation?: string;
  distribution_period?: DistributionPeriod;
  target_distribution_start?: string;
  max_investment_amount?: string;
  min_investment_amount?: string;
  expected_max_annual_return?: string;
  expected_min_annual_return?: string;
  exit_date?: string;
  target_hold_period?: TargetHoldPeriod;
}

interface DebtDetailsFormProps {
  value?: DebtDetailsData;
  onChange?: (value: DebtDetailsData) => void;
}

const DebtDetailsForm: React.FC<DebtDetailsFormProps> = ({ value = {}, onChange }) => {
  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  //   const requiredFields = [
  //     "debt_allocation",
  //     "distribution_period",
  //     "target_distribution_start",
  //     "min_investment_amount",
  //     "expected_max_annual_return",
  //     "expected_min_annual_return",
  //     "exit_date",
  //     "target_hold_period",
  //   ];
  //   return requiredFields.every((field) => value[field] && value[field].trim() !== "");
  // };

  const distributionPeriodOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Semi-annually", value: "semi_annually" },
    { label: "Annually", value: "annually" },
  ];

  const targetHoldPeriodOptions = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
  ];

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {/* Debt % Allocation */}
      <div className='space-y-2'>
        <Label htmlFor='debt_allocation' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Debt % Allocation
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='debt_allocation'
          type='text'
          placeholder='Enter allocation'
          value={value.debt_allocation || ""}
          onChange={(e) => handleInputChange("debt_allocation", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Distribution Period */}
      <div className='space-y-2'>
        <Label htmlFor='distribution_period' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Distribution Period
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Select
          value={value.distribution_period || ""}
          onValueChange={(selectedValue) => handleInputChange("distribution_period", selectedValue)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Monthly' />
          </SelectTrigger>
          <SelectContent>
            {distributionPeriodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Distribution Start Date */}
      <div className='space-y-2'>
        <Label
          htmlFor='target_distribution_start'
          className='flex items-center gap-2 text-sm font-medium text-gray-700'
        >
          Target Distribution Start Date
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='target_distribution_start'
          type='text'
          placeholder='DD/MM/YY'
          value={value.target_distribution_start || ""}
          onChange={(e) => handleInputChange("target_distribution_start", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Maximum Investment Amount */}
      <div className='space-y-2'>
        <Label htmlFor='max_investment_amount' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Maximum Investment Amount
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='max_investment_amount'
          type='text'
          placeholder='$950'
          value={value.max_investment_amount || ""}
          onChange={(e) => handleInputChange("max_investment_amount", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Minimum Investment Amount */}
      <div className='space-y-2'>
        <Label htmlFor='min_investment_amount' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Minimum Investment Amount
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='min_investment_amount'
          type='text'
          placeholder='$950'
          value={value.min_investment_amount || ""}
          onChange={(e) => handleInputChange("min_investment_amount", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Expected Max Annual Return */}
      <div className='space-y-2'>
        <Label
          htmlFor='expected_max_annual_return'
          className='flex items-center gap-2 text-sm font-medium text-gray-700'
        >
          Expected Max Annual Return (%)
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='expected_max_annual_return'
          type='text'
          placeholder='$950'
          value={value.expected_max_annual_return || ""}
          onChange={(e) => handleInputChange("expected_max_annual_return", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Expected Min Annual Return */}
      <div className='space-y-2'>
        <Label
          htmlFor='expected_min_annual_return'
          className='flex items-center gap-2 text-sm font-medium text-gray-700'
        >
          Expected Min Annual Return (%)
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='expected_min_annual_return'
          type='text'
          placeholder='$950'
          value={value.expected_min_annual_return || ""}
          onChange={(e) => handleInputChange("expected_min_annual_return", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Exit Date */}
      <div className='space-y-2'>
        <Label htmlFor='exit_date' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Exit Date
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='exit_date'
          type='text'
          placeholder='1/3/27'
          value={value.exit_date || ""}
          onChange={(e) => handleInputChange("exit_date", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Target Hold Period */}
      <div className='space-y-2'>
        <Label htmlFor='target_hold_period' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Target Hold Period (Years)
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Select
          value={value.target_hold_period || ""}
          onValueChange={(selectedValue) => handleInputChange("target_hold_period", selectedValue)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='1' />
          </SelectTrigger>
          <SelectContent>
            {targetHoldPeriodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DebtDetailsForm;
