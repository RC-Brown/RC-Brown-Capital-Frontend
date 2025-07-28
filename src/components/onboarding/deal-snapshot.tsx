"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import Image from "next/image";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<{ header: string; description: string }>({
    header: "",
    description: "",
  });

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAdd = () => {
    if (newItem.header.trim() && newItem.description.trim()) {
      const newItemWithId: DealSnapshotItem = {
        id: Date.now().toString(),
        header: newItem.header,
        description: newItem.description,
      };
      const newItems = [...items, newItemWithId];
      setItems(newItems);
      onChange(newItems);

      // Reset form and close modal
      setNewItem({ header: "", description: "" });
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

  const handleItemChange = (id: string, field: keyof DealSnapshotItem, value: string) => {
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
            <Image src='/icons/feedback.svg' alt='Business Plan Rating' width={24} height={24} />
          </div>
          <h3 className='text-base font-semibold text-text-muted'>2. Deal Snapshot</h3>
        </div>
      </div>

      {/* Instruction */}
      <p className='mb-6 -tracking-[3%] text-text-muted'>
        Instruction: Highlight the key points that make this project valuable. Use short, impactful headers and a brief
        description
      </p>

      {/* Table */}
      <div className='w-full'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='w-1/3 p-4 text-left font-medium text-text-muted'>Header</th>
                <th className='w-2/3 p-4 text-left font-medium text-text-muted'>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className='border-b border-gray-100'>
                  <td className='p-4 align-top'>
                    <Input
                      placeholder='e.g. Prime Location'
                      value={item.header}
                      onChange={(e) => handleItemChange(item.id, "header", e.target.value)}
                      className={cn(
                        "w-full rounded-none border-b-[1px] border-l-0 border-r-0 border-t-0 border-black/20 text-sm text-text-muted/80 shadow-none placeholder:text-sm focus-visible:ring-0",
                        error && "border-red-500"
                      )}
                    />
                  </td>
                  <td className='p-4 align-top'>
                    <div className='flex items-start space-x-2'>
                      <Textarea
                        placeholder='e.g. Located in a fast-growing urban district with increasing rental demand'
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className={cn("min-h-[145px] flex-1 shadow-none", error && "border-red-500")}
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

      {/* Add New Button with Modal */}
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
              <label className='text-sm text-text-muted/80'>Header</label>
              <label className='text-sm text-text-muted/80'>Descriptions</label>
            </div>
            <div className='col-span-3 space-y-2'>
              <Input
                placeholder='Enter header'
                value={newItem.header}
                onChange={(e) => setNewItem({ ...newItem, header: e.target.value })}
                className='w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-sm'
              />
              <Textarea
                placeholder='Enter description'
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className='min-h-[175px] w-full border-black/10 text-sm text-text-muted/80 shadow-none placeholder:text-sm'
                rows={4}
              />
            </div>
          </div>
          <div className='flex justify-end pt-4'>
            <Button
              onClick={handleConfirmAdd}
              disabled={!newItem.header.trim() || !newItem.description.trim()}
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
