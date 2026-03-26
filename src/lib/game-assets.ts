/**
 * URLs under `/games/...` — files live in repo root `games/` and are mirrored to `public/games`
 * for dev (Vite static serving) and copied to `dist/public/games` on build (see vite.config.ts).
 *
 * Per game, folder name must match the **package id** (`game.id`, e.g. `com.epicgames.fortnite`),
 * not the route slug (hyphenated). Example: `games/com.epicgames.fortnite/icon.webp`
 *
 * Category nav thumbnails:
 *   games/categories/{categorySlug}.webp
 */

function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const rel = path.replace(/^\//, "");
  return `${base}${rel}`;
}

/** Path segment for URL — safe for package ids with dots */
function encodeGameFolderSegment(gameId: string): string {
  return encodeURIComponent(gameId);
}

export function gameIconUrl(gameId: string): string {
  return publicUrl(`games/${encodeGameFolderSegment(gameId)}/icon.webp`);
}

/** One URL per screenshot index; JSON is only used for how many files exist, not for remote URLs. */
export function gameScreenshotUrls(gameId: string, count: number): string[] {
  const seg = encodeGameFolderSegment(gameId);
  const prefix = publicUrl(`games/${seg}/`);
  return Array.from({ length: count }, (_, i) => `${prefix}screenshot-${i}.webp`);
}

export function categoryNavIconUrl(categorySlug: string): string {
  return publicUrl(`games/categories/${categorySlug}.webp`);
}
