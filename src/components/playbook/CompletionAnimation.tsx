"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { getQuip } from "@/lib/quips";

interface CompletionAnimationProps {
  show: boolean;
  isLastTask: boolean;
  nextTaskSlug?: string;
  onAutoAdvance?: () => void;
}

function fireConfetti() {
  import("canvas-confetti").then((confettiModule) => {
    const confetti = confettiModule.default;

    // First burst - center
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#7E9181", "#1F2041", "#E9E6E1", "#B84A6B", "#FFFCF7"],
      ticks: 120,
      gravity: 1.2,
      scalar: 0.9,
    });

    // Second burst - slightly delayed, from sides
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#7E9181", "#1F2041", "#E9E6E1"],
        ticks: 100,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#7E9181", "#1F2041", "#E9E6E1"],
        ticks: 100,
      });
    }, 150);
  });
}

function fireBigConfetti() {
  import("canvas-confetti").then((confettiModule) => {
    const confetti = confettiModule.default;
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#7E9181", "#1F2041", "#E9E6E1", "#B84A6B"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#7E9181", "#1F2041", "#E9E6E1", "#B84A6B"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  });
}

export function CompletionAnimation({
  show,
  isLastTask,
  nextTaskSlug,
  onAutoAdvance,
}: CompletionAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "check" | "transitioning">("idle");
  const [quip, setQuip] = useState("");

  const handleShow = useCallback(() => {
    if (isLastTask) {
      setQuip(getQuip("phase-complete"));
      fireBigConfetti();
    } else {
      setQuip(getQuip("task-complete"));
      fireConfetti();
    }
    setPhase("check");
  }, [isLastTask]);

  useEffect(() => {
    if (!show) {
      setPhase("idle");
      return;
    }

    handleShow();

    const advanceTimer = setTimeout(() => {
      if (!isLastTask && nextTaskSlug && onAutoAdvance) {
        setPhase("transitioning");
        setTimeout(() => {
          onAutoAdvance();
        }, 400);
      }
    }, 2200);

    return () => {
      clearTimeout(advanceTimer);
    };
  }, [show, isLastTask, nextTaskSlug, onAutoAdvance, handleShow]);

  if (!show) return null;

  // Phase complete celebration
  if (isLastTask && phase === "check") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="text-center animate-in zoom-in-75 duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blair-sage/10">
            <svg
              className="h-10 w-10 text-blair-sage animate-in zoom-in-50 duration-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="mt-6 font-serif text-2xl text-blair-midnight">
            Phase 1 complete!
          </p>
          <p className="mt-3 max-w-sm mx-auto text-sm leading-relaxed text-blair-charcoal/60">
            {quip}
          </p>
        </div>
      </div>
    );
  }

  // Task complete with quip
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm",
        "animate-in fade-in duration-200",
        phase === "transitioning" && "animate-out fade-out duration-400"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3",
          "animate-in zoom-in-75 duration-500",
          phase === "transitioning" && "animate-out slide-out-to-left-8 duration-400"
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blair-sage/10">
          <svg
            className="h-8 w-8 text-blair-sage animate-in zoom-in-50 duration-500"
            style={{ animationDelay: "100ms" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="max-w-xs text-center text-sm font-medium text-blair-charcoal/70">
          {quip}
        </p>
      </div>
    </div>
  );
}
