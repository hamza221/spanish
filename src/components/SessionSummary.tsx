"use client";

import type { SessionResult } from "@/lib/types";
import { Mascot } from "./Mascot";

interface SessionSummaryProps {
  result: SessionResult;
  onDone: () => void;
  onReview: () => void;
}

export function SessionSummary({ result, onDone, onReview }: SessionSummaryProps) {
  const accuracy = result.total > 0 ? Math.round((result.known / result.total) * 100) : 0;
  return (
    <div className="canvas">
      <div className="summary">
        <Mascot size={120} mood="happy" />
        <h2>¡Bien hecho!</h2>
        <p style={{ color: "var(--ink-soft)", margin: 0 }}>
          You finished today&apos;s review session.
        </p>

        <div className="summary-stats">
          <div className="summary-stat">
            <div className="v" style={{ color: "var(--primary-ink)" }}>
              {result.known}
            </div>
            <div className="l">Got it</div>
          </div>
          <div className="summary-stat">
            <div className="v" style={{ color: "var(--danger)" }}>
              {result.learning}
            </div>
            <div className="l">Still learning</div>
          </div>
          <div className="summary-stat">
            <div className="v">{accuracy}%</div>
            <div className="l">Accuracy</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button type="button" className="btn btn-ghost" onClick={onReview}>
            Review missed
          </button>
          <button type="button" className="btn" onClick={onDone}>
            +{result.known * 12} XP · Continue
          </button>
        </div>
      </div>
    </div>
  );
}
