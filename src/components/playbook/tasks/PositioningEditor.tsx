"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";
import { pathContent } from "@/lib/pathContent";

interface PositioningEditorProps {
  pathSlug: string;
  userProfile: Record<string, unknown> | null;
  nicheData: Record<string, unknown> | null;
  quizContext: Record<string, unknown> | null;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

function extractExamples(pathSlug: string): string[] {
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
}: PositioningEditorProps) {
  const examples = extractExamples(pathSlug);
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
      editedStatement: examples[index],
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
    const who = refineWho.trim() || "companies";
    const result = refineResult.trim() || "achieve their goals";
    const refined = `I help ${who} ${result}.`;
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
    passesTest: userHasModified && statementHasContent && editedStatement.length > 30,
  };

  return (
    <div className="space-y-10">
      {/* Tip */}
      <div className="rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-5">
        <p className="text-sm font-semibold text-blair-sage-dark">Quick tip</p>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
          Your positioning statement isn&apos;t a tagline. It&apos;s the answer to
          &quot;what do you do?&quot; that makes the right person lean in. Get this
          right, and your website, proposals, and sales conversations all become
          easier to write.
        </p>
      </div>

      {/* Draft selection */}
      <div>
        <h3 className="font-serif text-xl text-blair-midnight">
          Pick a starting point
        </h3>
        <p className="mt-2 text-sm text-blair-charcoal/50">
          These are examples of how people on your path typically position
          themselves. Pick the one that feels closest, then make it yours.
        </p>

        <div className="mt-6 space-y-3">
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
      </div>

      {/* Editable textarea */}
      {selectedIndex !== undefined && (
        <div>
          <h3 className="font-serif text-xl text-blair-midnight">
            Make it yours
          </h3>
          <p className="mt-2 text-sm text-blair-charcoal/50">
            Edit the statement below until it sounds like you. It doesn&apos;t
            need to be perfect, it needs to be true.
          </p>
          <textarea
            value={editedStatement}
            onChange={(e) => handleChange("editedStatement", e.target.value)}
            className="mt-4 h-32 w-full resize-none rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-relaxed text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
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

          {!showRefinement && (
            <button
              onClick={handleShowRefinement}
              className="mt-4 rounded-lg border border-blair-mist px-5 py-2.5 text-sm font-medium text-blair-charcoal/60 transition-colors hover:border-blair-sage/30 hover:text-blair-sage-dark"
            >
              Start from scratch instead
            </button>
          )}
        </div>
      )}

      {/* Build from scratch section */}
      {showRefinement && (
        <div className="rounded-xl border border-blair-sage/20 bg-blair-sage/5 p-6">
          <h4 className="font-serif text-lg text-blair-midnight">
            Build your own
          </h4>
          <p className="mt-1 text-sm text-blair-charcoal/50">
            Tell us who you help and what result you deliver. We&apos;ll
            combine them into a starting point.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-medium text-blair-midnight">
                Who do you help? Be specific about the type of person or
                company.
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
                Generate
              </button>
            )}

            {suggestedRefinement && (
              <div className="rounded-lg border-l-4 border-blair-sage bg-white p-4">
                <p className="text-sm font-semibold text-blair-sage-dark">
                  Here&apos;s a starting point
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
            {
              key: "customizedStatement",
              label: "I customized the statement in my own words",
            },
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
