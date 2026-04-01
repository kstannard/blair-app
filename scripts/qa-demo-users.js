/**
 * QA script: Create 4 demo users with realistic working mom profiles,
 * simulate the full post-checkout flow, and trigger scoring + recommendations.
 *
 * Profiles:
 * 1. Megan Torres → Digital Product Builder
 * 2. Jess Nakamura → Community & Membership Operator
 * 3. Rina Patel → Micro-SaaS Builder
 * 4. Caroline Webb → Fractional Operator
 */
const { PrismaClient } = require('../node_modules/@prisma/client');
const { PrismaPg } = require('../node_modules/@prisma/adapter-pg');
const pg = require('../node_modules/pg');
const bcrypt = require('../node_modules/bcryptjs');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Typeform field refs (from typeform-fields.ts)
const REFS = {
  Q1_name: "dc0389bc-6cee-4d60-9424-641ce62c23b2",
  Q2_role: "7a04081f-1257-4fe2-94d8-9b51cb4b61cc",
  Q3_years: "adaaf514-3035-447f-a9a9-df243128354c",
  Q4_company_size: "8c46376a-7993-46d0-b2bf-0c52e0bcedce",
  Q5_industries: "1141c3fc-a9df-4de6-8454-6106acf2e6d2",
  Q6_business_models: "c3dd18e5-56a7-4da0-be70-13a9fed1a24c",
  Q7_shoulder_tap: "6192dd0d-d6c9-4aa2-83e9-11952277e523",
  Q8_weirdly_good: "3eeeb4f3-a480-49d6-8694-e1d74e7030de",
  Q9_managing: "4afa164c-51b5-4e83-9188-2960fb932dfa",
  Q10_work_mode: "ccb59b99-2f9c-444f-8b7c-35c1c1ac0294",
  Q11_energy_drains: "d067be6e-8a79-4ffc-a0d3-78d354726aed",
  Q12_same_or_different: "23bf71b0-2703-45eb-8a4d-8abec6d8f692",
  Q13_blocker: "9c0a202b-c457-4d76-8187-840e57032f08",
  Q14_interests: "395674d6-78fe-4477-8d68-92f415b4a36d",
  Q15_scenario: "571af747-2ac1-4ebf-be8f-ff77af3ff7ac",
  Q16_success: "43e86f36-01ee-4fe0-a57b-9a180c91b8e5",
  Q17_avoid: "30a2997b-0846-4d80-aa87-df3636f356ee",
  Q18_income_timeline: "e05f7717-695d-45ff-be18-722495337650",
  Q19_zero_income: "be9095c3-6c48-428d-902e-4b0ce60996cb",
  Q20_capital: "3b2203ca-afd6-460d-a9a7-05579dada795",
  Q21_borrowing: "b0ac307d-c42a-4544-b8cd-4fcea6628e6c",
  Q22_network: "c91b94e8-8c89-45ab-bf9c-8605706a685f",
  Q23_outreach: "0c854db4-c2b4-4aff-aba8-17840b28d004",
  Q24_visibility: "d0c4febb-6e09-43e9-8c36-5422ec6c624d",
  Q25_time: "8729215f-ea9b-48f4-a713-ac5ee02ad25e",
  Q26_conditions: "37b4d94f-818f-4ad5-8d5b-ce386c535455",
  Q27_kids_ages: "19b28a68-2fb0-48f1-b316-61736509bf26",
  Q28_linkedin: "56b0517f-4404-4a5f-98d6-2f8e612f8886",
  Q29_other_links: "9573764e-c2ac-45e6-987f-79d279013191",
};

function buildAnswerMap(answers) {
  const map = {};
  for (const [quizKey, value] of Object.entries(answers)) {
    const ref = REFS[quizKey];
    if (ref) map[ref] = value;
  }
  return map;
}

