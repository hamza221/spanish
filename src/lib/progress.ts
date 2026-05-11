import { initialState, qualityFromSwipe, review, type SrsState } from "./srs";

const STORAGE_KEY = "lumi.srs.v1";

export type Direction = "left" | "right";

export interface ProgressStore {
  /** Card id → SRS state. */
  cards: Record<number, SrsState>;
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Returns the persisted progress, or an empty store. Safe to call during SSR;
 * returns an empty store when `storage` is unavailable.
 */
export function loadProgress(storage?: ProgressStorage | null): ProgressStore {
  const s = storage ?? defaultStorage();
  if (!s) return { cards: {} };
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return { cards: {} };
    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    if (parsed && typeof parsed === "object" && parsed.cards && typeof parsed.cards === "object") {
      return { cards: parsed.cards as Record<number, SrsState> };
    }
  } catch {
    // ignore — fall through to empty store
  }
  return { cards: {} };
}

export function saveProgress(store: ProgressStore, storage?: ProgressStorage | null): void {
  const s = storage ?? defaultStorage();
  if (!s) return;
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage can throw in private mode / over-quota — non-fatal.
  }
}

/**
 * Updates the store in-place by applying a swipe to one card.
 * Returns the new store (the input is not mutated).
 */
export function recordSwipe(
  store: ProgressStore,
  cardId: number,
  direction: Direction,
  now: Date = new Date(),
): ProgressStore {
  const prev = store.cards[cardId] ?? initialState(now);
  const next = review(prev, qualityFromSwipe(direction), now);
  return {
    cards: { ...store.cards, [cardId]: next },
  };
}

function defaultStorage(): ProgressStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
