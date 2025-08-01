"use client";

import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ProgressTrackerProps {
  phases: Array<{
    key: string;
    title: string;
    isCompleted?: boolean;
  }>;
  currentPhase: number;
  onPhaseClick?: (phaseIndex: number) => void;
  onStartCurrentPhase?: () => void;
}

export function ProgressTracker({ phases, currentPhase, onPhaseClick, onStartCurrentPhase }: ProgressTrackerProps) {
  // Get tooltip info for the next phase
  const getTooltipInfo = (phaseIndex: number) => {
    if (phaseIndex === 2) {
      // Company Representative Details (phase 3)
      return {
        label: "NEXT",
        title: "Company Representative Details",
        description: "Please provide the required information to proceed",
        color: "bg-tertiary", // tertiary color
        labelBgColor: "bg-[#5EBB37]",
      };
    } else if (phaseIndex === 3) {
      // Project Upload (phase 4)
      return {
        label: "FINAL",
        title: "You are now at the final stage —",
        description: "kindly upload your project details to proceed",
        color: "bg-[#9747FF]", // purple color
        labelBgColor: "bg-[#B073FF]",
      };
    }
    return null;
  };

  return (
    <div className='space-y-2'>
      {phases.map((phase, index) => {
        const isCompleted = phase.isCompleted || index < currentPhase;
        const isCurrent = index === currentPhase;
        const isClickable = isCompleted && onPhaseClick && phase.key !== "account-setup";
        const shouldShowTooltip = index === currentPhase && !isCompleted;
        const tooltipInfo = getTooltipInfo(index);

        return (
          <div key={phase.key} className='relative flex items-stretch space-x-4 px-4 py-3'>
            <div
              className={cn(
                "flex flex-1 items-center justify-between space-x-4 px-4 py-4",
                isCurrent ? "rounded-lg bg-background-secondary" : ""
              )}
            >
              <div className='flex flex-1 items-center space-x-4'>
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                    isCompleted
                      ? "bg-tertiary text-white"
                      : isCurrent
                        ? "bg-primary text-white"
                        : "bg-background-secondary text-text-muted",
                    isClickable && "cursor-pointer hover:opacity-80"
                  )}
                  onClick={() => isClickable && onPhaseClick(index)}
                >
                  {isCompleted ? (
                    <Check className='size-6' />
                  ) : (
                    <span className='text-lg font-medium'>{index + 1}</span>
                  )}
                </div>
                <div
                  className={cn("flex-1", isClickable && "cursor-pointer")}
                  onClick={() => isClickable && onPhaseClick(index)}
                >
                  <h3
                    className={cn(
                      "text-lg font-medium text-primary",
                      isCompleted ? "line-through" : isCurrent ? "" : ""
                    )}
                  >
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Tooltip for next phase */}
            {shouldShowTooltip && tooltipInfo && (
              <div className='absolute -top-[140px] right-0 z-10'>
                <div className='relative'>
                  <div className={cn("rounded-2xl p-4 text-white shadow-lg", tooltipInfo.color)}>
                    <div
                      className={cn(
                        "mb-2 w-fit rounded-md p-[10px] text-xs font-medium tracking-wider",
                        tooltipInfo.labelBgColor
                      )}
                    >
                      {tooltipInfo.label}
                    </div>
                    <div className='mb-1 text-xs font-medium'>{tooltipInfo.title}</div>
                    <div className='mb-3 text-xs font-medium'>{tooltipInfo.description}</div>
                  </div>
                  {/* Arrow pointing to the phase */}
                  <div
                    className={cn(
                      "absolute left-[75%] top-[100%] size-5 -translate-y-1/2 rotate-45 transform",
                      tooltipInfo.color
                    )}
                  />
                </div>
              </div>
            )}

            {isCurrent && onStartCurrentPhase && (
              <Button onClick={onStartCurrentPhase} className='ml-4 flex !h-auto space-x-2'>
                <span className='flex items-center space-x-2 text-xl font-medium'>
                  <span>Start</span>
                  <ArrowRightIcon className='size-4 stroke-[3px]' />
                </span>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SectionProgressTrackerProps {
  sections: Array<{
    key: string;
    title: string;
  }>;
  currentSection: number;
  completedSections: string[];
  onSectionClick?: (sectionIndex: number) => void;
}

export function SectionProgressTracker({
  sections,
  currentSection,
  completedSections,
  onSectionClick,
}: SectionProgressTrackerProps) {
  return (
    <div
      className='scrollbar-hide max-h-[63vh] space-y-8 overflow-y-auto'
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {sections.map((section, index) => {
        const isCompleted = completedSections.includes(section.key);
        const isCurrent = index === currentSection;
        const isClickable = isCompleted && onSectionClick;

        return (
          <div key={section.key} className='flex items-center space-x-4'>
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full transition-colors",
                isCompleted
                  ? "bg-tertiary text-white"
                  : isCurrent
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-text-muted/70",
                isClickable && "cursor-pointer hover:opacity-80"
              )}
              onClick={() => isClickable && onSectionClick(index)}
            >
              {isCompleted ? (
                <CheckIcon className='size-5 rotate-6 stroke-[3.5px]' />
              ) : (
                <span className='text-base font-medium'>{index + 1}</span>
              )}
            </div>
            <div
              className={cn("flex-1", isClickable && "cursor-pointer")}
              onClick={() => isClickable && onSectionClick(index)}
            >
              <h3
                className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-text-muted/80" : isCurrent ? "text-primary" : "text-text-muted/70"
                )}
              >
                {section.title}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Vertical timeline progress tracker for phase pages
interface VerticalProgressTrackerProps {
  phases: Array<{
    key: string;
    title: string;
    isCompleted?: boolean;
  }>;
  currentPhase: number;
}

export function VerticalProgressTracker({ phases, currentPhase }: VerticalProgressTrackerProps) {
  return (
    <div className='relative space-y-12'>
      {phases.map((phase, index) => {
        const isCompleted = phase.isCompleted || index < currentPhase;
        const isCurrent = index === currentPhase;
        const isLast = index === phases.length - 1;

        return (
          <div key={phase.key} className='relative flex items-center'>
            {/* Connecting line */}
            {!isLast && (
              <div className={`absolute left-6 top-14 h-8 w-0.5 ${isCompleted ? "bg-tertiary" : "bg-[#CCCCCC]"}`} />
            )}

            {/* Circle */}
            <div
              className={cn(
                "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors",
                isCompleted
                  ? "bg-tertiary text-white"
                  : isCurrent
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-text-muted"
              )}
            >
              {isCompleted ? <Check className='size-5' /> : <span className='text-xl font-medium'>{index + 1}</span>}
            </div>

            {/* Title */}
            <div className='ml-4'>
              <h3
                className={cn(
                  "text-base font-medium",
                  isCompleted ? "text-primary line-through" : isCurrent ? "text-text-muted/70" : "text-[#CCCCCC]"
                )}
              >
                {phase.title}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
