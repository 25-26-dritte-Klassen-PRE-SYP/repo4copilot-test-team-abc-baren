import { useEffect, useState } from 'react'
import { BlackjackCard } from '../components/BlackjackCard'
import { BlackjackControls } from '../components/BlackjackControls'
import { BlackjackStatus } from '../components/BlackjackStatus'
import {
	BlackjackGameView,
	BlackjackResult,
	BlackjackGameStatus,
	hitBlackjackGame,
	loadBlackjackGame,
	standBlackjackGame,
	startBlackjackGame,
} from '../services/blackjackApi'

type AlertState = {
	kind: 'error' | 'success'
	message: string
}

const defaultPlayerName = 'Max'
const defaultBet = 10

function cardLabel(card: string) {
	return card === 'hidden' ? 'hidden' : card
}

function toStatus(game?: BlackjackGameView | null): BlackjackGameStatus | 'IDLE' {
	return game?.status ?? 'IDLE'
}

type BlackjackPageProps = {
	onBackToOverview: () => void
}

export function BlackjackPage({ onBackToOverview }: BlackjackPageProps) {
	const [game, setGame] = useState<BlackjackGameView | null>(null)
	const [playerName, setPlayerName] = useState(defaultPlayerName)
	const [betAmount, setBetAmount] = useState(defaultBet)
	const [isLoading, setIsLoading] = useState(false)
	const [alert, setAlert] = useState<AlertState | null>(null)

	const gameIdFromUrl = new URLSearchParams(window.location.search).get('gameId')

	useEffect(() => {
		if (!gameIdFromUrl) {
			return
		}

		const gameId = Number(gameIdFromUrl)
		if (Number.isNaN(gameId)) {
			return
		}

		setIsLoading(true)
		loadBlackjackGame(gameId)
			.then((loadedGame) => {
				setGame(loadedGame)
				setPlayerName(loadedGame.playerName)
				setBetAmount(loadedGame.betAmount)
				setAlert(null)
			})
			.catch((error: unknown) => {
				setAlert({ kind: 'error', message: error instanceof Error ? error.message : 'Spiel konnte nicht geladen werden.' })
			})
			.finally(() => setIsLoading(false))
	}, [gameIdFromUrl])

	function syncGameId(nextGameId: number) {
		const nextUrl = new URL(window.location.href)
		nextUrl.searchParams.set('gameId', String(nextGameId))
		window.history.replaceState({}, '', `${nextUrl.pathname}?${nextUrl.searchParams.toString()}`)
	}

	async function handleStart() {
		try {
			setIsLoading(true)
			const nextGame = await startBlackjackGame(playerName.trim() || defaultPlayerName, betAmount)
			setGame(nextGame)
			syncGameId(nextGame.gameId)
			setAlert({ kind: 'success', message: 'Neues Blackjack-Spiel gestartet.' })
		} catch (error) {
			setAlert({ kind: 'error', message: error instanceof Error ? error.message : 'Spiel konnte nicht gestartet werden.' })
		} finally {
			setIsLoading(false)
		}
	}

	async function handleHit() {
		if (!game) {
			return
		}

		try {
			setIsLoading(true)
			const nextGame = await hitBlackjackGame(game.gameId)
			setGame(nextGame)
			setAlert(null)
		} catch (error) {
			setAlert({ kind: 'error', message: error instanceof Error ? error.message : 'Karte konnte nicht gezogen werden.' })
		} finally {
			setIsLoading(false)
		}
	}

	async function handleStand() {
		if (!game) {
			return
		}

		try {
			setIsLoading(true)
			const nextGame = await standBlackjackGame(game.gameId)
			setGame(nextGame)
			setAlert({ kind: 'success', message: `Runde beendet: ${nextGame.result ?? 'PENDING'}` })
		} catch (error) {
			setAlert({ kind: 'error', message: error instanceof Error ? error.message : 'Dealer-Zug konnte nicht beendet werden.' })
		} finally {
			setIsLoading(false)
		}
	}

	const isFinished = game?.status === 'FINISHED'
	const canPlay = Boolean(game) && !isFinished
	const dealerCards = game?.dealerCards ?? ['hidden', 'hidden']
	const resultLabel: BlackjackResult | null = game?.result ?? null

	return (
		<main className="casino-page">
			<div className="page-frame page-frame--compact">
				<header className="game-header panel-surface">
					<div>
						<p className="eyebrow">Table game</p>
						<h1>Blackjack</h1>
						<p className="intro intro--compact">
							Build a hand as close as possible to 21, beat the dealer, and keep the chips on your side of the table.
						</p>
					</div>
					<button type="button" onClick={onBackToOverview} className="button button--secondary">
						Zurück zur Game-Übersicht
					</button>
				</header>

				{alert ? <div className={`alert ${alert.kind === 'error' ? 'alert--error' : 'alert--success'}`}>{alert.message}</div> : null}

				<div className="blackjack-layout">
					<section className="panel-surface blackjack-panel">
						<div className="blackjack-form">
							<div className="blackjack-input-grid">
								<label className="field">
									<span>Player name</span>
									<input
										value={playerName}
										onChange={(event) => setPlayerName(event.target.value)}
										placeholder="Max"
									/>
								</label>
								<label className="field">
									<span>Bet amount</span>
									<input
										type="number"
										min="1"
										step="1"
										value={betAmount}
										onChange={(event) => setBetAmount(Number(event.target.value) || 0)}
									/>
								</label>
							</div>

							<BlackjackControls
								onStart={handleStart}
								onHit={handleHit}
								onStand={handleStand}
								canPlay={canPlay}
								hasActiveGame={Boolean(game)}
								isLoading={isLoading}
							/>

							<BlackjackStatus
								playerName={game?.playerName ?? playerName}
								betAmount={game?.betAmount ?? betAmount}
								playerScore={game?.playerScore ?? 0}
								dealerScore={game?.dealerScore ?? null}
								status={toStatus(game)}
								result={resultLabel}
							/>
						</div>
					</section>

					<section className="panel-surface blackjack-table">
						<div className="table-section">
							<p className="section-heading section-heading--card">Dealer hand</p>
							<div className="card-row">
								{dealerCards.map((card, index) => (
									<BlackjackCard key={`${card}-${index}`} card={cardLabel(card)} hidden={card === 'hidden'} />
								))}
							</div>
						</div>

						<div className="table-section">
							<p className="section-heading section-heading--card">Player hand</p>
							<div className="card-row">
								{(game?.playerCards.length ? game.playerCards : ['--', '--']).map((card, index) => (
									<BlackjackCard key={`${card}-${index}`} card={card} hidden={card === 'hidden' || card === '--'} />
								))}
							</div>
						</div>

						<div className="game-notes">
							<p className="game-notes__title">Game flow</p>
							<p>
								Start a round, take a hit if you want another card, or stand and let the dealer draw until at least 17.
							</p>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}
