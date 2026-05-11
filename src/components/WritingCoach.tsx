"use client";

import { useState } from "react";
import type { WritingAnnotation, WritingMode, WritingReview } from "@/lib/types";
import { annotateText } from "@/lib/annotate";

const PROMPTS = [
  "Cuéntame qué hiciste el fin de semana.",
  "Describe tu plato favorito y por qué te gusta.",
  "Escribe un correo a un amigo que no ves hace tiempo.",
];

export function WritingCoach() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<WritingMode>("beginner");
  const [review, setReview] = useState<WritingReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<WritingAnnotation | null>(null);

  async function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setActive(null);
    try {
      const res = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, mode }),
      });
      const data = (await res.json()) as { review?: WritingReview; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setReview(data.review ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reach the writing coach.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="canvas">
      <div className="page-head">
        <div>
          <h1 className="page-title">Writing coach</h1>
          <p className="page-sub">
            Write freely in Spanish. Submit and your coach will mark grammar, vocabulary, and style
            — with the rule explained for each correction.
          </p>
        </div>
      </div>

      <div className="setup-bar" style={{ marginTop: 0 }}>
        <span>Mode:</span>
        <div className="difficulty">
          <button
            type="button"
            className={mode === "beginner" ? "active" : ""}
            onClick={() => setMode("beginner")}
          >
            Beginner
          </button>
          <button
            type="button"
            className={mode === "advanced" ? "active" : ""}
            onClick={() => setMode("advanced")}
          >
            Advanced
          </button>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 13 }}>
          {mode === "beginner" ? "Only major errors flagged." : "Style + naturalness flagged too."}
        </span>
        <button type="button" className="btn" onClick={submit} disabled={loading || !text.trim()}>
          {loading ? "Reviewing…" : "Review →"}
        </button>
      </div>

      <div className="section-head">
        <h3>Your text</h3>
        <span className="link">{text.length} chars</span>
      </div>
      <textarea
        className="conv-input"
        placeholder={`Try one of these prompts:\n• ${PROMPTS.join("\n• ")}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        style={{ width: "100%", minHeight: 200 }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            className="suggest-chip"
            onClick={() => setText(p + "\n\n")}
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <div className="card" style={{ marginTop: 24, color: "var(--danger)" }} role="alert">
          {error}
        </div>
      )}

      {review && <ReviewView review={review} active={active} onActivate={setActive} />}
    </div>
  );
}

interface ReviewViewProps {
  review: WritingReview;
  active: WritingAnnotation | null;
  onActivate: (a: WritingAnnotation | null) => void;
}

function ReviewView({ review, active, onActivate }: ReviewViewProps) {
  // Show the learner's *original* text with inline corrections.
  const originalSegments = annotateText(buildOriginalFromReview(review), review.annotations);

  return (
    <>
      <div className="section-head">
        <h3>Coach&apos;s notes</h3>
        <span className="link">
          {review.annotations.length} correction{review.annotations.length === 1 ? "" : "s"}
        </span>
      </div>

      {review.summary && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ margin: 0 }}>{review.summary}</p>
        </div>
      )}

      <div className="dash-grid">
        <div className="card">
          <h4 className="card-title">Your text, annotated</h4>
          <p
            className="card-sub"
            style={{ marginBottom: 16, fontFamily: "var(--font-spanish)", fontSize: 16 }}
          >
            Tap a highlighted word to see the rule.
          </p>
          <div
            style={{
              fontFamily: "var(--font-spanish)",
              fontWeight: 500,
              fontSize: 17,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {originalSegments.map((seg, i) =>
              seg.type === "plain" ? (
                <span key={i}>{seg.text}</span>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => onActivate(seg.annotation)}
                  style={{
                    background:
                      active === seg.annotation
                        ? "color-mix(in srgb, var(--accent) 38%, transparent)"
                        : "color-mix(in srgb, var(--accent) 22%, transparent)",
                    borderBottom: "2px solid var(--accent)",
                    borderRadius: 4,
                    padding: "0 2px",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    color: "var(--ink)",
                    cursor: "pointer",
                  }}
                >
                  <s style={{ color: "var(--ink-mute)" }}>{seg.text}</s>
                  {seg.annotation.corrected && (
                    <ins
                      style={{
                        textDecoration: "none",
                        fontWeight: 700,
                        marginLeft: 4,
                      }}
                    >
                      {seg.annotation.corrected}
                    </ins>
                  )}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="card">
          <h4 className="card-title">Corrected version</h4>
          <p className="card-sub" style={{ marginBottom: 16 }}>
            Side-by-side reference.
          </p>
          <div
            style={{
              fontFamily: "var(--font-spanish)",
              fontWeight: 500,
              fontSize: 17,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              color: "var(--ink-soft)",
            }}
          >
            {review.corrected}
          </div>
        </div>
      </div>

      <div className="section-head">
        <h3>Rule explanations</h3>
      </div>
      {review.annotations.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>Nothing to flag — well done. ¡Sigue así!</p>
        </div>
      ) : (
        <div className="module-list">
          {review.annotations.map((a, i) => (
            <button
              key={i}
              type="button"
              className={`scenario-row ${active === a ? "selected" : ""}`}
              onClick={() => onActivate(a)}
            >
              <div className="scenario-emoji">{categoryEmoji(a.category)}</div>
              <div style={{ flex: 1 }}>
                <h4 className="module-name">
                  <s style={{ color: "var(--ink-mute)" }}>{a.original}</s>
                  {a.corrected && (
                    <>
                      {" "}
                      →{" "}
                      <ins style={{ textDecoration: "none", color: "var(--primary-ink)" }}>
                        {a.corrected}
                      </ins>
                    </>
                  )}
                </h4>
                <p className="module-sub">{a.explanation}</p>
              </div>
              <span className="pill outline">{a.rule}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function buildOriginalFromReview(review: WritingReview): string {
  // The API guarantees each annotation.original is a verbatim substring of the
  // learner's text. We rebuild the learner's text by reversing the corrections
  // applied to `review.corrected`.
  let s = review.corrected;
  for (const a of review.annotations) {
    if (!a.corrected) continue;
    s = s.split(a.corrected).join(a.original);
  }
  return s;
}

function categoryEmoji(category: WritingAnnotation["category"]): string {
  switch (category) {
    case "grammar":
      return "📐";
    case "vocabulary":
      return "📚";
    case "style":
      return "✒️";
    case "spelling":
      return "🔤";
  }
}
