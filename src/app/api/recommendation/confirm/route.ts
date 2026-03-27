import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { pathSlug } = body;

  if (!pathSlug) {
    return NextResponse.json(
      { error: "pathSlug is required" },
      { status: 400 }
    );
  }

  // Find the path by slug
  const path = await prisma.businessPath.findUnique({
    where: { slug: pathSlug },
  });

  if (!path) {
    return NextResponse.json({ error: "Path not found" }, { status: 404 });
  }

  // Find the user's recommendation
  const recommendation = await prisma.recommendation.findFirst({
    where: { userId: session.user.id, status: "approved" },
    orderBy: { createdAt: "desc" },
  });

  if (!recommendation) {
    return NextResponse.json(
      { error: "No recommendation found" },
      { status: 404 }
    );
  }

  // Update with confirmed path
  await prisma.recommendation.update({
    where: { id: recommendation.id },
    data: { confirmedPathId: path.id },
  });

  return NextResponse.json({ success: true, confirmedPathId: path.id });
}
