import { useQuery } from "@tanstack/react-query";
import { 
  getGames, 
  getGameBySlug, 
  getHotGames, 
  getNewGames, 
  getGamesByCategory, 
  getGamesByPlatform,
  searchGames,
  Platform
} from "@/lib/mock-data";

// Since we have no backend, we simulate API calls with a slight delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function useAllGames() {
  return useQuery({
    queryKey: ["games", "all"],
    queryFn: async () => {
      await delay(400);
      return getGames();
    },
  });
}

export function useGameDetails(slug: string) {
  return useQuery({
    queryKey: ["games", "detail", slug],
    queryFn: async () => {
      await delay(300);
      const game = getGameBySlug(slug);
      if (!game) throw new Error("Game not found");
      return game;
    },
    enabled: !!slug,
  });
}

export function useSidebarGames() {
  return useQuery({
    queryKey: ["games", "sidebar"],
    queryFn: async () => {
      await delay(200);
      return {
        hot: getHotGames(),
        newest: getNewGames(),
      };
    },
  });
}

export function useCategoryGames(category: string) {
  return useQuery({
    queryKey: ["games", "category", category],
    queryFn: async () => {
      await delay(400);
      return getGamesByCategory(category);
    },
    enabled: !!category,
  });
}

export function usePlatformGames(platform: Platform) {
  return useQuery({
    queryKey: ["games", "platform", platform],
    queryFn: async () => {
      await delay(400);
      return getGamesByPlatform(platform);
    },
    enabled: !!platform,
  });
}

export function useSearchGames(query: string) {
  return useQuery({
    queryKey: ["games", "search", query],
    queryFn: async () => {
      await delay(400);
      return searchGames(query);
    },
    enabled: !!query,
  });
}
