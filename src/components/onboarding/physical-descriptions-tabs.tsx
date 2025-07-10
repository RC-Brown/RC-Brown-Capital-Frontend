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
