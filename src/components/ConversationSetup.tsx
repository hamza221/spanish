"use client";

import { useState } from "react";
import { PERSONAS, SCENARIOS } from "@/data/personas";
import type { ConversationSetup as Setup } from "@/lib/types";

interface Props {
  onStart: (setup: Setup) => void;
  onBack: () => void;
}

const DIFFICULTIES: Setup["difficulty"][] = ["A2", "B1", "B2"];

export function ConversationSetup({ onStart, onBack }: Props) {
  const [personaId, setPersonaId] = useState("lucia");
  const [scenarioId, setScenarioId] = useState("coffee");
  const [difficulty, setDifficulty] = useState<Setup["difficulty"]>("B1");

  const persona = PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  return (
    <div className="canvas">
      <div className="page-head">
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onBack}
            style={{ marginBottom: 12 }}
          >
            ← Back
          </button>
          <h1 className="page-title">Conversation partner</h1>
          <p className="page-sub">
            Pick a character and a situation. They&apos;ll stay in role; a coach will quietly check
            your Spanish in the background.
          </p>
        </div>
      </div>

      <div className="section-head">
        <h3>1. Choose a persona</h3>
        <span className="link">{PERSONAS.length} characters</span>
      </div>
      <div className="conv-setup-grid">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`persona-card ${personaId === p.id ? "selected" : ""}`}
            onClick={() => setPersonaId(p.id)}
          >
            <div className="persona-avatar" style={{ background: p.bgColor }}>
              {p.emoji}
            </div>
            <h4 className="persona-name">{p.name}</h4>
            <p className="persona-role">{p.role}</p>
            <div className="persona-tags">
              {p.tags.map((t) => (
                <span key={t} className="pill outline" style={{ fontSize: 11, padding: "2px 8px" }}>
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="section-head">
        <h3>2. Choose a scenario</h3>
      </div>
      <div className="module-list">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`scenario-row ${scenarioId === s.id ? "selected" : ""}`}
            onClick={() => setScenarioId(s.id)}
          >
            <div className="scenario-emoji">{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <h4 className="module-name">{s.title}</h4>
              <p className="module-sub">{s.sub}</p>
            </div>
            {scenarioId === s.id && <span className="pill green">Selected</span>}
          </button>
        ))}
      </div>

      <div className="setup-bar">
        <span>Difficulty:</span>
        <div className="difficulty">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              className={difficulty === d ? "active" : ""}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 13 }}>
          Practicing with <strong>{persona.name}</strong> at <strong>{difficulty}</strong>
        </span>
        <button
          type="button"
          className="btn"
          onClick={() => onStart({ persona, scenario, difficulty })}
        >
          Start conversation →
        </button>
      </div>
    </div>
  );
}
