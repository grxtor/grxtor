"use client";

export function SpotifyWidget({ artistId }: { artistId: string }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border shadow-lg">
      <iframe
        src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: "none" }}
      />
    </div>
  );
}
