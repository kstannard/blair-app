import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, drafts] = await Promise.all([
    prisma.user.findMany({
      include: {
        profile: true,
        recommendations: {
          include: {
            paths: {
              include: { path: true },
              orderBy: { rank: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        taskProgress: {
          include: { task: { include: { phase: true } } },
          orderBy: { updatedAt: "desc" },
        },
        quizSubmissions: {
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.recommendation.findMany({
      where: { status: "draft" },
      include: {
        user: true,
        paths: { include: { path: true }, orderBy: { rank: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      {drafts.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">
            {drafts.length === 1 ? "1 recommendation needs your review" : `${drafts.length} recommendations need your review`}
          </h2>
          <div className="mt-3 space-y-2">
            {drafts.map((draft) => (
              <Link
                key={draft.id}
                href={`/admin/${draft.userId}`}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-4 py-3 hover:bg-amber-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{draft.user.name || draft.user.email}</p>
                  <p className="text-xs text-gray-500">
                    {draft.paths[0]?.path?.name ?? "Unknown path"} · submitted {formatDate(draft.createdAt)}
                  </p>
                </div>
                <span className="text-xs font-medium text-amber-700">Review →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{users.length} Customers</h1>
      </div>

      <div className="mt-6 space-y-3">
        {users.map((user) => {
          const rec = user.recommendations[0];
          const primaryPath = rec?.paths.find((p) => p.rank === 1)?.path;
          const confirmedPath = rec?.confirmedPathId
            ? rec.paths.find((p) => p.pathId === rec.confirmedPathId)?.path
            : null;

          const completedTasks = user.taskProgress.filter((t) => t.status === "done").length;
          const inProgressTasks = user.taskProgress.filter((t) => t.status === "in_progress").length;

          const hasQuiz = user.quizSubmissions.length > 0;
          const hasRec = !!rec && rec.status === "approved";
          const hasConfirmedPath = !!rec?.confirmedPathId;
          const inProgressEntry = user.taskProgress.find((t) => t.status === "in_progress");
          const currentPhase = inProgressEntry?.task?.phase?.name ?? null;

          let status = "Purchased";
          let statusColor = "bg-gray-100 text-gray-600";
          if (completedTasks > 0 && inProgressTasks === 0) {
            status = "Tasks done";
            statusColor = "bg-green-100 text-green-700";
          } else if (inProgressTasks > 0 || completedTasks > 0) {
            status = "In progress";
            statusColor = "bg-blue-100 text-blue-700";
          } else if (hasConfirmedPath) {
            status = "Playbook started";
            statusColor = "bg-blue-50 text-blue-600";
          } else if (hasRec) {
            status = "Results ready";
            statusColor = "bg-purple-100 text-purple-700";
          } else if (hasQuiz) {
            status = "Quiz submitted";
            statusColor = "bg-amber-100 text-amber-700";
          }

          const lastActive = user.taskProgress.length > 0
            ? user.taskProgress[0].updatedAt
            : user.updatedAt;

          const displayPath = confirmedPath ?? primaryPath;

          return (
            <Link
              key={user.id}
              href={`/admin/${user.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center gap-6">
                <div className="w-44">
                  <p className="font-medium text-blair-midnight">{user.name || "-"}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="w-52">
                  {displayPath ? (
                    <p className="text-sm text-gray-700">{displayPath.name}</p>
                  ) : (
                    <p className="text-sm text-gray-300">No path yet</p>
                  )}
                  {currentPhase && (
                    <p className="mt-0.5 text-xs text-gray-400">{currentPhase}</p>
                  )}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>{status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Active {formatDate(lastActive)}</span>
                <span className="text-gray-300">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
