"use client";

import { SharePrompt } from "./SharePrompt";

export function PhaseComplete() {
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
      </div>

      <SharePrompt />
    </div>
  );
}
