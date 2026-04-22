require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DIRECT_URL });

(async () => {
  const c = await pool.connect();
  try {
    // List all tables so we can spot where Stripe data lives
    const t = await c.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
    );
    console.log('=== All tables ===');
    console.log(t.rows.map(r => r.table_name).join(', '));

    // Look for any "stripe" column anywhere
    const stripeCols = await c.query(
      `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' AND (LOWER(column_name) LIKE '%stripe%' OR LOWER(column_name) LIKE '%checkout%' OR LOWER(column_name) LIKE '%promo%')`
    );
    console.log('\n=== Stripe/checkout/promo columns ===');
    stripeCols.rows.forEach(r => console.log(`${r.table_name}.${r.column_name}`));

    const jamiId = 'cmnrrx7bn000004jpoqpgyqx6';
    const ghostId = 'cmnrrp7vc000104laauni5go9';

    // Check QuizSubmission for both Jami records
    try {
      const q = await c.query(
        `SELECT id, "userId", "submittedAt" FROM "QuizSubmission" WHERE "userId" IN ($1, $2)`,
        [jamiId, ghostId]
      );
      console.log('\n=== QuizSubmission for Jami records ===');
      q.rows.forEach(r => console.log(JSON.stringify(r)));
    } catch (e) { console.log('QuizSubmission error:', e.message); }

    // Check Recommendation
    try {
      const r = await c.query(
        `SELECT id, "userId", status, "createdAt" FROM "Recommendation" WHERE "userId" IN ($1, $2)`,
        [jamiId, ghostId]
      );
      console.log('\n=== Recommendation for Jami records ===');
      r.rows.forEach(r => console.log(JSON.stringify(r)));
    } catch (e) { console.log('Recommendation error:', e.message); }
  } finally {
    c.release();
    await pool.end();
  }
})();
