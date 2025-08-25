import React, { useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tooltip } from "../ui/tooltip";
import { CurrencyInput } from "./currency-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";
import { getFormNumbering } from "@/src/lib/utils/onboarding-field-mapping";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import Image from "next/image";

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
  min_return_on_investment?: string;
  max_return_on_investment?: string;
}

interface DebtDetailsFormProps {
  value?: DebtDetailsData;
  onChange?: (value: DebtDetailsData) => void;
}

const DebtDetailsForm: React.FC<DebtDetailsFormProps> = ({ value = {}, onChange }) => {
  const { currencySymbol } = useCurrencySafe();
  const { formData } = useOnboardingStoreWithUser();

  // Get dynamic numbering based on what's currently visible
  const formNumber = getFormNumbering("debt_details_form", formData.what_are_you_offering as string | undefined);

  // Auto-calculate debt allocation amount based on percentage and total capitalization
  const calculateDebtAllocation = (): string => {
    // Access the nested offer_details_table data
    const offerDetailsData = formData.offer_details_table as Record<string, unknown> | undefined;

    const debtAllocationPercentage = parseFloat(String(offerDetailsData?.debt_allocation || "0"));
    const totalCapitalization = parseFloat(String(offerDetailsData?.total_capitalization || "0"));

    if (debtAllocationPercentage > 0 && totalCapitalization > 0) {
      const debtAllocationAmount = (debtAllocationPercentage / 100) * totalCapitalization;
      return debtAllocationAmount.toLocaleString();
    }

    return "0";
  };

  // Get the numeric debt allocation amount for validation
  const getDebtAllocationNumeric = (): number => {
    const offerDetailsData = formData.offer_details_table as Record<string, unknown> | undefined;
    const debtAllocationPercentage = parseFloat(String(offerDetailsData?.debt_allocation || "0"));
    const totalCapitalization = parseFloat(String(offerDetailsData?.total_capitalization || "0"));

    if (debtAllocationPercentage > 0 && totalCapitalization > 0) {
      return (debtAllocationPercentage / 100) * totalCapitalization;
    }
    return 0;
  };

  // Validate maximum investment amount against debt allocation
  const validateMaxInvestmentAmount = (): string | null => {
    const maxInvestment = parseFloat(value.max_investment_amount || "0");
    const debtAllocation = getDebtAllocationNumeric();

    if (maxInvestment > 0 && debtAllocation > 0 && maxInvestment > debtAllocation) {
      return `Maximum investment cannot exceed the total debt allocation (${currencySymbol}${debtAllocation.toLocaleString()})`;
    }
    return null;
  };

  // Validate minimum investment amount against debt allocation
  const validateMinInvestmentAmount = (): string | null => {
    const minInvestment = parseFloat(value.min_investment_amount || "0");
    const debtAllocation = getDebtAllocationNumeric();

    if (minInvestment > 0 && debtAllocation > 0 && minInvestment > debtAllocation) {
      return `Minimum investment cannot exceed the total debt allocation (${currencySymbol}${debtAllocation.toLocaleString()})`;
    }
    return null;
  };

  // Validate minimum investment amount against maximum investment amount
  const validateMinVsMaxInvestment = (): string | null => {
    const minInvestment = parseFloat(value.min_investment_amount || "0");
    const maxInvestment = parseFloat(value.max_investment_amount || "0");

    if (minInvestment > 0 && maxInvestment > 0 && minInvestment > maxInvestment) {
      return `Minimum investment cannot exceed maximum investment amount`;
    }
    return null;
  };



  // Calculate exit date based on target distribution start date + target hold period
  const calculateExitDate = (): string => {
    const targetDistributionStart = value.target_distribution_start;
    const targetHoldPeriod = value.target_hold_period;

    if (!targetDistributionStart || !targetHoldPeriod) {
      return "Please complete required fields";
    }

    try {
      const startDate = new Date(targetDistributionStart);
      if (isNaN(startDate.getTime())) {
        return "Invalid start date";
      }

      const holdPeriodYears = parseInt(targetHoldPeriod, 10);
      const exitDate = new Date(startDate);
      exitDate.setFullYear(exitDate.getFullYear() + holdPeriodYears);

      // Format as DD/MM/YYYY for display
      const day = exitDate.getDate().toString().padStart(2, "0");
      const month = (exitDate.getMonth() + 1).toString().padStart(2, "0");
      const year = exitDate.getFullYear();

      const result = `${day}/${month}/${year}`;
      return result;
    } catch (error) {
      console.error("Error calculating exit date:", error);
      return "Calculation error";
    }
  };

  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  // Calculate and save exit_date when dependent fields change
  useEffect(() => {
    if (value.target_distribution_start && value.target_hold_period) {
      const calculatedExitDate = calculateExitDate();

      // Only save if it's a valid date (not an error message)
      if (
        !calculatedExitDate.includes("Please complete") &&
        !calculatedExitDate.includes("Invalid") &&
        !calculatedExitDate.includes("Calculation error")
      ) {
        // Convert DD/MM/YYYY to YYYY-MM-DD format for backend
        const [day, month, year] = calculatedExitDate.split("/");
        const formattedExitDate = `${year}-${month}-${day}`;

        // Only update if the exit_date has actually changed
        if (value.exit_date !== formattedExitDate) {
          onChange?.({ ...value, exit_date: formattedExitDate });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.target_distribution_start, value.target_hold_period, value.exit_date]);

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
    { label: "At Maturity", value: "at_maturity" },
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
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
  ];

  const returnOnInvestmentOptions = [
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
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
    { label: "26", value: "26" },
    { label: "27", value: "27" },
    { label: "28", value: "28" },
    { label: "29", value: "29" },
    { label: "30", value: "30" },
    { label: "31", value: "31" },
    { label: "32", value: "32" },
    { label: "33", value: "33" },
    { label: "34", value: "34" },
    { label: "35", value: "35" },
    { label: "36", value: "36" },
    { label: "37", value: "37" },
    { label: "38", value: "38" },
    { label: "39", value: "39" },
    { label: "40", value: "40" },
    { label: "41", value: "41" },
    { label: "42", value: "42" },
    { label: "43", value: "43" },
    { label: "44", value: "44" },
    { label: "45", value: "45" },
    { label: "46", value: "46" },
    { label: "47", value: "47" },
    { label: "48", value: "48" },
    { label: "49", value: "49" },
    { label: "50", value: "50" },
  ];

  return (
    <div>
      <div className='mb-5 flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='feedback icon' width={24} height={24} />
        <h3 className='font-semibold text-text-muted'>{formNumber}. Debt Details</h3>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Debt % Allocation */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated and shows what amount of the total capital is allocated as debt'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>
              Debt Allocation ({currencySymbol}) *
            </span>
          </Tooltip>
          <div className='flex h-[51px] w-full items-center rounded-md border border-black/10 bg-gray-50 px-3 text-sm text-text-muted/80'>
            {currencySymbol}
            {calculateDebtAllocation()}
          </div>
        </div>

        {/* Distribution Period */}
        <div className='space-y-2'>
          <Tooltip content='Select how often debt payments or interest returns will be distributed to investors '>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Distribution Period *</span>
          </Tooltip>
          <Select
            value={value.distribution_period || ""}
            onValueChange={(selectedValue) => handleInputChange("distribution_period", selectedValue)}
          >
            <SelectTrigger className='h-[51px] w-full py-5 text-sm text-text-muted/80 shadow-none'>
              <SelectValue placeholder='Monthly' className='text-sm' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {distributionPeriodOptions.map((option) => (
                <SelectItem className='hover:bg-primary hover:text-white' key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Hold Period */}
        <div className='space-y-2'>
          <Tooltip content='Select the expected duration, in years, that the debt investment will be held before repayment'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Target Hold Period (Years) *</span>
          </Tooltip>
          <Select
            value={value.target_hold_period || ""}
            onValueChange={(selectedValue) => handleInputChange("target_hold_period", selectedValue)}
          >
            <SelectTrigger className='h-[51px] w-full py-5 text-sm text-text-muted/80 shadow-none'>
              <SelectValue placeholder='Select Target Hold Period' className='text-sm' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {targetHoldPeriodOptions.map((option) => (
                <SelectItem className='hover:bg-primary hover:text-white' key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Distribution Start Date */}
        <div className='space-y-2'>
          <Tooltip content='Choose the expected date when investor distributions are scheduled to begin'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Target Distribution Start Date *</span>
          </Tooltip>
          <Input
            id='target_distribution_start'
            type='date'
            placeholder='DD/MM/YY'
            value={value.target_distribution_start || ""}
            onChange={(e) => handleInputChange("target_distribution_start", e.target.value)}
            className='h-[51px] w-full py-5 text-sm shadow-none placeholder:text-sm md:text-sm'
            data-placeholder='DD/MM/YY'
          />
        </div>

        {/* Maximum Investment Amount */}
        <div className='space-y-2'>
          <Tooltip content='Enter the maximum allowable investment from a single investor for the debt allocation.'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Maximum Investment Amount *</span>
          </Tooltip>
          <CurrencyInput
            value={value.max_investment_amount || ""}
            onChange={(value) => handleInputChange("max_investment_amount", value)}
            placeholder=''
            className='h-[51px] w-full py-5 text-sm shadow-none'
          />
          {validateMaxInvestmentAmount() && (
            <p className='mt-1 text-xs text-red-500'>{validateMaxInvestmentAmount()}</p>
          )}
        </div>

        {/* Minimum Investment Amount */}
        <div className='space-y-2'>
          <Tooltip content='Enter the minimum amount an investor can contribute toward the debt portion of the offering'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Minimum Investment Amount *</span>
          </Tooltip>
          <CurrencyInput
            value={value.min_investment_amount || ""}
            onChange={(value) => handleInputChange("min_investment_amount", value)}
            placeholder=''
            className='h-[51px] w-full py-5 text-sm shadow-none'
          />
          {validateMinInvestmentAmount() && (
            <p className='mt-1 text-xs text-red-500'>{validateMinInvestmentAmount()}</p>
          )}
          {validateMinVsMaxInvestment() && <p className='mt-1 text-xs text-red-500'>{validateMinVsMaxInvestment()}</p>}
        </div>

        {/* Minimum Return on Investment (%) */}
        <div className='space-y-2'>
          <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Minimum Return on Investment (%) *</span>
          <Select
            value={value.min_return_on_investment || ""}
            onValueChange={(selectedValue) => handleInputChange("min_return_on_investment", selectedValue)}
          >
            <SelectTrigger className='h-[51px] w-full py-5 text-sm text-text-muted/80 shadow-none'>
              <SelectValue placeholder='Select Minimum Return on Investment' className='text-sm' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {returnOnInvestmentOptions.map((option) => (
                <SelectItem className='hover:bg-primary hover:text-white' key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Maximum Return on Investment (%) */}
        <div className='space-y-2'>
          <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Maximum Return on Investment (%) *</span>
          <Select
            value={value.max_return_on_investment || ""}
            onValueChange={(selectedValue) => handleInputChange("max_return_on_investment", selectedValue)}
          >
            <SelectTrigger className='h-[51px] w-full py-5 text-sm text-text-muted/80 shadow-none'>
              <SelectValue placeholder='Select Maximum Return on Investment' className='text-sm' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {returnOnInvestmentOptions.map((option) => (
                <SelectItem className='hover:bg-primary hover:text-white' key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expected Min Annual Return */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated based on Minimum Investment Amount and Return on Investment percentage'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>
              Expected Min Annual Return ({currencySymbol}) *
            </span>
          </Tooltip>
          <div className='flex h-[51px] w-full items-center rounded-md border border-black/10 px-3 text-sm text-text-muted/80'>
            {(() => {
              const minAmount = parseFloat(value.min_investment_amount || "0");
              const roiPercent = parseFloat(value.min_return_on_investment || "0");
              const calculatedReturn = (minAmount * roiPercent) / 100;
              return calculatedReturn > 0
                ? `${currencySymbol}${calculatedReturn.toLocaleString()}`
                : `${currencySymbol}0`;
            })()}
          </div>
        </div>

        {/* Expected Max Annual Return */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated based on Maximum Investment Amount and Return on Investment percentage'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>
              Expected Max Annual Return ({currencySymbol}) *
            </span>
          </Tooltip>
          <div className='flex h-[51px] w-full items-center rounded-md border border-black/10 px-3 text-sm text-text-muted/80'>
            {(() => {
              const maxAmount = parseFloat(value.max_investment_amount || "0");
              const roiPercent = parseFloat(value.max_return_on_investment || "0");
              const calculatedReturn = (maxAmount * roiPercent) / 100;
              return calculatedReturn > 0
                ? `${currencySymbol}${calculatedReturn.toLocaleString()}`
                : `${currencySymbol}0`;
            })()}
          </div>
        </div>

        {/* Exit Date */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated and shows the projected end date of the debt investment when the principal and final returns are due.'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Exit Date *</span>
          </Tooltip>
          <div className='flex h-[51px] w-full items-center rounded-md border border-black/10 bg-gray-50 px-3 text-sm text-text-muted/80'>
            {(() => {
              const calculatedDate = calculateExitDate();
              return calculatedDate;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtDetailsForm;
