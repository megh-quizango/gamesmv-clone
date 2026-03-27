import { useMemo } from 'react';
import { Link } from 'wouter';
import { MOCK_GAMES } from '@/lib/mock-data';
import { GameIconImg } from '@/components/shared/GameIconImg';

type Props = {
  currentGameId: string;
};

/** Right sidebar only: 2×3 icon grid; whole area links home. */
export function RightSidebarAdPromo({ currentGameId }: Props) {
  const gridGames = useMemo(() => {
    const pool = MOCK_GAMES.filter((g) => g.id !== currentGameId);
    return pool.slice(0, 6);
  }, [currentGameId]);

  return (
    <Link
      href="/"
      aria-label="Go to home page"
      className="ad game-detail-ad game-detail-ad--promo"
    >
      <p>Advertisement</p>
      <div className="game-detail-ad__promoGrid">
        {gridGames.map((g) => (
          <div key={g.id} className="game-detail-ad__promoCell">
            <GameIconImg src={g.iconUrl} title={g.title} loading="lazy" />
          </div>
        ))}
      </div>
    </Link>
  );
}
