"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { VerticalProgressTracker } from "@/src/components/molecules/progress-tracker";
import { sponsorOnboardingSchema } from "@/src/lib/data/sponsor-onboarding-schema";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface PhasePageProps {
  params: Promise<{
    phase: string;
  }>;
}

export default function PhasePage({ params }: PhasePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const phase = sponsorOnboardingSchema.phases.find((p) => p.slug === resolvedParams.phase);

  if (!phase) {
    router.push("/onboarding/sponsor");
    return null;
  }

  const phaseIndex = sponsorOnboardingSchema.phases.findIndex((p) => p.slug === resolvedParams.phase);

  const handleStartForm = () => {
    router.push(`/onboarding/sponsor/${resolvedParams.phase}/form`);
  };

  const handleBack = () => {
    router.push("/onboarding/sponsor");
  };

  return (
    <div className='h-full bg-background-secondary'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {/* Left Sidebar - Progress Tracker */}
          <div className='h-full rounded-lg bg-white px-8 py-4 lg:col-span-1'>
            <Button variant='ghost' onClick={handleBack} className='mb-4 h-auto p-0 font-normal'>
              <span className='flex items-center space-x-2'>
                <ArrowLeft className='size-4' />
                <span className='text-base text-text-muted'>Back</span>
              </span>
            </Button>

            <VerticalProgressTracker phases={sponsorOnboardingSchema.phases} currentPhase={phaseIndex} />
          </div>

          {/* Main Content */}
          <div className='flex items-start gap-3 rounded-lg bg-white p-8 lg:col-span-2'>
            <div>
              <h1 className='mb-4 text-4xl font-bold leading-[100%] -tracking-[3%] text-primary'>
                {phase.slug === "business-information" ? "Let's get to know about your Business!" : phase.title}
              </h1>
              <p className='mx-auto max-w-2xl text-base text-text-muted/70'>
                {phase.slug === "business-information"
                  ? "We're excited to have you onboard. Fill in your business info to get started with your project"
                  : phase.description}
              </p>
            </div>
            <div className='flex flex-col items-end space-y-8'>
              {/* Dynamic images based on onboarding phase */}
              {phase.slug === "business-information" && (
                <div className='relative'>
                  <Image src='/images/onboarding-phase-2.png' alt='Business people' width={500} height={500} />
                </div>
              )}

              {phase.slug === "company-representative" && (
                <div className='relative'>
                  <Image
                    src='/images/onboarding-phase-3.png'
                    alt='Company representative'
                    width={500}
                    height={500}
                    className='rounded-lg'
                  />
                </div>
              )}

              {phase.slug === "project-upload" && (
                <div className='relative'>
                  <Image
                    src='/images/onboarding-phase-4.png'
                    alt='Project upload'
                    width={500}
                    height={500}
                    className='rounded-lg'
                  />
                </div>
              )}

              <Button onClick={handleStartForm} size='lg' className='px-8'>
                Start Form →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
