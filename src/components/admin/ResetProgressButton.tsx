"use client";

import { useState } from "react";

interface ResetProgressButtonProps {
  userId: string;
}

/**
 * Admin-only button that resets a customer's playbook progress. Default
 * mode is "status-only" which keeps savedData (the pre-populated content
 * we wrote for them) but marks every task as 'not_started' again. Use
 * this after logging in as the customer to QA their experience.
 */
export function ResetProgressButton({ userId }: ResetProgressButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async (mode: "status-only" | "hard") => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/reset-progress/${userId}?mode=${mode}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(`Failed: ${body.error || res.statusText}`);
        return;
      }
      const data = await res.json();
      const count = data.deleted ?? data.reset ?? 0;
      setMessage(
        mode === "hard"
          ? `Deleted ${count} task progress rows. Customer starts fully fresh.`
          : `Reset ${count} tasks to 'not started'. Pre-populated content preserved.`
      );
      setConfirm(false);
    } catch (e) {
      setMessage("Failed: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!confirm) {
    return (
      <div className="flex flex-col items-end">
        <button
          onClick={() => setConfirm(true)}
          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100"
          title="Reset playbook progress after QAing as this customer"
        >
          Reset playbook progress
        </button>
        {message && (
          <p className="mt-1 text-xs text-gray-500">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
      <p className="text-xs font-medium text-amber-900">Reset this customer&apos;s playbook?</p>
      <p className="max-w-xs text-xs text-amber-800/80">
        Soft reset marks every task as &quot;not started&quot; but keeps the
        pre-populated content we wrote for them. Hard reset deletes everything.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleReset("status-only")}
          disabled={loading}
          className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Soft reset"}
        </button>
        <button
          onClick={() => handleReset("hard")}
          disabled={loading}
          className="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          Hard reset
        </button>
        <button
          onClick={() => setConfirm(false)}
          disabled={loading}
          className="rounded-md px-3 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
      {message && <p className="mt-1 text-xs text-gray-600">{message}</p>}
    </div>
  );
}
