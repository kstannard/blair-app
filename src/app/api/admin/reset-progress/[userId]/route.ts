import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/reset-progress/[userId]
 *
 * Resets a customer's playbook progress back to "pretend I didn't
 * touch anything" — the initial pre-populated state.
 *
 * Three modes via `?mode=`:
 *
 *   - `status-only` (default) — restores savedData to its initial
 *     pre-populated snapshot (`__initialState` field) if one exists,
 *     so user clicks, edits, deletions, and selections all revert
 *     to the drafted starting point. If no snapshot exists, falls
 *     back to deleting TaskProgress so the component re-auto-populates
 *     fresh on next load.
 *
 *   - `hard` — deletes every TaskProgress row. Customer starts with
 *     no pre-populated content at all (rarely what you want).
 *
 * Admin-only: behind the admin layout's password gate.
 */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "status-only";

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (mode === "hard") {
    const { count } = await prisma.taskProgress.deleteMany({ where: { userId } });
    return NextResponse.json({ ok: true, mode: "hard", deleted: count });
  }

  // Default: restore each TaskProgress from its __initialState snapshot.
  // If no snapshot exists, delete the row so the editor auto-populates
  // fresh on next load.
  const progressRecords = await prisma.taskProgress.findMany({
    where: { userId },
  });

  let restoredCount = 0;
  let deletedCount = 0;

  for (const progress of progressRecords) {
    const data = progress.savedData as Record<string, unknown> | null;
    const snapshot = data?.__initialState as Record<string, unknown> | undefined;

    if (snapshot && typeof snapshot === "object") {
      // Restore from snapshot. Preserve the snapshot itself so future
      // resets still work.
      await prisma.taskProgress.update({
        where: { id: progress.id },
        data: {
          status: "not_started",
          completedAt: null,
          savedData: { ...snapshot, __initialState: snapshot } as object,
        },
      });
      restoredCount++;
    } else {
      // No snapshot — delete the row. Component will re-auto-populate
      // on next load (for task types that support auto-population).
      await prisma.taskProgress.delete({ where: { id: progress.id } });
      deletedCount++;
    }
  }

  return NextResponse.json({
    ok: true,
    mode: "status-only",
    restored: restoredCount,
    deleted: deletedCount,
  });
}
