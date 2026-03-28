import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RefineRequest {
  taskType: string;
  action: string;
  fieldName: string;
  currentValue: string;
  context?: Record<string, unknown>;
}

// Smart template refinements that use user data to improve content
function refineNiche(action: string, currentValue: string, context: Record<string, unknown>): string {
  const strengths = (context.strengths as string) || "";
  const traits = (context.traits as string) || "";

  switch (action) {
    case "sharpen": {
      // Make a niche statement more specific
      if (!currentValue.trim()) return "Try describing a specific problem you've solved at a specific type of company.";
      // Add specificity cues
      const specifics = [
        `${currentValue} - for companies in a specific growth stage`,
        `${currentValue} - with a focus on measurable outcomes`,
        `${currentValue} - targeting a specific industry vertical`,
      ];
      return specifics[Math.floor(Math.random() * specifics.length)];
    }
    case "get-specific": {
      if (!currentValue.trim()) return "Start with: 'I help [specific type of company] solve [specific problem] to achieve [specific outcome].'";
      // Narrow it down
      return `${currentValue}\n\nTo get more specific, try answering: What size company? What industry? What's the trigger that makes them need this right now?`;
    }
    case "example": {
      const examples = [
        "Helping Series A SaaS companies build their first outbound sales motion from zero to 10 qualified meetings per month.",
        "Designing the content engine that turns a founder's expertise into 3-5 inbound leads per week.",
        "Building the RevOps infrastructure that lets B2B teams go from gut-feel forecasting to data-driven pipeline management.",
        "Creating brand positioning for agencies that helps them stop competing on price and start winning on value.",
      ];
      if (strengths) {
        return `Here's an example that might resonate with your strengths (${strengths.slice(0, 80)}):\n\n${examples[Math.floor(Math.random() * examples.length)]}`;
      }
      return `Here's an example of a tight niche:\n\n${examples[Math.floor(Math.random() * examples.length)]}`;
    }
    default:
      return currentValue;
  }
}

