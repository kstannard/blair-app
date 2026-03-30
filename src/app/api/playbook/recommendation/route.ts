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

  // Fetch quiz answers for company size data
  const quizSubmission = await prisma.quizSubmission.findFirst({
    where: { userId: session.user.id },
    orderBy: { submittedAt: "desc" },
    select: { parsedAnswers: true },
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
    quizContext: (() => {
      if (!quizSubmission?.parsedAnswers) return null;
      try {
        const parsed = JSON.parse(quizSubmission.parsedAnswers);
        return {
          role: parsed.Q2_role || null,
          years: parsed.Q3_years || null,
          companySize: parsed.Q4_company_size || null,
          industries: parsed.Q5_industries || null,
          businessModels: parsed.Q6_business_models || null,
          shoulderTap: parsed.Q7_shoulder_tap || null,
          weirdlyGood: parsed.Q8_weirdly_good || null,
          managingComfort: parsed.Q9_managing || null,
          workMode: parsed.Q10_work_mode || null,
          energyDrains: parsed.Q11_energy_drains || null,
          sameOrDifferent: parsed.Q12_same_or_different || null,
          blocker: parsed.Q13_blocker || null,
          interests: parsed.Q14_interests || null,
          bestScenario: parsed.Q15_scenario || null,
          successGoal: parsed.Q16_success || null,
          whatToAvoid: parsed.Q17_avoid || null,
          incomeTimeline: parsed.Q18_income_timeline || null,
          zeroIncomeImpact: parsed.Q19_zero_income || null,
          liquidCapital: parsed.Q20_capital || null,
          borrowingComfort: parsed.Q21_borrowing || null,
          networkContacts: parsed.Q22_network || null,
          outreachComfort: parsed.Q23_outreach || null,
          publicVisibility: parsed.Q24_visibility || null,
          weeklyTime: parsed.Q25_time || null,
          workingConditions: parsed.Q26_conditions || null,
          kidsAges: parsed.Q27_kids_ages || null,
        };
      } catch {
        return null;
      }
    })(),
  });
}
