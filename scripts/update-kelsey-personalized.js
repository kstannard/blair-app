const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    // Update UserProfile with personalized data from her Typeform + LinkedIn
    await client.query(`
      UPDATE "UserProfile" SET
        traits = $1,
        strengths = $2,
        constraints = $3,
        summary = $4,
        "unfairAdvantageName" = $5,
        "unfairAdvantageDescription" = $6,
        "unfairAdvantageEvidence" = $7,
        "unfairAdvantageWhy" = $8,
        "linkedinSummary" = $9,
        "onlinePresence" = $10,
        "notableExperience" = $11,
        "updatedAt" = NOW()
      WHERE "userId" = 'kelsey-merkel-001'
    `, [
      JSON.stringify(["Strategic", "Creative", "Direct communicator", "High taste standards", "Prefers packaged work with clear scope"]),
      JSON.stringify([
        "Brand and communications strategy",
        "Crisis and reputation management",
        "Executive communications and thought leadership",
        "Narrative structure and positioning",
        "Translating complex business situations into clear, public-facing language",
        "Stakeholder communications across internal and external audiences"
      ]),
      JSON.stringify([
        "Wants time flexibility and meaningful wealth creation",
        "Wants packaged work with defined boundaries, not open-ended retainers",
        "Does not want to manage a team or create another full-time job",
        "Building around Avery (one daughter, young)",
        "Wants meaningful income within 3-6 months"
      ]),
      "Kelsey has spent over a decade in communications and PR. She ran strategic programs for brands like Pinterest and Spotify at DiGennaro Communications, took on an executive comms contract at Meta, and led the comms and PR function at WeightWatchers through a period that included a telehealth acquisition, board changes, and significant public scrutiny. She is based in Carlsbad, CA and is already in early stages of building her own consultancy.",
      "Translation Ability",
      "People with this advantage are translators between what something IS and what it NEEDS TO SAY. They walk into a room where everyone is confused about how to describe their own product, their own company, their own value and they just see it. They turn something complicated into language that makes a customer lean in. This is not about being a good writer (though they often are). It is about pattern recognition applied to narrative: spotting the disconnect between what a business actually does and how it is showing up in the world.",
      "You picked The Strategy and The Creative as your shoulder taps, which means people come to you both when they have a big goal but no plan AND when they cannot explain what they do. That combination is the signature of a translator. Your career backs it up: you built strategic comms programs for Pinterest and Spotify, managed executive thought leadership at Meta across hundreds of senior stakeholders, and led the full comms function at WeightWatchers. The range across industries and company stages is the point. You can walk into most organizations and quickly see the narrative problem.",
      "Translation Ability is one of the few skills that companies consistently underpay for when it is buried inside a salaried role and consistently overpay for when it is sold as a project-based service. The gap between what a Head of Comms earns in-house and what that same skill commands as a packaged outside engagement is significant. And because the work is project-based with a clear start and end date, it is one of the better models for someone who wants time flexibility alongside meaningful income.",
      "Over a decade in communications and PR. Rose from Account Executive to VP at DiGennaro Communications running strategic programs for Pinterest, Spotify, and S'well. Contract role in Global Industry Marketing at Meta. Most recently Head of Communications and PR at WeightWatchers for nearly six years.",
      JSON.stringify({
        linkedin: "Strong professional network in communications, PR, consumer brand, and healthtech circles",
        other: "Connected to the DTC wellness and consumer brand world through WeightWatchers and agency work"
      }),
      JSON.stringify([
        "Led communications and PR at WeightWatchers through a telehealth acquisition and significant organizational change",
        "Built and executed strategic comms programs for Pinterest and Spotify at DiGennaro Communications",
        "Managed executive thought leadership for senior stakeholders at Meta",
        "Negotiated brand sponsorships including conference partnerships and executive speaking roles",
        "Worked across healthcare, consumer tech, media, and DTC categories",
        "Rose from junior account work to VP over 7 years at a top communications agency"
      ])
    ]);

    console.log('UserProfile updated');

    // Build pricing and transition plan
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
      sideHustleMath: "At 13-15 hours per week, you run one Sprint at a time. Two per quarter. That is $64K-$120K per year at the middle of the range. You told us you want meaningful income within 3-6 months. This timeline works.",
      fullCapacityMath: "At 20-25 hours per week, you run two Sprints at once with Tune-Ups filling gaps. That is $150K-$250K per year. And you control your schedule.",
      momFit: "You told us you want packaged work with clear boundaries. That is not just a preference. It is a survival strategy when you are building around Avery. Open-ended retainers and ongoing advisory arrangements sound appealing until a client expects a response at 5:30 on a Tuesday while you are doing bath time.\n\nHere is why Messaging and Positioning actually works at this stage. The real work is thinking. Pattern recognition. Looking at a brand and seeing what everyone else is missing. That kind of thinking happens on walks, in the car, in the quiet moments between everything else. Then you sit down for a focused block and it spills out because your brain has already been working on it.\n\nProject-based work with hard end dates gives you time flexibility AND predictable income. You scope it, you deliver it, you move on. No ongoing client management. No Monday morning status calls. That is the version of this that is actually sustainable."
    });

    const transitionPlan = JSON.stringify([
      {
        title: "Pick one industry to start.",
        description: "You have worked across healthtech, consumer brand, DTC, and agency. Do not try to serve all of them right now. Pick the one where you have the strongest existing relationships and the sharpest point of view on what is broken. WeightWatchers and the wellness space is an obvious starting point. Start there."
      },
      {
        title: "Tell your network what you are building.",
        description: "You do not need a big announcement. Let two or three people know: I am taking on messaging and positioning projects. If you have a brand whose story is not landing, send them my way. With your DiGennaro and WeightWatchers network, the pipeline is already there. It just needs a nudge."
      },
      {
        title: "Land your first project at a right-sized rate.",
        description: "First client does not need to pay your full rate. They need to pay enough that you both take it seriously ($5K-$8K) and you need the case study. Do great work, document the before and after, and the referrals follow."
      },
      {
        title: "Scope everything with a hard end date.",
        description: "Every project gets a timeline, a deliverable list, and a handoff date. When a client asks for more, you say: that is a separate project, here is what it costs. That boundary is what keeps this from becoming another full-time job."
      }
    ]);

    // Update Recommendation with personalized copy
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
      "You have spent over a decade in communications and PR. You ran strategic programs for brands like Pinterest and Spotify at DiGennaro. You took on an executive comms contract at Meta. You led the comms and PR function at WeightWatchers through a period that included a telehealth acquisition, board changes, and significant public scrutiny.\n\nYou told us you want time flexibility and meaningful wealth creation. Packaged work with clear boundaries. Something that works around Avery, not the other way around.\n\nHere is what that looks like.",
      "The big idea:\nYou help companies figure out what they actually are, who they are for, and how to say it so the right people pay attention. High-ticket project work with clear scope and a hard end date. You come in, fix the story, hand it over.\n\nWhat you build:\nHere is an example. A Series B healthtech company just brought on a new CEO and needs to reintroduce itself to the market. Their messaging is still anchored in the founder era and does not reflect where the company is heading. You come in, interview the leadership team, and audit every touchpoint: website, investor deck, press page, social channels. You deliver a positioning package that includes the new narrative, a messaging framework, talking points for the CEO's first 90 days in market, and a crisis prep brief because you know they will need one. That is a $12K project, roughly 30 hours of your time.\n\nWho pays you (and how you find them):\nYour network spans startup founders, agency owners, DTC brands, and healthtech companies. Consumer brands in wellness and health are sitting on good products with stories that are not landing. You fix that. And with your WeightWatchers and DiGennaro background, you do not need to prove you can do this work. The track record already speaks.",
      pricingDetails,
      transitionPlan,
      "Take some time with this. Talk it through. Let it settle.\n\nIf your career has been about helping other organizations communicate what they are and what they stand for, this is your chance to build something under your own name. Blair is here to help you figure out exactly what that looks like."
    ]);

    console.log('Recommendation updated with personalized copy');
    console.log('Kelsey is ready to share.');
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
