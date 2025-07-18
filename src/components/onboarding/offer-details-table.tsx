import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

type SponsorCoInvestPercentage = "5.0" | "6.0" | "7.0" | "8.0" | "9.0" | "10.0";
type AssetType = "residential" | "commercial" | "industrial" | "retail" | "office" | "hospitality" | "mixed_use";
type InvestmentStrategy = "core" | "core_plus" | "value_add" | "opportunistic" | "development";
type InvestmentObjective = "income" | "appreciation" | "balanced" | "growth" | "preservation";

interface OfferDetailsData {
  total_capitalization?: string;
  debt_allocation?: string;
  equity_allocation?: string;
  sponsor_co_invest?: SponsorCoInvestPercentage;
  offer_deadline?: string;
  location?: string;
  asset_type?: AssetType;
  strategy?: InvestmentStrategy;
  objective?: InvestmentObjective;
  [key: string]: string | SponsorCoInvestPercentage | AssetType | InvestmentStrategy | InvestmentObjective | undefined;
}

interface OfferDetailsTableProps {
  value?: OfferDetailsData;
  onChange?: (value: OfferDetailsData) => void;
}

const OfferDetailsTable: React.FC<OfferDetailsTableProps> = ({ value = {}, onChange }) => {
  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  //   const requiredFields = [
  //     'total_capitalization',
  //     'debt_allocation',
  //     'equity_allocation',
  //     'sponsor_co_invest',
  //     'offer_deadline',
  //     'location',
  //     'asset_type',
  //     'strategy',
  //     'objective'
  //   ];
  //   return requiredFields.every(field => value[field] && value[field].trim() !== "");
  // };

  const sponsorCoInvestOptions = [
    { label: "5.0%", value: "5.0" },
    { label: "6.0%", value: "6.0" },
    { label: "7.0%", value: "7.0" },
    { label: "8.0%", value: "8.0" },
    { label: "9.0%", value: "9.0" },
    { label: "10.0%", value: "10.0" },
  ];

  const assetTypeOptions = [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Industrial", value: "industrial" },
    { label: "Retail", value: "retail" },
    { label: "Office", value: "office" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Mixed Use", value: "mixed_use" },
  ];

  const strategyOptions = [
    { label: "Core", value: "core" },
    { label: "Core Plus", value: "core_plus" },
    { label: "Value Add", value: "value_add" },
    { label: "Opportunistic", value: "opportunistic" },
    { label: "Development", value: "development" },
  ];

  const objectiveOptions = [
    { label: "Income", value: "income" },
    { label: "Appreciation", value: "appreciation" },
    { label: "Balanced", value: "balanced" },
    { label: "Growth", value: "growth" },
    { label: "Preservation", value: "preservation" },
  ];

  const tableData = [
    {
      category: "Total Capitalization ($)",
      inputType: "text",
      field: "total_capitalization",
      placeholder: "$10m",
      briefInfo: "Enter the total amount of capital required for the investment",
    },
    {
      category: "Debt Allocation ($)",
      inputType: "text",
      field: "debt_allocation",
      placeholder: "e.g $25,000,000",
      briefInfo: "Specify the portion of the total capitalization that will be funded through debt.",
    },
    {
      category: "Equity Allocation ($)",
      inputType: "text",
      field: "equity_allocation",
      placeholder: "e.g $25,000,000",
      briefInfo: "Specify the amount of equity funding being raised as part of the total capitalization",
    },
    {
      category: "Sponsor Co-invest",
      inputType: "select",
      field: "sponsor_co_invest",
      placeholder: "5.0% - 10.0%",
      options: sponsorCoInvestOptions,
      briefInfo: "Select the percentage of capital the sponsor will personally invest in the deal",
    },
    {
      category: "Offer Deadline",
      inputType: "text",
      field: "offer_deadline",
      placeholder: "(DD/MM/YY)",
      briefInfo: "Set the final date by which investors must commit to the offering",
    },
    {
      category: "Location",
      inputType: "text",
      field: "location",
      placeholder: "Enter location",
      briefInfo: "Enter the geographical location of the asset (city, state, or region)",
    },
    {
      category: "Asset Type",
      inputType: "select",
      field: "asset_type",
      placeholder: "Type",
      options: assetTypeOptions,
      briefInfo: "Choose the type of asset involved in the investment",
    },
    {
      category: "Strategy",
      inputType: "select",
      field: "strategy",
      placeholder: "Type",
      options: strategyOptions,
      briefInfo: "Select the investment strategy category that best describes the risk and return approach.",
    },
    {
      category: "Objective",
      inputType: "select",
      field: "objective",
      placeholder: "Type",
      options: objectiveOptions,
      briefInfo: "Choose the primary investment goal",
    },
  ];

  return (
    <div className='w-full'>
      <p className='mb-4 text-text-muted/80'>
        Provide a breakdown of the financial structure for this opportunity. Include key details about the offering,
        such as the total amount being raised, the debt and equity components, and how the capital will be allocated.
      </p>
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
        <span className='ml-2'>1. Offer Details</span>
      </h3>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className=''>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Category</th>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Input</th>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Brief Info</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='p-4 text-sm text-text-muted/80'>{item.category}</td>
                <td className='p-4'>
                  {item.inputType === "text" ? (
                    <Input
                      type='text'
                      placeholder={item.placeholder}
                      value={value[item.field] || ""}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className='w-full py-6 text-sm shadow-none'
                    />
                  ) : (
                    <Select
                      value={value[item.field] || ""}
                      onValueChange={(selectedValue) => handleInputChange(item.field, selectedValue)}
                    >
                      <SelectTrigger className='w-full py-6 text-sm shadow-none data-[placeholder]:text-sm data-[placeholder]:text-text-muted/80'>
                        <SelectValue placeholder={item.placeholder} />
                      </SelectTrigger>
                      <SelectContent className='bg-white text-sm text-text-muted/80'>
                        {item.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className='hover:bg-primary hover:text-white'
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className='p-4 text-sm text-text-muted/80'>{item.briefInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferDetailsTable;
