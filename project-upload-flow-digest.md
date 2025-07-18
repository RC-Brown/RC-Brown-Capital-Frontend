# onboarding/acknowledge-sign-docs.tsx

```tsx
import React from "react";
import { Button } from "@/src/components/ui/button";
import { Download, Paperclip } from "lucide-react";

interface DocumentAcknowledgment {
  acknowledged?: boolean;
  documentDownloaded?: boolean;
  signedDocumentFile?: File | null;
}

interface AcknowledgeSignDocsProps {
  value?: DocumentAcknowledgment;
  onChange?: (value: DocumentAcknowledgment) => void;
}

const AcknowledgeSignDocs: React.FC<AcknowledgeSignDocsProps> = () =>
  // { value, onChange }
  {
    const handleDownloadDocument = () => {
      // Download document logic
    };

    const handleReattachDocument = () => {
      // Reattach document logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Acknowledge & Sign Docs</h3>

          <p className='mb-6 text-sm leading-relaxed text-gray-600'>
            Please review and accept all acknowledgements and disclaimers. After completing the form, you will be
            required to download and sign the necessary document(s), then reattach the signed copy to finalize your
            submission
          </p>

          <div className='flex flex-col gap-4 sm:flex-row'>
            <Button
              type='button'
              onClick={handleDownloadDocument}
              className='flex items-center space-x-2 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
            >
              <Download className='h-4 w-4' />
              <span>Download document</span>
            </Button>

            <Button
              type='button'
              onClick={handleReattachDocument}
              variant='outline'
              className='flex items-center space-x-2 rounded-md border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50'
            >
              <Paperclip className='h-4 w-4' />
              <span>Reattach document</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

export default AcknowledgeSignDocs;

```

# onboarding/address-input.tsx

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface AddressInputProps {
  value?: {
    address: string;
    useCompanyAddress: boolean;
  };
  onChange: (value: { address: string; useCompanyAddress: boolean }) => void;
}

export function AddressInput({ value = { address: "", useCompanyAddress: false }, onChange }: AddressInputProps) {
  const [addressData, setAddressData] = useState(value);

  const handleAddressChange = (address: string) => {
    const newData = { ...addressData, address };
    setAddressData(newData);
    onChange(newData);
  };

  //   return addressData.address.trim().length >= 5;
  // };

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <MapPinIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/80' />
        <Input
          placeholder='Company address'
          value={addressData.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          className='pl-10 text-sm'
        />
      </div>
    </div>
  );
}

```

# onboarding/bank-terms-checkbox.tsx

```tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

interface BankTermsCheckboxProps {
  value?: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function BankTermsCheckbox({ value = false, onChange, error }: BankTermsCheckboxProps) {
  const [isChecked, setIsChecked] = useState(value);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    onChange(checked);
  };

  return (
    <div className='space-y-2'>
      <div className='flex max-w-[300px] items-start space-x-2'>
        <Checkbox
          id='bank-terms'
          checked={isChecked}
          onCheckedChange={handleChange}
          className={cn(error && "border-red-500", "mt-1 size-3 text-white")}
        />
        <Label htmlFor='bank-terms' className='cursor-pointer text-xs font-normal leading-relaxed'>
          I have read accept the{" "}
          <a
            href='/terms'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            terms and conditions
          </a>{" "}
          and{" "}
          <a
            href='/privacy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            Privacy Policy
          </a>
        </Label>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/budget-table.tsx

```tsx
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

```

# onboarding/budget-tabs.tsx

```tsx
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

interface BudgetTabData {
  "property-address"?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  "description-work"?: {
    description?: string;
    workType?: string;
    specifications?: string;
  };
  "project-timeline"?: {
    startDate?: string;
    estimatedCompletion?: string;
    milestones?: string[];
  };
}

interface BudgetTabsProps {
  value?: BudgetTabData;
  onChange?: (value: BudgetTabData) => void;
}

const BudgetTabs: React.FC<BudgetTabsProps> = () =>
  // { value = {}, onChange }
  {
    const [activeTab, setActiveTab] = useState("property-address");

    const tabs = [
      {
        key: "property-address",
        label: "Property Address",
        active: activeTab === "property-address",
      },
      {
        key: "description-work",
        label: "Description of Work",
        active: activeTab === "description-work",
      },
      {
        key: "project-timeline",
        label: "Project Timeline",
        active: activeTab === "project-timeline",
      },
    ];

    return (
      <div className='mb-6 w-full'>
        <div className='flex space-x-4'>
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`flex cursor-pointer items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                tab.active
                  ? "border-gray-300 bg-gray-100 text-gray-900"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              } `}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className='text-sm font-medium'>{tab.label}</span>
              <ChevronRight className='h-4 w-4' />
            </div>
          ))}
        </div>
      </div>
    );
  };

export default BudgetTabs;

```

# onboarding/business-plan-rating.tsx

```tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Building, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BusinessPlanRatingProps {
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string;
}

const categories = [
  {
    key: "leverage",
    label: "Leverage",
    info: "Rate the use of borrowed capital in this project",
  },
  {
    key: "occupancy",
    label: "Occupancy",
    info: "Estimate expected property occupancy rate.",
  },
  {
    key: "capex_hard_cost",
    label: "Capex / Hard Cost",
    info: "Rate the capital expenditure and upfront project costs.",
  },
  {
    key: "target_noi_growth",
    label: "Target NOI Growth",
    info: "Forecast your Net Operating Income growth rate",
  },
];

const ratingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export function BusinessPlanRating({ value = {}, onChange, error }: BusinessPlanRatingProps) {
  const [ratings, setRatings] = useState<Record<string, string>>(value);

  const handleRatingChange = (category: string, rating: string) => {
    const newRatings = { ...ratings, [category]: rating };
    setRatings(newRatings);

    onChange(newRatings);
  };

  //   return categories.every((cat) => ratings[cat.key] && ratings[cat.key] !== "");
  // };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='mb-4 flex items-center space-x-3'>
        <div className='flex items-center space-x-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
            <Building className='h-3 w-3 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>1. Business Plan Rating</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-4 text-sm text-gray-600'>
        Instruction: Select the most appropriate rating level for each item below.
      </p>

      {/* Warning/Info Message */}
      <div className='mb-6 flex items-center space-x-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3'>
        <AlertCircle className='h-4 w-4 text-yellow-600' />
        <span className='text-sm text-yellow-800'>
          (A definitions document is pre-uploaded by admin and available for reference.)
        </span>
      </div>

      {/* Table */}
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
            {categories.map((category) => (
              <tr key={category.key} className='hover:bg-gray-50'>
                <td className='border border-gray-200 p-4 text-sm font-medium text-gray-700'>{category.label}</td>
                <td className='border border-gray-200 p-4'>
                  <Select
                    value={ratings[category.key] || ""}
                    onValueChange={(value) => handleRatingChange(category.key, value)}
                  >
                    <SelectTrigger className={cn("w-full", error && "border-red-500")}>
                      <SelectValue placeholder='Medium' />
                    </SelectTrigger>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className='border border-gray-200 p-4 text-sm text-gray-600'>{category.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/closing-documents.tsx

```tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ClosingDocumentsProps {
  value?: { documentType: string; file?: File };
  onChange: (value: { documentType: string; file?: File }) => void;
  error?: string;
}

const documentTypes = [
  { value: "purchase_agreement", label: "Purchase Agreement" },
  { value: "title_documents", label: "Title Documents" },
  { value: "loan_documents", label: "Loan Documents" },
  { value: "insurance_documents", label: "Insurance Documents" },
  { value: "inspection_reports", label: "Inspection Reports" },
  { value: "appraisal_report", label: "Appraisal Report" },
  { value: "other", label: "Other" },
];

export function ClosingDocuments({ value = { documentType: "" }, onChange, error }: ClosingDocumentsProps) {
  const [selectedType, setSelectedType] = useState(value.documentType);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(value.file);

  const handleTypeChange = (documentType: string) => {
    setSelectedType(documentType);
    onChange({ documentType, file: uploadedFile });
  };

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setUploadedFile(file);
  //     onChange({ documentType: selectedType, file });
  //   }
  // };

  const triggerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.[0]) {
        setUploadedFile(target.files[0]);
        onChange({ documentType: selectedType, file: target.files[0] });
      }
    };
    input.click();
  };

  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-800'>Closing Documents</h4>

      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500")}>
              <SelectValue placeholder='Closing Document Type' />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={triggerFileUpload}
          className={cn("flex items-center gap-2", uploadedFile ? "border-green-200 bg-green-50 text-green-700" : "")}
        >
          Upload
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/country-select.tsx

```tsx
"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { COUNTRY_OPTIONS } from "@/src/lib/data/countries";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  error,
  placeholder = "Select country",
  className,
}: CountrySelectProps) {
  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          error && "border-red-500",
          "text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
          className
        )}
      >
        <SelectValue
          placeholder={placeholder}
          className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
        />
      </SelectTrigger>
      <SelectContent className='max-h-60 bg-white text-text-muted/80'>
        {COUNTRY_OPTIONS.map((country) => (
          <SelectItem
            key={country.value}
            value={country.value}
            className='cursor-pointer hover:bg-primary hover:text-white'
          >
            <span className='flex items-center gap-2'>
              <span className='text-base'>{country.emoji}</span>
              <span>{country.value}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

```

# onboarding/currency-select.tsx

```tsx
"use client";

import React from "react";
import { cn } from "@/src/lib/utils";
import { CheckIcon } from "@heroicons/react/24/solid";

interface CurrencyOption {
  value: string;
  label: string;
  flag: string;
  description: string;
  disabled?: boolean;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    value: "NGN",
    label: "NGN (Nigeria Naira)",
    flag: "🇳🇬",
    description: "Nigeria Naira",
  },
  {
    value: "USD",
    label: "USD (America Dollar)",
    flag: "🇺🇸",
    description: "America Dollar",
  },
];

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function CurrencySelect({ value, onChange, error, className }: CurrencySelectProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {CURRENCY_OPTIONS.map((currency) => {
          const isSelected = value === currency.value;
          const isDisabled = currency.disabled;

          return (
            <div
              key={currency.value}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
                isSelected ? "border-green-500" : "border-red-200 hover:border-red-300",
                isDisabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => !isDisabled && onChange(currency.value)}
            >
              {/* Selection Indicator */}
              <div className='absolute left-3 top-3'>
                {isSelected ? (
                  <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-500'>
                    <CheckIcon className='h-3 w-3 text-white' />
                  </div>
                ) : (
                  <div className='h-5 w-5 rounded border border-gray-300' />
                )}
              </div>

              {/* Flag */}
              <div className='absolute right-3 top-3 text-2xl'>{currency.flag}</div>

              {/* Currency Button */}
              <div className='mt-8'>
                <button
                  type='button'
                  className={cn(
                    "w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors",
                    isSelected ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700",
                    isDisabled && "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                  )}
                  disabled={isDisabled}
                >
                  {currency.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/deal-snapshot.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, X, Building } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DealSnapshotItem {
  id: string;
  header: string;
  description: string;
}

interface DealSnapshotProps {
  value?: DealSnapshotItem[];
  onChange: (value: DealSnapshotItem[]) => void;
  error?: string;
}

export function DealSnapshot({ value = [], onChange, error }: DealSnapshotProps) {
  const [items, setItems] = useState<DealSnapshotItem[]>(
    value.length > 0 ? value : [{ id: "1", header: "", description: "" }]
  );

  const handleAddNew = () => {
    const newItem: DealSnapshotItem = {
      id: Date.now().toString(),
      header: "",
      description: "",
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  const handleRemove = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      onChange(newItems);
    }
  };

  const handleItemChange = (id: string, field: keyof DealSnapshotItem, value: string) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setItems(newItems);

    // const validatedItems = newItems.filter(item =>
    //   item.header.trim() !== "" && item.description.trim() !== ""
    // );

    onChange(newItems);
  };

  //   return items.length > 0 && items.every(item =>
  //     item.header.trim() !== "" &&
  //     item.description.trim() !== "" &&
  //     item.description.length >= 10
  //   );
  // };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-4 flex items-center space-x-3'>
        <div className='flex items-center space-x-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
            <Building className='h-3 w-3 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>2. Deal Snapshot</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-6 text-sm text-gray-600'>
        Instruction: Highlight the key points that make this project valuable. Use short, impactful headers and a brief
        description
      </p>

      {/* Table */}
      <div className='w-full'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='w-1/3 p-4 text-left text-sm font-medium text-gray-700'>Header</th>
                <th className='w-2/3 p-4 text-left text-sm font-medium text-gray-700'>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className='border-b border-gray-100'>
                  <td className='p-4'>
                    <Input
                      placeholder='e.g. Prime Location'
                      value={item.header}
                      onChange={(e) => handleItemChange(item.id, "header", e.target.value)}
                      className={cn("w-full", error && "border-red-500")}
                    />
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center space-x-2'>
                      <Textarea
                        placeholder='e.g. Located in a fast-growing urban district with increasing rental demand'
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className={cn("min-h-[80px] flex-1", error && "border-red-500")}
                        rows={3}
                      />
                      {items.length > 1 && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemove(item.id)}
                          className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Button
        type='button'
        onClick={handleAddNew}
        className='flex items-center gap-2 bg-blue-900 text-white hover:bg-blue-800'
      >
        <Plus className='h-4 w-4' />
        Add New
      </Button>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/debt-details-form.tsx

```tsx
import React from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { Info } from "lucide-react";

