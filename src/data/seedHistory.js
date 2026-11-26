import { generateContent } from '../utils/generateContent.js'
import { DEFAULT_FORM } from './options.js'

const HOUR = 3600 * 1000

const SEEDS = [
  { hoursAgo: 3, type: 'linkedin', tone: 'Professional', topic: 'Lessons from leading a remote team through a busy year', audience: 'managers and team leads', keywords: 'leadership, remote work, trust', wordCount: 200 },
  { hoursAgo: 20, type: 'instagram', tone: 'Creative', topic: 'Opening weekend at our neighbourhood coffee shop', audience: 'local coffee lovers', keywords: 'coffee, community, weekend', wordCount: 100 },
  { hoursAgo: 30, type: 'blog', tone: 'Friendly', topic: 'Why a morning routine improves focus at work', audience: 'busy professionals', keywords: 'focus, routine, productivity', wordCount: 500 },
  { hoursAgo: 52, type: 'email', tone: 'Friendly', topic: 'Autumn sale on handmade candles', audience: 'returning customers', keywords: 'sale, candles, handmade', wordCount: 200 },
  { hoursAgo: 80, type: 'product', tone: 'Persuasive', topic: 'Reusable smart notebook that syncs to the cloud', audience: 'students and creators', keywords: 'notebook, sync, reusable', wordCount: 200 },
  { hoursAgo: 130, type: 'seo', tone: 'Professional', topic: 'Beginner guide to composting at home', audience: 'first-time gardeners', keywords: 'composting, home garden, compost bin', wordCount: 500 },
]

export function buildSeedHistory() {
  const now = Date.now()
  return SEEDS.map((s, i) => {
    const form = { ...DEFAULT_FORM, ...s, seed: i + 1 }
    const { title, text } = generateContent(form)
    return {
      id: `seed-${i + 1}`,
      type: s.type,
      title,
      topic: s.topic,
      tone: s.tone,
      audience: s.audience,
      language: 'English',
      wordCount: s.wordCount,
      keywords: s.keywords,
      text,
      createdAt: now - s.hoursAgo * HOUR,
    }
  })
}
