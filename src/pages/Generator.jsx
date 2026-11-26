import { useEffect, useRef, useState } from 'react'
import { Info, Loader2, PenLine, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Editor from '../components/Editor.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TypeIcon from '../components/TypeIcon.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CONTENT_TYPES, LANGUAGES, TONES, WORD_COUNT_MAX, WORD_COUNT_MIN, WORD_COUNT_PRESETS, typeLabel } from '../data/options.js'
import { generateContent } from '../utils/generateContent.js'
import { copyText, downloadTxt } from '../utils/browser.js'
import { clearFormatting, slugify } from '../utils/text.js'

function validate(form) {
  const errors = {}
  const topic = form.topic.trim()
  if (topic.length < 5) errors.topic = 'Describe your topic in at least 5 characters.'
  else if (topic.length > 300) errors.topic = 'Keep the topic under 300 characters.'
  if (!CONTENT_TYPES.some((t) => t.id === form.type)) errors.type = 'Choose a content type.'
  const wc = Number(form.wordCount)
  if (!Number.isInteger(wc) || wc < WORD_COUNT_MIN || wc > WORD_COUNT_MAX) {
    errors.wordCount = `Enter a whole number from ${WORD_COUNT_MIN} to ${WORD_COUNT_MAX}.`
  }
  if (form.audience.length > 100) errors.audience = 'Keep the audience under 100 characters.'
  if (form.keywords.length > 200) errors.keywords = 'Keep keywords under 200 characters.'
  return errors
}

