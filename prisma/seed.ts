import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── Business Paths ──────────────────────────────────────────────────
  const paths = await Promise.all([
    prisma.businessPath.upsert({
      where: { slug: "fractional-operator" },
      update: {
        name: "Fractional Operator",
        headline: "Embed inside companies as their part-time operations leader",
        description:
          "You embed with 1-2 companies as their part-time operations leader. You own the systems, processes, and execution that keep the business running while the founders focus on growth.",
        whoThisIs: "Senior operators who thrive inside the business.",
        typicalBackground: "VP/Director of Ops at a growth-stage startup, COO at a smaller company, or senior program manager who's been running cross-functional initiatives for years. You've seen what good ops looks like at scale and you know how to build it from scratch.",
        workMode: "Meetings + async prep",
        salesMotion: "High-trust, relationship-driven",
        failureMode: "Taking on too many clients and becoming a bottleneck instead of a force multiplier. Or getting sucked into execution work that should be delegated, turning your fractional role into a full-time job at part-time pay.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Fractional Retainer", price: "$5K-$10K/month per client, 15-25 hrs/month" },
            { name: "Project Sprint", price: "$8K-$15K for a scoped ops overhaul, 4-8 weeks" },
          ],
          sideHustleMath: "1 client at 15 hrs/month = $5K-$10K/month ($60K-$120K/year)",
          fullTimeMath: "2-3 clients = $150K-$300K/year",
          risk: "Over-customization, burnout, scope creep",
        }),
        incomeRangeLow: 60000,
        incomeRangeHigh: 300000,
        timelineMonths: 2,
        toolRecommendations: JSON.stringify([
          "Notion",
          "Slack",
          "Loom",
          "Google Workspace",
          "Linear",
          "Asana",
        ]),
        nicheExamples: JSON.stringify([
          "Fractional VP Ops for Series A/B SaaS companies scaling from 30 to 150 employees",
          "Fractional COO for bootstrapped e-commerce brands doing $2M-$10M in revenue",
          "Fractional Head of Operations for venture-backed health tech startups",
          "Fractional Ops Leader for creative agencies managing 10-50 employees",
          "Post-acquisition integration specialist for PE-backed roll-ups",
        ]),
        positioningTemplate: "I help [growth-stage startups / specific industry] build the operational infrastructure they need to scale - without hiring a full-time VP Ops they're not ready for yet.",
        buyerProfile: JSON.stringify({
          typicalTitle: "CEO, Founder, or COO",
          companySize: "20-150 employees, Series A-C or $2M-$20M revenue",
          triggerEvents: [
            "Just raised a round and need to professionalize operations",
            "VP Ops or COO just left and they need interim coverage fast",
            "Growing faster than their systems can handle - things are breaking",
            "Board is asking for operational metrics and they don't have them",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "CEO peer groups (YPO, EO, Vistage)",
            "VC portfolio events and founder Slack communities",
            "LinkedIn (ops leadership and startup communities)",
            "On Deck, Pavilion, and other professional communities",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nHope you're doing well. I saw [company] just [raised / hit a milestone / grew the team]. Congrats - that's a big deal.\n\nI've been doing fractional ops work for companies at a similar stage, and I know firsthand how fast things can break when you're growing that quickly. If you ever want to bounce operational challenges off someone who's been in the weeds at companies like yours, I'd love to grab 15 minutes.\n\nNo pitch - just happy to be a sounding board.",
        gutCheckQuestions: JSON.stringify([
          "When you think about the day-to-day chaos in your company, what's the one thing that would change everything if it just worked?",
          "Have you tried hiring for this role full-time? What happened?",
          "What does your current ops infrastructure actually look like? Be honest - duct tape counts.",
          "If I could wave a magic wand and fix one operational problem in 90 days, what would it be?",
          "How are you making decisions about what to build vs. what to buy vs. what to outsource?",
          "What would need to be true for you to invest $7K/month in a fractional ops leader?",
        ]),
      },
      create: {
        slug: "fractional-operator",
        name: "Fractional Operator",
        headline: "Embed inside companies as their part-time operations leader",
        description:
          "You embed with 1-2 companies as their part-time operations leader. You own the systems, processes, and execution that keep the business running while the founders focus on growth.",
        whoThisIs: "Senior operators who thrive inside the business.",
        typicalBackground: "VP/Director of Ops at a growth-stage startup, COO at a smaller company, or senior program manager who's been running cross-functional initiatives for years. You've seen what good ops looks like at scale and you know how to build it from scratch.",
        workMode: "Meetings + async prep",
        salesMotion: "High-trust, relationship-driven",
        failureMode: "Taking on too many clients and becoming a bottleneck instead of a force multiplier. Or getting sucked into execution work that should be delegated, turning your fractional role into a full-time job at part-time pay.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Fractional Retainer", price: "$5K-$10K/month per client, 15-25 hrs/month" },
            { name: "Project Sprint", price: "$8K-$15K for a scoped ops overhaul, 4-8 weeks" },
          ],
          sideHustleMath: "1 client at 15 hrs/month = $5K-$10K/month ($60K-$120K/year)",
          fullTimeMath: "2-3 clients = $150K-$300K/year",
          risk: "Over-customization, burnout, scope creep",
        }),
        incomeRangeLow: 60000,
        incomeRangeHigh: 300000,
        timelineMonths: 2,
        toolRecommendations: JSON.stringify([
          "Notion",
          "Slack",
          "Loom",
          "Google Workspace",
          "Linear",
          "Asana",
        ]),
        nicheExamples: JSON.stringify([
          "Fractional VP Ops for Series A/B SaaS companies scaling from 30 to 150 employees",
          "Fractional COO for bootstrapped e-commerce brands doing $2M-$10M in revenue",
          "Fractional Head of Operations for venture-backed health tech startups",
          "Fractional Ops Leader for creative agencies managing 10-50 employees",
          "Post-acquisition integration specialist for PE-backed roll-ups",
        ]),
        positioningTemplate: "I help [growth-stage startups / specific industry] build the operational infrastructure they need to scale - without hiring a full-time VP Ops they're not ready for yet.",
        buyerProfile: JSON.stringify({
          typicalTitle: "CEO, Founder, or COO",
          companySize: "20-150 employees, Series A-C or $2M-$20M revenue",
          triggerEvents: [
            "Just raised a round and need to professionalize operations",
            "VP Ops or COO just left and they need interim coverage fast",
            "Growing faster than their systems can handle - things are breaking",
            "Board is asking for operational metrics and they don't have them",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "CEO peer groups (YPO, EO, Vistage)",
            "VC portfolio events and founder Slack communities",
            "LinkedIn (ops leadership and startup communities)",
            "On Deck, Pavilion, and other professional communities",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nHope you're doing well. I saw [company] just [raised / hit a milestone / grew the team]. Congrats - that's a big deal.\n\nI've been doing fractional ops work for companies at a similar stage, and I know firsthand how fast things can break when you're growing that quickly. If you ever want to bounce operational challenges off someone who's been in the weeds at companies like yours, I'd love to grab 15 minutes.\n\nNo pitch - just happy to be a sounding board.",
        gutCheckQuestions: JSON.stringify([
          "When you think about the day-to-day chaos in your company, what's the one thing that would change everything if it just worked?",
          "Have you tried hiring for this role full-time? What happened?",
          "What does your current ops infrastructure actually look like? Be honest - duct tape counts.",
          "If I could wave a magic wand and fix one operational problem in 90 days, what would it be?",
          "How are you making decisions about what to build vs. what to buy vs. what to outsource?",
          "What would need to be true for you to invest $7K/month in a fractional ops leader?",
        ]),
        order: 1,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "messaging-positioning" },
      update: {
        name: "Messaging & Positioning Specialist",
        headline: "Help companies figure out what they actually are, who they're for, and how to say it",
        description:
          "You walk into confused rooms and see the narrative problem. You shape how a company talks about itself - the story, the one-liner, the pitch, the why-us. Strategic, creative, high-leverage.",
        whoThisIs: "Strategic thinkers who shape narrative.",
        typicalBackground: "Brand strategist, communications director, copywriter who's evolved into strategy, or marketing leader who always gravitated toward the 'what do we say and why' questions over the 'where do we run ads' questions.",
        workMode: "Deep work + light client interaction",
        salesMotion: "Project-based, high-ticket",
        failureMode: "Endless revision cycles because the client can't articulate what 'right' looks like. Or underpricing because you think of yourself as a writer instead of a strategist.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "The Brand Sprint", price: "$5K-$12K for a full positioning and messaging overhaul (3-6 weeks)" },
            { name: "The Tune-Up", price: "$1.5K-$3K for a focused audit with specific recs (1-2 weeks)" },
          ],
          sideHustleMath: "1 Sprint at a time, 2 per quarter = $40K-$96K/year alongside your W2",
          fullTimeMath: "2 Sprints at once + Tune-Ups = $100K-$175K/year",
          risk: "Taste is subjective, scope creep on revisions",
        }),
        incomeRangeLow: 40000,
        incomeRangeHigh: 175000,
        nicheExamples: JSON.stringify([
          "Brand positioning for D2C wellness and beauty brands entering retail",
          "Messaging overhauls for B2B SaaS companies that can't explain what they do",
          "Positioning sprints for agencies rebranding or launching new service lines",
          "Founder personal brand strategy for first-time CEOs raising Series A",
          "Launch messaging for health tech companies entering regulated markets",
          "Narrative strategy for professional services firms competing on expertise",
        ]),
        positioningTemplate: "I help [type of company] figure out what they actually are, who they're for, and how to say it - so the right people pay attention.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder, CEO, or Head of Marketing",
          companySize: "Agencies, startups, and growing businesses with 10-50 employees",
          triggerEvents: [
            "Rebranding or launching a new product line",
            "Struggling to differentiate from competitors in sales conversations",
            "Website conversion is low despite decent traffic",
            "Just hired a marketing team but they have no clear messaging to work from",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "Twitter/X (marketing and startup communities)",
            "Agency-specific Slack groups and communities",
            "Substack newsletters about branding and strategy",
            "Creative Mornings and local founder meetups",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI've been following what you're building at [company] and I think the product is really strong. I'll be honest though - the way it's positioned right now doesn't do it justice. I think there's a clearer story hiding in there.\n\nI do messaging and positioning work for companies like yours, and I'd love to share a couple of quick observations. No strings - just think you deserve to have the language match the quality of what you've built.\n\nWould you be open to a quick call this week?",
        gutCheckQuestions: JSON.stringify([
          "When you describe what your company does at a dinner party, do people immediately get it or do their eyes glaze over?",
          "What's the last deal you lost? Was it on price, or did the prospect just not understand why you were different?",
          "If I asked your three best salespeople to describe what you do, would they say the same thing?",
          "Have you tried to solve this internally? What happened?",
          "What would it be worth to you if every prospect who landed on your site immediately understood why you're different?",
        ]),
      },
      create: {
        slug: "messaging-positioning",
        name: "Messaging & Positioning Specialist",
        headline: "Help companies figure out what they actually are, who they're for, and how to say it",
        description:
          "You walk into confused rooms and see the narrative problem. You shape how a company talks about itself - the story, the one-liner, the pitch, the why-us. Strategic, creative, high-leverage.",
        whoThisIs: "Strategic thinkers who shape narrative.",
        typicalBackground: "Brand strategist, communications director, copywriter who's evolved into strategy, or marketing leader who always gravitated toward the 'what do we say and why' questions over the 'where do we run ads' questions.",
        workMode: "Deep work + light client interaction",
        salesMotion: "Project-based, high-ticket",
        failureMode: "Endless revision cycles because the client can't articulate what 'right' looks like. Or underpricing because you think of yourself as a writer instead of a strategist.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "The Brand Sprint", price: "$5K-$12K for a full positioning and messaging overhaul (3-6 weeks)" },
            { name: "The Tune-Up", price: "$1.5K-$3K for a focused audit with specific recs (1-2 weeks)" },
          ],
          sideHustleMath: "1 Sprint at a time, 2 per quarter = $40K-$96K/year alongside your W2",
          fullTimeMath: "2 Sprints at once + Tune-Ups = $100K-$175K/year",
          risk: "Taste is subjective, scope creep on revisions",
        }),
        incomeRangeLow: 40000,
        incomeRangeHigh: 175000,
        timelineMonths: 1,
        toolRecommendations: JSON.stringify([
          "Google Docs",
          "Notion",
          "Figma",
          "Loom",
          "Miro",
        ]),
        nicheExamples: JSON.stringify([
          "Brand positioning for D2C wellness and beauty brands entering retail",
          "Messaging overhauls for B2B SaaS companies that can't explain what they do",
          "Positioning sprints for agencies rebranding or launching new service lines",
          "Founder personal brand strategy for first-time CEOs raising Series A",
          "Launch messaging for health tech companies entering regulated markets",
          "Narrative strategy for professional services firms competing on expertise",
        ]),
        positioningTemplate: "I help [type of company] figure out what they actually are, who they're for, and how to say it - so the right people pay attention.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder, CEO, or Head of Marketing",
          companySize: "Agencies, startups, and growing businesses with 10-50 employees",
          triggerEvents: [
            "Rebranding or launching a new product line",
            "Struggling to differentiate from competitors in sales conversations",
            "Website conversion is low despite decent traffic",
            "Just hired a marketing team but they have no clear messaging to work from",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "Twitter/X (marketing and startup communities)",
            "Agency-specific Slack groups and communities",
            "Substack newsletters about branding and strategy",
            "Creative Mornings and local founder meetups",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI've been following what you're building at [company] and I think the product is really strong. I'll be honest though - the way it's positioned right now doesn't do it justice. I think there's a clearer story hiding in there.\n\nI do messaging and positioning work for companies like yours, and I'd love to share a couple of quick observations. No strings - just think you deserve to have the language match the quality of what you've built.\n\nWould you be open to a quick call this week?",
        gutCheckQuestions: JSON.stringify([
          "When you describe what your company does at a dinner party, do people immediately get it or do their eyes glaze over?",
          "What's the last deal you lost? Was it on price, or did the prospect just not understand why you were different?",
          "If I asked your three best salespeople to describe what you do, would they say the same thing?",
          "Have you tried to solve this internally? What happened?",
          "What would it be worth to you if every prospect who landed on your site immediately understood why you're different?",
        ]),
        order: 2,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "gtm-growth-strategist" },
      update: {
        name: "GTM & Growth Strategist",
        headline: "Help companies build, fix, or scale their go-to-market motion",
        description:
          "You help companies launch products, fix broken funnels, and build repeatable revenue engines. High-ticket project work with clear scope and hard end dates.",
        whoThisIs: "Launch/revenue/funnel builders.",
        typicalBackground: "Head of Growth, VP of Sales, revenue leader, or senior marketing exec who's built go-to-market motions from scratch. You've launched products, designed sales processes, and know why most funnels leak.",
        workMode: "Project sprints",
        salesMotion: "Outcome-based pricing",
        failureMode: "Promising revenue outcomes you can't control. Or scoping too broadly and turning a 6-week sprint into a 6-month engagement that neither side is happy with.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "The GTM Sprint", price: "$10K-$18K for a scoped go-to-market build or overhaul (4-8 weeks)" },
            { name: "The Revenue Audit", price: "$5K-$8K for a focused diagnostic with specific recs (2-3 weeks)" },
          ],
          sideHustleMath: "1 Sprint every 6-8 weeks + Revenue Audits = $60K-$100K/year",
          fullTimeMath: "2 Sprints at once + audits = $250K-$400K/year",
          risk: "Scope creep, client expectations on revenue outcomes",
        }),
        incomeRangeLow: 60000,
        incomeRangeHigh: 400000,
        nicheExamples: JSON.stringify([
          "GTM strategy for B2B SaaS companies moving from founder-led sales to a repeatable motion",
          "Launch strategy for health tech startups entering enterprise markets",
          "Pipeline architecture for fintech companies expanding from SMB to mid-market",
          "Sales process design for dev tools companies selling to engineering leaders",
          "Channel strategy for marketplace startups building both supply and demand",
          "Revenue audit for Series B companies whose pipeline has stalled",
        ]),
        positioningTemplate: "I help [B2B companies at a specific stage] build the go-to-market engine that turns [product-market fit / early traction] into predictable, scalable revenue.",
        buyerProfile: JSON.stringify({
          typicalTitle: "VP of Sales, Head of Growth, or CEO/Founder",
          companySize: "B2B SaaS, 20-100 employees, Series A or B",
          triggerEvents: [
            "Just raised a funding round and need to scale pipeline",
            "Founder-led sales is hitting a ceiling - need to build a repeatable motion",
            "Entering a new market or segment and need a go-to-market plan",
            "Pipeline has stalled and leadership is asking why",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "LinkedIn (especially SaaS and sales leadership communities)",
            "Pavilion (formerly Revenue Collective)",
            "SaaStr events and Slack community",
            "Modern Sales Pros Slack",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nCongrats on [the raise / the new role / the product launch]. That's a big moment.\n\nI've been helping companies at a similar stage figure out their go-to-market motion - the stuff between 'we have a product' and 'we have a pipeline.' If you're thinking about how to build a repeatable sales process or scale what's working, I'd love to hear what you're wrestling with.\n\n15 minutes, no pitch. Just curious if there's overlap.",
        gutCheckQuestions: JSON.stringify([
          "Walk me through how a deal gets from first touch to closed-won today. Where does it break down?",
          "Are you losing deals to competitors, to 'no decision,' or to something else entirely?",
          "What does your current ICP look like, and how confident are you that it's right?",
          "If you could fix one thing about your pipeline in the next 90 days, what would it be?",
          "Have you tried to solve this with a full-time hire? What happened?",
          "What's the cost of not fixing this in the next quarter?",
        ]),
      },
      create: {
        slug: "gtm-growth-strategist",
        name: "GTM & Growth Strategist",
        headline: "Help companies build, fix, or scale their go-to-market motion",
        description:
          "You help companies launch products, fix broken funnels, and build repeatable revenue engines. High-ticket project work with clear scope and hard end dates.",
        whoThisIs: "Launch/revenue/funnel builders.",
        typicalBackground: "Head of Growth, VP of Sales, revenue leader, or senior marketing exec who's built go-to-market motions from scratch. You've launched products, designed sales processes, and know why most funnels leak.",
        workMode: "Project sprints",
        salesMotion: "Outcome-based pricing",
        failureMode: "Promising revenue outcomes you can't control. Or scoping too broadly and turning a 6-week sprint into a 6-month engagement that neither side is happy with.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "The GTM Sprint", price: "$10K-$18K for a scoped go-to-market build or overhaul (4-8 weeks)" },
            { name: "The Revenue Audit", price: "$5K-$8K for a focused diagnostic with specific recs (2-3 weeks)" },
          ],
          sideHustleMath: "1 Sprint every 6-8 weeks + Revenue Audits = $60K-$100K/year",
          fullTimeMath: "2 Sprints at once + audits = $250K-$400K/year",
          risk: "Scope creep, client expectations on revenue outcomes",
        }),
        incomeRangeLow: 60000,
        incomeRangeHigh: 400000,
        timelineMonths: 2,
        toolRecommendations: JSON.stringify([
          "HubSpot",
          "Salesforce",
          "Google Sheets",
          "Notion",
          "Loom",
          "Apollo",
        ]),
        nicheExamples: JSON.stringify([
          "GTM strategy for B2B SaaS companies moving from founder-led sales to a repeatable motion",
          "Launch strategy for health tech startups entering enterprise markets",
          "Pipeline architecture for fintech companies expanding from SMB to mid-market",
          "Sales process design for dev tools companies selling to engineering leaders",
          "Channel strategy for marketplace startups building both supply and demand",
          "Revenue audit for Series B companies whose pipeline has stalled",
        ]),
        positioningTemplate: "I help [B2B companies at a specific stage] build the go-to-market engine that turns [product-market fit / early traction] into predictable, scalable revenue.",
        buyerProfile: JSON.stringify({
          typicalTitle: "VP of Sales, Head of Growth, or CEO/Founder",
          companySize: "B2B SaaS, 20-100 employees, Series A or B",
          triggerEvents: [
            "Just raised a funding round and need to scale pipeline",
            "Founder-led sales is hitting a ceiling - need to build a repeatable motion",
            "Entering a new market or segment and need a go-to-market plan",
            "Pipeline has stalled and leadership is asking why",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "LinkedIn (especially SaaS and sales leadership communities)",
            "Pavilion (formerly Revenue Collective)",
            "SaaStr events and Slack community",
            "Modern Sales Pros Slack",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nCongrats on [the raise / the new role / the product launch]. That's a big moment.\n\nI've been helping companies at a similar stage figure out their go-to-market motion - the stuff between 'we have a product' and 'we have a pipeline.' If you're thinking about how to build a repeatable sales process or scale what's working, I'd love to hear what you're wrestling with.\n\n15 minutes, no pitch. Just curious if there's overlap.",
        gutCheckQuestions: JSON.stringify([
          "Walk me through how a deal gets from first touch to closed-won today. Where does it break down?",
          "Are you losing deals to competitors, to 'no decision,' or to something else entirely?",
          "What does your current ICP look like, and how confident are you that it's right?",
          "If you could fix one thing about your pipeline in the next 90 days, what would it be?",
          "Have you tried to solve this with a full-time hire? What happened?",
          "What's the cost of not fixing this in the next quarter?",
        ]),
        order: 3,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "automation-systems-builder" },
      update: {
        name: "Automation & Systems Builder",
        headline: "Build the systems, automations, and workflows that make businesses run without constant human intervention",
        description:
          "You build the systems, automations, and workflows that make businesses run without constant human intervention. Think Zapier flows, CRM setups, reporting dashboards, and operational infrastructure.",
        whoThisIs: "Process-first, tool-savvy problem solvers.",
        typicalBackground: "Business systems analyst, Salesforce admin, RevOps specialist, or the person on any team who built the spreadsheet everyone else relies on. You've spent years connecting tools, automating workflows, and wondering why everyone else does things manually.",
        workMode: "Deep work blocks, minimal meetings",
        salesMotion: "Productized builds or retainers",
        failureMode: "Building something technically elegant that the client can't maintain after you leave. Or undercharging because you think of yourself as 'the tech person' instead of 'the person who saved the company 200 hours a month.'",
        businessModel: JSON.stringify({
          tiers: [
            { name: "System Build", price: "$3K-$8K per project, 2-4 weeks" },
            { name: "Ongoing Optimization Retainer", price: "$2K-$5K/month" },
          ],
          sideHustleMath: "1-2 builds per month = $50K-$100K/year",
          fullTimeMath: "3-4 builds + 2 retainers = $150K-$250K/year",
          risk: "Undervaluing impact, giving away too much for too little",
        }),
        incomeRangeLow: 50000,
        incomeRangeHigh: 250000,
        nicheExamples: JSON.stringify([
          "CRM setup and optimization for service businesses outgrowing spreadsheets",
          "Zapier/Make automation builds for e-commerce brands with manual fulfillment processes",
          "Salesforce architecture for growing B2B sales teams",
          "Operations dashboards and reporting for agencies managing 20+ clients",
          "Data migration specialist for companies switching from legacy systems",
          "HubSpot implementation for marketing teams with no ops support",
        ]),
        positioningTemplate: "I build the [automation / systems / operational infrastructure] that lets [type of company] stop wasting time on manual processes and start scaling without adding headcount.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Head of Operations, VP of Sales, or Founder",
          companySize: "Small to mid-size companies, 10-200 employees, outgrowing their starter tools",
          triggerEvents: [
            "CRM is a mess and the team has stopped trusting the data",
            "Manually copying data between tools and making errors",
            "Just hired their 10th/20th/50th employee and everything is breaking",
            "New leadership wants real reporting but the data doesn't exist yet",
          ],
          budgetAuthority: "needs-approval",
          whereTheyHangOut: [
            "Salesforce Trailblazer Community and Dreamforce",
            "RevOps Co-op Slack community",
            "HubSpot user community and INBOUND conference",
            "LinkedIn (ops and systems automation groups)",
            "Zapier and Make community forums",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI noticed you're using [tool] for [process] - I've built automation systems for a few companies in your space and I bet there's a ton of manual work happening behind the scenes that doesn't need to be.\n\nI recently helped a similar company automate their [specific process] and it saved them about 15 hours a week. Would love to share what I learned if it's useful.\n\nHappy to do a quick 15-min audit - no strings attached.",
        gutCheckQuestions: JSON.stringify([
          "What's the most time-consuming manual process in your business right now?",
          "How many tools does your team use daily, and do any of them actually talk to each other?",
          "What happens when something breaks in your current workflow? Who fixes it?",
          "Have you tried to solve this with an internal hire or another tool? What happened?",
          "If I could eliminate 10 hours of busywork per week for your team, what would that be worth?",
          "What does your dream 'it just works' system look like?",
        ]),
      },
      create: {
        slug: "automation-systems-builder",
        name: "Automation & Systems Builder",
        headline: "Build the systems, automations, and workflows that make businesses run without constant human intervention",
        description:
          "You build the systems, automations, and workflows that make businesses run without constant human intervention. Think Zapier flows, CRM setups, reporting dashboards, and operational infrastructure.",
        whoThisIs: "Process-first, tool-savvy problem solvers.",
        typicalBackground: "Business systems analyst, Salesforce admin, RevOps specialist, or the person on any team who built the spreadsheet everyone else relies on. You've spent years connecting tools, automating workflows, and wondering why everyone else does things manually.",
        workMode: "Deep work blocks, minimal meetings",
        salesMotion: "Productized builds or retainers",
        failureMode: "Building something technically elegant that the client can't maintain after you leave. Or undercharging because you think of yourself as 'the tech person' instead of 'the person who saved the company 200 hours a month.'",
        businessModel: JSON.stringify({
          tiers: [
            { name: "System Build", price: "$3K-$8K per project, 2-4 weeks" },
            { name: "Ongoing Optimization Retainer", price: "$2K-$5K/month" },
          ],
          sideHustleMath: "1-2 builds per month = $50K-$100K/year",
          fullTimeMath: "3-4 builds + 2 retainers = $150K-$250K/year",
          risk: "Undervaluing impact, giving away too much for too little",
        }),
        incomeRangeLow: 50000,
        incomeRangeHigh: 250000,
        timelineMonths: 2,
        toolRecommendations: JSON.stringify([
          "Zapier",
          "Make",
          "Airtable",
          "Notion",
          "Slack",
          "Salesforce",
        ]),
        nicheExamples: JSON.stringify([
          "CRM setup and optimization for service businesses outgrowing spreadsheets",
          "Zapier/Make automation builds for e-commerce brands with manual fulfillment processes",
          "Salesforce architecture for growing B2B sales teams",
          "Operations dashboards and reporting for agencies managing 20+ clients",
          "Data migration specialist for companies switching from legacy systems",
          "HubSpot implementation for marketing teams with no ops support",
        ]),
        positioningTemplate: "I build the [automation / systems / operational infrastructure] that lets [type of company] stop wasting time on manual processes and start scaling without adding headcount.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Head of Operations, VP of Sales, or Founder",
          companySize: "Small to mid-size companies, 10-200 employees, outgrowing their starter tools",
          triggerEvents: [
            "CRM is a mess and the team has stopped trusting the data",
            "Manually copying data between tools and making errors",
            "Just hired their 10th/20th/50th employee and everything is breaking",
            "New leadership wants real reporting but the data doesn't exist yet",
          ],
          budgetAuthority: "needs-approval",
          whereTheyHangOut: [
            "Salesforce Trailblazer Community and Dreamforce",
            "RevOps Co-op Slack community",
            "HubSpot user community and INBOUND conference",
            "LinkedIn (ops and systems automation groups)",
            "Zapier and Make community forums",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI noticed you're using [tool] for [process] - I've built automation systems for a few companies in your space and I bet there's a ton of manual work happening behind the scenes that doesn't need to be.\n\nI recently helped a similar company automate their [specific process] and it saved them about 15 hours a week. Would love to share what I learned if it's useful.\n\nHappy to do a quick 15-min audit - no strings attached.",
        gutCheckQuestions: JSON.stringify([
          "What's the most time-consuming manual process in your business right now?",
          "How many tools does your team use daily, and do any of them actually talk to each other?",
          "What happens when something breaks in your current workflow? Who fixes it?",
          "Have you tried to solve this with an internal hire or another tool? What happened?",
          "If I could eliminate 10 hours of busywork per week for your team, what would that be worth?",
          "What does your dream 'it just works' system look like?",
        ]),
        order: 4,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "content-engine-operator" },
      update: {
        name: "Content Engine Operator",
        headline: "Run the content machine for founders and brands who need to be visible",
        description:
          "You run the content machine for founders and brands who know they need to be visible but don't have the time or taste to do it themselves. Newsletters, LinkedIn, podcasts, video - you own the strategy and production pipeline.",
        whoThisIs: "People who like turning ideas into distribution.",
        typicalBackground: "Head of Content, editorial lead, content marketing manager, or social media strategist who's graduated from posting into owning the entire content pipeline. You think in campaigns and calendars, not individual posts.",
        workMode: "Async production",
        salesMotion: "Monthly retainers",
        failureMode: "Becoming a content mill that trades hours for dollars instead of charging for strategic value. Or taking on clients whose voice you can't authentically capture, leading to mediocre output and churn.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Content Retainer", price: "$3K-$8K/month depending on volume and channels" },
            { name: "Content Strategy Sprint", price: "$5K-$10K one-time strategy + first month build" },
          ],
          sideHustleMath: "2-3 retainer clients = $72K-$150K/year",
          fullTimeMath: "5-8 clients with a VA = $200K-$400K/year",
          risk: "Churn, taste mismatch, becoming a commodity",
        }),
        incomeRangeLow: 72000,
        incomeRangeHigh: 400000,
        nicheExamples: JSON.stringify([
          "LinkedIn ghostwriting and thought leadership for B2B founders and executives",
          "Newsletter strategy and production for D2C brands building community",
          "Podcast production and repurposing pipeline for expert-led businesses",
          "Social content engine for health and wellness brands on Instagram and TikTok",
          "Content marketing for SaaS companies targeting developers",
          "YouTube strategy for professional services firms building authority",
        ]),
        positioningTemplate: "I run the content engine for [type of founder/brand] who know they need to be visible but don't have the [time / team / strategy] to make it happen consistently.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder, CEO, or VP of Marketing",
          companySize: "D2C brands, creator businesses, or B2B companies with 5-50 employees",
          triggerEvents: [
            "Know they should be posting consistently but can't stay on top of it",
            "Previous content efforts produced vanity metrics but no leads or sales",
            "Competitor is blowing up on LinkedIn/social and they're invisible",
            "Just hired a marketing person who needs content strategy to execute against",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "LinkedIn (content creator and founder communities)",
            "Twitter/X (media, writing, and startup communities)",
            "Substack and newsletter communities",
            "Podcasting communities and conferences",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI've been following your work at [company] and honestly, the product/service is great - but I don't think enough people know about it yet. You've got a story worth telling and I don't think it's being told consistently enough.\n\nI run content engines for [type of company] - strategy, production, distribution, the whole pipeline. Would love to share a couple ideas for how [company] could show up more consistently without you having to become a full-time content creator.\n\n15 minutes this week?",
        gutCheckQuestions: JSON.stringify([
          "What have you tried so far with content? What worked, what didn't?",
          "If your content was working perfectly, what would that look like for your business?",
          "How much time are you personally spending on content right now? How much do you want to spend?",
          "What's one piece of content your competitor put out that made you think 'why aren't we doing that?'",
          "If I could guarantee consistent, high-quality content every week for $5K/month, would that be a no-brainer investment or a stretch?",
          "Who on your team would I be working with day-to-day?",
        ]),
      },
      create: {
        slug: "content-engine-operator",
        name: "Content Engine Operator",
        headline: "Run the content machine for founders and brands who need to be visible",
        description:
          "You run the content machine for founders and brands who know they need to be visible but don't have the time or taste to do it themselves. Newsletters, LinkedIn, podcasts, video - you own the strategy and production pipeline.",
        whoThisIs: "People who like turning ideas into distribution.",
        typicalBackground: "Head of Content, editorial lead, content marketing manager, or social media strategist who's graduated from posting into owning the entire content pipeline. You think in campaigns and calendars, not individual posts.",
        workMode: "Async production",
        salesMotion: "Monthly retainers",
        failureMode: "Becoming a content mill that trades hours for dollars instead of charging for strategic value. Or taking on clients whose voice you can't authentically capture, leading to mediocre output and churn.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Content Retainer", price: "$3K-$8K/month depending on volume and channels" },
            { name: "Content Strategy Sprint", price: "$5K-$10K one-time strategy + first month build" },
          ],
          sideHustleMath: "2-3 retainer clients = $72K-$150K/year",
          fullTimeMath: "5-8 clients with a VA = $200K-$400K/year",
          risk: "Churn, taste mismatch, becoming a commodity",
        }),
        incomeRangeLow: 72000,
        incomeRangeHigh: 400000,
        timelineMonths: 3,
        toolRecommendations: JSON.stringify([
          "Notion",
          "Descript",
          "Canva",
          "Buffer",
          "ChatGPT",
          "Riverside",
        ]),
        nicheExamples: JSON.stringify([
          "LinkedIn ghostwriting and thought leadership for B2B founders and executives",
          "Newsletter strategy and production for D2C brands building community",
          "Podcast production and repurposing pipeline for expert-led businesses",
          "Social content engine for health and wellness brands on Instagram and TikTok",
          "Content marketing for SaaS companies targeting developers",
          "YouTube strategy for professional services firms building authority",
        ]),
        positioningTemplate: "I run the content engine for [type of founder/brand] who know they need to be visible but don't have the [time / team / strategy] to make it happen consistently.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder, CEO, or VP of Marketing",
          companySize: "D2C brands, creator businesses, or B2B companies with 5-50 employees",
          triggerEvents: [
            "Know they should be posting consistently but can't stay on top of it",
            "Previous content efforts produced vanity metrics but no leads or sales",
            "Competitor is blowing up on LinkedIn/social and they're invisible",
            "Just hired a marketing person who needs content strategy to execute against",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "LinkedIn (content creator and founder communities)",
            "Twitter/X (media, writing, and startup communities)",
            "Substack and newsletter communities",
            "Podcasting communities and conferences",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI've been following your work at [company] and honestly, the product/service is great - but I don't think enough people know about it yet. You've got a story worth telling and I don't think it's being told consistently enough.\n\nI run content engines for [type of company] - strategy, production, distribution, the whole pipeline. Would love to share a couple ideas for how [company] could show up more consistently without you having to become a full-time content creator.\n\n15 minutes this week?",
        gutCheckQuestions: JSON.stringify([
          "What have you tried so far with content? What worked, what didn't?",
          "If your content was working perfectly, what would that look like for your business?",
          "How much time are you personally spending on content right now? How much do you want to spend?",
          "What's one piece of content your competitor put out that made you think 'why aren't we doing that?'",
          "If I could guarantee consistent, high-quality content every week for $5K/month, would that be a no-brainer investment or a stretch?",
          "Who on your team would I be working with day-to-day?",
        ]),
        order: 5,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "lead-gen-operator" },
      update: {
        name: "Lead Gen Operator",
        headline: "Build and run the systems that generate qualified leads",
        description:
          "You build and run the systems that generate qualified leads for businesses. Paid ads, email sequences, landing pages, conversion optimization - you own the pipeline from click to booked call.",
        whoThisIs: "Performance-minded, optimization-oriented builders.",
        typicalBackground: "Performance marketing manager, demand gen specialist, growth marketer, or the person who managed the ad budget and actually knew where the leads were coming from. You love dashboards, A/B tests, and the moment when a funnel starts converting.",
        workMode: "Ongoing management",
        salesMotion: "Recurring retainers tied to ROI",
        failureMode: "Getting blamed for sales team problems that aren't yours. Or becoming dependent on a single platform (Meta, Google) and watching your results tank when the algorithm changes overnight.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Monthly Management", price: "$3K-$7K/month + ad spend" },
            { name: "Launch Package", price: "$5K-$10K to build the funnel, then transition to monthly" },
          ],
          sideHustleMath: "2-3 clients = $72K-$150K/year",
          fullTimeMath: "5-8 clients = $200K-$450K/year",
          risk: "Platform dependency, client churn when results lag",
        }),
        incomeRangeLow: 72000,
        incomeRangeHigh: 450000,
        nicheExamples: JSON.stringify([
          "Paid media management for B2B SaaS companies spending $10K-$100K/month on ads",
          "LinkedIn outbound and paid social for professional services firms",
          "Meta and Google Ads for e-commerce brands scaling from $1M to $10M",
          "Full-funnel lead gen for real estate teams and brokerages",
          "Cold email and outbound systems for agencies and consultancies",
          "Landing page optimization and CRO for SaaS companies with leaky funnels",
        ]),
        positioningTemplate: "I build and run the lead generation engine for [type of company] - turning ad spend into qualified pipeline and making sure every dollar has a measurable return.",
        buyerProfile: JSON.stringify({
          typicalTitle: "VP of Marketing, Head of Demand Gen, or Founder",
          companySize: "B2B or B2C companies spending $5K-$100K/month on customer acquisition",
          triggerEvents: [
            "Spending money on ads but cost per lead is too high",
            "Sales team is complaining about lead quality",
            "Current agency isn't delivering results and trust is broken",
            "Scaled past word-of-mouth and need a repeatable acquisition channel",
          ],
          budgetAuthority: "needs-approval",
          whereTheyHangOut: [
            "LinkedIn (growth marketing and demand gen communities)",
            "Twitter/X (paid media and performance marketing conversations)",
            "Demand Curve community and newsletter",
            "AdWorld conference and community",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI was poking around [company]'s ads and landing pages (occupational hazard - I can't stop auditing funnels). I spotted a few things that I think are costing you leads.\n\nI run lead gen systems for companies like yours and I'd love to share what I noticed. Not a pitch - just a few quick wins that might save you some ad spend this month.\n\nWant me to send over a quick breakdown?",
        gutCheckQuestions: JSON.stringify([
          "What's your current cost per lead, and what would you need it to be for the math to work?",
          "Walk me through what happens after a lead comes in. How fast does sales follow up?",
          "What channels are you running right now? What's working, what isn't?",
          "Have you worked with an agency or freelancer before? What went wrong?",
          "If I could cut your cost per lead in half in 60 days, what would that mean for your business?",
          "What's your monthly ad budget, and do you have flexibility to increase it if ROI is there?",
          "How do you currently measure success? What metrics does leadership actually care about?",
        ]),
      },
      create: {
        slug: "lead-gen-operator",
        name: "Lead Gen Operator",
        headline: "Build and run the systems that generate qualified leads",
        description:
          "You build and run the systems that generate qualified leads for businesses. Paid ads, email sequences, landing pages, conversion optimization - you own the pipeline from click to booked call.",
        whoThisIs: "Performance-minded, optimization-oriented builders.",
        typicalBackground: "Performance marketing manager, demand gen specialist, growth marketer, or the person who managed the ad budget and actually knew where the leads were coming from. You love dashboards, A/B tests, and the moment when a funnel starts converting.",
        workMode: "Ongoing management",
        salesMotion: "Recurring retainers tied to ROI",
        failureMode: "Getting blamed for sales team problems that aren't yours. Or becoming dependent on a single platform (Meta, Google) and watching your results tank when the algorithm changes overnight.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Monthly Management", price: "$3K-$7K/month + ad spend" },
            { name: "Launch Package", price: "$5K-$10K to build the funnel, then transition to monthly" },
          ],
          sideHustleMath: "2-3 clients = $72K-$150K/year",
          fullTimeMath: "5-8 clients = $200K-$450K/year",
          risk: "Platform dependency, client churn when results lag",
        }),
        incomeRangeLow: 72000,
        incomeRangeHigh: 450000,
        timelineMonths: 3,
        toolRecommendations: JSON.stringify([
          "Apollo",
          "HubSpot",
          "LinkedIn Sales Navigator",
          "Instantly",
          "Unbounce",
          "Google Ads",
        ]),
        nicheExamples: JSON.stringify([
          "Paid media management for B2B SaaS companies spending $10K-$100K/month on ads",
          "LinkedIn outbound and paid social for professional services firms",
          "Meta and Google Ads for e-commerce brands scaling from $1M to $10M",
          "Full-funnel lead gen for real estate teams and brokerages",
          "Cold email and outbound systems for agencies and consultancies",
          "Landing page optimization and CRO for SaaS companies with leaky funnels",
        ]),
        positioningTemplate: "I build and run the lead generation engine for [type of company] - turning ad spend into qualified pipeline and making sure every dollar has a measurable return.",
        buyerProfile: JSON.stringify({
          typicalTitle: "VP of Marketing, Head of Demand Gen, or Founder",
          companySize: "B2B or B2C companies spending $5K-$100K/month on customer acquisition",
          triggerEvents: [
            "Spending money on ads but cost per lead is too high",
            "Sales team is complaining about lead quality",
            "Current agency isn't delivering results and trust is broken",
            "Scaled past word-of-mouth and need a repeatable acquisition channel",
          ],
          budgetAuthority: "needs-approval",
          whereTheyHangOut: [
            "LinkedIn (growth marketing and demand gen communities)",
            "Twitter/X (paid media and performance marketing conversations)",
            "Demand Curve community and newsletter",
            "AdWorld conference and community",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI was poking around [company]'s ads and landing pages (occupational hazard - I can't stop auditing funnels). I spotted a few things that I think are costing you leads.\n\nI run lead gen systems for companies like yours and I'd love to share what I noticed. Not a pitch - just a few quick wins that might save you some ad spend this month.\n\nWant me to send over a quick breakdown?",
        gutCheckQuestions: JSON.stringify([
          "What's your current cost per lead, and what would you need it to be for the math to work?",
          "Walk me through what happens after a lead comes in. How fast does sales follow up?",
          "What channels are you running right now? What's working, what isn't?",
          "Have you worked with an agency or freelancer before? What went wrong?",
          "If I could cut your cost per lead in half in 60 days, what would that mean for your business?",
          "What's your monthly ad budget, and do you have flexibility to increase it if ROI is there?",
          "How do you currently measure success? What metrics does leadership actually care about?",
        ]),
        order: 6,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "studio-builder" },
      update: {
        name: "Studio Builder",
        headline: "Take a skill you can do in your sleep and package it into a repeatable offering",
        description:
          "You take a skill you can do in your sleep and package it into a repeatable offering. Same deliverable, same process, same price, different client every time. You're building a machine, not taking on projects.",
        whoThisIs: "People who want to build an asset, not sell hours.",
        typicalBackground: "Designer, developer, strategist, or specialist who's done the same type of project enough times to see the pattern. You're tired of reinventing the wheel and you're ready to systematize what you do into something that scales without you in every detail.",
        workMode: "Build once, sell repeatedly",
        salesMotion: "Inbound over time",
        failureMode: "Trying to productize before you've done enough custom work to know what the repeatable version looks like. Or building something nobody asked for because it felt elegant instead of solving a real pain point.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Productized Package", price: "$5K-$15K per engagement, fixed scope" },
            { name: "DIY Kit or Template", price: "$500-$2K, passive" },
          ],
          sideHustleMath: "2 packages/month = $120K-$360K/year",
          fullTimeMath: "4-6 packages/month + passive products = $300K-$600K/year",
          risk: "Slow ramp, need to do custom work first to find the pattern",
        }),
        incomeRangeLow: 120000,
        incomeRangeHigh: 600000,
        nicheExamples: JSON.stringify([
          "Productized design system builds for SaaS companies ($10K flat, 4 weeks)",
          "Website-in-a-week studio for professional services firms",
          "Brand identity package for food and beverage startups launching retail",
          "Financial model kit for founders preparing to raise their seed round",
          "SOC 2 readiness sprint for SaaS companies selling to enterprise",
          "Employee handbook and culture documentation package for startups hitting 50 employees",
        ]),
        positioningTemplate: "I run a studio that delivers [specific deliverable] for [type of company] in [timeframe] at a fixed price. Same great result, every time.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder, Head of Product, or Operations Lead",
          companySize: "Startups and growing companies that need a specific deliverable but don't want to hire full-time or manage an agency",
          triggerEvents: [
            "Need a specific deliverable done right, fast, and at a predictable price",
            "Burned by a custom agency engagement that went over budget and over time",
            "Scaling and need to standardize something that's been done ad hoc",
            "Preparing for a milestone (fundraise, launch, compliance audit) with a hard deadline",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "Indie Hackers and bootstrapper communities",
            "Twitter/X (productized service and creator economy conversations)",
            "Dribbble and Behance (for design studios)",
            "ProductHunt and Hacker News (for tech-adjacent studios)",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI saw you're [building / scaling / launching] at [company]. I run a studio that does one thing really well: [specific deliverable] for companies at your stage. Fixed price, fixed timeline, no surprises.\n\nI just wrapped one for [similar company] and the result was [specific outcome]. Would love to show you what it looked like.\n\nOpen to a quick look?",
        gutCheckQuestions: JSON.stringify([
          "Have you tried to get this done before? What happened?",
          "What would it mean for your business if this was done perfectly in [timeframe]?",
          "When you think about working with someone on this, what scares you most - price, quality, or timeline?",
          "Is this a one-time need, or would you come back for this again as you grow?",
          "If I could guarantee the deliverable in [X weeks] at a fixed price of [$X], would that be a no-brainer?",
          "Who else on your team would need to sign off on this?",
        ]),
      },
      create: {
        slug: "studio-builder",
        name: "Studio Builder",
        headline: "Take a skill you can do in your sleep and package it into a repeatable offering",
        description:
          "You take a skill you can do in your sleep and package it into a repeatable offering. Same deliverable, same process, same price, different client every time. You're building a machine, not taking on projects.",
        whoThisIs: "People who want to build an asset, not sell hours.",
        typicalBackground: "Designer, developer, strategist, or specialist who's done the same type of project enough times to see the pattern. You're tired of reinventing the wheel and you're ready to systematize what you do into something that scales without you in every detail.",
        workMode: "Build once, sell repeatedly",
        salesMotion: "Inbound over time",
        failureMode: "Trying to productize before you've done enough custom work to know what the repeatable version looks like. Or building something nobody asked for because it felt elegant instead of solving a real pain point.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Productized Package", price: "$5K-$15K per engagement, fixed scope" },
            { name: "DIY Kit or Template", price: "$500-$2K, passive" },
          ],
          sideHustleMath: "2 packages/month = $120K-$360K/year",
          fullTimeMath: "4-6 packages/month + passive products = $300K-$600K/year",
          risk: "Slow ramp, need to do custom work first to find the pattern",
        }),
        incomeRangeLow: 120000,
        incomeRangeHigh: 600000,
        timelineMonths: 5,
        toolRecommendations: JSON.stringify([
          "Notion",
          "Stripe",
          "Webflow",
          "ConvertKit",
          "Loom",
          "Figma",
        ]),
        nicheExamples: JSON.stringify([
          "Productized design system builds for SaaS companies ($10K flat, 4 weeks)",
          "Website-in-a-week studio for professional services firms",
          "Brand identity package for food and beverage startups launching retail",
          "Financial model kit for founders preparing to raise their seed round",
          "SOC 2 readiness sprint for SaaS companies selling to enterprise",
          "Employee handbook and culture documentation package for startups hitting 50 employees",
        ]),
        positioningTemplate: "I run a studio that delivers [specific deliverable] for [type of company] in [timeframe] at a fixed price. Same great result, every time.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder, Head of Product, or Operations Lead",
          companySize: "Startups and growing companies that need a specific deliverable but don't want to hire full-time or manage an agency",
          triggerEvents: [
            "Need a specific deliverable done right, fast, and at a predictable price",
            "Burned by a custom agency engagement that went over budget and over time",
            "Scaling and need to standardize something that's been done ad hoc",
            "Preparing for a milestone (fundraise, launch, compliance audit) with a hard deadline",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "Indie Hackers and bootstrapper communities",
            "Twitter/X (productized service and creator economy conversations)",
            "Dribbble and Behance (for design studios)",
            "ProductHunt and Hacker News (for tech-adjacent studios)",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI saw you're [building / scaling / launching] at [company]. I run a studio that does one thing really well: [specific deliverable] for companies at your stage. Fixed price, fixed timeline, no surprises.\n\nI just wrapped one for [similar company] and the result was [specific outcome]. Would love to show you what it looked like.\n\nOpen to a quick look?",
        gutCheckQuestions: JSON.stringify([
          "Have you tried to get this done before? What happened?",
          "What would it mean for your business if this was done perfectly in [timeframe]?",
          "When you think about working with someone on this, what scares you most - price, quality, or timeline?",
          "Is this a one-time need, or would you come back for this again as you grow?",
          "If I could guarantee the deliverable in [X weeks] at a fixed price of [$X], would that be a no-brainer?",
          "Who else on your team would need to sign off on this?",
        ]),
        order: 7,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "niche-talent-placement" },
      update: {
        name: "Niche Talent & Placement Operator",
        headline: "Connect high-growth companies with the specialized talent they can't find on their own",
        description:
          "You connect high-growth companies with the specialized talent they can't find on their own. You know what great looks like because you've been doing it, and you know the people because you've worked alongside them.",
        whoThisIs: "Matchmakers with taste and network access.",
        typicalBackground: "Head of Talent, recruiting lead, HR business partner, or senior operator who's spent years hiring and knows what 'great' looks like in a specific domain. Your LinkedIn DMs are full of people asking if you know anyone who's looking.",
        workMode: "Bursty, deal-driven",
        salesMotion: "Success fees",
        failureMode: "Spreading too thin across industries or roles where you don't have real conviction about what good looks like. Or spending all your time on business development instead of the matching and closing that actually generates revenue.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Placement Fee", price: "15-20% of first-year salary, typically $25K-$50K per placement" },
            { name: "Retained Search", price: "$10K-$20K upfront + success fee" },
          ],
          sideHustleMath: "3-4 placements/year = $75K-$200K",
          fullTimeMath: "8-12 placements/year = $200K-$600K",
          risk: "Feast/famine cycles, lumpy revenue",
        }),
        incomeRangeLow: 75000,
        incomeRangeHigh: 600000,
        nicheExamples: JSON.stringify([
          "Senior engineering placement for Series A-C startups (backend, infra, platform)",
          "Executive search for VP/C-level marketing roles at growth-stage companies",
          "Product management placement for B2B SaaS companies",
          "Revenue leadership (CRO, VP Sales) for fintech companies",
          "Design leadership placement for startups building their first design team",
          "Fractional exec matching - connecting companies with vetted fractional leaders",
        ]),
        positioningTemplate: "I place [specific role type] at [specific company type] by tapping a network of vetted candidates that generalist recruiters can't reach.",
        buyerProfile: JSON.stringify({
          typicalTitle: "CTO, VP Engineering, CEO, or Head of People",
          companySize: "Startups and growth companies, 20-500 employees, hiring senior specialized talent",
          triggerEvents: [
            "Been looking for 3+ months and their internal recruiter is striking out",
            "Need to fill a senior role fast because the team is burning out",
            "Previous hire didn't work out and they can't afford another miss",
            "Growing into a new function and don't know what 'great' looks like for the role",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "LinkedIn (hiring managers and talent acquisition communities)",
            "CTO and VP Engineering peer groups",
            "Startup talent and recruiting Slack communities",
            "Industry-specific conferences where hiring conversations happen naturally",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI saw you're hiring a [role] at [company]. I've been placing [role type] at companies like yours for a while now, and I might know a few people who'd be a great fit.\n\nI don't do the spray-and-pray thing - I only reach out when I think there's a real match. Would it be helpful if I sent over a couple profiles for you to look at? No commitment, just want to see if we're on the same page about what great looks like for this role.",
        gutCheckQuestions: JSON.stringify([
          "What does the ideal candidate for this role actually look like? Not the job description - the real answer.",
          "What went wrong with the last person in this role (or the last hire that didn't work out)?",
          "How long have you been looking? What's your internal recruiter been trying?",
          "What's the real timeline here? Is this urgent-urgent or 'we should probably fill this'?",
          "What's the comp range you're working with? Is there flexibility if we find someone exceptional?",
          "If I could put three vetted candidates in front of you in the next two weeks, would you be ready to move?",
        ]),
      },
      create: {
        slug: "niche-talent-placement",
        name: "Niche Talent & Placement Operator",
        headline: "Connect high-growth companies with the specialized talent they can't find on their own",
        description:
          "You connect high-growth companies with the specialized talent they can't find on their own. You know what great looks like because you've been doing it, and you know the people because you've worked alongside them.",
        whoThisIs: "Matchmakers with taste and network access.",
        typicalBackground: "Head of Talent, recruiting lead, HR business partner, or senior operator who's spent years hiring and knows what 'great' looks like in a specific domain. Your LinkedIn DMs are full of people asking if you know anyone who's looking.",
        workMode: "Bursty, deal-driven",
        salesMotion: "Success fees",
        failureMode: "Spreading too thin across industries or roles where you don't have real conviction about what good looks like. Or spending all your time on business development instead of the matching and closing that actually generates revenue.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Placement Fee", price: "15-20% of first-year salary, typically $25K-$50K per placement" },
            { name: "Retained Search", price: "$10K-$20K upfront + success fee" },
          ],
          sideHustleMath: "3-4 placements/year = $75K-$200K",
          fullTimeMath: "8-12 placements/year = $200K-$600K",
          risk: "Feast/famine cycles, lumpy revenue",
        }),
        incomeRangeLow: 75000,
        incomeRangeHigh: 600000,
        timelineMonths: 3,
        toolRecommendations: JSON.stringify([
          "LinkedIn Recruiter",
          "Notion",
          "Calendly",
          "Airtable",
          "Gem",
          "Loom",
        ]),
        nicheExamples: JSON.stringify([
          "Senior engineering placement for Series A-C startups (backend, infra, platform)",
          "Executive search for VP/C-level marketing roles at growth-stage companies",
          "Product management placement for B2B SaaS companies",
          "Revenue leadership (CRO, VP Sales) for fintech companies",
          "Design leadership placement for startups building their first design team",
          "Fractional exec matching - connecting companies with vetted fractional leaders",
        ]),
        positioningTemplate: "I place [specific role type] at [specific company type] by tapping a network of vetted candidates that generalist recruiters can't reach.",
        buyerProfile: JSON.stringify({
          typicalTitle: "CTO, VP Engineering, CEO, or Head of People",
          companySize: "Startups and growth companies, 20-500 employees, hiring senior specialized talent",
          triggerEvents: [
            "Been looking for 3+ months and their internal recruiter is striking out",
            "Need to fill a senior role fast because the team is burning out",
            "Previous hire didn't work out and they can't afford another miss",
            "Growing into a new function and don't know what 'great' looks like for the role",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "LinkedIn (hiring managers and talent acquisition communities)",
            "CTO and VP Engineering peer groups",
            "Startup talent and recruiting Slack communities",
            "Industry-specific conferences where hiring conversations happen naturally",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI saw you're hiring a [role] at [company]. I've been placing [role type] at companies like yours for a while now, and I might know a few people who'd be a great fit.\n\nI don't do the spray-and-pray thing - I only reach out when I think there's a real match. Would it be helpful if I sent over a couple profiles for you to look at? No commitment, just want to see if we're on the same page about what great looks like for this role.",
        gutCheckQuestions: JSON.stringify([
          "What does the ideal candidate for this role actually look like? Not the job description - the real answer.",
          "What went wrong with the last person in this role (or the last hire that didn't work out)?",
          "How long have you been looking? What's your internal recruiter been trying?",
          "What's the real timeline here? Is this urgent-urgent or 'we should probably fill this'?",
          "What's the comp range you're working with? Is there flexibility if we find someone exceptional?",
          "If I could put three vetted candidates in front of you in the next two weeks, would you be ready to move?",
        ]),
        order: 8,
      },
    }),
    prisma.businessPath.upsert({
      where: { slug: "investor-operator" },
      update: {
        name: "Investor-Operator",
        headline: "Invest in and advise early-stage companies with operational expertise alongside capital",
        description:
          "You invest in and advise early-stage companies, bringing operational expertise alongside capital. You're not running the day-to-day - you're governing, advising, and opening doors.",
        whoThisIs: "Capital allocators and governors.",
        typicalBackground: "Former C-suite exec (CFO, COO, CRO) who's been through an exit or IPO, experienced angel investor, or senior operator with enough capital and credibility to be a value-add investor. You've sat in the seat and know what early-stage companies actually need beyond money.",
        workMode: "Oversight, not execution",
        salesMotion: "Deals, not clients",
        failureMode: "Overcommitting your time to too many companies and becoming the advisor who never responds. Or investing based on relationship loyalty instead of real conviction about the business.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Advisory Fee + Equity", price: "$2K-$5K/month + 0.5-2% equity" },
            { name: "Angel Investment", price: "$25K-$100K per deal with board/advisory seat" },
          ],
          sideHustleMath: "2-3 advisory roles + 1-2 angel deals/year",
          fullTimeMath: "Portfolio of 5-8 companies with advisory fees + equity upside",
          risk: "Overconfidence, illiquidity, time creep",
        }),
        incomeRangeLow: 50000,
        incomeRangeHigh: 500000,
        nicheExamples: JSON.stringify([
          "Angel investor and advisor to health tech companies at seed and Series A",
          "Fractional CFO advisor to first-time founders preparing for fundraise",
          "Board advisor for B2B SaaS companies navigating $1M-$10M ARR growth",
          "Operating partner at a micro-PE fund acquiring and improving small software companies",
          "Advisor to women-led startups with a focus on go-to-market and fundraising strategy",
          "Strategic advisor to climate tech startups connecting technical founders with enterprise buyers",
        ]),
        positioningTemplate: "I invest in and advise [type of company] at [stage] - bringing [specific operational expertise] alongside capital to help founders avoid the mistakes I've already made.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder/CEO at seed or Series A stage",
          companySize: "Pre-seed to Series A, 2-30 employees, looking for smart money and operational guidance",
          triggerEvents: [
            "Raising a round and looking for angels who bring more than just a check",
            "Hit a growth wall and need someone who's been through it to advise",
            "Preparing for board formation and need experienced independent directors",
            "Previous advisor relationship fizzled and they need someone who actually shows up",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "AngelList and angel investing syndicates",
            "VC portfolio events and demo days",
            "Founder peer groups and accelerator alumni networks",
            "Industry-specific conferences (health tech, fintech, climate tech, etc.)",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI've been watching what you're building at [company] and I'm impressed. The [specific thing] is really smart.\n\nI invest in and advise companies at your stage - I was [previous role] and I've been through [relevant experience]. I think there might be ways I could be helpful beyond just writing a check.\n\nWould you be open to a conversation? I'd love to learn more about where you're headed.",
        gutCheckQuestions: JSON.stringify([
          "What's the hardest problem you're facing right now that money alone won't solve?",
          "What does your cap table look like, and what kind of investor are you actually looking for?",
          "If I were to advise you for the next 12 months, what would you want me to help with most?",
          "How do you make decisions when you and your co-founder disagree?",
          "What does success look like for this company in 3 years? Be honest, not aspirational.",
          "What's the thing about your business that keeps you up at night that you haven't told your investors?",
          "If this doesn't work, what's your plan B?",
        ]),
      },
      create: {
        slug: "investor-operator",
        name: "Investor-Operator",
        headline: "Invest in and advise early-stage companies with operational expertise alongside capital",
        description:
          "You invest in and advise early-stage companies, bringing operational expertise alongside capital. You're not running the day-to-day - you're governing, advising, and opening doors.",
        whoThisIs: "Capital allocators and governors.",
        typicalBackground: "Former C-suite exec (CFO, COO, CRO) who's been through an exit or IPO, experienced angel investor, or senior operator with enough capital and credibility to be a value-add investor. You've sat in the seat and know what early-stage companies actually need beyond money.",
        workMode: "Oversight, not execution",
        salesMotion: "Deals, not clients",
        failureMode: "Overcommitting your time to too many companies and becoming the advisor who never responds. Or investing based on relationship loyalty instead of real conviction about the business.",
        businessModel: JSON.stringify({
          tiers: [
            { name: "Advisory Fee + Equity", price: "$2K-$5K/month + 0.5-2% equity" },
            { name: "Angel Investment", price: "$25K-$100K per deal with board/advisory seat" },
          ],
          sideHustleMath: "2-3 advisory roles + 1-2 angel deals/year",
          fullTimeMath: "Portfolio of 5-8 companies with advisory fees + equity upside",
          risk: "Overconfidence, illiquidity, time creep",
        }),
        incomeRangeLow: 50000,
        incomeRangeHigh: 500000,
        timelineMonths: 5,
        toolRecommendations: JSON.stringify([
          "AngelList",
          "Carta",
          "Google Sheets",
          "Notion",
          "DocSend",
          "Visible",
        ]),
        nicheExamples: JSON.stringify([
          "Angel investor and advisor to health tech companies at seed and Series A",
          "Fractional CFO advisor to first-time founders preparing for fundraise",
          "Board advisor for B2B SaaS companies navigating $1M-$10M ARR growth",
          "Operating partner at a micro-PE fund acquiring and improving small software companies",
          "Advisor to women-led startups with a focus on go-to-market and fundraising strategy",
          "Strategic advisor to climate tech startups connecting technical founders with enterprise buyers",
        ]),
        positioningTemplate: "I invest in and advise [type of company] at [stage] - bringing [specific operational expertise] alongside capital to help founders avoid the mistakes I've already made.",
        buyerProfile: JSON.stringify({
          typicalTitle: "Founder/CEO at seed or Series A stage",
          companySize: "Pre-seed to Series A, 2-30 employees, looking for smart money and operational guidance",
          triggerEvents: [
            "Raising a round and looking for angels who bring more than just a check",
            "Hit a growth wall and need someone who's been through it to advise",
            "Preparing for board formation and need experienced independent directors",
            "Previous advisor relationship fizzled and they need someone who actually shows up",
          ],
          budgetAuthority: "direct",
          whereTheyHangOut: [
            "AngelList and angel investing syndicates",
            "VC portfolio events and demo days",
            "Founder peer groups and accelerator alumni networks",
            "Industry-specific conferences (health tech, fintech, climate tech, etc.)",
          ],
        }),
        outreachTemplate: "Hey [name],\n\nI've been watching what you're building at [company] and I'm impressed. The [specific thing] is really smart.\n\nI invest in and advise companies at your stage - I was [previous role] and I've been through [relevant experience]. I think there might be ways I could be helpful beyond just writing a check.\n\nWould you be open to a conversation? I'd love to learn more about where you're headed.",
        gutCheckQuestions: JSON.stringify([
          "What's the hardest problem you're facing right now that money alone won't solve?",
          "What does your cap table look like, and what kind of investor are you actually looking for?",
          "If I were to advise you for the next 12 months, what would you want me to help with most?",
          "How do you make decisions when you and your co-founder disagree?",
          "What does success look like for this company in 3 years? Be honest, not aspirational.",
          "What's the thing about your business that keeps you up at night that you haven't told your investors?",
          "If this doesn't work, what's your plan B?",
        ]),
        order: 9,
      },
    }),
  ]);

  // Index paths by slug for easy reference
  const pathBySlug: Record<string, (typeof paths)[number]> = {};
  for (const p of paths) {
    pathBySlug[p.slug] = p;
  }

  // ── Delete old phases/tasks so we can recreate them ─────────────────
  await prisma.generatedArtifact.deleteMany({});
  await prisma.taskProgress.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.phase.deleteMany({});

  // ── Path-Specific Phases & Tasks ──────────────────────────────────
  // Helper to create phases + tasks for a path
  async function createPhasesForPath(
    pathSlug: string,
    phases: Array<{
      name: string;
      slug: string;
      description: string;
      order: number;
      tasks?: Array<{
        slug: string;
        title: string;
        description: string;
        whyItMatters: string;
        order: number;
        taskType: string;
        timeEstimate: string;
      }>;
    }>
  ) {
    const path = pathBySlug[pathSlug];
    if (!path) {
      console.warn(`Path not found: ${pathSlug}`);
      return;
    }

    for (const phase of phases) {
      const created = await prisma.phase.create({
        data: {
          name: phase.name,
          slug: phase.slug,
          description: phase.description,
          order: phase.order,
          businessPathId: path.id,
        },
      });

      if (phase.tasks) {
        for (const task of phase.tasks) {
          await prisma.task.create({
            data: {
              slug: `${pathSlug}--${task.slug}`,
              title: task.title,
              description: task.description,
              whyItMatters: task.whyItMatters,
              order: task.order,
              taskType: task.taskType,
              timeEstimate: task.timeEstimate,
              phaseId: created.id,
            },
          });
        }
      }
    }
  }

  // ── 1. GTM & Growth Strategist ──────────────────────────────────────
  await createPhasesForPath("gtm-growth-strategist", [
    {
      name: "Find Your Lane",
      slug: "find-your-lane",
      description: "Before you build anything, you need to know exactly what you're selling, who you're selling it to, and why they should hire you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "figure-out-your-specific-thing",
          title: "Figure Out Your Specific Thing",
          description: "You've been solving problems inside companies for years. The question isn't whether you have valuable skills. It's which specific problem you're going to own.",
          whyItMatters: "This is the hard part. Also the important part. Once this is sharp, everything else - your outreach, your pricing, even your confidence in conversations - gets dramatically easier.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Take your lane and turn it into a single sentence: \"I help [specific type of company] [achieve a specific outcome] by [what you actually do].\"",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-your-buyer",
          title: "Get Clear on Who Actually Hires You",
          description: "\"Companies that need help\" isn't a buyer. A buyer is a person with a name, a title, a budget, and a problem that's keeping them up at night.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Design Your Offer", slug: "design-your-offer", description: "", order: 2 },
    { name: "Build Your Launchpad", slug: "build-your-launchpad", description: "", order: 3 },
    { name: "Start Conversations", slug: "start-conversations", description: "", order: 4 },
    { name: "Close Your First Client", slug: "close-your-first-client", description: "", order: 5 },
  ]);

  // ── 2. Messaging & Positioning Specialist ───────────────────────────
  await createPhasesForPath("messaging-positioning", [
    {
      name: "Find Your Lane",
      slug: "find-your-lane",
      description: "Before you build anything, you need to know exactly what you're selling, who you're selling it to, and why they should hire you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "figure-out-your-specific-thing",
          title: "Figure Out Your Specific Thing",
          description: "You've been solving problems inside companies for years. The question isn't whether you have valuable skills. It's which specific problem you're going to own.",
          whyItMatters: "This is the hard part. Also the important part. Once this is sharp, everything else - your outreach, your pricing, even your confidence in conversations - gets dramatically easier.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Take your lane and turn it into a single sentence: \"I help [specific type of company] [achieve a specific outcome] by [what you actually do].\"",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-your-buyer",
          title: "Get Clear on Who Actually Hires You",
          description: "\"Companies that need help\" isn't a buyer. A buyer is a person with a name, a title, a budget, and a problem that's keeping them up at night.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Design Your Offer", slug: "design-your-offer", description: "", order: 2 },
    { name: "Build Your Launchpad", slug: "build-your-launchpad", description: "", order: 3 },
    { name: "Start Conversations", slug: "start-conversations", description: "", order: 4 },
    { name: "Close Your First Client", slug: "close-your-first-client", description: "", order: 5 },
  ]);

  // ── 3. Fractional Operator ──────────────────────────────────────────
  await createPhasesForPath("fractional-operator", [
    {
      name: "Find Your Lane",
      slug: "find-your-lane",
      description: "Before you build anything, you need to know exactly what you're selling, who you're selling it to, and why they should hire you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "figure-out-your-specific-thing",
          title: "Figure Out Your Specific Thing",
          description: "Fractional covers a lot of ground. Finance ops, people ops, rev ops, general operations. You need to pick the one where you have the deepest expertise and the strongest opinions.",
          whyItMatters: "Companies don't hire 'a fractional operator.' They hire someone who can fix their specific operational mess. The tighter your focus, the faster they trust you.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Take your ops specialty and turn it into one sentence: 'I help [type of company] [fix what's broken] by [how you actually do it].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-your-buyer",
          title: "Get Clear on Who Actually Hires You",
          description: "Your buyer is a founder or CEO who knows something's broken but doesn't have time to fix it and can't justify a full-time hire yet.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build anything else, test this with 2-3 people who've seen you operate. Not a pitch. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Design Your Engagement", slug: "design-your-engagement", description: "", order: 2 },
    { name: "Build Your Launchpad", slug: "build-your-launchpad", description: "", order: 3 },
    { name: "Start Conversations", slug: "start-conversations", description: "", order: 4 },
    { name: "Land Your First Retainer", slug: "land-your-first-retainer", description: "", order: 5 },
  ]);

  // ── 4. Automation & Systems Builder ─────────────────────────────────
  await createPhasesForPath("automation-systems-builder", [
    {
      name: "Find Your Lane",
      slug: "find-your-lane",
      description: "Before you build anything, you need to know exactly what you're selling, who you're selling it to, and why they should hire you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "figure-out-your-specific-thing",
          title: "Figure Out Your Specific Thing",
          description: "CRM setup, workflow automation, integrations, internal tools. You need to pick the system type and the industry where you can deliver the most value fastest.",
          whyItMatters: "Every company has broken systems. The ones who'll pay you well are the ones where the broken system is costing them real money or real time. Pick that problem.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Turn your systems specialty into one sentence: 'I help [type of company] [stop wasting time on X] by [building/fixing what system].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-your-buyer",
          title: "Get Clear on Who Actually Hires You",
          description: "Your buyer is usually an ops leader or founder drowning in manual processes who knows there's a better way but doesn't have time to figure it out.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Productize Your Build", slug: "productize-your-build", description: "", order: 2 },
    { name: "Build Your Launchpad", slug: "build-your-launchpad", description: "", order: 3 },
    { name: "Start Conversations", slug: "start-conversations", description: "", order: 4 },
    { name: "Close Your First Build", slug: "close-your-first-build", description: "", order: 5 },
  ]);

  // ── 5. Content Engine Operator ──────────────────────────────────────
  await createPhasesForPath("content-engine-operator", [
    {
      name: "Find Your Format",
      slug: "find-your-format",
      description: "Before you build anything, you need to know exactly what content format you own, who you're doing it for, and why they should hire you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "pick-your-content-type",
          title: "Pick Your Content Type",
          description: "Newsletter production, podcast management, social content, video editing, thought leadership ghostwriting. What's the format where you're fastest and best?",
          whyItMatters: "Clients don't hire 'a content person.' They hire someone who can take their ideas and turn them into a specific type of content, consistently, without hand-holding.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Turn your content specialty into one sentence: 'I help [type of person/company] [build their audience/authority] by [running their content engine for them].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-your-buyer",
          title: "Get Clear on Who Actually Hires You",
          description: "Your buyer is a founder, executive, or creator who knows they should be putting out content but never gets around to it. They have ideas but no system.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Design Your Retainer", slug: "design-your-retainer", description: "", order: 2 },
    { name: "Build Your Proof", slug: "build-your-proof", description: "", order: 3 },
    { name: "Find Your First Client", slug: "find-your-first-client", description: "", order: 4 },
    { name: "Lock In the Retainer", slug: "lock-in-the-retainer", description: "", order: 5 },
  ]);

  // ── 6. Lead Gen Operator ────────────────────────────────────────────
  await createPhasesForPath("lead-gen-operator", [
    {
      name: "Find Your Channel",
      slug: "find-your-channel",
      description: "Before you build anything, you need to know exactly which channel you own, who you're doing it for, and why they should hire you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "pick-your-specialty",
          title: "Pick Your Specialty",
          description: "Paid ads, SEO, email marketing, LinkedIn outbound, landing page optimization. Pick the channel where you consistently drive results and can prove it with numbers.",
          whyItMatters: "The lead gen world is crowded with generalists who 'do a little of everything.' The operators who command premium retainers are the ones who own a specific channel cold.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Turn your channel expertise into one sentence: 'I help [type of company] [get more qualified leads] by [managing/optimizing their specific channel].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-your-buyer",
          title: "Get Clear on Who Actually Hires You",
          description: "Your buyer is a founder or marketing leader who's spending money on lead gen but not getting the ROI they expected. They need someone who can fix it, not just report on it.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Design Your Retainer", slug: "design-your-retainer", description: "", order: 2 },
    { name: "Build Your Proof", slug: "build-your-proof", description: "", order: 3 },
    { name: "Find Your First Client", slug: "find-your-first-client", description: "", order: 4 },
    { name: "Lock In the Retainer", slug: "lock-in-the-retainer", description: "", order: 5 },
  ]);

  // ── 7. Studio Builder ───────────────────────────────────────────────
  await createPhasesForPath("studio-builder", [
    {
      name: "Pick What to Productize",
      slug: "pick-what-to-productize",
      description: "Before you build anything, you need to know exactly what you're packaging, who buys it, and why they should pick you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "identify-your-repeatable-skill",
          title: "Identify Your Repeatable Skill",
          description: "What do you keep delivering over and over? Look at the last 5-10 projects you've done. Where's the pattern? That's what you productize.",
          whyItMatters: "Studio builders don't sell time. They sell a defined outcome for a defined price. But you can't package something you haven't done enough times to see the pattern.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "define-your-package",
          title: "Define Your Package",
          description: "Turn your repeatable skill into a clear package: 'The [Name]: a [timeline] engagement where I deliver [specific outcome] for [price].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "get-clear-on-who-buys-this",
          title: "Get Clear on Who Buys This",
          description: "Your buyer is someone who needs this specific outcome but doesn't want to hire full-time for it. They want to pay once, get the thing, and move on.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Design the Product", slug: "design-the-product", description: "", order: 2 },
    { name: "Build the Machine", slug: "build-the-machine", description: "", order: 3 },
    { name: "Get Your First 3 Clients", slug: "get-your-first-3-clients", description: "", order: 4 },
    { name: "Build Inbound", slug: "build-inbound", description: "", order: 5 },
  ]);

  // ── 8. Niche Talent & Placement Operator ────────────────────────────
  await createPhasesForPath("niche-talent-placement", [
    {
      name: "Pick Your Talent Vertical",
      slug: "pick-your-talent-vertical",
      description: "Before you build anything, you need to know exactly which hiring niche you own, who your clients are, and why they should trust you. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "define-your-hiring-niche",
          title: "Define Your Hiring Niche",
          description: "What roles do you know cold? What industry? You need to pick the intersection where you can look at a resume and know in 30 seconds if this person is great or not.",
          whyItMatters: "The placement business runs on taste and trust. Companies pay you because you save them from bad hires. You can only do that in a space where you've seen enough to know what great looks like.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-one-sentence",
          title: "Write Your One Sentence",
          description: "Turn your talent niche into one sentence: 'I help [type of company] find [type of role] by [leveraging your specific network/expertise].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "map-your-buyer-landscape",
          title: "Map Your Buyer Landscape",
          description: "Your buyer is a hiring manager or founder who's been burned by bad hires or generic recruiters. They want someone who actually understands what good looks like in their space.",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you build a single other thing, test this with 2-3 people who know your work. Not a sales conversation. A gut-check.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Map Your Network", slug: "map-your-network", description: "", order: 2 },
    { name: "Build Your Process", slug: "build-your-process", description: "", order: 3 },
    { name: "Make Your First Match", slug: "make-your-first-match", description: "", order: 4 },
    { name: "Build Your Pipeline", slug: "build-your-pipeline", description: "", order: 5 },
  ]);

  // ── 9. Investor-Operator ────────────────────────────────────────────
  await createPhasesForPath("investor-operator", [
    {
      name: "Define Your Thesis",
      slug: "define-your-thesis",
      description: "Before you deploy capital, you need to know exactly what your edge is, what deals you're looking for, and why founders should take your money. These four tasks will get you there.",
      order: 1,
      tasks: [
        {
          slug: "clarify-your-investment-edge",
          title: "Clarify Your Investment Edge",
          description: "What do you know better than most investors? What sector, stage, or business model do you understand from the inside because you've operated in it?",
          whyItMatters: "Every investor says they 'add value.' The ones who actually do are the ones who've done the work themselves. Your operating experience IS your thesis. Name it.",
          order: 1,
          taskType: "niche-editor",
          timeEstimate: "~15 min",
        },
        {
          slug: "write-your-thesis-statement",
          title: "Write Your Thesis Statement",
          description: "Turn your edge into a clear thesis: 'I invest in [stage] [sector] companies because [what you understand that others don't].'",
          whyItMatters: "Read yours out loud. If it could describe 500 people, it's too vague. If your old coworker would hear it and immediately think of a company that needs this, you've got it.",
          order: 2,
          taskType: "positioning-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "define-your-ideal-deal",
          title: "Define Your Ideal Deal",
          description: "Your 'buyer' is a founder raising capital. What stage? What sector? What check size? What do you need to see before you write a check?",
          whyItMatters: "The title tells you how they buy and what language to use. The company size tells you the sales cycle. The trigger event tells you when they need you. Budget authority tells you if they can actually say yes.",
          order: 3,
          taskType: "buyer-profile-editor",
          timeEstimate: "~10 min",
        },
        {
          slug: "gut-check-with-real-people",
          title: "Gut-Check It With Real People",
          description: "Before you start deploying capital, test your thesis with 2-3 people in your network. Other investors, founders you respect, operators in your target sector.",
          whyItMatters: "These conversations do double duty. They validate your direction and they quietly let people know what you're building. The person who says \"that makes sense\" today might say \"actually, I know someone you should talk to\" in three weeks.",
          order: 4,
          taskType: "gut-check",
          timeEstimate: "~30 min",
        },
      ],
    },
    { name: "Assess Your Position", slug: "assess-your-position", description: "", order: 2 },
    { name: "Build Your Deal Flow", slug: "build-your-deal-flow", description: "", order: 3 },
    { name: "Make Your First Investment", slug: "make-your-first-investment", description: "", order: 4 },
    { name: "Add Value Post-Investment", slug: "add-value-post-investment", description: "", order: 5 },
  ]);

  // ── Demo User 1: Liz Holloway ───────────────────────────────────────
  const liz = await prisma.user.upsert({
    where: { email: "liz@demo.blair.com" },
    update: {},
    create: {
      email: "liz@demo.blair.com",
      name: "Liz Holloway",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: liz.id },
    update: {},
    create: {
      userId: liz.id,
      traits: JSON.stringify([
        "Creative",
        "Strategic",
        "Pattern-recognition thinker",
        "Prefers autonomy over structure",
        "Wants the brief, key conversations, then space to build",
      ]),
      strengths: JSON.stringify([
        "Brand and communications strategy",
        "Messaging clarity and narrative structure",
        "Translating complex ideas into compelling language",
        "Creative direction across channels",
        "Stakeholder alignment through story",
      ]),
      constraints: JSON.stringify([
        "Optimizing for time flexibility and reliable income",
        "Doesn't want content grind or corporate politics",
        "Hasn't prioritized building own thing due to lack of clear direction",
        "Needs work that fits around family life",
      ]),
      summary:
        "Liz has spent over a decade in brand and communications. She's strategic, creative, and sharp - the person teams turn to when something needs to sound right. She wants flexibility, autonomy, and income she controls. She hasn't built her own thing yet, not because she can't, but because she hasn't had clear direction on where to point the energy.",
      unfairAdvantageName: "Translation Ability",
      unfairAdvantageDescription:
        "People with this advantage are translators between what something IS and what it NEEDS TO SAY. They walk into a room where everyone's confused about how to describe their own product, their own value... and they just see it. They turn something complicated into language that makes a customer lean in. It's not about being a good writer (though they often are). It's pattern recognition: spotting the disconnect between what a business actually does and how it's showing up in the world.",
      unfairAdvantageEvidence:
        "You picked \"The Creative\" and \"The Strategy\" as your shoulder taps - people come to you both when they can't explain what they are AND when they have a goal but no plan. That combination is the signature of a translator: you see the narrative problem and the strategic path to fix it. Your work mode backs it up too - you want the brief, a few key conversations, and then space to go build something sharper than what anyone expected.",
      unfairAdvantageWhy:
        "Translation Ability is one of the few skills that companies consistently underpay for when it's buried inside a salaried role and consistently overpay for when it's sold as an outside service. A Brand Message Director at an agency might make $90-$130K. That same skill, packaged as project-based consulting, commands $5K-$12K per engagement. This is genuinely one of the most valuable (and most underleveraged) skills out there.",
      linkedinSummary:
        "Over a decade in brand and communications strategy. Led messaging, creative direction, and narrative development for agencies and in-house teams. Known for walking into messy brand problems and delivering clarity.",
      onlinePresence: JSON.stringify({
        linkedin: "Strong professional network in agency and brand strategy circles",
        portfolio: "Select case studies from agency and in-house work",
      }),
      notableExperience: JSON.stringify([
        "10+ years in brand and communications roles",
        "Agency-side creative and strategy leadership",
        "Led brand messaging overhauls for mid-market and startup clients",
        "Track record of turning confused positioning into clear, compelling narrative",
      ]),
    },
  });

  const lizRec = await prisma.recommendation.upsert({
    where: {
      id: `rec-liz`,
    },
    update: {},
    create: {
      id: "rec-liz",
      userId: liz.id,
      primaryPathId: pathBySlug["messaging-positioning"].id,
      status: "approved",
      personalIntro:
        "You've been in brand and communications for over a decade. You told us you want time flexibility and reliable income outside your job, you're optimizing for long-term upside, and you don't want a content grind or corporate politics. You also told us you haven't prioritized building something of your own because of \"a lack of clear direction.\"\n\nLet's fix that.",
      personalizedWhy:
        "The big idea:\nYou help companies figure out what they actually are, who they're for, and how to say it so people pay attention. High-ticket project work. You come in, fix the story, hand it over.\n\nWhat you build:\nHere's an example. An agency owner you know has a client, a growing med spa chain that's been around for three years but still looks and sounds like every other med spa in town. Their website says \"luxury wellness experience\" and means absolutely nothing. You come in, interview the founder for 90 minutes, audit their current messaging, and deliver a positioning package: the one-liner, the website copy framework, the sales narrative for their front desk, and the pricing story that justifies their rates. That's an $8K project, maybe 20 hours of your time. And the agency owner who introduced you looks brilliant.\n\nWho pays you (and how you find them):\nYour network is your pipeline. Agency owners have clients who need better messaging but nobody on their team who can do it. Creators and course builders know their offer is good but can't figure out why it's not converting. Local business owners in real estate, retail, and wellness are sitting on good businesses with forgettable brands. You fix that. And because these are people you already know, we're not talking about cold outreach or posting content to get discovered. The work finds you through referrals.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "The Brand Sprint", price: "$5K-$12K for a full positioning and messaging overhaul (3-6 weeks). Where you land in that range depends on the client - a local Birmingham business is on the lower end, a national brand through your agency network is on the higher end." },
          { name: "The Tune-Up", price: "$1.5K-$3K for a focused audit with specific recs (1-2 weeks)" },
        ],
        sideHustleMath: "At 3-5 hours/week, you run one Sprint at a time. Two per quarter. That's $40K-$64K/year at the middle of the range. Real money alongside your W2.",
        fullCapacityMath: "At 15-20 hours/week, you run two Sprints at once with some Tune-Ups filling gaps. That's $100K-$175K/year. Still not working 40-hour weeks.",
        momFit: "Here's what no one tells you about building a business with young kids: it's not just that you have less time. It's that the time you do have is competing with the hundred other open browser tabs in your mind. You don't have 3-5 hours of fresh creative energy. You have 3-5 hours of whatever's left after a full W2 day plus everything else. Some nights that hour after bedtime is sharp. Other nights you're too wiped after cleaning the kitchen (again) to even think about opening your laptop.\n\nHere's why Messaging & Positioning actually works for this stage though. The real work is thinking. It's pattern recognition. It's looking at a brand and seeing what everyone else is missing. That kind of work happens in the shower, on a walk, in the pickup line. If you're anything like most brand people, you're already doing this without trying. Then you sit down for your 1-hour block and it just spills right out because your brain's been chewing on it in the background.\n\nYou don't need 8-hour uninterrupted days for this. A sharp eye and a few focused hours is plenty.",
      }),
      transitionPlan: JSON.stringify([
        { title: "Pick one industry to start.", description: "It looks like you've touched real estate, retail, media, and wellness. Don't try to serve all of them right now. Pick the one where you have the strongest opinions about what's broken. Start there. You can always expand." },
        { title: "Tell your agency network what you're doing.", description: "Doesn't have to be a big thing. Just let 2-3 people know: \"I'm taking on positioning projects on the side. If you have a client whose messaging isn't landing, send them my way.\" That's it. The referral pipeline really is that simple when people already know you're good at this." },
        { title: "Land your first project at a friends-and-family rate.", description: "First client doesn't need to pay $10K. They need to pay enough that you both take it seriously ($3K-$5K) and you need the case study more than the revenue. Do great work, document the before and after. Now you have proof." },
        { title: "Scope everything with a hard end date.", description: "At 3-5 hours a week, open-ended work will eat you alive. Every project gets a timeline, a deliverable list, and a handoff date. When a client says \"can you also...\" you say \"totally, that's a separate project, here's what it costs.\"" },
      ]),
      closingNote:
        "Ponder these recommendations. Talk to your partner about them. Let us know which path feels right. When Blair is fully built out, the next step will be a playbook for your chosen path with client acquisition scripts, pricing templates, and a 90-day plan built around the hours you actually have.\n\nIf your career really has been about making other people's stories make sense, it's a pretty good time to write your own.",
    },
  });

  // Liz recommendation paths: primary + 2 alternates
  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: lizRec.id,
        pathId: pathBySlug["messaging-positioning"].id,
      },
    },
    update: {},
    create: {
      recommendationId: lizRec.id,
      pathId: pathBySlug["messaging-positioning"].id,
      rank: 1,
      fitScore: 95,
      altDescription:
        "Help companies figure out what they actually are, who they are for, and how to say it. Brand Sprints, positioning packages, and messaging overhauls.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: lizRec.id,
        pathId: pathBySlug["studio-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: lizRec.id,
      pathId: pathBySlug["studio-builder"].id,
      rank: 2,
      fitScore: 78,
      altDescription:
        "Instead of scoping a custom project every time, you package your process into a repeatable offering. Same deliverable, same timeline, same price, different client.",
      altWhyConsider:
        "This is where Messaging & Positioning goes once you've done enough projects to see the pattern. (And you will see it fast.) Instead of starting from scratch, each time you build something like \"The Brand Fix: a 3-week sprint, complete positioning overhaul, $8K flat.\" Same intake, same deliverables, same handoff. You just swap the client.\n\nNo scope creep because the boundaries are built in\nEventually you bring on someone junior to handle pieces of the delivery\n\"Build once, sell repeatedly\" is exactly what you said you wanted (time flexibility + wealth creation)\nYou said you're optimizing for long-term upside. This is that.",
      altTradeoff:
        "You need to do enough custom work first to know what the repeatable version looks like. Don't try to productize before you have the pattern. Start with custom Messaging & Positioning, notice which deliverables you keep making, then package those.",
      altRevenueRange: "$5K-$10K per engagement, scaling to $12K-$20K/month once you have inbound.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: lizRec.id,
        pathId: pathBySlug["fractional-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: lizRec.id,
      pathId: pathBySlug["fractional-operator"].id,
      rank: 3,
      fitScore: 65,
      altDescription:
        "You embed with 1-2 companies as their ongoing brand leader. You own creative direction, messaging, visual identity. You're the person making sure everything they put out looks and sounds like it belongs together.",
      altWhyConsider:
        "It looks like you're already doing a version of this at Apostle. And your career has been moving in this direction for a while: PR, account director, brand message director. If you're the person who's been leading brand work at these companies, fractional just means you do it for yourself, for more than one company, and charge a premium.",
      altTradeoff:
        "At 3-5 hours per week this is hard. Most fractional roles need 15-25 hours/month per client because you have to be in enough conversations to actually steer things. One client at the low end might work, but there's no room for error. And with kids, there's always an error. (Pink eye! Stomach bugs! Random school closures that nobody warned you about!)\n\nWhen this makes sense: When your hours open up. Whether that's a W2 shift, kids getting older, or you going full-time. Fractional Brand Director is the highest-earning version of what you do, it's just not the right starting point at 3-5 hours a week.",
      altRevenueRange: "$5K-$10K/month per client, needs 15-20 hours/month of real availability.",
    },
  });

  // ── Demo User 2: Julie Soper ────────────────────────────────────────
  const julie = await prisma.user.upsert({
    where: { email: "julie@demo.blair.com" },
    update: {},
    create: {
      email: "julie@demo.blair.com",
      name: "Julie Soper",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: julie.id },
    update: {},
    create: {
      userId: julie.id,
      traits: JSON.stringify([
        "Analytical",
        "Relationship-driven",
        "Comfortable with outreach and being visible",
        "Process-oriented with high EQ",
        "Thrives in high-stakes, high-trust environments",
      ]),
      strengths: JSON.stringify([
        "Go-to-market strategy and execution",
        "Enterprise sales process design",
        "Pipeline architecture and optimization",
        "Stakeholder management across complex orgs",
        "Network activation and relationship leverage",
      ]),
      constraints: JSON.stringify([
        "Three kids under four",
        "Needs sharp, focused work windows - not long, open blocks",
        "Questioning whether current W2 path is the life she actually wants",
        "Optimizing for autonomy, income, and time with kids",
      ]),
      summary:
        "Julie has spent 15 years building a career that spans policy research at UCLA, storytelling at National Geographic, and enterprise sales at Stripe and Ramp. She's analytical, relationship-driven, and has a network most people spend a decade trying to build. With three kids under four, she's asking whether the W2 path is the right container for what she wants her life to look like.",
      unfairAdvantageName: "Network Density",
      unfairAdvantageDescription:
        "People with this advantage already know enough buyers to build a business without ever cold-calling a stranger. They've spent years in rooms with the people who make purchasing decisions, and those relationships don't disappear when you leave a company.",
      unfairAdvantageEvidence:
        "Your network is startup and tech decision-makers. After 6 years at Stripe and your current role at Ramp, you know founders, heads of sales, revenue leaders, and partnership leads across fintech and B2B SaaS. You're comfortable with outreach and you're comfortable being visible in your niche. That combination is rare. Most people have the network but hate the outreach, or love the outreach but don't have the network. Excitingly, you have both!",
      unfairAdvantageWhy:
        "One of the hardest parts of starting any business is finding your first clients. For you, that's going to be a lot easier than it is for most people. After 15 years in enterprise sales, the people who would hire you have already watched you work. They don't need to be convinced you're good - they need to know you're available.",
      linkedinSummary:
        "15 years spanning policy research (UCLA), media (National Geographic), and enterprise sales (Stripe, Ramp). Builds and scales go-to-market motions for B2B companies.",
      onlinePresence: JSON.stringify({
        linkedin: "Deep network across fintech, B2B SaaS, and enterprise sales leadership",
        professional: "Known in Stripe and Ramp alumni circles",
      }),
      notableExperience: JSON.stringify([
        "Policy research at UCLA",
        "National Geographic - storytelling and media",
        "6 years at Stripe - enterprise sales",
        "Ramp - current enterprise sales role",
        "Network spans founders, revenue leaders, and partnership leads across fintech and B2B SaaS",
      ]),
    },
  });

  const julieRec = await prisma.recommendation.upsert({
    where: { id: "rec-julie" },
    update: {},
    create: {
      id: "rec-julie",
      userId: julie.id,
      primaryPathId: pathBySlug["gtm-growth-strategist"].id,
      status: "approved",
      personalIntro:
        "You've built a career that most people in tech would envy. From policy research at UCLA to National Geographic to building out enterprise sales at Stripe and Ramp, you've spent 15 years figuring out how to take complex things and get people to say them. That's a skill, and it's a valuable one.\n\nBut right now you're asking a different question. Not \"how do I get to the next level\" but \"is this actually the life I want?\" Three kids under four is no joke, and these years are so precious. (And...so tiring.)\n\nLet's start with what you already have going for you.",
      personalizedWhy:
        "The big idea:\nYou help companies build, fix, or scale their go-to-market motion. How they sell, who they sell to, what the sales process looks like, and why it's not converting. This is high-ticket project work with a clear scope and a hard end date. You come in, diagnose the problem, build the playbook, and hand it off.\n\nWhat you build:\nHere's an example: A Series B fintech company just raised $20M and needs to move upmarket from SMB to enterprise. They have a product that works but no enterprise sales motion: no ICP definition, no outbound strategy, no sales process for longer deal cycles. You come in for 6 weeks, audit their current pipeline, define the ideal customer profile, build the outbound playbook, and set up the sales process for enterprise deals. That's a $12K-$18K project. Maybe 30 hours of your time. And the founder now has a sales engine they can hand to a full-time hire.\n\nWho pays you (and how you find them):\nFounders and revenue leaders at B2B startups who are trying to figure out how to sell. Your Stripe and Ramp network is full of these people. They've seen you operate. When they're stuck on their go-to-market, you're the person they'd call if they knew you were available. Let them know.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "The GTM Sprint", price: "$10K-$18K for a scoped go-to-market build or overhaul (4-8 weeks)" },
          { name: "The Revenue Audit", price: "$5K-$8K for a focused diagnostic of what's broken in the sales motion with specific recommendations (2-3 weeks)" },
        ],
        sideHustleMath: "At 13-15 hours/week, you run one Sprint at a time. Roughly one every 6-8 weeks, with some Revenue Audits in between. That's $60K-$100K/year depending on how much you take on. Real money alongside your W2.",
        fullCapacityMath: "At 20-25 hours/week, you run two Sprints at once with Revenue Audits filling gaps. That's $250K-$400K/year. Comparable to enterprise AE comp without the quota pressure or the calendar that comes with it.",
        momFit: "You have three kids under 4, so we shan't pretend you have wide open creative hours. What you have is sharp, focused windows during the day and the ability to context-switch fast, which is basically a job requirement when you're raising three tiny humans.\n\nHere's why GTM work fits those windows. The deliverables are concrete: an ICP doc, a sales playbook, a pipeline audit. You're not waiting for inspiration. You're applying frameworks you already know to a new company's problem. That kind of work can happen in a 90-minute block between nap and pickup. You sit down, you know exactly what you're building, and you build it. Then you close the laptop and go mom.\n\nYou don't need uninterrupted 8-hour days for this - you just need sharp windows and the discipline to scope tightly.",
      }),
      transitionPlan: JSON.stringify([
        { title: "Start with one conversation.", description: "Think of one founder or revenue leader in your Stripe or Ramp network who's building something and struggling with their sales motion. Reach out. Not a pitch. Just: \"Hey, I've been thinking about doing some GTM advisory on the side. If you know anyone who needs help building out their sales process, I'd love to hear about it.\" (That's it.)" },
        { title: "Scope your first project tightly.", description: "First client doesn't need to pay $18K. They need to pay enough that you both take it seriously ($5K-$8K) and you need the proof more than the revenue. Do great work, document the before and after. Now you have a case study." },
        { title: "Protect your time ruthlessly.", description: "With three kids under 4 and a full-time job, your margins are razor thin. Every project gets a hard end date, a clear deliverable list, and a scoping conversation upfront. When a client says \"can you also...\" you say \"absolutely, that's a separate project.\"" },
        { title: "You have runway. Use it wisely.", description: "Whether you stay at Ramp, go part-time, or take time off to be with your kids, the side hustle math works in any of those scenarios. You don't need to make the big decision right now. You just need to start one conversation and land one project. The rest gets clearer from there." },
      ]),
      closingNote:
        "Think about these recommendations. Sit with them. Talk to your partner about them, and let us know which path feels right! When Blair is fully built out, the next step will be a playbook for your chosen path with client acquisition scripts, pricing templates, and a 90-day plan built around the hours you actually have.\n\nAnd listen. You told us you're having stress nightmares about missing your kids' early years. That's not something to push through. What you've built over 15 years doesn't expire. It's yours. Whenever you're ready to point it in a new direction, it'll be there. And so will we!",
    },
  });

  // Julie recommendation paths: primary + 2 alternates
  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: julieRec.id,
        pathId: pathBySlug["gtm-growth-strategist"].id,
      },
    },
    update: {},
    create: {
      recommendationId: julieRec.id,
      pathId: pathBySlug["gtm-growth-strategist"].id,
      rank: 1,
      fitScore: 96,
      altDescription:
        "Help companies build, fix, or scale their go-to-market motion. GTM Sprints, Revenue Audits, and pipeline strategy.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: julieRec.id,
        pathId: pathBySlug["niche-talent-placement"].id,
      },
    },
    update: {},
    create: {
      recommendationId: julieRec.id,
      pathId: pathBySlug["niche-talent-placement"].id,
      rank: 2,
      fitScore: 82,
      altDescription:
        "You connect high-growth companies with the enterprise sales talent they need. You know what great looks like because you've been doing it for 15 years, and you know the people because you've worked alongside them at Stripe and Ramp.",
      altWhyConsider:
        "After 6 years at Stripe alone, you probably know dozens of strong enterprise AEs, SEs, and sales leaders. Startups moving upmarket are desperate for this talent and have no idea how to find or evaluate them. But - you do! Placement fees run 15-20% of first-year salary, which on enterprise sales roles means $25K-$50K per placement.\n\nThe work ebbs and flows - you're not \"on\" 15 hours a week. You're matching when you have a live deal and quiet when you don't. That fits the reality of three kids under 4 better than most paths.",
      altTradeoff:
        "Revenue is lumpy though. You might place two people in a month and then nothing for six weeks. It's feast or famine until you build a steady pipeline of companies who come back to you. And you said you don't love constant selling, so the business development side of this may wear on you.",
      altRevenueRange: "$25K-$50K per placement. Three to four placements per year as a side hustle is $75K-$200K. At full capacity (8-12 placements per year), this becomes a $200K-$600K/year business.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: julieRec.id,
        pathId: pathBySlug["studio-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: julieRec.id,
      pathId: pathBySlug["studio-builder"].id,
      rank: 3,
      fitScore: 70,
      altDescription:
        "You take the GTM work you're doing and turn it into a repeatable, productized offering. Same deliverable, same process, same price, different client every time.",
      altWhyConsider:
        "You mentioned you're already working on a potential business idea. The Studio path is about taking a skill you can do in your sleep and packaging it so it doesn't require you to reinvent the wheel with every new client.\n\n\"Packaged work with defined boundaries\" is what you asked for\nYou said you want time flexibility and reliable income - productized work gives you both\nOnce you have inbound, the business runs on your terms",
      altTradeoff:
        "You need to do enough custom GTM work first to know what the repeatable version looks like. Don't try to productize before you've done 5-10 projects and can see the pattern. Start with custom sprints, then package.",
      altRevenueRange: "$10K-$18K per engagement, scaling as your reputation builds.",
    },
  });

  // ── Demo User 3: Sarah Chen - Fractional Operator ─────────────────
  const sarah = await prisma.user.upsert({
    where: { email: "sarah@demo.blair.com" },
    update: {},
    create: {
      email: "sarah@demo.blair.com",
      name: "Sarah Chen",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: sarah.id },
    update: {},
    create: {
      userId: sarah.id,
      traits: JSON.stringify([
        "Execution-oriented",
        "Calm under pressure",
        "Systems thinker",
        "Thrives in ambiguity",
        "Natural team leader",
      ]),
      strengths: JSON.stringify([
        "Operations strategy and execution",
        "Cross-functional team leadership",
        "Process design and optimization",
        "Vendor and stakeholder management",
        "Scaling systems from Series A to C",
      ]),
      constraints: JSON.stringify([
        "Two kids in elementary school",
        "Wants to be present for school events and afternoons",
        "Done with 60-hour weeks but still wants meaningful work",
        "Optimizing for flexibility and financial independence",
      ]),
      summary:
        "Sarah spent 12 years in operations at tech companies, most recently as VP of Operations at a Series C startup called Aether Health. She built the ops infrastructure that took them from 40 to 200 employees. She knows what it looks like when a company is growing faster than its systems can handle, and she knows how to fix it.",
      unfairAdvantageName: "Operational Command",
      unfairAdvantageDescription:
        "People with this advantage walk into chaos and immediately see the load-bearing processes that are about to break. They don't just manage operations - they architect them. They see the system behind the mess and know exactly which levers to pull first.",
      unfairAdvantageEvidence:
        "You spent 12 years building operations at tech companies and landed in a VP Ops seat at a Series C. That trajectory tells us you're not just executing playbooks - you're designing them. The people around you have watched you take a department from \"we're figuring it out\" to \"this actually runs.\"",
      unfairAdvantageWhy:
        "Operational Command is one of those skills that companies desperately need but rarely know how to hire for externally. A full-time VP Ops costs $200K-$300K plus equity. A fractional operator who already knows the playbook? That's $5K-$10K/month for the same quality of thinking.",
      linkedinSummary:
        "12 years in tech operations. VP Ops at Aether Health (Series C). Built operational infrastructure scaling from 40 to 200 employees.",
      onlinePresence: JSON.stringify({
        linkedin: "Strong network across tech ops and startup leadership circles",
        professional: "Known in Series B/C startup ops community",
      }),
      notableExperience: JSON.stringify([
        "12 years in tech operations",
        "VP Operations at Aether Health (Series C)",
        "Scaled ops from 40 to 200 employees",
        "Built hiring, onboarding, and vendor management systems from scratch",
        "Cross-functional leadership across engineering, sales, and customer success",
      ]),
    },
  });

  const sarahRec = await prisma.recommendation.upsert({
    where: { id: "rec-sarah" },
    update: {},
    create: {
      id: "rec-sarah",
      userId: sarah.id,
      primaryPathId: pathBySlug["fractional-operator"].id,
      status: "approved",
      personalIntro:
        "You spent 12 years in operations at tech companies, and by the end you were running the show as VP Ops at Aether Health. You built the systems that took them from scrappy to scaled. Now you've got two kids, you're done with 60-hour weeks, and you want something that uses everything you've built without burning you out.\n\nHere's where it gets interesting.",
      personalizedWhy:
        "The big idea:\nYou embed with 1-2 companies as their part-time operations leader. You own the systems, processes, and execution that keep the business running while the founders focus on growth. You're not consulting from the outside - you're inside the company, in the Slack channels, in the meetings that matter.\n\nWhat you build:\nHere's an example. A Series B SaaS company just raised $15M but their operations are held together with duct tape and good intentions. The CEO is spending half her time on ops fires instead of selling. You come in 20 hours a month, audit their workflows, fix their onboarding process, set up the vendor management system, and build the reporting dashboard the leadership team has been asking for. That's a $7K-$10K/month retainer. Within 90 days, the CEO has her calendar back and the team stops losing new hires in their first week.\n\nWho pays you (and how you find them):\nSeries A and B startups that have outgrown their scrappy phase but can't justify (or afford) a full-time VP Ops. Your network from Aether Health and the broader startup community is full of founders who are drowning in operational complexity. One LinkedIn post about what you're doing and you'll have inbound within a week.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "Fractional Retainer", price: "$5K-$10K/month per client, 15-25 hrs/month. Where you land depends on scope - a lean startup with basic ops needs is lower end, a scaling company with cross-functional complexity is higher." },
          { name: "Project Sprint", price: "$8K-$15K for a scoped ops overhaul, 4-8 weeks. Think: onboarding redesign, vendor consolidation, or process documentation." },
        ],
        sideHustleMath: "1 client at 15 hrs/month = $5K-$10K/month ($60K-$120K/year). Totally doable alongside school pickup and soccer practice.",
        fullCapacityMath: "2-3 clients at 20-25 hrs/week total = $150K-$300K/year. That's VP-level income without VP-level hours.",
        momFit: "Here's the thing about fractional ops work with elementary-age kids: your schedule actually works in your favor. Kids are at school from 8 to 3. That's a solid block of focused time. You can take your calls, do your deep work, and be standing at the pickup line at 2:55 without anyone knowing you just redesigned a company's entire onboarding flow.\n\nThe work is structured enough that you can plan your week in advance. You know which clients need meetings on which days. You're not waiting for inspiration - you're executing against a clear set of priorities. That predictability is gold when you're also managing homework, activities, and the general chaos of raising humans.",
      }),
      closingNote:
        "Sit with this for a day or two. Talk it through with someone you trust. You've spent 12 years building operational excellence for other people's companies. The playbook is already in your head - you just need to point it at a different model. We'll be here when you're ready to start building.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: sarahRec.id,
        pathId: pathBySlug["fractional-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: sarahRec.id,
      pathId: pathBySlug["fractional-operator"].id,
      rank: 1,
      fitScore: 94,
      altDescription:
        "Embed inside companies as their part-time operations leader. Own the systems, processes, and execution that keep the business running.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: sarahRec.id,
        pathId: pathBySlug["automation-systems-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: sarahRec.id,
      pathId: pathBySlug["automation-systems-builder"].id,
      rank: 2,
      fitScore: 80,
      altDescription:
        "Build the systems, automations, and workflows that make businesses run without constant human intervention.",
      altWhyConsider:
        "You've been building operational systems your entire career. The Automation path takes the \"systems\" piece and makes it the whole business. Instead of embedding with companies, you'd build specific automations and workflows - CRM setups, Zapier flows, reporting dashboards - and hand them off. Shorter engagements, more clients, less ongoing commitment.",
      altTradeoff:
        "You lose the strategic seat at the table. Automation work can feel more like project work than leadership. If what you love is being in the room when decisions get made, this path might feel too transactional.",
      altRevenueRange: "$3K-$8K per project build, or $2K-$5K/month on retainer.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: sarahRec.id,
        pathId: pathBySlug["gtm-growth-strategist"].id,
      },
    },
    update: {},
    create: {
      recommendationId: sarahRec.id,
      pathId: pathBySlug["gtm-growth-strategist"].id,
      rank: 3,
      fitScore: 72,
      altDescription:
        "Help companies build, fix, or scale their go-to-market motion. GTM Sprints and Revenue Audits.",
      altWhyConsider:
        "Your ops background gives you a unique angle on GTM work. You understand the infrastructure behind a sales motion - the CRM, the handoffs, the reporting. Founders who need GTM help often also need someone who can actually build the operational backbone to support it.",
      altTradeoff:
        "GTM strategy is a different muscle than ops leadership. You'd be competing with people who've spent their whole career in revenue and sales. Your ops angle is a differentiator, but it might take longer to build credibility in this lane.",
      altRevenueRange: "$10K-$18K per GTM Sprint, $5K-$8K for Revenue Audits.",
    },
  });

  // ── Demo User 4: Maria Santos - Automation & Systems Builder ───────
  const maria = await prisma.user.upsert({
    where: { email: "maria@demo.blair.com" },
    update: {},
    create: {
      email: "maria@demo.blair.com",
      name: "Maria Santos",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: maria.id },
    update: {},
    create: {
      userId: maria.id,
      traits: JSON.stringify([
        "Detail-oriented",
        "Process-obsessed",
        "Loves building things that run themselves",
        "Introvert who prefers deep work",
        "Quietly confident",
      ]),
      strengths: JSON.stringify([
        "CRM architecture and Salesforce administration",
        "Process engineering and workflow automation",
        "Data migration and system integration",
        "Business requirements translation",
        "Tool evaluation and implementation",
      ]),
      constraints: JSON.stringify([
        "One toddler, another on the way",
        "Needs deep work blocks, not meeting-heavy days",
        "Wants to build something sustainable before second kid arrives",
        "Prefers async communication over constant calls",
      ]),
      summary:
        "Maria spent 8 years in business systems and process engineering, most recently as a Senior Business Systems Analyst at Clarion Software. She's the person teams call when their CRM is a mess, their data doesn't flow between tools, or their processes are held together by manual workarounds. She's a certified Salesforce admin with a talent for seeing inefficiency and building elegant solutions.",
      unfairAdvantageName: "Systems Thinking",
      unfairAdvantageDescription:
        "People with this advantage see the invisible architecture behind how a business actually runs. They don't just fix the broken thing - they see why it broke and build something that won't break the same way again. It's a rare combination of technical skill and business understanding.",
      unfairAdvantageEvidence:
        "You've spent 8 years as the person companies call when their systems don't talk to each other. You're a certified Salesforce admin, you've done complex data migrations, and you've built automation workflows that saved teams hundreds of hours. That's not just technical skill - it's the ability to see the whole system at once.",
      unfairAdvantageWhy:
        "Systems Thinking is incredibly undervalued inside companies and incredibly valuable outside them. A Salesforce admin on salary makes $85K-$120K. That same person, packaging their expertise as project-based consulting, charges $3K-$8K per build. The math gets very interesting very fast.",
      linkedinSummary:
        "8 years in business systems and process engineering. Senior Business Systems Analyst at Clarion Software. Certified Salesforce Admin.",
      onlinePresence: JSON.stringify({
        linkedin: "Active in Salesforce and RevOps communities",
        professional: "Salesforce certification, known in business systems circles",
      }),
      notableExperience: JSON.stringify([
        "8 years in business systems and process engineering",
        "Senior Business Systems Analyst at Clarion Software",
        "Certified Salesforce Administrator",
        "Led CRM migration for 500-person org",
        "Built automation workflows saving 20+ hours/week across departments",
      ]),
    },
  });

  const mariaRec = await prisma.recommendation.upsert({
    where: { id: "rec-maria" },
    update: {},
    create: {
      id: "rec-maria",
      userId: maria.id,
      primaryPathId: pathBySlug["automation-systems-builder"].id,
      status: "approved",
      personalIntro:
        "You've spent 8 years making other companies' systems actually work. You're the person who sees the tangled mess of tools, manual processes, and duct-tape workflows and knows exactly how to untangle them. With one toddler and another on the way, you're thinking about what comes next - and you want it to be something you control.\n\nLet's talk about what that looks like.",
      personalizedWhy:
        "The big idea:\nYou build the systems, automations, and workflows that make businesses run without constant human intervention. CRM setups, Zapier flows, data pipelines, reporting dashboards, process documentation. You come in, build the thing, hand it over, move on.\n\nWhat you build:\nHere's an example. A growing e-commerce brand is running their customer data across three different tools that don't talk to each other. Their team is manually copying order info from Shopify into their CRM, their email sequences are triggered by spreadsheet exports, and nobody trusts the revenue numbers because they're calculated differently in every tool. You come in, map the data flow, connect the systems, build the automations, and deliver a dashboard that actually tells them the truth. That's a $5K-$7K project, maybe 25 hours of your time. And they never think about it again because it just works.\n\nWho pays you (and how you find them):\nSmall to mid-size companies that have outgrown their starter tools but don't have a systems person on staff. E-commerce brands, SaaS companies, agencies, service businesses. The Salesforce community alone is a goldmine - companies are always looking for someone who can set up or fix their CRM without hiring a full-time admin.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "System Build", price: "$3K-$8K per project, 2-4 weeks. A CRM setup or automation build for a small company is on the lower end. A full systems overhaul with data migration is higher." },
          { name: "Ongoing Optimization Retainer", price: "$2K-$5K/month for companies that need ongoing systems support without a full-time hire." },
        ],
        sideHustleMath: "1-2 builds per month = $50K-$100K/year. Very doable in focused work blocks.",
        fullCapacityMath: "3-4 builds plus 2 retainer clients = $150K-$250K/year.",
        momFit: "With a toddler and another on the way, here's what matters: automation and systems work is deep work. You don't need to be on calls all day. You need focused blocks where you can build, test, and deliver. Nap time. After bedtime. A few morning hours while your partner handles the early shift.\n\nThe beauty of this work is that it's project-based with clear deliverables. You know exactly what you're building, you can estimate how long it'll take, and clients don't need you to be available 9-5. They need the thing to work when you hand it over. That kind of flexibility is hard to find in most business models.",
      }),
      closingNote:
        "You've been building systems for other companies for 8 years. The skills are already there. The question is just whether you're ready to point them at your own thing. Take some time with this. And when you're ready, we'll help you build it.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: mariaRec.id,
        pathId: pathBySlug["automation-systems-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: mariaRec.id,
      pathId: pathBySlug["automation-systems-builder"].id,
      rank: 1,
      fitScore: 93,
      altDescription:
        "Build the systems, automations, and workflows that make businesses run without constant human intervention.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: mariaRec.id,
        pathId: pathBySlug["studio-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: mariaRec.id,
      pathId: pathBySlug["studio-builder"].id,
      rank: 2,
      fitScore: 78,
      altDescription:
        "Package your systems expertise into a repeatable, productized offering. Same deliverable, same process, different client.",
      altWhyConsider:
        "Once you've done enough system builds to see the pattern (and you will - most CRM setups follow a similar arc), you can productize. \"The Salesforce Starter Kit: $4K flat, 2-week delivery, everything a growing company needs.\" Same intake, same deliverables, same timeline. You build a machine, not a consultancy.",
      altTradeoff:
        "You need to do enough custom work first to find the repeatable pattern. Don't try to productize before you've done 8-10 builds. Start custom, then package.",
      altRevenueRange: "$5K-$15K per productized engagement, scaling with volume.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: mariaRec.id,
        pathId: pathBySlug["fractional-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: mariaRec.id,
      pathId: pathBySlug["fractional-operator"].id,
      rank: 3,
      fitScore: 68,
      altDescription:
        "Embed inside companies as their part-time systems and operations leader.",
      altWhyConsider:
        "Your systems expertise could translate into a fractional ops role where you're not just building automations but owning the entire operational infrastructure. Some companies need someone who can both build the systems and manage them ongoing.",
      altTradeoff:
        "Fractional roles need 15-25 hours/month per client. With a toddler and another on the way, that's a big commitment. The project-based automation path gives you more control over your schedule.",
      altRevenueRange: "$5K-$10K/month per client, 15-25 hrs/month.",
    },
  });

  // ── Demo User 5: Rachel Gaines - Content Engine Operator ──────────
  const rachel = await prisma.user.upsert({
    where: { email: "rachel@demo.blair.com" },
    update: {},
    create: {
      email: "rachel@demo.blair.com",
      name: "Rachel Gaines",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: rachel.id },
    update: {},
    create: {
      userId: rachel.id,
      traits: JSON.stringify([
        "Creative with a producer's mindset",
        "Editorially sharp",
        "Thrives in fast-paced environments",
        "Natural storyteller",
        "Thinks in campaigns, not posts",
      ]),
      strengths: JSON.stringify([
        "Content strategy and editorial planning",
        "Newsletter and email marketing",
        "Social media strategy and execution",
        "Brand voice development",
        "Content team management and workflow design",
      ]),
      constraints: JSON.stringify([
        "Three kids ages 3, 6, and 9",
        "Needs predictable schedule around school and daycare",
        "Done with in-house politics but misses the creative work",
        "Wants recurring revenue, not one-off projects",
      ]),
      summary:
        "Rachel spent 10 years in content marketing and editorial, most recently as Head of Content at Bloom & Vine, a direct-to-consumer wellness brand. She built their content engine from scratch - the newsletter that hit 80K subscribers, the social strategy that drove 40% of organic traffic, the brand voice that made them stand out in a crowded market. She's a producer at heart: she sees the whole pipeline, not just the next post.",
      unfairAdvantageName: "Editorial Instinct",
      unfairAdvantageDescription:
        "People with this advantage don't just create content - they see the system behind it. They know what to publish, when to publish it, and why it matters to the business. It's the difference between a content creator and a content operator.",
      unfairAdvantageEvidence:
        "You built a content engine at Bloom & Vine that drove real business results - 80K newsletter subscribers, 40% organic traffic from content. That's not just good writing. That's editorial instinct: knowing what story to tell, to whom, and how to measure whether it worked.",
      unfairAdvantageWhy:
        "Editorial Instinct is wildly undervalued on salary and wildly valuable as a service. Companies spend $80K-$120K on a Head of Content. That same strategic brain, sold as a monthly retainer, commands $3K-$8K/month per client. With 3-4 clients, you're outearning your old salary.",
      linkedinSummary:
        "10 years in content marketing and editorial. Head of Content at Bloom & Vine (D2C wellness). Built newsletter to 80K subscribers.",
      onlinePresence: JSON.stringify({
        linkedin: "Strong network in D2C and content marketing circles",
        portfolio: "Case studies from Bloom & Vine content engine build",
      }),
      notableExperience: JSON.stringify([
        "10 years in content marketing and editorial",
        "Head of Content at Bloom & Vine (D2C wellness brand)",
        "Built newsletter from 0 to 80K subscribers",
        "Social strategy driving 40% of organic traffic",
        "Managed content team of 4 and freelancer network",
      ]),
    },
  });

  const rachelRec = await prisma.recommendation.upsert({
    where: { id: "rec-rachel" },
    update: {},
    create: {
      id: "rec-rachel",
      userId: rachel.id,
      primaryPathId: pathBySlug["content-engine-operator"].id,
      status: "approved",
      personalIntro:
        "You spent a decade building content engines that actually drove revenue. You know what it takes to go from \"we should probably post something\" to a machine that generates traffic, subscribers, and sales. Now you've got three kids, you're done with office politics, and you want the creative work without the corporate packaging.\n\nLet's figure out how to make that happen.",
      personalizedWhy:
        "The big idea:\nYou run the content machine for founders and brands who know they need to be visible but don't have the time or taste to do it themselves. Newsletters, LinkedIn, social, podcasts - you own the strategy and the production pipeline. This is retainer work, which means recurring revenue and predictable income.\n\nWhat you build:\nHere's an example. A founder of a growing skincare brand has 15K Instagram followers and a decent product but no content strategy. She posts when she remembers to, her newsletter goes out sporadically, and she knows she's leaving money on the table. You come in, audit what's working, build a 90-day content calendar, set up the newsletter cadence, and either produce the content or manage the freelancers who do. That's a $5K/month retainer. She gets consistent visibility and you get predictable income.\n\nWho pays you (and how you find them):\nD2C founders, personal brands, service businesses, and creators who've outgrown doing their own content. Your Bloom & Vine experience is your calling card. Founders in the wellness and lifestyle space will see your track record and immediately understand the value. Start with your network and let the case studies do the selling.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "Content Retainer", price: "$3K-$8K/month depending on volume and channels. A single-channel engagement (just newsletter, or just LinkedIn) is on the lower end. Full-stack content (newsletter + social + blog) is higher." },
          { name: "Content Strategy Sprint", price: "$5K-$10K one-time strategy build plus first month of content. Great for onboarding new clients." },
        ],
        sideHustleMath: "2-3 retainer clients = $72K-$150K/year. With a VA handling scheduling and basic production, this is manageable at 15-20 hrs/week.",
        fullCapacityMath: "5-8 clients with a small team = $200K-$400K/year. At this level you're running a content agency.",
        momFit: "Three kids at three different stages means your schedule has a lot of moving parts. But content work has a secret advantage: most of it is async. You're not on calls all day. You're writing, planning, reviewing, and scheduling. That can happen at 6am before the house wakes up, during the school day, or after bedtime.\n\nThe retainer model also means you're not constantly hunting for new clients. Once you've onboarded someone, the work becomes rhythmic - weekly content, monthly strategy check-in, quarterly planning. Predictable work, predictable income, predictable schedule. That's the trifecta when you're managing three kids' lives alongside your own.",
      }),
      closingNote:
        "You already know how to build a content engine. You did it at Bloom & Vine and the results speak for themselves. The only difference now is that you're building it for yourself. Take some time to think about which brands and founders you'd love to work with. When you're ready, we'll help you land your first retainer.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: rachelRec.id,
        pathId: pathBySlug["content-engine-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: rachelRec.id,
      pathId: pathBySlug["content-engine-operator"].id,
      rank: 1,
      fitScore: 92,
      altDescription:
        "Run the content machine for founders and brands who need to be visible. Content retainers, strategy sprints, and production management.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: rachelRec.id,
        pathId: pathBySlug["messaging-positioning"].id,
      },
    },
    update: {},
    create: {
      recommendationId: rachelRec.id,
      pathId: pathBySlug["messaging-positioning"].id,
      rank: 2,
      fitScore: 79,
      altDescription:
        "Help companies figure out what they actually are, who they're for, and how to say it.",
      altWhyConsider:
        "Your editorial instinct isn't just about content - it's about story. You spent years figuring out what makes a brand resonate. Messaging and positioning work takes that same skill and applies it higher up the chain: not \"what should we post\" but \"what should we say and why.\" Higher ticket, shorter engagements.",
      altTradeoff:
        "It's project-based, not retainer-based. You lose the recurring revenue you said you wanted. But the per-project fees are higher, and the work is more strategic and less production-heavy.",
      altRevenueRange: "$5K-$12K per positioning project, 3-6 weeks.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: rachelRec.id,
        pathId: pathBySlug["studio-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: rachelRec.id,
      pathId: pathBySlug["studio-builder"].id,
      rank: 3,
      fitScore: 71,
      altDescription:
        "Package your content expertise into a repeatable, productized offering.",
      altWhyConsider:
        "Once you've run content for enough clients to see the pattern, you can productize. \"The Content Launch Kit: $6K flat, 4-week delivery, content strategy + 30 days of content + all the templates you need to keep going.\" Same deliverable every time, no scope creep.",
      altTradeoff:
        "You need to do enough custom retainer work first to find the repeatable version. Don't productize before you know which deliverables every client actually needs versus the ones that are nice-to-have.",
      altRevenueRange: "$5K-$15K per productized engagement.",
    },
  });

  // ── Demo User 6: Emma Lawson - Lead Gen Operator ──────────────────
  const emma = await prisma.user.upsert({
    where: { email: "emma@demo.blair.com" },
    update: {},
    create: {
      email: "emma@demo.blair.com",
      name: "Emma Lawson",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: emma.id },
    update: {},
    create: {
      userId: emma.id,
      traits: JSON.stringify([
        "Data-driven",
        "Competitive",
        "Loves optimization loops",
        "Direct communicator",
        "Results-oriented",
      ]),
      strengths: JSON.stringify([
        "Paid media strategy and execution (Meta, Google, LinkedIn)",
        "Conversion rate optimization",
        "Landing page and funnel design",
        "Campaign analytics and reporting",
        "Budget management and ROI forecasting",
      ]),
      constraints: JSON.stringify([
        "Two kids ages 2 and 5",
        "Husband travels for work, often solo parenting",
        "Needs work that can flex around unpredictable days",
        "Wants income tied to results, not hours",
      ]),
      summary:
        "Emma spent 7 years in performance marketing and paid media, most recently as a Senior Performance Marketing Manager at Relay Commerce. She managed over $5M in annual ad spend across Meta, Google, and LinkedIn, and she's the person who turns ad budgets into pipeline. She's competitive, data-driven, and genuinely enjoys the optimization game.",
      unfairAdvantageName: "Conversion Intuition",
      unfairAdvantageDescription:
        "People with this advantage can look at a funnel and immediately sense where the leak is. They don't just read the data - they feel the friction. It's pattern recognition built on thousands of hours of watching what makes people click, convert, and buy.",
      unfairAdvantageEvidence:
        "You managed $5M+ in ad spend and you're still excited about optimization loops. That combination of scale and genuine interest tells us something: you don't just run ads. You see the whole conversion picture - from ad creative to landing page to email sequence to closed deal.",
      unfairAdvantageWhy:
        "Conversion Intuition is one of the most directly monetizable skills out there. Companies are spending money on ads every single day and most of them are wasting 30-50% of their budget. Someone who can fix that? They'll pay you a premium and thank you for it.",
      linkedinSummary:
        "7 years in performance marketing. Senior Performance Marketing Manager at Relay Commerce. Managed $5M+ annual ad spend.",
      onlinePresence: JSON.stringify({
        linkedin: "Connected to performance marketing and e-commerce communities",
        professional: "Known in paid media and growth marketing circles",
      }),
      notableExperience: JSON.stringify([
        "7 years in performance marketing and paid media",
        "Senior Performance Marketing Manager at Relay Commerce",
        "Managed $5M+ annual ad spend across Meta, Google, LinkedIn",
        "Drove 3x ROAS improvement for key accounts",
        "Built attribution modeling and reporting dashboards",
      ]),
    },
  });

  const emmaRec = await prisma.recommendation.upsert({
    where: { id: "rec-emma" },
    update: {},
    create: {
      id: "rec-emma",
      userId: emma.id,
      primaryPathId: pathBySlug["lead-gen-operator"].id,
      status: "approved",
      personalIntro:
        "You've spent 7 years turning ad budgets into revenue. You managed $5M in spend and you genuinely enjoy the optimization game - the testing, the tweaking, the moment when a funnel starts converting. With two little kids and a husband who travels, you need something that works around real life, not a fantasy calendar.\n\nHere's what we think that looks like.",
      personalizedWhy:
        "The big idea:\nYou build and run the systems that generate qualified leads for businesses. Paid ads, email sequences, landing pages, conversion optimization - you own the pipeline from click to booked call. This is retainer work tied to real results, which means clients stick around and your income compounds.\n\nWhat you build:\nHere's an example. A B2B SaaS company is spending $15K/month on Google and LinkedIn ads but their cost per lead is through the roof and their sales team is complaining about lead quality. You come in, audit their campaigns, rebuild their targeting, fix their landing pages, and set up proper attribution tracking. Within 60 days, their cost per lead drops 40% and their sales team is actually closing deals from the leads you're sending. That's a $5K/month retainer plus they're spending more on ads because the ROI finally makes sense.\n\nWho pays you (and how you find them):\nB2B companies, e-commerce brands, and service businesses that are spending money on ads but not getting results. Your Relay Commerce experience is your proof point. Start with founders and marketing leaders in your network who are frustrated with their current agency or in-house team. One case study with real numbers is worth a hundred cold emails.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "Monthly Management", price: "$3K-$7K/month plus ad spend. Smaller accounts with one or two channels are on the lower end. Multi-channel campaigns with bigger budgets are higher." },
          { name: "Launch Package", price: "$5K-$10K to build the funnel from scratch, then transition to monthly management." },
        ],
        sideHustleMath: "2-3 clients = $72K-$150K/year. Campaign management can be done in focused blocks - you don't need to be online all day.",
        fullCapacityMath: "5-8 clients = $200K-$450K/year. At this level you'd bring on a media buyer to handle day-to-day optimization while you own strategy.",
        momFit: "With two kids and a husband who travels, your schedule is unpredictable. Some days you're solo-parenting and barely have an hour. Other days the stars align and you get a solid work block. Here's why lead gen works for this reality.\n\nCampaign management is check-in work, not all-day work. You set up the campaigns, monitor performance, make adjustments. Most days that's 30-60 minutes per client. The heavy lifting happens upfront (building the funnel, setting up targeting) and then it's optimization mode. You can check dashboards from your phone at the playground. You can adjust bids during nap time. The work flexes because it has to.",
      }),
      closingNote:
        "You already know how to turn ad spend into revenue. The shift is just doing it for yourself instead of someone else's P&L. Think about which companies in your network are wasting money on ads right now. That's your starting list. We'll be here when you're ready to reach out.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: emmaRec.id,
        pathId: pathBySlug["lead-gen-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: emmaRec.id,
      pathId: pathBySlug["lead-gen-operator"].id,
      rank: 1,
      fitScore: 91,
      altDescription:
        "Build and run the systems that generate qualified leads. Paid ads, email sequences, landing pages, and conversion optimization.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: emmaRec.id,
        pathId: pathBySlug["gtm-growth-strategist"].id,
      },
    },
    update: {},
    create: {
      recommendationId: emmaRec.id,
      pathId: pathBySlug["gtm-growth-strategist"].id,
      rank: 2,
      fitScore: 77,
      altDescription:
        "Help companies build, fix, or scale their go-to-market motion. GTM Sprints and Revenue Audits.",
      altWhyConsider:
        "Your performance marketing background gives you a unique lens on GTM work. You understand the paid acquisition side deeply, but you also see how it connects to the broader sales motion. GTM strategy work is higher ticket and more strategic - you're designing the whole revenue engine, not just managing the ad campaigns.",
      altTradeoff:
        "It's project-based instead of retainer-based. You lose the monthly recurring revenue, but the per-project fees are significantly higher. Also requires more client-facing strategy work and less hands-on optimization.",
      altRevenueRange: "$10K-$18K per GTM Sprint, $5K-$8K for Revenue Audits.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: emmaRec.id,
        pathId: pathBySlug["automation-systems-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: emmaRec.id,
      pathId: pathBySlug["automation-systems-builder"].id,
      rank: 3,
      fitScore: 69,
      altDescription:
        "Build the marketing automation systems that power lead gen at scale.",
      altWhyConsider:
        "Instead of managing campaigns, you'd build the infrastructure. Email sequences, lead scoring systems, CRM automations, attribution dashboards. The stuff that makes lead gen run without someone watching it every day. More project-based, less ongoing management.",
      altTradeoff:
        "You'd be further from the results (the clicks, the conversions, the optimization game you love). If what energizes you is watching the numbers move in real time, pure systems work might feel too removed from the action.",
      altRevenueRange: "$3K-$8K per project build, $2K-$5K/month retainer.",
    },
  });

  // ── Demo User 7: Danielle Okafor - Studio Builder ─────────────────
  const danielle = await prisma.user.upsert({
    where: { email: "danielle@demo.blair.com" },
    update: {},
    create: {
      email: "danielle@demo.blair.com",
      name: "Danielle Okafor",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: danielle.id },
    update: {},
    create: {
      userId: danielle.id,
      traits: JSON.stringify([
        "Methodical creative",
        "Loves building repeatable systems",
        "Aesthetic eye with a builder's brain",
        "Prefers ownership over collaboration",
        "Thinks in frameworks",
      ]),
      strengths: JSON.stringify([
        "UX and product design",
        "Design system creation and maintenance",
        "Brand identity and visual design",
        "User research and usability testing",
        "Design team leadership and process design",
      ]),
      constraints: JSON.stringify([
        "One kid, 18 months old",
        "Partner works full-time, sharing childcare",
        "Wants to build an asset, not sell hours forever",
        "Needs flexibility but also craves structure in her work",
      ]),
      summary:
        "Danielle spent 9 years in UX and product design, building design systems at two companies - first at a Series B fintech called Ledger Labs, then as Design Lead at a mid-market SaaS company called Threadline. She's the person who looks at a product with 47 different button styles and says \"we're fixing this.\" She loves the systematic side of design: creating the rules, building the components, making everything work together.",
      unfairAdvantageName: "Pattern Recognition",
      unfairAdvantageDescription:
        "People with this advantage see the repeatable structure inside creative work. They don't just design something beautiful - they design something that can be replicated, scaled, and maintained. It's the intersection of aesthetic taste and systems thinking.",
      unfairAdvantageEvidence:
        "You built design systems at two different companies. That's not something people stumble into - it requires someone who can look at a messy product and see the patterns underneath. Your brain naturally organizes creative work into repeatable frameworks.",
      unfairAdvantageWhy:
        "Pattern Recognition is the key ingredient for building a studio. While other designers are starting from scratch with every client, you're applying proven frameworks and delivering faster, better, more consistent results. That efficiency is what makes productized design services so profitable.",
      linkedinSummary:
        "9 years in UX/product design. Design Lead at Threadline. Built design systems at Ledger Labs and Threadline.",
      onlinePresence: JSON.stringify({
        linkedin: "Connected to product and design communities in SaaS",
        portfolio: "Design system case studies from Ledger Labs and Threadline",
      }),
      notableExperience: JSON.stringify([
        "9 years in UX and product design",
        "Design Lead at Threadline (mid-market SaaS)",
        "Built design systems at Ledger Labs (Series B fintech) and Threadline",
        "Led design team of 5",
        "User research and usability testing across B2B products",
      ]),
    },
  });

  const danielleRec = await prisma.recommendation.upsert({
    where: { id: "rec-danielle" },
    update: {},
    create: {
      id: "rec-danielle",
      userId: danielle.id,
      primaryPathId: pathBySlug["studio-builder"].id,
      status: "approved",
      personalIntro:
        "You've spent 9 years in design, and the thing that makes you different is that you don't just make things look good - you build systems that make good design repeatable. You've done it twice now, at Ledger Labs and Threadline. With an 18-month-old at home, you're thinking about building something of your own. Something that grows.\n\nHere's what we think that looks like for you.",
      personalizedWhy:
        "The big idea:\nYou take your design systems expertise and package it into a repeatable offering. Same deliverable, same process, same price, different client every time. You're building a machine, not taking on projects. Over time, this becomes an asset that runs without you being in every detail.\n\nWhat you build:\nHere's an example. A Series A SaaS company has a product that works but looks like it was designed by five different people (because it was). Their buttons are inconsistent, their spacing is random, and every new feature looks like it belongs to a different product. You come in with your productized offering - \"The Design System Sprint: $10K flat, 4 weeks, complete component library, usage guidelines, and Figma template.\" Same intake process, same deliverables, same timeline. You've done this enough times that you could do it in your sleep. The client gets a design system that makes their product look cohesive, and you move on to the next one.\n\nWho pays you (and how you find them):\nSaaS companies at the Series A-B stage that have a working product but a messy design. Product leaders and founders who know their product looks inconsistent but don't have a design systems person on staff. Your network from Ledger Labs and Threadline is the starting point. One or two case studies with real before-and-afters will drive inbound.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "Productized Package", price: "$5K-$15K per engagement, fixed scope. A focused component library is on the lower end. A full design system with guidelines and templates is higher." },
          { name: "DIY Kit or Template", price: "$500-$2K for a self-serve design system starter kit. Passive income that scales." },
        ],
        sideHustleMath: "2 packages per month = $120K-$360K/year. Because the work is productized, each engagement takes less time as you refine your process.",
        fullCapacityMath: "4-6 packages per month plus template sales = $300K-$600K/year. At this level you're running a studio.",
        momFit: "With an 18-month-old, your days have a rhythm: morning energy, nap time focus, evening wind-down. The studio model works with this because the work is predictable. You're not reinventing the wheel with each client. You know exactly what you're delivering, how long it takes, and what the process looks like.\n\nThe other thing about productized work: it gets faster. Your first design system sprint might take 40 hours. By your tenth, you've built templates, refined your process, and it takes 25. That efficiency compounds. You're doing better work in less time, which means more margin and more time with your kid.",
      }),
      closingNote:
        "You've already built the hard thing twice - you just did it inside companies instead of for yourself. The studio model lets you take that expertise and own it. Think about what your productized offering looks like. We'll help you build the rest.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: danielleRec.id,
        pathId: pathBySlug["studio-builder"].id,
      },
    },
    update: {},
    create: {
      recommendationId: danielleRec.id,
      pathId: pathBySlug["studio-builder"].id,
      rank: 1,
      fitScore: 90,
      altDescription:
        "Package your design systems expertise into a repeatable, productized offering. Build a machine, not a consultancy.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: danielleRec.id,
        pathId: pathBySlug["fractional-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: danielleRec.id,
      pathId: pathBySlug["fractional-operator"].id,
      rank: 2,
      fitScore: 76,
      altDescription:
        "Embed inside companies as their part-time design leader.",
      altWhyConsider:
        "Instead of productized projects, you embed with 1-2 companies as their fractional Head of Design. You own design direction, design systems, and team leadership. It's what you did at Threadline, just for yourself. Steady retainer income and deep relationships with your clients.",
      altTradeoff:
        "Fractional roles need more hours per client (15-25/month) and more meeting time. With an 18-month-old, that's a bigger calendar commitment. You also lose the \"build an asset\" advantage of productized work.",
      altRevenueRange: "$5K-$10K/month per client, 15-25 hrs/month.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: danielleRec.id,
        pathId: pathBySlug["messaging-positioning"].id,
      },
    },
    update: {},
    create: {
      recommendationId: danielleRec.id,
      pathId: pathBySlug["messaging-positioning"].id,
      rank: 3,
      fitScore: 65,
      altDescription:
        "Help companies figure out their visual identity and brand positioning.",
      altWhyConsider:
        "Your design background gives you a unique angle on brand work. You understand how positioning translates into visual identity in a way that pure strategists don't. Brand sprints that include both the messaging framework and the visual system could be a powerful offering.",
      altTradeoff:
        "It's a different lane than design systems. You'd be competing with brand strategists who've been doing this their whole career. Your design angle is a differentiator, but it takes time to build credibility in a new space.",
      altRevenueRange: "$5K-$12K per brand positioning project.",
    },
  });

  // ── Demo User 8: Priya Sharma - Niche Talent & Placement ──────────
  const priya = await prisma.user.upsert({
    where: { email: "priya@demo.blair.com" },
    update: {},
    create: {
      email: "priya@demo.blair.com",
      name: "Priya Sharma",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: priya.id },
    update: {},
    create: {
      userId: priya.id,
      traits: JSON.stringify([
        "Relationship-first",
        "High EQ",
        "Persistent without being pushy",
        "Naturally curious about people",
        "Connector mindset",
      ]),
      strengths: JSON.stringify([
        "Technical recruiting and talent acquisition",
        "Engineering team assessment",
        "Compensation benchmarking",
        "Candidate pipeline development",
        "Hiring process design and optimization",
      ]),
      constraints: JSON.stringify([
        "Two kids ages 4 and 7",
        "Active in school community and kids' activities",
        "Wants work that leverages her network, not fights against it",
        "Needs bursty schedule - intense weeks followed by lighter ones",
      ]),
      summary:
        "Priya spent 11 years in recruiting and talent acquisition at tech companies, most recently as Head of Talent at a Series C infrastructure startup called Lattice Core. She's placed hundreds of engineers, from junior devs to VP of Engineering. Her network in the engineering community is deep - she's the person CTOs call when they can't find the senior backend engineer who also wants to work at a startup.",
      unfairAdvantageName: "Talent Radar",
      unfairAdvantageDescription:
        "People with this advantage can assess talent in minutes, not months. They know what great looks like because they've spent years matching people to roles and watching what works. It's part intuition, part pattern recognition, part deep relationship network.",
      unfairAdvantageEvidence:
        "You've placed hundreds of engineers over 11 years. You know the difference between a resume that looks great and a person who actually ships. CTOs at your former companies still call you for referrals. That network and that judgment are your most valuable assets.",
      unfairAdvantageWhy:
        "Talent Radar turns relationships into revenue. Companies pay 15-20% of first-year salary for placements. On senior engineering roles, that's $25K-$50K per placement. Three or four placements a year as a side hustle is serious money for work that comes naturally to you.",
      linkedinSummary:
        "11 years in recruiting and talent acquisition. Head of Talent at Lattice Core (Series C). Deep network in engineering talent.",
      onlinePresence: JSON.stringify({
        linkedin: "Extensive network across engineering and startup talent communities",
        professional: "Known in CTO and VP Engineering circles as a trusted talent advisor",
      }),
      notableExperience: JSON.stringify([
        "11 years in recruiting and talent acquisition",
        "Head of Talent at Lattice Core (Series C infrastructure startup)",
        "Placed hundreds of engineers from IC to VP level",
        "Deep network in backend, infrastructure, and platform engineering",
        "Designed hiring processes for hypergrowth teams",
      ]),
    },
  });

  const priyaRec = await prisma.recommendation.upsert({
    where: { id: "rec-priya" },
    update: {},
    create: {
      id: "rec-priya",
      userId: priya.id,
      primaryPathId: pathBySlug["niche-talent-placement"].id,
      status: "approved",
      personalIntro:
        "You've spent 11 years building one of the most valuable things in tech: a deep network of engineers who trust you and CTOs who rely on you. You know what great engineering talent looks like, and more importantly, you know where to find it. With two kids and a life that's full in the best way, you want work that plays to your strengths without consuming your calendar.\n\nHere's where your network becomes your business.",
      personalizedWhy:
        "The big idea:\nYou connect high-growth companies with the specialized engineering talent they can't find on their own. You know what great looks like because you've spent 11 years evaluating it, and you know the people because you've worked alongside them. Placement fees on senior engineering roles are significant - this is high-revenue, relationship-driven work.\n\nWhat you build:\nHere's an example. A Series B dev tools company needs a Senior Staff Engineer who understands distributed systems. They've been looking for three months, their internal recruiter is striking out, and the CTO is getting desperate. You reach into your network, identify three people who'd be a great fit, make the introductions, and manage the process through close. Placement fee: 18% of a $220K salary = $39,600. For maybe 15-20 hours of actual work spread over a few weeks.\n\nWho pays you (and how you find them):\nCTOs and VP Engineers at startups that are hiring senior technical talent. Your Lattice Core network is the starting point. The engineering leaders you've worked with over 11 years are now at dozens of different companies, and they all have hiring needs. One message to your network announcing what you're doing and you'll have conversations within a week.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "Placement Fee", price: "15-20% of first-year salary. On senior engineering roles ($180K-$280K), that's $27K-$56K per placement." },
          { name: "Retained Search", price: "$10K-$20K upfront plus success fee. For hard-to-fill roles where exclusivity matters." },
        ],
        sideHustleMath: "3-4 placements per year = $75K-$200K. This work is bursty - intense when you have a live search, quiet when you don't.",
        fullCapacityMath: "8-12 placements per year = $200K-$600K. At this level you're running a boutique search firm.",
        momFit: "The talent placement model is uniquely suited to the rhythm of parenting. The work is bursty, not constant. When you have a live search, you're actively reaching out, taking calls, and managing the process. When you don't, you're maintaining relationships and keeping your ear to the ground - which is basically just having coffee and staying in touch.\n\nWith a 4-year-old and a 7-year-old, your weeks have natural structure: school hours for focused work, afternoons for kids, evenings for the occasional candidate call. And the bursty nature means you can take a week off for school events or family trips without clients panicking. The search continues when you come back.",
      }),
      closingNote:
        "Your network is your business. You've spent 11 years building it and it's not going anywhere. Take some time to think about which CTOs in your network have the most urgent hiring needs. That first conversation is your first step. We'll be here to help you build from there.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: priyaRec.id,
        pathId: pathBySlug["niche-talent-placement"].id,
      },
    },
    update: {},
    create: {
      recommendationId: priyaRec.id,
      pathId: pathBySlug["niche-talent-placement"].id,
      rank: 1,
      fitScore: 92,
      altDescription:
        "Connect high-growth companies with the specialized engineering talent they can't find on their own. Placement fees and retained searches.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: priyaRec.id,
        pathId: pathBySlug["fractional-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: priyaRec.id,
      pathId: pathBySlug["fractional-operator"].id,
      rank: 2,
      fitScore: 75,
      altDescription:
        "Embed inside companies as their part-time Head of Talent.",
      altWhyConsider:
        "Instead of placing individual candidates, you embed with 1-2 companies as their fractional Head of Talent. You own the hiring strategy, process design, and employer branding. It's what you did at Lattice Core, but on your terms. Steady retainer income versus lumpy placement fees.",
      altTradeoff:
        "Fractional roles need consistent hours (15-25/month per client) and more meetings. You lose the bursty schedule that fits around kids' activities. But the income is more predictable month to month.",
      altRevenueRange: "$5K-$10K/month per client, 15-25 hrs/month.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: priyaRec.id,
        pathId: pathBySlug["gtm-growth-strategist"].id,
      },
    },
    update: {},
    create: {
      recommendationId: priyaRec.id,
      pathId: pathBySlug["gtm-growth-strategist"].id,
      rank: 3,
      fitScore: 64,
      altDescription:
        "Help companies build their go-to-market motion for talent products and services.",
      altWhyConsider:
        "There's a growing market of HR tech and talent tools that need someone who actually understands recruiting to help them sell. Your insider knowledge of what recruiters and hiring managers actually need is a unique angle on GTM consulting.",
      altTradeoff:
        "It's a different skill set than recruiting. You'd be doing strategy and sales process work rather than relationship-driven placement. The learning curve is steeper but the per-project fees are higher.",
      altRevenueRange: "$10K-$18K per GTM Sprint.",
    },
  });

  // ── Demo User 9: Amanda Reeves - Investor-Operator ────────────────
  const amanda = await prisma.user.upsert({
    where: { email: "amanda@demo.blair.com" },
    update: {},
    create: {
      email: "amanda@demo.blair.com",
      name: "Amanda Reeves",
      role: "user",
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: amanda.id },
    update: {},
    create: {
      userId: amanda.id,
      traits: JSON.stringify([
        "Analytical and decisive",
        "Sees around corners",
        "Comfortable with risk",
        "Direct communicator",
        "Strategic over tactical",
      ]),
      strengths: JSON.stringify([
        "Financial modeling and analysis",
        "Strategic planning and execution",
        "Board-level communication",
        "Fundraising and investor relations",
        "M&A and exit strategy",
      ]),
      constraints: JSON.stringify([
        "Two kids ages 6 and 9",
        "Wants to work at the strategic level, not in the weeds",
        "Has capital to invest alongside advice",
        "Optimizing for influence and long-term wealth creation",
      ]),
      summary:
        "Amanda spent 15 years in finance and strategy, rising to CFO at a health tech startup called Meridian Health that exited for $180M. She's been angel investing on the side for three years, with a portfolio of 6 companies. She understands both sides of the table - what founders need and what investors look for. She wants to do more of this, on her own terms.",
      unfairAdvantageName: "Capital Judgment",
      unfairAdvantageDescription:
        "People with this advantage see the financial story behind a business before anyone else does. They know which metrics matter, which ones lie, and when a company is about to hit a wall or break through. It's the intersection of financial acumen and operational intuition.",
      unfairAdvantageEvidence:
        "You were CFO at a company that exited for $180M. You've been angel investing with your own capital. You see the financial architecture of a business - the unit economics, the cash flow dynamics, the inflection points - in a way that most people never learn to. That's not just finance skills. That's judgment.",
      unfairAdvantageWhy:
        "Capital Judgment is the rarest advantage on our list. Most people can learn to read a P&L. Very few can look at a startup and know whether the numbers tell the truth. As a CFO who's been through an exit and an angel investor who's deploying capital, you have credibility that can't be faked.",
      linkedinSummary:
        "15 years in finance and strategy. CFO at Meridian Health (exited $180M). Active angel investor with 6-company portfolio.",
      onlinePresence: JSON.stringify({
        linkedin: "Well-connected in startup finance, VC, and health tech circles",
        professional: "Known as a trusted financial advisor in the founder community",
      }),
      notableExperience: JSON.stringify([
        "15 years in finance and strategy",
        "CFO at Meridian Health (health tech, $180M exit)",
        "Active angel investor, 6-company portfolio",
        "Board observer roles at two portfolio companies",
        "Deep network across VC, PE, and startup finance",
      ]),
    },
  });

  const amandaRec = await prisma.recommendation.upsert({
    where: { id: "rec-amanda" },
    update: {},
    create: {
      id: "rec-amanda",
      userId: amanda.id,
      primaryPathId: pathBySlug["investor-operator"].id,
      status: "approved",
      personalIntro:
        "You've spent 15 years building the kind of career most people dream about. CFO at a startup that exited for $180M, angel investor with a growing portfolio, and the financial judgment that comes from sitting in the seat where the big decisions get made. With two kids who are getting more independent, you're not looking to slow down. You're looking to do the work that actually matters to you.\n\nHere's what that looks like.",
      personalizedWhy:
        "The big idea:\nYou invest in and advise early-stage companies, bringing operational expertise alongside capital. You're not running the day-to-day - you're governing, advising, and opening doors. This is the path where your experience, your network, and your capital work together to create compounding value.\n\nWhat you build:\nHere's an example. A first-time founder with a promising health tech company has raised a $3M seed round but has no idea how to build a financial model that investors will take seriously, how to think about unit economics, or when to start planning for Series A. You come in as an advisor - $3K/month plus 1% equity. You help them build the model, coach the CEO on board communication, and make two introductions that lead to their next round. Total time commitment: maybe 5 hours a month. But the impact is massive, and the equity could be worth multiples of the advisory fees.\n\nWho pays you (and how you find them):\nEarly-stage founders who need a financial brain and a steady hand. Your Meridian Health exit gives you instant credibility. Your angel portfolio means you're already in the deal flow. The VC partners and founders you know from 15 years in the game are your pipeline. This isn't cold outreach - it's showing up where you already are and making yourself available.",
      pricingDetails: JSON.stringify({
        tiers: [
          { name: "Advisory Fee + Equity", price: "$2K-$5K/month plus 0.5-2% equity. The fee covers your time, the equity aligns your incentives with the company's success." },
          { name: "Angel Investment", price: "$25K-$100K per deal with a board observer or advisory seat. You're not just writing checks - you're adding operational value." },
        ],
        sideHustleMath: "2-3 advisory roles plus 1-2 angel deals per year. Advisory fees cover your time, equity builds long-term wealth.",
        fullCapacityMath: "Portfolio of 5-8 companies with advisory fees plus equity upside. At scale, the advisory fees alone are $120K-$480K/year, and the equity portfolio has significant upside potential.",
        momFit: "With a 6 and 9-year-old, you're past the baby years and into the phase where kids are more independent but still need you present. The investor-operator model is designed for this stage.\n\nAdvisory work runs on your schedule. A monthly board call, a few ad hoc conversations with founders, and the occasional deep dive on a financial model. Maybe 10-15 hours a month total across all your companies. You can take calls during school hours, review decks in the evening after homework, and still make it to every game and recital.\n\nThe real work here is thinking, connecting, and deciding. That happens in your head, not in a conference room.",
      }),
      closingNote:
        "You're in a rare position. You have the experience, the capital, the network, and the judgment. Most people spend their whole career trying to get to where you already are. The question isn't whether you can do this - it's how much of your portfolio you want to build in the next few years. Take some time to think about which founders in your network need what you have. We'll be here when you're ready to formalize it.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: amandaRec.id,
        pathId: pathBySlug["investor-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: amandaRec.id,
      pathId: pathBySlug["investor-operator"].id,
      rank: 1,
      fitScore: 95,
      altDescription:
        "Invest in and advise early-stage companies with operational expertise alongside capital. Advisory fees plus equity.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: amandaRec.id,
        pathId: pathBySlug["fractional-operator"].id,
      },
    },
    update: {},
    create: {
      recommendationId: amandaRec.id,
      pathId: pathBySlug["fractional-operator"].id,
      rank: 2,
      fitScore: 78,
      altDescription:
        "Embed inside companies as their part-time CFO or finance leader.",
      altWhyConsider:
        "Your CFO experience translates directly into fractional CFO work. Companies at the Series A-B stage desperately need financial leadership but can't afford (or don't need) a full-time CFO. You'd own financial strategy, fundraising prep, board reporting, and financial operations for 1-2 companies. Steady retainer income with deep client relationships.",
      altTradeoff:
        "Fractional CFO work is more hands-on than advisory. You're in the weeds of financial operations, not just providing strategic guidance. If you want to stay at the governance level, this might feel like going back to a job you've already had.",
      altRevenueRange: "$8K-$15K/month per client, 15-25 hrs/month. Higher than typical fractional ops because of the CFO premium.",
    },
  });

  await prisma.recommendationPath.upsert({
    where: {
      recommendationId_pathId: {
        recommendationId: amandaRec.id,
        pathId: pathBySlug["gtm-growth-strategist"].id,
      },
    },
    update: {},
    create: {
      recommendationId: amandaRec.id,
      pathId: pathBySlug["gtm-growth-strategist"].id,
      rank: 3,
      fitScore: 68,
      altDescription:
        "Help companies build their financial and go-to-market strategy for fundraising and growth.",
      altWhyConsider:
        "Your exit experience and investor network make you uniquely qualified to help companies prepare for their next round. GTM work focused on fundraising readiness - financial modeling, pitch deck strategy, investor targeting - is a natural extension of what you already do as an angel investor.",
      altTradeoff:
        "GTM strategy is a different positioning than investor-operator. You'd be selling project work rather than building a portfolio. It's good money but doesn't build the long-term equity upside that comes with the investor-operator model.",
      altRevenueRange: "$10K-$18K per fundraising readiness sprint.",
    },
  });

  // ── Founder Video ───────────────────────────────────────────────────
  await prisma.founderVideo.upsert({
    where: { id: "founder-video-1" },
    update: {},
    create: {
      id: "founder-video-1",
      youtubeUrl: "https://youtube.com/shorts/2BhMGtWkLxE",
      title: "A message from Kristin",
      description:
        "A personal welcome from Blair founder Kristin Kent on what to expect from your recommendation and how to get the most out of your path.",
    },
  });

  console.log("Seed complete.");
  console.log(`  - 9 business paths (with path-specific playbook content)`);
  console.log(`  - 9 sets of path-specific phases (5 phases each, 4 tasks in Phase 1)`);
  console.log(`  - User: Liz Holloway (liz@demo.blair.com) - Messaging & Positioning`);
  console.log(`  - User: Julie Soper (julie@demo.blair.com) - GTM & Growth Strategist`);
  console.log(`  - User: Sarah Chen (sarah@demo.blair.com) - Fractional Operator`);
  console.log(`  - User: Maria Santos (maria@demo.blair.com) - Automation & Systems Builder`);
  console.log(`  - User: Rachel Gaines (rachel@demo.blair.com) - Content Engine Operator`);
  console.log(`  - User: Emma Lawson (emma@demo.blair.com) - Lead Gen Operator`);
  console.log(`  - User: Danielle Okafor (danielle@demo.blair.com) - Studio Builder`);
  console.log(`  - User: Priya Sharma (priya@demo.blair.com) - Niche Talent & Placement`);
  console.log(`  - User: Amanda Reeves (amanda@demo.blair.com) - Investor-Operator`);
  console.log(`  - Profiles, recommendations, and paths for all 9 users`);
  console.log(`  - Founder video`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
