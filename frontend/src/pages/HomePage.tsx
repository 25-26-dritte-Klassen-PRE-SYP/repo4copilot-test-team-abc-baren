import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const HomePageContent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Gaming Platform</h1>
        <p className="text-xl text-gray-600">Play your favorite games and test your luck!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="text-4xl mb-2">🃏</div>
          <h3 className="font-bold text-lg mb-2">Card Games</h3>
          <p className="text-gray-600">High-Low and other card games</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-4xl mb-2">🎲</div>
          <h3 className="font-bold text-lg mb-2">Dice Games</h3>
          <p className="text-gray-600">Roll and win big prizes</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <div className="text-4xl mb-2">🎰</div>
          <h3 className="font-bold text-lg mb-2">Slots</h3>
          <p className="text-gray-600">Classic slot machine fun</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <div className="text-4xl mb-2">🎡</div>
          <h3 className="font-bold text-lg mb-2">Roulette</h3>
          <p className="text-gray-600">European roulette tables</p>
        </div>
      </div>

      <div className="bg-indigo-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
        <p className="text-gray-600 mb-6">
          Choose your favorite game from the selection and start winning today!
        </p>
        <a
          href="/games"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Play Now →
        </a>
      </div>
    </div>
  )
}

const HomePage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePageContent />
    </QueryClientProvider>
  )
}

export default HomePage
