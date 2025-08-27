import InvestorsIcon from "@/src/components/atoms/icons/Investors";
import TreasureMapIcon from "@/src/components/atoms/icons/treasure-map";
import GalleryIcon from "@/src/components/atoms/icons/gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import NewProjectTabComponent from "./_components/new-project";
import ProjectTrackingTabComponent from "./_components/project-tracking";
import InvestorUpdatesTabComponent from "./_components/investor-updates";
import GalleryTabComponent from "./_components/gallery";

export default function ProjectsPage() {
  const tabs = [
    {
      label: "New Project",
      icon: PlusIcon,
      value: "new-project",
      component: NewProjectTabComponent,
    },
    {
      label: "Project Tracking",
      icon: TreasureMapIcon,
      value: "project-tracking",
      component: ProjectTrackingTabComponent,
    },
    {
      label: "Investor Updates",
      icon: InvestorsIcon,
      value: "investor-updates",
      component: InvestorUpdatesTabComponent,
    },
    {
      label: "Gallery",
      icon: GalleryIcon,
      value: "gallery",
      component: GalleryTabComponent,
    },
  ];
  return (
    <div className='max-h-full w-full'>
      <Tabs defaultValue='new-project'>
        <TabsList className='gap-3 px-0'>
          {tabs.map((tab) => (
            <TabsTrigger
              value={tab.value}
              className='min-w-[184px] gap-2 rounded-md border border-white bg-white px-3 py-3 font-medium tracking-normal text-text-muted data-[state=active]:border-[#407BFF] data-[state=active]:bg-transparent data-[state=active]:text-[#1F6BCC] data-[state=active]:shadow-none'
            >
              <tab.icon className='size-4' />
              <span className='flex-1 text-left'>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent value={tab.value} className='mt-4 h-full w-full'>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
