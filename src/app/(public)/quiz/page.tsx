"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Kid {
  age: string;
}

interface QuizAnswers {
  name: string;
  role: string;
  years: string;
  companySize: string[];
  shoulderTap: string[];
  outreachComfort: string;
  industries: string[];
  kids: Kid[];
  noKids: boolean;
  email: string;
}

interface StepConfig {
  key: string;
  question: string;
  subcopy?: string;
  type: "text" | "single" | "multi" | "kids" | "email";
  maxSelections?: number;
  options?: { label: string; description?: string }[];
  placeholder?: string;
}

const AGE_OPTIONS = ["0-2", "3-5", "6-8", "9+"];

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
    key: "kids",
    question: "Tell us about your kids",
    subcopy: "Add each child and their age range. This helps us tailor our advice to your life stage.",
    type: "kids",
  },
  {
    key: "email",
    question: "Where should we send your results?",
    subcopy:
      "We'll reveal your unfair advantage for free. Your full personalized business path and playbook are available inside Blair.",
    type: "email",
    placeholder: "you@email.com",
  },
];

function KidsStep({
  kids,
  noKids,
  onAddKid,
  onRemoveKid,
  onSetAge,
  onToggleNoKids,
}: {
  kids: Kid[];
  noKids: boolean;
  onAddKid: () => void;
  onRemoveKid: (index: number) => void;
  onSetAge: (index: number, age: string) => void;
  onToggleNoKids: () => void;
}) {
  return (
    <div className="space-y-4">
      {kids.map((kid, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-blair-sage/20 bg-blair-sage/5 px-5 py-4"
        >
          <span className="text-sm font-medium text-blair-midnight">
            Child {i + 1}
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {AGE_OPTIONS.map((age) => (
              <button
                key={age}
                onClick={() => onSetAge(i, age)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  kid.age === age
                    ? "bg-blair-sage text-white"
                    : "bg-white border border-blair-mist text-blair-charcoal/60 hover:border-blair-sage/40"
                )}
              >
                {age}
              </button>
            ))}
          </div>
          <button
            onClick={() => onRemoveKid(i)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blair-charcoal/30 transition-colors hover:bg-blair-charcoal/10 hover:text-blair-charcoal/60"
            aria-label="Remove child"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      {!noKids && (
        <button
          onClick={onAddKid}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blair-mist px-5 py-4 text-sm font-medium text-blair-charcoal/50 transition-colors hover:border-blair-sage/40 hover:text-blair-sage-dark"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {kids.length === 0 ? "Add a child" : "Add another child"}
        </button>
      )}

      <div className="pt-2">
        <button
          onClick={onToggleNoKids}
          className={cn(
            "w-full rounded-xl border px-5 py-4 text-left text-sm transition-all",
            noKids
              ? "border-blair-sage bg-blair-sage/10 text-blair-midnight font-medium"
              : "border-blair-mist bg-white text-blair-charcoal/50 hover:border-blair-sage/40"
          )}
        >
          {noKids ? "No kids" : "I don't have kids"}
        </button>
      </div>
    </div>
  );
}

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
    kids: [],
    noKids: false,
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
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
      setTimeout(() => goNext(), 250);
    },
    [currentStep.key, goNext]
  );

  const handleMultiSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => {
        const current = (prev[currentStep.key as keyof QuizAnswers]) as unknown as string[];
        const max = currentStep.maxSelections;

        if (current.includes(value)) {
          return { ...prev, [currentStep.key]: current.filter((v) => v !== value) };
        }
        if (max && current.length >= max) {
          return { ...prev, [currentStep.key]: [...current.slice(1), value] };
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

  // Kids handlers
  const handleAddKid = useCallback(() => {
    setAnswers((prev) => ({
      ...prev,
      kids: [...prev.kids, { age: "" }],
      noKids: false,
    }));
  }, []);

  const handleRemoveKid = useCallback((index: number) => {
    setAnswers((prev) => ({
      ...prev,
      kids: prev.kids.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSetKidAge = useCallback((index: number, age: string) => {
    setAnswers((prev) => ({
      ...prev,
      kids: prev.kids.map((k, i) => (i === index ? { age } : k)),
    }));
  }, []);

  const handleToggleNoKids = useCallback(() => {
    setAnswers((prev) => ({
      ...prev,
      noKids: !prev.noKids,
      kids: !prev.noKids ? [] : prev.kids,
    }));
  }, []);

  const ANALYZE_MESSAGES = [
    "Analyzing your background...",
    "Matching patterns across your experience...",
    "Scoring your advantages...",
    "Building your profile...",
  ];

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowAnalyzing(true);

    // Animate through messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < ANALYZE_MESSAGES.length) {
        setAnalyzeStep(messageIndex);
      }
    }, 900);

    try {
      // Convert kids to kidsAges format for the API
      const kidsAges = answers.noKids
        ? ["No kids"]
        : answers.kids.map((k) => k.age).filter(Boolean);

      const res = await fetch("/api/quiz/mini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, kidsAges }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();

      // Wait for animation to finish (minimum 3.5 seconds total)
      await new Promise((resolve) => setTimeout(resolve, 3500));
      clearInterval(messageInterval);

      const kidsCount = answers.noKids ? "0" : String(answers.kids.length);
      const youngestKid = answers.noKids ? "" : (answers.kids.map(k => k.age).sort()[0] || "");
      router.push(
        `/quiz/results?name=${encodeURIComponent(answers.name)}&advantage=${encodeURIComponent(data.advantageName)}&oneLiner=${encodeURIComponent(data.advantageOneLiner)}&key=${encodeURIComponent(data.advantageKey)}&role=${encodeURIComponent(answers.role)}&years=${encodeURIComponent(answers.years)}&kids=${kidsCount}&youngest=${encodeURIComponent(youngestKid)}`
      );
    } catch {
      clearInterval(messageInterval);
      setIsSubmitting(false);
      setShowAnalyzing(false);
      setAnalyzeStep(0);
      alert("Something went wrong. Please try again.");
    }
  }, [answers, isSubmitting, router, ANALYZE_MESSAGES.length]);

  const canAdvance = (() => {
    if (currentStep.type === "kids") {
      return answers.noKids || (answers.kids.length > 0 && answers.kids.every((k) => k.age));
    }
    const value = answers[currentStep.key as keyof QuizAnswers];
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

  // Analyzing animation overlay
  if (showAnalyzing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-blair-linen px-6">
        <div className="text-center animate-in fade-in duration-500">
          {/* Spinner */}
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />

          {/* Rotating messages */}
          <p
            key={analyzeStep}
            className="mt-8 text-lg font-medium text-blair-midnight animate-in fade-in duration-300"
          >
            {ANALYZE_MESSAGES[analyzeStep]}
          </p>

          {/* Progress dots */}
          <div className="mt-6 flex justify-center gap-2">
            {ANALYZE_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-500",
                  i <= analyzeStep ? "bg-blair-sage" : "bg-blair-mist"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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
                  value={answers[currentStep.key as keyof QuizAnswers] as unknown as string}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && canAdvance) goNext(); }}
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
                  onKeyDown={(e) => { if (e.key === "Enter" && canAdvance) handleSubmit(); }}
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
                  Show me my results
                </button>
              </div>
            )}

            {/* Single select (radio circles) */}
            {currentStep.type === "single" && (
              <div className="space-y-2.5">
                {currentStep.options?.map((option) => {
                  const isSelected = answers[currentStep.key as keyof QuizAnswers] === option.label;
                  return (
                    <button
                      key={option.label}
                      onClick={() => handleSingleSelect(option.label)}
                      className={cn(
                        "w-full rounded-xl border px-5 py-4 text-left text-sm leading-relaxed transition-all flex items-center gap-3",
                        isSelected
                          ? "border-blair-sage bg-blair-sage/10 text-blair-midnight"
                          : "border-blair-mist bg-white text-blair-charcoal/80 hover:border-blair-sage/40"
                      )}
                    >
                      <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected ? "border-blair-sage bg-blair-sage" : "border-blair-charcoal/20"
                      )}>
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multi select (checkboxes) */}
            {currentStep.type === "multi" && (
              <div>
                <div className="space-y-2.5">
                  {currentStep.options?.map((option) => {
                    const selected = answers[currentStep.key as keyof QuizAnswers] as unknown as string[];
                    const isSelected = selected.includes(option.label);
                    return (
                      <button
                        key={option.label}
                        onClick={() => handleMultiSelect(option.label)}
                        className={cn(
                          "w-full rounded-xl border px-5 py-4 text-left transition-all flex items-start gap-3",
                          isSelected
                            ? "border-blair-sage bg-blair-sage/10"
                            : "border-blair-mist bg-white hover:border-blair-sage/40"
                        )}
                      >
                        <div className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                          isSelected ? "border-blair-sage bg-blair-sage" : "border-blair-charcoal/20"
                        )}>
                          {isSelected && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                        <div>
                        <span
                          className={cn(
                            "text-sm font-medium leading-relaxed",
                            isSelected ? "text-blair-midnight" : "text-blair-charcoal/80"
                          )}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span
                            className={cn(
                              "mt-1.5 block text-sm leading-relaxed",
                              isSelected ? "text-blair-charcoal/60" : "text-blair-charcoal/40"
                            )}
                          >
                            {option.description}
                          </span>
                        )}
                        </div>
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

            {/* Kids step */}
            {currentStep.type === "kids" && (
              <div>
                <KidsStep
                  kids={answers.kids}
                  noKids={answers.noKids}
                  onAddKid={handleAddKid}
                  onRemoveKid={handleRemoveKid}
                  onSetAge={handleSetKidAge}
                  onToggleNoKids={handleToggleNoKids}
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
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      {canAdvance && currentStep.type !== "single" && currentStep.type !== "email" && (
        <div className="fixed bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-blair-charcoal/20">
            press <kbd className="rounded border border-blair-mist px-1.5 py-0.5 text-blair-charcoal/30">Enter ↵</kbd>
          </p>
        </div>
      )}
    </div>
  );
}
