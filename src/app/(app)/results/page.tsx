import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResultsHero } from "@/components/results/ResultsHero";
import { PersonalLetter } from "@/components/results/PersonalLetter";
import { UnfairAdvantage } from "@/components/results/UnfairAdvantage";
import { PrimaryRecommendation } from "@/components/results/PrimaryRecommendation";
import { PricingAndMath } from "@/components/results/PricingAndMath";
import { FounderVideoEmbed } from "@/components/results/FounderVideoEmbed";
import { ResultsPathChooser } from "@/components/results/ResultsPathChooser";
import { ResultsReveal } from "@/components/results/ResultsReveal";
import { ShareSection } from "@/components/results/ShareSection";

export const metadata = {
  title: "Your Results - Blair",
};

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) {
    redirect("/signin");
  }

  const recommendation = await prisma.recommendation.findFirst({
    where: { userId: user.id, status: "approved" },
    include: {
      paths: {
        include: { path: true },
        orderBy: { rank: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!recommendation) {
    return <HoldingPage firstName={user.name?.split(" ")[0] ?? "there"} />;
  }

  // Find the primary path from the recommendation paths
  const primaryRecPath = recommendation.paths.find(
    (p) => p.pathId === recommendation.primaryPathId
  );
  const secondaryPaths = recommendation.paths.filter(
    (p) => p.pathId !== recommendation.primaryPathId
  );

  // Parse JSON fields
  const pricingDetails = recommendation.pricingDetails
    ? JSON.parse(recommendation.pricingDetails)
    : null;

  // Fetch founder video - prefer one for the primary path, fall back to general
  const founderVideo = await prisma.founderVideo.findFirst({
    where: {
      OR: [
        { pathId: recommendation.primaryPathId },
        { pathId: null },
      ],
    },
    orderBy: { pathId: "desc" }, // path-specific first (non-null sorts after null)
  });

  const firstName = user.name?.split(" ")[0] ?? "there";
  const profile = user.profile;

  return (
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

      <ShareSection />
    </main>
  );
}

function HoldingPage({ firstName }: { firstName: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blair-linen">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
          Blair Recommendation
        </p>
        <h1 className="mt-6 font-serif text-4xl text-blair-midnight sm:text-5xl">
          Hang tight, {firstName}.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-blair-charcoal">
          Your personalized recommendation is being prepared. We&rsquo;ll
          let you know as soon as it&rsquo;s ready.
        </p>
      </div>
    </main>
  );
}
