// One-off: rewrite Jami's recommendation draft.
// Swap Micro-SaaS Builder (primary) → Fractional Operator (primary),
// demote Micro-SaaS to Alt 2, and replace Messaging & Positioning (Alt 2)
// so it falls off the list. Automation & Systems Builder stays as Alt 1.
//
// Jami is scared of financial risk and has 6-8 hrs/week. Micro-SaaS is an
// equity play that violates those constraints in year one. Fractional PM
// is the honest first recommendation for her profile.

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const USER_ID = 'cmnrrx7bn000004jpoqpgyqx6';
const REC_ID = 'cmnrswts2000204jr3n4wrlvp';

const PATH_IDS = {
  fractional: 'cmnajm4bj0000c39r8nm7a2x3',
  automation: 'cmnajm4bm0003c39rdul4wwae',
  microSaas:  'cmng994mh000kzmpwabd3yl2n',
};

const personalIntro = `You've spent over a decade in product management, including a long run at Amway, a stretch at Zendesk where you moved from customer experience into leading innovation and custom solutions teams, and now a principal PM role at HP. That's enterprise SaaS at serious scale, across multiple functions.

You told us you like what you do and you just want to do it for yourself. That's the cleanest signal we see in your answers. You're not pivoting or reinventing, you're taking the thing you're already very good at and stripping out the parts of corporate life you don't want, the political dynamics, the sense that it's all becoming another full-time job, the weeks where the work doesn't match what you actually do well.

You're working with 6-8 hours a week in fragmented bursts, you've got an 8-year-old and a 12-year-old, and the thing that scares you is the financial risk. That last one matters, and it's what's driving our recommendation. A lot of the advice in this space is "build a product and wait twelve months." We're not going to tell you to do that.

Here's the lowest-risk, highest-leverage version of doing product management for yourself.`;

const personalizedWhy = `The big idea:
You become a fractional head of product for a seed or Series A B2B SaaS company that needs senior product leadership but can't afford a full-time VP of Product. You're not building a software tool. You're not selling a course. You're doing the work you already know how to do, shipping roadmaps, running discovery, coaching PMs, working with founders on positioning, at 6-10 hours a week per client, at senior consulting rates, for a company whose founder has already been pitched a dozen ways to spend this money and would take an obvious yes.

What you build:
Here's a concrete example. A founder in your extended network, someone from Zendesk, HP, or two degrees out from either, is running a 20-person Series A SaaS company. They've got a VP of Engineering and a Head of Sales, no senior product person, and a roadmap that's drifting. They don't need a full-time hire for another six months, and they can't afford $350K base anyway. You come in as their fractional Head of Product for $6,000-$8,000/month at 6-8 hours a week. You run their weekly product review, coach their one or two PMs, sit in on exec meetings when it matters, and own the next quarter's roadmap and launch plan. You're not an employee. You have one client at a time, scope is clear, contract is 3-6 months with an option to extend. It's the thing you already do at HP, except you set the terms.

Who pays you (and how you find them):
You do not need to build a LinkedIn audience. You do not need to cold-pitch. Your first client comes from one conversation with someone you've already worked with at HP, Zendesk, or Amway. Think about who's now a founder, CTO, or VP of Engineering at a startup that raised in the last 18 months. That's your buyer. You email three of those people and say "I'm doing fractional product leadership now, 6-8 hours a week, I'd love to work with you or with a founder in your orbit who needs senior product help." One of them says yes or introduces you. That's the whole funnel. Once you've got a first happy client, your second and third clients come through their referrals, not through marketing. This is the path where your network does the selling, which matters because you told us you don't want to constantly sell yourself to keep the thing going.`;

const pricingDetails = JSON.stringify({
  tiers: [
    { name: "Fractional Head of Product", price: "$6,000-$8,000/month per client, 6-8 hours/week" },
    { name: "Senior product advisor", price: "$3,000-$5,000/month per client, 3-4 hours/week" },
  ],
  sideHustleMath: "One fractional engagement at $6,000-$8,000/month fills your available hours and replaces a meaningful chunk of a principal PM salary at the time allocation you actually have. That's $72,000-$96,000 a year from a single client. The important number isn't the ceiling, it's the speed: your first engagement can start within two to three weeks of your first outreach email, because the first client comes from your existing network. There's no build phase, no product validation, no twelve-month wait for traction. You sign a contract, you start working, you get paid at the end of the month.",
  fullCapacityMath: "At 20-25 hours a week you can stack two or three fractional engagements at once, one head-of-product role plus an advisor retainer, or two smaller fractional engagements running in parallel. That puts you at $12,000-$20,000/month or $144,000-$240,000/year, paid on real contracts with predictable monthly invoices. Fractional operators who move up to VP-level packages in a specific vertical can reach $15,000-$20,000/month per client once they've built a reputation, which changes the ceiling to $300,000-$400,000+.",
  momFit: "This is the path that respects your actual life. Fractional work is mostly async. Slack, Loom walkthroughs, comments on roadmap docs, with a couple of live meetings per week that you schedule around your calendar, not theirs. You don't have a manager. You don't have mandatory in-office days. You don't have a quota or a funnel you're chasing. Six to eight hours a week in fragmented bursts is what most fractional engagements actually look like in practice, a Monday morning product review, a Wednesday discovery call, async comments on docs in the evening after the kids are settled.\n\nThe real payoff is the risk profile. You said the financial risk is what scares you, and this is the only path on this list where that risk is close to zero. You sign a contract, you invoice monthly, you know exactly what month one and month two and month three look like. If it's not working on either side, you give notice and the other side does too, and you move on. It's not passive income. It's something better for where you are right now: predictable, senior, paid, and compatible with the two humans in your house."
});

