import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recommendation = await prisma.recommendation.findFirst({
    where: { userId: session.user.id, status: "approved" },
    include: {
      paths: {
        include: { path: true },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch user profile for pre-population data
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!recommendation) {
    return NextResponse.json({
      id: null,
      primaryPath: null,
      secondaryPaths: [],
      confirmedPathId: null,
      personalIntro: null,
      personalizedWhy: null,
      userProfile: null,
    });
  }

  const primaryRecPath = recommendation.paths.find(
    (p) => p.pathId === recommendation.primaryPathId
  );
  const secondaryRecPaths = recommendation.paths.filter(
    (p) => p.pathId !== recommendation.primaryPathId
  );

  return NextResponse.json({
    id: recommendation.id,
    confirmedPathId: recommendation.confirmedPathId,
    personalIntro: recommendation.personalIntro || null,
    personalizedWhy: recommendation.personalizedWhy || null,
    primaryPath: primaryRecPath
      ? {
          slug: primaryRecPath.path.slug,
          name: primaryRecPath.path.name,
          description: primaryRecPath.path.description,
          incomeRangeLow: primaryRecPath.path.incomeRangeLow,
          incomeRangeHigh: primaryRecPath.path.incomeRangeHigh,
        }
      : null,
    secondaryPaths: secondaryRecPaths.map((sp) => ({
      slug: sp.path.slug,
      name: sp.path.name,
      description: sp.path.description,
      incomeRangeLow: sp.path.incomeRangeLow,
      incomeRangeHigh: sp.path.incomeRangeHigh,
      altDescription: sp.altDescription,
      altWhyConsider: sp.altWhyConsider,
      altTradeoff: sp.altTradeoff,
    })),
    userProfile: userProfile
      ? {
          traits: userProfile.traits,
          strengths: userProfile.strengths,
          summary: userProfile.summary,
          unfairAdvantageEvidence: userProfile.unfairAdvantageEvidence,
          unfairAdvantageDescription: userProfile.unfairAdvantageDescription,
          linkedinSummary: userProfile.linkedinSummary,
          notableExperience: userProfile.notableExperience,
        }
      : null,
  });
}
