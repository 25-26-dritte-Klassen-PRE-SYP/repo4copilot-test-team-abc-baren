import App from '../App'

type BlackjackPageProps = {
  onBackToOverview: () => void
}

export function BlackjackPage(_props: BlackjackPageProps) {
  return (
	<main className="casino-page">
	  <div className="page-frame page-frame--compact">
		<header className="game-header panel-surface">
		  <div>
			<p className="eyebrow">Table game</p>
			<h1>Blackjack</h1>
		  </div>
		</header>
		<div style={{ padding: 24 }}>
		  <App />
		</div>
	  </div>
	</main>
  )
}