// Automation & Systems Builder stays as Alt 1. Its existing alt copy is
// already well-written for Jami — keep it verbatim.
const automationAlt = {
  altDescription: "You design and build operational workflows and automations for companies using tools like Zapier, Make, Airtable, or custom integrations. Think of it as productized consulting: you audit how a team works, then build the system that makes it run without duct tape.",
  altWhyConsider: "You've spent your career turning messy cross-functional processes into structured systems. At Zendesk, you were literally analyzing workflows and developing strategies to improve operations. This path takes that same skill and packages it as a service. The client base overlaps with your network: mid-market and enterprise SaaS teams that have outgrown their internal tooling but aren't ready to hire a full ops team.",
  altTradeoff: "This is a services business, which means it earns faster than a product but doesn't compound the way a product does. You'd likely need 2-4 active clients at a time, and each engagement involves some back-and-forth on timelines and deliverables. It's not heavy selling, but you'd need to replenish your pipeline a few times a year. It also fits less neatly into fragmented time, since client work often involves syncing with their team's schedule.",
  altRevenueRange: "$3,000-$8,000 per engagement, with most projects taking 2-4 weeks of part-time effort. Two projects a month at fuller hours could put you at $6,000-$16,000/month.",
};

// Micro-SaaS Builder as Alt 2 — the honest "equity play if your risk
// tolerance changes" framing.
const microSaasAlt = {
  altDescription: "You build a small, focused software tool that solves one specific workflow problem you've seen over and over in enterprise product work. Something like a lightweight way for mid-market SaaS teams to centralize feature requests from support, sales, and customer success into one place. A $49-$149/month subscription per team, built with modern AI coding tools, launched first to a friendly audience of product leaders you already know.",
  altWhyConsider: "Your systems brain is the thing that makes this path viable at all. You don't just spot what's broken in a workflow, you see the architecture of the fix, and fourteen years in SaaS product management means you already know how to scope an MVP and validate it without wasting cycles. We're keeping Micro-SaaS on the list as a stretch goal, not because it's the lowest-risk bet for you, but because the upside is real: a product you own earns while you sleep and can eventually become an asset you can sell or walk away from. If you get a year of fractional income under your belt and decide you want to invest some of it into a build, this is the path we'd come back to.",
  altTradeoff: "Revenue takes 12-18 months to become meaningful. The first 4-6 months are building and validating with zero income, and even after launch, real MRR takes a year of iteration to arrive. You said financial risk is what scares you, and this is the path on your list where that risk actually shows up. It's worth being clear-eyed that this isn't compatible with the 'I want to feel secure about money' constraint in year one. It becomes compatible in year two or three, if the product works.",
  altRevenueRange: "Year one: $0-$6,000/month by month twelve, assuming the first 4-5 months are pure build. Year two onwards: $5,000-$20,000/month is achievable at fuller hours if the product finds its market. The honest downside is that a meaningful share of micro-SaaS products never cross $2,000/month.",
};

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update the Recommendation row: new copy, new primary path, clear confirmedPathId
    await client.query(
      `UPDATE "Recommendation" SET
        "primaryPathId" = $1,
        "confirmedPathId" = NULL,
        "personalIntro" = $2,
        "personalizedWhy" = $3,
        "pricingDetails" = $4,
        "updatedAt" = NOW()
       WHERE id = $5`,
      [PATH_IDS.fractional, personalIntro, personalizedWhy, pricingDetails, REC_ID]
    );

    // 2. Delete existing RecommendationPath rows (@@unique constraint on
    //    [recommendationId, pathId] makes in-place pathId swaps annoying)
    await client.query('DELETE FROM "RecommendationPath" WHERE "recommendationId" = $1', [REC_ID]);

    // 3. Insert the new three-path set
    // Rank 1: Fractional Operator (primary, no alt copy)
    await client.query(
      `INSERT INTO "RecommendationPath"
        (id, "recommendationId", "pathId", rank, "fitScore",
         "altDescription", "altWhyConsider", "altTradeoff", "altRevenueRange")
       VALUES ($1, $2, $3, 1, $4, NULL, NULL, NULL, NULL)`,
      ['cmnrswts2j0001xjami0fractnl', REC_ID, PATH_IDS.fractional, 95]
    );
    // Rank 2: Automation & Systems Builder
    await client.query(
      `INSERT INTO "RecommendationPath"
        (id, "recommendationId", "pathId", rank, "fitScore",
         "altDescription", "altWhyConsider", "altTradeoff", "altRevenueRange")
       VALUES ($1, $2, $3, 2, $4, $5, $6, $7, $8)`,
      ['cmnrswts2j0002xjami0automa', REC_ID, PATH_IDS.automation, 85,
       automationAlt.altDescription, automationAlt.altWhyConsider,
       automationAlt.altTradeoff, automationAlt.altRevenueRange]
    );
    // Rank 3: Micro-SaaS Builder
    await client.query(
      `INSERT INTO "RecommendationPath"
        (id, "recommendationId", "pathId", rank, "fitScore",
         "altDescription", "altWhyConsider", "altTradeoff", "altRevenueRange")
       VALUES ($1, $2, $3, 3, $4, $5, $6, $7, $8)`,
      ['cmnrswts2j0003xjami0microsaa', REC_ID, PATH_IDS.microSaas, 72,
       microSaasAlt.altDescription, microSaasAlt.altWhyConsider,
       microSaasAlt.altTradeoff, microSaasAlt.altRevenueRange]
    );

    await client.query('COMMIT');
    console.log('✅ Jami draft rewritten.');
    console.log('   Primary: Fractional Operator');
    console.log('   Alt 1:   Automation & Systems Builder');
    console.log('   Alt 2:   Micro-SaaS Builder');
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
