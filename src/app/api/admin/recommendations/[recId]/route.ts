import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PATCH — save edits to draft content
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ recId: string }> }
) {
  const { recId } = await params;
  const body = await req.json();

  const { personalIntro, personalizedWhy, pricingDetails, transitionPlan, closingNote } = body;

  const rec = await prisma.recommendation.findUnique({ where: { id: recId } });
  if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.recommendation.update({
    where: { id: recId },
    data: {
      ...(personalIntro !== undefined && { personalIntro }),
      ...(personalizedWhy !== undefined && { personalizedWhy }),
      ...(pricingDetails !== undefined && { pricingDetails }),
      ...(transitionPlan !== undefined && { transitionPlan }),
      ...(closingNote !== undefined && { closingNote }),
    },
  });

  return NextResponse.json({ ok: true, rec: updated });
}

// POST — approve draft (set status to approved)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ recId: string }> }
) {
  const { recId } = await params;
  const body = await req.json();

  if (body.action !== "approve") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const rec = await prisma.recommendation.findUnique({ where: { id: recId } });
  if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.recommendation.update({
    where: { id: recId },
    data: { status: "approved" },
  });

  return NextResponse.json({ ok: true, rec: updated });
}
