"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface RiskConsiderationItem {
  potential_risk: string;
  assessment_mitigation: string;
}

interface RiskConsiderationsProps {
  value?: RiskConsiderationItem[];
  onChange: (value: RiskConsiderationItem[]) => void;
  error?: string;
}

// const severityOptions = [
//   { value: "Low", label: "Low" },
//   { value: "Medium", label: "Medium" },
//   { value: "High", label: "High" },
// ];

export function RiskConsiderations({ value = [], onChange, error }: RiskConsiderationsProps) {
  const [items, setItems] = useState<RiskConsiderationItem[]>(() => {
    // Safely handle potentially null/undefined values
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    return [{ potential_risk: "", assessment_mitigation: "" }];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<{ potential_risk: string; assessment_mitigation: string }>({
    potential_risk: "",
    assessment_mitigation: "",
  });

  const handleAddNew = () => {
    const newItem: RiskConsiderationItem = {
      potential_risk: "",
      assessment_mitigation: "",
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  const handleConfirmAdd = () => {
    if (newItem.potential_risk.trim() && newItem.assessment_mitigation.trim()) {
      const newItemWithId: RiskConsiderationItem = {
        potential_risk: newItem.potential_risk,
        assessment_mitigation: newItem.assessment_mitigation,
      };
      const newItems = [...items, newItemWithId];
      setItems(newItems);
      onChange(newItems);

      // Reset form and close modal
      setNewItem({ potential_risk: "", assessment_mitigation: "" });
      setIsModalOpen(false);
    }
  };

  const handleRemove = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      onChange(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof RiskConsiderationItem, value: string) => {
    const newItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-4 flex items-center space-x-3'>
        <div className='flex items-center space-x-2'>
          <div className='flex items-center justify-center'>
            <Image src='/icons/feedback.svg' alt='Business Plan Rating' width={24} height={24} />
          </div>
          <h3 className='text-base font-semibold text-text-muted'>3. Risk Considerations</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-6 text-sm text-text-muted'>
        Instruction: Identify potential risks and assess their severity or mitigation strategies.
      </p>

      {/* Table */}
      <div className='w-full'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='w-1/4 p-4 text-left text-sm text-text-muted/80'>Potential Risk</th>
                <th className='w-1/2 p-4 text-left text-sm text-text-muted/80'>Assessment / Mitigation</th>
                <th className='w-1/12 p-4'></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className='border-b border-black/10'>
                  <td className='p-4 align-top'>
                    <Input
                      placeholder='e.g. Rising construction costs'
                      value={item.potential_risk}
                      onChange={(e) => handleItemChange(index, "potential_risk", e.target.value)}
                      className={cn(
                        "w-full rounded-none border-b-[1px] border-l-0 border-r-0 border-t-0 border-black/20 text-sm text-text-muted/80 shadow-none placeholder:text-sm focus-visible:ring-0",
                        error && "border-red-500"
                      )}
                    />
                  </td>
                  <td className='p-4 align-top'>
                    <Textarea
                      placeholder='e.g. Secured fixed-rate contracts to lock pricing in early phases.'
                      value={item.assessment_mitigation}
                      onChange={(e) => handleItemChange(index, "assessment_mitigation", e.target.value)}
                      className={cn("min-h-[145px] w-full shadow-none", error && "border-red-500")}
                      rows={3}
                    />
                  </td>
                  <td className='p-4'>
                    {items.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemove(index)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button type='button' onClick={handleAddNew} className='flex items-center gap-2 px-3 py-6 has-[>svg]:px-3'>
            Add New
            <Plus className='size-4 stroke-[3px] text-white' />
          </Button>
        </DialogTrigger>
        <DialogContent className='border-none px-12 py-14 outline-none sm:max-w-[525px]'>
          <DialogHeader className='sm:text-center'>
            <DialogTitle className='text-primary'>Deal Snapshot</DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-1 flex flex-col gap-2'>
              <label className='text-sm text-text-muted/80'>Potential Risk</label>
              <label className='text-sm text-text-muted/80'>Mitigations</label>
            </div>
            <div className='col-span-3 space-y-2'>
              <Input
                placeholder='Enter potential risk'
                value={newItem.potential_risk}
                onChange={(e) => setNewItem({ ...newItem, potential_risk: e.target.value })}
                className='w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-sm'
              />
              <Textarea
                placeholder='Enter assessment/mitigation'
                value={newItem.assessment_mitigation}
                onChange={(e) => setNewItem({ ...newItem, assessment_mitigation: e.target.value })}
                className='min-h-[175px] w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-sm'
                rows={4}
              />
            </div>
          </div>
          <div className='flex justify-end pt-4'>
            <Button
              onClick={handleConfirmAdd}
              disabled={!newItem.potential_risk.trim() || !newItem.assessment_mitigation.trim()}
              className='bg-primary text-white hover:bg-primary/90'
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
