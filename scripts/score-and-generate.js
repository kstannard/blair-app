/**
 * Score a user's quiz and generate their recommendation draft.
 * Usage: node scripts/score-and-generate.js email@example.com
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

// Field map (copied from typeform-fields.ts)
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

// Multi-select quiz keys
const MULTI_KEYS = new Set([
  'Q4_company_size', 'Q5_industries', 'Q6_business_models', 'Q7_shoulder_tap',
  'Q11_energy_drains', 'Q14_interests', 'Q16_success', 'Q17_avoid', 'Q22_network',
]);

// Unfair advantages (copied from unfair-advantages.ts)
const UNFAIR_ADVANTAGES = {
  networkDensity: { name: "Network Density", oneLiner: "You already know the people who'd pay you.", description: "Your relationships are your pipeline. You've spent years building trust with decision-makers, and that trust converts into contracts faster than any marketing funnel." },
  patternLibrary: { name: "Pattern Library", oneLiner: "You've seen this movie before — you know how it ends.", description: "You've been in enough rooms, across enough companies and industries, to spot what others can't yet see. Your pattern recognition is what makes you worth the premium." },
  translationAbility: { name: "Translation Ability", oneLiner: "You make complex things feel simple.", description: "You can take a tangled mess of features, strategy, or positioning and turn it into a story people actually understand. That's rare, and companies will pay a premium for it." },
  systemsBrain: { name: "Systems Brain", oneLiner: "You see the machine behind the chaos.", description: "Where others see overwhelm, you see a system waiting to be built. You instinctively map processes, find bottlenecks, and build infrastructure that scales." },
  closerInstinct: { name: "Closer Instinct", oneLiner: "You know how to move people from maybe to yes.", description: "You read rooms, build trust fast, and know when to push. Whether it's a deal, a partnership, or a hire, you have the instinct to close." },
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

// Scoring (inline copy of full-quiz-scorer.ts logic)
function includes(arr, ...keywords) {
  return keywords.some(kw => arr.some(item => item.toLowerCase().includes(kw.toLowerCase())));
}
function textIncludes(text, ...keywords) {
  return keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()));
}

const PATHS = {
  "gtm-growth-strategist": "GTM & Growth Strategist",
  "messaging-positioning": "Messaging & Positioning Specialist",
  "fractional-operator": "Fractional Operator",
  "automation-systems-builder": "Automation & Systems Builder",
  "content-engine-operator": "Content Engine Operator",
  "lead-gen-operator": "Lead Gen Operator",
  "studio-builder": "Studio Builder",
  "niche-talent-placement": "Niche Talent & Placement Operator",
  "investor-operator": "Investor-Operator",
  "digital-product-builder": "Digital Product Builder",
  "community-membership-operator": "Community & Membership Operator",
  "micro-saas-builder": "Micro-SaaS Builder",
};

function scoreFullQuiz(answers) {
  const scores = { networkDensity: 0, patternLibrary: 0, translationAbility: 0, systemsBrain: 0, closerInstinct: 0 };
  const evidence = { networkDensity: [], patternLibrary: [], translationAbility: [], systemsBrain: [], closerInstinct: [] };

  const { Q2_role, Q3_years, Q4_company_size, Q5_industries, Q7_shoulder_tap, Q8_weirdly_good, Q10_work_mode, Q11_energy_drains, Q16_success, Q17_avoid, Q22_network, Q23_outreach } = answers;
  const isSenior = Q3_years === "10-14 years" || Q3_years === "15+ years";
  const isVetted = Q3_years === "15+ years";
  const isComfortable = Q23_outreach.toLowerCase().startsWith("comfortable");
  const isVeryUncomfortable = Q23_outreach.toLowerCase().startsWith("very uncomfortable");
  const hasBreadth = Q4_company_size.length >= 2 || Q5_industries.filter(i => !i.includes("Generalist")).length >= 2;
  const hasNetwork = Q22_network.length >= 2;
  const avoidsConstantSelling = includes(Q17_avoid, "constant selling", "self-promotion");
  const avoidsClientDemands = includes(Q17_avoid, "constant client", "client demand");

  // Network Density
  if (hasNetwork) { scores.networkDensity += 2; evidence.networkDensity.push("strong professional network"); }
  if (isComfortable) { scores.networkDensity += 2; evidence.networkDensity.push("comfortable with outreach"); }
  if (isSenior) { scores.networkDensity += 1; evidence.networkDensity.push(`${Q3_years} of experience`); }
  if (includes(Q7_shoulder_tap, "strategy")) { scores.networkDensity += 1; evidence.networkDensity.push("people tap them for strategy"); }
  if (isVeryUncomfortable) { scores.networkDensity = 0; evidence.networkDensity = ["very uncomfortable with outreach"]; }

  // Pattern Library
  if (isVetted) { scores.patternLibrary += 2; evidence.patternLibrary.push("15+ years of experience"); }
  else if (isSenior) { scores.patternLibrary += 1; evidence.patternLibrary.push("10+ years of experience"); }
  if (hasBreadth) { scores.patternLibrary += 2; evidence.patternLibrary.push("breadth across company sizes and/or industries"); }
  if (includes(Q7_shoulder_tap, "fixer", "strategy")) { scores.patternLibrary += 1; evidence.patternLibrary.push("shoulder-tapped as Fixer or Strategy"); }
  if (textIncludes(Q8_weirdly_good, "pattern", "diagnose", "see", "spot", "recognize")) {
    scores.patternLibrary += 1; evidence.patternLibrary.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  if (!hasBreadth && isSenior) { scores.patternLibrary = Math.max(0, scores.patternLibrary - 1); }

  // Translation Ability
  if (includes(Q7_shoulder_tap, "creative")) { scores.translationAbility += 3; evidence.translationAbility.push("shoulder-tapped as The Creative"); }
  if (textIncludes(Q2_role, "brand", "content", "communications", "comms", "pr ", "marketing", "messaging", "copywriting")) {
    scores.translationAbility += 2; evidence.translationAbility.push(`role: ${Q2_role}`);
  }
  if (includes(Q7_shoulder_tap, "strategy")) { scores.translationAbility += 1; evidence.translationAbility.push("also shoulder-tapped for strategy"); }
  if (textIncludes(Q8_weirdly_good, "explain", "write", "story", "message", "communicate", "translate", "narrative", "deck", "pitch")) {
    scores.translationAbility += 1; evidence.translationAbility.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  if (includes(Q7_shoulder_tap, "creative") && textIncludes(Q2_role, "engineer", "data", "technical", "operations") && !textIncludes(Q2_role, "brand", "content", "communications")) {
    scores.translationAbility = Math.max(0, scores.translationAbility - 2);
  }

  // Systems Brain
  if (includes(Q7_shoulder_tap, "fixer")) { scores.systemsBrain += 3; evidence.systemsBrain.push("shoulder-tapped as The Fixer"); }
  if (textIncludes(Q2_role, "operations", "ops", "engineer", "technical", "product", "program manager", "chief of staff", "coo")) {
    scores.systemsBrain += 2; evidence.systemsBrain.push(`role: ${Q2_role}`);
  }
  if (Q10_work_mode.toLowerCase().includes("deep") || Q10_work_mode.toLowerCase().includes("independent")) {
    scores.systemsBrain += 1; evidence.systemsBrain.push("deep independent work mode");
  }
  if (textIncludes(Q8_weirdly_good, "system", "automat", "process", "workflow", "build", "fix", "infrastructure")) {
    scores.systemsBrain += 1; evidence.systemsBrain.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  if (includes(Q7_shoulder_tap, "fixer") && textIncludes(Q2_role, "hr", "people", "talent", "recruiter")) {
    scores.systemsBrain = Math.max(0, scores.systemsBrain - 1);
  }

  // Closer Instinct
  if (textIncludes(Q2_role, "sales", "partnerships", "revops", "business development", "bd ", "account executive", "ae ", "customer success", "cs ")) {
    scores.closerInstinct += 3; evidence.closerInstinct.push(`role: ${Q2_role}`);
  }
  if (isComfortable) { scores.closerInstinct += 1; evidence.closerInstinct.push("comfortable with outreach"); }
  if (includes(Q7_shoulder_tap, "strategy")) { scores.closerInstinct += 1; evidence.closerInstinct.push("shoulder-tapped for strategy"); }
  if (textIncludes(Q8_weirdly_good, "sell", "persuade", "close", "deal", "negotiat", "relationship", "trust")) {
    scores.closerInstinct += 1; evidence.closerInstinct.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  if (avoidsConstantSelling) {
    scores.closerInstinct = Math.max(0, scores.closerInstinct - 2);
    evidence.closerInstinct.push("NEGATIVE: wants to avoid constant selling");
  }

  const tiebreakOrder = ["translationAbility", "patternLibrary", "closerInstinct", "systemsBrain", "networkDensity"];
  let bestKey = tiebreakOrder[0];
  let bestScore = scores[bestKey];
  for (const key of tiebreakOrder) {
    if (scores[key] > bestScore) { bestKey = key; bestScore = scores[key]; }
  }

  const allAdvantages = tiebreakOrder.map(key => ({ key, name: UNFAIR_ADVANTAGES[key].name, score: scores[key], evidence: evidence[key] })).sort((a, b) => b.score - a.score);
  const primaryAdvantage = allAdvantages[0];

  // Path scoring
  const pathScores = {};
  for (const slug of Object.keys(PATHS)) { pathScores[slug] = { score: 0, reasons: [] }; }

  if (textIncludes(Q2_role, "growth", "gtm", "product marketing", "demand gen", "revenue")) {
    pathScores["gtm-growth-strategist"].score += 3; pathScores["gtm-growth-strategist"].reasons.push(`role: ${Q2_role}`);
  }
  if (bestKey === "networkDensity" || bestKey === "closerInstinct") {
    pathScores["gtm-growth-strategist"].score += 2; pathScores["gtm-growth-strategist"].reasons.push("strong network/closer advantage");
  }
  if (includes(Q5_industries, "saas", "software", "tech", "b2b")) {
    pathScores["gtm-growth-strategist"].score += 1; pathScores["gtm-growth-strategist"].reasons.push("tech industry background");
  }
  if (bestKey === "translationAbility") {
    pathScores["messaging-positioning"].score += 4; pathScores["messaging-positioning"].reasons.push("primary advantage is Translation Ability");
  }
  if (textIncludes(Q2_role, "brand", "content", "communications", "comms", "pr", "marketing", "messaging", "copywriting")) {
    pathScores["messaging-positioning"].score += 2; pathScores["messaging-positioning"].reasons.push(`role: ${Q2_role}`);
  }
  if (!avoidsClientDemands) { pathScores["messaging-positioning"].score += 1; }
  if (bestKey === "patternLibrary" || bestKey === "networkDensity") {
    pathScores["fractional-operator"].score += 2; pathScores["fractional-operator"].reasons.push("strong pattern/network advantage");
  }
  if (isSenior && hasBreadth) {
    pathScores["fractional-operator"].score += 2; pathScores["fractional-operator"].reasons.push("senior + breadth = fractional credibility");
  }
  if (textIncludes(Q2_role, "vp", "director", "head of", "chief", "cmo", "coo", "cto", "fractional")) {
    pathScores["fractional-operator"].score += 2; pathScores["fractional-operator"].reasons.push(`senior title: ${Q2_role}`);
  }
  if (bestKey === "systemsBrain") {
    pathScores["automation-systems-builder"].score += 4; pathScores["automation-systems-builder"].reasons.push("primary advantage is Systems Brain");
  }
  if (textIncludes(Q2_role, "engineer", "technical", "data", "ops", "product", "automation", "revops")) {
    pathScores["automation-systems-builder"].score += 2; pathScores["automation-systems-builder"].reasons.push(`role: ${Q2_role}`);
  }
  if (textIncludes(Q2_role, "content", "media", "editorial", "social media", "creator")) {
    pathScores["content-engine-operator"].score += 3; pathScores["content-engine-operator"].reasons.push(`role: ${Q2_role}`);
  }
  if (bestKey === "translationAbility") {
    pathScores["content-engine-operator"].score += 1; pathScores["content-engine-operator"].reasons.push("translation advantage applies");
  }
  if (avoidsClientDemands) { pathScores["content-engine-operator"].score -= 1; }
  if (bestKey === "closerInstinct" || bestKey === "systemsBrain") {
    pathScores["lead-gen-operator"].score += 2; pathScores["lead-gen-operator"].reasons.push("closer/systems advantage applies");
  }
  if (textIncludes(Q2_role, "demand gen", "growth", "performance", "lead gen", "sdr", "bdr")) {
    pathScores["lead-gen-operator"].score += 3; pathScores["lead-gen-operator"].reasons.push(`role: ${Q2_role}`);
  }
  if (textIncludes(Q2_role, "recruiter", "talent", "hr", "people ops", "sourcing", "headhunter")) {
    pathScores["niche-talent-placement"].score += 4; pathScores["niche-talent-placement"].reasons.push(`role: ${Q2_role}`);
  }
  if (includes(Q17_avoid, "unpredictable income") && textIncludes(Q16_success, "team", "product", "studio", "scale")) {
    pathScores["studio-builder"].score += 2; pathScores["studio-builder"].reasons.push("wants predictable income + wants to build/scale");
  }
  if (textIncludes(Q2_role, "investor", "vc", "venture", "private equity", "pe ", "fund", "angel")) {
    pathScores["investor-operator"].score += 4; pathScores["investor-operator"].reasons.push(`role: ${Q2_role}`);
  }

  const sortedPaths = Object.entries(pathScores)
    .filter(([slug]) => slug !== "studio-builder")
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([slug, { score, reasons }], idx) => ({
      pathSlug: slug, pathName: PATHS[slug], rank: idx + 1,
      fitScore: Math.min(99, Math.max(40, score * 12 + 40)), reasons,
    }));

  return { primaryAdvantage, allAdvantages, primaryPath: sortedPaths[0], alternativePaths: sortedPaths.slice(1, 3) };
}

// Recommendation generation prompt (copied from recommendation-generator.ts)
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

async function generateRecommendation(answers, scoring) {
  const advantage = UNFAIR_ADVANTAGES[scoring.primaryAdvantage.key];
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
Kids ages: ${answers.Q27_kids_ages || "not provided"}

## Scoring Results

Primary unfair advantage: ${scoring.primaryAdvantage.name}
Evidence for this advantage: ${scoring.primaryAdvantage.evidence.join("; ")}
Primary recommended path: ${scoring.primaryPath.pathName}
Path fit reasons: ${scoring.primaryPath.reasons.join("; ")}
Alternative paths: ${scoring.alternativePaths.map(p => p.pathName).join(", ")}

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
- momFit: 2-3 paragraphs. Be real about the tension between building a business and having kids at their specific ages. Reference their kids' actual ages to make scheduling and time advice concrete. Don't be preachy. Explain why this specific business model works for this stage of life.

Return only the JSON object, no other text.`;

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

const email = process.argv[2];
if (!email) { console.log('Usage: node scripts/score-and-generate.js email@example.com'); process.exit(1); }

async function main() {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) { console.log('User not found:', email); return; }
  console.log('User:', user.id, user.name);

  const sub = await prisma.quizSubmission.findFirst({ where: { userId: user.id } });
  if (!sub) { console.log('No quiz submission found'); return; }

  const rawValues = JSON.parse(sub.answers);
  const answers = mapAnswers(rawValues);
  console.log('\nQuiz answers mapped.');
  console.log('Name:', answers.Q1_name);
  console.log('Role:', answers.Q2_role);
  console.log('Kids:', answers.Q27_kids_ages);

  // Score
  const scoring = scoreFullQuiz(answers);
  console.log('\n=== SCORING ===');
  console.log('Primary advantage:', scoring.primaryAdvantage.name, '(score:', scoring.primaryAdvantage.score + ')');
  console.log('Evidence:', scoring.primaryAdvantage.evidence.join('; '));
  console.log('Primary path:', scoring.primaryPath.pathName, '(fit:', scoring.primaryPath.fitScore + ')');
  console.log('Alt paths:', scoring.alternativePaths.map(p => p.pathName + ' (' + p.fitScore + ')').join(', '));

  // Generate recommendation
  console.log('\n=== GENERATING RECOMMENDATION (this takes ~30s) ===');
  const draft = await generateRecommendation(answers, scoring);
  console.log('Draft generated!');

  // Save UserProfile
  const advantage = UNFAIR_ADVANTAGES[scoring.primaryAdvantage.key];
  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      traits: JSON.stringify([]),
      strengths: JSON.stringify([]),
      constraints: JSON.stringify([]),
      summary: draft.personalIntro.substring(0, 500),
      unfairAdvantageName: advantage.name,
      unfairAdvantageDescription: advantage.description,
      unfairAdvantageEvidence: scoring.primaryAdvantage.evidence.join('. '),
      unfairAdvantageWhy: advantage.description,
      notableExperience: JSON.stringify([]),
    },
    update: {
      summary: draft.personalIntro.substring(0, 500),
      unfairAdvantageName: advantage.name,
      unfairAdvantageDescription: advantage.description,
      unfairAdvantageEvidence: scoring.primaryAdvantage.evidence.join('. '),
      unfairAdvantageWhy: advantage.description,
    },
  });
  console.log('UserProfile saved.');

  // Find primary path in DB
  const primaryPath = await prisma.businessPath.findFirst({ where: { slug: scoring.primaryPath.pathSlug } });

  // Create Recommendation
  const recommendation = await prisma.recommendation.create({
    data: {
      userId: user.id,
      primaryPathId: primaryPath?.id ?? scoring.primaryPath.pathSlug,
      status: 'draft',
      personalIntro: draft.personalIntro,
      personalizedWhy: draft.personalizedWhy,
      pricingDetails: JSON.stringify(draft.pricingDetails),
    },
  });
  console.log('Recommendation created:', recommendation.id);

  // Create RecommendationPath records
  const allPaths = [scoring.primaryPath, ...scoring.alternativePaths];
  for (const scoredPath of allPaths) {
    const dbPath = await prisma.businessPath.findFirst({ where: { slug: scoredPath.pathSlug } });
    if (dbPath) {
      await prisma.recommendationPath.create({
        data: {
          recommendationId: recommendation.id,
          pathId: dbPath.id,
          rank: scoredPath.rank,
          fitScore: scoredPath.fitScore,
          altDescription: scoredPath.rank > 1 ? scoredPath.pathName : null,
        },
      });
      console.log('  Path:', scoredPath.pathName, 'rank:', scoredPath.rank, 'fit:', scoredPath.fitScore);
    } else {
      console.log('  WARNING: Path not found in DB:', scoredPath.pathSlug);
    }
  }

  console.log('\nDONE! Recommendation is in "draft" status.');
  console.log('Approve it in admin to make it visible to the user.');
}

main().catch(console.error).finally(() => pool.end());
