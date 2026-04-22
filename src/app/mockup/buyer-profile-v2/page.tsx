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

// Small inline icon component for section labels
function SectionIcon({ d }: { d: string }) {
  return (
    <svg
      className="h-3.5 w-3.5 text-blair-sage-dark/70"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

// Common textarea styling — always-visible subtle border so it reads editable,
// focus state more obvious.
const editableTextarea =
  "w-full resize-none overflow-hidden rounded-lg border border-blair-mist/70 bg-white px-3 py-2.5 text-sm leading-relaxed text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 hover:border-blair-charcoal/20 transition-colors";

function ProposedBuyerProfile() {
  return (
    <div>
      {/* One wrapping card framed as a draft */}
      <div className="overflow-hidden rounded-2xl border border-blair-sage/20 bg-white shadow-sm">
        {/* Header with warm accent */}
        <div className="border-b border-blair-sage/20 bg-gradient-to-r from-blair-sage/10 to-blair-sage/5 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blair-sage/20">
              <svg className="h-4 w-4 text-blair-sage-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-lg text-blair-midnight">
                We drafted your buyer profile
              </p>
              <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
                Based on your quiz answers and what we could find about you. Edit anything that doesn&apos;t sound right.
              </p>
            </div>
          </div>
        </div>

        {/* Body — sections separated by subtle dividers */}
        <div className="divide-y divide-blair-mist/50">
          {/* Who hires you */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <SectionIcon d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                Who hires you
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              The specific person who&apos;d sign the invoice.
            </p>
            <AutoTextarea
              defaultValue={jamiBuyerTitle}
              className={`mt-3 ${editableTextarea} text-base`}
            />
          </div>

          {/* Company */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <SectionIcon d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h15M3 21h18" />
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                The kind of company
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              Size, stage, industry.
            </p>
            <AutoTextarea
              defaultValue={jamiCompanyType}
              className={`mt-3 ${editableTextarea} text-base`}
            />
          </div>

          {/* Trigger events */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <SectionIcon d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                When they buy
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              The moments that flip them from &ldquo;someday&rdquo; to &ldquo;find someone now.&rdquo;
            </p>
            <div className="mt-3 space-y-2">
              {jamiTriggerEvents.map((t, i) => (
                <AutoTextarea
                  key={i}
                  defaultValue={t}
                  className={editableTextarea}
                />
              ))}
              <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blair-sage-dark hover:text-blair-sage">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add a trigger
              </button>
            </div>
          </div>

          {/* Budget authority */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <SectionIcon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V12zm-12 0h.008v.008H6V12z" />
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                How they decide
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              Can your buyer sign off, or are you selling to a committee?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-full bg-blair-sage text-white px-3.5 py-1.5 text-sm font-medium">
                Direct budget
              </button>
              <button className="rounded-full border border-blair-mist bg-white text-blair-charcoal/60 px-3.5 py-1.5 text-sm hover:border-blair-sage/40 hover:text-blair-charcoal transition-colors">
                Needs approval
              </button>
              <button className="rounded-full border border-blair-mist bg-white text-blair-charcoal/60 px-3.5 py-1.5 text-sm hover:border-blair-sage/40 hover:text-blair-charcoal transition-colors">
                Committee
              </button>
            </div>
          </div>

          {/* Where to find */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <SectionIcon d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                Where to find them
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              The newsletters, Slacks, and podcasts they spend professional attention on.
            </p>
            <div className="mt-3 space-y-2">
              {jamiHangouts.map((h, i) => (
                <AutoTextarea
                  key={i}
                  defaultValue={h}
                  className={editableTextarea}
                />
              ))}
              <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blair-sage-dark hover:text-blair-sage">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add a place
              </button>
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
          <p className="font-semibold text-blair-midnight">What changed (v2, after feedback)</p>
          <ul className="mt-3 space-y-2 list-disc list-inside marker:text-blair-sage/60">
            <li>
              <strong>Editable cue back on.</strong> Textareas have a subtle always-visible border so users immediately know they can edit. Hover shows slightly darker border, focus shows full sage ring.
            </li>
            <li>
              <strong>Visual texture added.</strong> Small icons next to each section label (person, building, lightning, dollar, pin). Header has a soft sage gradient + pencil icon. The card doesn&apos;t feel dead anymore.
            </li>
            <li>
              <strong>Font sizes boosted.</strong> Subcopy under &ldquo;We drafted your buyer profile&rdquo; is now text-sm (was text-xs). Header title is font-serif text-lg. Labels stay uppercase but readable.
            </li>
            <li>
              <strong>Kept the useful copy, cut the noise.</strong> Header has title + one-line subcopy (what we drafted, where from, how to edit). Individual field labels are short prompts only — no redundant help text under each.
            </li>
            <li>
              <strong>Add buttons where they make sense.</strong> Trigger events and hangouts have inline &ldquo;+ Add a trigger&rdquo; / &ldquo;+ Add a place&rdquo; so users can extend without looking for a separate control.
            </li>
            <li>
              <strong>Budget authority pills are bigger / more tappable</strong> than v1, still compact vs. the original full-width buttons.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
