import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { buildSeedHistory } from '../data/seedHistory.js'
import { DEFAULT_FORM } from '../data/options.js'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = { name: 'Alex Morgan', theme: 'light', language: 'English' }

export function AppProvider({ children }) {
  const [history, setHistory] = useLocalStorage('cc_history', buildSeedHistory)
  const [favorites, setFavorites] = useLocalStorage('cc_favorites', [])
  const [settings, setSettings] = useLocalStorage('cc_settings', DEFAULT_SETTINGS)
  const [totalGenerated, setTotalGenerated] = useLocalStorage('cc_total', () => buildSeedHistory().length)

  const [page, setPage] = useState('dashboard')
  const [form, setForm] = useState(() => ({ ...DEFAULT_FORM, language: settings.language || 'English' }))
  const [result, setResult] = useState(null) // { id, text } for the draft open in the editor
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  // Apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme === 'dark' ? 'dark' : 'light'
  }, [settings.theme])

  const navigate = useCallback((next) => {
    setPage(next)
    window.scrollTo({ top: 0 })
  }, [])

  const toast = useCallback((message, kind = 'success') => {
    toastId.current += 1
    const id = toastId.current
    setToasts((t) => [...t.slice(-2), { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  /* ----- history ----- */
  const addEntry = useCallback((entry) => setHistory((h) => [entry, ...h]), [setHistory])

  const updateEntry = useCallback(
    (id, patch) => {
      setHistory((h) => h.map((e) => (e.id === id ? { ...e, ...patch } : e)))
      setFavorites((f) => f.map((e) => (e.id === id ? { ...e, ...patch } : e)))
    },
    [setHistory, setFavorites],
  )

  const deleteEntry = useCallback(
    (id) => {
      setHistory((h) => h.filter((e) => e.id !== id))
      setResult((r) => (r && r.id === id ? null : r))
    },
    [setHistory],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    setResult(null)
  }, [setHistory])

  const bumpTotal = useCallback(() => setTotalGenerated((n) => n + 1), [setTotalGenerated])

  /* ----- favorites ----- */
  const isFavorite = useCallback((id) => favorites.some((f) => f.id === id), [favorites])

  const toggleFavorite = useCallback(
    (entry) => {
      const saved = favorites.some((f) => f.id === entry.id)
      setFavorites((f) => (saved ? f.filter((x) => x.id !== entry.id) : [{ ...entry, savedAt: Date.now() }, ...f]))
      toast(saved ? 'Removed from favorites' : 'Saved to favorites')
    },
    [favorites, setFavorites, toast],
  )

  /* ----- generator hand-offs ----- */
  const openEntry = useCallback(
    (entry) => {
      setForm({
        topic: entry.topic,
        type: entry.type,
        tone: entry.tone,
        audience: entry.audience,
        language: entry.language,
        wordCount: entry.wordCount,
        keywords: entry.keywords,
      })
      setHistory((h) => (h.some((e) => e.id === entry.id) ? h : [{ ...entry, savedAt: undefined }, ...h]))
      setResult({ id: entry.id, text: entry.text })
      navigate('generator')
    },
    [navigate, setHistory],
  )

  const applyTemplate = useCallback(
    (t) => {
      setForm({
        topic: t.topic,
        type: t.type,
        tone: t.tone,
        audience: t.audience,
        language: settings.language || 'English',
        wordCount: t.wordCount,
        keywords: t.keywords,
      })
      setResult(null)
      navigate('generator')
      toast(`Template loaded: ${t.name}`)
    },
    [navigate, settings.language, toast],
  )

  const startWithType = useCallback(
    (type) => {
      setForm((f) => ({ ...f, type }))
      setResult(null)
      navigate('generator')
    },
    [navigate],
  )

  const value = useMemo(
    () => ({
      page, navigate,
      history, addEntry, updateEntry, deleteEntry, clearHistory,
      favorites, isFavorite, toggleFavorite,
      settings, setSettings,
      totalGenerated, bumpTotal,
      form, setForm, result, setResult,
      openEntry, applyTemplate, startWithType,
      toasts, toast, dismissToast,
    }),
    [page, navigate, history, addEntry, updateEntry, deleteEntry, clearHistory, favorites, isFavorite, toggleFavorite, settings, setSettings, totalGenerated, bumpTotal, form, result, openEntry, applyTemplate, startWithType, toasts, toast, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
