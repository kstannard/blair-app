/**
 * Fix Claire Hubbard's recommendation:
 * - Change primary path to Fractional Operator
 * - Alt 1: Micro-SaaS Builder
 * - Alt 2: Automation & Systems Builder
 * - Regenerate all copy via Claude API
 *
 * Usage: node scripts/fix-claire.js
 */
const { PrismaClient } = require('../node_modules/@prisma/client');
const { PrismaPg } = require('../node_modules/@prisma/adapter-pg');
const pg = require('../node_modules/pg');
const fs = require('fs');
const Anthropic = require('../node_modules/@anthropic-ai/sdk').default;

// Load env
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TYPEFORM_FIELD_MAP = {
  "dc0389bc-6cee-4d60-9424-641ce62c23b2": { quizKey: "Q1_name" },
  "7a04081f-1257-4fe2-94d8-9b51cb4b61cc": { quizKey: "Q2_role" },
  "adaaf514-3035-447f-a9a9-df243128354c": { quizKey: "Q3_years" },
  "8c46376a-7993-46d0-b2bf-0c52e0bcedce": { quizKey: "Q4_company_size" },
  "1141c3fc-a9df-4de6-8454-6106acf2e6d2": { quizKey: "Q5_industries" },
  "c3dd18e5-56a7-4da0-be70-13a9fed1a24c": { quizKey: "Q6_business_models" },
  "6192dd0d-d6c9-4aa2-83e9-11952277e523": { quizKey: "Q7_shoulder_tap" },
  "3eeeb4f3-a480-49d6-8694-e1d74e7030de": { quizKey: "Q8_weirdly_good" },
  "4afa164c-51b5-4e83-9188-2960fb932dfa": { quizKey: "Q9_managing" },
  "ccb59b99-2f9c-444f-8b7c-35c1c1ac0294": { quizKey: "Q10_work_mode" },
  "d067be6e-8a79-4ffc-a0d3-78d354726aed": { quizKey: "Q11_energy_drains" },
  "23bf71b0-2703-45eb-8a4d-8abec6d8f692": { quizKey: "Q12_same_or_different" },
  "9c0a202b-c457-4d76-8187-840e57032f08": { quizKey: "Q13_blocker" },
  "395674d6-78fe-4477-8d68-92f415b4a36d": { quizKey: "Q14_interests" },
  "571af747-2ac1-4ebf-be8f-ff77af3ff7ac": { quizKey: "Q15_scenario" },
  "43e86f36-01ee-4fe0-a57b-9a180c91b8e5": { quizKey: "Q16_success" },
  "30a2997b-0846-4d80-aa87-df3636f356ee": { quizKey: "Q17_avoid" },
  "e05f7717-695d-45ff-be18-722495337650": { quizKey: "Q18_income_timeline" },
  "be9095c3-6c48-428d-902e-4b0ce60996cb": { quizKey: "Q19_zero_income" },
  "3b2203ca-afd6-460d-a9a7-05579dada795": { quizKey: "Q20_capital" },
  "b0ac307d-c42a-4544-b8cd-4fcea6628e6c": { quizKey: "Q21_borrowing" },
  "c91b94e8-8c89-45ab-bf9c-8605706a685f": { quizKey: "Q22_network" },
  "0c854db4-c2b4-4aff-aba8-17840b28d004": { quizKey: "Q23_outreach" },
  "d0c4febb-6e09-43e9-8c36-5422ec6c624d": { quizKey: "Q24_visibility" },
  "8729215f-ea9b-48f4-a713-ac5ee02ad25e": { quizKey: "Q25_time" },
  "37b4d94f-818f-4ad5-8d5b-ce386c535455": { quizKey: "Q26_conditions" },
  "19b28a68-2fb0-48f1-b316-61736509bf26": { quizKey: "Q27_kids_ages" },
  "56b0517f-4404-4a5f-98d6-2f8e612f8886": { quizKey: "Q28_linkedin" },
  "9573764e-c2ac-45e6-987f-79d279013191": { quizKey: "Q29_other_links" },
};

const MULTI_KEYS = new Set([
  'Q4_company_size', 'Q5_industries', 'Q6_business_models', 'Q7_shoulder_tap',
  'Q11_energy_drains', 'Q14_interests', 'Q16_success', 'Q17_avoid', 'Q22_network',
]);

