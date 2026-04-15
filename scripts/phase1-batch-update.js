// Batched DB update for Phase 1 playbook content. Runs everything in one
// transaction so we only need one Bash prompt:
//
// 1. Personalize Jami's Phase 1 savedData with content referencing her
//    actual background (Amway, Zendesk, HP).
// 2. Update Task.description and Task.whyItMatters for Fractional Operator
//    Phase 1 tasks — strip out ops-only framing ("fixes a bottleneck",
//    "fractional leader who fixes...") so the copy works for product,
//    marketing, ops, comms, finance, and engineering fractional operators.
// 3. Update BusinessPath.description for Fractional Operator — stop
//    describing it as "operations leader" only.
// 4. Update Task.description and Task.whyItMatters for Automation &
//    Systems Builder Phase 1 task 1 — broaden beyond CRM/Zapier-only to
//    include product-systems builders like senior PMs.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const JAMI_USER_ID = 'cmnrrx7bn000004jpoqpgyqx6';

// =================================================================
// PART 1: Jami's personalized savedData for Phase 1 tasks
// =================================================================

const task1Data = {
  step1Items: [
    "Owned product roadmap and prioritization for an enterprise SaaS area at HP",
    "Led the customer experience to innovation and custom solutions transition at Zendesk",
    "Ran customer discovery and turned it into shipped features",
    "Shipped cross-team launches with engineering, design, and customer success",
    "Coached PMs and helped them grow into ownership of their own areas",
    "Worked directly with founders and execs on product strategy and tradeoffs",
    "Built the operating cadence between product, engineering, and design",
    "Translated complex customer pain into clean product specs the team could ship",
  ],
  step2Selections: [0, 2, 4],
  step3Selections: [0],
  prePopulated: true,
  step1Interacted: false,
  step2Interacted: false,
  step3Interacted: false,
};

const task2Data = {
  selectedDraft: 0,
  editedStatement:
    "I help Series A B2B SaaS companies that need senior product leadership but can't commit to a full-time hire ship better roadmaps and coach their first PMs into the role.",
  userModified: false,
  prePopulated: true,
};

const task3Data = {
  buyerTitle:
    "Founder, CEO, or CTO at a Series A B2B SaaS company that has product-market fit but no senior product hire yet. Likely someone two degrees out from your network at HP, Zendesk, or Amway who's now running their own thing.",
  companyType:
    "20-50 employees, Series A B2B SaaS, raised $10-25M in the last 18 months. Has a VP of Engineering and a Head of Sales but no senior product person.",
  triggerEvents: [
    "Just raised a round and the roadmap is drifting because the founder is still owning product full-time",
    "Promoted a junior PM into a stretch role and that PM needs senior coaching to land it",
    "A major launch is coming up and discovery hasn't been done",
    "VP Engineering is asking for a clearer roadmap and there's nobody at the leadership table to provide it",
  ],
  budgetAuthority: ["direct"],
  whereTheyHangOut: [
    "Former HP, Zendesk, or Amway colleagues who have moved to smaller companies",
    "Lenny's Newsletter community and Slack",
    "First Round Review and the Reforge alumni network",
    "Mind the Product community",
    "Founders in your extended network on LinkedIn",
  ],
  prePopulated: true,
};

// NOTE: GutCheckEditor uses `contacts` (not `people`) with fields
// { name, notes, status: "not-yet" | "reached-out" | "conversation-had" }.
const task4Data = {
  contacts: [
    {
      name: "",
      notes:
        "A former Zendesk colleague who has since moved to a smaller, faster company. They saw how you ran customer experience and innovation work, and they're either now in a role that needs senior product help or they know a founder who is.",
      status: "not-yet",
    },
    {
      name: "",
      notes:
        "A former HP teammate or peer who has either moved on to a startup or is leading product at a smaller company. They worked with you on product strategy and would either be a first client or a strong referral source.",
      status: "not-yet",
    },
    {
      name: "",
      notes:
        "A friend or peer in product management who won't become a client but will give you honest feedback on whether the positioning lands. Pick someone who would tell you if it sounded off.",
      status: "not-yet",
    },
  ],
  prePopulated: true,
};

