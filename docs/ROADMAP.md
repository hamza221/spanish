# Roadmap

## Shipped

- **Phase 1 — Flashcard Vocabulary System**
  - Tinder-style swipe deck (`/flashcards`).
  - Drag, keyboard (`←` / `→` / `space` / `Esc`), and tap controls.
  - Auto-speak via Web Speech API.
  - Session summary with mascot.
  - Pure-function SM-2 algorithm + unit tests in `src/lib/srs.ts`.
- **Phase 5 — AI Conversation Partner with Personas**
  - Persona + scenario picker (`/conversation`).
  - In-character chat with togglable translations and a coach pane.
  - Anthropic Claude integration (Sonnet 4.6) with scripted-demo fallback.
- **Dashboard, Sidebar, Mascot, design tokens for Directions A & B.**
- **CI**: Prettier check, ESLint, TypeScript, Vitest, Next build.

## Up next

1. **Persistence & auth (cross-cutting)**
   - PostgreSQL + Prisma schema for users, flashcards (with SM-2 fields),
     reviews, conversation transcripts.
   - NextAuth.js with Google + email magic-link providers.
   - Server actions for "mark known / learning / ignored".
2. **Phase 1 enrichment**
   - Import Hermit Dave frequency list as the seed deck.
   - CEFR tagging from open word lists.
   - Tatoeba example sentences.
   - Wiktionary definitions + part-of-speech.
   - Optional Forvo audio per word.
3. **Phase 2 — Writing Coach**
   - Free-write editor with inline annotations.
   - Beginner/Advanced difficulty modes.
   - Mistakes feed into the user's flashcard deck.
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
