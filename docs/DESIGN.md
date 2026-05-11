# Design system

This document captures the visual direction the app implements. The source of
truth lives in [`src/app/globals.css`](../src/app/globals.css); this page
explains _why_ the tokens are what they are.

## Two directions

| Attribute on `<html>` | Direction           | Used by default |
| --------------------- | ------------------- | --------------- |
| `data-direction="a"`  | Warm Spanish poster | ✓               |
| `data-direction="b"`  | Refined editorial   |                 |

Direction A is friendly and playful, with terracotta primaries and the classic
Duolingo "stacked button" lift. Direction B drops the shadow lifts in favour
of crisp single-line borders and a deep-navy primary; choose it for a more
adult/professional positioning.

To toggle locally, edit `data-direction` on the `<html>` tag in
[`src/app/layout.tsx`](../src/app/layout.tsx).

## Tokens — Direction A (default)

```
--bg:            #FBFAF6   page
--bg-elev:       #FFFFFF   cards, sidebar
--bg-soft:       #F1EFE6   pills, hover
--ink:           #1A2238   primary text
--ink-soft:      #5C6478   secondary text
--ink-mute:      #9098A8   tertiary / hints
--line:          #E8E4D6   borders, dividers
--primary:       #E85D3E   terracotta — CTAs
--primary-ink:   #B53D22   primary text on light
--accent:        #F4C95D   mustard — secondary CTAs
--coral:         #FF8FAB   mascot / accents
--danger:        #FF4B4B   destructive / "still learning"
--info:          #4AC4F4   audio / info chips
```

## Tokens — Direction B (overrides)

```
--bg:        #FAFAF7
--bg-soft:   #F2F2EC
--ink:       #0E1218
--ink-soft:  #4A4F5C
--line:      #E6E5DC
--primary:   #1D3557   deep navy
--accent:    #E8B73C   gold
--coral:     #E68FA4
--danger:    #C8443E
--info:      #3B8DB4
```

Direction B also flattens shadows to `0 0 0 1px var(--line)` and sharpens
radii (`--radius: 8px`, `--pill-radius: 6px`).

## Typography

- **Direction A** UI + display: Nunito (500/700/800/900).
- **Direction B** UI + display: DM Sans (500/600/700).
- Spanish words and example sentences: **Fraunces** (500/600, italic for
  parts-of-speech). The serif is shared by both directions to anchor the
  Spanish content visually.

All fonts ship from Google Fonts; they're loaded in `src/app/layout.tsx`.

## Screens

The five screens correspond directly to design-handoff prototypes. Each one is
documented inline in the relevant component:

| Screen             | Component                                               | Route                             |
| ------------------ | ------------------------------------------------------- | --------------------------------- |
| Dashboard          | `src/components/Dashboard.tsx`                          | `/`                               |
| Flashcard session  | `src/components/FlashcardSession.tsx` + `FlashCard.tsx` | `/flashcards`                     |
| Session summary    | `src/components/SessionSummary.tsx`                     | `/flashcards` (after the session) |
| Conversation setup | `src/components/ConversationSetup.tsx`                  | `/conversation`                   |
| Conversation chat  | `src/components/Conversation.tsx`                       | `/conversation` (after setup)     |

## Mascot

Lumi the axolotl is a self-contained SVG at
[`src/components/Mascot.tsx`](../src/components/Mascot.tsx). Four moods
(`happy | thinking | wave | sleep`) toggle facial expressions and the wave
gesture. No external assets.

## Interaction notes

- **Buttons** (Direction A): hover lifts 1px; active press drops 2px and
  flattens the bottom-shadow to 0. Direction B drops both.
- **Flashcards**: drag threshold 120px; swipe-out animation 280ms with
  `cubic-bezier(0.2, 0.7, 0.3, 1.2)`. Stamps fade in linearly to drag
  distance 140px.
- **Coach notes**: warm mustard background, 3px left border, `<ins>` for
  corrections and `<s>` for what to drop.
- **Switches**: 36×20, pill-shaped (Direction A) or rounded-rect (B).
