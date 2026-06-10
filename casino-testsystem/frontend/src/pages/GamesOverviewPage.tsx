import { GameCard } from '../games/blackjack/components/GameCard'

type GameDefinition = {
  title: string
  description: string
  icon: string
  actionLabel: string
  comingSoon?: boolean
}

const games: GameDefinition[] = [
  {
    title: 'Blackjack',
    description: 'Beat the dealer and reach 21 without going bust.',
    icon: '♠',
    actionLabel: 'Spielen',
  },
  {
    title: 'Roulette',
    description: 'Spin the wheel and watch the ball land on your number.',
    icon: '◉',
    actionLabel: 'Spielen',
    comingSoon: true,
  },
  {
    title: 'Slots',
    description: 'Classic reels, lights, and bonus rounds are on the way.',
    icon: '◆',
    actionLabel: 'Spielen',
    comingSoon: true,
  },
  {
    title: 'Poker',
    description: 'Table action, reads, and big pots are coming next.',
    icon: '♥',
    actionLabel: 'Spielen',
    comingSoon: true,
  },
]

type GamesOverviewPageProps = {
  onPlayBlackjack: () => void
}

export function GamesOverviewPage({ onPlayBlackjack }: GamesOverviewPageProps) {

  return (
    <main className="casino-page">
      <div className="page-frame">
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">Casino floor</p>
            <h1>Casino Games</h1>
            <p className="intro">
              Choose a table, step into the neon light, and start with the only playable floor game for now: Blackjack.
            </p>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <span className="stat-label">Playable</span>
              <span className="stat-value">1</span>
              <span className="metric-copy">Blackjack is ready to play.</span>
            </div>
            <div className="metric-card">
              <span className="stat-label">Coming soon</span>
              <span className="stat-value stat-value--sky">3</span>
              <span className="metric-copy">More casino tables will follow.</span>
            </div>
            <div className="metric-card">
              <span className="stat-label">Design</span>
              <span className="stat-value stat-value--emerald">Mobile-first</span>
              <span className="metric-copy">Responsive layout with hover states.</span>
            </div>
          </div>
        </section>

        <section>
          <div className="section-heading">
            <div>
              <h2>Available games</h2>
              <p>Pick a game card and jump straight into the table.</p>
            </div>
          </div>

          <div className="games-grid">
            {games.map((game) => (
              <GameCard
                key={game.title}
                title={game.title}
                description={game.description}
                icon={game.icon}
                actionLabel={game.actionLabel}
                comingSoon={game.comingSoon}
                onPlay={() => {
                  if (game.title === 'Blackjack') {
                    onPlayBlackjack()
                  }
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
