// Building blocks for the simulated generator. Nothing here calls an AI model:
// output is assembled from hand-written sample copy and the person's own inputs.

export const LOCAL = {
  English: { hello: 'Hi', thanks: 'Thank you for reading.', cta: 'Get started today', regards: 'Best regards', learnMore: 'Learn more', question: 'What do you think?', conclusion: 'Conclusion' },
  Spanish: { hello: 'Hola', thanks: 'Gracias por leer.', cta: 'Empieza hoy', regards: 'Saludos cordiales', learnMore: 'Más información', question: '¿Qué opinas?', conclusion: 'Conclusión' },
  French: { hello: 'Bonjour', thanks: 'Merci de votre lecture.', cta: 'Commencez dès aujourd’hui', regards: 'Cordialement', learnMore: 'En savoir plus', question: 'Qu’en pensez-vous ?', conclusion: 'Conclusion' },
  German: { hello: 'Hallo', thanks: 'Danke fürs Lesen.', cta: 'Jetzt starten', regards: 'Viele Grüße', learnMore: 'Mehr erfahren', question: 'Was denkst du?', conclusion: 'Fazit' },
  Hindi: { hello: 'नमस्ते', thanks: 'पढ़ने के लिए धन्यवाद।', cta: 'आज ही शुरू करें', regards: 'सादर', learnMore: 'और जानें', question: 'आप क्या सोचते हैं?', conclusion: 'निष्कर्ष' },
  Portuguese: { hello: 'Olá', thanks: 'Obrigado por ler.', cta: 'Comece hoje', regards: 'Atenciosamente', learnMore: 'Saiba mais', question: 'O que você acha?', conclusion: 'Conclusão' },
}

// Each tone supplies an opening line, a closing line, social hooks and calls to action.
export const TONE_BANK = {
  Professional: {
    opener: (c) => `Organizations that approach ${c.s} with discipline tend to see durable results.`,
    closer: (c) => `Consistent, well-measured effort is what turns ${c.s} into a lasting advantage.`,
    hooks: (c) => [`${c.S} deserves a clearer plan.`, `Three lessons worth knowing about ${c.s}.`, `What ${c.aud} should know about ${c.s}.`],
    ctas: ['Read the full guide via the link in bio.', 'Save this for your next planning session.', 'Share it with a colleague who needs it.'],
    subjects: (c) => [`A practical approach to ${c.s}`, `${c.S}: what to do first`],
    cta: 'Read the full guide',
  },
  Casual: {
    opener: (c) => `Let's be honest: ${c.s} sounds bigger than it really is.`,
    closer: (c) => `Start small, keep it fun, and ${c.s} will feel like second nature before you know it.`,
    hooks: (c) => [`Okay, real talk about ${c.s}.`, `${c.S}? Easier than it looks.`, `Quick one on ${c.s}.`],
    ctas: ['Tell us your take below.', 'Tag a friend who needs this.', 'Save it for later.'],
    subjects: (c) => [`Quick thoughts on ${c.s}`, `${c.S}, minus the fluff`],
    cta: 'Check it out',
  },
  Friendly: {
    opener: (c) => `If you've been wondering where to start with ${c.s}, you're in good company.`,
    closer: (c) => `Be kind to yourself along the way. ${c.S} is a skill, and every small step counts.`,
    hooks: (c) => [`Hey ${c.aud}! Let's talk about ${c.s}.`, `Sharing something we love: ${c.s}.`, `A little encouragement on ${c.s} today.`],
    ctas: ["We'd love to hear your story in the comments.", 'Send this to someone you care about.', 'Come say hi below.'],
    subjects: (c) => [`We've got something for you: ${c.s}`, `A friendly note about ${c.s}`],
    cta: 'Come take a look',
  },
  Persuasive: {
    opener: (c) => `Ignore ${c.s} and you risk falling behind; act on it now and you gain an advantage that lasts.`,
    closer: (c) => `The best time to act on ${c.s} was yesterday. The next best time is today.`,
    hooks: (c) => [`Stop putting off ${c.s}.`, `The smartest move you'll make this year: ${c.s}.`, `Why ${c.s} can't wait.`],
    ctas: ['Start today. Link in bio.', "Don't wait: tap the link and begin.", 'Claim your spot now.'],
    subjects: (c) => [`Don't miss out on ${c.s}`, `${c.S}: the time is now`],
    cta: 'Claim yours today',
  },
  Creative: {
    opener: (c) => `Picture ${c.s} as a blank canvas, waiting for the first confident stroke.`,
    closer: (c) => `Every great story about ${c.s} starts with one brave sentence. Write yours.`,
    hooks: (c) => [`${c.S}, but make it unforgettable.`, `Imagine a world where ${c.s} just clicks.`, `Plot twist: ${c.s} is your next big story.`],
    ctas: ["Drop an emoji if you're in.", 'Write the next chapter with us.', 'Follow along, the best part is coming.'],
    subjects: (c) => [`Imagine ${c.s}`, `The story of ${c.s} starts here`],
    cta: 'Step inside',
  },
}

