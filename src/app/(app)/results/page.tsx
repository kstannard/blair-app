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
  advantageName,
  advantageDescription,
}: {
  firstName: string;
  advantageName?: string;
  advantageDescription?: string;
}) {
  const hasAdvantage = advantageName && advantageDescription;

  return (
    <main className="min-h-screen bg-blair-linen">
      <div className="mx-auto max-w-lg px-6 pt-20 pb-20 sm:pt-28">
        {/* Advantage reveal (instant value) */}
        {hasAdvantage ? (
          <>
            <p className="text-xs font-medium uppercase tracking-widest text-blair-sage text-center">
              While we build your plan
            </p>
            <h1 className="mt-6 font-serif text-4xl text-blair-midnight sm:text-5xl text-center">
              {firstName}, your unfair advantage is{" "}
              <span className="text-blair-sage">{advantageName}</span>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blair-charcoal/70 text-center">
              {advantageDescription}
            </p>

            {/* What's coming next */}
            <div className="mt-10 rounded-2xl border border-blair-sage/20 bg-blair-sage/5 px-6 py-5 text-center">
              <p className="text-sm font-medium text-blair-sage-dark">
                Now we&apos;re building the rest
              </p>
              <p className="mt-2 text-sm text-blair-charcoal/50">
                Your personalized business path, pricing guidance, and
                step-by-step playbook are being built around your advantage,
                your schedule, and your life. This usually takes less than 48 hours.
              </p>
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
                <p className="text-xs text-blair-charcoal/40">Your full plan, pricing math, and 30-day playbook are coming soon.</p>
              </div>
            </div>
          </>
        ) : (
          /* Fallback: no quiz submitted yet */
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
              Almost there
            </p>
            <h1 className="mt-6 font-serif text-4xl text-blair-midnight sm:text-5xl">
              We&apos;re building your plan, {firstName}.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blair-charcoal/70">
              We&apos;re reviewing your quiz answers and putting together a
              recommendation matched to your skills, your schedule, and your life.
              This usually takes less than 48 hours.
            </p>
            <p className="mt-4 text-sm text-blair-charcoal/40">
              We&apos;ll email you the moment it&apos;s ready.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-xl border border-blair-mist bg-white px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blair-sage/10">
                <svg className="h-5 w-5 text-blair-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-blair-midnight">Check your inbox</p>
                <p className="text-xs text-blair-charcoal/40">You&apos;ll get an email when your plan is ready to view.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
