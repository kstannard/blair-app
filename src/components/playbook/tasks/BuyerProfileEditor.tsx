"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";

interface BuyerProfileEditorProps {
  pathSlug: string;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
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
    "LinkedIn communities relevant to your niche",
    "Industry-specific Slack groups",
    "Conferences and events in your space",
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
}: BuyerProfileEditorProps) {
  const [refineSuggestion, setRefineSuggestion] = useState<string | null>(null);
  const defaults = pathDefaults[pathSlug] || fallbackDefaults;

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

  return (
    <div className="space-y-10">
      {/* Tip */}
      <div className="rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-5">
        <p className="text-sm font-semibold text-blair-sage-dark">
          Quick tip
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
          You're not describing a demographic. You're building a profile of
          someone with a real problem at a specific moment in time. The more
          vividly you can picture this person, the more effective your sales
          conversations and marketing will be.
        </p>
      </div>

      {/* Buyer title */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Their title
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Who is the person that would hire you? Be as specific as possible.
        </p>
        <input
          type="text"
          value={buyerTitle}
          onChange={(e) => handleChange("buyerTitle", e.target.value)}
          className="mt-3 w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-base text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />

        {/* AI action buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          <RefineButton
            label="Suggest a buyer"
            taskType="buyer-profile-editor"
            action="suggest-buyer"
            fieldName="buyerTitle"
            currentValue={buyerTitle}
            context={{ pathSlug, fieldName: "buyerTitle" }}
            onResult={(result) => {
              setRefineSuggestion(result);
            }}
          />
          <RefineButton
            label="Add more detail"
            taskType="buyer-profile-editor"
            action="add-detail"
            fieldName="buyerTitle"
            currentValue={buyerTitle}
            context={{ pathSlug, fieldName: "buyerTitle" }}
            onResult={(result) => setRefineSuggestion(result)}
          />
          <RefineButton
            label="Who else?"
            taskType="buyer-profile-editor"
            action="who-else"
            fieldName="buyerTitle"
            currentValue={buyerTitle}
            context={{ pathSlug, fieldName: "buyerTitle" }}
            onResult={(result) => setRefineSuggestion(result)}
          />
        </div>

        {/* Inline suggestion */}
        {refineSuggestion && (
          <div className="mt-3 rounded-lg border border-blair-sage/20 bg-blair-sage/5 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-blair-charcoal/80">
              {refineSuggestion}
            </p>
            <div className="mt-2 flex gap-3">
              {refineSuggestion.length < 120 && !refineSuggestion.includes("\n") && (
                <button
                  onClick={() => {
                    handleChange("buyerTitle", refineSuggestion);
                    setRefineSuggestion(null);
                  }}
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

      {/* Company type */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Company type and size
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What kind of organization do they work at? Include industry, size, and
          stage if relevant.
        </p>
        <input
          type="text"
          value={companyType}
          onChange={(e) => handleChange("companyType", e.target.value)}
          className="mt-3 w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-base text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
      </div>

      {/* Trigger events */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Trigger events - &ldquo;What just happened to them&rdquo;
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What recent event would make them actively look for someone like you?
          These are the moments when they go from &ldquo;someday&rdquo; to
          &ldquo;right now.&rdquo;
        </p>
        <div className="mt-3 space-y-2">
          {triggerEvents.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleListChange("triggerEvents", i, e.target.value)
                }
                className="flex-1 rounded-lg border border-blair-mist bg-white px-4 py-2.5 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="Describe a trigger event..."
              />
              {triggerEvents.length > 1 && (
                <button
                  onClick={() => handleListRemove("triggerEvents", i)}
                  className="rounded-lg px-2 text-blair-charcoal/30 hover:text-blair-charcoal/60 transition-colors"
                  title="Remove"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => handleListAdd("triggerEvents")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blair-sage-dark hover:bg-blair-sage/5 transition-colors"
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add trigger event
          </button>
        </div>
      </div>

      {/* Budget authority - multi-select */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Budget authority (select all that apply)
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          How do they typically make purchasing decisions? This affects your
          sales approach.
        </p>
        <div className="mt-3 space-y-2">
          {budgetOptions.map((opt) => {
            const isSelected = budgetAuthority.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => handleBudgetToggle(opt.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                  isSelected
                    ? "border-blair-sage bg-blair-sage/5 text-blair-sage-dark font-medium"
                    : "border-blair-mist text-blair-charcoal/60 hover:border-blair-sage/30"
                )}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2",
                    isSelected
                      ? "border-blair-sage bg-blair-sage"
                      : "border-blair-mist"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </div>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Where they hang out */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Where they hang out
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Where does this person spend their professional attention? Think
          communities, platforms, events, and publications.
        </p>
        <div className="mt-3 space-y-2">
          {whereTheyHangOut.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleListChange("whereTheyHangOut", i, e.target.value)
                }
                className="flex-1 rounded-lg border border-blair-mist bg-white px-4 py-2.5 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="A community, platform, or event..."
              />
              {whereTheyHangOut.length > 1 && (
                <button
                  onClick={() => handleListRemove("whereTheyHangOut", i)}
                  className="rounded-lg px-2 text-blair-charcoal/30 hover:text-blair-charcoal/60 transition-colors"
                  title="Remove"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => handleListAdd("whereTheyHangOut")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blair-sage-dark hover:bg-blair-sage/5 transition-colors"
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add a place
          </button>
        </div>
      </div>

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            {
              key: "definedBuyer",
              label: "I defined a specific buyer with a real title",
            },
            {
              key: "identifiedTriggers",
              label: "I identified trigger events that create urgency",
            },
            {
              key: "knowWhereToFind",
              label: "I know where to find this person online",
            },
            {
              key: "couldSpotThem",
              label:
                "I could spot this person on LinkedIn in under 5 minutes",
            },
          ].map(({ key, label }) => {
            const isAutoChecked = autoChecks[key as keyof typeof autoChecks];
            const isChecked = isAutoChecked || !!savedData[key];
            return (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    onSave({ ...savedData, [key]: e.target.checked });
                  }}
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
