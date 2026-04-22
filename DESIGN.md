# Blair — Design & Product Decisions

Session-proof record of design intent, UX conventions, and product decisions. New Claude sessions should read this AFTER `CLAUDE.md` so they pick up the reasoning behind patterns in the code.

Structure:
1. **Voice rules** — copy conventions that apply everywhere
2. **UX patterns** — visual and interaction conventions
3. **Phase 1 editor pattern** — the shared structure across Niche / Positioning / Buyer Profile / GutCheck
4. **Per-task design decisions** — why each task looks the way it does
5. **Do-not-revert log** — decisions that were litigated and settled; don't re-open without asking

---

## 1. Voice rules

### Banned
- Em dashes (`—`). Use periods, commas, colons, or restructure. The `hyphens` we ship in code-dash contexts (`text-sm`) are fine; we mean em dashes in prose.
- "Yet" as a softener ("you haven't built this yet"). Fine as a self-description in a Typeform answer option, not in Blair's voice.
- "Genuinely"
- "Straightforward"
- "OK" — always "Ok" (lowercase k)
- "Got 15 minutes?" — cliché. Vary the phrasing.

### Required
- Warm, direct, witty. Never preachy, never presumptuous.
- Uses contractions.
- Never assumes salary or how someone experienced their career.
- States facts about what they DID, never narrates how they felt.

### Specific phrases to avoid
- "Let us help you" (presumptuous)
- "cocktail party test" (the test is fine as a concept, the phrase is tired)
- Anything that sounds like LinkedIn thought-leader voice

---

## 2. UX patterns

### Numbered circles = workflow steps within a single exercise
Used in Task 1 (NicheEditor) where the user goes 1 → 2 → 3 through the narrowing exercise. The circles represent sub-steps of one coherent flow.

### Plain headings = page sections
Used in Tasks 2, 3, 4. Don't add "1. / 2. / 3." prefixes to section headings — that visually conflates section organization with workflow steps (different concepts).

### Locked placeholder pattern
When a section depends on earlier work being done (e.g. synthesis needs 2+ conversations), show the section as a **greyed-out dashed-border card with a lock icon** instead of hiding it. Users need to see what's coming so they understand the roadmap.

Example copy: "After you capture 2+ conversations above, we'll pull out the patterns for you."

Used in:
- GutCheckEditor section 3 (Conversation guide) — locked until a call is scheduled
- GutCheckEditor section 4 (What you heard / synthesis) — locked until 2+ captures

### Quick tips — one italic sentence at most
Editor bodies use a single italic sentence at the top at max, not a boxed "Quick tip" block. The task's `whyItMatters` subtitle (from the DB) is the primary teaching; don't double up.

### Auto-sizing textareas
All content textareas should auto-resize to fit their content. Pattern:
```tsx
<textarea
  onInput={(e) => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
  ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
  rows={1}
  className="... resize-none overflow-hidden ..."
/>
```

Never use fixed-height textareas for pre-populated content.

### Thinking animation for AI calls
When an API call takes >500ms (engagement-shapes, synthesize, etc.), show a `<ThinkingAnimation>` with bouncing dots + rotating status messages. Makes latency feel intentional. See `src/components/playbook/ThinkingAnimation.tsx`.

---

## 3. Phase 1 editor pattern

Shared visual structure across NicheEditor, PositioningEditor, BuyerProfileEditor, GutCheckEditor.

### What to include
- Quick tip (optional, italic single sentence)
- Workflow content (varies by task)
- Completion checklist at the bottom

### What to avoid
- "Government form" feel: bold label + grey help text + textarea, repeated down the page. Feels like a survey.
- Teaching copy that duplicates the task `whyItMatters` subtitle.
- Fields at equal visual weight to labels — content should be the hero.

### Draft framing
When a task pre-populates content for the user, frame it as a draft Blair wrote for them. Example header: "We drafted your buyer profile. Edit anything that doesn't sound right."

This replaces the government-form pattern with a coach-review pattern.

### Quiet labels
When labels are used inside a draft card, make them **small uppercase grey**, not bold midnight. The content reads as the subject; the label is just orientation.

