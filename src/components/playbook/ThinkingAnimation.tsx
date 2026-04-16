"use client";

import { useState, useEffect } from "react";

interface ThinkingAnimationProps {
  /** Whether the thinking animation is active */
  show: boolean;
}

const thinkingSteps = [
  "Looking at what lights you up...",
  "Matching to real engagement types companies hire for...",
  "Pulling in current market rates...",
  "Building your options...",
];

/**
 * A subtle animated indicator that shows Blair is "thinking" while
 * the engagement shapes API call runs. Uses a rotating set of status
 * messages to make the 1-2 second wait feel intentional, not laggy.
 */
export function ThinkingAnimation({ show }: ThinkingAnimationProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!show) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % thinkingSteps.length);
    }, 800);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="flex items-start gap-4">
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blair-sage/40 bg-white">
        {/* Spinning dots */}
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blair-sage" style={{ animationDelay: "0ms" }} />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blair-sage" style={{ animationDelay: "150ms" }} />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blair-sage" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-blair-sage/20 bg-blair-sage/5 p-6">
        <p className="text-sm font-medium text-blair-sage-dark">
          {thinkingSteps[stepIndex]}
        </p>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-blair-mist">
          <div
            className="h-full rounded-full bg-blair-sage/60 transition-all duration-700 ease-out"
            style={{ width: `${((stepIndex + 1) / thinkingSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
