import Image from "next/image";
import React from "react";

const payoutsData = [
  {
    id: 1,
    project: "Lekki Pearl Residences",
    payoutType: "ROI",
    investor: "Investor #105",
    amount: "₦1,200,000",
    dueDate: "June 28, 2025",
    status: "Upcoming",
  },
  {
    id: 2,
    project: "Lekki Pearl Residences",
    payoutType: "Dividend",
    investor: "Investor #209",
    amount: "₦800,000",
    dueDate: "July 15, 2025",
    status: "Upcoming",
  },
  {
    id: 3,
    project: "Lekki Pearl Residences",
    payoutType: "ROI",
    investor: "Investor #105",
    amount: "₦1,200,000",
    dueDate: "June 28, 2025",
    status: "Upcoming",
  },
];

export default function UpcomingPayoutsAndDividendsTable() {
  return (
    <div className=''>
      <div className='mb-6 flex items-center justify-between px-5 py-6'>
        <div className='flex items-end gap-3'>
          <h2 className='oxy text-2xl font-bold leading-[100%] -tracking-[3%] text-text-muted'>
            Upcoming Payouts & Dividends
          </h2>
          <span className='flex size-5 items-center justify-center rounded-full bg-[#FAA7A7] text-xs'>
            {payoutsData.length}
          </span>
        </div>
      </div>

      <div>
        {/* Header */}
        <div className='grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr,1fr] gap-4 border-b border-black/10 px-10 pb-4'>
          <div className='text-sm font-medium text-text-muted'>Project</div>
          <div className='text-sm font-medium text-text-muted'>Payout Type</div>
          <div className='text-sm font-medium text-text-muted'>Investor</div>
          <div className='text-sm font-medium text-text-muted'>Amount</div>
          <div className='text-sm font-medium text-text-muted'>Due Date</div>
          <div className='text-sm font-medium text-text-muted'>Status</div>
        </div>

        {/* Rows */}
        <div className='mt-2 flex flex-col gap-2 px-5 py-4'>
          {payoutsData.map((payout) => (
            <div
              key={payout.id}
              className='grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr,1fr] gap-4 rounded-[10px] border border-black/5 p-5'
            >
              <div className='text-sm text-text-muted'>{payout.project}</div>
              <div className='text-sm text-text-muted'>{payout.payoutType}</div>
              <div className='text-sm text-text-muted'>{payout.investor}</div>
              <div className='text-sm text-text-muted'>{payout.amount}</div>
              <div className='text-sm text-text-muted'>{payout.dueDate}</div>
              <div className='flex flex-col gap-2'>
                <Image
                  src='/icons/upcoming.svg'
                  alt='upcoming'
                  width={20}
                  height={20}
                />

                <span className='text-sm text-text-muted'>{payout.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
