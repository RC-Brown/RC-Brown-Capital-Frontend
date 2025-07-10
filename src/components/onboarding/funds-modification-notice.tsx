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
