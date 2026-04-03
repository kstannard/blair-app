"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

type TaskStatus = "not_started" | "in_progress" | "done";

interface TaskCardProps {
  order: number;
  title: string;
  description: string;
  status: TaskStatus;
  slug: string;
  hrefPrefix?: string;
}

export function TaskCard({
  order,
  title,
  description,
  status,
  slug,
  hrefPrefix = "/playbook",
}: TaskCardProps) {
  return (
    <Link
      href={`${hrefPrefix}/${slug}`}
      className={cn(
        "group flex items-start gap-5 rounded-xl border px-6 py-5 transition-all",
        status === "done"
          ? "border-blair-sage/20 bg-blair-sage/5"
          : "border-blair-mist bg-white hover:border-blair-sage/40 hover:shadow-sm"
      )}
    >
      {/* Order number circle */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
          status === "done"
            ? "bg-blair-sage/15 text-blair-sage-dark"
            : status === "in_progress"
              ? "bg-blair-sage/15 text-blair-sage-dark"
              : "bg-blair-mist text-blair-charcoal/50 group-hover:bg-blair-sage/10 group-hover:text-blair-sage-dark"
        )}
      >
        {status === "done" ? (
          <svg
            className="h-4 w-4"
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
        ) : (
          order
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-semibold leading-snug",
              status === "done"
                ? "text-blair-sage-dark"
                : "text-blair-midnight group-hover:text-blair-sage-dark"
            )}
          >
            {title}
          </h3>
          <StatusBadge status={status} className="shrink-0" />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-blair-charcoal/60 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <svg
        className="mt-1 h-5 w-5 shrink-0 text-blair-charcoal/20 transition-transform group-hover:translate-x-0.5 group-hover:text-blair-sage"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </Link>
  );
}
