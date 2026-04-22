"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";
import { generateNicheChips } from "@/lib/prepopulation";
import { ThinkingAnimation } from "@/components/playbook/ThinkingAnimation";

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
  quizContext?: {
    role?: string | null;
    years?: string | null;
    industries?: string | null;
    shoulderTap?: string | null;
    weirdlyGood?: string | null;
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

function extractPrePopulationChips(recommendationData: RecommendationData | null, pathSlug: string): string[] {
  if (!recommendationData) return [];
  const profile = recommendationData.userProfile;
  const quiz = recommendationData.quizContext;

  // Use smart generation: role-aware problem statements instead of raw job titles
  const profileInput = {
    role: quiz?.role || undefined,
    years: quiz?.years || undefined,
    industries: quiz?.industries || undefined,
    shoulderTaps: quiz?.shoulderTap || undefined,
    weirdlyGoodAt: quiz?.weirdlyGood || undefined,
    linkedinSummary: profile?.linkedinSummary || undefined,
    notableExperience: profile?.notableExperience || undefined,
    strengths: profile?.strengths || undefined,
    traits: profile?.traits || undefined,
  };

  const chips = generateNicheChips(profileInput, pathSlug);
  if (chips.length > 0) return chips;

  // Fallback: parse from personalIntro if no profile data at all
  if (recommendationData.personalIntro) {
    return parseToChips(recommendationData.personalIntro);
  }
  return [];
}

import { detectRoleCategory, type ProfileInput } from "@/lib/prepopulation";
import { profileFromRecommendation } from "@/lib/playbook/role-aware-content";

interface EngagementResult {
  title: string;
  pricing: string;
  scope: string;
  duration: string;
  description: string;
  connection: string;
  buyerTitle: string;
}

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

  // Step 3: API-driven engagement shapes derived from step 2 selections.
  const [engagements, setEngagements] = useState<EngagementResult[]>(
    (savedData.engagementResults as EngagementResult[]) || []
  );
  const [engagementsLoading, setEngagementsLoading] = useState(false);
  const lastStep2Key = useRef<string>("");

  // Keep a ref to the latest savedData so async callbacks don't use stale state.
  // Without this, the fetch completion would overwrite fresh user clicks that
  // happened during the ~200ms API call.
  const savedDataRef = useRef(savedData);
  const onSaveRef = useRef(onSave);
  useEffect(() => { savedDataRef.current = savedData; }, [savedData]);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  const roleCategory = detectRoleCategory(profileFromRecommendation(recommendationData));

  const fetchEngagements = useCallback(async (selectedChips: string[]) => {
    setEngagementsLoading(true);
    try {
      const res = await fetch("/api/ai/engagement-shapes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedChips, roleCategory, pathSlug }),
      });
      if (res.ok) {
        const data = await res.json();
        const results = data.engagements || [];
        setEngagements(results);
        // Use the ref to get the LATEST savedData, not the stale closure value.
        // This preserves any step 2 clicks that happened during the fetch.
        onSaveRef.current({
          ...savedDataRef.current,
          engagementResults: results,
          step3Selections: [],
        });
      }
    } catch { /* silently fail */ }
    finally { setEngagementsLoading(false); }
  }, [roleCategory, pathSlug]);

  // Fetch when step 2 selections change
  useEffect(() => {
    const selectedChips = step2Selections.map((i) => step1Items[i] || "").filter(Boolean);
    const key = selectedChips.sort().join("|");
    if (key === lastStep2Key.current) return;
    lastStep2Key.current = key;
    if (selectedChips.length > 0) fetchEngagements(selectedChips);
    else setEngagements([]);
  }, [step2Selections, step1Items, fetchEngagements]);

  // Pre-populate chips on first load
  useEffect(() => {
    if (hasPrePopulated.current) return;
    if (!recommendationData) return;
    if (step1Items.length > 0) {
      hasPrePopulated.current = true;
      return;
    }

    const chips = extractPrePopulationChips(recommendationData, pathSlug);
    if (chips.length > 0) {
      hasPrePopulated.current = true;
      onSave({
        ...savedData,
        step1Items: chips,
        prePopulated: true,
      });
    }
  }, [recommendationData, step1Items.length, onSave, savedData, pathSlug]);

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

  const handleEditChip = (index: number, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      handleRemoveChip(index);
      return;
    }
    const updated = [...step1Items];
    updated[index] = trimmed;
    onSave({
      ...savedData,
      step1Items: updated,
      step1Interacted: true,
    });
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
                    Problems you&apos;ve solved
                  </h4>
                  <span className="shrink-0 text-xs font-medium text-blair-charcoal/30 uppercase tracking-wide">
                    Broad
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-blair-charcoal/60">
                  Based on your background, these are problems we think you may have solved. Edit, remove, or add anything we missed.
                </p>

                {/* Editable chips — use textarea so long multi-line entries
                    wrap cleanly on mobile instead of truncating. */}
                <div className="space-y-2">
                  {step1Items.map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-2 rounded-lg border border-blair-mist bg-blair-linen/50 px-3 py-2 text-sm text-blair-charcoal transition-all hover:border-blair-charcoal/20"
                    >
                      <textarea
                        defaultValue={item}
                        onBlur={(e) => handleEditChip(i, e.target.value)}
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
                        className="flex-1 resize-none bg-transparent leading-snug text-blair-charcoal outline-none placeholder:text-blair-charcoal/30 overflow-hidden"
                      />
                      <button
                        onClick={() => handleRemoveChip(i)}
                        className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-blair-charcoal/30 transition-colors hover:bg-blair-charcoal/10 hover:text-blair-charcoal/60"
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

                {/* AI buttons removed per product review: the actions were
                    template-based string concat (not LLM) and added noise
                    without value. The chips are already pre-populated with
                    role-aware personalized content. */}
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

          {/* Step 3: What companies pay for — dynamically generated from
              step 2 selections via the engagement-shapes API. Shows a thinking
              animation while loading, then personalized engagement cards. */}
          {step2Selections.length > 0 && (
            <div className="relative">
              {engagementsLoading ? (
                <ThinkingAnimation show={true} />
              ) : engagements.length > 0 ? (
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
                      Based on what lights you up, these are the engagement types companies actually hire for. Pick 1-2 you could see yourself doing.
                    </p>

                    <div className="space-y-3">
                      {engagements.map((engagement, i) => {
                        const isSelected = step3Selections.includes(i);
                        return (
                          <button
                            key={`eng-${i}-${engagement.title.slice(0, 20)}`}
                            onClick={() => handleToggleStep3(i)}
                            className={cn(
                              "w-full rounded-xl border p-5 text-left transition-all",
                              isSelected
                                ? "border-blair-sage bg-blair-sage text-white shadow-sm"
                                : "border-blair-mist bg-blair-linen/50 text-blair-charcoal hover:border-blair-sage/40"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className={cn(
                                "text-sm font-semibold",
                                isSelected ? "text-white" : "text-blair-midnight"
                              )}>
                                {engagement.title}
                              </p>
                              <span className={cn(
                                "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-blair-sage/10 text-blair-sage-dark"
                              )}>
                                {engagement.pricing}
                              </span>
                            </div>
                            <p className={cn(
                              "mt-1.5 text-xs leading-relaxed",
                              isSelected ? "text-white/80" : "text-blair-charcoal/60"
                            )}>
                              {engagement.description}
                            </p>
                            {engagement.connection && (
                              <p className={cn(
                                "mt-2 text-[11px] italic",
                                isSelected ? "text-white/60" : "text-blair-sage-dark/60"
                              )}>
                                {engagement.connection}
                              </p>
                            )}
                            <div className={cn(
                              "mt-2 flex items-center gap-3 text-[11px]",
                              isSelected ? "text-white/60" : "text-blair-charcoal/40"
                            )}>
                              <span>{engagement.duration}</span>
                              <span>·</span>
                              <span>{engagement.scope.slice(0, 60)}{engagement.scope.length > 60 ? "..." : ""}</span>
                            </div>
                          </button>
                        );
                      })}
                      <p className="pt-1 text-xs text-blair-charcoal/40">
                        Pick 1-2 that resonate most.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
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
