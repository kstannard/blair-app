"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ADVANTAGES = [
  {
    key: "networkDensity",
    name: "Network Density",
    oneLiner: "You already know the people who would pay you.",
    hook: "People come to you for intros, advice, and referrals. Your DMs are full of \"can I pick your brain?\" You've spent years building relationships without realizing you were building a client list.",
    detail:
      "The women we talked to who replaced their income fastest didn't build funnels or post content. They sent a few messages to people who already trusted them. One conversation became a project. That project became a referral. Within months, they had more work than they could take on.",
    sharpPOV:
      "If you have this advantage, most business advice is wrong for you. You don't need to build an audience. You don't need a content strategy. You need to monetize the network you already have. The fastest path isn't visibility. It's one conversation with someone who already trusts you.",
    moneyLine: "$8K-$15K/month working 15-25 hours a week",
    examples: [
      "A fractional CMO role with a startup founder you used to work with",
      "A $5K/month advisory retainer with someone who already trusts your judgment",
      "Three referral-driven projects from a single LinkedIn message",
    ],
  },
  {
    key: "patternLibrary",
    name: "Pattern Library",
    oneLiner:
      "You've seen this problem break the same way at enough companies that you can diagnose it in one conversation.",
    hook: "You walk into meetings and already know what's wrong. While everyone else is still figuring out the problem, you're already ahead because you've seen this exact movie before.",
    detail:
      "You've worked across enough environments that you recognize problems before anyone finishes explaining them. Where someone else needs months to figure out what's going on, you walk in and just know. This isn't just experience. It's experience across enough different contexts that the patterns become obvious.",
    sharpPOV:
      "If you have this advantage, you should not be selling hours. You should be selling speed. Companies will pay a massive premium for someone who can diagnose in one conversation what takes their internal team months. Your first engagement should be a diagnostic sprint, not a retainer.",
    moneyLine: "$10K-$15K per engagement, often completed in 4-6 weeks",
    examples: [
      "A $12K diagnostic sprint where you fix in 3 weeks what their team couldn't solve in 6 months",
      "A repeatable strategy engagement you can sell to every Series B company with the same scaling problem",
      "A productized framework you build once and resell across industries",
    ],
  },
  {
    key: "translationAbility",
    name: "Translation Ability",
    oneLiner:
      "You make the complicated clear, the muddled compelling, and the invisible sellable.",
    hook: "People constantly say you have a way with words, or that you \"just get it.\" You're the one everyone turns to when no one else can explain what the company actually does.",
    detail:
      "You see what's actually going on and can explain it in a way that makes people act. That skill is wildly undervalued in a salaried role and wildly overvalued as an outside service. The gap between what companies pay for this in-house vs. what they'll pay a specialist is massive.",
    sharpPOV:
      "If you have this advantage, do not start with a broad offering. Start with one thing: positioning. Companies will pay $5K-$12K for someone who can walk in and tell them what they actually do in language their customers understand. That single skill is a business.",
    moneyLine: "$5K-$12K per project, typically 15-20 hours of actual work",
    examples: [
      "A $8K messaging package for a SaaS company that can't explain what it does",
      "A launch narrative that helps a product stand out in a crowded market",
      "A brand strategy sprint that turns a founder's rambling pitch into a story customers actually repeat",
    ],
  },
  {
    key: "systemsBrain",
    name: "Systems Brain",
    oneLiner:
      "You see how things should work and you can't help building the fix.",
    hook: "You look at how things run and immediately see what's broken. You're the person who builds the spreadsheet no one asked for, redesigns the workflow, or automates the thing everyone else does manually.",
    detail:
      "You don't just fix things. You see why they broke and build something that won't break the same way again. The work you do for one client becomes a template for the next. By your third engagement, you've essentially built a product that looks like high-end consulting.",
    sharpPOV:
      "If you have this advantage, your business gets more profitable with every client, not less. The system you build for client one becomes the template for client two. By client three, you're delivering twice the value in half the time. Most people's businesses scale linearly. Yours scales exponentially.",
    moneyLine: "$8K-$15K per engagement, with increasing efficiency each time",
    examples: [
      "A $10K operational overhaul for a 50-person company still running on spreadsheets and Slack threads",
      "A workflow redesign that saves a team 20 hours a week and becomes your template for the next client",
      "An automation buildout you scope in 2 weeks and deliver in 4, then sell again to 3 more companies",
    ],
  },
  {
    key: "closerInstinct",
    name: "Closer Instinct",
    oneLiner:
      "You get people to yes. Not through pressure, but through trust, timing, and knowing exactly what to say.",
    hook: "You're the person who somehow always gets the deal done, the stakeholder aligned, the candidate to accept. People think you're \"persuasive\" but really you just understand what makes people say yes.",
    detail:
      "Most people dread the selling part of running a business. You've been doing it your whole career without calling it that. You read rooms, build trust fast, and know how to move a conversation from interest to commitment without it ever feeling like a pitch.",
    sharpPOV:
      "If you have this advantage, you will close your first client faster than almost anyone else. While most new business owners spend months building a website and perfecting their offering, you'll have revenue. The thing that scares everyone else about starting a business is the thing you're already great at.",
    moneyLine:
      "First paid engagement often closed within 2-4 weeks of deciding to start",
    examples: [
      "A growth engagement where you close $200K in pipeline for a company in your first month",
      "A BD partnership where you earn a percentage of every deal instead of billing hours",
      "An advisory relationship that started as a coffee chat and turned into a $6K/month retainer",
    ],
  },
];

