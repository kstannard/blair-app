"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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

function parseJsonArrayToText(value: string | null): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item: string) => `- ${item}`).join("\n");
    }
    return value;
  } catch {
    return value;
  }
}

function extractPrePopulation(recommendationData: RecommendationData | null) {
  if (!recommendationData) return { whatYouveDone: "", whatLitYouUp: "", whatCompaniesPayFor: "" };

  const profile = recommendationData.userProfile;
  const personalizedWhy = recommendationData.personalizedWhy || "";

  let whatYouveDone = "";
  let whatLitYouUp = "";
  let whatCompaniesPayFor = "";

  // Extract "What you've done" from notableExperience, linkedinSummary, or personalIntro
  if (profile?.notableExperience) {
    whatYouveDone = parseJsonArrayToText(profile.notableExperience);
  } else if (profile?.linkedinSummary) {
    whatYouveDone = parseJsonArrayToText(profile.linkedinSummary);
  } else if (recommendationData.personalIntro) {
    whatYouveDone = recommendationData.personalIntro;
  }

  // Extract "What lit you up" from unfairAdvantageEvidence
  if (profile?.unfairAdvantageEvidence) {
    whatLitYouUp = profile.unfairAdvantageEvidence;
  } else if (profile?.unfairAdvantageDescription) {
    whatLitYouUp = profile.unfairAdvantageDescription;
  }

  // Extract "What companies pay for" from strengths or personalizedWhy
  if (profile?.strengths) {
    whatCompaniesPayFor = parseJsonArrayToText(profile.strengths);
  } else if (personalizedWhy) {
    whatCompaniesPayFor = personalizedWhy;
  }

  return { whatYouveDone, whatLitYouUp, whatCompaniesPayFor };
}

const steps = [
  {
    field: "whatYouveDone",
    title: "What you've done",
    scope: "Broad",
    description:
      "List problems you've solved professionally. Be specific about the type of work, not just job titles.",
    placeholder:
      "e.g., Built outbound sales process for a SaaS startup. Redesigned onboarding flow that doubled activation. Managed $2M ad budget across 3 channels...",
  },
  {
    field: "whatLitYouUp",
    title: "What lit you up",
    scope: "Narrowing",
    description:
      "From your list, which problems made you lose track of time? Which ones would you happily solve again?",
    placeholder:
      "e.g., The outbound playbook was my favorite - I loved the puzzle of figuring out which message resonated with which buyer...",
  },
  {
    field: "whatCompaniesPayFor",
    title: "What companies pay for",
    scope: "Focused",
    description:
      "From the energizing ones, which are urgent enough that someone would hire an outside expert to solve them?",
    placeholder:
      "e.g., Building first outbound motion - companies need this when they hit product-market fit and want to move beyond founder-led sales...",
  },
];

export function NicheEditor({ pathSlug, savedData, onSave, recommendationData }: NicheEditorProps) {
  const whatYouveDone = (savedData.whatYouveDone as string) || "";
  const whatLitYouUp = (savedData.whatLitYouUp as string) || "";
  const whatCompaniesPayFor = (savedData.whatCompaniesPayFor as string) || "";
  const hasPrePopulated = useRef(false);

  // Pre-populate fields on first load if they are empty
  useEffect(() => {
    if (hasPrePopulated.current) return;
    if (!recommendationData) return;

    const hasExistingContent = whatYouveDone || whatLitYouUp || whatCompaniesPayFor;
    if (hasExistingContent) {
      hasPrePopulated.current = true;
      return;
    }

    const preFilled = extractPrePopulation(recommendationData);
    if (preFilled.whatYouveDone || preFilled.whatLitYouUp || preFilled.whatCompaniesPayFor) {
      hasPrePopulated.current = true;
      onSave({
        ...savedData,
        whatYouveDone: preFilled.whatYouveDone,
        whatLitYouUp: preFilled.whatLitYouUp,
        whatCompaniesPayFor: preFilled.whatCompaniesPayFor,
        prePopulated: true,
      });
    }
  }, [recommendationData, whatYouveDone, whatLitYouUp, whatCompaniesPayFor, onSave, savedData]);

  const isPrePopulated = !!savedData.prePopulated;

  const handleChange = (field: string, value: string) => {
    onSave({ ...savedData, [field]: value, userModified: true });
  };

  // Auto-check completion based on field content
  // Pre-populated fields should NOT auto-check until the user has modified something
  const userHasModified = !!savedData.userModified;
  const shouldAutoCheck = userHasModified || !isPrePopulated;

  const fieldValues: Record<string, string> = {
    whatYouveDone,
    whatLitYouUp,
    whatCompaniesPayFor,
  };

  const autoChecks = {
    listedProblems: shouldAutoCheck && !!whatYouveDone.trim(),
    identifiedEnergizing: shouldAutoCheck && !!whatLitYouUp.trim(),
    filteredPayable: shouldAutoCheck && !!whatCompaniesPayFor.trim(),
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

      {/* Narrowing exercise - vertical stacked layout */}
      <div>
        <h3 className="font-serif text-xl text-blair-midnight">
          The narrowing exercise
        </h3>
        <p className="mt-2 text-sm text-blair-charcoal/50">
          Work through these three prompts top to bottom. Each one narrows your
          focus.
        </p>

        <div className="mt-8 space-y-10">
          {steps.map((step, i) => {
            const value = fieldValues[step.field];
            return (
              <div
                key={step.field}
                className="rounded-xl border border-blair-mist bg-white p-6 sm:p-8"
              >
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <div>
                    <h4 className="text-base font-semibold text-blair-midnight">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/60">
                      {step.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-blair-charcoal/30 uppercase tracking-wide">
                    {step.scope}
                  </span>
                </div>
                <textarea
                  value={value}
                  onChange={(e) => handleChange(step.field, e.target.value)}
                  placeholder={step.placeholder}
                  className={cn(
                    "min-h-[160px] w-full rounded-lg border px-4 py-3 text-sm leading-relaxed text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 resize-y",
                    isPrePopulated && value
                      ? "border-blair-sage/30 bg-blair-sage/5"
                      : "border-blair-mist bg-white"
                  )}
                />
              </div>
            );
          })}
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
