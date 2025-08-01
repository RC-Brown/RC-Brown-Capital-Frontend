import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tooltip } from "../ui/tooltip";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";
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
  return_on_investment?: string;
}

interface DebtDetailsFormProps {
  value?: DebtDetailsData;
  onChange?: (value: DebtDetailsData) => void;
}

const DebtDetailsForm: React.FC<DebtDetailsFormProps> = ({ value = {}, onChange }) => {
  const { currencySymbol } = useCurrencySafe();

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
  ];

  return (
    <div>
      <div className='mb-5 flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='feedback icon' width={24} height={24} />
        <h3 className='font-semibold text-text-muted'>2. Debt Details</h3>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Debt % Allocation */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated and shows what percentage of the total capital is allocated as debt'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Debt % Allocation *</span>
          </Tooltip>
          <PercentageInput
            value={value.debt_allocation || ""}
            onChange={(value) => handleInputChange("debt_allocation", value)}
            placeholder='Enter allocation'
            className='h-[51px] w-full py-5 text-sm shadow-none'
          />
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
        </div>

        {/* Return on Investment (% ) */}
        <div className='space-y-2'>
          <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Return on Investment (%) *</span>
          <Select
            value={value.return_on_investment || ""}
            onValueChange={(selectedValue) => handleInputChange("return_on_investment", selectedValue)}
          >
            <SelectTrigger className='h-[51px] w-full py-5 text-sm text-text-muted/80 shadow-none'>
              <SelectValue placeholder='Select Return on Investment' className='text-sm' />
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
              const roiPercent = parseFloat(value.return_on_investment || "0");
              const calculatedReturn = (minAmount * roiPercent) / 100;
              return calculatedReturn > 0
                ? `${currencySymbol}${calculatedReturn.toLocaleString()}`
                : `${currencySymbol}950`;
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
              const roiPercent = parseFloat(value.return_on_investment || "0");
              const calculatedReturn = (maxAmount * roiPercent) / 100;
              return calculatedReturn > 0
                ? `${currencySymbol}${calculatedReturn.toLocaleString()}`
                : `${currencySymbol}950`;
            })()}
          </div>
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

        {/* Exit Date */}
        <div className='space-y-2'>
          <Tooltip content='Select the projected end date of the debt investment when the principal and final returns are due.'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Exit Date *</span>
          </Tooltip>
          <Input
            id='exit_date'
            type='date'
            placeholder='1/3/27'
            value={value.exit_date || ""}
            onChange={(e) => handleInputChange("exit_date", e.target.value)}
            className='h-[51px] w-full py-5 text-sm shadow-none placeholder:text-sm md:text-sm'
            data-placeholder='DD/MM/YY'
          />
        </div>
      </div>
    </div>
  );
};

export default DebtDetailsForm;
