"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

// Per-advantage content grounded in real research interviews
const ADVANTAGE_CONTENT: Record<
  string,
  {
    insight: string;
    transformation: string;
    incomeProof: string;
  }
> = {
  networkDensity: {
    insight:
      "In our research, the women who replaced their income fastest all had one thing in common: they didn't need to find clients. Their clients already knew them. One fractional exec we interviewed landed her first engagement from a former boss she bumped into. Another sent 5 DMs to old colleagues and had 2 paid projects within a month. No cold outreach, no content strategy, no funnel. Just relationships they'd spent years building without realizing they were building a pipeline.",
    transformation:
      "You send a few messages to people who already trust your judgment. One conversation leads to a project. That project leads to a referral. Within 6 months, you're earning real income on your own terms, working hours that fit around your family, not the other way around.",
    incomeProof:
      "Women with this advantage who've made the leap are earning $8K-$15K/month working 15-25 hours a week. Some started while still in their full-time role, carving out 3-5 hours a week to get the first client locked in before making any big moves.",
  },
  patternLibrary: {
    insight:
      "In our research, the highest-earning independent consultants all shared something: they could walk into a room and diagnose the problem before anyone finished explaining it. They'd seen the same pattern break the same way at 4 different companies. That speed-to-insight is what clients pay a premium for. One woman we interviewed went from $0 to consistent five-figure months because her clients kept saying the same thing: \"How did you know that so fast?\"",
    transformation:
      "A company hires you for a 6-week engagement. In the first meeting, you identify the problem they've spent months circling. They're surprised. You're not. You deliver a solution faster than they expected, they pay you $10K-$15K, and you still make it home for bath time.",
    incomeProof:
      "Pattern Library consultants we've talked to charge 2-3x more than generalists doing similar work, because clients aren't paying for your hours. They're paying for the fact that you can see in one conversation what takes someone else three months to figure out.",
  },
  translationAbility: {
    insight:
      "In our research, we found that Translation Ability is one of the most underleveraged skills in the market. The gap between what companies pay for this skill in a salaried role vs. what they'll pay an outside expert is massive. One woman we interviewed runs positioning sprints for agencies and their clients. She spends about 20 hours on a project and charges $5K-$12K. The agency owner who referred her looks brilliant, the client finally has messaging that makes sense, and she's built a referral engine that runs itself.",
    transformation:
      "An agency owner or founder you know has a client whose messaging isn't landing. You come in, interview the key people, audit the current copy, and deliver a positioning package in two weeks. That's $8K and 20 hours of work. The referral comes naturally because you made everyone look good.",
    incomeProof:
      "Women with this advantage are running $5K-$12K positioning sprints that take 15-20 hours of actual work. At just 2 projects a quarter alongside a W2 job, that's $40K-$96K in additional annual income without working more than 5 extra hours a week.",
  },
  systemsBrain: {
    insight:
      "In our research, Systems Brain consultants had a unique advantage: the work they did for one client could be templated and adapted for the next. One woman built an operational playbook for a growing startup. It worked so well the founder referred her to a friend with the same problem. She adapted the same framework in half the time and charged the same price. By her third client, she had a repeatable product.",
    transformation:
      "You build an ops overhaul for one growing company. The framework works, so you adapt it for the next. By your third engagement, you're spending half the hours and charging the same rate. You've essentially built a product, but it looks like high-end consulting.",
    incomeProof:
      "Systems-oriented consultants we interviewed are charging $8K-$15K for scoped 4-8 week engagements. The ones who productized their approach are working 10-15 hours a week and earning more per hour than their W2 ever paid.",
  },
  closerInstinct: {
    insight:
      "In our research, the women with Closer Instinct had the shortest path from \"I'm thinking about it\" to \"I have a paying client.\" One woman we talked to described it perfectly: she had coffee with a former colleague, asked good questions, listened, and by the end of the conversation, her colleague was describing a problem. She didn't pitch. She just said, \"I could help with that.\" She scoped a $12K engagement that week. No website, no brand, no content. Just a conversation she was naturally good at.",
    transformation:
      "You reach out to 3 people you used to work with. Over coffee or a Zoom, you listen. One of them describes a problem that lights you up. You scope a solution, name a price, and start. No cold outreach, no content calendar, no waiting for permission. Just a skill you've been using your entire career, now pointed at your own business.",
    incomeProof:
      "Women with this advantage who've made the transition report closing their first engagement within 2-4 weeks of deciding to start. The ones doing it alongside their day job are adding $5K-$15K/month in consulting income working evenings and weekends.",
  },
};

function getKidsLine(kidsCount: string, youngest: string): string {
  if (kidsCount === "0" || !kidsCount) return "";
  const count = parseInt(kidsCount);
  const kidWord = count === 1 ? "kid" : "kids";

  if (youngest === "0-2") {
    return `with ${count} ${kidWord} (including a baby)`;
  } else if (youngest === "3-5") {
    return `with ${count} little ${kidWord}`;
  } else if (youngest === "6-8") {
    return `with ${count} ${kidWord} in elementary school`;
  } else if (youngest === "9+") {
    return `with ${count} ${kidWord}`;
  }
  return `with ${count} ${kidWord}`;
}

