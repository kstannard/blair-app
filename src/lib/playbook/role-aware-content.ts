/**
 * Role-aware playbook content.
 *
 * The original pathContent.ts file had ONE hardcoded set of niche chips,
 * positioning examples, engagement types, buyer profiles, and outreach
 * templates per business path. That worked when each path had one obvious
 * functional archetype (e.g. Content Engine Operator = content marketers).
 *
 * It broke for "meta" paths like Fractional Operator and Automation &
 * Systems Builder, which can be taken by users from many functional
 * backgrounds: senior PMs, marketers, ops leaders, finance, comms, etc.
 * A senior PM going fractional should NOT see "build the operational
 * infrastructure" as her first positioning example.
 *
 * This module is a path × role lookup. Editors call
 * `getRoleAwareContent(pathSlug, profile)` and get back content tailored
 * to the user's detected role category, with a sensible "general"
 * fallback when role detection is ambiguous.
 *
 * Adding a new archetype to a path:
 * 1. Add a new entry to the relevant FRACTIONAL_OPERATOR / AUTOMATION_SYSTEMS_BUILDER
 *    record keyed by RoleCategory.
 * 2. The detectRoleCategory() function in prepopulation.ts decides which
 *    block a given user maps to.
 * 3. If a path doesn't have content for a given role, the "general" block
 *    is used as a fallback.
 */

import { detectRoleCategory, type ProfileInput } from "@/lib/prepopulation";
import type { RoleCategory } from "@/lib/prepopulation";

export interface EngagementType {
  title: string;
  description: string;
}

export interface RoleAwareContent {
  /**
   * Niche-exercise content. The default chips list is generic — real
   * pre-population happens via generateNicheChips() which is also
   * role-aware. These are fallback chips when prepopulation fails.
   */
  narrowingChips: string[];
  /** Step 2 of the niche exercise: things that energize this archetype. */
  whatLitYouUp: string[];
  /** Step 3: realistic engagement types and price ranges for this archetype. */
  whatCompaniesPay: EngagementType[];
  /** Three positioning-statement examples in the user's archetype voice. */
  positioningExamples: string[];
  /** Buyer profile defaults specific to this archetype. */
  buyerProfile: {
    suggestedTitle: string;
    suggestedCompanySize: string;
    suggestedTriggerEvent: string;
    suggestedBudgetAuthority: string;
  };
  /** Outreach template the user can adapt. */
  outreachTemplate: string;
}

// ============================================================================
// FRACTIONAL OPERATOR — path × role content
// ============================================================================

