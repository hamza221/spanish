# Lumi — Spanish, daily.

A modular web app for learning Spanish, built feature by feature. This repo currently
implements three of the five planned phases from [`PLAN.md`](./PLAN.md):

- **Phase 1 — Flashcard Vocabulary System** — a Tinder-style swipe deck with
  frequency-ranked words, CEFR levels, example sentences, browser TTS audio,
  and an SM-2 spaced-repetition core. SRS state is persisted to
  `localStorage` so reviews advance the schedule between sessions.
- **Phase 2 — Writing Coach** — free-write Spanish, get inline corrections
  with the rule explained for each one. Claude returns structured
  `{summary, corrected, annotations}` JSON; the UI shows both an annotated
  original and a side-by-side corrected version.
- **Phase 5 — AI Conversation Partner with Personas** — pick a character
  (Lucía the Madrid barista, Diego the CDMX vendor, …) and a scenario (order
  coffee, ask for directions, …), then chat in Spanish with togglable
  translations and a "coach" pane that reviews your Spanish.

A shared **Dashboard** ties everything together. The mascot — **Lumi the axolotl** —
appears on the dashboard CTA and the session summary.

The design is implemented per [`docs/DESIGN.md`](./docs/DESIGN.md) using
Direction A (warm Spanish poster) by default. Toggle to Direction B (refined
editorial) by setting `data-direction="b"` on `<html>`.

## Quick start

```bash
# 1. Install
npm install

# 2. Run the dev server
npm run dev

# Open http://localhost:3000
```

### Optional: enable Claude-powered conversation

The conversation module falls back to a deterministic scripted demo when no
Anthropic API key is configured. To enable real, in-character replies and the
coach pass:

```bash
cp .env.example .env.local
# then edit .env.local and set:
#   ANTHROPIC_API_KEY=sk-ant-...
#   ANTHROPIC_MODEL=claude-sonnet-4-6   # default
```

## Scripts

| Script                 | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the Next.js dev server on port 3000.    |
| `npm run build`        | Production build.                             |
| `npm start`            | Run the production build.                     |
| `npm run lint`         | ESLint (Next.js + Prettier config).           |
| `npm run typecheck`    | `tsc --noEmit`.                               |
| `npm test`             | Vitest unit tests (currently SM-2 algorithm). |
| `npm run format`       | Prettier — write.                             |
| `npm run format:check` | Prettier — check (used in CI).                |

## Project layout

```
src/
├── app/                         Next.js App Router
│   ├── layout.tsx               Loads Google Fonts, sets data-direction
│   ├── page.tsx                 Dashboard route
│   ├── flashcards/page.tsx      Phase 1 session
│   ├── conversation/page.tsx    Phase 5 setup + chat
│   ├── writing/page.tsx         Phase 2 writing coach
│   └── api/
│       ├── cards/route.ts       Returns due flashcards
│       ├── conversation/route.ts Claude-backed reply + coach pass
│       └── writing/route.ts     Claude-backed structured review
├── components/                  React components (Sidebar, Dashboard, FlashCard, WritingCoach, …)
├── data/                        Seed personas, scenarios, flashcards
└── lib/
    ├── srs.ts                   SM-2 spaced-repetition algorithm
    ├── progress.ts              localStorage persistence for SRS state
    ├── annotate.ts              Inline-correction segmenter
    ├── writing-review.ts        Robust parser for the writing-coach JSON
    ├── speech.ts                Web Speech API helper
    ├── anthropic.ts             Anthropic SDK client
    └── types.ts                 Shared TypeScript types
docs/                            Architecture, design system, development guide
.github/workflows/ci.yml         Lint + typecheck + test + build
```

## CI

GitHub Actions runs on every push and pull request against `main`:

1. **Prettier** format check (`npm run format:check`)
2. **ESLint** (`npm run lint`)
3. **TypeScript** (`npm run typecheck`)
4. **Vitest** unit tests (`npm test`)
5. **Next.js** production build (`npm run build`)

See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Documentation

- [`PLAN.md`](./PLAN.md) — master plan, all five phases, data sources, build order.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — how the app is organised.
- [`docs/DESIGN.md`](./docs/DESIGN.md) — visual direction, tokens, screens.
- [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) — local dev, conventions, testing.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — what's shipped, what's next.

## Stack

| Layer    | Choice                          | Notes                                     |
| -------- | ------------------------------- | ----------------------------------------- |
| Frontend | Next.js 14 (App Router)         | TypeScript, React 18                      |
| Styling  | Tailwind + CSS variables        | Design tokens in `src/app/globals.css`    |
| AI       | Anthropic Claude API            | Sonnet 4.6 by default; opt-in via env var |
| Audio    | Web Speech API                  | Browser TTS; Forvo upgrade planned        |
| Testing  | Vitest + Testing Library        | jsdom env                                 |
| Lint     | ESLint (Next config) + Prettier | Both enforced in CI                       |

Persistence (Postgres + Prisma) and auth (NextAuth) are scoped for the next
iteration alongside Phase 2 — see [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## License

MIT — see [`LICENSE`](./LICENSE).
