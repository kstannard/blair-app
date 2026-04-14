/**
 * Full quiz scorer — takes all 27+ Typeform answers and returns:
 * - scored unfair advantage
 * - ranked path recommendations
 */

import { UNFAIR_ADVANTAGES, type UnfairAdvantageKey } from "./unfair-advantages";

export interface FullQuizAnswers {
  // Identity
  Q1_name: string;
  Q2_role: string;
  Q3_years: string;
  Q4_company_size: string[];    // multi-select
  Q5_industries: string[];       // multi-select
  Q6_business_models: string[];  // multi-select
  Q7_shoulder_tap: string[];     // multi-select
  Q8_weirdly_good: string;       // freeform
  Q9_managing: string;
  Q10_work_mode: string;
  Q11_energy_drains: string[];   // multi-select
  Q12_same_or_different: string;
  Q13_blocker: string;
  Q14_interests: string[];       // multi-select
  Q15_scenario: string;
  Q16_success: string;           // freeform
  Q17_avoid: string[];           // multi-select
  Q18_income_timeline: string;
  Q19_zero_income: string;
  Q20_capital: string;
  Q21_borrowing: string;
  Q22_network: string[];         // multi-select
  Q23_outreach: string;
  Q24_visibility: string;
  Q25_time: string;
  Q26_conditions: string;
  Q27_kids_ages: string;          // free text (e.g. "1, 3, 5")
  Q28_linkedin: string;
  Q29_other_links: string;
}

export interface ScoredAdvantage {
  key: UnfairAdvantageKey;
  name: string;
  score: number;
  evidence: string[];  // the specific answers that drove this score
}

export interface PathRecommendation {
  pathSlug: string;
  pathName: string;
  rank: number;
  fitScore: number;
  reasons: string[];
}

export interface FullScoringResult {
  primaryAdvantage: ScoredAdvantage;
  allAdvantages: ScoredAdvantage[];
  primaryPath: PathRecommendation;
  alternativePaths: PathRecommendation[];
}

