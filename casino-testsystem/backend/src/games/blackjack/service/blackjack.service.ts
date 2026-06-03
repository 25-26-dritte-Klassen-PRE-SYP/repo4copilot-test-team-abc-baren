import type { BlackjackGameInsert } from '../model/blackjack.model'
import { createBlackjackRepository } from '../model/blackjack.model.js'

export type BlackjackGameStatus = 'PLAYER_TURN' | 'DEALER_TURN' | 'FINISHED'
export type BlackjackResult = 'WIN' | 'LOSE' | 'DRAW' | null
export type BlackjackCard = string

export type BlackjackGameRecord = {
	id: number
	playerName: string
	betAmount: number
	playerCards: BlackjackCard[]
	dealerCards: BlackjackCard[]
	deckState: BlackjackCard[]
	playerScore: number
	dealerScore: number
	gameStatus: BlackjackGameStatus
	result: BlackjackResult | null
	createdAt: string
	updatedAt: string
}

export type BlackjackGameView = {
	gameId: number
	playerName: string
	betAmount: number
	playerCards: BlackjackCard[]
	dealerCards: BlackjackCard[]
	playerScore: number
	dealerScore: number | null
	status: BlackjackGameStatus
	result: BlackjackResult | null
}

export type BlackjackRepository = {
	createGame(data: BlackjackGameInsert): Promise<BlackjackGameRecord>
	updateGame(gameId: number, data: BlackjackGameInsert): Promise<BlackjackGameRecord | null>
	getGameById(gameId: number): Promise<BlackjackGameRecord | null>
}

export type BlackjackServiceDependencies = {
	repository?: BlackjackRepository
	deckFactory?: () => BlackjackCard[]
}

const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function createDeck() {
	return suits.flatMap((suit) => ranks.map((rank) => `${rank}${suit}`))
}

export function shuffleDeck(deck: BlackjackCard[], random: () => number = Math.random) {
	const shuffledDeck = [...deck]

	for (let index = shuffledDeck.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1))
		;[shuffledDeck[index], shuffledDeck[swapIndex]] = [shuffledDeck[swapIndex], shuffledDeck[index]]
	}

	return shuffledDeck
}

function cardValue(card: BlackjackCard) {
	const rank = card.slice(0, -1)

	if (rank === 'A') {
		return 11
	}

	if (rank === 'K' || rank === 'Q' || rank === 'J') {
		return 10
	}

	return Number(rank)
}

export function calculateScore(cards: BlackjackCard[]) {
	const totalWithAcesHigh = cards.reduce((sum, card) => sum + cardValue(card), 0)
	const aceCount = cards.filter((card) => card.startsWith('A')).length
	let score = totalWithAcesHigh

	for (let index = 0; index < aceCount && score > 21; index += 1) {
		score -= 10
	}

	return score
}

export function determineWinner(playerScore: number, dealerScore: number): BlackjackResult {
	if (playerScore > 21) {
		return 'LOSE'
	}

	if (dealerScore > 21) {
		return 'WIN'
	}

	if (playerScore > dealerScore) {
		return 'WIN'
	}

	if (playerScore < dealerScore) {
		return 'LOSE'
	}

	return 'DRAW'
}

export function dealerTurn(dealerCards: BlackjackCard[], deck: BlackjackCard[]) {
	const nextDealerCards = [...dealerCards]
	const remainingDeck = [...deck]

	while (calculateScore(nextDealerCards) < 17 && remainingDeck.length > 0) {
		nextDealerCards.push(remainingDeck.shift() as BlackjackCard)
	}

	return {
		dealerCards: nextDealerCards,
		deckState: remainingDeck,
		dealerScore: calculateScore(nextDealerCards),
	}
}

function drawCards(deck: BlackjackCard[], count: number) {
	const drawnCards = deck.slice(0, count)
	const remainingDeck = deck.slice(count)

	return {
		drawnCards,
		remainingDeck,
	}
}

function maskDealerCards(game: BlackjackGameRecord) {
	if (game.gameStatus === 'FINISHED') {
		return game.dealerCards
	}

	if (game.dealerCards.length === 0) {
		return []
	}

	return [game.dealerCards[0], 'hidden']
}

