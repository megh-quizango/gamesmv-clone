import React from 'react';
import { Link } from 'wouter';
import { Game } from '@/lib/mock-data';
import { GameIconImg } from '@/components/shared/GameIconImg';

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className }: GameCardProps) {
  return (
    <li className={className} style={{ transition: 'all .3s' }}>
      <Link href={`/game/${game.slug}`}>
        <div className="thumb">
          <GameIconImg src={game.iconUrl} title={game.title} />
          {game.isHot && <span className="hotIcon">HOT</span>}
          {game.isNew && !game.isHot && <span className="newIcon">NEW</span>}
        </div>
        <p><span>{game.title}</span></p>
      </Link>
    </li>
  );
}
