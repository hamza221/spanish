# Roadmap

## Shipped

- **Phase 1 — Flashcard Vocabulary System**
  - Tinder-style swipe deck (`/flashcards`).
  - Drag, keyboard (`←` / `→` / `space` / `Esc`), and tap controls.
  - Auto-speak via Web Speech API.
  - Session summary with mascot.
  - Pure-function SM-2 algorithm + unit tests in `src/lib/srs.ts`.
  - **Local persistence** of SRS state via `localStorage` (`src/lib/progress.ts`).
- **Phase 2 — Writing Coach** (`/writing`)
  - Free-write textarea with three starter prompts.
  - Beginner / Advanced modes.
  - Claude returns structured `{summary, corrected, annotations}` JSON; the
    UI renders the learner's original text with inline corrections and a
    side-by-side corrected version.
  - Per-annotation rule explanation list, click-to-highlight.
  - Offline reviewer fallback flags common errors (mui → muy, soy → estoy
    cansado, …) so the UI is still demoable without an API key.
- **Phase 5 — AI Conversation Partner with Personas**
  - Persona + scenario picker (`/conversation`).
  - In-character chat with togglable translations and a coach pane.
  - Anthropic Claude integration (Sonnet 4.6) with scripted-demo fallback.
- **Dashboard, Sidebar, Mascot, design tokens for Directions A & B.**
- **CI**: Prettier check, ESLint, TypeScript, Vitest, Next build.

## Up next

1. **Persistence & auth (cross-cutting)**
   - PostgreSQL + Prisma schema for users, flashcards (with SM-2 fields),
     reviews, conversation transcripts. The `localStorage`-backed
     `progress.ts` is the seam this will replace.
   - NextAuth.js with Google + email magic-link providers.
   - Server actions for "mark known / learning / ignored".
2. **Phase 1 enrichment**
   - Import Hermit Dave frequency list as the seed deck.
   - CEFR tagging from open word lists.
   - Tatoeba example sentences.
   - Wiktionary definitions + part-of-speech.
   - Optional Forvo audio per word.
3. **Phase 2 follow-ups**
   - Auto-add flagged vocabulary to the flashcard deck.
   - Tone selector (formal / informal / regional dialect).
   - Daily writing prompt.
4. **Phase 3 — Graded News Reader**
   - RSS ingestion (El País, BBC Mundo, El Universal).
   - AI rewrites at Beginner / Intermediate / Advanced.
   - Tap-to-define + add-to-deck.
5. **Phase 4 — Content-Based Vocab Builder**
   - YouTube transcript / article / SRT input.
   - AI-selected top-N learning words.

See [`PLAN.md`](../PLAN.md) for the original phase breakdown.

## Known gaps

- No mobile-responsive layout yet — desktop only (matches the design hand-off).
- No empty states (zero cards due, first conversation, …).
- No onboarding or settings screen — sidebar items are scaffolded but locked.
- Streak / XP values on the dashboard are placeholders; they'll be derived
  from real activity once persistence is in.
