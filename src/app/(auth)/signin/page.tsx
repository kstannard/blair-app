"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
import { Logo } from "@/components/shared/Logo";

function SignInContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    errorParam === "no_order"
      ? "No paid plan found for this email. Please purchase a plan first."
      : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.ok) {
      window.location.href = "/results";
    } else {
      setError("Invalid email or password.");
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/results" });
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-blair-linen px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Logo className="text-4xl mb-12" />

          <form onSubmit={handleSubmit} className="w-full space-y-4">
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blair-charcoal mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="block w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-blair-charcoal placeholder:text-blair-charcoal/40 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blair-sage px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark focus:outline-none focus:ring-2 focus:ring-blair-sage/40 focus:ring-offset-2 focus:ring-offset-blair-linen disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-blair-charcoal/50">
            Don&apos;t have an account?{" "}
            <a
              href="https://app.hiblair.com/discover"
              className="text-blair-sage-dark hover:underline"
            >
              Get your plan
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-blair-linen">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