function buildTypeformPayload(email, answers) {
  const rawValues = buildAnswerMap(answers);
  const fields = [];
  const tfAnswers = [];

  for (const [ref, value] of Object.entries(rawValues)) {
    const isMulti = value.includes(', ') && !ref.includes('19b28a68'); // not kids ages
    fields.push({ id: ref.substring(0, 12), ref, title: '', type: isMulti ? 'multiple_choice' : 'short_text' });

    if (isMulti) {
      const labels = value.split(', ');
      tfAnswers.push({
        field: { id: ref.substring(0, 12), ref, type: 'multiple_choice' },
        type: 'choices',
        choices: { ids: labels.map((_, i) => `id-${i}`), labels, refs: labels.map((_, i) => `ref-${i}`) },
      });
    } else {
      tfAnswers.push({
        field: { id: ref.substring(0, 12), ref, type: 'short_text' },
        type: 'text',
        text: value,
      });
    }
  }

  return {
    event_id: `qa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    event_type: 'form_response',
    form_response: {
      form_id: 'CCNZDjRG',
      token: `qa-token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      submitted_at: new Date().toISOString(),
      hidden: { email },
      definition: { fields },
      answers: tfAnswers,
    },
  };
}

// ── Profile 1: Megan Torres → Digital Product Builder ──
const MEGAN = {
  email: "megan.torres.qa@demo.blair.com",
  name: "Megan Torres",
  password: "testpass123",
  answers: {
    Q1_name: "Megan",
    Q2_role: "Head of Enablement / L&D / Training",
    Q3_years: "10-14 years",
    Q4_company_size: "Growing company (21–200 people), Established mid-size (201–1000 people)",
    Q5_industries: "B2B software / SaaS",
    Q6_business_models: "B2B software / SaaS, Professional services / consulting",
    Q7_shoulder_tap: 'The "Strategy" Ask: "We have a big goal but no plan. Can you map out exactly how we get there?", The "Creative" Ask: "We can\'t explain what we do. Can you write the deck/messaging/story for us?"',
    Q8_weirdly_good: "turning complicated processes into simple frameworks and training programs that people actually use",
    Q9_managing: "Very comfortable. Managing employees would not be a blocker for me",
    Q10_work_mode: "Deep focused creation - I do my best work with uninterrupted time to think, build, and write",
    Q11_energy_drains: "Back-to-back meetings or constant context switching, Low-leverage admin or repetitive execution",
    Q12_same_or_different: "Different direction - I'm ready to apply my skills to something new",
    Q13_blocker: "I have ideas but don't know which one to pursue",
    Q14_interests: "Building systems, tools, or workflows, Teaching or mentoring others",
    Q15_scenario: "Mostly async work with minimal live interaction",
    Q16_success: "Meaningful wealth creation (not just income), Significant time flexibility and control",
    Q17_avoid: "Constant client demands, urgency, or fire drills, Feeling like I just created another full-time job with no flexibility",
    Q18_income_timeline: "Within 6-12 months",
    Q19_zero_income: "Noticeable stress but manageable",
    Q20_capital: "Less than $25,000",
    Q21_borrowing: "Prefer to avoid it entirely",
    Q22_network: "Decision-makers at startups or tech companies (founders / execs / heads of function)",
    Q23_outreach: "Comfortable - I already reach out for advice / referrals / work-related opportunities",
    Q24_visibility: "I'm comfortable being moderately visible in my niche",
    Q25_time: "6-8 hours (a few focused evenings or one longer weekend block)",
    Q26_conditions: "Consistent, protected time - can reliably block uninterrupted time and take scheduled calls",
    Q27_kids_ages: "3, 6",
    Q28_linkedin: "https://www.linkedin.com/in/megantorres",
    Q29_other_links: "",
  },
};

