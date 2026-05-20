export interface Game {
  id: string;
  name: string;
  description: string;
  type: 'card' | 'dice' | 'slots' | 'roulette';
  minBet: number;
  maxBet: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  gameId: string;
  betAmount: number;
  resultAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: Date;
}
