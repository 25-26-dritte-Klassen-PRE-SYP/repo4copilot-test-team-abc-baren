import { v4 as uuidv4 } from 'uuid';
import { Booking } from '../models/types';

// In-memory booking storage for MVP
const bookings: Booking[] = [];

export class BookingService {
  getAllBookings(): Booking[] {
    return bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return bookings.find(b => b.id === id);
  }

  getUserBookings(userId: string): Booking[] {
    return bookings.filter(b => b.userId === userId);
  }

  createBooking(userId: string, gameId: string, betAmount: number): Booking {
    // Simulate game result - 50% win, 50% loss
    const won = Math.random() > 0.5;
    const resultAmount = won ? betAmount * 2 : 0;

    const booking: Booking = {
      id: uuidv4(),
      userId,
      gameId,
      betAmount,
      resultAmount,
      status: 'completed',
      createdAt: new Date(),
    };
    bookings.push(booking);
    return booking;
  }

  getBookingStats(userId: string) {
    const userBookings = this.getUserBookings(userId);
    const totalBet = userBookings.reduce((sum, b) => sum + b.betAmount, 0);
    const totalWon = userBookings.reduce((sum, b) => sum + b.resultAmount, 0);
    const totalGames = userBookings.length;

    return {
      totalGames,
      totalBet,
      totalWon,
      profit: totalWon - totalBet,
      winRate: totalGames > 0 ? (userBookings.filter(b => b.resultAmount > 0).length / totalGames) * 100 : 0,
    };
  }
}

export default new BookingService();
