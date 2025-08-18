"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { PlusIcon } from "@heroicons/react/24/outline";
import EditDoc from "@/src/components/atoms/icons/edit-doc";
import { FormProvider, useForm } from "react-hook-form";
import { AddProjectMilestonesSchema, AddProjectMilestonesType } from "@/src/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";

interface AddProjectMilestonesTabComponentProps {
  onTabChange?: (tab: string) => void;
}

export default function AddProjectMilestonesTabComponent({ onTabChange }: AddProjectMilestonesTabComponentProps) {
  const methods = useForm<AddProjectMilestonesType>({
    resolver: zodResolver(AddProjectMilestonesSchema),
  });
  const { register, formState } = methods;
  const { errors } = formState;

  return (
    <div className='lg:min-h-[50vh]'>
      <Tabs defaultValue='add' onValueChange={onTabChange}>
        <TabsList className='gap-3'>
          <TabsTrigger
            className='min-w-[184px] gap-2 rounded-md border border-text-muted/10 px-3 py-3 font-medium tracking-normal text-text-muted/70 data-[state=active]:border-none data-[state=active]:bg-[#407BFF]/10 data-[state=active]:text-[#407BFF] data-[state=active]:shadow-none'
            value='add'
          >
            <PlusIcon className='size-4' />
            <span className='flex-1 text-left'>Add New Item</span>
          </TabsTrigger>
          <TabsTrigger
            className='min-w-[184px] gap-2 rounded-md border border-text-muted/10 px-3 py-3 font-medium tracking-normal text-text-muted/70 data-[state=active]:border-none data-[state=active]:bg-[#407BFF]/10 data-[state=active]:text-[#407BFF] data-[state=active]:shadow-none'
            value='edit'
          >
            <EditDoc className='size-4' />
            <span className='flex-1 text-left'>Edit existing item</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='add' className='mt-6 h-full'>
          <FormProvider {...methods}>
            <form>
              <div className='grid grid-cols-11 gap-2'>
                <div className='col-span-4 flex flex-col gap-3'>
                  <Label className='-tracking-[3%] text-text-muted'>Line Item Name</Label>
                  <Input
                    className='h-[51px] rounded-md border-black/10 bg-[#F8F8F8] shadow-none placeholder:text-sm placeholder:text-text-muted/80'
                    {...register("name")}
                    placeholder='Enter Name'
                  />
                  {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                </div>
                <div className='col-span-3 flex flex-col gap-3'>
                  <Label className='-tracking-[3%] text-text-muted'>Proposed Amount ($)</Label>{" "}
                  {/* TODO: show currency symbol based on value in backend*/}
                  <Input
                    className='h-[51px] rounded-md border-black/10 bg-[#F8F8F8] shadow-none placeholder:text-sm placeholder:text-text-muted/80'
                    {...register("amount")}
                    placeholder='Enter Amount'
                  />
                  {errors.amount && <p className='text-red-500'>{errors.amount.message}</p>}
                </div>
                <div className='col-span-4 flex flex-col gap-3'>
                  <Label className='-tracking-[3%] text-text-muted'>Reason for Addition</Label>
                  <Input
                    className='h-[51px] rounded-md border-black/10 bg-[#F8F8F8] shadow-none placeholder:text-sm placeholder:text-text-muted/80'
                    {...register("reason")}
                    placeholder='Add Text'
                  />
                  {errors.reason && <p className='text-red-500'>{errors.reason.message}</p>}
                </div>
                <div className='col-span-11 mt-3 flex flex-col gap-3'>
                  <Label className='-tracking-[3%] text-text-muted'>Description</Label>
                  <Textarea
                    className='min-h-[100px] rounded-md border-black/10 bg-[#F8F8F8] shadow-none placeholder:text-sm placeholder:text-text-muted/80'
                    {...register("description")}
                    placeholder='Text Area'
                  />
                  {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
                </div>
              </div>
              <Button type='submit' className='ml-auto mt-4 flex h-[51px] px-2 text-sm font-semibold'>
                Submit for Review
              </Button>
            </form>
          </FormProvider>
        </TabsContent>
        <TabsContent value='edit' className='mt-6 h-full'>
          <div className='h-full'>
            {/* Header Section */}
            <div className='mb-[1px] grid grid-cols-[1.5fr,1.5fr,2fr,1fr] rounded-md border-[#F8F8F8] bg-[#F4F4F4] px-6 py-4'>
              <div className='text-sm font-medium text-text-muted'>Line Item</div>
              <div className='text-sm font-medium text-text-muted'>Descriptions</div>
              <div className='text-sm font-medium text-text-muted'>Scope of Work</div>
              <div className='text-sm font-medium text-text-muted'>Budget</div>
            </div>

            {/* Table Body */}
            <div className='scrollbar-hide max-h-[30vh] divide-y divide-black/10 overflow-y-auto'>
              <div className='group relative grid cursor-pointer grid-cols-[1.5fr,1.5fr,2fr,1fr] px-6 py-4 hover:bg-[#f8f8f8]'>
                <span className='absolute bottom-2 right-2 hidden rounded-[3px] bg-[#44B914]/10 px-3 py-1 text-xs text-[#44B914] group-hover:block'>
                  Edit Now
                </span>
                <div className='text-xs font-medium tracking-[0%] text-[#1E5AA7]'>Foundation Excavation</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>
                  Digging and clearing the site to prepare for foundation construction.
                </div>
                <div className='text-xs tracking-[0%] text-[#777777]'>
                  Excavation of 150m² area, debris removal, leveling of site, disposal of soil.
                </div>
                <div className='text-xs font-medium text-[#777777]'>₦2,400,000</div>
              </div>

              <div className='group relative grid cursor-pointer grid-cols-[1.5fr,1.5fr,2fr,1fr] px-6 py-4 hover:bg-[#f8f8f8]'>
                <span className='absolute bottom-2 right-2 hidden rounded-[3px] bg-[#44B914]/10 px-3 py-1 text-xs text-[#44B914] group-hover:block'>
                  Edit Now
                </span>
                <div className='text-xs font-medium tracking-[0%] text-[#1E5AA7]'>Roofing Installation</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>
                  Installation of roofing materials and structural framing.
                </div>
                <div className='text-xs text-[#777777]'>
                  Supply and installation of timber trusses, aluminum roofing sheets, nails, and waterproofing.
                </div>
                <div className='text-xs font-medium text-[#777777]'>₦4,800,000</div>
              </div>

              <div className='group relative grid cursor-pointer grid-cols-[1.5fr,1.5fr,2fr,1fr] px-6 py-4 hover:bg-[#f8f8f8]'>
                <span className='absolute bottom-2 right-2 hidden rounded-[3px] bg-[#44B914]/10 px-3 py-1 text-xs text-[#44B914] group-hover:block'>
                  Edit Now
                </span>
                <div className='text-xs font-medium tracking-[0%] text-[#1E5AA7]'>Electrical Wiring & Fittings</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>Full internal wiring of building and</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>Wiring of all rooms, installation of</div>
                <div className='text-xs font-medium tracking-[0%] text-[#777777]'>₦3,200,000</div>
              </div>

              <div className='group relative grid cursor-pointer grid-cols-[1.5fr,1.5fr,2fr,1fr] px-6 py-4 hover:bg-[#f8f8f8]'>
                <span className='absolute bottom-2 right-2 hidden rounded-[3px] bg-[#44B914]/10 px-3 py-1 text-xs text-[#44B914] group-hover:block'>
                  Edit Now
                </span>
                <div className='text-xs font-medium tracking-[0%] text-[#1E5AA7]'>Foundation Excavation</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>
                  Digging and clearing the site to prepare for foundation construction.
                </div>
                <div className='text-xs tracking-[0%] text-[#777777]'>
                  Excavation of 150m² area, debris removal, leveling of site, disposal of soil.
                </div>
                <div className='text-xs font-medium text-[#777777]'>₦2,400,000</div>
              </div>

              <div className='group relative grid cursor-pointer grid-cols-[1.5fr,1.5fr,2fr,1fr] px-6 py-4 hover:bg-[#f8f8f8]'>
                <span className='absolute bottom-2 right-2 hidden rounded-[3px] bg-[#44B914]/10 px-3 py-1 text-xs text-[#44B914] group-hover:block'>
                  Edit Now
                </span>
                <div className='text-xs font-medium tracking-[0%] text-[#1E5AA7]'>Roofing Installation</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>
                  Installation of roofing materials and structural framing.
                </div>
                <div className='text-xs text-[#777777]'>
                  Supply and installation of timber trusses, aluminum roofing sheets, nails, and waterproofing.
                </div>
                <div className='text-xs font-medium text-[#777777]'>₦4,800,000</div>
              </div>

              <div className='group relative grid cursor-pointer grid-cols-[1.5fr,1.5fr,2fr,1fr] px-6 py-4 hover:bg-[#f8f8f8]'>
                <span className='absolute bottom-2 right-2 hidden rounded-[3px] bg-[#44B914]/10 px-3 py-1 text-xs text-[#44B914] group-hover:block'>
                  Edit Now
                </span>
                <div className='text-xs font-medium tracking-[0%] text-[#1E5AA7]'>Electrical Wiring & Fittings</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>Full internal wiring of building and</div>
                <div className='text-xs tracking-[0%] text-[#777777]'>Wiring of all rooms, installation of</div>
                <div className='text-xs font-medium tracking-[0%] text-[#777777]'>₦3,200,000</div>
              </div>
            </div>
          </div>
          <Button className='ml-auto mt-3 flex h-[51px] px-2 text-sm font-semibold'>
            Submit for Review
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
