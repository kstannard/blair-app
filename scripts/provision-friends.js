const { PrismaClient } = require('../node_modules/@prisma/client');
const { PrismaPg } = require('../node_modules/@prisma/adapter-pg');
const pg = require('../node_modules/pg');
const bcrypt = require('../node_modules/bcryptjs');
const fs = require('fs');

// Load env
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ========================
// USER CONFIGS
// ========================

const USERS = [
  {
    email: 'amanda.d.schwab@gmail.com',
    name: 'Amanda Schwab',
    password: 'blair2026',
    stripeSessionId: 'comped-amanda-friend',
    typeformToken: 'rw8b3vcfve0daj6lfnrw8b3vcfro9otn',
    sendWebhook: true,
  },
  {
    email: 'clairealsophubbard@gmail.com',
    name: 'Claire Hubbard',
    password: 'blair2026',
    stripeSessionId: 'comped-claire-friend',
    typeformToken: '4ovh9ji2ya97k875jv6y7s4ovh9ji9m1',
    sendWebhook: true,
  },
  {
    email: 'jkaszton@gmail.com',
    name: 'Julie Soper',
    password: 'blair2026',
    stripeSessionId: 'comped-julie-friend',
    sendWebhook: false,
    copyFromUserId: 'cmnajmbkx002nc39r71zceieh',
  },
];

// ========================
// ANSWER BUILDERS
// ========================

function textAnswer(answers, ref, value) {
  answers.push({
    field: { id: ref.substring(0, 12), ref, type: 'short_text' },
    type: 'text',
    text: value,
  });
}

function choiceAnswer(answers, ref, label) {
  answers.push({
    field: { id: ref.substring(0, 12), ref, type: 'multiple_choice' },
    type: 'choice',
    choice: { id: 'id-0', ref: 'ref-0', label },
  });
}

function choicesAnswer(answers, ref, labels) {
  answers.push({
    field: { id: ref.substring(0, 12), ref, type: 'multiple_choice' },
    type: 'choices',
    choices: {
      ids: labels.map((_, i) => `id-${i}`),
      labels,
      refs: labels.map((_, i) => `ref-${i}`),
    },
  });
}

// Field refs from typeform-fields.ts
const REFS = {
  Q1_name: 'dc0389bc-6cee-4d60-9424-641ce62c23b2',
  Q2_role: '7a04081f-1257-4fe2-94d8-9b51cb4b61cc',
  Q3_years: 'adaaf514-3035-447f-a9a9-df243128354c',
  Q4_company_size: '8c46376a-7993-46d0-b2bf-0c52e0bcedce',
  Q5_industries: '1141c3fc-a9df-4de6-8454-6106acf2e6d2',
  Q6_business_models: 'c3dd18e5-56a7-4da0-be70-13a9fed1a24c',
  Q7_shoulder_tap: '6192dd0d-d6c9-4aa2-83e9-11952277e523',
  Q8_weirdly_good: '3eeeb4f3-a480-49d6-8694-e1d74e7030de',
  Q9_managing: '4afa164c-51b5-4e83-9188-2960fb932dfa',
  Q10_work_mode: 'ccb59b99-2f9c-444f-8b7c-35c1c1ac0294',
  Q11_energy_drains: 'd067be6e-8a79-4ffc-a0d3-78d354726aed',
  Q12_same_or_different: '23bf71b0-2703-45eb-8a4d-8abec6d8f692',
  Q13_blocker: '9c0a202b-c457-4d76-8187-840e57032f08',
  Q14_interests: '395674d6-78fe-4477-8d68-92f415b4a36d',
  Q15_scenario: '571af747-2ac1-4ebf-be8f-ff77af3ff7ac',
  Q16_success: '43e86f36-01ee-4fe0-a57b-9a180c91b8e5',
  Q17_avoid: '30a2997b-0846-4d80-aa87-df3636f356ee',
  Q18_income_timeline: 'e05f7717-695d-45ff-be18-722495337650',
  Q19_zero_income: 'be9095c3-6c48-428d-902e-4b0ce60996cb',
  Q20_capital: '3b2203ca-afd6-460d-a9a7-05579dada795',
  Q21_borrowing: 'b0ac307d-c42a-4544-b8cd-4fcea6628e6c',
  Q22_network: 'c91b94e8-8c89-45ab-bf9c-8605706a685f',
  Q23_outreach: '0c854db4-c2b4-4aff-aba8-17840b28d004',
  Q24_visibility: 'd0c4febb-6e09-43e9-8c36-5422ec6c624d',
  Q25_time: '8729215f-ea9b-48f4-a713-ac5ee02ad25e',
  Q26_conditions: '37b4d94f-818f-4ad5-8d5b-ce386c535455',
  Q27_kids_ages: '19b28a68-2fb0-48f1-b316-61736509bf26',
  Q28_linkedin: '56b0517f-4404-4a5f-98d6-2f8e612f8886',
  Q29_other_links: '9573764e-c2ac-45e6-987f-79d279013191',
};

