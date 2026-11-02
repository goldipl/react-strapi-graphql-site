import { useState } from "react";
import { getMediaUrl } from "../lib/format";
import { Media } from "../types/review";

const GRADIENTS = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-sky-500 via-cyan-500 to-emerald-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-fuchsia-500 via-violet-500 to-indigo-500",
  "from-emerald-500 via-teal-500 to-sky-500",
  "from-rose-500 via-pink-500 to-purple-500",
];

/** Picks a stable gradient for a given seed, so placeholders don't change between renders. */
const gradientFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

interface CoverImageProps {
  cover: Media | null;
  title: string;
  className?: string;
  eager?: boolean;
}

const CoverImage = ({ cover, title, className = "", eager = false }: CoverImageProps) => {
  const [failed, setFailed] = useState(false);
  const src = getMediaUrl(cover?.url);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={cover?.alternativeText || title}
        width={cover?.width ?? undefined}
        height={cover?.height ?? undefined}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradientFor(title)} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
      <span className="relative select-none font-display text-5xl font-extrabold text-white/90 drop-shadow-sm">
        {title.trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default CoverImage;
