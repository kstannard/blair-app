// Update Jami's draft pricing to better reflect:
// - Tier 1 vs Tier 2 as role scope, not just hours
// - Opening rate of $6-10K for first engagement (she's undervaluing herself,
//   so we start realistic and walk her up)
// - Series A, not seed, as the realistic buyer at 6-8 hrs/week

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const REC_ID = 'cmnrswts2000204jr3n4wrlvp';

const personalizedWhy = `The big idea:
You become a fractional head of product for a Series A B2B SaaS company that needs senior product leadership but can't afford a full-time VP of Product. You're not building a software tool. You're not selling a course. You're doing the work you already know how to do, shipping roadmaps, running discovery, coaching PMs, working with founders on positioning, at 6-10 hours a week per client, at senior consulting rates, for a company whose founder has already been pitched a dozen ways to spend this money and would take an obvious yes.

What you build:
Here's a concrete example. A founder in your extended network, someone from Zendesk, HP, or two degrees out from either, is running a 20-person Series A SaaS company that raised $12M eighteen months ago. They've got a VP of Engineering and a Head of Sales, no senior product person, and a roadmap that's drifting. A full-time Head of Product would cost them $250K base plus equity plus three months of ramp, and they're not ready to lock in a commitment like that yet. You come in as their fractional Head of Product for $7,000/month at 6-8 hours a week. You run their weekly product review, coach their one or two PMs, sit in on exec meetings when it matters, and own the next quarter's roadmap and launch plan. You're not an employee. You have one client at a time, scope is clear, contract is 3-6 months with an option to extend. It's the thing you already do at HP, except you set the terms.

By engagement two or three, your rate moves up. First-client pricing is about landing a reference, not about capturing the ceiling. Once you have a founder who will say "she ran our product org and we ship better now," the rate question changes. $9,000-$12,000/month becomes normal, and if you pick a vertical and position as the fractional head of product for that vertical, $12,000-$15,000/month is standard.

Who pays you (and how you find them):
You do not need to build a LinkedIn audience. You do not need to cold-pitch. Your first client comes from one conversation with someone you've already worked with at HP, Zendesk, or Amway. Think about who's now a founder, CTO, or VP of Engineering at a startup that raised in the last 18 months. That's your buyer. You email three of those people and say "I'm doing fractional product leadership now, 6-8 hours a week, I'd love to work with you or with a founder in your orbit who needs senior product help." One of them says yes or introduces you. That's the whole funnel. Once you've got a first happy client, your second and third clients come through their referrals, not through marketing. This is the path where your network does the selling, which matters because you told us you don't want to constantly sell yourself to keep the thing going.`;

const pricingDetails = JSON.stringify({
  tiers: [
    {
      name: "Fractional Head of Product (embedded)",
      price: "$6,000-$10,000/month, 6-8 hrs/week. You own the roadmap, run discovery, coach their PMs, and sit in on exec meetings. This is senior product leadership for a Series A company that needs a head of product but not full-time yet."
    },
    {
      name: "Senior product advisor (coaching)",
      price: "$3,000-$5,000/month, 3-4 hrs/week. You're a thought partner, not an operator. Weekly or bi-weekly 1:1s with the founder, roadmap reviews, hiring advice, specific unblocking. Lower scope, lower price, smaller commitment — good for your second client alongside a fractional engagement, or as a first client that converts to embedded later."
    }
  ],
  sideHustleMath: "One fractional head-of-product engagement at $7,000/month (a realistic first-engagement rate for a Series A company) is $84,000 a year from one client. The important number isn't the ceiling, it's the speed: your first engagement can start within two to three weeks of your first outreach email, because the first client comes from your existing network. There's no build phase, no product validation, no twelve-month wait for traction. You sign a contract, you start working, you get paid at the end of the month. By engagement two or three, your rate is closer to $9,000-$12,000/month. Your background supports the top of that range, but first-client pricing is about landing a reference, not about capturing the ceiling.",
  fullCapacityMath: "At 20-25 hours a week you can stack two or three engagements at once, two fractional head-of-product roles in parallel, or one embedded engagement plus one advisor retainer. That puts you at $12,000-$20,000/month, or $144,000-$240,000 a year, paid on real monthly contracts. Fractional operators who pick a vertical and get known for it reach $15,000-$20,000/month per engagement, which pushes the ceiling to $300,000-$400,000+/year. The point isn't the top of the range, it's that you control whether you stop at one client or keep going. The ceiling moves with your reputation and your capacity, not with anything outside your control.",
  momFit: "This is the path that respects your actual life. Fractional work is mostly async. Slack, Loom walkthroughs, comments on roadmap docs, with a couple of live meetings per week that you schedule around your calendar, not theirs. You don't have a manager. You don't have mandatory in-office days. You don't have a quota or a funnel you're chasing. Six to eight hours a week in fragmented bursts is what most fractional engagements actually look like in practice, a Monday morning product review, a Wednesday discovery call, async comments on docs in the evening after the kids are settled.\n\nThe real payoff is the risk profile. You said the financial risk is what scares you, and this is the only path on this list where that risk is close to zero. You sign a contract, you invoice monthly, you know exactly what month one and month two and month three look like. If it's not working on either side, you give notice and the other side does too, and you move on. It's not passive income. It's something better for where you are right now: predictable, senior, paid, and compatible with the two humans in your house."
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE "Recommendation"
       SET "personalizedWhy" = $1,
           "pricingDetails" = $2,
           "updatedAt" = NOW()
       WHERE id = $3`,
      [personalizedWhy, pricingDetails, REC_ID]
    );
    await client.query('COMMIT');
    console.log('✅ Jami pricing updated (v2).');
    console.log('   Tier 1: Embedded fractional head of product $6-10K/mo (scope: own roadmap, coach PMs, exec meetings)');
    console.log('   Tier 2: Senior advisor $3-5K/mo (scope: coaching, not executing)');
    console.log('   First engagement: $7K/mo');
    console.log('   Engagement 2-3: $9-12K/mo');
    console.log('   Vertical specialist: $12-15K/mo');
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
