import type { CorrectionCategory, WritingAnnotation, WritingReview } from "./types";

const VALID_CATEGORIES: ReadonlySet<CorrectionCategory> = new Set([
  "grammar",
  "vocabulary",
  "style",
  "spelling",
]);

/**
 * Parses a raw model response into a `WritingReview`. Tolerates markdown
 * fences and silently drops malformed annotations. Falls back to a "nothing
 * caught" review with `fallbackText` as the corrected text when the response
 * is not valid JSON.
 */
export function parseReview(raw: string, fallbackText: string): WritingReview {
  const stripped = stripJsonFences(raw);
  try {
    const parsed = JSON.parse(stripped) as Partial<WritingReview>;
    const annotations = Array.isArray(parsed.annotations)
      ? parsed.annotations.filter(isValidAnnotation)
      : [];
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      corrected: typeof parsed.corrected === "string" ? parsed.corrected : fallbackText,
      annotations,
    };
  } catch {
    return { summary: "", corrected: fallbackText, annotations: [] };
  }
}

function stripJsonFences(s: string): string {
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

function isValidAnnotation(value: unknown): value is WritingAnnotation {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.original === "string" &&
    typeof a.corrected === "string" &&
    typeof a.explanation === "string" &&
    typeof a.rule === "string" &&
    typeof a.category === "string" &&
    VALID_CATEGORIES.has(a.category as CorrectionCategory)
  );
}
