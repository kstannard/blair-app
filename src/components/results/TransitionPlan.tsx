interface TransitionStep {
  title: string;
  description: string;
}

export function TransitionPlan({ steps }: { steps: TransitionStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-3xl text-blair-midnight sm:text-4xl">
          The transition plan
        </h2>

        <div className="mt-8 space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-10">
              <span className="absolute left-0 top-1 font-serif text-2xl text-blair-sage-light">
                {i + 1}.
              </span>
              <p className="text-lg leading-relaxed text-blair-charcoal">
                <strong className="text-blair-midnight">{step.title}</strong>{" "}
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
