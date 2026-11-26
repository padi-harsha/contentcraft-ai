import { Heart } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import EntryCard from '../components/EntryCard.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function Favorites() {
  const { favorites, toggleFavorite, navigate } = useApp()
  return (
    <div className="page">
      <PageHeader title="Favorites" description="Drafts you saved to keep close. Removing one here does not delete it from My Content." />
      {favorites.length === 0 ? (
        <div className="card"><EmptyState icon={Heart} title="No favorites yet" message="Select the Save button in the editor, or the heart on any card, to keep a draft here." action={<button className="btn btn-primary" onClick={() => navigate('history')}>Browse My Content</button>} /></div>
      ) : (
        <div className="grid-2">
          {favorites.map((e) => <EntryCard key={e.id} entry={e} deleteLabel="Remove" onDelete={toggleFavorite} />)}
        </div>
      )}
    </div>
  )
}
