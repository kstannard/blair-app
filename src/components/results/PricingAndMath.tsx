import React from "react";

interface PricingTier {
  name: string;
  price: string;
}

interface PricingDetailsData {
  tiers?: PricingTier[];
  sideHustleMath?: string;
  fullCapacityMath?: string;
  momFit?: string;
}

function H3({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <h3
      className={`${first ? "mt-0" : "mt-16"} pb-3 text-2xl font-bold text-blair-midnight`}
      style={{ borderBottom: "2px solid #7E9181" }}
    >
      {children}
    </h3>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="mb-3 text-lg font-bold text-blair-midnight"
      style={{ paddingLeft: "16px", borderLeft: "3px solid #7E9181" }}
    >
      {children}
    </h4>
  );
}

function stripMarkdown(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

function renderMultiParagraph(text: string) {
  const paragraphs = stripMarkdown(text).split("\n\n").filter(Boolean);
  return paragraphs.map((p, i) => (
    <p
      key={i}
      className={`${i > 0 ? "mt-4 " : ""}text-base leading-relaxed text-blair-charcoal`}
    >
      {p}
    </p>
  ));
}

export function PricingAndMath({
  pricingDetails,
}: {
  pricingDetails: PricingDetailsData;
}) {
  const { tiers, sideHustleMath, fullCapacityMath, momFit } = pricingDetails;

  // Split momFit into two sections if it has multiple paragraphs
  // First paragraph(s) about the reality/challenge, remaining about why this path fits
  let momReality = "";
  let momWhyItFits = "";
  if (momFit) {
    const momParagraphs = momFit.split("\n\n").filter(Boolean);
    if (momParagraphs.length >= 2) {
      // First paragraph is the reality, rest is why it fits
      momReality = momParagraphs[0];
      momWhyItFits = momParagraphs.slice(1).join("\n\n");
    } else {
      momReality = momFit;
    }
  }

  return (
    <section className="pt-4 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        {/* H3: How It's Priced */}
        {tiers && tiers.length > 0 && (
          <div>
            <H3 first>How It&apos;s Priced</H3>
            <div className="mt-8 space-y-6">
              {tiers.map((tier, i) => (
                <div key={i} className="mt-8">
                  <H4>{tier.name}</H4>
                  <p className="text-base leading-relaxed text-blair-charcoal">
                    {stripMarkdown(tier.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* H3: What the Math Looks Like */}
        {(sideHustleMath || fullCapacityMath) && (
          <div>
            <H3>What the Math Looks Like</H3>

            {sideHustleMath && (
              <div className="mt-8">
                <H4>The side hustle math (where you are now)</H4>
                <p className="text-base leading-relaxed text-blair-charcoal">
                  {stripMarkdown(sideHustleMath)}
                </p>
              </div>
            )}

            {fullCapacityMath && (
              <div className="mt-8">
                <H4>The full-time math (when you&apos;re ready)</H4>
                <p className="text-base leading-relaxed text-blair-charcoal">
                  {stripMarkdown(fullCapacityMath)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* H3: Why This Works for Your Life Right Now */}
        {momFit && (
          <div>
            <H3>Why This Works for Your Life Right Now</H3>

            {momReality && (
              <div className="mt-8">
                <H4>The reality of building with young kids</H4>
                {renderMultiParagraph(momReality)}
              </div>
            )}

            {momWhyItFits && (
              <div className="mt-8">
                <H4>Why this path fits those constraints</H4>
                {renderMultiParagraph(momWhyItFits)}
              </div>
            )}

            {!momWhyItFits && !momReality && (
              <div className="mt-8">
                {renderMultiParagraph(momFit)}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
