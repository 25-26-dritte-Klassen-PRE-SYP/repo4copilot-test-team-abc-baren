import type { BlackjackService } from '../service/blackjack.service'

function toNumber(value: string) {
	const parsedValue = Number(value)

	return Number.isFinite(parsedValue) ? parsedValue : null
}

export function createBlackjackController(service: BlackjackService) {
	return {
		async start(req: any, res: any) {
			const playerName = typeof req.body?.playerName === 'string' ? req.body.playerName.trim() : ''
			const betAmount = Number(req.body?.betAmount)

			if (!playerName) {
				return res.status(400).json({ message: 'playerName is required' })
			}

			if (!Number.isFinite(betAmount) || betAmount <= 0) {
				return res.status(400).json({ message: 'betAmount must be greater than 0' })
			}

			const game = await service.startGame(playerName, betAmount)

			return res.status(201).json(game)
		},

		async hit(req: any, res: any) {
			const gameId = toNumber(req.params.gameId)

			if (gameId === null) {
				return res.status(400).json({ message: 'gameId must be a number' })
			}

			const game = await service.hit(gameId)

			if (!game) {
				return res.status(404).json({ message: 'Game not found' })
			}

			return res.json(game)
		},

		async stand(req: any, res: any) {
			const gameId = toNumber(req.params.gameId)

			if (gameId === null) {
				return res.status(400).json({ message: 'gameId must be a number' })
			}

			const game = await service.stand(gameId)

			if (!game) {
				return res.status(404).json({ message: 'Game not found' })
			}

			return res.json(game)
		},

		async getById(req: any, res: any) {
			const gameId = toNumber(req.params.gameId)

			if (gameId === null) {
				return res.status(400).json({ message: 'gameId must be a number' })
			}

			const game = await service.getGame(gameId)

			if (!game) {
				return res.status(404).json({ message: 'Game not found' })
			}

			return res.json(game)
		},
	}
}
