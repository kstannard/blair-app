"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PathInfo {
  slug: string;
  name: string;
}

interface ResultsCTAProps {
  primaryPath: PathInfo;
  confirmedPath: PathInfo | null;
}

export function ResultsCTA({ primaryPath, confirmedPath }: ResultsCTAProps) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const activePath = confirmedPath ?? primaryPath;

  const handleGoToPlaybook = async () => {
    setNavigating(true);
    try {
      // If the user hasn't explicitly confirmed via SecondaryPaths,
      // confirm the primary path before navigating
      if (!confirmedPath) {
        const res = await fetch("/api/recommendation/confirm", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathSlug: primaryPath.slug }),
        });
        if (!res.ok) {
          setNavigating(false);
          return;
        }
      }
      router.push("/playbook");
    } catch {
      setNavigating(false);
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl bg-blair-linen-warm px-8 py-14 text-center sm:px-14">
          <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
            {confirmedPath ? "Your chosen path" : "Your recommended path"}
          </p>
          <h2 className="mt-4 font-serif text-3xl text-blair-midnight sm:text-4xl">
            {activePath.name}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-blair-charcoal">
            Your personalized playbook is ready. Step-by-step guidance,
            tailored to your path, mom life, and your strengths.
          </p>

          <div className="mt-8">
            <button
              onClick={handleGoToPlaybook}
              disabled={navigating}
              className="inline-block rounded-lg bg-blair-sage px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-blair-sage-dark disabled:opacity-50"
            >
              {navigating ? "Loading..." : "Go to playbook"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
