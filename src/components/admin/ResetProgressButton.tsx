"use client";

import { useState } from "react";

interface ResetProgressButtonProps {
  userId: string;
}

/**
 * Admin-only button that resets a customer's playbook progress. Marks
 * every TaskProgress row as 'not_started' but PRESERVES savedData (the
 * pre-populated content we wrote for them). Use this after logging in
 * as the customer to QA their experience.
 *
 * The backing API route also supports a ?mode=hard option that deletes
 * TaskProgress rows entirely. That's intentionally not exposed in the
 * UI — if you ever need it, ask Claude and it can be added back.
 */
export function ResetProgressButton({ userId }: ResetProgressButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/reset-progress/${userId}?mode=status-only`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(`Failed: ${body.error || res.statusText}`);
        return;
      }
      const data = await res.json();
      const count = data.reset ?? 0;
      setMessage(
        `Reset ${count} tasks to 'not started'. Pre-populated content preserved.`
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
        Marks every task as &quot;not started&quot; but keeps the
        pre-populated content we wrote for them.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          disabled={loading}
          className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset"}
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
