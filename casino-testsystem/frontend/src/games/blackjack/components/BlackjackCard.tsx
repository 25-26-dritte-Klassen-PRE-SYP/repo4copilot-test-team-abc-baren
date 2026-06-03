type BlackjackCardProps = {
	card: string
	hidden?: boolean
}

export function BlackjackCard({ card, hidden = false }: BlackjackCardProps) {
	if (hidden) {
		return (
			<div className="playing-card playing-card--hidden">
				<span className="playing-card__meta">Hidden</span>
				<span className="playing-card__face">?</span>
				<span className="playing-card__meta playing-card__meta--right">Card</span>
			</div>
		)
	}

	const suit = card.slice(-1)
	const rank = card.slice(0, -1)
	const isRed = suit === '♥' || suit === '♦'

	return (
		<div className={`playing-card ${isRed ? 'playing-card--red' : 'playing-card--dark'}`}>
			<span className="playing-card__meta">{rank}</span>
			<span className="playing-card__face">{suit}</span>
			<span className="playing-card__meta playing-card__meta--right">{rank}</span>
		</div>
	)
}
