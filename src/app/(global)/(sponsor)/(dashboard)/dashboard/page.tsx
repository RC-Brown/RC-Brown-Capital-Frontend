import React from "react";
import HeaderGreetingCard from "./_components/header-greeting-card";
import HeaderMilestonesCard from "./_components/header-milestones-card";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import InvestorsIcon from "@/src/components/atoms/icons/Investors";
import WalletIcon from "@/src/components/atoms/icons/wallet";
import DashboardActiveProjects from "./_components/dashboard-active-projects";
import UpcomingPayoutsAndDividendsTable from "./_components/upcoming-payouts-and-dividends";
import PendingApprovalsTable from "./_components/pendingApprovalsTable";

export default function DashboardPage() {
  const dashboardOverview = {
    totalProjects: 33,
    totalInvestors: 1402,
    fundsRaised: "$87,000,000",
  };
  return (
    <div className='grid grid-cols-4 grid-rows-5 gap-4'>
      <div className='col-span-full row-span-2 flex items-stretch gap-4'>
        <HeaderGreetingCard />
        <HeaderMilestonesCard />
      </div>
      <div className='col-span-3 row-span-1 grid grid-cols-3 gap-4'>
        <div className='flex items-center justify-center gap-4 rounded-md bg-white'>
          <div className='flex size-[58px] items-center justify-center rounded-full bg-[#407BFF]/10'>
            <DocumentTextIcon className='size-6 stroke-[1.5px] text-[#1F6BCC]' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='oxy text-2xl font-bold text-text-muted'>{dashboardOverview.totalProjects}</div>
            <div className='text-sm font-medium tracking-[0%] text-text-muted/80'>Total Projects</div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4 rounded-md bg-white'>
          <div className='flex size-[58px] items-center justify-center rounded-full bg-[#FF9811]/10'>
            <InvestorsIcon className='size-6 stroke-[1.5px] text-[#EB996E]' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='oxy text-2xl font-bold text-text-muted'>{dashboardOverview.totalInvestors}</div>
            <div className='text-sm font-medium tracking-[0%] text-text-muted/80'>Total Investors</div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4 rounded-md bg-white'>
          <div className='flex size-[58px] items-center justify-center rounded-full bg-[#82D361]/10'>
            <WalletIcon className='size-6 stroke-[1.5px] text-[#82D361]' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='oxy text-2xl font-bold text-text-muted'>{dashboardOverview.fundsRaised}</div>
            <div className='text-sm font-medium tracking-[0%] text-text-muted/80'>Funds Raised</div>
          </div>
        </div>
      </div>
      <div className='col-span-1 row-span-3 flex items-center justify-center rounded-md bg-white'>
        date picker placeholder
      </div>
      <div className='col-span-3 row-span-2 rounded-md bg-white px-5 py-6'>
        <DashboardActiveProjects />
      </div>
      <div className='col-span-4 rounded-md bg-white'>
        <UpcomingPayoutsAndDividendsTable />
      </div>
      <div className='col-span-4 rounded-md bg-white'>
        <PendingApprovalsTable />
      </div>
    </div>
  );
}
