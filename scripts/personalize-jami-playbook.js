// Pre-populate Jami's Phase 1 task savedData with personalized starter
// content that references her actual background (Amway, Zendesk, HP) and
// her actual context (Principal PM, 6-8 hrs/week, scared of financial risk).
//
// The model: Jami should land on each task and see something close to a
// finished draft, not blank fields she has to fill in. She edits, doesn't
// build from scratch.
//
// This is the "do as much of the work for her" pattern — it should become
// the default model for every customer's Phase 1 once we have a function
// that derives this content from any user's profile.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const USER_ID = 'cmnrrx7bn000004jpoqpgyqx6';

// =================================================================
// Task 1: Figure Out Your Specific Thing (NicheEditor)
// =================================================================
// 8 chips referencing Jami's actual background, plus pre-selected
// "lit you up" items, plus pre-selected engagement type.
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
  // Step 2: pre-select the 3 chips most likely to energize a senior PM
  step2Selections: [0, 2, 4],
  // Step 3: pre-select the embedded fractional product lead engagement type (index 0)
  step3Selections: [0],
  prePopulated: true,
  step1Interacted: false,
  step2Interacted: false,
  step3Interacted: false,
};

// =================================================================
// Task 2: Write Your One Sentence (PositioningEditor)
// =================================================================
// Pre-select the role-aware example that fits Jami best AND pre-fill the
// editable statement with a customized version. She lands on a complete,
// editable sentence — not a "pick one of these three" exercise.
const task2Data = {
  selectedDraft: 0,
  editedStatement:
    "I help Series A B2B SaaS companies that need senior product leadership but can't commit to a full-time hire ship better roadmaps and coach their first PMs into the role.",
  userModified: false,
  prePopulated: true,
};

// =================================================================
// Task 3: Get Clear on Who Actually Hires You (BuyerProfileEditor)
// =================================================================
// All fields pre-filled with Jami-specific suggestions. She lands on a
// complete buyer profile she can edit, not blank input fields.
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

// =================================================================
// Task 4: Gut-Check It With Real People (GutCheckEditor)
// =================================================================
// Three pre-filled "categories" of people to reach out to, with reasons
// keyed to her network. Names are blank for her to fill in, but the
// "why this person" framing is done.
const task4Data = {
  people: [
    {
      name: "",
      why: "A former Zendesk colleague who has since moved to a smaller, faster company. They saw how you ran customer experience and innovation work, and they're either now in a role that needs senior product help or they know a founder who is.",
      status: "not_yet",
    },
    {
      name: "",
      why: "A former HP teammate or peer who has either moved on or is at a startup now. They worked with you on product strategy and would either be a first client or a strong referral source.",
      status: "not_yet",
    },
    {
      name: "",
      why: "A friend or peer in product management who won't become a client but will give you honest feedback on whether the positioning lands. Pick someone who would tell you if it sounded off.",
      status: "not_yet",
    },
  ],
  prePopulated: true,
};

// =================================================================
// Apply
// =================================================================
async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Map task slug → savedData
    const taskData = {
      'fractional-operator--figure-out-your-specific-thing': task1Data,
      'fractional-operator--write-your-one-sentence': task2Data,
      'fractional-operator--get-clear-on-your-buyer': task3Data,
      'fractional-operator--gut-check-with-real-people': task4Data,
    };

    for (const [slug, data] of Object.entries(taskData)) {
      // Get the task ID
      const taskRes = await client.query('SELECT id FROM "Task" WHERE slug = $1', [slug]);
      if (taskRes.rows.length === 0) {
        console.warn(`⚠ Task not found: ${slug}`);
        continue;
      }
      const taskId = taskRes.rows[0].id;

      // Upsert TaskProgress
      const existing = await client.query(
        'SELECT id FROM "TaskProgress" WHERE "userId" = $1 AND "taskId" = $2',
        [USER_ID, taskId]
      );

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE "TaskProgress"
           SET "savedData" = $1, status = 'not_started', "updatedAt" = NOW()
           WHERE id = $2`,
          [JSON.stringify(data), existing.rows[0].id]
        );
        console.log(`✓ Updated savedData for ${slug}`);
      } else {
        // Use cuid-style id (rough — pg will accept any string)
        const cuidLike = 'cm' + Math.random().toString(36).slice(2, 26);
        await client.query(
          `INSERT INTO "TaskProgress" (id, "userId", "taskId", status, "savedData", "startedAt", "updatedAt")
           VALUES ($1, $2, $3, 'not_started', $4, NOW(), NOW())`,
          [cuidLike, USER_ID, taskId, JSON.stringify(data)]
        );
        console.log(`✓ Created TaskProgress for ${slug}`);
      }
    }

    await client.query('COMMIT');
    console.log('\n✅ Jami Phase 1 personalized successfully.');
    console.log('   Task 1: 8 chips referencing HP/Zendesk/Amway, 3 selected, embedded engagement picked');
    console.log('   Task 2: Pre-filled "I help Series A B2B SaaS..." sentence');
    console.log('   Task 3: Buyer profile, company type, triggers, hangouts all pre-filled');
    console.log('   Task 4: 3 pre-filled "why this person" categories with blank names');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Rollback:', e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
run();
