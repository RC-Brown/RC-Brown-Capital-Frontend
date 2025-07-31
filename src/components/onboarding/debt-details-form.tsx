import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tooltip } from "../ui/tooltip";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";

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
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clip-path='url(#clip0_1948_3213)'>
            <path
              d='M12.4168 0.664391L13.0504 1.93679L14.4068 2.17199C14.782 2.23719 14.9312 2.71599 14.6644 2.99839L13.6996 4.01959L13.9044 5.43719C13.9612 5.82919 13.5704 6.12519 13.23 5.94799L12 5.30679L10.77 5.94799C10.4296 6.12519 10.0392 5.82959 10.0956 5.43719L10.3004 4.01959L9.3356 2.99839C9.0688 2.71599 9.218 2.23719 9.5932 2.17199L10.9496 1.93679L11.5832 0.664391C11.7584 0.312391 12.2416 0.312391 12.4168 0.664391Z'
              fill='#F9C82B'
            />
            <path
              d='M5.21661 3.86361L5.85021 5.13601L7.20661 5.37121C7.58181 5.43641 7.73101 5.91521 7.46421 6.19761L6.49941 7.21881L6.70421 8.63641C6.76101 9.02841 6.37021 9.32441 6.02981 9.14721L4.79981 8.50601L3.56981 9.14721C3.22941 9.32441 2.83901 9.02881 2.89541 8.63641L3.10021 7.21881L2.13541 6.19761C1.86861 5.91521 2.01781 5.43641 2.39301 5.37121L3.74941 5.13601L4.38301 3.86361C4.55821 3.51161 5.04141 3.51161 5.21661 3.86361Z'
              fill='#F9C82B'
            />
            <path
              d='M19.617 3.86361L20.2506 5.13601L21.607 5.37121C21.9822 5.43641 22.1314 5.91521 21.8646 6.19761L20.8998 7.21881L21.1046 8.63641C21.1614 9.02841 20.7706 9.32441 20.4302 9.14721L19.2002 8.50601L17.9702 9.14721C17.6298 9.32441 17.2394 9.02881 17.2958 8.63641L17.5006 7.21881L16.5358 6.19761C16.269 5.91521 16.4182 5.43641 16.7934 5.37121L18.1498 5.13601L18.7834 3.86361C18.9586 3.51161 19.4418 3.51161 19.617 3.86361Z'
              fill='#F9C82B'
            />
            <path
              d='M7.76039 17.3604C6.67239 18.4484 6.00039 19.9444 6.00039 21.6004C6.00039 21.8204 5.82039 22.0004 5.60039 22.0004H0.800391C0.580391 22.0004 0.400391 21.8204 0.400391 21.6004C0.400391 18.4004 1.70039 15.5044 3.80039 13.4004H4.20039L7.60039 16.8004L7.76039 17.3604Z'
              fill='#D7342C'
            />
            <path
              d='M11.9998 10L12.3998 10.4V15.2L11.9998 15.6C10.3438 15.6 8.8478 16.272 7.7598 17.36L3.7998 13.4C5.9038 11.3 8.7998 10 11.9998 10Z'
              fill='#E99E32'
            />
            <path
              d='M20.2 13.4L20.4 14L16.8 17.6L16.24 17.36C15.152 16.272 13.656 15.6 12 15.6V10C15.2 10 18.096 11.3 20.2 13.4Z'
              fill='#F9C82B'
            />
            <path
              d='M23.6002 21.6004C23.6002 21.8204 23.4202 22.0004 23.2002 22.0004H18.4002C18.1802 22.0004 18.0002 21.8204 18.0002 21.6004C18.0002 19.9444 17.3282 18.4484 16.2402 17.3604L20.2002 13.4004C22.3002 15.5044 23.6002 18.4004 23.6002 21.6004Z'
              fill='#2AA869'
            />
            <path
              d='M13.4876 22.5832C15.4076 21.5432 18.4276 19.7512 20.7076 18.3872C21.1236 18.1352 20.8316 17.5072 20.3756 17.6632C17.8596 18.5272 14.5476 19.6832 12.5156 20.4872L13.4876 22.5832Z'
              fill='#0A365E'
            />
            <path
              d='M12.0004 23.6004C12.884 23.6004 13.6004 22.884 13.6004 22.0004C13.6004 21.1167 12.884 20.4004 12.0004 20.4004C11.1167 20.4004 10.4004 21.1167 10.4004 22.0004C10.4004 22.884 11.1167 23.6004 12.0004 23.6004Z'
              fill='#06293F'
            />
          </g>
          <defs>
            <clipPath id='clip0_1948_3213'>
              <rect width='24' height='24' fill='white' />
            </clipPath>
          </defs>
        </svg>

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
            className='w-full py-5 text-sm shadow-none'
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
            <SelectTrigger className='w-full py-5 text-sm shadow-none'>
              <SelectValue placeholder='Monthly' />
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
            className='w-full py-5 text-sm shadow-none placeholder:text-sm md:text-sm'
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
            className='w-full py-5 text-sm shadow-none'
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
            className='w-full py-5 text-sm shadow-none'
          />
        </div>

        {/* Expected Max Annual Return */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated based on Maximum Investment Amount and Return on Investment percentage'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>
              Expected Max Annual Return ({currencySymbol}) *
            </span>
          </Tooltip>
          <div className='w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-5 text-sm text-gray-600'>
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

        {/* Expected Min Annual Return */}
        <div className='space-y-2'>
          <Tooltip content='This is automatically calculated based on Minimum Investment Amount and Return on Investment percentage'>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>
              Expected Min Annual Return ({currencySymbol}) *
            </span>
          </Tooltip>
          <div className='w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-5 text-sm text-gray-600'>
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
            className='w-full py-5 text-sm shadow-none placeholder:text-sm md:text-sm'
            data-placeholder='DD/MM/YY'
          />
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
            <SelectTrigger className='w-full py-5 text-sm shadow-none'>
              <SelectValue placeholder='1' />
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

        {/* Return on Investment (% ) */}
        <div className='space-y-2'>
          <span className='text-sm font-normal -tracking-[3%] text-text-muted'>Return on Investment (%) *</span>
          <Select
            value={value.return_on_investment || ""}
            onValueChange={(selectedValue) => handleInputChange("return_on_investment", selectedValue)}
          >
            <SelectTrigger className='w-full py-5 text-sm shadow-none'>
              <SelectValue placeholder='1' />
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
      </div>
    </div>
  );
};

export default DebtDetailsForm;
