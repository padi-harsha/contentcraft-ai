import { LOCAL, SECTIONS, TONE_BANK } from '../data/sampleContent.js'
import { capitalize, countWords, titleCase } from './text.js'

const STOP = new Set(['about', 'their', 'there', 'which', 'would', 'should', 'could', 'these', 'those', 'where', 'while', 'with', 'from', 'that', 'this', 'your', 'what', 'when', 'into', 'have', 'been', 'without'])

const pick = (arr, seed, offset = 0) => arr[Math.abs(seed + offset) % arr.length]

function buildContext(form) {
  const subject = form.topic.trim().replace(/[.!?]+$/, '')
  const s = /^[A-Z][a-z]/.test(subject) ? subject.charAt(0).toLowerCase() + subject.slice(1) : subject

  const given = (form.keywords || '')
    .split(/[,\n]/)
    .map((k) => k.trim())
    .filter(Boolean)
  const derived = subject
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4 && !STOP.has(w))
  const kws = [...new Set([...given, ...derived, 'quality', 'results', 'growth'])]

  const language = LOCAL[form.language] ? form.language : 'English'
  const toneName = TONE_BANK[form.tone] ? form.tone : 'Professional'
  const c = {
    s,
    S: capitalize(s),
    T: titleCase(subject),
    aud: (form.audience || '').trim() || 'readers',
    k1: kws[0],
    k2: kws[1],
    k3: kws[2],
    K1: capitalize(kws[0]),
    kws: given.length ? given : kws.slice(0, 3),
    L: LOCAL[language],
    tone: TONE_BANK[toneName],
    seed: Number.isFinite(form.seed) ? form.seed : 0,
  }
  return c
}

function hashtags(c) {
  const fromKeywords = c.kws.map((k) => `#${k.replace(/[^\p{L}\p{N}]/gu, '')}`)
  return [...new Set([...fromKeywords, '#ContentCraft', '#SampleDraft'])].filter((t) => t.length > 1).slice(0, 6).join(' ')
}

function pickSections(c, budget, min = 1, max = SECTIONS.length) {
  const start = c.seed % SECTIONS.length
  const out = []
  let used = 0
  for (let i = 0; i < SECTIONS.length && out.length < max; i += 1) {
    if (out.length >= min && used >= budget) break
    const sec = SECTIONS[(start + i) % SECTIONS.length]
    const h = sec.h(c)
    const p = sec.p(c)
    out.push({ h, p })
    used += countWords(h) + countWords(p)
  }
  return out
}

const joinBlocks = (blocks) => blocks.filter(Boolean).join('\n\n')

/* ---------- Generators ---------- */

function blog(c, target) {
  const title = pick([`${c.T}: A Practical Guide for ${titleCase(c.aud)}`, `How to Approach ${c.T} Without the Overwhelm`, `${c.T}: What Actually Works`, `The ${titleCase(c.k1)} Guide to ${c.T}`], c.seed)
  const intro = `${c.tone.opener(c)} This guide breaks ${c.s} down for ${c.aud} in plain language, with ${c.k1} as the thread that ties everything together.`
  const outro = `${c.tone.closer(c)} ${c.L.thanks}`
  const budget = target - countWords(`${title} ${intro} ${outro}`)
  const secs = pickSections(c, budget, 1)
  return joinBlocks([`# ${title}`, intro, ...secs.map((x) => `## ${x.h}\n\n${x.p}`), `## ${c.L.conclusion}\n\n${outro}`])
}

function social(c) {
  const hooks = c.tone.hooks(c)
  const ctas = c.tone.ctas
  const bodies = [
    `${c.S} doesn't have to be complicated. Start with ${c.k1}, keep it simple and build from there.`,
    `For ${c.aud}, the biggest wins with ${c.k1} come from small, repeatable steps.`,
    `Focus on ${c.k1} and ${c.k2} first, and the rest gets easier.`,
  ]
  const tags = hashtags(c)
  const options = [0, 1, 2].map((i) => {
    const n = (i + c.seed) % 3
    return `## Option ${i + 1}\n\n${hooks[n]} ${bodies[(n + i) % 3]}\n${ctas[(n + i) % 3]}\n\n${tags}`
  })
  return joinBlocks(options)
}

