"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { DocumentTextIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

// Icons for the navigation tabs
const OnboardingIcon = () => <Squares2X2Icon className='size-4' />;

const ProjectsIcon = () => <DocumentTextIcon className='size-4' />;

const FinancialInsightsIcon = () => (
  <svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M14 4.49967H3.33333C2.76067 4.49967 2.21867 4.25167 1.84333 3.83367C2.21 3.42434 2.74267 3.16634 3.33333 3.16634H15.3333C15.702 3.16634 16 2.86767 16 2.49967C16 2.13167 15.702 1.83301 15.3333 1.83301H3.33333C1.49267 1.83301 0 3.32567 0 5.16634V11.833C0 13.6737 1.49267 15.1663 3.33333 15.1663H14C15.1047 15.1663 16 14.271 16 13.1663V6.49967C16 5.39501 15.1047 4.49967 14 4.49967ZM14.6667 13.1663C14.6667 13.5337 14.368 13.833 14 13.833H3.33333C2.23067 13.833 1.33333 12.9357 1.33333 11.833V5.16501C1.90267 5.59101 2.60267 5.83301 3.33333 5.83301H14C14.368 5.83301 14.6667 6.13234 14.6667 6.49967V13.1663ZM13.3333 9.83301C13.3333 10.201 13.0347 10.4997 12.6667 10.4997C12.2987 10.4997 12 10.201 12 9.83301C12 9.46501 12.2987 9.16634 12.6667 9.16634C13.0347 9.16634 13.3333 9.46501 13.3333 9.83301Z'
      fill='currentColor'
    />
  </svg>
);

const MessageIcon = () => (
  <svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_3912_281)'>
      <path
        d='M9.00009 8.50007C9.00009 9.05207 8.55209 9.50007 8.00009 9.50007C7.44809 9.50007 7.00009 9.05207 7.00009 8.50007C7.00009 7.94807 7.44809 7.50007 8.00009 7.50007C8.55209 7.50007 9.00009 7.94807 9.00009 8.50007ZM11.3334 7.50007C10.7814 7.50007 10.3334 7.94807 10.3334 8.50007C10.3334 9.05207 10.7814 9.50007 11.3334 9.50007C11.8854 9.50007 12.3334 9.05207 12.3334 8.50007C12.3334 7.94807 11.8854 7.50007 11.3334 7.50007ZM4.66676 7.50007C4.11476 7.50007 3.66676 7.94807 3.66676 8.50007C3.66676 9.05207 4.11476 9.50007 4.66676 9.50007C5.21876 9.50007 5.66676 9.05207 5.66676 8.50007C5.66676 7.94807 5.21876 7.50007 4.66676 7.50007ZM16.0001 8.72674V13.1667C16.0001 15.0047 14.5048 16.5001 12.6668 16.5001H8.72209C4.05476 16.5001 0.313422 13.3054 0.0200891 9.0694C-0.140578 6.75207 0.704756 4.48407 2.33942 2.8474C3.97409 1.21074 6.24209 0.362736 8.55742 0.519403C12.7308 0.802736 16.0001 4.4074 16.0001 8.72674ZM14.6668 8.72674C14.6668 5.10607 11.9441 2.0854 8.46742 1.8494C8.31476 1.83874 8.16209 1.83407 8.01009 1.83407C6.23942 1.83407 4.53742 2.53274 3.28276 3.7894C1.92009 5.1534 1.21542 7.04474 1.35009 8.9774C1.59876 12.5641 4.69942 15.1674 8.72276 15.1674H12.6674C13.7701 15.1674 14.6674 14.2701 14.6674 13.1674V8.7274L14.6668 8.72674Z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='clip0_3912_281'>
        <rect width='16' height='16' fill='white' transform='translate(0 0.5)' />
      </clipPath>
    </defs>
  </svg>
);

