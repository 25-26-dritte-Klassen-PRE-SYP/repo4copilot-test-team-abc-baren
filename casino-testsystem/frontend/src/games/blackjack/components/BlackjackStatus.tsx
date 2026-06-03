import type { BlackjackGameStatus, BlackjackResult } from '../../services/blackjackApi'

type BlackjackStatusProps = {
	playerName: string
	betAmount: number
	playerScore: number
	dealerScore: number | null
	status: BlackjackGameStatus | 'IDLE'
	result: BlackjackResult | null
}

const statusCopy: Record<BlackjackGameStatus | 'IDLE', string> = {
	IDLE: 'Bereit für ein neues Spiel',
	PLAYER_TURN: 'Spieler ist am Zug',
	DEALER_TURN: 'Dealer zieht Karten',
	FINISHED: 'Runde beendet',
}

export function BlackjackStatus({
	playerName,
	betAmount,
	playerScore,
	dealerScore,
	status,
	result,
}: BlackjackStatusProps) {
	return (
		<section className="blackjack-status panel-surface">
			<div className={`status-pill status-pill--${status.toLowerCase().replace('_', '-')}`}>
				{statusCopy[status]}
			</div>

			<div className="status-grid">
				<div className="status-tile">
					<p className="status-label">Player</p>
					<p className="status-value">{playerName}</p>
				</div>
				<div className="status-tile">
					<p className="status-label">Bet</p>
					<p className="status-value">{betAmount.toFixed(2)} €</p>
				</div>
				<div className="status-tile">
					<p className="status-label">Result</p>
					<p className="status-value">{result ?? 'Pending'}</p>
				</div>
			</div>

			<div className="score-grid">
				<div className="score-tile">
					<p className="status-label">Player score</p>
					<p className="score-value score-value--amber">{playerScore}</p>
				</div>
				<div className="score-tile">
					<p className="status-label">Dealer score</p>
					<p className="score-value score-value--sky">{dealerScore ?? '??'}</p>
				</div>
			</div>
		</section>
	)
}
