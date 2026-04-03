/**
 * Replay Julie Soper's Typeform quiz submission into the database.
 *
 * Her Typeform response (token: m8gwgne5rmc94l0m8gwvdpwfugqcvy19) was never
 * processed because the hidden email field was empty. This script stores her
 * actual answers as a QuizSubmission and updates her UserProfile so features
 * like NicheEditor can use the quiz context.
 *
 * We do NOT re-run the recommendation pipeline because her recommendation
 * was already hand-crafted and approved.
 *
 * Usage: cd ~/Projects/blair-app && node scripts/replay-julie-quiz.js
 */

const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({
  connectionString:
    "postgresql://postgres.duetolkrtdnmyguhahyo:BlairApp2026Supa@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Julie's real account
const JULIE_EMAIL = "jkaszton@gmail.com";
const TYPEFORM_RESPONSE_TOKEN = "m8gwgne5rmc94l0m8gwvdpwfugqcvy19";

// Julie's actual Typeform answers (from the API response)
// Mapped to our field refs from TYPEFORM_FIELD_MAP
const julieAnswersByRef = {
  // Q1_name
  "dc0389bc-6cee-4d60-9424-641ce62c23b2": "Julie",
  // Q2_role
  "7a04081f-1257-4fe2-94d8-9b51cb4b61cc": "Sales / Partnerships / RevOps",
  // Q3_years
  "adaaf514-3035-447f-a9a9-df243128354c": "15+ years",
  // Q4_company_size
  "8c46376a-7993-46d0-b2bf-0c52e0bcedce": "Enterprise (1001-10000), Global enterprise (10001+)",
  // Q5_industries
  "1141c3fc-a9df-4de6-8454-6106acf2e6d2": "Financial Services & Insurance, Generalist / Industry-Agnostic",
  // Q6_business_models
  "c3dd18e5-56a7-4da0-be70-13a9fed1a24c": "B2B software / SaaS, Services & consulting",
  // Q7_shoulder_tap
  "6192dd0d-d6c9-4aa2-83e9-11952277e523": "Strategy Ask, Creative Ask",
  // Q8_weirdly_good (skipped)
  // Q9_managing
  "4afa164c-51b5-4e83-9188-2960fb932dfa": "Comfortable if clear systems",
  // Q10_work_mode
  "ccb59b99-2f9c-444f-8b7c-35c1c1ac0294": "Owned execution with some collaboration",
  // Q11_energy_drains
  "d067be6e-8a79-4ffc-a0d3-78d354726aed": "Back-to-back meetings, Low-leverage admin",
  // Q15_scenario (best scenario)
  "571af747-2ac1-4ebf-be8f-ff77af3ff7ac": "Clear packaged work with defined boundaries",
  // Q16_success
  "43e86f36-01ee-4fe0-a57b-9a180c91b8e5": "Significant time flexibility, Reliable income outside job",
  // Q17_avoid
  "30a2997b-0846-4d80-aa87-df3636f356ee": "Creating another full-time job, Managing a team",
  // Q18_income_timeline
  "e05f7717-695d-45ff-be18-722495337650": "Within 3-6 months",
  // Q19_zero_income
  "be9095c3-6c48-428d-902e-4b0ce60996cb": "Noticeable stress but manageable",
  // Q20_capital
  "3b2203ca-afd6-460d-a9a7-05579dada795": "$25,000 to $74,999",
  // Q21_borrowing
  "b0ac307d-c42a-4544-b8cd-4fcea6628e6c": "Somewhat uncomfortable but open if low risk",
  // Q22_network
  "c91b94e8-8c89-45ab-bf9c-8605706a685f": "Decision-makers at startups or tech companies",
  // Q23_outreach
  "0c854db4-c2b4-4aff-aba8-17840b28d004": "Comfortable",
  // Q24_visibility
  "d0c4febb-6e09-43e9-8c36-5422ec6c624d": "Moderately visible in my niche",
  // Q25_time
  "8729215f-ea9b-48f4-a713-ac5ee02ad25e": "13-15 hours/week",
  // Q26_conditions
  "37b4d94f-818f-4ad5-8d5b-ce386c535455": "Flexible but unpredictable",
  // Q28_linkedin
  "56b0517f-4404-4a5f-98d6-2f8e612f8886": "https://www.linkedin.com/in/juliekaszton",
  // Q29_other_links
  "9573764e-c2ac-45e6-987f-79d279013191": "Working on one potential business idea currently. Website not fully built.",
};

// Structured raw answers (simulating Typeform answer objects)
const julieRawAnswers = {
  "dc0389bc-6cee-4d60-9424-641ce62c23b2": { field: { ref: "dc0389bc-6cee-4d60-9424-641ce62c23b2", type: "short_text" }, type: "text", text: "Julie" },
  "7a04081f-1257-4fe2-94d8-9b51cb4b61cc": { field: { ref: "7a04081f-1257-4fe2-94d8-9b51cb4b61cc", type: "multiple_choice" }, type: "choice", choice: { label: "Sales / Partnerships / RevOps" } },
  "adaaf514-3035-447f-a9a9-df243128354c": { field: { ref: "adaaf514-3035-447f-a9a9-df243128354c", type: "multiple_choice" }, type: "choice", choice: { label: "15+ years" } },
  "8c46376a-7993-46d0-b2bf-0c52e0bcedce": { field: { ref: "8c46376a-7993-46d0-b2bf-0c52e0bcedce", type: "multiple_choice" }, type: "choices", choices: { labels: ["Enterprise (1001-10000)", "Global enterprise (10001+)"] } },
  "1141c3fc-a9df-4de6-8454-6106acf2e6d2": { field: { ref: "1141c3fc-a9df-4de6-8454-6106acf2e6d2", type: "multiple_choice" }, type: "choices", choices: { labels: ["Financial Services & Insurance", "Generalist / Industry-Agnostic"] } },
  "c3dd18e5-56a7-4da0-be70-13a9fed1a24c": { field: { ref: "c3dd18e5-56a7-4da0-be70-13a9fed1a24c", type: "multiple_choice" }, type: "choices", choices: { labels: ["B2B software / SaaS", "Services & consulting"] } },
  "6192dd0d-d6c9-4aa2-83e9-11952277e523": { field: { ref: "6192dd0d-d6c9-4aa2-83e9-11952277e523", type: "multiple_choice" }, type: "choices", choices: { labels: ["Strategy Ask", "Creative Ask"] } },
  "4afa164c-51b5-4e83-9188-2960fb932dfa": { field: { ref: "4afa164c-51b5-4e83-9188-2960fb932dfa", type: "multiple_choice" }, type: "choice", choice: { label: "Comfortable if clear systems" } },
  "ccb59b99-2f9c-444f-8b7c-35c1c1ac0294": { field: { ref: "ccb59b99-2f9c-444f-8b7c-35c1c1ac0294", type: "multiple_choice" }, type: "choice", choice: { label: "Owned execution with some collaboration" } },
  "d067be6e-8a79-4ffc-a0d3-78d354726aed": { field: { ref: "d067be6e-8a79-4ffc-a0d3-78d354726aed", type: "multiple_choice" }, type: "choices", choices: { labels: ["Back-to-back meetings", "Low-leverage admin"] } },
  "571af747-2ac1-4ebf-be8f-ff77af3ff7ac": { field: { ref: "571af747-2ac1-4ebf-be8f-ff77af3ff7ac", type: "multiple_choice" }, type: "choice", choice: { label: "Clear packaged work with defined boundaries" } },
  "43e86f36-01ee-4fe0-a57b-9a180c91b8e5": { field: { ref: "43e86f36-01ee-4fe0-a57b-9a180c91b8e5", type: "multiple_choice" }, type: "choices", choices: { labels: ["Significant time flexibility", "Reliable income outside job"] } },
  "30a2997b-0846-4d80-aa87-df3636f356ee": { field: { ref: "30a2997b-0846-4d80-aa87-df3636f356ee", type: "multiple_choice" }, type: "choices", choices: { labels: ["Creating another full-time job", "Managing a team"] } },
  "e05f7717-695d-45ff-be18-722495337650": { field: { ref: "e05f7717-695d-45ff-be18-722495337650", type: "multiple_choice" }, type: "choice", choice: { label: "Within 3-6 months" } },
  "be9095c3-6c48-428d-902e-4b0ce60996cb": { field: { ref: "be9095c3-6c48-428d-902e-4b0ce60996cb", type: "multiple_choice" }, type: "choice", choice: { label: "Noticeable stress but manageable" } },
  "3b2203ca-afd6-460d-a9a7-05579dada795": { field: { ref: "3b2203ca-afd6-460d-a9a7-05579dada795", type: "multiple_choice" }, type: "choice", choice: { label: "$25,000 to $74,999" } },
  "b0ac307d-c42a-4544-b8cd-4fcea6628e6c": { field: { ref: "b0ac307d-c42a-4544-b8cd-4fcea6628e6c", type: "multiple_choice" }, type: "choice", choice: { label: "Somewhat uncomfortable but open if low risk" } },
  "c91b94e8-8c89-45ab-bf9c-8605706a685f": { field: { ref: "c91b94e8-8c89-45ab-bf9c-8605706a685f", type: "multiple_choice" }, type: "choices", choices: { labels: ["Decision-makers at startups or tech companies"] } },
  "0c854db4-c2b4-4aff-aba8-17840b28d004": { field: { ref: "0c854db4-c2b4-4aff-aba8-17840b28d004", type: "multiple_choice" }, type: "choice", choice: { label: "Comfortable" } },
  "d0c4febb-6e09-43e9-8c36-5422ec6c624d": { field: { ref: "d0c4febb-6e09-43e9-8c36-5422ec6c624d", type: "multiple_choice" }, type: "choice", choice: { label: "Moderately visible in my niche" } },
  "8729215f-ea9b-48f4-a713-ac5ee02ad25e": { field: { ref: "8729215f-ea9b-48f4-a713-ac5ee02ad25e", type: "multiple_choice" }, type: "choice", choice: { label: "13-15 hours/week" } },
  "37b4d94f-818f-4ad5-8d5b-ce386c535455": { field: { ref: "37b4d94f-818f-4ad5-8d5b-ce386c535455", type: "multiple_choice" }, type: "choice", choice: { label: "Flexible but unpredictable" } },
  "56b0517f-4404-4a5f-98d6-2f8e612f8886": { field: { ref: "56b0517f-4404-4a5f-98d6-2f8e612f8886", type: "url" }, type: "url", url: "https://www.linkedin.com/in/juliekaszton" },
  "9573764e-c2ac-45e6-987f-79d279013191": { field: { ref: "9573764e-c2ac-45e6-987f-79d279013191", type: "long_text" }, type: "text", text: "Working on one potential business idea currently. Website not fully built." },
};

async function main() {
  // Find Julie's real account
  const user = await prisma.user.findUnique({ where: { email: JULIE_EMAIL } });
  if (!user) {
    console.error(`User not found: ${JULIE_EMAIL}`);
    process.exit(1);
  }
  console.log(`Found user: ${user.name} (${user.id})`);

  // Check for existing quiz submission
  const existing = await prisma.quizSubmission.findFirst({
    where: { userId: user.id },
  });
  if (existing) {
    console.log(`Quiz submission already exists for Julie (${existing.id}). Skipping.`);
    await prisma.$disconnect();
    return;
  }

  // Also check demo account for existing quiz
  const demoExisting = await prisma.quizSubmission.findFirst({
    where: { responseToken: TYPEFORM_RESPONSE_TOKEN },
  });
  if (demoExisting) {
    console.log(`Response token already processed (${demoExisting.id}). Skipping.`);
    await prisma.$disconnect();
    return;
  }

  // Create QuizSubmission
  const quizSub = await prisma.quizSubmission.create({
    data: {
      userId: user.id,
      formId: "CCNZDjRG",
      responseToken: TYPEFORM_RESPONSE_TOKEN,
      answers: JSON.stringify(julieAnswersByRef),
      rawAnswers: JSON.stringify(julieRawAnswers),
      submittedAt: new Date("2026-03-14T16:56:00Z"),
      source: "typeform",
      status: "processed",
    },
  });
  console.log(`Created QuizSubmission: ${quizSub.id}`);

  // Also create one for the demo account so admin preview works too
  const demoUser = await prisma.user.findUnique({ where: { email: "julie@demo.blair.com" } });
  if (demoUser) {
    const demoExisting2 = await prisma.quizSubmission.findFirst({
      where: { userId: demoUser.id },
    });
    if (!demoExisting2) {
      const demoSub = await prisma.quizSubmission.create({
        data: {
          userId: demoUser.id,
          formId: "CCNZDjRG",
          responseToken: TYPEFORM_RESPONSE_TOKEN + "-demo-copy",
          answers: JSON.stringify(julieAnswersByRef),
          rawAnswers: JSON.stringify(julieRawAnswers),
          submittedAt: new Date("2026-03-14T16:56:00Z"),
          source: "typeform",
          status: "processed",
        },
      });
      console.log(`Created demo QuizSubmission: ${demoSub.id}`);
    }
  }

  console.log("Done! Julie's quiz answers are now stored.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
