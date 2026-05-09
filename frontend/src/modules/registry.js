/**
 * Central module registry — add an entry here to surface a new module in the hub.
 * status: 'active' | 'coming-soon'
 * When status is 'active', the router expects src/modules/<id>/index.vue to exist.
 */
export const modules = [
  {
    id: 'flashcards',
    name: 'Flashcard Vocabulary',
    description:
      'Frequency-prioritized vocab with spaced repetition. Learn the most common Spanish words first, with real example sentences.',
    icon: '🃏',
    status: 'coming-soon',
    phase: 1,
    accentColor: 'blue',
    tags: ['Vocabulary', 'Spaced Repetition', 'CEFR'],
  },
  {
    id: 'writing-coach',
    name: 'Writing Coach',
    description:
      'Write freely in Spanish — journal entries, emails, anything — and get inline AI corrections with grammar explanations.',
    icon: '✍️',
    status: 'coming-soon',
    phase: 2,
    accentColor: 'green',
    tags: ['Writing', 'Grammar', 'AI'],
  },
  {
    id: 'news-reader',
    name: 'Graded News Reader',
    description:
      'Real Spanish news articles rewritten at your level. Tap any word for definitions and add it to your flashcard deck.',
    icon: '📰',
    status: 'coming-soon',
    phase: 3,
    accentColor: 'orange',
    tags: ['Reading', 'News', 'Comprehension'],
  },
  {
    id: 'content-builder',
    name: 'Content Vocab Builder',
    description:
      'Paste a YouTube URL or article and learn vocabulary from content you already care about.',
    icon: '🎬',
    status: 'coming-soon',
    phase: 4,
    accentColor: 'purple',
    tags: ['YouTube', 'Custom Content', 'Vocabulary'],
  },
  {
    id: 'conversation',
    name: 'Conversation Partner',
    description:
      'Chat with AI personas in real scenarios — ordering food, a job interview, a Buenos Aires friend — with live coaching.',
    icon: '💬',
    status: 'coming-soon',
    phase: 5,
    accentColor: 'red',
    tags: ['Speaking', 'Roleplay', 'AI'],
  },
]
