import React, { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import Image from "next/image";

type DistributionFrequency = "monthly" | "quarterly" | "semi_annually" | "annually";
type TargetHoldPeriod = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

interface DualFieldConfig {
  field: string;
  placeholder: string;
  value?: string;
  inputType: "percentage" | "currency";
}

interface BaseTableDataItem {
  category: string;
  placeholder?: string;
  briefInfo: string;
  isReadOnly?: boolean;
  options?: Array<{ label: string; value: string }>;
}

interface DualTableDataItem extends BaseTableDataItem {
  inputType: "dual";
  fields: {
    percentage: DualFieldConfig;
    amount: DualFieldConfig;
  };
}

interface SingleTableDataItem extends BaseTableDataItem {
  inputType: "text" | "currency" | "percentage" | "date-picker" | "select" | "calculated";
  field: string;
}

type TableDataItem = SingleTableDataItem | DualTableDataItem;

interface EquityDetailsData {
  equity_allocation_percentage?: string;
  equity_allocation_amount?: string;
  distribution_frequency?: DistributionFrequency;
  target_distribution_start?: string;
  minimum_investment?: string;
  maximum_investment?: string;
  expected_min_return_percentage?: string;
  expected_min_return_amount?: string;
  expected_max_return_percentage?: string;
  expected_max_return_amount?: string;
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
  const [dateError, setDateError] = useState<string>("");
  const { formData } = useOnboardingStoreWithUser();

  // Calculate ROI percentages based on shared store data
  const calculateROIPercentages = () => {
    // Get data from other forms via shared store
    const offerDetailsData = formData.offer_details_table as Record<string, unknown> | undefined;
    const expensesRevenueData = formData.expenses_revenue_form as Record<string, unknown> | undefined;

    // Extract required values with proper type casting (fixed field names)
    const totalCapitalRequired = parseFloat(String(offerDetailsData?.total_capitalization || "0"));
    // const totalDebtAllocation = parseFloat(String(offerDetailsData?.debt_allocation || "0"));
    const totalEquityAllocation = parseFloat(String(offerDetailsData?.equity_allocation || "0")); // This is the total equity allocation in dollars
    const totalRentalIncome = parseFloat(String(expensesRevenueData?.["totalRentalIncome"] || "0"));
    const totalEquityAppreciation = parseFloat(String(expensesRevenueData?.["totalEquityAppreciation"] || "0"));
    const totalExpenses = parseFloat(String(expensesRevenueData?.["totalExpense"] || "0"));

    const minInvestment = parseFloat(value.minimum_investment || "0");
    const maxInvestment = parseFloat(value.maximum_investment || "0");

    const calculations = {
      minROIPercentage: 0,
      maxROIPercentage: 0,
      minROIAmount: 0,
      maxROIAmount: 0,
      equityAllocationPercentage: 0,
      equityAllocationAmount: totalEquityAllocation,
    };

    // Calculate equity allocation percentage
    calculations.equityAllocationPercentage = (totalEquityAllocation / totalCapitalRequired) * 100;

    if (totalEquityAllocation > 0 && minInvestment > 0) {
      // Step 1: Calculate percentage of equity invested for minimum investment
      const minEquityPercent = (minInvestment / totalEquityAllocation) * 100;
      // Step 2: Calculate ROI value for minimum investment
      // ROI = % of equity invested × (Total Rental Income + Total Equity Appreciation - Total Expenses)
      const totalReturns = totalRentalIncome + totalEquityAppreciation - totalExpenses;
      const minROIValue = (minEquityPercent / 100) * totalReturns;

      // Store monetary value
      calculations.minROIAmount = minROIValue;

      // Step 3: Calculate ROI percentage
      // ROI % = (ROI value / Investment Amount) × 100
      calculations.minROIPercentage = (minROIValue / minInvestment) * 100;
    }

    if (totalEquityAllocation > 0 && maxInvestment > 0) {
      // Step 1: Calculate percentage of equity invested for maximum investment
      const maxEquityPercent = (maxInvestment / totalEquityAllocation) * 100;
      // Step 2: Calculate ROI value for maximum investment
      const totalReturns = totalRentalIncome + totalEquityAppreciation - totalExpenses;
      const maxROIValue = (maxEquityPercent / 100) * totalReturns;

      // Store monetary value
      calculations.maxROIAmount = maxROIValue;

      // Step 3: Calculate ROI percentage
      calculations.maxROIPercentage = (maxROIValue / maxInvestment) * 100;
    }

    return calculations;
  };

  const {
    minROIPercentage,
    maxROIPercentage,
    minROIAmount,
    maxROIAmount,
    equityAllocationPercentage,
    equityAllocationAmount,
  } = calculateROIPercentages();

  const handleInputChange = (field: keyof EquityDetailsData, inputValue: string) => {
    const newValue = { ...value, [field]: inputValue };

    // Validate dates when either date field changes
    if (field === "target_distribution_start" || field === "exit_date") {
      validateDates(newValue);
    }

    onChange?.(newValue);
  };

  const validateDates = (formData: EquityDetailsData) => {
    const distributionStart = formData.target_distribution_start;
    const exitDate = formData.exit_date;

    if (distributionStart && exitDate) {
      const startDate = new Date(distributionStart);
      const endDate = new Date(exitDate);

      if (endDate <= startDate) {
        setDateError("Exit date must be after the Target Distribution Start date");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  };

  // Validate dates on component mount and when value changes
  useEffect(() => {
    validateDates(value);
  }, [value.target_distribution_start, value.exit_date, value]);

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

  const tableData: TableDataItem[] = [
    {
      category: "Equity Allocation",
      inputType: "dual",
      fields: {
        percentage: {
          field: "equity_allocation_percentage",
          placeholder: equityAllocationPercentage ? `${equityAllocationPercentage.toFixed(2)}%` : "0.00%",
          value: equityAllocationPercentage ? `${equityAllocationPercentage.toFixed(2)}%` : "0.00%",
          inputType: "percentage",
        },
        amount: {
          field: "equity_allocation_amount",
          placeholder: equityAllocationAmount ? formatCurrency(equityAllocationAmount.toString()) : formatCurrency("0"),
          value: equityAllocationAmount ? formatCurrency(equityAllocationAmount.toString()) : formatCurrency("0"),
          inputType: "currency",
        },
      },
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
      briefInfo: "What is the % yield on the investment",
    },
    {
      category: "Expected Min Return",
      inputType: "dual",
      fields: {
        percentage: {
          field: "expected_min_return_percentage",
          placeholder: `${minROIPercentage.toFixed(2)}%`,
          inputType: "percentage",
        },
        amount: {
          field: "expected_min_return_amount",
          placeholder: formatCurrency(minROIAmount.toString()),
          inputType: "currency",
        },
      },
      briefInfo: "This is automatically calculated based on projected performance.",
      isReadOnly: true,
    },
    {
      category: "Expected Max Return",
      inputType: "dual",
      fields: {
        percentage: {
          field: "expected_max_return_percentage",
          placeholder: `${maxROIPercentage.toFixed(2)}%`,
          inputType: "percentage",
        },
        amount: {
          field: "expected_max_return_amount",
          placeholder: formatCurrency(maxROIAmount.toString()),
          inputType: "currency",
        },
      },
      briefInfo: "This is automatically calculated to show the highest possible return investors might earn on equity",
      isReadOnly: true,
    },
    {
      category: "Target Hold Period (Years)",
      inputType: "select",
      field: "target_hold_period",
      placeholder: "1",
      options: targetHoldPeriodOptions,
      briefInfo: "Select the expected time frame the equity will be held before an exit event",
    },
  ];

  return (
    <div className='mb-0 w-full pb-0'>
      <h3 className='mb-7 flex items-center'>
        <Image src={"/icons/feedback.svg"} alt='feedback' width={20} height={20} className='mr-2' />
        <span className='ml-2 font-semibold text-text-muted'>4. Equity Details</span>
      </h3>

      {/* Date validation error message */}
      {dateError && (
        <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3'>
          <p className='text-sm text-red-600'>{dateError}</p>
        </div>
      )}

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
                  {item.inputType === "dual" &&
                  item.fields &&
                  "percentage" in item.fields &&
                  "amount" in item.fields ? (
                    <div className='flex gap-2'>
                      {item.isReadOnly ? (
                        <>
                          <Input
                            type='text'
                            value={item.fields.percentage.value || item.fields.percentage.placeholder}
                            readOnly
                            className='w-1/3 bg-transparent py-6 text-sm text-text-muted shadow-none'
                          />
                          <Input
                            type='text'
                            value={item.fields.amount.value || item.fields.amount.placeholder}
                            readOnly
                            className='w-2/3 bg-transparent py-6 text-sm text-text-muted shadow-none'
                          />
                        </>
                      ) : (
                        <>
                          <PercentageInput
                            value={value[item.fields.percentage.field as keyof EquityDetailsData] || ""}
                            onChange={(newValue) =>
                              handleInputChange(item.fields.percentage.field as keyof EquityDetailsData, newValue)
                            }
                            placeholder={item.fields.percentage.placeholder}
                            className='h-[51px] w-1/2 bg-transparent text-xs shadow-none placeholder:text-xs'
                          />
                          <CurrencyInput
                            value={value[item.fields.amount.field as keyof EquityDetailsData] || ""}
                            onChange={(newValue) =>
                              handleInputChange(item.fields.amount.field as keyof EquityDetailsData, newValue)
                            }
                            placeholder={item.fields.amount.placeholder}
                            className='h-[51px] w-1/2 bg-transparent text-xs shadow-none placeholder:text-xs'
                          />
                        </>
                      )}
                    </div>
                  ) : item.isReadOnly || item.inputType === "calculated" ? (
                    <Input
                      type='text'
                      value={item.placeholder}
                      readOnly
                      className='w-full bg-transparent py-6 text-sm text-text-muted shadow-none'
                    />
                  ) : item.inputType === "text" && item.field ? (
                    <Input
                      type='text'
                      placeholder={item.placeholder}
                      value={value[item.field as keyof EquityDetailsData] || ""}
                      onChange={(e) => handleInputChange(item.field as keyof EquityDetailsData, e.target.value)}
                      className='h-[51px] w-full text-xs shadow-none placeholder:text-xs'
                    />
                  ) : item.inputType === "currency" && item.field ? (
                    <CurrencyInput
                      value={value[item.field as keyof EquityDetailsData] || ""}
                      onChange={(value) => handleInputChange(item.field as keyof EquityDetailsData, value)}
                      placeholder={item.placeholder}
                      className='h-[51px] w-full bg-transparent text-xs shadow-none placeholder:text-xs'
                    />
                  ) : item.inputType === "percentage" && item.field ? (
                    <PercentageInput
                      value={value[item.field as keyof EquityDetailsData] || ""}
                      onChange={(value) => handleInputChange(item.field as keyof EquityDetailsData, value)}
                      placeholder={item.placeholder}
                      className='h-[51px] w-full bg-transparent text-xs shadow-none placeholder:text-xs'
                    />
                  ) : item.inputType === "date-picker" && item.field ? (
                    <Input
                      type='date'
                      placeholder={item.placeholder}
                      value={value[item.field as keyof EquityDetailsData] || ""}
                      onChange={(e) => handleInputChange(item.field as keyof EquityDetailsData, e.target.value)}
                      className={`h-[51px] w-full text-xs shadow-none placeholder:text-xs md:text-xs ${
                        dateError && (item.field === "target_distribution_start" || item.field === "exit_date")
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                  ) : (item as SingleTableDataItem).field ? (
                    <Select
                      value={value[(item as SingleTableDataItem).field as keyof EquityDetailsData] || ""}
                      onValueChange={(selectedValue) =>
                        handleInputChange((item as SingleTableDataItem).field as keyof EquityDetailsData, selectedValue)
                      }
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
                  ) : null}
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
