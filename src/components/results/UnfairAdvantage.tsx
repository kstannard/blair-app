interface UnfairAdvantageProps {
  name: string;
  description: string;
  why: string;
}

export function UnfairAdvantage({
  name,
  description,
  why,
}: UnfairAdvantageProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-3xl text-blair-midnight sm:text-4xl">
          Your unfair advantage:{" "}
          <span className="text-blair-sage-dark">{name}</span>
        </h2>

        <p className="mt-8 text-base leading-relaxed text-blair-charcoal">
          {description}
        </p>

        <div className="mt-8">
          <p className="text-base leading-relaxed text-blair-charcoal">
            <strong className="text-blair-midnight">
              Why this matters for building a business.
            </strong>{" "}
            {why}
          </p>
        </div>
      </div>
    </section>
  );
}
