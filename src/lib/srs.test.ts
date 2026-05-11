import { describe, expect, it } from "vitest";
import { DEFAULT_EASE, MIN_EASE, dueCards, initialState, qualityFromSwipe, review } from "./srs";

const NOW = new Date("2026-01-01T00:00:00.000Z");
const MS_DAY = 86_400_000;

describe("initialState", () => {
  it("starts with default ease and zero repetitions", () => {
    const s = initialState(NOW);
    expect(s.ease).toBe(DEFAULT_EASE);
    expect(s.interval).toBe(0);
    expect(s.repetitions).toBe(0);
    expect(s.due).toBe(NOW.toISOString());
  });
});

describe("review", () => {
  it("first successful review schedules in 1 day", () => {
    const next = review(initialState(NOW), 4, NOW);
    expect(next.repetitions).toBe(1);
    expect(next.interval).toBe(1);
    expect(new Date(next.due).getTime() - NOW.getTime()).toBe(MS_DAY);
  });

  it("second successful review schedules in 6 days", () => {
    const a = review(initialState(NOW), 4, NOW);
    const b = review(a, 4, NOW);
    expect(b.repetitions).toBe(2);
    expect(b.interval).toBe(6);
  });

  it("third successful review uses ease factor", () => {
    const a = review(initialState(NOW), 4, NOW);
    const b = review(a, 4, NOW);
    const c = review(b, 4, NOW);
    expect(c.repetitions).toBe(3);
    expect(c.interval).toBe(Math.round(b.interval * c.ease));
  });

  it("failure resets repetitions and schedules 1 day later", () => {
    const a = review(initialState(NOW), 4, NOW);
    const b = review(a, 4, NOW);
    const fail = review(b, 1, NOW);
    expect(fail.repetitions).toBe(0);
    expect(fail.interval).toBe(1);
  });

  it("ease factor never drops below the floor", () => {
    let state = initialState(NOW);
    for (let i = 0; i < 50; i++) state = review(state, 0, NOW);
    expect(state.ease).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it("perfect recall raises the ease factor", () => {
    const next = review(initialState(NOW), 5, NOW);
    expect(next.ease).toBeGreaterThan(DEFAULT_EASE);
  });

  it("is pure — does not mutate the input state", () => {
    const before = initialState(NOW);
    const snapshot = { ...before };
    review(before, 4, NOW);
    expect(before).toEqual(snapshot);
  });
});

describe("qualityFromSwipe", () => {
  it("maps right swipe to a passing quality", () => {
    expect(qualityFromSwipe("right")).toBeGreaterThanOrEqual(3);
  });
  it("maps left swipe to a failing quality", () => {
    expect(qualityFromSwipe("left")).toBeLessThan(3);
  });
});

describe("dueCards", () => {
  it("returns cards with no due date (treated as new)", () => {
    const cards: { id: number; due?: string }[] = [{ id: 1 }, { id: 2 }];
    expect(dueCards(cards, NOW)).toHaveLength(2);
  });

  it("includes cards whose due time is in the past", () => {
    const past = new Date(NOW.getTime() - MS_DAY).toISOString();
    const future = new Date(NOW.getTime() + MS_DAY).toISOString();
    const cards: { id: number; due: string }[] = [
      { id: 1, due: past },
      { id: 2, due: future },
    ];
    const result = dueCards(cards, NOW);
    expect(result.map((c) => c.id)).toEqual([1]);
  });
});
