import type { WritingAnnotation } from "./types";

/**
 * Splits `text` into a sequence of segments — either plain runs that were not
 * touched, or annotated runs that match exactly one annotation. The renderer
 * uses this to draw inline corrections without re-scanning the text itself.
 *
 * Overlapping annotations are resolved greedily, left-to-right: the
 * left-most-then-longest match wins, and any annotation that would overlap an
 * already-claimed range is dropped silently.
 */
export interface PlainSegment {
  type: "plain";
  text: string;
}

export interface AnnotatedSegment {
  type: "annotated";
  text: string;
  annotation: WritingAnnotation;
}

export type AnnotationSegment = PlainSegment | AnnotatedSegment;

interface Hit {
  start: number;
  end: number;
  annotation: WritingAnnotation;
}

export function annotateText(text: string, annotations: WritingAnnotation[]): AnnotationSegment[] {
  const hits: Hit[] = [];

  for (const annotation of annotations) {
    const needle = annotation.original;
    if (!needle) continue;
    let from = 0;
    while (from <= text.length - needle.length) {
      const idx = text.indexOf(needle, from);
      if (idx === -1) break;
      const end = idx + needle.length;
      const overlaps = hits.some((h) => idx < h.end && end > h.start);
      if (!overlaps) {
        hits.push({ start: idx, end, annotation });
        break;
      }
      from = idx + 1;
    }
  }

  hits.sort((a, b) => a.start - b.start);

  const segments: AnnotationSegment[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start > cursor) {
      segments.push({ type: "plain", text: text.slice(cursor, hit.start) });
    }
    segments.push({
      type: "annotated",
      text: text.slice(hit.start, hit.end),
      annotation: hit.annotation,
    });
    cursor = hit.end;
  }
  if (cursor < text.length) {
    segments.push({ type: "plain", text: text.slice(cursor) });
  }
  return segments;
}