export default function Generator() {
  const { form, setForm, result, setResult, addEntry, updateEntry, bumpTotal, toast, toggleFavorite, isFavorite, history, favorites } = useApp()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [prevText, setPrevText] = useState(null)
  const [saveState, setSaveState] = useState('idle')

  const timer = useRef(null)
  const saveTimer = useRef(null)
  const pending = useRef(null)
  const updateRef = useRef(updateEntry)
  const seedRef = useRef(Math.floor(Math.random() * 1000))
  const outputRef = useRef(null)
  updateRef.current = updateEntry

  // Flush any unsaved edit when leaving the page, and clear timers.
  useEffect(
    () => () => {
      clearTimeout(timer.current)
      clearTimeout(saveTimer.current)
      if (pending.current) updateRef.current(pending.current.id, { text: pending.current.text })
    },
    [],
  )

  useEffect(() => {
    setSaveState('idle')
    setPrevText(null)
  }, [result?.id])

  const entry = result ? history.find((e) => e.id === result.id) || favorites.find((e) => e.id === result.id) : null

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const run = (regen = false) => {
    if (loading) return
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      toast('Fix the highlighted fields to continue', 'error')
      return
    }
    setLoading(true)
    if (regen && result) setPrevText(result.text)
    timer.current = setTimeout(() => {
      seedRef.current += 1
      const wordCount = Number(form.wordCount)
      const { title, text } = generateContent({ ...form, wordCount, seed: seedRef.current })
      const fields = { type: form.type, topic: form.topic.trim(), tone: form.tone, audience: form.audience.trim(), language: form.language, wordCount, keywords: form.keywords.trim() }
      pending.current = null
      if (regen && result) {
        updateEntry(result.id, { ...fields, title, text })
        setResult({ id: result.id, text })
      } else {
        const created = { id: `gen-${Date.now()}`, title, text, createdAt: Date.now(), ...fields }
        addEntry(created)
        setResult({ id: created.id, text })
        setPrevText(null)
      }
      bumpTotal()
      setLoading(false)
      setSaveState('idle')
      toast(regen ? 'Draft regenerated' : 'Draft ready. Edit it below.')
      if (window.innerWidth < 1024) setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }, 1200)
  }

  const handleEdit = (text) => {
    if (!result) return
    setResult({ ...result, text })
    setSaveState('saving')
    pending.current = { id: result.id, text }
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateEntry(result.id, { text })
      pending.current = null
      setSaveState('saved')
    }, 500)
  }

  const handleCopy = async () => {
    const ok = await copyText(result.text)
    toast(ok ? 'Copied to clipboard' : 'Copy failed. Select the text and copy it manually.', ok ? 'success' : 'error')
  }

  const handleDownload = () => {
    downloadTxt(`contentcraft-${slugify(entry?.title || form.topic)}`, result.text)
    toast('Download started')
  }

  const handleClear = () => {
    setPrevText(result.text)
    handleEdit(clearFormatting(result.text))
    toast('Formatting cleared')
  }

  const handleUndo = () => {
    handleEdit(prevText)
    setPrevText(null)
  }

  const handleFavorite = () => {
    if (entry) toggleFavorite({ ...entry, text: result.text })
  }

  return (
    <div className="page">
      <PageHeader title="AI Generator" description="Describe what you need, pick a format and edit the draft in place." />

      <div className="gen-layout">
        <section className="card gen-form" aria-label="Generation settings">
          <fieldset className="field" aria-describedby={errors.type ? 'err-type' : undefined}>
            <legend>Content type</legend>
            <div className="type-grid" role="radiogroup" aria-label="Content type">
              {CONTENT_TYPES.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={form.type === t.id} className={`type-option ${form.type === t.id ? 'selected' : ''}`} onClick={() => set('type', t.id)} title={t.description}>
                  <TypeIcon type={t.id} size={16} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className="error" id="err-type">{errors.type}</p>}
          </fieldset>

          <div className="field">
            <label htmlFor="topic">Topic or description</label>
            <textarea id="topic" className="input" rows={4} value={form.topic} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Why a morning routine improves focus at work" aria-invalid={!!errors.topic} aria-describedby={errors.topic ? 'err-topic' : undefined} />
            {errors.topic && <p className="error" id="err-topic">{errors.topic}</p>}
          </div>

          <fieldset className="field">
            <legend>Writing tone</legend>
            <div className="segmented wrap" role="radiogroup" aria-label="Writing tone">
              {TONES.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={form.tone === t} className={form.tone === t ? 'selected' : ''} onClick={() => set('tone', t)}>{t}</button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="audience">Target audience <span className="muted">(optional)</span></label>
            <input id="audience" className="input" value={form.audience} onChange={(e) => set('audience', e.target.value)} placeholder="e.g. busy professionals" aria-invalid={!!errors.audience} />
            {errors.audience && <p className="error">{errors.audience}</p>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="language">Language</label>
              <select id="language" className="input" value={form.language} onChange={(e) => set('language', e.target.value)}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="wordCount">Word count</label>
              <input id="wordCount" className="input" type="number" inputMode="numeric" min={WORD_COUNT_MIN} max={WORD_COUNT_MAX} value={form.wordCount} onChange={(e) => set('wordCount', e.target.value)} aria-invalid={!!errors.wordCount} />
            </div>
          </div>
          {errors.wordCount && <p className="error">{errors.wordCount}</p>}
          <div className="chips" aria-label="Word count presets">
            {WORD_COUNT_PRESETS.map((n) => (
              <button key={n} type="button" className={`chip ${Number(form.wordCount) === n ? 'selected' : ''}`} onClick={() => set('wordCount', n)}>{n}</button>
            ))}
          </div>
          {form.language !== 'English' && (
            <p className="hint"><Info size={14} aria-hidden="true" /> For {form.language}, headings, greetings and calls to action are localised. The body stays in English sample copy.</p>
          )}

          <div className="field">
            <label htmlFor="keywords">Keywords <span className="muted">(comma separated, optional)</span></label>
            <input id="keywords" className="input" value={form.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="e.g. focus, routine, productivity" aria-invalid={!!errors.keywords} />
            {errors.keywords && <p className="error">{errors.keywords}</p>}
          </div>

          <button className="btn btn-primary btn-block" onClick={() => run(false)} disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" aria-hidden="true" /> Generating…</> : <><Sparkles size={18} aria-hidden="true" /> Generate content</>}
          </button>
        </section>

        <section className="gen-output" ref={outputRef} aria-label="Generated content" aria-busy={loading}>
          <div className="notice">
            <Info size={15} aria-hidden="true" />
            <span>Drafts are simulated sample output built from your inputs. No AI model is running.</span>
          </div>

          {loading ? (
            <div className="card skeleton" aria-live="polite">
              <p className="muted">Writing your {typeLabel(form.type).toLowerCase()}…</p>
              {[92, 100, 78, 96, 64, 88, 100, 54].map((w, i) => <span key={i} className="skeleton-line" style={{ width: `${w}%` }} />)}
            </div>
          ) : result ? (
            <div className="card editor-card">
              <div className="editor-title">
                <span className="type-badge"><TypeIcon type={form.type} size={14} /> {typeLabel(entry?.type || form.type)}</span>
                <h2>{entry?.title || 'Untitled draft'}</h2>
              </div>
              <Editor value={result.text} onChange={handleEdit} onCopy={handleCopy} onDownload={handleDownload} onRegenerate={() => run(true)} onClear={handleClear} onToggleFavorite={handleFavorite} isFavorite={!!entry && isFavorite(entry.id)} canUndo={prevText !== null} onUndo={handleUndo} saveState={saveState} busy={loading} />
            </div>
          ) : (
            <div className="card">
              <EmptyState icon={PenLine} title="Your draft will appear here" message="Fill in a topic, choose a format and select Generate content. You can edit, copy and download the result." />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
