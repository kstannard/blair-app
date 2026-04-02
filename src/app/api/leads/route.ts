import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, source, advantageKey } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already a paying user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return NextResponse.json({
        ok: true,
        alreadyCustomer: true,
        message: "You already have a Blair account! Sign in to see your results.",
      });
    }

    // Upsert the lead
    const lead = await prisma.emailLead.upsert({
      where: { email: normalizedEmail },
      update: {
        // If they come back, update their advantage context but don't reset progress
        advantageKey: advantageKey || undefined,
        source: source || undefined,
      },
      create: {
        email: normalizedEmail,
        firstName: firstName?.trim() || null,
        source: source || "mini-course",
        advantageKey: advantageKey || null,
        currentDay: 0,
        status: "active",
      },
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      isNew: lead.currentDay === 0,
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
