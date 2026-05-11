"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Flashcard, SessionResult } from "@/lib/types";
import { speak } from "@/lib/speech";
import { FlashCard } from "./FlashCard";

interface FlashcardSessionProps {
  cards: Flashcard[];
  onExit: () => void;
  onComplete: (result: SessionResult) => void;
}

type SwipeDirection = "left" | "right";

export function FlashcardSession({ cards, onExit, onComplete }: FlashcardSessionProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [swipingOut, setSwipingOut] = useState<SwipeDirection | null>(null);
  const [results, setResults] = useState({ known: 0, learning: 0 });
  const startRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const total = cards.length;
  const current = cards[index];
  const next = cards[index + 1];
  const nextNext = cards[index + 2];

  const handleSwipe = useCallback(
    (dir: SwipeDirection) => {
      if (swipingOut) return;
      setSwipingOut(dir);
      const nextResults = {
        known: results.known + (dir === "right" ? 1 : 0),
        learning: results.learning + (dir === "left" ? 1 : 0),
      };
      setResults(nextResults);
      window.setTimeout(() => {
        if (index + 1 >= total) {
          onComplete({ ...nextResults, total });
        } else {
          setIndex((i) => i + 1);
          setFlipped(false);
          setDrag({ x: 0, y: 0, dragging: false });
          setSwipingOut(null);
        }
      }, 280);
    },
    [swipingOut, results, index, total, onComplete],
  );

  // Keyboard shortcuts: ← still-learning, → got-it, space/Enter flip, Esc exit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleSwipe("left");
      else if (e.key === "ArrowRight") handleSwipe("right");
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSwipe, onExit]);

  // Auto-speak the Spanish word when each card mounts.
  useEffect(() => {
    if (current) speak(current.es, "es-ES");
  }, [current]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipingOut) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
    cardRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.dragging) return;
    setDrag({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
      dragging: true,
    });
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.dragging) return;
    const threshold = 120;
    if (drag.x < -threshold) handleSwipe("left");
    else if (drag.x > threshold) handleSwipe("right");
    else setDrag({ x: 0, y: 0, dragging: false });
    cardRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const dragRot = drag.x * 0.06;
  const leftStamp = Math.max(0, Math.min(1, -drag.x / 140));
  const rightStamp = Math.max(0, Math.min(1, drag.x / 140));

  return (
    <div className="flash-screen">
      <div className="flash-top">
        <button type="button" className="flash-close" onClick={onExit} aria-label="Exit session">
          ✕
        </button>
        <div className="flash-progress">
          <div style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <div className="flash-counter">
          {index + 1} / {total}
        </div>
        <span className="pill green">+{results.known * 12} XP</span>
      </div>

      <div className="flash-stage">
        <div className="card-deck">
          {nextNext && (
            <FlashCard key={`nn-${nextNext.id}`} card={nextNext} className="flash-card behind-2" />
          )}
          {next && <FlashCard key={`n-${next.id}`} card={next} className="flash-card behind-1" />}
          {current && (
            <FlashCard
              ref={cardRef}
              key={`c-${current.id}`}
              card={current}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              onSpeak={() => speak(current.es, "es-ES")}
              className={`flash-card ${
                swipingOut ? `swipe-${swipingOut}` : drag.dragging ? "swiping" : ""
              }`}
              style={
                swipingOut
                  ? undefined
                  : drag.dragging
                    ? {
                        transform: `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${dragRot}deg)`,
                      }
                    : undefined
              }
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              leftStamp={leftStamp}
              rightStamp={rightStamp}
            />
          )}
        </div>
      </div>

      <div className="flash-actions">
        <button
          type="button"
          className="action-btn no"
          onClick={() => handleSwipe("left")}
          aria-label="Still learning"
          title="Still learning (←)"
        >
          ✕
        </button>
        <button
          type="button"
          className="action-btn flip"
          onClick={() => setFlipped((f) => !f)}
          aria-label="Flip card"
          title="Flip card (space)"
        >
          ↻
        </button>
        <button
          type="button"
          className="action-btn audio"
          onClick={() => current && speak(current.es, "es-ES")}
          aria-label="Replay audio"
          title="Replay audio"
        >
          🔊
        </button>
        <button
          type="button"
          className="action-btn yes"
          onClick={() => handleSwipe("right")}
          aria-label="Got it"
          title="Got it (→)"
        >
          ✓
        </button>
      </div>
      <p className="flash-hint">
        <span className="kbd">←</span> still learning · <span className="kbd">space</span> flip ·{" "}
        <span className="kbd">→</span> got it · drag to swipe
      </p>
    </div>
  );
}
