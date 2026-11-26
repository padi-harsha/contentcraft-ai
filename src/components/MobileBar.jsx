import { Menu } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { PAGE_TITLES } from './Sidebar.jsx'

export default function MobileBar({ onMenu }) {
  const { page } = useApp()
  return (
    <div className="mobilebar">
      <button className="icon-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <strong>{PAGE_TITLES[page]}</strong>
    </div>
  )
}
