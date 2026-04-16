/**
 * Researched engagement shapes for fractional/consulting work.
 *
 * Each entry represents a real engagement type that companies actually buy,
 * with pricing grounded in market data (A.Team, Toptal, Growth Collective,
 * MarketerHire, Lenny's community, Reforge alumni network, and Blair's
 * own customer research with Carla/Nadine/Erin/Kaleana).
 *
 * This is the single source of truth for step 3 of the narrowing exercise.
 * The monthly market-rate refresh task updates this file.
 *
 * Adding a new engagement shape:
 * 1. Add it to the relevant role category array below
 * 2. Include matchKeywords that connect it to step 1/2 chip text
 * 3. Verify pricing against current market data
 */

export interface EngagementShape {
  name: string;
  scope: string;
  duration: string;
  pricing: string;
  buyerTitle: string;
  description: string;
  /** Keywords that link this engagement to step 2 chip selections */
  matchKeywords: string[];
  /** Default priority when no keyword matching (lower = shown first) */
  defaultPriority: number;
}

// ============================================================================
// Product Management / PMM
// ============================================================================

const PRODUCT_PMM: EngagementShape[] = [
  {
    name: "Embedded fractional product lead",
    scope: "Own a product area end-to-end: roadmap, discovery, stakeholder alignment, team coaching",
    duration: "Ongoing, 3-6 month minimum",
    pricing: "$6,000-$12,000/month (6-10 hrs/week)",
    buyerTitle: "Founder or CEO at a Series A SaaS company with no senior product hire",
    description: "You're the senior product person they don't have yet. You run discovery, own the quarterly roadmap, coach their first PMs, and sit in on exec meetings. This is leadership, not execution.",
    matchKeywords: ["roadmap", "prioritization", "discovery", "cross-team", "launches", "shipped", "strategy", "founders", "execs", "stakeholder"],
    defaultPriority: 1,
  },
  {
    name: "Product discovery sprint",
    scope: "Run a focused discovery program: user interviews, problem mapping, opportunity sizing, recommendation deck",
    duration: "4-6 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "Head of Product or founder at a company that has a hunch but no data",
    description: "The team has a roadmap full of assumptions and no customer evidence. You run 15-20 interviews, map the problem space, and deliver a recommendation the team can ship against.",
    matchKeywords: ["discovery", "customer", "research", "interviews", "pain", "feedback", "specs", "translated"],
    defaultPriority: 2,
  },
  {
    name: "PM coaching and team buildout",
    scope: "1:1 coaching for first-time PMs + help hiring their next PM",
    duration: "Ongoing, typically 3-4 months",
    pricing: "$3,000-$6,000/month (3-4 hrs/week)",
    buyerTitle: "Founder or VP Eng who just promoted their first PM and wants them to succeed",
    description: "Their first PM was a great IC who got promoted into a role nobody taught them to do. You coach them through their first quarter of roadmap ownership, discovery, and stakeholder management.",
    matchKeywords: ["coached", "mentored", "grew", "pms", "team", "ownership", "hiring"],
    defaultPriority: 3,
  },
  {
    name: "Launch strategy package",
    scope: "End-to-end launch plan: positioning, GTM coordination, success metrics, internal alignment",
    duration: "3-5 weeks",
    pricing: "$6,000-$12,000 project fee",
    buyerTitle: "Head of Product or founder with a launch coming and no launch process",
    description: "A launch is coming and the team is scrambling. You bring the launch playbook: positioning, GTM coordination with sales/marketing, success metrics, and the internal comms that make sure everyone knows the plan.",
    matchKeywords: ["launches", "shipped", "cross-team", "coordination", "positioning", "strategy"],
    defaultPriority: 4,
  },
  {
    name: "Roadmap and prioritization overhaul",
    scope: "Audit current roadmap process, install a prioritization framework, deliver a 90-day roadmap",
    duration: "3-4 weeks",
    pricing: "$5,000-$10,000 project fee",
    buyerTitle: "Founder or CTO at a company where the roadmap is a Google Doc nobody trusts",
    description: "The roadmap is a mess of pet projects and squeaky-wheel requests. You audit what they're building, install a prioritization framework the team buys into, and deliver a clean 90-day roadmap.",
    matchKeywords: ["roadmap", "prioritization", "cadence", "operating", "metrics", "frameworks"],
    defaultPriority: 5,
  },
  {
    name: "Interim head of product",
    scope: "Full product leadership seat while they hire permanent",
    duration: "3-6 months, 15-20 hrs/week",
    pricing: "$12,000-$20,000/month",
    buyerTitle: "CEO at a Series A/B company whose Head of Product just left",
    description: "Their product leader left and they need someone in the seat while they hire. You keep the team shipping, own the exec-level product narrative, and help them hire your replacement.",
    matchKeywords: ["roadmap", "team", "leadership", "execs", "strategy", "cross-team", "cadence"],
    defaultPriority: 6,
  },
  {
    name: "Series A product readiness package",
    scope: "Audit product org maturity, install investor-ready processes, build a narrative deck for the product story",
    duration: "3-4 weeks",
    pricing: "$8,000-$12,000 project fee",
    buyerTitle: "Founder or CEO preparing to raise Series A and needs the product story to hold up under investor scrutiny",
    description: "Investors are going to ask about your product process, your roadmap rationale, and your discovery rigor. You get the product org investor-ready: clean up the roadmap narrative, install lightweight processes, and build the deck section that makes investors nod.",
    matchKeywords: ["investors", "fundraise", "roadmap", "strategy", "discovery", "founders", "execs"],
    defaultPriority: 7,
  },
  {
    name: "PLG conversion audit",
    scope: "Analyze the signup-to-paid funnel, identify drop-off points, deliver a prioritized fix list with projected impact",
    duration: "2-3 weeks",
    pricing: "$6,000-$12,000 project fee",
    buyerTitle: "Head of Product or Growth at a PLG company where free users aren't converting",
    description: "Signups are fine but paid conversion is flat. You map the full funnel, instrument the drop-off points, run the analysis, and deliver a prioritized list of fixes with projected revenue impact for each.",
    matchKeywords: ["funnel", "conversion", "activation", "onboarding", "metrics", "data", "research"],
    defaultPriority: 8,
  },
  {
    name: "Customer discovery program",
    scope: "Structured discovery sprint: recruit participants, run 15-20 interviews, synthesize findings, deliver opportunity map",
    duration: "3-4 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "Founder or Head of Product building something new and flying blind on customer needs",
    description: "They're building based on assumptions and internal opinions. You run a structured discovery sprint: recruit the right participants, conduct the interviews, synthesize patterns, and deliver an opportunity map the team can build against with confidence.",
    matchKeywords: ["discovery", "interviews", "research", "customer", "feedback", "pain", "specs", "translated"],
    defaultPriority: 9,
  },
];

