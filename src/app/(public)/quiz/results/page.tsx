"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const ADVANTAGE_CONTENT: Record<
  string,
  {
    why: string;
    moneyLine: string;
    examples: string[];
  }
> = {
  networkDensity: {
    why: "The women we talked to who replaced their income fastest didn't build funnels or post content. They sent a few messages to people who already trusted them. One conversation became a project. That project became a referral. Within months, they had more work than they could take on.",
    moneyLine: "$8K-$15K/month working 15-25 hours a week",
    examples: [
      "Fractional leadership for companies in your network",
      "Advisory retainers with founders who already know your name",
      "Referral-driven project work that compounds over time",
    ],
  },
  patternLibrary: {
    why: "You've worked across enough companies and contexts that you can walk into a new situation and see the problem before anyone finishes explaining it. That speed-to-diagnosis is what clients pay a premium for. Where someone else needs months of discovery, you need one conversation.",
    moneyLine: "$10K-$15K per engagement, often completed in 4-6 weeks",
    examples: [
      "Diagnostic sprints that solve in weeks what teams struggle with for months",
      "Strategy engagements where you're paid for pattern recognition, not hours",
      "Productized frameworks you can adapt and resell across clients",
    ],
  },
  translationAbility: {
    why: "You see what's actually going on and can explain it in a way that makes people act. That skill is wildly undervalued in a salaried role and wildly overvalued as an outside service. The gap between what companies pay for this in-house vs. what they'll pay a specialist is massive.",
    moneyLine: "$5K-$12K per project, typically 15-20 hours of actual work",
    examples: [
      "Positioning and messaging packages for companies that can't explain what they do",
      "Launch narratives for products entering crowded markets",
      "Brand strategy sprints that turn confusion into clarity",
    ],
  },
  systemsBrain: {
    why: "You don't just fix things. You see why they broke and build something that won't break the same way again. The work you do for one client becomes a template for the next. By your third engagement, you've essentially built a product that looks like high-end consulting.",
    moneyLine: "$8K-$15K per engagement, with increasing efficiency each time",
    examples: [
      "Operational overhauls for companies that have outgrown their starter systems",
      "Process design that lets small teams scale without hiring",
      "Automation and infrastructure buildouts sold as scoped sprints",
    ],
  },
  closerInstinct: {
    why: "Most people dread the selling part of running a business. You've been doing it your whole career without calling it that. You read rooms, build trust fast, and know how to move a conversation from interest to commitment without it ever feeling like a pitch.",
    moneyLine: "First paid engagement often closed within 2-4 weeks of deciding to start",
    examples: [
      "Revenue and growth engagements where your ability to close directly drives results",
      "Business development partnerships where you're compensated for deals, not hours",
      "Advisory work that converts naturally from conversations you're already having",
    ],
  },
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";
  const advantageName = searchParams.get("advantage") || "Your Advantage";
  const oneLiner = searchParams.get("oneLiner") || "";
  const advantageKey = searchParams.get("key") || "translationAbility";
  const role = searchParams.get("role") || "";
  const years = searchParams.get("years") || "";
  const kidsCount = searchParams.get("kids") || "0";

  const content =
    ADVANTAGE_CONTENT[advantageKey] || ADVANTAGE_CONTENT.translationAbility;

  // Build a short context line woven into the advantage
  const shortRole = role ? role.split(" / ")[0].split(" (")[0] : "";
  const kidsNum = parseInt(kidsCount) || 0;

  let contextClause = "";
  if (years && shortRole && kidsNum > 0) {
    contextClause = `With ${years} in ${shortRole} and ${kidsNum} ${kidsNum === 1 ? "kid" : "kids"}, you don't have time to figure this out by trial and error. You need a specific plan that fits your actual life.`;
  } else if (years && shortRole) {
    contextClause = `With ${years} in ${shortRole}, you've built exactly the kind of experience that translates into a real business.`;
  }

  return (
    <div className="min-h-screen bg-blair-linen">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-10">
        {/* Advantage reveal */}
        <div className="pt-12 sm:pt-16 animate-in fade-in duration-700">
          <p className="text-xs uppercase tracking-widest text-blair-charcoal/30">
            {name}, your unfair advantage is
          </p>
          <h1 className="mt-3 font-serif text-4xl text-blair-midnight sm:text-5xl animate-in fade-in zoom-in-95 duration-1000">
            {advantageName}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-blair-charcoal/60">
            {oneLiner}
          </p>
        </div>

        {/* Why this matters - woven with their context */}
        <div
          className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <p className="text-base leading-relaxed text-blair-charcoal/70">
            {content.why}
          </p>
          {contextClause && (
            <p className="mt-4 text-base font-medium leading-relaxed text-blair-midnight">
              {contextClause}
            </p>
          )}
        </div>

        {/* What this looks like - visual cards */}
        <div
          className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "700ms", animationFillMode: "both" }}
        >
          <h2 className="font-serif text-xl text-blair-midnight">
            What people with this advantage build
          </h2>
          <div className="mt-5 space-y-3">
            {content.examples.map((example, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-blair-mist bg-white px-5 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blair-sage/10 text-sm font-semibold text-blair-sage">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-blair-charcoal/70 pt-1">
                  {example}
                </p>
              </div>
            ))}
          </div>

          {/* Income highlight */}
          <div className="mt-5 rounded-xl bg-blair-sage/10 border border-blair-sage/20 px-5 py-4">
            <p className="text-sm font-medium text-blair-sage-dark">
              Typical range: {content.moneyLine}
            </p>
          </div>
        </div>

        {/* The pivot */}
        <div
          className="mt-14 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "900ms", animationFillMode: "both" }}
        >
          <h2 className="font-serif text-2xl text-blair-midnight">
            Now the question is: which business, exactly?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blair-charcoal/60">
            Your unfair advantage tells you <em>why</em> you&apos;ll succeed. Blair
            tells you <em>what</em> to build, <em>how</em> to price it, and exactly where
            to start. Personalized to your background, your time, and your goals.
          </p>
        </div>

        {/* Pricing card */}
        <div
          className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "1100ms", animationFillMode: "both" }}
        >
          <div className="rounded-2xl border border-blair-midnight/10 bg-white p-8 sm:p-10 shadow-sm">
            <h2 className="font-serif text-2xl text-blair-midnight">
              Your personalized Blair plan
            </h2>

            <div className="mt-6 space-y-3">
              {[
                "Your complete unfair advantage breakdown: what it means, where it showed up, and why it matters commercially",
                "Your top business path, matched to your skills, experience, time, and life",
                "Pricing guidance: what to charge, the side hustle math, and the full-time math",
                "A step-by-step playbook to go from idea to first paying client",
                "Built for moms. Every recommendation fits the hours you actually have",
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
            </div>

            <a
              href="https://www.hiblair.com/#pricing"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-blair-sage px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blair-sage-dark"
            >
              Get my personalized plan
            </a>

            {/* Guarantee */}
            <div className="mt-5 flex items-start gap-3 rounded-lg bg-blair-linen px-4 py-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blair-sage"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blair-midnight">
                  Clarity guarantee
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-blair-charcoal/50">
                  If you don&apos;t walk away knowing exactly what to build
                  and how to start, email me and I&apos;ll refund you. No
                  questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Already have an account */}
        <div className="mt-8 text-center">
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
