import React from "react";

interface PrimaryRecommendationProps {
  pathName: string;
  personalizedWhy: string;
}

/**
 * Parse the personalizedWhy text into sections based on known markers.
 * Returns an array of { header, body } objects.
 */
const SECTION_MARKERS = [
  { pattern: /^the big idea:\s*/i, label: "The Big Idea" },
  { pattern: /^what you build:\s*/i, label: "What You Build" },
  {
    pattern: /^who pays you\s*\(and how you find them\):\s*/i,
    label: "Who Pays You (and How You Find Them)",
  },
  { pattern: /^who pays you:\s*/i, label: "Who Pays You" },
];

function parseSections(text: string): { header: string; body: string }[] {
  // Strip markdown bold markers (**text**) before parsing
  const cleaned = text.replace(/\*\*(.*?)\*\*/g, "$1");
  const paragraphs = cleaned.split("\n\n").filter(Boolean);
  const sections: { header: string; body: string }[] = [];
  let currentHeader = "";
  let currentBody: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    let matched = false;

    for (const { pattern, label } of SECTION_MARKERS) {
      if (pattern.test(trimmed)) {
        // Save previous section
        if (currentHeader || currentBody.length > 0) {
          sections.push({ header: currentHeader, body: currentBody.join("\n\n") });
        }
        currentHeader = label;
        currentBody = [trimmed.replace(pattern, "").trim()].filter(Boolean);
        matched = true;
        break;
      }
    }

    if (!matched) {
      currentBody.push(trimmed);
    }
  }

  // Save last section
  if (currentHeader || currentBody.length > 0) {
    sections.push({ header: currentHeader, body: currentBody.join("\n\n") });
  }

  return sections;
}

function BodyText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="mt-4 text-base leading-relaxed text-blair-charcoal"
        >
          {p}
        </p>
      ))}
    </>
  );
}

export function PrimaryRecommendation({
  pathName,
  personalizedWhy,
}: PrimaryRecommendationProps) {
  const sections = parseSections(personalizedWhy);

  return (
    <section className="pt-16 pb-8">
      <div className="mx-auto max-w-3xl px-6">
        {/* Path name as category label */}
        <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
          Your Primary Recommendation
        </p>
        <h2 className="mt-4 font-serif text-4xl uppercase tracking-wide text-blair-sage-dark sm:text-5xl">
          {pathName}
        </h2>

        {/* H3: Overview grouping */}
        <div className="mt-12">
          <h3
            className="pb-3 text-2xl font-bold text-blair-midnight"
            style={{ borderBottom: "2px solid #7E9181" }}
          >
            Overview
          </h3>

          {sections.map((section, i) => (
            <div key={i} className="mt-8">
              {section.header && (
                <h4
                  className="mb-3 text-lg font-bold text-blair-midnight"
                  style={{ paddingLeft: "16px", borderLeft: "3px solid #7E9181" }}
                >
                  {section.header}
                </h4>
              )}
              <BodyText text={section.body} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
