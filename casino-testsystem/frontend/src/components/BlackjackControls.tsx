type BlackjackControlsProps = {
  onStart: () => void
  onHit: () => void
  onStand: () => void
  canPlay: boolean
  hasActiveGame: boolean
  isLoading: boolean
}

export function BlackjackControls({
  onStart,
  onHit,
  onStand,
  canPlay,
  hasActiveGame,
  isLoading,
}: BlackjackControlsProps) {
  return (
    <div className="control-row">
      <button
        type="button"
        onClick={onStart}
        className="button button--primary button--flex"
        disabled={isLoading}
      >
        Neues Spiel
      </button>
      <button
        type="button"
        onClick={onHit}
        disabled={!canPlay || !hasActiveGame || isLoading}
        className="button button--secondary button--flex"
      >
        Hit
      </button>
      <button
        type="button"
        onClick={onStand}
        disabled={!canPlay || !hasActiveGame || isLoading}
        className="button button--tertiary button--flex"
      >
        Stand
      </button>
    </div>
  )
}
