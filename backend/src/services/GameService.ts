import { v4 as uuidv4 } from 'uuid';
import { Game } from '../models/types';

// In-memory game storage for MVP
const games: Game[] = [
  {
    id: uuidv4(),
    name: 'High-Low Card Game',
    description: 'Guess if the next card is higher or lower',
    type: 'card',
    minBet: 1,
    maxBet: 100,
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Dice Roll',
    description: 'Roll the dice and bet on the outcome',
    type: 'dice',
    minBet: 1,
    maxBet: 50,
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Slots Machine',
    description: 'Classic slot machine with multiple lines',
    type: 'slots',
    minBet: 0.5,
    maxBet: 200,
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'European Roulette',
    description: 'Spin the wheel and bet on numbers or colors',
    type: 'roulette',
    minBet: 5,
    maxBet: 500,
    status: 'active',
    createdAt: new Date(),
  },
];

export class GameService {
  getAllGames(): Game[] {
    return games;
  }

  getGameById(id: string): Game | undefined {
    return games.find(g => g.id === id);
  }

  createGame(game: Omit<Game, 'id' | 'createdAt'>): Game {
    const newGame: Game = {
      ...game,
      id: uuidv4(),
      createdAt: new Date(),
    };
    games.push(newGame);
    return newGame;
  }

  updateGame(id: string, updates: Partial<Game>): Game | undefined {
    const index = games.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    
    games[index] = { ...games[index], ...updates };
    return games[index];
  }
}

export default new GameService();
