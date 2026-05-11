"use client";

import { forwardRef } from "react";
import type { Flashcard } from "@/lib/types";

interface FlashCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: Flashcard;
  flipped?: boolean;
  onFlip?: () => void;
  onSpeak?: () => void;
  leftStamp?: number;
  rightStamp?: number;
}

export const FlashCard = forwardRef<HTMLDivElement, FlashCardProps>(function FlashCard(
  {
    card,
    className = "",
    flipped = false,
    onFlip,
    onSpeak,
    leftStamp = 0,
    rightStamp = 0,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={className} {...rest}>
      <div className="card-top">
        <span className="pill green">{card.level}</span>
        {card.frequencyRank !== undefined && (
          <span className="pill outline">Freq #{card.frequencyRank}</span>
        )}
      </div>
      <div className="card-word">{card.es}</div>
      <div className="card-pos">{card.pos}</div>
      <button
        type="button"
        className="card-audio"
        onClick={(e) => {
          e.stopPropagation();
          onSpeak?.();
        }}
      >
        <span className="speaker">🔊</span> Tap to hear · es-ES
      </button>

      {flipped ? (
        <>
          <div className="card-divider" />
          <div className="card-translation">{card.en}</div>
          <div className="card-example">
            <span className="es">&ldquo;{card.sentence}&rdquo;</span>
            <span className="en">{card.sentenceEn}</span>
          </div>
        </>
      ) : (
        <div
          className="card-hidden"
          onClick={(e) => {
            e.stopPropagation();
            onFlip?.();
          }}
        >
          tap or press{" "}
          <span className="kbd" style={{ marginLeft: 4, marginRight: 4 }}>
            space
          </span>{" "}
          to reveal
        </div>
      )}

      <div className="swipe-stamp left" style={{ opacity: leftStamp }}>
        Still learning
      </div>
      <div className="swipe-stamp right" style={{ opacity: rightStamp }}>
        Got it!
      </div>
    </div>
  );
});