const InvestorsIcon = () => (
  <svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_3912_2395)'>
      <path
        d='M7.33325 0.5C5.12725 0.5 3.33325 2.294 3.33325 4.5C3.33325 6.706 5.12725 8.5 7.33325 8.5C9.53925 8.5 11.3333 6.706 11.3333 4.5C11.3333 2.294 9.53925 0.5 7.33325 0.5ZM7.33325 7.16667C5.86259 7.16667 4.66659 5.97067 4.66659 4.5C4.66659 3.02933 5.86259 1.83333 7.33325 1.83333C8.80392 1.83333 9.99992 3.02933 9.99992 4.5C9.99992 5.97067 8.80392 7.16667 7.33325 7.16667ZM9.31259 10.834C9.22059 11.1913 8.85459 11.4053 8.50059 11.3133C8.12192 11.216 7.72859 11.1667 7.33325 11.1667C4.76059 11.1667 2.66659 13.26 2.66659 15.8333C2.66659 16.2013 2.36859 16.5 1.99992 16.5C1.63125 16.5 1.33325 16.2013 1.33325 15.8333C1.33325 12.5253 4.02459 9.83333 7.33325 9.83333C7.84059 9.83333 8.34525 9.89667 8.83259 10.0227C9.18925 10.114 9.40392 10.478 9.31259 10.834ZM15.9999 13.1667C15.9999 14.2693 15.1026 15.1667 13.9999 15.1667V15.8333C13.9999 16.2013 13.7019 16.5 13.3333 16.5C12.9646 16.5 12.6666 16.2013 12.6666 15.8333V15.1653H12.4866C11.7759 15.1653 11.1126 14.7827 10.7559 14.168C10.5713 13.8493 10.6799 13.4413 10.9986 13.2567C11.3173 13.0727 11.7253 13.1807 11.9093 13.4993C12.0286 13.7047 12.2493 13.832 12.4866 13.832L13.9999 13.8333C14.3673 13.8333 14.6659 13.534 14.6659 13.1667C14.6659 12.9147 14.4853 12.7013 14.2366 12.66L12.2093 12.322C11.3146 12.1733 10.6659 11.4067 10.6659 10.5C10.6659 9.39733 11.5633 8.5 12.6659 8.5V7.83333C12.6659 7.46533 12.9639 7.16667 13.3326 7.16667C13.7013 7.16667 13.9993 7.46533 13.9993 7.83333V8.502H14.1799C14.8886 8.502 15.5519 8.884 15.9093 9.49867C16.0946 9.81667 15.9866 10.2247 15.6686 10.41C15.3499 10.5953 14.9413 10.4867 14.7573 10.1687C14.6353 9.96067 14.4199 9.83533 14.1799 9.83533L12.6659 9.83333C12.2986 9.83333 11.9999 10.1327 11.9999 10.5C11.9999 10.752 12.1806 10.9653 12.4293 11.0067L14.4566 11.3447C15.3513 11.4933 15.9999 12.26 15.9999 13.1667Z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='clip0_3912_2395'>
        <rect width='16' height='16' fill='white' transform='translate(0 0.5)' />
      </clipPath>
    </defs>
  </svg>
);

const navigationItems = [
  {
    name: "Onboarding",
    href: "/onboarding/sponsor",
    icon: OnboardingIcon,
  },
  {
    name: "Projects",
    href: "#",
    icon: ProjectsIcon,
  },
  {
    name: "Financial Insights",
    href: "#",
    icon: FinancialInsightsIcon,
  },
  {
    name: "Message",
    href: "#",
    icon: MessageIcon,
  },
  {
    name: "Investors",
    href: "#",
    icon: InvestorsIcon,
  },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSponsorOnboardingFirstPage = pathname === "/onboarding/sponsor";

  return (
    <div className='h-full bg-background-secondary'>
      {/* Tab Navigation - Only show on sponsor onboarding pages */}
      {isSponsorOnboardingFirstPage && (
        <div className='border-b border-gray-200 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <nav className='flex space-x-8'>
              {navigationItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <Icon />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='h-full'>{children}</div>
    </div>
  );
}
