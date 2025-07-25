import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";

type DistributionFrequency = "monthly" | "quarterly" | "semi_annually" | "annually";
type TargetHoldPeriod = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

interface EquityDetailsData {
  equity_allocation?: string;
  distribution_frequency?: DistributionFrequency;
  target_distribution_start?: string;
  minimum_investment?: string;
  maximum_investment?: string;
  expected_min_return?: string;
  expected_max_return?: string;
  target_hold_period?: TargetHoldPeriod;
  exit_date?: string;
  [key: string]: string | DistributionFrequency | TargetHoldPeriod | undefined;
}

interface EquityDetailsFormProps {
  value?: EquityDetailsData;
  onChange?: (value: EquityDetailsData) => void;
}

const EquityDetailsForm: React.FC<EquityDetailsFormProps> = ({ value = {}, onChange }) => {
  const { formatCurrency } = useCurrencySafe();

  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  const distributionFrequencyOptions = [
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

  const tableData = [
    {
      category: "Equity % Allocation",
      inputType: "text",
      field: "equity_allocation",
      placeholder: "",
      briefInfo: "This is automatically calculated and reflects the portion of equity offered to investors",
      isReadOnly: true,
    },
    {
      category: "Distribution Frequency",
      inputType: "select",
      field: "distribution_frequency",
      placeholder: "Monthly",
      options: distributionFrequencyOptions,
      briefInfo: "Select how frequently equity returns are paid",
    },
    {
      category: "Target Distribution Start",
      inputType: "date-picker",
      field: "target_distribution_start",
      placeholder: "(DD/MM/YY)",
      briefInfo: "Enter the date when equity return distributions are expected to begin",
    },
    {
      category: `Minimum Investment (${formatCurrency("")})`,
      inputType: "currency",
      field: "minimum_investment",
      placeholder: "",
      briefInfo: "Enter the lowest amount an investor can contribute toward the equity portion of this deal.",
    },
    {
      category: `Maximum Investment (${formatCurrency("")})`,
      inputType: "currency",
      field: "maximum_investment",
      placeholder: "",
      briefInfo: "Enter the highest amount a single investor is allowed to invest in equity",
    },
    {
      category: `Expected Min Return (%)`,
      inputType: "percentage",
      field: "expected_min_return",
      placeholder: "",
      briefInfo: "This is automatically calculated based on projected performance.",
    },
    {
      category: `Expected Max Return (%)`,
      inputType: "percentage",
      field: "expected_max_return",
      placeholder: "",
      briefInfo: "This is automatically calculated to show the highest possible return investors might earn on equity",
    },
    {
      category: "Target Hold Period (Years)",
      inputType: "select",
      field: "target_hold_period",
      placeholder: "1",
      options: targetHoldPeriodOptions,
      briefInfo: "Select the expected time frame the equity will be held before an exit event",
    },
    {
      category: "Exit Date",
      inputType: "date-picker",
      field: "exit_date",
      placeholder: "2/5/27",
      briefInfo: "Choose the projected date when the investment will end and equity will be returned to investors",
    },
    {
      category: "Return on Investment (%)",
      inputType: "select",
      field: "return_on_investment",
      placeholder: "%",
      options: returnOnInvestmentOptions,
      briefInfo: "Choose the projected date when the investment will end and equity will be returned to investors",
    },
  ];

  return (
    <div className='mb-0 w-full pb-0'>
      <h3 className='mb-7 flex items-center'>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clip-path='url(#clip0_1802_3396)'>
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
            <clipPath id='clip0_1802_3396'>
              <rect width='24' height='24' fill='white' />
            </clipPath>
          </defs>
        </svg>
        <span className='ml-2 font-semibold text-text-muted'>4. Equity Details</span>
      </h3>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className=''>
              <th className='border-b border-black/10 p-4 text-left text-sm font-medium text-text-muted'>Category</th>
              <th className='border-b border-black/10 p-4 text-left text-sm font-medium text-text-muted'>Input</th>
              <th className='border-b border-black/10 p-4 text-left text-sm font-medium text-text-muted'>Brief Info</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className='border-b border-black/10'>
                <td className='whitespace-nowrap p-4 text-xs text-text-muted/80'>{item.category}</td>
                <td className='p-4'>
                  {item.isReadOnly ? (
                    <Input
                      type='text'
                      value={item.placeholder}
                      readOnly
                      className='w-full bg-gray-50 py-6 text-sm text-gray-500 shadow-none'
                    />
                  ) : item.inputType === "text" ? (
                    <Input
                      type='text'
                      placeholder={item.placeholder}
                      value={value[item.field] || ""}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className='h-[51px] w-full text-xs shadow-none placeholder:text-xs'
                    />
                  ) : item.inputType === "currency" ? (
                    <CurrencyInput
                      value={value[item.field] || ""}
                      onChange={(value) => handleInputChange(item.field, value)}
                      placeholder={item.placeholder}
                      className='h-[51px] w-full text-xs shadow-none placeholder:text-xs'
                    />
                  ) : item.inputType === "percentage" ? (
                    <PercentageInput
                      value={value[item.field] || ""}
                      onChange={(value) => handleInputChange(item.field, value)}
                      placeholder={item.placeholder}
                      className='h-[51px] w-full text-xs shadow-none placeholder:text-xs'
                    />
                  ) : item.inputType === "date-picker" ? (
                    <Input
                      type='date'
                      placeholder={item.placeholder}
                      value={value[item.field] || ""}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className='h-[51px] w-full text-xs shadow-none placeholder:text-xs md:text-xs'
                    />
                  ) : (
                    <Select
                      value={value[item.field] || ""}
                      onValueChange={(selectedValue) => handleInputChange(item.field, selectedValue)}
                    >
                      <SelectTrigger className='h-[51px] w-full text-xs shadow-none data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'>
                        <SelectValue placeholder={item.placeholder} />
                      </SelectTrigger>
                      <SelectContent className='bg-white text-xs text-text-muted/80'>
                        {item.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className='text-xs font-medium text-text-muted hover:bg-primary hover:text-white'
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className='p-4 text-xs text-text-muted/80'>{item.briefInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className='mt-2 text-sm font-light italic text-text-muted'>
        RC Brown Capital diligently assesses every deal and sponsor through a thorough and comprehensive screening
        process.
      </p>
    </div>
  );
};

export default EquityDetailsForm;
