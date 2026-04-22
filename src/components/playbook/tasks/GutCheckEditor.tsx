"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";
import { detectRoleCategory, type ProfileInput } from "@/lib/prepopulation";

interface GutCheckEditorProps {
  pathSlug: string;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  pathName?: string;
  recommendationData?: unknown;
}

type ContactStatus = "not-sent" | "sent" | "scheduled" | "done";

interface ConversationCapture {
  gutReaction: string;
  peopleMentioned: string;
  pushback: string;
  transcript: string;
}

interface Contact {
  name: string;
  status: ContactStatus;
  customMessage: string;
  capture: ConversationCapture;
  expanded?: boolean; // UI state only — which section is open
}

interface Synthesis {
  agreement: string;
  pushback: string;
  warmLeads: string;
  decision?: "validated" | "revising";
}

const statusLabels: Record<ContactStatus, { label: string; color: string }> = {
  "not-sent": { label: "Not sent", color: "bg-blair-mist text-blair-charcoal/50" },
  sent: { label: "Sent", color: "bg-blair-mist/80 text-blair-charcoal/70" },
  scheduled: { label: "Scheduled", color: "bg-blair-sage/20 text-blair-sage-dark" },
  done: { label: "Conversation had", color: "bg-blair-sage text-white" },
};

const statusOrder: ContactStatus[] = ["not-sent", "sent", "scheduled", "done"];

const defaultContact = (): Contact => ({
  name: "",
  status: "not-sent",
  customMessage: "",
  capture: { gutReaction: "", peopleMentioned: "", pushback: "", transcript: "" },
});

const defaultContacts: Contact[] = [defaultContact(), defaultContact(), defaultContact()];

// Path-level generic fallback description for the outreach template.
const pathDescriptions: Record<string, string> = {
  "gtm-growth-strategist": "fractional GTM and growth work",
  "messaging-positioning": "messaging and positioning work",
  "fractional-operator": "fractional work",
  "studio-builder": "productized consulting",
  "content-engine-operator": "content and thought leadership work",
  "lead-gen-operator": "lead gen and pipeline work",
  "niche-talent-placement": "talent placement work",
  "automation-systems-builder": "systems and tooling work",
  "investor-operator": "investing and advisory work",
};

function buildDefaultOutreachMessage(
  pathSlug: string,
  pathName: string,
  positioning: string
): string {
  const natural = pathDescriptions[pathSlug] || pathName.toLowerCase() || "my area of expertise";
  if (positioning) {
    return `Hey [name],

Hope you're doing well. [Something you noticed about them recently, like a job change, a post, or a project they shipped.]

I'm exploring an idea and I'd love your honest take before I go too far. Here's the rough version: "${positioning}"

Does that land for you? Anyone come to mind who needs exactly this?

No pitch, just a gut-check from someone whose opinion I trust. Open to a quick call this week or next?`;
  }
  return `Hey [name],

Hope you're doing well. [Something you noticed about them recently.]

I'm exploring doing some ${natural} and I'd love your honest take before I go too far.

Not a pitch, just a gut-check from someone whose opinion I trust. Open to a quick call this week or next?`;
}

// ============================================================================
// Role-aware inspiration patterns — grounded in the user's actual companies
// when we have them. Generic fallback otherwise.
// ============================================================================

function parseCompanies(profile: ProfileInput): string[] {
  if (!profile.notableExperience) return [];
  const out: string[] = [];
  try {
    const parsed = JSON.parse(profile.notableExperience);
    if (Array.isArray(parsed)) {
      for (const entry of parsed) {
        const m = String(entry).match(/\bat\s+(.+)$/i);
        if (m) {
          const c = m[1].trim();
          if (c && !out.includes(c)) out.push(c);
        }
      }
    }
  } catch {
    // not JSON
  }
  return out.slice(0, 3);
}

