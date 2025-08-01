import React, { useState, useMemo } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { CurrencyInput } from "./currency-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import Image from "next/image";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<AdditionalExpense>({ name: "", amount: "" });

  // Helper function to parse currency values
  const parseCurrencyValue = (value: string): number => {
    if (!value || value.trim() === "") return 0;
    // Remove currency symbols, commas, and spaces, then parse as float
    const cleanValue = value.replace(/[$,£€¥₹\s]/g, "");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to calculate total expense
  const calculateTotalExpense = (
    currentValue: ExpensesRevenueData,
    currentAdditionalExpenses: AdditionalExpense[]
  ): number => {
    const mainExpenses = [
      currentValue.taxes || "",
      currentValue.management || "",
      currentValue.utilities || "",
      currentValue.insurance || "",
      currentValue.repairs || "",
      currentValue.interest || "",
    ];

    const mainExpensesTotal = mainExpenses.reduce((sum, expense) => sum + parseCurrencyValue(expense), 0);

    const additionalExpensesTotal = currentAdditionalExpenses.reduce((sum, expense) => {
      return sum + parseCurrencyValue(expense.amount);
    }, 0);

    return mainExpensesTotal + additionalExpensesTotal;
  };

  // Calculate total expense automatically for display
  const totalExpense = useMemo(() => {
    return calculateTotalExpense(value, additionalExpenses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value.taxes,
    value.management,
    value.utilities,
    value.insurance,
    value.repairs,
    value.interest,
    additionalExpenses,
  ]);

  const handleInputChange = (field: string, inputValue: string) => {
    const updatedValue = { ...value, [field]: inputValue };

    // Automatically update total expense when any expense field changes
    if (field !== "totalExpense") {
      const newTotal = calculateTotalExpense(updatedValue, additionalExpenses);
      updatedValue.totalExpense = newTotal.toFixed(2);
    }

    onChange?.(updatedValue);
  };

  const handleAddExpense = () => {
    if (newExpense.name.trim() && newExpense.amount.trim()) {
      const updatedExpenses = [...additionalExpenses, { ...newExpense }];
      setAdditionalExpenses(updatedExpenses);

      // Update total expense when adding new expense
      const updatedValue = { ...value, additionalExpenses: updatedExpenses };
      const newTotal = calculateTotalExpense(updatedValue, updatedExpenses);
      updatedValue.totalExpense = newTotal.toFixed(2);

      onChange?.(updatedValue);
      setNewExpense({ name: "", amount: "" });
      setIsModalOpen(false);
    }
  };

  const handleExpenseChange = (index: number, field: keyof AdditionalExpense, inputValue: string) => {
    const updatedExpenses = [...additionalExpenses];
    updatedExpenses[index][field] = inputValue;
    setAdditionalExpenses(updatedExpenses);

    // Update total expense when additional expense changes
    const updatedValue = { ...value, additionalExpenses: updatedExpenses };
    const newTotal = calculateTotalExpense(updatedValue, updatedExpenses);
    updatedValue.totalExpense = newTotal.toFixed(2);

    onChange?.(updatedValue);
  };

  const handleRemoveExpense = (index: number) => {
    const updatedExpenses = additionalExpenses.filter((_, i) => i !== index);
    setAdditionalExpenses(updatedExpenses);

    // Update total expense when removing expense
    const updatedValue = { ...value, additionalExpenses: updatedExpenses };
    const newTotal = calculateTotalExpense(updatedValue, updatedExpenses);
    updatedValue.totalExpense = newTotal.toFixed(2);

    onChange?.(updatedValue);
  };

  const openModal = () => {
    setNewExpense({ name: "", amount: "" });
    setIsModalOpen(true);
  };

  return (
    <div className='mb-6 w-full rounded-lg border border-gray-200 bg-white p-6'>
      <div className='mb-5 flex items-center gap-2'>
        <Image src='/icons/feedback.svg' alt='feedback icon' width={24} height={24} />

        <h3 className='font-semibold text-text-muted'>3. Expenses</h3>
      </div>

      {/* Main Fields Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Taxes</label>
          <CurrencyInput
            value={value.taxes || ""}
            onChange={(value) => handleInputChange("taxes", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Insurance</label>
          <CurrencyInput
            value={value.insurance || ""}
            onChange={(value) => handleInputChange("insurance", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Management</label>
          <CurrencyInput
            value={value.management || ""}
            onChange={(value) => handleInputChange("management", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Repairs</label>
          <CurrencyInput
            value={value.repairs || ""}
            onChange={(value) => handleInputChange("repairs", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Utilities</label>
          <CurrencyInput
            value={value.utilities || ""}
            onChange={(value) => handleInputChange("utilities", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Interest</label>
          <CurrencyInput
            value={value.interest || ""}
            onChange={(value) => handleInputChange("interest", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Total Expense</label>
          <CurrencyInput
            value={totalExpense.toFixed(2)}
            onChange={() => {}} // No-op function since this is auto-calculated
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 bg-gray-50 shadow-none'
          />
        </div>

        <div>
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Total Rental Income</label>
          <CurrencyInput
            value={value.totalRentalIncome || ""}
            onChange={(value) => handleInputChange("totalRentalIncome", value)}
            placeholder=''
            className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
          />
        </div>

        {/* Additional Expense Button - Positioned in the right column */}
        <div className='col-span-2 grid grid-cols-2 items-end justify-end gap-6'>
          <div></div>
          <Button type='button' onClick={openModal} className='h-[51px] w-full text-sm font-semibold'>
            Additional Expense
            <Plus className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Additional Expenses Display */}
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
                  className='mt-3 h-[51px] w-full rounded-md border-black/10 shadow-none'
                />
                <div className='flex gap-2'>
                  <CurrencyInput
                    value={expense.amount || ""}
                    onChange={(value) => handleExpenseChange(index, "amount", value)}
                    placeholder=''
                    className='mt-3 h-[51px] flex-1 rounded-md border-black/10 shadow-none'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => handleRemoveExpense(index)}
                    className='mt-3 h-[51px] px-3 text-red-500 hover:text-red-700'
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Expense Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-xl rounded-2xl bg-white p-6'>
          <DialogHeader>
            <DialogTitle className='pt-5 text-center text-2xl font-semibold text-primary'>
              Additional Expense
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <label className='w-1/3 text-sm font-normal text-text-muted'>Expense Name</label>
              <Input
                type='text'
                placeholder='Enter expense name'
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                className='mt-2 h-[51px] w-full flex-1 rounded-md border-black/10 shadow-none'
              />
            </div>

            <div className='flex items-center gap-4'>
              <label className='w-1/3 text-sm font-normal text-text-muted'>Amount</label>
              <CurrencyInput
                value={newExpense.amount}
                onChange={(value) => setNewExpense({ ...newExpense, amount: value })}
                placeholder=''
                className='mt-2 flex h-[51px] !w-full flex-1 rounded-md border-black/10 shadow-none'
              />
            </div>
          </div>

          <div className='mt-6 flex justify-center'>
            <Button
              type='button'
              onClick={handleAddExpense}
              className='h-[51px] px-8 text-sm font-semibold'
              disabled={!newExpense.name.trim() || !newExpense.amount.trim()}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesRevenueForm;
