require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DIRECT_URL });

(async () => {
  const c = await pool.connect();
  try {
    // Order schema + recent orders
    const cols = await c.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='Order' ORDER BY ordinal_position`
    );
    console.log('=== Order columns ===');
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

    const jamiId = 'cmnrrx7bn000004jpoqpgyqx6';
    const o = await c.query(`SELECT * FROM "Order" WHERE "userId" = $1`, [jamiId]);
    console.log(`\n=== Orders for Jami (${o.rows.length}) ===`);
    o.rows.forEach(r => console.log(JSON.stringify(r, null, 2)));

    const recent = await c.query(
      `SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT 15`
    );
    console.log(`\n=== Last 15 Orders in DB ===`);
    recent.rows.forEach(r => console.log(JSON.stringify(r)));
  } finally {
    c.release();
    await pool.end();
  }
})();
