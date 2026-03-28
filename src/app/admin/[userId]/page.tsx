import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      },
      taskProgress: {
        include: { task: { include: { phase: true } } },
        orderBy: { updatedAt: "desc" },
      },
      quizSubmissions: {
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  const rec = user.recommendations[0];
  const primaryPath = rec?.paths.find((p) => p.rank === 1)?.path;
  const alt1 = rec?.paths.find((p) => p.rank === 2)?.path;
  const alt2 = rec?.paths.find((p) => p.rank === 3)?.path;
  const confirmedPath = rec?.confirmedPathId
    ? rec.paths.find((p) => p.pathId === rec.confirmedPathId)?.path
    : null;

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; All customers
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name || user.email}</h1>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
          {user.referralCode && <p>Referral: {user.referralCode}</p>}
        </div>
      </div>

      {/* Profile */}
      {user.profile && (
        <Section title="Profile">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unfair Advantage" value={user.profile.unfairAdvantageName} />
            <Field label="Summary" value={user.profile.summary} />
            <Field label="Traits" value={user.profile.traits} />
            <Field label="Strengths" value={user.profile.strengths} />
            <Field label="Constraints" value={user.profile.constraints} />
          </div>
          {user.profile.unfairAdvantageEvidence && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 uppercase">Evidence</p>
              <p className="mt-1 text-sm text-gray-700">{user.profile.unfairAdvantageEvidence}</p>
            </div>
          )}
        </Section>
      )}

      {/* Recommendations */}
      {rec && (
        <Section title="Recommendations">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-blair-sage/10 px-2 py-1 text-xs font-medium text-blair-sage-dark">Primary</span>
              <span className="text-sm font-medium text-gray-900">{primaryPath?.name}</span>
              {confirmedPath && confirmedPath.id === primaryPath?.id && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Confirmed</span>
              )}
            </div>
            {alt1 && (
              <div className="flex items-center gap-2">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Alt 1</span>
                <span className="text-sm text-gray-700">{alt1.name}</span>
                {confirmedPath && confirmedPath.id === alt1.id && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Confirmed</span>
                )}
              </div>
            )}
            {alt2 && (
              <div className="flex items-center gap-2">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Alt 2</span>
                <span className="text-sm text-gray-700">{alt2.name}</span>
                {confirmedPath && confirmedPath.id === alt2.id && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Confirmed</span>
                )}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Playbook Progress */}
      {user.taskProgress.length > 0 && (
        <Section title="Playbook Progress">
          <div className="space-y-2">
            {user.taskProgress.map((tp) => (
              <div key={tp.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tp.task.title}</p>
                  <p className="text-xs text-gray-400">Phase: {tp.task.phase.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={tp.status} />
                  <span className="text-xs text-gray-400">
                    {new Date(tp.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Quiz Answers */}
      {user.quizSubmissions.length > 0 && (
        <Section title="Quiz Answers">
          {user.quizSubmissions.map((sub) => {
            let parsed: Record<string, unknown> = {};
            try {
              parsed = JSON.parse(sub.answers || "{}");
            } catch { /* skip */ }

            return (
              <div key={sub.id} className="space-y-2">
                <p className="text-xs text-gray-400">
                  Submitted {new Date(sub.submittedAt).toLocaleString()} - Status: {sub.status}
                </p>
                <div className="space-y-2">
                  {Object.entries(parsed).map(([key, val]) => {
                    const v = val as { question?: string; answer?: string };
                    return (
                      <div key={key} className="rounded border border-gray-50 bg-gray-50 px-3 py-2">
                        <p className="text-xs font-medium text-gray-500">
                          {v?.question || key}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-800">
                          {v?.answer || String(val)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-gray-800">{value || "-"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    done: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    not_started: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    done: "Done",
    in_progress: "In progress",
    not_started: "Not started",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[status] || styles.not_started}`}>
      {labels[status] || status}
    </span>
  );
}
