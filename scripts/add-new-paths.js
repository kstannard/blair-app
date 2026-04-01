/**
 * Add 3 new business paths to the live database:
 * - Digital Product Builder
 * - Community & Membership Operator
 * - Micro-SaaS Builder
 *
 * Usage: node scripts/add-new-paths.js
 */
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

const NEW_PATHS = [
  {
    slug: "digital-product-builder",
    name: "Digital Product Builder",
    headline: "Turn your expertise into a product people buy without buying your time",
    description: "You take a specific thing you know deeply and turn it into something people can buy and use on their own: a course, a template system, a certification, a toolkit. You build it once, sell it many times, and make money whether or not you're at your desk.",
    whoThisIs: "Experts who want to build equity, not trade hours.",
    typicalBackground: "Senior professionals who've built frameworks, playbooks, or processes that teams relied on. You've been the person who created the system everyone else used. Now you're ready to sell that system directly.",
    workMode: "Deep focused creation blocks + lightweight community management",
    salesMotion: "Content-driven, SEO, word-of-mouth, and partnerships",
    failureMode: "Building something nobody asked for. Spending 6 months on a course without validating demand first. Or making it too broad to be useful to anyone specific.",
    businessModel: JSON.stringify({
      tiers: [
        { name: "Self-Paced Course or Toolkit", price: "$200-$2,000 one-time, or $50-$200/month subscription" },
        { name: "Cohort Program or Certification", price: "$500-$5,000 per cohort, 4-8 weeks" },
      ],
      sideHustleMath: "50 sales/month at $200 = $10K/month ($120K/year). 2 cohorts/year at 20 seats x $2K = $80K/year",
      fullTimeMath: "Product suite + cohorts + partnerships = $200K-$500K/year",
      risk: "Upfront creation time with no guaranteed sales. Need to validate before you build.",
    }),
    incomeRangeLow: 50000, incomeRangeHigh: 500000, timelineMonths: 4,
    toolRecommendations: JSON.stringify(["Teachable", "Gumroad", "ConvertKit", "Notion", "Canva", "Loom", "Circle"]),
    nicheExamples: JSON.stringify([
      "A manager training course for first-time leads at tech companies",
      "A GTM playbook template system for Series A founders",
      "An operations onboarding toolkit that growing companies buy for their entire team",
      "A certification program for RevOps professionals",
      "A template library for startup CFOs managing board decks and forecasts",
    ]),
    positioningTemplate: "I help [type of person] [achieve outcome] through [type of product] - so they get the result without needing to hire someone like me.",
    buyerProfile: JSON.stringify({ typicalTitle: "Individual professionals or L&D/team leads", companySize: "All sizes (individual) or 50-500 (team purchases)", triggerEvents: ["New role", "Scaling team", "Growing fast"], budgetAuthority: "Under $500: personal. $500-$5K: L&D budget.", whereTheyHangOut: ["LinkedIn", "Google", "Niche communities", "Podcasts"] }),
    outreachTemplate: "Hey [name],\n\nI've been building something and wanted your gut reaction. Would love 15 minutes to get your honest take.",
    gutCheckQuestions: JSON.stringify(["Would you buy this?", "What would you pay?", "What's missing from existing options?"]),
    order: 10,
    phases: [
      {
        name: "Find Your Product Idea", slug: "find-your-product-idea",
        description: "Before you build anything, you need to know what problem you're solving, who you're solving it for, and whether they'll pay for the solution.",
        order: 1,
        tasks: [
          { slug: "identify-your-productizable-expertise", title: "Identify Your Productizable Expertise", description: "You've built frameworks, processes, and systems that teams relied on. The question is: which one can you turn into something people buy and use without you in the room?", whyItMatters: "The best digital products come from things you've already done 50 times. You're not inventing something new. You're packaging what you know into a format that scales.", order: 1, taskType: "niche-editor", timeEstimate: "~15 min" },
          { slug: "write-your-product-promise", title: "Write Your Product Promise", description: "Turn your expertise into a clear promise: 'This [course / toolkit / template] helps [type of person] [achieve specific result] in [timeframe].'", whyItMatters: "A product promise that's specific enough to make someone think 'I need that' is the difference between a product that sells and one that sits there.", order: 2, taskType: "positioning-editor", timeEstimate: "~10 min" },
          { slug: "define-your-buyer", title: "Define Who Buys This", description: "Is your buyer an individual professional investing in themselves? A team lead buying for their team? An L&D department standardizing training? The answer changes everything.", whyItMatters: "Individual buyers decide in minutes and pay with a credit card. Team buyers take weeks and need a business case. Know which one you're building for.", order: 3, taskType: "buyer-profile-editor", timeEstimate: "~10 min" },
          { slug: "validate-before-you-build", title: "Validate Before You Build", description: "Before you spend weeks building a product, talk to 5 people who'd be your ideal buyer. Show them the promise. Ask if they'd buy it.", whyItMatters: "The #1 reason digital products fail is building what you think people want instead of what they actually want. These conversations save you months.", order: 4, taskType: "gut-check", timeEstimate: "~30 min" },
        ],
      },
      { name: "Build Your MVP Product", slug: "build-your-mvp-product", description: "", order: 2 },
      { name: "Set Up Your Sales Engine", slug: "set-up-your-sales-engine", description: "", order: 3 },
      { name: "Launch and Get First Sales", slug: "launch-and-get-first-sales", description: "", order: 4 },
      { name: "Iterate and Scale", slug: "iterate-and-scale", description: "", order: 5 },
    ],
  },
  {
    slug: "community-membership-operator",
    name: "Community & Membership Operator",
    headline: "Build a paid community where your network is the product",
    description: "You build a curated, paid community around a specific niche where you're the connector and curator, not the service provider. Your professional network, taste, and ability to bring the right people together is the business.",
    whoThisIs: "Connectors who are tired of giving away their best introductions for free.",
    typicalBackground: "Senior professionals who are already the person everyone comes to for intros, advice, and connections.",
    workMode: "Lightweight daily curation + periodic live events",
    salesMotion: "Network-driven, referral-based, organic word of mouth",
    failureMode: "Building a community that's too broad to be valuable, or burning out on content creation instead of letting the community generate its own value.",
    businessModel: JSON.stringify({
      tiers: [
        { name: "Core Membership", price: "$100-$300/month - Slack/Discord access, curated introductions, monthly roundtables" },
        { name: "Inner Circle / Executive Tier", price: "$500-$2,000/month - small group masterminds, quarterly dinners, 1:1 intros" },
      ],
      sideHustleMath: "30 members at $200/month = $6K/month ($72K/year). 5 hrs/week.",
      fullTimeMath: "100 members + 10 exec members = $30K/month ($360K/year)",
      risk: "Slow initial growth. Communities take 3-6 months to hit critical mass.",
    }),
    incomeRangeLow: 40000, incomeRangeHigh: 400000, timelineMonths: 4,
    toolRecommendations: JSON.stringify(["Slack", "Circle", "Stripe", "Luma", "Notion", "ConvertKit"]),
    nicheExamples: JSON.stringify([
      "A paid Slack community for Heads of Product at Series A-B companies",
      "Monthly dinners + private community for women in revenue leadership",
      "An executive peer group for startup COOs scaling from 30 to 150 people",
      "A curated membership for independent consultants sharing leads",
      "A founders community for working parents in tech",
    ]),
    positioningTemplate: "I run a [type of community] for [type of people] who [shared challenge or goal].",
    buyerProfile: JSON.stringify({ typicalTitle: "Mid-to-senior professionals", companySize: "50-5,000 employee companies", triggerEvents: ["Isolated in role", "New to leadership", "Tired of generic networking"], budgetAuthority: "Under $500/month: personal spend", whereTheyHangOut: ["LinkedIn", "Existing communities", "Conferences", "Peer referral"] }),
    outreachTemplate: "Hey [name],\n\nI'm putting together a small group of [professionals] for [community format]. You're exactly who I'd want in the room. Interested?",
    gutCheckQuestions: JSON.stringify(["Would you join?", "What would make you show up?", "How much would you pay?"]),
    order: 11,
    phases: [
      {
        name: "Define Your Community", slug: "define-your-community",
        description: "Before you launch anything, you need to know who belongs in the room, what they'll get out of it, and why they'd pay to be there.",
        order: 1,
        tasks: [
          { slug: "find-your-community-niche", title: "Find Your Community Niche", description: "You already connect people naturally. The question is: which specific group of people would pay to be in a room you curate?", whyItMatters: "Generic communities die. Specific ones thrive. 'A community for women in tech' is too broad. 'A peer group for Heads of Product at Series A-B companies' is a business.", order: 1, taskType: "niche-editor", timeEstimate: "~15 min" },
          { slug: "write-your-community-pitch", title: "Write Your Community Pitch", description: "Turn your community concept into one sentence: 'A [type of community] for [specific people] who want [what they can't get anywhere else].'", whyItMatters: "If someone reads this and immediately thinks 'I need to be in that room,' you've got it. If they think 'that's nice,' it's too vague.", order: 2, taskType: "positioning-editor", timeEstimate: "~10 min" },
          { slug: "profile-your-founding-members", title: "Profile Your Founding Members", description: "Your first 10-20 members define the community forever. Who are they? Do you already know 10 of them?", whyItMatters: "A community is only as good as its members. If you can name 10 people who'd join tomorrow, you have a business.", order: 3, taskType: "buyer-profile-editor", timeEstimate: "~10 min" },
          { slug: "test-the-concept", title: "Test the Concept", description: "Before you build infrastructure, host one event. A dinner, a roundtable, a Slack pop-up. Invite 8-10 people and see what happens.", whyItMatters: "One good conversation proves the concept better than any business plan. If people ask 'when's the next one?', you have your answer.", order: 4, taskType: "gut-check", timeEstimate: "~30 min" },
        ],
      },
      { name: "Build Your Platform", slug: "build-your-platform", description: "", order: 2 },
      { name: "Recruit Founding Members", slug: "recruit-founding-members", description: "", order: 3 },
      { name: "Launch and Activate", slug: "launch-and-activate", description: "", order: 4 },
      { name: "Grow and Monetize", slug: "grow-and-monetize", description: "", order: 5 },
    ],
  },
  {
    slug: "micro-saas-builder",
    name: "Micro-SaaS Builder",
    headline: "Build a small software product that solves one problem really well",
    description: "You identify a specific workflow problem you've seen 100 times, use modern tools (including AI) to build a lightweight product, and sell it on a recurring basis. You don't need to be an engineer. You need to understand the problem better than anyone.",
    whoThisIs: "Problem-spotters with enough technical comfort to build (or direct the building of) simple tools.",
    typicalBackground: "Product managers, ops leaders, RevOps professionals, or technically-curious generalists who've spent years watching people struggle with bad tools and manual processes.",
    workMode: "Deep focused building + customer feedback loops",
    salesMotion: "Product-led growth, content marketing, niche community presence",
    failureMode: "Building in a vacuum without talking to users. Over-engineering a simple solution. Trying to compete with enterprise software instead of owning a narrow niche.",
    businessModel: JSON.stringify({
      tiers: [
        { name: "Individual Plan", price: "$20-$100/month per user - core product access" },
        { name: "Team Plan", price: "$100-$500/month - multi-user, integrations, support" },
      ],
      sideHustleMath: "50 paying users at $50/month = $2.5K/month ($30K/year). Growth compounds.",
      fullTimeMath: "500 users at $50/month = $25K/month ($300K/year). 1,000 users = $600K/year.",
      risk: "Longer time to revenue. Need to ship fast, iterate faster. AI tools dramatically cut build time.",
    }),
    incomeRangeLow: 20000, incomeRangeHigh: 600000, timelineMonths: 6,
    toolRecommendations: JSON.stringify(["Cursor", "Vercel", "Supabase", "Stripe", "Framer", "PostHog", "Linear"]),
    nicheExamples: JSON.stringify([
      "An automated comp plan calculator for RevOps teams",
      "An AI tool that turns support tickets into categorized product feedback",
      "A niche CRM for independent recruiters",
      "A client portal for fractional executives",
      "A proposal generator for freelance consultants",
    ]),
    positioningTemplate: "I build [type of tool] that helps [type of user] [solve specific problem] - because the existing options are either too expensive, too complex, or don't exist.",
    buyerProfile: JSON.stringify({ typicalTitle: "End users or their managers", companySize: "10-500 employees", triggerEvents: ["Frustrated with tools", "Manual process", "Team growing"], budgetAuthority: "Under $200/month: team lead expense", whereTheyHangOut: ["Product Hunt", "Reddit", "Google", "Niche Slacks"] }),
    outreachTemplate: "Hey [name],\n\nI've been building a tool that [solves problem]. Looking for 5-10 people to try it. Free for early users. Open to taking a look?",
    gutCheckQuestions: JSON.stringify(["How do you currently solve this?", "How much time does it take?", "What would you pay?"]),
    order: 12,
    phases: [
      {
        name: "Find Your Problem", slug: "find-your-problem",
        description: "Before you write a line of code, you need to find a specific problem that specific people have, that they'd pay to solve, that you understand from the inside.",
        order: 1,
        tasks: [
          { slug: "spot-the-broken-workflow", title: "Spot the Broken Workflow", description: "Think about every manual process, spreadsheet hack, or 'I can't believe there's no tool for this' moment you've had in your career. Which one is a real business?", whyItMatters: "The best micro-SaaS products solve problems the builder has personally experienced. You don't need to be creative. You need to remember what frustrated you.", order: 1, taskType: "niche-editor", timeEstimate: "~15 min" },
          { slug: "write-your-product-thesis", title: "Write Your Product Thesis", description: "Turn your problem into a thesis: '[Type of person] wastes [X hours] every [week/month] on [manual process] because [existing tools don't solve it].'", whyItMatters: "This is your filter for every decision you'll make. If a feature doesn't serve this thesis, don't build it.", order: 2, taskType: "positioning-editor", timeEstimate: "~10 min" },
          { slug: "find-your-first-10-users", title: "Find Your First 10 Users", description: "Who specifically would use this? Where do they hang out? Can you find 10 of them and talk to them before you build anything?", whyItMatters: "If you can't find 10 people who have this problem, you don't have a product. If you can find 10 easily, you probably have hundreds of potential users.", order: 3, taskType: "buyer-profile-editor", timeEstimate: "~10 min" },
          { slug: "validate-the-problem", title: "Validate the Problem", description: "Talk to 5 potential users. Don't pitch your solution. Ask about the problem. How do they solve it now? How much time does it take?", whyItMatters: "You're looking for people who light up when you describe the problem. 'Oh my god, yes, we deal with that every week.' That's the signal.", order: 4, taskType: "gut-check", timeEstimate: "~30 min" },
        ],
      },
      { name: "Build Your MVP", slug: "build-your-mvp", description: "", order: 2 },
      { name: "Get Your First Users", slug: "get-your-first-users", description: "", order: 3 },
      { name: "Find Product-Market Fit", slug: "find-product-market-fit", description: "", order: 4 },
      { name: "Scale to Sustainable Revenue", slug: "scale-to-sustainable-revenue", description: "", order: 5 },
    ],
  },
];