function getYearsLine(years: string): string {
  if (years === "15+ years") return "15+ years of experience";
  if (years === "10-14 years") return "over a decade of experience";
  if (years === "6-9 years") return "nearly a decade of experience";
  return "years of experience";
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";
  const advantageName = searchParams.get("advantage") || "Your Advantage";
  const oneLiner = searchParams.get("oneLiner") || "";
  const advantageKey = searchParams.get("key") || "translationAbility";
  const role = searchParams.get("role") || "";
  const years = searchParams.get("years") || "";
  const kidsCount = searchParams.get("kids") || "0";
  const youngest = searchParams.get("youngest") || "";

  const content =
    ADVANTAGE_CONTENT[advantageKey] || ADVANTAGE_CONTENT.translationAbility;
  const kidsLine = getKidsLine(kidsCount, youngest);
  const yearsLine = getYearsLine(years);

  // Build personalized intro
  let personalIntro = `${name}, you have ${yearsLine}`;
  if (role) {
    const shortRole = role.split(" / ")[0].split(" (")[0];
    personalIntro += ` in ${shortRole}`;
  }
  if (kidsLine) {
    personalIntro += `, ${kidsLine}`;
  }
  personalIntro +=
    ". Most career advice ignores all of that context. Blair doesn't.";

  return (
    <div className="min-h-screen bg-blair-linen">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
      </div>

      {/* Result */}
      <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-10">
        {/* Reveal */}
        <div className="pt-12 sm:pt-20 animate-in fade-in duration-700">
          <p className="text-base text-blair-charcoal/60">{personalIntro}</p>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-blair-charcoal/30">
              Your unfair advantage
            </p>
            <h1 className="mt-3 font-serif text-4xl text-blair-midnight sm:text-5xl animate-in fade-in zoom-in-95 duration-1000">
              {advantageName}
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-blair-charcoal/70">
              {oneLiner}
            </p>
          </div>
        </div>

        {/* Research insight */}
        <div
          className="mt-14 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <p className="text-base leading-relaxed text-blair-charcoal/70">
            {content.insight}
          </p>
        </div>

        {/* Transformation */}
        <div
          className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "700ms", animationFillMode: "both" }}
        >
          <h2 className="font-serif text-2xl text-blair-midnight">
            What this could look like for you
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blair-charcoal/70">
            {content.transformation}
          </p>
        </div>

        {/* Income proof */}
        <div
          className="mt-10 rounded-2xl border border-blair-sage/20 bg-blair-sage/5 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "900ms", animationFillMode: "both" }}
        >
          <p className="text-base leading-relaxed text-blair-charcoal/80">
            {content.incomeProof}
          </p>
        </div>

        {/* The ask */}
        <div
          className="mt-14 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "1100ms", animationFillMode: "both" }}
        >
          <h2 className="font-serif text-2xl text-blair-midnight">
            The question isn&apos;t whether you can do this
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blair-charcoal/70">
            It&apos;s which specific business to build, how to price it, and where
            to start. That&apos;s what Blair figures out for you. Based on your
            actual background, your available time, your risk tolerance, and
            your goals. Not generic advice. A specific plan.
          </p>
        </div>

        {/* Pricing card */}
        <div
          className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "1300ms", animationFillMode: "both" }}
        >
          <div className="rounded-2xl border border-blair-midnight/10 bg-white p-8 sm:p-10 shadow-sm">
            <h2 className="font-serif text-2xl text-blair-midnight">
              Your personalized Blair plan
            </h2>

            <div className="mt-6 space-y-3">
              {[
                "Your complete unfair advantage breakdown: what it means, where it showed up in your answers, and why it matters commercially",
                "Your top business path, personally matched to your skills, experience, time, and life constraints",
                "Pricing guidance: what to charge, the side hustle math, and the full-time math",
                "A step-by-step playbook to go from \"I think I want to do this\" to your first paying client",
                "Built specifically for working moms. Every recommendation accounts for the hours you actually have, not the hours you wish you had",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-blair-sage"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <p className="text-sm leading-relaxed text-blair-charcoal/70">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex items-end gap-3">
                <span className="font-serif text-4xl text-blair-midnight">
                  $149
                </span>
                <span className="mb-1 text-base text-blair-charcoal/30 line-through">
                  $297
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-blair-sage-dark">
                Founding member pricing
              </p>
              <p className="mt-0.5 text-xs text-blair-charcoal/40">
                Limited spots. Price goes up once we close this round.
              </p>
            </div>

            <a
              href="https://www.hiblair.com/#pricing"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-blair-sage px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blair-sage-dark"
            >
              Get my personalized plan
            </a>

            <p className="mt-4 text-center text-xs text-blair-charcoal/30">
              One-time purchase. No subscription. Your plan is ready within 48 hours.
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div
          className="mt-10 text-center animate-in fade-in duration-700"
          style={{ animationDelay: "1500ms", animationFillMode: "both" }}
        >
          <p className="text-sm leading-relaxed text-blair-charcoal/40">
            Built from research with women who&apos;ve actually made this
            transition: fractional execs, independent consultants, and founders
            who built real businesses while raising young kids.
          </p>
        </div>

        {/* Already have an account */}
        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="text-sm text-blair-charcoal/30 transition-colors hover:text-blair-charcoal/50"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-blair-linen">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
