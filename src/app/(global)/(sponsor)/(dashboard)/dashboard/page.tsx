"use client";

import React from "react";
import HeaderGreetingCard from "./_components/header-greeting-card";
import HeaderMilestonesCard from "./_components/header-milestones-card";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import InvestorsIcon from "@/src/components/atoms/icons/Investors";
import WalletIcon from "@/src/components/atoms/icons/wallet";
import DashboardActiveProjects from "./_components/dashboard-active-projects";
import UpcomingPayoutsAndDividendsTable from "./_components/upcoming-payouts-and-dividends";
import PendingApprovalsTable from "./_components/pendingApprovalsTable";
import DateRangePicker from "./_components/date-range-picker";
import { useDashboardMetrics } from "@/src/lib/hooks/use-dashboard-metrics";
import { formatCurrency } from "@/src/lib/utils";
import { DashboardErrorBoundary } from "@/src/components/molecules/dashboard-error-boundary";

export default function DashboardPage() {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  );
}

function DashboardContent() {
  const { data: dashboardData, isLoading, error } = useDashboardMetrics();

  // Fallback data for loading state or errors
  const dashboardOverview = {
    totalProjects: dashboardData?.data?.total_projects ?? 0,
    activeProjects: dashboardData?.data?.active_projects ?? 0,
    pendingProjects: dashboardData?.data?.pending_projects ?? 0,
    totalInvestors: dashboardData?.data?.total_investors ?? 0,
    fundsRaised: dashboardData?.data?.funds_raised ? formatCurrency(dashboardData.data.funds_raised) : "$0",
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-4 grid-rows-5 gap-3'>
        <div className='col-span-full row-span-2 flex items-stretch gap-3'>
          <div className='flex-1 rounded-md bg-white p-6'>
            <div className='mb-4 h-4 w-32 animate-pulse rounded bg-gray-200'></div>
            <div className='h-6 w-48 animate-pulse rounded bg-gray-200'></div>
          </div>
          <div className='flex-1 rounded-md bg-white p-6'>
            <div className='mb-4 h-4 w-32 animate-pulse rounded bg-gray-200'></div>
            <div className='h-6 w-48 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>
        <div className='col-span-3 row-span-1 grid grid-cols-3 gap-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center justify-center gap-4 rounded-md bg-white p-4'>
              <div className='size-[58px] animate-pulse rounded-full bg-gray-200'></div>
              <div className='flex flex-col gap-2'>
                <div className='h-8 w-16 animate-pulse rounded bg-gray-200'></div>
                <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
              </div>
            </div>
          ))}
        </div>
        <div className='col-span-1 row-span-3 flex overflow-hidden rounded-md bg-white px-2 py-3'>
          <div className='h-full w-full animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='col-span-3 row-span-2 rounded-md bg-white px-5 py-6'>
          <div className='h-32 w-full animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='col-span-4 rounded-md bg-white p-6'>
          <div className='h-32 w-full animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='col-span-4 rounded-md bg-white p-6'>
          <div className='h-32 w-full animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='grid grid-cols-4 grid-rows-5 gap-3'>
        <div className='col-span-full row-span-2 flex items-stretch gap-3'>
          <div className='flex-1 rounded-md bg-white p-6'>
            <div className='text-center text-red-600'>
              <h3 className='mb-2 text-lg font-semibold'>Error Loading Dashboard</h3>
              <p className='mb-4 text-sm text-gray-600'>
                {error instanceof Error ? error.message : "Failed to load dashboard data"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className='rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700'
              >
                Retry
              </button>
            </div>
          </div>
          <div className='flex-1 rounded-md bg-white p-6'>
            <div className='text-center text-gray-500'>
              <h3 className='mb-2 text-lg font-semibold'>Dashboard Unavailable</h3>
              <p className='text-sm'>Please try refreshing the page</p>
            </div>
          </div>
        </div>
        <div className='col-span-3 row-span-1 grid grid-cols-3 gap-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center justify-center gap-4 rounded-md bg-white p-4'>
              <div className='text-center text-gray-500'>
                <div className='text-2xl font-bold'>--</div>
                <div className='text-sm'>Data Unavailable</div>
              </div>
            </div>
          ))}
        </div>
        <div className='col-span-1 row-span-3 flex overflow-hidden rounded-md bg-white px-2 py-3'>
          <div className='w-full text-center text-gray-500'>
            <div className='text-sm'>Date Range</div>
            <div className='text-xs'>Unavailable</div>
          </div>
        </div>
        <div className='col-span-3 row-span-2 rounded-md bg-white px-5 py-6'>
          <div className='text-center text-gray-500'>
            <div className='mb-2 text-lg font-semibold'>Active Projects</div>
            <div className='text-sm'>Data unavailable</div>
          </div>
        </div>
        <div className='col-span-4 rounded-md bg-white p-6'>
          <div className='text-center text-gray-500'>
            <div className='mb-2 text-lg font-semibold'>Upcoming Payouts</div>
            <div className='text-sm'>Data unavailable</div>
          </div>
        </div>
        <div className='col-span-4 rounded-md bg-white p-6'>
          <div className='text-center text-gray-500'>
            <div className='mb-2 text-lg font-semibold'>Pending Approvals</div>
            <div className='text-sm'>Data unavailable</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-4 grid-rows-5 gap-3'>
      <div className='col-span-full row-span-2 flex items-stretch gap-3'>
        <HeaderGreetingCard />
        <HeaderMilestonesCard />
      </div>
      <div className='col-span-3 row-span-1 grid grid-cols-3 gap-3'>
        <div className='flex items-center justify-center gap-4 rounded-md bg-white'>
          <div className='flex size-[58px] items-center justify-center rounded-full bg-[#407BFF]/10'>
            <DocumentTextIcon className='size-6 stroke-[1.5px] text-[#1F6BCC]' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='oxy text-2xl font-bold text-text-muted'>
              {isLoading ? (
                <div className='h-8 w-16 animate-pulse rounded bg-gray-200'></div>
              ) : (
                dashboardOverview.totalProjects
              )}
            </div>
            <div className='text-sm font-medium tracking-[0%] text-text-muted/80'>Total Projects</div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4 rounded-md bg-white'>
          <div className='flex size-[58px] items-center justify-center rounded-full bg-[#FF9811]/10'>
            <InvestorsIcon className='size-6 stroke-[1.5px] text-[#EB996E]' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='oxy text-2xl font-bold text-text-muted'>
              {isLoading ? (
                <div className='h-8 w-16 animate-pulse rounded bg-gray-200'></div>
              ) : (
                dashboardOverview.totalInvestors
              )}
            </div>
            <div className='text-sm font-medium tracking-[0%] text-text-muted/80'>Total Investors</div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4 rounded-md bg-white'>
          <div className='flex size-[58px] items-center justify-center rounded-full bg-[#82D361]/10'>
            <WalletIcon className='size-6 stroke-[1.5px] text-[#82D361]' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='oxy text-2xl font-bold text-text-muted'>
              {isLoading ? (
                <div className='h-8 w-16 animate-pulse rounded bg-gray-200'></div>
              ) : (
                dashboardOverview.fundsRaised
              )}
            </div>
            <div className='text-sm font-medium tracking-[0%] text-text-muted/80'>Funds Raised</div>
          </div>
        </div>
      </div>
      <div className='col-span-1 row-span-3 flex overflow-hidden rounded-md bg-white px-2 py-3'>
        <DateRangePicker />
      </div>
      <div className='col-span-3 row-span-2 rounded-md bg-white px-5 py-6'>
        <DashboardActiveProjects />
      </div>
      <div className='col-span-4 rounded-md bg-white'>
        <UpcomingPayoutsAndDividendsTable payouts={dashboardData?.data?.upcoming_payouts} />
      </div>
      <div className='col-span-4 rounded-md bg-white'>
        <PendingApprovalsTable />
      </div>
    </div>
  );
}