function buildInspirationPatterns(profile: ProfileInput): string[] {
  const companies = parseCompanies(profile);
  const roleCategory = detectRoleCategory(profile);

  // Role-specific "third person" — someone in their field who'll tell the truth
  const roleFriend: Record<string, string> = {
    "product-pmm": "A PM friend who won't become a client but will tell you if the positioning sounds vague",
    "marketing-brand": "A marketing friend who'll tell you if the pitch sounds like every other fractional CMO's",
    "operations-bizops": "An ops peer who'll tell you if the positioning is too broad to be memorable",
    engineering: "An engineering peer who'll tell you if the positioning actually means something technical",
    "finance-analytics": "A finance peer who'll tell you if the numbers story holds up",
    "content-editorial": "A writer or comms peer who'll tell you if the sentence is tight or mushy",
    "enterprise-sales": "A sales peer who'll tell you if the pitch converts or falls flat",
  };

  const patterns: string[] = [];

  if (companies.length > 0) {
    patterns.push(
      `A former ${companies[0]} colleague who has since moved to a smaller, faster company`
    );
  } else {
    patterns.push(
      "A former colleague who has since moved to a smaller, faster company"
    );
  }

  if (companies.length > 1) {
    patterns.push(
      `A former ${companies[1]} teammate who's at a startup now, leading the function you used to support`
    );
  } else {
    patterns.push(
      "A peer at your level who worked alongside you and knows your strengths without needing proof"
    );
  }

  patterns.push(
    roleFriend[roleCategory] ||
      "A peer in your field who'll tell you the truth, not what you want to hear"
  );

  return patterns;
}

// ============================================================================
// Component
// ============================================================================

