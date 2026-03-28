/**
 * Blair Unfair Advantages
 * Used by the scoring engine to assign each user their primary unfair advantage
 * based on quiz answers.
 */

export const UNFAIR_ADVANTAGES = {
  networkDensity: {
    id: "network-density",
    name: "Network Density",
    oneLiner: "You already know the people who would pay you.",
    description:
      "People with this advantage have spent years building relationships with the exact people who buy what they'd sell. They don't need to cold-call strangers or build an audience from scratch. Their future clients already know their name, trust their judgment, and would take a meeting tomorrow if asked. Most people starting a business spend the first year trying to get in the room. You're already in it.",
    primaryQuizDrivers: ["Q21 (2+ networks)", "Q22 (comfortable)", "Q3 (10+ yrs)"],
    assignWhen: "Q21 has 2+ selections AND Q22 is 'Comfortable' AND Q3 is 10+ years. Strong signal if Q23 is moderately visible or higher.",
    doNotAssignWhen: "Q21 is 'None of the above' or Q22 is 'Very uncomfortable.' Even if they technically know people, if they won't reach out, the network doesn't convert.",
  },
  patternLibrary: {
    id: "pattern-library",
    name: "Pattern Library",
    oneLiner: "You've seen this problem break the same way at enough companies that you can diagnose it in one conversation.",
    description:
      "People with this advantage have worked across enough environments that they recognize problems before anyone finishes explaining them. Where someone else needs months to figure out what's going on, a Pattern Library person walks in and just knows. They've seen this movie. They know how it ends. This isn't just experience. It's experience across enough different contexts that the patterns become obvious.",
    primaryQuizDrivers: ["Q3 (10+ yrs)", "Q4/Q5 (breadth)", "Q7 (Fixer/Strategy)"],
    assignWhen: "Q3 is 10+ years AND they show breadth (Q4 has 2+ company sizes OR Q5 has 2+ industries) AND Q7 includes Fixer or Strategy.",
    doNotAssignWhen: "They have deep experience but only at one company or one type of company. That's expertise, not pattern recognition.",
  },
  translationAbility: {
    id: "translation-ability",
    name: "Translation Ability",
    oneLiner: "You make the complicated clear, the muddled compelling, and the invisible sellable.",
    description:
      "People with this advantage are translators between what something IS and what it NEEDS TO SAY. They walk into a room where everyone's confused about how to describe their own product, their own company, their own value... and they just see it. They turn something complicated into language that makes a customer lean in. This isn't about being a good writer (though they often are). It's about pattern recognition applied to narrative: spotting the disconnect between what a business actually does and how it's showing up in the world.",
    primaryQuizDrivers: ["Q7 (Creative)", "Q2 (brand/content/marketing)", "Q8"],
    assignWhen: "Q7 includes 'The Creative' AND Q2 is a messaging/brand/content role. Strong confirmation if Q8 mentions communication, explaining, or storytelling skills.",
    doNotAssignWhen: "Someone picked 'The Creative' but their role and background are purely technical or operational.",
  },
  systemsBrain: {
    id: "systems-brain",
    name: "Systems Brain",
    oneLiner: "You see how things should work and you can't help building the fix.",
    description:
      "People with this advantage see the invisible architecture behind how a business actually runs. They don't just fix the broken thing. They see why it broke and build something that won't break the same way again. It's a rare combination of technical skill and business understanding. Where other people see a mess, they see a system waiting to be built. And they can't walk away from it.",
    primaryQuizDrivers: ["Q7 (Fixer)", "Q13 (systems/tools)", "Q10 (deep work)", "Q8"],
    assignWhen: "Q7 includes 'The Fixer' AND Q13 is 'Building systems, tools, or workflows' AND Q10 is deep independent work or owned execution.",
    doNotAssignWhen: "Someone is a Fixer but their instinct is people-oriented (managing, coaching, team building) rather than systems-oriented.",
  },
  closerInstinct: {
    id: "closer-instinct",
    name: "Closer Instinct",
    oneLiner: "You know how to get people to yes. Not through pressure, but through trust, timing, and knowing exactly what to say.",
    description:
      "People with this advantage are natural deal-makers. They read rooms, build trust fast, and know how to move a conversation from interest to commitment without it ever feeling like a pitch. This isn't about being 'salesy.' It's about having spent years understanding what makes people say yes, whether that's closing enterprise deals, building partnerships, landing candidates, or getting buy-in from skeptical stakeholders. Most people dread the selling part of running a business. You've been doing it your whole career without calling it that.",
    primaryQuizDrivers: ["Q2 (Sales/CS)", "Q22 (comfortable outreach)", "Q7 (Strategy)", "Q8"],
    assignWhen: "Q2 is Sales/Partnerships/RevOps or Customer Success AND Q22 is 'Comfortable.' Strong confirmation if Q7 includes Strategy, Q21 has strong network, and Q8 mentions persuasion or relationship skills.",
    doNotAssignWhen: "Someone is in sales but hates selling (Q11 drains = 'constant selling/self-promotion'). Their role may be sales but their instinct isn't.",
  },
} as const;

/**
 * Assignment priority when multiple advantages could apply:
 * 1. Which one is most specific to them?
 * 2. Which one would surprise them most (in a good way)?
 * 3. Which one best supports the primary recommendation?
 * 4. When in doubt, check Q8 (weirdly good at) - freeform answer breaks ties.
 */
export type UnfairAdvantageKey = keyof typeof UNFAIR_ADVANTAGES;
