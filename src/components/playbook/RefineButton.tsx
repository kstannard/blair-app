"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface RefineButtonProps {
  label: string;
  taskType: string;
  action: string;
  fieldName: string;
  currentValue: string;
  context?: Record<string, unknown>;
  onResult: (result: string) => void;
}

export function RefineButton({
  label,
  taskType,
  action,
  fieldName,
  currentValue,
  context = {},
  onResult,
}: RefineButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType,
          action,
          fieldName,
          currentValue,
          context,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onResult(data.result);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-blair-sage/30 px-3 py-1 text-xs font-medium text-blair-sage-dark transition-all",
        "hover:border-blair-sage hover:bg-blair-sage/5",
        "active:scale-[0.97]",
        "disabled:opacity-50 disabled:cursor-wait"
      )}
    >
      {loading ? (
        <>
          <div className="h-3 w-3 animate-spin rounded-full border border-blair-sage/30 border-t-blair-sage" />
          Working...
        </>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
