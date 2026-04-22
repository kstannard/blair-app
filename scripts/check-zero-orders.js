require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DIRECT_URL });

(async () => {
  const c = await pool.connect();
  try {
    // All $0 paid orders, showing whether User exists
    const r = await c.query(`
      SELECT o."createdAt", o.email, o."userId" IS NOT NULL as has_user, o."stripeSessionId"
      FROM "Order" o
      WHERE o.amount = 0 AND o.status = 'paid'
      ORDER BY o."createdAt"
    `);
    console.log(`=== All $0 paid Orders (${r.rows.length}) ===`);
    r.rows.forEach(x =>
      console.log(`${x.createdAt.toISOString()}  user=${x.has_user?'Y':'N'}  ${x.email}`)
    );
  } finally {
    c.release();
    await pool.end();
  }
})();
