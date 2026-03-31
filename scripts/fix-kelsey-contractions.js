const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    const pricingDetails = JSON.stringify({
      tiers: [
        {
          name: "The Brand Sprint",
          price: "$8K-$15K for a full positioning and messaging overhaul (3-6 weeks). Where you land in that range depends on the client: a local Carlsbad business is on the lower end, a national consumer brand through your network is on the higher end."
        },
        {
          name: "The Tune-Up",
          price: "$2.5K-$5K for a focused audit and specific recommendations (1-2 weeks)"
        }
      ],
      sideHustleMath: "At 13-15 hours a week, you run one Sprint at a time. Two per quarter. That's $64K-$120K per year at the middle of the range. You told us you want meaningful income within 3-6 months. This timeline works.",
      fullCapacityMath: "At 20-25 hours a week, you run two Sprints at once with Tune-Ups filling gaps. That's $150K-$250K per year. And you control your schedule.",
      momFit: "You told us you want packaged work with clear boundaries. That's not just a preference. It's a survival strategy when you're building around Avery. Open-ended retainers and ongoing advisory arrangements sound appealing until a client expects a response at 5:30 on a Tuesday while you're doing bath time.\n\nHere's why Messaging and Positioning actually works at this stage. The real work is thinking. Pattern recognition. Looking at a brand and seeing what everyone else is missing. That kind of thinking happens on walks, in the car, in the quiet moments between everything else. Then you sit down for a focused block and it spills out because your brain's already been working on it.\n\nProject-based work with hard end dates gives you time flexibility AND predictable income. You scope it, you deliver it, you move on. No ongoing client management. No Monday morning status calls. That's the version of this that's actually sustainable."
    });

    const transitionPlan = JSON.stringify([
      {
        title: "Pick one industry to start.",
        description: "You've worked across healthtech, consumer brand, DTC, and agency. Don't try to serve all of them right now. Pick the one where you have the strongest existing relationships and the sharpest point of view on what's broken. The wellness and health space is the obvious starting point. Start there."
      },
      {
        title: "Tell your network what you're building.",
        description: "You don't need a big announcement. Let two or three people know: I'm taking on messaging and positioning projects. If you have a brand whose story isn't landing, send them my way. With your DiGennaro and WeightWatchers network, the pipeline's already there. It just needs a nudge."
      },
      {
        title: "Land your first project at a right-sized rate.",
        description: "Your first client doesn't need to pay your full rate. They need to pay enough that you both take it seriously ($5K-$8K) and you need the case study more than the revenue right now. Do great work, document the before and after, and the referrals follow."
      },
      {
        title: "Scope everything with a hard end date.",
        description: "Every project gets a timeline, a deliverable list, and a handoff date. When a client asks for more, you say: that's a separate project, here's what it costs. That boundary is what keeps this from becoming another full-time job."
      }
    ]);

    await client.query(`
      UPDATE "Recommendation" SET
        "personalIntro" = $1,
        "personalizedWhy" = $2,
        "pricingDetails" = $3,
        "transitionPlan" = $4,
        "closingNote" = $5,
        "updatedAt" = NOW()
      WHERE "userId" = 'kelsey-merkel-001'
    `, [
      "You've spent over a decade in communications and PR. You ran strategic programs for brands like Pinterest and Spotify at DiGennaro. You took on an executive comms contract at Meta. And you led the comms and PR function at WeightWatchers through a period that included a telehealth acquisition, board changes, and significant public scrutiny.\n\nYou told us you want time flexibility and meaningful wealth creation. Packaged work with clear boundaries. Something that works around Avery, not the other way around.\n\nHere's what that looks like.",

      "The big idea:\nYou help companies figure out what they actually are, who they're for, and how to say it so the right people pay attention. High-ticket project work with clear scope and a hard end date. You come in, fix the story, hand it over.\n\nWhat you build:\nHere's an example. A Series B healthtech company just brought on a new CEO and needs to reintroduce itself to the market. Their messaging is stuck in the founder era and doesn't reflect where the company's heading. You come in, interview the leadership team, and audit every touchpoint: website, investor deck, press page, social channels. You deliver a positioning package: the new narrative, a messaging framework, talking points for the CEO's first 90 days in market, and a crisis prep brief because you know they'll need one. That's a $12K project, roughly 30 hours of your time.\n\nWho pays you (and how you find them):\nYour network spans startup founders, agency owners, DTC brands, and healthtech companies. Consumer brands in wellness and health are sitting on good products with stories that aren't landing. You fix that. And with your WeightWatchers and DiGennaro background, you don't need to prove you can do this work. The track record already speaks.",

      pricingDetails,
      transitionPlan,

      "Take some time with this. Talk it through. Let it settle.\n\nIf your career's been about helping other organizations tell their story, this is your chance to build something under your own name. Blair's here to help you figure out exactly what that looks like."
    ]);

    console.log('Done. Kelsey updated with contractions and proper voice.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
