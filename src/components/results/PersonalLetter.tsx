"use client";

import { useState } from "react";

export function PersonalLetter({
  firstName,
  personalIntro,
}: {
  firstName: string;
  personalIntro: string;
}) {
  const paragraphs = personalIntro.replace(/\*\*(.*?)\*\*/g, "$1").split("\n\n").filter(Boolean);
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(() => {
      document.getElementById("results-content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <>
      <section className="pb-6">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-[family-name:var(--font-cursive)] text-3xl text-blair-midnight sm:text-4xl">
            Dear {firstName},
          </p>
          <div className="mt-6 space-y-4">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-blair-charcoal"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {!revealed && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleReveal}
                className="group flex items-center gap-2 rounded-lg bg-blair-sage px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blair-sage-dark"
              >
                Tell me more
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* This div is always in the DOM but content is hidden until revealed */}
      <div
        id="results-content"
        className={`scroll-mt-32 transition-opacity duration-700 ${
          revealed ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      />
    </>
  );
}
