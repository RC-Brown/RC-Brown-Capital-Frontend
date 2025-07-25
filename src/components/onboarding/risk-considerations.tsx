"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
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

// const severityOptions = [
//   { value: "low", label: "Low" },
//   { value: "medium", label: "Medium" },
//   { value: "high", label: "High" },
// ];

export function RiskConsiderations({ value = [], onChange, error }: RiskConsiderationsProps) {
  const [items, setItems] = useState<RiskConsiderationItem[]>(() => {
    // Safely handle potentially null/undefined values
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    return [{ id: "1", risk: "", severity: "", mitigation: "" }];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<{ risk: string; mitigation: string }>({
    risk: "",
    mitigation: "",
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

  const handleConfirmAdd = () => {
    if (newItem.risk.trim() && newItem.mitigation.trim()) {
      const newItemWithId: RiskConsiderationItem = {
        id: Date.now().toString(),
        risk: newItem.risk,
        mitigation: newItem.mitigation,
        severity: "",
      };
      const newItems = [...items, newItemWithId];
      setItems(newItems);
      onChange(newItems);

      // Reset form and close modal
      setNewItem({ risk: "", mitigation: "" });
      setIsModalOpen(false);
    }
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
          <div className='flex items-center justify-center'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g clip-path='url(#clip0_1683_2389)'>
                <path
                  d='M12.4168 0.664391L13.0504 1.93679L14.4068 2.17199C14.782 2.23719 14.9312 2.71599 14.6644 2.99839L13.6996 4.01959L13.9044 5.43719C13.9612 5.82919 13.5704 6.12519 13.23 5.94799L12 5.30679L10.77 5.94799C10.4296 6.12519 10.0392 5.82959 10.0956 5.43719L10.3004 4.01959L9.3356 2.99839C9.0688 2.71599 9.218 2.23719 9.5932 2.17199L10.9496 1.93679L11.5832 0.664391C11.7584 0.312391 12.2416 0.312391 12.4168 0.664391Z'
                  fill='#F9C82B'
                />
                <path
                  d='M5.21661 3.86361L5.85021 5.13601L7.20661 5.37121C7.58181 5.43641 7.73101 5.91521 7.46421 6.19761L6.49941 7.21881L6.70421 8.63641C6.76101 9.02841 6.37021 9.32441 6.02981 9.14721L4.79981 8.50601L3.56981 9.14721C3.22941 9.32441 2.83901 9.02881 2.89541 8.63641L3.10021 7.21881L2.13541 6.19761C1.86861 5.91521 2.01781 5.43641 2.39301 5.37121L3.74941 5.13601L4.38301 3.86361C4.55821 3.51161 5.04141 3.51161 5.21661 3.86361Z'
                  fill='#F9C82B'
                />
                <path
                  d='M19.6165 3.86361L20.2501 5.13601L21.6065 5.37121C21.9817 5.43641 22.1309 5.91521 21.8641 6.19761L20.8993 7.21881L21.1041 8.63641C21.1609 9.02841 20.7701 9.32441 20.4297 9.14721L19.1997 8.50601L17.9697 9.14721C17.6293 9.32441 17.2389 9.02881 17.2953 8.63641L17.5001 7.21881L16.5353 6.19761C16.2685 5.91521 16.4177 5.43641 16.7929 5.37121L18.1493 5.13601L18.7829 3.86361C18.9581 3.51161 19.4413 3.51161 19.6165 3.86361Z'
                  fill='#F9C82B'
                />
                <path
                  d='M7.7599 17.3604C6.6719 18.4484 5.9999 19.9444 5.9999 21.6004C5.9999 21.8204 5.8199 22.0004 5.5999 22.0004H0.799902C0.579902 22.0004 0.399902 21.8204 0.399902 21.6004C0.399902 18.4004 1.6999 15.5044 3.7999 13.4004H4.1999L7.5999 16.8004L7.7599 17.3604Z'
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
                  d='M13.4881 22.5832C15.4081 21.5432 18.4281 19.7512 20.7081 18.3872C21.1241 18.1352 20.8321 17.5072 20.3761 17.6632C17.8601 18.5272 14.5481 19.6832 12.5161 20.4872L13.4881 22.5832Z'
                  fill='#0A365E'
                />
                <path
                  d='M11.9999 23.6004C12.8836 23.6004 13.5999 22.884 13.5999 22.0004C13.5999 21.1167 12.8836 20.4004 11.9999 20.4004C11.1162 20.4004 10.3999 21.1167 10.3999 22.0004C10.3999 22.884 11.1162 23.6004 11.9999 23.6004Z'
                  fill='#06293F'
                />
              </g>
              <defs>
                <clipPath id='clip0_1683_2389'>
                  <rect width='24' height='24' fill='white' />
                </clipPath>
              </defs>
            </svg>
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
              {items.map((item) => (
                <tr key={item.id} className='border-b border-black/10'>
                  <td className='p-4 align-top'>
                    <Input
                      placeholder='e.g. Rising construction costs'
                      value={item.risk}
                      onChange={(e) => handleItemChange(item.id, "risk", e.target.value)}
                      className={cn(
                        "w-full rounded-none border-b-[1px] border-l-0 border-r-0 border-t-0 border-black/20 text-sm text-text-muted/80 shadow-none placeholder:text-sm focus-visible:ring-0",
                        error && "border-red-500"
                      )}
                    />
                  </td>
                  <td className='p-4 align-top'>
                    <Textarea
                      placeholder='e.g. Secured fixed-rate contracts to lock pricing in early phases.'
                      value={item.mitigation}
                      onChange={(e) => handleItemChange(item.id, "mitigation", e.target.value)}
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
                placeholder='Enter header'
                value={newItem.risk}
                onChange={(e) => setNewItem({ ...newItem, risk: e.target.value })}
                className='w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-sm'
              />
              <Textarea
                placeholder='Enter description'
                value={newItem.mitigation}
                onChange={(e) => setNewItem({ ...newItem, mitigation: e.target.value })}
                className='min-h-[175px] w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-sm'
                rows={4}
              />
            </div>
          </div>
          <div className='flex justify-end pt-4'>
            <Button
              onClick={handleConfirmAdd}
              disabled={!newItem.risk.trim() || !newItem.mitigation.trim()}
              className='bg-primary text-white hover:bg-primary/90'
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
