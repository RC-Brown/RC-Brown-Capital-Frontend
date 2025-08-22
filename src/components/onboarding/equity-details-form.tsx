import React, { useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";
import { useOnboardingStoreWithUser } from "@/src/lib/store/onboarding-store";
import { getFormNumbering } from "@/src/lib/utils/onboarding-field-mapping";
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
  validation?: () => string | null;
  minVsMaxValidation?: () => string | null;
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
  const { formData } = useOnboardingStoreWithUser();

  // Get dynamic numbering based on what's currently visible
  const formNumber = getFormNumbering("equity_details_form", formData.what_are_you_offering as string | undefined);

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

      // Format as DD/MM/YYYY
      const day = exitDate.getDate().toString().padStart(2, "0");
      const month = (exitDate.getMonth() + 1).toString().padStart(2, "0");
      const year = exitDate.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error calculating exit date:", error);
      return "Calculation error";
    }
  };

  // Calculate ROI percentages based on shared store data
  const calculateROIPercentages = () => {
    // Get data from other forms via shared store
    const offerDetailsData = formData.offer_details_table as Record<string, unknown> | undefined;
    const expensesRevenueData = formData.expenses_revenue_form as Record<string, unknown> | undefined;

    // Extract required values with proper type casting (fixed field names)
    const totalCapitalRequired = parseFloat(String(offerDetailsData?.total_capitalization || "0"));
    const equityAllocationPercentage = parseFloat(String(offerDetailsData?.equity_allocation || "0")); // This is the equity allocation percentage from offers details

    // Calculate the actual dollar amount of equity allocation for ROI calculations
    const totalEquityAllocation = (equityAllocationPercentage / 100) * totalCapitalRequired;

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
      equityAllocationPercentage: equityAllocationPercentage,
      equityAllocationAmount: totalEquityAllocation,
    };

    if (totalEquityAllocation > 0 && minInvestment > 0) {
      // Step 1: Calculate percentage of equity invested for minimum investment
      const minEquityPercent = (minInvestment / totalEquityAllocation) * 100;

      // Step 2: Calculate Y = total rental income + total equity appreciation
      const Y = totalRentalIncome + totalEquityAppreciation;

      // Step 3: Calculate expected min return = [(min percentage of equity invested / 100) × Y] - total expenses
      const minROIValue = (minEquityPercent / 100) * Y - totalExpenses;

      // Store monetary value
      calculations.minROIAmount = minROIValue;

      // Step 4: Calculate ROI percentage = (expected min return / min investment) × 100
      calculations.minROIPercentage = (minROIValue / minInvestment) * 100;
    }

    if (totalEquityAllocation > 0 && maxInvestment > 0) {
      // Step 1: Calculate percentage of equity invested for maximum investment
      const maxEquityPercent = (maxInvestment / totalEquityAllocation) * 100;

      // Step 2: Calculate Y = total rental income + total equity appreciation
      const Y = totalRentalIncome + totalEquityAppreciation;

      // Step 3: Calculate expected max return = [(max percentage of equity invested / 100) × Y] - total expenses
      const maxROIValue = (maxEquityPercent / 100) * Y - totalExpenses;

      // Store monetary value
      calculations.maxROIAmount = maxROIValue;

      // Step 4: Calculate ROI percentage = (expected max return / max investment) × 100
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

    // No need to validate dates since exit date is now calculated
    onChange?.(newValue);
  };

  // Validate maximum investment amount against equity allocation
  const validateMaxInvestmentAmount = (): string | null => {
    const maxInvestment = parseFloat(value.maximum_investment || "0");
    const equityAllocation = equityAllocationAmount;

    if (maxInvestment > 0 && equityAllocation > 0 && maxInvestment > equityAllocation) {
      return `Maximum investment cannot exceed the total equity allocation (${formatCurrency(equityAllocation.toString())})`;
    }
    return null;
  };

  // Validate minimum investment amount against equity allocation
  const validateMinInvestmentAmount = (): string | null => {
    const minInvestment = parseFloat(value.minimum_investment || "0");
    const equityAllocation = equityAllocationAmount;

    if (minInvestment > 0 && equityAllocation > 0 && minInvestment > equityAllocation) {
      return `Minimum investment cannot exceed the total equity allocation (${formatCurrency(equityAllocation.toString())})`;
    }
    return null;
  };

  // Validate minimum investment amount against maximum investment amount
  const validateMinVsMaxInvestment = (): string | null => {
    const minInvestment = parseFloat(value.minimum_investment || "0");
    const maxInvestment = parseFloat(value.maximum_investment || "0");

    if (minInvestment > 0 && maxInvestment > 0 && minInvestment > maxInvestment) {
      return `Minimum investment cannot exceed maximum investment amount`;
    }
    return null;
  };

  // Remove the validateDates function since it's no longer needed

  // Update exit date calculation when dependent fields change
  useEffect(() => {
    // Force re-render to update calculated exit date
    // The calculateExitDate function will be called on each render
  }, [value.target_distribution_start, value.target_hold_period]);

  const distributionFrequencyOptions = [
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

  const tableData: TableDataItem[] = [
    {
      category: "Equity Allocation",
      inputType: "dual",
      fields: {
        percentage: {
          field: "equity_allocation_percentage",
          placeholder: equityAllocationPercentage
            ? `${equityAllocationPercentage % 1 === 0 ? equityAllocationPercentage : equityAllocationPercentage.toFixed(2)}%`
            : "0%",
          value: equityAllocationPercentage
            ? `${equityAllocationPercentage % 1 === 0 ? equityAllocationPercentage : equityAllocationPercentage.toFixed(2)}%`
            : "0%",
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
      category: "Target Hold Period (Years)",
      inputType: "select",
      field: "target_hold_period",
      placeholder: "1",
      options: targetHoldPeriodOptions,
      briefInfo: "Select the expected time frame the equity will be held before an exit event",
    },
    {
      category: "Target Distribution Start",
      inputType: "date-picker",
      field: "target_distribution_start",
      placeholder: "(DD/MM/YY)",
      briefInfo: "Enter the date when equity return distributions are expected to begin",
    },
    {
      category: `Maximum Investment (${formatCurrency("")})`,
      inputType: "currency",
      field: "maximum_investment",
      placeholder: "",
      briefInfo: "Enter the highest amount a single investor is allowed to invest in equity",
      validation: validateMaxInvestmentAmount,
    },
    {
      category: `Minimum Investment (${formatCurrency("")})`,
      inputType: "currency",
      field: "minimum_investment",
      placeholder: "",
      briefInfo: "Enter the lowest amount an investor can contribute toward the equity portion of this deal.",
      validation: validateMinInvestmentAmount,
      minVsMaxValidation: validateMinVsMaxInvestment,
    },
    {
      category: "Exit Date",
      inputType: "calculated",
      field: "exit_date",
      placeholder: calculateExitDate(),
      briefInfo: "The projected date when the investment will end and equity will be returned to investors",
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
          placeholder: `${minROIPercentage % 1 === 0 ? minROIPercentage : minROIPercentage.toFixed(2)}%`,
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
          placeholder: `${maxROIPercentage % 1 === 0 ? maxROIPercentage : maxROIPercentage.toFixed(2)}%`,
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
  ];

  return (
    <div className='mb-0 w-full pb-0'>
      <h3 className='mb-7 flex items-center'>
        <Image src={"/icons/feedback.svg"} alt='feedback' width={20} height={20} className='mr-2' />
        <span className='ml-2 font-semibold text-text-muted'>{formNumber}. Equity Details</span>
      </h3>

      {/* Remove the date validation error message section */}
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
                    <div>
                      <CurrencyInput
                        value={value[item.field as keyof EquityDetailsData] || ""}
                        onChange={(value) => handleInputChange(item.field as keyof EquityDetailsData, value)}
                        placeholder={item.placeholder}
                        className='h-[51px] w-full bg-transparent text-xs shadow-none placeholder:text-xs'
                      />
                      {item.validation && item.validation() && (
                        <p className='mt-1 text-xs text-red-500'>{item.validation()}</p>
                      )}
                      {item.minVsMaxValidation && item.minVsMaxValidation() && (
                        <p className='mt-1 text-xs text-red-500'>{item.minVsMaxValidation()}</p>
                      )}
                    </div>
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
                      className={`h-[51px] w-full text-xs shadow-none placeholder:text-xs md:text-xs`}
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
