"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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

// Map path slugs to natural conversational descriptions
const pathDescriptions: Record<string, string> = {
  "gtm-growth-strategist": "GTM and growth strategy",
  "messaging-positioning": "messaging and positioning",
  "fractional-operator": "fractional operations leadership",
  "studio-builder": "productized consulting",
  "content-engine-operator": "content strategy and thought leadership",
  "lead-gen-operator": "lead generation and pipeline building",
  "niche-talent-placement": "talent placement and recruiting",
  "automation-systems-builder": "automation and systems design",
  "investor-operator": "investing and advisory",
};

function buildOutreachTemplate(pathName: string, savedData: Record<string, unknown>, pathSlug: string): string {
  const positioning = (savedData.editedStatement as string) || "";
  const naturalName = pathDescriptions[pathSlug] || pathName.toLowerCase() || "my area of expertise";
  const focus = positioning || naturalName;

  return `Hey [name],

Hope you're doing well! [Mention something you've noticed about them recently - a job change, a post, a life update.]

I've been exploring the idea of doing some independent work around ${focus}, and before I go too far down the road, I'd love to get your honest take on whether it makes sense.

Would you have 15 minutes this week or next? No pitch, just a gut-check from someone whose opinion I trust.`;
}

export function GutCheckEditor({
  pathSlug,
  savedData,
  onSave,
  pathName = "",
}: GutCheckEditorProps) {
  const defaultTemplate = buildOutreachTemplate(pathName, savedData, pathSlug);
  const outreachMessage =
    (savedData.outreachMessage as string) ?? defaultTemplate;
  const contacts = (savedData.contacts as ContactSlot[]) ?? defaultContacts;
  const whatIHeard = (savedData.whatIHeard as string) ?? "";

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
          rows={12}
          className="mt-3 w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-relaxed text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
      </div>

      {/* Who to reach out to - suggestions */}
      <div className="rounded-xl border border-blair-sage/20 bg-blair-sage/5 px-5 py-4">
        <p className="text-sm font-semibold text-blair-sage-dark">
          Who to reach out to
        </p>
        <p className="mt-2 text-sm leading-relaxed text-blair-charcoal/70">
          {buyerProfile?.buyerTitle && buyerProfile?.companyType ? (
            <>
              Based on your buyer profile, look for people who work with or know{" "}
              <span className="font-medium text-blair-midnight">{buyerProfile.buyerTitle}</span> at{" "}
              <span className="font-medium text-blair-midnight">{buyerProfile.companyType}</span> companies.
              Former colleagues who are now at similar companies are a great place to start.
            </>
          ) : (
            <>
              Think about former colleagues, current connections, or people in your network who
              work with your target buyer. You don&apos;t need to find perfect matches - just people
              who are close enough to your target market to give you a useful gut reaction.
            </>
          )}
        </p>
      </div>

      {/* People to reach out to */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          People to reach out to
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Pick 2-3 people who know your work well enough to give you an honest
          reaction. Former colleagues, mentors, or people in your network who
          understand the market.
        </p>

        <div className="mt-4 space-y-4">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className="rounded-xl border border-blair-mist bg-white p-5"
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
                  className="flex-1 rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                />
              </div>

              <div className="mt-3 pl-10">
                <input
                  type="text"
                  value={contact.notes}
                  onChange={(e) =>
                    handleContactChange(i, "notes", e.target.value)
                  }
                  placeholder="Why this person? What do they know about your work?"
                  className="w-full rounded-lg border border-blair-mist bg-white px-3 py-2 text-sm text-blair-charcoal placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
                />
              </div>

              <div className="mt-3 flex gap-2 pl-10">
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

      {/* What I heard */}
      <div>
        <label className="text-sm font-semibold text-blair-midnight">
          What I heard
        </label>
        <p className="mt-1 text-xs text-blair-charcoal/50">
          Capture the key takeaways from your conversations. What resonated?
          What surprised you? Did anyone push back on something?
        </p>
        <textarea
          value={whatIHeard}
          onChange={(e) => handleChange("whatIHeard", e.target.value)}
          rows={6}
          placeholder="After your conversations, capture what you learned here..."
          className="mt-3 w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-base leading-relaxed text-blair-midnight placeholder:text-blair-charcoal/30 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20"
        />
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
