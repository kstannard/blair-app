"use client";

import { cn } from "@/lib/utils";

interface Phase {
  id: string;
  order: number;
  name: string;
}

interface PhaseRoadmapProps {
  phases: Phase[];
  activePhaseOrder?: number;
  completedPhaseOrders?: number[];
}

export function PhaseRoadmap({
  phases,
  activePhaseOrder = 1,
  completedPhaseOrders = [],
}: PhaseRoadmapProps) {
  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-blair-charcoal/40">
        {phases.length}-Phase Roadmap
      </h2>

      {/* Desktop: horizontal grid */}
      <div className="mt-4 hidden sm:grid sm:grid-cols-5 sm:gap-0">
        {phases.map((phase) => {
          const isComplete = completedPhaseOrders.includes(phase.order);
          const isActive = phase.order === activePhaseOrder;
          return (
            <div
              key={phase.id}
              className="flex flex-col items-center text-center px-1"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isComplete
                    ? "bg-blair-sage text-white"
                    : isActive
                      ? "bg-blair-sage text-white"
                      : "bg-blair-mist text-blair-charcoal/40"
                )}
              >
                {isComplete ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  phase.order
                )}
              </div>
              <p
                className={cn(
                  "mt-2 text-xs leading-tight",
                  isComplete || isActive
                    ? "font-semibold text-blair-midnight"
                    : "text-blair-charcoal/40"
                )}
              >
                {phase.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical stepper */}
      <div className="mt-4 flex flex-col sm:hidden">
        {phases.map((phase, idx) => {
          const isComplete = completedPhaseOrders.includes(phase.order);
          const isActive = phase.order === activePhaseOrder;
          const isLast = idx === phases.length - 1;
          return (
            <div key={phase.id} className="flex items-stretch gap-3">
              {/* Circle + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isComplete
                      ? "bg-blair-sage text-white"
                      : isActive
                        ? "bg-blair-sage text-white"
                        : "bg-blair-mist text-blair-charcoal/40"
                  )}
                >
                  {isComplete ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    phase.order
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[12px]",
                      isComplete ? "bg-blair-sage/30" : "bg-blair-mist"
                    )}
                  />
                )}
              </div>
              {/* Label */}
              <p
                className={cn(
                  "text-sm pb-3 pt-1",
                  isComplete
                    ? "text-blair-sage-dark font-medium"
                    : isActive
                      ? "text-blair-midnight font-semibold"
                      : "text-blair-charcoal/40"
                )}
              >
                {phase.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
