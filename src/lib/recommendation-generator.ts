/**
 * Auto-generates personalized recommendation copy using Claude.
 * Input: quiz answers + scoring result + enriched profile
 * Output: draft copy for personalIntro, personalizedWhy, pricingDetails, transitionPlan, closingNote
 * Status is always "draft" — Kristin reviews and approves before the user can see it.
 */

import Anthropic from "@anthropic-ai/sdk";
import { type FullQuizAnswers, type FullScoringResult } from "./scoring/full-quiz-scorer";
import { type EnrichedProfile, formatEnrichmentForPrompt } from "./enrichment";
import { UNFAIR_ADVANTAGES } from "./scoring/unfair-advantages";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GeneratedRecommendation {
  personalIntro: string;
  personalizedWhy: string;
  pricingDetails: {
    tiers: Array<{ name: string; price: string }>;
    sideHustleMath: string;
    fullCapacityMath: string;
    momFit: string;
  };
  transitionPlan: Array<{ title: string; description: string }>;
  closingNote: string;
}

const BRAND_RULES = `
BLAIR BRAND RULES (non-negotiable):
- Use contractions throughout (you've, you're, they've, you'll, it's, that's, doesn't, isn't, won't)
- Voice: warm, witty, direct. Never preachy, never presumptuous.
- NO em dashes (—). Use colons, periods, or restructure instead.
- Never assume salary or how someone felt about their career. State facts about what they did, not narrative about their experience.
- Never say "yet" as a softener, never say "genuinely", never say "straightforward"
- The main thing holding this person back is probably time, not skill. Acknowledge real life.
- Bath time / pickup time is 5:30-6pm. Be specific when referencing parent constraints.
- Examples of businesses to build should NOT be consulting-only. Mix in fractional roles, advisory retainers, placement practices, coaching, productized services.
- Price ranges must be realistic. Reference Kelsey's $8K-$15K brand sprint range as a benchmark for messaging work.
- The guarantee is a "Clarity guarantee" — they'll walk away knowing what to build and how to start.
`.trim();

export async function generateRecommendationDraft(
  answers: FullQuizAnswers,
  scoring: FullScoringResult,
  enrichment: EnrichedProfile
): Promise<GeneratedRecommendation> {
  const advantage = UNFAIR_ADVANTAGES[scoring.primaryAdvantage.key];
  const enrichmentText = formatEnrichmentForPrompt(enrichment);

  const prompt = `You are writing a personalized business recommendation for Blair, a service that helps ambitious working moms figure out what business to start based on their skills and life constraints.

${BRAND_RULES}

---

## Person's Quiz Answers

Name: ${answers.Q1_name}
Role / Background: ${answers.Q2_role}
Years in tech/adjacent roles: ${answers.Q3_years}
Company sizes: ${answers.Q4_company_size.join(", ")}
Industries: ${answers.Q5_industries.join(", ")}
Business models experience: ${answers.Q6_business_models.join(", ")}
Shoulder tap (people come to them for): ${answers.Q7_shoulder_tap.join(", ")}
Weirdly good at: ${answers.Q8_weirdly_good}
Managing employees: ${answers.Q9_managing}
Work mode: ${answers.Q10_work_mode}
Energy drains: ${answers.Q11_energy_drains.join(", ")}
Wants same/different work: ${answers.Q12_same_or_different}
Main blocker: ${answers.Q13_blocker}
Interests: ${answers.Q14_interests.join(", ")}
What they want to avoid: ${answers.Q17_avoid.join(", ")}
Income timeline goal: ${answers.Q18_income_timeline}
Weekly hours available: ${answers.Q25_time}
Working conditions preference: ${answers.Q26_conditions}
Kids ages: ${answers.Q27_kids_ages.join(", ") || "not provided"}

## Scoring Results

Primary unfair advantage: ${scoring.primaryAdvantage.name}
Evidence for this advantage: ${scoring.primaryAdvantage.evidence.join("; ")}
Primary recommended path: ${scoring.primaryPath.pathName}
Path fit reasons: ${scoring.primaryPath.reasons.join("; ")}
Alternative paths: ${scoring.alternativePaths.map((p) => p.pathName).join(", ")}

## Advantage Definition (for framing)

Name: ${advantage.name}
One-liner: ${advantage.oneLiner}
Description: ${advantage.description}

## Enrichment Data

${enrichmentText}

---

Now write the full recommendation. Return a valid JSON object with these exact keys:

{
  "personalIntro": "...",
  "personalizedWhy": "...",
  "pricingDetails": {
    "tiers": [
      { "name": "...", "price": "..." },
      { "name": "...", "price": "..." }
    ],
    "sideHustleMath": "...",
    "fullCapacityMath": "...",
    "momFit": "..."
  },
  "transitionPlan": [
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." }
  ],
  "closingNote": "..."
}

Guidelines for each field:

personalIntro (3-5 short paragraphs):
- Open with 1-2 sentences stating facts from their career history (use enrichment data if available, otherwise quiz answers). No narrative about how they felt.
- Acknowledge what they told us they want: time flexibility, income goal, working conditions.
- Close with "Here's what that looks like." or "Let's figure out what that looks like." — keep it short.

personalizedWhy (3 paragraphs with headers):
- "The big idea:" — 2 sentences on what they build and why it fits them.
- "What you build:" — A concrete example. Name a realistic client, what they deliver, how long it takes, what it pays. Make it specific but not hyper-niche.
- "Who pays you (and how you find them):" — Be honest about pipeline. If they have a network, say so. If they'd need to build one, say that too.

pricingDetails:
- tiers: 2 tiers. Name them something memorable (not just "Basic/Premium"). Price based on path and their experience level.
- sideHustleMath: At their stated weekly hours, what's the realistic annual income?
- fullCapacityMath: At 20-25 hours/week (full side hustle or part-time), what could it be?
- momFit: 2-3 paragraphs. Be real about the tension between building a business and having kids. Don't be preachy. Explain why this specific business model works for this stage of life.

transitionPlan: 4 concrete steps, in order. Each step title is an action, not a concept.

closingNote: 2-3 sentences. Warm but not preachy. Don't tell them how to feel.

Return only the JSON object, no other text.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected Claude response type");

  // Extract JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not extract JSON from Claude response");

  return JSON.parse(jsonMatch[0]) as GeneratedRecommendation;
}
