# Architecture

Lumi is a Next.js 14 application using the App Router. Each module from
[`PLAN.md`](../PLAN.md) lives behind its own route and is composed from small
client components that share the design tokens defined in
[`src/app/globals.css`](../src/app/globals.css).

## Top-level routes

| Route               | Mode              | Purpose                                      |
| ------------------- | ----------------- | -------------------------------------------- |
| `/`                 | Shell             | Dashboard — stats, CTA, module list          |
| `/flashcards`       | Immersive         | Phase 1 swipe deck + post-session summary    |
| `/conversation`     | Shell → Immersive | Persona/scenario picker, then chat           |
| `/writing`          | Shell             | Phase 2 writing coach editor + review        |
| `/api/cards`        | API               | Returns the user's due cards (SM-2 filtered) |
| `/api/conversation` | API               | One assistant turn + optional coach note     |
| `/api/writing`      | API               | Structured grammar/style review of free text |

Immersive routes (`/flashcards`, the chat phase of `/conversation`) hide the
sidebar to match the design.

## State

The current build is single-user and stores nothing server-side; session state
(current card index, results, conversation history, writing drafts) lives in
component state. SRS reviews are the one exception: each swipe writes the
updated SM-2 state for that card to `localStorage` via `src/lib/progress.ts`,
so the schedule advances across page reloads. Persistence is otherwise
intentionally deferred:

- A Prisma + Postgres layer is sketched in [`docs/ROADMAP.md`](./ROADMAP.md).
- The `/api/cards` route is the single read seam where SRS-aware data will
  later be sourced from the database.
- The `/api/conversation` route hides the AI integration from the UI, so the
  client never needs to change when persistence and message history land.

## SRS

Spaced repetition is implemented as a pure function in `src/lib/srs.ts`,
following SM-2. The binary swipe UI maps to quality scores (`right → 4`,
`left → 2`) via `qualityFromSwipe`. Unit tests in `src/lib/srs.test.ts` cover
the canonical SM-2 cases plus the ease-factor floor.

## AI integration

`/api/conversation` (Node runtime) is the only place that touches the
Anthropic SDK. It does two passes:

1. **Persona pass** — system prompt establishes the character, scenario, and
   CEFR difficulty, then produces a structured `ES: … / EN: …` reply.
2. **Coach pass** — independent call evaluates the most recent user message
   and returns JSON `{ok: true}` or `{ok: false, label, html}`. The coach
   never sees the AI persona's reply, so it cannot leak immersion.

If `ANTHROPIC_API_KEY` is unset, the route silently falls back to the same
scripted conversation used in the design prototype. This keeps local
development friction-free and lets CI's `npm run build` succeed without
secrets.

See [`src/app/api/conversation/route.ts`](../src/app/api/conversation/route.ts).

The Writing Coach (`/api/writing`) follows the same pattern: a single Claude
call returns JSON `{summary, corrected, annotations[]}`, parsed by the pure
helper in [`src/lib/writing-review.ts`](../src/lib/writing-review.ts) (covered
by unit tests). When `ANTHROPIC_API_KEY` is unset, an offline reviewer flags a
few canonical errors so the UI is still demoable.

## Speech

Browser TTS is invoked via `src/lib/speech.ts`, which guards against SSR and
older browsers (it's a silent no-op when `speechSynthesis` is unavailable).
Per-persona locales (`es-ES`, `es-MX`, `es-AR`) are stored on the persona
record and threaded through to `speak()` from the chat UI.

## Design system

Direction A (default) and Direction B are toggled via the
`data-direction="a|b"` attribute on `<html>`. All tokens — colors, radii,
shadows, fonts — are CSS custom properties; Tailwind references them in
`tailwind.config.ts`. The Tweaks panel from the design prototype is dev-only
and is intentionally omitted from this build.

## File map

```
src/
├── app/
│   ├── layout.tsx          Root layout — Google Fonts, sets data-direction
│   ├── globals.css         Tokens + component styles (ported from styles.css)
│   ├── page.tsx            Dashboard route
│   ├── flashcards/
│   ├── conversation/
│   └── api/
├── components/             Sidebar, Dashboard, FlashCard, Conversation, …
├── data/                   Seed personas/scenarios/flashcards
└── lib/                    types, srs, speech, anthropic helpers
```
