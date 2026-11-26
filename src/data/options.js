export const CONTENT_TYPES = [
  { id: 'blog', label: 'Blog Post', description: 'Long-form article with clear sections', defaultWords: 500 },
  { id: 'social', label: 'Social Caption', description: 'Three short caption options with hashtags', defaultWords: 100 },
  { id: 'instagram', label: 'Instagram Post', description: 'Hook, caption, call to action and visual idea', defaultWords: 100 },
  { id: 'linkedin', label: 'LinkedIn Post', description: 'Professional post with takeaways and a question', defaultWords: 200 },
  { id: 'marketing', label: 'Marketing Copy', description: 'Headline, benefits and call to action', defaultWords: 200 },
  { id: 'product', label: 'Product Description', description: 'Tagline, description and key features', defaultWords: 200 },
  { id: 'email', label: 'Email', description: 'Subject lines, body and sign-off', defaultWords: 200 },
  { id: 'youtube', label: 'YouTube Script', description: 'Hook, segments with cues and outro', defaultWords: 500 },
  { id: 'website', label: 'Website Content', description: 'Hero, about, offers and how it works', defaultWords: 300 },
  { id: 'seo', label: 'SEO Article', description: 'Title tag, meta description, FAQ and sections', defaultWords: 500 },
]

export const TONES = ['Professional', 'Casual', 'Friendly', 'Persuasive', 'Creative']

export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Portuguese']

export const WORD_COUNT_MIN = 50
export const WORD_COUNT_MAX = 800
export const WORD_COUNT_PRESETS = [100, 200, 300, 500, 800]

export const DEFAULT_FORM = {
  topic: '',
  type: 'blog',
  tone: 'Professional',
  audience: '',
  language: 'English',
  wordCount: 300,
  keywords: '',
}

export const typeLabel = (id) => CONTENT_TYPES.find((t) => t.id === id)?.label ?? 'Content'
