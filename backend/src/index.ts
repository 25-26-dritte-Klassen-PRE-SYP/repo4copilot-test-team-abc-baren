import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gamesRouter from './routes/games';
import bookingsRouter from './routes/bookings';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
}));
app.use(express.json());

// Routes
app.use('/api/games', gamesRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