async function main() {
  for (const pathDef of NEW_PATHS) {
    const { phases, ...pathData } = pathDef;

    // Check if path already exists
    const existing = await prisma.businessPath.findUnique({ where: { slug: pathData.slug } });
    if (existing) {
      console.log(`Path "${pathData.slug}" already exists, updating...`);
      await prisma.businessPath.update({ where: { slug: pathData.slug }, data: pathData });
    } else {
      console.log(`Creating path "${pathData.slug}"...`);
      await prisma.businessPath.create({ data: pathData });
    }

    const path = await prisma.businessPath.findUnique({ where: { slug: pathData.slug } });

    // Check if phases already exist
    const existingPhases = await prisma.phase.findMany({ where: { businessPathId: path.id } });
    if (existingPhases.length > 0) {
      console.log(`  Phases already exist for "${pathData.slug}", skipping phase/task creation`);
      continue;
    }

    // Create phases and tasks
    for (const phase of phases) {
      const { tasks, ...phaseData } = phase;
      const created = await prisma.phase.create({
        data: {
          ...phaseData,
          businessPathId: path.id,
        },
      });
      console.log(`  Phase: ${phase.name}`);

      if (tasks) {
        for (const task of tasks) {
          await prisma.task.create({
            data: {
              slug: `${pathData.slug}--${task.slug}`,
              title: task.title,
              description: task.description,
              whyItMatters: task.whyItMatters,
              order: task.order,
              taskType: task.taskType,
              timeEstimate: task.timeEstimate,
              phaseId: created.id,
            },
          });
          console.log(`    Task: ${task.title}`);
        }
      }
    }
  }

  console.log('\nDone! 3 new paths added to the database.');
}

main().catch(console.error).finally(() => pool.end());