const UNFAIR_ADVANTAGES = {
  systemsBrain: { name: "Systems Brain", oneLiner: "You see the machine behind the chaos.", description: "Where others see overwhelm, you see a system waiting to be built. You instinctively map processes, find bottlenecks, and build infrastructure that scales." },
};

function mapAnswers(rawValues) {
  const answers = {};
  for (const [ref, mapping] of Object.entries(TYPEFORM_FIELD_MAP)) {
    const val = rawValues[ref] || '';
    if (MULTI_KEYS.has(mapping.quizKey)) {
      answers[mapping.quizKey] = val ? val.split(', ') : [];
    } else {
      answers[mapping.quizKey] = val;
    }
  }
  return answers;
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
- The guarantee is a "Clarity guarantee" -- they'll walk away knowing what to build and how to start.
`.trim();

async function generateRecommendation(answers, overriddenScoring) {
  const advantage = UNFAIR_ADVANTAGES.systemsBrain; // Claire's advantage
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are writing a personalized business recommendation for Blair, a service that helps ambitious working moms figure out what business to start based on their skills and life constraints.

${BRAND_RULES}

---

IMPORTANT CONTEXT FROM KRISTIN (Blair's founder):
- Claire does NOT currently have a full-time job. She has full hours available to devote to building her business.
- She is already consulting for a tech company she was interviewing at (too small to join full-time). Lean into this. She's already doing the work.
- She told us she "hates tech" but is actively consulting for a tech company, so she doesn't hate the work itself. She hates the corporate tech grind.
- Her strengths are being The Fixer (building systems/processes) and The Strategist (mapping out plans). Companies already come to her for this.
- She's comfortable managing people and has worked across E-commerce, DTC, and marketplace businesses.
- Frame this as: you're already doing fractional/consulting work. Blair is going to help you turn that into a real, repeatable business.
- Do NOT recommend she build software or a SaaS product as her primary path. She should be getting paid for her expertise directly.

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
Kids ages: ${answers.Q27_kids_ages || "not provided"}

## Scoring Results (manually overridden by Kristin)

Primary unfair advantage: Systems Brain
Evidence: shoulder-tapped as The Fixer, role in Product Management, deep independent work mode
Primary recommended path: Fractional Operator
Path fit reasons: Product management background with systems brain; already consulting for a company; comfortable managing teams; 10-14 years experience across E-commerce, DTC, and marketplaces
Alternative paths: Micro-SaaS Builder, Automation & Systems Builder

## Advantage Definition (for framing)

Name: ${advantage.name}
One-liner: ${advantage.oneLiner}
Description: ${advantage.description}

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
}

Guidelines for each field:

personalIntro (3-5 short paragraphs):
- Open with 1-2 sentences stating facts from their career history. No narrative about how they felt.
- Acknowledge that she's already consulting. This isn't hypothetical for her.
- Acknowledge what she told us she wants: time flexibility, income goal, working conditions.
- Close with "Here's what that looks like." or "Let's figure out what that looks like."

personalizedWhy (3 paragraphs with headers):
- "The big idea:" -- 2 sentences on what she builds and why it fits her. Frame it as fractional product/ops leadership for growing companies, especially in e-commerce/DTC/marketplace space.
- "What you build:" -- A concrete example. Name a realistic client type, what she delivers, how long an engagement takes, what it pays. Think: a Series A DTC brand that needs someone to come in and fix their ops/product process for 3-6 months.
- "Who pays you (and how you find them):" -- Be honest about pipeline. She already has one consulting client. Build from there.

pricingDetails:
- tiers: 2 tiers. For fractional operator with her experience, think $8K-$12K/month retainer for embedded work, and a smaller project-based option.
- sideHustleMath: She has 13-15 hours/week available. What's realistic? But note she could go higher since she doesn't have a full-time job.
- fullCapacityMath: At 25-30 hours/week (she has the bandwidth), what could this look like?
- momFit: Reference her kids' actual ages if provided. Be real about the flexibility of fractional work: you set your own schedule, you're not on someone else's clock.

Return only the JSON object, no other text.`;

  console.log('Calling Claude API...');
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not extract JSON');
  return JSON.parse(jsonMatch[0]);
}

