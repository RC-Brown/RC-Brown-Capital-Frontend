import React from "react";
import { Textarea } from "@/src/components/ui/textarea";
import { Tooltip } from "../ui/tooltip";
import { CurrencyInput } from "./currency-input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

  const [budgetLineItems, setBudgetLineItems] = React.useState([
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
    "Contingency",
  ]);

  const [customItemIndices, setCustomItemIndices] = React.useState<Set<number>>(new Set());
  const [editingItem, setEditingItem] = React.useState<{ index: number; value: string } | null>(null);
  const [contingencyPercentage, setContingencyPercentage] = React.useState("5");

  const addNewRow = () => {
    const newItemName = `Enter Item name`;
    const newIndex = budgetLineItems.length;
    setBudgetLineItems([...budgetLineItems, newItemName]);
    setCustomItemIndices((prev) => new Set([...prev, newIndex]));
  };

  const removeRow = (index: number) => {
    const itemToRemove = budgetLineItems[index];
    setBudgetLineItems(budgetLineItems.filter((_, i) => i !== index));

    // Remove the index from custom items and adjust other indices
    setCustomItemIndices((prev) => {
      const newSet = new Set<number>();
      prev.forEach((customIndex) => {
        if (customIndex < index) {
          newSet.add(customIndex);
        } else if (customIndex > index) {
          newSet.add(customIndex - 1);
        }
      });
      return newSet;
    });

    // Remove the data for this item from the value object
    if (value[itemToRemove]) {
      const updatedValue = { ...value };
      delete updatedValue[itemToRemove];
      onChange?.(updatedValue);
    }
  };

  const startEditing = (index: number) => {
    setEditingItem({ index, value: budgetLineItems[index] });
  };

  const saveEdit = () => {
    if (editingItem) {
      const oldName = budgetLineItems[editingItem.index];
      const newItems = [...budgetLineItems];
      newItems[editingItem.index] = editingItem.value;
      setBudgetLineItems(newItems);

      // Update the data key if this item has existing data
      if (value[oldName]) {
        const updatedValue = { ...value };
        updatedValue[editingItem.value] = updatedValue[oldName];
        delete updatedValue[oldName];
        onChange?.(updatedValue);
      }
    }
    setEditingItem(null);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the related target is the remove button
    const target = e.relatedTarget as HTMLElement;
    if (target && target.closest('button[title="Remove this line item"]')) {
      return; // Don't save if clicking the remove button
    }
    saveEdit();
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const updateEditingValue = (value: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, value });
    }
  };

  const isCustomItem = (index: number) => {
    return customItemIndices.has(index);
  };

  const isContingencyItem = (lineItem: string) => {
    return lineItem === "Contingency";
  };

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

  const contingencyOptions = [
    { value: "1", label: "1%" },
    { value: "2", label: "2%" },
    { value: "3", label: "3%" },
    { value: "4", label: "4%" },
    { value: "5", label: "5%" },
    { value: "6", label: "6%" },
    { value: "7", label: "7%" },
    { value: "8", label: "8%" },
    { value: "9", label: "9%" },
    { value: "10", label: "10%" },
    { value: "11", label: "11%" },
    { value: "12", label: "12%" },
    { value: "13", label: "13%" },
    { value: "14", label: "14%" },
    { value: "15", label: "15%" },
    { value: "16", label: "16%" },
    { value: "17", label: "17%" },
    { value: "18", label: "18%" },
    { value: "19", label: "19%" },
    { value: "20", label: "20%" },
  ];

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
                  <div className='flex items-center justify-between'>
                    {isCustomItem(index) ? (
                      editingItem?.index === index ? (
                        <div className='flex w-full items-center gap-2'>
                          <input
                            type='text'
                            value={editingItem.value}
                            onChange={(e) => updateEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveEdit();
                              } else if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            onBlur={handleBlur}
                            className='w-full bg-transparent text-xs text-text-muted outline-none'
                            placeholder='Enter line item name...'
                            autoFocus
                          />
                          <button
                            onClick={cancelEdit}
                            className='rounded p-1 text-gray-500 hover:bg-gray-100'
                            title='Cancel edit'
                          >
                            <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span onClick={() => startEditing(index)} className='cursor-pointer hover:text-blue-600'>
                          {lineItem}
                        </span>
                      )
                    ) : (
                      <span>{lineItem}</span>
                    )}
                    {isCustomItem(index) && editingItem?.index !== index && (
                      <button
                        onClick={() => removeRow(index)}
                        className='ml-2 rounded p-1 text-red-500 hover:bg-red-50'
                        title='Remove this line item'
                      >
                        <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </button>
                    )}
                  </div>
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
                  {isContingencyItem(lineItem) ? (
                    <div className='flex items-center justify-center'>
                      {/* <select
                        value={contingencyPercentage}
                        onChange={(e) => setContingencyPercentage(e.target.value)}
                        className='w-full border-none bg-transparent text-xs text-text-muted outline-none'
                      >
                        <option value='3'>3%</option>
                        <option value='5'>5%</option>
                        <option value='7'>7%</option>
                        <option value='10'>10%</option>
                        <option value='15'>15%</option>
                        <option value='20'>20%</option>
                      </select> */}
                      <Select
                        value={contingencyPercentage}
                        onValueChange={(selectedValue) => setContingencyPercentage(selectedValue)}
                      >
                        <SelectTrigger className='border-none py-6 text-xs text-text-muted/80 shadow-none placeholder:text-xs data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'>
                          <SelectValue
                            placeholder='%'
                            className='text-xs font-normal placeholder:text-xs data-[placeholder]:text-xs'
                          />
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {contingencyOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className='cursor-pointer hover:bg-primary hover:text-white'
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <CurrencyInput
                      value={value[lineItem]?.budget || ""}
                      onChange={(value) => handleInputChange(lineItem, "budget", value)}
                      placeholder='0.00'
                      className='w-full border-none text-xs text-text-muted shadow-none placeholder:text-xs'
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Total Construction Cost - Outside Table */}
        <div className='flex w-full justify-end'>
          <div className='flex w-[45%] items-center font-medium'>
            <div className='flex w-[67%] items-center justify-center bg-background-secondary py-5 text-right text-sm font-medium text-text-muted'>
              Total Construction Cost
            </div>
            <div className='flex w-[33%] items-center justify-center border border-l-0 border-t-0 border-black/10 py-5 text-sm font-medium text-text-muted'>
              {formatCurrency(
                calculateTotalCost().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              )}
            </div>
          </div>
        </div>

        {/* Add Row Button */}
        <div className='flex'>
          <button
            onClick={addNewRow}
            className='flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-text-muted'
          >
            <PlusIcon className='size-4 stroke-[2.5px] text-text-muted' />
            Add New Line Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetTable;
