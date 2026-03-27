"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HelpItem {
  title: string;
  content: string;
}

interface HelpPanelProps {
  taskType: string;
}

const helpContent: Record<string, HelpItem[]> = {
  "niche-editor": [
    {
      title: "Show me examples of great niches",
      content:
        "The best niches sit at the intersection of what you have done, what you enjoy, and what companies pay for. Examples: \"Helping fintech startups build their first outbound sales motion.\" \"Designing enterprise onboarding flows for B2B SaaS.\" \"Building content engines for companies between Series A and B.\" Notice how each one names a specific audience, a specific problem, and implies a clear outcome.",
    },
    {
      title: "My niche feels too narrow",
      content:
        "If it feels uncomfortably specific, you're probably in the right zone. A narrow niche doesn't limit your income. It makes you the obvious choice for a specific type of buyer. You can always expand later, but starting broad is the number one reason new consultants struggle to land clients.",
    },
    {
      title: "I have too many interests to pick one",
      content:
        "That's a feature, not a bug. Multi-passionate people make great consultants because they connect dots others miss. The trick is to pick the niche where your varied experience becomes a superpower. Which combination of your skills would be hardest for someone else to replicate?",
    },
  ],
  "positioning-editor": [
    {
      title: "What makes a great one sentence?",
      content:
        "Read it out loud to someone who knows your industry. If they immediately think of a company that needs what you described, you nailed it. If they nod politely but can't picture anyone specific, it's too vague. The sentence should be so clear that the listener becomes your unpaid salesperson.",
    },
    {
      title: "How's this different from a tagline?",
      content:
        "A tagline is a marketing slogan. Your one sentence is the strategic foundation underneath it. It defines who you help, what you help them do, and how you do it. It informs everything from your website copy to how you introduce yourself at a dinner party. Get the one sentence right, and the tagline writes itself.",
    },
    {
      title: "This feels like bragging",
      content:
        "If your positioning makes you slightly uncomfortable, it's probably honest. Understating your value isn't modesty - it's a disservice to the clients who need exactly what you offer. Think of it this way: your positioning isn't about you. It's about helping the right person find you faster.",
    },
  ],
  "buyer-profile-editor": [
    {
      title: "How specific should my buyer profile be?",
      content:
        "Specific enough that you could find 10 of them on LinkedIn in under 5 minutes. \"Marketing leaders\" is too broad. \"VP of Marketing at B2B SaaS companies with 50-200 employees who just raised a Series B\" is a profile you can actually target. The more specific, the more effective your outreach will be.",
    },
    {
      title: "What are trigger events?",
      content:
        "Trigger events are the moments when your ideal buyer suddenly needs what you offer. Examples: they just got promoted, their company raised funding, they lost a key team member, they missed a quarterly target, or they launched a new product. These are the moments when budget appears and urgency is high. Knowing these lets you reach out at exactly the right time.",
    },
    {
      title: "Where do I find these buyers?",
      content:
        "Start with where they already gather: LinkedIn groups, Slack communities, industry conferences, podcasts they listen to, newsletters they read. The goal isn't to be everywhere. It's to show up consistently in 2-3 places where your specific buyer pays attention. Quality of presence beats quantity of platforms.",
    },
  ],
  "gut-check": [
    {
      title: "Who should I reach out to?",
      content:
        "Pick people who know your work well enough to react honestly. Former colleagues, managers, or mentors are great. You want someone who can say \"that makes total sense for you\" or \"honestly, I think you should adjust this part\" - not someone who will just tell you what you want to hear.",
    },
    {
      title: "What if people don't respond?",
      content:
        "That's normal. Send 5-6 messages to get 2-3 conversations. People are busy, and your first message might land at a bad time. A gentle follow-up a week later usually does the trick. Keep the ask small - \"15 minutes for a quick gut-check\" is much easier to say yes to than an open-ended coffee chat.",
    },
    {
      title: "What if someone says my idea is bad?",
      content:
        "That's actually the best possible outcome at this stage. Better to hear it now from a friend than to discover it after months of building in the wrong direction. Ask follow-up questions: What specifically feels off? What would make it stronger? Their feedback is data, not a verdict.",
    },
  ],
};

export function HelpPanel({ taskType }: HelpPanelProps) {
  const items = helpContent[taskType] || helpContent["niche-editor"];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-blair-mist bg-white p-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-blair-sage">
        Need help?
      </h3>

      <div className="mt-5 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="border-b border-blair-mist/60 last:border-0">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-blair-midnight hover:text-blair-sage-dark transition-colors"
            >
              {item.title}
              <svg
                className={cn(
                  "h-4 w-4 shrink-0 text-blair-charcoal/30 transition-transform",
                  openIndex === i && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            {openIndex === i && (
              <div className="pb-4 pr-6">
                <p className="text-sm leading-relaxed text-blair-charcoal/70">
                  {item.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
