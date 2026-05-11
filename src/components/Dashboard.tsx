"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mascot } from "./Mascot";

interface DashboardProps {
  due: number;
  streak: number;
  xp: number;
}

export function Dashboard({ due, streak, xp }: DashboardProps) {
  const router = useRouter();

  return (
    <div className="canvas">
      <div className="page-head">
        <div>
          <h1 className="page-title">¡Hola, Sam!</h1>
          <p className="page-sub">
            Adaptive level · <strong>B1 · Intermediate</strong> · 1,284 words in your deck
          </p>
        </div>
        <span className="pill green">● Active today</span>
      </div>

      <div className="stat-row">
        <div className="stat">
          <p className="stat-label">Streak</p>
          <div className="stat-value">
            {streak}
            <span style={{ fontSize: 16, color: "var(--ink-soft)", marginLeft: 6 }}>days</span>
          </div>
          <p className="stat-foot">🔥 Best: 24 days</p>
        </div>
        <div className="stat">
          <p className="stat-label">Cards due</p>
          <div className="stat-value">{due}</div>
          <p className="stat-foot">Reset in 11h 24m</p>
        </div>
        <div className="stat">
          <p className="stat-label">XP this week</p>
          <div className="stat-value">{xp}</div>
          <div className="level-bar">
            <div style={{ width: "64%" }} />
          </div>
        </div>
        <div className="stat">
          <p className="stat-label">Level progress</p>
          <div className="stat-value" style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            B1 <span style={{ fontSize: 18, color: "var(--ink-soft)" }}>→ B2</span>
          </div>
          <div className="level-bar">
            <div style={{ width: "38%" }} />
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <button type="button" className="cta-card" onClick={() => router.push("/flashcards")}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span
              className="pill"
              style={{ background: "rgba(255,255,255,0.22)", color: "#fff", marginBottom: 12 }}
            >
              Daily review
            </span>
            <h2>{due} cards waiting</h2>
            <p>
              15 minutes today keeps your B1 vocabulary fresh — and unlocks the new &ldquo;weekend
              plans&rdquo; set.
            </p>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <span>Start review →</span>
            </div>
          </div>
          <div className="cta-mascot">
            <Mascot size={140} mood="wave" />
          </div>
        </button>

        <div className="card">
          <h3 className="card-title">Today&apos;s word</h3>
          <p className="card-sub">Frequency rank #1,402</p>
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontFamily: "var(--font-spanish)",
                fontWeight: 600,
                fontSize: 36,
                letterSpacing: "-0.02em",
              }}
            >
              sobremesa
            </div>
            <div
              style={{
                color: "var(--ink-soft)",
                fontStyle: "italic",
                marginTop: 2,
                fontFamily: "var(--font-spanish)",
              }}
            >
              noun · feminine
            </div>
            <div style={{ marginTop: 12, fontSize: 15 }}>
              The relaxed conversation lingering at the table after a meal — a deeply Spanish
              concept with no direct English word.
            </div>
            <button type="button" className="btn btn-sm btn-yellow" style={{ marginTop: 16 }}>
              + Add to deck
            </button>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h3>Continue learning</h3>
        <Link className="link" href="/conversation">
          View all modules →
        </Link>
      </div>

      <div className="module-list">
        <Link href="/conversation" className="module-row">
          <div className="module-icon coral">💬</div>
          <div>
            <h4 className="module-name">Conversation Partner</h4>
            <p className="module-sub">
              Pick a persona, roleplay a scenario. Lucía is ready to chat.
            </p>
          </div>
          <div className="module-meta">
            6 personas
            <br />
            <span style={{ color: "var(--coral-deep)" }}>Recommended →</span>
          </div>
        </Link>

        <div className="module-row locked">
          <div className="module-icon info">📰</div>
          <div>
            <h4 className="module-name">Graded News Reader</h4>
            <p className="module-sub">Real Spanish news rewritten at your level. Updated daily.</p>
          </div>
          <div className="module-meta">
            12 articles
            <br />
            <span>Coming soon</span>
          </div>
        </div>

        <Link href="/writing" className="module-row">
          <div className="module-icon gold">✍️</div>
          <div>
            <h4 className="module-name">Writing Coach</h4>
            <p className="module-sub">
              Write freely, get inline corrections with the rule explained.
            </p>
          </div>
          <div className="module-meta">
            Beginner / Advanced
            <br />
            <span style={{ color: "var(--primary-ink)" }}>Try it →</span>
          </div>
        </Link>

        <div className="module-row locked">
          <div className="module-icon green">🎬</div>
          <div>
            <h4 className="module-name">Learn from Content</h4>
            <p className="module-sub">
              Paste a YouTube URL or article — get the 20 words worth learning.
            </p>
          </div>
          <div className="module-meta">
            <span>Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