// ============================================================================
// Marketing / Brand
// ============================================================================

const MARKETING_BRAND: EngagementShape[] = [
  {
    name: "Embedded fractional head of marketing",
    scope: "Own marketing strategy, manage team/agencies, report on pipeline impact",
    duration: "Ongoing, 3-6 month minimum",
    pricing: "$8,000-$15,000/month (8-12 hrs/week)",
    buyerTitle: "Founder or CEO at a Series A SaaS without a senior marketing leader",
    description: "You're the marketing leader they can't afford full-time yet. Strategy, team management, agency oversight, and pipeline accountability. You build the engine, not just the content.",
    matchKeywords: ["brand", "demand", "pipeline", "team", "budget", "campaigns", "strategy", "messaging", "launches", "engine"],
    defaultPriority: 1,
  },
  {
    name: "Positioning and messaging sprint",
    scope: "Competitive analysis, customer interviews, messaging framework, homepage rewrite",
    duration: "4-6 weeks",
    pricing: "$10,000-$20,000 project fee",
    buyerTitle: "Founder or VP Marketing at a company whose pitch isn't landing",
    description: "The sales team can't articulate why you're different. You run the research, build the messaging framework, rewrite the homepage, and arm the team with language that converts.",
    matchKeywords: ["brand", "repositioning", "messaging", "narrative", "positioning", "voice", "guidelines", "framework", "competitive"],
    defaultPriority: 2,
  },
  {
    name: "Demand gen audit and 90-day plan",
    scope: "Funnel analysis, channel assessment, team capability review, prioritized roadmap",
    duration: "2-3 weeks",
    pricing: "$5,000-$10,000 project fee",
    buyerTitle: "CEO or Head of Sales at a company where marketing spend isn't translating to pipeline",
    description: "They're spending on marketing but pipeline isn't moving. You audit the funnel, assess channels, evaluate the team, and deliver a 90-day plan they can execute themselves.",
    matchKeywords: ["demand", "pipeline", "funnel", "revenue", "campaigns", "channels", "mql", "sql"],
    defaultPriority: 3,
  },
  {
    name: "Senior marketing advisor",
    scope: "Weekly strategy sessions with founder or in-house marketer, async campaign reviews",
    duration: "Ongoing, month-to-month",
    pricing: "$3,000-$6,000/month (2-4 hrs/week)",
    buyerTitle: "Founder who hired a junior marketer and needs someone senior to guide them",
    description: "They have a marketer but no marketing leadership. You're the weekly sounding board: campaign reviews, strategic direction, hiring advice, and the experienced voice their junior team needs.",
    matchKeywords: ["coached", "mentored", "hired", "agency", "team", "grew", "managed"],
    defaultPriority: 4,
  },
  {
    name: "Product launch campaign",
    scope: "Launch strategy, creative direction, channel plan, sales enablement materials",
    duration: "4-6 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "Head of Product or founder launching a new product or major feature",
    description: "A launch is coming and the marketing plan is 'post about it on LinkedIn.' You build the launch strategy, the creative, the channel plan, and the sales materials that make it land.",
    matchKeywords: ["launches", "campaigns", "creative", "content", "strategy", "sales"],
    defaultPriority: 5,
  },
  {
    name: "90-day demand gen buildout",
    scope: "Build the full demand engine: channel strategy, content calendar, lead scoring, attribution model, team workflows",
    duration: "8-12 weeks",
    pricing: "$12,000-$20,000 project fee",
    buyerTitle: "Founder or VP Sales at a company that needs pipeline and has no marketing engine",
    description: "They have a website and a prayer. You build the demand engine from scratch: which channels, what content, how leads get scored and routed, how attribution works, and the team workflows to keep it running after you leave.",
    matchKeywords: ["demand", "funnel", "pipeline", "channels", "campaigns", "engine", "revenue"],
    defaultPriority: 6,
  },
  {
    name: "Category creation narrative",
    scope: "Define a new category, build the narrative framework, create the analyst briefing and sales deck that establishes it",
    duration: "4-6 weeks",
    pricing: "$12,000-$20,000 project fee",
    buyerTitle: "Founder or CMO at a company that keeps getting compared to competitors and losing",
    description: "They're stuck in a comparison game they can't win. You define the category they should own, build the narrative framework, write the analyst briefing, and create the sales deck that positions them as the obvious choice in a market they named.",
    matchKeywords: ["category", "narrative", "positioning", "messaging", "competitive", "framework", "brand"],
    defaultPriority: 7,
  },
  {
    name: "Marketing team assessment and hiring plan",
    scope: "Assess current team capabilities, define gaps, build job descriptions, create an interview process and 90-day onboarding plan",
    duration: "2-3 weeks",
    pricing: "$5,000-$10,000 project fee",
    buyerTitle: "Founder or CEO who knows they need marketing people but doesn't know what roles to hire",
    description: "They've been burned by a bad marketing hire or they're paralyzed by the options. You assess what they have, map what they need, write the job descriptions, build the interview scorecard, and create a 90-day onboarding plan so the next hire actually sticks.",
    matchKeywords: ["team", "hired", "assessment", "managed", "grew", "agency"],
    defaultPriority: 8,
  },
];

