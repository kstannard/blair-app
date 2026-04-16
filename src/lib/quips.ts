/**
 * Witty copy for transition moments throughout the app.
 * Tone: funny like a smart friend, never condescending or guru-like.
 *
 * Each quip can be gated by:
 *  - timeOfDay: "day" (7am–5pm local) or "night" (everything else); omit = any
 *  - pathShape: which business shapes the quip fits; omit = all shapes
 *
 * Path shapes:
 *  - "service": GTM, Messaging, Fractional, Automation, Content Engine, Lead Gen,
 *               Studio, Niche Talent, Investor-Operator
 *  - "product": Digital Product Builder, Micro-SaaS Builder
 *  - "community": Community & Membership Operator
 *
 * Usage: getQuip("task-complete", { hour, pathShape }) filters before picking.
 */

export type PathShape = "service" | "product" | "community";

interface Quip {
  text: string;
  timeOfDay?: "day" | "night";
  pathShape?: PathShape[];
}

const quips: Record<string, Quip[]> = {
  "task-complete": [
    { text: "Done. That's one less thing living rent-free in your brain." },
    { text: "Look at you. Doing business stuff during naptime.", timeOfDay: "day" },
    { text: "Checked off. Your LinkedIn network has no idea what's coming." },
    { text: "That was the hard part. (Ok fine, there are more hard parts. But this one's done.)" },
    { text: "Done. Go grab some water. (Or coffee. Or wine.) You earned it." },
    { text: "One more down. The momentum is real." },
    { text: "Saved. You're further along than you think." },
  ],

  "phase-complete": [
    { text: "Phase 1: done. You officially know more about your business than most people do after 6 months of 'thinking about it.'" },
    { text: "You just finished Phase 1. Most people never get this far. Seriously." },
    { text: "Phase 1 is in the books. Your future customers don't know it yet, but things just changed for them." },
  ],

  "welcome-back": [
    { text: "Picking up where you left off. (Because moms don't get to finish anything in one sitting.)" },
    { text: "Welcome back. Your playbook missed you." },
    { text: "Right where you left off. Let's keep going." },
  ],

  "welcome-back-long": [
    { text: "It's been a minute. Life happens. Let's pick it back up." },
    { text: "You're back. Let's get into it." },
    { text: "Been a few days? No problem. This isn't a race. But now that you're back, let's go!" },
  ],

  stuck: [
    { text: "Stuck is normal. It means you're actually thinking about it, not just checking boxes." },
    { text: "This is the part where most people stall. You're not most people, but still - totally normal." },
    { text: "If this were easy, everyone would do it. (They don't. That's why the people who do it win.)" },
  ],

  "refine-response": [
    { text: "Ok here's a sharper take. Feel free to hate it." },
    { text: "Tighter version. See if this lands better." },
    { text: "Here's another angle. Take it, tweak it, or toss it." },
    { text: "Reworked. If it's still off, hit me again." },
  ],

  "empty-state": [
    { text: "This playbook isn't going anywhere. But neither is your W2 if you don't start." },
    { text: "Blank page energy. Let's fix that." },
    { text: "Everything starts with the first click. This is it." },
  ],

  "save-confirmed": [
    { text: "Saved." },
    { text: "Got it." },
    { text: "Locked in." },
  ],

  "gut-check-prompt": [
    { text: "Time to see if this lands with real humans. (Not just you at 11pm.)" },
    { text: "The best validation comes from people who'll tell you the truth, not just what you want to hear." },
  ],
};

// ============================================================================
// Runtime
// ============================================================================

interface QuipContext {
  /** Local hour 0-23. Defaults to current time. */
  hour?: number;
  /** Path shape of the user's confirmed path. Omit to skip path filtering. */
  pathShape?: PathShape;
}

function isDay(hour: number): boolean {
  return hour >= 7 && hour < 17;
}

export function getQuip(category: string, ctx: QuipContext = {}): string {
  const options = quips[category];
  if (!options || options.length === 0) return "";

  const hour = ctx.hour ?? new Date().getHours();
  const dayNow = isDay(hour);

  const filtered = options.filter((q) => {
    if (q.timeOfDay === "day" && !dayNow) return false;
    if (q.timeOfDay === "night" && dayNow) return false;
    if (q.pathShape && ctx.pathShape && !q.pathShape.includes(ctx.pathShape)) return false;
    return true;
  });

  // Fall back to unfiltered if filtering removed everything
  const pool = filtered.length > 0 ? filtered : options;
  return pool[Math.floor(Math.random() * pool.length)].text;
}

export function getAllQuips(category: string): string[] {
  return (quips[category] || []).map((q) => q.text);
}

// ============================================================================
// Path slug → shape mapping (for callers that have the slug)
// ============================================================================

const PATH_SHAPE_BY_SLUG: Record<string, PathShape> = {
  "gtm-growth-strategist": "service",
  "messaging-positioning": "service",
  "fractional-operator": "service",
  "automation-systems-builder": "service",
  "content-engine-operator": "service",
  "lead-gen-operator": "service",
  "studio-builder": "service",
  "niche-talent-placement": "service",
  "investor-operator": "service",
  "digital-product-builder": "product",
  "micro-saas-builder": "product",
  "community-membership-operator": "community",
};

export function getPathShape(pathSlug: string | undefined | null): PathShape | undefined {
  if (!pathSlug) return undefined;
  return PATH_SHAPE_BY_SLUG[pathSlug];
}
