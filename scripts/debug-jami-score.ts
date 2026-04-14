// Debug: dump every path score and reason for Jami's current stored answers.
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

import { Pool } from "pg";
import { scoreFullQuiz, type FullQuizAnswers } from "../src/lib/scoring/full-quiz-scorer";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const MAP: Record<string, keyof FullQuizAnswers> = {
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

const MULTI = new Set<keyof FullQuizAnswers>([
  "Q4_company_size", "Q5_industries", "Q6_business_models", "Q7_shoulder_tap",
  "Q11_energy_drains", "Q14_interests", "Q17_avoid", "Q22_network",
]);

const starters = ["The ","I ","I'm","Having","Feeling","Managing","Being","Creating","Constant","Unpredictable","Income that","Other","Decision","VCs","Agency","Investors","Large enterprise","Growing company","Established mid-size","Mid-size","Early startup","Enterprise","Global enterprise","B2B","B2C","E-commerce","Fintech","Health","Healthcare","Education","Financial","Retail","Marketplace","Marketplaces","Media","Professional","Services","Solo","Generalist","Building","Connecting","Curating","Designing","Solving","Teaching","Figuring","Meaningful","Significant","Stable","Reliable","None","Back-to-back","Low-leverage","Interpersonal","Ongoing","Strategy","Creative","Fixer","Same","Different"];
function splitMulti(j: string): string[] {
  if (!j) return [];
  const pat = starters.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return j.split(new RegExp(`,\\s+(?=(?:${pat}))`)).map(s => s.trim()).filter(Boolean);
}

async function run() {
  const q = await pool.query("SELECT answers FROM \"QuizSubmission\" WHERE \"userId\" = $1", ['cmnrrx7bn000004jpoqpgyqx6']);
  const raw = JSON.parse(q.rows[0].answers);
  const a: Record<string, unknown> = {};
  for (const k of Object.values(MAP)) (a as Record<string, unknown>)[k] = MULTI.has(k) ? [] : "";
  for (const [ref, v] of Object.entries(raw)) {
    const k = MAP[ref];
    if (!k) continue;
    const val = typeof v === "string" ? v : (v && typeof v === "object" && "answer" in v ? (v as { answer: unknown }).answer : "");
    if (MULTI.has(k)) {
      (a as Record<string, string[]>)[k] = Array.isArray(val) ? val.map(String) : (typeof val === "string" ? splitMulti(val) : []);
    } else {
      (a as Record<string, string>)[k] = String(val || "");
    }
  }
  console.log("Jami Q17_avoid parsed:", (a as Record<string, unknown>).Q17_avoid);
  console.log("Jami Q3_years:", JSON.stringify((a as Record<string, unknown>).Q3_years));
  console.log("Jami Q25_time:", JSON.stringify((a as Record<string, unknown>).Q25_time));
  console.log("Jami Q16_success:", JSON.stringify((a as Record<string, unknown>).Q16_success));

  const result = scoreFullQuiz(a as FullQuizAnswers);
  console.log("\nPrimary advantage:", result.primaryAdvantage.name, result.primaryAdvantage.score);
  console.log("All advantages:", result.allAdvantages.map(x => `${x.name}=${x.score}`).join(", "));
  console.log("\nTop 3 paths:");
  console.log(`  1. ${result.primaryPath.pathName} (fitScore ${result.primaryPath.fitScore})`);
  console.log(`     reasons: ${result.primaryPath.reasons.join(" | ")}`);
  for (const p of result.alternativePaths) {
    console.log(`  ${p.rank}. ${p.pathName} (fitScore ${p.fitScore})`);
    console.log(`     reasons: ${p.reasons.join(" | ")}`);
  }

  await pool.end();
}
run().catch(e => { console.error(e); process.exit(1); });