function instagram(c, target) {
  const hook = pick(c.tone.hooks(c), c.seed)
  const cta = pick(c.tone.ctas, c.seed, 1)
  const body = `Here's the part nobody tells ${c.aud}: ${c.s} works best when it's small, steady and shared. Start with ${c.k1}, keep it simple and let the results build.`
  const extra = target >= 200 ? `Next time you feel stuck, come back to ${c.k2}. It's a calm place to restart, and it works more often than you'd expect.` : ''
  return joinBlocks([
    `✨ ${hook}`,
    body,
    extra,
    `👉 ${cta}`,
    `Visual idea: a carousel. Slide 1 states the hook, slides 2 to 4 give one tip each about ${c.k1}, and the final slide holds the call to action.`,
    `.\n.\n.\n${hashtags(c)}`,
  ])
}

function linkedin(c, target) {
  const hook = pick(c.tone.hooks(c), c.seed)
  const paras = [
    `I keep noticing the same pattern when people talk about ${c.s}: the ones who make progress start smaller than they think they need to.`,
    `They pick one outcome tied to ${c.k1}, share it with ${c.aud}, and review it every week. Nothing dramatic, just steady attention.`,
    `The result is less noise and more trust, because everyone can see what is being tried and why.`,
  ]
  const count = Math.min(3, Math.max(1, Math.round(target / 90)))
  const extra = target > 300 ? pickSections(c, target - 260, 1, 8).map((x) => `**${x.h}**\n${x.p}`) : []
  return joinBlocks([
    hook,
    ...paras.slice(0, count),
    `Three takeaways:\n- Start with one clear goal for ${c.k1}\n- Make progress visible to ${c.aud}\n- Review weekly and adjust without blame`,
    ...extra,
    `${c.L.question} How are you approaching ${c.s}?`,
    hashtags(c).split(' ').slice(0, 4).join(' '),
  ])
}

function marketing(c, target) {
  const headline = pick([`${c.S}, made simple.`, `Finally, ${c.s} that works for ${c.aud}.`, `${c.T} starts here.`, `Do more with ${c.k1}.`], c.seed)
  const secs = pickSections(c, target - 110, 0, 10)
  return joinBlocks([
    `# ${headline}`,
    `A clearer way for ${c.aud} to get real results from ${c.k1}, without the guesswork.`,
    `## Why ${c.aud} choose it\n\n- Save time: spend less effort on ${c.k1} and more on what matters\n- Stay confident: clear steps that make ${c.k2} easier to manage\n- See progress: simple measures you can share with your team`,
    ...secs.map((x) => `**${x.h}**\n${x.p}`),
    c.tone.closer(c),
    `**${c.tone.cta}** | ${c.L.learnMore}`,
  ])
}

function product(c, target) {
  const secs = pickSections(c, target - 150, 0, 8)
  return joinBlocks([
    `# ${c.T}`,
    `*${c.tone.opener(c)}*`,
    `## Description\n\nMeet ${c.T}, designed for ${c.aud} who want ${c.k1} they can rely on every day. It brings ${c.k2} and ${c.k3} together in one thoughtful package, so there is less to set up and more to enjoy from the first use.`,
    ...secs.map((x) => `**${x.h}**\n${x.p}`),
    `## Key features\n\n- Built around ${c.k1}, so it fits naturally into daily routines\n- Simple setup with clear instructions\n- ${titleCase(c.k2)} that stays dependable over time\n- Made with ${c.k3} in mind\n- Backed by responsive support`,
    `## Best for\n\n${capitalize(c.aud)} who value ${c.k1} and want a dependable result.`,
    `**${c.tone.cta}** | ${c.L.learnMore}`,
  ])
}

function email(c, target) {
  const subjects = c.tone.subjects(c)
  const secs = target > 220 ? pickSections(c, target - 170, 1, 8) : []
  return joinBlocks([
    `Subject: ${subjects[c.seed % 2]}`,
    `Alternative subject: ${subjects[(c.seed + 1) % 2]}`,
    `Preview text: A short note for ${c.aud} about ${c.k1}.`,
    '---',
    `${c.L.hello} [First name],`,
    `${c.tone.opener(c)} I wanted to share a quick update with you as one of our ${c.aud}.`,
    `Here is what you can expect:\n- Clear, practical details on ${c.k1}\n- A simple next step that takes under five minutes\n- Support if you have questions along the way`,
    ...secs.map((x) => `**${x.h}**\n${x.p}`),
    `${c.tone.closer(c)}`,
    `[${c.tone.cta}]`,
    `${c.L.regards},\n[Your name]`,
  ])
}

