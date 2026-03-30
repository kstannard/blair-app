"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";

interface UserProfile {
  traits?: string;
  strengths?: string;
  constraints?: string;
  linkedinSummary?: string | null;
  notableExperience?: string | null;
  summary?: string | null;
  unfairAdvantageDescription?: string | null;
}

interface QuizContext {
  role: string | null;
  years: string | null;
  companySize: string | null;
  industries: string | null;
  businessModels: string | null;
  shoulderTap: string | null;
  weirdlyGood: string | null;
  managingComfort: string | null;
  workMode: string | null;
  energyDrains: string | null;
  sameOrDifferent: string | null;
  blocker: string | null;
  interests: string | null;
  bestScenario: string | null;
  successGoal: string | null;
  whatToAvoid: string | null;
  incomeTimeline: string | null;
  zeroIncomeImpact: string | null;
  liquidCapital: string | null;
  borrowingComfort: string | null;
  networkContacts: string | null;
  outreachComfort: string | null;
  publicVisibility: string | null;
  weeklyTime: string | null;
  workingConditions: string | null;
  kidsAges: string | null;
}

interface PositioningEditorProps {
  pathSlug: string;
  userProfile: UserProfile | null;
  nicheData: Record<string, unknown> | null;
  quizContext: QuizContext | null;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

// Path display names and core methods
const pathInfo: Record<string, { name: string; method: string; buyer: string }> = {
  "fractional-operator": {
    name: "Fractional Operator",
    method: "embedding inside teams as a senior operator who builds systems that outlast the engagement",
    buyer: "growth-stage companies",
  },
  "messaging-positioning": {
    name: "Messaging & Positioning Specialist",
    method: "running focused positioning sprints that turn confused brands into clear stories",
    buyer: "companies going through a rebrand, launch, or pivot",
  },
  "gtm-growth-strategist": {
    name: "GTM & Growth Strategist",
    method: "building focused go-to-market playbooks and launch sprints",
    buyer: "B2B companies entering new markets or scaling past founder-led sales",
  },
  "automation-systems-builder": {
    name: "Automation & Systems Builder",
    method: "designing and building the operational infrastructure that lets teams scale without hiring",
    buyer: "growing companies drowning in manual processes",
  },
  "content-engine-operator": {
    name: "Content Engine Operator",
    method: "building content systems that turn expertise into consistent, strategic distribution",
    buyer: "founders and companies that know they should be publishing but can't do it consistently",
  },
  "lead-gen-operator": {
    name: "Lead Gen Operator",
    method: "building and managing lead generation engines tied to real pipeline and ROI",
    buyer: "B2B companies that need a steady flow of qualified leads",
  },
  "studio-builder": {
    name: "Studio Builder",
    method: "packaging expertise into repeatable products and systems that sell without trading hours for dollars",
    buyer: "professionals and companies looking to productize their knowledge",
  },
  "niche-talent-placement": {
    name: "Niche Talent & Placement Operator",
    method: "matching specialized talent with the right opportunities through deep industry knowledge",
    buyer: "companies that need niche hires they can't find through traditional recruiting",
  },
  "investor-operator": {
    name: "Investor-Operator",
    method: "bringing operational expertise and strategic oversight to portfolio companies",
    buyer: "early-stage companies and investment firms",
  },
};

function parseNotableExperience(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    // Not JSON, try splitting by newlines
    return raw.split(/\n/).map((l) => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
  }
  return [];
}

// Map quiz answers to readable labels for positioning drafts
const companySizeLabels: Record<string, string> = {
  "Early startup (0-20 people)": "early-stage startups",
  "Growing company (21-200 people)": "growing companies",
  "Mid-size company (201-1000 people)": "mid-size companies",
  "Enterprise (1001-10000 people)": "enterprise companies",
  "Global enterprise (10001+ people)": "large enterprise organizations",
};

const industryLabels: Record<string, string> = {
  "Education & Learning": "education",
  "Energy & Utilities": "energy",
  "Financial Services & Insurance": "financial services",
  "Healthcare & Life Sciences": "healthcare",
  "Manufacturing & Industrial": "manufacturing",
  "Media & Marketing & Advertising": "media and marketing",
  "Public Sector & Government": "public sector",
  "Real Estate & Construction": "real estate",
  "Retail & Ecommerce": "retail and ecommerce",
  "Transportation & Logistics & Supply Chain": "logistics",
};

const businessModelLabels: Record<string, string> = {
  "B2B software / SaaS": "B2B SaaS",
  "B2C software / consumer apps": "B2C",
  "E-commerce or DTC": "ecommerce and DTC",
  "Marketplaces or platforms": "marketplace",
  "Services & consulting": "services",
  "Media / content / community": "media and content",
  "Traditional / cash flow businesses (brick & mortar or local services)": "local and traditional businesses",
};

function parseQuizArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Might be a single value
    return [raw];
  }
  return [raw];
}

