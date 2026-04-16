"use client";

import { useState } from "react";
import Link from "next/link";
import { SharePrompt } from "./SharePrompt";

interface PhaseCompleteProps {
  /** Phase 1 tasks so we can link back into each one. */
  tasks?: Array<{ slug: string; title: string; order: number }>;
}

export function PhaseComplete({ tasks }: PhaseCompleteProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-10 space-y-6">
      <div className="rounded-xl border border-blair-sage/15 bg-blair-sage/5 px-6 py-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blair-sage-dark">
          Phase 1 Complete
        </p>
        <h2 className="mt-3 font-serif text-2xl text-blair-midnight sm:text-3xl">
          You found your lane.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-blair-charcoal/70">
          You know what you do, who you do it for, and how to talk about it.
          That&apos;s a huge deal.
        </p>
        <p className="mt-4 text-sm text-blair-charcoal/50">
          Phase 2 is coming soon. We&apos;ll notify you when it&apos;s ready.
        </p>

        {/* Expand to see Phase 1 work */}
        {tasks && tasks.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blair-sage-dark transition-colors hover:text-blair-sage"
          >
            {expanded ? "Hide your Phase 1 work" : "See your Phase 1 work"}
            <svg
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Phase 1 task links — visible when expanded */}
      {expanded && tasks && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Link
              key={task.slug}
              href={`/playbook/${task.slug}`}
              className="flex items-center gap-3 rounded-lg border border-blair-mist bg-white px-5 py-3.5 transition-colors hover:border-blair-sage/30"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blair-sage text-xs font-semibold text-white">
                {task.order}
              </div>
              <span className="text-sm font-medium text-blair-midnight">
                {task.title}
              </span>
              <svg
                className="ml-auto h-4 w-4 text-blair-charcoal/30"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      <SharePrompt />
    </div>
  );
}
