"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlashcardSession } from "@/components/FlashcardSession";
import { SessionSummary } from "@/components/SessionSummary";
import { FLASHCARDS } from "@/data/flashcards";
import type { SessionResult } from "@/lib/types";

export default function FlashcardsPage() {
  const router = useRouter();
  const [result, setResult] = useState<SessionResult | null>(null);
  const [resetKey, setResetKey] = useState(0);

  if (result) {
    return (
      <SessionSummary
        result={result}
        onDone={() => router.push("/")}
        onReview={() => {
          setResult(null);
          setResetKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <FlashcardSession
      key={resetKey}
      cards={FLASHCARDS}
      onExit={() => router.push("/")}
      onComplete={(r) => setResult(r)}
    />
  );
}
