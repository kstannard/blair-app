"use client";

import { useState, useEffect } from "react";

export function QuizEmbed({
  typeformUrl,
  firstName,
}: {
  typeformUrl: string;
  firstName: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      // Typeform sends a message when the form is submitted
      if (
        e.data?.type === "form-submit" ||
        (typeof e.data === "string" && e.data.includes("form-submit"))
      ) {
        setSubmitted(true);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto max-w-md text-center px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blair-sage/10 mb-6">
            <svg
              className="h-8 w-8 text-blair-sage"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-blair-midnight">
            {firstName ? `Got it, ${firstName}.` : "Got it."}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blair-charcoal/60">
            We&apos;re reviewing your answers and building a recommendation
            matched to your skills, your schedule, and your life.
          </p>
          <p className="mt-6 text-sm text-blair-charcoal/40">
            You&apos;ll get an email within 48 hours when your plan is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-blair-mist bg-white overflow-hidden shadow-sm"
      style={{ height: "80vh", maxHeight: "800px" }}
    >
      <iframe
        src={typeformUrl}
        className="h-full w-full border-0"
        allow="camera; microphone; autoplay; encrypted-media;"
        title="Blair Quiz"
      />
    </div>
  );
}
