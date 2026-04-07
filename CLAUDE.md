# Blair App — Claude Code Context

## What This Is
Blair is a personalized business-starting coach for ambitious working moms. It helps them figure out which business fits their skills, time, and life constraints, then guides them through a step-by-step playbook to launch.

## URLs
- Marketing site: hiblair.com (Squarespace)
- App: app.hiblair.com (Vercel, Next.js)
- GitHub: https://github.com/kstannard/blair-app

## Tech Stack
- Next.js 14 (App Router, server components by default)
- TypeScript + Tailwind CSS
- Prisma 7 with pg adapter (NOT SQLite adapter — we migrated to Postgres)
- Supabase Postgres (connection via Session Pooler, aws-1-us-east-1, port 5432)
- NextAuth with CredentialsProvider + JWT strategy (NO PrismaAdapter)
- canvas-confetti for task completion animations
- Google Fonts: DM Serif Display (headings), DM Sans (body), Great Vibes (cursive/Dear Name)

## Environment Variables (all required)
```
DATABASE_URL=postgresql://postgres.duetolkrtdnmyguhahyo:BlairApp2026Supa@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.duetolkrtdnmyguhahyo:BlairApp2026Supa@aws-1-us-east-1.pooler.supabase.com:5432/postgres
NEXTAUTH_SECRET=blair-prod-2026-secret-key-change-later
NEXTAUTH_URL=https://app.hiblair.com
TYPEFORM_TOKEN=your-typeform-token-in-vercel
KIT_API_KEY=your-kit-api-key-in-vercel
```

## Key Architecture Decisions
- Prisma 7 requires pg adapter — always initialize PrismaClient with `new PrismaPg(pool)` pattern
- Server components are default — add "use client" only when needed (state, hooks, browser APIs)
- All content (paths, tasks, templates) lives in `/src/content/` TypeScript files
- Path-specific data is in `/src/content/pathContent.ts`
- Quiz field mappings for Typeform are in `/src/content/typeform-fields.ts`
- Unfair advantage scoring rules are in `/src/content/unfair-advantages.ts`

## The 12 Business Paths
1. GTM & Growth Strategist
2. Messaging & Positioning Specialist
3. Fractional Operator
4. Automation & Systems Builder
5. Content Engine Operator
6. Lead Gen Operator
7. Studio Builder
8. Niche Talent & Placement Operator
9. Investor-Operator
10. Digital Product Builder
11. Community & Membership Operator
12. Micro-SaaS Builder

Each path has its OWN set of 5 phases with different phase names and tasks. They are NOT the same across paths.

### Playbook Content Status
- All 12 paths have Phase 1 with 4 tasks (niche-editor, positioning-editor, buyer-profile-editor, gut-check)
- Fully built (Phases 1-5, 20 tasks each): GTM & Growth Strategist, Fractional Operator, Messaging & Positioning Specialist, Digital Product Builder, Community & Membership Operator
- Remaining 7 paths: Phases 2-5 exist as empty shells, need deep research and task content

### WorksheetEditor (config-driven interactive exercises)
- Component: `/src/components/playbook/tasks/WorksheetEditor.tsx`
- Supports 9 section types: prompt, textarea, list, decision, multiselect, template, contacts, checklist, heading
- Per-path config files in `/src/lib/worksheetConfigs/` (e.g., `community-membership-operator.ts`)
- Config lookup happens BEFORE the taskType switch in renderTaskContent() in the task page
- If a config exists for a task slug, WorksheetEditor renders instead of the legacy editor or "not available yet" default
- Community & Membership Operator: all 20 tasks have WorksheetEditor configs with community-specific exercises
- Service paths (GTM, Fractional, etc.) still use legacy editors (NicheEditor, PositioningEditor, BuyerProfileEditor, GutCheckEditor)
- To add exercises for a new path: create a config file in `/src/lib/worksheetConfigs/[path-slug].ts`, export a `Record<string, WorksheetConfig>` keyed by task slug, import it in the task page

