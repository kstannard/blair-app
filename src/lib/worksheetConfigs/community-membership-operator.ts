import type { WorksheetConfig } from "@/components/playbook/tasks/WorksheetEditor";

export const communityMembershipOperatorConfigs: Record<string, WorksheetConfig> = {
  // Phase 1: Define Your Community

  "community-membership-operator--find-your-community-niche": {
    tip: "The tighter your niche, the easier it is to find members, charge premium rates, and build word of mouth. A community for 'women in tech' is too broad. A community for 'Heads of Product at Series A-B companies navigating their first board interactions' is a business.",
    sections: [
      { type: "heading", text: "The narrowing exercise", description: "Work through these three steps to figure out who belongs in your room." },
      {
        type: "textarea", key: "whoComesToYou", label: "Who already comes to you?",
        description: "Think about the people who DM you, text you, or grab coffee with you for advice. What do they have in common? What topics come up over and over?",
        placeholder: "e.g., Women in ops roles at tech companies who are figuring out their next move after leaving a senior role...", rows: 5
      },
      {
        type: "textarea", key: "whatTheyNeed", label: "What do they need that they can't get alone?",
        description: "The best communities solve a problem that's hard to solve in isolation: access to peers, curated information, accountability, introductions.",
        placeholder: "e.g., A trusted space to talk about career transitions without the LinkedIn performance...", rows: 5
      },
      {
        type: "template", key: "nicheSentence", label: "Your niche in one sentence",
        template: "A community for {{who}} who want {{what}}.",
        fields: [
          { key: "who", placeholder: "specific group of people" },
          { key: "what", placeholder: "what they get from being in the room" }
        ]
      }
    ]
  },

  "community-membership-operator--write-your-community-pitch": {
    tip: "Your pitch should make someone say 'that's exactly what I need' within 10 seconds. If it could describe any community, it's too vague.",
    sections: [
      {
        type: "textarea", key: "pitch", label: "Your community pitch",
        description: "Write 2-3 sentences that explain what your community is, who it's for, and why someone would pay to be in it. Write it like you're texting a friend who'd be a perfect member.",
        placeholder: "e.g., I'm building a private community for ops leaders who just left corporate and are figuring out what's next. Think curated introductions, real talk about the transition, and people who actually get it...", rows: 8
      },
      {
        type: "prompt", key: "whyPay", label: "Why would someone pay for this?",
        description: "What do members get here that they can't get from a free Slack group or LinkedIn?",
        placeholder: "e.g., Curated access to people at their level, not a noisy free-for-all..."
      },
      {
        type: "prompt", key: "whatMakesYouRight", label: "Why are you the right person to run this?",
        description: "What about your background, network, or taste makes you credible here?",
        placeholder: "e.g., 15 years as Chief of Staff, I already connect these people naturally..."
      }
    ]
  },

  "community-membership-operator--profile-your-founding-members": {
    tip: "Your first 10-20 members define the culture of your community forever. Be intentional about who you invite first.",
    sections: [
      { type: "heading", text: "Your ideal founding member", description: "Describe the person you'd most want in the room." },
      { type: "prompt", key: "memberTitle", label: "What's their role or title?", placeholder: "e.g., VP of Ops, Chief of Staff, Head of Strategy" },
      { type: "prompt", key: "memberCompany", label: "What kind of company are they at (or leaving)?", placeholder: "e.g., Series B-D tech company, 200-2000 employees" },
      {
        type: "textarea", key: "memberChallenge", label: "What challenge are they facing right now?",
        description: "The more specific, the better. This becomes your outreach hook.",
        placeholder: "e.g., They just left a senior role and are torn between going fractional, starting something, or taking another full-time gig...", rows: 4
      },
      {
        type: "list", key: "tenNames", label: "Name 10 people who fit this profile",
        description: "If you can't name 10, your niche might be too narrow or you might need to expand your network first. These are your founding member candidates.",
        placeholder: "First and last name", minItems: 5, maxItems: 15
      }
    ]
  },

  "community-membership-operator--test-the-concept": {
    tip: "Before you build infrastructure, host one event. A dinner, a virtual roundtable, a Slack pop-up. See if the room has energy before you commit to building the house.",
    sections: [
      { type: "heading", text: "Plan your test event", description: "Design a low-effort way to get 8-10 ideal members in a room together." },
      {
        type: "decision", key: "eventFormat", label: "Pick your format",
        options: [
          { value: "dinner", title: "In-person dinner or coffee", description: "Intimate, high-trust, great for local networks" },
          { value: "virtual", title: "Virtual roundtable", description: "60-minute video call, easy to organize, wider reach" },
          { value: "slack-popup", title: "Slack pop-up channel", description: "48-hour async conversation, lowest friction" },
          { value: "other", title: "Something else", description: "You have a better idea for your audience" }
        ]
      },
      {
        type: "prompt", key: "eventTopic", label: "What's the conversation topic?",
        description: "Pick something your ideal members are actively wrestling with right now.",
        placeholder: "e.g., How to build income flexibility after leaving a senior corporate role"
      },
      {
        type: "list", key: "inviteList", label: "Who are you inviting?",
        description: "Pull from your founding member list. Aim for 8-10 people.",
        placeholder: "Name", minItems: 5, maxItems: 12
      },
      {
        type: "textarea", key: "eventNotes", label: "What happened?",
        description: "After the event: What surprised you? What got the most energy? Did anyone say 'when's the next one?'",
        placeholder: "Notes from the event...", rows: 6
      }
    ]
  },

  // Phase 2: Build the Room

  "community-choose-platform": {
    tip: "Don't overthink this. You can always migrate later. The best platform is the one your members already use.",
    sections: [
      {
        type: "decision", key: "platform", label: "Where will your community live?",
        options: [
          { value: "slack", title: "Slack", description: "Best if your members are corporate professionals already in Slack all day. Free to start." },
          { value: "circle", title: "Circle", description: "Built for paid communities. Native payments, events, courses. Starts at $49/month." },
          { value: "discord", title: "Discord", description: "Great for always-on communities. Free, powerful, but can feel noisy." },
          { value: "geneva", title: "Geneva", description: "Clean mobile-first experience. Good for lifestyle and consumer communities." },
          { value: "mighty", title: "Mighty Networks", description: "All-in-one with courses, events, and community. Higher price point but feature-rich." },
          { value: "other", title: "Other", description: "WhatsApp group, email list, or something custom" }
        ]
      },
      {
        type: "textarea", key: "whyThisPlatform", label: "Why this one?",
        description: "Quick note on why this is the right fit for your members.",
        placeholder: "e.g., My members are all in Slack for work already, so the friction to join is zero...", rows: 3
      }
    ]
  },

  "community-design-channels": {
    tip: "Start with 5-6 channels max. Too many channels on day one kills engagement. You can always add more based on what members ask for.",
    sections: [
      { type: "heading", text: "Your channel structure", description: "Name and describe 5-6 spaces based on what your members actually need." },
      {
        type: "list", key: "channels", label: "Channels",
        description: "Each channel should have a clear purpose. Think: what conversation does this channel exist to hold?",
        placeholder: "e.g., #introductions: Share who you are and what you're working on", minItems: 4, maxItems: 8
      },
      {
        type: "textarea", key: "welcomeMessage", label: "Welcome message",
        description: "Write the message new members see when they join. Set expectations: what this space is, what the norms are, and what to do first.",
        placeholder: "Welcome to [your community name]! Here's what you need to know...", rows: 8
      }
    ]
  },

  "community-application-flow": {
    tip: "Even at $15/month, an application signals selectivity and increases perceived value. Keep it short: 4-5 questions.",
    sections: [
      { type: "heading", text: "Application questions", description: "Write 4-5 questions that help you decide if someone belongs in the room." },
      {
        type: "list", key: "applicationQuestions", label: "Your questions",
        description: "Focus on fit, not credentials. You want to know if they'll contribute, not just consume.",
        placeholder: "e.g., What are you working on right now?", minItems: 3, maxItems: 6
      },
      {
        type: "textarea", key: "acceptanceCriteria", label: "How will you decide who gets in?",
        description: "Write down your gut-check criteria. What makes someone a yes?",
        placeholder: "e.g., They're actively in transition or building something. They'd add to conversations, not just lurk...", rows: 4
      }
    ]
  },

  "community-founding-offer": {
    tip: "Founding members get a locked-in rate and the 'founding member' title forever. This creates urgency and rewards early trust.",
    sections: [
      { type: "prompt", key: "targetPrice", label: "What's your target monthly price?", description: "This is what you'll charge after the founding period.", placeholder: "e.g., $49/month" },
      { type: "prompt", key: "foundingPrice", label: "Founding member price", description: "30-50% off your target price. This rate locks in for life.", placeholder: "e.g., $25/month" },
      { type: "prompt", key: "foundingSlots", label: "How many founding member slots?", description: "15-25 is the sweet spot. Small enough to feel exclusive, big enough to have energy.", placeholder: "e.g., 20" },
      {
        type: "textarea", key: "foundingPerks", label: "What do founding members get?",
        description: "Beyond the locked-in rate. Think: input on direction, direct access to you, recognition.",
        placeholder: "e.g., Locked-in rate forever, 'Founding Member' badge, quarterly 1:1 with me, input on community direction...", rows: 4
      },
      {
        type: "template", key: "offerSentence", label: "Your founding member pitch",
        template: "Join as one of {{slots}} founding members at {{price}}/month (regular price will be {{fullPrice}}). You get {{perk}}.",
        fields: [
          { key: "slots", placeholder: "20" },
          { key: "price", placeholder: "$25" },
          { key: "fullPrice", placeholder: "$49" },
          { key: "perk", placeholder: "locked-in pricing forever + direct input on what we build" }
        ]
      }
    ]
  },

  // Phase 3: Fill the First 20 Seats

  "community-personal-invites": {
    tip: "Do not blast. Send individualized messages to 30-40 people from your network who fit your member profile. The best communities started with personal outreach, not marketing.",
    sections: [
      {
        type: "textarea", key: "messageTemplate", label: "Your invitation message",
        description: "Write the message you'll send. Personalize the first line for each person. Explain why you thought of them specifically.",
        placeholder: "Hey [name], I've been building something I think you'd be perfect for...", rows: 10
      },
      {
        type: "contacts", key: "invitations", label: "Track your outreach",
        description: "List everyone you're reaching out to. Update their status as you go.",
        slots: 10, statusOptions: ["Not yet", "Sent", "Replied", "Joined", "Passed"]
      }
    ]
  },

  "community-seed-conversations": {
    tip: "Before inviting members in, post 3-5 discussion prompts and share something real about yourself. Nobody wants to walk into an empty room.",
    sections: [
      { type: "heading", text: "Seed content", description: "Write the first posts your members will see when they join." },
      {
        type: "textarea", key: "introPost", label: "Your intro post",
        description: "Share who you are, why you started this, and what you hope it becomes. Be real, not polished.",
        placeholder: "Hey everyone, I'm [name] and here's why I built this...", rows: 8
      },
      {
        type: "list", key: "discussionPrompts", label: "Discussion prompts",
        description: "Write 3-5 conversation starters that your ideal members would actually respond to.",
        placeholder: "e.g., What's the one thing you wish someone had told you before leaving your last role?", minItems: 3, maxItems: 6
      }
    ]
  },

  "community-kickoff-event": {
    tip: "This is the moment your community goes from 'a thing you're building' to 'a room people belong to.' Make it count.",
    sections: [
      { type: "heading", text: "Plan your kickoff", description: "A 60-minute session where founding members meet each other and co-create norms." },
      { type: "prompt", key: "kickoffDate", label: "When?", placeholder: "e.g., Saturday March 15, 10am PT" },
      {
        type: "decision", key: "kickoffFormat", label: "Format",
        options: [
          { value: "zoom", title: "Zoom call", description: "Best for face-to-face connection" },
          { value: "inperson", title: "In-person meetup", description: "Highest impact, hardest to coordinate" },
          { value: "hybrid", title: "Hybrid", description: "In-person with a Zoom option" }
        ]
      },
      {
        type: "list", key: "agendaItems", label: "Agenda",
        description: "Keep it simple. Intro, icebreaker, norms discussion, what's next.",
        placeholder: "e.g., 0-10min: Welcome and why I built this", minItems: 3, maxItems: 8
      },
      {
        type: "textarea", key: "kickoffNotes", label: "Post-kickoff notes",
        description: "What went well? What surprised you? What do members want more of?",
        placeholder: "Notes...", rows: 6
      }
    ]
  },

  "community-weekly-rhythm": {
    tip: "Consistency beats intensity. One reliable weekly touchpoint is worth more than five sporadic ones.",
    sections: [
      {
        type: "decision", key: "weeklyFormat", label: "Pick your weekly touchpoint",
        options: [
          { value: "thread", title: "Weekly discussion thread", description: "Post a question every Tuesday. Low effort, high engagement." },
          { value: "coffee", title: "Virtual coffee chat", description: "30-minute open Zoom, same time every week." },
          { value: "roundup", title: "Weekly resource roundup", description: "Curate 3-5 links, tools, or recommendations." },
          { value: "spotlight", title: "Member spotlight", description: "Feature one member each week. Builds connection." }
        ]
      },
      {
        type: "prompt", key: "dayAndTime", label: "Day and time",
        description: "Pick one and commit to it for at least 8 weeks.",
        placeholder: "e.g., Every Tuesday at 9am PT"
      },
      {
        type: "textarea", key: "firstFour", label: "Plan your first 4 weeks",
        description: "Write out the topic or theme for each of the next 4 weeks.",
        placeholder: "Week 1: ...\nWeek 2: ...\nWeek 3: ...\nWeek 4: ...", rows: 8
      }
    ]
  },

  // Phase 4: Prove It's Worth Paying For

  "community-show-up-daily": {
    tip: "In the early months, your energy IS the community. One hour a day of showing up, responding, and sparking conversations is what separates communities that thrive from ones that quietly die.",
    sections: [
      { type: "heading", text: "Your daily community hour", description: "Design a sustainable daily routine you can stick to during nap time, school hours, or after bedtime." },
      {
        type: "decision", key: "dailySlot", label: "When's your hour?",
        options: [
          { value: "morning", title: "Early morning (6-7am)", description: "Before the kids are up" },
          { value: "naptime", title: "Nap time (12-2pm)", description: "The sacred window" },
          { value: "schoolhours", title: "School hours (9am-2pm)", description: "While the older kids are out" },
          { value: "evening", title: "Evening (8-9pm)", description: "After bedtime" }
        ]
      },
      {
        type: "checklist", key: "dailyChecklist", label: "Your daily checklist",
        description: "Pick 3-4 things you'll do every day in that hour.",
        items: [
          { value: "respond", label: "Respond to every new post or question" },
          { value: "prompt", label: "Post one discussion prompt or resource" },
          { value: "dm", label: "DM one member to check in" },
          { value: "connect", label: "Introduce two members who should know each other" },
          { value: "content", label: "Share one curated recommendation or resource" },
          { value: "plan", label: "Plan upcoming events or content" }
        ]
      }
    ]
  },

  "community-signature-value": {
    tip: "Every great community has one thing that members can't get anywhere else. It might be the intros you make, the products you source, or the conversations you facilitate. Find yours.",
    sections: [
      {
        type: "textarea", key: "whatMembersLove", label: "What are members responding to most?",
        description: "Look at what gets the most engagement, DMs, and 'thank you' messages. What keeps coming up?",
        placeholder: "e.g., People love the product recommendations. Every time I share a sourcing find, the thread blows up...", rows: 6
      },
      {
        type: "textarea", key: "signatureValue", label: "Your signature value",
        description: "In 1-2 sentences: what's the one thing only YOUR community provides?",
        placeholder: "e.g., Curated product sourcing from someone with actual taste, not sponsored content...", rows: 4
      },
      {
        type: "multiselect", key: "doubleDown", label: "How will you double down on this?",
        description: "Pick 1-2 ways to amplify your signature value.", max: 2,
        options: [
          { value: "weekly-feature", label: "Weekly feature or column", description: "A recurring post built around your signature" },
          { value: "exclusive-access", label: "Exclusive access or early looks", description: "Members get first dibs" },
          { value: "expert-guests", label: "Guest experts or AMAs", description: "Bring in people your members want to hear from" },
          { value: "curated-lists", label: "Curated lists or guides", description: "Package your knowledge into shareable resources" },
          { value: "live-events", label: "Live events or workshops", description: "Go deeper on what members care about most" }
        ]
      }
    ]
  },

  "community-monthly-survey": {
    tip: "A 3-question survey once a month gives you everything you need: what's working, what's not, and what they want next. Keep it short so people actually fill it out.",
    sections: [
      { type: "heading", text: "Build your monthly survey", description: "Write 3 questions you'll send every month." },
      {
        type: "list", key: "surveyQuestions", label: "Your 3 survey questions",
        description: "One about value (are you getting what you need?), one about content (what do you want more of?), and one open-ended.",
        placeholder: "e.g., What's the most valuable thing you got from the community this month?", minItems: 3, maxItems: 5
      },
      {
        type: "decision", key: "surveyTool", label: "Survey tool",
        options: [
          { value: "typeform", title: "Typeform", description: "Clean design, easy to fill out" },
          { value: "tally", title: "Tally", description: "Free, simple, gets the job done" },
          { value: "google", title: "Google Forms", description: "Everyone knows it, easy to set up" },
          { value: "inapp", title: "In-app poll", description: "If your platform supports it (Circle, Mighty)" }
        ]
      },
      {
        type: "prompt", key: "surveyDay", label: "When will you send it?",
        description: "Pick a day each month and stick to it.",
        placeholder: "e.g., Last Friday of every month"
      }
    ]
  },

  "community-accountability-pods": {
    tip: "Pods of 4-6 members create the deep connections that make people stay. The community is for discovery. The pod is for accountability.",
    sections: [
      { type: "heading", text: "Design your pod structure" },
      { type: "prompt", key: "podSize", label: "Pod size", placeholder: "e.g., 5 members per pod" },
      { type: "prompt", key: "podCadence", label: "How often do pods meet?", placeholder: "e.g., Every other week, 30 minutes" },
      {
        type: "decision", key: "podMatching", label: "How will you match people into pods?",
        options: [
          { value: "you-assign", title: "You assign them", description: "You know your members best. Curate each pod for chemistry." },
          { value: "self-select", title: "Members self-select", description: "Post pod descriptions and let members choose." },
          { value: "random", title: "Random with guardrails", description: "Random assignment but balanced by seniority or interest." }
        ]
      },
      {
        type: "textarea", key: "podFormat", label: "Pod meeting format",
        description: "Give pods a simple structure so they don't just become unstructured chats.",
        placeholder: "e.g., 5 min check-in, 10 min hot seat (one member shares a challenge), 10 min group input, 5 min commitments for next time", rows: 6
      }
    ]
  },

  // Phase 5: Scale Without Burning Out

  "community-cohort-onboarding": {
    tip: "Once you hit 30+ members, stop onboarding people one at a time. Batch new members into monthly cohorts so they bond with each other and you don't repeat yourself.",
    sections: [
      { type: "heading", text: "Design your cohort onboarding" },
      {
        type: "decision", key: "cohortFrequency", label: "How often will you onboard?",
        options: [
          { value: "monthly", title: "Monthly", description: "One cohort per month. Clean and predictable." },
          { value: "biweekly", title: "Every 2 weeks", description: "Faster growth but more work for you." },
          { value: "quarterly", title: "Quarterly", description: "Fewer, larger cohorts. More exclusive feeling." }
        ]
      },
      {
        type: "list", key: "onboardingSteps", label: "Onboarding steps for new members",
        description: "What does a new member's first week look like?",
        placeholder: "e.g., Day 1: Welcome DM with quick-start guide", minItems: 3, maxItems: 8
      },
      {
        type: "textarea", key: "welcomeSequence", label: "Welcome message sequence",
        description: "Draft the messages new cohort members receive.",
        placeholder: "Day 1: Welcome to [community]! Here's what to do first...\nDay 3: Have you introduced yourself yet?...\nDay 7: This week's discussion is about...", rows: 10
      }
    ]
  },

  "community-empower-members": {
    tip: "The best communities aren't run by one person. They're run by members who care. Give your most engaged members a title and a job.",
    sections: [
      { type: "heading", text: "Define member roles", description: "Create 2-3 roles for your most active members." },
      {
        type: "list", key: "roles", label: "Roles",
        description: "Each role should have a clear name and responsibility. Keep it lightweight so people actually say yes.",
        placeholder: "e.g., Discussion Starter: Posts one conversation prompt per week in their area of expertise", minItems: 2, maxItems: 5
      },
      {
        type: "textarea", key: "howToRecruit", label: "How will you recruit for these roles?",
        description: "Who are your most engaged members? How will you ask them?",
        placeholder: "e.g., I'll DM my top 5 most active members and ask if they'd be interested in...", rows: 4
      }
    ]
  },

  "community-raise-prices": {
    tip: "Your founding members keep their locked-in rate. New members pay the real price. This rewards early trust and reflects the value you've built.",
    sections: [
      { type: "prompt", key: "currentPrice", label: "Current founding member price", placeholder: "e.g., $25/month" },
      {
        type: "prompt", key: "newPrice", label: "New member price",
        description: "What's the price that reflects the value the community now provides?",
        placeholder: "e.g., $49/month"
      },
      {
        type: "textarea", key: "justification", label: "What justifies the higher price?",
        description: "List what's in the community now that wasn't there at launch. This becomes your sales copy.",
        placeholder: "e.g., 50+ vetted members, weekly roundtables, curated product drops, accountability pods, exclusive brand partnerships...", rows: 6
      },
      {
        type: "textarea", key: "pricingPage", label: "Draft your pricing page copy",
        description: "Write the 3-4 sentences a potential member sees before they pay.",
        placeholder: "Join [community name]: a private membership for...", rows: 8
      }
    ]
  },

  "community-build-systems": {
    tip: "If it's in your head, it's not a system. Document the 5-6 things you do every week so you could hand them off tomorrow if you needed to.",
    sections: [
      { type: "heading", text: "Your operations playbook", description: "Document what you do each week so you can delegate or automate it." },
      {
        type: "checklist", key: "weeklyOps", label: "Weekly operations",
        description: "Check off everything you do each week. Then figure out what to automate or delegate.",
        items: [
          { value: "content-curation", label: "Curate and post content/recommendations" },
          { value: "discussion-prompts", label: "Post discussion prompts" },
          { value: "member-dms", label: "DM new or quiet members" },
          { value: "event-planning", label: "Plan and host events" },
          { value: "applications", label: "Review and approve applications" },
          { value: "billing", label: "Handle billing and payments" },
          { value: "metrics", label: "Check engagement metrics" },
          { value: "partnerships", label: "Manage brand partnerships or sponsors" }
        ]
      },
      {
        type: "list", key: "automations", label: "What can you automate?",
        description: "What tools or workflows could handle the repetitive parts?",
        placeholder: "e.g., Zapier: Auto-send welcome DM when application is approved", minItems: 2, maxItems: 8
      },
      {
        type: "list", key: "delegate", label: "What can you delegate to member-leaders?",
        description: "Match items from your weekly ops to member roles.",
        placeholder: "e.g., Discussion Starter handles Tuesday threads", minItems: 1, maxItems: 5
      }
    ]
  }
};
