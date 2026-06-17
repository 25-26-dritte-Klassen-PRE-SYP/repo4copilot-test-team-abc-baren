import type { Pool } from 'pg'

export interface User {
  id: number
  username: string
  currentBalance: number
}

export interface BlackjackGame {
  id: number
  userId: number
  playerName: string
  betAmount: number
  playerCards: string[]
  dealerCards: string[]
  playerScore: number
  dealerScore: number | null
  status: 'PLAYER_TURN' | 'DEALER_TURN' | 'FINISHED'
  result: 'WIN' | 'LOSE' | 'PUSH' | null
  userBalanceAfter: number | null
  createdAt: Date
}

const defaultUserId = 1

function normalizeCards(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function rowToGame(row: any): BlackjackGame {
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    playerName: String(row.player_name),
    betAmount: Number(row.bet_amount),
    playerCards: normalizeCards(row.player_cards),
    dealerCards: normalizeCards(row.dealer_cards),
    playerScore: Number(row.player_score),
    dealerScore: row.dealer_score === null ? null : Number(row.dealer_score),
    status: String(row.game_status) as BlackjackGame['status'],
    result: row.result === null ? null : (String(row.result) as BlackjackGame['result']),
    userBalanceAfter:
      row.user_balance_after === null || row.user_balance_after === undefined
        ? null
        : Number(row.user_balance_after),
    createdAt: new Date(row.created_at),
  }
}

function rowToUser(row: any): User {
  return {
    id: Number(row.id),
    username: String(row.username),
    currentBalance: Number(row.current_balance),
  }
}

export type BlackjackRepository = {
  createGame(playerName: string, betAmount: number, userId?: number): Promise<BlackjackGame>
  getGame(gameId: number): Promise<BlackjackGame | undefined>
  updateGame(gameId: number, updates: Partial<BlackjackGame>): Promise<BlackjackGame | undefined>
  getUserById(userId: number): Promise<User | undefined>
  getDefaultUser(): Promise<User | undefined>
  adjustUserBalance(userId: number, delta: number): Promise<number>
}

export function createBlackjackRepository(pool?: Pool): BlackjackRepository {
  if (!pool) {
    return createInMemoryRepository()
  }
  return createDbRepository(pool)
}

function createInMemoryRepository(): BlackjackRepository {
  const games = new Map<number, BlackjackGame>()
  const users = new Map<number, User>()
  users.set(defaultUserId, {
    id: defaultUserId,
    username: 'guest',
    currentBalance: 1000,
  })
  let gameIdCounter = 1

  return {
    async createGame(playerName: string, betAmount: number, userId = defaultUserId) {
      const game: BlackjackGame = {
        id: gameIdCounter++,
        userId,
        playerName,
        betAmount,
        playerCards: [],
        dealerCards: [],
        playerScore: 0,
        dealerScore: null,
        status: 'PLAYER_TURN',
        result: null,
        userBalanceAfter: null,
        createdAt: new Date(),
      }
      games.set(game.id, game)
      return game
    },

    async getGame(gameId: number) {
      return games.get(gameId)
    },

    async updateGame(gameId: number, updates: Partial<BlackjackGame>) {
      const game = games.get(gameId)
      if (!game) return undefined
      const updated = { ...game, ...updates }
      games.set(gameId, updated)
      return updated
    },

    async getUserById(userId: number) {
      return users.get(userId)
    },

    async getDefaultUser() {
      return users.get(defaultUserId)
    },

    async adjustUserBalance(userId: number, delta: number) {
      const user = users.get(userId)
      if (!user) throw new Error(`User ${userId} not found`)
      user.currentBalance = Number((user.currentBalance + delta).toFixed(2))
      users.set(userId, user)
      return user.currentBalance
    },
  }
}

function createDbRepository(pool: Pool): BlackjackRepository {
  return {
    async createGame(playerName: string, betAmount: number, userId = defaultUserId) {
      const result = await pool.query(
        `INSERT INTO blackjack_games (
           player_name,
           user_id,
           bet_amount,
           player_cards,
           dealer_cards,
           deck_state,
           player_score,
           dealer_score,
           game_status,
           result,
           user_balance_after
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [playerName, userId, betAmount, [], [], [], 0, null, 'PLAYER_TURN', null, null],
      )
      return rowToGame(result.rows[0])
    },

    async getGame(gameId: number) {
      const result = await pool.query('SELECT * FROM blackjack_games WHERE id = $1', [gameId])
      if (result.rowCount === 0) return undefined
      return rowToGame(result.rows[0])
    },

    async updateGame(gameId: number, updates: Partial<BlackjackGame>) {
      const existingGame = await this.getGame(gameId)
      if (!existingGame) return undefined
      const updatedGame = { ...existingGame, ...updates }

      const result = await pool.query(
        `UPDATE blackjack_games SET
           player_name = $1,
           user_id = $2,
           bet_amount = $3,
           player_cards = $4,
           dealer_cards = $5,
           deck_state = $6,
           player_score = $7,
           dealer_score = $8,
           game_status = $9,
           result = $10,
           user_balance_after = $11,
           updated_at = NOW()
         WHERE id = $12
         RETURNING *`,
        [
          updatedGame.playerName,
          updatedGame.userId,
          updatedGame.betAmount,
          updatedGame.playerCards,
          updatedGame.dealerCards,
          [],
          updatedGame.playerScore,
          updatedGame.dealerScore,
          updatedGame.status,
          updatedGame.result,
          updatedGame.userBalanceAfter,
          gameId,
        ],
      )

      return rowToGame(result.rows[0])
    },

    async getUserById(userId: number) {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
      if (result.rowCount === 0) return undefined
      return rowToUser(result.rows[0])
    },

    async getDefaultUser() {
      return this.getUserById(defaultUserId)
    },

    async adjustUserBalance(userId: number, delta: number) {
      const result = await pool.query(
        `UPDATE users SET
           current_balance = current_balance + $1,
           updated_at = NOW()
         WHERE id = $2
         RETURNING current_balance`,
        [delta, userId],
      )
      if (result.rowCount === 0) {
        throw new Error(`User ${userId} not found`)
      }
      return Number(result.rows[0].current_balance)
    },
  }
}