// Reusable long-form sections. Each is a heading plus one paragraph of about 45-55 words.
export const SECTIONS = [
  {
    h: (c) => `Why ${c.s} matters right now`,
    p: (c) => `For ${c.aud}, ${c.s} is no longer a side topic. It shapes daily decisions, budgets and expectations, and the people who understand it early tend to move with more confidence. ${c.K1} is a good place to begin, because it turns a broad idea into something you can act on.`,
  },
  {
    h: (c) => `What ${c.aud} should know first`,
    p: (c) => `Start with the basics. Before investing time or money, ${c.aud} benefit from a clear definition of success. Ask what ${c.k1} should change in the next ninety days, who is responsible for it, and how progress will be measured. Clear answers prevent most early mistakes.`,
  },
  {
    h: () => 'Common mistakes to avoid',
    p: (c) => `The most frequent mistake is trying to do everything at once. People scatter their effort across too many ideas and finish none of them. A narrower scope, one owner and a weekly review keep ${c.s} moving without burning anyone out, and they keep ${c.k2} in view.`,
  },
  {
    h: () => 'A simple framework you can use',
    p: (c) => `Use a three-step loop: plan, test, review. Plan a small change tied to ${c.k1}. Test it for two weeks with a real group of ${c.aud}. Review what happened, keep what worked and drop what did not. Repeating the loop builds momentum faster than any large launch.`,
  },
  {
    h: () => 'Tools and habits that help',
    p: (c) => `Good tools matter less than good habits. A shared document, a short weekly check-in and a visible list of priorities will do more for ${c.s} than another subscription. Choose tools that ${c.aud} already use, and make ${c.k2} part of the routine.`,
  },
  {
    h: () => 'A realistic example',
    p: (c) => `Consider a small team that adopted ${c.s} gradually. In the first month they wrote down what already worked. In the second they tried one new idea tied to ${c.k1}. By the third month the results were visible in their numbers, and everyone understood why.`,
  },
  {
    h: () => 'How to measure progress',
    p: (c) => `Choose two or three measures and stick with them. Useful signals include time saved, quality of results and feedback from ${c.aud}. Track ${c.k2} alongside them so you can see whether effort is turning into outcomes rather than only activity.`,
  },
  {
    h: () => 'Getting everyone on board',
    p: (c) => `People support what they help shape. Invite ${c.aud} to comment early, share your reasoning openly and credit contributors by name. When someone raises a concern about ${c.s}, treat it as useful information rather than resistance.`,
  },
  {
    h: () => 'Budget and resources',
    p: (c) => `You rarely need a large budget to begin. Spend first on time and training, and second on tools. Most results connected to ${c.k1} come from consistent attention, so protect a fixed block of hours each week before you buy anything.`,
  },
  {
    h: () => 'What the next year looks like',
    p: (c) => `Expect steady change rather than a single breakthrough. ${c.S} will keep evolving, and ${c.aud} will expect more clarity and speed. Revisit your plan every quarter, retire what no longer fits, and keep ${c.k3} on the agenda.`,
  },
  {
    h: () => 'Questions worth asking',
    p: (c) => `Before you commit, ask three questions. What problem are we solving? How will we know it worked? What will we stop doing to make room? Honest answers about ${c.s} save weeks of effort and keep ${c.aud} focused on outcomes instead of busywork.`,
  },
  {
    h: () => 'A short checklist',
    p: (c) => `- Define one clear goal for ${c.k1}\n- Choose a single owner\n- Run a two-week test with ${c.aud}\n- Review the results and share what you learned\n- Decide what to do next, then repeat`,
  },
]
