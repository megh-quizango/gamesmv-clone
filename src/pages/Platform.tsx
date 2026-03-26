import React from 'react';
import { useRoute, Link } from 'wouter';
import { MOCK_GAMES, Platform } from '@/lib/mock-data';
import { GameIconImg } from '@/components/shared/GameIconImg';

export default function PlatformPage() {
  const [, params] = useRoute('/platform/:platform');
  const platform = (params?.platform || 'android') as Platform;

  const games = MOCK_GAMES.filter(g => g.platforms.includes(platform));
  const displayTitle = platform === 'ios' ? 'iOS' : platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div>
      <div className="container" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
        <div className="listGame">
          <div className="title">
            <h2>{displayTitle} Games</h2>
          </div>
          {games.length > 0 ? (
            <ul className="gameBox">
              {games.map(game => (
                <li key={game.id} style={{ position: 'relative', transition: 'all .3s' }}>
                  <Link href={`/game/${game.slug}`}>
                    <div className="thumb">
                      <GameIconImg src={game.iconUrl} title={game.title} />
                      {game.isHot && <span className="hotIcon">HOT</span>}
                      {game.isNew && !game.isHot && <span className="newIcon">NEW</span>}
                    </div>
                    <p><span>{game.title}</span></p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#607a98', fontFamily: 'Fredoka, sans-serif', fontSize: '18px' }}>
              No games found for this platform.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
