import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskCard } from "@/components/playbook/TaskCard";
import { PhaseComplete } from "@/components/playbook/PhaseComplete";
import { SharePrompt } from "@/components/playbook/SharePrompt";
import { WelcomeBack } from "@/components/playbook/WelcomeBack";

export const metadata = {
  title: "Your Playbook - Blair",
};


export default async function PlaybookPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
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
  const confirmedPathId =
    recommendation?.confirmedPathId || recommendation?.primaryPathId;
  const confirmedPath = confirmedPathId
    ? recommendation?.paths.find((p) => p.pathId === confirmedPathId)?.path
    : null;

  if (!confirmedPathId || !confirmedPath) {
    return (
      <div className="py-20 text-center">
        <p className="text-blair-charcoal/50">
          Your playbook is on the way. We&apos;ll email you when it&apos;s ready.
        </p>
      </div>
    );
  }

  // Fetch phases for the confirmed path
  const phases = await prisma.phase.findMany({
    where: { businessPathId: confirmedPathId },
    orderBy: { order: "asc" },
    include: { tasks: { orderBy: { order: "asc" } } },
  });

  if (!phases.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-blair-charcoal/50">
          Your playbook is on the way. We&apos;ll email you when it&apos;s ready.
        </p>
      </div>
    );
  }

  const activePhase = phases[0];
  const futurePhases = phases.slice(1);

  // Fetch user's progress for all Phase 1 tasks
  const taskIds = activePhase.tasks.map((t) => t.id);
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
  const totalTasks = activePhase.tasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const allTasksComplete = totalTasks > 0 && completedCount === totalTasks;

  // Find in-progress task for resume banner
  const inProgressTask = activePhase.tasks.find((t) => {
    const progress = progressMap.get(t.id);
    return progress?.status === "in_progress";
  });

  // Find the last completed task and next incomplete task
  const lastCompletedTask = [...activePhase.tasks]
    .reverse()
    .find((t) => progressMap.get(t.id)?.status === "done");

  const nextIncompleteTask = activePhase.tasks.find((t) => {
    const progress = progressMap.get(t.id);
    return !progress || progress.status !== "done";
  });

  // Determine welcome-back state
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const firstName = user?.name?.split(" ")[0] || "there";

  let welcomeState: "in_progress" | "completed_task" | "not_started" | "all_done";
  if (allTasksComplete) {
    welcomeState = "all_done";
  } else if (inProgressTask) {
    welcomeState = "in_progress";
  } else if (completedCount > 0 && nextIncompleteTask) {
    welcomeState = "completed_task";
  } else {
    welcomeState = "not_started";
  }

  // Estimate days since last activity
  const lastProgressUpdate = progressRecords.length > 0
    ? Math.max(...progressRecords.map((p) => new Date(p.updatedAt).getTime()))
    : null;
  const daysSinceLastVisit = lastProgressUpdate
    ? Math.floor((Date.now() - lastProgressUpdate) / (1000 * 60 * 60 * 24))
    : undefined;

  return (
    <div className="mx-auto max-w-3xl pb-20">
      {allTasksComplete && <PhaseComplete />}

      {/* Smart welcome back / resume card */}
      {!allTasksComplete && (
        <div className="pt-4">
          <WelcomeBack
            firstName={firstName}
            state={welcomeState}
            currentTaskTitle={inProgressTask?.title}
            currentTaskSlug={inProgressTask?.slug}
            nextTaskTitle={nextIncompleteTask?.title}
            nextTaskSlug={nextIncompleteTask?.slug}
            lastCompletedTaskTitle={lastCompletedTask?.title}
            completedCount={completedCount}
            totalTasks={totalTasks}
            daysSinceLastVisit={daysSinceLastVisit}
          />
        </div>
      )}

      {/* Path header */}
      <div className="pt-4 pb-2">
        <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
          Your Playbook
        </p>
        <h1 className="mt-3 font-serif text-3xl text-blair-midnight sm:text-4xl">
          {confirmedPath.name}
        </h1>
        {confirmedPath.description && (
          <p className="mt-4 text-base leading-relaxed text-blair-charcoal/70">
            {confirmedPath.description}
          </p>
        )}
      </div>

      {/* 5-phase roadmap */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-blair-charcoal/40">
          Your {phases.length}-Phase Roadmap
        </h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:gap-0 sm:overflow-visible sm:pb-0">
          {phases.map((phase) => (
            <div key={phase.id} className="flex shrink-0 flex-col items-center text-center px-2 sm:px-1" style={{ minWidth: "4.5rem" }}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  phase.order === 1
                    ? "bg-blair-sage text-white"
                    : "bg-blair-mist text-blair-charcoal/40"
                }`}
              >
                {phase.order}
              </div>
              <p
                className={`mt-2 text-xs leading-tight ${
                  phase.order === 1
                    ? "font-semibold text-blair-midnight"
                    : "text-blair-charcoal/40"
                }`}
              >
                {phase.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active phase header */}
      <div className="pt-10 pb-2">
        <h2 className="font-serif text-2xl text-blair-midnight sm:text-3xl">
          Phase 1: {activePhase.name}
        </h2>
        {activePhase.description && (
          <p className="mt-3 text-base leading-relaxed text-blair-charcoal/60">
            {activePhase.description}
          </p>
        )}
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


      {/* Task cards */}
      <div className="mt-8 space-y-3">
        {activePhase.tasks.map((task) => {
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
      {futurePhases.length > 0 && (
        <div className="mt-16 rounded-xl border border-blair-mist/60 bg-white/40 px-6 py-6">
          <p className="text-sm font-semibold text-blair-charcoal/40 uppercase tracking-wider">
            Up next
          </p>
          <p className="mt-2 font-serif text-lg text-blair-charcoal/50">
            Phase 2: {futurePhases[0].name}
          </p>
          <p className="mt-1 text-sm text-blair-charcoal/40">
            Complete Phase 1 to unlock the next step.
          </p>
        </div>
      )}

      {/* Share prompt */}
      {!allTasksComplete && (
        <div className="mt-10">
          <SharePrompt />
        </div>
      )}
    </div>
  );
}
