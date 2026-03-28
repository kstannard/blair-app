import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskCard } from "@/components/playbook/TaskCard";
import { PhaseComplete } from "@/components/playbook/PhaseComplete";
import { SharePrompt } from "@/components/playbook/SharePrompt";

export const metadata = {
  title: "Your Playbook - Blair",
};


export default async function PlaybookPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  // Fetch Phase 1 and its tasks
  const phase1 = await prisma.phase.findFirst({
    where: { order: 1 },
    include: {
      tasks: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!phase1) {
    return (
      <div className="py-20 text-center">
        <p className="text-blair-charcoal/50">
          Your playbook is being prepared. Check back soon.
        </p>
      </div>
    );
  }

  // Fetch user's recommendation with confirmed path
  const recommendation = await prisma.recommendation.findFirst({
    where: { userId: session.user.id, status: "approved" },
    include: {
      paths: {
        include: { path: true },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Determine the confirmed path
  const confirmedPath = recommendation?.confirmedPathId
    ? recommendation.paths.find((p) => p.pathId === recommendation.confirmedPathId)?.path
    : recommendation?.paths.find((p) => p.pathId === recommendation.primaryPathId)?.path;

  // Fetch user's progress for all Phase 1 tasks
  const taskIds = phase1.tasks.map((t) => t.id);
  const progressRecords = await prisma.taskProgress.findMany({
    where: {
      userId: session.user.id,
      taskId: { in: taskIds },
    },
  });

  const progressMap = new Map(
    progressRecords.map((p) => [p.taskId, p])
  );

  // Calculate completion stats
  const completedCount = progressRecords.filter(
    (p) => p.status === "done"
  ).length;
  const totalTasks = phase1.tasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const allTasksComplete = totalTasks > 0 && completedCount === totalTasks;

  // Find in-progress task for resume banner
  const inProgressTask = phase1.tasks.find((t) => {
    const progress = progressMap.get(t.id);
    return progress?.status === "in_progress";
  });

  return (
    <div className="pb-20">
      {allTasksComplete && <PhaseComplete />}

      {/* Path header */}
      <div className="pt-4 pb-2">
        <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
          Your Playbook
        </p>
        <h1 className="mt-3 font-serif text-3xl text-blair-midnight sm:text-4xl">
          {confirmedPath?.name || "Your Path"}
        </h1>
        {confirmedPath?.description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-blair-charcoal/70">
            {confirmedPath.description}
          </p>
        )}
      </div>

      {/* 5-phase roadmap */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-blair-charcoal/40">
          Your 5-Phase Roadmap
        </h2>
        <div className="mt-4 grid max-w-2xl grid-cols-5 gap-0">
          {[
            { num: 1, name: "Find Your Lane", active: true },
            { num: 2, name: "Design Your Offer", active: false },
            { num: 3, name: "Build Your Launchpad", active: false },
            { num: 4, name: "Start Conversations", active: false },
            { num: 5, name: "Close Your First Client", active: false },
          ].map((phase) => (
            <div key={phase.num} className="flex flex-col items-center text-center px-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  phase.active
                    ? "bg-blair-sage text-white"
                    : "bg-blair-mist text-blair-charcoal/40"
                }`}
              >
                {phase.num}
              </div>
              <p
                className={`mt-2 text-xs leading-tight ${
                  phase.active
                    ? "font-semibold text-blair-midnight"
                    : "text-blair-charcoal/40"
                }`}
              >
                {phase.name}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-2xl space-y-3 text-sm leading-relaxed text-blair-charcoal/50">
          <p>
            We&apos;ve done a lot of the heavy lifting for you - we pre-filled as much as we could based on your quiz answers and publicly available information. Review and adjust anything that doesn&apos;t feel right.
          </p>
          <p>
            Work at your own pace. Life will happen - a kid gets sick, work implodes, the two hours you carved out disappear. What matters is doing the work, not doing it on schedule.
          </p>
        </div>
      </div>

      {/* Phase 1 header */}
      <div className="pt-10 pb-2">
        <h2 className="font-serif text-2xl text-blair-midnight sm:text-3xl">
          Phase 1: Find Your Lane
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-blair-charcoal/60">
          Before you build anything, you need to know exactly what you&apos;re
          selling, who you&apos;re selling it to, and why they should hire you. These
          four tasks will get you there.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blair-charcoal/50">
            {completedCount} of {totalTasks} tasks complete
          </span>
          <span className="text-sm font-semibold text-blair-sage-dark">
            {progressPercent}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blair-mist">
          <div
            className="h-full rounded-full bg-blair-sage transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Resume banner */}
      {inProgressTask && (
        <Link
          href={`/playbook/${inProgressTask.slug}`}
          className="mt-6 flex items-center gap-4 rounded-xl border border-blair-sage/20 bg-blair-sage/5 px-6 py-4 transition-colors hover:bg-blair-sage/10"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blair-sage/15">
            <svg
              className="h-4 w-4 text-blair-sage-dark"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-blair-sage-dark">
              Resume where you left off
            </p>
            <p className="mt-0.5 text-sm text-blair-charcoal/50 truncate">
              {inProgressTask.title}
            </p>
          </div>
          <svg
            className="h-5 w-5 shrink-0 text-blair-sage"
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
      )}

      {/* Task cards */}
      <div className="mt-8 space-y-3">
        {phase1.tasks.map((task) => {
          const progress = progressMap.get(task.id);
          const status = (progress?.status ?? "not_started") as
            | "not_started"
            | "in_progress"
            | "done";

          return (
            <TaskCard
              key={task.id}
              order={task.order}
              title={task.title}
              description={task.description}
              status={status}
              slug={task.slug}
            />
          );
        })}
      </div>

      {/* Up next teaser */}
      <div className="mt-16 rounded-xl border border-blair-mist/60 bg-white/40 px-6 py-6">
        <p className="text-sm font-semibold text-blair-charcoal/40 uppercase tracking-wider">
          Up next
        </p>
        <p className="mt-2 font-serif text-lg text-blair-charcoal/50">
          Phase 2: Design Your Offer and Price It
        </p>
        <p className="mt-1 text-sm text-blair-charcoal/40">
          Complete Phase 1 to unlock the next step.
        </p>
      </div>

      {/* Share prompt */}
      {!allTasksComplete && (
        <div className="mt-10">
          <SharePrompt />
        </div>
      )}
    </div>
  );
}