function buildAmandaAnswers() {
  const answers = [];

  // Q1 name
  textAnswer(answers, REFS.Q1_name, 'Amanda');
  // Q2 role
  choiceAnswer(answers, REFS.Q2_role, 'Growth / Performance Marketing / Lifecycle');
  // Q3 years
  choiceAnswer(answers, REFS.Q3_years, '15+ years');
  // Q4 company sizes
  choicesAnswer(answers, REFS.Q4_company_size, ['Growing company (21-200 people)']);
  // Q5 industries
  choicesAnswer(answers, REFS.Q5_industries, ['Education & Learning', 'Financial Services & Insurance', 'Healthcare & Life Sciences']);
  // Q6 business models
  choicesAnswer(answers, REFS.Q6_business_models, ['B2B software / SaaS', 'B2C software / consumer apps']);
  // Q7 shoulder tap
  choicesAnswer(answers, REFS.Q7_shoulder_tap, ['The "Strategy" Ask: "We have a big goal but no plan. Can you map out exactly how we get there?"']);
  // Q8 weirdly good - skip
  // Q9 managing
  choiceAnswer(answers, REFS.Q9_managing, 'Very comfortable. Managing employees would not be a blocker for me');
  // Q10 work mode
  choiceAnswer(answers, REFS.Q10_work_mode, 'Live collaboration - I think best in real-time conversations, workshops, and problem-solving sessions');
  // Q11 energy drains
  choicesAnswer(answers, REFS.Q11_energy_drains, ['Low-leverage admin or repetitive execution', 'Constant pitching, selling, or self-promotion']);
  // Q12 same/different - skip
  // Q13 blocker - skip
  // Q14 interests - skip
  // Q15 scenario
  choiceAnswer(answers, REFS.Q15_scenario, 'Designing systems that others can eventually run');
  // Q16 success
  choicesAnswer(answers, REFS.Q16_success, ['Reliable income outside my job']);
  // Q17 avoid
  choicesAnswer(answers, REFS.Q17_avoid, [
    'Feeling like I just created another full-time job with no flexibility',
    'Managing a team of employees or contractors',
    'Constant client demands, urgency, or fire drills',
    'Having to consistently sell, network, or market myself to get work',
  ]);
  // Q18 income timeline - skip
  // Q19 zero income - skip
  // Q20 capital
  choiceAnswer(answers, REFS.Q20_capital, 'Less than $25,000');
  // Q21 borrowing
  choiceAnswer(answers, REFS.Q21_borrowing, 'Somewhat uncomfortable but open if the risk is low');
  // Q22 network
  choicesAnswer(answers, REFS.Q22_network, ['Decision-makers at startups or tech companies (founders / execs / heads of function)']);
  // Q23 outreach
  choiceAnswer(answers, REFS.Q23_outreach, 'Somewhat uncomfortable but I would do it with a script or clear ask');
  // Q24 visibility
  choiceAnswer(answers, REFS.Q24_visibility, "I'm comfortable being moderately visible in my niche");
  // Q25 time
  choiceAnswer(answers, REFS.Q25_time, '3-5 hours (~1 hour after bedtime 3-5 nights/week)');
  // Q26 conditions
  choiceAnswer(answers, REFS.Q26_conditions, 'Flexible but unpredictable - can do focused work, but my schedule can shift and can\'t reliably commit to meetings');
  // Q27 kids ages - skip
  // Q28 linkedin
  textAnswer(answers, REFS.Q28_linkedin, 'https://www.linkedin.com/in/amanda-schwab7/');
  // Q29 other
  textAnswer(answers, REFS.Q29_other_links, 'No!');

  return answers;
}

