"use client";

import { useRef } from "react";

export function SpotifyWidget({ artistId }: { artistId: string }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // iframe fare olaylarını yutar — cursor kaybolur.
  // mousedown'da overlay'i kaldır → tıklama iframe'e geçsin,
  // mouseup'da geri aç → cursor tekrar çalışsın.
  const handleMouseDown = () => {
    if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
  };
  const handleMouseUp = () => {
    if (overlayRef.current) overlayRef.current.style.pointerEvents = "auto";
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border shadow-lg relative">
      <iframe
        src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: "none", display: "block" }}
      />
      {/* Transparent overlay — custom cursor çalışmaya devam eder */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ zIndex: 1, pointerEvents: "auto" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
