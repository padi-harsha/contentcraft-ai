import { ArrowRight } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import TypeIcon from '../components/TypeIcon.jsx'
import { useApp } from '../context/AppContext.jsx'
import { typeLabel } from '../data/options.js'
import { TEMPLATES } from '../data/templates.js'

export default function Templates() {
  const { applyTemplate } = useApp()
  return (
    <div className="page">
      <PageHeader title="Templates" description="Start from a ready-made setup. Selecting one fills in the generator, and you can change anything before you generate." />
      <div className="grid-2">
        {TEMPLATES.map((t) => (
          <article key={t.id} className="card template">
            <div className="template-head">
              <span className="quick-icon"><TypeIcon type={t.type} size={18} /></span>
              <div>
                <h3>{t.name}</h3>
                <span className="muted small">{typeLabel(t.type)} · {t.tone} · about {t.wordCount} words</span>
              </div>
            </div>
            <p className="muted">{t.description}</p>
            <p className="template-sample small"><strong>Sample topic:</strong> {t.topic}</p>
            <button className="btn btn-small btn-primary" onClick={() => applyTemplate(t)}>Use template <ArrowRight size={14} aria-hidden="true" /></button>
          </article>
        ))}
      </div>
    </div>
  )
}
