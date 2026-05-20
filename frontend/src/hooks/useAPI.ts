import { useQuery, useMutation } from '@tanstack/react-query'
import { gameAPI, bookingAPI } from '../api/client'

export const useGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: gameAPI.getAllGames,
  })
}

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => bookingAPI.getUserBookings(userId),
    enabled: !!userId,
  })
}

export const usePlayGame = () => {
  return useMutation({
    mutationFn: ({ userId, gameId, betAmount }: { userId: string; gameId: string; betAmount: number }) =>
      bookingAPI.playGame(userId, gameId, betAmount),
  })
}

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['stats', userId],
    queryFn: () => bookingAPI.getStats(userId),
    enabled: !!userId,
  })
}
