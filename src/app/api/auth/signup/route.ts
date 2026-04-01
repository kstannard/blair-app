import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, sessionId } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify they have a paid order
    const order = await prisma.order.findFirst({
      where: {
        email: normalizedEmail,
        status: "paid",
        ...(sessionId ? { stripeSessionId: sessionId } : {}),
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No paid order found for this email. Please purchase a plan first." },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // If they already have a password, they should sign in instead
      if (existingUser.password) {
        return NextResponse.json(
          { error: "Account already exists. Please sign in instead." },
          { status: 409 }
        );
      }

      // User exists without password (e.g., created via webhook before)
      // Set their password now
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          name: name || existingUser.name,
        },
      });

      // Link order
      await prisma.order.updateMany({
        where: { email: normalizedEmail, userId: null },
        data: { userId: existingUser.id },
      });

      return NextResponse.json({ ok: true, userId: existingUser.id });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || null,
        password: hashedPassword,
      },
    });

    // Link order to user
    await prisma.order.updateMany({
      where: { email: normalizedEmail, userId: null },
      data: { userId: user.id },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