function generatePersonalizedDrafts(
  pathSlug: string,
  profile: UserProfile | null,
  nicheData: Record<string, unknown> | null,
  quizContext: QuizContext | null
): string[] {
  const info = pathInfo[pathSlug] || {
    name: "consultant",
    method: "focused, hands-on engagements",
    buyer: "companies",
  };

  // Extract what we know about the user
  const experience = parseNotableExperience(profile?.notableExperience);
  const linkedin = profile?.linkedinSummary || "";

  // Get niche selections if available
  const nicheItems = (nicheData?.step1Items as string[]) || [];
  const step2Selections = (nicheData?.step2Selections as number[]) || [];
  const energizingItems = step2Selections.map((i) => nicheItems[i]).filter(Boolean);

  // --- Quiz-based signals (primary source) ---
  const quizCompanySizes = parseQuizArray(quizContext?.companySize ?? null);
  const quizIndustries = parseQuizArray(quizContext?.industries ?? null);
  const quizBusinessModels = parseQuizArray(quizContext?.businessModels ?? null);

  // Build company stage descriptor from quiz
  let stageHint = "";
  if (quizCompanySizes.length > 0) {
    // Use the first (or most common) answer
    const primary = quizCompanySizes[0];
    stageHint = companySizeLabels[primary] || "";
  }

  // Build industry descriptor from quiz
  let industryHint = "";
  if (quizIndustries.length > 0) {
    const mapped = quizIndustries
      .map((i) => industryLabels[i])
      .filter(Boolean);
    if (mapped.length === 1) {
      industryHint = mapped[0];
    } else if (mapped.length >= 2) {
      industryHint = `${mapped[0]} and ${mapped[1]}`;
    }
  }

  // Build business model descriptor from quiz
  let modelHint = "";
  if (quizBusinessModels.length > 0) {
    const mapped = quizBusinessModels
      .map((m) => businessModelLabels[m])
      .filter(Boolean);
    if (mapped.length >= 1) {
      modelHint = mapped[0];
    }
  }

  // --- Fallback: text analysis from profile (for seed/demo users without quiz data) ---
  if (!industryHint && !modelHint) {
    const allText = [...experience, linkedin].join(" ").toLowerCase();
    const fallbackIndustries = [
      { keywords: ["saas", "software", "tech", "product"], label: "SaaS" },
      { keywords: ["fintech", "payments", "banking"], label: "fintech" },
      { keywords: ["healthcare", "health", "medical", "wellness"], label: "healthcare" },
      { keywords: ["retail", "ecommerce", "e-commerce"], label: "ecommerce" },
      { keywords: ["agency", "agencies", "creative", "brand"], label: "agency" },
      { keywords: ["b2b", "enterprise", "sales"], label: "B2B" },
      { keywords: ["media", "content", "publishing"], label: "media" },
    ];
    for (const { keywords, label } of fallbackIndustries) {
      if (keywords.some((k) => allText.includes(k))) {
        industryHint = label;
        break;
      }
    }
  }
  if (!stageHint) {
    const allText = [...experience, linkedin].join(" ").toLowerCase();
    const fallbackStages = [
      { keywords: ["series a", "series b", "venture-backed"], label: "venture-backed" },
      { keywords: ["growth-stage", "scaling"], label: "growth-stage" },
      { keywords: ["startup", "early-stage"], label: "early-stage" },
      { keywords: ["enterprise", "fortune 500"], label: "enterprise" },
    ];
    for (const { keywords, label } of fallbackStages) {
      if (keywords.some((k) => allText.includes(k))) {
        stageHint = label;
        break;
      }
    }
  }

  // --- Build audience descriptor ---
  // Priority: model + stage > industry + stage > stage alone > path default
  function buildAudience(): string {
    const parts: string[] = [];
    if (stageHint) parts.push(stageHint);
    if (modelHint) {
      parts.push(`${modelHint} companies`);
    } else if (industryHint) {
      parts.push(`${industryHint} companies`);
    } else {
      parts.push("companies");
    }
    // Join: "growing B2B SaaS companies" or "early-stage healthcare companies"
    return parts.join(" ");
  }

  const audience = buildAudience();
  const topEnergizing = energizingItems.slice(0, 2);
  const topExperience = experience.slice(0, 3);

  // --- Build two personalized drafts ---
  const drafts: string[] = [];

  // Draft 1: Grounded in their experience/niche
  if (topEnergizing.length > 0) {
    const focus = topEnergizing[0].toLowerCase();
    drafts.push(
      `I help ${audience} ${focus} by ${info.method}.`
    );
  } else if (topExperience.length > 0) {
    const skill = topExperience[0];
    // Clean up the skill for natural reading
    const cleanSkill = skill.toLowerCase().replace(/^(led|built|created|designed|developed)\s+/i, "");
    drafts.push(
      `I help ${audience} with ${cleanSkill} by ${info.method}.`
    );
  } else {
    drafts.push(
      `I help ${audience} get results by ${info.method}.`
    );
  }

  // Draft 2: Different structure, outcome-focused
  const hasContext = topExperience.length > 0 || industryHint || modelHint;
  if (hasContext) {
    drafts.push(
      `I'm the outside expert that ${audience} bring in when they need ${info.method} but don't have the in-house expertise to get there.`
    );
  } else {
    drafts.push(
      `I work with ${audience} who need ${info.method} but aren't ready for a full-time hire. I bring focused engagements that deliver results in weeks, not quarters.`
    );
  }

  // Clean up: capitalize first letter after "I help", remove double spaces
  return drafts.map((d) => d.replace(/\s+/g, " ").trim());
}

