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
  capture: ConversationCapture;
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
  capture: { gutReaction: "", peopleMentioned: "", pushback: "", transcript: "" },
});

const defaultContacts: Contact[] = [defaultContact(), defaultContact(), defaultContact()];

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
// Role-aware inspiration — grounded in the user's actual companies.
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
    patterns.push(`A former ${companies[0]} colleague who has since moved to a smaller, faster company`);
  } else {
    patterns.push("A former colleague who has since moved to a smaller, faster company");
  }

  if (companies.length > 1) {
    patterns.push(`A former ${companies[1]} teammate who's at a startup now, leading the function you used to support`);
  } else {
    patterns.push("A peer at your level who worked alongside you and knows your strengths without needing proof");
  }

  patterns.push(
    roleFriend[roleCategory] || "A peer in your field who'll tell you the truth, not what you want to hear"
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
  const outreachMessage = (savedData.outreachMessage as string) ?? "";

  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const autoSynthesizeFired = useRef(false);
  const savedDataRef = useRef(savedData);
  const onSaveRef = useRef(onSave);
  useEffect(() => { savedDataRef.current = savedData; }, [savedData]);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  // Fetch the positioning statement from task 2
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
  const currentOutreach = outreachMessage || defaultOutreach;

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

  const captureIsMeaningful = (c: Contact) =>
    c.status === "done" &&
    (c.capture.gutReaction.trim().length > 0 || c.capture.transcript.trim().length > 0);

  const doneCount = contacts.filter(captureIsMeaningful).length;
  const canSynthesize = doneCount >= 2;
  const anyScheduledOrDone = contacts.some(
    (c) => c.status === "scheduled" || c.status === "done"
  );

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
        const currentSynthesis =
          (savedDataRef.current.synthesis as Synthesis) ?? {
            agreement: "",
            pushback: "",
            warmLeads: "",
          };
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

  const handleSynthesisChange = (
    field: keyof Synthesis,
    value: string | "validated" | "revising"
  ) => {
    onSave({ ...savedData, synthesis: { ...synthesis, [field]: value } });
  };

  const hadConversations = doneCount >= 2;
  const madeDecision = !!synthesis.decision;

  return (
    <div className="space-y-10">
      {/* Tip */}
      <p className="text-sm italic leading-relaxed text-blair-charcoal/50">
        The point of this task is to test your positioning with real humans before you take it to strangers. You&apos;re listening, not selling.
      </p>

      {/* 1. Outreach message — ONE template, not per-person */}
      <section>
        <h3 className="font-serif text-lg text-blair-midnight">
          1. Your outreach message
        </h3>
        <p className="mt-1 text-sm text-blair-charcoal/60">
          Send this to all 3 people. Swap in their name and a line that shows
          you actually pay attention to what they&apos;re up to.
        </p>
        <textarea
          value={currentOutreach}
          onChange={(e) => onSave({ ...savedData, outreachMessage: e.target.value })}
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
          className="mt-3 w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-3 text-sm leading-relaxed text-blair-midnight focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <RefineButton
            label="Make it shorter"
            taskType="gut-check"
            action="shorten"
            fieldName="outreachMessage"
            currentValue={currentOutreach}
            context={{ pathSlug }}
            onResult={(result) => onSave({ ...savedData, outreachMessage: result })}
          />
          <RefineButton
            label="Make it more direct"
            taskType="gut-check"
            action="direct"
            fieldName="outreachMessage"
            currentValue={currentOutreach}
            context={{ pathSlug }}
            onResult={(result) => onSave({ ...savedData, outreachMessage: result })}
          />
        </div>
      </section>

      {/* 2. Your 3 conversations */}
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-lg text-blair-midnight">
            2. Your 3 conversations
          </h3>
          <span className="text-xs font-medium text-blair-sage-dark">
            {doneCount} of 3 captured
          </span>
        </div>
        <p className="mt-1 text-sm text-blair-charcoal/60">
          Pick 3 people who know your work. Send the message above. As you move
          each one along, tap the status pill to update it.
        </p>

        {/* Inspiration — collapsed, profile-aware */}
        <details className="mt-4 rounded-lg border border-blair-mist bg-blair-linen/40">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-blair-sage-dark hover:text-blair-sage transition-colors">
            Not sure who? Here are some ideas for who might be good to gut-check with.
          </summary>
          <div className="border-t border-blair-mist px-4 py-3 text-sm leading-relaxed text-blair-charcoal/70">
            <ul className="space-y-1.5 list-disc list-inside marker:text-blair-sage/60">
              {inspirationPatterns.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </details>

        <div className="mt-4 space-y-3">
          {contacts.map((contact, i) => {
            const status = statusLabels[contact.status];
            const showCapture = contact.status === "done";
            return (
              <div
                key={i}
                className="rounded-xl border border-blair-mist bg-white"
              >
                {/* Row: name + status pill */}
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

                {/* Capture pane — inline when status is "done", no toggle */}
                {showCapture && (
                  <div className="border-t border-blair-mist/60 bg-blair-linen/20 p-4 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                      Capture what you heard
                    </p>
                    <div>
                      <label className="text-xs font-semibold text-blair-midnight">
                        Their gut reaction (their exact words if you can)
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
                        Who they thought of (names, companies, intros offered)
                      </label>
                      <textarea
                        value={contact.capture.peopleMentioned}
                        onChange={(e) => handleCaptureChange(i, "peopleMentioned", e.target.value)}
                        rows={2}
                        placeholder="Specific names. Any intros they offered."
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
                    <details className="rounded-lg border border-blair-mist bg-white">
                      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-blair-sage-dark hover:text-blair-sage">
                        Have a transcript (Granola, Otter)? Paste it instead.
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
      </section>

      {/* 3. Conversation guide — appears when any call is scheduled.
          Research-grounded: The Mom Test, customer discovery best practices,
          founder interview research. Includes the user's positioning inline. */}
      {anyScheduledOrDone && (
        <section>
          <h3 className="font-serif text-lg text-blair-midnight">
            3. On the call
          </h3>
          <p className="mt-1 text-sm text-blair-charcoal/60">
            A tested script for a positioning gut-check. 15-20 minutes. You&apos;re
            listening, not selling. Keep your sentence up and a blank doc open.
          </p>

          <div className="mt-4 space-y-6 rounded-xl border border-blair-mist bg-white p-6 text-sm leading-relaxed">
            {/* Before */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                Before the call (2 min)
              </p>
              <p className="mt-2 text-blair-charcoal/75">
                Block 25 minutes. Pull up your one-sentence. Have a blank doc or notebook
                ready. You&apos;ll want to capture their exact words, not just the gist.
              </p>
            </div>

            {/* 1. Open */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                1. Set the frame (2 min)
              </p>
              <p className="mt-2 text-blair-charcoal/75">
                After the hello, say this almost word-for-word:
              </p>
              <blockquote className="mt-2 border-l-2 border-blair-sage/40 pl-4 italic text-blair-charcoal/80">
                &ldquo;Thanks for making time. Quick context: I&apos;m exploring going
                independent and I want your honest gut reaction to an idea before
                I go too far. This isn&apos;t a pitch. I want you to tell me if it&apos;s
                off, vague, or lands wrong. Cool?&rdquo;
              </blockquote>
              <p className="mt-2 text-blair-charcoal/60 text-xs">
                Wait for their nod. Don&apos;t keep talking.
              </p>
            </div>

            {/* 2. Read the sentence */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                2. Read your one sentence, then stop (1 min)
              </p>
              {crossTaskPositioning ? (
                <div className="mt-2 rounded-lg bg-blair-sage/10 px-4 py-3 text-blair-midnight">
                  <p className="text-xs font-semibold text-blair-sage-dark uppercase tracking-wide">Your sentence</p>
                  <p className="mt-1 leading-relaxed">&ldquo;{crossTaskPositioning}&rdquo;</p>
                </div>
              ) : (
                <p className="mt-2 italic text-blair-charcoal/50">
                  Your positioning statement will show up here once you finish task 2.
                </p>
              )}
              <p className="mt-3 text-blair-charcoal/75">
                Read it once, clearly. Then stop talking for at least 5 full
                seconds. This is the hardest part. Their first unprompted words
                after the silence are the most honest data you&apos;ll get.
              </p>
              <p className="mt-1 text-blair-charcoal/75">
                Write down what they say <em>verbatim</em>, not a paraphrase.
              </p>
            </div>

            {/* 3. Probe */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                3. Probe their reaction (10-12 min)
              </p>
              <p className="mt-2 text-blair-charcoal/75">
                Ask these in order. Write down the <em>exact phrases</em> they
                use, not your interpretation. Most of the signal comes from
                which words they repeat.
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside marker:text-blair-sage/60 text-blair-charcoal/80">
                <li>&ldquo;When you heard that, what was your first reaction?&rdquo;</li>
                <li>&ldquo;What part, if any, felt unclear or vague?&rdquo;</li>
                <li>&ldquo;Who specifically came to mind when you heard it? Anyone by name?&rdquo;</li>
                <li>&ldquo;If you were describing me to someone who needed this, how would <em>you</em> say it?&rdquo; (This is the gold question. Listen for their framing.)</li>
                <li>&ldquo;What would make this a no-brainer for the person you&apos;re thinking of?&rdquo;</li>
              </ul>
              <p className="mt-3 text-blair-charcoal/75">
                If they get stuck or too polite, try:
              </p>
              <blockquote className="mt-2 border-l-2 border-blair-sage/40 pl-4 italic text-blair-charcoal/80">
                &ldquo;Where&apos;s the line between someone you&apos;d recommend me to and someone you&apos;d hire me for yourself?&rdquo;
              </blockquote>
            </div>

            {/* 4. Close */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                4. Close with a specific ask (2 min)
              </p>
              <blockquote className="mt-2 border-l-2 border-blair-sage/40 pl-4 italic text-blair-charcoal/80">
                &ldquo;Super helpful. If someone specific comes to mind in the next
                week, would you be willing to make a quick intro? Feel free to
                send them my way without even checking with me.&rdquo;
              </blockquote>
              <p className="mt-2 text-blair-charcoal/75">
                Send a thank-you within 24 hours. If they offered names, log
                them immediately in the capture above.
              </p>
            </div>

            {/* After */}
            <div className="rounded-lg bg-blair-linen/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blair-sage-dark">
                Right after the call
              </p>
              <p className="mt-2 text-blair-charcoal/75">
                Fill in the capture fields on this page while the call is fresh.
                Look for three things: <strong>phrases they echoed back</strong> (what
                landed), <strong>where they stopped you to clarify</strong> (what
                didn&apos;t), and <strong>specific names or intros they offered</strong>.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 4. Synthesis — shown as a locked placeholder until 2+ captures exist */}
      {!canSynthesize && (
        <section className="opacity-60">
          <h3 className="font-serif text-lg text-blair-charcoal/60">
            4. What you heard
          </h3>
          <p className="mt-1 text-sm text-blair-charcoal/50">
            After you capture 2+ conversations above, we&apos;ll pull out the patterns for you. You&apos;ll see what landed, what didn&apos;t, and who to follow up with first.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-blair-mist bg-blair-linen/30 px-6 py-8 text-center">
            <svg
              className="mx-auto h-5 w-5 text-blair-charcoal/30"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="mt-3 text-xs text-blair-charcoal/50">
              {doneCount === 0
                ? "Unlocks after your first 2 conversations."
                : `1 captured. ${2 - doneCount} more to unlock.`}
            </p>
          </div>
        </section>
      )}

      {canSynthesize && (
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-lg text-blair-midnight">
              4. What you heard
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

          <div className="mt-4 space-y-4 rounded-xl border border-blair-sage/20 bg-blair-sage/5 p-6">
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

            {synthesis.agreement.trim() &&
              synthesis.pushback.trim() &&
              synthesis.warmLeads.trim() && (
                <div className="border-t border-blair-sage/20 pt-5">
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
                      Good call. Head back to task 2 and update your one sentence using what you heard.
                    </p>
                  )}
                </div>
              )}
          </div>
        </section>
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
      </div>
    </div>
  );
}

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
