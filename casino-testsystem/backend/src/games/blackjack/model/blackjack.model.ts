import { pool } from '../../../lib/db.js'
import type {
	BlackjackGameRecord,
	BlackjackGameStatus,
	BlackjackResult,
} from '../service/blackjack.service.js'

type BlackjackGameRow = {
	id: number
	player_name: string
	bet_amount: string | number
	player_cards: string[]
	dealer_cards: string[]
	deck_state: string[]
	player_score: number
	dealer_score: number
	game_status: BlackjackGameStatus
	result: BlackjackResult | null
	created_at: string
	updated_at: string
}

export type BlackjackGameInsert = Omit<BlackjackGameRecord, 'id' | 'createdAt' | 'updatedAt'>

function mapRow(row: BlackjackGameRow): BlackjackGameRecord {
	return {
		id: row.id,
		playerName: row.player_name,
		betAmount: Number(row.bet_amount),
		playerCards: row.player_cards,
		dealerCards: row.dealer_cards,
		deckState: row.deck_state,
		playerScore: row.player_score,
		dealerScore: row.dealer_score,
		gameStatus: row.game_status,
		result: row.result,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	}
}

async function saveGame(data: BlackjackGameInsert, gameId?: number): Promise<BlackjackGameRecord | null> {
	const values = [
		data.playerName,
		data.betAmount,
		JSON.stringify(data.playerCards),
		JSON.stringify(data.dealerCards),
		JSON.stringify(data.deckState),
		data.playerScore,
		data.dealerScore,
		data.gameStatus,
		data.result,
	]

	if (gameId === undefined) {
		const result = await pool.query(
			`
				INSERT INTO blackjack_games (
					player_name,
					bet_amount,
					player_cards,
					dealer_cards,
					deck_state,
					player_score,
					dealer_score,
					game_status,
					result
				)
				VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6, $7, $8, $9)
				RETURNING *
			`,
			values,
		)

		return mapRow(result.rows[0] as BlackjackGameRow)
	}

	const result = await pool.query(
		`
			UPDATE blackjack_games
			SET
				player_name = $1,
				bet_amount = $2,
				player_cards = $3::jsonb,
				dealer_cards = $4::jsonb,
				deck_state = $5::jsonb,
				player_score = $6,
				dealer_score = $7,
				game_status = $8,
				result = $9,
				updated_at = NOW()
			WHERE id = $10
			RETURNING *
		`,
		[...values, gameId],
	)

	return result.rows[0] ? mapRow(result.rows[0] as BlackjackGameRow) : null
}

export function createBlackjackRepository() {
	return {
		async createGame(data: BlackjackGameInsert) {
			return saveGame(data) as Promise<BlackjackGameRecord>
		},
		async updateGame(gameId: number, data: BlackjackGameInsert) {
			return saveGame(data, gameId)
		},
		async getGameById(gameId: number) {
			const result = await pool.query(
				'SELECT * FROM blackjack_games WHERE id = $1',
				[gameId],
			)

			return result.rows[0] ? mapRow(result.rows[0] as BlackjackGameRow) : null
		},
	}
}
