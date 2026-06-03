import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createApp } from '../src/app'
import type { BlackjackGameView, BlackjackService } from '../src/services/blackjack.service'

const baseGame: BlackjackGameView = {
  gameId: 1,
  playerName: 'Max',
  betAmount: 10,
  playerCards: ['A♠', '8♥'],
  dealerCards: ['K♦', 'hidden'],
  playerScore: 19,
  dealerScore: null,
  status: 'PLAYER_TURN',
  result: null,
}

const finishedGame: BlackjackGameView = {
  ...baseGame,
  dealerCards: ['K♦', '7♣'],
  dealerScore: 17,
  status: 'FINISHED',
  result: 'WIN',
}

describe('blackjack api', () => {
  it('starts and loads a blackjack game', async () => {
    const service: BlackjackService = {
      startGame: async () => baseGame,
      hit: async () => baseGame,
      stand: async () => finishedGame,
      getGame: async () => finishedGame,
    } as BlackjackService

    const app = createApp({ blackjackService: service })

    const server = app.listen(0)
    const address = server.address()
    if (!address || typeof address === 'string') {
      throw new Error('Test server did not start correctly')
    }

    const baseUrl = `http://127.0.0.1:${address.port}`

    try {
      const startResponse = await fetch(`${baseUrl}/api/blackjack/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: 'Max', betAmount: 10 }),
      })
      const startBody = await startResponse.json()

      assert.equal(startResponse.status, 201)
      assert.deepEqual(startBody.playerCards, ['A♠', '8♥'])
      assert.deepEqual(startBody.dealerCards, ['K♦', 'hidden'])

      const loadResponse = await fetch(`${baseUrl}/api/blackjack/1`)
      const loadBody = await loadResponse.json()

      assert.equal(loadResponse.status, 200)
      assert.equal(loadBody.status, 'FINISHED')
      assert.equal(loadBody.result, 'WIN')

      const standResponse = await fetch(`${baseUrl}/api/blackjack/1/stand`, {
        method: 'POST',
      })
      const standBody = await standResponse.json()

      assert.equal(standResponse.status, 200)
      assert.equal(standBody.dealerScore, 17)
    } finally {
      server.close()
    }
  })
})