const FRACTIONAL_OPERATOR: Partial<Record<RoleCategory, RoleAwareContent>> = {
  // -------- Product Management / PMM --------
  "product-pmm": {
    narrowingChips: [
      "Owned the product roadmap for a scaling SaaS area",
      "Ran customer discovery and translated it into shipped features",
      "Coached and grew junior PMs on your team",
      "Worked directly with founders or execs on product strategy",
      "Shipped cross-team launches with engineering, design, and CS",
      "Defined and tracked the metrics your product was judged on",
      "Owned a P&L or north-star metric for a product area",
      "Built the roadmap process the rest of the team now uses",
    ],
    whatLitYouUp: [
      "Watching a founder make a sharper product call because of a doc you wrote",
      "Turning fuzzy customer pain into a roadmap the team can actually ship",
      "The moment a launch goes live and the metric you cared about moves",
      "Coaching a junior PM through a hard prioritization call",
    ],
    whatCompaniesPay: [
      {
        title: "Embedded fractional product lead ($6,000-$10,000/month)",
        description: "6-10 hrs/week as their senior product person. You own a product area, run discovery, coach their PMs, sit in on exec meetings.",
      },
      {
        title: "Product strategy sprint ($8,000-$15,000)",
        description: "Scoped 4-8 week engagement to deliver one specific outcome: a quarterly roadmap, a launch plan, a discovery program, a positioning rebuild.",
      },
      {
        title: "Senior product advisor ($3,000-$6,000/month)",
        description: "2-4 hrs/week of strategic input. Weekly 1:1s with the founder, async roadmap reviews, hiring help, no embedded execution.",
      },
      {
        title: "Interim head of product ($12,000-$18,000/month)",
        description: "Fill the senior product seat while they hire a full-time head of product. 15-20 hrs/week, 3-4 month commitment.",
      },
    ],
    positioningExamples: [
      "I help Series A B2B SaaS companies that need senior product leadership but can't commit to a full-time hire ship better roadmaps and coach their first PMs into the role.",
      "I help founder-led startups that have product-market fit but no senior product person turn customer feedback into a quarterly roadmap their team can actually execute.",
      "I help post-Series A SaaS teams that just promoted their first PMs build the discovery and prioritization habits that scale beyond the founder's gut.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder, CEO, or CTO at a Series A SaaS company that has product-market fit but no senior product hire yet",
      suggestedCompanySize: "15-50 employees, typically post-seed through Series B",
      suggestedTriggerEvent: "Just raised a round and the roadmap is drifting, the founder is still owning product full-time, a junior PM was promoted into a role they need senior coaching for, a launch is coming up and discovery hasn't been done",
      suggestedBudgetAuthority: "Founders and CEOs decide directly. CTOs often have budget for product hires when there's no head of product yet.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company or their move from a bigger company to where they are now.]\n\n" +
      "I'm starting to do fractional product work — embedding 6-10 hours a week with a Series A SaaS team that needs senior product help but isn't ready for a full-time head of product. You've seen how I think about roadmaps and discovery, and I'd love your honest take.\n\n" +
      "Got 15 minutes this week? Not a pitch, just a gut-check from someone who'd tell me if it's a bad idea — or who might know a founder who needs exactly this.",
  },

  // -------- Marketing / Brand --------
  "marketing-brand": {
    narrowingChips: [
      "Built a brand and demand engine from scratch at a Series A",
      "Ran the team that owned MQL → SQL → Closed-Won handoffs",
      "Launched a category narrative that the sales team actually used",
      "Hired and managed your first agency or freelance bench",
      "Owned a $1M+ marketing budget and the metrics tied to it",
      "Built the messaging framework the rest of the company now uses",
      "Ran a rebrand or repositioning project end to end",
      "Connected marketing motion to revenue in a way the CFO believed",
    ],
    whatLitYouUp: [
      "Watching a positioning shift land and seeing inbound conversations get warmer",
      "Building a launch that the sales team actually uses (and asks for more of)",
      "Turning a fuzzy founder vision into a clean category narrative",
      "Hiring a junior marketer and watching them grow into an owner",
    ],
    whatCompaniesPay: [
      {
        title: "Embedded fractional head of marketing ($8,000-$15,000/month)",
        description: "8-12 hrs/week running marketing for a company that needs senior strategy and has someone (or no one) executing.",
      },
      {
        title: "Brand or positioning sprint ($10,000-$20,000)",
        description: "Scoped 4-8 week engagement: rebrand, category narrative, messaging framework, or homepage rewrite delivered as a packaged project.",
      },
      {
        title: "Demand gen audit + roadmap ($5,000-$10,000)",
        description: "2-3 week assessment of their funnel, channels, and team. Deliverable: a 90-day plan they can execute themselves.",
      },
      {
        title: "Senior marketing advisor ($3,000-$6,000/month)",
        description: "2-4 hrs/week. Weekly 1:1s with the founder or in-house marketer, async campaign reviews, hiring help.",
      },
    ],
    positioningExamples: [
      "I help Series A B2B SaaS companies that have product-market fit but no senior marketing leader build a brand and demand engine that doesn't depend on the founder doing all the talking.",
      "I help founder-led startups whose marketing is one junior person and a Substack figure out what to actually build first, then build it.",
      "I help post-Series A teams that just hired a marketer they want to grow into a head of marketing role coach them through the first 90 days while owning the strategy.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder, CEO, or Head of Sales at a Series A SaaS company without a senior marketing leader",
      suggestedCompanySize: "15-75 employees, post-seed through Series B",
      suggestedTriggerEvent: "Just raised and need to scale demand, hired a marketer who needs senior coaching, sales team is asking for better materials, a launch is coming up, an acquisition or pivot needs a new narrative",
      suggestedBudgetAuthority: "Founders decide directly at this stage. Heads of Sales often have budget when marketing reports up through revenue.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company.]\n\n" +
      "I'm starting to do fractional marketing work — embedding 8-12 hours a week with a Series A team that needs senior marketing strategy but isn't ready for a full-time hire. You've seen how I think about brand and demand, and I'd love your honest take.\n\n" +
      "Got 15 minutes this week? Not a pitch, just a gut-check from someone who'd tell me if it's a bad idea — or who might know a founder who needs exactly this.",
  },

  // -------- Operations / BizOps / Chief of Staff --------
  "operations-bizops": {
    narrowingChips: [
      "Ran operations for a startup that went from 10 to 50 people",
      "Built the internal systems (hiring, onboarding, planning) nobody else wanted to own",
      "Managed cross-functional projects where the founder needed someone to just make it happen",
      "Fixed broken handoffs between teams that were causing slips",
      "Owned the operating rhythm — standups, planning cycles, OKRs, retros",
      "Designed the company-wide planning process from scratch",
      "Built reporting and KPI frameworks the leadership team uses weekly",
      "Hired and managed contractors, vendors, or first ops hires",
    ],
    whatLitYouUp: [
      "The moment a founder stops being the bottleneck because you built the system they needed",
      "Turning chaos into a process that runs without you hovering",
      "Being the person everyone trusts to actually get things done",
      "Watching a team go from 'everything's on fire' to 'we've got this'",
    ],
    whatCompaniesPay: [
      {
        title: "Embedded fractional COO or head of ops ($8,000-$15,000/month)",
        description: "8-12 hrs/week as the senior ops person. You own the operating cadence, the hiring plan, and the systems that keep things moving.",
      },
      {
        title: "Ops overhaul sprint ($10,000-$20,000)",
        description: "Scoped 4-8 week engagement to install one specific system: a planning process, an OKR system, a vendor consolidation, a hiring plan.",
      },
      {
        title: "Interim leadership ($12,000-$18,000/month)",
        description: "Fill a senior ops gap while they hire a full-time COO or head of ops. 15-20 hrs/week, 3-6 month commitment.",
      },
      {
        title: "Senior ops advisor ($3,000-$6,000/month)",
        description: "2-4 hrs/week. Weekly 1:1s with the founder, async planning reviews, hiring help, no embedded execution.",
      },
    ],
    positioningExamples: [
      "I help seed-to-Series-A startups that just hired past 15 people install the operating systems and rhythms the founder no longer has time to build.",
      "I help founder-led companies that know things are falling through the cracks but don't need a full-time COO yet.",
      "I help growing services businesses that are drowning in delivery get their project management, hiring, and internal processes running smoothly.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder, CEO, or COO at a 15-100 person company that has outgrown its early operating model",
      suggestedCompanySize: "15-100 employees, typically seed through Series B, plus services firms at similar scale",
      suggestedTriggerEvent: "Just raised a round and team is growing fast, key ops person left, founder realizes they're the bottleneck, things are falling through the cracks, preparing for next fundraise",
      suggestedBudgetAuthority: "Founders and CEOs decide directly. COOs usually have budget authority for operational hires and contractors.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company.]\n\n" +
      "I'm starting to do fractional ops work — embedding 8-12 hours a week with a Series A team that needs senior operating strategy but isn't ready for a full-time COO. You've seen how I work, and I'd love your honest take.\n\n" +
      "Got 15 minutes this week? Not a pitch, just a gut-check from someone who'd tell me if it's a bad idea — or who might know a founder who needs exactly this.",
  },

  // -------- Finance / Analytics --------
  "finance-analytics": {
    narrowingChips: [
      "Built financial models that founders used to raise their last round",
      "Ran monthly close and the board reporting package",
      "Owned the FP&A function from forecast to variance analysis",
      "Built unit economics analysis that changed pricing decisions",
      "Designed the equity and compensation framework the company still uses",
      "Led due diligence for an acquisition or strategic partnership",
      "Built the data pipelines that powered weekly KPI reviews",
      "Owned the relationship with the CPA, auditor, or fractional CFO before you",
    ],
    whatLitYouUp: [
      "Watching a founder walk into a board meeting confident because the numbers are clean",
      "Finding the unit economics insight that nobody else saw",
      "Turning a chaotic spreadsheet into a model the team actually trusts",
      "Helping a founder negotiate a term sheet from a position of clarity",
    ],
    whatCompaniesPay: [
      {
        title: "Embedded fractional CFO ($8,000-$15,000/month)",
        description: "8-12 hrs/week running finance for a company that needs senior numbers but isn't ready for a full-time CFO. Forecast, board reporting, fundraising prep.",
      },
      {
        title: "Fundraise readiness sprint ($10,000-$20,000)",
        description: "Scoped 4-8 week engagement to get a company ready to raise: model, deck financials, due diligence prep, data room.",
      },
      {
        title: "Senior finance advisor ($3,000-$6,000/month)",
        description: "2-4 hrs/week. Monthly close review, board prep, ad hoc modeling, weekly founder 1:1s.",
      },
      {
        title: "Interim CFO ($12,000-$20,000/month)",
        description: "Fill the CFO seat while they hire full-time. 15-20 hrs/week, 3-6 month commitment, often through a fundraise or transition.",
      },
    ],
    positioningExamples: [
      "I help Series A B2B startups that need a CFO-level perspective but can't justify a full-time hire build the financial discipline that gets them to their next round.",
      "I help founder-led companies whose finances are held together with QuickBooks and a scared CFO friend get clean books, real forecasts, and a board-ready monthly close.",
      "I help post-seed startups preparing to raise their Series A get the model, the data room, and the financial story tight before the first investor call.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder or CEO at a Series A or pre-Series A startup without a senior finance leader",
      suggestedCompanySize: "10-50 employees, typically post-seed through Series A",
      suggestedTriggerEvent: "Preparing to raise a round, monthly close is broken, board wants better reporting, just hired a controller who needs senior coaching, an audit is coming",
      suggestedBudgetAuthority: "Founders and CEOs decide directly at this stage.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company.]\n\n" +
      "I'm starting to do fractional CFO work — embedding 8-12 hours a week with a Series A team that needs CFO-level finance support but isn't ready for a full-time hire. You've seen how I work with numbers, and I'd love your honest take.\n\n" +
      "Got 15 minutes this week? Not a pitch, just a gut-check from someone who'd tell me if it's a bad idea — or who might know a founder who needs exactly this.",
  },

  // -------- Communications / PR / Brand storytelling --------
  "content-editorial": {
    narrowingChips: [
      "Led communications and PR through a major company moment",
      "Built executive thought leadership programs for senior stakeholders",
      "Owned the company's external narrative across press, social, and stage",
      "Crisis-managed a moment that could have gone badly and didn't",
      "Built brand and editorial systems that the rest of the team uses",
      "Wrote the messaging framework the sales team actually quotes",
      "Ran the agency relationship and got real work out of them",
      "Coached executives into being credible public voices",
    ],
    whatLitYouUp: [
      "Watching a founder land a press hit that actually moved the needle",
      "Turning a tangled story into a clean narrative that lands the first time",
      "Coaching a CEO into a media moment they were dreading and crushing it",
      "Building the editorial system that compounds — every piece makes the next one easier",
    ],
    whatCompaniesPay: [
      {
        title: "Embedded fractional head of comms ($6,000-$12,000/month)",
        description: "6-10 hrs/week running external comms, executive thought leadership, and media relationships for a company that needs senior comms but isn't ready for a full-time hire.",
      },
      {
        title: "Comms / narrative sprint ($8,000-$15,000)",
        description: "Scoped 4-6 week engagement: a launch, a fundraise announcement, a category-defining narrative, an executive thought-leadership program.",
      },
      {
        title: "Executive comms coaching ($3,000-$5,000/month)",
        description: "Weekly or bi-weekly sessions with the founder or executive. Voice, narrative, media prep, ghostwriting on key pieces.",
      },
      {
        title: "Crisis comms retainer ($5,000-$10,000/month)",
        description: "On-call senior comms support for a company in a sensitive moment. Press, board, employee, and customer comms.",
      },
    ],
    positioningExamples: [
      "I help Series A founders who need to tell a credible story to investors, customers, and their own team without hiring a full-time head of comms build the narrative and the discipline to land it.",
      "I help mission-driven startups whose external story isn't matching what they actually do build the messaging and editorial systems that make the public-facing work as good as the product.",
      "I help founder-led companies preparing for a launch or fundraise tighten the narrative and run the comms moment without scrambling.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder, CEO, or Chief of Staff at a Series A company without a senior comms leader",
      suggestedCompanySize: "15-100 employees, typically post-seed through Series B",
      suggestedTriggerEvent: "Preparing for a launch, fundraise, or major announcement; a sensitive moment that needs careful handling; the founder is being asked to be more public; a junior comms person needs senior coaching",
      suggestedBudgetAuthority: "Founders decide directly. Chief of Staff or Head of Marketing often have budget authority too.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company.]\n\n" +
      "I'm starting to do fractional comms work — embedding 6-10 hours a week with a Series A team that needs senior comms support around a launch, fundraise, or critical moment. You've seen how I think about narrative, and I'd love your honest take.\n\n" +
      "Got 15 minutes this week? Not a pitch, just a gut-check from someone who'd tell me if it's a bad idea — or who might know a founder who needs exactly this.",
  },

  // -------- Engineering / Technical --------
  "engineering": {
    narrowingChips: [
      "Architected systems that scaled to handle 10x traffic without falling over",
      "Led a team through a major technical migration without breaking customers",
      "Built the engineering hiring bar and interviewed for it consistently",
      "Designed the on-call and incident response practices the team still uses",
      "Owned a critical infrastructure area and got paged for it",
      "Mentored junior engineers into mid and senior roles",
      "Built CI/CD pipelines and dev tooling that made the whole team faster",
      "Made the architectural calls that traded off speed and scale correctly",
    ],
    whatLitYouUp: [
      "Watching a system you architected handle a 5x spike without anyone noticing",
      "Coaching a junior engineer through a hard architectural call",
      "Killing a piece of legacy that was slowing everyone down",
      "Reducing the team's deploy cycle from hours to minutes",
    ],
    whatCompaniesPay: [
      {
        title: "Embedded fractional CTO or head of engineering ($10,000-$18,000/month)",
        description: "8-12 hrs/week as the senior technical voice. Architecture decisions, hiring, technical strategy, exec meetings.",
      },
      {
        title: "Technical due diligence or audit ($8,000-$15,000)",
        description: "Scoped 2-4 week engagement: architecture review, security audit, scalability assessment, M&A diligence.",
      },
      {
        title: "Senior engineering advisor ($4,000-$8,000/month)",
        description: "2-4 hrs/week. Weekly 1:1s with the technical founder or first engineering hire, async architecture reviews, hiring help.",
      },
      {
        title: "Interim head of engineering ($12,000-$20,000/month)",
        description: "Fill the engineering leadership seat while they hire full-time. 15-20 hrs/week, 3-6 month commitment.",
      },
    ],
    positioningExamples: [
      "I help Series A B2B SaaS companies whose first technical hires are now leading teams build the engineering practices, hiring bar, and architectural discipline they need to scale to Series B.",
      "I help founder-led startups whose engineering is held together by the technical co-founder install the on-call, deploy, and code review practices that let the team ship without paging the founder.",
      "I help post-seed startups preparing for a funding round or technical due diligence get their architecture, security, and engineering processes ready for senior scrutiny.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder, CEO, or technical co-founder at a Series A SaaS company without a senior engineering leader",
      suggestedCompanySize: "10-50 employees, typically post-seed through Series A",
      suggestedTriggerEvent: "Just raised and the team is doubling, the technical co-founder is the bottleneck, an outage or incident exposed gaps, preparing for due diligence, a junior engineering manager needs senior coaching",
      suggestedBudgetAuthority: "Founders and technical co-founders decide directly. CTOs have budget authority for senior contractors.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company.]\n\n" +
      "I'm starting to do fractional technical leadership work — embedding 8-12 hours a week with a Series A team that needs senior engineering perspective but isn't ready for a full-time CTO or VP. You've seen how I think about systems, and I'd love your honest take.\n\n" +
      "Got 15 minutes this week? Not a pitch, just a gut-check from someone who'd tell me if it's a bad idea — or who might know a founder who needs exactly this.",
  },
};

// ============================================================================
// AUTOMATION & SYSTEMS BUILDER — path × role content
// ============================================================================

const AUTOMATION_SYSTEMS_BUILDER: Partial<Record<RoleCategory, RoleAwareContent>> = {
  // -------- Product Management / PMM --------
  "product-pmm": {
    narrowingChips: [
      "Built internal tools and dashboards your product team relied on daily",
      "Designed the workflow that turned customer feedback into shipped features",
      "Architected data systems that connected product, sales, and CS",
      "Built the operating cadence between product, design, and engineering",
      "Owned the analytics stack and what the team measured against",
      "Designed customer onboarding flows that improved activation",
      "Built the prioritization framework your team uses to decide what ships",
      "Replaced spreadsheet hacks with real internal tools that scaled",
    ],
    whatLitYouUp: [
      "Watching a workflow you designed save your team hours every week",
      "Killing the spreadsheet that everyone hated",
      "Building the dashboard that finally answers the question the founder kept asking",
      "Connecting two systems that were costing the team productive time",
    ],
    whatCompaniesPay: [
      {
        title: "Internal tools build ($8,000-$20,000)",
        description: "Scoped 4-8 week project: build a custom workflow, dashboard, or internal app that replaces spreadsheets and Slack threads. Modern AI-assisted tooling means delivery is faster than it used to be.",
      },
      {
        title: "Product ops audit + roadmap ($5,000-$10,000)",
        description: "2-3 week engagement to map a team's product, data, and analytics stack and recommend what to fix first.",
      },
      {
        title: "Embedded systems retainer ($4,000-$8,000/month)",
        description: "4-6 hrs/week as the person who keeps internal systems improving. Add new workflows, fix broken ones, ship small tools as needed.",
      },
      {
        title: "Customer onboarding redesign ($6,000-$15,000)",
        description: "Scoped engagement to redesign and rebuild the activation flow that turns signups into retained users.",
      },
    ],
    positioningExamples: [
      "I help Series A SaaS teams whose product ops is held together with spreadsheets and Slack threads design and build the internal tools and workflows that scale with them.",
      "I help product teams that have great engineers but no product ops person ship the dashboards, workflows, and internal tools the team needs to move faster.",
      "I help founder-led startups whose customer onboarding flow is a mess of manual steps and Zapier hacks redesign it into something that activates users without anyone touching it.",
    ],
    buyerProfile: {
      suggestedTitle: "Head of Product, founding PM, or technical founder at a SaaS company that has product-market fit but no product ops",
      suggestedCompanySize: "10-75 employees, typically seed through Series B",
      suggestedTriggerEvent: "Team is drowning in manual workflow, dashboards are stale, onboarding is broken, customer feedback isn't reaching the roadmap, or a new analytics tool was bought but never set up right",
      suggestedBudgetAuthority: "Heads of Product and founders decide directly. Engineering leads often have budget for tooling.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something specific about their company.]\n\n" +
      "I'm starting to do independent product systems work — building the dashboards, internal tools, and workflows that product teams need but never have time to build. You've seen how I think about this stuff.\n\n" +
      "Got 15 minutes this week? Just gut-checking before I go too far.",
  },
  // -------- Operations / Bizops (the original automation-systems-builder content) --------
  "operations-bizops": {
    narrowingChips: [
      "Built Zapier or Make automations that eliminated hours of manual work per week",
      "Set up CRMs (HubSpot, Salesforce) from scratch for growing teams",
      "Created reporting dashboards that replaced 10 spreadsheets with one source of truth",
      "Designed client onboarding workflows that ran on autopilot",
      "Connected tools together so data stopped living in silos",
      "Built internal SOPs that turned tribal knowledge into something repeatable",
      "Owned the company's data and reporting infrastructure",
      "Designed the operating cadence that the leadership team runs on",
    ],
    whatLitYouUp: [
      "Hearing 'we used to spend 5 hours a week on this and now it just happens'",
      "Building something elegant that removes friction people didn't even realize they had",
      "The satisfaction of a perfectly connected system where nothing falls through",
      "Watching someone's face when they see their first automated workflow run",
    ],
    whatCompaniesPay: [
      {
        title: "System build or migration ($5,000-$15,000)",
        description: "Scoped 2-6 week project: a workflow, integration, automation, CRM setup, or data pipeline.",
      },
      {
        title: "CRM setup and migration ($8,000-$20,000)",
        description: "Get the entire sales/ops stack running right: HubSpot or Salesforce, integrations, workflows, reporting, the works.",
      },
      {
        title: "Ongoing optimization retainer ($3,000-$6,000/month)",
        description: "4-6 hrs/week keeping systems humming, adding new ones, fixing breakage as the team grows.",
      },
      {
        title: "Audit + roadmap ($2,000-$5,000)",
        description: "1-2 week engagement: map their current stack, identify what to fix or automate first, deliver a 90-day plan.",
      },
    ],
    positioningExamples: [
      "I help service businesses that are drowning in manual work build the automations and systems that let them scale without hiring more people.",
      "I help SaaS companies whose data lives in 12 different tools connect everything into one system that the team actually uses.",
      "I help agencies that waste hours every week on client onboarding and reporting build the workflows that run on autopilot.",
    ],
    buyerProfile: {
      suggestedTitle: "Founder, Head of Ops, RevOps lead, or agency owner at a company that has outgrown spreadsheets",
      suggestedCompanySize: "5-100 employees, typically SMBs and startups that need real systems but can't afford a full RevOps team",
      suggestedTriggerEvent: "Team is drowning in manual work, just adopted a new tool but nobody's using it right, data is in 5 different systems with no integration, hired an ops person who doesn't know the tooling",
      suggestedBudgetAuthority: "Founders decide quickly. Ops leads usually have project budget for tooling and systems work.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope things are good! [Something specific about their company or stack.]\n\n" +
      "I'm starting to do independent systems and automation work — building the workflows, integrations, and operational infrastructure that let teams stop doing things manually. You know how I think about this stuff.\n\n" +
      "Got 15 minutes for a gut-check? Just testing whether this makes sense as an independent play.",
  },
  // -------- Engineering --------
  "engineering": {
    narrowingChips: [
      "Built internal tools that the rest of the company couldn't live without",
      "Architected data pipelines that powered the company's reporting",
      "Designed integration layers between enterprise systems",
      "Built CI/CD and dev infrastructure that made the team faster",
      "Owned the on-call and incident response practices",
      "Killed legacy code or systems that were slowing everyone down",
      "Built automation tooling that saved engineering hours every sprint",
      "Designed APIs that other teams used as the source of truth",
    ],
    whatLitYouUp: [
      "Watching an internal tool you built become indispensable to the team",
      "Replacing a slow manual process with one that just works",
      "Building the kind of infrastructure people only notice when it's broken",
      "Killing a piece of legacy that nobody else wanted to touch",
    ],
    whatCompaniesPay: [
      {
        title: "Internal tools build ($10,000-$25,000)",
        description: "Scoped 4-8 week project to build a custom tool, dashboard, or integration that replaces spreadsheets, scripts, or manual work.",
      },
      {
        title: "Data pipeline or integration build ($8,000-$20,000)",
        description: "Build the data infrastructure, ETL pipelines, or integration layer that the company has been hacking around.",
      },
      {
        title: "Senior engineering retainer ($4,000-$8,000/month)",
        description: "4-6 hrs/week as the senior technical voice on internal systems and tooling. Architecture reviews, code reviews, infrastructure decisions.",
      },
      {
        title: "Technical audit ($5,000-$12,000)",
        description: "2-4 week engagement to assess code, architecture, infrastructure, or security and deliver a remediation plan.",
      },
    ],
    positioningExamples: [
      "I help Series A SaaS teams whose internal tooling is held together with shell scripts and good luck build the data pipelines and internal tools the team needs to scale.",
      "I help engineering leaders inherit messy infrastructure and decide what to keep, what to rebuild, and what to kill.",
      "I help founder-led companies whose data lives in spreadsheets and Slack messages build the reporting and integration layer that makes their numbers trustworthy.",
    ],
    buyerProfile: {
      suggestedTitle: "CTO, Head of Engineering, or technical founder at a company that has outgrown its early infrastructure",
      suggestedCompanySize: "10-100 employees, typically post-seed through Series B",
      suggestedTriggerEvent: "Just raised and the team is growing, internal tooling is breaking, data isn't trustworthy, an outage exposed gaps, hired junior engineers who need senior infrastructure",
      suggestedBudgetAuthority: "CTOs and technical founders decide directly. Engineering leads have budget authority for senior contractors.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope things are good! [Something specific about their company or stack.]\n\n" +
      "I'm starting to do independent technical systems work — building internal tools, data infrastructure, and the kind of engineering systems that companies need but never prioritize. You know how I think about this stuff.\n\n" +
      "Got 15 minutes for a gut-check?",
  },
};

// ============================================================================
// Public API
// ============================================================================

const PATH_CONTENT_BY_ROLE: Record<string, Partial<Record<RoleCategory, RoleAwareContent>>> = {
  "fractional-operator": FRACTIONAL_OPERATOR,
  "automation-systems-builder": AUTOMATION_SYSTEMS_BUILDER,
};

/**
 * Get role-aware content for a (path, profile) combination.
 * Returns null if the path doesn't have role-aware content yet (the editor
 * should fall back to pathContent.ts in that case).
 */
export function getRoleAwareContent(pathSlug: string, profile: ProfileInput): RoleAwareContent | null {
  const pathBlock = PATH_CONTENT_BY_ROLE[pathSlug];
  if (!pathBlock) return null;

  const roleCategory = detectRoleCategory(profile);
  // Try the user's specific role first, then fall back to operations-bizops
  // (the most common archetype for these meta-paths), then any other entry.
  const direct = pathBlock[roleCategory];
  if (direct) return direct;

  const opsBlock = pathBlock["operations-bizops"];
  if (opsBlock) return opsBlock;

  // Last resort: return whichever block is defined for this path
  const firstAvailable = Object.values(pathBlock).find((b) => !!b);
  return firstAvailable || null;
}

/**
 * Build a ProfileInput from the RecommendationData blob that the task page
 * passes to editors. The shape is defined in /src/app/(app)/playbook/[taskSlug]/page.tsx
 * with `quizContext` and `userProfile` sub-objects.
 */
export function profileFromRecommendation(recommendationData: unknown): ProfileInput {
  if (!recommendationData || typeof recommendationData !== "object") return {};
  const r = recommendationData as {
    quizContext?: {
      role?: string | null;
      years?: string | null;
      industries?: string | null;
      shoulderTap?: string | null;
      weirdlyGood?: string | null;
    } | null;
    userProfile?: {
      traits?: string;
      strengths?: string;
      linkedinSummary?: string | null;
      notableExperience?: string | null;
    } | null;
  };
  const q = r.quizContext || {};
  const p = r.userProfile || {};
  return {
    role: q.role || undefined,
    years: q.years || undefined,
    industries: q.industries || undefined,
    shoulderTaps: q.shoulderTap || undefined,
    weirdlyGoodAt: q.weirdlyGood || undefined,
    linkedinSummary: p.linkedinSummary || undefined,
    notableExperience: p.notableExperience || undefined,
    strengths: p.strengths || undefined,
    traits: p.traits || undefined,
  };
}
