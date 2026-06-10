import express from 'express'
import cors from 'cors'
import { pool } from './lib/db.ts'
import { createBlackjackRepository } from './games/blackjack/model/blackjack.model.ts'
import { createBlackjackRouter } from './games/blackjack/routes/blackjack.routes.ts'
import { createBlackjackService, type BlackjackService } from './games/blackjack/service/blackjack.service.ts'

export type CreateAppOptions = {
  blackjackService?: BlackjackService
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express()
  const blackjackService =
    options.blackjackService ??
    createBlackjackService({
      repository: createBlackjackRepository(pool),
    })

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || '*',
    }),
  )
  app.use(express.json())

  app.get('/', (_req: any, res: any) => {
    res.send('Backend läuft')
  })

  app.get('/items', async (_req: any, res: any, next: any) => {
    try {
      const result = await pool.query('SELECT * FROM items ORDER BY id')
      res.json(result.rows)
    } catch (error) {
      next(error)
    }
  })

  app.post('/items', async (req: any, res: any, next: any) => {
    try {
      const { name } = req.body as { name?: string }
      const result = await pool.query(
        'INSERT INTO items (name) VALUES ($1) RETURNING *',
        [name],
      )
      res.json(result.rows[0])
    } catch (error) {
      next(error)
    }
  })

  app.put('/items/:id', async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params
      const { name } = req.body as { name?: string }
      const result = await pool.query(
        'UPDATE items SET name = $1 WHERE id = $2 RETURNING *',
        [name, id],
      )
      res.json(result.rows[0])
    } catch (error) {
      next(error)
    }
  })

  // Single-entry application state endpoints (no users/logins required)
  app.get('/state', async (_req: any, res: any, next: any) => {
    try {
      const result = await pool.query('SELECT state FROM app_state WHERE id = 1')
      const state = result.rows[0]?.state ?? {}
      res.json(state)
    } catch (error) {
      next(error)
    }
  })

  app.put('/state', async (req: any, res: any, next: any) => {
    try {
      const newState = req.body
      const result = await pool.query(
        `INSERT INTO app_state (id, state, updated_at)
         VALUES (1, $1, NOW())
         ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()
         RETURNING state`,
        [newState],
      )
      res.json(result.rows[0].state)
    } catch (error) {
      next(error)
    }
  })

  app.delete('/items/:id', async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params
      await pool.query('DELETE FROM items WHERE id = $1', [id])
      res.json({ message: 'Item gelöscht' })
    } catch (error) {
      next(error)
    }
  })

  app.use('/api/blackjack', createBlackjackRouter(blackjackService))

  app.use((error: unknown, _req: any, res: any, _next: any) => {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  })

  return app
}
