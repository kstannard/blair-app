export function ClosingNote({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed text-blair-charcoal"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
