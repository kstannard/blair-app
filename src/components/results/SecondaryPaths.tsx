"use client";

import { useState } from "react";

interface AlternativePath {
  pathSlug: string;
  pathName: string;
  altDescription: string | null;
  altWhyConsider: string | null;
  altTradeoff: string | null;
  altRevenueRange: string | null;
}

function renderMultiParagraph(text: string) {
  const paragraphs = text.split("\n\n").filter(Boolean);
  return paragraphs.map((p, i) => (
    <p
      key={i}
      className={`${i > 0 ? "mt-4 " : ""}text-base leading-relaxed text-blair-charcoal`}
    >
      {p}
    </p>
  ));
}

interface SecondaryPathsProps {
  paths: AlternativePath[];
  onChoosePath?: (slug: string, name: string) => void;
}

export function SecondaryPaths({ paths, onChoosePath }: SecondaryPathsProps) {
  const [expanded, setExpanded] = useState(false);
  const [choosing, setChoosing] = useState<string | null>(null);

  if (paths.length === 0) return null;

  const handleChoosePath = async (pathSlug: string, pathName: string) => {
    setChoosing(pathSlug);
    try {
      const res = await fetch("/api/recommendation/confirm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathSlug }),
      });
      if (res.ok) {
        setChoosing(null);
        onChoosePath?.(pathSlug, pathName);
      }
    } catch {
      setChoosing(null);
    }
  };

  return (
    <section id="secondary-paths" className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        {!expanded && (
          <div className="text-center">
            <button
              onClick={() => setExpanded(true)}
              className="text-sm font-medium text-blair-charcoal/50 underline underline-offset-4 decoration-blair-charcoal/20 hover:text-blair-charcoal/70 hover:decoration-blair-charcoal/40 transition-colors"
            >
              Not sure this is the right fit? See your backup paths
            </button>
          </div>
        )}

        {expanded && (
          <div className="space-y-16">
            <p className="text-sm text-blair-charcoal/50">
              These are strong alternatives if the primary recommendation doesn&apos;t feel right. Same strengths, different shape.
            </p>
            {paths.map((path, i) => (
              <div key={i}>
                <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
                  Alternative {i + 1}
                </p>
                <h3 className="mt-3 font-serif text-3xl uppercase tracking-wide text-blair-sage-dark sm:text-4xl">
                  {path.pathName}
                </h3>

                <div className="mt-8 space-y-6">
                  {path.altDescription && (
                    <div>
                      <p className="text-base leading-relaxed text-blair-charcoal">
                        <strong className="text-blair-midnight">The idea:</strong>{" "}
                        {path.altDescription}
                      </p>
                    </div>
                  )}

                  {path.altWhyConsider && (
                    <div>
                      <p className="text-base leading-relaxed text-blair-charcoal mb-4">
                        <strong className="text-blair-midnight">
                          Why it&apos;s worth considering:
                        </strong>
                      </p>
                      {renderMultiParagraph(path.altWhyConsider)}
                    </div>
                  )}

                  {path.altTradeoff && (
                    <div>
                      <p className="text-base leading-relaxed text-blair-charcoal mb-4">
                        <strong className="text-blair-midnight">
                          The tradeoff:
                        </strong>
                      </p>
                      {renderMultiParagraph(path.altTradeoff)}
                    </div>
                  )}

                  {path.altRevenueRange && (
                    <div>
                      <p className="text-base leading-relaxed text-blair-charcoal">
                        <strong className="text-blair-midnight">
                          Revenue range:
                        </strong>{" "}
                        {path.altRevenueRange}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleChoosePath(path.pathSlug, path.pathName)}
                    disabled={choosing !== null}
                    className="rounded-lg border-2 border-blair-sage px-6 py-3 text-sm font-semibold text-blair-sage transition-colors hover:bg-blair-sage hover:text-white disabled:opacity-50"
                  >
                    {choosing === path.pathSlug
                      ? "Loading..."
                      : "Choose this path instead"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
