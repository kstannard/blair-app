"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";

interface RecommendationData {
  personalIntro: string | null;
  personalizedWhy: string | null;
  userProfile: {
    traits: string;
    strengths: string;
    summary: string | null;
    unfairAdvantageEvidence: string | null;
    unfairAdvantageDescription: string | null;
    linkedinSummary: string | null;
    notableExperience: string | null;
  } | null;
}

interface NicheEditorProps {
  pathSlug: string;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  recommendationData: RecommendationData | null;
}

function parseToChips(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item: string) => item.trim()).filter(Boolean);
    }
  } catch {
    // not JSON, fall through
  }
  // Split by newlines or bullet points
  return value
    .split(/\n/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

function extractPrePopulationChips(recommendationData: RecommendationData | null): string[] {
  if (!recommendationData) return [];
  const profile = recommendationData.userProfile;

  if (profile?.notableExperience) {
    return parseToChips(profile.notableExperience);
  } else if (profile?.linkedinSummary) {
    return parseToChips(profile.linkedinSummary);
  } else if (recommendationData.personalIntro) {
    return parseToChips(recommendationData.personalIntro);
  }
  return [];
}

// Generate "what companies pay for" suggestions based on selected items and path
const pathPayForSuggestions: Record<string, { title: string; description: string }[]> = {
  "gtm-growth-strategist": [
    { title: "Building the first outbound motion", description: "Companies that hit product-market fit need someone to build a repeatable sales engine from scratch." },
    { title: "Pipeline architecture and optimization", description: "Growth-stage teams with leaky funnels need someone who can diagnose and fix conversion gaps." },
    { title: "New market entry strategy", description: "Companies expanding into new segments need a go-to-market plan they can execute in weeks, not quarters." },
    { title: "Sales process design", description: "Teams scaling past founder-led sales need a structured process that new reps can follow on day one." },
  ],
  "messaging-positioning": [
    { title: "Brand positioning from scratch", description: "Companies that can't explain what makes them different need someone to nail the message." },
    { title: "Website messaging overhaul", description: "Businesses with decent traffic but low conversion need copy that actually speaks to their buyer." },
    { title: "Launch messaging and narrative", description: "Teams launching a new product need a story that makes the right people lean in." },
    { title: "Competitive differentiation strategy", description: "Companies losing deals to competitors need sharper positioning that highlights their unique angle." },
  ],
  "fractional-cmo": [
    { title: "Marketing strategy and team leadership", description: "Growth-stage companies that need a senior marketing leader without the full-time cost." },
    { title: "Demand generation engine", description: "Companies stuck on random acts of marketing need a system that reliably produces pipeline." },
    { title: "Marketing team buildout", description: "Founders who don't know who to hire first need someone to design and recruit the right team." },
    { title: "Investor-ready marketing infrastructure", description: "Post-raise companies need metrics, systems, and strategy that satisfy the board." },
  ],
  "content-thought-leadership": [
    { title: "Thought leadership content engine", description: "Executives with great ideas but no time to write need someone to turn their expertise into content." },
    { title: "Content strategy and distribution", description: "Companies publishing content with no results need a strategy tied to actual business outcomes." },
    { title: "Ghostwriting for founders", description: "Founders building a personal brand need a writer who can capture their voice and publish consistently." },
    { title: "Inbound content system", description: "B2B companies that want content-driven leads need a full-stack system from strategy to distribution." },
  ],
  "revenue-operations": [
    { title: "CRM architecture and cleanup", description: "Companies with messy data and unreliable forecasting need someone to design the right infrastructure." },
    { title: "Revenue process automation", description: "Scaling teams drowning in manual handoffs need automated workflows that don't break." },
    { title: "Cross-team revenue alignment", description: "Companies where marketing and sales blame each other need someone to build the connective tissue." },
    { title: "Pipeline analytics and reporting", description: "Leadership teams flying blind need dashboards and metrics they can actually trust." },
  ],
};

const defaultPayForSuggestions = [
  { title: "Strategic consulting engagements", description: "Companies that need expert guidance on your area of specialty, delivered in focused sprints." },
  { title: "Implementation and buildout", description: "Teams that know what they need but don't have the in-house expertise to execute." },
  { title: "Fractional leadership", description: "Organizations that need senior-level thinking without the full-time commitment." },
  { title: "Training and enablement", description: "Companies that want to build internal capability with expert-led programs." },
];

export function NicheEditor({ pathSlug, savedData, onSave, recommendationData }: NicheEditorProps) {
  const hasPrePopulated = useRef(false);
  const [newItemText, setNewItemText] = useState("");
  const [refineSuggestion, setRefineSuggestion] = useState<string | null>(null);

  // Step 1: chips (array of strings)
  const step1Items = (savedData.step1Items as string[]) || [];
  // Step 2: indices of selected items from step 1
  const step2Selections = (savedData.step2Selections as number[]) || [];
  // Step 3: indices of selected pay-for suggestions
  const step3Selections = (savedData.step3Selections as number[]) || [];

  // Track user interactions per step
  const step1Interacted = !!savedData.step1Interacted;
  const step2Interacted = !!savedData.step2Interacted;
  const step3Interacted = !!savedData.step3Interacted;

  // Pre-populate chips on first load
  useEffect(() => {
    if (hasPrePopulated.current) return;
    if (!recommendationData) return;
    if (step1Items.length > 0) {
      hasPrePopulated.current = true;
      return;
    }

    const chips = extractPrePopulationChips(recommendationData);
    if (chips.length > 0) {
      hasPrePopulated.current = true;
      onSave({
        ...savedData,
        step1Items: chips,
        prePopulated: true,
      });
    }
  }, [recommendationData, step1Items.length, onSave, savedData]);

  // Get suggestions for step 3
  const payForSuggestions = pathPayForSuggestions[pathSlug] || defaultPayForSuggestions;

  // Handlers
  const handleRemoveChip = (index: number) => {
    const updated = step1Items.filter((_, i) => i !== index);
    // Also update step2 selections to account for removed index
    const updatedStep2 = step2Selections
      .filter((sel) => sel !== index)
      .map((sel) => (sel > index ? sel - 1 : sel));
    onSave({
      ...savedData,
      step1Items: updated,
      step2Selections: updatedStep2,
      step1Interacted: true,
    });
  };

  const handleAddItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    onSave({
      ...savedData,
      step1Items: [...step1Items, text],
      step1Interacted: true,
    });
    setNewItemText("");
  };

  const handleAddItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleToggleStep2 = (index: number) => {
    const updated = step2Selections.includes(index)
      ? step2Selections.filter((i) => i !== index)
      : [...step2Selections, index];
    onSave({
      ...savedData,
      step2Selections: updated,
      step2Interacted: true,
    });
  };

  const handleToggleStep3 = (index: number) => {
    let updated: number[];
    if (step3Selections.includes(index)) {
      updated = step3Selections.filter((i) => i !== index);
    } else {
      // Limit to 2 selections
      if (step3Selections.length >= 2) {
        updated = [step3Selections[1], index];
      } else {
        updated = [...step3Selections, index];
      }
    }
    onSave({
      ...savedData,
      step3Selections: updated,
      step3Interacted: true,
    });
  };

  // Auto-check completion
  const autoChecks = {
    listedProblems: step1Interacted && step1Items.length > 0,
    identifiedEnergizing: step2Interacted && step2Selections.length > 0,
    filteredPayable: step3Interacted && step3Selections.length > 0,
  };

  return (
    <div className="space-y-10">
      {/* Tip */}
      <div className="rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-5">
        <p className="text-sm font-semibold text-blair-sage-dark">
          Quick tip
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
          The tighter your niche, the easier it is to find clients, charge
          premium rates, and build a reputation. Specificity isn't a limitation
          - it's your competitive advantage.
        </p>
      </div>

      {/* Narrowing exercise */}
      <div>
        <h3 className="font-serif text-xl text-blair-midnight">
          The narrowing exercise
        </h3>
        <p className="mt-2 text-sm text-blair-charcoal/50">
          Work through these three steps top to bottom. Each one narrows your
          focus.
        </p>

        <div className="relative mt-8 space-y-0">
          {/* Vertical connector line */}
          <div className="absolute left-5 top-10 bottom-10 w-px bg-blair-mist" />

          {/* Step 1: What you've done */}
          <div className="relative pb-10">
            <div className="flex items-start gap-4">
              <div className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                step1Items.length > 0
                  ? "border-blair-sage bg-blair-sage text-white"
                  : "border-blair-mist bg-white text-blair-charcoal/40"
              )}>
                1
              </div>
              <div className="flex-1 rounded-xl border border-blair-mist bg-white p-6">
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <h4 className="text-base font-semibold text-blair-midnight">
                    What you've done
                  </h4>
                  <span className="shrink-0 text-xs font-medium text-blair-charcoal/30 uppercase tracking-wide">
                    Broad
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-blair-charcoal/60">
                  Here's what we found from your background. Add anything we missed.
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-2">
                  {step1Items.map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 rounded-lg border border-blair-mist bg-blair-linen/50 px-3 py-2 text-sm text-blair-charcoal transition-all hover:border-blair-charcoal/20"
                    >
                      <span className="leading-snug">{item}</span>
                      <button
                        onClick={() => handleRemoveChip(i)}
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-blair-charcoal/30 transition-colors hover:bg-blair-charcoal/10 hover:text-blair-charcoal/60"
                        aria-label="Remove"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add another */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleAddItemKeyDown}
                    placeholder="Add a problem you've solved..."
                    className="flex-1 rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                  />
                  <button
                    onClick={handleAddItem}
                    disabled={!newItemText.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blair-mist px-3 py-2 text-sm font-medium text-blair-sage-dark transition-colors hover:bg-blair-sage/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                  </button>
                </div>

                {/* AI action buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <RefineButton
                    label="Sharpen this"
                    taskType="niche-editor"
                    action="sharpen"
                    fieldName="step1Items"
                    currentValue={step1Items.join(", ")}
                    context={{ pathSlug }}
                    onResult={(result) => setRefineSuggestion(result)}
                  />
                  <RefineButton
                    label="Get more specific"
                    taskType="niche-editor"
                    action="get-specific"
                    fieldName="step1Items"
                    currentValue={step1Items.join(", ")}
                    context={{ pathSlug }}
                    onResult={(result) => setRefineSuggestion(result)}
                  />
                  <RefineButton
                    label="Show me an example"
                    taskType="niche-editor"
                    action="example"
                    fieldName="step1Items"
                    currentValue={step1Items.join(", ")}
                    context={{ pathSlug }}
                    onResult={(result) => setRefineSuggestion(result)}
                  />
                </div>

                {/* Inline suggestion */}
                {refineSuggestion && (
                  <div className="mt-3 rounded-lg border border-blair-sage/20 bg-blair-sage/5 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-blair-charcoal/80">
                      {refineSuggestion}
                    </p>
                    <button
                      onClick={() => setRefineSuggestion(null)}
                      className="mt-2 text-xs text-blair-charcoal/40 hover:text-blair-charcoal/60"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: What lights you up */}
          <div className="relative pb-10">
            <div className="flex items-start gap-4">
              <div className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                step2Selections.length > 0
                  ? "border-blair-sage bg-blair-sage text-white"
                  : "border-blair-mist bg-white text-blair-charcoal/40"
              )}>
                2
              </div>
              <div className="flex-1 rounded-xl border border-blair-mist bg-white p-6">
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <h4 className="text-base font-semibold text-blair-midnight">
                    What lights you up
                  </h4>
                  <span className="shrink-0 text-xs font-medium text-blair-charcoal/30 uppercase tracking-wide">
                    Narrowing
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-blair-charcoal/60">
                  Which of these made you lose track of time? Select the ones that light you up.
                </p>

                {step1Items.length === 0 ? (
                  <p className="text-sm italic text-blair-charcoal/30">
                    Add items in Step 1 first, then come back here to pick your favorites.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {step1Items.map((item, i) => {
                      const isSelected = step2Selections.includes(i);
                      return (
                        <button
                          key={i}
                          onClick={() => handleToggleStep2(i)}
                          className={cn(
                            "rounded-lg border px-4 py-2.5 text-sm text-left transition-all",
                            isSelected
                              ? "border-blair-sage bg-blair-sage text-white shadow-sm"
                              : "border-blair-mist bg-blair-linen/50 text-blair-charcoal hover:border-blair-sage/40"
                          )}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: What companies pay for */}
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                step3Selections.length > 0
                  ? "border-blair-sage bg-blair-sage text-white"
                  : "border-blair-mist bg-white text-blair-charcoal/40"
              )}>
                3
              </div>
              <div className="flex-1 rounded-xl border border-blair-mist bg-white p-6">
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <h4 className="text-base font-semibold text-blair-midnight">
                    What companies pay for
                  </h4>
                  <span className="shrink-0 text-xs font-medium text-blair-charcoal/30 uppercase tracking-wide">
                    Focused
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-blair-charcoal/60">
                  Based on what energizes you, here's what companies actually hire for. Pick what fits.
                </p>

                {step2Selections.length === 0 ? (
                  <p className="text-sm italic text-blair-charcoal/30">
                    Select what energizes you in Step 2, and we'll show you what companies pay for.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {payForSuggestions.map((suggestion, i) => {
                      const isSelected = step3Selections.includes(i);
                      return (
                        <button
                          key={i}
                          onClick={() => handleToggleStep3(i)}
                          className={cn(
                            "w-full rounded-lg border p-4 text-left transition-all",
                            isSelected
                              ? "border-blair-sage bg-blair-sage text-white shadow-sm"
                              : "border-blair-mist bg-blair-linen/50 text-blair-charcoal hover:border-blair-sage/40"
                          )}
                        >
                          <p className={cn(
                            "text-sm font-semibold",
                            isSelected ? "text-white" : "text-blair-midnight"
                          )}>
                            {suggestion.title}
                          </p>
                          <p className={cn(
                            "mt-1 text-xs leading-relaxed",
                            isSelected ? "text-white/80" : "text-blair-charcoal/60"
                          )}>
                            {suggestion.description}
                          </p>
                        </button>
                      );
                    })}
                    <p className="pt-1 text-xs text-blair-charcoal/40">
                      Pick 1-2 that resonate most.
                    </p>
                  </div>
                )}
              </div>
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
            {
              key: "listedProblems",
              label: "I've listed specific problems I've solved",
            },
            {
              key: "identifiedEnergizing",
              label: "I identified which ones energize me",
            },
            {
              key: "filteredPayable",
              label: "I filtered to problems companies will pay to solve",
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
