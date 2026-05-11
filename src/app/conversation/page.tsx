"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Conversation } from "@/components/Conversation";
import { ConversationSetup } from "@/components/ConversationSetup";
import type { ConversationSetup as Setup } from "@/lib/types";

export default function ConversationPage() {
  const router = useRouter();
  const [setup, setSetup] = useState<Setup | null>(null);

  if (setup) {
    return <Conversation setup={setup} onExit={() => setSetup(null)} />;
  }

  return (
    <Shell>
      <ConversationSetup onStart={setSetup} onBack={() => router.push("/")} />
    </Shell>
  );
}
