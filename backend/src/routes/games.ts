import express, { Request, Response } from 'express';
import gameService from '../services/GameService';

const router = express.Router();

// Get all games
router.get('/', (req: Request, res: Response) => {
  const games = gameService.getAllGames();
  res.json(games);
});

// Get game by ID
router.get('/:id', (req: Request, res: Response) => {
  const game = gameService.getGameById(req.params.id);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  res.json(game);
});

// Create new game (admin only)
router.post('/', (req: Request, res: Response) => {
  const { name, description, type, minBet, maxBet, status } = req.body;
  
  if (!name || !type || minBet === undefined || maxBet === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const game = gameService.createGame({
    name,
    description,
    type,
    minBet,
    maxBet,
    status: status || 'active',
  });

  res.status(201).json(game);
});

// Update game
router.put('/:id', (req: Request, res: Response) => {
  const game = gameService.updateGame(req.params.id, req.body);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  res.json(game);
});

export default router;
