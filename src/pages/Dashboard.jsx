import { ArrowUpRight, Clock, Heart, PenLine, Sparkles, TrendingUp, FileText } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TypeIcon from '../components/TypeIcon.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CONTENT_TYPES, typeLabel } from '../data/options.js'
import { TEMPLATES } from '../data/templates.js'
import { countWords, timeAgo } from '../utils/text.js'

const DAY = 24 * 3600 * 1000
const MONTHLY_GOAL = 10000
const QUICK_TYPES = ['blog', 'instagram', 'linkedin', 'email', 'product', 'youtube']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { settings, history, favorites, totalGenerated, navigate, startWithType, applyTemplate, openEntry } = useApp()
  const firstName = (settings.name || '').trim().split(/\s+/)[0] || 'there'
  const now = new Date()

  const weekCount = history.filter((e) => e.createdAt >= Date.now() - 7 * DAY).length
  const monthWords = history
    .filter((e) => {
      const d = new Date(e.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, e) => sum + countWords(e.text), 0)
  const goalPct = Math.min(100, Math.round((monthWords / MONTHLY_GOAL) * 100))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i))
    const key = d.toDateString()
    return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), count: history.filter((e) => new Date(e.createdAt).toDateString() === key).length }
  })
  const maxDay = Math.max(1, ...days.map((d) => d.count))

  const byType = CONTENT_TYPES.map((t) => ({ ...t, count: history.filter((e) => e.type === t.id).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const maxType = Math.max(1, ...byType.map((t) => t.count))

  const recent = history.slice(0, 5)
  const popular = TEMPLATES.filter((t) => t.popular)

  return (
    <div className="page">
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description="Pick up where you left off or start something new."
        actions={<button className="btn btn-primary" onClick={() => navigate('generator')}><Sparkles size={17} aria-hidden="true" /> New draft</button>}
      />

      <section className="stats" aria-label="Overview">
        <div className="card stat"><span className="stat-icon"><FileText size={18} aria-hidden="true" /></span><strong>{totalGenerated}</strong><span className="muted">Total generated</span></div>
        <div className="card stat"><span className="stat-icon"><TrendingUp size={18} aria-hidden="true" /></span><strong>{weekCount}</strong><span className="muted">Created this week</span></div>
        <div className="card stat"><span className="stat-icon"><PenLine size={18} aria-hidden="true" /></span><strong>{monthWords.toLocaleString()}</strong><span className="muted">Words this month</span></div>
        <div className="card stat"><span className="stat-icon"><Heart size={18} aria-hidden="true" /></span><strong>{favorites.length}</strong><span className="muted">Saved favorites</span></div>
      </section>

      <section className="section">
        <h2>Quick generation</h2>
        <div className="quick-grid">
          {QUICK_TYPES.map((id) => {
            const t = CONTENT_TYPES.find((x) => x.id === id)
            return (
              <button key={id} className="card quick" onClick={() => startWithType(id)}>
                <span className="quick-icon"><TypeIcon type={id} size={18} /></span>
                <strong>{t.label}</strong>
                <span className="muted small">{t.description}</span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="two-col">
        <section className="section">
          <div className="section-head">
            <h2>Recent activity</h2>
            {history.length > 0 && <button className="link-btn" onClick={() => navigate('history')}>View all</button>}
          </div>
          <div className="card list-card">
            {recent.length === 0 ? (
              <EmptyState icon={Clock} title="No activity yet" message="Drafts you generate will show up here so you can reopen them quickly." action={<button className="btn btn-primary" onClick={() => navigate('generator')}>Create your first draft</button>} />
            ) : (
              recent.map((e) => (
                <button key={e.id} className="row" onClick={() => openEntry(e)}>
                  <span className="row-icon"><TypeIcon type={e.type} size={16} /></span>
                  <span className="row-text">
                    <strong>{e.title}</strong>
                    <small className="muted">{typeLabel(e.type)} · {timeAgo(e.createdAt)}</small>
                  </span>
                  <ArrowUpRight size={16} className="muted" aria-hidden="true" />
                </button>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <h2>Usage overview</h2>
          <div className="card usage">
            <div>
              <div className="usage-row"><span>Monthly writing goal</span><span className="muted small">{monthWords.toLocaleString()} / {MONTHLY_GOAL.toLocaleString()} words</span></div>
              <div className="progress" role="progressbar" aria-valuenow={goalPct} aria-valuemin={0} aria-valuemax={100} aria-label="Monthly writing goal"><span style={{ width: `${goalPct}%` }} /></div>
            </div>

            <div>
              <div className="usage-row"><span>Drafts in the last 7 days</span></div>
              <div className="bars" role="img" aria-label={`Drafts per day: ${days.map((d) => `${d.label} ${d.count}`).join(', ')}`}>
                {days.map((d, i) => (
                  <div key={i} className="bar-col">
                    <span className="bar-value small">{d.count || ''}</span>
                    <span className="bar" style={{ height: `${Math.max(4, (d.count / maxDay) * 64)}px` }} />
                    <span className="muted small">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="usage-row"><span>Most used formats</span></div>
              {byType.length === 0 ? <p className="muted small">Generate a draft to see your mix.</p> : byType.map((t) => (
                <div key={t.id} className="type-row">
                  <span className="small">{t.label}</span>
                  <span className="progress thin"><span style={{ width: `${(t.count / maxType) * 100}%` }} /></span>
                  <span className="muted small">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Popular templates</h2>
          <button className="link-btn" onClick={() => navigate('templates')}>Browse all</button>
        </div>
        <div className="grid-4">
          {popular.map((t) => (
            <button key={t.id} className="card quick" onClick={() => applyTemplate(t)}>
              <span className="quick-icon"><TypeIcon type={t.type} size={18} /></span>
              <strong>{t.name}</strong>
              <span className="muted small">{t.tone} · about {t.wordCount} words</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
