"use client";

import Link from "next/link";

interface WelcomeBackProps {
  firstName: string;
  state: "in_progress" | "completed_task" | "not_started" | "all_done";
  currentTaskTitle?: string;
  currentTaskSlug?: string;
  nextTaskTitle?: string;
  nextTaskSlug?: string;
  lastCompletedTaskTitle?: string;
  completedCount: number;
  totalTasks: number;
  daysSinceLastVisit?: number;
}

export function WelcomeBack({
  firstName,
  state,
  currentTaskTitle,
  currentTaskSlug,
  nextTaskTitle,
  nextTaskSlug,
  lastCompletedTaskTitle,
  completedCount,
  totalTasks,
  daysSinceLastVisit,
}: WelcomeBackProps) {
  if (state === "all_done") return null;

  // First-time visitor with no progress
  if (state === "not_started") {
    return (
      <div className="mb-8 rounded-xl bg-blair-sage/10 border border-blair-sage/20 px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-lg font-semibold text-blair-midnight sm:text-xl">
          Hey {firstName}, let&apos;s get started.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-blair-charcoal/60">
          Your first task takes about 10 minutes. We&apos;ve already filled in most of it for you.
        </p>
        {nextTaskSlug && (
          <Link
            href={`/playbook/${nextTaskSlug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blair-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
          >
            Start your first task
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    );
  }

  // Has a task in progress
  if (state === "in_progress" && currentTaskSlug) {
    const longAwayMessages = [
      `It's been a minute, ${firstName}. Life happens. Let's pick it back up.`,
      `You're back, ${firstName}. The playbook was just sitting here, patiently waiting.`,
      `Been a few days? Cool. This isn't a race. Let's go.`,
    ];
    const shortAwayMessages = [
      `Welcome back, ${firstName}.`,
      `${firstName}'s back. Let's keep going.`,
    ];
    const pool = daysSinceLastVisit && daysSinceLastVisit >= 3 ? longAwayMessages : shortAwayMessages;
    const greeting = pool[Math.floor(Math.random() * pool.length)];

    return (
      <div className="mb-8 rounded-xl bg-blair-sage/10 border border-blair-sage/20 px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-lg font-semibold text-blair-midnight sm:text-xl">
          {greeting}
        </p>
        <p className="mt-1 text-sm text-blair-charcoal/50">
          {completedCount} of {totalTasks} tasks done
        </p>
        <Link
          href={`/playbook/${currentTaskSlug}`}
          className="mt-4 flex items-center gap-4 rounded-lg bg-white border border-blair-sage/20 px-5 py-4 transition-all hover:border-blair-sage/40 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blair-sage text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-blair-sage">
              Pick up where you left off
            </p>
            <p className="mt-0.5 text-base font-semibold text-blair-midnight truncate">
              {currentTaskTitle}
            </p>
          </div>
          <svg className="h-5 w-5 shrink-0 text-blair-sage" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    );
  }

  // Just completed a task, show next one
  if (state === "completed_task" && nextTaskSlug) {
    return (
      <div className="mb-8 rounded-xl bg-blair-sage/10 border border-blair-sage/20 px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-lg font-semibold text-blair-midnight sm:text-xl">
          Nice work on &ldquo;{lastCompletedTaskTitle}&rdquo;, {firstName}.
        </p>
        <p className="mt-1 text-sm text-blair-charcoal/50">
          {completedCount} of {totalTasks} tasks done. Ready for the next one?
        </p>
        <Link
          href={`/playbook/${nextTaskSlug}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blair-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
        >
          Start: {nextTaskTitle}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return null;
}
