"use client";

import { useEffect, useState } from "react";

export function ResultsReveal({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const trigger = document.getElementById("results-content");
      if (trigger && !trigger.classList.contains("opacity-0")) {
        setVisible(true);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    // Check immediately in case already revealed
    const trigger = document.getElementById("results-content");
    if (trigger && !trigger.classList.contains("opacity-0")) {
      setVisible(true);
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 h-0 overflow-hidden"
      }`}
    >
      {children}
    </div>
  );
}
