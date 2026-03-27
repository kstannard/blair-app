"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StepNavProps {
  previousTask: { slug: string; title: string } | null;
  nextTask: { slug: string; title: string } | null;
  onMarkComplete: () => void;
  onUndoComplete?: () => void;
  isComplete: boolean;
  isLoading?: boolean;
}

export function StepNav({
  previousTask,
  nextTask,
  onMarkComplete,
  onUndoComplete,
  isComplete,
  isLoading,
}: StepNavProps) {
  const [showUndo, setShowUndo] = useState(false);

  const handleCompleteClick = () => {
    if (isComplete) {
      if (showUndo) {
        onUndoComplete?.();
        setShowUndo(false);
      } else {
        setShowUndo(true);
      }
    } else {
      onMarkComplete();
    }
  };

  return (
    <div className="mt-16 border-t border-blair-mist pt-8">
      {/* Next task CTA after completion */}
      {isComplete && nextTask && (
        <div className="mb-8 rounded-xl bg-blair-sage/10 border border-blair-sage/20 p-6 text-center">
          <p className="text-lg font-serif text-blair-midnight">
            Nice work! Ready for the next step?
          </p>
          <Link
            href={`/playbook/${nextTask.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blair-sage px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blair-sage-dark active:scale-[0.98]"
          >
            Continue to {nextTask.title}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      )}

      {/* Phase 1 completion card */}
      {isComplete && !nextTask && (
        <div className="mb-8 rounded-xl bg-blair-sage/10 border border-blair-sage/20 p-8 text-center">
          <p className="text-2xl font-serif text-blair-midnight">
            Phase 1 complete!
          </p>
          <p className="mt-4 max-w-lg mx-auto text-base leading-relaxed text-blair-charcoal/70">
            You&apos;ve found your lane. You know your niche, your positioning, your buyer, and you&apos;ve validated it with real people.
          </p>
          <p className="mt-3 text-sm text-blair-charcoal/50">
            Phase 2 is coming soon. We&apos;ll notify you when it&apos;s ready.
          </p>
          <Link
            href="/playbook"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blair-sage px-6 py-3 text-base font-semibold text-white transition-all hover:bg-blair-sage-dark active:scale-[0.98]"
          >
            View your playbook
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Previous */}
        <div className="flex-1">
          {previousTask ? (
            <Link
              href={`/playbook/${previousTask.slug}`}
              className="group inline-flex items-center gap-2 text-sm text-blair-charcoal/50 transition-colors hover:text-blair-sage-dark"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span className="hidden sm:inline">{previousTask.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <Link
              href="/playbook"
              className="group inline-flex items-center gap-2 text-sm text-blair-charcoal/50 transition-colors hover:text-blair-sage-dark"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span>Playbook</span>
            </Link>
          )}
        </div>

        {/* Mark Complete / Undo */}
        <button
          onClick={handleCompleteClick}
          disabled={isLoading}
          className={cn(
            "rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
            isComplete
              ? showUndo
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-blair-sage/10 text-blair-sage-dark hover:bg-blair-sage/20"
              : "bg-blair-sage text-white hover:bg-blair-sage-dark active:scale-[0.98]",
            isLoading && "opacity-60 cursor-wait"
          )}
        >
          {isComplete ? (
            showUndo ? (
              "Undo completion?"
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Completed
              </span>
            )
          ) : (
            "Mark as Complete"
          )}
        </button>

        {/* Next */}
        <div className="flex-1 text-right">
          {nextTask ? (
            <Link
              href={`/playbook/${nextTask.slug}`}
              className={cn(
                "group inline-flex items-center gap-2 text-sm transition-colors",
                isComplete
                  ? "font-bold text-blair-sage-dark hover:text-blair-sage"
                  : "text-blair-charcoal/50 hover:text-blair-sage-dark"
              )}
            >
              <span className="hidden sm:inline">{nextTask.title}</span>
              <span className="sm:hidden">Next</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          ) : (
            <Link
              href="/playbook"
              className="group inline-flex items-center gap-2 text-sm text-blair-charcoal/50 transition-colors hover:text-blair-sage-dark"
            >
              <span>Playbook</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
