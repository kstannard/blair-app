function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

interface FounderVideoEmbedProps {
  youtubeUrl: string;
  title: string;
}

export function FounderVideoEmbed({
  youtubeUrl,
  title,
}: FounderVideoEmbedProps) {
  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-3xl text-blair-midnight sm:text-4xl">
          A message from Kristin
        </h2>

        <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&color=white`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
