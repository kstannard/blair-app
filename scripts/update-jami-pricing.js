// Update Jami's draft pricing numbers to match current market rates.
// Principal PM at HP with ~13 yrs SaaS → $8-12K/mo for fractional head of
// product at 6-8 hrs/week, not the $6-8K I had originally.
//
// Also updates the personalIntro/personalizedWhy/pricingDetails where dollar
// amounts appear inline.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const REC_ID = 'cmnrswts2000204jr3n4wrlvp';

const personalizedWhy = `The big idea:
You become a fractional head of product for a seed or Series A B2B SaaS company that needs senior product leadership but can't afford a full-time VP of Product. You're not building a software tool. You're not selling a course. You're doing the work you already know how to do, shipping roadmaps, running discovery, coaching PMs, working with founders on positioning, at 6-10 hours a week per client, at senior consulting rates, for a company whose founder has already been pitched a dozen ways to spend this money and would take an obvious yes.

What you build:
Here's a concrete example. A founder in your extended network, someone from Zendesk, HP, or two degrees out from either, is running a 20-person Series A SaaS company. They've got a VP of Engineering and a Head of Sales, no senior product person, and a roadmap that's drifting. They don't need a full-time hire for another six months, and they can't afford $350K base anyway. You come in as their fractional Head of Product for $10,000-$12,000/month at 6-8 hours a week. You run their weekly product review, coach their one or two PMs, sit in on exec meetings when it matters, and own the next quarter's roadmap and launch plan. You're not an employee. You have one client at a time, scope is clear, contract is 3-6 months with an option to extend. It's the thing you already do at HP, except you set the terms.

Who pays you (and how you find them):
You do not need to build a LinkedIn audience. You do not need to cold-pitch. Your first client comes from one conversation with someone you've already worked with at HP, Zendesk, or Amway. Think about who's now a founder, CTO, or VP of Engineering at a startup that raised in the last 18 months. That's your buyer. You email three of those people and say "I'm doing fractional product leadership now, 6-8 hours a week, I'd love to work with you or with a founder in your orbit who needs senior product help." One of them says yes or introduces you. That's the whole funnel. Once you've got a first happy client, your second and third clients come through their referrals, not through marketing. This is the path where your network does the selling, which matters because you told us you don't want to constantly sell yourself to keep the thing going.`;

const pricingDetails = JSON.stringify({
  tiers: [
    { name: "Fractional Head of Product", price: "$8,000-$12,000/month per client, 6-8 hours/week" },
    { name: "Senior product advisor", price: "$3,000-$6,000/month per client, 3-4 hours/week" },
  ],
  sideHustleMath: "One fractional engagement at $8,000-$12,000/month replaces a meaningful chunk of a principal PM salary at the time allocation you actually have. That's $96,000-$144,000 a year from a single client. The important number isn't the ceiling, it's the speed: your first engagement can start within two to three weeks of your first outreach email, because the first client comes from your existing network. There's no build phase, no product validation, no twelve-month wait for traction. You sign a contract, you start working, you get paid at the end of the month. Once you've done one engagement well, your rate goes up: $12,000-$15,000/month per client is standard for a fractional head of product with a credible track record and a referral pipeline.",
  fullCapacityMath: "At 20-25 hours a week you can stack two or three fractional engagements at once, one head-of-product role plus an advisor retainer, or two smaller fractional engagements running in parallel. That puts you at $16,000-$30,000/month or $192,000-$360,000/year, paid on real contracts with predictable monthly invoices. Fractional operators who move up to full VP-of-Product packages in a specific vertical reach $15,000-$20,000/month per client once they've built a reputation, which pushes the ceiling to $300,000-$500,000+/year. The point isn't the top of the range, it's that you have full control over whether you stop at one client or go further.",
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
    console.log('✅ Jami pricing updated.');
    console.log('   Primary tier: $8,000-$12,000/month (was $6,000-$8,000)');
    console.log('   Advisor tier: $3,000-$6,000/month (was $3,000-$5,000)');
    console.log('   Full capacity: $16K-$30K/mo, $192K-$360K/yr');
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