function buildClaireAnswers() {
  const answers = [];

  // Q1 name
  textAnswer(answers, REFS.Q1_name, 'Claire');
  // Q2 role
  choiceAnswer(answers, REFS.Q2_role, 'Product Management');
  // Q3 years
  choiceAnswer(answers, REFS.Q3_years, '10-14 years');
  // Q4 company sizes
  choicesAnswer(answers, REFS.Q4_company_size, ['Early startup (0-20 people)', 'Growing company (21-200 people)']);
  // Q5 industries
  choicesAnswer(answers, REFS.Q5_industries, ['Retail & Ecommerce', 'Education & Learning', 'Generalist / Industry-Agnostic']);
  // Q6 business models
  choicesAnswer(answers, REFS.Q6_business_models, ['E-commerce or DTC', 'Marketplaces or platforms']);
  // Q7 shoulder tap
  choicesAnswer(answers, REFS.Q7_shoulder_tap, [
    'The "Fixer" Ask: "Everything is a mess - can you build us a process/system that actually works?"',
    'The "Strategy" Ask: "We have a big goal but no plan. Can you map out exactly how we get there?"',
  ]);
  // Q8 weirdly good - skip
  // Q9 managing
  choiceAnswer(answers, REFS.Q9_managing, 'Very comfortable. Managing employees would not be a blocker for me');
  // Q10 work mode
  choiceAnswer(answers, REFS.Q10_work_mode, 'Live collaboration - I think best in real-time conversations, workshops, and problem-solving sessions');
  // Q11 energy drains
  choicesAnswer(answers, REFS.Q11_energy_drains, ['Ongoing ambiguity or shifting priorities', 'Constant pitching, selling, or self-promotion']);
  // Q12 same/different - skip
  // Q13 blocker - skip
  // Q14 interests - skip
  // Q15 scenario
  choiceAnswer(answers, REFS.Q15_scenario, 'Clear packaged work with defined boundaries');
  // Q16 success
  choicesAnswer(answers, REFS.Q16_success, ['Meaningful wealth creation (not just income)']);
  // Q17 avoid
  choicesAnswer(answers, REFS.Q17_avoid, ['Constant client demands, urgency, or fire drills']);
  // Q18 income timeline - skip
  // Q19 zero income - skip
  // Q20 capital
  choiceAnswer(answers, REFS.Q20_capital, 'Less than $25,000');
  // Q21 borrowing
  choiceAnswer(answers, REFS.Q21_borrowing, 'Somewhat uncomfortable but open if the risk is low');
  // Q22 network
  choicesAnswer(answers, REFS.Q22_network, ['None of the above (yet)']);
  // Q23 outreach
  choiceAnswer(answers, REFS.Q23_outreach, 'Somewhat uncomfortable but I would do it with a script or clear ask');
  // Q24 visibility
  choiceAnswer(answers, REFS.Q24_visibility, "I'm comfortable being moderately visible in my niche");
  // Q25 time
  choiceAnswer(answers, REFS.Q25_time, '13-15 hours (this is a real priority for me right now)');
  // Q26 conditions
  choiceAnswer(answers, REFS.Q26_conditions, 'Consistent, protected time - can reliably block uninterrupted time and take scheduled calls');
  // Q27 kids ages - skip
  // Q28 linkedin
  textAnswer(answers, REFS.Q28_linkedin, 'https://www.linkedin.com/in/claire-hubbard/');
  // Q29 other - skip

  return answers;
}

// ========================
// MAIN
// ========================

async function createUserAndOrder(config) {
  console.log(`\n========== ${config.name} ==========`);

  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email: config.email } });

  if (user) {
    console.log('User already exists:', user.id);
  } else {
    const hashedPassword = await bcrypt.hash(config.password, 12);
    user = await prisma.user.create({
      data: {
        email: config.email,
        name: config.name,
        password: hashedPassword,
        role: 'user',
      },
    });
    console.log('Created user:', user.id);
  }

  // Check if order already exists
  let order;
  try {
    order = await prisma.order.findUnique({ where: { stripeSessionId: config.stripeSessionId } });
  } catch (e) {
    order = null;
  }

  if (order) {
    console.log('Order already exists:', order.id);
    if (!order.userId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { userId: user.id },
      });
      console.log('Linked order to user');
    }
  } else {
    order = await prisma.order.create({
      data: {
        email: config.email,
        userId: user.id,
        stripeSessionId: config.stripeSessionId,
        amount: 14900,
        currency: 'usd',
        status: 'paid',
      },
    });
    console.log('Created order:', order.id, '($149, paid)');
  }

  return user;
}

