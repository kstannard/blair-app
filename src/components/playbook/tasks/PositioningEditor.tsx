"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";
import { pathContent } from "@/lib/pathContent";
import { getRoleAwareContent, profileFromRecommendation } from "@/lib/playbook/role-aware-content";

interface PositioningEditorProps {
  pathSlug: string;
  userProfile: Record<string, unknown> | null;
  nicheData: Record<string, unknown> | null;
  quizContext: Record<string, unknown> | null;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  recommendationData?: unknown;
}

function extractExamples(pathSlug: string, recommendationData: unknown): string[] {
  // Try role-aware first
  const profile = profileFromRecommendation(recommendationData);
  const roleAware = getRoleAwareContent(pathSlug, profile);
  if (roleAware && roleAware.positioningExamples.length > 0) {
    return roleAware.positioningExamples;
  }

  // Fall back to generic pathContent
  const content = pathContent[pathSlug];
  if (!content?.positioningTemplate) return [];

  const template = content.positioningTemplate;
  // Extract lines that start with "- " after "Examples:"
  const examplesMatch = template.split("Examples:\n");
  if (examplesMatch.length < 2) return [];

  return examplesMatch[1]
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter((line) => line.length > 0);
}

export function PositioningEditor({
  pathSlug,
  savedData,
  onSave,
  recommendationData,
}: PositioningEditorProps) {
  const examples = extractExamples(pathSlug, recommendationData);
  const selectedIndex = savedData.selectedDraft as number | undefined;
  const editedStatement = (savedData.editedStatement as string) || "";
  const [refineSuggestion, setRefineSuggestion] = useState<string | null>(null);

  const handleSelectDraft = (index: number) => {
    onSave({
      ...savedData,
      selectedDraft: index,
      editedStatement: examples[index],
      userModified: true,
    });
  };

  const handleChange = (field: string, value: unknown) => {
    onSave({ ...savedData, [field]: value, userModified: true });
  };

  // Auto-check completion
  const userHasModified = !!savedData.userModified;
  const statementHasContent = editedStatement.trim().length > 20;

  const autoChecks = {
    selectedDraftCheck: userHasModified && selectedIndex !== undefined,
    customizedStatement:
      userHasModified &&
      statementHasContent &&
      selectedIndex !== undefined &&
      editedStatement !== examples[selectedIndex],
  };

  return (
    <div className="space-y-6">
      {/* Draft card — frames the 2 examples as "we wrote these for you" */}
      <div className="overflow-hidden rounded-2xl border border-blair-sage/20 bg-white shadow-sm">
        <div className="border-b border-blair-sage/20 bg-gradient-to-r from-blair-sage/10 to-blair-sage/5 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blair-sage/20">
              <svg className="h-4 w-4 text-blair-sage-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-lg text-blair-midnight">
                Pick a starting point and make it yours
              </p>
              <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
                Two positioning statements we drafted based on your background. Pick the one that feels closest, then edit it until it sounds like you.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {examples.map((draft, i) => (
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

        {/* Editable textarea — lives inside the same card, appears once they pick */}
        {selectedIndex !== undefined && (
        <div className="border-t border-blair-mist/60 px-6 py-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-blair-sage-dark">
            Your sentence
          </label>
          <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/60">
            Edit until it sounds like you would actually say it.
          </p>
          <textarea
            value={editedStatement}
            onChange={(e) => handleChange("editedStatement", e.target.value)}
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
            className="mt-3 w-full resize-none overflow-hidden rounded-lg border border-blair-mist/70 bg-white px-3 py-2.5 text-base leading-relaxed text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 hover:border-blair-charcoal/20 transition-colors"
          />

          {/* AI refine buttons */}
          {editedStatement.trim().length > 10 && (
            <div className="mt-3 border-t border-blair-mist/60 pt-3">
              <p className="mb-2 text-xs text-blair-charcoal/40">
                Need help with your statement?
              </p>
              <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          )}

          {/* Inline suggestion */}
          {refineSuggestion && (
            <div className="mt-3 rounded-lg border border-blair-sage/20 bg-blair-sage/5 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-blair-charcoal/80">
                {refineSuggestion}
              </p>
              <div className="mt-2 flex gap-3">
                {refineSuggestion.length < 300 &&
                  !refineSuggestion.includes("\n\n") && (
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

        </div>
      )}
      </div>{/* end draft card */}

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            { key: "selectedDraftCheck", label: "I chose a starting draft" },
            {
              key: "customizedStatement",
              label: "I customized the statement in my own words",
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