## The 5 Unfair Advantages (scoring logic in `/src/content/unfair-advantages.ts`)
1. **Network Density** — "You already know the people who would pay you." Key signals: Q21 (2+ networks), Q22 (comfortable outreach), Q3 (10+ years)
2. **Pattern Library** — "You've seen this problem break the same way at enough companies." Key signals: Q3 (10+ years), Q4/Q5 (breadth across sizes/industries), Q7 (Fixer/Strategy shoulder tap)
3. **Translation Ability** — "You make the complicated clear." Key signals: Q7 (Creative shoulder tap), Q2 (brand/content role), Q8 (communication freeform)
4. **Systems Brain** — "You see how things should work and build the fix." Key signals: Q7 (Fixer), Q13 (systems interests), Q10 (deep work mode)
5. **Closer Instinct** — "You get people to yes." Key signals: Q2 (Sales/CS role), Q22 (comfortable outreach), Q7 (Strategy), Q8

## Demo Accounts (all @demo.blair.com, NO password set by seed — login only works via admin preview)
Demo accounts use "[First] Demo" format to avoid confusion with real people. To make one loginable, set a password in the DB with bcrypt hash.
- marissa@ — Marissa Demo, GTM & Growth Strategist (was "Julie Soper" demo, renamed)
- liz@ — Liz Demo, Messaging & Positioning Specialist (was "Liz Holloway", renamed)
- ashley@ — Ashley Demo, Fractional Operator (was "Sarah Chen", renamed + email changed from sarah@)
- maria@ — Maria Demo, Automation & Systems Builder
- rachel@ — Rachel Demo, Content Engine Operator
- emma@ — Emma Demo, Lead Gen Operator
- danielle@ — Danielle Demo, Studio Builder
- priya@ — Priya Demo, Niche Talent & Placement Operator
- amanda@ — Amanda Demo, Investor-Operator
- lauren@ — Lauren Demo, GTM & Growth Strategist (MARKETING account for homepage screenshots, IN PROGRESS)

## Real User Accounts (password: blair2026)
- Sarah Blahnik — sarahblahnik@gmail.com, Community & Membership Operator, provisioned via scripts/provision-sarah.js
- Julie Soper — jkaszton@gmail.com, GTM & Growth Strategist, provisioned via scripts/provision-friends.js (real person, do NOT use her data publicly)
- Amanda Schwab — amanda.d.schwab@gmail.com, provisioned via scripts/provision-friends.js
- Claire Hubbard — clairealsophubbard@gmail.com, provisioned via scripts/provision-friends.js
- kelsey@ (kelseymerkel@gmail.com) — Kelsey Merkel Leibel, Messaging & Positioning Specialist (real beta user, pending approval)

## Admin Dashboard
- URL: app.hiblair.com/admin/login
- Password: blair2026
- Shows all customers, their status, quiz answers, recommendation drafts, playbook progress

## Customer Status Lifecycle
Purchased → Quiz submitted → Results ready → Playbook started → Phase 1 in progress → Phase 1 complete → Phase 2 in progress → ... → Phase 5 complete

## Typeform Integration
- Form ID: CCNZDjRG
- Webhook registered and active → hits /api/webhook/typeform on quiz submission
- Field mappings in `/src/content/typeform-fields.ts`
- 27 questions mapped (Q0-Q27 internal keys)
- Key scoring questions: Q2 (role), Q3 (years), Q4 (company size), Q7 (shoulder tap), Q8 (weirdly good at), Q22 (outreach comfort)

## Mini Quiz (Free Funnel)
- 8-question free quiz at app.hiblair.com/quiz
- Questions: name, role, years, company sizes, shoulder tap (CRITICAL — maps to advantages), outreach comfort, industries, kids
- Scores unfair advantage → shows teaser result → pricing card → Squarespace checkout
- Kit (email platform) integration: tags subscribers as "mini-quiz" (tag ID: 18335026) on submission
- Squarespace checkout at hiblair.com (TBD — product page being set up)

