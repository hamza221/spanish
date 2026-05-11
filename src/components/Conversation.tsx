"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ConversationSetup as Setup } from "@/lib/types";
import { speak } from "@/lib/speech";
import { SUGGESTIONS } from "@/data/personas";

interface ConversationProps {
  setup: Setup;
  onExit: () => void;
}

interface ApiResponse {
  reply: ChatMessage;
}

export function Conversation({ setup, onExit }: ConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showCoach, setShowCoach] = useState(true);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const opener = useRef(false);

  // Auto-scroll to bottom on new message or while thinking.
  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages, thinking]);

  // Speak the latest AI message.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.from === "ai") speak(last.text, setup.persona.ttsLocale);
  }, [messages, setup.persona.ttsLocale]);

  // Fetch the opening line once on mount.
  useEffect(() => {
    if (opener.current) return;
    opener.current = true;
    void sendToApi([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToApi(history: ChatMessage[]) {
    setThinking(true);
    setError(null);
    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: setup.persona.id,
          scenarioId: setup.scenario.id,
          difficulty: setup.difficulty,
          messages: history,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ApiResponse;
      setMessages((m) => [...m, data.reply]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reach the AI tutor.");
    } finally {
      setThinking(false);
    }
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const userMsg: ChatMessage = { from: "user", text: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    void sendToApi(nextHistory);
  }

  return (
    <div className="conv-screen">
      <div className="conv-header">
        <button type="button" className="flash-close" onClick={onExit} aria-label="Exit">
          ✕
        </button>
        <div className="conv-avatar" style={{ background: setup.persona.bgColor }}>
          {setup.persona.emoji}
        </div>
        <div className="conv-meta">
          <h4 className="conv-name">{setup.persona.name}</h4>
          <p className="conv-scenario">
            {setup.persona.role} · {setup.scenario.title} · {setup.difficulty}
          </p>
        </div>
        <div className="conv-toggle">
          <span>Show translations</span>
          <button
            type="button"
            aria-label="Show translations"
            aria-pressed={showTranslations}
            className={`switch ${showTranslations ? "on" : ""}`}
            onClick={() => setShowTranslations((v) => !v)}
          />
        </div>
        <div className="conv-toggle" style={{ marginLeft: 16 }}>
          <span>Coach notes</span>
          <button
            type="button"
            aria-label="Coach notes"
            aria-pressed={showCoach}
            className={`switch ${showCoach ? "on" : ""}`}
            onClick={() => setShowCoach((v) => !v)}
          />
        </div>
      </div>

      <div className="conv-stream" ref={streamRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.from === "user" ? "user" : ""}`}>
            <div
              className="msg-avatar"
              style={{
                background: m.from === "ai" ? setup.persona.bgColor : "var(--bg-soft)",
                color: m.from === "user" ? "var(--ink)" : "inherit",
              }}
            >
              {m.from === "ai" ? setup.persona.emoji : "🙂"}
            </div>
            <div style={{ flex: 1 }}>
              <div
                className="bubble"
                onClick={() => m.from === "ai" && speak(m.text, setup.persona.ttsLocale)}
                style={{ cursor: m.from === "ai" ? "pointer" : "default" }}
              >
                {m.text}
                {showTranslations && m.en && <div className="msg-translation">{m.en}</div>}
              </div>
              {showCoach && m.coach && (
                <div className="coach-note">
                  <span className="label">Coach</span>
                  <span dangerouslySetInnerHTML={{ __html: `${m.coach.label}. ${m.coach.html}` }} />
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="msg-row">
            <div className="msg-avatar" style={{ background: setup.persona.bgColor }}>
              {setup.persona.emoji}
            </div>
            <div className="bubble" style={{ padding: "14px 18px" }}>
              <span className="thinking-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
        {error && (
          <div
            role="alert"
            style={{
              alignSelf: "center",
              color: "var(--danger)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div className="conv-suggest-row">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            type="button"
            className="suggest-chip"
            onClick={() => sendMessage(s.es)}
            disabled={thinking}
          >
            {s.es}
            <span className="label-en">{s.en}</span>
          </button>
        ))}
      </div>

      <div className="conv-input-row">
        <textarea
          className="conv-input"
          placeholder="Escribe en español…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          rows={1}
        />
        <button
          type="button"
          className="btn"
          onClick={() => sendMessage(input)}
          disabled={thinking}
        >
          Send
        </button>
      </div>
    </div>
  );
}
