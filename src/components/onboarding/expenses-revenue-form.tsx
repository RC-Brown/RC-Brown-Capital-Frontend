import React, { useState, useMemo } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { CurrencyInput } from "./currency-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";

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
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clip-path='url(#clip0_1948_3213)'>
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
            <clipPath id='clip0_1948_3213'>
              <rect width='24' height='24' fill='white' />
            </clipPath>
          </defs>
        </svg>

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
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Management</label>
          <CurrencyInput
            value={value.management || ""}
            onChange={(value) => handleInputChange("management", value)}
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
          <label className='text-sm font-normal -tracking-[3%] text-text-muted'>Insurance</label>
          <CurrencyInput
            value={value.insurance || ""}
            onChange={(value) => handleInputChange("insurance", value)}
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
