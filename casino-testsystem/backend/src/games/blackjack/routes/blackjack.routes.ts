import { Router } from 'express'
import type { BlackjackService } from '../service/blackjack.service.ts'

export function createBlackjackRouter(service: BlackjackService) {
  const router = Router()

  router.post('/start', async (req: any, res: any, next: any) => {
    try {
      const { playerName, betAmount } = req.body as {
        playerName?: string
        betAmount?: number
      }

      if (!playerName || !betAmount) {
        return res.status(400).json({
          error: 'playerName and betAmount are required',
        })
      }

      const game = await service.startGame(playerName, betAmount)
      res.status(201).json(game)
    } catch (error) {
      next(error)
    }
  })

  router.get('/:gameId', async (req: any, res: any, next: any) => {
    try {
      const gameId = Number(req.params.gameId)

      if (Number.isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid gameId' })
      }

      const game = await service.getGame(gameId)
      res.status(200).json(game)
    } catch (error) {
      next(error)
    }
  })

  router.post('/:gameId/hit', async (req: any, res: any, next: any) => {
    try {
      const gameId = Number(req.params.gameId)

      if (Number.isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid gameId' })
      }

      const game = await service.hit(gameId)
      res.status(200).json(game)
    } catch (error) {
      next(error)
    }
  })

  router.post('/:gameId/stand', async (req: any, res: any, next: any) => {
    try {
      const gameId = Number(req.params.gameId)

      if (Number.isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid gameId' })
      }

      const game = await service.stand(gameId)
      res.status(200).json(game)
    } catch (error) {
      next(error)
    }
  })

  return router
}
