import { useMemo, useState } from 'react'
import { FolderOpen, Search, SearchX, X } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import EntryCard from '../components/EntryCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CONTENT_TYPES } from '../data/options.js'

export default function History() {
  const { history, deleteEntry, navigate, toast } = useApp()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return history.filter((e) => (type === 'all' || e.type === type) && (!q || `${e.title} ${e.topic} ${e.text} ${e.keywords}`.toLowerCase().includes(q)))
  }, [history, query, type])

  const confirmDelete = () => {
    deleteEntry(pendingDelete.id)
    setPendingDelete(null)
    toast('Entry deleted')
  }

  const reset = () => {
    setQuery('')
    setType('all')
  }

  return (
    <div className="page">
      <PageHeader title="My Content" description="Everything you have generated, saved in this browser." />

      {history.length > 0 && (
        <div className="filters">
          <div className="search">
            <Search size={16} aria-hidden="true" />
            <input className="input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, topic or text" aria-label="Search content" />
            {query && <button className="icon-btn" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
          </div>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by content type">
            <option value="all">All types</option>
            {CONTENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <span className="muted small filters-count" aria-live="polite">{filtered.length} of {history.length}</span>
        </div>
      )}

      {history.length === 0 ? (
        <div className="card"><EmptyState icon={FolderOpen} title="Nothing here yet" message="Drafts you generate are saved automatically and appear in this list." action={<button className="btn btn-primary" onClick={() => navigate('generator')}>Generate content</button>} /></div>
      ) : filtered.length === 0 ? (
        <div className="card"><EmptyState icon={SearchX} title="No matches" message="Try a different search term or choose another content type." action={<button className="btn" onClick={reset}>Reset filters</button>} /></div>
      ) : (
        <div className="grid-2">
          {filtered.map((e) => <EntryCard key={e.id} entry={e} onDelete={setPendingDelete} />)}
        </div>
      )}

      <ConfirmDialog open={!!pendingDelete} title="Delete this entry?" message={pendingDelete ? `“${pendingDelete.title}” will be removed from your history. Favorites keep their own copy.` : ''} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  )
}
