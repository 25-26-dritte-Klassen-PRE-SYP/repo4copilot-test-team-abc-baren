import express, { Request, Response } from 'express';
import bookingService from '../services/BookingService';

const router = express.Router();

// Get all bookings for a user
router.get('/user/:userId', (req: Request, res: Response) => {
  const bookings = bookingService.getUserBookings(req.params.userId);
  res.json(bookings);
});

// Get booking by ID
router.get('/:id', (req: Request, res: Response) => {
  const booking = bookingService.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json(booking);
});

// Create a new booking (play a game)
router.post('/', (req: Request, res: Response) => {
  const { userId, gameId, betAmount } = req.body;

  if (!userId || !gameId || !betAmount) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (betAmount <= 0) {
    res.status(400).json({ error: 'Bet amount must be positive' });
    return;
  }

  const booking = bookingService.createBooking(userId, gameId, betAmount);
  res.status(201).json(booking);
});

// Get user stats
router.get('/stats/:userId', (req: Request, res: Response) => {
  const stats = bookingService.getBookingStats(req.params.userId);
  res.json(stats);
});

export default router;
