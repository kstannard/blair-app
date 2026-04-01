import { NextRequest, NextResponse } from "next/server";
import { stripe, FOUNDING_PRICE_CENTS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { advantage } = body;

    const origin = req.headers.get("origin") || "https://app.hiblair.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Blair Personalized Plan",
              description:
                "Your matched business path, clear pricing guidance, and a customized playbook built around the time you actually have.",
            },
            unit_amount: FOUNDING_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        selectedAdvantage: advantage || "",
      },
      return_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
