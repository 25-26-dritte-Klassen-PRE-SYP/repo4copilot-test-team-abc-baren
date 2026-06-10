# Blackjack

Blackjack is the first playable game in the casino.

## Flow

1. The player starts a new round.
2. Two cards are dealt to the player.
3. Two cards are dealt to the dealer, with one hidden during the player's turn.
4. The player can draw additional cards with Hit or end the turn with Stand.
5. The dealer draws until at least 17 points.
6. The backend stores the round and returns the final result.

## Frontend files

- `pages/BlackjackPage.tsx`
- `components/BlackjackCard.tsx`
- `components/BlackjackControls.tsx`
- `components/BlackjackStatus.tsx`
- `services/blackjackApi.ts`
