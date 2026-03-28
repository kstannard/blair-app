import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const users = await prisma.user.findMany({
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
        orderBy: { updatedAt: "desc" },
      },
      quizSubmissions: {
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
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

              let status = "No playbook";
              let statusColor = "text-gray-400";
              if (completedTasks > 0 && completedTasks === totalTasks && totalTasks > 0) {
                status = "Phase complete";
                statusColor = "text-green-600";
              } else if (inProgressTasks > 0) {
                status = "In progress";
                statusColor = "text-blue-600";
              } else if (completedTasks > 0) {
                status = "In progress";
                statusColor = "text-blue-600";
              } else if (rec) {
                status = "Has results";
                statusColor = "text-amber-600";
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
                    <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "-"}
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