// ── Profile 2: Jess Nakamura → Community & Membership Operator ──
const JESS = {
  email: "jess.nakamura.qa@demo.blair.com",
  name: "Jess Nakamura",
  password: "testpass123",
  answers: {
    Q1_name: "Jess",
    Q2_role: "VP of Partnerships / Business Development",
    Q3_years: "15+ years",
    Q4_company_size: "Growing company (21–200 people), Established mid-size (201–1000 people), Large enterprise (1001–10000 people)",
    Q5_industries: "B2B software / SaaS, Fintech / payments",
    Q6_business_models: "B2B software / SaaS, Marketplace or platform",
    Q7_shoulder_tap: 'The "Strategy" Ask: "We have a big goal but no plan. Can you map out exactly how we get there?"',
    Q8_weirdly_good: "connecting people and bringing the right group together for the right conversation. I'm the one who plans the dinners, organizes the group chats, and makes intros that turn into real relationships.",
    Q9_managing: "Very comfortable. Managing employees would not be a blocker for me",
    Q10_work_mode: "High-leverage decision making - I like diagnosing quickly, setting direction, and empowering others to execute",
    Q11_energy_drains: "Back-to-back meetings or constant context switching, Internal politics or bureaucracy",
    Q12_same_or_different: "Different direction - I'm ready to apply my skills to something new",
    Q13_blocker: "I don't have a business idea yet",
    Q14_interests: "Connecting people and building community, Curating knowledge and resources",
    Q15_scenario: "A mix of live interaction and solo execution",
    Q16_success: "Significant time flexibility and control, Meaningful wealth creation (not just income)",
    Q17_avoid: "Constant client demands, urgency, or fire drills, Being the bottleneck for everything",
    Q18_income_timeline: "Within 6-12 months",
    Q19_zero_income: "Noticeable stress but manageable",
    Q20_capital: "Less than $25,000",
    Q21_borrowing: "Prefer to avoid it entirely",
    Q22_network: "Decision-makers at startups or tech companies (founders / execs / heads of function), Other founders or independent operators, VCs / investors / board members",
    Q23_outreach: "Comfortable - I already reach out for advice / referrals / work-related opportunities",
    Q24_visibility: "I'm comfortable being moderately visible in my niche",
    Q25_time: "6-8 hours (a few focused evenings or one longer weekend block)",
    Q26_conditions: "Consistent, protected time - can reliably block uninterrupted time and take scheduled calls",
    Q27_kids_ages: "1.5, 4",
    Q28_linkedin: "https://www.linkedin.com/in/jessnakamura",
    Q29_other_links: "",
  },
};

// ── Profile 3: Rina Patel → Micro-SaaS Builder ──
const RINA = {
  email: "rina.patel.qa@demo.blair.com",
  name: "Rina Patel",
  password: "testpass123",
  answers: {
    Q1_name: "Rina",
    Q2_role: "Senior Product Manager / Product Operations",
    Q3_years: "10-14 years",
    Q4_company_size: "Growing company (21–200 people), Established mid-size (201–1000 people)",
    Q5_industries: "B2B software / SaaS, Health tech / digital health",
    Q6_business_models: "B2B software / SaaS",
    Q7_shoulder_tap: 'The "Fixer" Ask: "Everything is on fire. Can you just come in and make it work?"',
    Q8_weirdly_good: "spotting broken workflows and building tools to fix them. I've built internal dashboards, automated reporting systems, and Notion setups that entire teams ran on.",
    Q9_managing: "Moderately comfortable - I can do it but it's not my favorite",
    Q10_work_mode: "Deep focused creation - I do my best work with uninterrupted time to think, build, and write",
    Q11_energy_drains: "Back-to-back meetings or constant context switching, Low-leverage admin or repetitive execution",
    Q12_same_or_different: "Different direction - I'm ready to apply my skills to something new",
    Q13_blocker: "I have ideas but don't know which one to pursue",
    Q14_interests: "Building systems, tools, or workflows, Solving a specific problem with technology",
    Q15_scenario: "Mostly async work with minimal live interaction",
    Q16_success: "Meaningful wealth creation (not just income), Building something I own that has equity value",
    Q17_avoid: "Constant client demands, urgency, or fire drills, Feeling like I just created another full-time job with no flexibility",
    Q18_income_timeline: "I'm OK waiting 12+ months if the upside is bigger",
    Q19_zero_income: "We're fine for a while",
    Q20_capital: "$25,000 - $50,000",
    Q21_borrowing: "Comfortable using leverage strategically",
    Q22_network: "Decision-makers at startups or tech companies (founders / execs / heads of function)",
    Q23_outreach: "Comfortable - I already reach out for advice / referrals / work-related opportunities",
    Q24_visibility: "I'd prefer to stay mostly behind the scenes",
    Q25_time: "10-15 hours (I can carve out significant time for this)",
    Q26_conditions: "Consistent, protected time - can reliably block uninterrupted time and take scheduled calls",
    Q27_kids_ages: "5, 7",
    Q28_linkedin: "https://www.linkedin.com/in/rinapatel",
    Q29_other_links: "",
  },
};

