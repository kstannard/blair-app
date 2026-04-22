"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RefineButton } from "@/components/playbook/RefineButton";

interface GutCheckEditorProps {
  pathSlug: string;
  savedData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  pathName?: string;
}

interface ContactSlot {
  name: string;
  notes: string;
  status: "not-yet" | "reached-out" | "conversation-had";
}

interface BuyerProfileData {
  buyerTitle?: string;
  companyType?: string;
}

const statusOptions = [
  { value: "not-yet", label: "Not yet" },
  { value: "reached-out", label: "Reached out" },
  { value: "conversation-had", label: "Conversation had" },
] as const;

const defaultContacts: ContactSlot[] = [
  { name: "", notes: "", status: "not-yet" },
  { name: "", notes: "", status: "not-yet" },
  { name: "", notes: "", status: "not-yet" },
];

// Map path slugs to natural conversational descriptions. Kept generic for
// paths that can host multiple functional archetypes — the specific flavor
// is already captured in the user's edited positioning statement, which is
// what gets interpolated into the outreach template.
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

function buildOutreachTemplate(
  pathName: string,
  savedData: Record<string, unknown>,
  pathSlug: string,
  crossTaskPositioning: string
): string {
  // Prefer the user's actual positioning statement (from task 2) if we have it.
  // Falls back to this task's savedData (in case the user typed it directly here),
  // then to a generic path description.
  const positioning =
    crossTaskPositioning.trim() ||
    ((savedData.editedStatement as string) || "").trim();
  const naturalName = pathDescriptions[pathSlug] || pathName.toLowerCase() || "my area of expertise";

  // Two templates — one that quotes the positioning statement, one that falls
  // back to a generic noun phrase. Both read cleanly.
  if (positioning) {
    return `Hey [name],

Hope you're doing well. [Mention something you've noticed about them recently, like a job change, a post, or a life update.]

I'm exploring an idea and I'd love your honest take before I go too far. Here's the rough version: "${positioning}"

Does that land for you? Anyone come to mind who needs exactly this?

No pitch, just a gut-check from someone whose opinion I trust. Open to a quick call this week or next?`;
  }

  return `Hey [name],

Hope you're doing well. [Mention something you've noticed about them recently, like a job change, a post, or a life update.]

I've been thinking about doing some ${naturalName}, and before I go too far, I'd love your honest take on whether it makes sense.

Would you have time for a quick call this week or next? No pitch, just a gut-check from someone whose opinion I trust.`;
}