// ============================================================================
// Operations / BizOps / Chief of Staff
// ============================================================================

const OPERATIONS_BIZOPS: EngagementShape[] = [
  {
    name: "Embedded fractional COO or head of ops",
    scope: "Own the operating cadence, hiring plan, cross-functional systems",
    duration: "Ongoing, 3-6 month minimum",
    pricing: "$8,000-$15,000/month (8-12 hrs/week)",
    buyerTitle: "Founder or CEO at a 15-100 person company that has outgrown its early operating model",
    description: "The founder is the bottleneck on everything operational. You take it off their plate: planning cadence, hiring, vendor management, cross-functional accountability. They lead, you operate.",
    matchKeywords: ["operations", "systems", "hiring", "planning", "cross-functional", "workflows", "cadence", "standups", "scaling"],
    defaultPriority: 1,
  },
  {
    name: "Operating system install",
    scope: "Design and implement one specific system: OKRs, planning process, hiring workflow, or vendor stack",
    duration: "4-8 weeks",
    pricing: "$10,000-$20,000 project fee",
    buyerTitle: "Founder or COO at a company that just raised and is scaling the team fast",
    description: "They just raised, they're hiring, and nothing is documented. You install one critical system — the planning process, the OKR framework, the hiring workflow — and train the team to run it without you.",
    matchKeywords: ["planning", "okrs", "process", "sops", "reporting", "kpi", "frameworks", "onboarding"],
    defaultPriority: 2,
  },
  {
    name: "Ops audit and 90-day roadmap",
    scope: "Map current processes, identify bottlenecks, prioritize fixes, deliver an action plan",
    duration: "2-3 weeks",
    pricing: "$5,000-$10,000 project fee",
    buyerTitle: "Founder who knows things are falling through the cracks but doesn't know where to start",
    description: "Things are breaking but nobody can point to why. You map every operational process, find the 3 bottlenecks that matter most, and deliver a prioritized 90-day plan to fix them.",
    matchKeywords: ["process", "handoffs", "reporting", "systems", "vendors", "budget", "accountability"],
    defaultPriority: 3,
  },
  {
    name: "Senior ops advisor",
    scope: "Weekly 1:1s with founder, async planning reviews, hiring guidance",
    duration: "Ongoing, month-to-month",
    pricing: "$3,000-$6,000/month (2-4 hrs/week)",
    buyerTitle: "Founder who is acting as their own COO and needs a thought partner",
    description: "They're making every operational decision alone. You're the weekly strategic partner: planning reviews, hiring decisions, vendor negotiations, and the experienced perspective they don't have in-house.",
    matchKeywords: ["coached", "planning", "hiring", "strategy", "reviews", "team"],
    defaultPriority: 4,
  },
  {
    name: "Board prep and governance package",
    scope: "Build board reporting templates, install a monthly update cadence, prep materials for first 2-3 board meetings",
    duration: "2-4 weeks build + ongoing support",
    pricing: "$5,000-$8,000 build + $2,000-$4,000/month ongoing",
    buyerTitle: "Founder or Chief of Staff at a post-seed company with new board members and no reporting process",
    description: "They just took institutional money and now they have a board expecting professional updates. You build the reporting templates, install the monthly cadence, and prep them for their first few board meetings so they look like they've done this before.",
    matchKeywords: ["board", "reporting", "governance", "planning", "kpi", "cadence"],
    defaultPriority: 5,
  },
  {
    name: "Post-acquisition integration lead",
    scope: "Run the 90-day integration: org design, systems consolidation, culture integration, milestone tracking",
    duration: "3-4 months, 15-20 hrs/week",
    pricing: "$15,000-$25,000/month",
    buyerTitle: "CEO or COO at an acquiring company that just closed a deal and needs someone to run integration",
    description: "The deal closed and now they need someone to actually merge the two companies. You run the 90-day integration: org design, systems consolidation, culture work, and the milestone tracking that keeps the whole thing from falling apart.",
    matchKeywords: ["acquisition", "integration", "operations", "systems", "cross-functional", "scaling", "workflows"],
    defaultPriority: 6,
  },
  {
    name: "Fundraise operations prep",
    scope: "Build the data room, clean up financial ops, document key processes, prep for operational due diligence",
    duration: "3-4 weeks",
    pricing: "$8,000-$12,000 project fee",
    buyerTitle: "Founder or Chief of Staff at a company 2-3 months from raising that knows ops will get scrutinized",
    description: "Investors are going to ask how the company actually runs, and the answer right now is 'it depends who you ask.' You build the data room, document the key processes, clean up the financial operations, and make sure they can survive operational diligence.",
    matchKeywords: ["fundraise", "diligence", "data room", "process", "reporting", "sops", "planning"],
    defaultPriority: 7,
  },
];