function toView(game: BlackjackGameRecord): BlackjackGameView {
	return {
		gameId: game.id,
		playerName: game.playerName,
		betAmount: game.betAmount,
		playerCards: game.playerCards,
		dealerCards: maskDealerCards(game),
		playerScore: game.playerScore,
		dealerScore: game.gameStatus === 'FINISHED' ? game.dealerScore : null,
		status: game.gameStatus,
		result: game.result,
	}
}

export function createBlackjackService({
	repository = createBlackjackRepository(),
	deckFactory = () => shuffleDeck(createDeck()),
}: BlackjackServiceDependencies = {}) {
	async function startGame(playerName: string, betAmount: number) {
		const shuffledDeck = deckFactory()
		const { drawnCards: playerCards, remainingDeck: deckAfterPlayer } = drawCards(shuffledDeck, 2)
		const { drawnCards: dealerCards, remainingDeck: deckState } = drawCards(deckAfterPlayer, 2)

		const game = await repository.createGame({
			playerName,
			betAmount,
			playerCards,
			dealerCards,
			deckState,
			playerScore: calculateScore(playerCards),
			dealerScore: calculateScore(dealerCards),
			gameStatus: 'PLAYER_TURN',
			result: null,
		})

		return toView(game)
	}

	async function getGame(gameId: number) {
		const game = await repository.getGameById(gameId)

		return game ? toView(game) : null
	}

	async function hit(gameId: number) {
		const game = await repository.getGameById(gameId)

		if (!game) {
			return null
		}

		if (game.gameStatus === 'FINISHED') {
			return toView(game)
		}

		if (game.deckState.length === 0) {
			throw new Error('The deck is empty')
		}

		const [nextCard, ...remainingDeck] = game.deckState
		const playerCards = [...game.playerCards, nextCard]
		const playerScore = calculateScore(playerCards)
		const isBust = playerScore > 21
		const updatedRecord: BlackjackGameRecord = {
			...game,
			playerCards,
			deckState: remainingDeck,
			playerScore,
			dealerScore: game.dealerScore,
			gameStatus: isBust ? 'FINISHED' : 'PLAYER_TURN',
			result: isBust ? 'LOSE' : null,
		}

		const updatedGame = await repository.updateGame(gameId, {
			playerName: updatedRecord.playerName,
			betAmount: updatedRecord.betAmount,
			playerCards: updatedRecord.playerCards,
			dealerCards: updatedRecord.dealerCards,
			deckState: updatedRecord.deckState,
			playerScore: updatedRecord.playerScore,
			dealerScore: updatedRecord.dealerScore,
			gameStatus: updatedRecord.gameStatus,
			result: updatedRecord.result,
		})

		return updatedGame ? toView(updatedGame) : null
	}

	async function stand(gameId: number) {
		const game = await repository.getGameById(gameId)

		if (!game) {
			return null
		}

		if (game.gameStatus === 'FINISHED') {
			return toView(game)
		}

		const dealerOutcome = dealerTurn(game.dealerCards, game.deckState)
		const result = determineWinner(game.playerScore, dealerOutcome.dealerScore)
		const updatedRecord: BlackjackGameRecord = {
			...game,
			dealerCards: dealerOutcome.dealerCards,
			deckState: dealerOutcome.deckState,
			dealerScore: dealerOutcome.dealerScore,
			gameStatus: 'FINISHED',
			result,
		}

		const updatedGame = await repository.updateGame(gameId, {
			playerName: updatedRecord.playerName,
			betAmount: updatedRecord.betAmount,
			playerCards: updatedRecord.playerCards,
			dealerCards: updatedRecord.dealerCards,
			deckState: updatedRecord.deckState,
			playerScore: updatedRecord.playerScore,
			dealerScore: updatedRecord.dealerScore,
			gameStatus: updatedRecord.gameStatus,
			result: updatedRecord.result,
		})

		return updatedGame ? toView(updatedGame) : null
	}

	return {
		startGame,
		getGame,
		hit,
		stand,
	}
}

export type BlackjackService = ReturnType<typeof createBlackjackService>
