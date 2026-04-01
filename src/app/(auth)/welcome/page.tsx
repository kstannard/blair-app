"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
import { Logo } from "@/components/shared/Logo";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [paymentValid, setPaymentValid] = useState(false);

  // Verify payment and fetch email from the checkout session
  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      return;
    }
    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "paid" && data.email) {
          setPaymentValid(true);
          setCheckoutEmail(data.email);
          setEmail(data.email);
        }
        setVerifying(false);
      })
      .catch(() => {
        setVerifying(false);
      });
  }, [sessionId]);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        sessionId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setIsLoading(false);
      return;
    }

    // Auto sign in after account creation
    const signInResult = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (signInResult?.ok) {
      router.push("/quiz");
    } else {
      setError("Account created. Please sign in.");
      router.push("/signin");
    }
  }

  async function handleGoogleSignup() {
    await signIn("google", { callbackUrl: "/quiz" });
  }

  if (verifying) {
    return (
      <div className="flex min-h-full items-center justify-center bg-blair-linen px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
      </div>
    );
  }

  if (!sessionId || !paymentValid) {
    return (
      <div className="flex min-h-full items-center justify-center bg-blair-linen px-4">
        <div className="w-full max-w-sm text-center">
          <Logo className="text-4xl mb-8" />
          <p className="text-blair-charcoal/60">
            Something went wrong. Please try purchasing again.
          </p>
          <a
            href="/discover"
            className="mt-6 inline-block text-sm text-blair-sage-dark hover:underline"
          >
            Back to Blair
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-blair-linen px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Logo className="text-4xl mb-6" />

          <div className="w-full rounded-2xl border border-green-200 bg-green-50 px-5 py-4 mb-8">
            <p className="text-sm font-medium text-green-800">
              Payment confirmed
            </p>
            <p className="mt-0.5 text-xs text-green-600">
              Create your account to get started with your personalized plan.
            </p>
          </div>

          {/* Email + password form */}
          <form onSubmit={handleEmailSignup} className="w-full space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blair-charcoal mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                readOnly={!!checkoutEmail}
                className="block w-full rounded-lg border border-blair-mist bg-white px-4 py-3 text-blair-charcoal placeholder:text-blair-charcoal/40 focus:border-blair-sage focus:outline-none focus:ring-2 focus:ring-blair-sage/20 transition-colors read-only:bg-gray-50 read-only:text-blair-charcoal/60"
              />
              {checkoutEmail && (
                <p className="mt-1 text-xs text-blair-charcoal/40">
                  This is the email you used at checkout.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blair-charcoal mb-1.5"
              >
                Create a password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
              {isLoading ? "Creating account..." : "Create account and start quiz"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-blair-charcoal/40 leading-relaxed">
            Already have an account?{" "}
            <a href="/signin" className="text-blair-sage-dark hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-blair-linen">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
