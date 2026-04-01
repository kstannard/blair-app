// Path-specific pre-fill content for Phase 1 tasks.
// Keyed by BusinessPath slug. Used to seed narrowing exercises,
// positioning templates, buyer profiles, and outreach templates
// with actionable, path-relevant defaults.

export interface NarrowingExercise {
  whatYouveDone: string;
  whatLitYouUp: string;
  whatCompaniesPay: string;
}

export interface BuyerProfile {
  suggestedTitle: string;
  suggestedCompanySize: string;
  suggestedTriggerEvent: string;
  suggestedBudgetAuthority: string;
}

export interface PathContentConfig {
  narrowingExercise: NarrowingExercise;
  positioningTemplate: string;
  buyerProfile: BuyerProfile;
  outreachTemplate: string;
}

export const pathContent: Record<string, PathContentConfig> = {
  "messaging-positioning": {
    narrowingExercise: {
      whatYouveDone:
        "- Brand strategy for B2B SaaS companies going through a rebrand\n" +
        "- Messaging overhauls for startups that raised Series A and needed to sound like it\n" +
        "- Website copy rewrites that turned confused value props into clear ones\n" +
        "- Sales narrative development for teams that couldn't explain what they sold\n" +
        "- Launch positioning for new products entering crowded markets",
      whatLitYouUp:
        "- The moment a founder reads their new one-liner and says 'that's exactly what we do'\n" +
        "- Watching a sales team close faster because the story finally made sense\n" +
        "- Turning a 45-minute ramble into a 10-second pitch that lands\n" +
        "- Seeing a website go from 'what do you guys even do?' to 'I need this'",
      whatCompaniesPay:
        "- Positioning packages ($5K-$12K) - full messaging overhaul with one-liner, website framework, sales narrative\n" +
        "- Brand audits ($1.5K-$3K) - what's broken, what's working, what to fix first\n" +
        "- Launch messaging ($3K-$8K) - positioning for a new product or market entry\n" +
        "- Sales enablement copy ($2K-$5K) - the deck, the email sequence, the talk track",
    },
    positioningTemplate:
      "I help [type of company] [achieve outcome] by [what you do].\n\n" +
      "Examples:\n" +
      "- I help B2B SaaS startups that just raised funding sound like the company they're becoming, not the one they were.\n" +
      "- I help service businesses explain what they do in one sentence so their website actually converts.\n" +
      "- I help founders who know their product is great but can't figure out why nobody's buying it.",
    buyerProfile: {
      suggestedTitle: "Founder, Head of Marketing, Agency Owner, VP of Brand",
      suggestedCompanySize: "10-200 employees (Series A-B or established SMBs)",
      suggestedTriggerEvent:
        "Just raised funding, launching new product, rebrand after a pivot, new CMO who inherited a mess, sales team complaining the pitch doesn't land",
      suggestedBudgetAuthority:
        "Direct budget authority or one conversation away from it. Founders decide on the spot. Marketing leads usually need a quick sign-off.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something you noticed about them - a launch, a rebrand, a post they wrote.]\n\n" +
      "I've been exploring the idea of doing some independent work around messaging and positioning - helping companies get sharper on what they are, who they're for, and how they talk about it.\n\n" +
      "Before I go too far down the road, I'd love to get your honest take on whether it makes sense. You've seen me work and you'd tell me the truth.\n\n" +
      "Would you have 15 minutes this week or next? No pitch, just a gut-check from someone whose opinion I trust.",
  },

  "gtm-growth-strategist": {
    narrowingExercise: {
      whatYouveDone:
        "- Built outbound sales motions from scratch for B2B startups\n" +
        "- Designed go-to-market strategies for companies entering new segments\n" +
        "- Fixed broken funnels where leads came in but deals didn't close\n" +
        "- Created ICP definitions and sales playbooks for scaling teams\n" +
        "- Ran pipeline reviews and diagnosed why conversion rates dropped at each stage",
      whatLitYouUp:
        "- Watching a founder go from 'we don't know how to sell this' to a repeatable process\n" +
        "- Building a pipeline from zero and seeing the first deals close\n" +
        "- Finding the one bottleneck in a funnel that unlocked 3x conversion\n" +
        "- The moment a sales team stops winging it and starts running a system",
      whatCompaniesPay:
        "- GTM Sprint ($10K-$18K) - full go-to-market build or overhaul, 4-8 weeks\n" +
        "- Revenue Audit ($5K-$8K) - diagnose what's broken in the sales motion with specific fixes\n" +
        "- Sales Playbook Build ($8K-$15K) - ICP, outbound sequences, talk tracks, objection handling\n" +
        "- Launch Strategy ($5K-$10K) - positioning, channel selection, first 90 days of pipeline",
    },
    positioningTemplate:
      "I help [type of company] [achieve outcome] by [what you do].\n\n" +
      "Examples:\n" +
      "- I help B2B startups that just raised Series A build their first repeatable sales motion so they stop relying on founder-led sales.\n" +
      "- I help SaaS companies moving upmarket from SMB to enterprise build the outbound playbook that actually gets meetings.\n" +
      "- I help revenue teams figure out why deals are stalling and fix the process so pipeline converts.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, VP Sales, Head of Revenue, CRO",
      suggestedCompanySize: "20-500 employees (Series A-C, scaling revenue teams)",
      suggestedTriggerEvent:
        "Just raised a round and need to show growth, new VP Sales who inherited a broken process, moving upmarket, first enterprise deal, sales team growing but win rate dropping",
      suggestedBudgetAuthority:
        "Founders have direct authority. Revenue leaders usually have discretionary budget for projects under $20K. Larger deals need CEO sign-off.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope things are going well! [Reference something specific - their latest round, a new hire, a product launch.]\n\n" +
      "I've been exploring doing some independent GTM advisory work - helping companies build or fix their go-to-market motion. Sales process, pipeline architecture, outbound strategy, that kind of thing.\n\n" +
      "You've watched me do this inside companies and I'd trust your gut on whether it makes sense as an independent play. Would you have 15 minutes for a quick gut-check? No agenda, just your honest take.",
  },

  "fractional-operator": {
    narrowingExercise: {
      whatYouveDone:
        "- Ran operations for a startup that went from 10 to 50 people\n" +
        "- Built the internal systems (hiring, onboarding, planning) that nobody else wanted to own\n" +
        "- Managed cross-functional projects where the CEO needed someone to just make it happen\n" +
        "- Fixed broken handoffs between teams that were causing everything to slip\n" +
        "- Owned the operating rhythm - standups, planning cycles, OKRs, retros",
      whatLitYouUp:
        "- The moment a founder stops being the bottleneck because you built the system they needed\n" +
        "- Turning chaos into a process that runs without you hovering\n" +
        "- Being the person everyone trusts to actually get things done\n" +
        "- Watching a team go from 'everything's on fire' to 'we've got this'",
      whatCompaniesPay:
        "- Fractional retainer ($5K-$10K/month) - 15-25 hrs/month as their part-time ops leader\n" +
        "- Ops overhaul sprint ($8K-$15K) - scoped 4-8 week engagement to fix a specific system\n" +
        "- Interim leadership ($10K-$15K/month) - fill a gap while they hire a full-time leader\n" +
        "- Systems setup ($3K-$8K) - build the operating infrastructure from scratch",
    },
    positioningTemplate:
      "I help [type of company] [achieve outcome] by [what you do].\n\n" +
      "Examples:\n" +
      "- I help seed-stage startups that just hired past 15 people build the operational infrastructure so the founders can focus on product and customers.\n" +
      "- I help growing agencies that are drowning in delivery get their project management, hiring, and internal processes running smoothly.\n" +
      "- I help founder-led companies that know things are falling through the cracks but don't need a full-time COO yet.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, COO, Head of Ops, Chief of Staff",
      suggestedCompanySize: "15-100 employees (seed to Series B, or agencies/services firms at similar scale)",
      suggestedTriggerEvent:
        "Just raised a round and team is growing fast, key ops person left, founder realizes they're the bottleneck, things are falling through the cracks, preparing for next fundraise",
      suggestedBudgetAuthority:
        "Founders and CEOs decide directly. COOs usually have budget authority for operational hires and contractors.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something personal - a milestone, a post, something you noticed about their company.]\n\n" +
      "I've been thinking about doing fractional ops work - embedding with 1-2 companies part-time to run the systems, processes, and execution that keep things moving. You've seen how I operate and I'd love your honest take.\n\n" +
      "Would you have 15 minutes this week? Not a pitch - just want to gut-check the idea with someone who'd tell me if it's a bad one.",
  },

  "automation-systems-builder": {
    narrowingExercise: {
      whatYouveDone:
        "- Built Zapier/Make automations that eliminated hours of manual work per week\n" +
        "- Set up CRMs (HubSpot, Salesforce) from scratch for growing teams\n" +
        "- Created reporting dashboards that replaced 10 spreadsheets with one source of truth\n" +
        "- Designed client onboarding workflows that ran on autopilot\n" +
        "- Connected tools together so data stopped living in silos",
      whatLitYouUp:
        "- Hearing 'we used to spend 5 hours a week on this and now it just happens'\n" +
        "- Building something elegant that removes friction people didn't even realize they had\n" +
        "- The satisfaction of a perfectly connected system where nothing falls through\n" +
        "- Watching someone's face when they see their first automated workflow run",
      whatCompaniesPay:
        "- System build ($3K-$8K) - scoped automation or workflow project, 2-4 weeks\n" +
        "- CRM setup and migration ($5K-$12K) - get the whole sales/ops stack running right\n" +
        "- Ongoing optimization retainer ($2K-$5K/month) - keep systems humming, add new ones\n" +
        "- Audit + roadmap ($1.5K-$3K) - map their current stack, identify what to automate first",
    },
    positioningTemplate:
      "I help [type of company] [achieve outcome] by [what you do].\n\n" +
      "Examples:\n" +
      "- I help service businesses that are drowning in manual work build the automations that let them scale without hiring.\n" +
      "- I help SaaS companies whose data lives in 12 different tools connect everything into one system that actually works.\n" +
      "- I help agencies that waste hours on client onboarding and reporting build workflows that run on autopilot.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, Head of Ops, RevOps Lead, Agency Owner",
      suggestedCompanySize: "5-100 employees (SMBs and startups that have outgrown spreadsheets)",
      suggestedTriggerEvent:
        "Team is drowning in manual work, just adopted a new CRM but nobody's using it right, data is in 5 different tools with no integration, hired an ops person who doesn't know the tooling",
      suggestedBudgetAuthority:
        "Founders decide quickly. Ops leads usually have project budget for tooling and systems work.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope things are good! [Something specific - a recent hire, a growth milestone, something about their stack.]\n\n" +
      "I've been exploring doing independent systems and automation work - building the workflows, integrations, and operational infrastructure that let teams stop doing things manually. You know how I think about this stuff.\n\n" +
      "Would you have 15 minutes for a gut-check? I'm just testing whether this makes sense as an independent play before I go too far.",
  },

  "content-engine-operator": {
    narrowingExercise: {
      whatYouveDone:
        "- Ran content programs for brands across LinkedIn, newsletters, and podcasts\n" +
        "- Turned founder expertise into a consistent publishing cadence that built an audience\n" +
        "- Built content production pipelines - from ideation to publishing to repurposing\n" +
        "- Ghostwritten thought leadership for executives who had great ideas but no time to write\n" +
        "- Created content strategies that actually tied to pipeline and revenue",
      whatLitYouUp:
        "- Watching a founder go from invisible to a recognized voice in their space\n" +
        "- Building a content system that compounds - every piece makes the next one easier\n" +
        "- The creative challenge of turning a 30-minute conversation into a month of content\n" +
        "- Seeing a newsletter grow from 200 to 5,000 subscribers because the content was genuinely good",
      whatCompaniesPay:
        "- Content retainer ($3K-$8K/month) - ongoing production across channels, volume-dependent\n" +
        "- Content strategy sprint ($5K-$10K) - one-time strategy build + first month of execution\n" +
        "- Ghostwriting retainer ($2K-$5K/month) - LinkedIn and/or newsletter for a founder\n" +
        "- Podcast production ($3K-$6K/month) - end-to-end production, show notes, repurposing",
    },
    positioningTemplate:
      "I help [type of company/person] [achieve outcome] by [what you do].\n\n" +
      "Examples:\n" +
      "- I help B2B founders who know they should be posting but never do build a content engine that runs every week without them writing a word.\n" +
      "- I help consulting firms turn their expertise into LinkedIn and newsletter content that generates inbound leads.\n" +
      "- I help coaches and course creators who are great on camera but terrible at distribution build a system that turns one recording into a week of content.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, Head of Marketing, Personal Brand (solo operator), Agency Owner",
      suggestedCompanySize: "1-50 employees (founders, solo operators, small marketing teams)",
      suggestedTriggerEvent:
        "Know they need to be visible but keep putting it off, tried posting and it didn't stick, hired a freelancer who didn't capture their voice, competitor is everywhere on LinkedIn and they're not",
      suggestedBudgetAuthority:
        "Founders decide immediately. Marketing leads usually have discretionary budget for content. Personal brand clients are paying out of pocket - they're investing in themselves.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're well! [Something specific - a post they wrote, a podcast episode, something about their brand.]\n\n" +
      "I've been exploring the idea of running content engines for founders and brands - owning the strategy, production, and distribution so they can be visible without it eating their whole calendar.\n\n" +
      "You've seen how I think about content and I'd love your take on whether this makes sense. Would you have 15 minutes for a quick gut-check? Just want to hear your honest reaction.",
  },

  "lead-gen-operator": {
    narrowingExercise: {
      whatYouveDone:
        "- Built and managed paid ad campaigns (Meta, Google, LinkedIn) driving qualified leads\n" +
        "- Created landing pages and funnels that converted cold traffic to booked calls\n" +
        "- Set up email nurture sequences that warmed leads from click to close\n" +
        "- Optimized ad spend and conversion rates across the full funnel\n" +
        "- Built outbound systems (cold email, LinkedIn outreach) that generated pipeline consistently",
      whatLitYouUp:
        "- Seeing the dashboard light up with qualified leads from a campaign you built\n" +
        "- The puzzle of figuring out why a funnel isn't converting and fixing the one thing that unlocks it\n" +
        "- Building a lead gen system that runs predictably - same input, same output, every month\n" +
        "- Helping a business go from 'we don't know where our next client is coming from' to a full pipeline",
      whatCompaniesPay:
        "- Monthly management ($3K-$7K/month + ad spend) - run the whole lead gen operation\n" +
        "- Launch package ($5K-$10K) - build the funnel from scratch, then transition to monthly\n" +
        "- Conversion optimization ($2K-$5K) - audit existing funnel and fix what's leaking\n" +
        "- Outbound system build ($3K-$6K) - email sequences, LinkedIn plays, targeting, tech stack",
    },
    positioningTemplate:
      "I help [type of company] [achieve outcome] by [what you do].\n\n" +
      "Examples:\n" +
      "- I help B2B service companies that rely on referrals build a paid lead gen system that fills their pipeline without them networking 24/7.\n" +
      "- I help e-commerce brands that are burning ad spend without results fix their funnel so every dollar works harder.\n" +
      "- I help coaches and consultants who are great at closing but terrible at filling the top of funnel build a machine that books 10+ calls a week.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, Head of Growth, VP Marketing, Agency Owner",
      suggestedCompanySize: "5-200 employees (companies ready to invest in paid acquisition or outbound)",
      suggestedTriggerEvent:
        "Pipeline is drying up, referrals aren't scaling, tried running ads themselves and burned money, hired an agency that didn't deliver, sales team is idle because there aren't enough leads",
      suggestedBudgetAuthority:
        "Founders decide fast when pipeline is the problem. Marketing and growth leads usually own the ad budget and can add contractor spend.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're well! [Reference something about their business - growth, a new offer, a market shift.]\n\n" +
      "I've been exploring doing independent lead gen work - building and running the paid and outbound systems that keep pipelines full. Ads, funnels, email sequences, the whole machine.\n\n" +
      "You've seen how I think about this stuff and I'd trust your gut on whether it makes sense as an independent play. Got 15 minutes this week? Just a gut-check, not a pitch.",
  },

  "studio-builder": {
    narrowingExercise: {
      whatYouveDone:
        "- Delivered the same type of project 5+ times and started seeing the pattern\n" +
        "- Built repeatable processes, templates, or frameworks you use with every client\n" +
        "- Created SOPs or playbooks that made delivery predictable\n" +
        "- Noticed you keep solving the same problem for different companies\n" +
        "- Developed proprietary methods or frameworks that get results consistently",
      whatLitYouUp:
        "- The idea of doing the same great thing over and over instead of reinventing the wheel\n" +
        "- Building something you can sell while you sleep (templates, kits, digital products)\n" +
        "- Having clear boundaries - same scope, same timeline, same price, no scope creep\n" +
        "- The leverage of turning your expertise into a product, not just a service",
      whatCompaniesPay:
        "- Productized package ($5K-$15K per engagement) - fixed scope, fixed price, fixed timeline\n" +
        "- DIY kit or template ($500-$2K) - passive revenue from packaging your process\n" +
        "- Premium workshop ($3K-$8K) - teach your framework to a team in a half-day or full-day session\n" +
        "- Cohort program ($2K-$5K per seat) - teach 10-20 people your process at once",
    },
    positioningTemplate:
      "I help [type of company/person] [achieve outcome] through [your productized offering].\n\n" +
      "Examples:\n" +
      "- I help early-stage SaaS companies nail their positioning in 2 weeks through The Brand Sprint - same process, same deliverables, $8K flat.\n" +
      "- I help agencies build their ops infrastructure in 30 days through The Ops-in-a-Box package - everything from project management to hiring workflows.\n" +
      "- I help consultants package their expertise into a digital product through The Productize Sprint - from custom work to scalable offer in 6 weeks.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, Agency Owner, Consultant, Department Head",
      suggestedCompanySize: "1-100 employees (anyone willing to pay for a proven process vs. custom work)",
      suggestedTriggerEvent:
        "Tried DIY and it didn't work, need it done but don't have time to manage a custom project, want a guaranteed outcome, saw someone else use your package and got results",
      suggestedBudgetAuthority:
        "Productized pricing makes buying easier - there's nothing to negotiate. Founders buy on the spot. Department leads can usually approve fixed-price projects under $15K without a procurement process.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope things are going well! [Something personal or professional you noticed.]\n\n" +
      "I've been working on packaging something I've done dozens of times into a repeatable offering - same process, same deliverables, same price. Think of it like a productized version of [what you do].\n\n" +
      "You've seen me do this work and I'd love your take on whether the packaged version makes sense. Got 15 minutes? Just want to gut-check the concept with someone who knows the space.",
  },

  "niche-talent-placement": {
    narrowingExercise: {
      whatYouveDone:
        "- Hired or helped hire specialized talent that most companies couldn't find on their own\n" +
        "- Built a network of high-performers in a specific function or industry\n" +
        "- Knew exactly what 'great' looked like in a role because you'd done it yourself\n" +
        "- Connected people in your network with opportunities - informally at first\n" +
        "- Evaluated candidates and could spot the difference between good-on-paper and actually great",
      whatLitYouUp:
        "- Making the perfect match - the right person at the right company at the right time\n" +
        "- The moment both sides realize you found them exactly what they needed\n" +
        "- Using your network and taste to solve a problem that job boards can't\n" +
        "- Getting paid for something you're already doing informally - connecting great people",
      whatCompaniesPay:
        "- Placement fee (15-20% of first-year salary) - typically $25K-$50K per placement\n" +
        "- Retained search ($10K-$20K upfront + success fee) - for senior or hard-to-fill roles\n" +
        "- Talent advisory ($3K-$5K/month) - ongoing pipeline building and hiring strategy\n" +
        "- Hiring sprint ($5K-$10K) - fill a specific role within 30-60 days",
    },
    positioningTemplate:
      "I help [type of company] find [type of talent] by [how you do it differently].\n\n" +
      "Examples:\n" +
      "- I help B2B SaaS companies find senior sales leaders who've actually built pipeline at scale - not just managed it.\n" +
      "- I help fintech startups hire their first 5 engineers by tapping the network I built over a decade in the space.\n" +
      "- I help agencies find senior strategists and account directors who won't need 6 months to ramp because they've done the exact job before.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, VP People, Head of Talent, Hiring Manager",
      suggestedCompanySize: "20-500 employees (companies growing fast enough to need specialized talent but not big enough to have a full recruiting team)",
      suggestedTriggerEvent:
        "Key role open for 3+ months, bad hire they need to replace, scaling a team quickly after raising, moving into a new market and need domain expertise, internal recruiting isn't finding the right caliber",
      suggestedBudgetAuthority:
        "Founders and VPs of People have direct authority. Hiring managers can usually push for external recruiter budget when internal efforts have failed.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Reference something about their growth, a role you saw them post, a team update.]\n\n" +
      "I've been thinking about doing specialized placement work - connecting companies with the kind of talent that doesn't show up on job boards. I've got a pretty deep network in [your niche] and I know what great looks like because I've done the work.\n\n" +
      "Would love your take on whether this makes sense. Got 15 minutes this week? Just a gut-check from someone I trust.",
  },

  "investor-operator": {
    narrowingExercise: {
      whatYouveDone:
        "- Advised or mentored early-stage founders on strategy, ops, or go-to-market\n" +
        "- Made angel investments (or seriously considered it) based on your operating experience\n" +
        "- Sat on boards or in advisory roles where you shaped company direction without running day-to-day\n" +
        "- Built companies or functions from scratch and understand what early-stage actually takes\n" +
        "- Opened doors for companies through your network - intros to customers, partners, investors",
      whatLitYouUp:
        "- Seeing a company you advised avoid the mistake you made 10 years ago\n" +
        "- The leverage of helping 5 companies instead of running 1\n" +
        "- Being in the room where strategy happens without owning the execution\n" +
        "- Building a portfolio of companies you believe in and watching them grow",
      whatCompaniesPay:
        "- Advisory fee ($2K-$5K/month) + equity (0.5-2%) - ongoing strategic guidance\n" +
        "- Angel investment ($25K-$100K per deal) - capital plus board/advisory seat\n" +
        "- Board seat ($5K-$10K/quarter) - governance and strategic oversight\n" +
        "- Fractional executive advisory ($3K-$8K/month) - deeper involvement for a defined period",
    },
    positioningTemplate:
      "I invest in and advise [type of company] by bringing [your operational expertise].\n\n" +
      "Examples:\n" +
      "- I invest in and advise early-stage B2B SaaS companies by bringing 15 years of go-to-market and sales leadership to the table.\n" +
      "- I advise seed-stage consumer companies on operations and growth strategy, backed by my track record scaling ops at [company].\n" +
      "- I invest in and sit on boards of companies in [industry] where my network and operating experience can accelerate their path to revenue.",
    buyerProfile: {
      suggestedTitle: "Founder/CEO, existing investors (who refer you)",
      suggestedCompanySize: "2-30 employees (pre-seed to Series A, where your expertise is highest leverage)",
      suggestedTriggerEvent:
        "Just raised a round and need operational advisors, struggling with a function you've mastered, existing investor thinks they need operational help on the cap table, building a board and want operator perspective",
      suggestedBudgetAuthority:
        "Founders have direct authority on advisory agreements. For angel investments, you're the buyer - your deal criteria and check size determine the terms.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're well! [Something about their company, a recent milestone, or something they posted.]\n\n" +
      "I've been building out my advisory and angel investing practice - working with early-stage companies where my operating experience in [your domain] can actually move the needle. Not trying to be a VC. More like a hands-on advisor who also writes checks.\n\n" +
      "I'd love your perspective on this. You know the ecosystem and you'd tell me if I'm thinking about it wrong. Got 15 minutes this week?",
  },

  "digital-product-builder": {
    narrowingExercise: {
      whatYouveDone:
        "- Built frameworks, processes, or playbooks that your team used over and over\n" +
        "- Created training materials, onboarding docs, or internal tools people actually used\n" +
        "- Solved the same problem for multiple teams, clients, or companies\n" +
        "- Built spreadsheets, templates, or Notion systems that became the standard\n" +
        "- Taught or mentored others on something you know deeply",
      whatLitYouUp:
        "- Watching someone use a framework you built and get the result without needing you\n" +
        "- The idea of making money while you sleep (or at pickup)\n" +
        "- Turning years of hard-won knowledge into something people can buy and use on their own\n" +
        "- Building something once and selling it 1,000 times instead of doing it 1,000 times",
      whatCompaniesPay:
        "- Online course ($200-$2,000) - structured learning with templates and frameworks\n" +
        "- Template library or toolkit ($50-$500) - plug-and-play resources for a specific role\n" +
        "- Cohort program ($500-$5,000) - time-boxed group learning with accountability\n" +
        "- Certification or training ($1,000-$10,000) - companies buy for their teams",
    },
    positioningTemplate:
      "I help [type of person] [achieve outcome] through [type of product].\n\n" +
      "Examples:\n" +
      "- I help first-time managers at tech companies lead better 1:1s and build high-performing teams through a self-paced course and toolkit.\n" +
      "- I help early-stage founders build their go-to-market playbook through a step-by-step template system.\n" +
      "- I help ops leaders at growing companies systematize their onboarding through a certification program their whole team can use.",
    buyerProfile: {
      suggestedTitle: "Individual buyers (professionals investing in themselves) or L&D / team leads buying for their teams",
      suggestedCompanySize: "Individual buyers at all company sizes, or team purchases at 50-500 employee companies",
      suggestedTriggerEvent:
        "New role and need to ramp fast, team scaling and needs shared frameworks, company growing faster than their systems, someone Googling the exact problem your product solves",
      suggestedBudgetAuthority:
        "Individual buyers: immediate (credit card purchase). Team buyers: L&D budget or manager discretionary spend, usually under $5K without procurement.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're well! [Something you noticed about their work or role.]\n\n" +
      "I've been building something and wanted your gut reaction. You know how [specific problem you solve]? I'm turning [years] of doing that into a [course / toolkit / template system] so people can get the result without hiring someone like me.\n\n" +
      "Would love 15 minutes to show you what I've got and get your honest take. You'd be doing me a favor.",
  },

  "community-membership-operator": {
    narrowingExercise: {
      whatYouveDone:
        "- Connected people in your network who ended up doing business together\n" +
        "- Organized dinners, groups, or informal communities around professional topics\n" +
        "- Been the person people come to when they need an intro or recommendation\n" +
        "- Built or led internal communities (ERGs, guilds, Slack channels) that people valued\n" +
        "- Curated knowledge, resources, or conversations that helped your peers",
      whatLitYouUp:
        "- Watching two people you introduced end up working together\n" +
        "- Being the connective tissue between smart people in your space\n" +
        "- Running a room where real conversations happen (not performative networking)\n" +
        "- The idea of recurring revenue from people who genuinely want to be in the room",
      whatCompaniesPay:
        "- Paid Slack/Discord community ($50-$200/month per member) - curated peer group with real conversation\n" +
        "- Membership with events ($100-$500/month) - monthly dinners, roundtables, or mastermind sessions\n" +
        "- Executive peer group ($500-$2,000/month) - high-touch, small group, deep trust\n" +
        "- Sponsored community (brand partnerships) - companies pay to be in front of your members",
    },
    positioningTemplate:
      "I run a [type of community] for [type of people] who [shared challenge or goal].\n\n" +
      "Examples:\n" +
      "- I run a private peer group for Heads of Product at Series A-B companies who want a real sounding board, not LinkedIn noise.\n" +
      "- I curate a membership for women in revenue leadership who want access to the conversations, connections, and playbooks that used to only happen behind closed doors.\n" +
      "- I run monthly dinners for startup operators in [city] who want to learn from people doing the same job at different companies.",
    buyerProfile: {
      suggestedTitle: "Individual professionals (members), or companies sponsoring access for employees",
      suggestedCompanySize: "Members are typically mid-to-senior professionals at 50-5,000 person companies. Sponsors are brands selling to your member profile.",
      suggestedTriggerEvent:
        "Feeling isolated in their role, new to a senior position, looking for peer benchmarking, company encouraging professional development, tired of generic networking events",
      suggestedBudgetAuthority:
        "Individual members: personal or professional development budget. Sponsors: marketing/brand budget. Most community memberships under $500/month are personal spend decisions.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're doing well! [Something about their work or a conversation you had.]\n\n" +
      "I'm putting together a small group of [type of professionals] for [regular cadence: monthly dinners / a private Slack / peer roundtables]. The idea is a room where people in [role/function] can talk honestly about [the real challenges] without it being a sales pitch or a generic happy hour.\n\n" +
      "You're exactly who I'd want in the room. Would you be interested? Happy to share more details.",
  },

  "micro-saas-builder": {
    narrowingExercise: {
      whatYouveDone:
        "- Built internal tools, automations, or dashboards that your team relied on daily\n" +
        "- Identified workflow problems that existing software didn't solve well\n" +
        "- Created spreadsheet systems or no-code tools that became mission-critical\n" +
        "- Managed or worked closely with engineering teams and understand how software gets built\n" +
        "- Spotted inefficiencies that cost companies time and money every week",
      whatLitYouUp:
        "- Seeing a tool you built save someone hours of work every week\n" +
        "- The idea of building once and charging monthly, forever\n" +
        "- Solving a specific, annoying problem that millions of people deal with\n" +
        "- Owning a product, not renting out your time",
      whatCompaniesPay:
        "- Micro-SaaS tool ($20-$200/month per user) - solves one specific workflow problem well\n" +
        "- AI-powered tool ($50-$500/month) - automates a task that currently takes hours\n" +
        "- Niche vertical software ($100-$1,000/month) - purpose-built for a specific industry or role\n" +
        "- Marketplace or directory ($10-$50/month) - connects buyers and sellers in a niche",
    },
    positioningTemplate:
      "I build [type of tool] that helps [type of user] [solve specific problem].\n\n" +
      "Examples:\n" +
      "- I built a tool that helps RevOps teams automate their comp plan calculations in 10 minutes instead of 3 hours.\n" +
      "- I built an AI-powered tool that turns customer support tickets into categorized product feedback automatically.\n" +
      "- I built a niche CRM for independent recruiters who need something simpler than Salesforce but more powerful than a spreadsheet.",
    buyerProfile: {
      suggestedTitle: "End users in the role your tool serves, or their managers. For B2B: team leads, ops managers, department heads.",
      suggestedCompanySize: "For B2B micro-SaaS: 10-500 employee companies where the pain point is most acute. For prosumer tools: individual professionals.",
      suggestedTriggerEvent:
        "Frustrated with current tool, wasting hours on manual process, new in role and looking for better ways to do things, company growing and current workaround breaking down",
      suggestedBudgetAuthority:
        "Under $200/month: individual or team lead can expense it. $200-$1,000/month: needs manager or department approval. Best products start under the approval threshold.",
    },
    outreachTemplate:
      "Hey [name],\n\n" +
      "Hope you're well! Quick question for you.\n\n" +
      "I've been building a [tool/product] that [solves specific problem] - basically because I kept seeing [type of people] waste hours on [the manual process]. I'm looking for 5-10 people who deal with this to try it out and tell me what's missing.\n\n" +
      "Would you be open to taking a look? Free for early users, and I'd genuinely love your feedback. You know this space better than most.",
  },
};
