import { describe, expect, it } from "vitest";
import { annotateText } from "./annotate";
import type { WritingAnnotation } from "./types";

const ann = (over: Partial<WritingAnnotation>): WritingAnnotation => ({
  original: "",
  corrected: "",
  explanation: "",
  rule: "",
  category: "grammar",
  ...over,
});

describe("annotateText", () => {
  it("returns a single plain segment when there are no annotations", () => {
    const out = annotateText("Hola mundo.", []);
    expect(out).toEqual([{ type: "plain", text: "Hola mundo." }]);
  });

  it("inlines a single annotation", () => {
    const a = ann({ original: "soy", corrected: "estoy" });
    const out = annotateText("Yo soy cansado.", [a]);
    expect(out).toEqual([
      { type: "plain", text: "Yo " },
      { type: "annotated", text: "soy", annotation: a },
      { type: "plain", text: " cansado." },
    ]);
  });

  it("annotates multiple matches left-to-right", () => {
    const a1 = ann({ original: "ser", corrected: "estar", rule: "ser vs estar" });
    const a2 = ann({ original: "mui", corrected: "muy", rule: "spelling" });
    const out = annotateText("ser mui bien", [a1, a2]);
    expect(out.map((s) => s.text).join("")).toBe("ser mui bien");
    const annotated = out.filter((s) => s.type === "annotated");
    expect(annotated).toHaveLength(2);
  });

  it("drops overlapping annotations rather than double-marking", () => {
    const a1 = ann({ original: "buen tiempo", corrected: "buen clima" });
    const a2 = ann({ original: "tiempo para", corrected: "tiempo de" });
    const out = annotateText("hace buen tiempo para salir", [a1, a2]);
    const annotated = out.filter((s) => s.type === "annotated");
    expect(annotated).toHaveLength(1);
    expect(annotated[0].text).toBe("buen tiempo");
  });

  it("ignores annotations whose `original` is absent", () => {
    const a = ann({ original: "no-such-string", corrected: "x" });
    const out = annotateText("hola", [a]);
    expect(out).toEqual([{ type: "plain", text: "hola" }]);
  });

  it("ignores annotations with an empty `original`", () => {
    const a = ann({ original: "", corrected: "x" });
    const out = annotateText("hola", [a]);
    expect(out).toEqual([{ type: "plain", text: "hola" }]);
  });

  it("preserves the full original text across all segments", () => {
    const text = "Ayer fui al parque y vi un perro pequeño.";
    const out = annotateText(text, [
      ann({ original: "fui", corrected: "fui" }),
      ann({ original: "pequeño", corrected: "pequeñito" }),
    ]);
    expect(out.map((s) => s.text).join("")).toBe(text);
  });
});
