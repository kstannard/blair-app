import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    if (!email) {
      console.error("No email in checkout session:", session.id);
      return NextResponse.json({ error: "No email" }, { status: 400 });
    }

    // Create order record
    await prisma.order.upsert({
      where: { stripeSessionId: session.id },
      update: {
        status: "paid",
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
      },
      create: {
        email,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        amount: session.amount_total ?? 14900,
        status: "paid",
        selectedAdvantage: session.metadata?.selectedAdvantage || null,
      },
    });

    // Link order to user if they already have an account
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.order.updateMany({
        where: { email, userId: null },
        data: { userId: existingUser.id },
      });
    }

    console.log(`Payment complete for ${email}, session ${session.id}`);
  }

  return NextResponse.json({ received: true });
}
