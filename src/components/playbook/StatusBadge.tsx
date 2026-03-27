"use client";

import { cn } from "@/lib/utils";

type TaskStatus = "not_started" | "in_progress" | "done";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; classes: string }> = {
  not_started: {
    label: "Not started",
    classes: "bg-blair-mist text-blair-charcoal/60",
  },
  in_progress: {
    label: "In progress",
    classes: "bg-blair-sage/15 text-blair-sage-dark",
  },
  done: {
    label: "Complete",
    classes: "bg-blair-sage/10 text-blair-sage-dark",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {status === "done" && (
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      )}
      {status === "in_progress" && (
        <span className="h-1.5 w-1.5 rounded-full bg-blair-sage animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
