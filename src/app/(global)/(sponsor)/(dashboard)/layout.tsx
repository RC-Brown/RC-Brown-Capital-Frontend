"use client";

import FingerprintKycIcon from "@/src/components/atoms/icons/fingerprint-kyc";
import InvestorsIcon from "@/src/components/atoms/icons/Investors";
import MessageIcon from "@/src/components/atoms/icons/message";
import WalletIcon from "@/src/components/atoms/icons/wallet";
import { Cog8ToothIcon, DocumentTextIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SponsorDashboardLayout({ children }: { children: React.ReactNode }) {
  const mainMenu = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Squares2X2Icon,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: DocumentTextIcon,
    },
    {
      label: "Financial Insights",
      href: "/financial-insights",
      icon: WalletIcon,
    },
    {
      label: "Message",
      href: "/message",
      icon: MessageIcon,
    },
    {
      label: "Investors",
      href: "/investors",
      icon: InvestorsIcon,
    },
    {
      label: "KYC",
      href: "/kyc",
      icon: FingerprintKycIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Cog8ToothIcon,
    },
  ];

  const currentMenu = mainMenu;
  const pathname = usePathname();
  return (
    <div className='relative m-0 flex h-full min-h-screen w-full bg-background-secondary p-0'>
      <div className='sticky top-[106px] flex h-fit flex-col gap-3 bg-white px-5 py-4 lg:min-w-[227px]'>
        {currentMenu.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-primary hover:text-white ${
              pathname === item.href ? "bg-primary text-white" : "text-text-muted"
            }`}
          >
            <item.icon className='size-4' />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className='flex-1 p-4'>{children}</div>
    </div>
  );
}
