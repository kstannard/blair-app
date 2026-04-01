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

function includes(arr: string[], ...keywords: string[]): boolean {
  return keywords.some((kw) =>
    arr.some((item) => item.toLowerCase().includes(kw.toLowerCase()))
  );
}

function textIncludes(text: string, ...keywords: string[]): boolean {
  return keywords.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
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

  const isSenior = Q3_years === "10-14 years" || Q3_years === "15+ years";
  const isVetted = Q3_years === "15+ years";
  const isComfortable = Q23_outreach.toLowerCase().startsWith("comfortable");
  const isVeryUncomfortable = Q23_outreach.toLowerCase().startsWith("very uncomfortable");
  const hasBreadth = Q4_company_size.length >= 2 || Q5_industries.filter(i => !i.includes("Generalist")).length >= 2;
  const hasNetwork = Q22_network.length >= 2;
  const avoidsConstantSelling = includes(Q17_avoid, "constant selling", "self-promotion");
  const avoidsClientDemands = includes(Q17_avoid, "constant client", "client demand");

  // ---- Network Density ----
  if (hasNetwork) { scores.networkDensity += 2; evidence.networkDensity.push("strong professional network"); }
  if (isComfortable) { scores.networkDensity += 2; evidence.networkDensity.push("comfortable with outreach"); }
  if (isSenior) { scores.networkDensity += 1; evidence.networkDensity.push(`${Q3_years} of experience`); }
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
  if (Q10_work_mode.toLowerCase().includes("deep") || Q10_work_mode.toLowerCase().includes("independent")) {
    scores.systemsBrain += 1; evidence.systemsBrain.push("deep independent work mode");
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
  if (textIncludes(Q2_role, "growth", "gtm", "product marketing", "demand gen", "revenue")) {
    pathScores["gtm-growth-strategist"].score += 3;
    pathScores["gtm-growth-strategist"].reasons.push(`role: ${Q2_role}`);
  }
  if (bestKey === "networkDensity" || bestKey === "closerInstinct") {
    pathScores["gtm-growth-strategist"].score += 2;
    pathScores["gtm-growth-strategist"].reasons.push("strong network/closer advantage");
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
  if (textIncludes(Q2_role, "brand", "content", "communications", "comms", "pr", "marketing", "messaging", "copywriting")) {
    pathScores["messaging-positioning"].score += 2;
    pathScores["messaging-positioning"].reasons.push(`role: ${Q2_role}`);
  }
  if (!avoidsClientDemands) { pathScores["messaging-positioning"].score += 1; }

  // Fractional Operator
  if (bestKey === "patternLibrary" || bestKey === "networkDensity") {
    pathScores["fractional-operator"].score += 2;
    pathScores["fractional-operator"].reasons.push("strong pattern/network advantage");
  }
  if (isSenior && hasBreadth) {
    pathScores["fractional-operator"].score += 2;
    pathScores["fractional-operator"].reasons.push("senior + breadth = fractional credibility");
  }
  if (textIncludes(Q2_role, "vp", "director", "head of", "chief", "cmo", "coo", "cto", "fractional")) {
    pathScores["fractional-operator"].score += 2;
    pathScores["fractional-operator"].reasons.push(`senior title: ${Q2_role}`);
  }
  // Fractional is harder with young kids and limited hours
  if (parseInt(answers.Q25_time) <= 15) { pathScores["fractional-operator"].score -= 1; }

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
  if (bestKey === "translationAbility") {
    pathScores["content-engine-operator"].score += 1;
    pathScores["content-engine-operator"].reasons.push("translation advantage applies");
  }
  // negative: avoid constant client demands
  if (avoidsClientDemands) { pathScores["content-engine-operator"].score -= 1; }

  // Lead Gen Operator
  if (bestKey === "closerInstinct" || bestKey === "systemsBrain") {
    pathScores["lead-gen-operator"].score += 2;
    pathScores["lead-gen-operator"].reasons.push("closer/systems advantage applies");
  }
  if (textIncludes(Q2_role, "demand gen", "growth", "performance", "lead gen", "sdr", "bdr")) {
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

    // Dampen product/build paths when they want same direction
    pathScores["digital-product-builder"].score -= 1;
    pathScores["community-membership-operator"].score -= 1;
    pathScores["micro-saas-builder"].score -= 1;
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
