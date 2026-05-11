/**
 * SM-2 spaced-repetition algorithm (SuperMemo 2).
 *
 * Quality scale (0–5):
 *   0 — total blackout
 *   1 — wrong, recognized after seeing answer
 *   2 — wrong, easy to recall after seeing answer
 *   3 — correct, but required significant effort
 *   4 — correct, after some hesitation
 *   5 — perfect recall
 *
 * In the swipe UI:
 *   "Still learning" (left swipe) → quality = 2
 *   "Got it"        (right swipe) → quality = 4
 */

export interface SrsState {
  /** Easiness factor. Bounded below at 1.3. */
  ease: number;
  /** Inter-review interval, in days. */
  interval: number;
  /** Number of successful repetitions in a row. Resets on a failure. */
  repetitions: number;
  /** ISO timestamp of when this card is next due. */
  due: string;
}

export const DEFAULT_EASE = 2.5;
export const MIN_EASE = 1.3;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function initialState(now: Date = new Date()): SrsState {
  return {
    ease: DEFAULT_EASE,
    interval: 0,
    repetitions: 0,
    due: now.toISOString(),
  };
}

/**
 * Apply one review. Returns the next SRS state.
 * Pure function — does not mutate `prev`.
 */
export function review(prev: SrsState, quality: number, now: Date = new Date()): SrsState {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  // Update ease factor (SM-2 formula).
  const nextEase = Math.max(MIN_EASE, prev.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  let repetitions: number;
  let interval: number;

  if (q < 3) {
    // Failure — restart the schedule.
    repetitions = 0;
    interval = 1;
  } else {
    repetitions = prev.repetitions + 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(prev.interval * nextEase);
    }
  }

  const due = new Date(now.getTime() + interval * MS_PER_DAY).toISOString();

  return {
    ease: Number(nextEase.toFixed(4)),
    interval,
    repetitions,
    due,
  };
}

/** Maps the binary swipe action to an SM-2 quality value. */
export function qualityFromSwipe(direction: "left" | "right"): number {
  return direction === "right" ? 4 : 2;
}

/** Returns cards whose `due` timestamp is at or before `now`. */
export function dueCards<T extends { due?: string }>(cards: T[], now: Date = new Date()): T[] {
  const cutoff = now.getTime();
  return cards.filter((c) => !c.due || new Date(c.due).getTime() <= cutoff);
}
