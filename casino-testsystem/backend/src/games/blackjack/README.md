# Blackjack Backend

This folder contains the backend entry points for the Blackjack game.

## Responsibilities

- create and shuffle the deck
- score player and dealer hands
- handle Hit and Stand actions
- determine the winner
- persist game state in PostgreSQL

## API

- `POST /api/blackjack/start`
- `POST /api/blackjack/:gameId/hit`
- `POST /api/blackjack/:gameId/stand`
- `GET /api/blackjack/:gameId`

## Feature files

- `controller/blackjack.controller.ts`
- `routes/blackjack.routes.ts`
- `service/blackjack.service.ts`
- `model/blackjack.model.ts`
