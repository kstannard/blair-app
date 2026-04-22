import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/ai/synthesize
 *
 * Takes 2-3 conversation captures + the user's positioning statement,
 * returns a structured synthesis: what they agreed on, where they pushed
 * back, and who raised their hand as a warm lead.
 *
 * This is the "thought partner" version — returns starting-point text
 * the user can edit, not final answers.
 */

interface ConversationCapture {
  name: string;
  gutReaction?: string;
  peopleMentioned?: string;
  pushback?: string;
  transcript?: string;
}

interface RequestBody {
  positioning: string;
  captures: ConversationCapture[];
}

interface Synthesis {
  agreement: string;
  pushback: string;
  warmLeads: string;
}

function synthesizeFromCaptures(
  positioning: string,
  captures: ConversationCapture[]
): Synthesis {
  // Pull all text from all captures
  const allReactions = captures
    .map((c) => [c.gutReaction, c.pushback, c.peopleMentioned, c.transcript].filter(Boolean).join(" "))
    .filter(Boolean);

  if (allReactions.length === 0) {
    return {
      agreement: "",
      pushback: "",
      warmLeads: "",
    };
  }

  // Extract signal from each capture
  const positiveSignals = /resonat|land|make[s]? sense|clear|specific|exactly|yes|love|right|sharp|tight|fit|sound[s]? like/i;
  const negativeSignals = /push.?back|confus|unclear|generic|vague|broad|disagree|didn't get|not sure|hmm|but|actually/i;
  const introSignals = /intro|introduce|you should talk to|my friend|colleague|know someone|connect you|send.*your way|reach out to/i;

  const agreementLines: string[] = [];
  const pushbackLines: string[] = [];
  const warmLeadLines: string[] = [];

  captures.forEach((c) => {
    const label = c.name ? c.name : "A contact";
    const text = [c.gutReaction, c.peopleMentioned, c.pushback, c.transcript]
      .filter(Boolean)
      .join(" ");

    // Split into sentence-ish chunks
    const sentences = text.split(/(?<=[.!?])\s+|\n+/).filter((s) => s.trim().length > 10);

    for (const s of sentences) {
      if (positiveSignals.test(s) && !agreementLines.some((l) => l.includes(s.slice(0, 30)))) {
        agreementLines.push(`${label}: ${s.trim()}`);
      }
      if (negativeSignals.test(s) && !pushbackLines.some((l) => l.includes(s.slice(0, 30)))) {
        pushbackLines.push(`${label}: ${s.trim()}`);
      }
      if (introSignals.test(s) && !warmLeadLines.some((l) => l.includes(s.slice(0, 30)))) {
        warmLeadLines.push(`${label}: ${s.trim()}`);
      }
    }

    // Also pull peopleMentioned specifically as warm leads
    if (c.peopleMentioned && c.peopleMentioned.trim().length > 0) {
      const mention = `${label} thought of: ${c.peopleMentioned.trim()}`;
      if (!warmLeadLines.includes(mention)) {
        warmLeadLines.push(mention);
      }
    }
  });

  return {
    agreement:
      agreementLines.slice(0, 4).join("\n") ||
      "Nothing obvious jumped out as shared. Look back at your notes for specific phrases people echoed.",
    pushback:
      pushbackLines.slice(0, 4).join("\n") ||
      "Nobody pushed back hard. Worth asking yourself if you were actually testing or selling.",
    warmLeads:
      warmLeadLines.slice(0, 5).join("\n") ||
      "Nobody raised their hand with a specific name. That's data too — your network may not be the right match for this buyer.",
  };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as RequestBody;
  const { positioning, captures } = body;

  if (!captures || captures.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 captures to synthesize" },
      { status: 400 }
    );
  }

  const synthesis = synthesizeFromCaptures(positioning || "", captures);
  return NextResponse.json(synthesis);
}
