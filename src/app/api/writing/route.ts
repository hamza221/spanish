import { NextResponse } from "next/server";
import { MODEL, getAnthropic } from "@/lib/anthropic";
import { parseReview } from "@/lib/writing-review";
import type { WritingAnnotation, WritingMode, WritingReview } from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  text: string;
  mode: WritingMode;
}

const MAX_INPUT_CHARS = 4000;

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Empty text" }, { status: 400 });
  }
  if (text.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Please keep text under ${MAX_INPUT_CHARS} characters.` },
      { status: 400 },
    );
  }
  const mode: WritingMode = body.mode === "advanced" ? "advanced" : "beginner";

  const client = getAnthropic();
  if (!client) {
    return NextResponse.json({ review: stubReview(text, mode) });
  }

  try {
    const review = await runReview(client, text, mode);
    return NextResponse.json({ review });
  } catch (err) {
    console.error("Writing coach call failed, returning stub", err);
    return NextResponse.json({ review: stubReview(text, mode) });
  }
}

async function runReview(
  client: import("@anthropic-ai/sdk").default,
  text: string,
  mode: WritingMode,
): Promise<WritingReview> {
  const system = [
    "You are a Spanish writing coach. Review the learner's text and return JSON only.",
    mode === "beginner"
      ? "Flag only genuine grammar, spelling, or vocabulary errors. Be encouraging — do not nitpick style."
      : "Flag grammar, vocabulary, spelling, and stylistic / naturalness issues. Suggest more idiomatic phrasings.",
    "",
    "Respond with this exact JSON shape and nothing else (no prose, no markdown fences):",
    "{",
    `  "summary": "<one or two sentences of high-level feedback in English>",`,
    `  "corrected": "<the full text with all corrections applied, preserving paragraph breaks>",`,
    `  "annotations": [`,
    `    {`,
    `      "original": "<exact substring of the learner's text>",`,
    `      "corrected": "<replacement; use an empty string to delete>",`,
    `      "explanation": "<one sentence, English, why this change>",`,
    `      "rule": "<short label, e.g. 'ser vs. estar', 'gender agreement'>",`,
    `      "category": "grammar" | "vocabulary" | "style" | "spelling"`,
    `    }`,
    `  ]`,
    "}",
    "",
    "Each `original` must appear verbatim in the learner's text. If the text is already correct,",
    "return an empty annotations array and a brief positive summary.",
  ].join("\n");

  const result = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: "user", content: text }],
  });

  const raw = result.content
    .filter((b): b is { type: "text"; text: string } => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return parseReview(raw, text);
}

/** Deterministic fallback used when no API key is configured. */
function stubReview(text: string, mode: WritingMode): WritingReview {
  const annotations: WritingAnnotation[] = [];
  if (/\bmui\b/i.test(text)) {
    annotations.push({
      original: "mui",
      corrected: "muy",
      explanation: "Common misspelling: the adverb is muy.",
      rule: "spelling",
      category: "spelling",
    });
  }
  if (/\bsoy cansado\b/i.test(text)) {
    annotations.push({
      original: "soy cansado",
      corrected: "estoy cansado",
      explanation: "Use estar for temporary states like being tired.",
      rule: "ser vs. estar",
      category: "grammar",
    });
  }
  const corrected = annotations.reduce((acc, a) => acc.split(a.original).join(a.corrected), text);
  return {
    annotations,
    corrected,
    summary:
      annotations.length === 0
        ? "Great — no errors caught by the offline reviewer. Configure ANTHROPIC_API_KEY for a deeper review."
        : `${annotations.length} suggestion${annotations.length === 1 ? "" : "s"} from the offline reviewer (${mode} mode). Configure ANTHROPIC_API_KEY for a deeper review.`,
  };
}
