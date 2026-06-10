export interface BlackjackGame {
  id: number
  playerName: string
  betAmount: number
  playerCards: string[]
  dealerCards: string[]
  playerScore: number
  dealerScore: number | null
  status: 'PLAYER_TURN' | 'DEALER_TURN' | 'FINISHED'
  result: 'WIN' | 'LOSE' | 'PUSH' | null
  createdAt: Date
}

export function createBlackjackRepository() {
  const games = new Map<number, BlackjackGame>()
  let gameIdCounter = 1

  return {
    createGame(playerName: string, betAmount: number): BlackjackGame {
      const game: BlackjackGame = {
        id: gameIdCounter++,
        playerName,
        betAmount,
        playerCards: [],
        dealerCards: [],
        playerScore: 0,
        dealerScore: null,
        status: 'PLAYER_TURN',
        result: null,
        createdAt: new Date(),
      }
      games.set(game.id, game)
      return game
    },

    getGame(gameId: number): BlackjackGame | undefined {
      return games.get(gameId)
    },

    updateGame(gameId: number, updates: Partial<BlackjackGame>): BlackjackGame | undefined {
      const game = games.get(gameId)
      if (!game) return undefined
      const updated = { ...game, ...updates }
      games.set(gameId, updated)
      return updated
    },

    getAllGames(): BlackjackGame[] {
      return Array.from(games.values())
    },
  }
}

export type BlackjackRepository = ReturnType<typeof createBlackjackRepository>
