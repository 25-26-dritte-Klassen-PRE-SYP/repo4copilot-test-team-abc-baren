import { Router } from 'express'
import type { BlackjackService } from '../service/blackjack.service'
import { createBlackjackController } from '../controller/blackjack.controller.ts'

export function createBlackjackRouter(service: BlackjackService) {
	const router = Router()
	const controller = createBlackjackController(service)

	router.post('/start', controller.start)
	router.post('/:gameId/hit', controller.hit)
	router.post('/:gameId/stand', controller.stand)
	router.get('/:gameId', controller.getById)

	return router
}
