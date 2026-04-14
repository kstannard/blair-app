// Re-score every QuizSubmission through the current scorer and print a
// before/after comparison: stored top-3 vs freshly-computed top-3.
// Read-only — does not touch any DB rows.
//
// Run with: npx tsx scripts/rescore-all-users.ts

import "dotenv/config";
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

import { Pool } from "pg";
import { scoreFullQuiz, type FullQuizAnswers } from "../src/lib/scoring/full-quiz-scorer";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const TYPEFORM_FIELD_MAP: Record<string, keyof FullQuizAnswers> = {
  "dc0389bc-6cee-4d60-9424-641ce62c23b2": "Q1_name",
  "7a04081f-1257-4fe2-94d8-9b51cb4b61cc": "Q2_role",
  "adaaf514-3035-447f-a9a9-df243128354c": "Q3_years",
  "8c46376a-7993-46d0-b2bf-0c52e0bcedce": "Q4_company_size",
  "1141c3fc-a9df-4de6-8454-6106acf2e6d2": "Q5_industries",
  "c3dd18e5-56a7-4da0-be70-13a9fed1a24c": "Q6_business_models",
  "6192dd0d-d6c9-4aa2-83e9-11952277e523": "Q7_shoulder_tap",
  "3eeeb4f3-a480-49d6-8694-e1d74e7030de": "Q8_weirdly_good",
  "4afa164c-51b5-4e83-9188-2960fb932dfa": "Q9_managing",
  "ccb59b99-2f9c-444f-8b7c-35c1c1ac0294": "Q10_work_mode",
  "d067be6e-8a79-4ffc-a0d3-78d354726aed": "Q11_energy_drains",
  "23bf71b0-2703-45eb-8a4d-8abec6d8f692": "Q12_same_or_different",
  "9c0a202b-c457-4d76-8187-840e57032f08": "Q13_blocker",
  "395674d6-78fe-4477-8d68-92f415b4a36d": "Q14_interests",
  "571af747-2ac1-4ebf-be8f-ff77af3ff7ac": "Q15_scenario",
  "43e86f36-01ee-4fe0-a57b-9a180c91b8e5": "Q16_success",
  "30a2997b-0846-4d80-aa87-df3636f356ee": "Q17_avoid",
  "e05f7717-695d-45ff-be18-722495337650": "Q18_income_timeline",
  "be9095c3-6c48-428d-902e-4b0ce60996cb": "Q19_zero_income",
  "3b2203ca-afd6-460d-a9a7-05579dada795": "Q20_capital",
  "b0ac307d-c42a-4544-b8cd-4fcea6628e6c": "Q21_borrowing",
  "c91b94e8-8c89-45ab-bf9c-8605706a685f": "Q22_network",
  "0c854db4-c2b4-4aff-aba8-17840b28d004": "Q23_outreach",
  "d0c4febb-6e09-43e9-8c36-5422ec6c624d": "Q24_visibility",
  "8729215f-ea9b-48f4-a713-ac5ee02ad25e": "Q25_time",
  "37b4d94f-818f-4ad5-8d5b-ce386c535455": "Q26_conditions",
  "19b28a68-2fb0-48f1-b316-61736509bf26": "Q27_kids_ages",
  "56b0517f-4404-4a5f-98d6-2f8e612f8886": "Q28_linkedin",
  "9573764e-c2ac-45e6-987f-79d279013191": "Q29_other_links",
};

// Mirror the webhook mapping: str() vs multi(). Q16_success is str() even
// though it's a multi-select in the form, because the webhook's extractAnswerValue
// joins choice labels with ", " when type === "choices". Stay consistent
// with how the scorer sees data at runtime.
const MULTI_KEYS = new Set<keyof FullQuizAnswers>([
  "Q4_company_size",
  "Q5_industries",
  "Q6_business_models",
  "Q7_shoulder_tap",
  "Q11_energy_drains",
  "Q14_interests",
  "Q17_avoid",
  "Q22_network",
]);

/**
 * Split a comma-joined multi-select string into individual options,
 * handling the fact that some option labels (like "Constant client demands,
 * urgency, or fire drills" or "Decision-makers at startups or tech companies
 * (founders / execs / heads of function)") contain commas inside them.
 *
 * Strategy: split on ", " ONLY when the comma is followed by a capital-letter
 * word OR "The ". That's the format of real option starts in this quiz.
 * It's pragmatic, not perfect, but works for the actual stored values.
 */
