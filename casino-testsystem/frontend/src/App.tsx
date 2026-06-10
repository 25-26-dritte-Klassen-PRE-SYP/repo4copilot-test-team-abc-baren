import { useEffect, useState } from 'react'
import { BlackjackPage } from './games/blackjack/pages/BlackjackPage'
import { GamesOverviewPage } from './pages/GamesOverviewPage'
import './App.css'

type AppPath = '/games' | '/games/blackjack'

function getCurrentPath(): AppPath {
  return window.location.pathname === '/games/blackjack' ? '/games/blackjack' : '/games'
}

function navigate(nextPath: AppPath, replace = false) {
  if (replace) {
    window.history.replaceState({}, '', nextPath)
    return
  }

  window.history.pushState({}, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [path, setPath] = useState<AppPath>(getCurrentPath)

  useEffect(() => {
    const handleNavigation = () => setPath(getCurrentPath())

    window.addEventListener('popstate', handleNavigation)
    if (window.location.pathname !== '/games' && window.location.pathname !== '/games/blackjack') {
      navigate('/games', true)
      setPath('/games')
    }

    return () => window.removeEventListener('popstate', handleNavigation)
  }, [])

  return (
    <div className="app-shell">
      {path === '/games' ? (
        <GamesOverviewPage onPlayBlackjack={() => navigate('/games/blackjack')} />
      ) : (
        <BlackjackPage onBackToOverview={() => navigate('/games')} />
      )}
    </div>
  )
}

export default App