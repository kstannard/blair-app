"use client";

import { cn } from "@/lib/utils";

interface OfferBuilderProps {
  pathSlug: string;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

interface OfferDefaults {
  offerName: string;
  duration: string;
  deliverables: string[];
  notIncluded: string[];
  priceLow: number;
  priceHigh: number;
  paymentStructure: string;
}

const pathDefaults: Record<string, OfferDefaults> = {
  "gtm-growth-strategist": {
    offerName: "GTM Launch Sprint",
    duration: "8 weeks",
    deliverables: [
      "ICP research and validation document",
      "Outbound messaging playbook (email + LinkedIn sequences)",
      "Channel strategy and prioritization framework",
      "Pipeline tracking dashboard setup",
      "2 weeks of hands-on execution support",
    ],
    notIncluded: [
      "Ongoing outbound execution after sprint",
      "Paid advertising management",
      "CRM migration or implementation",
      "Hiring or managing SDRs",
    ],
    priceLow: 12000,
    priceHigh: 20000,
    paymentStructure: "50/50",
  },
  "messaging-positioning": {
    offerName: "Brand Positioning Sprint",
    duration: "4 weeks",
    deliverables: [
      "Competitive landscape audit and positioning map",
      "Core messaging framework (positioning statement, value props, proof points)",
      "One-liner and elevator pitch variations",
      "Homepage messaging wireframe",
      "Internal messaging guide for team alignment",
    ],
    notIncluded: [
      "Visual identity or logo design",
      "Website design or development",
      "Ongoing content creation",
    ],
    priceLow: 8000,
    priceHigh: 15000,
    paymentStructure: "50/50",
  },
  "fractional-cmo": {
    offerName: "Fractional CMO Engagement",
    duration: "12 weeks",
    deliverables: [
      "Marketing strategy and 90-day roadmap",
      "Team assessment and hiring plan",
      "Channel mix optimization",
      "Weekly leadership meetings and reporting",
      "Marketing budget framework and ROI tracking",
    ],
    notIncluded: [
      "Day-to-day campaign execution",
      "Graphic design or content writing",
      "PR or media buying",
      "Full-time commitment beyond agreed hours",
    ],
    priceLow: 18000,
    priceHigh: 36000,
    paymentStructure: "monthly",
  },
  "content-thought-leadership": {
    offerName: "Thought Leadership Engine",
    duration: "8 weeks",
    deliverables: [
      "Content strategy and editorial calendar",
      "4 flagship long-form articles (ghostwritten)",
      "LinkedIn content system and template library",
      "Distribution playbook across 3 channels",
      "Performance tracking dashboard",
    ],
    notIncluded: [
      "Social media management",
      "Paid promotion or ad spend",
      "Video production",
      "Ongoing ghostwriting after engagement",
    ],
    priceLow: 10000,
    priceHigh: 18000,
    paymentStructure: "50/50",
  },
  "revenue-operations": {
    offerName: "RevOps Foundation Build",
    duration: "6 weeks",
    deliverables: [
      "Revenue process audit and gap analysis",
      "CRM architecture redesign and cleanup",
      "Pipeline stage definitions and conversion metrics",
      "Cross-functional handoff workflows (marketing to sales to CS)",
      "Executive revenue dashboard",
    ],
    notIncluded: [
      "Ongoing CRM administration",
      "Custom software development",
      "Tool procurement or license management",
      "Sales training or enablement content",
    ],
    priceLow: 12000,
    priceHigh: 22000,
    paymentStructure: "50/50",
  },
};

const fallbackDefaults: OfferDefaults = {
  offerName: "Strategy Sprint",
  duration: "6 weeks",
  deliverables: [
    "Discovery and audit report",
    "Strategic roadmap with priorities",
    "Implementation playbook",
    "Weekly check-in sessions",
    "Final presentation and handoff",
  ],
  notIncluded: [
    "Ongoing execution after sprint",
    "Tool setup or configuration",
    "Team hiring or management",
  ],
  priceLow: 10000,
  priceHigh: 18000,
  paymentStructure: "50/50",
};

const durationOptions = ["4 weeks", "6 weeks", "8 weeks", "12 weeks"];
const paymentOptions = [
  { value: "50/50", label: "50% upfront, 50% on completion" },
  { value: "100-upfront", label: "100% upfront" },
  { value: "monthly", label: "Monthly installments" },
];

export function OfferBuilder({
  pathSlug,
  savedData,
  onSave,
}: OfferBuilderProps) {
  const defaults = pathDefaults[pathSlug] || fallbackDefaults;

  const offerName = (savedData.offerName as string) ?? defaults.offerName;
  const duration = (savedData.duration as string) ?? defaults.duration;
  const deliverables = (savedData.deliverables as string[]) ?? defaults.deliverables;
  const notIncluded = (savedData.notIncluded as string[]) ?? defaults.notIncluded;
  const priceLow = (savedData.priceLow as number) ?? defaults.priceLow;
  const priceHigh = (savedData.priceHigh as number) ?? defaults.priceHigh;
  const paymentStructure =
    (savedData.paymentStructure as string) ?? defaults.paymentStructure;

  const handleChange = (field: string, value: unknown) => {
    onSave({ ...savedData, [field]: value });
  };

  const handleCheckbox = (key: string, checked: boolean) => {
    onSave({ ...savedData, [key]: checked });
  };

  // Dynamic list helpers
  const handleListChange = (field: string, index: number, value: string) => {
    const list = field === "deliverables" ? [...deliverables] : [...notIncluded];
    list[index] = value;
    handleChange(field, list);
  };

  const handleListAdd = (field: string) => {
    const list = field === "deliverables" ? [...deliverables] : [...notIncluded];
    list.push("");
    handleChange(field, list);
  };

  const handleListRemove = (field: string, index: number) => {
    const list = field === "deliverables" ? [...deliverables] : [...notIncluded];
    list.splice(index, 1);
    handleChange(field, list);
  };

  return (
    <div className="space-y-10">
      {/* Callout */}
      <div className="rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-5">
        <p className="text-sm font-semibold text-blair-midnight">
          Thing to watch for
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
          Your first offer doesn't need to be your forever offer. It needs to be
          clear enough that a buyer can say yes in one conversation. The most
          common mistake is trying to include everything. Constraint is your
          friend here.
        </p>
      </div>

      {/* Offer name */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Offer name
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What will you call this engagement? Make it clear and action-oriented.
        </p>
        <input
          type="text"
          value={offerName}
          onChange={(e) => handleChange("offerName", e.target.value)}
          className="mt-3 w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-base text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Duration
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          How long is this engagement? Shorter is usually better for your first
          offer.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {durationOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => handleChange("duration", opt)}
              className={cn(
                "rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                duration === opt
                  ? "border-blair-sage bg-blair-sage/10 text-blair-sage-dark"
                  : "border-blair-mist text-blair-charcoal/60 hover:border-blair-sage/30"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Deliverables
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What concrete things will the client receive? Be specific enough to set
          expectations.
        </p>
        <div className="mt-3 space-y-2">
          {deliverables.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleListChange("deliverables", i, e.target.value)
                }
                className="flex-1 rounded-lg border border-blair-mist bg-white px-4 py-2.5 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="Describe a deliverable..."
              />
              {deliverables.length > 1 && (
                <button
                  onClick={() => handleListRemove("deliverables", i)}
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
            onClick={() => handleListAdd("deliverables")}
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
            Add deliverable
          </button>
        </div>
      </div>

      {/* Not included */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          What&rsquo;s NOT included
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Setting clear boundaries prevents scope creep and protects your time.
          This is just as important as what you include.
        </p>
        <div className="mt-3 space-y-2">
          {notIncluded.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleListChange("notIncluded", i, e.target.value)
                }
                className="flex-1 rounded-lg border border-blair-mist bg-white px-4 py-2.5 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="Something not included..."
              />
              {notIncluded.length > 1 && (
                <button
                  onClick={() => handleListRemove("notIncluded", i)}
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
            onClick={() => handleListAdd("notIncluded")}
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
            Add exclusion
          </button>
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Price range
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          What will you charge for this engagement? Give yourself a range so you
          have room to negotiate.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blair-charcoal/40">
              $
            </span>
            <input
              type="number"
              value={priceLow}
              onChange={(e) =>
                handleChange("priceLow", parseInt(e.target.value) || 0)
              }
              className="w-36 rounded-lg border border-blair-mist bg-white py-2.5 pl-7 pr-4 text-sm text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
            />
          </div>
          <span className="text-sm text-blair-charcoal/40">to</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blair-charcoal/40">
              $
            </span>
            <input
              type="number"
              value={priceHigh}
              onChange={(e) =>
                handleChange("priceHigh", parseInt(e.target.value) || 0)
              }
              className="w-36 rounded-lg border border-blair-mist bg-white py-2.5 pl-7 pr-4 text-sm text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
            />
          </div>
        </div>
      </div>

      {/* Payment structure */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Payment structure
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          How will the client pay? Upfront payments reduce risk for you.
        </p>
        <div className="mt-3 space-y-2">
          {paymentOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChange("paymentStructure", opt.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                paymentStructure === opt.value
                  ? "border-blair-sage bg-blair-sage/5 text-blair-sage-dark font-medium"
                  : "border-blair-mist text-blair-charcoal/60 hover:border-blair-sage/30"
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                  paymentStructure === opt.value
                    ? "border-blair-sage bg-blair-sage"
                    : "border-blair-mist"
                )}
              >
                {paymentStructure === opt.value && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            { key: "namedOffer", label: "I named my offer" },
            { key: "definedScope", label: "I defined what's included and what isn't" },
            { key: "setPricing", label: "I set a price range I feel confident about" },
            {
              key: "wouldBuyThis",
              label: "If I were the buyer, I'd understand exactly what I'm getting",
            },
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
    </div>
  );
}
