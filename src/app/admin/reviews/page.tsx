import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const submissions = await prisma.quizSubmission.findMany({
    where: { status: "pending_review" },
    include: {
      user: {
        include: {
          recommendations: { take: 1 },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const allSubmissions = await prisma.quizSubmission.findMany({
    include: {
      user: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pending Reviews</h1>
      <p className="mt-1 text-sm text-gray-500">
        New quiz submissions waiting for your review and scoring.
      </p>

      {submissions.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center">
          <p className="text-sm text-gray-500">No pending reviews right now.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {sub.user.name || sub.user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {sub.user.email} - Submitted{" "}
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {sub.user.recommendations.length > 0 ? (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Has recommendation
                  </span>
                ) : (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    Needs scoring
                  </span>
                )}
                <Link
                  href={`/admin/${sub.userId}`}
                  className="rounded bg-blair-midnight px-3 py-1.5 text-xs font-medium text-white hover:bg-blair-charcoal"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All submissions */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          All Submissions ({allSubmissions.length})
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Submitted</th>
                <th className="pb-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {allSubmissions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-900">{sub.user.name || "-"}</td>
                  <td className="py-3 pr-4 text-gray-600">{sub.user.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                      sub.status === "pending_review"
                        ? "bg-amber-100 text-amber-700"
                        : sub.status === "scored"
                        ? "bg-blue-100 text-blue-700"
                        : sub.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/${sub.userId}`}
                      className="text-xs text-blair-sage hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
