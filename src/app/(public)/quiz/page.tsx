"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuizAnswers {
  name: string;
  role: string;
  years: string;
  companySize: string[];
  shoulderTap: string[];
  outreachComfort: string;
  industries: string[];
  kidsAges: string[];
  email: string;
}

interface StepConfig {
  key: keyof QuizAnswers;
  question: string;
  subcopy?: string;
  type: "text" | "single" | "multi" | "email";
  maxSelections?: number;
  options?: { label: string; description?: string }[];
  placeholder?: string;
}

const STEPS: StepConfig[] = [
  {
    key: "name",
    question: "What should we call you?",
    type: "text",
    placeholder: "First name",
  },
  {
    key: "role",
    question: "Which best describes your current or most recent role?",
    type: "single",
    options: [
      { label: "Product Management" },
      { label: "Engineering / Technical (incl Data)" },
      { label: "Product Marketing / Messaging" },
      { label: "Growth / Performance Marketing / Lifecycle" },
      { label: "Brand / Content / Communications" },
      { label: "Sales / Partnerships / RevOps" },
      { label: "Customer Success / Account Management" },
      { label: "Operations / BizOps / Program Management" },
      { label: "Strategy / Chief of Staff / Founder's Office" },
      { label: "Finance (FP&A, Corp Dev, Investing)" },
      { label: "Legal / Compliance" },
      { label: "People / Recruiting / HR" },
      { label: "Other" },
    ],
  },
  {
    key: "years",
    question: "How long have you been in the workforce?",
    type: "single",
    options: [
      { label: "3-5 years" },
      { label: "6-9 years" },
      { label: "10-14 years" },
      { label: "15+ years" },
    ],
  },
  {
    key: "companySize",
    question: "What size companies have you spent the most time in?",
    subcopy: "Pick up to 2",
    type: "multi",
    maxSelections: 2,
    options: [
      { label: "Early startup (0-20 people)" },
      { label: "Growing company (21-200 people)" },
      { label: "Mid-size company (201-1000 people)" },
      { label: "Enterprise (1001-10000 people)" },
      { label: "Global enterprise (10001+ people)" },
    ],
  },
  {
    key: "shoulderTap",
    question:
      "When people \"tap you on the shoulder\" for help, what kind of problem is it?",
    subcopy:
      "Think about the DMs, the \"can I pick your brain\" Slacks, or the projects you get pulled into. Pick up to 2.",
    type: "multi",
    maxSelections: 2,
    options: [
      {
        label: "The \"Fixer\" Ask",
        description:
          "Everything is a mess, can you build us a process/system that actually works?",
      },
      {
        label: "The \"Strategy\" Ask",
        description:
          "We have a big goal but no plan. Can you map out exactly how we get there?",
      },
      {
        label: "The \"Creative\" Ask",
        description:
          "We can't explain what we do. Can you write the deck/messaging/story for us?",
      },
      {
        label: "The \"Truth\" Ask",
        description:
          "The numbers don't make sense. Can you audit the data/model and tell us where the leak is?",
      },
      {
        label: "The \"People\" Ask",
        description:
          "We're hiring/scaling and it's chaotic. Can you help us build the team or culture?",
      },
    ],
  },
  {
    key: "outreachComfort",
    question: "How do you feel about reaching out to former colleagues?",
    type: "single",
    options: [
      {
        label:
          "Comfortable - I already reach out for advice / referrals / work-related opportunities",
      },
      {
        label:
          "Somewhat uncomfortable but I would do it with a script or clear ask",
      },
      {
        label:
          "Very uncomfortable - I strongly prefer not to do outbound outreach",
      },
    ],
  },
  {
    key: "industries",
    question: "Any industries you know especially well?",
    subcopy: "Pick up to 3",
    type: "multi",
    maxSelections: 3,
    options: [
      { label: "Education & Learning" },
      { label: "Energy & Utilities" },
      { label: "Financial Services & Insurance" },
      { label: "Healthcare & Life Sciences" },
      { label: "Manufacturing & Industrial" },
      { label: "Media & Marketing & Advertising" },
      { label: "Public Sector & Government" },
      { label: "Real Estate & Construction" },
      { label: "Retail & Ecommerce" },
      { label: "Transportation & Logistics & Supply Chain" },
      { label: "Generalist / Industry-Agnostic" },
      { label: "Other" },
    ],
  },
  {
    key: "kidsAges",
    question: "How old are your kids?",
    subcopy: "Select all that apply",
    type: "multi",
    options: [
      { label: "Pregnant or expecting" },
      { label: "Under 2" },
      { label: "2-5" },
      { label: "6-10" },
      { label: "11+" },
      { label: "No kids (yet)" },
    ],
  },
  {
    key: "email",
    question: "Where should we send your results?",
    subcopy:
      "We'll show you your unfair advantage and what it means for building a business.",
    type: "email",
    placeholder: "you@email.com",
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    name: "",
    role: "",
    years: "",
    companySize: [],
    shoulderTap: [],
    outreachComfort: "",
    industries: [],
    kidsAges: [],
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const currentStep = STEPS[step];
  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
    }
  }, [step, totalSteps]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleSingleSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentStep.key]: value }));
      // Auto-advance after brief delay
      setTimeout(() => goNext(), 250);
    },
    [currentStep.key, goNext]
  );

  const handleMultiSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => {
        const current = prev[currentStep.key] as string[];
        const max = currentStep.maxSelections;

        if (current.includes(value)) {
          return {
            ...prev,
            [currentStep.key]: current.filter((v) => v !== value),
          };
        }

        if (max && current.length >= max) {
          // Replace the oldest selection
          return {
            ...prev,
            [currentStep.key]: [...current.slice(1), value],
          };
        }

        return { ...prev, [currentStep.key]: [...current, value] };
      });
    },
    [currentStep.key, currentStep.maxSelections]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentStep.key]: value }));
    },
    [currentStep.key]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quiz/mini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error("Failed to submit");

      const data = await res.json();
      router.push(
        `/quiz/results?name=${encodeURIComponent(answers.name)}&advantage=${encodeURIComponent(data.advantageName)}&oneLiner=${encodeURIComponent(data.advantageOneLiner)}`
      );
    } catch {
      setIsSubmitting(false);
      alert("Something went wrong. Please try again.");
    }
  }, [answers, isSubmitting, router]);

  const canAdvance = (() => {
    const value = answers[currentStep.key];
    if (currentStep.type === "text" || currentStep.type === "email") {
      return (value as string).trim().length > 0;
    }
    if (currentStep.type === "single") {
      return (value as string).length > 0;
    }
    if (currentStep.type === "multi") {
      return (value as string[]).length > 0;
    }
    return false;
  })();

  const isEmailStep = currentStep.type === "email";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blair-mist">
        <div
          className="h-full bg-blair-sage transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
        {step > 0 && (
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-blair-charcoal/40 transition-colors hover:text-blair-charcoal/70"
          >
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* Question area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-20 sm:px-10">
        <div
          key={step}
          className={cn(
            "w-full max-w-xl",
            direction === "forward"
              ? "animate-in fade-in slide-in-from-right-4 duration-300"
              : "animate-in fade-in slide-in-from-left-4 duration-300"
          )}
        >
          {/* Step counter */}
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-blair-charcoal/30">
            {step + 1} of {totalSteps}
          </p>

          {/* Question */}
          <h1 className="font-serif text-2xl leading-snug text-blair-midnight sm:text-3xl">
            {currentStep.question}
          </h1>

          {/* Subcopy */}
          {currentStep.subcopy && (
            <p className="mt-3 text-sm leading-relaxed text-blair-charcoal/50">
              {currentStep.subcopy}
            </p>
          )}

          {/* Answer input */}
          <div className="mt-8">
            {/* Text input */}
            {currentStep.type === "text" && (
              <div>
                <input
                  type="text"
                  value={answers[currentStep.key] as string}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAdvance) goNext();
                  }}
                  placeholder={currentStep.placeholder}
                  autoFocus
                  className="w-full border-b-2 border-blair-mist bg-transparent pb-3 text-2xl text-blair-midnight outline-none placeholder:text-blair-charcoal/20 focus:border-blair-sage transition-colors"
                />
                <button
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="mt-8 rounded-lg bg-blair-sage px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Email input */}
            {currentStep.type === "email" && (
              <div>
                <input
                  type="email"
                  value={answers.email}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAdvance) handleSubmit();
                  }}
                  placeholder={currentStep.placeholder}
                  autoFocus
                  className="w-full border-b-2 border-blair-mist bg-transparent pb-3 text-2xl text-blair-midnight outline-none placeholder:text-blair-charcoal/20 focus:border-blair-sage transition-colors"
                />
                <p className="mt-3 text-xs text-blair-charcoal/30">
                  No spam, ever. Just your results.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!canAdvance || isSubmitting}
                  className="mt-8 rounded-lg bg-blair-sage px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Finding your advantage..." : "Show me my results"}
                </button>
              </div>
            )}

            {/* Single select */}
            {currentStep.type === "single" && (
              <div className="space-y-2.5">
                {currentStep.options?.map((option) => {
                  const isSelected =
                    answers[currentStep.key] === option.label;
                  return (
                    <button
                      key={option.label}
                      onClick={() => handleSingleSelect(option.label)}
                      className={cn(
                        "w-full rounded-xl border px-5 py-4 text-left text-sm leading-relaxed transition-all",
                        isSelected
                          ? "border-blair-sage bg-blair-sage/10 text-blair-midnight"
                          : "border-blair-mist bg-white text-blair-charcoal/80 hover:border-blair-sage/40"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multi select */}
            {currentStep.type === "multi" && (
              <div>
                <div className="space-y-2.5">
                  {currentStep.options?.map((option) => {
                    const selected = answers[currentStep.key] as string[];
                    const isSelected = selected.includes(option.label);
                    return (
                      <button
                        key={option.label}
                        onClick={() => handleMultiSelect(option.label)}
                        className={cn(
                          "w-full rounded-xl border px-5 py-4 text-left transition-all",
                          isSelected
                            ? "border-blair-sage bg-blair-sage/10"
                            : "border-blair-mist bg-white hover:border-blair-sage/40"
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-medium leading-relaxed",
                            isSelected
                              ? "text-blair-midnight"
                              : "text-blair-charcoal/80"
                          )}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span
                            className={cn(
                              "mt-1 block text-xs leading-relaxed",
                              isSelected
                                ? "text-blair-charcoal/60"
                                : "text-blair-charcoal/40"
                            )}
                          >
                            {option.description}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="mt-8 rounded-lg bg-blair-sage px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blair-sage-dark disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      {!isEmailStep && canAdvance && currentStep.type !== "single" && (
        <div className="fixed bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-blair-charcoal/20">
            press <kbd className="rounded border border-blair-mist px-1.5 py-0.5 text-blair-charcoal/30">Enter ↵</kbd>
          </p>
        </div>
      )}
    </div>
  );
}
