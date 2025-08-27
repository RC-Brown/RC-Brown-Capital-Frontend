import Image from "next/image";
import React from "react";
import { UpcomingPayout } from "@/src/types/dashboard";
import { formatCurrency } from "@/src/lib/utils";

interface UpcomingPayoutsAndDividendsTableProps {
  payouts?: UpcomingPayout[];
}

export default function UpcomingPayoutsAndDividendsTable({ payouts = [] }: UpcomingPayoutsAndDividendsTableProps) {
  return (
    <div className=''>
      <div className='mb-6 flex items-center justify-between px-5 py-6'>
        <div className='flex items-end gap-3'>
          <h2 className='oxy text-2xl font-bold leading-[100%] -tracking-[3%] text-text-muted'>
            Upcoming Payouts & Dividends
          </h2>
          <span className='flex size-5 items-center justify-center rounded-full bg-[#FAA7A7] text-xs'>
            {payouts.length}
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
          {payouts.length === 0 ? (
            <div className='py-8 text-center text-gray-500'>
              <p>No upcoming payouts at the moment</p>
            </div>
          ) : (
            payouts.map((payout: UpcomingPayout) => (
              <div
                key={payout.id}
                className='grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr,1fr] gap-4 rounded-[10px] border border-black/5 p-5'
              >
                <div className='text-sm text-text-muted'>Project #{payout.project_id}</div>
                <div className='text-sm text-text-muted'>ROI</div>
                <div className='text-sm text-text-muted'>Investor</div>
                <div className='text-sm text-text-muted'>{formatCurrency(payout.amount)}</div>
                <div className='text-sm text-text-muted'>
                  {new Date(payout.scheduled_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className='flex flex-col gap-2'>
                  <Image src='/icons/upcoming.svg' alt='upcoming' width={20} height={20} />
                  <span className='text-sm capitalize text-text-muted'>{payout.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
