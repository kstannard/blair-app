import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreMiniQuiz, MiniQuizAnswers } from "@/lib/scoring/mini-quiz-scorer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      role,
      years,
      companySize,
      shoulderTap,
      outreachComfort,
      industries,
      kidsAges,
    } = body as MiniQuizAnswers;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Score the unfair advantage
    const advantage = scoreMiniQuiz({
      name,
      email,
      role,
      years,
      companySize: companySize || [],
      shoulderTap: shoulderTap || [],
      outreachComfort: outreachComfort || "",
      industries: industries || [],
      kidsAges: kidsAges || [],
    });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const referralCode = `blair-${Math.random().toString(36).substring(2, 8)}`;
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          referralCode,
        },
      });
    } else if (name && !user.name) {
      // Update name if we have one and they didn't before
      await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    // Build parsedAnswers in the same format as the full quiz
    const parsedAnswers = {
      Q1_name: name,
      Q2_role: role,
      Q3_years: years,
      Q4_company_size: JSON.stringify(companySize),
      Q5_industries: JSON.stringify(industries),
      Q7_shoulder_tap: JSON.stringify(shoulderTap),
      Q23_outreach: outreachComfort,
      Q27_kids_ages: JSON.stringify(kidsAges),
    };

    // Save quiz submission
    const submission = await prisma.quizSubmission.create({
      data: {
        user: { connect: { id: user.id } },
        answers: JSON.stringify(body),
        parsedAnswers: JSON.stringify(parsedAnswers),
        source: "mini-quiz",
        status: "pending_purchase",
      },
    });

    console.log(
      `Mini quiz submitted: ${email} (user: ${user.id}) -> ${advantage.name}`
    );

    return NextResponse.json({
      advantageName: advantage.name,
      advantageOneLiner: advantage.oneLiner,
      advantageKey: advantage.key,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Mini quiz submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
