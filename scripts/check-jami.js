require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DIRECT_URL });

(async () => {
  const c = await pool.connect();
  try {
    // Find out what columns User has
    const cols = await c.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'User' ORDER BY ordinal_position`
    );
    console.log('=== User columns ===');
    console.log(cols.rows.map(r => r.column_name).join(', '));

    const u = await c.query(
      `SELECT id, email, name, "createdAt" FROM "User" WHERE LOWER(email) LIKE '%jami%' OR LOWER(email) LIKE '%lundborg%' OR LOWER(name) LIKE '%jami%' ORDER BY "createdAt" DESC`
    );
    console.log('\n=== Users matching jami/lundborg ===');
    u.rows.forEach(r => console.log(JSON.stringify(r, null, 2)));

    const recent = await c.query(
      `SELECT id, email, name, "createdAt" FROM "User" WHERE "createdAt" >= NOW() - INTERVAL '7 days' ORDER BY "createdAt" DESC`
    );
    console.log(`\n=== All Users created in last 7 days (${recent.rows.length}) ===`);
    recent.rows.forEach(r => console.log(`${r.createdAt.toISOString()}  ${r.email || '(no email)'}  ${r.name || ''}`));
  } finally {
    c.release();
    await pool.end();
  }
})();