## Brand & Design
- Colors: Midnight Ink #1F2041, Soft Linen #FFFCF7, Sage Steel #7E9181, Mist Grey #E9E6E1, Charcoal Ink #111225
- NO em dashes anywhere (use — only if absolutely needed, but prefer rewording)
- NO "yet" as a softener, NO "genuinely", NO "straightforward"
- Voice: warm, witty, direct, never preachy, never presumptuous, uses contractions
- Witty completion quips in `/src/lib/quips.ts`
- Confetti on task completion via canvas-confetti

## Key UI Patterns
- Results page: full-screen hero → "Tell me more" CTA → reveals unfair advantage + recommendation → alternative paths hidden behind "Not sure this is the right fit?" toggle → Kristin video → "Go to playbook" CTA
- Playbook page: welcome card (consolidates intro for new users) → 5-phase horizontal-scroll roadmap → Phase 1 tasks
- Task workspace: title + why-this-matters inline (not collapsed) → pre-filled content → contextual AI buttons (not a chatbot) → auto-check on completion → confetti + quip
- NicheEditor (figure-out-your-specific-thing task): 3-step vertical flow — chips of problems solved (editable, pre-populated via role-aware generateNicheChips() in /src/lib/prepopulation.ts, NOT raw LinkedIn job titles) → select what energizes you → platform suggests what companies pay for (path-specific)
- PositioningEditor: 3 handwritten examples from pathContent.ts (NOT programmatic generation — that broke), user picks and edits
- AppShell nav: hides email for @demo.blair.com accounts (for clean marketing screenshots)

## What Still Needs Work (as of last session)

### Immediate / In Progress
1. **Lauren marketing account** — IN PROGRESS. Account created (lauren@demo.blair.com) but DB insert script needs to be re-run (was interrupted). This is a GTM & Growth Strategist demo with Conde Nast/HubSpot/Datadog background, 3 kids under 6. For homepage screenshots on Squarespace. Script to create: see conversation history or rebuild from Julie Soper's data with tweaked details.
2. **Homepage screenshots for Squarespace** — Take 3 screenshots of Lauren's customer experience: (1) recommendation letter "Dear Lauren", (5) math section with $60K-$100K / $250K-$400K, (10) interactive task exercise with pre-populated chips. Drop into Squarespace to replace flat wireframe mockups.
3. **Fix scorer/webhook systemically** — evidence fragments and duplicated "why" will happen for every future user. The webhook stores `advantage.description` as BOTH `unfairAdvantageDescription` AND `unfairAdvantageWhy`, causing duplication on results page.
4. **HelpPanel shows wrong content** — Only has FAQ content for 4 task types (niche-editor, positioning-editor, buyer-profile-editor, gut-check). All other tasks default to niche-editor FAQs. Needs path-aware content.
5. **Admin task preview redesign** — Currently shows static text (description + whyItMatters), completely different from customer experience. Should reflect the interactive WorksheetEditor view.

### Existing Backlog
6. Kids question in mini quiz — airline-style add/remove UI
7. Squarespace checkout page — product page being set up
8. Kit post-purchase email sequence
9. Post-purchase flow — Squarespace receipt to app sign-in
10. Full Typeform quiz deduplication
11. Auto-scorer — Typeform answers → auto-generates recommendation for admin review
12. Path-specific pre-fills — two different GTM customers should not see identical pre-fills
13. Remaining 7 paths need Phases 2-5 task content and WorksheetEditor configs

