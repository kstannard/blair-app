import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
});

// TODO: Change back to 14900 before real launch
export const FOUNDING_PRICE_CENTS = 100; // $1 for testing
export const ORIGINAL_PRICE_CENTS = 29700;