// ============================================================================
// Finance / Analytics
// ============================================================================

const FINANCE_ANALYTICS: EngagementShape[] = [
  {
    name: "Embedded fractional CFO",
    scope: "Monthly close, board reporting, fundraise prep, financial strategy",
    duration: "Ongoing, 3-6 month minimum",
    pricing: "$8,000-$15,000/month (8-12 hrs/week)",
    buyerTitle: "Founder or CEO at a Series A startup without a senior finance leader",
    description: "They have a bookkeeper and a messy spreadsheet. You bring CFO-level thinking: clean financials, board-ready reporting, and the strategic perspective that gets them to the next round.",
    matchKeywords: ["financial", "models", "forecast", "board", "reporting", "budget", "close", "fundraising"],
    defaultPriority: 1,
  },
  {
    name: "Fundraise readiness package",
    scope: "Financial model, data room, deck financials, due diligence prep",
    duration: "4-8 weeks",
    pricing: "$10,000-$20,000 project fee",
    buyerTitle: "Founder preparing to raise their Series A or B",
    description: "They're 3 months from raising and the numbers aren't investor-ready. You build the model, prep the data room, tighten the deck financials, and make sure they can answer every question an investor throws at them.",
    matchKeywords: ["fundraising", "diligence", "models", "investors", "data", "deck", "equity", "term"],
    defaultPriority: 2,
  },
  {
    name: "Unit economics deep-dive",
    scope: "LTV/CAC analysis, cohort analysis, pricing model review, margin optimization",
    duration: "2-4 weeks",
    pricing: "$5,000-$12,000 project fee",
    buyerTitle: "Founder or Head of Growth at a company that doesn't understand its own economics",
    description: "They know revenue is growing but can't explain whether they're making money on each customer. You build the unit economics model, run the cohort analysis, and deliver pricing recommendations that improve margins.",
    matchKeywords: ["unit economics", "pricing", "models", "analysis", "data", "metrics", "pipelines"],
    defaultPriority: 3,
  },
  {
    name: "Senior finance advisor",
    scope: "Monthly close review, board prep, ad hoc modeling, weekly founder 1:1s",
    duration: "Ongoing, month-to-month",
    pricing: "$3,000-$6,000/month (2-4 hrs/week)",
    buyerTitle: "Founder who makes financial decisions by gut feel and knows that needs to change",
    description: "They need a CFO-level sounding board, not a full-time hire. Monthly close review, board prep, the modeling they can't do themselves, and the financial confidence that comes from having someone senior on call.",
    matchKeywords: ["coached", "board", "close", "modeling", "forecast", "compensation", "strategy"],
    defaultPriority: 4,
  },
  {
    name: "Pricing and packaging analysis",
    scope: "Competitive pricing audit, willingness-to-pay research, packaging recommendations, migration plan for existing customers",
    duration: "2-4 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "Founder or Head of Product at a company that hasn't touched pricing since launch and knows they're leaving money on the table",
    description: "Their pricing was set by vibes two years ago and they've never revisited it. You run the competitive audit, do the willingness-to-pay analysis, recommend a new packaging structure, and build the migration plan so existing customers don't revolt.",
    matchKeywords: ["pricing", "models", "analysis", "metrics", "unit economics", "revenue"],
    defaultPriority: 5,
  },
  {
    name: "PE/VC due diligence support",
    scope: "Financial model validation, quality of earnings prep, management presentation coaching, investor Q&A prep",
    duration: "4-8 weeks",
    pricing: "$12,000-$20,000/month",
    buyerTitle: "Founder, CFO, or PE operating partner going through a transaction that requires financial scrutiny",
    description: "A deal is in motion and the financial story needs to be airtight. You validate the model, prep the quality of earnings materials, coach the management team on their presentation, and make sure every investor question has a crisp answer.",
    matchKeywords: ["diligence", "pe", "vc", "investors", "models", "forecast", "board", "equity"],
    defaultPriority: 6,
  },
  {
    name: "FP&A buildout",
    scope: "Build the forecasting model, install budget-vs-actual reporting, create the variance analysis process",
    duration: "3-4 weeks build + ongoing maintenance",
    pricing: "$8,000-$15,000 build + $3,000-$5,000/month maintain",
    buyerTitle: "Founder or VP Finance at a company that has outgrown spreadsheet-based planning",
    description: "Their financial planning is a spreadsheet that one person understands. You build a real FP&A function: the forecasting model, the budget-vs-actual reporting, the variance analysis that catches problems before they become crises, and the cadence to keep it current.",
    matchKeywords: ["forecast", "budgeting", "variance", "models", "reporting", "close", "financial"],
    defaultPriority: 7,
  },
];

