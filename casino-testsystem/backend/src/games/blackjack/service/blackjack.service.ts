import type { BlackjackRepository, BlackjackGame } from '../model/blackjack.model.ts'

export interface BlackjackGameView {
  gameId: number
  playerName: string
  betAmount: number
  playerCards: string[]
  dealerCards: string[]
  playerScore: number
  dealerScore: number | null
  status: 'PLAYER_TURN' | 'DEALER_TURN' | 'FINISHED'
  result: 'WIN' | 'LOSE' | 'PUSH' | null
}

export interface BlackjackService {
  startGame(playerName: string, betAmount: number): Promise<BlackjackGameView>
  hit(gameId: number): Promise<BlackjackGameView>
  stand(gameId: number): Promise<BlackjackGameView>
  getGame(gameId: number): Promise<BlackjackGameView>
}

const SUITS = ['♠', '♥', '♦', '♣']
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function createDeck(): string[] {
  const deck: string[] = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push(`${value}${suit}`)
    }
  }
  return deck.sort(() => Math.random() - 0.5)
}

function calculateScore(cards: string[]): number {
  let score = 0
  let aces = 0

  for (const card of cards) {
    const value = card.slice(0, -1)
    if (value === 'A') {
      aces++
      score += 11
    } else if (['J', 'Q', 'K'].includes(value)) {
      score += 10
    } else {
      score += Number(value)
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10
    aces--
  }

  return score
}

function gameToView(game: BlackjackGame): BlackjackGameView {
  return {
    gameId: game.id,
    playerName: game.playerName,
    betAmount: game.betAmount,
    playerCards: game.playerCards,
    dealerCards:
      game.status === 'FINISHED'
        ? game.dealerCards
        : [game.dealerCards[0] || 'hidden', 'hidden'],
    playerScore: game.playerScore,
    dealerScore: game.dealerScore,
    status: game.status,
    result: game.result,
  }
}

export function createBlackjackService(options: { repository: BlackjackRepository }): BlackjackService {
  const { repository } = options
  const decks = new Map<number, string[]>()

  function getOrCreateDeck(gameId: number): string[] {
    if (!decks.has(gameId)) {
      decks.set(gameId, createDeck())
    }
    return decks.get(gameId)!
  }

  function drawCard(gameId: number): string {
    const deck = getOrCreateDeck(gameId)
    if (deck.length === 0) {
      decks.set(gameId, createDeck())
      return decks.get(gameId)!.pop()!
    }
    return deck.pop()!
  }

  return {
    async startGame(playerName: string, betAmount: number): Promise<BlackjackGameView> {
      const game = repository.createGame(playerName, betAmount)

      game.playerCards = [drawCard(game.id), drawCard(game.id)]
      game.dealerCards = [drawCard(game.id), drawCard(game.id)]

      game.playerScore = calculateScore(game.playerCards)
      game.dealerScore = calculateScore(game.dealerCards)

      if (game.playerScore === 21) {
        game.status = 'FINISHED'
        game.result = 'WIN'
      }

      repository.updateGame(game.id, game)
      return gameToView(game)
    },

    async hit(gameId: number): Promise<BlackjackGameView> {
      const game = repository.getGame(gameId)
      if (!game) throw new Error(`Game ${gameId} not found`)

      game.playerCards.push(drawCard(gameId))
      game.playerScore = calculateScore(game.playerCards)

      if (game.playerScore > 21) {
        game.status = 'FINISHED'
        game.result = 'LOSE'
      }

      repository.updateGame(gameId, game)
      return gameToView(game)
    },

    async stand(gameId: number): Promise<BlackjackGameView> {
      const game = repository.getGame(gameId)
      if (!game) throw new Error(`Game ${gameId} not found`)

      game.status = 'DEALER_TURN'
      if (game.dealerScore === null) {
        game.dealerScore = 0
      }

      while (game.dealerScore < 17) {
        game.dealerCards.push(drawCard(gameId))
        game.dealerScore = calculateScore(game.dealerCards)
      }

      if (game.dealerScore > 21) {
        game.result = 'WIN'
      } else if (game.dealerScore > game.playerScore) {
        game.result = 'LOSE'
      } else if (game.dealerScore === game.playerScore) {
        game.result = 'PUSH'
      } else {
        game.result = 'WIN'
      }

      game.status = 'FINISHED'
      repository.updateGame(gameId, game)
      return gameToView(game)
    },

    async getGame(gameId: number): Promise<BlackjackGameView> {
      const game = repository.getGame(gameId)
      if (!game) throw new Error(`Game ${gameId} not found`)
      return gameToView(game)
    },
  }
}
