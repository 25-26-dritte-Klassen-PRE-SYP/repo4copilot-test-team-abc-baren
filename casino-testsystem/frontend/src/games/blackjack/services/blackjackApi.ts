export type BlackjackGameStatus = 'PLAYER_TURN' | 'DEALER_TURN' | 'FINISHED'
export type BlackjackResult = 'WIN' | 'LOSE' | 'DRAW' | null

export type BlackjackGameView = {
	gameId: number
	playerName: string
	betAmount: number
	playerCards: string[]
	dealerCards: string[]
	playerScore: number
	dealerScore: number | null
	status: BlackjackGameStatus
	result: BlackjackResult
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers ?? {}),
		},
		...options,
	})

	if (!response.ok) {
		const payload = await response.json().catch(() => null)
		const message = payload?.message ?? 'Blackjack API request failed'
		throw new Error(message)
	}

	return response.json() as Promise<T>
}

export async function startBlackjackGame(playerName: string, betAmount: number) {
	return requestJson<BlackjackGameView>('/api/blackjack/start', {
		method: 'POST',
		body: JSON.stringify({ playerName, betAmount }),
	})
}

export async function hitBlackjackGame(gameId: number) {
	return requestJson<BlackjackGameView>(`/api/blackjack/${gameId}/hit`, {
		method: 'POST',
	})
}

export async function standBlackjackGame(gameId: number) {
	return requestJson<BlackjackGameView>(`/api/blackjack/${gameId}/stand`, {
		method: 'POST',
	})
}

export async function loadBlackjackGame(gameId: number) {
	return requestJson<BlackjackGameView>(`/api/blackjack/${gameId}`)
}