function refinePositioning(action: string, currentValue: string, context: Record<string, unknown>): string {
  const pathSlug = (context.pathSlug as string) || "";

  switch (action) {
    case "tighter": {
      if (!currentValue.trim()) return "Start with who you help and what result you deliver. Keep it to one sentence.";
      // Strip filler words and tighten
      let tighter = currentValue
        .replace(/\b(basically|essentially|really|actually|just|simply)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      if (tighter.length > 150) {
        // Suggest a shorter version
        const sentences = tighter.split(/\.\s+/);
        if (sentences.length > 1) {
          tighter = sentences[0] + ".";
        }
      }
      return tighter;
    }
    case "different-angle": {
      if (!currentValue.trim()) return "Try leading with the outcome instead of the activity. What changes for your client after working with you?";
      // Flip the structure
      return `Try flipping it: instead of leading with what you do, lead with the transformation.\n\nOriginal: "${currentValue}"\n\nTry: "I turn [current painful state] into [desired outcome] for [specific audience]."`;
    }
    case "sound-check": {
      if (!currentValue.trim()) return "Write something first, then we'll check how it sounds.";
      const wordCount = currentValue.split(/\s+/).length;
      const issues: string[] = [];
      if (wordCount > 35) issues.push("It's a bit long. Can you say the same thing in fewer words?");
      if (!/\b(help|build|create|design|turn|transform|grow|scale|fix)\b/i.test(currentValue)) {
        issues.push("Try adding a strong action verb - help, build, create, transform.");
      }
      if (!/\b(company|companies|startup|startups|founder|founders|team|teams|leader|leaders|CEO|CMO|VP)\b/i.test(currentValue)) {
        issues.push("Who specifically do you help? Adding your audience makes it concrete.");
      }
      if (issues.length === 0) {
        return "This sounds solid. It's specific, it names an audience, and it implies a clear outcome. Read it aloud one more time - does it feel like something you'd actually say?";
      }
      return `Sound check:\n\n${issues.map((i) => `- ${i}`).join("\n")}\n\nYour current version: "${currentValue}"`;
    }
    default:
      return currentValue;
  }
}

function refineBuyerProfile(action: string, currentValue: string, context: Record<string, unknown>): string {
  const fieldName = (context.fieldName as string) || "";
  const pathSlug = (context.pathSlug as string) || "";

  switch (action) {
    case "suggest-buyer": {
      const suggestions: Record<string, string[]> = {
        "gtm-growth-strategist": [
          "VP of Sales at a Series A SaaS company with 30-80 employees",
          "Head of Growth at a B2B startup that just raised their first institutional round",
          "CRO at a company that's scaling past founder-led sales",
        ],
        "messaging-positioning": [
          "Founder of a 10-30 person agency that can't articulate what makes them different",
          "VP of Marketing at a B2B company going through a rebrand",
          "Head of Product Marketing at a startup launching into a crowded market",
        ],
        "fractional-cmo": [
          "CEO of a growth-stage company ($3M-$15M revenue) with no marketing leadership",
          "Founder who just raised a Series A and needs to build a marketing function",
          "COO at a company where the marketing team exists but has no strategic direction",
        ],
        "content-thought-leadership": [
          "Founder who has deep expertise but hasn't built a public presence yet",
          "VP of Marketing who knows content matters but can't get consistent output",
          "Executive at a professional services firm trying to become the go-to authority",
        ],
        "revenue-operations": [
          "VP of Sales at a company where CRM data is unreliable and forecasting is guesswork",
          "CRO managing 3+ teams with no shared metrics or reporting infrastructure",
          "Head of Sales Ops at a company scaling from 50 to 200 employees",
        ],
      };
      const options = suggestions[pathSlug] || [
        "A decision-maker at a company going through a growth transition",
        "Someone who just got promoted into a role that requires capabilities they don't have in-house",
        "A leader at a company that just raised funding and needs to deploy it strategically",
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    case "add-detail": {
      if (!currentValue.trim()) return "Start with their title, the type of company they're at, and what keeps them up at night.";
      return `${currentValue}\n\nTo add more detail, think about:\n- What's their biggest professional frustration right now?\n- What metric are they measured on?\n- Who do they report to (and what does that person care about)?`;
    }
    case "who-else": {
      return "Think about the secondary buyer - who else influences this decision? Common patterns:\n\n- The budget holder (often one level up from your champion)\n- The end user (the person who'll work with you day-to-day)\n- The internal skeptic (the person who needs to be convinced it's worth the investment)";
    }
    default:
      return currentValue;
  }
}

function refineGutCheck(action: string, currentValue: string, context: Record<string, unknown>): string {
  switch (action) {
    case "write-it": {
      const pathSlug = (context.pathSlug as string) || "";
      const positioning = (context.positioning as string) || "my consulting focus";
      return `Hey [name],\n\nHope you're doing well! I've been thinking about going independent and focusing on ${positioning}.\n\nBefore I go too far down this road, I'd really value your honest take. You know my work better than most people, and I trust your judgment on whether this direction makes sense.\n\nWould you have 15 minutes this week? No pitch, just a real conversation. I want the unfiltered version.\n\nThanks!`;
    }
    case "warmer": {
      if (!currentValue.trim()) return "Start with something personal - reference a shared experience or something you admire about their work.";
      // Add warmth
      let warmer = currentValue;
      if (!warmer.includes("hope you")) {
        warmer = warmer.replace(/^(Hey|Hi|Hello)\s+\[?name\]?,?\s*/i, "Hey [name],\n\nHope things are going well on your end! ");
      }
      // Replace formal phrases
      warmer = warmer
        .replace(/I would appreciate/gi, "I'd really love")
        .replace(/I am reaching out/gi, "I'm reaching out")
        .replace(/would you be willing/gi, "would you be up for")
        .replace(/at your earliest convenience/gi, "whenever works for you");
      return warmer;
    }
    case "shorten": {
      if (!currentValue.trim()) return "Nothing to shorten yet - write your message first.";
      const lines = currentValue.split("\n").filter((l) => l.trim());
      if (lines.length <= 4) return currentValue + "\n\n(This is already pretty concise!)";
      // Keep the greeting, core ask, and sign-off
      const shortened = lines.slice(0, Math.min(lines.length, 5)).join("\n\n");
      return shortened + "\n\n(Shorter messages get more replies. Keep it to 3-4 sentences if you can.)";
    }
    default:
      return currentValue;
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as RefineRequest;
  const { taskType, action, fieldName, currentValue, context = {} } = body;

  // Fetch user profile for context
  let userProfile: Record<string, string> = {};
  try {
    const recommendation = await prisma.recommendation.findFirst({
      where: { userId: session.user.id, status: "approved" },
      orderBy: { createdAt: "desc" },
      include: { user: { include: { quizResult: true } } },
    });

    if (recommendation?.user?.quizResult) {
      const qr = recommendation.user.quizResult;
      userProfile = {
        strengths: qr.strengths || "",
        traits: qr.traits || "",
        summary: qr.summary || "",
      };
    }
  } catch {
    // Continue without profile data
  }

  const enrichedContext = { ...context, ...userProfile };
  let result: string;

  switch (taskType) {
    case "niche-editor":
      result = refineNiche(action, currentValue, enrichedContext);
      break;
    case "positioning-editor":
      result = refinePositioning(action, currentValue, enrichedContext);
      break;
    case "buyer-profile-editor":
      result = refineBuyerProfile(action, currentValue, enrichedContext);
      break;
    case "gut-check":
      result = refineGutCheck(action, currentValue, enrichedContext);
      break;
    default:
      result = currentValue;
  }

  return NextResponse.json({ result });
}
