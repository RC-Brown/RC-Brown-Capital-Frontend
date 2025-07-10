import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";

type DistributionFrequency = "monthly" | "quarterly" | "semi_annually" | "annually";
type TargetHoldPeriod = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

interface EquityDetailsData {
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
  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  //   const requiredFields = [
  //     "distribution_frequency",
  //     "target_distribution_start",
  //     "minimum_investment",
  //     "maximum_investment",
  //     "expected_min_return",
  //     "expected_max_return",
  //     "target_hold_period",
  //     "exit_date",
  //   ];
  //   return requiredFields.every((field) => value[field] && value[field].trim() !== "");
  // };

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
  ];

  const tableData = [
    {
      category: "Equity % Allocation",
      value: "$10m",
      description: "This is automatically calculated and reflects the portion of equity offered to investors",
      isReadOnly: true,
    },
    {
      category: "Distribution Frequency",
      value: "Monthly",
      description: "Select how frequently equity returns are paid",
      isDropdown: true,
      options: distributionFrequencyOptions,
      field: "distribution_frequency",
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Table */}
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
                    {item.isReadOnly ? (
                      <Input type='text' value={item.value} readOnly className='w-full bg-gray-50 text-gray-500' />
                    ) : item.isDropdown ? (
                      <Select
                        value={item.field ? value[item.field] || "" : ""}
                        onValueChange={(selectedValue) => item.field && handleInputChange(item.field, selectedValue)}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={item.value} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type='text'
                        value={item.field ? value[item.field] || item.value : item.value}
                        onChange={(e) => item.field && handleInputChange(item.field, e.target.value)}
                        className='w-full'
                      />
                    )}
                  </td>
                  <td className='border border-gray-200 p-4 text-sm text-gray-600'>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Fields */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Target Distribution Start */}
        <div className='space-y-2'>
          <Label htmlFor='target_distribution_start' className='text-sm font-medium text-gray-700'>
            Target Distribution Start
          </Label>
          <Input
            id='target_distribution_start'
            type='text'
            placeholder='(DD/MM/YY)'
            value={value.target_distribution_start || ""}
            onChange={(e) => handleInputChange("target_distribution_start", e.target.value)}
            className='w-full'
          />
          <p className='text-sm text-gray-500'>Enter the date when equity return distributions are expected to begin</p>
        </div>

        {/* Minimum Investment ($) */}
        <div className='space-y-2'>
          <Label htmlFor='minimum_investment' className='text-sm font-medium text-gray-700'>
            Minimum Investment ($)
          </Label>
          <Input
            id='minimum_investment'
            type='text'
            placeholder='$10m'
            value={value.minimum_investment || ""}
            onChange={(e) => handleInputChange("minimum_investment", e.target.value)}
            className='w-full'
          />
          <p className='text-sm text-gray-500'>
            Enter the lowest amount an investor can contribute toward the equity portion of this deal.
          </p>
        </div>

        {/* Maximum Investment ($) */}
        <div className='space-y-2'>
          <Label htmlFor='maximum_investment' className='text-sm font-medium text-gray-700'>
            Maximum Investment ($)
          </Label>
          <Input
            id='maximum_investment'
            type='text'
            placeholder='$10m'
            value={value.maximum_investment || ""}
            onChange={(e) => handleInputChange("maximum_investment", e.target.value)}
            className='w-full'
          />
          <p className='text-sm text-gray-500'>
            Enter the highest amount a single investor is allowed to invest in equity
          </p>
        </div>

        {/* Expected Min Return (%) */}
        <div className='space-y-2'>
          <Label htmlFor='expected_min_return' className='text-sm font-medium text-gray-700'>
            Expected Min Return (%)
          </Label>
          <Input
            id='expected_min_return'
            type='text'
            placeholder='2%'
            value={value.expected_min_return || ""}
            onChange={(e) => handleInputChange("expected_min_return", e.target.value)}
            className='w-full'
          />
          <p className='text-sm text-gray-500'>This is automatically calculated based on projected performance.</p>
        </div>

        {/* Expected Max Return (%) */}
        <div className='space-y-2'>
          <Label htmlFor='expected_max_return' className='text-sm font-medium text-gray-700'>
            Expected Max Return (%)
          </Label>
          <Input
            id='expected_max_return'
            type='text'
            placeholder='4%'
            value={value.expected_max_return || ""}
            onChange={(e) => handleInputChange("expected_max_return", e.target.value)}
            className='w-full'
          />
          <p className='text-sm text-gray-500'>
            This is automatically calculated to show the highest possible return investors might earn on equity
          </p>
        </div>

        {/* Target Hold Period (Years) */}
        <div className='space-y-2'>
          <Label htmlFor='target_hold_period' className='text-sm font-medium text-gray-700'>
            Target Hold Period (Years)
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
          <p className='text-sm text-gray-500'>
            Select the expected time frame the equity will be held before an exit event
          </p>
        </div>

        {/* Exit Date */}
        <div className='space-y-2'>
          <Label htmlFor='exit_date' className='text-sm font-medium text-gray-700'>
            Exit Date
          </Label>
          <Input
            id='exit_date'
            type='text'
            placeholder='2/5/27'
            value={value.exit_date || ""}
            onChange={(e) => handleInputChange("exit_date", e.target.value)}
            className='w-full'
          />
          <p className='text-sm text-gray-500'>
            Choose the projected date when the investment will end and equity will be returned to investors
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquityDetailsForm;
