import { NextResponse } from "next/server";
import { FLASHCARDS } from "@/data/flashcards";
import { dueCards } from "@/lib/srs";

export const runtime = "nodejs";

/**
 * Returns the current user's due flashcards. For now we serve the seed deck
 * directly; a Prisma-backed implementation will plug in here once auth is wired.
 */
export async function GET() {
  const cards = dueCards(FLASHCARDS);
  return NextResponse.json({ cards });
}