## Important Product Decisions Made
- Studio Builder is NOT a true alternative path — it's where some paths evolve to. Don't list it as an alt unless it genuinely fits as a starting point.
- Never assume salary or how someone experienced their career. State facts, not narrative.
- Never use LinkedIn scraping (TOS violation). We need Proxycurl or similar paid API for profile enrichment.
- No chatbot as primary interface. Contextual AI actions embedded in tasks only.
- Pre-filled content = "we started this for you, edit anything that doesn't feel right" — never auto-check completions just because fields are pre-filled.
- Payment gating: mini quiz → free unfair advantage teaser → pay → full quiz → recommendation + playbook
- Quiz route is now /discover (not /quiz). /quiz redirects to /discover.
- URL-based advantage selection: /discover?a=networkDensity etc.
- Phase 1 exercises must be PATH-SPECIFIC, not shared. Community path uses WorksheetEditor configs, not the service-path NicheEditor/PositioningEditor. Each path's exercises should be relevant to that business model.
- Income targets must be realistic for the person's location (e.g., Bay Area = higher baseline). Show aspirational ceiling too ($300K-$400K+).
- Marketing site (Squarespace) should use polished screenshots from a fictional demo account, never a real user's data. Use @demo.blair.com accounts for screenshots.
- Pricing copy: "the ceiling keeps going" not "has a ceiling most service businesses do not" (the latter reads as community making LESS than service)

## Results Copy Standards (non-negotiable rules)
- State facts about what they DID, never narrate how they felt about it or what role they played in outcomes
  - BAD: "You were the person holding everything together"
  - GOOD: "You led comms through a period that included X, Y, Z"
