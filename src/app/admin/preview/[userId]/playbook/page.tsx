import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TaskCard } from "@/components/playbook/TaskCard";
import { PhaseRoadmap } from "@/components/playbook/PhaseRoadmap";

export const dynamic = "force-dynamic";

export default async function AdminPreviewPlaybookPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) notFound();

  const recommendation = await prisma.recommendation.findFirst({
    where: { userId, status: "approved" },
    include: {
      paths: {
        include: { path: true },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const confirmedPathId =
    recommendation?.confirmedPathId || recommendation?.primaryPathId;
  const confirmedPath = confirmedPathId
    ? recommendation?.paths.find((p) => p.pathId === confirmedPathId)?.path
    : null;

  if (!confirmedPathId || !confirmedPath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blair-linen">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            No approved recommendation or confirmed path for this user.
          </p>
          <Link
            href={`/admin/${userId}`}
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            &larr; Back to admin
          </Link>
        </div>
      </div>
    );
  }

  const phases = await prisma.phase.findMany({
    where: { businessPathId: confirmedPathId },
    orderBy: { order: "asc" },
    include: { tasks: { orderBy: { order: "asc" } } },
  });

  if (!phases.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blair-linen">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            No playbook phases found for path: {confirmedPath.name}
          </p>
          <Link
            href={`/admin/${userId}`}
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            &larr; Back to admin
          </Link>
        </div>
      </div>
    );
  }

  // Fetch user's progress
  const allTaskIds = phases.flatMap((p) => p.tasks.map((t) => t.id));
  const progressRecords = await prisma.taskProgress.findMany({
    where: { userId, taskId: { in: allTaskIds } },
  });
  const progressMap = new Map(progressRecords.map((p) => [p.taskId, p]));

  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div>
      {/* Admin preview banner */}
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center">
        <span className="text-xs font-medium text-amber-800">
          Admin preview: {user.name || user.email}
        </span>
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
        {/* Path header */}
        <div className="pb-2">
          <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
            {firstName}&apos;s Playbook
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
        <PhaseRoadmap phases={phases} />

        {/* All phases with tasks */}
        {phases.map((phase) => (
          <div key={phase.id} className="mt-10">
            <h2 className="font-serif text-2xl text-blair-midnight">
              Phase {phase.order}: {phase.name}
            </h2>
            {phase.description && (
              <p className="mt-2 text-sm text-blair-charcoal/60">
                {phase.description}
              </p>
            )}
            <div className="mt-4 space-y-3">
              {phase.tasks.map((task) => {
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
                    hrefPrefix={`/admin/preview/${userId}/playbook`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
