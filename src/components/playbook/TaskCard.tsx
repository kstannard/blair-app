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
        "group flex items-center gap-3 sm:gap-5 rounded-xl border px-4 sm:px-6 py-4 sm:py-5 transition-all active:scale-[0.98]",
        status === "done"
          ? "border-blair-sage/20 bg-blair-sage/5"
          : status === "in_progress"
            ? "border-blair-sage/40 bg-white border-l-[3px] border-l-blair-sage hover:shadow-sm"
            : "border-blair-mist bg-white hover:border-blair-sage/40 hover:shadow-sm active:bg-blair-sage/5"
      )}
    >
      {/* Order number circle */}
      <div
        className={cn(
          "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
          status === "done"
            ? "bg-blair-sage/15 text-blair-sage-dark"
            : status === "in_progress"
              ? "bg-blair-sage text-white"
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
        <h3
          className={cn(
            "text-sm sm:text-base font-semibold leading-snug",
            status === "done"
              ? "text-blair-sage-dark"
              : "text-blair-midnight group-hover:text-blair-sage-dark"
          )}
        >
          {title}
        </h3>
        <p className="mt-0.5 sm:mt-1 text-xs leading-relaxed text-blair-charcoal/50 line-clamp-1 sm:line-clamp-2 sm:text-sm">
          {description}
        </p>
      </div>

      {/* Status + Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} className="hidden sm:inline-flex" />
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5 text-blair-charcoal/25 transition-transform group-hover:translate-x-0.5 group-hover:text-blair-sage"
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
      </div>
    </Link>
  );
}
