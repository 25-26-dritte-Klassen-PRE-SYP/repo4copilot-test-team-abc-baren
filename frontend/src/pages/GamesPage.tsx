import React, { useState } from 'react'
import GameCard from '../components/GameCard'
import BookingResult from '../components/BookingResult'
import { useGames, usePlayGame } from '../hooks/useAPI'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const GamesPageContent: React.FC = () => {
  const { data: games, isLoading: gamesLoading } = useGames()
  const playGameMutation = usePlayGame()
  const [lastBooking, setLastBooking] = useState<any>(null)
  const [betAmount, setBetAmount] = useState('10')
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  const handlePlayGame = async (gameId: string) => {
    setSelectedGameId(gameId)
    const userId = 'demo-user-' + Math.random().toString(36).substr(2, 9)

    try {
      const booking = await playGameMutation.mutateAsync({
        userId,
        gameId,
        betAmount: parseFloat(betAmount),
      })
      setLastBooking(booking)
      setTimeout(() => {
        setSelectedGameId(null)
      }, 2000)
    } catch (error) {
      console.error('Error playing game:', error)
      setSelectedGameId(null)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Games</h1>

      {lastBooking && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Last Result</h2>
          <BookingResult booking={lastBooking} />
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium mb-2">Bet Amount ($)</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          min="1"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
        />
      </div>

      {gamesLoading ? (
        <div className="text-center text-gray-500">Loading games...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games?.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={handlePlayGame}
              isLoading={selectedGameId === game.id && playGameMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const GamesPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GamesPageContent />
    </QueryClientProvider>
  )
}

export default GamesPage
