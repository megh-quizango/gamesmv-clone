import React, { useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { MOCK_GAMES } from '@/lib/mock-data';
import { filterGamesByCategorySlug } from '@/lib/category-filter';
import { GameIconImg } from '@/components/shared/GameIconImg';

function formatCategoryTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function Category() {
  const [, params] = useRoute('/category/:category');
  const categoryStr = params?.category || '';
  const displayTitle = categoryStr ? formatCategoryTitle(categoryStr) : '';

  const games = useMemo(
    () => (categoryStr ? filterGamesByCategorySlug(MOCK_GAMES, categoryStr) : []),
    [categoryStr],
  );

  return (
    <div>
      <div className="container category-page" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
        <div className="listGame listGame--category">
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
              No games found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
