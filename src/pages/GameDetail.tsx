import React, { useMemo, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useGameDetails } from '@/hooks/use-games';
import { useSidebarGameCount } from '@/hooks/use-mobile';
import { MOCK_GAMES } from '@/lib/mock-data';
import { GameIconImg } from '@/components/shared/GameIconImg';
import { GameDetailAdSlot } from '@/components/shared/GameDetailAdSlot';
import { onScreenshotImageError } from '@/lib/image-fallback';

const hotGames = MOCK_GAMES.filter((g) => g.isHot);
const POPULAR_POOL = [...hotGames, ...MOCK_GAMES.filter((g) => !g.isHot)].slice(0, 40);
const newGames = MOCK_GAMES.filter((g) => g.isNew);
const NEWEST_POOL = [...newGames, ...MOCK_GAMES.filter((g) => !g.isNew)].slice(0, 40);
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: '14px', color: i <= Math.round(rating) ? '#ff5d00' : '#ccc' }}>★</span>
      ))}
    </div>
  );
}

export default function GameDetail() {
  const [, params] = useRoute('/game/:slug');
  const slug = params?.slug || '';
  const { data: game, isLoading, isError } = useGameDetails(slug);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const sidebarCount = useSidebarGameCount();

  const popularGames = useMemo(() => POPULAR_POOL.slice(0, sidebarCount), [sidebarCount]);
  const newestGames = useMemo(() => NEWEST_POOL.slice(0, sidebarCount), [sidebarCount]);

  const similarGames = useMemo(() => {
    if (!game) return [] as typeof MOCK_GAMES;
    return MOCK_GAMES.filter(
      (g) => g.category === game.category && g.id !== game.id,
    ).slice(0, 24);
  }, [game]);

  const rightSidebarGames = useMemo(
    () => (similarGames.length > 0 ? similarGames : POPULAR_POOL).slice(0, sidebarCount),
    [similarGames, sidebarCount],
  );

  /** Curated-style strip: high-rated picks, excludes current game (“Editor's Choice Games”) */
  const editorChoiceGames = useMemo(() => {
    if (!game) return [] as typeof MOCK_GAMES;
    return [...MOCK_GAMES]
      .filter((g) => g.id !== game.id)
      .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      .slice(0, 32);
  }, [game]);

  if (!slug || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#8a6fee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#fff', fontFamily: 'Fredoka, sans-serif' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Game Not Found</h2>
        <Link href="/" style={{ color: '#8a6fee' }}>← Back to Home</Link>
      </div>
    );
  }

  const topPopularGames = POPULAR_POOL.slice(0, 15);

  const screenshots =
    game.screenshots.length > 0 ? game.screenshots : [game.iconUrl];

  return (
    <div>
      {/* Top Popular horizontal strip */}
      <div className="container topPopular">
        <ul className="gameBox">
          {topPopularGames.map((g) => (
            <li key={g.id} style={{ position: 'relative', transition: 'all .3s' }}>
              <Link href={`/game/${g.slug}`}>
                <div className="thumb">
                  <GameIconImg src={g.iconUrl} title={g.title} />
                </div>
                <p><span>{g.title}</span></p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main detail box */}
      <div className="container detailBox">
        {/* Left Box */}
        <div className="leftBox">
          <div className="centerTop">
            {/* Left Model - Popular & Newest sidebars */}
            <div className="leftModel">
              {/* Popular Games */}
              <div className="listGame listGame--sidebar listGame--bento">
                <div className="title">
                  <h2>Popular Games</h2>
                </div>
                <ul className="gameBox">
                  {popularGames.map((g) => (
                    <li key={g.id} style={{ position: 'relative', transition: 'all .3s' }}>
                      <Link href={`/game/${g.slug}`}>
                        <div className="thumb">
                          <GameIconImg src={g.iconUrl} title={g.title} />
                        </div>
                        <p><span>{g.title}</span></p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newest Games */}
              <div className="listGame listGame--sidebar listGame--bento">
                <div className="title">
                  <h2>Newest Games</h2>
                </div>
                <ul className="gameBox">
                  {newestGames.map((g) => (
                    <li key={g.id} style={{ position: 'relative', transition: 'all .3s' }}>
                      <Link href={`/game/${g.slug}`}>
                        <div className="thumb">
                          <GameIconImg src={g.iconUrl} title={g.title} />
                        </div>
                        <p><span>{g.title}</span></p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center Model - Game Info */}
            <div className="centerModel">
              <div className="topInfo">
                <div className="infoBox">
                  <div className="game-detail-adSlot">
                    <GameDetailAdSlot key={slug} slug={slug} />
                  </div>
                  <div className="gameInfo">
                    <div className="gTop">
                      <div className="gLeft">
                        <div className="thumb">
                          <GameIconImg src={game.iconUrl} title={game.title} loading="eager" />
                        </div>
                        <div className="gName">
                          <dl>
                            <dt>{game.title}</dt>
                            <dd>{game.developer}</dd>
                          </dl>
                          <div className="tag">
                            <a href="#">{game.category}</a>
                            {game.platforms.includes('android') && <a href="#">Android</a>}
                            {game.platforms.includes('ios') && <a href="#">iOS</a>}
                            {game.isHot && <a href="#">Hot</a>}
                            {game.isNew && <a href="#">New</a>}
                          </div>
                        </div>
                      </div>
                      <dl className="gRate">
                        <dt>{game.rating}</dt>
                        <dd>score</dd>
                        <StarRating rating={game.rating} />
                      </dl>
                    </div>

                    {/* Additional Info */}
                    <div className="additional">
                      <h2>Additional Information</h2>
                      <ul className="addBox">
                        <li>
                          <p>Platform:</p>
                          <small>
                            {game.platforms.map(p => (
                              <span key={p} style={{ marginRight: '6px', textTransform: 'capitalize' }}>
                                {p === 'android' ? '🤖' : p === 'ios' ? '🍎' : '💻'} {p}
                              </span>
                            ))}
                          </small>
                        </li>
                        <li>
                          <p>Updated:</p>
                          <small>{game.date}</small>
                        </li>
                        <li>
                          <p>Price:</p>
                          <small>{game.price}</small>
                        </li>
                        <li>
                          <p>Developer:</p>
                          <small>{game.developer}</small>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Info - Screenshots, Description, Downloads */}
              <div className="botInfo">
                {/* Screenshots */}
                <div className="swiper_con">
                  <h2>Screenshots</h2>
                  <div className="screenshots-scroll">
                    {screenshots.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${game.title} screenshot ${i + 1}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        decoding="async"
                        onError={(e) => onScreenshotImageError(e, game.title, i)}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="module">
                  <h2>Description</h2>
                  <div
                    className="des"
                    style={{ maxHeight: showMoreDesc ? 'none' : '200px', overflow: 'hidden', position: 'relative' }}
                  >
                    {game.description}
                    {'\n\n'}
                    {`${game.title} is available on ${game.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}. `}
                    {`The game has been enjoyed by millions of players worldwide and continues to receive regular updates.`}
                    {'\n\n'}
                    {`Category: ${game.category}. Developer: ${game.developer}. Price: ${game.price}.`}
                  </div>
                  <div className="Mbtn" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                      onClick={() => setShowMoreDesc(!showMoreDesc)}
                      style={{
                        width: '200px',
                        height: '40px',
                        background: 'transparent',
                        borderRadius: '20px',
                        border: '1px solid #a7cbd3',
                        lineHeight: '40px',
                        display: 'inline-block',
                        fontSize: '14px',
                        textAlign: 'center',
                        color: '#607a98',
                        cursor: 'pointer',
                        fontFamily: 'Fredoka, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {showMoreDesc ? 'SHOW LESS' : 'SHOW MORE'}
                    </button>
                  </div>
                </div>

                {/* Download */}
                <div className="get">
                  <h2>Download</h2>
                  <ul className="getList">
                    {game.platforms.includes('android') && (
                      <li>
                        <a href={game.downloadUrls.android || '#'} target="_blank" rel="noopener noreferrer">
                          Google Play
                        </a>
                      </li>
                    )}
                    {game.platforms.includes('ios') && (
                      <li>
                        <a href={game.downloadUrls.ios || '#'} target="_blank" rel="noopener noreferrer">
                          App Store
                        </a>
                      </li>
                    )}
                    {game.platforms.includes('pc') && (
                      <li>
                        <a href={game.downloadUrls.pc || '#'} target="_blank" rel="noopener noreferrer">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                          </svg>
                          Windows
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Editor's Choice — same width as former Similar Games strip (left column) */}
          <div className="listGame listGame--similar">
            <div className="title">
              <h2>Editor's Choice Games</h2>
            </div>
            <ul className="gameBox">
              {editorChoiceGames.map((g) => (
                <li key={g.id} style={{ position: 'relative', transition: 'all .3s' }}>
                  <Link href={`/game/${g.slug}`}>
                    <div className="thumb">
                      <GameIconImg src={g.iconUrl} title={g.title} />
                    </div>
                    <p><span>{g.title}</span></p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right sidebar — Similar Games + ad */}
        <div className="rightBox">
          <div className="listGame listGame--sidebar listGame--bento">
            <div className="title">
              <h2>Similar Games</h2>
            </div>
            <ul className="gameBox">
              {rightSidebarGames.map((g) => (
                <li key={g.id} style={{ position: 'relative', transition: 'all .3s' }}>
                  <Link href={`/game/${g.slug}`}>
                    <div className="thumb">
                      <GameIconImg src={g.iconUrl} title={g.title} />
                    </div>
                    <p><span>{g.title}</span></p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="game-detail-adSlot">
            <GameDetailAdSlot key={slug} slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
