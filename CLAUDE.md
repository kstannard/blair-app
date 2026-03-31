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

## The 9 Business Paths
1. GTM & Growth Strategist
2. Messaging & Positioning Specialist
3. Fractional Operator
4. Automation & Systems Builder
5. Content Engine Operator
6. Lead Gen Operator
7. Studio Builder
8. Niche Talent & Placement Operator
9. Investor-Operator

Each path has its OWN set of 5 phases with different phase names and tasks. They are NOT the same across paths.

## The 5 Unfair Advantages (scoring logic in `/src/content/unfair-advantages.ts`)
1. **Network Density** — "You already know the people who would pay you." Key signals: Q21 (2+ networks), Q22 (comfortable outreach), Q3 (10+ years)
2. **Pattern Library** — "You've seen this problem break the same way at enough companies." Key signals: Q3 (10+ years), Q4/Q5 (breadth across sizes/industries), Q7 (Fixer/Strategy shoulder tap)
3. **Translation Ability** — "You make the complicated clear." Key signals: Q7 (Creative shoulder tap), Q2 (brand/content role), Q8 (communication freeform)
4. **Systems Brain** — "You see how things should work and build the fix." Key signals: Q7 (Fixer), Q13 (systems interests), Q10 (deep work mode)
5. **Closer Instinct** — "You get people to yes." Key signals: Q2 (Sales/CS role), Q22 (comfortable outreach), Q7 (Strategy), Q8

## Demo Accounts (all @demo.blair.com, password: demo123)
- julie@ — Julie Soper, GTM & Growth Strategist
- liz@ — Liz Holloway, Messaging & Positioning Specialist
- sarah@ — Sarah Chen, Fractional Operator
- maria@ — Maria Santos, Automation & Systems Builder
- rachel@ — Rachel Gaines, Content Engine Operator
- emma@ — Emma Lawson, Lead Gen Operator
- danielle@ — Danielle Okafor, Studio Builder
- priya@ — Priya Sharma, Niche Talent & Placement Operator
- amanda@ — Amanda Reeves, Investor-Operator
- kelsey@ — Kelsey Merkel Leibel, Messaging & Positioning Specialist (real beta user, pending approval)

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
- Results page: full-screen hero → "Tell me more" CTA → reveals unfair advantage + recommendation → alternative paths hidden behind "Not sure this is the right fit?" toggle → "Go to playbook" CTA → share/referral section
- Playbook page: welcome card (consolidates intro for new users) → 5-phase horizontal-scroll roadmap → Phase 1 tasks
- Task workspace: title + why-this-matters inline (not collapsed) → pre-filled content → contextual AI buttons (not a chatbot) → auto-check on completion → confetti + quip
- NicheEditor (figure-out-your-specific-thing task): 3-step vertical flow — chips of problems solved (editable) → select what energizes you → platform suggests what companies pay for (path-specific)
- PositioningEditor: 3 handwritten examples from pathContent.ts (NOT programmatic generation — that broke), user picks and edits

## What Still Needs Work (as of last session)
1. Kids question in mini quiz — airline-style add/remove UI (one kid at a time, pick age per kid)
2. Squarespace checkout page — product page being set up, then wire results page CTA to it
3. Kit post-purchase email sequence — triggered after Squarespace purchase
4. Post-purchase flow — how user gets from Squarespace receipt to signing in to app
5. Full Typeform quiz deduplication — skip the 8 mini-quiz questions when they do the full quiz post-purchase
6. Homepage "Get started" button — needs to link to app.hiblair.com/quiz
7. Results page refinement — make it more visual/exciting, less text-heavy
8. NicheEditor AI refine buttons — unclear UX, need better copy/placement
9. Auto-scorer — build the scoring engine that takes Typeform answers → auto-generates recommendation for admin review
10. Path-specific playbook content — pre-fill in tasks should vary by customer within same path (two different GTM customers shouldn't see identical pre-fills)
11. Quiz results page — needs to feel like a real "moment," currently flat
12. Squarespace homepage — "Get started" CTA still not linked to quiz

## Important Product Decisions Made
- Studio Builder is NOT a true alternative path — it's where some paths evolve to. Don't list it as an alt unless it genuinely fits as a starting point.
- Never assume salary or how someone experienced their career. State facts, not narrative.
- Never use LinkedIn scraping (TOS violation). We need Proxycurl or similar paid API for profile enrichment.
- No chatbot as primary interface. Contextual AI actions embedded in tasks only.
- Pre-filled content = "we started this for you, edit anything that doesn't feel right" — never auto-check completions just because fields are pre-filled.
- Payment gating: mini quiz → free unfair advantage teaser → pay → full quiz → recommendation + playbook
- Quiz route is now /discover (not /quiz). /quiz redirects to /discover.
- URL-based advantage selection: /discover?a=networkDensity etc.

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

## Kelsey Merkel Leibel (real beta user)
- Email: kelseymerkel@gmail.com / User ID: kelsey-merkel-001
- Path: Messaging & Positioning Specialist (cmnajm4bm0001c39rkjq1b8zj), status: approved
- Background: Head of Comms & PR at WeightWatchers (~6 yrs), VP at DiGennaro Comms (Pinterest, Spotify, S'well clients, 7.5 yrs), Meta contractor
- One daughter: Avery (young)
- Based in Carlsbad, CA
- Submitted Typeform 3/21. Was already in soft launch mode for her own consultancy.
- Unfair advantage: Translation Ability
- DO NOT mention being laid off as a narrative. State facts only.

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
