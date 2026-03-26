import React, { useState } from 'react';
import { useSearch, useLocation } from 'wouter';
import { MOCK_GAMES } from '@/lib/mock-data';
import { Link } from 'wouter';
import { GameIconImg } from '@/components/shared/GameIconImg';

export default function Search() {
  const searchString = useSearch();
  const query = new URLSearchParams(searchString).get('q') || '';
  const [, setLocation] = useLocation();
  const [searchInput, setSearchInput] = useState(query);

  const games = query
    ? MOCK_GAMES.filter(g =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.developer.toLowerCase().includes(query.toLowerCase()) ||
        g.category.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_GAMES;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div>
      <div className="container" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
        {/* Search input */}
        <div style={{
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '20px',
          border: '3px solid #fff',
          padding: '20px 30px',
          marginBottom: '10px',
          boxShadow: '0 4px 6px 0 rgba(0,0,0,.2)',
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search for games..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{
                flex: 1,
                height: '44px',
                border: '2px solid #ddd',
                borderRadius: '22px',
                textIndent: '15px',
                fontSize: '18px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#607a98',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0 25px',
                height: '44px',
                background: 'linear-gradient(180deg, #6241d8 0%, #8a6fee 100%)',
                borderRadius: '22px',
                color: '#fff',
                fontSize: '18px',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>
        </div>

        <div className="listGame searchTitle">
          <div className="title">
            <h2>{query ? `Results for "${query}"` : 'All Games'}</h2>
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
              No games found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
