"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, X, Building } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RiskConsiderationItem {
  id: string;
  potentialRisk: string;
  assessmentMitigation: string;
}

interface RiskConsiderationsProps {
  value?: RiskConsiderationItem[];
  onChange: (value: RiskConsiderationItem[]) => void;
  error?: string;
}

export function RiskConsiderations({ value = [], onChange, error }: RiskConsiderationsProps) {
  const [items, setItems] = useState<RiskConsiderationItem[]>(
    value.length > 0 ? value : [{ id: "1", potentialRisk: "", assessmentMitigation: "" }]
  );

  const handleAddNew = () => {
    const newItem: RiskConsiderationItem = {
      id: Date.now().toString(),
      potentialRisk: "",
      assessmentMitigation: "",
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

  //   return (
  //     items.length > 0 &&
  //     items.every(
  //       (item) =>
  //         item.potentialRisk.trim() !== "" &&
  //         item.assessmentMitigation.trim() !== "" &&
  //         item.assessmentMitigation.length >= 10
  //     )
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
                <th className='w-1/3 p-4 text-left text-sm font-medium text-gray-700'>Potential Risk</th>
                <th className='w-2/3 p-4 text-left text-sm font-medium text-gray-700'>Assessment / Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className='border-b border-gray-100'>
                  <td className='p-4'>
                    <Input
                      placeholder='e.g. Rising construction costs'
                      value={item.potentialRisk}
                      onChange={(e) => handleItemChange(item.id, "potentialRisk", e.target.value)}
                      className={cn("w-full", error && "border-red-500")}
                    />
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center space-x-2'>
                      <Textarea
                        placeholder='e.g. Assessment: Secured fixed-rate contracts to lock pricing in early phases.'
                        value={item.assessmentMitigation}
                        onChange={(e) => handleItemChange(item.id, "assessmentMitigation", e.target.value)}
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
