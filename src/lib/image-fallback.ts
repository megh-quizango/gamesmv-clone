import type { SyntheticEvent } from "react";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function svgDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Offline-safe placeholder (no external fetch). Used when /games/… assets are missing or fail.
 */
export function gameIconPlaceholder(title: string): string {
  const ch = escapeXml(title.trim().charAt(0).toUpperCase() || "?");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#464466"/><text x="100" y="108" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-size="72" font-weight="700">${ch}</text></svg>`;
  return svgDataUrl(svg);
}

export function screenshotPlaceholder(title: string, index: number): string {
  const label = escapeXml(`${title.trim().slice(0, 18) || "Screenshot"} ${index + 1}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="#464466"/><text x="400" y="230" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-size="28">${label}</text></svg>`;
  return svgDataUrl(svg);
}

/** Attach to <img onError={...}> — avoids infinite loops if the placeholder also errors. */
export function onGameImageError(
  e: SyntheticEvent<HTMLImageElement>,
  title: string,
): void {
  const el = e.currentTarget;
  if (el.dataset.fallbackDone === "1") return;
  el.dataset.fallbackDone = "1";
  el.src = gameIconPlaceholder(title);
}

export function onScreenshotImageError(
  e: SyntheticEvent<HTMLImageElement>,
  title: string,
  index: number,
): void {
  const el = e.currentTarget;
  if (el.dataset.fallbackDone === "1") return;
  el.dataset.fallbackDone = "1";
  el.src = screenshotPlaceholder(title, index);
}
