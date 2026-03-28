"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";

interface PositioningEditorProps {
  pathSlug: string;
  userProfile: {
    traits?: string;
    strengths?: string;
    constraints?: string;
  } | null;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

const positioningDrafts: Record<string, string[]> = {
  "gtm-growth-strategist": [
    "I help B2B SaaS startups build their first enterprise sales motion - from ICP definition to outbound playbook to closed deals.",
    "I run focused GTM sprints for growth-stage companies entering new markets. Strategy, channel design, and launch execution in 8 weeks.",
    "I help Series A and B companies figure out why their pipeline isn't converting and build the system to fix it.",
  ],
  "messaging-positioning": [
    "I help growing companies figure out what they actually are, who they're for, and how to say it so people pay attention.",
    "I run brand positioning sprints for agencies and their clients - from audit to one-liner to full messaging framework in 3 weeks.",
    "I help founders and creative businesses turn what they do into language that makes the right people lean in.",
  ],
  "fractional-cmo": [
    "I step in as the strategic marketing leader for growth-stage companies that aren't ready for a full-time CMO but can't afford to wing it.",
    "I build and lead marketing teams for Series A-B companies - setting strategy, hiring the right people, and building systems that outlast my engagement.",
    "I help founder-led companies go from random acts of marketing to a real growth engine, without the $300K full-time hire.",
  ],
  "content-thought-leadership": [
    "I build thought leadership engines for founders and executives who have important ideas but no time to write. Strategy, ghostwriting, and distribution in one engagement.",
    "I help B2B companies turn their expertise into content that generates inbound leads - not just vanity metrics. Full-stack content strategy and execution.",
    "I create content systems for companies that know they should be publishing but haven't figured out how to do it consistently or strategically.",
  ],
  "revenue-operations": [
    "I design the revenue infrastructure that high-growth companies need but rarely build - from CRM architecture to pipeline analytics to process automation.",
    "I help sales-led companies stop leaving money on the table by fixing the operational gaps between marketing, sales, and customer success.",
    "I build RevOps systems for scaling companies, turning messy data and ad-hoc processes into a revenue engine that leadership can actually trust.",
  ],
};

const defaultDrafts = [
  "I help [type of company] solve [specific problem] by bringing [your unique approach] to deliver [measurable outcome].",
  "I work with [audience] who are struggling with [challenge]. I bring [time frame] engagements that turn [current state] into [desired state].",
  "I'm the outside expert that [type of company] brings in when they need [specific result] but don't have the in-house expertise to get there.",
];

const pathMethods: Record<string, string> = {
  "gtm-growth-strategist": "building focused go-to-market playbooks and launch sprints",
  "messaging-positioning": "running brand positioning sprints that turn confusion into clarity",
  "fractional-cmo": "stepping in as a hands-on marketing leader who builds systems that last",
  "content-thought-leadership": "creating content engines that turn expertise into inbound leads",
  "revenue-operations": "designing the revenue infrastructure that ties marketing, sales, and CS together",
};

function buildRefinedStatement(whoInput: string, whatResultInput: string, pathSlug: string): string {
  const who = whoInput.trim() || "companies";
  const result = whatResultInput.trim() || "achieve their goals";
  const method = pathMethods[pathSlug] || "focused, hands-on engagements";

  // Clean up the who input - lowercase first letter if it's not an acronym
  let cleanWho = who;
  if (cleanWho.length > 0 && cleanWho[0] === cleanWho[0].toUpperCase() && cleanWho[1] !== cleanWho[1]?.toUpperCase()) {
    cleanWho = cleanWho[0].toLowerCase() + cleanWho.slice(1);
  }

  // Clean up the result - make sure it reads as an action
  let cleanResult = result;
  // Remove leading "I help them" or "they" type prefixes
  cleanResult = cleanResult.replace(/^(I help them|they|to)\s+/i, "");
  // If it doesn't start with a verb, add "achieve"
  const startsWithVerb = /^(build|grow|scale|launch|fix|create|design|improve|increase|reduce|transform|turn|get|find|hire|close|convert|generate|drive|develop|establish|ship|deliver|run|set up|figure out|nail|crack|solve|stop|start|go from)/i.test(cleanResult);
  if (!startsWithVerb) {
    // It's likely a noun phrase - keep it as is since "I help X [noun phrase]" can work
  }

  return `I help ${cleanWho} ${cleanResult} by ${method}.`;
}

export function PositioningEditor({
  pathSlug,
  savedData,
  onSave,
}: PositioningEditorProps) {
  const drafts = positioningDrafts[pathSlug] || defaultDrafts;
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
          Your positioning statement isn't a tagline. It's the strategic
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
          We wrote three positioning drafts based on your path. Click the one
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
            Edit the statement below until it sounds like you. It doesn't need
            to be perfect - it needs to be true.
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
            Let's sharpen it
          </h4>
          <p className="mt-1 text-sm text-blair-charcoal/50">
            Tell us who you help and what result you deliver. We'll combine them into a tighter version.
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
                  Here's a tighter version
                </p>
                <p className="mt-2 text-sm leading-relaxed text-blair-charcoal/60">
                  We combined your inputs into the "I help [who] [achieve what] by [method]" format. Edit it below if you want to tweak anything.
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
