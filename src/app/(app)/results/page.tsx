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
    // Even without a published recommendation, show the scored advantage if available
    const profile = user.profile;
    return (
      <HoldingPage
        firstName={user.name?.split(" ")[0] ?? "there"}
        advantageName={profile?.unfairAdvantageName ?? undefined}
        advantageDescription={profile?.unfairAdvantageDescription ?? undefined}
      />
    );
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

    </main>
  );
}

function HoldingPage({
  firstName,
}: {
  firstName: string;
  advantageName?: string;
  advantageDescription?: string;
}) {
  return (
    <main className="min-h-screen bg-blair-linen">
      <div className="mx-auto max-w-lg px-6 pt-20 pb-20 sm:pt-28">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
            You did the hard part
          </p>
          <h1 className="mt-6 font-serif text-4xl text-blair-midnight sm:text-5xl">
            Ok {firstName}, we&apos;re on it.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-blair-charcoal/70">
            Right now we&apos;re reading every answer you gave us and building
            something that doesn&apos;t exist for anyone else: your plan.
            The business you should build, what to charge, who to sell to,
            and exactly how to start.
          </p>

          {/* What they're getting */}
          <div className="mt-10 space-y-4 text-left">
            <div className="rounded-2xl border border-blair-sage/20 bg-blair-sage/5 px-6 py-5">
              <p className="text-sm font-medium text-blair-midnight">
                Here&apos;s what&apos;s coming:
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-blair-charcoal/60">
                <li className="flex gap-2.5">
                  <span className="mt-0.5 text-blair-sage">&#10003;</span>
                  What your quiz answers revealed about where your real edge is
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 text-blair-sage">&#10003;</span>
                  A business path matched to your skills, your life, and your schedule
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 text-blair-sage">&#10003;</span>
                  Real pricing math: what this looks like as a side hustle and full-time
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 text-blair-sage">&#10003;</span>
                  A step-by-step playbook built around the hours you actually have
                </li>
              </ul>
            </div>
          </div>

          {/* Email notice */}
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-blair-mist bg-white px-6 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blair-sage/10">
              <svg className="h-5 w-5 text-blair-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-blair-midnight">We&apos;ll email you when it&apos;s ready</p>
              <p className="text-xs text-blair-charcoal/40">Usually less than 48 hours. Go be with your kids. (If you want to! Also fully support you if you need some me time.)</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