export default function DiscoverPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const advantage = ADVANTAGES.find((a) => a.key === selected);

  // If an advantage is selected, show the detail view
  if (advantage) {
    return (
      <div className="min-h-screen bg-blair-linen">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 sm:px-10">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl text-blair-midnight tracking-tight">
              blair
            </span>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-sm text-blair-charcoal/40 transition-colors hover:text-blair-charcoal/70"
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
              See all advantages
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-10">
          {/* Advantage reveal */}
          <div className="pt-12 sm:pt-16 animate-in fade-in duration-500">
            <p className="text-xs uppercase tracking-widest text-blair-charcoal/30">
              Your unfair advantage
            </p>
            <h1 className="mt-3 font-serif text-4xl text-blair-midnight sm:text-5xl">
              {advantage.name}
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-blair-charcoal/60">
              {advantage.oneLiner}
            </p>
          </div>

          {/* Sharp POV — the real value */}
          <div
            className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <p className="text-base leading-relaxed text-blair-charcoal/70">
              {advantage.detail}
            </p>
            <div className="mt-6 rounded-xl border-l-4 border-blair-sage bg-white px-6 py-5">
              <p className="text-base leading-relaxed font-medium text-blair-midnight">
                {advantage.sharpPOV}
              </p>
            </div>
          </div>

          {/* What people build */}
          <div
            className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            <h2 className="font-serif text-xl text-blair-midnight">
              What people with this advantage build
            </h2>
            <div className="mt-5 space-y-3">
              {advantage.examples.map((example, i) => (
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
              So. Which business?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blair-charcoal/60">
              Knowing your advantage is step one. Step two is turning it into
              something specific — a business model, a price, a first move.
              That&apos;s what Blair does. For $149, you get a plan built around
              exactly who you are and how much time you actually have.
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
                  "A deep-dive assessment that maps your exact skills, experience, and constraints to the right business model",
                  "Your top business path, matched to your unfair advantage and the hours you actually have",
                  "Pricing guidance: what to charge, the side hustle math, and the full-time math",
                  "A step-by-step playbook to go from idea to first paying client",
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
                    Clarity guarantee
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-blair-charcoal/50">
                    If you don&apos;t walk away knowing exactly what to build and
                    how to start, email me and I&apos;ll refund you. No questions
                    asked.
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

  // Default: the advantage picker
  return (
    <div className="min-h-screen bg-blair-linen">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-10">
        {/* Hero */}
        <div className="pt-16 sm:pt-20 animate-in fade-in duration-700">
          <p className="text-xs uppercase tracking-widest text-blair-sage font-medium">
            Step 1 — Free
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-tight text-blair-midnight sm:text-4xl">
            You&apos;ve spent years getting really good at something.
            <br />
            <span className="text-blair-sage">That thing is worth more than you think.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-blair-charcoal/60">
            Most women trying to start a business look outward — what&apos;s trending,
            what other people are doing, what sounds good. The ones who actually
            build something look inward first. They find the thing they already do
            better than almost anyone. Then they build around it.
          </p>
          <p className="mt-4 text-base font-medium text-blair-midnight">
            Which of these sounds like you?
          </p>
        </div>

        {/* Advantage cards */}
        <div className="mt-8 space-y-3">
          {ADVANTAGES.map((adv, i) => (
            <button
              key={adv.key}
              onClick={() => {
                setSelected(adv.key);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "group w-full rounded-2xl border bg-white p-6 sm:p-8 text-left transition-all hover:border-blair-sage/50 hover:shadow-md",
                "border-blair-mist",
                "animate-in fade-in slide-in-from-bottom-4 duration-500"
              )}
              style={{
                animationDelay: `${300 + i * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-blair-charcoal/30 font-medium mb-2">
                    {adv.name}
                  </p>
                  <h3 className="font-serif text-xl leading-snug text-blair-midnight group-hover:text-blair-sage-dark transition-colors">
                    &ldquo;{adv.oneLiner}&rdquo;
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-blair-charcoal/50">
                    {adv.hook}
                  </p>
                </div>
                <svg
                  className="mt-1 h-5 w-5 shrink-0 text-blair-charcoal/20 transition-all group-hover:text-blair-sage group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
