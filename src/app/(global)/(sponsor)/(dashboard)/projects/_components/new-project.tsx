import ProjectMiniCards from "@/src/components/molecules/project-cards/mini-cards";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NewProjectTabComponent() {
  const marketPlaceProjects = [
    {
      id: "1",
      image: "/images/project-1.png",
      title: "RC Brown Apartment",
      address: "Los Angeles, California",
      type: "single asset",
      status: "closed on June 03 2025",
    },
    {
      id: "2",
      image: "/images/project-2.png",
      title: "RC Brown Apartment",
      address: "Los Angeles, California",
      type: "single asset",
      status: "closed on June 03 2025",
    },
    {
      id: "3",
      image: "/images/project-3.png",
      title: "RC Brown Apartment",
      address: "Los Angeles, California",
      type: "single asset",
      status: "closed on June 03 2025",
    },
    {
      id: "4",
      image: "/images/project-4.png",
      title: "RC Brown Apartment",
      address: "Los Angeles, California",
      type: "single asset",
      status: "closed on June 03 2025",
    },
    {
      id: "5",
      image: "/images/project-1.png",
      title: "RC Brown Apartment",
      address: "Los Angeles, California",
      type: "single asset",
      status: "closed on June 03 2025",
    },
  ];
  return (
    <div className='h-full w-full overflow-x-hidden'>
      <div
        className='w-full rounded-md px-12 py-8'
        style={{
          backgroundImage: "url('/images/sky-gradient.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className='rounded-md bg-[#B073FF] px-2 py-1 text-[11px] font-medium text-white'>Add New Project</span>
        <h1 className='oxy mt-1.5 text-5xl font-bold leading-[100%] -tracking-[3%] text-white'>
          Launch your next Big Opportunity
        </h1>
        <p className='mt-4 text-sm font-normal tracking-normal text-white'>
          Bring your vision to life by uploading your next investment opportunity. Whether it&apos;s real estate, tech, or
          infrastructure reach <br className='hidden lg:block' /> the right audience and start attracting committed
          investors today.
        </p>
        <Link href='/projects/new' className='mt-9 inline-block'>
          <Button className='bg-white px-3 text-sm font-semibold text-primary hover:bg-white hover:text-primary'>
            {/* todo: this goes to the onboarding project UI form */}
            Get Started
          </Button>
        </Link>
      </div>
      <div className='my-8 w-full overflow-x-hidden'>
        <h2 className='oxy mb-4 text-2xl font-bold leading-[100%] tracking-[0%] text-text-muted'>Marketplace</h2>
        <div className='overflow-x-auto rounded-[10px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          <div className='flex min-w-max space-x-6'>
            {marketPlaceProjects.map((project) => (
              <ProjectMiniCards key={project.id} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
