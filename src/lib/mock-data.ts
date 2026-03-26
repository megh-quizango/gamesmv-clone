import appmasterGames from "../../appmaster.games.json";
import { GAME_IDS_WITH_LOCAL_ASSETS } from "@/generated/game-asset-ids";
import { gameIconUrl, gameScreenshotUrls } from "@/lib/game-assets";

export type Platform = "android" | "ios" | "pc";

export interface Game {
  id: string;
  slug: string;
  title: string;
  /** Local asset: /games/{packageId}/icon.webp (same as `id`, not hyphenated `slug`) */
  iconUrl: string;
  /** Local assets under /games/{packageId}/ */
  screenshots: string[];
  platforms: Platform[];
  category: string;
  rating: number;
  reviewsCount: number;
  /** From Mongo createdAt — for sorting “newest” lists */
  createdAtMs: number;
  size: string;
  date: string;
  price: string;
  developer: string;
  description: string;
  downloadUrls: Record<Platform, string | null>;
  isHot?: boolean;
  isNew?: boolean;
}

type MongoDate = { $date: string };
type AppMasterSource = { android?: string; ios?: string; pc?: string };

interface AppMasterRecord {
  gameId: string;
  name: string;
  icon: string;
  screenshots?: string[];
  platforms: string[];
  category: string;
  rating: number;
  size?: string;
  updated?: string;
  price?: string;
  developer: string;
  description: string;
  source?: AppMasterSource;
  installsNum?: number;
  createdAt?: MongoDate | string;
}

function parseMongoDate(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "string") return new Date(v).getTime() || 0;
  if (typeof v === "object" && v !== null && "$date" in v) {
    const d = (v as MongoDate).$date;
    return new Date(d).getTime() || 0;
  }
  return 0;
}

function mapPlatformLabel(p: string): Platform | null {
  const x = p.trim().toLowerCase();
  if (x === "android") return "android";
  if (x === "ios") return "ios";
  if (x === "pc" || x === "windows") return "pc";
  return null;
}

function slugFromGameId(gameId: string): string {
  return gameId.replace(/\./g, "-");
}

function toGame(
  r: AppMasterRecord,
  isHot: boolean,
  isNew: boolean,
): Game {
  const src = r.source ?? {};
  let platforms = [...new Set(r.platforms.map(mapPlatformLabel).filter(Boolean))] as Platform[];
  if (platforms.length === 0) {
    if (src.android) platforms.push("android");
    if (src.ios) platforms.push("ios");
    if (src.pc) platforms.push("pc");
  }
  const downloadUrls: Record<Platform, string | null> = {
    android: src.android ?? null,
    ios: src.ios ?? null,
    pc: src.pc ?? null,
  };

  const installsNum = typeof r.installsNum === "number" ? r.installsNum : 0;
  const screenshotUrlsRaw = Array.isArray(r.screenshots)
    ? r.screenshots.filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : [];
  const screenshotCount = screenshotUrlsRaw.length;
  const createdAtMs = parseMongoDate(r.createdAt);
  const slug = slugFromGameId(r.gameId);

  return {
    id: r.gameId,
    slug,
    title: r.name,
    iconUrl: gameIconUrl(r.gameId),
    screenshots: gameScreenshotUrls(r.gameId, screenshotCount),
    platforms,
    category: r.category,
    rating: typeof r.rating === "number" ? r.rating : 0,
    reviewsCount: installsNum,
    createdAtMs,
    size: r.size?.trim() ? r.size : "—",
    date: r.updated?.trim() ? r.updated : "",
    price: r.price ?? "—",
    developer: r.developer,
    description: r.description,
    downloadUrls,
    isHot,
    isNew,
  };
}

function buildGamesFromJson(): Game[] {
  const raw = appmasterGames as AppMasterRecord[];
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const withMeta = raw.map((r) => ({
    r,
    created: parseMongoDate(r.createdAt),
    installs: typeof r.installsNum === "number" ? r.installsNum : 0,
  }));

  const hotCut = Math.min(48, Math.max(12, Math.ceil(withMeta.length * 0.08)));
  const newCut = Math.min(48, Math.max(12, Math.ceil(withMeta.length * 0.08)));

  const hotIds = new Set(
    [...withMeta]
      .sort((a, b) => b.installs - a.installs)
      .slice(0, hotCut)
      .map((x) => x.r.gameId),
  );

  const newIds = new Set(
    [...withMeta]
      .sort((a, b) => b.created - a.created)
      .slice(0, newCut)
      .map((x) => x.r.gameId),
  );

  return raw.map((r) => toGame(r, hotIds.has(r.gameId), newIds.has(r.gameId)));
}

/** Listed games use local /games/… URLs only (no JSON image URLs). */
export function hasValidGameIcon(iconUrl: string | undefined | null): boolean {
  const t = String(iconUrl ?? "").trim();
  return /\/games\//.test(t);
}

/** Only games with a matching folder under `games/{packageId}/` (see Vite manifest). */
export const MOCK_GAMES: Game[] = buildGamesFromJson().filter(
  (g) => hasValidGameIcon(g.iconUrl) && GAME_IDS_WITH_LOCAL_ASSETS.has(g.id),
);

export const CATEGORIES: string[] = [
  ...new Set(MOCK_GAMES.map((g) => g.category).filter(Boolean)),
].sort((a, b) => a.localeCompare(b));

export const getGames = () => MOCK_GAMES;
export const getGameBySlug = (slug: string) => MOCK_GAMES.find((g) => g.slug === slug);
export const getHotGames = () => MOCK_GAMES.filter((g) => g.isHot);
export const getNewGames = () => MOCK_GAMES.filter((g) => g.isNew);
export const getGamesByCategory = (category: string) =>
  MOCK_GAMES.filter((g) => g.category.toLowerCase() === category.toLowerCase());
export const getGamesByPlatform = (platform: Platform) =>
  MOCK_GAMES.filter((g) => g.platforms.includes(platform));
export const searchGames = (query: string) => {
  const lower = query.toLowerCase();
  return MOCK_GAMES.filter(
    (g) =>
      g.title.toLowerCase().includes(lower) ||
      g.developer.toLowerCase().includes(lower) ||
      g.category.toLowerCase().includes(lower),
  );
};
