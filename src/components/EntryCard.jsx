import { Copy, Heart, Trash2, ArrowUpRight } from 'lucide-react'
import TypeIcon from './TypeIcon.jsx'
import { typeLabel } from '../data/options.js'
import { copyText } from '../utils/browser.js'
import { countWords, formatDate, snippet } from '../utils/text.js'
import { useApp } from '../context/AppContext.jsx'

export default function EntryCard({ entry, onDelete, deleteLabel = 'Delete' }) {
  const { openEntry, toggleFavorite, isFavorite, toast } = useApp()
  const fav = isFavorite(entry.id)

  const copy = async () => {
    const ok = await copyText(entry.text)
    toast(ok ? 'Copied to clipboard' : 'Copy failed. Select the text and copy it manually.', ok ? 'success' : 'error')
  }

  return (
    <article className="card entry">
      <div className="entry-head">
        <span className="type-badge">
          <TypeIcon type={entry.type} size={14} />
          {typeLabel(entry.type)}
        </span>
        <span className="muted small">{formatDate(entry.createdAt)}</span>
      </div>
      <h3 className="entry-title">{entry.title}</h3>
      <p className="entry-snippet muted">{snippet(entry.text)}</p>
      <div className="entry-foot">
        <span className="muted small">{entry.tone} · {countWords(entry.text)} words</span>
        <div className="entry-actions">
          <button className="icon-btn" onClick={copy} aria-label={`Copy ${entry.title}`} title="Copy"><Copy size={16} /></button>
          <button className={`icon-btn ${fav ? 'is-fav' : ''}`} onClick={() => toggleFavorite(entry)} aria-pressed={fav} aria-label={fav ? 'Remove from favorites' : 'Save to favorites'} title={fav ? 'Remove from favorites' : 'Save to favorites'}>
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(entry)} aria-label={`${deleteLabel} ${entry.title}`} title={deleteLabel}><Trash2 size={16} /></button>
          <button className="btn btn-small" onClick={() => openEntry(entry)}>
            Open <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