const CLAIRE_EMAIL = 'clairealsophubbard@gmail.com';

async function main() {
  const user = await prisma.user.findUnique({ where: { email: CLAIRE_EMAIL } });
  if (!user) { console.log('User not found:', CLAIRE_EMAIL); return; }
  console.log('User:', user.id, user.name);

  // Get her quiz answers
  const sub = await prisma.quizSubmission.findFirst({ where: { userId: user.id } });
  if (!sub) { console.log('No quiz submission found'); return; }
  const rawValues = JSON.parse(sub.answers);
  const answers = mapAnswers(rawValues);
  console.log('Name:', answers.Q1_name);
  console.log('Role:', answers.Q2_role);
  console.log('Kids:', answers.Q27_kids_ages);

  // Find the three business paths
  const fractionalOp = await prisma.businessPath.findFirst({ where: { slug: 'fractional-operator' } });
  const microSaas = await prisma.businessPath.findFirst({ where: { slug: 'micro-saas-builder' } });
  const automationSystems = await prisma.businessPath.findFirst({ where: { slug: 'automation-systems-builder' } });

  if (!fractionalOp || !microSaas || !automationSystems) {
    console.log('ERROR: Could not find all business paths');
    console.log('  fractional-operator:', fractionalOp?.id);
    console.log('  micro-saas-builder:', microSaas?.id);
    console.log('  automation-systems-builder:', automationSystems?.id);
    return;
  }

  console.log('\nPath IDs:');
  console.log('  Fractional Operator:', fractionalOp.id);
  console.log('  Micro-SaaS Builder:', microSaas.id);
  console.log('  Automation & Systems Builder:', automationSystems.id);

  // Find existing recommendation
  const existingRec = await prisma.recommendation.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (!existingRec) {
    console.log('No existing recommendation found');
    return;
  }
  console.log('\nExisting recommendation:', existingRec.id, 'status:', existingRec.status);

  // Generate new copy
  console.log('\n=== GENERATING NEW RECOMMENDATION (this takes ~30s) ===');
  const draft = await generateRecommendation(answers, null);
  console.log('Draft generated!');
  console.log('personalIntro preview:', draft.personalIntro.substring(0, 200) + '...');

  // Update the recommendation
  console.log('\n=== UPDATING DATABASE ===');
  await prisma.recommendation.update({
    where: { id: existingRec.id },
    data: {
      primaryPathId: fractionalOp.id,
      confirmedPathId: null, // Reset confirmation since path changed
      status: 'draft',
      personalIntro: draft.personalIntro,
      personalizedWhy: draft.personalizedWhy,
      pricingDetails: JSON.stringify(draft.pricingDetails),
    },
  });
  console.log('Recommendation updated with new primary path + copy.');

  // Delete old RecommendationPath records and create new ones
  await prisma.recommendationPath.deleteMany({ where: { recommendationId: existingRec.id } });
  console.log('Old path rankings deleted.');

  // Create new path rankings
  const pathRankings = [
    { pathId: fractionalOp.id, rank: 1, fitScore: 88 },
    { pathId: microSaas.id, rank: 2, fitScore: 72 },
    { pathId: automationSystems.id, rank: 3, fitScore: 68 },
  ];

  for (const ranking of pathRankings) {
    await prisma.recommendationPath.create({
      data: {
        recommendationId: existingRec.id,
        pathId: ranking.pathId,
        rank: ranking.rank,
        fitScore: ranking.fitScore,
      },
    });
    console.log('  Rank', ranking.rank + ':', ranking.rank === 1 ? 'Fractional Operator' : ranking.rank === 2 ? 'Micro-SaaS Builder' : 'Automation & Systems Builder', '(fit:', ranking.fitScore + ')');
  }

  console.log('\nDONE! Claire\'s recommendation has been updated.');
  console.log('Primary: Fractional Operator');
  console.log('Alt 1: Micro-SaaS Builder');
  console.log('Alt 2: Automation & Systems Builder');
  console.log('Status: draft (needs approval in admin)');
}

main().catch(console.error).finally(() => pool.end());