export function GutCheckEditor({
  pathSlug,
  savedData,
  onSave,
  pathName = "",
}: GutCheckEditorProps) {
  const [refineSuggestion, setRefineSuggestion] = useState<string | null>(null);
  const contacts = (savedData.contacts as ContactSlot[]) ?? defaultContacts;
  const whatIHeard = (savedData.whatIHeard as string) ?? "";

  // Cross-task fetch: pull the positioning statement from task 2 so the
  // outreach template quotes the user's actual positioning instead of a
  // generic path description.
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

  const defaultTemplate = buildOutreachTemplate(pathName, savedData, pathSlug, crossTaskPositioning);
  const outreachMessage =
    (savedData.outreachMessage as string) ?? defaultTemplate;

  // Fetch buyer profile data for contact suggestions
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfileData | null>(null);

  useEffect(() => {
    fetch("/api/playbook/buyer-profile-editor")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.progress?.savedData) {
          setBuyerProfile({
            buyerTitle: json.progress.savedData.buyerTitle,
            companyType: json.progress.savedData.companyType,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (field: string, value: unknown) => {
    onSave({ ...savedData, [field]: value });
  };

  const handleContactChange = (
    index: number,
    field: keyof ContactSlot,
    value: string
  ) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    handleChange("contacts", updated);
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    onSave({ ...savedData, [key]: checked });
  };

  // Auto-check completion
  // Check if at least 2 contacts have names filled in
  const contactsWithNames = contacts.filter((c) => c.name.trim().length > 0).length;
  const autoChecks = {
    conversationsHad: contactsWithNames >= 2,
    // "Positioning confirmed" stays manual - don't auto-check
    positioningConfirmed: false,
  };

  return (
    <div className="space-y-10">
      {/* Tip */}
      <div className="rounded-lg border-l-4 border-blair-sage bg-blair-sage/5 p-5">
        <p className="text-sm font-semibold text-blair-sage-dark">
          Quick tip
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/70">
          This isn't a sales conversation. You're testing whether your
          positioning lands with people who know your work. Their honest
          reaction will tell you more than any amount of solo brainstorming.
        </p>
      </div>

      {/* Outreach message template */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          Your outreach message
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          A suggested template for reaching out. Edit it to sound like you.
        </p>
        <textarea
          value={outreachMessage}
          onChange={(e) => handleChange("outreachMessage", e.target.value)}
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
          className="mt-3 w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-relaxed text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />

        {/* AI action buttons — the two most-used refinement actions for
            outreach drafts: shorter and more direct. "Write it for me" was
            removed because the template is already pre-filled. */}
        <div className="mt-3 flex flex-wrap gap-2">
          <RefineButton
            label="Make it shorter"
            taskType="gut-check"
            action="shorten"
            fieldName="outreachMessage"
            currentValue={outreachMessage}
            context={{ pathSlug }}
            onResult={(result) => setRefineSuggestion(result)}
          />
          <RefineButton
            label="Make it more direct"
            taskType="gut-check"
            action="direct"
            fieldName="outreachMessage"
            currentValue={outreachMessage}
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
              <button
                onClick={() => {
                  handleChange("outreachMessage", refineSuggestion);
                  setRefineSuggestion(null);
                }}
                className="text-xs font-medium text-blair-sage-dark hover:text-blair-sage"
              >
                Use this
              </button>
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

      {/* People to reach out to — blank slots for the user to fill in.
          Inspiration panel below shows "think about people like..." patterns
          that get their brain spinning without locking them into specific
          categories that may not match their actual network. */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          People to reach out to
        </label>
        <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/50">
          Pick 2-3 people who know your work well enough to give you an honest
          reaction. Think former colleagues, mentors, or anyone close enough to
          your target market to tell you whether this positioning lands.
        </p>

        {/* Inspiration panel — prompts to get the brain spinning, not pre-fills */}
        <details className="mt-4 rounded-lg border border-blair-mist bg-blair-linen/40">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-blair-sage-dark hover:text-blair-sage transition-colors">
            Need inspiration? Here's who tends to give the best gut-checks.
          </summary>
          <div className="border-t border-blair-mist px-4 py-3 text-sm leading-relaxed text-blair-charcoal/70">
            <ul className="space-y-1.5 list-disc list-inside marker:text-blair-sage/60">
              <li>A former colleague who has since moved to a smaller, faster company (they see what you saw, in a new context)</li>
              <li>A peer at your level who worked alongside you and knows your strengths without needing proof</li>
              <li>Someone in your target buyer's world, even loosely. A friend of a friend who runs the kind of company you'd want to help.</li>
              <li>A mentor or senior who'd tell you the truth, not just what you want to hear</li>
              <li>A friend in a completely different field who's good at spotting vague language (often the best test of whether your positioning is clear)</li>
            </ul>
          </div>
        </details>

        <div className="mt-5 space-y-4">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className="rounded-xl border border-blair-mist bg-white p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blair-sage/10 text-xs font-semibold text-blair-sage-dark">
                  {i + 1}
                </div>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) =>
                    handleContactChange(i, "name", e.target.value)
                  }
                  placeholder="Name"
                  className="flex-1 rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm font-medium text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                />
              </div>

              <textarea
                value={contact.notes}
                onChange={(e) =>
                  handleContactChange(i, "notes", e.target.value)
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
                rows={2}
                placeholder="Why this person? What do they know about your work?"
                className="w-full resize-none overflow-hidden rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm leading-relaxed text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
              />

              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleContactChange(i, "status", opt.value)
                    }
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                      contact.status === opt.value
                        ? opt.value === "conversation-had"
                          ? "bg-blair-sage text-white"
                          : opt.value === "reached-out"
                            ? "bg-blair-sage/20 text-blair-sage-dark"
                            : "bg-blair-mist text-blair-charcoal/60"
                        : "bg-white border border-blair-mist text-blair-charcoal/40 hover:border-blair-sage/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation guide — the questions to actually ask on the call.
          Without this, users reach out and then freeze when the call starts. */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          What to ask on the call
        </label>
        <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/50">
          Keep it to 15 minutes. You're not selling, you're testing whether
          this lands. Here's a loose script that works.
        </p>
        <div className="mt-3 rounded-xl border border-blair-mist bg-white p-5 text-sm leading-relaxed text-blair-charcoal/80 space-y-3">
          <div>
            <p className="font-semibold text-blair-midnight">1. Open with context (30 sec)</p>
            <p className="text-blair-charcoal/70">
              &ldquo;Thanks for making time. Quick context: I&apos;m exploring going
              independent. I wanted your gut reaction on an idea before I go too
              far. Not a pitch.&rdquo;
            </p>
          </div>
          <div>
            <p className="font-semibold text-blair-midnight">2. Read your one sentence, then stop talking (1 min)</p>
            <p className="text-blair-charcoal/70">
              Literally read your positioning statement. Then wait. Their first
              reaction is the most honest data you&apos;ll get.
            </p>
          </div>
          <div>
            <p className="font-semibold text-blair-midnight">3. Ask these in order (10 min)</p>
            <ul className="mt-1 space-y-1 list-disc list-inside marker:text-blair-sage/60 text-blair-charcoal/70">
              <li>&ldquo;When you heard that, what was your first reaction?&rdquo;</li>
              <li>&ldquo;Who came to mind? Anyone specific?&rdquo;</li>
              <li>&ldquo;If you were running a company that needed this, what would make you hire someone vs. figure it out internally?&rdquo;</li>
              <li>&ldquo;What part felt off or unclear?&rdquo;</li>
              <li>&ldquo;What would make this a no-brainer for the person you&apos;re thinking of?&rdquo;</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blair-midnight">4. Close (2 min)</p>
            <p className="text-blair-charcoal/70">
              &ldquo;This is super helpful. Would you be open to an intro if
              someone specific comes to mind later?&rdquo; Then actually send them a
              thank-you the next day.
            </p>
          </div>
        </div>
      </div>

      {/* What I heard — structured prompts + one free-form textarea */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          What I heard
        </label>
        <p className="mt-1 text-sm leading-relaxed text-blair-charcoal/50">
          Capture takeaways right after each call while they&apos;re fresh. Focus on:
        </p>
        <ul className="mt-2 ml-1 space-y-1 text-sm leading-relaxed text-blair-charcoal/60 list-disc list-inside marker:text-blair-sage/60">
          <li>Their gut reaction in the first 10 seconds</li>
          <li>Who they thought of (names, companies, roles)</li>
          <li>What they pushed back on or asked to clarify</li>
          <li>What surprised you</li>
          <li>Any intros or leads they offered</li>
        </ul>
        <textarea
          value={whatIHeard}
          onChange={(e) => handleChange("whatIHeard", e.target.value)}
          rows={8}
          placeholder={`Conversation 1: [name]\nGut reaction:\nWho they thought of:\nWhat they pushed back on:\n\nConversation 2: [name]\n...`}
          className="mt-3 w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-relaxed text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />

        {/* Transcript paste — for users with Granola, Otter, or similar tools */}
        <details className="mt-4 group">
          <summary className="cursor-pointer text-sm font-medium text-blair-sage-dark hover:text-blair-sage transition-colors">
            Have a transcript? Paste it here and we&apos;ll summarize.
          </summary>
          <div className="mt-3 space-y-3">
            <textarea
              value={(savedData.rawTranscript as string) ?? ""}
              onChange={(e) => handleChange("rawTranscript", e.target.value)}
              rows={8}
              placeholder="Paste the full transcript from Granola, Otter, or any recording tool..."
              className="w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-sm leading-relaxed text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
            />
            <RefineButton
              label="Summarize into key takeaways"
              taskType="gut-check"
              action="summarize-transcript"
              fieldName="rawTranscript"
              currentValue={(savedData.rawTranscript as string) ?? ""}
              context={{ pathSlug, whatIHeard }}
              onResult={(result) => {
                // Append the summary to whatIHeard rather than replacing
                const existing = whatIHeard.trim();
                const combined = existing
                  ? `${existing}\n\n---\nFrom transcript:\n${result}`
                  : result;
                handleChange("whatIHeard", combined);
              }}
            />
          </div>
        </details>
      </div>

      {/* Completion checklist */}
      <div className="rounded-xl border border-blair-mist bg-white p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-blair-charcoal/50">
          Completion checklist
        </h4>
        <div className="mt-4 space-y-3">
          {[
            {
              key: "conversationsHad",
              label: "2-3 conversations had or scheduled",
            },
            {
              key: "positioningConfirmed",
              label:
                "Positioning confirmed (or adjusted based on what I heard)",
            },
          ].map(({ key, label }) => {
            const isAutoChecked = autoChecks[key as keyof typeof autoChecks];
            const isManuallyChecked = !!savedData[key];
            const isChecked = isAutoChecked || isManuallyChecked;
            return (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleCheckboxChange(key, e.target.checked)}
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
