import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TYPEFORM_FIELD_MAP } from "@/lib/typeform-fields";
import { scoreFullQuiz, type FullQuizAnswers } from "@/lib/scoring/full-quiz-scorer";
import { enrichPerson } from "@/lib/enrichment";
import { generateRecommendationDraft } from "@/lib/recommendation-generator";
import { UNFAIR_ADVANTAGES } from "@/lib/scoring/unfair-advantages";

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
    hidden?: Record<string, string>;
    definition: {
      fields: Array<{ id: string; ref: string; title: string; type: string }>;
    };
    answers: TypeformAnswer[];
  };
}

function extractAnswerValue(answer: TypeformAnswer): string {
  switch (answer.type) {
    case "text": return answer.text || "";
    case "email": return answer.email || "";
    case "url": return answer.url || "";
    case "number": return String(answer.number || "");
    case "boolean": return String(answer.boolean);
    case "choice": return answer.choice?.label || "";
    case "choices": return answer.choices?.labels?.join(", ") || "";
    default: return JSON.stringify(answer);
  }
}

function extractMultiSelect(answer: TypeformAnswer): string[] {
  if (answer.type === "choices") return answer.choices?.labels || [];
  if (answer.type === "choice") return answer.choice?.label ? [answer.choice.label] : [];
  return [];
}

/**
 * Map raw Typeform answers to our internal FullQuizAnswers shape.
 */
function mapToQuizAnswers(
  parsedAnswers: Record<string, TypeformAnswer>,
  rawValues: Record<string, string>
): Partial<FullQuizAnswers> {
  const get = (quizKey: string): TypeformAnswer | undefined => {
    for (const [ref, mapping] of Object.entries(TYPEFORM_FIELD_MAP)) {
      if (mapping.quizKey === quizKey && parsedAnswers[ref]) {
        return parsedAnswers[ref];
      }
    }
    return undefined;
  };
  const str = (key: string) => {
    const a = get(key);
    return a ? extractAnswerValue(a) : "";
  };
  const multi = (key: string) => {
    const a = get(key);
    return a ? extractMultiSelect(a) : [];
  };

  return {
    Q1_name: str("Q1_name"),
    Q2_role: str("Q2_role"),
    Q3_years: str("Q3_years"),
    Q4_company_size: multi("Q4_company_size"),
    Q5_industries: multi("Q5_industries"),
    Q6_business_models: multi("Q6_business_models"),
    Q7_shoulder_tap: multi("Q7_shoulder_tap"),
    Q8_weirdly_good: str("Q8_weirdly_good"),
    Q9_managing: str("Q9_managing"),
    Q10_work_mode: str("Q10_work_mode"),
    Q11_energy_drains: multi("Q11_energy_drains"),
    Q12_same_or_different: str("Q12_same_or_different"),
    Q13_blocker: str("Q13_blocker"),
    Q14_interests: multi("Q14_interests"),
    Q15_scenario: str("Q15_scenario"),
    Q16_success: str("Q16_success"),
    Q17_avoid: multi("Q17_avoid"),
    Q18_income_timeline: str("Q18_income_timeline"),
    Q19_zero_income: str("Q19_zero_income"),
    Q20_capital: str("Q20_capital"),
    Q21_borrowing: str("Q21_borrowing"),
    Q22_network: multi("Q22_network"),
    Q23_outreach: str("Q23_outreach"),
    Q24_visibility: str("Q24_visibility"),
    Q25_time: str("Q25_time"),
    Q26_conditions: str("Q26_conditions"),
    Q27_kids_ages: str("Q27_kids_ages"),
    Q28_linkedin: str("Q28_linkedin"),
    Q29_other_links: str("Q29_other_links"),
  };
}

/**
 * Send a review notification email to Kristin via a simple fetch to a
 * serverless mail endpoint. Uses Resend if RESEND_API_KEY is set,
 * otherwise logs to console.
 */
