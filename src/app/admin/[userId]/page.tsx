import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import DraftReviewSection from "@/components/admin/DraftReviewSection";
import { TYPEFORM_FIELD_MAP } from "@/lib/typeform-fields";

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

  // Parse key quiz answers for quick display
  // answers stored as { [fieldRef]: rawStringValue }
  const quizSnapshot: Record<string, string> = {};
  const latestQuiz = user.quizSubmissions[0];
  if (latestQuiz?.answers) {
    try {
      const raw = JSON.parse(latestQuiz.answers) as Record<string, string>;
      for (const [ref, mapping] of Object.entries(TYPEFORM_FIELD_MAP)) {
        if (raw[ref]) quizSnapshot[mapping.quizKey] = raw[ref];
      }
    } catch { /* skip */ }
  }

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
      {(user.profile || Object.keys(quizSnapshot).length > 0) && (
        <Section title="Profile">
          {/* Quick stats from quiz */}
          {Object.keys(quizSnapshot).length > 0 && (
            <div className="mb-5 flex flex-wrap gap-3">
              {quizSnapshot.Q2_role && <Stat label="Role" value={quizSnapshot.Q2_role} />}
              {quizSnapshot.Q3_years && <Stat label="Experience" value={quizSnapshot.Q3_years} />}
              {quizSnapshot.Q25_time && <Stat label="Hours/week" value={quizSnapshot.Q25_time} />}
              {quizSnapshot.Q18_income_timeline && <Stat label="Income timeline" value={quizSnapshot.Q18_income_timeline} />}
              {quizSnapshot.Q27_kids_ages && <Stat label="Kids" value={quizSnapshot.Q27_kids_ages} />}
              {quizSnapshot.Q13_blocker && <Stat label="Main blocker" value={quizSnapshot.Q13_blocker} />}
              {quizSnapshot.Q28_linkedin && (
                <Stat label="LinkedIn" value={
                  <a href={quizSnapshot.Q28_linkedin.startsWith("http") ? quizSnapshot.Q28_linkedin : `https://${quizSnapshot.Q28_linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px] block">
                    {quizSnapshot.Q28_linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                  </a>
                } />
              )}
            </div>
          )}

          {user.profile && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Unfair Advantage" value={user.profile.unfairAdvantageName} />
                <Field label="Summary" value={user.profile.summary} />
                <JsonListField label="Traits" value={user.profile.traits} />
                <JsonListField label="Strengths" value={user.profile.strengths} />
                <JsonListField label="Constraints" value={user.profile.constraints} />
              </div>
              {user.profile.unfairAdvantageEvidence && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">Scoring evidence</p>
                  <p className="mt-1 text-sm text-gray-700">{user.profile.unfairAdvantageEvidence}</p>
                </div>
              )}
            </>
          )}
        </Section>
      )}

      {/* Recommendations */}
      {rec && (
        <Section title={rec.status === "draft" ? "Recommendation — needs review" : "Recommendation"}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-blair-sage/10 px-2 py-1 text-xs font-medium text-blair-sage-dark">Primary</span>
              <span className="text-sm font-medium text-gray-900">{primaryPath?.name}</span>
              {rec.status === "approved" && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Approved</span>
              )}
              {rec.status === "draft" && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Draft</span>
              )}
              {confirmedPath && confirmedPath.id === primaryPath?.id && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">User confirmed</span>
              )}
            </div>
            {alt1 && (
              <div className="flex items-center gap-2">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Alt 1</span>
                <span className="text-sm text-gray-700">{alt1.name}</span>
                {confirmedPath && confirmedPath.id === alt1.id && (
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">User confirmed</span>
                )}
              </div>
            )}
            {alt2 && (
              <div className="flex items-center gap-2">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Alt 2</span>
                <span className="text-sm text-gray-700">{alt2.name}</span>
                {confirmedPath && confirmedPath.id === alt2.id && (
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">User confirmed</span>
                )}
              </div>
            )}
          </div>

          <DraftReviewSection
            recId={rec.id}
            status={rec.status}
            initialData={{
              personalIntro: rec.personalIntro,
              personalizedWhy: rec.personalizedWhy,
              pricingDetails: rec.pricingDetails,
            }}
          />
        </Section>
      )}

      {/* Playbook Progress */}
      {user.taskProgress.length > 0 && (() => {
        // Group tasks by phase
        const phases = new Map<string, { name: string; tasks: typeof user.taskProgress }>();
        for (const tp of user.taskProgress) {
          const phaseName = tp.task.phase.name;
          if (!phases.has(phaseName)) phases.set(phaseName, { name: phaseName, tasks: [] });
          phases.get(phaseName)!.tasks.push(tp);
        }
        const doneCount = user.taskProgress.filter((t) => t.status === "done").length;
        const totalCount = user.taskProgress.length;

        return (
          <Section title={`Playbook Progress (${doneCount}/${totalCount} tasks)`}>
            <div className="space-y-6">
              {Array.from(phases.values()).map((phase) => {
                const phaseDone = phase.tasks.filter((t) => t.status === "done").length;
                return (
                  <div key={phase.name}>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{phase.name}</p>
                      <span className="text-xs text-gray-300">{phaseDone}/{phase.tasks.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {phase.tasks.map((tp) => (
                        <div key={tp.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2.5">
                          <p className="text-sm text-gray-800">{tp.task.title}</p>
                          <StatusBadge status={tp.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })()}

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

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-gray-800">{value}</div>
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

function JsonListField({ label, value }: { label: string; value: string | null | undefined }) {
  let items: string[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    items = Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    items = value ? [value] : [];
  }
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {items.length > 0 ? (
        <ul className="mt-0.5 space-y-0.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-800">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-0.5 text-sm text-gray-800">-</p>
      )}
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
