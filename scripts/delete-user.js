const { PrismaClient } = require('../node_modules/@prisma/client');
const { PrismaPg } = require('../node_modules/@prisma/adapter-pg');
const pg = require('../node_modules/pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const email = process.argv[2];
if (!email) { console.log('Usage: node scripts/delete-user.js email@example.com'); process.exit(1); }

async function main() {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) { console.log('User not found:', email); return; }
  console.log('Found:', user.id, user.email);

  // Cascade deletes handle most relations, but just to be safe
  await prisma.user.delete({ where: { id: user.id } });
  // Also delete orphaned orders not linked to the user
  const orphanedOrders = await prisma.order.deleteMany({ where: { email, userId: null } });
  if (orphanedOrders.count) console.log('Deleted', orphanedOrders.count, 'orphaned orders');
  console.log('Deleted user and all related records.');
}

main().catch(console.error).finally(() => { pool.end(); });
