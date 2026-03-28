"use client";

import { useState } from "react";

const SHARE_MESSAGE =
  "I just did this quiz that helps you figure out what kind of business actually fits your life. It's really good. You should try it: https://hiblair.com";

export function ShareSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_MESSAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = SHARE_MESSAGE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="pb-20 pt-4">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-blair-sage/10 bg-blair-linen px-8 py-12 text-center sm:px-14">
          <h3 className="font-serif text-2xl text-blair-midnight sm:text-3xl">
            Know someone who&rsquo;d love this?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-blair-charcoal/80">
            Send the quiz to a friend who&rsquo;s been thinking about making a
            change.
          </p>

          <div className="mx-auto mt-8 max-w-lg rounded-xl bg-white/60 p-5 text-left">
            <p className="text-sm leading-relaxed text-blair-charcoal/90">
              {SHARE_MESSAGE}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg bg-blair-sage px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-blair-sage-dark"
            >
              {copied ? (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                  Copy message
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