- Never assume salary. Don't say "more than your salary" or imply what they earned.
- Never assume how someone experienced their career (laid off = don't lean into the loss narrative)
- Tone: warm, direct, confidence-building. Never preachy, never presumptuous.
- Bath time is 5:30-6pm (use this when referencing parent constraints)
- Examples in results should NOT be consulting-only. Mix in fractional, advisory, placement, content — whatever fits the path.
- Price ranges must be validated against real research (Carla: $8K/month for 2-3 hrs advising; Nadine: $250/hr, $15K/month for PE; Erin: $15-20K strategy projects; Kaleana: good money for 8 hrs/week)

## QA Standards (non-negotiable)
- **Evidence text must be complete sentences**, personalized to the specific user. No fragments like "strong professional network. comfortable with outreach." Write about their actual career.
- **"Why this matters" must be DIFFERENT from the advantage description.** The webhook currently stores the same text in both fields. Check for duplication.
- **Dollar signs**: search ALL task content for missing $ signs before declaring QA complete. Regex: `/[^$]\d{1,3},\d{3}/` catches ",000" without "$".
- **Read copy critically**: catch duplication, fragments, contextual misfit, and generic boilerplate that could apply to anyone.
- **QA the customer experience, not just the admin preview.** Admin preview shows static text; customer sees interactive editors with pre-populated data. Log in AS the user to verify.
- **Do not tell Kristin something is ready until you have actually verified every section of the user's experience.** Check: results letter, unfair advantage (evidence + why), pricing/math, all task content, playbook phases, interactive exercises.

## Typeform Quiz (paid full quiz)
- Form ID: CCNZDjRG, 27+ questions (Q0-Q27+ after recent additions)
- Added questions: Q13 "What's the main thing stopping you from getting started?" + Q27 "What are your kids' ages?"
- Field mappings in /src/content/typeform-fields.ts

## Mini Quiz / Discover Page (/discover)
- 5 unfair advantages shown as colored cards
- URL-based selection: /discover?a=networkDensity|patternLibrary|translationAbility|systemsBrain|closerInstinct
- Each detail page: colored hero banner, description, examples, pricing card, Clarity guarantee
- Guarantee label: "Clarity guarantee" / Body: "You'll walk away knowing exactly what to build and how to start. If you don't, we'll refund you in full."
- CTA links to: https://www.hiblair.com/store/p/blair-personalized-plan

## Customer Research Notes (from 6 interviews)
- Carla: $8K/month advisory, 2-3 hours/week. Network-driven. No cold outreach.
- Nadine: $250/hr, $15K/month for PE firm work. Pattern Library type.
- Erin: $15-20K strategy projects. Packaged, project-based.
- Kaleana: Good income for 8 hrs/week. Systems/operations.
- Key insight: The fastest income replacements came through existing relationships, not content or funnels.
- Key insight: Packaged project work (clear start/end) works best for moms — open retainers create "on-call" problems.

## Real Users: Key Details

### Sarah Blahnik
- Email: sarahblahnik@gmail.com, provisioned via scripts/provision-sarah.js
- Path: Community & Membership Operator
- Background: SnapLogic, Avira, consumer goods sourcing, 15+ years
- Bay Area based (income targets should reflect Bay Area cost of living: $150K-$200K baseline, $300K-$400K+ ceiling)
- Unfair advantage: Network Density (or Closer Instinct depending on scoring)
- Her playbook has all 20 tasks with interactive WorksheetEditor exercises

### Julie Soper
- Email: jkaszton@gmail.com, provisioned via scripts/provision-friends.js
- Path: GTM & Growth Strategist
- Background: UCLA policy research, National Geographic, enterprise sales at Stripe and Ramp, 15 years
- 3 kids under 4
- Do NOT use her data publicly on the homepage. Use the Lauren marketing account instead.

### Kelsey Merkel Leibel
- Email: kelseymerkel@gmail.com / User ID: kelsey-merkel-001
- Path: Messaging & Positioning Specialist (cmnajm4bm0001c39rkjq1b8zj), status: approved
- Background: Head of Comms & PR at WeightWatchers (~6 yrs), VP at DiGennaro Comms (Pinterest, Spotify, S'well clients, 7.5 yrs), Meta contractor
- One daughter: Avery (young)
- Based in Carlsbad, CA
- Submitted Typeform 3/21. Was already in soft launch mode for her own consultancy.
- Unfair advantage: Translation Ability
- DO NOT mention being laid off as a narrative. State facts only.

## Lauren Marketing Account (for homepage screenshots)
This account needs to be created/finished. It was interrupted mid-creation. Details:
- Email: lauren@demo.blair.com, password: blair2026, name: "Lauren Demo"
- Path: GTM & Growth Strategist
- Background: 13 years, account management at Conde Nast → partnerships at HubSpot → enterprise sales at Datadog
- 3 kids under 6
- Unfair advantage: Network Density
- Evidence: network is revenue/marketing leaders at B2B companies, CMOs/VPs of Sales across SaaS and martech from HubSpot and Datadog
- Pricing: same as Julie's (GTM Sprint $10K-$18K, Revenue Audit $5K-$8K, side hustle $60K-$100K, full-time $250K-$400K)
- Notable experience: built outbound pipeline at HubSpot, designed enterprise sales process at Datadog, partner enablement, territory planning, QBR framework
- Nav email is hidden for @demo.blair.com accounts (already coded in AppShell.tsx)
- Purpose: take 3 clean screenshots for Squarespace homepage: (1) recommendation letter, (2) math section, (3) interactive task exercise
- After creating the account, log in as lauren@demo.blair.com and take screenshots of the customer experience

## Deployment Rules (non-negotiable)
- **ALWAYS commit and push after making code changes.** Do not leave changes sitting locally. If you edited a file, commit and push before ending your turn.
- Vercel auto-deploys from main. Pushing = live.
- If you say something is "live" or "ready", it must be pushed. Never describe local-only changes as live.

## Running Locally
```bash
cd ~/Projects/blair-app
npm run dev
# App runs at http://localhost:3001
```

If the dev server shows an error about Prisma, run:
```bash
npx prisma generate
```

If the database is out of sync:
```bash
npx prisma db push
```

After editing server components, clear the Next.js cache:
```bash
rm -rf .next && npm run dev
```
