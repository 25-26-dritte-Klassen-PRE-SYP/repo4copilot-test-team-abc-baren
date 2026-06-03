import { Router } from 'express'
import type { BlackjackService } from '../services/blackjack.service'
import { createBlackjackController } from '../controllers/blackjack.controller'

export function createBlackjackRouter(service: BlackjackService) {
  const router = Router()
  const controller = createBlackjackController(service)

  router.post('/start', controller.start)
  router.post('/:gameId/hit', controller.hit)
  router.post('/:gameId/stand', controller.stand)
  router.get('/:gameId', controller.getById)

  return router
}
