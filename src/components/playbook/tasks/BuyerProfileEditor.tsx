"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";
import { getRoleAwareContent, profileFromRecommendation } from "@/lib/playbook/role-aware-content";

interface BuyerProfileEditorProps {
  pathSlug: string;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  recommendationData?: unknown;
}

interface BuyerDefaults {
  buyerTitle: string;
  companyType: string;
  triggerEvents: string[];
  budgetAuthority: string[];
  whereTheyHangOut: string[];
}

const pathDefaults: Record<string, BuyerDefaults> = {
  "gtm-growth-strategist": {
    buyerTitle: "VP of Sales or Head of Growth",
    companyType: "B2B SaaS, 20-100 employees, Series A or B",
    triggerEvents: [
      "Just raised a funding round and need to scale pipeline",
      "Founder-led sales is hitting a ceiling - need to build a repeatable motion",
      "Entering a new market or segment and need a go-to-market plan",
      "Pipeline has stalled and leadership is asking why",
    ],
    budgetAuthority: ["direct"],
    whereTheyHangOut: [
      "LinkedIn (especially SaaS and sales leadership communities)",
      "Pavilion (formerly Revenue Collective)",
      "SaaStr events and Slack community",
      "Modern Sales Pros Slack",
    ],
  },
  "messaging-positioning": {
    buyerTitle: "Founder, CEO, or Head of Marketing",
    companyType: "Agencies, startups, and growing businesses with 10-50 employees",
    triggerEvents: [
      "Rebranding or launching a new product line",
      "Struggling to differentiate from competitors in sales conversations",
      "Website conversion is low despite decent traffic",
      "Just hired a marketing team but they have no clear messaging to work from",
    ],
    budgetAuthority: ["direct"],
    whereTheyHangOut: [
      "Twitter/X (marketing and startup communities)",
      "Agency-specific Slack groups and communities",
      "Substack newsletters about branding and strategy",
      "Creative Mornings and local founder meetups",
    ],
  },
  "fractional-cmo": {
    buyerTitle: "CEO or Founder",
    companyType: "Growth-stage companies, 30-200 employees, $3M-$30M revenue",
    triggerEvents: [
      "Just raised a round and investors are asking about marketing strategy",
      "Marketing team exists but has no senior leadership",
      "Previous VP of Marketing left and they need interim coverage",
      "Board is pressuring for a scalable demand generation engine",
    ],
    budgetAuthority: ["direct"],
    whereTheyHangOut: [
      "CEO peer groups (YPO, EO, Vistage)",
      "VC portfolio events and founder communities",
      "LinkedIn (C-suite and founder networks)",
      "Industry-specific conferences",
    ],
  },
  "content-thought-leadership": {
    buyerTitle: "Founder, CEO, or VP of Marketing",
    companyType: "B2B companies, professional services, or personal brands",
    triggerEvents: [
      "Trying to build authority in a competitive market",
      "Know they should be creating content but can't figure out how to start",
      "Previous content efforts produced no measurable results",
      "Preparing for a book launch, speaking career, or major visibility push",
    ],
    budgetAuthority: ["direct"],
    whereTheyHangOut: [
      "LinkedIn (thought leadership and content creator communities)",
      "Substack and newsletter communities",
      "Podcasting and speaking circuits",
      "Content marketing Slack groups and communities",
    ],
  },
  "revenue-operations": {
    buyerTitle: "VP of Sales, CRO, or Head of Revenue Operations",
    companyType: "B2B companies, 50-500 employees, scaling rapidly",
    triggerEvents: [
      "Just hired their first VP of Sales and need operational infrastructure",
      "CRM is a mess and forecasting is unreliable",
      "Marketing and sales are blaming each other for pipeline problems",
      "Preparing for a board meeting and need clean revenue metrics",
    ],
    budgetAuthority: ["needs-approval"],
    whereTheyHangOut: [
      "RevOps Co-op Slack community",
      "LinkedIn (RevOps and sales operations groups)",
      "Salesforce and HubSpot user communities",
      "SaaStr and RevOps-specific conferences",
    ],
  },
};

const fallbackDefaults: BuyerDefaults = {
  buyerTitle: "Decision-maker at your target company",
  companyType: "Companies that match your ideal client profile",
  triggerEvents: [
    "A recent organizational change that creates urgency",
    "A growth milestone that reveals capability gaps",
    "A competitive threat that demands a strategic response",
  ],
  budgetAuthority: ["direct"],
  whereTheyHangOut: [
    "LinkedIn (industry-specific communities and thought leaders)",
    "Slack groups in their space (e.g. Pavilion, RevOps Co-op, On Deck)",
    "Conferences and events where your buyers speak or attend",
    "Newsletters and podcasts they subscribe to in your niche",
  ],
};

const budgetOptions = [
  {
    value: "direct",
    label: "Direct budget authority - they can approve the spend themselves",
  },
  {
    value: "needs-approval",
    label: "Needs approval - they champion internally but someone else signs off",
  },
  {
    value: "committee",
    label: "Committee decision - multiple stakeholders must agree",
  },
];

