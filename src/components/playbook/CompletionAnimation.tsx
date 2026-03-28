"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CompletionAnimationProps {
  show: boolean;
  isLastTask: boolean;
  nextTaskSlug?: string;
  onAutoAdvance?: () => void;
}

export function CompletionAnimation({
  show,
  isLastTask,
  nextTaskSlug,
  onAutoAdvance,
}: CompletionAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "check" | "transitioning">("idle");

  useEffect(() => {
    if (!show) {
      setPhase("idle");
      return;
    }

    setPhase("check");

    const advanceTimer = setTimeout(() => {
      if (!isLastTask && nextTaskSlug && onAutoAdvance) {
        setPhase("transitioning");
        setTimeout(() => {
          onAutoAdvance();
        }, 400);
      }
    }, 1500);

    return () => {
      clearTimeout(advanceTimer);
    };
  }, [show, isLastTask, nextTaskSlug, onAutoAdvance]);

  if (!show) return null;

  // Celebration for last task
  if (isLastTask && phase === "check") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="text-center animate-in zoom-in-75 duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blair-sage/10">
            <svg
              className="h-10 w-10 text-blair-sage animate-in zoom-in-50 duration-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="mt-6 font-serif text-2xl text-blair-midnight">
            Phase 1 complete!
          </p>
          <p className="mt-2 text-sm text-blair-charcoal/50">
            You've done the hard part. Nice work.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm",
        "animate-in fade-in duration-200",
        phase === "transitioning" && "animate-out fade-out duration-400"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3",
          "animate-in zoom-in-75 duration-500",
          phase === "transitioning" && "animate-out slide-out-to-left-8 duration-400"
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blair-sage/10">
          <svg
            className="h-8 w-8 text-blair-sage animate-in zoom-in-50 duration-500"
            style={{ animationDelay: "100ms" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-blair-sage-dark">Done! Moving on...</p>
      </div>
    </div>
  );
}
