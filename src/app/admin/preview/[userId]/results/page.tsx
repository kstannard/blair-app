import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ResultsHero } from "@/components/results/ResultsHero";
import { PersonalLetter } from "@/components/results/PersonalLetter";
import { UnfairAdvantage } from "@/components/results/UnfairAdvantage";
import { PrimaryRecommendation } from "@/components/results/PrimaryRecommendation";
import { PricingAndMath } from "@/components/results/PricingAndMath";
import { FounderVideoEmbed } from "@/components/results/FounderVideoEmbed";
import { ResultsPathChooser } from "@/components/results/ResultsPathChooser";
import { ResultsReveal } from "@/components/results/ResultsReveal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPreviewResultsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) notFound();

  const recommendation = await prisma.recommendation.findFirst({
    where: { userId, status: "approved" },
    include: {
      paths: {
        include: { path: true },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!recommendation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blair-linen">
        <div className="text-center">
          <p className="text-sm text-gray-500">No approved recommendation for this user.</p>
          <Link href={`/admin/${userId}`} className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            &larr; Back to admin
          </Link>
        </div>
      </div>
    );
  }

  const primaryRecPath = recommendation.paths.find(
    (p) => p.pathId === recommendation.primaryPathId
  );
  const secondaryPaths = recommendation.paths.filter(
    (p) => p.pathId !== recommendation.primaryPathId
  );

  const pricingDetails = recommendation.pricingDetails
    ? JSON.parse(recommendation.pricingDetails)
    : null;

  const founderVideo = await prisma.founderVideo.findFirst({
    where: {
      OR: [
        { pathId: recommendation.primaryPathId },
        { pathId: null },
      ],
    },
    orderBy: { pathId: "desc" },
  });

  const firstName = user.name?.split(" ")[0] ?? "there";
  const profile = user.profile;

  return (
    <div>
      {/* Admin preview banner */}
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center">
        <span className="text-xs font-medium text-amber-800">
          Admin preview: {user.name || user.email}
        </span>
        <span className="mx-2 text-amber-300">|</span>
        <Link href={`/admin/preview/${userId}/playbook`} className="text-xs text-amber-700 hover:underline">
          Playbook
        </Link>
        <span className="mx-2 text-amber-300">|</span>
        <Link href={`/admin/${userId}`} className="text-xs text-amber-700 hover:underline">
          Back to admin
        </Link>
      </div>

      <main className="min-h-screen bg-blair-linen">
        <ResultsHero />

        {recommendation.personalIntro && (
          <PersonalLetter
            firstName={firstName}
            personalIntro={recommendation.personalIntro}
          />
        )}

        <ResultsReveal>
          {profile?.unfairAdvantageName &&
            profile.unfairAdvantageDescription &&
            profile.unfairAdvantageEvidence &&
            profile.unfairAdvantageWhy && (
              <UnfairAdvantage
                name={profile.unfairAdvantageName}
                description={profile.unfairAdvantageDescription}
                evidence={profile.unfairAdvantageEvidence}
                why={profile.unfairAdvantageWhy}
              />
            )}

          {primaryRecPath && recommendation.personalizedWhy && (
            <PrimaryRecommendation
              pathName={primaryRecPath.path.name}
              personalizedWhy={recommendation.personalizedWhy}
            />
          )}

          {pricingDetails && <PricingAndMath pricingDetails={pricingDetails} />}

          {primaryRecPath && (
            <ResultsPathChooser
              primaryPath={{
                slug: primaryRecPath.path.slug,
                name: primaryRecPath.path.name,
              }}
              secondaryPaths={secondaryPaths.map((sp) => ({
                pathSlug: sp.path.slug,
                pathName: sp.path.name,
                altDescription: sp.altDescription,
                altWhyConsider: sp.altWhyConsider,
                altTradeoff: sp.altTradeoff,
                altRevenueRange: sp.altRevenueRange,
              }))}
              founderVideoSlot={
                founderVideo ? (
                  <FounderVideoEmbed
                    youtubeUrl={founderVideo.youtubeUrl}
                    title={founderVideo.title}
                  />
                ) : undefined
              }
            />
          )}
        </ResultsReveal>
      </main>
    </div>
  );
}
