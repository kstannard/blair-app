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
          include: { task: true },
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

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Primary Path</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Tasks</th>
              <th className="pb-3 pr-4">Current Task</th>
              <th className="pb-3 pr-4">Last Active</th>
              <th className="pb-3 pr-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const rec = user.recommendations[0];
              const primaryPath = rec?.paths.find((p) => p.rank === 1)?.path;
              const confirmedPath = rec?.confirmedPathId
                ? rec.paths.find((p) => p.pathId === rec.confirmedPathId)?.path
                : null;

              const completedTasks = user.taskProgress.filter((t) => t.status === "done").length;
              const inProgressTasks = user.taskProgress.filter((t) => t.status === "in_progress").length;
              const totalTasks = user.taskProgress.length;

              const hasQuiz = user.quizSubmissions.length > 0;
              const hasRec = !!rec && rec.status === "approved";
              const hasConfirmedPath = !!rec?.confirmedPathId;

              let status = "Purchased";
              let statusColor = "bg-gray-100 text-gray-600";
              if (completedTasks > 0 && completedTasks === totalTasks && totalTasks > 0) {
                status = "Phase 1 complete";
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

              const quizDate = user.quizSubmissions[0]?.submittedAt;

              return (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/${user.id}`} className="font-medium text-blair-midnight hover:underline">
                      {user.name || "-"}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{user.email}</td>
                  <td className="py-3 pr-4">
                    {confirmedPath ? (
                      <span className="text-gray-900">{confirmedPath.name}</span>
                    ) : primaryPath ? (
                      <span className="text-gray-500">{primaryPath.name}</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>{status}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "-"}
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-600">
                    {user.taskProgress.find((t) => t.status === "in_progress")?.task?.title || "-"}
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">
                    {formatDate(lastActive)}
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">
                    {quizDate ? formatDate(quizDate) : formatDate(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
