import axios from 'axios'

export interface Game {
  id: string
  name: string
  description: string
  type: 'card' | 'dice' | 'slots' | 'roulette'
  minBet: number
  maxBet: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Booking {
  id: string
  userId: string
  gameId: string
  betAmount: number
  resultAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

const API = axios.create({
  baseURL: '/api',
})

export const gameAPI = {
  getAllGames: async (): Promise<Game[]> => {
    const response = await API.get('/games')
    return response.data
  },

  getGameById: async (id: string): Promise<Game> => {
    const response = await API.get(`/games/${id}`)
    return response.data
  },
}

export const bookingAPI = {
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await API.get(`/bookings/user/${userId}`)
    return response.data
  },

  playGame: async (userId: string, gameId: string, betAmount: number): Promise<Booking> => {
    const response = await API.post('/bookings', {
      userId,
      gameId,
      betAmount,
    })
    return response.data
  },

  getStats: async (userId: string) => {
    const response = await API.get(`/bookings/stats/${userId}`)
    return response.data
  },
}
