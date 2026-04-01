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

          {/* Google sign-in */}
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-blair-mist bg-white px-4 py-3 text-sm font-medium text-blair-charcoal transition-colors hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-blair-mist" />
            <span className="text-xs text-blair-charcoal/30">or</span>
            <div className="h-px flex-1 bg-blair-mist" />
          </div>

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