function youtube(c, target) {
  const titles = [`${c.T} (Explained Simply)`, `${c.T}: Everything ${titleCase(c.aud)} Need to Know`, `I Looked Into ${c.T}. Here's What Matters`]
  const secs = pickSections(c, target - 190, 1, 12)
  return joinBlocks([
    `## Title ideas\n\n1. ${titles[c.seed % 3]}\n2. ${titles[(c.seed + 1) % 3]}`,
    `## Description\n\nIn this video we cover ${c.s} for ${c.aud}, with a focus on ${c.k1} and ${c.k2}.`,
    `## Script\n\n[HOOK]\n${pick(c.tone.hooks(c), c.seed)} In the next few minutes I'll show you how ${c.k1} fits in.`,
    `[INTRO]\nIf you're ${c.aud === 'readers' ? 'new here' : `one of the ${c.aud}`}, this video is for you. Stick around, because the last tip is the one most people skip.`,
    ...secs.map((x, i) => `[SEGMENT ${i + 1}: ${x.h}]\n(On screen: ${x.h})\n${x.p}`),
    `[OUTRO]\n${c.tone.closer(c)} If this helped, like the video and subscribe for more on ${c.k1}. ${c.L.thanks}`,
  ])
}

function website(c, target) {
  const secs = pickSections(c, target - 200, 1, 12)
  return joinBlocks([
    `# Homepage copy`,
    `## Hero\n\n**${pick([`${c.S}, done right.`, `Everything ${c.aud} need for ${c.k1}.`], c.seed)}**\nA calm, clear way to get real results from ${c.k1}.\nButton: ${c.L.cta}`,
    `## About us\n\n${c.tone.opener(c)} We help ${c.aud} turn ${c.s} into steady, visible progress.`,
    ...secs.map((x) => `**${x.h}**\n${x.p}`),
    `## What we offer\n\n- **${titleCase(c.k1)}:** practical support you can use straight away\n- **${titleCase(c.k2)}:** clear guidance that saves time\n- **${titleCase(c.k3)}:** measurable results you can share`,
    `## How it works\n\n1. Tell us what you want to achieve\n2. Get a simple plan built around ${c.k1}\n3. Review progress together and adjust`,
    `## Ready to begin?\n\n${c.tone.closer(c)}\nButton: ${c.L.learnMore}`,
  ])
}

function seo(c, target) {
  const titleTag = `${c.T}: ${titleCase(c.k1)} Guide`.slice(0, 60)
  const meta = `Learn how ${c.aud} can use ${c.k1} to make progress on ${c.s}. Clear steps, common mistakes and a simple checklist.`.slice(0, 155)
  const slug = c.s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 50)
  const secs = pickSections(c, target - 200, 1, 12)
  return joinBlocks([
    `Title tag: ${titleTag}\nMeta description: ${meta}\nURL slug: /${slug || 'guide'}\nPrimary keyword: ${c.k1}\nSecondary keywords: ${c.k2}, ${c.k3}`,
    '---',
    `# ${c.T}: A Complete Guide`,
    `${c.K1} is central to ${c.s}. In this guide, ${c.aud} will find clear definitions, practical steps and answers to common questions about ${c.k2} and ${c.k3}.`,
    ...secs.map((x, i) => `## ${i === 0 ? `What is ${c.k1}?` : x.h}\n\n${x.p}`),
    `## Frequently asked questions\n\n**Is ${c.s} hard to start?**\nNot at all. Begin with one small goal tied to ${c.k1} and build from there.\n\n**How long does it take to see results?**\nMost ${c.aud} notice early signs within two to four weeks of steady effort.\n\n**What should I measure?**\nTrack ${c.k2} and one outcome that matters to you.`,
    `## ${c.L.conclusion}\n\n${c.tone.closer(c)} ${c.L.thanks}`,
  ])
}

const GENERATORS = { blog, social, instagram, linkedin, marketing, product, email, youtube, website, seo }

/**
 * Simulated generation: assembles sample copy from the form values.
 * `seed` changes which variants and sections are used, so regenerating gives a different draft.
 */
export function generateContent(form) {
  const c = buildContext(form)
  const target = Number(form.wordCount) || 300
  const build = GENERATORS[form.type] || blog
  const text = build(c, target)
  const title = capitalize(form.topic.trim().replace(/[.!?]+$/, ''))
  return { title: title.length > 80 ? `${title.slice(0, 77)}…` : title, text }
}
