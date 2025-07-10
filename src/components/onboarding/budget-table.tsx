import React from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Info } from "lucide-react";

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
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='w-1/4 border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>
                Line Item
              </th>
              <th className='w-1/4 border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>
                <div className='flex items-center space-x-2'>
                  <span>Description</span>
                  <Info className='h-4 w-4 text-gray-400' />
                </div>
              </th>
              <th className='w-1/4 border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>
                Scope of Work
              </th>
              <th className='w-1/4 border border-gray-200 p-4 text-left text-sm font-medium text-gray-700'>$ Budget</th>
            </tr>
          </thead>
          <tbody>
            {budgetLineItems.map((lineItem, index) => (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-700'>{lineItem}</td>
                <td className='border border-gray-200 p-4'>
                  <Textarea
                    placeholder='Enter description...'
                    value={value[lineItem]?.description || ""}
                    onChange={(e) => handleInputChange(lineItem, "description", e.target.value)}
                    className='min-h-[80px] w-full resize-y'
                  />
                </td>
                <td className='border border-gray-200 p-4'>
                  <Textarea
                    placeholder='Enter scope of work...'
                    value={value[lineItem]?.scope || ""}
                    onChange={(e) => handleInputChange(lineItem, "scope", e.target.value)}
                    className='min-h-[80px] w-full resize-y'
                  />
                </td>
                <td className='border border-gray-200 p-4'>
                  <Input
                    type='text'
                    placeholder='$0.00'
                    value={value[lineItem]?.budget || ""}
                    onChange={(e) => handleInputChange(lineItem, "budget", e.target.value)}
                    className='w-full'
                  />
                </td>
              </tr>
            ))}

            {/* Total Construction Cost Row */}
            <tr className='bg-gray-100 font-semibold'>
              <td className='border border-gray-200 p-4 text-sm font-bold text-gray-900' colSpan={3}>
                Total Construction Cost
              </td>
              <td className='border border-gray-200 p-4 text-sm font-bold text-gray-900'>
                ${calculateTotalCost().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTable;
