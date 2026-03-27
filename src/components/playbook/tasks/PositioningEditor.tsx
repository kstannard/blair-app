"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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

const refinementQuestions = [
  "Who specifically have you helped in the past that you would love to work with again? What made that engagement great?",
  "What's the one result you're most confident you can deliver? The thing where you think: if someone gave me this problem, I'd crush it?",
];

function extractClientType(answer: string): string {
  // The user might mention a specific person's name followed by context.
  // We need to extract the TYPE of client, not the person's name.
  const text = answer.trim();
  if (!text) return "companies";

  // Look for patterns that describe a type of client/company
  const typePatterns = [
    /(?:work(?:ed|ing)?\s+with\s+)?((?:series\s+[a-c]|seed|growth|early)-?\s*stage\s+\w+)/i,
    /(?:helped?\s+)?(\w+\s+(?:companies|startups|teams|founders|executives|leaders|businesses|agencies|brands))/i,
    /(?:companies|startups|businesses)\s+(?:that|who|in)\s+([^.!?\n]+)/i,
    /((?:b2b|b2c|saas|ecommerce|e-commerce)\s+\w+)/i,
  ];

  for (const pattern of typePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim().toLowerCase();
    }
  }

  // If we can't extract a type, try to generalize from context
  // Check if the answer mentions titles/roles that hint at the client type
  const rolePatterns = [
    /(?:ceo|cto|cmo|vp|director|head of|founder)/i,
    /(?:executive|leader|manager)/i,
  ];

  for (const pattern of rolePatterns) {
    if (pattern.test(text)) {
      return "leaders and executives";
    }
  }

  // Default: take the first clause but strip any proper names (capitalized words at start)
  const firstClause = text.split(/[.!?\n,;-]/)[0]?.trim() || "";
  // Remove what looks like a person's name (1-3 capitalized words at the start)
  const withoutName = firstClause.replace(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\s*[-,]?\s*/g, "").trim();
  if (withoutName.length > 5) {
    return withoutName.toLowerCase();
  }

  return "companies";
}

function extractOutcome(answer: string): string {
  const text = answer.trim();
  if (!text) return "achieve their goals";

  // Remove leading "I " or "I can " or "I'm able to "
  let cleaned = text.replace(/^I(?:\s+can|\s+am\s+able\s+to|\s+know\s+how\s+to)?\s+/i, "");

  // Take the first meaningful sentence
  const firstSentence = cleaned.split(/[.!?\n]/)[0]?.trim() || cleaned;

  // Make sure it doesn't start with a capital person name
  const result = firstSentence.replace(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\s*[-,]?\s*/g, "").trim();

  if (result.length > 5) {
    // Lowercase the first letter if it's not an acronym
    return result.charAt(0).toLowerCase() + result.slice(1);
  }

  return firstSentence.charAt(0).toLowerCase() + firstSentence.slice(1);
}

function generateRefinedStatement(
  currentStatement: string,
  answer1: string,
  answer2: string
): string {
  const clientType = extractClientType(answer1);
  const outcome = extractOutcome(answer2);

  // Try to extract the method/approach from the current positioning statement
  let method = "";
  const byMatch = currentStatement.match(/by\s+(.+?)(?:\.|$)/i);
  const throughMatch = currentStatement.match(/through\s+(.+?)(?:\.|$)/i);
  if (byMatch) {
    method = byMatch[1].trim();
  } else if (throughMatch) {
    method = throughMatch[1].trim();
  } else {
    // Fall back to extracting the core action from the statement
    const helpMatch = currentStatement.match(/I\s+(?:help|work\s+with|run|build|design|create)\s+.+?\s+([-]|by|through|that)\s+(.+?)(?:\.|$)/i);
    if (helpMatch) {
      method = helpMatch[2].trim();
    } else {
      const parts = currentStatement.split(/[-,]/);
      method = parts.length > 1 ? parts[parts.length - 1].trim() : "focused, hands-on engagements";
    }
  }

  return `I help ${clientType} ${outcome} by ${method}.`;
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
  const refinementAnswer1 = (savedData.refinementAnswer1 as string) || "";
  const refinementAnswer2 = (savedData.refinementAnswer2 as string) || "";
  const [suggestedRefinement, setSuggestedRefinement] = useState<string>(
    (savedData.suggestedRefinement as string) || ""
  );

  const handleSelectDraft = (index: number) => {
    onSave({
      ...savedData,
      selectedDraft: index,
      editedStatement: drafts[index],
    });
  };

  const handleChange = (field: string, value: unknown) => {
    onSave({ ...savedData, [field]: value });
  };

  const handleShowRefinement = () => {
    onSave({ ...savedData, showRefinement: true });
  };

  const handleRefine = () => {
    const refined = generateRefinedStatement(
      editedStatement,
      refinementAnswer1,
      refinementAnswer2
    );
    setSuggestedRefinement(refined);
    onSave({ ...savedData, suggestedRefinement: refined });
  };

  const handleAcceptRefinement = () => {
    onSave({
      ...savedData,
      editedStatement: suggestedRefinement,
      suggestedRefinement: "",
    });
    setSuggestedRefinement("");
  };

  // Auto-check completion
  const autoChecks = {
    selectedDraftCheck: selectedIndex !== undefined,
    customizedStatement: !!(editedStatement.trim() && selectedIndex !== undefined && editedStatement !== drafts[selectedIndex]),
    passesTest: !!(editedStatement.trim() && editedStatement.length > 30),
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
            Let&rsquo;s sharpen it
          </h4>
          <p className="mt-1 text-sm text-blair-charcoal/50">
            Answer these two questions, then click Refine to get a tighter version based on what you wrote.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-medium text-blair-midnight">
                {refinementQuestions[0]}
              </label>
              <textarea
                value={refinementAnswer1}
                onChange={(e) =>
                  handleChange("refinementAnswer1", e.target.value)
                }
                className="mt-2 h-24 w-full resize-none rounded-lg border border-blair-sage/20 bg-white px-4 py-3 text-sm leading-relaxed text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="Think about a specific client or project..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blair-midnight">
                {refinementQuestions[1]}
              </label>
              <textarea
                value={refinementAnswer2}
                onChange={(e) =>
                  handleChange("refinementAnswer2", e.target.value)
                }
                className="mt-2 h-24 w-full resize-none rounded-lg border border-blair-sage/20 bg-white px-4 py-3 text-sm leading-relaxed text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                placeholder="The result you're most confident about..."
              />
            </div>

            {refinementAnswer1 && refinementAnswer2 && (
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
                  Suggested refinement
                </p>
                <p className="mt-2 text-sm leading-relaxed text-blair-charcoal/70">
                  Based on your answers: you've worked with{" "}
                  <span className="font-medium text-blair-midnight">
                    {refinementAnswer1.split(/[.!?\n]/)[0]}
                  </span>{" "}
                  and you're most confident delivering{" "}
                  <span className="font-medium text-blair-midnight">
                    {refinementAnswer2.split(/[.!?\n]/)[0]}
                  </span>
                  . Here's a tighter version:
                </p>
                <p className="mt-3 rounded-lg border border-blair-sage/20 bg-blair-sage/5 px-4 py-3 text-base leading-relaxed text-blair-midnight italic">
                  {suggestedRefinement}
                </p>
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
