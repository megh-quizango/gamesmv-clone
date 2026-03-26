import React from 'react';
import { Link } from 'wouter';
import { useSidebarGames } from '@/hooks/use-games';
import { StarRating } from '@/components/shared/StarRating';
import { GameIconImg } from '@/components/shared/GameIconImg';

export function RightSidebar({ className }: { className?: string }) {
  const { data, isLoading } = useSidebarGames();

  if (isLoading) return <div className={`w-80 shrink-0 ${className}`} />;

  return (
    <aside className={`w-80 shrink-0 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 py-6 pl-4 space-y-8 ${className}`}>
      
      {/* Popular Games Widget */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h3 className="font-display font-bold text-lg">Popular Games</h3>
        </div>
        
        <div className="space-y-4">
          {data?.hot.map((game, i) => (
            <Link key={game.id} href={`/game/${game.slug}`} className="flex gap-3 group">
              <span className="font-display font-bold text-muted-foreground/50 text-xl w-4">{i + 1}</span>
              <GameIconImg
                src={game.iconUrl}
                title={game.title}
                className="w-12 h-12 rounded-xl object-cover border border-border group-hover:border-primary/50 transition-colors"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{game.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={game.rating} className="scale-75 origin-left -ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newest Games Widget */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          <h3 className="font-display font-bold text-lg">Newest Games</h3>
        </div>
        
        <div className="space-y-4">
          {data?.newest.map((game) => (
            <Link key={game.id} href={`/game/${game.slug}`} className="flex gap-3 group">
              <GameIconImg
                src={game.iconUrl}
                title={game.title}
                className="w-12 h-12 rounded-xl object-cover border border-border group-hover:border-blue-500/50 transition-colors"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">{game.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{game.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}
