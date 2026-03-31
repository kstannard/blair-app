"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DraftReviewProps {
  recId: string;
  initialData: {
    personalIntro: string | null;
    personalizedWhy: string | null;
    pricingDetails: string | null;
    transitionPlan: string | null;
    closingNote: string | null;
  };
}

function prettyJson(raw: string | null): string {
  if (!raw) return "";
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export default function DraftReviewSection({ recId, initialData }: DraftReviewProps) {
  const router = useRouter();
  const [personalIntro, setPersonalIntro] = useState(initialData.personalIntro ?? "");
  const [personalizedWhy, setPersonalizedWhy] = useState(initialData.personalizedWhy ?? "");
  const [pricingDetails, setPricingDetails] = useState(prettyJson(initialData.pricingDetails));
  const [transitionPlan, setTransitionPlan] = useState(prettyJson(initialData.transitionPlan));
  const [closingNote, setClosingNote] = useState(initialData.closingNote ?? "");
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaveMsg("");

    // Validate JSON fields
    let parsedPricing: unknown, parsedTransition: unknown;
    try {
      parsedPricing = JSON.parse(pricingDetails);
    } catch {
      setError("Pricing details isn't valid JSON. Fix the formatting and try again.");
      setSaving(false);
      return;
    }
    try {
      parsedTransition = JSON.parse(transitionPlan);
    } catch {
      setError("Transition plan isn't valid JSON. Fix the formatting and try again.");
      setSaving(false);
      return;
    }

    const res = await fetch(`/api/admin/recommendations/${recId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalIntro,
        personalizedWhy,
        pricingDetails: JSON.stringify(parsedPricing),
        transitionPlan: JSON.stringify(parsedTransition),
        closingNote,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setSaveMsg("Saved.");
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setError("Save failed. Check the console.");
    }
  }

  async function handleApprove() {
    setApproving(true);
    setError("");

    // Save first, then approve
    let parsedPricing: unknown, parsedTransition: unknown;
    try { parsedPricing = JSON.parse(pricingDetails); } catch { parsedPricing = pricingDetails; }
    try { parsedTransition = JSON.parse(transitionPlan); } catch { parsedTransition = transitionPlan; }

    await fetch(`/api/admin/recommendations/${recId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalIntro,
        personalizedWhy,
        pricingDetails: JSON.stringify(parsedPricing),
        transitionPlan: JSON.stringify(parsedTransition),
        closingNote,
      }),
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
      setError("Approval failed. Check the console.");
    }
  }

  return (
    <div className="mt-3 space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-medium text-amber-800">Draft — not visible to user yet</p>
        <p className="mt-0.5 text-xs text-amber-600">Edit the copy below, then click Approve to make it live.</p>
      </div>

      <Field label="Personal intro" value={personalIntro} onChange={setPersonalIntro} rows={6} />
      <Field label="Personalized why" value={personalizedWhy} onChange={setPersonalizedWhy} rows={5} />
      <Field label="Closing note" value={closingNote} onChange={setClosingNote} rows={3} />
      <Field
        label="Pricing details (JSON)"
        value={pricingDetails}
        onChange={setPricingDetails}
        rows={8}
        mono
      />
      <Field
        label="Transition plan (JSON)"
        value={transitionPlan}
        onChange={setTransitionPlan}
        rows={8}
        mono
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save edits"}
        </button>
        <button
          onClick={handleApprove}
          disabled={approving}
          className="rounded-lg bg-blair-midnight px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {approving ? "Approving..." : "Approve and publish"}
        </button>
        {saveMsg && <span className="text-sm text-green-600">{saveMsg}</span>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 4,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blair-midnight focus:outline-none focus:ring-1 focus:ring-blair-midnight ${
          mono ? "font-mono text-xs" : ""
        }`}
      />
    </div>
  );
}
