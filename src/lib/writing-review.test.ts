import { describe, expect, it } from "vitest";
import { parseReview } from "./writing-review";

describe("parseReview", () => {
  it("parses a well-formed payload", () => {
    const raw = JSON.stringify({
      summary: "Good attempt.",
      corrected: "Yo estoy cansado.",
      annotations: [
        {
          original: "soy",
          corrected: "estoy",
          explanation: "Use estar for temporary states.",
          rule: "ser vs. estar",
          category: "grammar",
        },
      ],
    });
    const review = parseReview(raw, "Yo soy cansado.");
    expect(review.summary).toBe("Good attempt.");
    expect(review.corrected).toBe("Yo estoy cansado.");
    expect(review.annotations).toHaveLength(1);
    expect(review.annotations[0].category).toBe("grammar");
  });

  it("strips markdown fences before parsing", () => {
    const raw =
      "```json\n" + JSON.stringify({ summary: "ok", corrected: "x", annotations: [] }) + "\n```";
    const review = parseReview(raw, "x");
    expect(review.summary).toBe("ok");
  });

  it("drops annotations with an unknown category", () => {
    const raw = JSON.stringify({
      summary: "",
      corrected: "x",
      annotations: [
        {
          original: "a",
          corrected: "b",
          explanation: "",
          rule: "",
          category: "bogus",
        },
      ],
    });
    expect(parseReview(raw, "x").annotations).toEqual([]);
  });

  it("falls back to the input text when the response is unparseable", () => {
    const review = parseReview("not json", "ORIGINAL");
    expect(review).toEqual({ summary: "", corrected: "ORIGINAL", annotations: [] });
  });
});
