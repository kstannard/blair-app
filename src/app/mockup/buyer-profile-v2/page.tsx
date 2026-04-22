"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mockup: Phase 1 editor redesign
 *
 * Shows current vs proposed side-by-side for the Buyer Profile editor.
 * URL: /mockup/buyer-profile-v2
 *
 * Delete this file once Kristin approves the direction.
 */

// Realistic Jami-like content
const jamiBuyerTitle =
  "Founder, CEO, or CTO at a Series A B2B SaaS company that has product-market fit but no senior product hire yet. Likely someone two degrees out from your network at HP, Zendesk, or Amway who's now running their own thing.";
const jamiCompanyType =
  "20-50 employees, Series A B2B SaaS, raised $10-25M in the last 18 months. Has a VP of Engineering and a Head of Sales but no senior product person.";
const jamiTriggerEvents = [
  "Just raised a round and the roadmap is drifting because the founder is still owning product full-time",
  "Promoted a junior PM into a stretch role and that PM needs senior coaching to land it",
  "A major launch is coming up and discovery hasn't been done",
  "VP Engineering is asking for a clearer roadmap and there's nobody at the leadership table to provide it",
];
const jamiHangouts = [
  "Lenny's Newsletter community and Slack",
  "First Round Review and the Reforge alumni network",
  "Mind the Product community",
  "Product-focused podcasts (Lenny's Podcast, Product Thinking, This is Product Management)",
  "LinkedIn (posts from Series A SaaS founders and product leaders)",
];

function AutoTextarea({ defaultValue, className }: { defaultValue: string; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onInput={(e) => {
        const el = e.currentTarget;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }}
      ref={(el) => {
        if (el) {
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
        }
      }}
      rows={1}
      className={className}
    />
  );
}

// ============================================================================
// CURRENT DESIGN (what's in prod now)
// ============================================================================

