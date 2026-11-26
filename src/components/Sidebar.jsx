import { useEffect } from 'react'
import { FolderOpen, Heart, LayoutDashboard, LayoutTemplate, PenLine, Settings, Sparkles, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generator', label: 'AI Generator', icon: Sparkles },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'history', label: 'My Content', icon: FolderOpen, count: 'history' },
  { id: 'favorites', label: 'Favorites', icon: Heart, count: 'favorites' },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const PAGE_TITLES = Object.fromEntries(NAV.map((n) => [n.id, n.label]))

export default function Sidebar({ open, onClose }) {
  const { page, navigate, history, favorites, settings } = useApp()
  const counts = { history: history.length, favorites: favorites.length }
  const initials = (settings.name || 'U').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'U'

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const go = (id) => {
    navigate(id)
    onClose()
  }

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
        <div className="sidebar-top">
          <button className="brand" onClick={() => go('dashboard')} aria-label="ContentCraft AI home">
            <span className="brand-mark"><PenLine size={16} aria-hidden="true" /></span>
            <span className="brand-name">ContentCraft AI</span>
          </button>
          <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="nav">
          {NAV.map(({ id, label, icon: Icon, count }) => (
            <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => go(id)} aria-current={page === id ? 'page' : undefined}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
              {count && counts[count] > 0 && <span className="nav-count">{counts[count]}</span>}
            </button>
          ))}
        </nav>

        <button className="profile" onClick={() => go('settings')} aria-label="Open profile settings">
          <span className="avatar">{initials}</span>
          <span className="profile-text">
            <strong>{settings.name || 'Your name'}</strong>
            <small>Demo workspace</small>
          </span>
        </button>
      </aside>
    </>
  )
}
