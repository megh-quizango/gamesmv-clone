import { MOCK_GAMES, hasValidGameIcon, type Game } from '@/lib/mock-data';
import { gameIconUrl } from '@/lib/game-assets';

/** Slug segment → searchable phrase (e.g. angry-birds → "angry birds") */
function slugToPhrase(slug: string): string {
  return slug.trim().toLowerCase().replace(/-/g, ' ');
}

function containsPhrase(haystack: string, phrase: string): boolean {
  if (!phrase) return false;
  return haystack.toLowerCase().includes(phrase);
}

/** Extra tokens for nav slugs where titles use shorter words (e.g. Running → "Run") */
const SLUG_EXTRA_TERMS: Record<string, string[]> = {
  running: ['run', 'runner', 'running'],
  talking: ['talking', 'talk'],
  impostor: ['impostor', 'among us', 'among'],
  freddy: ['freddy', 'fnaf', 'five nights', "freddy's"],
  'angry-birds': ['angry birds', 'angry bird', 'rovio'],
  gta: ['gta', 'grand theft auto', 'rockstar'],
  girl: ['girl', 'gacha', 'dress up'],
  lego: ['lego'],
  stickman: ['stickman', 'stick man'],
  antistress: ['antistress', 'anti stress', 'fidget', 'relaxing', 'asmr'],
  horror: ['horror', 'scary', 'granny', 'escape'],
  survival: ['survival', 'battle royale', 'pubg', 'fortnite'],
  sports: ['soccer', 'football', 'fifa', 'fc mobile', 'nba', 'sport'],
};

function searchTermsForSlug(slug: string): string[] {
  const base = slugToPhrase(slug);
  const extras = SLUG_EXTRA_TERMS[slug] ?? [];
  const set = new Set<string>([base, ...extras].filter(Boolean));
  return [...set];
}

/**
 * True if the route category matches this game: slug/title/description —
 * game.category, title, or description contains the category name/phrase.
 */
export function gameMatchesCategorySlug(categorySlug: string, game: Game): boolean {
  const slug = categorySlug.trim().toLowerCase();
  if (!slug) return false;

  const category = game.category;
  const title = game.title;
  const description = game.description;
  const gameSlug = game.slug.toLowerCase();

  if (gameSlug.includes(slug.replace(/-/g, ''))) return true;

  // ".IO" / io — avoid matching random "io" inside words
  if (slug === 'io' || slug === '.io') {
    const re = /\b\.?io\b|slither|agar|worm|snake\.io/i;
    return re.test(title) || re.test(description) || re.test(category);
  }

  for (const term of searchTermsForSlug(slug)) {
    if (!term) continue;
    if (containsPhrase(category, term)) return true;
    if (containsPhrase(title, term)) return true;
    if (containsPhrase(description, term)) return true;
  }

  return false;
}

export function filterGamesByCategorySlug(games: Game[], categorySlug: string): Game[] {
  return games.filter((g) => gameMatchesCategorySlug(categorySlug, g));
}

/** Fixed category nav icons — same `icon.webp` as these games’ folders under `games/`. */
const CATEGORY_ICON_BY_SLUG: Partial<Record<string, string>> = {
  // Epic Stickman: Idle RPG War
  stickman: gameIconUrl('com.fansipan.epic.stickman.survival.rpg.idle.game'),
  // LEGO® Bluey
  lego: gameIconUrl('com.storytoys.lego.bluey.googleplay'),
};

/** Local /games/… only — no JSON image URLs. */
export function getRepresentativeIconForCategorySlug(categorySlug: string): string | null {
  const slug = categorySlug.trim().toLowerCase();
  if (!slug) return null;
  const fixed = CATEGORY_ICON_BY_SLUG[slug];
  if (fixed) return fixed;
  const games = filterGamesByCategorySlug(MOCK_GAMES, slug).filter((g) => hasValidGameIcon(g.iconUrl));
  return games[0]?.iconUrl ?? null;
}
