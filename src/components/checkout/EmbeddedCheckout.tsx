"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout as StripeEmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function EmbeddedCheckout({ advantage }: { advantage: string }) {
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ advantage }),
    });
    const data = await res.json();
    return data.clientSecret;
  }, [advantage]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <StripeEmbeddedCheckout className="rounded-2xl overflow-hidden" />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
