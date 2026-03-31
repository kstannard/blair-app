const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    // Delete any existing records first (clean slate)
    await client.query('DELETE FROM "TaskProgress" WHERE "userId" = $1', ['kelsey-merkel-001']);
    await client.query('DELETE FROM "Recommendation" WHERE "userId" = $1', ['kelsey-merkel-001']);
    await client.query('DELETE FROM "UserProfile" WHERE "userId" = $1', ['kelsey-merkel-001']);

    // Create UserProfile
    await client.query(`
      INSERT INTO "UserProfile" (
        id, "userId", traits, strengths, constraints, summary,
        "unfairAdvantageName", "unfairAdvantageDescription",
        "unfairAdvantageEvidence", "unfairAdvantageWhy",
        "linkedinSummary", "onlinePresence", "notableExperience",
        "createdAt", "updatedAt"
      ) VALUES (
        'up-kelsey-001', 'kelsey-merkel-001',
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        NOW(), NOW()
      )
    `, [
      JSON.stringify(["Strategic", "Creative", "Direct communicator", "High taste standards", "Wants clarity before action"]),
      JSON.stringify(["Brand and messaging strategy", "Narrative structure and positioning", "Translating complex ideas into sharp language", "Marketing and campaign strategy", "Stakeholder communication"]),
      JSON.stringify(["Wants work that fits around family life", "Looking for reliable income with flexibility", "Doesn't want to trade one demanding job for another", "Needs a clear starting point"]),
      "Kelsey has a sharp eye for what makes a brand land. She knows when something's off before she can explain why, and she can fix it. She's built messaging that sticks, positioned offers that convert, and translated complicated ideas into language people actually want to read. She hasn't built her own thing yet. But the skill set is there, ready to go.",
      "Translation Ability",
      "People with this advantage are translators between what something IS and what it NEEDS TO SAY. They walk into a room where everyone is confused about how to describe their own product, their own company, their own value and they just see it. They turn something complicated into language that makes a customer lean in. This isn't about being a good writer (though they often are). It's about pattern recognition applied to narrative: spotting the disconnect between what a business actually does and how it's showing up in the world.",
      "You picked Creative and Strategy as your shoulder taps, which means people come to you when they can't explain what they are AND when they have a goal but no plan. That combination is the signature of a translator: you see the narrative problem and the strategic path to fix it.",
      "Translation Ability is one of the few skills that companies consistently underpay for when it's buried inside a salaried role and consistently overpay for when it's sold as an outside service. The gap between what a brand messaging lead earns on salary and what that same skill commands as project-based work is significant. This is one of the most valuable and most underleveraged skills out there.",
      "Brand and messaging strategy across agency and in-house environments. Known for bringing clarity to complex positioning problems.",
      JSON.stringify({ linkedin: "Professional network in marketing and brand strategy", portfolio: "Past campaign and messaging work" }),
      JSON.stringify(["Developed brand positioning for early-stage companies entering competitive markets", "Built messaging frameworks that clarified offers and improved conversion", "Created campaign strategy that connected brand story to sales outcomes", "Turned founder vision into language customers actually responded to", "Audited existing messaging and delivered focused, actionable rewrites"])
    ]);

    console.log('UserProfile created');

    // Create Recommendation
    const pricingDetails = JSON.stringify({
      tiers: [
        {
          name: "The Brand Sprint",
          price: "$5K-$12K for a full positioning and messaging overhaul (3-6 weeks). Where you land in that range depends on the client: a local business is on the lower end, a national brand or agency referral is on the higher end."
        },
        {
          name: "The Tune-Up",
          price: "$1.5K-$3K for a focused audit with specific recs (1-2 weeks)"
        }
      ],
      sideHustleMath: "At 3-5 hours per week, you run one Sprint at a time. Two per quarter. That's $40K-$64K per year at the middle of the range. Real money alongside your W2.",
      fullCapacityMath: "At 15-20 hours per week, you run two Sprints at once with some Tune-Ups filling gaps. That's $100K-$175K per year. Still not working 40-hour weeks.",
      momFit: "Here's what no one tells you about building something with young kids: it's not just that you have less time. It's that the time you do have is competing with the hundred other open browser tabs in your mind. You don't have 3-5 hours of fresh creative energy. You have 3-5 hours of whatever's left after a full day plus everything else.\n\nHere's why Messaging and Positioning actually works for this stage. The real work is thinking. It's pattern recognition. It's looking at a brand and seeing what everyone else is missing. That kind of work happens in the shower, on a walk, in the pickup line. If you're anything like most brand people, you're already doing this without trying. Then you sit down for your focused block and it just spills right out because your brain has been chewing on it.\n\nYou don't need 8-hour uninterrupted days for this. A sharp eye and a few focused hours is plenty."
    });

    const transitionPlan = JSON.stringify([
      {
        title: "Pick one industry to start.",
        description: "Don't try to serve everyone right away. Pick the industry where you have the strongest opinions about what's broken and the best existing relationships. Start there. You can always expand."
      },
      {
        title: "Tell your network what you're doing.",
        description: "It doesn't have to be a big announcement. Let 2-3 people know: 'I'm taking on positioning projects on the side. If you have a brand whose messaging isn't landing, send them my way.' That's it. The referral pipeline really is that simple when people already know you're good at this."
      },
      {
        title: "Land your first project at a friends-and-family rate.",
        description: "First client doesn't need to pay full rate. They need to pay enough that you both take it seriously ($3K-$5K) and you need the case study more than the revenue right now. Do great work, document the before and after. Now you have proof."
      },
      {
        title: "Scope everything with a hard end date.",
        description: "At limited hours per week, open-ended work will eat you alive. Every project gets a timeline, a deliverable list, and a handoff date. When a client says 'can you also...' you say 'totally, that's a separate project, here's what it costs.'"
      }
    ]);

    await client.query(`
      INSERT INTO "Recommendation" (
        id, "userId", "primaryPathId", "confirmedPathId",
        status, "personalIntro", "personalizedWhy",
        "pricingDetails", "transitionPlan", "closingNote",
        "createdAt", "updatedAt"
      ) VALUES (
        'rec-kelsey-001', 'kelsey-merkel-001', 'cmnajm4bm0001c39rkjq1b8zj', NULL,
        'approved', $1, $2, $3, $4, $5,
        NOW(), NOW()
      )
    `, [
      "You know what makes a brand land. You also know when something's off before you can fully explain why. That instinct is worth a lot more than most people realize, and it's time to charge for it.\n\nHere's what the data from your quiz tells us.",
      "The big idea:\nYou help companies figure out what they actually are, who they're for, and how to say it so people pay attention. High-ticket project work. You come in, fix the story, hand it over.\n\nWhat you build:\nHere's an example. A founder you know has been running a good business for two years but nobody outside their existing clients really gets what they do. Their website sounds like everyone else in their space. You come in, do a 90-minute founder interview, audit their current messaging, and deliver a positioning package: the one-liner, the website copy framework, the sales narrative, and the language that justifies their rates. That's an $8K project, roughly 20 hours of your time. The founder now has a brand that sounds like themselves. You get a great case study and a referral.\n\nWho pays you (and how you find them):\nYour network is your pipeline. Agency owners have clients who need sharper messaging. Creators and course builders know their offer is good but can't figure out why it's not converting. Founders in real estate, wellness, and services are sitting on good businesses with forgettable positioning. You fix that. And because you're not starting from scratch with strangers, we're not talking about cold outreach or building a content following. The work comes through people who already know you're sharp.",
      pricingDetails,
      transitionPlan,
      "Take a little time with this. Talk to your partner. Let it settle.\n\nIf your career has been about making other people's ideas land, it's a good time to build something of your own. Blair is here to help you do that without the guesswork."
    ]);

    console.log('Recommendation created');
    console.log('Done. Kelsey is ready.');
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
