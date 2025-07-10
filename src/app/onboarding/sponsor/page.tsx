"use client";

import { Input } from "@/src/components/ui/input";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { sponsorOnboardingSchema } from "@/src/lib/data/sponsor-onboarding-schema";
import { useOnboardingStore } from "@/src/lib/store/onboarding-store";
import { ProgressTracker } from "@/src/components/molecules/progress-tracker";
import Footer from "@/src/components/molecules/footer";
import { Copy } from "lucide-react";
import Image from "next/image";

// Custom segmented progress circle component
function SegmentedProgressCircle({ completed, total }: { completed: number; total: number }) {
  const segments = Array.from({ length: total }, (_, i) => i < completed);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const segmentAngle = 360 / total;
  const gapAngle = 8; // Gap between segments in degrees
  const segmentArcAngle = segmentAngle - gapAngle;

  return (
    <div className='relative size-[100px] shrink-0'>
      <svg className='h-full w-full -rotate-90' viewBox='0 0 100 100'>
        {segments.map((isCompleted, index) => {
          const segmentArcLength = (segmentArcAngle / 360) * circumference;
          const gapLength = (gapAngle / 360) * circumference;
          const totalSegmentLength = segmentArcLength + gapLength;

          const startOffset = index * totalSegmentLength;

          return (
            <circle
              key={index}
              cx='50'
              cy='50'
              r={radius}
              fill='none'
              stroke={isCompleted ? "#22c55e" : "#e5e7eb"}
              strokeWidth='6'
              strokeDasharray={`${segmentArcLength} ${circumference - segmentArcLength}`}
              strokeDashoffset={-startOffset}
              strokeLinecap='round'
              className='transition-colors duration-300'
            />
          );
        })}
      </svg>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-lg font-semibold text-gray-700'>
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
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-5'>
          {/* Left Sidebar - Progress Tracker */}
          <div className='lg:col-span-3'>
            <Card className='border-none bg-white shadow-none'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className=''>
                    <CardTitle className='text-2xl font-medium -tracking-[3%] text-primary'>Welcome Onboard</CardTitle>
                    <p className='text-base text-[#858585]'>
                      Complete your sponsor profile in four simple steps to start attracting serious investors
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
              <div className='mb-6 rounded-lg bg-white p-8 text-center'>
                {/* Profile Avatars */}
                <div className='mb-6 flex items-center justify-center -space-x-2'>
                  <Image
                    src='/placeholder.svg?height=60&width=60'
                    alt='Team member 1'
                    width={60}
                    height={60}
                    className='h-12 w-12 rounded-full border-4 border-white shadow-lg'
                  />
                  <Image
                    src='/placeholder.svg?height=60&width=60'
                    alt='Team member 2'
                    width={60}
                    height={60}
                    className='h-12 w-12 rounded-full border-4 border-white shadow-lg'
                  />
                  <Image
                    src='/placeholder.svg?height=60&width=60'
                    alt='Team member 3'
                    width={60}
                    height={60}
                    className='h-12 w-12 rounded-full border-4 border-white shadow-lg'
                  />
                </div>

                <h2 className='mb-3 text-xl font-semibold text-gray-900'>Ready to take the next step?</h2>
                <p className='mx-auto mb-6 max-w-sm text-sm text-gray-600'>
                  We&apos;d love to hear from you, pick a time that works for you.
                </p>
                <Button className='bg-slate-700 px-8 py-2 text-white hover:bg-slate-800'>Schedule a call</Button>
              </div>

              {/* Invite Friends Section */}
              <div className='rounded-lg bg-white p-6'>
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>Invite your friends</h3>
                <p className='mb-4 text-sm text-gray-600'>Invite other real estate sponsors to join the platform</p>
                <div className='mb-6 flex gap-2'>
                  <Input type='email' placeholder='Email address...' className='flex-1' />
                  <Button className='bg-primary px-6 text-white hover:bg-slate-800'>Send</Button>
                </div>

                {/* Share Referral Link - now inside the same card */}
                <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                  <span className='text-lg font-semibold text-primary'>Share referral link</span>
                  <Button variant='outline' className='flex items-center gap-2 bg-transparent'>
                    Copy link
                    <Copy className='size-4' />
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