// ── Profile 4: Caroline Webb → Fractional Operator ──
const CAROLINE = {
  email: "caroline.webb.qa@demo.blair.com",
  name: "Caroline Webb",
  password: "testpass123",
  answers: {
    Q1_name: "Caroline",
    Q2_role: "VP of Operations / COO",
    Q3_years: "15+ years",
    Q4_company_size: "Growing company (21–200 people), Established mid-size (201–1000 people), Large enterprise (1001–10000 people)",
    Q5_industries: "B2B software / SaaS, E-commerce / retail tech",
    Q6_business_models: "B2B software / SaaS, B2C software / consumer apps",
    Q7_shoulder_tap: 'The "Fixer" Ask: "Everything is on fire. Can you just come in and make it work?", The "Strategy" Ask: "We have a big goal but no plan. Can you map out exactly how we get there?"',
    Q8_weirdly_good: "walking into operational chaos and building the structure that makes it run. I diagnose what's broken in about 30 minutes and have a plan by end of week.",
    Q9_managing: "Very comfortable. Managing employees would not be a blocker for me",
    Q10_work_mode: "High-leverage decision making - I like diagnosing quickly, setting direction, and empowering others to execute",
    Q11_energy_drains: "Low-leverage admin or repetitive execution, Internal politics or bureaucracy",
    Q12_same_or_different: "Same general direction - I want to keep using my core skills in a new structure",
    Q13_blocker: "I don't know how to get started or find clients",
    Q14_interests: "Building systems, tools, or workflows",
    Q15_scenario: "A mix of live interaction and solo execution",
    Q16_success: "Significant time flexibility and control, Stable and predictable income I can count on",
    Q17_avoid: "Feeling like I just created another full-time job with no flexibility, Unpredictable income or feast-or-famine cycles",
    Q18_income_timeline: "Within 3-6 months",
    Q19_zero_income: "Noticeable stress but manageable",
    Q20_capital: "Less than $25,000",
    Q21_borrowing: "Prefer to avoid it entirely",
    Q22_network: "Decision-makers at startups or tech companies (founders / execs / heads of function), Other founders or independent operators",
    Q23_outreach: "Comfortable - I already reach out for advice / referrals / work-related opportunities",
    Q24_visibility: "I'm comfortable being moderately visible in my niche",
    Q25_time: "10-15 hours (I can carve out significant time for this)",
    Q26_conditions: "Consistent, protected time - can reliably block uninterrupted time and take scheduled calls",
    Q27_kids_ages: "8, 11",
    Q28_linkedin: "https://www.linkedin.com/in/carolinewebb",
    Q29_other_links: "",
  },
};

const PROFILES = [MEGAN, JESS, RINA, CAROLINE];

