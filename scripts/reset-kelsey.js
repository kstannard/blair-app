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

async function main() {
  const user = await prisma.user.findFirst({ where: { email: { contains: 'kelsey' } } });
  if (!user) { console.log('User not found'); return; }
  console.log('Found:', user.id, user.email);

  const result = await prisma.taskProgress.updateMany({
    where: { userId: user.id },
    data: { status: 'not_started' },
  });
  console.log('Reset', result.count, 'task progress records to not_started');
}

main().catch(console.error).finally(() => prisma.$disconnect().then(() => pool.end()));
