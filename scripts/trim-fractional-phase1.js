// Trim the 4 Fractional Operator Phase 1 task descriptions and whyItMatters
// blocks. The current versions follow a bloated "setup sentence → restatement
// sentence → vivid quote" pattern. Cuts collapse to the core idea and drop
// the restatement. Keeps the load-bearing [your name] placeholder.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const updates = [
  // TASK 1: Figure Out Your Specific Thing
  {
    slug: 'fractional-operator--figure-out-your-specific-thing',
    description:
      "Which specific problem are you going to own as a fractional? Think about the last 3-5 times a founder asked you to step in. What did they actually need? The best fractional engagements come from a pattern you've seen break the same way at multiple companies. That pattern is your niche.",
    whyItMatters:
      "A fractional leader who does a little bit of everything competes on price with every generalist. A fractional leader who owns a specific outcome gets referred by founders who say 'you should talk to [your name], she did exactly this at my company.'",
  },
  // TASK 2: Write Your One Sentence
  {
    slug: 'fractional-operator--write-your-one-sentence',
    description:
      "Turn what you do into one sentence: 'I help [type of company] [specific outcome] by [how you actually do it].' It's the answer to 'what do you do?' when a founder asks. Describe the work in terms of the outcome, not the function. 'I help Series A SaaS companies ship better roadmaps' beats 'I'm a fractional head of product.'",
    whyItMatters:
      "Founders hire fractional leaders when they're stuck. Your one sentence needs to name that moment specifically enough that the right founder feels seen, and simply enough that your network can actually repeat it when a founder friend describes the exact problem you solve.",
  },
  // TASK 3: Get Clear on Who Actually Hires You
  {
    slug: 'fractional-operator--get-clear-on-your-buyer',
    description:
      "Your buyer is a founder or senior leader who knows something needs to change but can't justify a full-time hire. Get specific: What stage is the company? What's the trigger event that makes them call you this month and not six months from now? Where do they spend their time, and whose opinion do they trust when they're making a hire?",
    whyItMatters:
      "Fractional work lives and dies on timing. A founder who needs you in six months will forget about you. A founder whose key person just quit and whose board meeting is in three weeks will pay your rate without negotiating. Knowing the trigger events lets you time your outreach and recognize buying signals in casual conversations.",
  },
  // TASK 4: Gut-Check It With Real People
  {
    slug: 'fractional-operator--gut-check-with-real-people',
    description:
      "Before you build anything else, test this with 2-3 people who have seen you work. Not a pitch. A gut-check. 'I'm thinking about offering fractional [your area] work for [your target company type]. Does that resonate? Who comes to mind?' The best validation is when someone immediately says 'oh, you should talk to [founder name].'",
    whyItMatters:
      "Most fractional operators get their first engagement through someone they already know. These gut-check conversations are soft launches. The person you message today might introduce you to a founder next week. Start before you have a website, a contract, or a rate card.",
  },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const u of updates) {
      const res = await client.query(
        'UPDATE "Task" SET description = $1, "whyItMatters" = $2 WHERE slug = $3 RETURNING slug',
        [u.description, u.whyItMatters, u.slug]
      );
      if (res.rows.length === 0) {
        throw new Error(`Task not found: ${u.slug}`);
      }
      console.log('✓ Trimmed', u.slug);
    }
    await client.query('COMMIT');
    console.log('\n✅ Fractional Operator Phase 1 trimmed.');
    for (const u of updates) {
      const descWc = u.description.split(/\s+/).length;
      const whyWc = u.whyItMatters.split(/\s+/).length;
      console.log(`   ${u.slug}: desc ${descWc}w / why ${whyWc}w`);
    }
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