async function sendReviewNotification(params: {
  userName: string;
  userEmail: string;
  userId: string;
  advantageName: string;
  pathName: string;
}) {
  const { userName, userEmail, userId, advantageName, pathName } = params;
  const reviewUrl = `https://app.hiblair.com/admin/users/${userId}`;
  const subject = `Blair: New quiz submission from ${userName} — ready to review`;
  const body = `${userName} (${userEmail}) just completed the Blair quiz.

Auto-scored:
- Unfair advantage: ${advantageName}
- Primary path: ${pathName}

Review and approve their recommendation:
${reviewUrl}

This is an auto-generated draft. Nothing is live until you approve it.`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Blair <noreply@hiblair.com>",
          to: "kristin@hiblair.com",
          subject,
          text: body,
        }),
      });
    } catch (err) {
      console.error("Failed to send review notification email:", err);
    }
  } else {
    // Log to console so it shows in Vercel logs
    console.log("=== REVIEW NOTIFICATION (no RESEND_API_KEY) ===");
    console.log(body);
    console.log("================================================");
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload: TypeformWebhookPayload = await req.json();

    if (payload.event_type !== "form_response") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { form_response } = payload;
    const { answers, definition, submitted_at, hidden } = form_response;

    // Extract email: check hidden fields first (passed from our app), then answer fields
    const hiddenEmail = hidden?.email;
    const emailAnswer = answers.find((a) => a.type === "email");
    const email = hiddenEmail || emailAnswer?.email;
    if (!email) {
      console.error("Typeform webhook: no email found");
      return NextResponse.json({ error: "No email in submission" }, { status: 400 });
    }

    // Build answer maps
    const parsedAnswersByRef: Record<string, TypeformAnswer> = {};
    const rawValues: Record<string, string> = {};

    for (const answer of answers) {
      parsedAnswersByRef[answer.field.ref] = answer;
      rawValues[answer.field.ref] = extractAnswerValue(answer);
    }

    // Extract name from Q1_name answer (first quiz question: "What should we call you?")
    const quizName = rawValues[
      Object.keys(TYPEFORM_FIELD_MAP).find(
        (ref) => TYPEFORM_FIELD_MAP[ref].quizKey === "Q1_name"
      ) || ""
    ] || "";

    // Dedup: skip if we already processed this Typeform submission
    const responseToken = form_response.token;
    const existingSub = await prisma.quizSubmission.findFirst({
      where: { responseToken },
    });
    if (existingSub) {
      console.log(`Typeform webhook: already processed token ${responseToken}, skipping`);
      return NextResponse.json({ ok: true, skipped: true, reason: "duplicate" });
    }

    // Find user — do NOT create users here (they sign up via /welcome after payment)
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Typeform webhook: no user found for ${email}, skipping (they'll submit after signup)`);
      return NextResponse.json({ ok: true, skipped: true, reason: "no_user" });
    }
    if (quizName) {
      // Update name from quiz answer (it's what the user wants to be called)
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: quizName },
      });
    }

    // Store quiz submission
    await prisma.quizSubmission.create({
      data: {
        user: { connect: { id: user.id } },
        responseToken,
        answers: JSON.stringify(rawValues),
        rawAnswers: JSON.stringify(parsedAnswersByRef),
        submittedAt: new Date(submitted_at),
        source: "typeform",
        status: "pending_review",
      },
    });

    // Map answers to our scoring format
    const quizAnswers = mapToQuizAnswers(parsedAnswersByRef, rawValues) as FullQuizAnswers;

    // Score the quiz
    const scoring = scoreFullQuiz(quizAnswers);
    const advantage = UNFAIR_ADVANTAGES[scoring.primaryAdvantage.key];

    console.log(`Scored ${email}: advantage=${scoring.primaryAdvantage.name}, path=${scoring.primaryPath.pathName}`);

    // Enrich — do this in parallel with scoring (already scored above)
    const enrichment = await enrichPerson({
      name: quizAnswers.Q1_name || quizName,
      role: quizAnswers.Q2_role,
      linkedinUrl: quizAnswers.Q28_linkedin,
      otherLinks: quizAnswers.Q29_other_links,
    });

    // Find the primary path in the DB
    const primaryPath = await prisma.businessPath.findFirst({
      where: { slug: scoring.primaryPath.pathSlug },
    });

    // Generate recommendation copy via Claude
    let recommendation;
    try {
      const draft = await generateRecommendationDraft(quizAnswers, scoring, enrichment);

      // Build UserProfile
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          traits: JSON.stringify([
            quizAnswers.Q10_work_mode,
            quizAnswers.Q12_same_or_different,
            quizAnswers.Q24_visibility,
          ].filter(Boolean)),
          strengths: JSON.stringify([
            ...quizAnswers.Q7_shoulder_tap,
            quizAnswers.Q8_weirdly_good,
            quizAnswers.Q9_managing,
            ...quizAnswers.Q6_business_models,
          ].filter(Boolean)),
          constraints: JSON.stringify([
            ...quizAnswers.Q11_energy_drains,
            ...quizAnswers.Q17_avoid,
            quizAnswers.Q25_time ? `${quizAnswers.Q25_time} per week` : "",
            quizAnswers.Q27_kids_ages ? `Kids: ${quizAnswers.Q27_kids_ages}` : "",
            quizAnswers.Q13_blocker,
          ].filter(Boolean)),
          summary: [
            `${quizAnswers.Q1_name || quizName}.`,
            quizAnswers.Q2_role,
            quizAnswers.Q3_years ? `${quizAnswers.Q3_years} experience.` : null,
            enrichment.linkedinData?.currentRole
              ? `Currently ${enrichment.linkedinData.currentRole} at ${enrichment.linkedinData.currentCompany}.`
              : null,
            quizAnswers.Q12_same_or_different
              ? `Wants: ${quizAnswers.Q12_same_or_different.toLowerCase()}.`
              : null,
            quizAnswers.Q13_blocker ? `Main blocker: ${quizAnswers.Q13_blocker.toLowerCase()}.` : null,
            quizAnswers.Q27_kids_ages ? `Kids: ${quizAnswers.Q27_kids_ages}.` : null,
            quizAnswers.Q25_time ? `Available: ${quizAnswers.Q25_time.toLowerCase()}.` : null,
            quizAnswers.Q8_weirdly_good
              ? `Weirdly good at: ${quizAnswers.Q8_weirdly_good.substring(0, 150)}`
              : null,
          ].filter(Boolean).join(" "),
          unfairAdvantageName: advantage.name,
          unfairAdvantageDescription: advantage.description,
          unfairAdvantageEvidence: scoring.primaryAdvantage.evidence.join(". "),
          unfairAdvantageWhy: advantage.description,
          linkedinSummary: enrichment.linkedinData
            ? `${enrichment.linkedinData.currentRole} at ${enrichment.linkedinData.currentCompany}. ${enrichment.linkedinData.summary?.substring(0, 300)}`
            : null,
          notableExperience: enrichment.linkedinData
            ? JSON.stringify(enrichment.linkedinData.experience.slice(0, 5).map((e) => `${e.title} at ${e.company}`))
            : JSON.stringify([]),
        },
        update: {
          unfairAdvantageName: advantage.name,
          unfairAdvantageDescription: advantage.description,
          unfairAdvantageEvidence: scoring.primaryAdvantage.evidence.join(". "),
          unfairAdvantageWhy: advantage.description,
          linkedinSummary: enrichment.linkedinData
            ? `${enrichment.linkedinData.currentRole} at ${enrichment.linkedinData.currentCompany}. ${enrichment.linkedinData.summary?.substring(0, 300)}`
            : undefined,
        },
      });

      // Create Recommendation (draft — not visible to user until approved)
      recommendation = await prisma.recommendation.create({
        data: {
          userId: user.id,
          primaryPathId: primaryPath?.id ?? scoring.primaryPath.pathSlug,
          status: "draft",
          personalIntro: draft.personalIntro,
          personalizedWhy: draft.personalizedWhy,
          pricingDetails: JSON.stringify(draft.pricingDetails),
        },
      });

      // Create RecommendationPath records (primary + alts)
      const allPaths = [scoring.primaryPath, ...scoring.alternativePaths];
      for (const scoredPath of allPaths) {
        const dbPath = await prisma.businessPath.findFirst({
          where: { slug: scoredPath.pathSlug },
        });
        if (dbPath) {
          // Find generated alt path copy if available
          const altCopy = draft.alternativePaths?.find(
            (ap) => ap.pathName === scoredPath.pathName
          );
          await prisma.recommendationPath.create({
            data: {
              recommendationId: recommendation.id,
              pathId: dbPath.id,
              rank: scoredPath.rank,
              fitScore: scoredPath.fitScore,
              altDescription: altCopy?.altDescription || (scoredPath.rank > 1 ? scoredPath.pathName : null),
              altWhyConsider: altCopy?.altWhyConsider || null,
              altTradeoff: altCopy?.altTradeoff || null,
              altRevenueRange: altCopy?.altRevenueRange || null,
            },
          });
        }
      }

      console.log(`Draft recommendation created for ${email} (rec: ${recommendation.id})`);
    } catch (err) {
      console.error("Failed to generate recommendation draft:", err);
      // Non-fatal — quiz is stored, just no draft yet
    }

    // Send review notification to Kristin
    await sendReviewNotification({
      userName: quizAnswers.Q1_name || quizName,
      userEmail: email,
      userId: user.id,
      advantageName: scoring.primaryAdvantage.name,
      pathName: scoring.primaryPath.pathName,
    });

    return NextResponse.json({
      ok: true,
      userId: user.id,
      email,
      status: "draft",
      advantage: scoring.primaryAdvantage.name,
      path: scoring.primaryPath.pathName,
    });
  } catch (error) {
    console.error("Typeform webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "typeform-webhook" });
}