type DistributionPeriod = "monthly" | "quarterly" | "semi_annually" | "annually";
type TargetHoldPeriod = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

interface DebtDetailsData {
  debt_allocation?: string;
  distribution_period?: DistributionPeriod;
  target_distribution_start?: string;
  max_investment_amount?: string;
  min_investment_amount?: string;
  expected_max_annual_return?: string;
  expected_min_annual_return?: string;
  exit_date?: string;
  target_hold_period?: TargetHoldPeriod;
}

interface DebtDetailsFormProps {
  value?: DebtDetailsData;
  onChange?: (value: DebtDetailsData) => void;
}

const DebtDetailsForm: React.FC<DebtDetailsFormProps> = ({ value = {}, onChange }) => {
  const handleInputChange = (field: string, inputValue: string) => {
    onChange?.({ ...value, [field]: inputValue });
  };

  //   const requiredFields = [
  //     "debt_allocation",
  //     "distribution_period",
  //     "target_distribution_start",
  //     "min_investment_amount",
  //     "expected_max_annual_return",
  //     "expected_min_annual_return",
  //     "exit_date",
  //     "target_hold_period",
  //   ];
  //   return requiredFields.every((field) => value[field] && value[field].trim() !== "");
  // };

  const distributionPeriodOptions = [
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

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {/* Debt % Allocation */}
      <div className='space-y-2'>
        <Label htmlFor='debt_allocation' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Debt % Allocation
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='debt_allocation'
          type='text'
          placeholder='Enter allocation'
          value={value.debt_allocation || ""}
          onChange={(e) => handleInputChange("debt_allocation", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Distribution Period */}
      <div className='space-y-2'>
        <Label htmlFor='distribution_period' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Distribution Period
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Select
          value={value.distribution_period || ""}
          onValueChange={(selectedValue) => handleInputChange("distribution_period", selectedValue)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Monthly' />
          </SelectTrigger>
          <SelectContent>
            {distributionPeriodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Distribution Start Date */}
      <div className='space-y-2'>
        <Label
          htmlFor='target_distribution_start'
          className='flex items-center gap-2 text-sm font-medium text-gray-700'
        >
          Target Distribution Start Date
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='target_distribution_start'
          type='text'
          placeholder='DD/MM/YY'
          value={value.target_distribution_start || ""}
          onChange={(e) => handleInputChange("target_distribution_start", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Maximum Investment Amount */}
      <div className='space-y-2'>
        <Label htmlFor='max_investment_amount' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Maximum Investment Amount
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='max_investment_amount'
          type='text'
          placeholder='$950'
          value={value.max_investment_amount || ""}
          onChange={(e) => handleInputChange("max_investment_amount", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Minimum Investment Amount */}
      <div className='space-y-2'>
        <Label htmlFor='min_investment_amount' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Minimum Investment Amount
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='min_investment_amount'
          type='text'
          placeholder='$950'
          value={value.min_investment_amount || ""}
          onChange={(e) => handleInputChange("min_investment_amount", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Expected Max Annual Return */}
      <div className='space-y-2'>
        <Label
          htmlFor='expected_max_annual_return'
          className='flex items-center gap-2 text-sm font-medium text-gray-700'
        >
          Expected Max Annual Return (%)
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='expected_max_annual_return'
          type='text'
          placeholder='$950'
          value={value.expected_max_annual_return || ""}
          onChange={(e) => handleInputChange("expected_max_annual_return", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Expected Min Annual Return */}
      <div className='space-y-2'>
        <Label
          htmlFor='expected_min_annual_return'
          className='flex items-center gap-2 text-sm font-medium text-gray-700'
        >
          Expected Min Annual Return (%)
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='expected_min_annual_return'
          type='text'
          placeholder='$950'
          value={value.expected_min_annual_return || ""}
          onChange={(e) => handleInputChange("expected_min_annual_return", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Exit Date */}
      <div className='space-y-2'>
        <Label htmlFor='exit_date' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Exit Date
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
        </Label>
        <Input
          id='exit_date'
          type='text'
          placeholder='1/3/27'
          value={value.exit_date || ""}
          onChange={(e) => handleInputChange("exit_date", e.target.value)}
          className='w-full'
        />
      </div>

      {/* Target Hold Period */}
      <div className='space-y-2'>
        <Label htmlFor='target_hold_period' className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          Target Hold Period (Years)
          <span className='text-red-500'>*</span>
          <Info className='h-4 w-4 text-gray-400' />
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
      </div>
    </div>
  );
};

export default DebtDetailsForm;

```

# onboarding/debt-details-section.tsx

```tsx
import React from "react";
import { Building } from "lucide-react";

interface DebtDetailsSectionProps {
  label: string;
}

const DebtDetailsSection: React.FC<DebtDetailsSectionProps> = ({ label }) => {
  return (
    <div className='mb-6 mt-8 flex items-center space-x-3'>
      <div className='flex items-center space-x-2'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
          <Building className='h-3 w-3 text-white' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>{label}</h3>
      </div>
    </div>
  );
};

export default DebtDetailsSection;

```

# onboarding/definitions-document.tsx

```tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DefinitionsDocumentProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

export function DefinitionsDocument({
  // value,
  onChange,
  error,
}: DefinitionsDocumentProps) {
  const handleViewDocument = () => {
    // This would typically open a modal or navigate to the document
    // For now, we'll just mark it as viewed
    onChange(true);
  };

  return (
    <div className='space-y-2'>
      <Button
        type='button'
        variant='outline'
        onClick={handleViewDocument}
        className='flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50'
      >
        View Definitions Document
        <ArrowRight className='h-4 w-4' />
      </Button>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/documents-section.tsx

```tsx
"use client";

interface DocumentsSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
}

export function DocumentsSection({
  // value, onChange,
  error,
  label,
}: DocumentsSectionProps) {
  return (
    <div className='mb-4 mt-8'>
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>🏢</span>
        <h3 className='text-lg font-semibold text-gray-800'>{label}</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/equity-details-form.tsx

```tsx
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

```

# onboarding/equity-details-section.tsx

```tsx
import React from "react";
import { Building } from "lucide-react";

interface EquityDetailsSectionProps {
  label: string;
}

const EquityDetailsSection: React.FC<EquityDetailsSectionProps> = ({ label }) => {
  return (
    <div className='mb-6 mt-8 flex items-center space-x-3'>
      <div className='flex items-center space-x-2'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
          <Building className='h-3 w-3 text-white' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>{label}</h3>
      </div>
    </div>
  );
};

export default EquityDetailsSection;

```

# onboarding/expenses-revenue-form.tsx

```tsx
import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";

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
            <Input
              type='text'
              placeholder='$0.00'
              value={value.taxes || ""}
              onChange={(e) => handleInputChange("taxes", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Management <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.management || ""}
              onChange={(e) => handleInputChange("management", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Utilities <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.utilities || ""}
              onChange={(e) => handleInputChange("utilities", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Total Expense <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.totalExpense || ""}
              onChange={(e) => handleInputChange("totalExpense", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Total Equity Appreciation <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.totalEquityAppreciation || ""}
              onChange={(e) => handleInputChange("totalEquityAppreciation", e.target.value)}
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
            <Input
              type='text'
              placeholder='$0.00'
              value={value.insurance || ""}
              onChange={(e) => handleInputChange("insurance", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Repairs <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.repairs || ""}
              onChange={(e) => handleInputChange("repairs", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Interest <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.interest || ""}
              onChange={(e) => handleInputChange("interest", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Total Rental Income <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              placeholder='$0.00'
              value={value.totalRentalIncome || ""}
              onChange={(e) => handleInputChange("totalRentalIncome", e.target.value)}
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
                <Input
                  type='text'
                  placeholder='$0.00'
                  value={expense.amount || ""}
                  onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
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

```

# onboarding/facial-capture.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

interface FacialCaptureProps {
  value?: boolean;
  onChange: (captured: boolean) => void;
}

export function FacialCapture({ value = false, onChange }: FacialCaptureProps) {
  const [isCaptured, setIsCaptured] = useState(value);

  const handleCapture = () => {
    // In a real implementation, this would open camera and capture
    // For now, we'll just toggle the captured state
    const newState = !isCaptured;
    setIsCaptured(newState);
    onChange(newState);
  };

  return (
    <div className='space-y-4'>
      <div className='flex size-fit flex-col items-center justify-center rounded-lg border border-black/10 bg-white p-8 shadow-xl'>
        <div className='mb-6 flex size-fit items-center justify-center'>
          {isCaptured ? (
            <Check className='h-16 w-16 text-green-600' />
          ) : (
            <Image
              src='/images/facial-capture.gif'
              alt='Facial capture scanning'
              className='object-contain'
              width={88}
              height={88}
            />
          )}
        </div>

        <Button
          type='button'
          onClick={handleCapture}
          className={`px-8 py-3 text-white ${
            isCaptured ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/80"
          }`}
        >
          {isCaptured ? "Recapture" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

```

# onboarding/file-upload.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Plus, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
}

export function FileUpload({
  value = [],
  onChange,
  multiple = true,
  acceptedFileTypes = [".pdf", ".doc", ".docx", ".jpg", ".png"],
}: FileUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles = multiple ? [...value, ...files] : files;
    onChange(newFiles);
    setIsModalOpen(false);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <>
      {/* Trigger Button */}
      <div>
        <Button
          type='button'
          variant='outline'
          onClick={() => setIsModalOpen(true)}
          className='rounded-md border border-black/10 bg-white px-3 py-5 text-sm font-normal text-text-muted hover:bg-gray-50'
        >
          <span className='flex items-center gap-2'>
            <span className='text-xs font-normal text-text-muted/80'>Upload</span>
            <Plus className='size-3 text-black' />
          </span>
        </Button>

        {/* Show uploaded files */}
        {value.length > 0 && (
          <div className='mt-3 space-y-2'>
            {value.map((file: File, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2'
              >
                <span className='text-sm text-text-muted'>{file.name}</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeFile(index)}
                  className='h-6 w-6 p-0 text-red-500 hover:text-red-700'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-lg bg-white p-6'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>
              Upload Supporting Documents
            </DialogTitle>
          </DialogHeader>

          <p className='mb-6 text-center text-base text-[#858585]'>
            Please upload any relevant documents for this project
          </p>

          {/* Drag and Drop Area */}
          <div
            className={`mb-6 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* PDF Icon */}

            <Image
              src='/images/pdf.png'
              alt='upload-document'
              width={60}
              height={60}
              className='mx-auto flex items-center justify-center'
            />
            <p className='mb-2 text-sm text-text-muted'>Drag and drop files here or click to browse</p>
            <p className='text-xs text-text-muted/70'>Supported formats: {acceptedFileTypes.join(", ")}</p>
            <input
              type='file'
              multiple={multiple}
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileInput}
              className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            />
          </div>

          {/* Upload Button */}
          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = multiple;
                input.accept = acceptedFileTypes.join(",");
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    handleFiles(Array.from(files));
                  }
                };
                input.click();
              }}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

```

# onboarding/form-field.tsx

```tsx
"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { cn } from "@/src/lib/utils";
import { ProjectDetailsTable, ProjectDetailsTableRef } from "./project-details-table";
import { TermsCheckbox } from "./terms-checkbox";
import { SupportingDocuments } from "./supporting-documents";
import { ReferenceLinksManager } from "./reference-links-manager";
import { AddressInput } from "./address-input";
import { UtilityBillUpload } from "./utility-bill-upload";
import { FacialCapture } from "./facial-capture";
import { BankTermsCheckbox } from "./bank-terms-checkbox";
import { IdentificationFields } from "./identification-fields";
import { CurrencySelect } from "./currency-select";
import { CountrySelect } from "./country-select";
import { FileUpload } from "./file-upload";
import { BusinessPlanRating } from "./business-plan-rating";
import { DefinitionsDocument } from "./definitions-document";
import { DealSnapshot } from "./deal-snapshot";
import { RiskConsiderations } from "./risk-considerations";
import { SectionHeader } from "./section-header";
import { KeyDealPoints } from "./key-deal-points";
import { PropertyAddressInput } from "./property-address-input";
import { SponsorMetricsTable } from "./sponsor-metrics-table";
import OfferDetailsTable from "./offer-details-table";
import DebtDetailsForm from "./debt-details-form";
import EquityDetailsForm from "./equity-details-form";
import BudgetTable from "./budget-table";
import ExpensesRevenueForm from "./expenses-revenue-form";
import { SizeInput } from "./size-input";
import { OnboardingField, FormFieldValue } from "@/src/types/onboarding";
import { SponsorLogoUpload } from "./sponsor-logo-upload";

type FormData = Record<string, FormFieldValue>;

interface FormFieldProps {
  field: OnboardingField;
  value: FormFieldValue;
  onChange: (value: FormFieldValue) => void;
  error?: string;
  formData?: FormData;
  spans2Columns?: boolean;
}

export interface FormFieldRef {
  validateCustomComponent: () => boolean;
}

export const FormField = forwardRef<FormFieldRef, FormFieldProps>(
  ({ field, value, onChange, error, formData = {}, spans2Columns = false }, ref) => {
    const projectDetailsTableRef = useRef<ProjectDetailsTableRef>(null);

    // Expose validation method to parent
    useImperativeHandle(ref, () => ({
      validateCustomComponent: () => {
        if (field.key === "completed_projects" && projectDetailsTableRef.current) {
          return projectDetailsTableRef.current.validate();
        }
        return true;
      },
    }));

    const renderField = () => {
      switch (field.type) {
        case "text":
          return (
            <Input
              placeholder={field.placeholder}
              value={(value as string | number) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                error && "border-red-500",
                "max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
              )}
            />
          );

        case "textarea":
          return (
            <Textarea
              placeholder={field.placeholder}
              value={(value as string | number) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                "min-h-[100px]",
                error && "border-red-500",
                "text-sm shadow-none placeholder:text-text-muted/50"
              )}
            />
          );

        case "select":
          // Handle special currency select case
          if (field.options === "currencies") {
            return (
              <CurrencySelect
                value={(value as string) || ""}
                onChange={onChange}
                error={error}
                className={spans2Columns ? "w-auto min-w-[120px]" : ""}
              />
            );
          }

          // Handle special country select case
          if (field.options === "countries") {
            return (
              <CountrySelect
                value={(value as string) || ""}
                onChange={onChange}
                error={error}
                placeholder={field.placeholder}
                className={spans2Columns ? "w-auto min-w-[120px]" : ""}
              />
            );
          }

          if (field.allowOther) {
            const selectValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "selectedValue" in value
                ? (value as { selectedValue: string; otherValue: string }).selectedValue
                : typeof value === "string"
                  ? value
                  : "";
            const otherValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "otherValue" in value
                ? (value as { selectedValue: string; otherValue: string }).otherValue
                : "";

            return (
              <div className='space-y-3'>
                <Select
                  value={selectValue}
                  onValueChange={(selectedValue) => {
                    if (selectedValue === "other") {
                      onChange({ selectedValue, otherValue: otherValue || "" });
                    } else {
                      onChange({ selectedValue, otherValue: "" });
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      error && "border-red-500",
                      "text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
                      spans2Columns && "w-auto min-w-[120px]" // Auto-width only for 2-column spans
                    )}
                  >
                    <SelectValue
                      placeholder={
                        field.placeholder ||
                        (Array.isArray(field.options) ? field.options[0]?.label : "Select an option")
                      }
                      className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
                    />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-text-muted/80'>
                    {Array.isArray(field.options) &&
                      field.options.map((option) => (
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

                {selectValue === "other" && (
                  <div className='space-y-2'>
                    <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>Please specify:</Label>
                    <Input
                      placeholder='Enter your custom option'
                      value={otherValue}
                      onChange={(e) => onChange({ selectedValue: selectValue, otherValue: e.target.value })}
                      className={cn(error && "border-red-500", "text-sm shadow-none placeholder:text-text-muted/50")}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <Select value={(value as string | number)?.toString() || ""} onValueChange={onChange}>
              <SelectTrigger
                className={cn(
                  error && "border-red-500",
                  "text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
                  spans2Columns && "w-auto min-w-[120px]" // Auto-width only for 2-column spans
                )}
              >
                <SelectValue
                  placeholder={
                    field.placeholder || (Array.isArray(field.options) ? field.options[0]?.label : "Select an option")
                  }
                  className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
                />
              </SelectTrigger>
              <SelectContent className='bg-white text-text-muted/80'>
                {Array.isArray(field.options) &&
                  field.options.map((option) => (
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
          );

        case "radio":
          if (field.allowOther) {
            const selectedValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "selectedValue" in value
                ? (value as { selectedValue: string; otherValue: string }).selectedValue
                : typeof value === "string" || typeof value === "number"
                  ? value.toString()
                  : "";
            const otherValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "otherValue" in value
                ? (value as { selectedValue: string; otherValue: string }).otherValue
                : "";

            return (
              <div className='space-y-3'>
                <RadioGroup
                  value={selectedValue}
                  onValueChange={(selectedValue) => {
                    if (selectedValue === "other") {
                      onChange({ selectedValue, otherValue: otherValue || "" });
                    } else {
                      onChange({ selectedValue, otherValue: "" });
                    }
                  }}
                >
                  <div className='flex flex-wrap gap-3'>
                    {Array.isArray(field.options) &&
                      field.options.map((option) => (
                        <div
                          key={option.value}
                          className='flex w-fit cursor-pointer items-center space-x-5 rounded-md border border-black/10 px-4 py-2'
                        >
                          <Label
                            htmlFor={option.value}
                            className='cursor-pointer text-xs font-normal -tracking-[3%] text-text-muted'
                          >
                            {option.label}
                          </Label>
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className='size-4 border-2 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                          />
                        </div>
                      ))}
                    <div className='flex w-fit cursor-pointer items-center space-x-5 rounded-md border border-black/10 px-4 py-2'>
                      <Label
                        htmlFor='other'
                        className='cursor-pointer text-xs font-normal -tracking-[3%] text-text-muted'
                      >
                        Other
                      </Label>
                      <RadioGroupItem
                        value='other'
                        id='other'
                        className='size-4 border-2 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                      />
                    </div>
                  </div>
                </RadioGroup>

                {selectedValue === "other" && (
                  <div className='space-y-2'>
                    <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>Please specify:</Label>
                    <Input
                      placeholder='Enter your custom option'
                      value={otherValue}
                      onChange={(e) => onChange({ selectedValue: selectedValue, otherValue: e.target.value })}
                      className={cn(error && "border-red-500", "text-sm shadow-none placeholder:text-text-muted/50")}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <RadioGroup value={(value as string | number)?.toString() || ""} onValueChange={onChange}>
              <div className='flex flex-wrap gap-3'>
                {Array.isArray(field.options) &&
                  field.options.map((option) => (
                    <div
                      key={option.value}
                      className='flex w-fit cursor-pointer items-center space-x-5 rounded-md border border-black/10 px-4 py-2'
                    >
                      <Label
                        htmlFor={option.value}
                        className='cursor-pointer text-xs font-normal -tracking-[3%] text-text-muted'
                      >
                        {option.label}
                      </Label>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className='size-4 border-2 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                      />
                    </div>
                  ))}
              </div>
            </RadioGroup>
          );

        case "multi-text":
          const multiTextValue = (value as Record<string, string>) || {};
          return (
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {field.multiTextOptions?.map((option) => (
                <div key={option} className='space-y-2'>
                  <Label className='hidden text-sm font-normal -tracking-[3%] text-text-muted'>{option}</Label>
                  <Input
                    placeholder={`${option}`}
                    value={multiTextValue[option] || ""}
                    onChange={(e) => onChange({ ...multiTextValue, [option]: e.target.value })}
                    className={cn("text-sm shadow-none placeholder:text-text-muted/50")}
                  />
                </div>
              ))}
            </div>
          );

        case "custom-component":
          if (field.customComponent === "TermsCheckbox") {
            return <TermsCheckbox value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.key === "completed_projects") {
            return (
              <ProjectDetailsTable
                ref={projectDetailsTableRef}
                value={value as never}
                onChange={onChange}
                error={error}
              />
            );
          }
          if (field.customComponent === "SupportingDocuments") {
            return <SupportingDocuments value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "ReferenceLinksManager") {
            return <ReferenceLinksManager value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "AddressInput") {
            return <AddressInput value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "UtilityBillUpload") {
            return <UtilityBillUpload value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "FacialCapture") {
            return <FacialCapture value={Boolean(value)} onChange={onChange} />;
          }
          if (field.customComponent === "BankTermsCheckbox") {
            return <BankTermsCheckbox value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "IdentificationFields") {
            return (
              <IdentificationFields
                value={value as never}
                onChange={onChange as never}
                selectedCountry={formData.country as string}
              />
            );
          }
          if (field.customComponent === "BusinessPlanRating") {
            return (
              <BusinessPlanRating value={(value as Record<string, string>) || {}} onChange={onChange} error={error} />
            );
          }
          if (field.customComponent === "DefinitionsDocument") {
            return <DefinitionsDocument value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "DealSnapshot") {
            return <DealSnapshot value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "RiskConsiderations") {
            return <RiskConsiderations value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SectionHeader") {
            return (
              <SectionHeader
                value={(value as string | number)?.toString() || ""}
                onChange={onChange}
                error={error}
                label={field.label}
              />
            );
          }
          if (field.customComponent === "KeyDealPoints") {
            return <KeyDealPoints value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "PropertyAddressInput") {
            return (
              <PropertyAddressInput
                value={(value as string | number)?.toString() || ""}
                onChange={onChange}
                error={error}
              />
            );
          }
          if (field.customComponent === "SponsorMetricsTable") {
            return <SponsorMetricsTable value={value as never} onChange={onChange as never} error={error} />;
          }
          if (field.customComponent === "OfferDetailsTable") {
            return <OfferDetailsTable value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "DebtDetailsForm") {
            return <DebtDetailsForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "EquityDetailsForm") {
            return <EquityDetailsForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "BudgetTable") {
            return <BudgetTable value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "ExpensesRevenueForm") {
            return <ExpensesRevenueForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "SizeInput") {
            return (
              <SizeInput
                value={value as { size: string; unit: string } | string}
                onChange={onChange}
                label={field.label}
                placeholder={field.placeholder}
                error={error}
                required={field.validation?.required}
              />
            );
          }
          if (field.customComponent === "SponsorLogoUpload") {
            return <SponsorLogoUpload value={value as File[]} onChange={onChange} error={error} />;
          }
          if (field.key === "supporting_documents") {
            return <SupportingDocuments value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "CurrencySelect") {
            return <CurrencySelect value={(value as string) || ""} onChange={onChange} error={error} />;
          }
          return (
            <div className='rounded-lg border-2 border-dashed border-gray-300 p-4 text-center'>
              <p className='text-sm text-gray-500'>Custom component: {field.customComponent}</p>
            </div>
          );

        case "file":
          return (
            <FileUpload
              value={(value as File[]) || []}
              onChange={onChange}
              multiple={false}
              acceptedFileTypes={field.validation.fileTypes || [".pdf", ".doc", ".docx", ".jpg", ".png"]}
            />
          );

        case "multi-file":
          return (
            <FileUpload
              value={(value as File[]) || []}
              onChange={onChange}
              multiple={true}
              acceptedFileTypes={field.validation.fileTypes || [".pdf", ".doc", ".docx", ".jpg", ".png"]}
            />
          );

        default:
          return null;
      }
    };

    if (field.layout === "inline") {
      return (
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <div className='flex-1'>
              <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>{field.label}</Label>
            </div>
            <div className='flex-1'>{renderField()}</div>
          </div>
          {field.description && <p className='text-sm -tracking-[3%] text-text-muted/70'>{field.description}</p>}
          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>
          {field.label}
          {field.description && <p className='mt-1 text-sm -tracking-[3%] text-text-muted/70'>{field.description}</p>}
        </Label>
        {renderField()}
        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

```

# onboarding/fund-wallet.tsx

```tsx
import React from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WalletFundingData {
  funded?: boolean;
  amount?: number;
  transactionId?: string;
  status?: "pending" | "completed" | "failed";
  timestamp?: Date;
}

interface FundWalletProps {
  value?: WalletFundingData;
  onChange?: (value: WalletFundingData) => void;
}

const FundWallet: React.FC<FundWalletProps> = () =>
  // { value, onChange }
  {
    const handleFundWallet = () => {
      // Fund wallet logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Fund Wallet</h3>

          <p className='mb-6 text-sm leading-relaxed text-gray-600'>
            To proceed with submission, please note that a ₦1,000,000 non-refundable fee is required. This covers your
            profile due diligence and onboarding checks.
          </p>

          <Button
            type='button'
            onClick={handleFundWallet}
            className='flex items-center space-x-2 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
          >
            <span>FUND WALLET</span>
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    );
  };

export default FundWallet;

```

# onboarding/funds-modification-notice.tsx

```tsx
"use client";

interface FundsModificationNoticeProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

export function FundsModificationNotice({
  // value, onChange,
  error,
}: FundsModificationNoticeProps) {
  return (
    <div className='my-6 border-l-4 border-gray-400 bg-gray-50 p-4'>
      <p className='text-sm italic leading-relaxed text-gray-700'>
        The due date for funds may be subject to modification at the discretion of RC Brown Capital. Such modifications
        may arise in circumstances where the demand exceeds the intended offering, among other reasons as determined by
        RC Brown Capital.
      </p>
      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/identification-fields.tsx

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface IdentificationData {
  bvn?: string;
  nin?: string;
  ssn?: string;
  sin?: string; // Canada
  nino?: string; // UK
}

interface IdentificationFieldsProps {
  value?: IdentificationData;
  onChange: (data: IdentificationData) => void;
  selectedCountry?: string;
}

export function IdentificationFields({ value = {}, onChange, selectedCountry }: IdentificationFieldsProps) {
  const [identificationData, setIdentificationData] = useState<IdentificationData>(value);
  const prevCountryRef = useRef<string | undefined>(selectedCountry);

  const updateField = (field: keyof IdentificationData, newValue: string) => {
    const newData = { ...identificationData, [field]: newValue };
    setIdentificationData(newData);
    onChange(newData);
  };

  // Clear fields when country changes
   
  useEffect(() => {
    if (prevCountryRef.current !== selectedCountry && prevCountryRef.current !== undefined) {
      const clearedData = {};
      setIdentificationData(clearedData);
      onChange(clearedData);
    }
    prevCountryRef.current = selectedCountry;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]); // Removed onChange from dependency array

  // Sync with external value changes
  useEffect(() => {
    if (value !== identificationData) {
      setIdentificationData(value);
    }
  }, [value, identificationData]);

  const renderFieldsForCountry = () => {
    if (!selectedCountry) return null;

    switch (selectedCountry.toLowerCase()) {
      case "nigeria":
        return (
          <>
            <div className='space-y-2'>
              <Label htmlFor='bvn'>BVN</Label>
              <Input
                id='bvn'
                type='text'
                placeholder='Enter your BVN'
                value={identificationData.bvn || ""}
                onChange={(e) => updateField("bvn", e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='nin'>NIN</Label>
              <Input
                id='nin'
                type='text'
                placeholder='Enter your NIN'
                value={identificationData.nin || ""}
                onChange={(e) => updateField("nin", e.target.value)}
              />
            </div>
          </>
        );

      case "united states":
        return (
          <div className='space-y-2'>
            <Label htmlFor='ssn'>Social Security Number</Label>
            <Input
              id='ssn'
              type='text'
              placeholder='Enter your SSN'
              value={identificationData.ssn || ""}
              onChange={(e) => updateField("ssn", e.target.value)}
            />
          </div>
        );

      case "canada":
        return (
          <div className='space-y-2'>
            <Label htmlFor='sin'>Social Insurance Number (SIN)</Label>
            <Input
              id='sin'
              type='text'
              placeholder='Enter your SIN'
              value={identificationData.sin || ""}
              onChange={(e) => updateField("sin", e.target.value)}
            />
          </div>
        );

      case "united kingdom":
        return (
          <div className='space-y-2'>
            <Label htmlFor='nino'>National Insurance Number</Label>
            <Input
              id='nino'
              type='text'
              placeholder='Enter your National Insurance Number'
              value={identificationData.nino || ""}
              onChange={(e) => updateField("nino", e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return <div className='space-y-4'>{renderFieldsForCountry()}</div>;
}

```

# onboarding/key-deal-points.tsx

```tsx
"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

type DebtTenure =
  | "1_year"
  | "2_years"
  | "3_years"
  | "4_years"
  | "5_years"
  | "6_years"
  | "7_years"
  | "8_years"
  | "9_years"
  | "10_years";

interface KeyDealPointsData {
  projected_valuation?: string;
  timeline_completion?: string;
  total_capital_required?: string;
  total_debt_allocation?: string;
  debt_investment_tenure?: DebtTenure;
  percentage_yield_debt?: string;
  equity_investment_tenure?: string;
  projected_returns_equity?: string;
  total_equity?: string;
  [key: string]: string | DebtTenure | undefined;
}

interface KeyDealPointsProps {
  value?: KeyDealPointsData;
  onChange: (value: KeyDealPointsData) => void;
  error?: string;
}

export function KeyDealPoints({ value = {}, onChange }: KeyDealPointsProps) {
  const updateField = (field: keyof KeyDealPointsData, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const debtTenureOptions = [
    { label: "One year", value: "1_year" },
    { label: "Two years", value: "2_years" },
    { label: "Three years", value: "3_years" },
    { label: "Four years", value: "4_years" },
    { label: "Five years", value: "5_years" },
    { label: "Six years", value: "6_years" },
    { label: "Seven years", value: "7_years" },
    { label: "Eight years", value: "8_years" },
    { label: "Nine years", value: "9_years" },
    { label: "Ten years", value: "10_years" },
  ];

  return (
    <div className='space-y-4 rounded-lg px-8 py-6 shadow-lg'>
      <h4 className='font-medium'>The Deal (Key Deal Points)</h4>

      <div className='relative space-y-6'>
        {/* Vertical separator line */}
        <div className='absolute left-[28%] top-0 hidden h-full w-px bg-gray-200 md:block'></div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Projected Valuation</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Estimated property value upon completion'
              value={value.projected_valuation || ""}
              onChange={(e) => updateField("projected_valuation", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Timeline of Completion (Months)*</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter timeline in months'
              value={value.timeline_completion || ""}
              onChange={(e) => updateField("timeline_completion", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Total Capital Required *</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter total capital required'
              value={value.total_capital_required || ""}
              onChange={(e) => updateField("total_capital_required", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Total Debt Allocation (%)</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter debt allocation percentage'
              value={value.total_debt_allocation || ""}
              onChange={(e) => updateField("total_debt_allocation", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Debt Investment Tenure</Label>
          <div className='md:col-span-2'>
            <Select
              value={value.debt_investment_tenure || ""}
              onValueChange={(selectedValue) => updateField("debt_investment_tenure", selectedValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select debt investment tenure' />
              </SelectTrigger>
              <SelectContent>
                {debtTenureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Percentage Yield - Debt (%)</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter yield percentage'
              value={value.percentage_yield_debt || ""}
              onChange={(e) => updateField("percentage_yield_debt", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Equity Investment Tenure *</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter equity investment tenure'
              value={value.equity_investment_tenure || ""}
              onChange={(e) => updateField("equity_investment_tenure", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Projected Returns - Equity (%) *</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter projected equity returns'
              value={value.projected_returns_equity || ""}
              onChange={(e) => updateField("projected_returns_equity", e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
          <Label className='pr-4 text-sm font-normal text-text-muted'>Total Equity (%) *</Label>
          <div className='md:col-span-2'>
            <Input
              placeholder='Enter total equity percentage'
              value={value.total_equity || ""}
              onChange={(e) => updateField("total_equity", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

```

# onboarding/media-assets-upload.tsx

```tsx
import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Monitor, FileText, Image } from "lucide-react";

interface MediaAssetsData {
  video?: File[];
  slides?: File[];
  pictures?: File[];
  [key: string]: File[] | undefined;
}

interface MediaAssetsUploadProps {
  value?: MediaAssetsData;
  onChange?: (value: MediaAssetsData) => void;
}

const MediaAssetsUpload: React.FC<MediaAssetsUploadProps> = ({ value = {}, onChange }) => {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleFileUpload = (type: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onChange?.({ ...value, [type]: fileArray });
    }
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    handleFileUpload(type, files);
  };

  const uploadAreas = [
    {
      key: "video",
      icon: Monitor,
      title: "Video File",
      description: "Select and upload a video file (MP4, MOV). Max size: 500 MB.",
      acceptedTypes: ".mp4,.mov",
      maxSize: "500 MB",
      multiple: false,
    },
    {
      key: "slides",
      icon: FileText,
      title: "Slides File",
      description: "Upload presentation slides (PDF, PPTX). Max size: 20 MB",
      acceptedTypes: ".pdf,.pptx",
      maxSize: "20 MB",
      multiple: false,
    },
    {
      key: "pictures",
      icon: Image,
      title: "Pictures File",
      description: "Choose image files (JPG, PNG). You can upload multiple. Max size per file: 10 MB",
      acceptedTypes: ".jpg,.jpeg,.png",
      maxSize: "10 MB",
      multiple: true,
    },
  ];

  return (
    <div className='mb-6 w-full'>
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>Media Assets Upload</h3>

      {/* Horizontal Carousel */}
      <div className='overflow-x-auto pb-4'>
        <div className='flex min-w-max space-x-6'>
          {uploadAreas.map((area) => {
            const Icon = area.icon;
            const isDragOver = dragOver === area.key;
            const hasFiles = value[area.key] && value[area.key]!.length > 0;

            return (
              <div
                key={area.key}
                className={`w-80 flex-shrink-0 rounded-lg border-2 border-dashed bg-white p-6 ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-200"} ${hasFiles ? "border-green-500 bg-green-50" : ""} transition-colors`}
                onDragOver={(e) => handleDragOver(e, area.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, area.key)}
              >
                <div className='text-center'>
                  <div className='mb-4 flex justify-center'>
                    <div className='rounded-full bg-gray-100 p-3'>
                      <Icon className='h-8 w-8 text-gray-600' />
                    </div>
                  </div>

                  <h4 className='mb-2 text-lg font-medium text-gray-900'>{area.title}</h4>

                  <p className='mb-4 text-sm leading-relaxed text-gray-600'>{area.description}</p>

                  {hasFiles && value[area.key] && (
                    <div className='mb-4 rounded bg-green-100 p-2'>
                      <p className='text-sm text-green-800'>
                        {value[area.key]!.length} file{value[area.key]!.length !== 1 ? "s" : ""} uploaded
                      </p>
                    </div>
                  )}

                  <div className='relative'>
                    <input
                      type='file'
                      accept={area.acceptedTypes}
                      multiple={area.multiple}
                      onChange={(e) => handleFileUpload(area.key, e.target.files)}
                      className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                    />
                    <Button type='button' variant='outline' className='w-full border-gray-300 hover:bg-gray-50'>
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='mt-2 text-center text-xs text-gray-500'>Scroll horizontally to view all upload options</div>
    </div>
  );
};

export default MediaAssetsUpload;

```

# onboarding/offer-details-section.tsx

```tsx
import React from "react";
import { Building } from "lucide-react";

interface OfferDetailsSectionProps {
  label: string;
}

const OfferDetailsSection: React.FC<OfferDetailsSectionProps> = ({ label }) => {
  return (
    <div className='mb-6 flex items-center space-x-3'>
      <div className='flex items-center space-x-2'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
          <Building className='h-3 w-3 text-white' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>{label}</h3>
      </div>
    </div>
  );
};

export default OfferDetailsSection;

```

# onboarding/offer-details-table.tsx

```tsx
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

```

# onboarding/offering-information.tsx

```tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface OfferingInformationProps {
  value?: { informationType: string; file?: File };
  onChange: (value: { informationType: string; file?: File }) => void;
  error?: string;
}

const informationTypes = [
  { value: "offering_memorandum", label: "Offering Memorandum" },
  { value: "private_placement", label: "Private Placement Memorandum" },
  { value: "investment_summary", label: "Investment Summary" },
  { value: "financial_projections", label: "Financial Projections" },
  { value: "market_analysis", label: "Market Analysis" },
  { value: "term_sheet", label: "Term Sheet" },
  { value: "other", label: "Other" },
];

export function OfferingInformation({ value = { informationType: "" }, onChange, error }: OfferingInformationProps) {
  const [selectedType, setSelectedType] = useState(value.informationType);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(value.file);

  const handleTypeChange = (informationType: string) => {
    setSelectedType(informationType);
    onChange({ informationType, file: uploadedFile });
  };

  const triggerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.[0]) {
        setUploadedFile(target.files[0]);
        onChange({ informationType: selectedType, file: target.files[0] });
      }
    };
    input.click();
  };

  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-800'>Offering Information</h4>

      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500")}>
              <SelectValue placeholder='Offering Information Type' />
            </SelectTrigger>
            <SelectContent>
              {informationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={triggerFileUpload}
          className={cn("flex items-center gap-2", uploadedFile ? "border-green-200 bg-green-50 text-green-700" : "")}
        >
          Upload
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/physical-descriptions-tabs.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface PhysicalDescriptionsTabsProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const tabs = [
  { id: "superstructure", label: "Superstructure" },
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical System" },
  { id: "interior", label: "Interior Finishes" },
  { id: "safety", label: "Fire & Life Safety" },
];

export function PhysicalDescriptionsTabs({
  // value,
   onChange,
  error,
}: PhysicalDescriptionsTabsProps) {
  const [activeTab, setActiveTab] = useState("electrical");
  const [showTabs, setShowTabs] = useState(false);

  const handleAddDescriptions = () => {
    setShowTabs(true);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange(tabId);
  };

  return (
    <div className='space-y-4'>
      {!showTabs ? (
        <Button
          type='button'
          variant='outline'
          onClick={handleAddDescriptions}
          className='border-2 border-dashed border-gray-300 px-6 py-3 text-blue-600 hover:border-blue-600 hover:bg-blue-50'
        >
          <span className='font-medium text-blue-600'>Add</span>
          <span className='ml-2 text-gray-600'>Physical Descriptions</span>
        </Button>
      ) : (
        <div className='space-y-4'>
          <Button
            type='button'
            variant='outline'
            className='border-2 border-dashed border-gray-300 px-6 py-3 text-blue-600 hover:border-blue-600 hover:bg-blue-50'
          >
            <span className='font-medium text-blue-600'>Add</span>
            <span className='ml-2 text-gray-600'>Physical Descriptions</span>
          </Button>

          <div className='flex flex-wrap gap-2'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "rounded px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content would go here - for now just show the active tab */}
          <div className='rounded-lg border bg-gray-50 p-4'>
            <p className='text-gray-600'>
              Content for <strong>{tabs.find((t) => t.id === activeTab)?.label}</strong> will be displayed here.
            </p>
          </div>
        </div>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/project-details-table.tsx

```tsx
"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SizeInput } from "./size-input";

interface ProjectDetail {
  id: string;
  projectName: string;
  projectType: string;
  address: string;
  projectSize: { size: string; unit: string } | string;
  totalCost: string;
  startDate: string;
  completedDate: string;
}

interface ProjectDetailsTableProps {
  value?: ProjectDetail[];
  onChange: (projects: ProjectDetail[]) => void;
  error?: string;
}

export interface ProjectDetailsTableRef {
  validate: () => boolean;
}

export const ProjectDetailsTable = forwardRef<ProjectDetailsTableRef, ProjectDetailsTableProps>(
  ({ value = [], onChange, error }, ref) => {
    const [projects, setProjects] = useState<ProjectDetail[]>(value.length > 0 ? value : [createEmptyProject()]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
      const initialErrors: Record<string, Record<string, string>> = {};
      projects.forEach((project) => {
        initialErrors[project.id] = {};
      });
      setFieldErrors(initialErrors);
    }, [projects]);

    function createEmptyProject(): ProjectDetail {
      return {
        id: Math.random().toString(36).substr(2, 9),
        projectName: "",
        projectType: "",
        address: "",
        projectSize: "",
        totalCost: "",
        startDate: "",
        completedDate: "",
      };
    }

    const validateField = (
      projectId: string,
      field: keyof ProjectDetail,
      value: string | { size: string; unit: string }
    ): string => {
      const requiredFields: (keyof ProjectDetail)[] = [
        "projectName",
        "projectType",
        "address",
        "projectSize",
        "totalCost",
        "startDate",
        "completedDate",
      ];

      if (requiredFields.includes(field)) {
        if (field === "projectSize") {
          if (typeof value === "object" && value?.size && value?.unit) {
            if (!value.size.trim()) {
              return "Project size is required";
            }
          } else if (typeof value === "string" && !value.trim()) {
            return "Project size is required";
          }
        } else if (typeof value === "string" && (!value || value.trim() === "")) {
          return "This field is required";
        }
      }
      return "";
    };

    const validateAllFields = (projectList: ProjectDetail[]): boolean => {
      const newErrors: Record<string, Record<string, string>> = {};
      let hasErrors = false;

      projectList.forEach((project) => {
        newErrors[project.id] = {};

        Object.keys(project).forEach((key) => {
          if (key !== "id") {
            const fieldKey = key as keyof ProjectDetail;
            const error = validateField(project.id, fieldKey, project[fieldKey]);
            if (error) {
              newErrors[project.id][fieldKey] = error;
              hasErrors = true;
            }
          }
        });
      });

      setFieldErrors(newErrors);
      return !hasErrors;
    };

    // Expose validate method to parent
    useImperativeHandle(ref, () => ({
      validate: () => validateAllFields(projects),
    }));

    const updateProject = (
      id: string,
      field: keyof ProjectDetail,
      newValue: string | { size: string; unit: string }
    ) => {
      const updatedProjects = projects.map((project) =>
        project.id === id ? { ...project, [field]: newValue } : project
      );
      setProjects(updatedProjects);
      onChange(updatedProjects);

      // Clear field error when user starts typing
      const error = validateField(id, field, newValue);
      setFieldErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: error,
        },
      }));
    };

    const addProject = () => {
      const newProject = createEmptyProject();
      const newProjects = [...projects, newProject];
      setProjects(newProjects);
      onChange(newProjects);

      setFieldErrors((prev) => ({
        ...prev,
        [newProject.id]: {},
      }));
    };

    const removeProject = (id: string) => {
      if (projects.length > 1) {
        const filteredProjects = projects.filter((project) => project.id !== id);
        setProjects(filteredProjects);
        onChange(filteredProjects);

        // Remove errors for deleted project
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    };

    const projectTypeOptions = [
      { label: "Residential", value: "residential" },
      { label: "Commercial", value: "commercial" },
      { label: "Industrial", value: "industrial" },
      { label: "Mixed Use", value: "mixed_use" },
    ];

    return (
      <div className='space-y-6'>
        {projects.map((project) => (
          <div key={project.id} className='relative space-y-4 overflow-y-hidden rounded-lg px-8 py-6 shadow-lg'>
            <div className='flex items-center justify-between'>
              {/* <h4 className='font-medium'>Project {index + 1}</h4> */}
              {projects.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeProject(project.id)}
                  className='text-red-600 hover:text-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>
            <div className='absolute left-[28%] top-0 hidden h-full w-px bg-gray-200 md:block'></div>
            <div className='relative space-y-6'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`project-name-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Name *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`project-name-${project.id}`}
                    placeholder='e.g. Royal Gardens Estate'
                    value={project.projectName}
                    onChange={(e) => updateProject(project.id, "projectName", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.projectName && "border-red-500",
                      "border border-black/60 py-6 shadow-none placeholder:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.projectName && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].projectName}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`project-type-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Type *
                </Label>
                <div className='md:col-span-2'>
                  <Select
                    value={project.projectType}
                    onValueChange={(value) => updateProject(project.id, "projectType", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        fieldErrors[project.id]?.projectType && "border-red-500",
                        "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs data-[placeholder]:text-xs"
                      )}
                    >
                      <SelectValue
                        placeholder='Select project type'
                        className='text-xs font-normal placeholder:text-xs data-[placeholder]:text-xs'
                      />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      {projectTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors[project.id]?.projectType && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].projectType}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`address-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Address *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`address-${project.id}`}
                    placeholder='e.g. Royal Gardens Estate'
                    value={project.address}
                    onChange={(e) => updateProject(project.id, "address", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.address && "border-red-500",
                      "border border-black/60 py-6 shadow-none placeholder:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.address && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].address}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`project-size-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Size *
                </Label>
                <div className='md:col-span-2'>
                  <SizeInput
                    value={project.projectSize}
                    onChange={(value) => updateProject(project.id, "projectSize", value)}
                    placeholder='Enter size'
                    error={fieldErrors[project.id]?.projectSize}
                    required={true}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`total-cost-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Total Project Cost *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`total-cost-${project.id}`}
                    placeholder='e.g. ₦250,000,000'
                    value={project.totalCost}
                    onChange={(e) => updateProject(project.id, "totalCost", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.totalCost && "border-red-500",
                      "border border-black/60 py-6 shadow-none placeholder:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.totalCost && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].totalCost}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`start-date-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Project Start Date *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`start-date-${project.id}`}
                    type='date'
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.startDate && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs data-[placeholder]:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.startDate && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].startDate}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center'>
                <Label htmlFor={`completed-date-${project.id}`} className='pr-4 text-xs font-normal text-text-muted'>
                  Date Completed *
                </Label>
                <div className='md:col-span-2'>
                  <Input
                    id={`completed-date-${project.id}`}
                    type='date'
                    value={project.completedDate}
                    onChange={(e) => updateProject(project.id, "completedDate", e.target.value)}
                    className={cn(
                      fieldErrors[project.id]?.completedDate && "border-red-500",
                      "border border-black/60 py-6 text-xs shadow-none placeholder:text-xs data-[placeholder]:text-xs"
                    )}
                  />
                  {fieldErrors[project.id]?.completedDate && (
                    <p className='mt-1 text-sm text-red-500'>{fieldErrors[project.id].completedDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button type='button' variant='outline' onClick={addProject} className='w-full bg-transparent'>
          <span className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            <span className='text-sm font-normal text-text-muted'>Add Another Project</span>
          </span>
        </Button>

        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

ProjectDetailsTable.displayName = "ProjectDetailsTable";

```

# onboarding/property-address-input.tsx

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface PropertyAddressInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PropertyAddressInput({ value = "", onChange, error }: PropertyAddressInputProps) {
  const [address, setAddress] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddress(newValue);
    onChange(newValue);
  };

  //   return address.trim().length >= 5;
  // };

  return (
    <div className='space-y-2'>
      <div className='relative'>
        <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2'>
          <Image src='/icons/location.svg' alt='Location' width={16} height={16} className='text-gray-400' />
        </div>
        <Input
          type='text'
          placeholder='Enter address'
          value={address}
          onChange={handleChange}
          className={cn("pl-10", error && "border-red-500")}
        />
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/reference-links-manager.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus, Trash2, FileText, X } from "lucide-react";

interface ReferenceLink {
  id: string;
  url: string;
  file?: File;
  fileName?: string;
}

interface ReferenceLinksManagerProps {
  value?: ReferenceLink[];
  onChange: (links: ReferenceLink[]) => void;
}

export function ReferenceLinksManager({ value = [], onChange }: ReferenceLinksManagerProps) {
  const [links, setLinks] = useState<ReferenceLink[]>(value.length > 0 ? value : [createEmptyLink()]);

  const MAX_LINKS = 5;

  function createEmptyLink(): ReferenceLink {
    return {
      id: Math.random().toString(36).substr(2, 9),
      url: "",
    };
  }

  const updateLink = (id: string, field: keyof ReferenceLink, newValue: string | File | undefined) => {
    const updatedLinks = links.map((link) => (link.id === id ? { ...link, [field]: newValue } : link));
    setLinks(updatedLinks);
    onChange(updatedLinks);
  };

  const addLink = () => {
    if (links.length < MAX_LINKS) {
      const newLinks = [...links, createEmptyLink()];
      setLinks(newLinks);
      onChange(newLinks);
    }
  };

  const removeLink = (id: string) => {
    if (links.length > 1) {
      const filteredLinks = links.filter((link) => link.id !== id);
      setLinks(filteredLinks);
      onChange(filteredLinks);
    }
  };

  const handleFileUpload = (id: string, file: File | null) => {
    if (file) {
      const acceptedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (acceptedTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx)$/i)) {
        updateLink(id, "file", file);
        updateLink(id, "fileName", file.name);
      } else {
        alert("Please upload a valid document file (PDF, DOC, DOCX, TXT, XLS, XLSX)");
      }
    }
  };

  const removeFile = (id: string) => {
    updateLink(id, "file", undefined);
    updateLink(id, "fileName", undefined);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className='space-y-6'>
      {links.map((link, index) => (
        <div key={link.id} className='space-y-4'>
          {/* Header with delete button */}
          {links.length > 1 && (
            <div className='flex items-center justify-end'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeLink(link.id)}
                className='text-red-600 hover:text-red-700'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          )}

          {/* Link and Document sections */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Link Section */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='text-sm text-text-muted'>Link</div>
              </div>
              <Input
                type='url'
                placeholder='Provide a link'
                value={link.url}
                onChange={(e) => updateLink(link.id, "url", e.target.value)}
                className='py-6 text-xs shadow-none placeholder:text-xs'
              />
            </div>

            {/* Related Document Section */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='text-sm text-text-muted'>Related Document</div>
              </div>

              {link.file ? (
                <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                  <div className='flex items-center space-x-2'>
                    <FileText className='h-4 w-4 text-gray-500' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>{link.fileName}</p>
                      <p className='text-xs text-gray-500'>{link.file.size ? formatFileSize(link.file.size) : ""}</p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFile(link.id)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div className='relative'>
                  <Input
                    type='file'
                    accept='.pdf,.doc,.docx,.txt,.xls,.xlsx'
                    onChange={(e) => handleFileUpload(link.id, e.target.files?.[0] || null)}
                    className='hidden'
                    id={`file-${link.id}`}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => document.getElementById(`file-${link.id}`)?.click()}
                    className='w-fit rounded-md px-3 py-6 text-xs'
                  >
                    <span className='flex items-center gap-2'>
                      <span className='text-xs font-normal text-text-muted/80'>Upload</span>
                      <Plus className='size-3 text-black' />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Separator line if not the last item */}
          {index < links.length - 1 && <hr className='border-gray-200' />}
        </div>
      ))}

      {links.length < MAX_LINKS && (
        <Button type='button' variant='ghost' onClick={addLink} className='w-fit px-0 text-gray-700'>
          <span className='flex items-center gap-2'>
            <Plus className='size-5 stroke-[2.5px] text-black' />
            <span className='text-sm font-normal text-text-muted/80'>Add another references or testimonials</span>
          </span>
        </Button>
      )}

      {links.length >= MAX_LINKS && (
        <p className='text-center text-sm text-gray-500'>Maximum of {MAX_LINKS} references allowed</p>
      )}
    </div>
  );
}

```

# onboarding/risk-considerations.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Plus, X, Building } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RiskConsiderationItem {
  id: string;
  risk: string;
  severity: string;
  mitigation: string;
}

interface RiskConsiderationsProps {
  value?: RiskConsiderationItem[];
  onChange: (value: RiskConsiderationItem[]) => void;
  error?: string;
}

const severityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function RiskConsiderations({ value = [], onChange, error }: RiskConsiderationsProps) {
  const [items, setItems] = useState<RiskConsiderationItem[]>(() => {
    // Safely handle potentially null/undefined values
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    return [{ id: "1", risk: "", severity: "", mitigation: "" }];
  });

  const handleAddNew = () => {
    const newItem: RiskConsiderationItem = {
      id: Date.now().toString(),
      risk: "",
      severity: "",
      mitigation: "",
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  const handleRemove = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      onChange(newItems);
    }
  };

  const handleItemChange = (id: string, field: keyof RiskConsiderationItem, value: string) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-4 flex items-center space-x-3'>
        <div className='flex items-center space-x-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-500'>
            <Building className='h-3 w-3 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>3. Risk Considerations</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-6 text-sm text-gray-600'>
        Instruction: Identify potential risks and assess their severity or mitigation strategies.
      </p>

      {/* Table */}
      <div className='w-full'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='w-1/4 p-4 text-left text-sm font-medium text-gray-700'>Potential Risk</th>
                <th className='w-1/6 p-4 text-left text-sm font-medium text-gray-700'>Severity</th>
                <th className='w-1/2 p-4 text-left text-sm font-medium text-gray-700'>Mitigation Strategy</th>
                <th className='w-1/12 p-4'></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className='border-b border-gray-100'>
                  <td className='p-4'>
                    <Input
                      placeholder='e.g. Rising construction costs'
                      value={item.risk}
                      onChange={(e) => handleItemChange(item.id, "risk", e.target.value)}
                      className={cn("w-full", error && "border-red-500")}
                    />
                  </td>
                  <td className='p-4'>
                    <Select
                      value={item.severity}
                      onValueChange={(value) => handleItemChange(item.id, "severity", value)}
                    >
                      <SelectTrigger className={cn("w-full", error && "border-red-500")}>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className='p-4'>
                    <Textarea
                      placeholder='e.g. Secured fixed-rate contracts to lock pricing in early phases.'
                      value={item.mitigation}
                      onChange={(e) => handleItemChange(item.id, "mitigation", e.target.value)}
                      className={cn("min-h-[80px] w-full", error && "border-red-500")}
                      rows={3}
                    />
                  </td>
                  <td className='p-4'>
                    {items.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemove(item.id)}
                        className='h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Button
        type='button'
        onClick={handleAddNew}
        className='flex items-center gap-2 bg-blue-900 text-white hover:bg-blue-800'
      >
        <Plus className='h-4 w-4' />
        Add New
      </Button>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/screening-notice.tsx

```tsx
import React from "react";

interface ScreeningNoticeProps {
  label?: string;
}

const ScreeningNotice: React.FC<ScreeningNoticeProps> = () => {
  return (
    <div className='mt-8 text-center'>
      <p className='text-sm italic text-gray-600'>
        RC Brown Capital diligently assesses every deal and sponsor through a thorough and comprehensive screening
        process.
      </p>
    </div>
  );
};

export default ScreeningNotice;

```

# onboarding/section-header.tsx

```tsx
"use client";

interface SectionHeaderProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className='space-y-4 rounded-lg px-8 py-6 shadow-lg'>
      <h4 className='font-medium'>{label}</h4>
    </div>
  );
}

```

# onboarding/site-documents-section.tsx

```tsx
"use client";

interface SiteDocumentsSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
}

export function SiteDocumentsSection({
  // value, onChange,
  error,
  label,
}: SiteDocumentsSectionProps) {
  return (
    <div className='mb-4 mt-8'>
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>🏢</span>
        <h3 className='text-lg font-semibold text-gray-800'>{label}</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/site-documents-upload.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

// interface SiteDocumentFile {
//   id: string;
//   type: string;
//   file?: File;
//   uploaded: boolean;
// }

interface SiteDocumentsUploadProps {
  value?: Record<string, File>;
  onChange: (value: Record<string, File>) => void;
  error?: string;
}

const documentTypes = [
  { key: "floor_plan", label: "Floor Plan", required: false },
  { key: "survey_plan", label: "Survey plan", required: false },
  { key: "site_plan", label: "Site Plan", required: false },
  { key: "stacking_plan", label: "Stacking Plan", required: false },
  { key: "others", label: "Others", required: false },
];

export function SiteDocumentsUpload({ value = {}, onChange, error }: SiteDocumentsUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>(value);

  const handleFileUpload = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFiles = { ...uploadedFiles, [documentType]: file };
      setUploadedFiles(newFiles);
      onChange(newFiles);
    }
  };

  const triggerFileUpload = (documentType: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = (e) => handleFileUpload(documentType, e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  return (
    <div className='space-y-4'>
      {documentTypes.map((docType) => (
        <div key={docType.key} className='flex items-center justify-between border-b border-gray-200 py-3'>
          <div className='flex items-center'>
            <span className='font-medium text-gray-700'>{docType.label}</span>
            <div className='ml-4 h-0 flex-1 border-b border-dashed border-gray-300'></div>
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => triggerFileUpload(docType.key)}
            className={cn(
              "ml-4 flex items-center gap-2",
              uploadedFiles[docType.key] ? "border-green-200 bg-green-50 text-green-700" : ""
            )}
          >
            Upload
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      ))}

      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/size-input.tsx

```tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

interface SizeInputProps {
  value?: { size: string; unit: string } | string;
  onChange: (value: { size: string; unit: string }) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const UNIT_OPTIONS = [
  { label: "Square Feet (sq ft)", value: "sq ft" },
  { label: "Square Meters (sq m)", value: "sq m" },
  { label: "Acres (acres)", value: "acres" },
  { label: "Hectares (hectares)", value: "hectares" },
];

export const SizeInput: React.FC<SizeInputProps> = ({
  value,
  onChange,
  error,
}) => {
  // Parse initial value
  const [size, setSize] = useState("");
  const [unit, setUnit] = useState("sq ft");

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        // Try to parse string value (for backward compatibility)
        const match = value.match(/^(\d+(?:\.\d+)?)\s*(sq\s*ft|sq\s*m|acres|hectares)$/i);
        if (match) {
          setSize(match[1]);
          setUnit(match[2].toLowerCase().replace(/\s+/g, " "));
        } else {
          setSize(value);
          setUnit("sq ft");
        }
      } else if (typeof value === "object" && value.size && value.unit) {
        // Format the size value with commas if it's a number
        const sizeValue = value.size;
        if (typeof sizeValue === "string" && /^\d+/.test(sizeValue)) {
          const parts = sizeValue.split(".");
          const wholeNumber = parts[0];
          const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          const formattedValue = parts.length > 1 ? `${formattedWholeNumber}.${parts[1]}` : formattedWholeNumber;
          setSize(formattedValue);
        } else {
          setSize(sizeValue);
        }
        setUnit(value.unit);
      }
    }
  }, [value]);

  const handleSizeChange = (newSize: string) => {
    // Remove all non-numeric characters except decimal points
    const numericValue = newSize.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }

    // Format the whole number part with commas
    if (parts.length > 0) {
      const wholeNumber = parts[0];
      const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Reconstruct the number with decimal part if it exists
      const formattedValue = parts.length > 1 ? `${formattedWholeNumber}.${parts[1]}` : formattedWholeNumber;

      setSize(formattedValue);
      updateValue(formattedValue, unit); // Pass the formatted value to maintain display consistency
    } else {
      setSize(numericValue);
      updateValue(numericValue, unit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    updateValue(size, newUnit);
  };

  const updateValue = (newSize: string, newUnit: string) => {
    onChange({
      size: newSize,
      unit: newUnit,
    });
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Input
            type='text'
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            placeholder='e.g 12,000 or 1,200'
            className={`${error ? "border-red-500" : ""} border-black/80 py-6 text-xs shadow-none placeholder:text-xs`}
          />
        </div>

        <div className='w-32'>
          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger
              className={`${error ? "border-red-500" : ""} "text-xs border-black/80 py-6 text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80`}
            >
              <SelectValue className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {UNIT_OPTIONS.map((option) => (
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
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}

      <p className='hidden text-xs text-gray-500'>
        Enter the project size and select the appropriate unit of measurement
      </p>
    </div>
  );
};

```

# onboarding/sponsor-about-section.tsx

```tsx
"use client";

interface SponsorAboutSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
}

export function SponsorAboutSection({
  // value, onChange,
  error,
  label,
}: SponsorAboutSectionProps) {
  return (
    <div className='mb-4'>
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>🏢</span>
        <h3 className='text-lg font-semibold text-gray-800'>{label}</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/sponsor-background-section.tsx

```tsx
"use client";

interface SponsorBackgroundSectionProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
}

export function SponsorBackgroundSection({
  // value, onChange,
  error,
  label,
}: SponsorBackgroundSectionProps) {
  return (
    <div className='mb-4'>
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>🏢</span>
        <h3 className='text-lg font-semibold text-gray-800'>{label}</h3>
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/sponsor-information-docs.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SponsorDocument {
  id: string;
  name: string;
  file?: File;
}

interface SponsorInformationDocsProps {
  value?: { trackRecord?: File; additionalDocs?: SponsorDocument[] };
  onChange: (value: { trackRecord?: File; additionalDocs?: SponsorDocument[] }) => void;
  error?: string;
}

export function SponsorInformationDocs({
  value = { additionalDocs: [] },
  onChange,
  error,
}: SponsorInformationDocsProps) {
  const [trackRecordFile, setTrackRecordFile] = useState<File | undefined>(value.trackRecord);
  const [additionalDocs, setAdditionalDocs] = useState<SponsorDocument[]>(value.additionalDocs || []);
  const [newDocName, setNewDocName] = useState("");

  const handleTrackRecordUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTrackRecordFile(file);
      onChange({ trackRecord: file, additionalDocs });
    }
  };

  const triggerTrackRecordUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx";
    input.onchange = (e) => handleTrackRecordUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const handleAdditionalDocUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedDocs = additionalDocs.map((doc) => (doc.id === docId ? { ...doc, file } : doc));
      setAdditionalDocs(updatedDocs);
      onChange({ trackRecord: trackRecordFile, additionalDocs: updatedDocs });
    }
  };

  const triggerAdditionalDocUpload = (docId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
    input.onchange = (e) => handleAdditionalDocUpload(docId, e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const addNewDocument = () => {
    if (newDocName.trim()) {
      const newDoc: SponsorDocument = {
        id: Date.now().toString(),
        name: newDocName.trim(),
      };
      const updatedDocs = [...additionalDocs, newDoc];
      setAdditionalDocs(updatedDocs);
      setNewDocName("");
      onChange({ trackRecord: trackRecordFile, additionalDocs: updatedDocs });
    }
  };

  return (
    <div className='space-y-6'>
      <h4 className='font-medium text-gray-800'>Sponsor Information</h4>

      {/* Track Record Upload */}
      <div className='flex items-center gap-4 rounded-lg border p-4'>
        <div className='flex-1'>
          <Input type='text' value='Track Record' readOnly className='bg-gray-50' />
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={triggerTrackRecordUpload}
          className={cn(
            "flex items-center gap-2",
            trackRecordFile ? "border-green-200 bg-green-50 text-green-700" : ""
          )}
        >
          Upload
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Additional Documents */}
      {additionalDocs.length > 0 && (
        <div className='space-y-3'>
          {additionalDocs.map((doc: SponsorDocument) => (
            <div key={doc.id} className='flex items-center gap-4 rounded-lg border p-4'>
              <div className='flex-1'>
                <Input type='text' value={doc.name} readOnly className='bg-gray-50' />
              </div>

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => triggerAdditionalDocUpload(doc.id)}
                className={cn("flex items-center gap-2", doc.file ? "border-green-200 bg-green-50 text-green-700" : "")}
              >
                Upload
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add More Section */}
      <div className='space-y-3'>
        <h5 className='font-medium text-gray-700'>Add More</h5>

        <div className='flex items-center gap-4 rounded-lg border p-4'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='Enter document name'
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNewDocument()}
            />
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addNewDocument}
            disabled={!newDocName.trim()}
            className='flex items-center gap-2'
          >
            Upload
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/sponsor-logo-upload.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";

interface SponsorLogoUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function SponsorLogoUpload({ value = [], onChange, error }: SponsorLogoUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // For sponsor logo, we only want one file
    const newFiles = files.slice(0, 1);
    onChange(newFiles);
    setIsModalOpen(false);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <>
      {/* Custom Upload UI */}
      <div className='space-y-4'>
        <div className='rounded-xl border border-gray-200 p-6'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            {/* Upload GIF */}
            <div className='relative'>
              <Image src='/images/upload.gif' alt='Upload' width={80} height={80} className='mx-auto' />
            </div>

            {/* Upload Button */}
            <Button
              type='button'
              onClick={() => setIsModalOpen(true)}
              className='rounded-lg bg-blue-600 text-white hover:bg-blue-700'
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Show uploaded file */}
        {value.length > 0 && (
          <div className='space-y-2'>
            {value.map((file: File, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2'
              >
                <span className='text-sm text-text-muted'>{file.name}</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeFile(index)}
                  className='h-6 w-6 text-red-50 hover:text-red-700'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        )}

        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>

      {/* Upload Dialog - Same as FileUpload component */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-lg bg-white p-6'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>Upload Sponsor Logo</DialogTitle>
          </DialogHeader>

          <p className='mb-6 text-center text-base text-[#858585]'>Please upload your sponsor logo</p>

          {/* Drag and Drop Area */}
          <div
            className={`mb-6 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Image
              src='/images/pdf.png'
              alt='upload-document'
              width={60}
              height={60}
              className='mx-auto flex items-center justify-center'
            />
            <p className='mb-2 text-sm text-text-muted'>Drag and drop files here or click to browse</p>
            <p className='text-xs text-text-muted/70'>Supported formats: .jpg, .png, .svg</p>
            <input
              type='file'
              multiple={false}
              accept='.jpg,.jpeg,.png,.svg'
              onChange={handleFileInput}
              className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            />
          </div>

          {/* Upload Button */}
          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = false;
                input.accept = ".jpg,.jpeg,.png,.svg";
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    handleFiles(Array.from(files));
                  }
                };
                input.click();
              }}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

```

# onboarding/sponsor-metrics-table.tsx

```tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

interface SponsorMetricsData {
  yearsInOperation?: string;
  historicalPortfolioActivity?: string;
  projectsUnderManagement?: string;
  totalSquareFeetManaged?: string;
  dealsFundedByRC?: string;
  propertiesUnderManagement?: string;
  totalRealizedProjects?: string;
  propertiesDeveloped?: string;
  propertiesBuiltAndSold?: string;
  highestBudgetProject?: string;
  averageCompletionLength?: string;
}

interface SponsorMetricsTableProps {
  value?: SponsorMetricsData;
  onChange: (value: SponsorMetricsData) => void;
  error?: string;
}

const metricsConfig = [
  {
    key: "yearsInOperation",
    label: "Years in Operation",
    type: "select",
    options: [
      { label: "1 year", value: "1" },
      { label: "2 years", value: "2" },
      { label: "3 years", value: "3" },
      { label: "4 years", value: "4" },
      { label: "5 years", value: "5" },
      { label: "6+ years", value: "6+" },
    ],
    info: "How long you been active in real estate",
  },
  {
    key: "historicalPortfolioActivity",
    label: "Historical Portfolio Activity ($)",
    type: "text",
    placeholder: "e.g $25,000,000",
    info: "Total past investment volume handled across all projects",
  },
  {
    key: "projectsUnderManagement",
    label: "Projects currently under Management",
    type: "text",
    placeholder: "e.g $100,000,000",
    info: "Current total value of properties/assets the sponsor manages.",
  },
  {
    key: "totalSquareFeetManaged",
    label: "Total Square Feet Managed",
    type: "text",
    placeholder: "e.g 500,000 SQ FT",
    info: "Combined size of all properties under the sponsor's management.",
  },
  {
    key: "dealsFundedByRC",
    label: "Deals Funded by RC Brown Capital",
    type: "select",
    options: [
      { label: "0", value: "0" },
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5+", value: "5+" },
    ],
    info: "Number of projects RC Brown Capital has backed with funding.",
  },
  {
    key: "propertiesUnderManagement",
    label: "Properties under Management",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Active number of properties the sponsor is currently overseeing.",
  },
  {
    key: "totalRealizedProjects",
    label: "Total Number of Realized Projects",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Number of projects that have been fully completed and exited.",
  },
  {
    key: "propertiesDeveloped",
    label: "Number of Properties Developed",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Properties the sponsor has overseen from start to finish (development stage).",
  },
  {
    key: "propertiesBuiltAndSold",
    label: "Number of Properties Built and Sold",
    type: "select",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
    info: "Properties physically constructed by the sponsor and successfully sold.",
  },
  {
    key: "highestBudgetProject",
    label: "Highest Budget for a Project $",
    type: "text",
    placeholder: "e.g $100,000,000",
    info: "The largest single-project budget the sponsor has worked with.",
  },
  {
    key: "averageCompletionLength",
    label: "Average Length of Completion",
    type: "select",
    options: [
      { label: "6 Months", value: "6" },
      { label: "12 Months", value: "12" },
      { label: "18 Months", value: "18" },
      { label: "24 Months", value: "24" },
      { label: "30 Months", value: "30" },
      { label: "36+ Months", value: "36+" },
    ],
    info: "Typical number of months taken to complete a development project.",
  },
];

export function SponsorMetricsTable({ value = {}, onChange, error }: SponsorMetricsTableProps) {
  const [metrics, setMetrics] = useState<SponsorMetricsData>(value);

  const handleMetricChange = (key: string, newValue: string) => {
    const updatedMetrics = { ...metrics, [key]: newValue };
    setMetrics(updatedMetrics);
    onChange(updatedMetrics);
  };

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b'>
              <th className='p-3 text-left font-medium'>Category</th>
              <th className='p-3 text-left font-medium'>Input</th>
              <th className='p-3 text-left font-medium'>Brief info</th>
            </tr>
          </thead>
          <tbody>
            {metricsConfig.map((metric) => (
              <tr key={metric.key} className='border-b'>
                <td className='p-3 font-medium'>{metric.label}</td>
                <td className='p-3'>
                  {metric.type === "select" ? (
                    <Select
                      value={metrics[metric.key as keyof SponsorMetricsData] || ""}
                      onValueChange={(value) => handleMetricChange(metric.key, value)}
                    >
                      <SelectTrigger className={cn("w-full", error && "border-red-500")}>
                        <SelectValue
                          placeholder={
                            metric.key === "yearsInOperation"
                              ? "2 years"
                              : metric.key === "dealsFundedByRC"
                                ? "2"
                                : metric.key === "propertiesUnderManagement"
                                  ? "2"
                                  : metric.key === "totalRealizedProjects"
                                    ? "2"
                                    : metric.key === "propertiesDeveloped"
                                      ? "2"
                                      : metric.key === "propertiesBuiltAndSold"
                                        ? "2"
                                        : metric.key === "averageCompletionLength"
                                          ? "12 Months"
                                          : "Select"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {metric.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type='text'
                      placeholder={metric.placeholder || "Enter value"}
                      value={metrics[metric.key as keyof SponsorMetricsData] || ""}
                      onChange={(e) => handleMetricChange(metric.key, e.target.value)}
                      className={cn(error && "border-red-500")}
                    />
                  )}
                </td>
                <td className='p-3 text-sm text-gray-600'>{metric.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/submit-project.tsx

```tsx
import React from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FormFieldValue } from "@/src/types/onboarding";

interface SubmitProjectProps {
  value?: FormFieldValue;
  onChange?: (value: FormFieldValue) => void;
}

const SubmitProject: React.FC<SubmitProjectProps> = () =>
  // { value, onChange }
  {
    const handleSubmitProject = () => {
      // Submit project logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='flex justify-end'>
          <Button
            type='button'
            onClick={handleSubmitProject}
            className='flex items-center space-x-2 rounded-md bg-blue-900 px-8 py-3 text-lg font-medium text-white hover:bg-blue-800'
          >
            <span>Submit project</span>
            <ArrowRight className='h-5 w-5' />
          </Button>
        </div>
      </div>
    );
  };

export default SubmitProject;

```

# onboarding/supporting-documents.tsx

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface UploadedDocument {
  id: string;
  categoryKey: string;
  categoryLabel: string;
  fileName: string;
  fileSize: number;
  file: File;
}

interface SupportingDocumentsProps {
  value?: UploadedDocument[];
  onChange: (documents: UploadedDocument[]) => void;
}

export function SupportingDocuments({ value = [], onChange }: SupportingDocumentsProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>(() => (Array.isArray(value) ? value : []));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<{ key: string; label: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    { key: "company_registration", label: "Company Registration documents" },
    { key: "licenses", label: "Licenses" },
    { key: "company_brochures", label: "Company brochures" },
    { key: "tax_certificate", label: "Tax Certificate" },
    { key: "project_profiles", label: "Project profiles, Title, Ownership and Legal documents" },
    { key: "project_permit", label: "Project Permit" },
    { key: "survey_plan", label: "Survey Plan" },
    { key: "others", label: "Others" },
  ];

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const acceptedExtensions = ".pdf,.doc,.docx,.txt,.xls,.xlsx";

  // Sync documents state when value prop changes
  useEffect(() => {
    setDocuments(Array.isArray(value) ? value : []);
  }, [value]);

  const openUploadModal = (category: { key: string; label: string }) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveCategory(null);
    setIsDragOver(false);
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || !activeCategory) return;

    const newDocuments: UploadedDocument[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (acceptedFileTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|xls|xlsx)$/i)) {
        const uploadedDoc: UploadedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          categoryKey: activeCategory.key,
          categoryLabel: activeCategory.label,
          fileName: file.name,
          fileSize: file.size,
          file,
        };
        newDocuments.push(uploadedDoc);
      }
    });

    const updatedDocuments = [...(documents || []), ...newDocuments];
    setDocuments(updatedDocuments);
    onChange(updatedDocuments);
    closeModal();
  };

  const removeDocument = (id: string) => {
    const filteredDocuments = (documents || []).filter((doc) => doc.id !== id);
    setDocuments(filteredDocuments);
    onChange(filteredDocuments);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCategoryDocuments = (categoryKey: string) => {
    // Defensive check to ensure documents is always an array
    return (documents || []).filter((doc) => doc.categoryKey === categoryKey);
  };

  return (
    <div className='space-y-4'>
      {/* Document Categories List */}
      <div className='space-y-4'>
        {documentCategories.map((category) => {
          const categoryDocs = getCategoryDocuments(category.key);

          return (
            <div key={category.key}>
              {/* Category Row */}
              <div className='flex items-center justify-between py-3 lg:w-[140%]'>
                <span className='whitespace-nowrap text-sm text-gray-700 lg:whitespace-normal'>{category.label}</span>
                <div className='mx-4 flex-1 border-b border-dashed border-text-muted'></div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => openUploadModal(category)}
                  className='flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-6 text-sm'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-xs font-normal text-text-muted/80'>Upload</span>
                    <Plus className='size-3 text-black' />
                  </span>
                </Button>
              </div>

              {/* Show uploaded documents for this category */}
              {categoryDocs.length > 0 && (
                <div className='ml-4 space-y-2'>
                  {categoryDocs.map((doc) => (
                    <div key={doc.id} className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-gray-500' />
                        <div>
                          <p className='text-xs font-medium text-gray-900'>{doc.fileName}</p>
                          <p className='text-xs text-gray-500'>{formatFileSize(doc.fileSize)}</p>
                        </div>
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeDocument(doc.id)}
                        className='h-6 w-6 p-0 text-red-600 hover:text-red-700'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-lg rounded-2xl bg-white p-6 pt-10'>
          <DialogHeader>
            <DialogTitle className='rounded-2xl text-center text-sm font-semibold text-primary'>
              Upload Supporting Documents
            </DialogTitle>
            <DialogDescription className='text-center text-sm text-[#858585]'>
              Please upload only relevant documents for this project
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Category being uploaded to */}
            {activeCategory && (
              <div className='mb-4 text-xs text-gray-600'>
                Uploading to: <span className='font-medium'>{activeCategory.label}</span>
              </div>
            )}

            {/* Drag and Drop Area */}
            <div
              className={cn(
                "cursor-pointer rounded-lg border-2 border-dashed bg-background-secondary p-8 text-center transition-colors",
                isDragOver ? "border-primary bg-blue-50" : "border-black/10 hover:border-black/20"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* PDF Icon */}

              <Image
                src='/images/pdf.png'
                alt='upload-document'
                width={55}
                height={55}
                className='mx-auto flex items-center justify-center'
              />

              <p className='mb-2 text-sm text-gray-600'>
                Drag and drop your documents here, or{" "}
                <span className='text-blue-600 underline hover:text-blue-700'>click to browse</span>
              </p>
              <p className='text-xs text-gray-500'>Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX</p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept={acceptedExtensions}
              onChange={(e) => handleFileSelect(e.target.files)}
              className='hidden'
            />

            <div className='flex w-full justify-end'>
              {/* Upload Button */}
              <Button type='button' onClick={() => fileInputRef.current?.click()} className='px-12 py-6 text-xs'>
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

# onboarding/terms-checkbox.tsx

```tsx
"use client";

import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";

interface TermsCheckboxProps {
  value?: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermsCheckbox({ value = false, onChange, error }: TermsCheckboxProps) {
  return (
    <div className='max-w-[300px] space-y-2'>
      <div className='flex items-start space-x-2'>
        <Checkbox
          id='terms-checkbox'
          checked={value}
          onCheckedChange={(checked: boolean) => onChange(checked === true)}
          className='mt-0.5 text-white'
        />
        <Label htmlFor='terms-checkbox' className='cursor-pointer text-xs font-normal leading-relaxed'>
          I have read and accept the{" "}
          <a
            href='/terms-and-conditions'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            terms and conditions
          </a>{" "}
          and{" "}
          <a
            href='/privacy-policy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#55A2F0] underline hover:text-[#55A2F0]/80'
          >
            Privacy Policy
          </a>
        </Label>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}

```

# onboarding/utility-bill-upload.tsx

```tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { FileText, X, Paperclip } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface UtilityBillFile {
  id: string;
  name: string;
  size: number;
  file: File;
}

interface UtilityBillUploadProps {
  value?: UtilityBillFile | null;
  onChange: (file: UtilityBillFile | null) => void;
}

export function UtilityBillUpload({ value = null, onChange }: UtilityBillUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UtilityBillFile | null>(value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

  const acceptedExtensions = ".pdf,.jpg,.jpeg,.png";

  const openUploadModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDragOver(false);
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (acceptedFileTypes.includes(selectedFile.type) || selectedFile.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      const file: UtilityBillFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name,
        size: selectedFile.size,
        file: selectedFile,
      };

      setUploadedFile(file);
      onChange(file);
      closeModal();
    } else {
      alert("Please upload a valid file (PDF, JPG, JPEG, PNG)");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onChange(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0] || null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className='w-1/2 space-y-3'>
      {uploadedFile ? (
        <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
          <div className='flex items-center space-x-2'>
            <FileText className='h-4 w-4 text-gray-500' />
            <div>
              <p className='text-sm font-medium text-gray-900'>{uploadedFile.name}</p>
              <p className='text-xs text-gray-500'>{formatFileSize(uploadedFile.size)}</p>
            </div>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={removeFile}
            className='text-red-600 hover:text-red-700'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div className='flex items-center gap-4 whitespace-nowrap lg:w-[130%]'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='e.g water, electricity, gas'
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              readOnly
            />
          </div>
          <Button type='button' onClick={openUploadModal} className='rounded-lg px-6 py-2 text-white'>
            <span className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>Upload</span>
              <Paperclip className='h-4 w-4' />
            </span>
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md rounded-2xl bg-white'>
          <DialogHeader>
            <DialogTitle className='text-center text-base font-semibold text-primary'>Upload Utility Bill</DialogTitle>
            <DialogDescription className='text-center text-base text-[#858585]'>
              Please upload only relevant documents (3 months)
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Drag and Drop Area */}
            <div
              className={cn(
                "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* PDF Icon */}
              <Image
                src='/images/pdf.png'
                alt='upload-document'
                width={60}
                height={60}
                className='mx-auto flex items-center justify-center'
              />

              <p className='mb-2 text-sm text-gray-600'>
                Drag and drop your utility bill here, or{" "}
                <span className='text-blue-600 underline hover:text-blue-700'>click to browse</span>
              </p>
              <p className='text-xs text-gray-500'>Supported formats: PDF, JPG, JPEG, PNG</p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type='file'
              accept={acceptedExtensions}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              className='hidden'
            />

            {/* Upload Button */}
            <Button type='button' onClick={() => fileInputRef.current?.click()} className='w-full text-white'>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

