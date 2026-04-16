import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEngagementCatalog } from "@/lib/pricing/engagement-catalog";

/**
 * POST /api/ai/engagement-shapes
 *
 * Takes the user's step 2 selections (problems that light them up) +
 * their role category, and returns 2-3 personalized engagement shapes
 * with real pricing — derived from a researched catalog, not invented.
 *
 * The "AI" here is selection + reframing: pick the engagement shapes
 * from the catalog that best match the selected skills, then rewrite
 * the descriptions to reference those specific skills.
 */

interface RequestBody {
  selectedChips: string[];
  roleCategory: string;
  pathSlug: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as RequestBody;
  const { selectedChips, roleCategory, pathSlug } = body;

  if (!selectedChips || selectedChips.length === 0) {
    return NextResponse.json({ error: "No chips selected" }, { status: 400 });
  }

  // Get the researched engagement catalog for this role
  const catalog = getEngagementCatalog(roleCategory);

  // Score each catalog entry by keyword overlap with selected chips
  const chipText = selectedChips.join(" ").toLowerCase();
  const scored = catalog.map((entry) => {
    let score = 0;
    for (const kw of entry.matchKeywords) {
      if (chipText.includes(kw)) score++;
    }
    return { entry, score };
  });

  // Sort by relevance, take top 2-3
  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.slice(0, 3).filter((s) => s.score > 0);

  // If nothing matched keywords, take the top 2 by default priority
  const results =
    topMatches.length >= 2
      ? topMatches.map((s) => s.entry)
      : catalog.slice(0, 2);

  // Personalize the descriptions to reference the user's specific skills.
  // This is a simple template-based personalization — not an LLM call yet.
  // If we add Anthropic API later, the prompt goes here.
  const personalized = results.map((entry) => {
    // Build a "because you said..." connection
    const matchedChips = selectedChips.filter((chip) =>
      entry.matchKeywords.some((kw) => chip.toLowerCase().includes(kw))
    );
    const connectionPhrase =
      matchedChips.length > 0
        ? `This connects to what you said about ${matchedChips[0].toLowerCase().slice(0, 60)}${matchedChips[0].length > 60 ? "..." : ""}.`
        : "";

    return {
      title: entry.name,
      pricing: entry.pricing,
      scope: entry.scope,
      duration: entry.duration,
      description: entry.description,
      connection: connectionPhrase,
      buyerTitle: entry.buyerTitle,
    };
  });

  return NextResponse.json({ engagements: personalized });
}
