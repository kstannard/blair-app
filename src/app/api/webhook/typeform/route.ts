import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Typeform Webhook Endpoint
 *
 * Receives quiz submissions from Typeform when a user completes the 25-question quiz.
 * Stores the raw answers, extracts key fields, and creates an initial quiz submission
 * record for admin review.
 *
 * Flow:
 * 1. Typeform sends webhook POST with form response data
 * 2. We extract the email and all answers
 * 3. Create or find the user by email
 * 4. Store the quiz submission with raw + parsed answers
 * 5. Mark as "pending_review" for Kristin to review before scoring
 *
 * Typeform webhook payload structure:
 * {
 *   event_id: string,
 *   event_type: "form_response",
 *   form_response: {
 *     form_id: string,
 *     token: string,
 *     submitted_at: string,
 *     definition: { fields: [...] },
 *     answers: [{ field: { id, ref, type }, type, [text|choice|choices|number|email|url]: value }]
 *   }
 * }
 */

// Map of Typeform field refs to our internal question IDs
// UPDATE THESE with your actual Typeform field refs once you have them
const FIELD_MAP: Record<string, string> = {
  // Example: "abc123": "Q1_name",
  // Will be populated once we have the Typeform form structure
};

interface TypeformAnswer {
  field: { id: string; ref: string; type: string };
  type: string;
  text?: string;
  email?: string;
  url?: string;
  number?: number;
  boolean?: boolean;
  choice?: { id: string; label: string; ref: string };
  choices?: { ids: string[]; labels: string[]; refs: string[] };
}

interface TypeformWebhookPayload {
  event_id: string;
  event_type: string;
  form_response: {
    form_id: string;
    token: string;
    submitted_at: string;
    definition: {
      fields: Array<{ id: string; ref: string; title: string; type: string }>;
    };
    answers: TypeformAnswer[];
  };
}

function extractAnswerValue(answer: TypeformAnswer): string {
  switch (answer.type) {
    case "text":
      return answer.text || "";
    case "email":
      return answer.email || "";
    case "url":
      return answer.url || "";
    case "number":
      return String(answer.number || "");
    case "boolean":
      return String(answer.boolean);
    case "choice":
      return answer.choice?.label || "";
    case "choices":
      return answer.choices?.labels?.join(", ") || "";
    default:
      return JSON.stringify(answer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload: TypeformWebhookPayload = await req.json();

    // Verify this is a form response event
    if (payload.event_type !== "form_response") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { form_response } = payload;
    const { answers, definition, submitted_at, token } = form_response;

    // Extract email from answers (find the email-type answer)
    const emailAnswer = answers.find((a) => a.type === "email");
    const email = emailAnswer?.email;

    if (!email) {
      console.error("Typeform webhook: no email found in submission");
      return NextResponse.json({ error: "No email in submission" }, { status: 400 });
    }

    // Parse all answers into a structured object
    const parsedAnswers: Record<string, string> = {};
    const rawAnswers: Record<string, unknown> = {};

    for (const answer of answers) {
      const fieldRef = answer.field.ref;
      const fieldDef = definition.fields.find((f) => f.ref === fieldRef);
      const questionTitle = fieldDef?.title || fieldRef;

      parsedAnswers[fieldRef] = extractAnswerValue(answer);
      rawAnswers[fieldRef] = {
        question: questionTitle,
        answer: extractAnswerValue(answer),
        type: answer.type,
        raw: answer,
      };
    }

    // Extract name if available (look for a text field that seems like a name)
    const nameField = definition.fields.find(
      (f) =>
        f.title.toLowerCase().includes("name") &&
        !f.title.toLowerCase().includes("business") &&
        !f.title.toLowerCase().includes("company")
    );
    const name = nameField
      ? parsedAnswers[nameField.ref]
      : email.split("@")[0];

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Generate a referral code
      const referralCode = `blair-${Math.random().toString(36).substring(2, 8)}`;

      user = await prisma.user.create({
        data: {
          email,
          name,
          referralCode,
        },
      });
    }

    // Store quiz submission
    await prisma.quizSubmission.create({
      data: {
        userId: user.id,
        formId: form_response.form_id,
        responseToken: token,
        rawAnswers: JSON.stringify(rawAnswers),
        parsedAnswers: JSON.stringify(parsedAnswers),
        submittedAt: new Date(submitted_at),
        status: "pending_review",
      },
    });

    console.log(
      `Typeform submission received for ${email} (user: ${user.id})`
    );

    // TODO: In the future, auto-run the scoring engine here
    // For now, submissions are stored and Kristin reviews them manually
    // The admin panel will show pending submissions for review

    return NextResponse.json({
      ok: true,
      userId: user.id,
      email,
      status: "pending_review",
    });
  } catch (error) {
    console.error("Typeform webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Typeform sends a HEAD request to verify the webhook URL
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

// Also handle GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "typeform-webhook" });
}
