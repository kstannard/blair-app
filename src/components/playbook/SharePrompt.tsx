"use client";

import { useState } from "react";

const SHARE_MESSAGE =
  "This helped me finally get clear on what I'm building on the side. You should check it out: https://hiblair.com";

const ENCODED_MESSAGE = encodeURIComponent(SHARE_MESSAGE);

export function SharePrompt() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_MESSAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
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
    <div className="rounded-xl border border-blair-sage/10 bg-white/40 px-6 py-8 text-center">
      <p className="font-serif text-xl text-blair-midnight sm:text-2xl">
        Know a mom who&apos;s been thinking about this?
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-blair-charcoal/60">
        Send her a text. It takes 10 seconds.
      </p>

      <div className="mx-auto mt-5 max-w-md rounded-lg bg-blair-mist/40 px-4 py-3 text-left">
        <p className="text-sm leading-relaxed text-blair-charcoal/80">
          {SHARE_MESSAGE}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <a
          href={`sms:?body=${ENCODED_MESSAGE}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blair-sage px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
        >
          {/* Chat bubble / text icon */}
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
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          Text
        </a>

        <a
          href={`https://wa.me/?text=${ENCODED_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blair-sage px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark"
        >
          {/* WhatsApp icon */}
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          WhatsApp
        </a>
      </div>

      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blair-charcoal/40 transition-colors hover:text-blair-charcoal/70"
      >
        {copied ? (
          <>
            <svg
              className="h-3.5 w-3.5"
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
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}