export function BuyerProfileEditor({
  pathSlug,
  savedData,
  onSave,
  recommendationData,
}: BuyerProfileEditorProps) {
  const [refineSuggestion, setRefineSuggestion] = useState<string | null>(null);

  // Try role-aware content first. If we have a buyer profile in role-aware
  // content for this (path, profile) combo, convert it to the BuyerDefaults
  // shape and use it. Otherwise fall back to pathDefaults / fallbackDefaults.
  const profile = profileFromRecommendation(recommendationData);
  const roleAware = getRoleAwareContent(pathSlug, profile);
  const defaults: BuyerDefaults = roleAware
    ? {
        buyerTitle: roleAware.buyerProfile.suggestedTitle,
        companyType: roleAware.buyerProfile.suggestedCompanySize,
        triggerEvents: roleAware.buyerProfile.suggestedTriggerEvent
          .split(/[;]\s*/)
          .map((t) => t.trim())
          .filter(Boolean),
        budgetAuthority: ["direct"],
        whereTheyHangOut: roleAware.whereTheyHangOut || pathDefaults[pathSlug]?.whereTheyHangOut || fallbackDefaults.whereTheyHangOut,
      }
    : pathDefaults[pathSlug] || fallbackDefaults;

  const buyerTitle = (savedData.buyerTitle as string) ?? defaults.buyerTitle;
  const companyType = (savedData.companyType as string) ?? defaults.companyType;
  const triggerEvents =
    (savedData.triggerEvents as string[]) ?? defaults.triggerEvents;
  // Support both old single-value and new multi-value format
  const rawBudgetAuth = savedData.budgetAuthority;
  const budgetAuthority: string[] = Array.isArray(rawBudgetAuth)
    ? rawBudgetAuth
    : typeof rawBudgetAuth === "string"
      ? [rawBudgetAuth]
      : defaults.budgetAuthority;
  const whereTheyHangOut =
    (savedData.whereTheyHangOut as string[]) ?? defaults.whereTheyHangOut;

  // Determine if fields are using defaults (pre-populated)
  const isPreFilled = {
    buyerTitle: savedData.buyerTitle === undefined,
    companyType: savedData.companyType === undefined,
    triggerEvents: savedData.triggerEvents === undefined,
    budgetAuthority: savedData.budgetAuthority === undefined,
    whereTheyHangOut: savedData.whereTheyHangOut === undefined,
  };

  const handleChange = (field: string, value: unknown) => {
    onSave({ ...savedData, [field]: value, userModified: true });
  };

  const handleBudgetToggle = (value: string) => {
    const current = [...budgetAuthority];
    const idx = current.indexOf(value);
    if (idx >= 0) {
      // Don't allow deselecting if it's the only one
      if (current.length > 1) {
        current.splice(idx, 1);
      }
    } else {
      current.push(value);
    }
    handleChange("budgetAuthority", current);
  };

  const handleListChange = (field: string, index: number, value: string) => {
    const list =
      field === "triggerEvents" ? [...triggerEvents] : [...whereTheyHangOut];
    list[index] = value;
    handleChange(field, list);
  };

  const handleListAdd = (field: string) => {
    const list =
      field === "triggerEvents" ? [...triggerEvents] : [...whereTheyHangOut];
    list.push("");
    handleChange(field, list);
  };

  const handleListRemove = (field: string, index: number) => {
    const list =
      field === "triggerEvents" ? [...triggerEvents] : [...whereTheyHangOut];
    list.splice(index, 1);
    handleChange(field, list);
  };

  // Auto-check completion
  // Only auto-check when the user has actually interacted with the fields
  const userHasModified = !!savedData.userModified;

  // All 4 core fields have real content
  const allFieldsFilled = !!(
    buyerTitle.trim() &&
    companyType.trim() &&
    triggerEvents.some((t) => t.trim().length > 0) &&
    budgetAuthority.length > 0
  );

  const autoChecks = {
    definedBuyer: userHasModified && !!buyerTitle.trim() && buyerTitle !== fallbackDefaults.buyerTitle,
    identifiedTriggers: userHasModified && triggerEvents.some((t) => t.trim().length > 0),
    knowWhereToFind: userHasModified && whereTheyHangOut.some((w) => w.trim().length > 0),
    couldSpotThem: userHasModified && allFieldsFilled,
  };

  // Shared textarea styling for editable content inside the draft card.
  // Subtle always-visible border so users know it's editable; clear focus state.
  const editableTextarea =
    "w-full resize-none overflow-hidden rounded-lg border border-blair-mist/70 bg-white px-3 py-2.5 text-sm leading-relaxed text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 hover:border-blair-charcoal/20 transition-colors";

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div className="space-y-6">
      {/* Draft card — frames everything as "we wrote this for you" */}
      <div className="overflow-hidden rounded-2xl border border-blair-sage/20 bg-white shadow-sm">
        {/* Header */}
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

        {/* Body */}
        <div className="divide-y divide-blair-mist/50">
          {/* Who hires you */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-blair-sage-dark/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                Who hires you
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              The specific person who&apos;d sign the invoice.
            </p>
            <textarea
              value={buyerTitle}
              onChange={(e) => handleChange("buyerTitle", e.target.value)}
              onInput={(e) => autoResize(e.currentTarget)}
              ref={autoResize}
              rows={1}
              className={`mt-3 ${editableTextarea} text-base`}
            />
            {refineSuggestion && (
              <div className="mt-3 rounded-lg border border-blair-sage/20 bg-blair-sage/5 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-blair-charcoal/80">{refineSuggestion}</p>
                <div className="mt-2 flex gap-3">
                  {refineSuggestion.length < 120 && !refineSuggestion.includes("\n") && (
                    <button
                      onClick={() => { handleChange("buyerTitle", refineSuggestion); setRefineSuggestion(null); }}
                      className="text-xs font-medium text-blair-sage-dark hover:text-blair-sage"
                    >
                      Use this
                    </button>
                  )}
                  <button
                    onClick={() => setRefineSuggestion(null)}
                    className="text-xs text-blair-charcoal/40 hover:text-blair-charcoal/60"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* The kind of company */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-blair-sage-dark/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h15M3 21h18" />
              </svg>
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                The kind of company
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              Size, stage, industry.
            </p>
            <textarea
              value={companyType}
              onChange={(e) => handleChange("companyType", e.target.value)}
              onInput={(e) => autoResize(e.currentTarget)}
              ref={autoResize}
              rows={1}
              className={`mt-3 ${editableTextarea} text-base`}
            />
          </div>

          {/* When they buy */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-blair-sage-dark/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                When they buy
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              The moments that flip them from &ldquo;someday&rdquo; to &ldquo;find someone now.&rdquo;
            </p>
            <div className="mt-3 space-y-2">
              {triggerEvents.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(e) => handleListChange("triggerEvents", i, e.target.value)}
                    onInput={(e) => autoResize(e.currentTarget)}
                    ref={autoResize}
                    rows={1}
                    className={`flex-1 ${editableTextarea}`}
                    placeholder="Describe a trigger event..."
                  />
                  {triggerEvents.length > 1 && (
                    <button
                      onClick={() => handleListRemove("triggerEvents", i)}
                      className="rounded-lg px-2 py-2 text-blair-charcoal/30 hover:text-blair-charcoal/60 transition-colors"
                      title="Remove"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleListAdd("triggerEvents")}
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-blair-sage-dark hover:text-blair-sage transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add a trigger
              </button>
            </div>
          </div>

          {/* How they decide */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-blair-sage-dark/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V12zm-12 0h.008v.008H6V12z" />
              </svg>
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                How they decide
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              Can your buyer sign off, or are you selling to a committee?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {budgetOptions.map((opt) => {
                const isSelected = budgetAuthority.includes(opt.value);
                const shortLabel = opt.label.split(" - ")[0]; // "Direct budget authority" → "Direct budget authority"
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleBudgetToggle(opt.value)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                      isSelected
                        ? "bg-blair-sage text-white"
                        : "border border-blair-mist bg-white text-blair-charcoal/60 hover:border-blair-sage/40 hover:text-blair-charcoal"
                    )}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Where to find them */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-blair-sage-dark/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
                Where to find them
              </label>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
              The newsletters, Slacks, and podcasts they spend professional attention on.
            </p>
            <div className="mt-3 space-y-2">
              {whereTheyHangOut.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(e) => handleListChange("whereTheyHangOut", i, e.target.value)}
                    onInput={(e) => autoResize(e.currentTarget)}
                    ref={autoResize}
                    rows={1}
                    className={`flex-1 ${editableTextarea}`}
                    placeholder="A community, platform, or event..."
                  />
                  {whereTheyHangOut.length > 1 && (
                    <button
                      onClick={() => handleListRemove("whereTheyHangOut", i)}
                      className="rounded-lg px-2 py-2 text-blair-charcoal/30 hover:text-blair-charcoal/60 transition-colors"
                      title="Remove"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleListAdd("whereTheyHangOut")}
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-blair-sage-dark hover:text-blair-sage transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add a place
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            { key: "definedBuyer", label: "I defined a specific buyer with a real title" },
            { key: "identifiedTriggers", label: "I identified trigger events that create urgency" },
            { key: "knowWhereToFind", label: "I know where to find this person online" },
            { key: "couldSpotThem", label: "I could spot this person on LinkedIn in under 5 minutes" },
          ].map(({ key, label }) => {
            const isAutoChecked = autoChecks[key as keyof typeof autoChecks];
            const isChecked = isAutoChecked || !!savedData[key];
            return (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => { onSave({ ...savedData, [key]: e.target.checked }); }}
                  className="h-4.5 w-4.5 rounded border-blair-mist text-blair-sage focus:ring-blair-sage/30 cursor-pointer"
                />
                <span
                  className={cn(
                    "text-sm transition-colors",
                    isChecked
                      ? "text-blair-charcoal/40 line-through"
                      : "text-blair-charcoal/70 group-hover:text-blair-midnight"
                  )}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
