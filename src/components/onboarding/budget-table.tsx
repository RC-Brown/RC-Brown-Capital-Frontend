import React from "react";
import { Textarea } from "@/src/components/ui/textarea";
import { Tooltip } from "../ui/tooltip";
import { CurrencyInput } from "./currency-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";

interface BudgetLineItem {
  description?: string;
  scope?: string;
  budget?: string;
}

interface BudgetTableData {
  [lineItemName: string]: BudgetLineItem;
}

interface BudgetTableProps {
  value?: BudgetTableData;
  onChange?: (value: BudgetTableData) => void;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ value = {}, onChange }) => {
  const { formatCurrency, currencySymbol } = useCurrencySafe();

  const handleInputChange = (lineItem: string, field: string, inputValue: string) => {
    const updatedValue = {
      ...value,
      [lineItem]: {
        ...value[lineItem],
        [field]: inputValue,
      },
    };
    onChange?.(updatedValue);
  };

  //   const filledItems = budgetLineItems.filter((item) => {
  //     const itemData = value[item];
  //     return (
  //       itemData &&
  //       itemData.budget &&
  //       itemData.budget.trim() !== "" &&
  //       itemData.description &&
  //       itemData.description.trim() !== ""
  //     );
  //   });
  //   return filledItems.length >= 3;
  // };

  const budgetLineItems = [
    "New Drywall Installation",
    "Rough Framing Completion",
    "Rough Electrical Completion",
    "Roofing",
    "Finish Electrical",
    "HVAC Installation",
    "Insulation",
    "Rough Plumbing",
    "Plumbing Finish & Fixtures",
    "Foundation Reinforcement & Waterproofing",
    "Interior Paint",
    "Laminate Flooring",
    "Wood Fencing",
    "Architectural/Structural & City Fees",
    "Wood Fencing",
    "Countertops & Backsplashes",
    "Laundry",
    "Kitchen Appliances",
    "Interior Trim Carpentry",
    "Stucco",
    "Door Replacement",
    "Patios and Decks",
    "Tiling Work",
    "Cabinets",
    "Tankless Hot Water Heater",
    "Debris Hauling & Cleanup",
    "Window Repairs & Replacements",
  ];

  const calculateTotalCost = () => {
    let total = 0;
    budgetLineItems.forEach((item) => {
      const budget = value[item]?.budget || "";
      const numericValue = parseFloat(budget.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(numericValue)) {
        total += numericValue;
      }
    });
    return total;
  };

  return (
    <div className='w-full'>
      <div className=''>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-background-secondary'>
              <th className='w-1/4 border border-black/10 p-4 text-left text-sm font-medium text-text-muted'>
                Line Item
              </th>
              <th className='w-[35%] border border-black/10 p-4 text-left text-sm font-medium text-text-muted'>
                <Tooltip content='Please go into detail about the materials being used, if this is a repair or a replacement, and quantities.  The more details the better, sell it to the inspector.'>
                  <span>Description</span>
                </Tooltip>
              </th>
              <th className='w-1/4 border border-black/10 p-4 text-left text-sm font-medium text-text-muted'>
                Scope of Work
              </th>
              <th className='w-[15%] border border-black/10 p-4 text-left text-sm font-medium text-text-muted'>
                {currencySymbol} Budget
              </th>
            </tr>
          </thead>
          <tbody>
            {budgetLineItems.map((lineItem, index) => (
              <tr key={index} className=''>
                <td className='border border-black/10 bg-background-secondary p-4 text-xs text-text-muted'>
                  {lineItem}
                </td>
                <td className='border border-black/10 p-1'>
                  <Textarea
                    placeholder='Enter description...'
                    value={value[lineItem]?.description || ""}
                    onChange={(e) => handleInputChange(lineItem, "description", e.target.value)}
                    className='min-h-[80px] w-full resize-y border-none text-xs text-text-muted shadow-none placeholder:text-xs'
                  />
                </td>
                <td className='border border-black/10 p-1'>
                  <Textarea
                    placeholder='Enter scope of work...'
                    value={value[lineItem]?.scope || ""}
                    onChange={(e) => handleInputChange(lineItem, "scope", e.target.value)}
                    className='min-h-[80px] w-full resize-y border-none text-xs text-text-muted shadow-none placeholder:text-xs'
                  />
                </td>
                <td className='border border-black/10 p-1'>
                  <CurrencyInput
                    value={value[lineItem]?.budget || ""}
                    onChange={(value) => handleInputChange(lineItem, "budget", value)}
                    placeholder='0.00'
                    className='w-full border-none text-xs text-text-muted shadow-none placeholder:text-xs'
                  />
                </td>
              </tr>
            ))}

            {/* Total Construction Cost Row */}
            <tr className='bg-background-secondary font-medium'>
              <td className='border border-black/10 p-4 text-sm font-medium text-text-muted' colSpan={3}>
                Total Construction Cost
              </td>
              <td className='border border-black/10 p-4 text-sm font-medium text-text-muted'>
                {formatCurrency(
                  calculateTotalCost().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTable;
