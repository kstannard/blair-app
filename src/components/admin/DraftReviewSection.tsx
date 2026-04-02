"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PricingDetails {
  tiers?: Array<{ name: string; price: string }>;
  sideHustleMath?: string;
  fullCapacityMath?: string;
  momFit?: string;
}

interface DraftReviewProps {
  recId: string;
  status: string;
  initialData: {
    personalIntro: string | null;
    personalizedWhy: string | null;
    pricingDetails: string | null;
  };
}

function parsePricing(raw: string | null): PricingDetails {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function parseWhySections(text: string): { bigIdea: string; whatYouBuild: string; whoPaysYou: string } {
  const cleaned = text.replace(/\*\*(.*?)\*\*/g, "$1");
  const sections: Record<string, string> = { bigIdea: "", whatYouBuild: "", whoPaysYou: "" };
  let current: keyof typeof sections | null = null;
  const lines: string[] = [];

  for (const para of cleaned.split("\n\n").filter(Boolean)) {
    const trimmed = para.trim();
    if (/^the big idea:\s*/i.test(trimmed)) {
      current = "bigIdea";
      const rest = trimmed.replace(/^the big idea:\s*/i, "").trim();
      if (rest) lines.push(rest);
      continue;
    }
    if (/^what you build:\s*/i.test(trimmed)) {
      if (current) sections[current] = lines.join("\n\n");
      lines.length = 0;
      current = "whatYouBuild";
      const rest = trimmed.replace(/^what you build:\s*/i, "").trim();
      if (rest) lines.push(rest);
      continue;
    }
    if (/^who pays you/i.test(trimmed)) {
      if (current) sections[current] = lines.join("\n\n");
      lines.length = 0;
      current = "whoPaysYou";
      const rest = trimmed.replace(/^who pays you[^:]*:\s*/i, "").trim();
      if (rest) lines.push(rest);
      continue;
    }
    lines.push(trimmed);
  }
  if (current) sections[current] = lines.join("\n\n");

  // If no sections were detected, put everything in bigIdea
  if (!sections.bigIdea && !sections.whatYouBuild && !sections.whoPaysYou) {
    sections.bigIdea = cleaned;
  }

  return sections;
}

export default function DraftReviewSection({ recId, status, initialData }: DraftReviewProps) {
  const router = useRouter();
  const [personalIntro, setPersonalIntro] = useState(initialData.personalIntro ?? "");

  // Parse personalizedWhy into its 3 sections for separate editing
  const parsedWhy = parseWhySections(initialData.personalizedWhy ?? "");
  const [bigIdea, setBigIdea] = useState(parsedWhy.bigIdea);
  const [whatYouBuild, setWhatYouBuild] = useState(parsedWhy.whatYouBuild);
  const [whoPaysYou, setWhoPaysYou] = useState(parsedWhy.whoPaysYou);

  const initPricing = parsePricing(initialData.pricingDetails);

  const [tier1Name, setTier1Name] = useState(initPricing.tiers?.[0]?.name ?? "");
  const [tier1Price, setTier1Price] = useState(initPricing.tiers?.[0]?.price ?? "");
  const [tier2Name, setTier2Name] = useState(initPricing.tiers?.[1]?.name ?? "");
  const [tier2Price, setTier2Price] = useState(initPricing.tiers?.[1]?.price ?? "");
  const [sideHustleMath, setSideHustleMath] = useState(initPricing.sideHustleMath ?? "");
  const [fullCapacityMath, setFullCapacityMath] = useState(initPricing.fullCapacityMath ?? "");
  const [momFit, setMomFit] = useState(initPricing.momFit ?? "");

  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");

  function buildPayload() {
    // Reassemble personalizedWhy from the 3 sections
    const whyParts = [
      bigIdea ? `The big idea:\n${bigIdea}` : "",
      whatYouBuild ? `What you build:\n${whatYouBuild}` : "",
      whoPaysYou ? `Who pays you (and how you find them):\n${whoPaysYou}` : "",
    ].filter(Boolean);
    const personalizedWhy = whyParts.join("\n\n");

    return {
      personalIntro,
      personalizedWhy,
      pricingDetails: JSON.stringify({
        tiers: [
          { name: tier1Name, price: tier1Price },
          { name: tier2Name, price: tier2Price },
        ],
        sideHustleMath,
        fullCapacityMath,
        momFit,
      }),
    };
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaveMsg("");
    const res = await fetch(`/api/admin/recommendations/${recId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    setSaving(false);
    if (res.ok) {
      setSaveMsg("Saved.");
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setError("Save failed.");
    }
  }

  async function handleApprove() {
    setApproving(true);
    setError("");
    await fetch(`/api/admin/recommendations/${recId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    const res = await fetch(`/api/admin/recommendations/${recId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setApproving(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Approval failed.");
    }
  }

  return (
    <div className="mt-3 space-y-6">
      {status === "draft" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">Draft — not visible to user yet</p>
          <p className="mt-0.5 text-xs text-amber-600">Edit the copy below, then click Approve to make it live.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-800">Approved — visible to user</p>
          <p className="mt-0.5 text-xs text-green-600">You can still edit and save changes below.</p>
        </div>
      )}

      <Field label="Personal intro" value={personalIntro} onChange={setPersonalIntro} />

      <div className="space-y-3 rounded-lg border border-gray-100 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Personalized why</p>
        <Field label="The big idea" value={bigIdea} onChange={setBigIdea} />
        <Field label="What you build" value={whatYouBuild} onChange={setWhatYouBuild} />
        <Field label="Who pays you" value={whoPaysYou} onChange={setWhoPaysYou} />
      </div>

      <div className="space-y-3 rounded-lg border border-gray-100 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Pricing tiers</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tier 1 name" value={tier1Name} onChange={setTier1Name} />
          <Field label="Tier 1 price" value={tier1Price} onChange={setTier1Price} />
          <Field label="Tier 2 name" value={tier2Name} onChange={setTier2Name} />
          <Field label="Tier 2 price" value={tier2Price} onChange={setTier2Price} />
        </div>
        <Field label="Side hustle math" value={sideHustleMath} onChange={setSideHustleMath} />
        <Field label="Full capacity math" value={fullCapacityMath} onChange={setFullCapacityMath} />
        <Field label="Mom fit" value={momFit} onChange={setMomFit} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save edits"}
        </button>
        {status === "draft" && (
          <button
            onClick={handleApprove}
            disabled={approving}
            className="rounded-lg bg-blair-midnight px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {approving ? "Approving..." : "Approve and publish"}
          </button>
        )}
        {saveMsg && <span className="text-sm text-green-600">{saveMsg}</span>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        ref={(el) => {
          if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }
        }}
        className="w-full resize-none overflow-hidden rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blair-midnight focus:outline-none focus:ring-1 focus:ring-blair-midnight"
      />
    </div>
  );
}