async function sendWebhook(config, user) {
  console.log(`\n--- Sending Typeform webhook for ${config.name} ---`);

  const answers = config.name === 'Amanda Schwab' ? buildAmandaAnswers() : buildClaireAnswers();
  const uniqueToken = config.name === 'Amanda Schwab'
    ? 'amanda-manual-' + Date.now()
    : 'claire-manual-' + Date.now();

  const payload = {
    event_id: config.name.toLowerCase().replace(' ', '-') + '-provision-' + Date.now(),
    event_type: 'form_response',
    form_response: {
      form_id: 'CCNZDjRG',
      token: config.typeformToken,
      submitted_at: new Date().toISOString(),
      hidden: {
        email: config.email,
      },
      definition: {
        fields: answers.map(a => ({
          id: a.field.id,
          ref: a.field.ref,
          title: a.field.ref,
          type: a.field.type,
        })),
      },
      answers,
    },
  };

  console.log('Webhook token:', config.typeformToken);

  const res = await fetch('https://app.hiblair.com/api/webhook/typeform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  console.log('Webhook response status:', res.status);
  console.log('Webhook response:', responseText);

  if (res.status !== 200) {
    console.error('Webhook failed! Status:', res.status);
    return false;
  }

  return true;
}

async function copyDemoData(user, sourceUserId) {
  console.log(`\n--- Copying demo data for ${user.name} from user ${sourceUserId} ---`);

  // Copy UserProfile
  const sourceProfile = await prisma.userProfile.findUnique({ where: { userId: sourceUserId } });
  if (sourceProfile) {
    const existingProfile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
    if (existingProfile) {
      console.log('UserProfile already exists for this user, skipping');
    } else {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          traits: sourceProfile.traits,
          strengths: sourceProfile.strengths,
          constraints: sourceProfile.constraints,
          summary: sourceProfile.summary,
          unfairAdvantageName: sourceProfile.unfairAdvantageName,
          unfairAdvantageDescription: sourceProfile.unfairAdvantageDescription,
          unfairAdvantageEvidence: sourceProfile.unfairAdvantageEvidence,
          unfairAdvantageWhy: sourceProfile.unfairAdvantageWhy,
          linkedinSummary: sourceProfile.linkedinSummary,
          onlinePresence: sourceProfile.onlinePresence,
          notableExperience: sourceProfile.notableExperience,
        },
      });
      console.log('Copied UserProfile');
    }
  } else {
    console.log('WARNING: Source UserProfile not found!');
  }

  // Copy QuizSubmission
  const sourceQuiz = await prisma.quizSubmission.findFirst({
    where: { userId: sourceUserId },
    orderBy: { submittedAt: 'desc' },
  });
  if (sourceQuiz) {
    const existingQuiz = await prisma.quizSubmission.findFirst({ where: { userId: user.id } });
    if (existingQuiz) {
      console.log('QuizSubmission already exists for this user, skipping');
    } else {
      await prisma.quizSubmission.create({
        data: {
          userId: user.id,
          formId: sourceQuiz.formId,
          responseToken: 'julie-copy-' + Date.now(),
          answers: sourceQuiz.answers,
          rawAnswers: sourceQuiz.rawAnswers,
          parsedAnswers: sourceQuiz.parsedAnswers,
          submittedAt: new Date(),
          source: sourceQuiz.source,
          status: sourceQuiz.status,
        },
      });
      console.log('Copied QuizSubmission');
    }
  } else {
    console.log('WARNING: Source QuizSubmission not found!');
  }

  // Copy Recommendation + RecommendationPaths
  const sourceRec = await prisma.recommendation.findFirst({
    where: { userId: sourceUserId },
    orderBy: { createdAt: 'desc' },
    include: { paths: true },
  });
  if (sourceRec) {
    const existingRec = await prisma.recommendation.findFirst({ where: { userId: user.id } });
    if (existingRec) {
      console.log('Recommendation already exists for this user, skipping');
    } else {
      const newRec = await prisma.recommendation.create({
        data: {
          userId: user.id,
          primaryPathId: sourceRec.primaryPathId,
          confirmedPathId: sourceRec.confirmedPathId,
          status: 'approved',
          personalIntro: sourceRec.personalIntro,
          personalizedWhy: sourceRec.personalizedWhy,
          pricingDetails: sourceRec.pricingDetails,
        },
      });
      console.log('Copied Recommendation:', newRec.id);

      // Copy RecommendationPaths
      for (const path of sourceRec.paths) {
        await prisma.recommendationPath.create({
          data: {
            recommendationId: newRec.id,
            pathId: path.pathId,
            rank: path.rank,
            fitScore: path.fitScore,
            altDescription: path.altDescription,
            altWhyConsider: path.altWhyConsider,
            altTradeoff: path.altTradeoff,
            altRevenueRange: path.altRevenueRange,
          },
        });
      }
      console.log(`Copied ${sourceRec.paths.length} RecommendationPaths`);
    }
  } else {
    console.log('WARNING: Source Recommendation not found!');
  }
}