async function createUser(profile) {
  const { email, name, password, answers } = profile;

  // Clean up if exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.delete({ where: { id: existing.id } });
    await prisma.order.deleteMany({ where: { email } });
    console.log(`  Cleaned up existing user ${email}`);
  }

  // 1. Create paid order (simulates Stripe webhook)
  await prisma.order.create({
    data: {
      email,
      stripeSessionId: `qa-session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      amount: 14900,
      status: "paid",
    },
  });
  console.log(`  ✓ Order created`);

  // 2. Create user account (simulates /api/auth/signup)
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // Link order
  await prisma.order.updateMany({
    where: { email, userId: null },
    data: { userId: user.id },
  });
  console.log(`  ✓ Account created: ${user.id}`);

  // 3. Submit quiz via deployed webhook
  const payload = buildTypeformPayload(email, answers);
  console.log(`  Submitting quiz to deployed webhook...`);

  const res = await fetch('https://app.hiblair.com/api/webhook/typeform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (data.ok && !data.skipped) {
    console.log(`  ✓ Quiz scored: advantage=${data.advantage}, path=${data.path}`);
  } else if (data.skipped) {
    console.log(`  ⚠ Quiz skipped: ${data.reason}`);
    // If webhook skipped (e.g., code not deployed yet), we need to verify locally
  } else {
    console.log(`  ✗ Quiz webhook failed:`, data);
  }

  return { user, data };
}

async function verifyUser(profile) {
  const { email, name } = profile;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) { console.log(`  ✗ User not found!`); return null; }

  const subs = await prisma.quizSubmission.findMany({ where: { userId: user.id } });
  const recs = await prisma.recommendation.findMany({
    where: { userId: user.id },
    include: { paths: { include: { path: true }, orderBy: { rank: 'asc' } } },
  });
  const profile_db = await prisma.userProfile.findUnique({ where: { userId: user.id } });

  console.log(`  User: ${user.name} (${user.email})`);
  console.log(`  Quiz submissions: ${subs.length}`);
  console.log(`  Recommendations: ${recs.length}`);

  if (recs.length > 0) {
    const rec = recs[0];
    console.log(`  Status: ${rec.status}`);
    console.log(`  Primary path: ${rec.paths[0]?.path?.name || 'unknown'} (fit: ${rec.paths[0]?.fitScore})`);
    if (rec.paths[1]) console.log(`  Alt 1: ${rec.paths[1]?.path?.name} (fit: ${rec.paths[1]?.fitScore})`);
    if (rec.paths[2]) console.log(`  Alt 2: ${rec.paths[2]?.path?.name} (fit: ${rec.paths[2]?.fitScore})`);
    console.log(`  Personal intro: ${rec.personalIntro?.substring(0, 150)}...`);
    console.log(`  Personalized why: ${rec.personalizedWhy?.substring(0, 150)}...`);

    // Check for markdown artifacts
    if (rec.personalIntro?.includes('**')) console.log(`  ⚠ WARNING: personalIntro contains ** markdown`);
    if (rec.personalizedWhy?.includes('**')) console.log(`  ⚠ WARNING: personalizedWhy contains ** markdown`);
    if (rec.personalIntro?.includes('—')) console.log(`  ⚠ WARNING: personalIntro contains em dash`);
    if (rec.personalizedWhy?.includes('—')) console.log(`  ⚠ WARNING: personalizedWhy contains em dash`);
  } else {
    console.log(`  ✗ No recommendation generated!`);
  }

  if (profile_db) {
    console.log(`  Advantage: ${profile_db.unfairAdvantageName}`);
    const traits = JSON.parse(profile_db.traits || '[]');
    const strengths = JSON.parse(profile_db.strengths || '[]');
    const constraints = JSON.parse(profile_db.constraints || '[]');
    console.log(`  Traits: ${traits.length > 0 ? traits.length + ' items' : '✗ EMPTY'}`);
    console.log(`  Strengths: ${strengths.length > 0 ? strengths.length + ' items' : '✗ EMPTY'}`);
    console.log(`  Constraints: ${constraints.length > 0 ? constraints.length + ' items' : '✗ EMPTY'}`);
  } else {
    console.log(`  ✗ No user profile!`);
  }

  return { user, recs, profile: profile_db };
}

async function main() {
  console.log('=== QA: Creating 4 demo users ===\n');

  for (const profile of PROFILES) {
    console.log(`\n── ${profile.name} (${profile.email}) ──`);
    await createUser(profile);
  }

  // Wait a moment for webhook processing
  console.log('\nWaiting 10s for webhook processing...');
  await new Promise(r => setTimeout(r, 10000));

  console.log('\n=== QA: Verifying all users ===\n');

  const results = [];
  for (const profile of PROFILES) {
    console.log(`\n── ${profile.name} ──`);
    const result = await verifyUser(profile);
    results.push({ name: profile.name, ...result });
  }

  // Summary
  console.log('\n\n=== QA SUMMARY ===');
  for (const r of results) {
    const rec = r.recs?.[0];
    const primaryPath = rec?.paths?.[0]?.path?.name || 'NONE';
    const status = rec ? '✓' : '✗';
    console.log(`${status} ${r.name}: ${primaryPath} (${rec?.status || 'no rec'})`);
  }
}

main().catch(console.error).finally(() => pool.end());
