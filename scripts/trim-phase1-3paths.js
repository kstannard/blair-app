// Trim Phase 1 task copy for Messaging & Positioning Specialist,
// GTM & Growth Strategist, and Digital Product Builder.
//
// Same ~30% trim pattern used on Fractional Operator Phase 1:
// - Collapse setup + restatement into one sentence in descriptions
// - Trim whyItMatters to first sentence or two (cut padding sentences)
// - Keep the vivid example / quote when it earns its place

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const updates = [
  // ================================================================
  // GTM & GROWTH STRATEGIST — Phase 1
  // ================================================================
  {
    slug: 'gtm-growth-strategist--figure-out-your-specific-thing',
    description:
      "You have been solving problems inside companies for years. The question is which specific problem, at which specific type of company, is valuable enough that founders will pay you to solve it. Your first clients will come from people who say 'you should talk to [your name], she did exactly this at my company.'",
    whyItMatters:
      "Generalists compete on price. Specialists compete on reputation. A consultant who 'does GTM' is one of thousands. A consultant who helps Series B SaaS companies build their first outbound motion gets referred.",
  },
  {
    slug: 'gtm-growth-strategist--write-your-one-sentence',
    description:
      "Take your lane and turn it into a single sentence: 'I help [specific type of company] [achieve a specific outcome] by [what you actually do].' This sentence is what your network repeats when a founder friend describes the exact problem you solve.",
    whyItMatters:
      "Your one sentence does three things: it tells the right people to pay attention, it tells the wrong people to move on, and it gives your network the exact words to refer you.",
  },
  {
    slug: 'gtm-growth-strategist--get-clear-on-your-buyer',
    description:
      "'Companies that need help' is not a buyer. A buyer is a person with a name, a title, a budget, and a problem that is keeping them up at night. Get specific enough that you could spot them on LinkedIn in under 5 minutes.",
    whyItMatters:
      "If you cannot describe your buyer in one paragraph, you will waste weeks sending vague outreach to the wrong people. Knowing your buyer sharpens everything: your positioning, your pricing, your outreach, and your confidence.",
  },
  {
    slug: 'gtm-growth-strategist--gut-check-with-real-people',
    description:
      "Before you build a single other thing, test your positioning with 2-3 people who know your work. Not a sales conversation. A gut-check: 'Does this land? Does it sound like me? Who comes to mind when you hear it?'",
    whyItMatters:
      "These conversations do double duty. They validate your direction and they quietly let people know what you are building. The person you gut-check with today might introduce you to your first client next month.",
  },

  // ================================================================
  // MESSAGING & POSITIONING SPECIALIST — Phase 1
  // ================================================================
  {
    slug: 'messaging-positioning--figure-out-your-specific-thing',
    description:
      "You have been solving problems inside companies for years. The question is which specific problem, at which specific type of company, is valuable enough that founders will pay you to solve it. Your first clients will come from people who say 'you should talk to [your name], she did exactly this at my company.'",
    whyItMatters:
      "'I do messaging and positioning' sounds like an agency pitch. 'I help B2B startups rewrite their positioning when they have product-market fit but can't articulate why anyone should care' is a referral magnet.",
  },
  {
    slug: 'messaging-positioning--write-your-one-sentence',
    description:
      "Take your lane and turn it into a single sentence: 'I help [specific type of company] [achieve a specific outcome] by [what you actually do].' This sentence is the proof that you can do for yourself what you promise to do for clients.",
    whyItMatters:
      "Messaging specialists who cannot articulate their own positioning have a credibility problem. Your one sentence is proof of concept.",
  },
  {
    slug: 'messaging-positioning--get-clear-on-your-buyer',
    description:
      "'Companies that need help with messaging' is not a buyer. Your buyer is a specific person at a specific company at a specific moment. Get clear enough that you could spot them on LinkedIn in under 5 minutes.",
    whyItMatters:
      "The VP Marketing hire is a different sale than the founder hire. VPs buy process and deliverables. Founders buy outcomes and confidence. Knowing which one you are selling to changes everything about how you position and price.",
  },
  {
    slug: 'messaging-positioning--gut-check-with-real-people',
    description:
      "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check: 'Does this land? Does it sound like me? Who comes to mind?'",
    whyItMatters:
      "Messaging and positioning work is almost always sold through relationships, not inbound marketing. The person you gut-check with today is the person who refers your first client next quarter.",
  },

  // ================================================================
  // DIGITAL PRODUCT BUILDER — Phase 1
  // ================================================================
  {
    slug: 'digital-product-builder--identify-your-productizable-expertise',
    description:
      "You have built frameworks, processes, and systems that teams relied on. The question is: which one can you turn into something people pay for without you being in the room? The best digital products are born from work you have already done, packaged for people who face the same problem you used to solve.",
    whyItMatters:
      "The biggest mistake new product builders make is starting from scratch. Start from what you already know works and package it.",
  },
  {
    slug: 'digital-product-builder--write-your-product-promise',
    description:
      "Turn your expertise into a clear promise: 'This [course / toolkit / template / playbook] helps [type of person] [achieve specific outcome].' Your promise needs to be specific enough that the right buyer reads it and thinks 'that is exactly what I need.'",
    whyItMatters:
      "Your promise is your sales page in one sentence. Digital products live and die on clarity: people decide to buy in under 30 seconds. A vague promise means they scroll past.",
  },
  {
    slug: 'digital-product-builder--define-who-buys-this',
    description:
      "Is your buyer an individual professional investing in themselves? A team lead buying for their team? An L&D department buying at scale? Each buyer type has a different price sensitivity, decision process, and marketing channel.",
    whyItMatters:
      "Building a product for 'everyone' means your marketing speaks to no one. Get specific about who reaches for their wallet and why.",
  },
  {
    slug: 'digital-product-builder--validate-before-you-build',
    description:
      "Before you spend weeks building a product, talk to 5 people who would be your ideal buyer. Show them the promise. Ask: 'Would you pay for this? What would make it a no-brainer? What is missing?' Their answers will reshape your product before you build the wrong thing.",
    whyItMatters:
      "The graveyard of digital products is full of beautifully built courses nobody wanted. Validation before building saves weeks of wasted effort and protects your confidence.",
  },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const { slug, description, whyItMatters } of updates) {
      const res = await client.query(
        `UPDATE "Task" SET description = $1, "whyItMatters" = $2 WHERE slug = $3 RETURNING id`,
        [description, whyItMatters, slug]
      );
      if (res.rowCount === 0) {
        console.warn(`⚠ Task not found: ${slug}`);
      } else {
        const oldD = description.split(/\s+/).length;
        const oldW = whyItMatters.split(/\s+/).length;
        console.log(`✓ ${slug} → desc:${oldD}w why:${oldW}w`);
      }
    }

    await client.query('COMMIT');
    console.log('\n✅ Phase 1 trimmed for GTM, Messaging, Digital Product Builder.');
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
