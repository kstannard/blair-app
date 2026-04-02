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

const EMAIL = 'blahnik.sarah@gmail.com';
const NAME = 'Sarah Blahnik';
const PASSWORD = 'blair2026';
const STRIPE_SESSION_ID = 'comped-sarah-friend';

async function main() {
  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email: EMAIL } });

  if (user) {
    console.log('User already exists:', user.id);
  } else {
    const hashedPassword = await bcrypt.hash(PASSWORD, 12);
    user = await prisma.user.create({
      data: {
        email: EMAIL,
        name: NAME,
        password: hashedPassword,
        role: 'user',
      }
    });
    console.log('Created user:', user.id);
  }

  // Check if order already exists
  let order;
  try {
    order = await prisma.order.findUnique({ where: { stripeSessionId: STRIPE_SESSION_ID } });
  } catch (e) {
    order = null;
  }

  if (order) {
    console.log('Order already exists:', order.id);
    // Link to user if not already linked
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
        email: EMAIL,
        userId: user.id,
        stripeSessionId: STRIPE_SESSION_ID,
        amount: 14900,
        currency: 'usd',
        status: 'paid',
      }
    });
    console.log('Created order:', order.id, '($149, paid)');
  }

  console.log('\n--- Provisioning complete ---');
  console.log('User ID:', user.id);
  console.log('Email:', user.email);
  console.log('Order ID:', order.id);
  console.log('Order status:', order.status || 'paid');

  // Now send webhook payload to deployed endpoint
  console.log('\n--- Sending Typeform webhook to production ---');

  const uniqueToken = 'sarah-manual-' + Date.now();

  const answers = buildAnswers();

  const payload = {
    event_id: 'sarah-provision-' + Date.now(),
    event_type: 'form_response',
    form_response: {
      form_id: 'CCNZDjRG',
      token: uniqueToken,
      submitted_at: new Date().toISOString(),
      hidden: {
        email: EMAIL,
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

  console.log('Webhook token:', uniqueToken);

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
    return;
  }

  // Wait 15 seconds for async processing
  console.log('\nWaiting 15 seconds for processing...');
  await new Promise(r => setTimeout(r, 15000));

  // Verify results
  console.log('\n--- Verifying results ---');

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

  console.log('\n=== RESULTS ===');
  console.log('Advantage name:', profile?.unfairAdvantageName || 'N/A');
  console.log('Primary path:', rec?.paths?.find(p => p.rank === 1)?.path?.name || rec?.primaryPathId || 'N/A');
  console.log('Recommendation status:', rec?.status || 'N/A');
}

function buildAnswers() {
  const answers = [];

  // Helper functions
  function textAnswer(ref, value) {
    answers.push({
      field: { id: ref.substring(0, 12), ref, type: 'short_text' },
      type: 'text',
      text: value,
    });
  }

  function choiceAnswer(ref, label) {
    answers.push({
      field: { id: ref.substring(0, 12), ref, type: 'multiple_choice' },
      type: 'choice',
      choice: { id: 'id-0', ref: 'ref-0', label },
    });
  }

  function choicesAnswer(ref, labels) {
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

  // Q1 - name
  textAnswer('dc0389bc-6cee-4d60-9424-641ce62c23b2', 'Sarah');

  // Q2 - role
  choiceAnswer('7a04081f-1257-4fe2-94d8-9b51cb4b61cc', 'Strategy / Chief of Staff / Founder\'s Office');

  // Q3 - years
  choiceAnswer('adaaf514-3035-447f-a9a9-df243128354c', '15+ years');

  // Q4 - company size (multi)
  choicesAnswer('8c46376a-7993-46d0-b2bf-0c52e0bcedce', [
    'Mid-size company (201–1000 people)',
    'Growing company (21–200 people)',
  ]);

  // Q5 - industries (multi)
  choicesAnswer('1141c3fc-a9df-4de6-8454-6106acf2e6d2', ['Generalist / Industry-Agnostic']);

  // Q6 - business models (multi)
  choicesAnswer('c3dd18e5-56a7-4da0-be70-13a9fed1a24c', [
    'B2B software / SaaS',
    'Media / content / community',
  ]);

  // Q7 - shoulder tap (multi)
  choicesAnswer('6192dd0d-d6c9-4aa2-83e9-11952277e523', [
    'The "Strategy" Ask: "We have a big goal but no plan. Can you map out exactly how we get there?"',
    'The "Creative" Ask: "We can\'t explain what we do. Can you write the deck/messaging/story for us?"',
  ]);

  // Q8 - weirdly good (text)
  textAnswer('3eeeb4f3-a480-49d6-8694-e1d74e7030de', 'Randomly good at sourcing consumer goods; I\'m often asked by friends where I find various items — clothing, jewelry, kid and baby gear, home decor, etc — and my answer is often unexpected and pleasantly surprising. I love sharing recommendations with people and feel a strong sense of pride by "influencing" just one friend or acquaintance who both trusts my recommendation(s) and benefits from something I feel confident in talking to them about.');

  // Q9 - managing
  choiceAnswer('4afa164c-51b5-4e83-9188-2960fb932dfa', 'Generally comfortable if clear systems and expectations are in place');

  // Q10 - work mode
  choiceAnswer('ccb59b99-2f9c-444f-8b7c-35c1c1ac0294', 'High-leverage decision making - I like diagnosing quickly, setting direction, and empowering others to execute');

  // Q11 - energy drains (multi)
  choicesAnswer('d067be6e-8a79-4ffc-a0d3-78d354726aed', [
    'Interpersonal tension or political dynamics',
    'Ongoing ambiguity or shifting priorities',
  ]);

  // Q12 - same or different
  choiceAnswer('23bf71b0-2703-45eb-8a4d-8abec6d8f692', 'Different direction - I\'m ready to apply my skills to something new');

  // Q13 - blocker
  choiceAnswer('9c0a202b-c457-4d76-8187-840e57032f08', 'I\'m scared of the financial risk');

  // Q14 - interests (single choice, not multi)
  choiceAnswer('395674d6-78fe-4477-8d68-92f415b4a36d', 'I\'m not sure yet');

  // Q15 - scenario
  choiceAnswer('571af747-2ac1-4ebf-be8f-ff77af3ff7ac', 'Clear packaged work with defined boundaries');

  // Q16 - success (multi)
  choicesAnswer('43e86f36-01ee-4fe0-a57b-9a180c91b8e5', [
    'Reliable income outside my job',
    'Significant time flexibility and control',
  ]);

  // Q17 - avoid (multi)
  choicesAnswer('30a2997b-0846-4d80-aa87-df3636f356ee', [
    'Income that is unpredictable month to month',
    'Feeling like I just created another full-time job with no flexibility',
  ]);

  // Q18 - income timeline
  choiceAnswer('e05f7717-695d-45ff-be18-722495337650', 'Within 6-12 months');

  // Q19 - zero income
  choiceAnswer('be9095c3-6c48-428d-902e-4b0ce60996cb', 'No real impact');

  // Q20 - capital
  choiceAnswer('3b2203ca-afd6-460d-a9a7-05579dada795', '$25,000 to $74,999');

  // Q21 - borrowing
  choiceAnswer('b0ac307d-c42a-4544-b8cd-4fcea6628e6c', 'Neutral if the math is clear');

  // Q22 - network (multi)
  choicesAnswer('c91b94e8-8c89-45ab-bf9c-8605706a685f', [
    'Decision-makers at startups or tech companies (founders / execs / heads of function)',
    'Agency or studio owners (marketing / design / dev / ops)',
  ]);

  // Q23 - outreach
  choiceAnswer('0c854db4-c2b4-4aff-aba8-17840b28d004', 'Comfortable - I already reach out for advice / referrals / work-related opportunities');

  // Q24 - visibility
  choiceAnswer('d0c4febb-6e09-43e9-8c36-5422ec6c624d', 'I\'m comfortable being moderately visible in my niche');

  // Q25 - time
  choiceAnswer('8729215f-ea9b-48f4-a713-ac5ee02ad25e', '13-15 hours (this is a real priority for me right now)');

  // Q26 - conditions
  choiceAnswer('37b4d94f-818f-4ad5-8d5b-ce386c535455', 'Consistent, protected time - can reliably block uninterrupted time and take scheduled calls');

  // Q27 - kids ages (text)
  textAnswer('19b28a68-2fb0-48f1-b316-61736509bf26', '6 months, 3, 5');

  // Q28 - linkedin (url sent as text per instructions)
  textAnswer('56b0517f-4404-4a5f-98d6-2f8e612f8886', 'https://www.linkedin.com/in/sarahblahnik/');

  // Q29 - other links (text)
  textAnswer('9573764e-c2ac-45e6-987f-79d279013191', 'https://theweeklypickle.com/ (my short-lived, now long-neglected pickling website…do with this what you will)');

  return answers;
}

main().catch(console.error).finally(() => { pool.end(); });
