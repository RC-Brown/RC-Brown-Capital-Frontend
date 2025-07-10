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
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Category</th>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Input</th>
              <th className='border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>Brief Info</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='border border-gray-200 p-4 text-sm font-medium text-gray-700'>{item.category}</td>
                <td className='border border-gray-200 p-4'>
                  {item.inputType === "text" ? (
                    <Input
                      type='text'
                      placeholder={item.placeholder}
                      value={value[item.field] || ""}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className='w-full'
                    />
                  ) : (
                    <Select
                      value={value[item.field] || ""}
                      onValueChange={(selectedValue) => handleInputChange(item.field, selectedValue)}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={item.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className='border border-gray-200 p-4 text-sm text-gray-600'>{item.briefInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferDetailsTable;
