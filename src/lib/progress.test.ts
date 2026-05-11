import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, recordSwipe, saveProgress, type ProgressStorage } from "./progress";

function memoryStorage(): ProgressStorage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
}

const NOW = new Date("2026-01-01T00:00:00.000Z");
let storage: ProgressStorage;

beforeEach(() => {
  storage = memoryStorage();
});

describe("progress store", () => {
  it("returns an empty store when nothing is persisted", () => {
    expect(loadProgress(storage)).toEqual({ cards: {} });
  });

  it("round-trips through save and load", () => {
    const store = recordSwipe({ cards: {} }, 42, "right", NOW);
    saveProgress(store, storage);
    expect(loadProgress(storage)).toEqual(store);
  });

  it("recordSwipe leaves the input untouched", () => {
    const before = { cards: {} };
    recordSwipe(before, 1, "right", NOW);
    expect(before).toEqual({ cards: {} });
  });

  it("a right-swipe schedules the card 1+ days out", () => {
    const after = recordSwipe({ cards: {} }, 1, "right", NOW);
    expect(after.cards[1].interval).toBeGreaterThanOrEqual(1);
    expect(new Date(after.cards[1].due).getTime()).toBeGreaterThan(NOW.getTime());
  });

  it("a left-swipe resets the schedule", () => {
    let store = { cards: {} } as ReturnType<typeof loadProgress>;
    store = recordSwipe(store, 1, "right", NOW);
    store = recordSwipe(store, 1, "right", NOW);
    const beforeFail = store.cards[1].repetitions;
    expect(beforeFail).toBe(2);
    store = recordSwipe(store, 1, "left", NOW);
    expect(store.cards[1].repetitions).toBe(0);
  });

  it("recovers gracefully from corrupt JSON", () => {
    storage.setItem("lumi.srs.v1", "{not json");
    expect(loadProgress(storage)).toEqual({ cards: {} });
  });
});