function splitMulti(joined: string): string[] {
  if (!joined) return [];
  // Common option starters across the form
  const parts: string[] = [];
  // Known option prefixes that start new items
  const starters = [
    "The ", "I ", "I'm", "Having", "Feeling", "Managing", "Being", "Creating",
    "Constant", "Unpredictable", "Income that", "Other", "Decision",
    "VCs", "Agency", "Investors", "Large enterprise", "Growing company",
    "Established mid-size", "Mid-size", "Early startup", "Enterprise",
    "Global enterprise", "B2B", "B2C", "E-commerce", "Fintech", "Health",
    "Healthcare", "Education", "Financial", "Retail", "Marketplace",
    "Marketplaces", "Media", "Professional", "Services", "Solo", "Generalist",
    "Building", "Connecting", "Curating", "Designing", "Solving", "Teaching",
    "Figuring", "Meaningful", "Significant", "Stable", "Reliable", "None",
    "Back-to-back", "Low-leverage", "Interpersonal", "Ongoing", "Strategy",
    "Creative", "Fixer", "Same", "Different",
  ];
  // Use a regex: comma space followed by one of the starters
  const starterPattern = starters.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`,\\s+(?=(?:${starterPattern}))`);
  return joined.split(re).map(s => s.trim()).filter(Boolean);
}

function toFullQuizAnswers(raw: Record<string, unknown>): FullQuizAnswers {
  const out: Partial<FullQuizAnswers> = {};
  // Initialize every key
  for (const key of Object.values(TYPEFORM_FIELD_MAP)) {
    if (MULTI_KEYS.has(key)) (out as Record<string, unknown>)[key] = [];
    else (out as Record<string, unknown>)[key] = "";
  }
  for (const [ref, val] of Object.entries(raw)) {
    const key = TYPEFORM_FIELD_MAP[ref];
    if (!key) continue;
    let v: unknown = typeof val === "string" ? val :
      (val && typeof val === "object" && "answer" in val ? (val as { answer: unknown }).answer : "");
    if (MULTI_KEYS.has(key)) {
      if (Array.isArray(v)) (out as Record<string, string[]>)[key] = v.map(String);
      else if (typeof v === "string") (out as Record<string, string[]>)[key] = splitMulti(v);
      else (out as Record<string, string[]>)[key] = [];
    } else {
      (out as Record<string, string>)[key] = String(v || "");
    }
  }
  return out as FullQuizAnswers;
}

async function run() {
  const users = await pool.query(`
    SELECT u.id, u.name, u.email, q.answers,
           r.id AS rec_id, r."primaryPathId", r.status
    FROM "User" u
    JOIN "QuizSubmission" q ON q."userId" = u.id
    LEFT JOIN "Recommendation" r ON r."userId" = u.id
    WHERE q.answers IS NOT NULL
    ORDER BY u.name
  `);

  const paths = await pool.query('SELECT id, slug, name FROM "BusinessPath"');
  const pathById = Object.fromEntries(paths.rows.map((p: Record<string, string>) => [p.id, p]));

  const rps = await pool.query(
    'SELECT "recommendationId", "pathId", rank FROM "RecommendationPath" ORDER BY rank'
  );
  const storedByRec: Record<string, Array<{ recommendationId: string; pathId: string; rank: number }>> = {};
  for (const rp of rps.rows) {
    storedByRec[rp.recommendationId] = storedByRec[rp.recommendationId] || [];
    storedByRec[rp.recommendationId].push(rp);
  }

  type Row = {
    name: string;
    advantage: string;
    advantageScore: number;
    storedTop3: string[];
    newPrimary: string;
    newAlt1: string;
    newAlt2: string;
    primaryScore: number;
  };
  const rows: Row[] = [];

  for (const user of users.rows) {
    let raw: Record<string, unknown>;
    try { raw = JSON.parse(user.answers); } catch { continue; }
    const answers = toFullQuizAnswers(raw);
    const scored = scoreFullQuiz(answers);
    const stored = user.rec_id
      ? (storedByRec[user.rec_id] || []).map(rp => pathById[rp.pathId]?.name || rp.pathId)
      : [];
    rows.push({
      name: user.name || "?",
      advantage: scored.primaryAdvantage.name,
      advantageScore: scored.primaryAdvantage.score,
      storedTop3: stored.slice(0, 3),
      newPrimary: scored.primaryPath.pathName,
      newAlt1: scored.alternativePaths[0]?.pathName || "-",
      newAlt2: scored.alternativePaths[1]?.pathName || "-",
      primaryScore: scored.primaryPath.fitScore,
    });
  }

  console.log("\n" + "=".repeat(160));
  console.log(
    "USER".padEnd(18),
    "ADVANTAGE".padEnd(22),
    "OLD TOP 3".padEnd(55),
    "NEW TOP 3"
  );
  console.log("=".repeat(160));
  for (const r of rows) {
    const old = r.storedTop3.join(", ") || "(none)";
    const neu = `${r.newPrimary}, ${r.newAlt1}, ${r.newAlt2}`;
    const marker = old === neu ? "  " : "⚠ ";
    console.log(
      marker + r.name.padEnd(16),
      `${r.advantage} (${r.advantageScore})`.padEnd(22),
      old.substring(0, 53).padEnd(55),
      neu
    );
  }
  console.log("=".repeat(160));

  await pool.end();
}

run().catch((e) => { console.error(e); process.exit(1); });
