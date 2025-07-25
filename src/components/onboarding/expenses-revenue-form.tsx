import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { CurrencyInput } from "./currency-input";

interface AdditionalExpense {
  name: string;
  amount: string;
}

interface ExpensesRevenueData {
  taxes?: string;
  management?: string;
  utilities?: string;
  totalExpense?: string;
  totalEquityAppreciation?: string;
  insurance?: string;
  repairs?: string;
  interest?: string;
  totalRentalIncome?: string;
  additionalExpenses?: AdditionalExpense[];
  [key: string]: string | AdditionalExpense[] | undefined;
}

interface ExpensesRevenueFormProps {
  value?: ExpensesRevenueData;
  onChange?: (value: ExpensesRevenueData) => void;
}

const ExpensesRevenueForm: React.FC<ExpensesRevenueFormProps> = ({ value = {}, onChange }) => {
  const [additionalExpenses, setAdditionalExpenses] = useState<AdditionalExpense[]>(value.additionalExpenses || []);

  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  //   const requiredFields = [
  //     "taxes",
  //     "management",
  //     "utilities",
  //     "totalExpense",
  //     "totalEquityAppreciation",
  //     "insurance",
  //     "repairs",
  //     "interest",
  //     "totalRentalIncome",
  //   ];
  //   return requiredFields.every((field) => value[field] && value[field].trim() !== "");
  // };

  const handleAddExpense = () => {
    const newExpense: AdditionalExpense = { name: "", amount: "" };
    const updatedExpenses = [...additionalExpenses, newExpense];
    setAdditionalExpenses(updatedExpenses);
    onChange?.({ ...value, additionalExpenses: updatedExpenses });
  };

  const handleExpenseChange = (index: number, field: keyof AdditionalExpense, inputValue: string) => {
    const updatedExpenses = [...additionalExpenses];
    updatedExpenses[index][field] = inputValue;
    setAdditionalExpenses(updatedExpenses);
    onChange?.({ ...value, additionalExpenses: updatedExpenses });
  };

  return (
    <div className='mb-6 w-full rounded-lg border border-gray-200 bg-white p-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Left Column */}
        <div className='space-y-6'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Taxes <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.taxes || ""}
              onChange={(value) => handleInputChange("taxes", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Management <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.management || ""}
              onChange={(value) => handleInputChange("management", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Utilities <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.utilities || ""}
              onChange={(value) => handleInputChange("utilities", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Total Expense <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.totalExpense || ""}
              onChange={(value) => handleInputChange("totalExpense", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Total Equity Appreciation <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.totalEquityAppreciation || ""}
              onChange={(value) => handleInputChange("totalEquityAppreciation", value)}
              placeholder=''
              className='w-full'
            />
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Insurance <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.insurance || ""}
              onChange={(value) => handleInputChange("insurance", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Repairs <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.repairs || ""}
              onChange={(value) => handleInputChange("repairs", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Interest <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.interest || ""}
              onChange={(value) => handleInputChange("interest", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Total Rental Income <span className='text-red-500'>*</span>
            </label>
            <CurrencyInput
              value={value.totalRentalIncome || ""}
              onChange={(value) => handleInputChange("totalRentalIncome", value)}
              placeholder=''
              className='w-full'
            />
          </div>

          <div>
            <Button
              type='button'
              onClick={handleAddExpense}
              className='w-full bg-blue-900 text-white hover:bg-blue-800'
            >
              <Plus className='mr-2 h-4 w-4' />
              Additional Expense
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Expenses */}
      {additionalExpenses.length > 0 && (
        <div className='mt-6 border-t border-gray-200 pt-6'>
          <h3 className='mb-4 text-sm font-medium text-gray-700'>Additional Expenses</h3>
          <div className='space-y-4'>
            {additionalExpenses.map((expense: AdditionalExpense, index: number) => (
              <div key={index} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Input
                  type='text'
                  placeholder='Expense name'
                  value={expense.name || ""}
                  onChange={(e) => handleExpenseChange(index, "name", e.target.value)}
                  className='w-full'
                />
                <CurrencyInput
                  value={expense.amount || ""}
                  onChange={(value) => handleExpenseChange(index, "amount", value)}
                  placeholder=''
                  className='w-full'
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesRevenueForm;