// ============================================================================
// Communications / PR
// ============================================================================

const CONTENT_EDITORIAL: EngagementShape[] = [
  {
    name: "Embedded fractional head of comms",
    scope: "External narrative, press relationships, executive thought leadership, crisis readiness",
    duration: "Ongoing, 3-6 month minimum",
    pricing: "$6,000-$12,000/month (6-10 hrs/week)",
    buyerTitle: "Founder or CEO at a Series A company without a senior comms leader",
    description: "Nobody is owning the company's external story. You build the narrative, manage press relationships, coach the CEO for media, and make sure the company sounds as good externally as it is internally.",
    matchKeywords: ["communications", "narrative", "press", "external", "brand", "editorial", "thought leadership", "coached"],
    defaultPriority: 1,
  },
  {
    name: "Launch or fundraise comms sprint",
    scope: "Press strategy, announcement copy, internal comms plan, media prep",
    duration: "3-5 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "Founder or Chief of Staff preparing for a launch, fundraise, or sensitive announcement",
    description: "A moment is coming — a raise, a launch, a leadership change — and nobody has a comms plan. You build the press strategy, write the copy, prep the CEO for media, and make sure it lands.",
    matchKeywords: ["launch", "narrative", "press", "crisis", "messaging", "voice"],
    defaultPriority: 2,
  },
  {
    name: "Executive comms coaching",
    scope: "Voice development, media training, ghostwriting on key pieces, speaking prep",
    duration: "Ongoing, typically 3-4 months",
    pricing: "$3,000-$5,000/month (2-3 hrs/week)",
    buyerTitle: "Founder or executive who needs to become a credible public voice",
    description: "They're being asked to keynote, do press, or build a LinkedIn presence and they're not natural at it. You develop their voice, prep them for media, ghostwrite their first few pieces, and build the muscle they can maintain alone.",
    matchKeywords: ["coached", "executives", "voice", "thought leadership", "social", "writing", "public"],
    defaultPriority: 3,
  },
  {
    name: "Executive thought leadership program",
    scope: "Content strategy, monthly bylines or LinkedIn posts, podcast/speaking pipeline, audience growth tracking",
    duration: "3 months minimum",
    pricing: "$4,000-$8,000/month",
    buyerTitle: "Founder or C-suite exec who wants to build a personal brand that drives business",
    description: "They know they should be writing and speaking but they never do. You build the content strategy, ghostwrite the monthly pieces, manage the podcast and speaking pipeline, and track audience growth so they can see the compounding effect.",
    matchKeywords: ["thought leadership", "writing", "social", "voice", "editorial", "public", "brand"],
    defaultPriority: 4,
  },
  {
    name: "Narrative and messaging overhaul",
    scope: "Audit current messaging across all channels, rebuild the narrative framework, rewrite key assets, create a messaging guide for the team",
    duration: "4-6 weeks",
    pricing: "$10,000-$20,000 project fee",
    buyerTitle: "CMO or founder at a company that sounds different in every channel and none of it is working",
    description: "The website says one thing, the sales deck says another, and the press kit says a third. You audit everything, rebuild the narrative from the ground up, rewrite the key assets, and create a messaging guide so the whole team tells the same story.",
    matchKeywords: ["narrative", "messaging", "voice", "brand", "editorial", "framework", "guidelines"],
    defaultPriority: 5,
  },
  {
    name: "Comms team assessment and agency management",
    scope: "Evaluate in-house team and agency performance, recommend restructure, manage agency transition if needed",
    duration: "2-4 weeks",
    pricing: "$5,000-$10,000 project fee",
    buyerTitle: "Founder or CMO who isn't sure whether the problem is the team, the agency, or both",
    description: "They're spending on PR and comms and nothing is landing. You assess the in-house team, evaluate the agency's performance, figure out whether it's a people problem or a strategy problem, and recommend a structure that actually works.",
    matchKeywords: ["team", "assessment", "agency", "managed", "press", "communications"],
    defaultPriority: 6,
  },
];

