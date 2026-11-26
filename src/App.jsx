import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import MobileBar from './components/MobileBar.jsx'
import Toasts from './components/Toasts.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Generator from './pages/Generator.jsx'
import Templates from './pages/Templates.jsx'
import History from './pages/History.jsx'
import Favorites from './pages/Favorites.jsx'
import Settings from './pages/Settings.jsx'
import { useApp } from './context/AppContext.jsx'

const PAGES = {
  dashboard: Dashboard,
  generator: Generator,
  templates: Templates,
  history: History,
  favorites: Favorites,
  settings: Settings,
}

export default function App() {
  const { page } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const Page = PAGES[page] || Dashboard

  return (
    <div className="app">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <MobileBar onMenu={() => setMenuOpen(true)} />
        <main id="main">
          <Page />
        </main>
      </div>
      <Toasts />
    </div>
  )
}
