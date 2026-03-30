"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const ADVANTAGE_CONTENT: Record<
  string,
  {
    stat: string;
    transformation: string;
    hook: string;
  }
> = {
  networkDensity: {
    stat: "Women with Network Density typically land their first paying client within 3 weeks of launching, because the client already knows and trusts them.",
    transformation:
      "Imagine this: instead of spending months building an audience or cold-pitching strangers, you send 5 messages to people who already respect your work. Two say yes to a conversation. One becomes your first client at $5K-$10K. You do great work, they refer you to someone else. Within 6 months, you have a waitlist. All while working 10-15 hours a week around your kids' schedule.",
    hook: "Your network isn't just a nice-to-have. It's a revenue engine waiting to be activated.",
  },
  patternLibrary: {
    stat: "Consultants with Pattern Library typically charge 2-3x more than generalists because clients pay for speed to diagnosis, not hours of discovery.",
    transformation:
      "Imagine this: a company hires you for a 6-week engagement. In the first meeting, you identify the problem they've been struggling with for months. They're stunned. You're not. You've seen this exact pattern at three other companies. You deliver a solution in half the time they expected, they pay you $15K, and you still have time for school pickup every day.",
    hook: "You've already done the hard part: accumulating the experience. Now it's time to get paid for what you see that others can't.",
  },
  translationAbility: {
    stat: "Translation Ability is one of the highest-margin skills in consulting. A positioning sprint that takes you 15-20 hours of work regularly commands $5K-$12K because the output transforms how a business shows up in the world.",
    transformation:
      "Imagine this: an agency owner you know has a client whose messaging is a mess. You come in, interview the founder, audit their current copy, and deliver a positioning package in two weeks. The client goes from 'we do lots of things' to a one-liner that makes people lean in. That's an $8K project, maybe 20 hours of your time. And the agency owner sends you another client next month.",
    hook: "The gap between what companies pay for this skill in-house vs. what they'll pay an outside expert is massive. Most people with this advantage don't realize how valuable it is until someone shows them.",
  },
  systemsBrain: {
    stat: "Systems Brain consultants often build productized services that scale without adding hours, because the system you build once can be templated and sold repeatedly.",
    transformation:
      "Imagine this: you build an operational playbook for one growing startup. It works so well they refer you to a founder friend with the same problem. You adapt the same framework in half the time. By your third client, you have a repeatable product: a 4-week ops overhaul at $10K. You're working 12 hours a week and earning more per hour than your W2 ever paid.",
    hook: "You don't just fix things. You build systems that keep working after you leave. That's the kind of work companies pay a premium for.",
  },
  closerInstinct: {
    stat: "People with Closer Instinct convert prospects to clients at nearly 2x the rate of other consultants, because they already know how to build trust and move conversations forward.",
    transformation:
      "Imagine this: you have coffee with a former colleague. By the end of the conversation, they've told you about a problem their company is facing. You don't pitch. You ask good questions. A week later, they email asking if you'd be interested in helping. You scope a $12K engagement over dinner. No cold outreach, no content marketing, no sales funnel. Just a conversation you're naturally good at.",
    hook: "Most people dread the 'selling' part of running a business. You've been doing it your whole career without calling it that.",
  },
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";
  const advantageName = searchParams.get("advantage") || "Your Advantage";
  const oneLiner = searchParams.get("oneLiner") || "";
  const advantageKey = searchParams.get("key") || "translationAbility";

  const content = ADVANTAGE_CONTENT[advantageKey] || ADVANTAGE_CONTENT.translationAbility;

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
          <p className="text-sm font-medium text-blair-sage">
            {name}, here&apos;s what we found.
          </p>

          <div className="mt-8">
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

        {/* Stat */}
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          <div className="rounded-2xl border border-blair-sage/20 bg-blair-sage/5 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-blair-charcoal/80">
              {content.stat}
            </p>
          </div>
        </div>

        {/* Transformation */}
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "700ms", animationFillMode: "both" }}>
          <h2 className="font-serif text-2xl text-blair-midnight">
            What this could look like for you
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blair-charcoal/70">
            {content.transformation}
          </p>
          <p className="mt-4 text-base font-medium leading-relaxed text-blair-midnight">
            {content.hook}
          </p>
        </div>

        {/* Pricing card */}
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "1000ms", animationFillMode: "both" }}>
          <div className="rounded-2xl border border-blair-midnight/10 bg-white p-8 sm:p-10 shadow-sm">
            <h2 className="font-serif text-2xl text-blair-midnight">
              Ready to find out which business fits your life?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-blair-charcoal/60">
              Your full Blair plan is personalized to your background, your
              skills, your time, and your goals. Here&apos;s what&apos;s inside:
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Your complete unfair advantage breakdown (what it means, where it showed up, why it matters)",
                "Your personalized business path (which of 9 paths fits your skills, time, and life)",
                "Pricing guidance and the math on what this looks like at 10-15 hrs/week vs. full-time",
                "A step-by-step playbook to go from \"I think I want to do this\" to your first paying client",
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
              <div className="flex items-end gap-2">
                <span className="font-serif text-4xl text-blair-midnight">
                  $149
                </span>
                <span className="mb-1 text-sm text-blair-charcoal/40 line-through">
                  $297
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-blair-sage-dark">
                Founding member pricing
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

        {/* Already have an account */}
        <div className="mt-8 text-center">
          <Link
            href="/signin"
            className="text-sm text-blair-charcoal/40 transition-colors hover:text-blair-charcoal/60"
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
