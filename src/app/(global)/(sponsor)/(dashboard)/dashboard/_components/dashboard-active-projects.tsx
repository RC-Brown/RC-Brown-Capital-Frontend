"use client";

import InvestorsIcon from "@/src/components/atoms/icons/Investors";
import WalletIcon from "@/src/components/atoms/icons/wallet";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/src/components/ui/carousel";
import { Progress } from "@/src/components/ui/progress";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React, { useRef } from "react";

const formatCurrency = (amount: string) => {
  // Remove the "$" and "," from the string and convert to number
  const value = parseFloat(amount.replace(/[$,]/g, ""));

  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }

  // For values less than a million, keep the original format
  return amount;
};

export default function DashboardActiveProjects() {
  const activeProjects = [
    {
      id: 1,
      name: "RCB Capital",
      investors: 42,
      fundsRaised: "$400,000,000",
      percentage: 85,
    },
    {
      id: 2,
      name: "Pillar Point Homes",
      investors: 2,
      fundsRaised: "$7,030,043",
      percentage: 18,
    },
    {
      id: 3,
      name: "ONYX Homes",
      investors: 62,
      fundsRaised: "$1,000,000,000",
      percentage: 100,
    },
    {
      id: 4,
      name: "The Greenhouse",
      investors: 12,
      fundsRaised: "$1,000,000",
      percentage: 50,
    },
    {
      id: 5,
      name: "Adventure Capital",
      investors: 1,
      fundsRaised: "$200,000",
      percentage: 5,
    },
  ];
  const autoplay = useRef(Autoplay({ delay: 2100, stopOnInteraction: false }));
  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className='w-full'
      onMouseEnter={() => autoplay.current.stop()}
      onMouseLeave={() => autoplay.current.play()}
      plugins={[autoplay.current]}
    >
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-end gap-3'>
          <span className='oxy text-2xl font-bold leading-[100%] -tracking-[3%] text-text-muted'>Active Projects</span>
          <span className='flex size-5 items-center justify-center rounded-full bg-[#FAA7A7] text-xs'>
            {activeProjects.length}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <CarouselPrevious
            variant='ghost'
            customIcon={<ArrowLeftIcon className='size-3 stroke-[3px]' />}
            className='disbled:text-black/50 relative left-0 top-0 translate-y-0 text-primary'
          />
          <CarouselNext
            variant='ghost'
            customIcon={<ArrowRightIcon className='size-3 stroke-[3px]' />}
            className='disbled:text-black/50 relative left-0 top-0 translate-y-0 text-primary'
          />
        </div>
      </div>
      <CarouselContent>
        {activeProjects.map((project, index) => (
          <CarouselItem key={index} className='basis-[48%]'>
            <div className='flex items-stretch gap-2 rounded-[10px] border border-black/10 p-4'>
              <Image
                height={87}
                width={87}
                alt='project'
                src={`/images/project-img-placeholder.png`}
                className='rounded-md object-cover'
              />
              <div className='flex flex-1 flex-col justify-between'>
                <span className='font-medium leading-[100%] tracking-[0%] text-text-muted'>{project.name}</span>
                <span className='flex items-center gap-1'>
                  <InvestorsIcon className='size-4 text-text-muted' />
                  <span className='divide-x divide-text-muted/80'>
                    <span className='px-1 text-center text-sm font-medium text-text-muted/80'>
                      {project.investors} Investors
                    </span>
                    <span className='px-1 text-sm font-medium text-text-muted/80'>
                      {formatCurrency(project.fundsRaised)}
                    </span>
                  </span>
                </span>
                <div className='flex items-center gap-2'>
                  <WalletIcon className='size-4 text-text-muted' />
                  <div className='flex-1'>
                    <Progress
                      value={project.percentage}
                      className={`h-1 ${
                        project.percentage < 30
                          ? "bg-[#F5F5F5] [&>div]:bg-[#D7342C]"
                          : project.percentage > 70
                            ? "bg-[#F5F5F5] [&>div]:bg-[#82D361]"
                            : "bg-[#F5F5F5] [&>div]:bg-amber-500"
                      }`}
                    />
                  </div>
                  <span className='text-xs font-medium text-text-muted/80'>{project.percentage}%</span>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
