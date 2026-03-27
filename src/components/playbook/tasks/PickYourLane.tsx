"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrencyRange } from "@/lib/utils";

interface PathData {
  slug: string;
  name: string;
  description: string;
  incomeRangeLow: number;
  incomeRangeHigh: number;
}

interface SecondaryPathData extends PathData {
  altDescription: string | null;
  altWhyConsider: string | null;
  altTradeoff: string | null;
}

interface PickYourLaneProps {
  primaryPath: PathData | null;
  secondaryPaths: SecondaryPathData[];
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

const stuckOptions = [
  {
    id: "too-client-facing",
    label: "Too client-facing",
    guidance:
      "If heavy client interaction feels draining, look at your backup paths. Some lean more toward deliverable-based work where you can set boundaries on meetings. Consider whether the issue is client work in general, or just a specific type of client. Many consultants solve this by structuring engagements with clear async touchpoints and limiting live calls to kickoff, midpoint, and final delivery.",
  },
  {
    id: "too-time-intensive",
    label: "Too time-intensive",
    guidance:
      "Time intensity is often a pricing problem, not a scope problem. If a path feels like too much work, you may be mentally pricing it too low. At the right price point, you can take fewer clients and still exceed your income goals. Look at the income ranges on each path and consider: what if you only needed 3-4 clients per year instead of 10?",
  },
  {
    id: "not-exciting",
    label: "Not exciting enough",
    guidance:
      "Excitement matters more than most people admit. If your primary recommendation doesn't get you at least a little fired up, trust that instinct. Look at your secondary paths. Sometimes the right path is the one that makes you think \"I could talk about this for hours.\" The best consultants are the ones who genuinely find their work interesting, because that energy is contagious in sales conversations.",
  },
  {
    id: "not-realistic",
    label: "Not realistic right now",
    guidance:
      "Being honest about constraints is a strength, not a weakness. If your primary path requires resources, time, or credentials you don't currently have, that's important information. Look at your secondary paths through the lens of what you can start with today. The best path isn't the most impressive one. It's the one you can actually begin. You can always level up to a more ambitious path after your first few successful engagements.",
  },
];

export function PickYourLane({
  primaryPath,
  secondaryPaths,
  savedData,
  onSave,
}: PickYourLaneProps) {
  const [showBackups, setShowBackups] = useState(
    !!savedData.showBackups
  );
  const [stuckModal, setStuckModal] = useState(false);
  const [selectedStuckOption, setSelectedStuckOption] = useState<string | null>(
    null
  );

  const confirmedSlug = savedData.confirmedPathSlug as string | undefined;
  const isConfirmed = !!confirmedSlug;

  const handleConfirm = (slug: string) => {
    onSave({
      ...savedData,
      confirmedPathSlug: slug,
      confirmedAt: new Date().toISOString(),
    });
  };

  const handleCheckbox = (key: string, checked: boolean) => {
    onSave({ ...savedData, [key]: checked });
  };

  if (!primaryPath) {
    return (
      <div className="rounded-xl border border-blair-mist bg-white p-8 text-center">
        <p className="text-blair-charcoal/60">
          We could not load your recommendation. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const confirmedPath =
    confirmedSlug === primaryPath.slug
      ? primaryPath
      : secondaryPaths.find((p) => p.slug === confirmedSlug);

  return (
    <div className="space-y-8">
      {/* Success state */}
      {isConfirmed && confirmedPath && (
        <div className="rounded-xl border-2 border-blair-sage/30 bg-blair-sage/5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blair-sage/15">
              <svg
                className="h-5 w-5 text-blair-sage-dark"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blair-sage-dark">
                You chose: {confirmedPath.name}
              </p>
              <p className="mt-1 text-sm text-blair-sage-dark/70">
                Great choice. The rest of your playbook will be tailored to this
                path. You can always come back and change this.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary recommendation card */}
      <div
        className={cn(
          "rounded-xl border p-6 transition-all",
          confirmedSlug === primaryPath.slug
            ? "border-blair-sage/20 bg-blair-sage/5"
            : "border-blair-mist bg-white"
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-blair-sage">
          Our recommendation for you
        </p>
        <h3 className="mt-3 font-serif text-2xl text-blair-midnight sm:text-3xl">
          {primaryPath.name}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-blair-charcoal/70">
          {primaryPath.description}
        </p>
        <div className="mt-4 inline-block rounded-lg bg-blair-linen-warm px-4 py-2">
          <p className="text-xs font-medium text-blair-charcoal/50">
            Income range
          </p>
          <p className="text-sm font-semibold text-blair-midnight">
            {formatCurrencyRange(
              primaryPath.incomeRangeLow,
              primaryPath.incomeRangeHigh
            )}
            /yr
          </p>
        </div>

        {!isConfirmed && (
          <div className="mt-6">
            <button
              onClick={() => handleConfirm(primaryPath.slug)}
              className="rounded-lg bg-blair-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark active:scale-[0.98]"
            >
              This feels right
            </button>
          </div>
        )}
      </div>

      {/* Action buttons row */}
      {!isConfirmed && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowBackups(true)}
            className={cn(
              "rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors",
              showBackups
                ? "border-blair-sage/30 bg-blair-sage/5 text-blair-sage-dark"
                : "border-blair-mist text-blair-charcoal/60 hover:border-blair-sage/30 hover:text-blair-sage-dark"
            )}
          >
            See my 2 backup paths
          </button>
          <button
            onClick={() => setStuckModal(true)}
            className="rounded-lg border border-blair-mist px-5 py-2.5 text-sm font-medium text-blair-charcoal/60 transition-colors hover:border-blair-sage/30 hover:text-blair-sage-dark"
          >
            I&rsquo;m stuck
          </button>
        </div>
      )}

      {/* Secondary paths */}
      {showBackups && secondaryPaths.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
            Your backup paths
          </h4>
          {secondaryPaths.map((path) => (
            <div
              key={path.slug}
              className={cn(
                "rounded-xl border p-6 transition-all",
                confirmedSlug === path.slug
                  ? "border-blair-sage/20 bg-blair-sage/5"
                  : "border-blair-mist bg-white"
              )}
            >
              <h3 className="font-serif text-xl text-blair-midnight">
                {path.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-blair-charcoal/70">
                {path.altDescription || path.description}
              </p>
              {path.altWhyConsider && (
                <p className="mt-3 text-sm leading-relaxed text-blair-sage-dark">
                  <span className="font-semibold">Why consider it: </span>
                  {path.altWhyConsider}
                </p>
              )}
              {path.altTradeoff && (
                <p className="mt-2 text-sm leading-relaxed text-blair-charcoal/50">
                  <span className="font-semibold">Tradeoff: </span>
                  {path.altTradeoff}
                </p>
              )}
              <div className="mt-3 inline-block rounded-lg bg-blair-linen-warm px-3 py-1.5">
                <p className="text-xs font-medium text-blair-midnight">
                  {formatCurrencyRange(
                    path.incomeRangeLow,
                    path.incomeRangeHigh
                  )}
                  /yr
                </p>
              </div>
              {!isConfirmed && (
                <div className="mt-4">
                  <button
                    onClick={() => handleConfirm(path.slug)}
                    className="rounded-lg border border-blair-sage px-5 py-2.5 text-sm font-semibold text-blair-sage-dark transition-colors hover:bg-blair-sage hover:text-white"
                  >
                    Choose this instead
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            { key: "reviewedPrimary", label: "I reviewed my primary recommendation" },
            { key: "consideredAlternatives", label: "I considered the alternative paths" },
            { key: "madeDecision", label: "I chose the path that feels right for me" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={!!savedData[key]}
                onChange={(e) => handleCheckbox(key, e.target.checked)}
                className="h-4.5 w-4.5 rounded border-blair-mist text-blair-sage focus:ring-blair-sage/30 cursor-pointer"
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  savedData[key]
                    ? "text-blair-charcoal/40 line-through"
                    : "text-blair-charcoal/70 group-hover:text-blair-midnight"
                )}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stuck modal */}
      {stuckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blair-midnight/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-blair-midnight">
                  What&rsquo;s holding you back?
                </h3>
                <p className="mt-1 text-sm text-blair-charcoal/50">
                  Pick the one that resonates most
                </p>
              </div>
              <button
                onClick={() => {
                  setStuckModal(false);
                  setSelectedStuckOption(null);
                }}
                className="rounded-lg p-1 text-blair-charcoal/30 hover:text-blair-charcoal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {stuckOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedStuckOption(option.id)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all",
                    selectedStuckOption === option.id
                      ? "border-blair-sage/40 bg-blair-sage/5 text-blair-sage-dark"
                      : "border-blair-mist text-blair-charcoal/70 hover:border-blair-sage/20"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {selectedStuckOption && (
              <div className="mt-6 rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-4">
                <p className="text-sm leading-relaxed text-blair-charcoal/80">
                  {
                    stuckOptions.find((o) => o.id === selectedStuckOption)
                      ?.guidance
                  }
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setStuckModal(false);
                  setSelectedStuckOption(null);
                }}
                className="rounded-lg bg-blair-midnight px-5 py-2.5 text-sm font-medium text-white hover:bg-blair-midnight/90"
              >
                Got it, let me decide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