---

## 4. Per-task design decisions

### Task 1: Figure Out Your Specific Thing (NicheEditor)
- Three numbered sub-steps (1 = broad problems solved, 2 = what lights you up, 3 = what companies pay for)
- Step 3 is **dynamically generated from step 2 selections** via `/api/ai/engagement-shapes`, showing a thinking animation then personalized engagement cards
- Engagement cards show title + pricing badge + description only (cut the "connects to what you said" line, the duration row, and the scope summary — too much)
- Chips in step 1 auto-generated from profile data via `generateNicheChips`. Company names included where they add context (via `{company}` templates in `companyAwareTemplates`), no forced "first 2 have companies" rule

### Task 2: Write Your One Sentence (PositioningEditor)
- Always shows exactly 2 positioning examples (not 3)
- "Start from scratch instead" button was removed — clutter
- Cocktail party test checklist item was removed — tired phrase
- Pre-fills a selected draft, auto-sizes to fit

### Task 3: Get Clear on Who Actually Hires You (BuyerProfileEditor)
- Currently uses the government-form pattern — **flagged for redesign**
- Pending redesign: single draft card with quiet labels, no help text under each field, content prominent. Mockup at `/mockup/buyer-profile-v2`
- `whereTheyHangOut` defaults come from role-aware-content.ts (not user's personal network — user's BUYERS' venues: communities, Slacks, podcasts)

### Task 4: Gut-Check It With Real People (GutCheckEditor)
- **One outreach message at the top**, not per-contact (redundant to repeat same template 3 times)
- Three contact cards with name + status pill (cycles: Not sent → Sent → Scheduled → Conversation had)
- **Capture notes inline** when status = "Conversation had", not hidden behind a toggle
- **Conversation guide is research-grounded** (The Mom Test, customer discovery best practices). Includes:
  - Before-call prep
  - Verbatim capture instruction
  - 5-second silence after reading the sentence
  - The "gold question": *"If you were describing me to someone who needed this, how would YOU say it?"*
  - A fallback probe for when people are too polite
  - Specific closing ask with permission to make intros without checking
- Guide **displays the user's positioning statement inline** so they can read it on the call without switching tasks
- Guide is **locked until a call is scheduled**, synthesis is **locked until 2+ conversations captured**
- Synthesis **auto-generates on mount** via `/api/ai/synthesize` — doesn't require a button click
- Completion requires BOTH 2+ captured conversations AND a synthesis decision (hard gate)
- Role-aware inspiration panel: Jami sees "former Zendesk colleague", "former HP teammate", "PM friend" derived from `notableExperience`

---

## 5. Do-not-revert log

Decisions that were litigated with Kristin and settled. Don't re-open without asking first.

- **Chips include company names where they add context.** Not "first 2 only" or "none at all" — natural placement via templates. Revert history: session went through three wrong interpretations before landing here.
- **Contact notes are NOT pre-filled.** Pre-fills were tried and rejected because the 3 actual people Jami reaches out to may not match the generic categories. Specific examples live in a role-aware **inspiration panel** (collapsed by default).
- **Outreach message is ONE template, not per-contact.** Repeating the same template 3 times under each contact was overbuilt. Users personalize via the `[name]` placeholder when they send.
- **Step 3 (what companies pay for) is API-driven from step 2 selections, not static.** Static had no connection to the user's picks.
- **Synthesis auto-generates, doesn't wait for a button click.** If they uploaded notes/transcripts, the AI has the raw data.
- **Locked placeholders, not hidden sections.** Sections that depend on earlier work always render — greyed out — so users see the roadmap.
- **"Ok" not "OK"** (lowercase k) throughout.

---

## How to update this doc

When a design decision gets made in a session, add it here in the relevant section. Specifically:
- Voice rules → Section 1
- New UX pattern → Section 2
- Editor-wide change → Section 3
- Task-specific change → Section 4
- Something Kristin pushed back on and we settled → Section 5

Commit message should include "update DESIGN.md" so future sessions grep for it.
