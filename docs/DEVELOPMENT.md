# Development

## Prerequisites

- Node.js 20+
- npm 10+
- Optional: an Anthropic API key for live conversation replies.

## First-time setup

```bash
npm install
cp .env.example .env.local   # only needed for AI-powered conversation
npm run dev                  # → http://localhost:3000
```

## Useful scripts

| Command                | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Hot-reloading dev server.                  |
| `npm run build`        | Production build. Run before opening a PR. |
| `npm run lint`         | ESLint via `next lint`.                    |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`).         |
| `npm test`             | Vitest unit tests, one-shot.               |
| `npm run test:watch`   | Vitest in watch mode.                      |
| `npm run format`       | Prettier write.                            |
| `npm run format:check` | Prettier verify — used by CI.              |

## Conventions

- **TypeScript only** in `src/`. No `any` unless commented.
- **Client vs server**: every component that uses hooks or browser APIs must
  start with `"use client"`. API routes live under `src/app/api/.../route.ts`
  and declare `export const runtime = "nodejs"` when they touch SDKs.
- **Imports**: use the `@/*` alias for anything under `src/`.
- **Design tokens**: never hardcode colors, radii, or shadows in components —
  use CSS variables defined in `src/app/globals.css`.
- **Tests**: live next to the file they test (`foo.ts` + `foo.test.ts`).
- **Formatting**: Prettier runs in CI; configure your editor to format on save.

## Adding a new flashcard

For now, append to [`src/data/flashcards.ts`](../src/data/flashcards.ts). Each
record needs `id`, `es`, `pos`, `en`, `level`, `sentence`, `sentenceEn`. The
optional `frequencyRank` is displayed on the card as `Freq #…`.

The production source per `PLAN.md` is the Hermit Dave frequency list
enriched with Tatoeba sentences and Wiktionary definitions. The seed data
exists to make the swipe UI feel real in development.

## Adding a new persona or scenario

Edit [`src/data/personas.ts`](../src/data/personas.ts). The persona's
`ttsLocale` is used by both the flashcard module (always `es-ES`) and the
conversation module (per-persona).

## Testing the AI conversation route locally

1. Set `ANTHROPIC_API_KEY` in `.env.local`.
2. Restart `npm run dev` (Next.js caches env vars at startup).
3. Open `/conversation`, pick any persona + scenario, send a message.
4. To exercise the fallback path, unset the key and reload — the route
   returns the scripted demo lines.

## Troubleshooting

- **`speechSynthesis` not speaking**: most browsers gate TTS behind a user
  gesture. Click anywhere on the page once and reload.
- **CI failing on Prettier**: run `npm run format` locally and commit.
- **Type errors after pulling**: `rm -rf .next && npm run typecheck`.
