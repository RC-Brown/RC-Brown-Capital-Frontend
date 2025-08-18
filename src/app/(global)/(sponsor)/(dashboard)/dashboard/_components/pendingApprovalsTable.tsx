import Image from "next/image";
import React from "react";

const pendingApprovals = [
  {
    id: 1,
    projectName: "Ocean Bay Estate",
    submittedOn: "May 10, 2025",
    status: "Under Review",
  },
  {
    id: 2,
    projectName: "Sunrise Valley Towers",
    submittedOn: "Apr 28, 2025",
    status: "Submitted",
  },
  {
    id: 3,
    projectName: "Elite School Project",
    submittedOn: "Apr 20, 2025",
    status: "Under Review",
  },
  {
    id: 4,
    projectName: "Oasis Smart Homes",
    submittedOn: "Mar 25, 2025",
    status: "Approved",
  },
  {
    id: 5,
    projectName: "Sapphire Estate",
    submittedOn: "Mar 01, 2025",
    status: "Published",
  },
];

export default function PendingApprovalsTable() {
  return (
    <div className=''>
      <div className='mb-6 px-5 py-6'>
        <div className='flex items-end gap-3'>
          <h2 className='oxy text-2xl font-bold leading-[100%] -tracking-[3%] text-text-muted'>Pending Approvals</h2>
        </div>
      </div>

      <div>
        {/* Header */}
        <div className='grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 px-10'>
          <div className='text-sm font-medium text-text-muted'>Project Name</div>
          <div className='text-sm font-medium text-text-muted'>Submitted On</div>
          <div className='text-sm font-medium text-text-muted'>Status</div>
          <div className='text-sm font-medium text-text-muted'>Action</div>
        </div>

        {/* Rows */}
        <div className='mt-2 flex flex-col gap-2 px-5 py-4'>
          {pendingApprovals.map((approval) => (
            <div
              key={approval.id}
              className='grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 border-b border-black/10 px-5 py-4'
            >
              <div className='text-sm text-text-muted'>{approval.projectName}</div>
              <div className='text-sm text-text-muted'>{approval.submittedOn}</div>
              <div className='flex items-center gap-2'>
                <Image src='/icons/upcoming.svg' alt='status' width={20} height={20} />
                <span className='text-sm text-text-muted'>{approval.status}</span>
              </div>
              <div>
                <button className='rounded-[10px] border border-black/10 bg-[#F5F5F5] px-5 py-2 text-sm text-text-muted hover:bg-[#F0F0F0]'>
                  View Submission
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