function CurrentBuyerProfile() {
  return (
    <div className="space-y-10">
      {/* Italic quick tip */}
      <p className="text-sm italic leading-relaxed text-blair-charcoal/50">
        You&apos;re not describing a demographic. You&apos;re building a profile of someone with a real problem at a specific moment in time.
      </p>

      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Their title
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Who is the person that would hire you? Be as specific as possible.
        </p>
        <AutoTextarea
          defaultValue={jamiBuyerTitle}
          className="mt-3 w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-snug text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Company type and size
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What kind of organization do they work at? Include industry, size, and stage if relevant.
        </p>
        <AutoTextarea
          defaultValue={jamiCompanyType}
          className="mt-3 w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-snug text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Trigger events &mdash; &ldquo;What just happened to them&rdquo;
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What recent event would make them actively look for someone like you?
        </p>
        <div className="mt-3 space-y-2">
          {jamiTriggerEvents.map((t, i) => (
            <AutoTextarea
              key={i}
              defaultValue={t}
              className="w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-2.5 text-sm leading-snug text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Budget authority
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          How do they typically make purchasing decisions?
        </p>
        <div className="mt-3">
          <div className="rounded-lg border border-blair-sage bg-blair-sage/5 px-4 py-3 text-sm font-medium text-blair-sage-dark">
            Direct budget authority
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Where they hang out
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Where does this person spend their professional attention?
        </p>
        <div className="mt-3 space-y-2">
          {jamiHangouts.map((h, i) => (
            <AutoTextarea
              key={i}
              defaultValue={h}
              className="w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-2.5 text-sm leading-snug text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROPOSED DESIGN — single card, quiet labels, no help text below, prose-feel
// ============================================================================

function ProposedBuyerProfile() {
  return (
    <div>
      {/* One wrapping card with a clear "this is a draft" header */}
      <div className="rounded-2xl border border-blair-sage/20 bg-white">
        <div className="border-b border-blair-sage/15 bg-blair-sage/5 px-6 py-4">
          <p className="text-sm font-semibold text-blair-sage-dark">
            We drafted your buyer profile
          </p>
          <p className="mt-0.5 text-xs text-blair-charcoal/60">
            Based on your quiz and what you told us. Edit anything that doesn&apos;t sound right.
          </p>
        </div>

        <div className="divide-y divide-blair-mist/60">
          {/* Who hires you */}
          <div className="px-6 py-5">
            <label className="text-xs font-medium uppercase tracking-wide text-blair-charcoal/50">
              Who hires you
            </label>
            <AutoTextarea
              defaultValue={jamiBuyerTitle}
              className="mt-2 w-full resize-none overflow-hidden rounded-md bg-transparent px-0 py-0 text-base leading-relaxed text-blair-midnight focus:bg-blair-linen/30 focus:outline-none focus:ring-0 hover:bg-blair-linen/20 transition-colors -mx-2 px-2 rounded"
            />
          </div>

          {/* Company */}
          <div className="px-6 py-5">
            <label className="text-xs font-medium uppercase tracking-wide text-blair-charcoal/50">
              The kind of company
            </label>
            <AutoTextarea
              defaultValue={jamiCompanyType}
              className="mt-2 w-full resize-none overflow-hidden rounded-md bg-transparent px-0 py-0 text-base leading-relaxed text-blair-midnight focus:bg-blair-linen/30 focus:outline-none focus:ring-0 hover:bg-blair-linen/20 transition-colors -mx-2 px-2 rounded"
            />
          </div>

          {/* Trigger events */}
          <div className="px-6 py-5">
            <label className="text-xs font-medium uppercase tracking-wide text-blair-charcoal/50">
              When they buy
            </label>
            <div className="mt-2 space-y-1.5">
              {jamiTriggerEvents.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blair-sage/60" />
                  <AutoTextarea
                    defaultValue={t}
                    className="flex-1 resize-none overflow-hidden rounded-md bg-transparent px-2 py-1 text-sm leading-relaxed text-blair-charcoal hover:bg-blair-linen/20 focus:bg-blair-linen/30 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Budget authority */}
          <div className="px-6 py-5">
            <label className="text-xs font-medium uppercase tracking-wide text-blair-charcoal/50">
              How they decide
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button className="rounded-full bg-blair-sage text-white px-3 py-1 text-xs font-medium">
                Direct budget
              </button>
              <button className="rounded-full border border-blair-mist bg-white text-blair-charcoal/50 px-3 py-1 text-xs hover:border-blair-sage/40">
                Needs approval
              </button>
              <button className="rounded-full border border-blair-mist bg-white text-blair-charcoal/50 px-3 py-1 text-xs hover:border-blair-sage/40">
                Committee
              </button>
            </div>
          </div>

          {/* Where to find */}
          <div className="px-6 py-5">
            <label className="text-xs font-medium uppercase tracking-wide text-blair-charcoal/50">
              Where to find them
            </label>
            <div className="mt-2 space-y-1.5">
              {jamiHangouts.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blair-sage/60" />
                  <AutoTextarea
                    defaultValue={h}
                    className="flex-1 resize-none overflow-hidden rounded-md bg-transparent px-2 py-1 text-sm leading-relaxed text-blair-charcoal hover:bg-blair-linen/20 focus:bg-blair-linen/30 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Page — renders both versions so Kristin can compare
// ============================================================================

export default function MockupPage() {
  const [view, setView] = useState<"current" | "proposed" | "split">("split");

  return (
    <div className="min-h-screen bg-blair-linen">
      <div className="sticky top-0 z-10 border-b border-blair-mist bg-blair-linen/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                Mockup
              </p>
              <h1 className="font-serif text-xl text-blair-midnight">
                Buyer profile editor redesign
              </h1>
            </div>
            <div className="flex gap-1 rounded-lg border border-blair-mist bg-white p-1">
              <button
                onClick={() => setView("split")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "split"
                    ? "bg-blair-sage text-white"
                    : "text-blair-charcoal/60 hover:text-blair-charcoal"
                )}
              >
                Side by side
              </button>
              <button
                onClick={() => setView("current")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "current"
                    ? "bg-blair-sage text-white"
                    : "text-blair-charcoal/60 hover:text-blair-charcoal"
                )}
              >
                Current only
              </button>
              <button
                onClick={() => setView("proposed")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "proposed"
                    ? "bg-blair-sage text-white"
                    : "text-blair-charcoal/60 hover:text-blair-charcoal"
                )}
              >
                Proposed only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div
          className={cn(
            "grid gap-8",
            view === "split" ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto"
          )}
        >
          {(view === "current" || view === "split") && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-blair-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blair-charcoal/60">
                  Current
                </span>
                <p className="text-xs text-blair-charcoal/50">What&apos;s in prod today</p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <CurrentBuyerProfile />
              </div>
            </div>
          )}

          {(view === "proposed" || view === "split") && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-blair-sage/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blair-sage-dark">
                  Proposed
                </span>
                <p className="text-xs text-blair-charcoal/50">Single card, quiet labels, no form-y help text</p>
              </div>
              <div className="rounded-xl bg-blair-linen p-6">
                <ProposedBuyerProfile />
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-blair-mist bg-white p-6 text-sm leading-relaxed text-blair-charcoal/70">
          <p className="font-semibold text-blair-midnight">What changed</p>
          <ul className="mt-3 space-y-2 list-disc list-inside marker:text-blair-sage/60">
            <li>
              <strong>One card wraps everything</strong> with a header that names it as a draft: &ldquo;We drafted your buyer profile. Edit anything that doesn&apos;t sound right.&rdquo; Removes the sense that each field is a separate survey question.
            </li>
            <li>
              <strong>No help text under each label.</strong> Labels become short prompt-style phrases (&ldquo;Who hires you&rdquo;, &ldquo;When they buy&rdquo;) that work on their own.
            </li>
            <li>
              <strong>Labels are quieter</strong> — small uppercase gray, not bold midnight. The pre-populated content becomes the hero.
            </li>
            <li>
              <strong>Editable content looks like prose</strong>, not form inputs. No visible border around the textarea by default. Hover / focus shows a subtle highlight so users still know it&apos;s editable.
            </li>
            <li>
              <strong>Italic quick tip is cut</strong> from the editor body. The task&apos;s why-it-matters subtitle above is enough teaching.
            </li>
            <li>
              <strong>Trigger events and hangouts use dot bullets</strong> instead of boxed rows — reads like a list, not 4 separate inputs.
            </li>
            <li>
              <strong>Budget authority uses pill selectors</strong> instead of full-width buttons — takes less space, doesn&apos;t compete with the content.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
