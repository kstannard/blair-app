"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";
  const advantageName = searchParams.get("advantage") || "Your Advantage";
  const oneLiner = searchParams.get("oneLiner") || "";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
      </div>

      {/* Result */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-20 sm:px-10">
        <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700">
          {/* Greeting */}
          <p className="text-sm font-medium text-blair-sage">
            {name}, here&apos;s what we found.
          </p>

          {/* Advantage reveal */}
          <div className="mt-6">
            <p className="text-sm uppercase tracking-widest text-blair-charcoal/40">
              Your unfair advantage
            </p>
            <h1 className="mt-2 font-serif text-4xl text-blair-midnight sm:text-5xl">
              {advantageName}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-blair-charcoal/70">
              {oneLiner}
            </p>
          </div>

          {/* Teaser */}
          <div className="mt-10 rounded-2xl border border-blair-sage/20 bg-blair-sage/5 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-blair-charcoal/70">
              This is one of the most commercially valuable advantages in
              consulting and services. Most people with this advantage
              undercharge by 60% when they first start, because they
              don&apos;t realize how rare it actually is.
            </p>
          </div>

          {/* Locked section */}
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-blair-mist bg-white p-6 sm:p-8">
            {/* Blur overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blair-sage/10">
                <svg
                  className="h-6 w-6 text-blair-sage"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <p className="mt-4 max-w-sm text-center text-sm font-medium text-blair-midnight">
                Unlock your full recommendation, personalized business path,
                and step-by-step playbook.
              </p>
              <a
                href="https://www.hiblair.com/#pricing"
                className="mt-5 rounded-lg bg-blair-sage px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
              >
                Get your personalized plan
              </a>
            </div>

            {/* Blurred content behind */}
            <div className="select-none" aria-hidden>
              <h3 className="font-serif text-lg text-blair-midnight">
                Your full breakdown
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-blair-midnight">
                    What this means for you
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="h-3 w-full rounded bg-blair-mist" />
                    <div className="h-3 w-5/6 rounded bg-blair-mist" />
                    <div className="h-3 w-4/6 rounded bg-blair-mist" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blair-midnight">
                    Where it showed up in your answers
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="h-3 w-full rounded bg-blair-mist" />
                    <div className="h-3 w-3/4 rounded bg-blair-mist" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blair-midnight">
                    Why this matters for building a business
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="h-3 w-full rounded bg-blair-mist" />
                    <div className="h-3 w-5/6 rounded bg-blair-mist" />
                    <div className="h-3 w-2/3 rounded bg-blair-mist" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Already have an account */}
          <div className="mt-8 text-center">
            <Link
              href="/signin"
              className="text-sm text-blair-charcoal/40 transition-colors hover:text-blair-charcoal/60"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