export function GutCheckEditor({
  pathSlug,
  savedData,
  onSave,
  pathName = "",
  recommendationData,
}: GutCheckEditorProps) {
  const contacts: Contact[] = (savedData.contacts as Contact[]) ?? defaultContacts;
  const synthesis: Synthesis = (savedData.synthesis as Synthesis) ?? {
    agreement: "",
    pushback: "",
    warmLeads: "",
  };

  // UI-only state for which contact card is expanded to show message vs capture
  const [expandedCard, setExpandedCard] = useState<{ index: number; pane: "message" | "capture" } | null>(null);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const autoSynthesizeFired = useRef(false);
  const savedDataRef = useRef(savedData);
  const onSaveRef = useRef(onSave);
  useEffect(() => { savedDataRef.current = savedData; }, [savedData]);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  // Cross-task: fetch the positioning statement from task 2 so we can
  // quote it in the outreach template and use it for synthesis context.
  const [crossTaskPositioning, setCrossTaskPositioning] = useState<string>("");
  useEffect(() => {
    fetch("/api/playbook/positioning-editor")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const editedStatement = json?.progress?.savedData?.editedStatement;
        if (typeof editedStatement === "string") setCrossTaskPositioning(editedStatement);
      })
      .catch(() => {});
  }, []);

  // Profile for role-aware inspiration
  const profile: ProfileInput = useMemo(() => {
    const r = recommendationData as {
      userProfile?: {
        linkedinSummary?: string | null;
        notableExperience?: string | null;
        strengths?: string | null;
        traits?: string | null;
      } | null;
    } | null;
    const p = r?.userProfile || {};
    return {
      linkedinSummary: p.linkedinSummary || undefined,
      notableExperience: p.notableExperience || undefined,
      strengths: p.strengths || undefined,
      traits: p.traits || undefined,
    };
  }, [recommendationData]);

  const inspirationPatterns = useMemo(() => buildInspirationPatterns(profile), [profile]);

  const defaultOutreach = useMemo(
    () => buildDefaultOutreachMessage(pathSlug, pathName, crossTaskPositioning),
    [pathSlug, pathName, crossTaskPositioning]
  );

  // Handlers
  const handleContactChange = <K extends keyof Contact>(
    index: number,
    field: K,
    value: Contact[K]
  ) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    onSave({ ...savedData, contacts: updated });
  };

  const handleCaptureChange = (
    index: number,
    field: keyof ConversationCapture,
    value: string
  ) => {
    const updated = [...contacts];
    updated[index] = {
      ...updated[index],
      capture: { ...updated[index].capture, [field]: value },
    };
    onSave({ ...savedData, contacts: updated });
  };

  const cycleStatus = (index: number) => {
    const cur = contacts[index].status;
    const next = statusOrder[(statusOrder.indexOf(cur) + 1) % statusOrder.length];
    handleContactChange(index, "status", next);
  };

  const getMessage = (c: Contact) => c.customMessage || defaultOutreach;

  const captureIsMeaningful = (c: Contact) =>
    c.status === "done" &&
    (c.capture.gutReaction.trim().length > 0 ||
      c.capture.transcript.trim().length > 0);

  const doneCount = contacts.filter(captureIsMeaningful).length;
  const canSynthesize = doneCount >= 2;

  const runSynthesis = async (mode: "auto" | "regenerate") => {
    setSynthesisLoading(true);
    try {
      const captures = contacts
        .filter(captureIsMeaningful)
        .map((c) => ({
          name: c.name,
          gutReaction: c.capture.gutReaction,
          peopleMentioned: c.capture.peopleMentioned,
          pushback: c.capture.pushback,
          transcript: c.capture.transcript,
        }));
      const res = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positioning: crossTaskPositioning, captures }),
      });
      if (res.ok) {
        const data = await res.json();
        const currentSynthesis = (savedDataRef.current.synthesis as Synthesis) ?? {
          agreement: "",
          pushback: "",
          warmLeads: "",
        };
        // On auto-generate, only fill empty fields. On regenerate, overwrite all.
        const next: Synthesis =
          mode === "regenerate"
            ? { ...currentSynthesis, agreement: data.agreement, pushback: data.pushback, warmLeads: data.warmLeads }
            : {
                ...currentSynthesis,
                agreement: currentSynthesis.agreement || data.agreement,
                pushback: currentSynthesis.pushback || data.pushback,
                warmLeads: currentSynthesis.warmLeads || data.warmLeads,
              };
        onSaveRef.current({ ...savedDataRef.current, synthesis: next });
      }
    } catch { /* silently fail */ }
    finally { setSynthesisLoading(false); }
  };

  // Auto-fire synthesis once 2+ captures exist AND synthesis is empty.
  // Guards against re-fire via a ref so we don't loop.
  useEffect(() => {
    if (autoSynthesizeFired.current) return;
    if (!canSynthesize) return;
    const alreadyHasContent =
      synthesis.agreement.trim() || synthesis.pushback.trim() || synthesis.warmLeads.trim();
    if (alreadyHasContent) {
      autoSynthesizeFired.current = true;
      return;
    }
    autoSynthesizeFired.current = true;
    runSynthesis("auto");
  }, [canSynthesize, synthesis.agreement, synthesis.pushback, synthesis.warmLeads]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSynthesisChange = (field: keyof Synthesis, value: string | "validated" | "revising") => {
    onSave({ ...savedData, synthesis: { ...synthesis, [field]: value } });
  };

  // Auto-check: both checklist items come from real progress
  const hadConversations = doneCount >= 2;
  const madeDecision = !!synthesis.decision;

  return (
    <div className="space-y-8">
      {/* Tip — single short sentence, no block */}
      <p className="text-sm italic leading-relaxed text-blair-charcoal/50">
        The point of this task is to test your positioning with real humans before you take it to strangers. You're listening, not selling.
      </p>

      {/* Conversation guide — collapsed by default, one place to find */}
      <details className="rounded-lg border border-blair-mist bg-white">
        <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-blair-midnight hover:text-blair-sage-dark transition-colors">
          Conversation guide (what to say on the call)
        </summary>
        <div className="border-t border-blair-mist px-5 py-4 text-sm leading-relaxed text-blair-charcoal/80 space-y-3">
          <div>
            <p className="font-semibold text-blair-midnight">1. Open with context (30 sec)</p>
            <p className="text-blair-charcoal/70">&ldquo;Thanks for making time. Quick context: I&apos;m exploring going independent. I want your gut reaction on an idea before I go too far. Not a pitch.&rdquo;</p>
          </div>
          <div>
            <p className="font-semibold text-blair-midnight">2. Read your one sentence, then stop talking (1 min)</p>
            <p className="text-blair-charcoal/70">Literally read your positioning statement. Then wait. Their first reaction is the most honest data you&apos;ll get.</p>
          </div>
          <div>
            <p className="font-semibold text-blair-midnight">3. Ask these in order (10 min)</p>
            <ul className="mt-1 space-y-1 list-disc list-inside marker:text-blair-sage/60 text-blair-charcoal/70">
              <li>&ldquo;When you heard that, what was your first reaction?&rdquo;</li>
              <li>&ldquo;Who came to mind? Anyone specific?&rdquo;</li>
              <li>&ldquo;What part felt off or unclear?&rdquo;</li>
              <li>&ldquo;What would make this a no-brainer for the person you&apos;re thinking of?&rdquo;</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blair-midnight">4. Close (2 min)</p>
            <p className="text-blair-charcoal/70">&ldquo;Super helpful. Would you be open to an intro if someone specific comes to mind later?&rdquo; Then actually send them a thank-you the next day.</p>
          </div>
        </div>
      </details>

      {/* Progress + contact cards */}
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
            Your 3 conversations
          </h3>
          <span className="text-xs font-medium text-blair-sage-dark">
            {doneCount} of 3 captured
          </span>
        </div>

        {/* Inspiration — collapsed by default, profile-aware */}
        <details className="mb-4 rounded-lg border border-blair-mist bg-blair-linen/40">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-blair-sage-dark hover:text-blair-sage transition-colors">
            Not sure who to reach out to? Here&apos;s who tends to give the best gut-checks.
          </summary>
          <div className="border-t border-blair-mist px-4 py-3 text-sm leading-relaxed text-blair-charcoal/70">
            <ul className="space-y-1.5 list-disc list-inside marker:text-blair-sage/60">
              {inspirationPatterns.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </details>

        <div className="space-y-3">
          {contacts.map((contact, i) => {
            const status = statusLabels[contact.status];
            const messageOpen =
              expandedCard?.index === i && expandedCard?.pane === "message";
            const captureOpen =
              expandedCard?.index === i && expandedCard?.pane === "capture";
            return (
              <div
                key={i}
                className="rounded-xl border border-blair-mist bg-white"
              >
                {/* Row 1: name + status pill — always visible, minimal */}
                <div className="flex items-center gap-3 p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blair-sage/10 text-xs font-semibold text-blair-sage-dark">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange(i, "name", e.target.value)}
                    placeholder="Name"
                    className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm font-medium text-blair-midnight placeholder:text-blair-charcoal/30 hover:border-blair-mist focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                  />
                  <button
                    onClick={() => cycleStatus(i)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                      status.color
                    )}
                    title="Click to advance status"
                  >
                    {status.label}
                  </button>
                </div>

                {/* Row 2: two inline tabs — message / capture. Only one open at a time. */}
                <div className="flex gap-1 border-t border-blair-mist/60 px-2">
                  <button
                    onClick={() =>
                      setExpandedCard(messageOpen ? null : { index: i, pane: "message" })
                    }
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors",
                      messageOpen
                        ? "text-blair-sage-dark"
                        : "text-blair-charcoal/50 hover:text-blair-charcoal"
                    )}
                  >
                    <svg
                      className={cn("h-3.5 w-3.5 transition-transform", messageOpen && "rotate-90")}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Message to send
                  </button>
                  {(contact.status === "scheduled" || contact.status === "done") && (
                    <button
                      onClick={() =>
                        setExpandedCard(captureOpen ? null : { index: i, pane: "capture" })
                      }
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors",
                        captureOpen
                          ? "text-blair-sage-dark"
                          : "text-blair-charcoal/50 hover:text-blair-charcoal"
                      )}
                    >
                      <svg
                        className={cn("h-3.5 w-3.5 transition-transform", captureOpen && "rotate-90")}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      Capture what you heard
                    </button>
                  )}
                </div>

                {/* Message pane */}
                {messageOpen && (
                  <div className="border-t border-blair-mist/60 p-4 space-y-3">
                    <textarea
                      value={getMessage(contact)}
                      onChange={(e) =>
                        handleContactChange(i, "customMessage", e.target.value)
                      }
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
                      className="w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-3 text-sm leading-relaxed text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                    />
                    <div className="flex gap-2">
                      <RefineButton
                        label="Make it shorter"
                        taskType="gut-check"
                        action="shorten"
                        fieldName="customMessage"
                        currentValue={getMessage(contact)}
                        context={{ pathSlug }}
                        onResult={(result) => handleContactChange(i, "customMessage", result)}
                      />
                      <RefineButton
                        label="Make it more direct"
                        taskType="gut-check"
                        action="direct"
                        fieldName="customMessage"
                        currentValue={getMessage(contact)}
                        context={{ pathSlug }}
                        onResult={(result) => handleContactChange(i, "customMessage", result)}
                      />
                    </div>
                  </div>
                )}

                {/* Capture pane */}
                {captureOpen && (
                  <div className="border-t border-blair-mist/60 p-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-blair-midnight">
                        Their gut reaction (first 10 seconds)
                      </label>
                      <textarea
                        value={contact.capture.gutReaction}
                        onChange={(e) => handleCaptureChange(i, "gutReaction", e.target.value)}
                        rows={2}
                        placeholder={`What did ${contact.name || "they"} say right after you read your sentence?`}
                        className="mt-1 w-full resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blair-midnight">
                        Who they thought of (names, companies, roles)
                      </label>
                      <textarea
                        value={contact.capture.peopleMentioned}
                        onChange={(e) => handleCaptureChange(i, "peopleMentioned", e.target.value)}
                        rows={2}
                        placeholder="Specific names or patterns. Intros they offered."
                        className="mt-1 w-full resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blair-midnight">
                        What they pushed back on or asked to clarify
                      </label>
                      <textarea
                        value={contact.capture.pushback}
                        onChange={(e) => handleCaptureChange(i, "pushback", e.target.value)}
                        rows={2}
                        placeholder="Where did they get confused, skeptical, or want more?"
                        className="mt-1 w-full resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                      />
                    </div>
                    <details className="rounded-lg bg-blair-linen/40">
                      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-blair-sage-dark hover:text-blair-sage">
                        Have a transcript (Granola, Otter)? Paste it here instead.
                      </summary>
                      <textarea
                        value={contact.capture.transcript}
                        onChange={(e) => handleCaptureChange(i, "transcript", e.target.value)}
                        rows={6}
                        placeholder="Paste the full transcript..."
                        className="m-3 w-[calc(100%-24px)] resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                      />
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis — auto-generates once 2+ captures exist. The user edits. */}
      {canSynthesize && (
        <div className="rounded-xl border border-blair-sage/20 bg-blair-sage/5 p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-lg text-blair-midnight">
              What you heard
            </h3>
            <button
              onClick={() => runSynthesis("regenerate")}
              disabled={synthesisLoading}
              className="text-xs font-medium text-blair-sage-dark hover:text-blair-sage disabled:opacity-50"
            >
              {synthesisLoading ? "Thinking..." : "Regenerate"}
            </button>
          </div>
          <p className="mt-1 text-sm text-blair-charcoal/60">
            {synthesisLoading
              ? "Looking at your notes, pulling out the patterns..."
              : "We pulled these out of your captures. Edit anything that doesn't sound right."}
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-blair-midnight">
                What did they agree on?
              </label>
              <textarea
                value={synthesis.agreement}
                onChange={(e) => handleSynthesisChange("agreement", e.target.value)}
                rows={3}
                placeholder="The words or reactions that showed up more than once."
                className="mt-1 w-full resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-blair-midnight">
                Where did they push back or get confused?
              </label>
              <textarea
                value={synthesis.pushback}
                onChange={(e) => handleSynthesisChange("pushback", e.target.value)}
                rows={3}
                placeholder="The parts that didn't land. The clarifications they asked for."
                className="mt-1 w-full resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-blair-midnight">
                Who raised their hand? (intros, names, &ldquo;I&apos;d pay for that&rdquo;)
              </label>
              <textarea
                value={synthesis.warmLeads}
                onChange={(e) => handleSynthesisChange("warmLeads", e.target.value)}
                rows={3}
                placeholder="Specific names or patterns. Your warm leads for Phase 2."
                className="mt-1 w-full resize-y rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
              />
            </div>
          </div>

          {/* Decision block — only shows once all 3 synthesis fields have content */}
          {synthesis.agreement.trim() &&
            synthesis.pushback.trim() &&
            synthesis.warmLeads.trim() && (
              <div className="mt-6 border-t border-blair-sage/20 pt-5">
                <p className="text-sm font-semibold text-blair-midnight">
                  Based on what you heard, what&apos;s your call?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSynthesisChange("decision", "validated")}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      synthesis.decision === "validated"
                        ? "border-blair-sage bg-blair-sage text-white"
                        : "border-blair-mist bg-white text-blair-charcoal/70 hover:border-blair-sage/40"
                    )}
                  >
                    My positioning is validated
                  </button>
                  <button
                    onClick={() => handleSynthesisChange("decision", "revising")}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      synthesis.decision === "revising"
                        ? "border-blair-sage bg-blair-sage text-white"
                        : "border-blair-mist bg-white text-blair-charcoal/70 hover:border-blair-sage/40"
                    )}
                  >
                    I&apos;m going back to sharpen it
                  </button>
                </div>
                {synthesis.decision === "revising" && (
                  <p className="mt-3 text-xs text-blair-charcoal/60">
                    Good call. Head back to task 2 and update your one sentence using what you heard. You can come back here when the new version is ready.
                  </p>
                )}
              </div>
            )}
        </div>
      )}

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          <ChecklistItem
            checked={hadConversations}
            label="I had 2+ conversations and captured what I heard"
          />
          <ChecklistItem
            checked={madeDecision}
            label="I decided whether my positioning is validated or needs revising"
          />
        </div>
        {!(hadConversations && madeDecision) && (
          <p className="mt-4 text-xs text-blair-charcoal/50">
            Complete both steps above before you mark this task done. The point is to road-test your positioning with real humans, not to check boxes.
          </p>
        )}
      </div>
    </div>
  );
}

// Minimal, display-only checklist item. Both checks auto-derive from real
// state — no manual override — because the point is to force the work.
function ChecklistItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2",
          checked
            ? "border-blair-sage bg-blair-sage"
            : "border-blair-mist bg-white"
        )}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>
      <span
        className={cn(
          "text-sm transition-colors",
          checked ? "text-blair-charcoal/40 line-through" : "text-blair-charcoal/70"
        )}
      >
        {label}
      </span>
    </div>
  );
}
