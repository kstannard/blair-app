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
    case "shorten": {
      if (!currentValue.trim()) return "Nothing to shorten yet. Write your message first.";

      // Aggressive shorten: strip em dashes, remove placeholder brackets,
      // cut filler words, then keep greeting + 1-2 pitch sentences + the ask.
      const cleaned = currentValue
        .replace(/—/g, ",")
        .replace(/\[[^\]]+\]/g, "")                           // remove [placeholder] brackets
        .replace(/\bI was wondering if\b/gi, "")
        .replace(/\bI just wanted to\b/gi, "I want to")
        .replace(/\breally\s+/gi, "")
        .replace(/\bjust\s+/gi, "")
        .replace(/\bactually\s+/gi, "")
        .replace(/\bbasically\s+/gi, "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const sentences = cleaned.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
      if (sentences.length <= 3) return cleaned;

      // Keep: first sentence (greeting), longest middle sentence (pitch), last sentence (ask).
      const greeting = sentences[0];
      const ask = sentences[sentences.length - 1];
      const middle = sentences.slice(1, -1).sort((a, b) => b.length - a.length)[0] || "";

      return middle
        ? `${greeting}\n\n${middle}\n\n${ask}`
        : `${greeting}\n\n${ask}`;
    }
    case "summarize-transcript": {
      if (!currentValue.trim()) return "Paste a transcript first, then hit summarize.";
      // Pull out the meaningful lines: questions asked, reactions, key phrases.
      // This is a simple heuristic — it strips filler and extracts lines with
      // signal words. A future version could use an LLM call for real summarization.
      const lines = currentValue.split("\n").map((l) => l.trim()).filter(Boolean);
      const signalWords = /resonat|surprised|pushed back|didn't expect|interesting|love|hate|confus|unclear|strong|weak|yes|no|worried|excited|told me|said|asked|feedback/i;
      const signalLines = lines.filter((l) => signalWords.test(l));
      if (signalLines.length === 0) {
        // Fall back to first 8 non-trivial lines as bullet points
        const summary = lines
          .filter((l) => l.length > 20)
          .slice(0, 8)
          .map((l) => `- ${l.slice(0, 150)}`)
          .join("\n");
        return summary || "Couldn't pull out clear takeaways. Try highlighting the key moments manually.";
      }
      return signalLines
        .slice(0, 10)
        .map((l) => `- ${l.slice(0, 150)}`)
        .join("\n");
    }
    case "direct": {
      if (!currentValue.trim()) return "Nothing to tighten yet. Write your message first.";

      // Aggressively cut hedging, soften-to-direct replacements, remove em
      // dashes and cliché phrases. Returns a directly-usable message.
      const direct = currentValue
        .replace(/—/g, ",")                                   // em dash → comma
        .replace(/\bI was wondering if\b/gi, "")
        .replace(/\bI just wanted to\b/gi, "I want to")
        .replace(/\bI'm just\b/gi, "I'm")
        .replace(/\bI'd really love to\b/gi, "I want to")
        .replace(/\bI'd love to get your honest take\b/gi, "I want your honest take")
        .replace(/\bI would appreciate\b/gi, "")
        .replace(/\bif you don't mind\b/gi, "")
        .replace(/\bif it's not too much trouble\b/gi, "")
        .replace(/\bat your earliest convenience\b/gi, "when you can")
        .replace(/\bsorry to bother you\b/gi, "")
        .replace(/\bI hope this finds you well[.,!]?\s*/gi, "")
        .replace(/\bHope you're doing well[.,!]?\s*/gi, "")
        .replace(/\bHope things are going well[.,!]?\s*/gi, "")
        .replace(/\bgot 15 minutes\b/gi, "have time for a call")
        .replace(/\bjust a quick\b/gi, "a")
        .replace(/\breally\b/gi, "")
        .replace(/\bjust\b/gi, "")
        .replace(/\bkind of\b/gi, "")
        .replace(/\bsort of\b/gi, "")
        .replace(/\bmaybe\b/gi, "")
        .replace(/\bpossibly\b/gi, "")
        .replace(/\bperhaps\b/gi, "")
        .replace(/\ba bit\b/gi, "")
        .replace(/\bsomewhat\b/gi, "")
        .replace(/\bactually\b/gi, "")
        .replace(/\bbasically\b/gi, "")
        .replace(/  +/g, " ")
        .replace(/ ,/g, ",")
        .replace(/ \./g, ".")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      return direct;
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
      include: { user: { include: { profile: true } } },
    });

    if (recommendation?.user?.profile) {
      const qr = recommendation.user.profile;
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
