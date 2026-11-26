import { useState } from 'react'
import { Info, Moon, Sun } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useApp } from '../context/AppContext.jsx'
import { LANGUAGES } from '../data/options.js'

export default function Settings() {
  const { settings, setSettings, setForm, history, favorites, clearHistory, toast } = useApp()
  const [name, setName] = useState(settings.name)
  const [nameError, setNameError] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const initials = (settings.name || 'U').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'U'

  const saveName = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setNameError('Enter a display name.')
    if (trimmed.length > 40) return setNameError('Keep your name under 40 characters.')
    setNameError('')
    setSettings((s) => ({ ...s, name: trimmed }))
    setName(trimmed)
    toast('Profile updated')
    return undefined
  }

  const setTheme = (theme) => {
    setSettings((s) => ({ ...s, theme }))
    toast(`${theme === 'dark' ? 'Dark' : 'Light'} theme on`)
  }

  const setLanguage = (language) => {
    setSettings((s) => ({ ...s, language }))
    setForm((f) => ({ ...f, language }))
    toast(`Default language: ${language}`)
  }

  const doClear = () => {
    clearHistory()
    setConfirmClear(false)
    toast('History cleared')
  }

  return (
    <div className="page narrow">
      <PageHeader title="Settings" description="Preferences are stored in this browser only." />

      <section className="card settings-card">
        <h2>Profile</h2>
        <form onSubmit={saveName} className="profile-form">
          <span className="avatar large">{initials}</span>
          <div className="field grow">
            <label htmlFor="display-name">Display name</label>
            <input id="display-name" className="input" value={name} onChange={(e) => { setName(e.target.value); setNameError('') }} aria-invalid={!!nameError} />
            {nameError && <p className="error">{nameError}</p>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={name.trim() === settings.name}>Save name</button>
        </form>
      </section>

      <section className="card settings-card">
        <h2>Appearance</h2>
        <div className="setting-row">
          <div><strong>Theme</strong><p className="muted small">Choose a light or dark workspace.</p></div>
          <div className="segmented" role="radiogroup" aria-label="Theme">
            <button type="button" role="radio" aria-checked={settings.theme !== 'dark'} className={settings.theme !== 'dark' ? 'selected' : ''} onClick={() => setTheme('light')}><Sun size={15} aria-hidden="true" /> Light</button>
            <button type="button" role="radio" aria-checked={settings.theme === 'dark'} className={settings.theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}><Moon size={15} aria-hidden="true" /> Dark</button>
          </div>
        </div>
        <div className="setting-row">
          <div><strong>Default language</strong><p className="muted small">Used for new drafts in the generator.</p></div>
          <select className="input select-sm" value={settings.language} onChange={(e) => setLanguage(e.target.value)} aria-label="Default language">
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </section>

      <section className="card settings-card">
        <h2>Data</h2>
        <div className="setting-row">
          <div>
            <strong>Clear history</strong>
            <p className="muted small">Removes {history.length} {history.length === 1 ? 'entry' : 'entries'} from My Content. Your {favorites.length} {favorites.length === 1 ? 'favorite stays' : 'favorites stay'} saved.</p>
          </div>
          <button className="btn btn-danger-outline" onClick={() => setConfirmClear(true)} disabled={history.length === 0}>Clear history</button>
        </div>
      </section>

      <p className="hint"><Info size={14} aria-hidden="true" /> ContentCraft AI is a frontend demo. Generated text is simulated sample output, and nothing leaves your browser.</p>

      <ConfirmDialog open={confirmClear} title="Clear all history?" message="This removes every entry from My Content. This can’t be undone." confirmLabel="Clear history" onConfirm={doClear} onCancel={() => setConfirmClear(false)} />
    </div>
  )
}
