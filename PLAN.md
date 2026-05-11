# Spanish Learning Web App — Master Plan

## Overview

A modular web app for learning and improving Spanish, built feature by feature. Each module is independent but shares a common user profile, progress tracking, and vocabulary database.

---

## Data Sources (Free & Open)

| Source                                                                      | What it provides                                        | License              |
| --------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------- |
| [Hermit Dave Frequency Lists](https://github.com/hermitdave/FrequencyWords) | Top 10k+ Spanish words ranked by real-world frequency   | CC                   |
| [Tatoeba](https://tatoeba.org/en/downloads)                                 | Spanish sentences with English translations             | CC-BY 2.0            |
| [Wiktionary API](https://en.wiktionary.org/w/api.php)                       | Definitions, part of speech, conjugations               | CC-BY-SA             |
| CEFR Word Lists (GitHub)                                                    | A1–C2 graded vocabulary tags                            | Varies (mostly open) |
| [Forvo API](https://api.forvo.com/)                                         | Real human audio pronunciations (free tier)             | Freemium             |
| Web Speech API                                                              | Browser-native TTS for pronunciation (free, no API key) | Browser built-in     |

---

## Phases & Features

---

### Phase 1 — Flashcard Vocabulary System

**Goal:** Give users a solid foundation with frequency-prioritized vocab and spaced repetition.

**Core features:**

- Import Hermit Dave frequency list as the default deck (most common words first)
- Tag each word with its CEFR level (A1–C2) so users know what level they're at
- Pull example sentences from Tatoeba for each word (show words in context, not in isolation)
- Pull definitions and part of speech from Wiktionary API
- Audio pronunciation via Web Speech API (browser TTS) with optional Forvo upgrade
- Spaced repetition algorithm (SM-2 or similar) to schedule reviews
- User can mark words as known, learning, or ignored
- Progress dashboard: words learned by level, daily streak, cards due today

**Data flow:**

```
Hermit Dave list → seed DB → enrich with CEFR tags → enrich with Tatoeba sentences → enrich with Wiktionary definitions
```

**Stretch goals:**

- Custom decks (user-created or topic-based: travel, food, business)
- Import Anki `.apkg` files
- Leaderboard / social sharing of streaks

---

### Phase 2 — Spanish Writing Coach

**Goal:** Let users write freely in Spanish and get inline corrections with explanations.

**Core features:**

- Free-write text editor (journal entry, email, paragraph about any topic)
- Submit to AI for grammar and style review
- Inline annotations: highlight errors with suggested corrections and _why_ the rule applies
- Difficulty modes: Beginner (only flag major errors), Advanced (flag style + nuance too)
- Track recurring mistakes per user — build a personal "weak points" list
- Flagged vocabulary from corrections automatically added to the user's flashcard deck

**AI prompt strategy:**

- Use Claude API with structured output: return a list of `{ original, corrected, explanation, rule }` objects
- Separate passes for grammar vs. vocabulary vs. style to keep explanations focused

**Stretch goals:**

- Side-by-side view: original vs. corrected full text
- Tone selector (formal / informal / regional dialect)
- Daily writing prompt to reduce blank-page paralysis

---

### Phase 3 — Graded News Reader

**Goal:** Keep content fresh daily with real Spanish news rewritten for learner levels.

**Core features:**

- Curate RSS feeds from Spanish-language news sources (El País, BBC Mundo, El Universal)
- AI rewrites each article at three levels: Beginner / Intermediate / Advanced
- Toggle between simplified and original version
- Tap any word for an inline popup: definition, pronunciation, add-to-deck button
- Comprehension questions generated per article (multiple choice + short answer)
- Mark articles as read; reading history visible in profile

**AI prompt strategy:**

- Rewrite prompt specifies target CEFR level and instructs AI to preserve meaning, simplify vocabulary, shorten sentences
- Question generation as a separate prompt after rewrite

**Stretch goals:**

- Audio mode: TTS reads the article aloud, highlights word being spoken
- Save article excerpts as reading notes
- Weekly digest email of top articles at the user's level

---

### Phase 4 — Content-Based Vocabulary Builder

**Goal:** Let users learn from content they already care about (YouTube, articles, subtitles).

**Core features:**

- Input: paste a URL (YouTube, news article) or upload a subtitle file (.srt, .vtt)
- Extract text / transcript from the content
- AI identifies the top 20–40 vocabulary words worth learning from that content, ranked by usefulness
- Each word shown in its original sentence context from the content
- One-click add to flashcard deck
- Full glossary view of all unknown words in the content

**Extraction approach:**

- YouTube: use `youtube-transcript-api` (Python) or `ytdl-core` (Node) for transcripts
- Articles: use `readability` library (Mozilla) to strip HTML and extract body text
- Subtitles: parse `.srt`/`.vtt` directly

**AI prompt strategy:**

- Send extracted text + user's known vocabulary level → AI returns vocabulary list with definitions and example sentences pulled from the content itself

**Stretch goals:**

- Chrome extension that adds a "Learn from this page" button
- Video player with synchronized Spanish subtitles and tap-to-look-up
- Difficulty rating of content based on vocabulary complexity

---

### Phase 5 — AI Conversation Partner with Personas

**Goal:** Practice real conversational Spanish in role-play scenarios with AI characters.

**Core features:**

- Choose a persona: Mexican street vendor, Spanish doctor, Argentinian friend, job interviewer, etc.
- Choose a scenario: ordering food, asking for directions, medical appointment, small talk
- Text-based chat (voice optional via Web Speech API)
- After each user message: AI responds in character, then optionally shows a "coach note" (was your Spanish natural? here's a better phrasing)
- Session summary at the end: vocabulary used, mistakes made, suggested review cards
- Difficulty scaling: AI uses simpler Spanish and slower pacing for beginners

**AI prompt strategy:**

- System prompt establishes the persona, scenario, and difficulty level
- Separate "coach" pass after each exchange to evaluate correctness without breaking immersion
- Coach notes togglable so advanced users can stay immersed

**Stretch goals:**

- Voice mode: speech-to-text input + TTS response
- Regional accent selector (Castilian, Mexican, Rioplatense)
- Saved conversation transcripts with annotations

---

## Shared Infrastructure (built alongside Phase 1)

- **User accounts** — auth, profile, level (A1–C2)
- **Vocabulary database** — central store of all words the user has encountered across all modules; status per word (new / learning / known)
- **Progress tracking** — daily activity log, XP or points, streak counter
- **Settings** — target dialect, preferred level, notification preferences

---

## Suggested Tech Stack

| Layer    | Choice                                  | Reason                                             |
| -------- | --------------------------------------- | -------------------------------------------------- |
| Frontend | Next.js (React)                         | SSR for SEO on news reader; great ecosystem        |
| Styling  | Tailwind CSS                            | Fast to build clean UIs                            |
| Backend  | Next.js API routes or FastAPI (Python)  | Python preferred if heavy NLP processing needed    |
| Database | PostgreSQL + Prisma                     | Relational fits vocabulary + user progress well    |
| AI       | Claude API (Anthropic)                  | Strong at structured output, corrections, rewrites |
| Auth     | NextAuth.js                             | Simple, supports OAuth                             |
| Hosting  | Vercel (frontend) + Railway/Render (DB) | Free tiers available to start                      |

---

## Build Order Summary

| Phase | Feature                     | Complexity | Value                        |
| ----- | --------------------------- | ---------- | ---------------------------- |
| 1     | Flashcard Vocabulary System | Medium     | High — core habit loop       |
| 2     | Writing Coach               | Medium     | High — active practice       |
| 3     | Graded News Reader          | Medium     | High — daily fresh content   |
| 4     | Content-Based Vocab Builder | High       | High — unique differentiator |
| 5     | AI Conversation Partner     | High       | High — most engaging         |

Start with Phase 1 to establish the vocabulary database and user model that every other feature depends on.