function buildRefinedStatement(whoInput: string, whatResultInput: string, pathSlug: string): string {
  const who = whoInput.trim() || "companies";
  const result = whatResultInput.trim() || "achieve their goals";
  const info = pathInfo[pathSlug];
  const method = info?.method || "focused, hands-on engagements";

  let cleanWho = who;
  if (cleanWho.length > 0 && cleanWho[0] === cleanWho[0].toUpperCase() && cleanWho[1] !== cleanWho[1]?.toUpperCase()) {
    cleanWho = cleanWho[0].toLowerCase() + cleanWho.slice(1);
  }

  let cleanResult = result;
  cleanResult = cleanResult.replace(/^(I help them|they|to)\s+/i, "");

  return `I help ${cleanWho} ${cleanResult} by ${method}.`;
}

export function PositioningEditor({
  pathSlug,
  userProfile,
  nicheData,
  quizContext,
  savedData,
  onSave,
}: PositioningEditorProps) {
  const drafts = useMemo(
    () => generatePersonalizedDrafts(pathSlug, userProfile, nicheData, quizContext),
    [pathSlug, userProfile, nicheData, quizContext]
  );

  const selectedIndex = savedData.selectedDraft as number | undefined;
  const editedStatement = (savedData.editedStatement as string) || "";
  const showRefinement = !!savedData.showRefinement;
  const refineWho = (savedData.refineWho as string) || "";
  const refineResult = (savedData.refineResult as string) || "";
  const [suggestedRefinement, setSuggestedRefinement] = useState<string>(
    (savedData.suggestedRefinement as string) || ""
  );
  const [editableRefinement, setEditableRefinement] = useState<string>(
    (savedData.suggestedRefinement as string) || ""
  );
  const [refineSuggestion, setRefineSuggestion] = useState<string | null>(null);

  const handleSelectDraft = (index: number) => {
    onSave({
      ...savedData,
      selectedDraft: index,
      editedStatement: drafts[index],
      userModified: true,
    });
  };

  const handleChange = (field: string, value: unknown) => {
    onSave({ ...savedData, [field]: value, userModified: true });
  };

  const handleShowRefinement = () => {
    onSave({ ...savedData, showRefinement: true });
  };

  const handleRefine = () => {
    const refined = buildRefinedStatement(refineWho, refineResult, pathSlug);
    setSuggestedRefinement(refined);
    setEditableRefinement(refined);
    onSave({ ...savedData, suggestedRefinement: refined });
  };

  const handleAcceptRefinement = () => {
    const finalVersion = editableRefinement || suggestedRefinement;
    onSave({
      ...savedData,
      editedStatement: finalVersion,
      suggestedRefinement: "",
      userModified: true,
    });
    setSuggestedRefinement("");
    setEditableRefinement("");
  };

  // Auto-check completion based on actual interaction
  const userHasModified = !!savedData.userModified;
  const statementHasContent = editedStatement.trim().length > 20;

  const autoChecks = {
    selectedDraftCheck: userHasModified && selectedIndex !== undefined,
    customizedStatement: userHasModified && statementHasContent && selectedIndex !== undefined && editedStatement !== drafts[selectedIndex],
    passesTest: userHasModified && statementHasContent && editedStatement.length > 30,
  };

  return (
    <div className="space-y-10">
      {/* Tip */}
      <div className="rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-5">
        <p className="text-sm font-semibold text-blair-sage-dark">
          Quick tip
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
          Your positioning statement isn&apos;t a tagline. It&apos;s the strategic
          foundation for everything you say about your business. Get this right,
          and your website, proposals, and sales conversations all become easier
          to write.
        </p>
      </div>

      {/* Draft selection */}
      <div>
        <h3 className="font-serif text-xl text-blair-midnight">
          Pick a starting point
        </h3>
        <p className="mt-2 text-sm text-blair-charcoal/50">
          We wrote two positioning drafts based on your path and background. Pick the one
          that feels closest, then make it yours.
        </p>

        <div className="mt-6 space-y-3">
          {drafts.map((draft, i) => (
            <button
              key={i}
              onClick={() => handleSelectDraft(i)}
              className={cn(
                "w-full rounded-xl border p-5 text-left transition-all",
                selectedIndex === i
                  ? "border-blair-sage bg-blair-sage/5 ring-1 ring-blair-sage/20"
                  : "border-blair-mist bg-white hover:border-blair-sage/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selectedIndex === i
                      ? "border-blair-sage bg-blair-sage"
                      : "border-blair-mist"
                  )}
                >
                  {selectedIndex === i && (
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
                <p className="text-sm leading-relaxed text-blair-charcoal/80">
                  {draft}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editable textarea */}
      {selectedIndex !== undefined && (
        <div>
          <h3 className="font-serif text-xl text-blair-midnight">
            Make it yours
          </h3>
          <p className="mt-2 text-sm text-blair-charcoal/50">
            Edit the statement below until it sounds like you. It doesn&apos;t need
            to be perfect, it needs to be true.
          </p>
          <textarea
            value={editedStatement}
            onChange={(e) => handleChange("editedStatement", e.target.value)}
            className="mt-4 h-32 w-full resize-none rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-relaxed text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
          />

          {/* AI action buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            <RefineButton
              label="Make it tighter"
              taskType="positioning-editor"
              action="tighter"
              fieldName="editedStatement"
              currentValue={editedStatement}
              context={{ pathSlug }}
              onResult={(result) => setRefineSuggestion(result)}
            />
            <RefineButton
              label="Try a different angle"
              taskType="positioning-editor"
              action="different-angle"
              fieldName="editedStatement"
              currentValue={editedStatement}
              context={{ pathSlug }}
              onResult={(result) => setRefineSuggestion(result)}
            />
            <RefineButton
              label="See how this sounds"
              taskType="positioning-editor"
              action="sound-check"
              fieldName="editedStatement"
              currentValue={editedStatement}
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
              <div className="mt-2 flex gap-3">
                {refineSuggestion.length < 300 && !refineSuggestion.includes("\n\n") && (
                  <button
                    onClick={() => {
                      handleChange("editedStatement", refineSuggestion);
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

          {!showRefinement && (
            <button
              onClick={handleShowRefinement}
              className="mt-4 rounded-lg border border-blair-mist px-5 py-2.5 text-sm font-medium text-blair-charcoal/60 transition-colors hover:border-blair-sage/30 hover:text-blair-sage-dark"
            >
              Help me refine this
            </button>
          )}
        </div>
      )}

      {/* Refinement section */}
      {showRefinement && (
        <div className="rounded-xl border border-blair-sage/20 bg-blair-sage/5 p-6">
          <h4 className="font-serif text-lg text-blair-midnight">
            Let&apos;s sharpen it
          </h4>
          <p className="mt-1 text-sm text-blair-charcoal/50">
            Tell us who you help and what result you deliver. We&apos;ll combine them into a tighter version.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-medium text-blair-midnight">
                Who do you help? Be specific about the type of person or company.
              </label>
              <input
                type="text"
                value={refineWho}
                onChange={(e) => handleChange("refineWho", e.target.value)}
                className="mt-2 w-full rounded-lg border border-blair-sage/20 bg-white px-4 py-3 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="e.g., Series A SaaS startups, founder-led agencies, growth-stage B2B companies..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blair-midnight">
                What result do you deliver? Think outcomes, not activities.
              </label>
              <input
                type="text"
                value={refineResult}
                onChange={(e) => handleChange("refineResult", e.target.value)}
                className="mt-2 w-full rounded-lg border border-blair-sage/20 bg-white px-4 py-3 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="e.g., build a repeatable pipeline, go from 0 to first 10 enterprise deals..."
              />
            </div>

            {refineWho && refineResult && (
              <button
                onClick={handleRefine}
                className="rounded-lg bg-blair-sage px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
              >
                Refine
              </button>
            )}

            {suggestedRefinement && (
              <div className="rounded-lg border-l-4 border-blair-sage bg-white p-4">
                <p className="text-sm font-semibold text-blair-sage-dark">
                  Here&apos;s a tighter version
                </p>
                <p className="mt-2 text-sm leading-relaxed text-blair-charcoal/60">
                  We combined your inputs into a cleaner format. Edit it below if you want to tweak anything.
                </p>
                <textarea
                  value={editableRefinement}
                  onChange={(e) => setEditableRefinement(e.target.value)}
                  className="mt-3 h-24 w-full resize-none rounded-lg border border-blair-sage/20 bg-blair-sage/5 px-4 py-3 text-base leading-relaxed text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                />
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={handleAcceptRefinement}
                    className="rounded-lg bg-blair-sage px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
                  >
                    Use this version
                  </button>
                  <button
                    onClick={handleRefine}
                    className="rounded-lg border border-blair-mist px-4 py-2 text-sm font-medium text-blair-charcoal/60 transition-colors hover:border-blair-sage/30"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            { key: "selectedDraftCheck", label: "I chose a starting draft" },
            { key: "customizedStatement", label: "I customized the statement in my own words" },
            {
              key: "passesTest",
              label:
                "It passes the cocktail party test: someone could picture my ideal client",
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
