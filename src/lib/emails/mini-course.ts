/**
 * 5-day mini-course: "Find Your Business in 5 Days"
 *
 * Modeled after the Hormozi "give away so much value they feel indebted" approach.
 * Each email delivers a real, usable insight. Not teaser content. Not "sign up to learn more."
 * By Day 5, Blair should feel like the obvious next step, not a sales pitch.
 */

export interface MiniCourseEmail {
  day: number;
  subject: string;
  preheader: string;
  body: string; // Plain text with \n\n paragraph breaks. No markdown.
}

export const MINI_COURSE_EMAILS: MiniCourseEmail[] = [
  {
    day: 1,
    subject: "The skill you're underpricing (Day 1 of 5)",
    preheader: "It's not what you think it is.",
    body: `Hi{{firstName}},

You signed up because something about this resonated: you have skills that are worth more than your salary reflects.

Here's the thing most people get wrong. They think about what they DO at work. "I manage a team." "I run operations." "I lead marketing." That's your job description. It's not your unfair advantage.

Your unfair advantage is the thing people come to you for that has nothing to do with your title. It's the problem you solve before anyone finishes explaining it. The thing your coworkers say you're "weirdly good at." The skill that makes people say: "Can you just look at this for five minutes?"

Here's an exercise that takes 3 minutes. Grab your phone and scroll through the last 20 texts or Slack DMs from colleagues. Look for the pattern. What do people actually ask you for help with?

Common patterns:
- "Can you look at this deck?" = Translation Ability (you make complicated things click)
- "Everything is broken, can you fix it?" = Systems Brain (you see how things connect)
- "Can you introduce me to...?" = Network Density (you're the connector)
- "How should we think about this?" = Pattern Library (you've seen this movie before)
- "Can you convince them?" = Closer Instinct (you move people to yes)

That pattern? That's the foundation of a business. Not a side hustle. A real business that can replace your income.

Tomorrow I'll show you what people actually build with each of these advantages, including real income numbers.

Talk soon,
Kristin

P.S. I spent 3 years stuck in the "researching every business idea" phase before I figured this out. You don't need to.`,
  },
  {
    day: 2,
    subject: "What working moms actually build (Day 2 of 5)",
    preheader: "Real businesses, real income, real hours.",
    body: `Hi{{firstName}},

Yesterday you identified your unfair advantage. Today I want to show you what people actually do with it.

These aren't hypothetical. These are the business paths we see working moms build when they stop trying to pick a "business idea" and start building around what they're already good at.

If you have Translation Ability:
You turn confusing things into things that click. Companies pay $5K-$15K for a positioning sprint. You rewrite their pitch, their website, their investor deck. 15-20 hours of actual work per project. One or two clients a month and you're replacing serious income.

If you have a Pattern Library:
You walk in, see what's broken, and know how to fix it because you've seen it break the same way at three other companies. Diagnostic engagements run $12K-$15K. You're not billing hours. You're billing speed and pattern recognition.

If you have a Systems Brain:
You build the ops infrastructure that makes a business run. An automation overhaul for a 50-person company is $8K-$15K. The beautiful part: what you build for one client becomes the template for the next. Your efficiency compounds.

If you have Network Density:
You already know the people. Advisory retainers start at $5K-$8K/month. Talent placement practices earn fees on every introduction that turns into a hire. You're monetizing relationships that already exist.

If you have Closer Instinct:
Founders will pay you a percentage of the deals you close, not a flat hourly rate. Fractional sales leadership serving 2-3 clients at once puts you at $10K-$20K/month.

Here's what all of these have in common: none of them require you to build an audience, go viral, or figure out "passive income." They start with your existing skills and your existing network.

The question isn't "which business should I start?" The question is "which of these fits my actual life?"

Tomorrow I'll show you the math: what it takes to replace your income working 15-20 hours a week.

Kristin`,
  },
  {
    day: 3,
    subject: "The income replacement math (Day 3 of 5)",
    preheader: "This is the spreadsheet that changed everything for me.",
    body: `Hi{{firstName}},

Today I'm going to give you the exact math I wish someone had shown me years ago.

Let's say you want to replace $200K in total comp. That sounds massive as a side business. But let's break it down.

The side hustle phase (where you start):
You have 10-15 hours per week. You take on one client or project per month. You charge $5K-$8K per engagement. That's $60K-$96K/year working part-time alongside your day job.

That's not income replacement. But it IS proof. Proof that people will pay you. Proof that you can do this. Proof that the math works.

The transition phase:
You've delivered for 3-5 clients. You have referrals coming in. You raise your prices (because now you have case studies). You're charging $8K-$15K per engagement and doing 2-3 per month. That's $192K-$540K annually.

At the low end of that range, you've replaced your salary. At the high end, you've surpassed it. And you're working 25-30 hours a week, not 50-60.

The part nobody talks about:
You don't need to quit your job to start. In fact, you shouldn't. The smartest path is:

Month 1-3: Land your first paying client while still employed. Even one.
Month 4-6: Deliver, get a referral, raise your price.
Month 7-12: Build to 2-3 concurrent clients. Start seeing the income overlap.
Month 12-18: Your side income approaches your salary. Now the conversation about leaving shifts from "scary" to "obvious."

The key insight: your first client is the hardest. Your second client is usually a referral from the first. By client #3, you have a business.

Tomorrow: why most working moms stay stuck for years (and the one thing that actually gets them unstuck).

Kristin

P.S. If you're sitting there thinking "but I don't even know what I'd offer," that's exactly what Day 4 is about.`,
  },
  {
    day: 4,
    subject: "Why you've been stuck (Day 4 of 5)",
    preheader: "It's not a motivation problem.",
    body: `Hi{{firstName}},

Let me describe your last few years and tell me if this sounds familiar.

You've spent hundreds of hours researching business ideas. You've bookmarked courses, saved Instagram posts, maybe even bought a domain name. You've thought about consulting, coaching, an Etsy shop, a newsletter, a podcast, an app.

And you've built nothing.

It's not because you're lazy. It's not because you lack ambition. It's because you have too many options and no framework for choosing.

Every business idea triggers the same loop: "But what if there's something better?" So you keep researching. You keep scrolling. You keep thinking about it during bath time, on your commute, in the shower. And another year goes by.

I know this because I lived it. For three years. Three years of "I should start something" while my kids went from babies to preschoolers. Three years of researching while the window for building something was wide open.

Here's what finally broke the loop for me: I stopped asking "what's the perfect business?" and started asking "what am I already good at that someone would pay for this month?"

That reframe changes everything. Because the answer already exists. You don't need to invent it. You don't need to learn new skills. You don't need to build an audience first.

You need three things:
1. Clarity on your unfair advantage (Day 1)
2. A business path that fits your life (Day 2)
3. One specific person to reach out to this week (tomorrow, Day 5)

The thing that keeps working moms stuck isn't lack of ideas. It's lack of a decision. The research phase feels productive, but it's procrastination wearing a blazer.

Tomorrow is the last day. I'm going to give you the exact first step to take this week. Not "someday." This week.

Kristin`,
  },
  {
    day: 5,
    subject: "Your one move this week (Day 5 of 5)",
    preheader: "This is where most people stop. Don't.",
    body: `Hi{{firstName}},

This is it. Five days. You now know more about building a business around your skills than most people figure out in a year of Googling.

You know your unfair advantage. You know what people build with it. You know the math. You know why you've been stuck.

Now: what do you actually do?

Here's your one move for this week. It takes 15 minutes.

Think of one person in your network who runs a company or leads a team. Someone who has a problem you know how to solve. Not theoretically. A real person with a real problem you've actually seen.

Send them a message. Not a pitch. A genuine message:

"Hey [name], I've been thinking about [specific problem you know they have]. I have some ideas on how to approach it based on [your relevant experience]. Would you be open to a 20-minute conversation about it?"

That's it. One message. One conversation. That conversation might turn into nothing. Or it might turn into your first paid project.

Most people won't send this message. Not because it's hard, but because it makes it real. And real is scarier than research.

But here's what I know from working with hundreds of women in your position: the ones who send the message are the ones who build the business. Every time.

Now, if you want to skip the trial-and-error and go straight to a plan built around your specific skills, schedule, and life, that's what Blair does.

For $149, you get:
- Your unfair advantage mapped to a specific business path
- Pricing guidance with real numbers (what to charge, side hustle math, full-capacity math)
- A 30-day playbook built for your available hours (not a fantasy schedule)
- Everything personalized to your experience, your constraints, and your kids' ages

It's not a course. It's not coaching. It's a personalized plan that tells you exactly what to build and how to start.

https://app.hiblair.com/discover

Either way, send that message this week. You've done enough research.

Kristin

P.S. Your kids are only little once. The window for building something that gives you flexibility and ownership is open right now. Don't let another year of "I should start something" go by.`,
  },
];

/**
 * Get the email content for a specific day, personalized with first name.
 */
export function getMiniCourseEmail(day: number, firstName?: string): MiniCourseEmail | null {
  const template = MINI_COURSE_EMAILS.find((e) => e.day === day);
  if (!template) return null;

  const name = firstName?.trim() || "";
  const greeting = name ? ` ${name}` : "";

  return {
    ...template,
    body: template.body.replace(/\{\{firstName\}\}/g, greeting),
  };
}
