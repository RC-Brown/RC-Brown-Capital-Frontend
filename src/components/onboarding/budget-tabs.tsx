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
