// Jami v3: fix tense, soften title positioning, broaden network framing,
// remove Bay-Area-specific salary anchor.
//
// What changed from v2:
// - Paragraph 2 of personalIntro is forward-tense (she hasn't left yet)
// - Title framing: "embedded product lead" / "fractional product operator"
//   instead of "fractional Head of Product" as the leading label. She's a
//   Principal PM in Michigan, doesn't identify as a Head of Product.
// - Network framing: former colleagues who moved to smaller companies,
//   not "founders, CTOs, VPs of Engineering" (too narrow)
// - Salary anchor: generic "$200K+ base + equity + ramp" instead of a
//   specific Bay Area number. Argument is total commitment, not base.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const REC_ID = 'cmnrswts2000204jr3n4wrlvp';

const personalIntro = `You've spent over a decade in product management, including a long run at Amway, a stretch at Zendesk where you moved from customer experience into leading innovation and custom solutions teams, and now a principal PM role at HP. That's enterprise SaaS at serious scale, across multiple functions.

You told us you like what you do and you just want to do it for yourself. That's the cleanest signal we see. You're not pivoting, you're not reinventing. You want to keep the work you're already good at, and you don't want to build something that turns into another full-time job with the same political dynamics you're trying to get away from.

You're working with 6-8 hours a week in fragmented bursts, you've got an 8-year-old and a 12-year-old, and the thing that scares you is the financial risk. That last one matters, and it's what's driving our recommendation. A lot of the advice in this space is "build a product and wait twelve months." We're not going to tell you to do that.

Here's where we'd have you start.`;

const personalizedWhy = `The big idea:
You start as an embedded product operator for a Series A B2B SaaS company that needs senior product leadership but can't commit to a full-time hire. You're not building a software tool. You're not selling a course. You're doing the work you already know how to do, owning a product area, running discovery, coaching PMs, working with founders on priorities, at 6-10 hours a week, for a founder who'd rather pay you by the month than make a six-figure commitment to a new hire. The title on the contract is flexible: fractional product operator, fractional head of product, senior product advisor on retainer. You're selling the scope, not the label, and you can pick whichever framing feels right for the first engagement.

What you build:
Here's a concrete example. A founder in your extended network, someone from Amway, Zendesk, or HP who's since moved to a smaller company, is running a 20-person Series A SaaS company that raised $12M eighteen months ago. They've got a VP of Engineering and a Head of Sales, no senior product person, and a roadmap that's drifting. A full-time senior product hire would cost them $200K+ base plus equity plus three months of ramp, and they're not ready to lock in that commitment yet. You come in for $7,000/month at 6-8 hours a week. You run their weekly product review, coach their one or two PMs, sit in on exec meetings when it matters, and own the next quarter's roadmap and launch plan. You're not an employee. You have one client at a time, scope is clear, contract is 3-6 months with an option to extend. It's the thing you already do at HP, except you set the terms.

By engagement two or three, your rate moves up. First-client pricing is about landing a reference, not about capturing the ceiling. Once you have a founder who will say "she ran our product org and we ship better now," the rate question changes. $9,000-$12,000/month becomes normal, and if you pick a vertical and become known for it, $12,000-$15,000/month is standard.

Who pays you (and how you find them):
You do not need to build a LinkedIn audience. You do not need to cold-pitch. Your first client comes from one conversation with someone you've already worked with. Think about former colleagues from Amway, Zendesk, or HP who've since moved to smaller, faster companies, people who used to be your peers and are now running teams, building products, or starting things. You don't need them to be founders. You need one of them to either need senior product help themselves, or to know someone who does. Email three of those people and say "I'm doing fractional product work now, 6-8 hours a week, I'd love to work with you or with someone in your orbit who needs senior product help." One of them says yes or introduces you. That's the whole funnel. Once you've got a first happy client, your second and third clients come through their referrals, not through marketing. This is the path where your network does the selling, which matters because you told us you don't want to constantly sell yourself to keep the thing going.`;

const pricingDetails = JSON.stringify({
  tiers: [
    {
      name: "Embedded product lead (fractional)",
      price: "$6,000-$10,000/month, 6-8 hrs/week. You own a product area, run discovery, coach their PMs, and sit in on exec meetings. This is the scope of a Head of Product compressed into part-time hours, for a Series A company that needs senior product help but can't commit to a full-time hire yet. The title on the contract can be Fractional Head of Product, Fractional Product Lead, or Senior Product Advisor, whichever feels right for the first engagement."
    },
    {
      name: "Senior product advisor (coaching)",
      price: "$3,000-$5,000/month, 3-4 hrs/week. You're a thought partner, not an operator. Weekly or bi-weekly 1:1s with the founder, roadmap reviews, hiring advice, specific unblocking. Lower scope, lower price, smaller commitment. Good for your second client alongside an embedded engagement, or as a first client that converts to embedded later."
    }
  ],
  sideHustleMath: "One embedded engagement at $7,000/month (a realistic first-engagement rate for a Series A company) is $84,000 a year from one client. The important number isn't the ceiling, it's the speed: your first engagement can start within two to three weeks of your first outreach email, because the first client comes from your existing network. There's no build phase, no product validation, no twelve-month wait for traction. You sign a contract, you start working, you get paid at the end of the month. By engagement two or three, your rate is closer to $9,000-$12,000/month. Your background supports the top of that range, but first-client pricing is about landing a reference, not about capturing the ceiling.",
  fullCapacityMath: "At 20-25 hours a week you can stack two or three engagements at once, two embedded product leads in parallel, or one embedded engagement plus one advisor retainer. That puts you at $12,000-$20,000/month, or $144,000-$240,000 a year, paid on real monthly contracts. Operators who pick a vertical and get known for it reach $15,000-$20,000/month per engagement, which pushes the ceiling to $300,000-$400,000+/year. The point isn't the top of the range, it's that you control whether you stop at one client or keep going. The ceiling moves with your reputation and your capacity, not with anything outside your control.",
  momFit: "This is the path that respects your actual life. Fractional work is mostly async. Slack, Loom walkthroughs, comments on roadmap docs, with a couple of live meetings per week that you schedule around your calendar, not theirs. You don't have a manager. You don't have mandatory in-office days. You don't have a quota or a funnel you're chasing. Six to eight hours a week in fragmented bursts is what most fractional engagements actually look like in practice, a Monday morning product review, a Wednesday discovery call, async comments on docs in the evening after the kids are settled.\n\nThe real payoff is the risk profile. You said the financial risk is what scares you, and this is the only path on this list where that risk is close to zero. You sign a contract, you invoice monthly, you know exactly what month one and month two and month three look like. If it's not working on either side, you give notice and the other side does too, and you move on. It's not passive income. It's something better for where you are right now: predictable, senior, paid, and compatible with the two humans in your house."
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE "Recommendation"
       SET "personalIntro" = $1,
           "personalizedWhy" = $2,
           "pricingDetails" = $3,
           "updatedAt" = NOW()
       WHERE id = $4`,
      [personalIntro, personalizedWhy, pricingDetails, REC_ID]
    );
    await client.query('COMMIT');
    console.log('✅ Jami v3 updated:');
    console.log('   - Intro paragraph 2 tense fixed (forward-looking, not present)');
    console.log('   - Tier 1: "Embedded product lead (fractional)" — title on contract is flexible');
    console.log('   - Network framing: former colleagues from her companies who moved elsewhere');
    console.log('   - Salary anchor: "$200K+ base plus equity plus ramp" (generic, not Bay Area)');
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
