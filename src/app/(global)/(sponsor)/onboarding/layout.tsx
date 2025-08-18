"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { DocumentTextIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { CurrencyProvider } from "@/src/lib/context/currency-context";
import MessageIcon from "@/src/components/atoms/icons/message";
import WalletIcon from "@/src/components/atoms/icons/wallet";
import InvestorsIcon from "@/src/components/atoms/icons/Investors";

// Icons for the navigation tabs
const OnboardingIcon = () => <Squares2X2Icon className='size-4' />;

const ProjectsIcon = () => <DocumentTextIcon className='size-4' />;

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
    icon: WalletIcon,
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
      <div className='h-full'>
        <CurrencyProvider>{children}</CurrencyProvider>
      </div>
    </div>
  );
}
