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
