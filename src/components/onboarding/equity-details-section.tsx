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
