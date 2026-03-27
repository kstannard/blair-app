"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/shared/Logo";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    await signIn("credentials", {
      email: email.trim(),
      callbackUrl: "/results",
    });
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-blair-linen px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Logo className="text-4xl mb-12" />

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blair-charcoal mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-blair-charcoal placeholder:text-blair-charcoal/40 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blair-sage px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark focus:outline-none focus:ring-2 focus:ring-blair-sage/40 focus:ring-offset-2 focus:ring-offset-blair-linen disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-blair-charcoal/50">
            Enter the email you used for your quiz.
          </p>
        </div>
      </div>
    </div>
  );
}
