import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/reset-progress/[userId]
 *
 * Resets a customer's playbook progress. Two modes, selected via the
 * `?mode=` query param:
 *
 *   - `status-only` (default) — resets every TaskProgress row's status to
 *     'not_started' and clears completedAt, but PRESERVES savedData. Use
 *     this after logging in as the customer to test their experience:
 *     when they actually log in, they'll see the pre-populated content
 *     back at "not started" without having lost any of the personalization
 *     we wrote for them.
 *
 *   - `hard` — deletes every TaskProgress row entirely. Use this if you
 *     want the customer to start fully fresh with no pre-populated content
 *     at all (rare; usually not what you want).
 *
 * Admin-only: this route is behind the admin layout's password gate, same
 * as the other /api/admin/* routes.
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

  // Default: status-only reset. Preserves savedData.
  const { count } = await prisma.taskProgress.updateMany({
    where: { userId },
    data: {
      status: "not_started",
      completedAt: null,
    },
  });
  return NextResponse.json({ ok: true, mode: "status-only", reset: count });
}
