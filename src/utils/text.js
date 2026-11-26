export const countWords = (text) => {
  const t = (text || '').trim()
  return t ? t.split(/\s+/).length : 0
}

export const countChars = (text) => (text || '').length

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const SMALL_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from'])

export const titleCase = (s) =>
  (s || '')
    .split(' ')
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : capitalize(w)))
    .join(' ')

export const slugify = (s) =>
  (s || 'content')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'content'

// Turns the markdown-style markers used in generated drafts into plain text.
export const clearFormatting = (text) =>
  (text || '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|\s)\*(?!\s)([^*\n]+)\*/g, '$1$2')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/[ \t]+$/gm, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

export const snippet = (text, length = 170) => {
  const flat = clearFormatting(text).replace(/\s+/g, ' ')
  return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat
}

export const formatDate = (ms) =>
  new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export const timeAgo = (ms) => {
  const diff = Date.now() - ms
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatDate(ms)
}