async function verifyUser(user) {
  console.log(`\n--- Verifying results for ${user.name || user.email} ---`);

  const quizSub = await prisma.quizSubmission.findFirst({
    where: { userId: user.id },
    orderBy: { submittedAt: 'desc' },
  });
  console.log('QuizSubmission:', quizSub ? `found (id: ${quizSub.id}, status: ${quizSub.status})` : 'NOT FOUND');

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });
  console.log('UserProfile:', profile ? `found (advantage: ${profile.unfairAdvantageName})` : 'NOT FOUND');

  const rec = await prisma.recommendation.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      paths: {
        include: { path: true },
        orderBy: { rank: 'asc' },
      },
    },
  });

  if (rec) {
    const primaryPath = rec.paths.find(p => p.rank === 1);
    console.log('Recommendation:', `found (id: ${rec.id}, status: ${rec.status})`);
    console.log('Primary path:', primaryPath?.path?.name || rec.primaryPathId);
  } else {
    console.log('Recommendation: NOT FOUND');
  }

  return { quizSub, profile, rec };
}

async function main() {
  const results = {};

  // Step 1: Create all users and orders
  for (const config of USERS) {
    const user = await createUserAndOrder(config);
    results[config.email] = { user, config };
  }

  // Step 2: Send webhooks for Amanda and Claire (sequentially with waits)
  for (const config of USERS.filter(u => u.sendWebhook)) {
    const { user } = results[config.email];
    const success = await sendWebhook(config, user);
    if (success) {
      console.log(`\nWaiting 15 seconds for ${config.name}'s webhook processing...`);
      await new Promise(r => setTimeout(r, 15000));
    }
  }

  // Step 3: Copy demo data for Julie
  const julieConfig = USERS.find(u => !u.sendWebhook);
  const { user: julieUser } = results[julieConfig.email];
  await copyDemoData(julieUser, julieConfig.copyFromUserId);

  // Step 4: Verify all users
  console.log('\n\n========== FINAL VERIFICATION ==========');
  for (const config of USERS) {
    const { user } = results[config.email];
    const verification = await verifyUser(user);
    results[config.email].verification = verification;
  }

  // Summary
  console.log('\n\n========== SUMMARY ==========');
  for (const config of USERS) {
    const { user, verification } = results[config.email];
    console.log(`\n${config.name} (${config.email}):`);
    console.log(`  User ID: ${user.id}`);
    console.log(`  Quiz: ${verification.quizSub ? 'YES' : 'NO'}`);
    console.log(`  Profile: ${verification.profile ? 'YES' : 'NO'}`);
    console.log(`  Advantage: ${verification.profile?.unfairAdvantageName || 'N/A'}`);
    console.log(`  Recommendation: ${verification.rec ? 'YES (' + verification.rec.status + ')' : 'NO'}`);
    console.log(`  Primary path: ${verification.rec?.paths?.find(p => p.rank === 1)?.path?.name || 'N/A'}`);
  }
}

main().catch(console.error).finally(() => { pool.end(); });
