/**
 * Wouter's `base` must align with Vite's `import.meta.env.BASE_URL`.
 * If BASE_URL is `./` (relative builds), passing `./` into wouter breaks matching:
 * pathname `/game/foo` becomes `~/game/foo` and no route matches (reload → 404 page).
 */
export function wouterBaseFromVite(): string {
  const base = import.meta.env.BASE_URL;
  if (base == null || base === "" || base === "/" || base === "./") {
    return "";
  }
  return base.endsWith("/") ? base.slice(0, -1) : base;
}