// ============================================================================
// Engineering
// ============================================================================

const ENGINEERING: EngagementShape[] = [
  {
    name: "Embedded fractional CTO or head of engineering",
    scope: "Architecture decisions, hiring, technical strategy, exec meetings",
    duration: "Ongoing, 3-6 month minimum",
    pricing: "$10,000-$18,000/month (8-12 hrs/week)",
    buyerTitle: "Founder or CEO at a Series A SaaS without a senior engineering leader",
    description: "The technical co-founder is drowning in code reviews and can't think strategically. You take the architectural decisions, hiring, and technical strategy off their plate so they can focus on building.",
    matchKeywords: ["architected", "systems", "team", "migration", "infrastructure", "hiring", "scaling", "reliability"],
    defaultPriority: 1,
  },
  {
    name: "Technical due diligence or architecture audit",
    scope: "Code review, architecture assessment, scalability analysis, security review, remediation plan",
    duration: "2-4 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "CTO, founder, or investor evaluating a technical asset",
    description: "An acquisition, investment, or scaling moment requires someone senior to assess the technical foundation. You audit code, architecture, infrastructure, and team, and deliver a clear remediation plan.",
    matchKeywords: ["architected", "systems", "migration", "infrastructure", "security", "reliability", "due diligence"],
    defaultPriority: 2,
  },
  {
    name: "Senior engineering advisor",
    scope: "Weekly 1:1s with technical founder, architecture reviews, hiring bar",
    duration: "Ongoing, month-to-month",
    pricing: "$4,000-$8,000/month (2-4 hrs/week)",
    buyerTitle: "Technical founder or first engineering manager who needs a senior sounding board",
    description: "They're making every architectural call alone. You're the weekly check-in: architecture reviews, hiring decisions, build-vs-buy calls, and the experienced perspective that keeps them from painting themselves into a corner.",
    matchKeywords: ["mentored", "coached", "engineers", "architecture", "hiring", "interviews", "ci/cd", "tooling"],
    defaultPriority: 3,
  },
  {
    name: "Engineering team assessment and hiring buildout",
    scope: "Assess current team structure and skills, define roles needed, build job descriptions, design the interview process and technical assessments",
    duration: "3-4 weeks",
    pricing: "$8,000-$15,000 project fee",
    buyerTitle: "Founder or CTO at a company that needs to scale the eng team and keeps making bad hires",
    description: "They've hired 3 engineers and 2 didn't work out. You assess the current team, define the roles they actually need, write job descriptions that attract the right people, design a technical interview process, and build the rubric so hiring quality goes up.",
    matchKeywords: ["team", "hiring", "engineers", "interviews", "scaling", "managed"],
    defaultPriority: 4,
  },
  {
    name: "DevOps and infrastructure overhaul",
    scope: "Audit current infrastructure, design CI/CD pipeline, implement monitoring and alerting, document runbooks",
    duration: "4-8 weeks",
    pricing: "$10,000-$20,000 project fee",
    buyerTitle: "CTO or VP Engineering at a company where deploys are scary and outages are frequent",
    description: "Deploys take all day and nobody sleeps well on release nights. You audit the infrastructure, design a proper CI/CD pipeline, implement monitoring and alerting, write the runbooks, and get them to a place where deploys are boring.",
    matchKeywords: ["devops", "ci/cd", "deploy", "infrastructure", "reliability", "migration", "systems", "scaling"],
    defaultPriority: 5,
  },
];

