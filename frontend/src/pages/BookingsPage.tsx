import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const BookingsPageContent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>

      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">
          Play games to see your booking history here. Each game you play will be recorded with the result.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Games Played</p>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Bet Amount</p>
          <p className="text-3xl font-bold text-indigo-600">$0</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Winnings</p>
          <p className="text-3xl font-bold text-indigo-600">$0</p>
        </div>
      </div>
    </div>
  )
}

const BookingsPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BookingsPageContent />
    </QueryClientProvider>
  )
}

export default BookingsPage
