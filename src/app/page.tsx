import { Shell } from "@/components/Shell";
import { Dashboard } from "@/components/Dashboard";
import { FLASHCARDS } from "@/data/flashcards";

export default function HomePage() {
  return (
    <Shell>
      <Dashboard due={FLASHCARDS.length} streak={12} xp={284} />
    </Shell>
  );
}