// ============================================================================
// Automation & Systems Builder — uses a mix of the above + specialized shapes
// ============================================================================

const AUTOMATION_SYSTEMS: EngagementShape[] = [
  {
    name: "Workflow automation build",
    scope: "Design and build 3-5 automated workflows that replace manual processes",
    duration: "3-6 weeks",
    pricing: "$5,000-$15,000 project fee",
    buyerTitle: "Founder or Head of Ops at a company drowning in manual work",
    description: "They have 3 people doing work that software could do. You map the workflows, build the automations (Zapier, Make, custom scripts), and hand over a system that runs itself.",
    matchKeywords: ["automation", "zapier", "workflow", "manual", "process", "tools", "systems", "integration"],
    defaultPriority: 1,
  },
  {
    name: "CRM setup or migration",
    scope: "Full CRM implementation: data model, integrations, workflows, reporting, team training",
    duration: "4-8 weeks",
    pricing: "$8,000-$20,000 project fee",
    buyerTitle: "RevOps lead or founder at a company whose CRM is a mess",
    description: "Their CRM is a spreadsheet masquerading as a database. You set up (or migrate) HubSpot/Salesforce, build the integrations, design the workflows, and train the team to use it for real.",
    matchKeywords: ["crm", "salesforce", "hubspot", "migration", "data", "reporting", "pipeline", "integration"],
    defaultPriority: 2,
  },
  {
    name: "Internal tools build",
    scope: "Build custom dashboards, admin tools, or internal apps that replace spreadsheet hacks",
    duration: "4-8 weeks",
    pricing: "$8,000-$25,000 project fee",
    buyerTitle: "Head of Product or technical founder at a company held together with spreadsheets",
    description: "Every team has their own spreadsheet and nobody trusts the numbers. You build the dashboard, admin tool, or internal app that becomes the single source of truth.",
    matchKeywords: ["tools", "dashboards", "internal", "reporting", "data", "analytics", "built", "designed"],
    defaultPriority: 3,
  },
  {
    name: "Systems retainer",
    scope: "Ongoing systems maintenance, new automation builds, optimization",
    duration: "Ongoing, month-to-month",
    pricing: "$3,000-$6,000/month (4-6 hrs/week)",
    buyerTitle: "Founder or ops lead who needs someone to keep the systems improving as the team grows",
    description: "The initial build is done but systems need ongoing care. You add new workflows, fix breakage, optimize what's slow, and keep the operational infrastructure evolving with the team.",
    matchKeywords: ["systems", "optimization", "maintenance", "workflows", "integration", "tools", "sops", "reporting"],
    defaultPriority: 4,
  },
  {
    name: "Client onboarding automation",
    scope: "Map the current onboarding process, design the automated flow, build it in their stack, test and hand off",
    duration: "2-4 weeks",
    pricing: "$4,000-$10,000 project fee",
    buyerTitle: "Founder or Head of CS at a service or SaaS company where onboarding new clients takes too long and drops the ball",
    description: "Every new client gets a slightly different onboarding experience because it's all manual. You map the process, design the automated flow, build it in their existing tools, and hand off a system where new clients get a consistent, professional experience without anyone chasing tasks.",
    matchKeywords: ["onboarding", "automation", "workflow", "process", "tools", "integration", "manual"],
    defaultPriority: 5,
  },
  {
    name: "Reporting and dashboard build",
    scope: "Define key metrics, build automated dashboards, connect data sources, train the team to use them",
    duration: "2-4 weeks",
    pricing: "$4,000-$12,000 project fee",
    buyerTitle: "Founder or ops lead at a company where nobody trusts the numbers because they come from 5 different spreadsheets",
    description: "They spend hours every week pulling numbers from different tools into a spreadsheet that's already wrong by the time it's done. You define the metrics that matter, connect the data sources, build the dashboards, and train the team so the numbers update themselves.",
    matchKeywords: ["reporting", "dashboard", "data", "analytics", "metrics", "tools", "integration"],
    defaultPriority: 6,
  },
  {
    name: "AI workflow integration",
    scope: "Identify high-ROI AI automation opportunities, build and deploy AI-assisted workflows, train the team",
    duration: "2-4 weeks",
    pricing: "$5,000-$12,000 project fee",
    buyerTitle: "Founder or ops lead who knows AI could help but doesn't know where to start or what's hype",
    description: "Everyone's talking about AI but nobody on the team has actually built anything with it. You audit their workflows for high-ROI automation opportunities, build the AI-assisted workflows (content generation, data extraction, classification), and train the team to maintain them.",
    matchKeywords: ["ai", "automation", "data", "extraction", "workflow", "tools", "process", "integration"],
    defaultPriority: 7,
  },
];

// ============================================================================
// Catalog lookup
// ============================================================================

const CATALOG: Record<string, EngagementShape[]> = {
  "product-pmm": PRODUCT_PMM,
  "marketing-brand": MARKETING_BRAND,
  "operations-bizops": OPERATIONS_BIZOPS,
  "finance-analytics": FINANCE_ANALYTICS,
  "content-editorial": CONTENT_EDITORIAL,
  engineering: ENGINEERING,
  // Automation uses its own specialized catalog
  "automation-systems": AUTOMATION_SYSTEMS,
  // Fallback aliases
  "enterprise-sales": MARKETING_BRAND, // sales consultants often price like marketing
  "recruiting-talent": OPERATIONS_BIZOPS,
  "design-ux": PRODUCT_PMM,
  general: PRODUCT_PMM,
};

/**
 * Get the engagement catalog for a role category.
 * Returns the researched engagement shapes with pricing and match keywords.
 */
export function getEngagementCatalog(roleCategory: string): EngagementShape[] {
  return CATALOG[roleCategory] || CATALOG.general;
}
