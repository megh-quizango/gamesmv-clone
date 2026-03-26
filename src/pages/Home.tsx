import React from 'react';
import { useAllGames } from '@/hooks/use-games';
import { GameCard } from '@/components/shared/GameCard';
import { MOCK_GAMES } from '@/lib/mock-data';

export default function Home() {
  const { data: games } = useAllGames();
  const allGames = games || MOCK_GAMES;

  return (
    <div>
      <div className="container main" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
        <ul className="gameBox">
          {allGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      </div>
    </div>
  );
}
