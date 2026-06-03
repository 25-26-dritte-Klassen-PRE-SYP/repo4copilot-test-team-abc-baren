type GameCardProps = {
  title: string
  description: string
  icon: string
  actionLabel: string
  comingSoon?: boolean
  onPlay: () => void
}

export function GameCard({
  title,
  description,
  icon,
  actionLabel,
  comingSoon = false,
  onPlay,
}: GameCardProps) {
  return (
    <article className="game-card">
      <div className="game-card__glow" />
      <div className="game-card__top">
        <div>
          <p className="eyebrow">Game</p>
          <h3 className="game-card__title">{title}</h3>
        </div>
        <div className="icon-chip">{icon}</div>
      </div>

      <p className="game-card__copy">{description}</p>

      <div className="game-card__footer">
        <span className="badge">{comingSoon ? 'Coming soon' : 'Playable'}</span>
        <button type="button" onClick={onPlay} disabled={comingSoon} className="button button--primary">
          {comingSoon ? 'Demnächst' : actionLabel}
        </button>
      </div>
    </article>
  )
}
