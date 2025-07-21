import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

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
    projectMonths?: string;
    addingSquareFootage?: string;
    expansionMethod?: string;
  };
}

interface BudgetTabsProps {
  value?: BudgetTabData;
  onChange?: (value: BudgetTabData) => void;
  error?: string;
}

const BudgetTabs: React.FC<BudgetTabsProps> = ({ value = {}, onChange, error }) => {
  const [activeTab, setActiveTab] = useState("property-address");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modalData, setModalData] = useState<any>({});

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

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    setModalData(value[tabKey as keyof BudgetTabData] || {});
    setIsModalOpen(true);
  };

  const handleModalSave = () => {
    const updatedValue = {
      ...value,
      [activeTab]: modalData,
    };
    onChange?.(updatedValue);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const renderModalContent = () => {
    switch (activeTab) {
      case "property-address":
        return (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <label className='whitespace-nowrap text-sm font-medium text-text-muted'>Enter Address:</label>
              <Input
                placeholder='Enter property address'
                value={modalData.address || ""}
                onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                className='w-full py-6 text-xs text-text-muted shadow-none placeholder:text-xs'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap text-sm font-medium text-text-muted'>City:</label>
                <Input
                  placeholder='Enter city'
                  value={modalData.city || ""}
                  onChange={(e) => setModalData({ ...modalData, city: e.target.value })}
                  className='w-full py-6 text-xs text-text-muted shadow-none placeholder:text-xs'
                />
              </div>
              <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap text-sm font-medium text-text-muted'>State:</label>
                <Input
                  placeholder='Enter state'
                  value={modalData.state || ""}
                  onChange={(e) => setModalData({ ...modalData, state: e.target.value })}
                  className='w-full py-6 text-xs text-text-muted shadow-none placeholder:text-xs'
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <label className='whitespace-nowrap text-sm font-medium text-text-muted'>Zip Code:</label>
              <Input
                placeholder='Enter zip code'
                value={modalData.zipCode || ""}
                onChange={(e) => setModalData({ ...modalData, zipCode: e.target.value })}
                className='w-full py-6 text-xs text-text-muted shadow-none placeholder:text-xs'
              />
            </div>
          </div>
        );

      case "description-work":
        return (
          <div className='space-y-4'>
            <p className='text-sm text-gray-600'>
              Please provide a narrative of the rehab required. Please go into detail about any additions, conversions
              or redesigns. Typically the more detail you provide, both in the narrative and in the line items, the
              better outcome of the After Repair Valuation.
            </p>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Description:</label>
              <Textarea
                placeholder='Enter detailed description of work required...'
                value={modalData.description || ""}
                onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                className='min-h-[200px] w-full border-dashed'
              />
            </div>
          </div>
        );

      case "project-timeline":
        return (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-gray-700'>How many months will the project take?</label>
              <Input
                placeholder='Enter number of months'
                value={modalData.projectMonths || ""}
                onChange={(e) => setModalData({ ...modalData, projectMonths: e.target.value })}
                className='w-full max-w-[270px] py-6 text-xs text-text-muted shadow-none placeholder:text-xs'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-gray-700'>
                Are you adding square footage to this property?
              </label>
              <Input
                placeholder='Yes/No'
                value={modalData.addingSquareFootage || ""}
                onChange={(e) => setModalData({ ...modalData, addingSquareFootage: e.target.value })}
                className='w-full max-w-[270px] py-6 text-xs text-text-muted shadow-none placeholder:text-xs'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-gray-700'>How do you plan to expand the square footage?</label>
              <Select
                value={modalData.expansionMethod || ""}
                onValueChange={(selectedValue) => setModalData({ ...modalData, expansionMethod: selectedValue })}
              >
                <SelectTrigger className='w-full max-w-[270px] py-6 text-xs text-text-muted shadow-none placeholder:text-xs'>
                  <SelectValue placeholder='Select expansion method' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='finishing_attic' className='hover:bg-primary hover:text-white'>
                    Finishing Attic
                  </SelectItem>
                  <SelectItem value='basement_finish' className='hover:bg-primary hover:text-white'>
                    Basement
                  </SelectItem>
                  <SelectItem value='addition' className='hover:bg-primary hover:text-white'>
                    Addition
                  </SelectItem>
                  <SelectItem value='garage_conversion' className='hover:bg-primary hover:text-white'>
                    Garage Conversion
                  </SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='mb-6 w-full'>
      <div className='flex space-x-4'>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-600 transition-colors hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-600`}
            onClick={() => handleTabClick(tab.key)}
          >
            <span className='text-sm font-medium'>{tab.label}</span>
            <ArrowRightIcon className='h-4 w-4 -rotate-12 stroke-[2.5px]' />
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='font-semibold text-gray-900'>{tabs.find((tab) => tab.key === activeTab)?.label}</h3>
              <button onClick={handleModalClose} className='text-black hover:text-black/80'>
                <X className='h-5 w-5' />
              </button>
            </div>

            {renderModalContent()}

            <div className='mt-6 flex justify-end'>
              <Button onClick={handleModalSave} className='px-8 py-6'>
                {activeTab === "description-work" ? "Save" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </div>
  );
};

export default BudgetTabs;