// =================================================================
// PART 2: DB Task content — Fractional Operator Phase 1
// =================================================================
// Functional-neutral rewrites. No "fractional leader who fixes a
// bottleneck" language — works for any senior functional archetype.

const fractionalTasks = {
  'fractional-operator--figure-out-your-specific-thing': {
    description:
      "You've been the senior person inside companies for years. The question now is: which specific problem are you going to own as a fractional? Think about the last 3-5 times a founder or exec asked you to step in. What did they actually need? A cleaner roadmap? A launch that didn't slip? A team that could operate without them? The best fractional engagements come from a pattern you've seen break the same way at multiple companies. That pattern is your niche — not your function broadly, but the specific thing you can deliver faster and better than anyone else on that team.",
    whyItMatters:
      "A fractional leader who does 'a little bit of everything' competes on price with every generalist on the market. A fractional leader who owns a specific outcome at a specific company stage gets referred by founders who have seen that exact problem. Your first clients will come from people who say 'you should talk to [your name], she did exactly this at my company.'",
  },
  'fractional-operator--write-your-one-sentence': {
    description:
      "Turn what you do into one sentence: 'I help [type of company] [specific outcome] by [how you actually do it].' This isn't a tagline, it's the answer to 'what do you do?' when a founder asks. The best fractional leaders describe their work in terms of the outcome, not the hours or the function. 'I help Series A SaaS companies ship better roadmaps' is clearer than 'I'm a fractional head of product.'",
    whyItMatters:
      "Founders hire fractional leaders when they're stuck. Your one sentence needs to name that moment specifically enough that the right founder feels seen. It also has to be repeatable: your network can't refer you if they can't remember what you do. The sentence that gets you clients is the one your former colleague uses when a founder friend complains about the exact problem you solve.",
  },
  'fractional-operator--get-clear-on-your-buyer': {
    description:
      "Your buyer is a founder, CEO, or senior leader who knows something needs to change but can't justify a full-time hire. Get more specific: What stage is the company? (Pre-seed founders rarely hire fractional leaders. Post-Series A founders who just raised do.) What's the trigger event that makes them call you this month and not six months from now? Who else needs to agree to bring you on? Where does this person spend their time, and whose opinion do they trust when they're making a hire?",
    whyItMatters:
      "Fractional work lives and dies on timing. A founder who needs you in six months will forget about you. A founder whose key person just quit and whose board meeting is in three weeks will pay your rate without negotiating. Knowing the trigger events means you can time your outreach, write content that speaks to urgent moments, and recognize buying signals in casual conversations.",
  },
  'fractional-operator--gut-check-with-real-people': {
    description:
      "Before you build anything else, test this with 2-3 people who have seen you work. Not a pitch. A gut-check. Send a message: 'I'm thinking about offering fractional [your area] work for [your target company type]. Does that resonate? Who comes to mind?' The best validation for fractional work is when someone immediately says 'oh, you should talk to [founder name].'",
    whyItMatters:
      "Most fractional operators get their first engagement through someone they already know. These gut-check conversations aren't just validation, they're soft launches. The person you message today might introduce you to a founder next week. Start these conversations before you have a website, a contract template, or a rate card. The relationship is the launchpad.",
  },
};

// =================================================================
// PART 3: Automation & Systems Builder — broaden Task 1
// =================================================================

