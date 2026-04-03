import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPreviewTaskPage({
  params,
}: {
  params: Promise<{ userId: string; taskSlug: string }>;
}) {
  const { userId, taskSlug } = await params;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) notFound();

  // Find the task
  const task = await prisma.task.findUnique({
    where: { slug: taskSlug },
    include: { phase: { include: { businessPath: true } } },
  });
  if (!task) notFound();

  // Get all tasks in this phase for navigation
  const phaseTasks = await prisma.task.findMany({
    where: { phaseId: task.phaseId },
    orderBy: { order: "asc" },
  });

  const currentIndex = phaseTasks.findIndex((t) => t.id === task.id);
  const prevTask = currentIndex > 0 ? phaseTasks[currentIndex - 1] : null;
  const nextTask =
    currentIndex < phaseTasks.length - 1 ? phaseTasks[currentIndex + 1] : null;

  // Get user's saved data for this task (if any)
  const progress = await prisma.taskProgress.findFirst({
    where: { userId, taskId: task.id },
  });

  const savedData = progress?.savedData
    ? (progress.savedData as Record<string, unknown>)
    : null;

  const firstName = user.name?.split(" ")[0] ?? "User";

  return (
    <div>
      {/* Admin preview banner */}
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center">
        <span className="text-xs font-medium text-amber-800">
          Admin preview: {user.name || user.email}
        </span>
        <span className="mx-2 text-amber-300">|</span>
        <Link
          href={`/admin/preview/${userId}/playbook`}
          className="text-xs text-amber-700 hover:underline"
        >
          Playbook
        </Link>
        <span className="mx-2 text-amber-300">|</span>
        <Link
          href={`/admin/preview/${userId}/results`}
          className="text-xs text-amber-700 hover:underline"
        >
          Results
        </Link>
        <span className="mx-2 text-amber-300">|</span>
        <Link
          href={`/admin/${userId}`}
          className="text-xs text-amber-700 hover:underline"
        >
          Back to admin
        </Link>
      </div>

      <main className="mx-auto max-w-3xl bg-blair-linen px-4 pb-20 pt-8">
        {/* Breadcrumb */}
        <p className="text-xs text-blair-charcoal/40">
          Phase {task.phase.order}: {task.phase.name}
        </p>

        {/* Task header */}
        <div className="mt-2 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
            Task {task.order} of {phaseTasks.length}
          </p>
          <h1 className="mt-2 font-serif text-2xl text-blair-midnight sm:text-3xl">
            {task.title}
          </h1>
          {task.timeEstimate && (
            <p className="mt-1 text-xs text-blair-charcoal/40">
              Estimated time: {task.timeEstimate}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="rounded-xl border border-blair-mist bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blair-charcoal/40">
            What to do
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-blair-charcoal/80 whitespace-pre-line">
            {task.description}
          </p>
        </div>

        {/* Why it matters */}
        {task.whyItMatters && (
          <div className="mt-4 rounded-xl border border-blair-sage/20 bg-blair-sage/5 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blair-sage-dark/60">
              Why this matters
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-blair-charcoal/70 whitespace-pre-line">
              {task.whyItMatters}
            </p>
          </div>
        )}

        {/* Saved data preview */}
        {savedData && Object.keys(savedData).length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-800/60">
              {firstName}&apos;s saved work
            </h2>
            <div className="mt-3 space-y-3">
              {Object.entries(savedData).map(([key, value]) => {
                if (!value || (typeof value === "string" && !value.trim()))
                  return null;
                return (
                  <div key={key}>
                    <p className="text-xs font-medium text-blue-700/60">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    </p>
                    <p className="mt-1 text-sm text-blue-900/70 whitespace-pre-line">
                      {typeof value === "string"
                        ? value
                        : JSON.stringify(value, null, 2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress status */}
        <div className="mt-6 rounded-lg border border-gray-100 bg-white/60 px-4 py-3">
          <span className="text-xs text-gray-500">
            Status:{" "}
            <span
              className={
                progress?.status === "done"
                  ? "font-medium text-green-600"
                  : progress?.status === "in_progress"
                    ? "font-medium text-amber-600"
                    : "text-gray-400"
              }
            >
              {progress?.status === "done"
                ? "Complete"
                : progress?.status === "in_progress"
                  ? "In progress"
                  : "Not started"}
            </span>
          </span>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {prevTask ? (
            <Link
              href={`/admin/preview/${userId}/playbook/${prevTask.slug}`}
              className="text-sm text-blair-sage-dark hover:underline"
            >
              &larr; {prevTask.title}
            </Link>
          ) : (
            <div />
          )}
          {nextTask ? (
            <Link
              href={`/admin/preview/${userId}/playbook/${nextTask.slug}`}
              className="text-sm text-blair-sage-dark hover:underline"
            >
              {nextTask.title} &rarr;
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
