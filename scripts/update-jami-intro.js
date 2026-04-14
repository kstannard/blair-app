// Rewrite the third paragraph of Jami's personalIntro. The previous version
// had a run-on sentence with comma-spliced items that lost the reader.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const REC_ID = 'cmnrswts2000204jr3n4wrlvp';

const personalIntro = `You've spent over a decade in product management, including a long run at Amway, a stretch at Zendesk where you moved from customer experience into leading innovation and custom solutions teams, and now a principal PM role at HP. That's enterprise SaaS at serious scale, across multiple functions.

You told us you like what you do and you just want to do it for yourself. That's the cleanest signal we see. You're not pivoting, you're not reinventing. You're keeping the work you're already good at and leaving behind the political dynamics and the sense that it's all becoming another full-time job.

You're working with 6-8 hours a week in fragmented bursts, you've got an 8-year-old and a 12-year-old, and the thing that scares you is the financial risk. That last one matters, and it's what's driving our recommendation. A lot of the advice in this space is "build a product and wait twelve months." We're not going to tell you to do that.

Here's where we'd have you start.`;

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE "Recommendation" SET "personalIntro" = $1, "updatedAt" = NOW() WHERE id = $2',
      [personalIntro, REC_ID]
    );
    await client.query('COMMIT');
    console.log('✅ Jami personalIntro paragraph 2 rewritten (no run-on sentence).');
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
