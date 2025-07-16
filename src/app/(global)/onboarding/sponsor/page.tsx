"use client";

import { Input } from "@/src/components/ui/input";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { sponsorOnboardingSchema } from "@/src/lib/data/sponsor-onboarding-schema";
import { useOnboardingStore } from "@/src/lib/store/onboarding-store";
import { ProgressTracker } from "@/src/components/molecules/progress-tracker";
import Footer from "@/src/components/molecules/footer";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface SegmentedProgressCircleProps {
  completed: number;
  total: number;
}

function SegmentedProgressCircle({ completed, total }: SegmentedProgressCircleProps) {
  const segments = Array.from({ length: total }, (_, i) => i < completed);
  const radius = 36;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Calculate segment length with tiny gaps
  const gapAngle = 8; // Tiny gap in degrees
  const segmentAngle = (360 - total * gapAngle) / total; // Remaining degrees divided by segments
  const segmentLength = (segmentAngle / 360) * circumference;

  return (
    <div className='relative mx-auto size-[100px] shrink-0'>
      <svg className='h-full w-full -rotate-90' viewBox='0 0 80 80'>
        {segments.map((isCompleted, index) => {
          const startAngle = index * (segmentAngle + gapAngle);
          const offset = -(startAngle / 360) * circumference;

          return (
            <circle
              key={index}
              cx='40'
              cy='40'
              r={normalizedRadius}
              fill='none'
              stroke={isCompleted ? "#82D361" : "#f1f5f9"}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={offset}
              className='transition-all duration-300 ease-in-out'
            />
          );
        })}
      </svg>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-base font-semibold text-gray-800'>
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}

export default function OnboardingLandingPage() {
  const router = useRouter();
  const { currentPhase, setCurrentPhase } = useOnboardingStore();

  const handlePhaseClick = (phaseIndex: number) => {
    const phase = sponsorOnboardingSchema.phases[phaseIndex];
    if (phase.isCompleted || phaseIndex < currentPhase) {
      setCurrentPhase(phaseIndex);
      router.push(`/onboarding/sponsor/${phase.slug}`);
    }
  };

  const handleStartCurrentPhase = () => {
    const phase = sponsorOnboardingSchema.phases[currentPhase];
    router.push(`/onboarding/sponsor/${phase.slug}`);
  };

  // Calculate completion
  const completedPhases = sponsorOnboardingSchema.phases.filter((phase) => phase.isCompleted).length;
  const totalPhases = sponsorOnboardingSchema.phases.length;

  return (
    <div className='bg-background-secondary'>
      <div className='mx-auto px-4 pb-8 pt-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
          {/* Left Sidebar - Progress Tracker */}
          <div className='lg:col-span-3'>
            <Card className='rounded-2xl border-none bg-white shadow-none'>
              <CardHeader className='pb-0'>
                <div className='flex items-center justify-between pl-10'>
                  <div className=''>
                    <CardTitle className='text-2xl font-medium -tracking-[3%] text-primary'>Welcome Onboard</CardTitle>
                    <p className='text-sm text-[#858585]'>
                      Complete your sponsor profile in four simple steps to <br /> start attracting serious investors
                    </p>
                  </div>
                  {/* Segmented Progress Circle */}
                  <SegmentedProgressCircle completed={completedPhases} total={totalPhases} />
                </div>
              </CardHeader>
              <CardContent>
                <ProgressTracker
                  phases={sponsorOnboardingSchema.phases}
                  currentPhase={currentPhase}
                  onPhaseClick={handlePhaseClick}
                  onStartCurrentPhase={handleStartCurrentPhase}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2'>
            <div className=''>
              {/* Call to Action Section */}
              <div className='mb-4 rounded-2xl bg-white p-8 text-center'>
                {/* Profile Avatars */}
                <Image
                  src='/images/3-people.png'
                  alt='Profile Avatars'
                  className='mx-auto mb-6 flex justify-center'
                  width={274}
                  height={100}
                />

                <h2 className='mb-3 text-xl font-medium text-gray-900'>Ready to take the next step?</h2>
                <p className='mx-auto mb-6 max-w-sm text-sm text-gray-600'>
                  We&apos;d love to hear from you, pick a time that works for you.
                </p>
                <Button className='px-12 py-6 text-xs font-semibold text-white'>Schedule a call</Button>
              </div>

              {/* Invite Friends Section */}
              <div className='rounded-2xl bg-white p-6'>
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>Invite your friends</h3>
                <p className='mb-4 text-sm text-gray-600'>Invite other real estate sponsors to join the platform</p>
                <div className='relative mb-6'>
                  <Input type='email' placeholder='Email address...' className='py-6 pr-28' />
                  <Button className='absolute right-2 top-1/2 -translate-y-1/2 transform bg-primary px-6 text-white hover:bg-slate-800'>
                    Send
                  </Button>
                </div>

                {/* Share Referral Link - now inside the same card */}
                <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                  <span className='text-lg font-medium text-primary'>Share referral link</span>
                  <Button
                    variant='outline'
                    className='flex items-center gap-2 rounded-full border-0 bg-primary/5 text-xs font-semibold text-primary'
                  >
                    Copy link
                    <DocumentDuplicateIcon className='size-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
