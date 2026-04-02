/**
 * 5-day mini-course: "Find Your Business in 5 Days"
 *
 * Philosophy: Hormozi "give away the secrets, sell the implementation."
 * Each email is a complete solution to a narrow problem. Not teaser content.
 * Real stories from real women (anonymized from user research calls).
 * Real numbers. Real frameworks. Specific enough to act on today.
 *
 * KRISTIN: Lines marked [YOUR STORY] need your real details. Don't skip these.
 * The personal specificity is what separates this from every other email course.
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
    subject: "The question that replaces 1,000 hours of research (Day 1 of 5)",
    preheader: "It takes 3 minutes and your phone.",
    body: `Hi{{firstName}},

You signed up because some part of you knows this isn't it. Not the job itself, maybe. But the math of it: the hours, the inflexibility, the fact that you're building something valuable for someone else's company while your kids grow up in the gaps between meetings.

You've probably been stuck on the same question for months (maybe years): what would I actually build?

I've talked to a lot of women in your exact position, and that question is a trap. It sends you into an endless loop of researching business ideas, bookmarking courses, buying a domain name at 11pm. And then nothing happens.

The better question: what do people already come to you for?

Not your job title. Not your department. The thing people seek you out for that has nothing to do with your role. The reason someone texts you "can you look at this for 5 minutes?" or pulls you into a meeting you weren't invited to.

Grab your phone. Open your last 20 texts or Slack DMs from coworkers. Look for the pattern.

"Can you look at this deck before I send it?" That's translation ability. You make complicated things make sense.

"Everything is on fire, can you come fix this?" That's a systems brain. You see how things connect when everyone else sees chaos.

"Do you know anyone who...?" That's network density. You're the connector.

"How should we think about this?" That's a pattern library. You've solved this problem at three other companies and you already know what works.

"Can you get them to say yes?" That's closer instinct. You move people to decisions.

A woman I talked to had spent her career in HR and benefits consulting. When she looked at her DMs, she realized vendors were constantly asking her how to sell into large employers. That pattern became her entire business. She runs it in about 8 hours a week now and told me she "struck gold."

Your pattern is sitting in your phone right now. Go find it.

Tomorrow I'll show you what real women build with each of these patterns, with actual income numbers and actual hours.

Talk soon,
Kristin

P.S. If you see more than one pattern, that's normal. We'll narrow it down.`,
  },
  {
    day: 2,
    subject: "6 women, 6 businesses, real numbers (Day 2 of 5)",
    preheader: "None of them went viral. All of them make real money.",
    body: `Hi{{firstName}},

Yesterday you identified your pattern. Today I want to show you what real women have done with theirs.

These aren't hypothetical business models. These are women I've interviewed and worked with who made the jump. I'm sharing their structures and their numbers because the vague "six-figure consulting" advice on the internet is useless without specifics.

THE POSITIONING STRATEGIST (Translation Ability)
A former marketing leader noticed everyone asked her to "fix" their messaging. She now runs brand positioning sprints for companies: she rewrites their pitch, their website copy, their investor deck. She charges $5K-$12K per sprint depending on company size. Each sprint is 3-6 weeks of part-time work. Two per quarter alongside her day job was $40K-$64K in year one. She did not build an audience. She did not go viral. She DMed people she already knew.

THE FRACTIONAL COO (Systems Brain)
A former Chief of Staff with three kids under 6 left her role when she was "totally tapped out on all fronts." She positioned herself as a fractional operator for startups. Her starting rate: $250/hour. Her current retainer with one PE-backed company: $15K/month for 15-20 hours a week. She found clients by going through her entire network: B-school classmates, old colleagues, VC contacts. No formal pitch. Just reconnection conversations. 90% response rate.

THE COMMUNITY BUILDER (Network Density)
A woman who kept getting asked "do you know anyone who..." started a paid community for women in leadership. She launched with a LinkedIn post and a Slack group. Within two years: 2,300 paying members at $15/month. That's roughly $336K/year. She still runs it alongside her VP role. The community markets itself through word of mouth.

THE REVENUE CONSULTANT (Closer Instinct)
A former sales leader started helping founders close deals they were fumbling. She works with 2-3 startups at once on retainer, focused on their highest-value opportunities. She charges a base retainer plus a percentage of deals she helps close. Her clients don't care about her hours. They care about revenue.

THE STRATEGIC ADVISOR (Pattern Library)
A former product executive realized companies kept asking her the same questions she'd already answered at three previous companies. She offers diagnostic engagements: walk in, assess what's broken, tell them how to fix it. Her first client came from bumping into a former boss. She started at $8K/month for 2-3 hours a week of advising. She now includes equity in some arrangements and is building toward paid board seats.

THE CURATOR TURNED CONSULTANT (The Unexpected Pattern)
A woman in benefits consulting noticed she was "weirdly good" at sourcing consumer products for friends. She combined her deep industry knowledge with her curation instinct and built a consulting practice helping early-stage vendors break into the employer channel. She runs a structured 6-week program, takes on 2 clients at a time, and is strict about hours and boundaries.

What do they have in common? They all started with skills they already had. None of them had a "business idea." They had a pattern they monetized. And none of them quit their jobs first.

One stat that puts this in context: women founded 49% of all new US businesses in 2024, up from 29% in 2019 (AJC Company Research). And when surveyed about why, 70% cited flexibility as the number one reason. Not money. Control.

Tomorrow: the actual math on replacing your income.

Kristin`,
  },
  {
    day: 3,
    subject: "The income math nobody shows you (Day 3 of 5)",
    preheader: "A spreadsheet is worth more than a vision board.",
    body: `Hi{{firstName}},

A Bipartisan Policy Center poll found that 46% of working mothers are interested in starting their own business. The number one barrier? Not ideas. Not motivation. It's money: 81% said insufficient personal funds held them back. Which makes sense. The idea of walking away from a salary when you have kids is paralyzing.

But most of the women I've talked to didn't walk away from anything. They built alongside. So let me show you the math on that.

Say you want to replace $200K in total comp.

When you're still employed with 10-15 hours a week to spare, one client paying you $150-250/hour for 10 hours a month is $1,500-$2,500/month. That's $18K-$30K annualized. Not income replacement. But it's proof of concept. Proof that someone will pay you for what you know without a company logo behind your name.

One woman I talked to described this phase perfectly: she had no formal offer out of the gate. She was just asking people she knew to pay her for strategy work. She was way too cheap at first. But the reps mattered more than the rate.

After 3-5 clients, something shifts. You have referrals coming in. You have receipts. You raise your prices because you're not guessing anymore.

A positioning consultant went from undercharging on her first project to selling $15-20K strategy sprints within months. Same skill. Better packaging.

At $5K-$15K per project, 1-2 per month, 15-20 hours a week: $60K-$360K annualized. The range is wide because it depends on your niche, your network, and how you package. But somewhere in that range, you've passed your salary. And you're working half the hours.

One fractional COO I talked to was making $225K at her last job. She now works 20-25 hours a week and is at about 60-70% of that. Three kids under 6 at home. She's not working fewer hours because she can't find clients. She's working fewer hours because she wanted to be at pickup. That's the whole point.

The part nobody mentions: your first client is the hardest. Everything after compounds. Client #2 is usually a referral. Client #3 comes from the confidence you built. By #4, it's a business.

Your action for today: open a spreadsheet. Target annual income. Divide by 12. Divide that by what you'd charge. That's your client math. It's more useful than anything you'll find on Instagram.

Kristin

P.S. If you want someone to run this math with you based on your specific skills and situation, that's a big part of what Blair does. https://app.hiblair.com/discover`,
  },
  {
    day: 4,
    subject: "The real reason you haven't started (Day 4 of 5)",
    preheader: "It's not motivation. It's something else.",
    body: `Hi{{firstName}},

Tell me if this sounds familiar.

You think about starting something during bath time. On your commute. At 2am when you're rocking your kid back to sleep. You've bookmarked more courses than you'll ever take. Maybe bought a domain name you've never used. Considered consulting, coaching, an Etsy shop, a newsletter, an app.

Started none of them.

This isn't a motivation problem. You're one of the most driven people in any room you walk into. That's how you got where you are. The issue is that you've never actually asked yourself the question underneath the question: what do I want my life to look like? Not someday. Right now. Because until you answer that, every business idea is just another thing competing for the time you already don't have.

Once you know what you're building toward, the "what should I start" question gets a lot simpler. But most women skip that part and go straight to Googling "best side hustles 2026."

Every new idea triggers the same thought: "But what if there's something better?" So you keep looking. And the looking feels productive. It has all the textures of progress: the tabs, the notes, the late-night rabbit holes. But nothing is actually moving.

There's data on this. An internal HP report found that men apply for jobs when they meet about 60% of the qualifications. Women wait until they hit 100%. That same pattern shows up in entrepreneurship: women delay starting until they feel fully ready, which for most people means never. And a meta-analysis of over 40,000 people in the Journal of Vocational Behavior found that women consistently score higher on impostor syndrome measures than men. The hesitation isn't about ability. It's about perception.

[YOUR STORY: Kristin, write 2-3 paragraphs here about your own version of this. How long were you stuck? What were you researching? What did your kids' ages look like when you started thinking about it vs. when you finally did something? What broke the loop? Be specific. Be a little embarrassed about it. That's what makes this email the one they screenshot and send to a friend.]

A coach I spoke with nailed the two feelings that keep people frozen:

First, you're used to being great at your job. Suddenly you're a beginner again: figuring out pricing, writing your own marketing copy, stumbling through sales calls. It's disorienting. You went from "I run this place" to "I don't know what I'm doing."

Second, you're used to having a team. Now you're your own legal, HR, sales, and IT department. There's nobody to hand things to.

Both are real. Both fade way faster than you'd expect.

Your action today is going to feel a little aggressive: delete your bookmarks folder of business ideas. All of it. Those ideas had their chance. You don't need more options. You need fewer.

Tomorrow I'm going to give you one specific thing to do. Not "someday." This week.

Kristin`,
  },
  {
    day: 5,
    subject: "Send this message today (Day 5 of 5)",
    preheader: "15 minutes. One message. That's it.",
    body: `Hi{{firstName}},

I'm not going to recap the last four days. You were there.

I want to talk about one thing: the gap between knowing and doing.

You could read a hundred more emails like this one. Listen to every podcast. Buy every course. And still be in the same spot a year from now. Not because the information was bad, but because information isn't the bottleneck. Action is.

So here's the one thing I want you to do today. It takes 15 minutes.

Pick the version that fits your pattern:

If you're leaning toward consulting or advisory work: think of one person in your network who has a problem you know how to solve. Send them this: "Hey [name], I've been thinking about [specific problem you know they have]. I have some ideas based on [your experience]. Would you be open to a 20-minute conversation this week?"

If you're leaning toward a digital product or course: find 5 people in your network who match the audience you'd serve. Ask them one question: "What's the thing you're most stuck on right now when it comes to [your topic]?" Their answers are your product outline.

If you're leaning toward community: post in one Slack group, LinkedIn, or group chat you're already in. Say what you're thinking about building and ask who else would want in. If 10 people say yes, you have a community. If nobody responds, you have useful information.

Noah Kagan, who built a $100M+ company, says the only real validation is whether people will give you money or time. Not compliments. Not "cool idea!" Actual commitment. Whatever version you pick above, you'll know within 48 hours whether you're onto something.

One woman I talked to got her first client from lunch with a former boss. He just said "I have work for you." Another posted on LinkedIn and someone replied "I want to be your first client." Another built a 2,300-person community from a single Slack group invite.

None of them had it figured out when they started. They just started.

Send it today.

---

If you're reading this thinking "I want to send it but I still don't know what I'd actually offer, or what to charge, or how to fit this around three kids and a full-time job" ...

That's what Blair does.

$149. A plan built around your specific skills, your schedule, and your constraints. Your unfair advantage named and explained. A business path that fits your life. Pricing math with real numbers. A 30-day playbook for your actual available hours.

No call. No upsell. Takes 10 minutes to start.

https://app.hiblair.com/discover

Either way: send that message this week.

Kristin

P.S. 46% of working moms say they want to start a business (Bipartisan Policy Center, 2022). You're not the only one thinking about this. You might be the one who actually does it.`,
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
