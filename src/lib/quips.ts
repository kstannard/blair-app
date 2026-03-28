/**
 * Witty copy for transition moments throughout the app.
 * Tone: funny like a smart friend, never condescending or guru-like.
 *
 * Usage: getQuip("task-complete") returns a random quip from that category.
 */

const quips: Record<string, string[]> = {
  "task-complete": [
    "Done. That's one less thing living rent-free in your brain.",
    "Look at you. Doing business stuff during naptime.",
    "Checked off. Your LinkedIn network has no idea what's coming.",
    "That was the hard part. (OK fine, there are more hard parts. But this one's done.)",
    "Another one down. At this rate you'll be invoicing by summer.",
    "Done. Go refill your coffee. You earned it.",
  ],

  "phase-complete": [
    "Phase 1: done. You officially know more about your business than most people do after 6 months of 'thinking about it.'",
    "You just finished Phase 1. Most people never get this far. Seriously.",
    "Phase 1 is in the books. Your future clients don't know it yet, but things just changed for them.",
  ],

  "welcome-back": [
    "Picking up where you left off. Because moms don't get to finish anything in one sitting.",
    "Welcome back. Your playbook missed you. (It was getting lonely.)",
    "Right where you left off. Let's keep going.",
  ],

  "welcome-back-long": [
    "It's been a minute. Life happens. Let's pick it back up.",
    "You're back. The playbook was just sitting here, patiently waiting. No judgment.",
    "Been a few days? Cool. This isn't a race. Let's go.",
  ],

  "stuck": [
    "Stuck is normal. It means you're actually thinking about it, not just checking boxes.",
    "This is the part where most people stall. You're not most people, but still - totally normal.",
    "If this were easy, everyone would do it. (They don't. That's why it pays well.)",
  ],

  "refine-response": [
    "OK here's a sharper take. Feel free to hate it.",
    "Tighter version. See if this lands better.",
    "Here's another angle. Take it, tweak it, or toss it.",
    "Reworked. If it's still off, hit me again.",
  ],

  "empty-state": [
    "This playbook isn't going anywhere. But neither is your W2 if you don't start.",
    "Blank page energy. Let's fix that.",
    "Everything starts with the first click. This is it.",
  ],

  "save-confirmed": [
    "Saved.",
    "Got it.",
    "Locked in.",
  ],

  "gut-check-prompt": [
    "Time to see if this lands with real humans. (Not just you at 11pm.)",
    "The best validation comes from people who'll tell you the truth, not just what you want to hear.",
  ],
};

export function getQuip(category: string): string {
  const options = quips[category];
  if (!options || options.length === 0) return "";
  return options[Math.floor(Math.random() * options.length)];
}

export function getAllQuips(category: string): string[] {
  return quips[category] || [];
}
