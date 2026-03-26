import type { ImgHTMLAttributes } from "react";
import { gameIconPlaceholder, onGameImageError } from "@/lib/image-fallback";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  /** Local `/games/…` URL from game-assets (never JSON store URLs). */
  src: string;
  title: string;
  alt?: string;
};

/**
 * Loads `/games/…` icons only; on failure uses letter placeholder (no remote fallbacks).
 */
export function GameIconImg({ src, title, alt, loading = "lazy", ...rest }: Props) {
  const safe = src?.trim() || gameIconPlaceholder(title);
  return (
    <img
      {...rest}
      src={safe}
      alt={alt ?? title}
      loading={loading}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={(e) => onGameImageError(e, title)}
    />
  );
}
