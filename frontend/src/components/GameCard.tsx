import React from 'react'
import { Game } from '../api/client'

interface GameCardProps {
  game: Game
  onPlay: (gameId: string) => void
  isLoading?: boolean
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, isLoading }) => {
  const gameIcons: Record<string, string> = {
    card: '🃏',
    dice: '🎲',
    slots: '🎰',
    roulette: '🎡',
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{gameIcons[game.type] || '🎮'}</div>
      <h3 className="text-xl font-bold mb-2">{game.name}</h3>
      <p className="text-gray-600 mb-4">{game.description}</p>
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-gray-500">Min Bet</p>
          <p className="font-semibold">${game.minBet}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-gray-500">Max Bet</p>
          <p className="font-semibold">${game.maxBet}</p>
        </div>
      </div>
      <button
        onClick={() => onPlay(game.id)}
        disabled={isLoading || game.status === 'inactive'}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:bg-gray-400"
      >
        {isLoading ? 'Playing...' : 'Play'}
      </button>
    </div>
  )
}

export default GameCard
