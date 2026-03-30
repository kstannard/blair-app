import { UNFAIR_ADVANTAGES } from "./unfair-advantages";

export interface MiniQuizAnswers {
  name: string;
  email: string;
  role: string;
  years: string;
  companySize: string[];
  shoulderTap: string[];
  outreachComfort: string;
  industries: string[];
  kidsAges: string[];
}

interface ScoredAdvantage {
  key: string;
  name: string;
  oneLiner: string;
  description: string;
  score: number;
}

export function scoreMiniQuiz(answers: MiniQuizAnswers): ScoredAdvantage {
  const scores: Record<string, number> = {
    networkDensity: 0,
    patternLibrary: 0,
    translationAbility: 0,
    systemsBrain: 0,
    closerInstinct: 0,
  };

  const { role, years, companySize, shoulderTap, outreachComfort, industries } =
    answers;

  const isComfortable = outreachComfort.startsWith("Comfortable");
  const isSenior = years === "10-14 years" || years === "15+ years";
  const hasCompanyBreadth = companySize.length >= 2;
  const hasIndustryBreadth = industries.filter((i) => i !== "Generalist / Industry-Agnostic" && i !== "Other").length >= 2;

  const tapIncludes = (keyword: string) =>
    shoulderTap.some((s) => s.toLowerCase().includes(keyword.toLowerCase()));

  const roleIncludes = (...keywords: string[]) =>
    keywords.some((k) => role.toLowerCase().includes(k.toLowerCase()));

  // --- Network Density ---
  // "You already know the people who would pay you"
  if (isComfortable) scores.networkDensity += 2;
  if (isSenior) scores.networkDensity += 1;
  // Slight boost if not a fixer/creative (more relationship-oriented)
  if (!tapIncludes("fixer") && !tapIncludes("creative"))
    scores.networkDensity += 1;

  // --- Pattern Library ---
  // "You've seen this problem break the same way at enough companies"
  if (years === "15+ years") scores.patternLibrary += 2;
  else if (years === "10-14 years") scores.patternLibrary += 1;
  if (hasCompanyBreadth) scores.patternLibrary += 1;
  if (hasIndustryBreadth) scores.patternLibrary += 1;
  if (tapIncludes("strategy") || tapIncludes("fixer"))
    scores.patternLibrary += 1;

  // --- Translation Ability ---
  // "You make the complicated clear"
  if (tapIncludes("creative")) scores.translationAbility += 2;
  if (
    roleIncludes(
      "brand",
      "content",
      "communications",
      "marketing",
      "messaging"
    )
  )
    scores.translationAbility += 2;
  if (tapIncludes("strategy")) scores.translationAbility += 1;

  // --- Systems Brain ---
  // "You see how things should work and build the fix"
  if (tapIncludes("fixer")) scores.systemsBrain += 2;
  if (
    roleIncludes(
      "engineering",
      "technical",
      "operations",
      "bizops",
      "product management"
    )
  )
    scores.systemsBrain += 1;
  if (tapIncludes("truth")) scores.systemsBrain += 1;

  // --- Closer Instinct ---
  // "You know how to get people to yes"
  if (
    roleIncludes(
      "sales",
      "partnerships",
      "revops",
      "customer success",
      "account management"
    )
  )
    scores.closerInstinct += 2;
  if (isComfortable) scores.closerInstinct += 1;
  if (tapIncludes("strategy")) scores.closerInstinct += 1;

  // --- Apply negative signals ---
  // Don't assign Network Density if they're very uncomfortable reaching out
  if (outreachComfort.startsWith("Very uncomfortable"))
    scores.networkDensity = 0;

  // Find the winner. Tiebreak order: Translation > Pattern > Closer > Systems > Network
  // (most surprising/delightful first)
  const tiebreakOrder = [
    "translationAbility",
    "patternLibrary",
    "closerInstinct",
    "systemsBrain",
    "networkDensity",
  ];

  let bestKey = tiebreakOrder[0];
  let bestScore = scores[bestKey];

  for (const key of tiebreakOrder) {
    if (scores[key] > bestScore) {
      bestKey = key;
      bestScore = scores[key];
    }
  }

  const advantage =
    UNFAIR_ADVANTAGES[bestKey as keyof typeof UNFAIR_ADVANTAGES];

  return {
    key: bestKey,
    name: advantage.name,
    oneLiner: advantage.oneLiner,
    description: advantage.description,
    score: bestScore,
  };
}