const automationTasks = {
  'automation-systems-builder--figure-out-your-specific-thing': {
    description:
      "Think about the systems you've built or fixed that made a real difference: internal tools, dashboards, workflow automations, data pipelines, integration layers, onboarding flows. Which ones solved a problem that exists at every company like the one you came from? The best engagements come from a specific kind of broken system you know how to fix faster than anyone else. Modern AI-assisted tooling means you can now build things in days that used to take weeks, which widens the door for product people, ops people, and engineers to all do this work.",
    whyItMatters:
      "Every company has broken systems. The ones who'll pay you well are the ones where the broken system is costing them real money, real time, or real trust with their customers. Pick a specific category of system and a specific kind of company — that's the pattern your first clients will recognize and refer.",
  },
};

// =================================================================
// PART 4: Fractional Operator path description
// =================================================================

const fractionalPathDescription =
  "You embed with 1-2 companies as their senior fractional operator, in whatever function you're strongest in: product, marketing, ops, finance, comms, or engineering. You own a specific outcome a founder needs at a critical moment, at a fraction of the hours and cost of a full-time hire.";

// =================================================================
// Execute
// =================================================================

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ---- Part 1: Jami's personalized savedData ----
    const jamiTaskData = {
      'fractional-operator--figure-out-your-specific-thing': task1Data,
      'fractional-operator--write-your-one-sentence': task2Data,
      'fractional-operator--get-clear-on-your-buyer': task3Data,
      'fractional-operator--gut-check-with-real-people': task4Data,
    };

    for (const [slug, data] of Object.entries(jamiTaskData)) {
      const taskRes = await client.query('SELECT id FROM "Task" WHERE slug = $1', [slug]);
      if (taskRes.rows.length === 0) {
        console.warn('⚠ Task not found: ' + slug);
        continue;
      }
      const taskId = taskRes.rows[0].id;

      const existing = await client.query(
        'SELECT id FROM "TaskProgress" WHERE "userId" = $1 AND "taskId" = $2',
        [JAMI_USER_ID, taskId]
      );

      if (existing.rows.length > 0) {
        await client.query(
          'UPDATE "TaskProgress" SET "savedData" = $1, status = \'not_started\', "updatedAt" = NOW() WHERE id = $2',
          [JSON.stringify(data), existing.rows[0].id]
        );
        console.log('  ✓ Jami savedData updated: ' + slug);
      } else {
        const cuidLike = 'cm' + Math.random().toString(36).slice(2, 26);
        await client.query(
          'INSERT INTO "TaskProgress" (id, "userId", "taskId", status, "savedData", "startedAt", "updatedAt") VALUES ($1, $2, $3, \'not_started\', $4, NOW(), NOW())',
          [cuidLike, JAMI_USER_ID, taskId, JSON.stringify(data)]
        );
        console.log('  ✓ Jami TaskProgress created: ' + slug);
      }
    }

    // ---- Part 2: Fractional Operator Task content ----
    // (Task has no updatedAt column in the schema)
    for (const [slug, content] of Object.entries(fractionalTasks)) {
      await client.query(
        'UPDATE "Task" SET description = $1, "whyItMatters" = $2 WHERE slug = $3',
        [content.description, content.whyItMatters, slug]
      );
      console.log('  ✓ Fractional Task content updated: ' + slug);
    }

    // ---- Part 3: Automation & Systems Builder task 1 ----
    for (const [slug, content] of Object.entries(automationTasks)) {
      await client.query(
        'UPDATE "Task" SET description = $1, "whyItMatters" = $2 WHERE slug = $3',
        [content.description, content.whyItMatters, slug]
      );
      console.log('  ✓ Automation Task content updated: ' + slug);
    }

    // ---- Part 4: Fractional Operator BusinessPath description ----
    // (BusinessPath has no updatedAt column in the schema)
    await client.query(
      'UPDATE "BusinessPath" SET description = $1 WHERE slug = $2',
      [fractionalPathDescription, 'fractional-operator']
    );
    console.log('  ✓ Fractional BusinessPath description updated');

    await client.query('COMMIT');
    console.log('\n✅ Phase 1 batch update complete.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Rollback:', e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch((e) => { console.error(e); process.exit(1); });
