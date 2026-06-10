import React from 'react'

type GameCardProps = {
  title: string
  description: string
  icon: string
  actionLabel: string
  comingSoon?: boolean
  onPlay: () => void
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  actionLabel,
  comingSoon,
  onPlay,
}) => {
  return (
    <div className={`game-card ${comingSoon ? 'game-card--coming-soon' : ''}`}>
      <div className="game-card-icon">{icon}</div>
      <div className="game-card-content">
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-description">{description}</p>
      </div>
      <div className="game-card-footer">
        <button
          className={`game-card-button ${comingSoon ? 'game-card-button--disabled' : ''}`}
          onClick={onPlay}
          disabled={comingSoon}
        >
          {comingSoon ? 'Coming soon' : actionLabel}
        </button>
      </div>
    </div>
  )
}
