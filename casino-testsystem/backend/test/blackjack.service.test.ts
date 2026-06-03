import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateScore,
  createDeck,
  dealerTurn,
  determineWinner,
  shuffleDeck,
} from '../src/services/blackjack.service'

describe('blackjack service logic', () => {
  it('creates a complete deck', () => {
    const deck = createDeck()

    assert.equal(deck.length, 52)
    assert.equal(new Set(deck).size, 52)
  })

  it('calculates aces as 11 or 1', () => {
    assert.equal(calculateScore(['A♠', '8♥']), 19)
    assert.equal(calculateScore(['A♠', '8♥', '5♣']), 14)
    assert.equal(calculateScore(['A♠', 'A♦', '9♣']), 21)
  })

  it('determines the winner correctly', () => {
    assert.equal(determineWinner(20, 18), 'WIN')
    assert.equal(determineWinner(22, 18), 'LOSE')
    assert.equal(determineWinner(19, 19), 'DRAW')
    assert.equal(determineWinner(18, 22), 'WIN')
  })

  it('dealer draws until at least 17 points', () => {
    const outcome = dealerTurn(['6♠', '9♦'], ['2♣', 'K♣'])

    assert.ok(outcome.dealerScore >= 17)
    assert.equal(outcome.deckState.length, 1)
  })

  it('shuffles without changing card count', () => {
    const deck = createDeck()
    const shuffledDeck = shuffleDeck(deck, () => 0.5)

    assert.equal(shuffledDeck.length, 52)
    assert.equal(new Set(shuffledDeck).size, 52)
  })
})
