"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const ADVANTAGES = [
  {
    key: "networkDensity",
    name: "Network Density",
    oneLiner:
      "People already come to you for advice, intros, and recommendations. You just haven't charged for it.",
    detail:
      "The women who replaced their income fastest didn't build funnels or post content. They sent a few messages to people who already trusted them. One conversation became a project. That project became a referral. Within months, they had more work than they could take on.",
    moneyLine: "$8K-$15K/month working 15-25 hours a week",
    examples: [
      "A fractional CMO role with a startup founder you used to work with",
      "A $5K/month advisory retainer with someone who already trusts your judgment",
      "Three referral-driven projects from a single LinkedIn message",
    ],
    bgColor: "bg-[#E2ECE4]",
    textColor: "text-blair-midnight",
    ctaColor: "text-blair-sage-dark",
    decoColor: "rgba(30,80,50,0.05)",
  },
  {
    key: "patternLibrary",
    name: "Pattern Library",
    oneLiner:
      "You walk into a new company and already know what's going to break.",
    detail:
      "You've worked across enough places that you recognize problems before anyone finishes explaining them. While someone else needs months to figure out what's going on, you already know — because you've seen this exact movie before. That speed is worth a lot more than people realize.",
    moneyLine: "$10K-$15K per engagement, often completed in 4-6 weeks",
    examples: [
      "A $12K diagnostic sprint where you fix in 3 weeks what their team couldn't solve in 6 months",
      "A repeatable strategy engagement you can sell to every Series B company with the same scaling problem",
      "A productized framework you build once and resell across industries",
    ],
    bgColor: "bg-blair-midnight",
    textColor: "text-white",
    ctaColor: "text-white/50",
    decoColor: "rgba(255,255,255,0.05)",
  },
  {
    key: "translationAbility",
    name: "Translation Ability",
    oneLiner:
      "You're the one who rewrites the deck the night before and suddenly everything clicks.",
    detail:
      "You take something confusing and make it land. A muddled pitch, a product no one can describe, a strategy that only makes sense in the founder's head — you're the person who turns it into something people actually understand and want. That skill is undervalued in a salary and wildly valuable as a service.",
    moneyLine: "$5K-$12K per project, typically 15-20 hours of actual work",
    examples: [
      "A $8K messaging package for a SaaS company that can't explain what it does",
      "A launch narrative that helps a product stand out in a crowded market",
      "A brand strategy sprint that turns a founder's rambling pitch into a story customers actually repeat",
    ],
    bgColor: "bg-[#F3E1E8]",
    textColor: "text-blair-midnight",
    ctaColor: "text-blair-rose",
    decoColor: "rgba(184,74,107,0.06)",
  },
  {
    key: "systemsBrain",
    name: "Systems Brain",
    oneLiner:
      "You built the spreadsheet or automation nobody asked for. It changed everything.",
    detail:
      "You don't just fix things. You see why they broke and build something that won't break the same way again. What you build for one client becomes the template for the next. By your third engagement, you're delivering twice the value in half the time.",
    moneyLine: "$8K-$15K per engagement, with increasing efficiency each time",
    examples: [
      "A $10K operational overhaul for a 50-person company still running on spreadsheets and Slack threads",
      "A workflow redesign that saves a team 20 hours a week and becomes your template for the next client",
      "An automation buildout you scope in 2 weeks and deliver in 4, then sell again to 3 more companies",
    ],
    bgColor: "bg-blair-sage",
    textColor: "text-white",
    ctaColor: "text-white/50",
    decoColor: "rgba(255,255,255,0.07)",
  },
  {
    key: "closerInstinct",
    name: "Closer Instinct",
    oneLiner:
      "People call you persuasive. You just know what makes someone say yes.",
    detail:
      "Most people dread the selling part of running a business. You've been doing it your whole career without calling it that. You read rooms, build trust fast, and move a conversation from interest to commitment without it ever feeling like a pitch. The thing that scares everyone else about starting a business is the thing you're already great at.",
    moneyLine:
      "First paid engagement often closed within 2-4 weeks of deciding to start",
    examples: [
      "A growth engagement where you close $200K in pipeline for a company in your first month",
      "A BD partnership where you earn a percentage of every deal instead of billing hours",
      "An advisory relationship that started as a coffee chat and turned into a $6K/month retainer",
    ],
    bgColor: "bg-[#EDE6DD]",
    textColor: "text-blair-midnight",
    ctaColor: "text-blair-charcoal/40",
    decoColor: "rgba(80,60,30,0.05)",
  },
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedKey = searchParams.get("a");
  const advantage = ADVANTAGES.find((a) => a.key === selectedKey);

  const selectAdvantage = (key: string) => {
    router.push(`/discover?a=${key}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    router.push("/discover", { scroll: false });
  };

  // Detail view
  if (advantage) {
    const advIndex = ADVANTAGES.findIndex((a) => a.key === advantage.key);

    return (
      <div className="min-h-screen bg-blair-linen">
        {/* Colored hero banner */}
        <div className={cn("relative overflow-hidden", advantage.bgColor)}>
          <div className="px-6 pt-6 pb-2 sm:px-10">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-serif text-xl tracking-tight",
                  advantage.textColor
                )}
              >
                blair
              </span>
              <button
                onClick={goBack}
                className={cn(
                  "flex items-center gap-1 text-sm transition-colors",
                  advantage.ctaColor
                )}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>

          {/* Decorative number */}
          <span
            className="absolute -right-4 -bottom-8 font-serif text-[200px] leading-none select-none pointer-events-none"
            style={{ color: advantage.decoColor }}
          >
            {String(advIndex + 1).padStart(2, "0")}
          </span>

          <div className="mx-auto max-w-2xl px-6 pt-12 pb-14 sm:px-10 sm:pt-16 sm:pb-16 relative z-10 animate-in fade-in duration-500">
            <h1
              className={cn(
                "font-serif text-4xl sm:text-5xl",
                advantage.textColor
              )}
            >
              {advantage.name}
            </h1>
            <p className={cn("mt-5 text-lg", advantage.ctaColor)}>
              {advantage.oneLiner}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-10">
          {/* Why this matters */}
          <div
            className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <p className="text-base leading-relaxed text-blair-charcoal/70">
              {advantage.detail}
            </p>
          </div>

          {/* What people build */}
          <div
            className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            <h2 className="font-serif text-2xl text-blair-midnight">
              What people with this advantage build
            </h2>
            <div className="mt-5 space-y-3">
              {advantage.examples.map((example, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-blair-mist bg-white px-5 py-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blair-sage/10 text-sm font-semibold text-blair-sage">
                    {i + 1}
                  </div>
                  <p className="text-base leading-relaxed text-blair-charcoal/70 pt-1">
                    {example}
                  </p>
                </div>
              ))}
            </div>

            {/* Income highlight */}
            <div className="mt-5 rounded-2xl bg-blair-sage/10 border border-blair-sage/20 px-6 py-5">
              <p className="text-base font-medium text-blair-sage-dark">
                Typical range: {advantage.moneyLine}
              </p>
            </div>
          </div>

          {/* The pivot */}
          <div
            className="mt-14 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "600ms", animationFillMode: "both" }}
          >
            <h2 className="font-serif text-2xl text-blair-midnight">
              Now: which business should you build with this advantage?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blair-charcoal/60">
              Your unfair advantage tells you <em>why</em>{" "}you&apos;ll succeed. Blair tells you <em>what</em>{" "}to build, how to price it, and where to start. For $149, you get a plan built around who you are and the time you actually have.
            </p>
          </div>

          {/* Pricing card */}
          <div
            className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "800ms", animationFillMode: "both" }}
          >
            <div className="rounded-2xl border border-blair-midnight/10 bg-white p-8 sm:p-10 shadow-sm">
              <h2 className="font-serif text-2xl text-blair-midnight">
                Your personalized Blair plan
              </h2>

              <div className="mt-6 space-y-3">
                {[
                  "A deep-dive assessment that maps your skills and experience to the right business model",
                  "Your top business path, matched to your unfair advantage and the hours you actually have",
                  "Pricing guidance: what to charge, the side hustle math, and the full-time math",
                  "A step-by-step playbook to go from idea to first revenue",
                  "Built for moms. Every recommendation fits your real life, not a fantasy schedule",
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
                href="https://www.hiblair.com/store/p/blair-personalized-plan"
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
                    100% money-back guarantee
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-blair-charcoal/50">
                    If you don&apos;t walk away knowing exactly what to build and how to start, we&apos;ll refund your purchase in full. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal note */}
          <div
            className="mt-12 border-t border-blair-mist pt-10 animate-in fade-in duration-500"
            style={{ animationDelay: "1000ms", animationFillMode: "both" }}
          >
            <p className="text-sm leading-relaxed text-blair-charcoal/50">
              I&apos;m Kristin. Mom of 3, 15+ years in tech. I spent years stuck
              in the same place you might be right now, researching every side
              business imaginable and building nothing. If you have questions
              about whether this is right for you, I&apos;m happy to talk:{" "}
              <a
                href="mailto:kristin@hiblair.com"
                className="font-medium text-blair-sage-dark transition-colors hover:text-blair-sage"
              >
                kristin@hiblair.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Picker view
  return (
    <div className="min-h-screen bg-blair-linen">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-20 sm:px-10">
        {/* Hero */}
        <div className="pt-16 sm:pt-20 animate-in fade-in duration-700">
          <h1 className="font-serif text-4xl leading-tight text-blair-midnight sm:text-5xl max-w-3xl">
            You&apos;ve spent years getting really good at something.
            <br />
            <span className="text-blair-sage">
              That&apos;s your unfair advantage.
            </span>
          </h1>
          <p className="mt-6 text-lg text-blair-charcoal/50 max-w-2xl">
            Every successful business we&apos;ve seen starts with one thing the
            founder already does better than almost anyone. Pick the one that
            sounds like you.
          </p>
        </div>

        {/* Advantage cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADVANTAGES.map((adv, i) => (
            <button
              key={adv.key}
              onClick={() => selectAdvantage(adv.key)}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-7 sm:p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between",
                adv.bgColor,
                "animate-in fade-in slide-in-from-bottom-4 duration-500",
                i === ADVANTAGES.length - 1 &&
                  ADVANTAGES.length % 2 !== 0 &&
                  "sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]"
              )}
              style={{
                animationDelay: `${300 + i * 100}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Decorative number */}
              <span
                className="absolute -right-2 -top-4 font-serif text-[100px] leading-none select-none pointer-events-none"
                style={{ color: adv.decoColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3
                className={cn(
                  "font-serif text-xl leading-snug relative z-10 max-w-[85%] sm:text-[22px]",
                  adv.textColor
                )}
              >
                {adv.oneLiner}
              </h3>

              <p
                className={cn(
                  "mt-6 text-sm font-medium relative z-10 transition-all group-hover:translate-x-1",
                  adv.ctaColor
                )}
              >
                This is me &rarr;
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-blair-linen">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