// Path slug → name mapping (matches DB)
const PATHS: Record<string, string> = {
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

/**
 * Normalize a raw answer string before keyword matching. Typeform stores
 * option labels with en/em dashes and curly quotes, which silently break
 * exact string comparisons and substring checks written against ASCII text.
 * Always run inputs through this before `.includes()` / `===`.
 */
function normalize(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/[–—]/g, "-")      // en dash, em dash → ASCII hyphen
    .replace(/[''‛`]/g, "'")    // curly single quotes → ASCII
    .replace(/[""„]/g, '"')     // curly double quotes → ASCII
    .trim();
}

function includes(arr: string[], ...keywords: string[]): boolean {
  return keywords.some((kw) =>
    arr.some((item) => normalize(item).toLowerCase().includes(kw.toLowerCase()))
  );
}

function textIncludes(text: string, ...keywords: string[]): boolean {
  const t = normalize(text).toLowerCase();
  return keywords.some((kw) => t.includes(kw.toLowerCase()));
}

/**
 * Parse a time-range answer like "6-8 hours (a few focused evenings...)"
 * or "10-15 hours/week" and return the midpoint of the range. Returns the
 * first number if no range is present. Used for thresholds like lowHours,
 * since parseInt("10-15") returns 10 (the floor) which puts 10-15 hour
 * users in the same penalty bucket as 3-5 hour users.
 */
function parseHoursMidpoint(s: string): number {
  const match = normalize(s).match(/(\d+)\s*-\s*(\d+)/);
  if (match) return (parseInt(match[1]) + parseInt(match[2])) / 2;
  const single = normalize(s).match(/(\d+)/);
  return single ? parseInt(single[1]) : 0;
}

export function scoreFullQuiz(answers: FullQuizAnswers): FullScoringResult {
  const scores: Record<UnfairAdvantageKey, number> = {
    networkDensity: 0,
    patternLibrary: 0,
    translationAbility: 0,
    systemsBrain: 0,
    closerInstinct: 0,
  };
  const evidence: Record<UnfairAdvantageKey, string[]> = {
    networkDensity: [],
    patternLibrary: [],
    translationAbility: [],
    systemsBrain: [],
    closerInstinct: [],
  };

  const {
    Q2_role, Q3_years, Q4_company_size, Q5_industries,
    Q7_shoulder_tap, Q8_weirdly_good, Q10_work_mode,
    Q11_energy_drains, Q16_success, Q17_avoid, Q22_network, Q23_outreach,
  } = answers;

  // Normalize Q3_years so en-dash variants ("10–14 years") match the
  // ASCII hyphen the code was originally written against. Without this,
  // isSenior was silently false for every real Typeform user.
  const q3Normalized = normalize(Q3_years);
  const isSenior = q3Normalized === "10-14 years" || q3Normalized === "15+ years";
  const isVetted = q3Normalized === "15+ years";
  const q23Normalized = normalize(Q23_outreach).toLowerCase();
  const isComfortable = q23Normalized.startsWith("comfortable");
  const isVeryUncomfortable = q23Normalized.startsWith("very uncomfortable");
  const hasBreadth =
    Q4_company_size.length >= 2 ||
    Q5_industries.filter((i) => !normalize(i).toLowerCase().includes("generalist")).length >= 2;
  const hasNetwork =
    Q22_network.length >= 2 ||
    (Q22_network.length === 1 && includes(Q22_network, "decision-makers", "executives", "founders"));

  // Q17_avoid keyword checks — broaden beyond "constant selling" to catch
  // the real Typeform option text ("Having to consistently sell, network,
  // or market myself to get work") and variations across form edits.
  const avoidsConstantSelling = includes(
    Q17_avoid,
    "constant selling",
    "consistently sell",
    "sell, network",
    "market myself",
    "self-promot"
  );
  const avoidsClientDemands = includes(
    Q17_avoid,
    "constant client",
    "client demand",
    "fire drill"
  );

  // ---- Network Density ----
  if (hasNetwork) { scores.networkDensity += 2; evidence.networkDensity.push("strong professional network"); }
  if (isComfortable) { scores.networkDensity += 2; evidence.networkDensity.push("comfortable with outreach"); }
  if (isSenior) { scores.networkDensity += 1; evidence.networkDensity.push(`${Q3_years} of experience`); }
  if (textIncludes(Q2_role, "sales", "partnerships", "revops", "business development", "account executive")) {
    scores.networkDensity += 1; evidence.networkDensity.push("sales/partnerships role = strong network");
  }
  if (includes(Q7_shoulder_tap, "strategy")) { scores.networkDensity += 1; evidence.networkDensity.push("people tap them for strategy"); }
  // negative
  if (isVeryUncomfortable) { scores.networkDensity = 0; evidence.networkDensity = ["very uncomfortable with outreach — network won't convert"]; }

  // ---- Pattern Library ----
  if (isVetted) { scores.patternLibrary += 2; evidence.patternLibrary.push("15+ years of experience"); }
  else if (isSenior) { scores.patternLibrary += 1; evidence.patternLibrary.push("10+ years of experience"); }
  if (hasBreadth) { scores.patternLibrary += 2; evidence.patternLibrary.push("breadth across company sizes and/or industries"); }
  if (includes(Q7_shoulder_tap, "fixer", "strategy")) { scores.patternLibrary += 1; evidence.patternLibrary.push("shoulder-tapped as Fixer or Strategy"); }
  if (textIncludes(Q8_weirdly_good, "pattern", "diagnose", "see", "spot", "recognize")) {
    scores.patternLibrary += 1; evidence.patternLibrary.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  // negative: deep experience but only one company/industry
  if (!hasBreadth && isSenior) { scores.patternLibrary = Math.max(0, scores.patternLibrary - 1); }

  // ---- Translation Ability ----
  if (includes(Q7_shoulder_tap, "creative")) { scores.translationAbility += 3; evidence.translationAbility.push("shoulder-tapped as The Creative"); }
  if (textIncludes(Q2_role, "brand", "content", "communications", "comms", "pr ", "marketing", "messaging", "copywriting")) {
    scores.translationAbility += 2; evidence.translationAbility.push(`role: ${Q2_role}`);
  }
  if (includes(Q7_shoulder_tap, "strategy")) { scores.translationAbility += 1; evidence.translationAbility.push("also shoulder-tapped for strategy"); }
  if (textIncludes(Q8_weirdly_good, "explain", "write", "story", "message", "communicate", "translate", "narrative", "deck", "pitch")) {
    scores.translationAbility += 1; evidence.translationAbility.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  // negative: technical or ops role with Creative tap but no comms background
  if (includes(Q7_shoulder_tap, "creative") && textIncludes(Q2_role, "engineer", "data", "technical", "operations") && !textIncludes(Q2_role, "brand", "content", "communications")) {
    scores.translationAbility = Math.max(0, scores.translationAbility - 2);
  }

  // ---- Systems Brain ----
  if (includes(Q7_shoulder_tap, "fixer")) { scores.systemsBrain += 3; evidence.systemsBrain.push("shoulder-tapped as The Fixer"); }
  if (textIncludes(Q2_role, "operations", "ops", "engineer", "technical", "product", "program manager", "chief of staff", "coo")) {
    scores.systemsBrain += 2; evidence.systemsBrain.push(`role: ${Q2_role}`);
  }
  // Q10 work mode — catch "Deep focused creation" AND "Owned execution with
  // some collaboration - clear ownership, focused build time". The latter is
  // the most common answer from systems-brain users and was previously unscored.
  if (textIncludes(Q10_work_mode, "deep", "independent", "owned", "ownership", "focused", "solo")) {
    scores.systemsBrain += 1; evidence.systemsBrain.push("deep/owned independent work mode");
  }
  if (textIncludes(Q8_weirdly_good, "system", "automat", "process", "workflow", "build", "fix", "infrastructure")) {
    scores.systemsBrain += 1; evidence.systemsBrain.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  // negative: fixer but people-oriented instinct
  if (includes(Q7_shoulder_tap, "fixer") && textIncludes(Q2_role, "hr", "people", "talent", "recruiter")) {
    scores.systemsBrain = Math.max(0, scores.systemsBrain - 1);
  }

  // ---- Closer Instinct ----
  if (textIncludes(Q2_role, "sales", "partnerships", "revops", "business development", "bd ", "account executive", "ae ", "customer success", "cs ")) {
    scores.closerInstinct += 3; evidence.closerInstinct.push(`role: ${Q2_role}`);
  }
  if (isComfortable) { scores.closerInstinct += 1; evidence.closerInstinct.push("comfortable with outreach"); }
  if (includes(Q7_shoulder_tap, "strategy")) { scores.closerInstinct += 1; evidence.closerInstinct.push("shoulder-tapped for strategy"); }
  if (textIncludes(Q8_weirdly_good, "sell", "persuade", "close", "deal", "negotiat", "relationship", "trust")) {
    scores.closerInstinct += 1; evidence.closerInstinct.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  // hard negative: hates selling
  if (avoidsConstantSelling) {
    scores.closerInstinct = Math.max(0, scores.closerInstinct - 2);
    evidence.closerInstinct.push("NEGATIVE: wants to avoid constant selling");
  }

  // Tiebreak: most specific/surprising first
  const tiebreakOrder: UnfairAdvantageKey[] = [
    "translationAbility",
    "patternLibrary",
    "closerInstinct",
    "systemsBrain",
    "networkDensity",
  ];

  let bestKey = tiebreakOrder[0];
  let bestScore = scores[bestKey];
  for (const key of tiebreakOrder) {
    if (scores[key] > bestScore) { bestKey = key; bestScore = scores[key]; }
  }

  const allAdvantages: ScoredAdvantage[] = tiebreakOrder.map((key) => ({
    key,
    name: UNFAIR_ADVANTAGES[key].name,
    score: scores[key],
    evidence: evidence[key],
  })).sort((a, b) => b.score - a.score);

  const primaryAdvantage = allAdvantages[0];

  // ---- Path scoring ----
  const pathScores: Record<string, { score: number; reasons: string[] }> = {};
  for (const slug of Object.keys(PATHS)) {
    pathScores[slug] = { score: 0, reasons: [] };
  }

  // GTM & Growth Strategist
  if (textIncludes(Q2_role, "growth", "gtm", "product marketing", "demand gen", "revenue", "sales", "partnerships", "revops", "business development", "account executive")) {
    pathScores["gtm-growth-strategist"].score += 3;
    pathScores["gtm-growth-strategist"].reasons.push(`role: ${Q2_role}`);
  }
  if (bestKey === "networkDensity" || bestKey === "closerInstinct" || bestKey === "patternLibrary") {
    pathScores["gtm-growth-strategist"].score += 2;
    pathScores["gtm-growth-strategist"].reasons.push("strong network/closer/pattern advantage");
  }
  if (includes(Q5_industries, "saas", "software", "tech", "b2b")) {
    pathScores["gtm-growth-strategist"].score += 1;
    pathScores["gtm-growth-strategist"].reasons.push("tech industry background");
  }

  // Messaging & Positioning Specialist
  if (bestKey === "translationAbility") {
    pathScores["messaging-positioning"].score += 4;
    pathScores["messaging-positioning"].reasons.push("primary advantage is Translation Ability");
  }
  // Note: "pr" removed from this list because it's a substring of "product"
  // and was silently matching every PM role. Real Typeform role options don't
  // include brand/content/comms/PR as first-class choices anyway — the only
  // Messaging role match in the current taxonomy is "Performance Marketing"
  // inside the "Growth / Performance Marketing / Lifecycle" option.
  if (textIncludes(Q2_role, "brand", "content", "communications", "comms", "marketing", "messaging", "copywriting")) {
    pathScores["messaging-positioning"].score += 2;
    pathScores["messaging-positioning"].reasons.push(`role: ${Q2_role}`);
  }
  if (!avoidsClientDemands) { pathScores["messaging-positioning"].score += 1; }

  // Fractional Operator — any senior role can go fractional
  if (bestKey === "patternLibrary" || bestKey === "networkDensity") {
    pathScores["fractional-operator"].score += 2;
    pathScores["fractional-operator"].reasons.push("strong pattern/network advantage");
  }
  if (isSenior) {
    pathScores["fractional-operator"].score += 2;
    pathScores["fractional-operator"].reasons.push(`${Q3_years} of experience = fractional credibility`);
  }
  if (isSenior && hasBreadth) {
    pathScores["fractional-operator"].score += 1;
    pathScores["fractional-operator"].reasons.push("breadth across company sizes/industries");
  }
  // Explicit senior title is a bonus (VP/Director/Head of/Chief, or anyone
  // already fractional). Product, Finance, Legal, Research, etc. all go
  // fractional too and get picked up by the isSenior branch above.
  if (textIncludes(Q2_role, "vp", "director", "head of", "chief", "cmo", "coo", "cto", "cfo", "fractional", "principal")) {
    pathScores["fractional-operator"].score += 1;
    pathScores["fractional-operator"].reasons.push(`senior title: ${Q2_role}`);
  }

  // Automation & Systems Builder
  if (bestKey === "systemsBrain") {
    pathScores["automation-systems-builder"].score += 4;
    pathScores["automation-systems-builder"].reasons.push("primary advantage is Systems Brain");
  }
  if (textIncludes(Q2_role, "engineer", "technical", "data", "ops", "product", "automation", "revops")) {
    pathScores["automation-systems-builder"].score += 2;
    pathScores["automation-systems-builder"].reasons.push(`role: ${Q2_role}`);
  }

  // Content Engine Operator
  if (textIncludes(Q2_role, "content", "media", "editorial", "social media", "creator")) {
    pathScores["content-engine-operator"].score += 3;
    pathScores["content-engine-operator"].reasons.push(`role: ${Q2_role}`);
  }
  // Enablement / L&D / Training roles package deeply as content/curriculum
  // businesses — previously unscored. Also boosts Niche Talent because L&D
  // people often come from HR and know the talent-development market.
  if (textIncludes(Q2_role, "enablement", "l&d", "training", "learning", "curriculum")) {
    pathScores["content-engine-operator"].score += 3;
    pathScores["content-engine-operator"].reasons.push(`enablement/L&D role: ${Q2_role}`);
    pathScores["niche-talent-placement"].score += 1;
  }
  if (bestKey === "translationAbility") {
    pathScores["content-engine-operator"].score += 1;
    pathScores["content-engine-operator"].reasons.push("translation advantage applies");
  }
  // Q14 "Curating knowledge and resources" → strong content/curation signal
  if (includes(answers.Q14_interests, "curating knowledge", "curating", "resources")) {
    pathScores["content-engine-operator"].score += 2;
    pathScores["content-engine-operator"].reasons.push("interested in curating knowledge/resources");
  }
  // negative: avoid constant client demands
  if (avoidsClientDemands) { pathScores["content-engine-operator"].score -= 1; }

  // Lead Gen Operator — outbound sales / demand gen role, not a generic
  // systems path. Requires actual closer instinct or a sales/growth role.
  if (bestKey === "closerInstinct") {
    pathScores["lead-gen-operator"].score += 2;
    pathScores["lead-gen-operator"].reasons.push("closer advantage applies");
  }
  if (textIncludes(Q2_role, "demand gen", "growth", "performance marketing", "lead gen", "sdr", "bdr", "sales", "revops")) {
    pathScores["lead-gen-operator"].score += 3;
    pathScores["lead-gen-operator"].reasons.push(`role: ${Q2_role}`);
  }

  // Niche Talent & Placement
  if (textIncludes(Q2_role, "recruiter", "talent", "hr", "people ops", "sourcing", "headhunter")) {
    pathScores["niche-talent-placement"].score += 4;
    pathScores["niche-talent-placement"].reasons.push(`role: ${Q2_role}`);
  }
  if (bestKey === "networkDensity" && textIncludes(Q2_role, "recruiter", "talent", "hr")) {
    pathScores["niche-talent-placement"].score += 2;
    pathScores["niche-talent-placement"].reasons.push("network advantage + talent background");
  }

  // Studio Builder — only a starting point if they're building a practice they want to scale/productize
  if (includes(Q17_avoid, "unpredictable income") && textIncludes(Q16_success, "team", "product", "studio", "scale")) {
    pathScores["studio-builder"].score += 2;
    pathScores["studio-builder"].reasons.push("wants predictable income + wants to build/scale");
  }

  // Investor-Operator — rare, needs specific signals
  if (textIncludes(Q2_role, "investor", "vc", "venture", "private equity", "pe ", "fund", "angel")) {
    pathScores["investor-operator"].score += 4;
    pathScores["investor-operator"].reasons.push(`role: ${Q2_role}`);
  }

  // ---- Digital Product Builder ----
  // For people who want to build something they own, not sell their time
  if (textIncludes(answers.Q16_success, "wealth", "equity", "passive", "scale", "product")) {
    pathScores["digital-product-builder"].score += 2;
    pathScores["digital-product-builder"].reasons.push("wants wealth creation / scalable income");
  }
  if (includes(answers.Q14_interests, "system", "tool", "workflow", "template", "content")) {
    pathScores["digital-product-builder"].score += 1;
    pathScores["digital-product-builder"].reasons.push("interested in building tools/systems/content");
  }
  if (isSenior && hasBreadth) {
    pathScores["digital-product-builder"].score += 1;
    pathScores["digital-product-builder"].reasons.push("deep expertise that can be productized");
  }
  if (textIncludes(answers.Q15_scenario, "async")) {
    pathScores["digital-product-builder"].score += 1;
    pathScores["digital-product-builder"].reasons.push("prefers async work (fits product model)");
  }
  // Q15 "Designing systems that others can eventually run" is classic
  // build-once-sell-many / productization signal. Boosts digital product,
  // micro-saas, and studio-builder (where studio-as-system applies).
  if (textIncludes(answers.Q15_scenario, "designing systems", "others can eventually run")) {
    pathScores["digital-product-builder"].score += 2;
    pathScores["digital-product-builder"].reasons.push("wants to design systems others can run");
    pathScores["micro-saas-builder"].score += 1;
    pathScores["studio-builder"].score += 1;
  }
  if (avoidsClientDemands) {
    pathScores["digital-product-builder"].score += 2;
    pathScores["digital-product-builder"].reasons.push("wants to avoid constant client demands (products solve this)");
  }

  // ---- Community & Membership Operator ----
  if (hasNetwork) {
    pathScores["community-membership-operator"].score += 2;
    pathScores["community-membership-operator"].reasons.push("strong existing network to seed community");
  }
  if (isComfortable) {
    pathScores["community-membership-operator"].score += 1;
    pathScores["community-membership-operator"].reasons.push("comfortable with outreach");
  }
  if (isSenior) {
    pathScores["community-membership-operator"].score += 1;
    pathScores["community-membership-operator"].reasons.push("seniority = credibility as community curator");
  }
  if (textIncludes(Q8_weirdly_good, "connect", "bring together", "community", "gather", "friends", "group", "plan")) {
    pathScores["community-membership-operator"].score += 2;
    pathScores["community-membership-operator"].reasons.push(`self-described: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  // Q14 "Connecting people and building community" is a direct community
  // path signal that was previously unscored. Also lightly boosts niche
  // talent (network-driven placement is adjacent to community-building).
  if (includes(answers.Q14_interests, "connecting people", "building community", "community")) {
    pathScores["community-membership-operator"].score += 2;
    pathScores["community-membership-operator"].reasons.push("interested in connecting people/community");
    pathScores["niche-talent-placement"].score += 1;
  }
  if (textIncludes(answers.Q16_success, "time flexibility", "control")) {
    pathScores["community-membership-operator"].score += 1;
    pathScores["community-membership-operator"].reasons.push("wants flexibility (community model supports this)");
  }

  // ---- Micro-SaaS Builder ----
  if (bestKey === "systemsBrain") {
    pathScores["micro-saas-builder"].score += 3;
    pathScores["micro-saas-builder"].reasons.push("Systems Brain advantage aligns with tool building");
  }
  if (textIncludes(Q2_role, "product", "engineer", "technical", "data", "automation")) {
    pathScores["micro-saas-builder"].score += 3;
    pathScores["micro-saas-builder"].reasons.push(`technical/product background: ${Q2_role}`);
  }
  if (includes(Q7_shoulder_tap, "fixer") && textIncludes(Q2_role, "product", "engineer", "technical", "ops")) {
    pathScores["micro-saas-builder"].score += 2;
    pathScores["micro-saas-builder"].reasons.push("fixer instinct + technical background = tool builder");
  }
  if (textIncludes(Q8_weirdly_good, "tool", "dashboard", "automat", "build", "system", "workflow", "internal")) {
    pathScores["micro-saas-builder"].score += 2;
    pathScores["micro-saas-builder"].reasons.push(`builds tools: "${Q8_weirdly_good.substring(0, 60)}"`);
  }
  if (includes(answers.Q14_interests, "system", "tool", "workflow", "automat", "technology", "solving")) {
    pathScores["micro-saas-builder"].score += 1;
    pathScores["micro-saas-builder"].reasons.push("interested in building tools/systems");
  }
  if (textIncludes(answers.Q16_success, "wealth", "equity", "scale", "own")) {
    pathScores["micro-saas-builder"].score += 2;
    pathScores["micro-saas-builder"].reasons.push("wants scalable/equity outcomes");
  }
  if (avoidsClientDemands) {
    pathScores["micro-saas-builder"].score += 1;
    pathScores["micro-saas-builder"].reasons.push("wants to avoid client demands (SaaS = customers, not clients)");
  }

  // ---- "Different direction" modifier ----
  // When someone says they want something new, boost product/build paths
  // and dampen paths that mirror their current corporate role
  const wantsDifferent = textIncludes(answers.Q12_same_or_different, "different");
  const wantsSame = textIncludes(answers.Q12_same_or_different, "same");

  if (wantsDifferent) {
    // Boost non-service paths
    pathScores["digital-product-builder"].score += 2;
    pathScores["digital-product-builder"].reasons.push("wants a different direction (product path)");
    pathScores["community-membership-operator"].score += 1;
    pathScores["community-membership-operator"].reasons.push("wants a different direction");
    pathScores["micro-saas-builder"].score += 1;
    pathScores["micro-saas-builder"].reasons.push("wants a different direction (build path)");

    // Dampen paths that are "do what you did, but freelance"
    if (textIncludes(Q2_role, "operations", "ops", "coo", "chief of staff", "program manager")) {
      pathScores["fractional-operator"].score -= 2;
      pathScores["fractional-operator"].reasons.push("DAMPENED: wants different direction from ops role");
    }
    if (textIncludes(Q2_role, "brand", "content", "communications", "marketing", "messaging")) {
      pathScores["messaging-positioning"].score -= 1;
      pathScores["messaging-positioning"].reasons.push("DAMPENED: wants different direction from marketing role");
      pathScores["content-engine-operator"].score -= 1;
    }
    if (textIncludes(Q2_role, "sales", "partnerships", "business development")) {
      pathScores["lead-gen-operator"].score -= 1;
      pathScores["lead-gen-operator"].reasons.push("DAMPENED: wants different direction from sales role");
    }

    // Dampen community path unless they have strong connector signals
    if (!textIncludes(Q8_weirdly_good, "connect", "bring together", "community", "gather", "friends", "group", "plan")) {
      pathScores["community-membership-operator"].score -= 1;
      pathScores["community-membership-operator"].reasons.push("DAMPENED: no strong connector signals in Q8");
    }
  }

  // ---- "Same direction" modifier ----
  // When someone wants to keep doing what they're good at, boost the service
  // paths that match their current role and dampen product/build paths
  if (wantsSame) {
    // Boost service paths that match their role
    if (textIncludes(Q2_role, "operations", "ops", "coo", "chief of staff", "program manager", "vp", "director", "head of")) {
      pathScores["fractional-operator"].score += 3;
      pathScores["fractional-operator"].reasons.push("wants same direction + senior ops/leadership role");
    }
    if (textIncludes(Q2_role, "brand", "content", "communications", "marketing", "messaging", "copywriting")) {
      pathScores["messaging-positioning"].score += 2;
      pathScores["messaging-positioning"].reasons.push("wants same direction + marketing/comms role");
      pathScores["content-engine-operator"].score += 1;
    }
    if (textIncludes(Q2_role, "growth", "gtm", "product marketing", "demand gen", "revenue")) {
      pathScores["gtm-growth-strategist"].score += 2;
      pathScores["gtm-growth-strategist"].reasons.push("wants same direction + growth role");
    }
    if (textIncludes(Q2_role, "sales", "partnerships", "business development")) {
      pathScores["lead-gen-operator"].score += 2;
      pathScores["lead-gen-operator"].reasons.push("wants same direction + sales role");
    }
    if (textIncludes(Q2_role, "engineer", "technical", "data", "automation", "revops")) {
      pathScores["automation-systems-builder"].score += 2;
      pathScores["automation-systems-builder"].reasons.push("wants same direction + technical role");
    }
    if (textIncludes(Q2_role, "recruiter", "talent", "hr", "people ops")) {
      pathScores["niche-talent-placement"].score += 2;
      pathScores["niche-talent-placement"].reasons.push("wants same direction + talent role");
    }

    // Catch-all: any senior who wants the same direction can go fractional.
    // Senior PMs, finance, legal, research, strategy, etc. don't match the
    // role-specific branches above but can all build fractional practices.
    if (isSenior) {
      pathScores["fractional-operator"].score += 2;
      pathScores["fractional-operator"].reasons.push(`wants same direction + senior role (${Q2_role})`);
    }

    // Dampen product/build paths when they want same direction
    pathScores["digital-product-builder"].score -= 1;
    pathScores["community-membership-operator"].score -= 1;
    pathScores["micro-saas-builder"].score -= 1;
  }

  // ---- Hard-constraint penalties ----
  // Apply after all boosts. These catch users whose top-scoring path
  // directly violates something they explicitly said they want to avoid.
  // Signals come from Q13 (blocker), Q16 (success picture), and Q17 (avoid).
  const scaredOfFinancialRisk = textIncludes(
    answers.Q13_blocker,
    "financial risk",
    "money",
    "income",
    "savings"
  );
  // Q17 has two "predictable income" options with different phrasing
  // ("Unpredictable income or feast-or-famine cycles", "Income that is
  // unpredictable month to month"). Match both, plus Q16 where they can
  // positively pick "Stable and predictable income I can count on" or
  // "Reliable income outside my job".
  const avoidsUnpredictableIncome =
    includes(Q17_avoid, "unpredictable income", "unpredictable month", "feast-or-famine", "feast or famine") ||
    textIncludes(answers.Q16_success, "stable and predictable", "reliable income", "predictable income");
  const avoidsFullTimeJobFeel = includes(
    Q17_avoid,
    "full-time job",
    "another full-time job"
  );
  // parseInt("10-15 hours") = 10 (the floor), which wrongly put 10-15 hour
  // users in the same bucket as 3-5 hour users. Use the midpoint instead.
  const hoursAvailable = parseHoursMidpoint(answers.Q25_time);
  const lowHours = hoursAvailable > 0 && hoursAvailable < 10;

  if (scaredOfFinancialRisk || avoidsUnpredictableIncome) {
    // Paths with long time-to-revenue and unpredictable income get penalized.
    // Calibrated so these don't crater — they should drop out of primary
    // consideration but can still appear as Alt 2/3 if the user has strong
    // product-building signals (systemsBrain, product role, Q16 wealth).
    pathScores["micro-saas-builder"].score -= 2;
    pathScores["micro-saas-builder"].reasons.push("PENALTY: long time-to-MRR conflicts with income predictability");
    pathScores["digital-product-builder"].score -= 2;
    pathScores["digital-product-builder"].reasons.push("PENALTY: product income is unpredictable early on");
    pathScores["community-membership-operator"].score -= 2;
    pathScores["community-membership-operator"].reasons.push("PENALTY: community revenue is slow to build");
  }
  if (scaredOfFinancialRisk) {
    // Fractional is the safest cash-first path: paid from week one
    pathScores["fractional-operator"].score += 4;
    pathScores["fractional-operator"].reasons.push("BOOST: scared of financial risk — fractional gets paid immediately");
    pathScores["messaging-positioning"].score += 1;
    pathScores["niche-talent-placement"].score += 1;
  }
  if (avoidsFullTimeJobFeel) {
    // "Feeling like I just created another full-time job with no flexibility"
    // is a huge signal for async/leveraged paths and against high-touch
    // retainer work. Boost product and passive-leaning paths; penalize the
    // paths that require constant client availability.
    pathScores["digital-product-builder"].score += 1;
    pathScores["digital-product-builder"].reasons.push("BOOST: wants async/leveraged over full-time feel");
    pathScores["micro-saas-builder"].score += 1;
    pathScores["micro-saas-builder"].reasons.push("BOOST: wants async/leveraged over full-time feel");
    pathScores["content-engine-operator"].score -= 1;
    pathScores["content-engine-operator"].reasons.push("PENALTY: continuous content can feel like another full-time job");
  }
  if (lowHours) {
    // Paths that need high-volume continuous output struggle at <10 hours
    pathScores["micro-saas-builder"].score -= 2;
    pathScores["content-engine-operator"].score -= 2;
  }

  // Sort paths by score, exclude studio-builder from primary recommendation
  const sortedPaths = Object.entries(pathScores)
    .filter(([slug]) => slug !== "studio-builder") // studio is a graduation, not a start
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([slug, { score, reasons }], idx) => ({
      pathSlug: slug,
      pathName: PATHS[slug],
      rank: idx + 1,
      fitScore: Math.min(99, Math.max(40, score * 12 + 40)), // normalize to 40-99
      reasons,
    }));

  return {
    primaryAdvantage,
    allAdvantages,
    primaryPath: sortedPaths[0],
    alternativePaths: sortedPaths.slice(1, 3),
  };
}
