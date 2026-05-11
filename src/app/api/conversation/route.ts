import { NextResponse } from "next/server";
import { MODEL, getAnthropic } from "@/lib/anthropic";
import { CONV_SCRIPT, PERSONAS, SCENARIOS } from "@/data/personas";
import type { ChatMessage, CoachNote, Persona, Scenario } from "@/lib/types";

export const runtime = "nodejs";

interface RequestBody {
  personaId: string;
  scenarioId: string;
  difficulty: "A2" | "B1" | "B2";
  messages: ChatMessage[];
}

interface ParsedReply {
  text: string;
  en?: string;
  coach?: CoachNote;
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const persona = PERSONAS.find((p) => p.id === body.personaId);
  const scenario = SCENARIOS.find((s) => s.id === body.scenarioId);
  if (!persona || !scenario) {
    return NextResponse.json({ error: "Unknown persona or scenario" }, { status: 400 });
  }

  const client = getAnthropic();
  if (!client) {
    // No API key — fall back to the scripted demo from the design prototype.
    const reply = scriptedReply(body.messages);
    return NextResponse.json({ reply });
  }

  try {
    const reply = await generateReply(client, persona, scenario, body.difficulty, body.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Anthropic call failed, falling back to script", err);
    return NextResponse.json({ reply: scriptedReply(body.messages) });
  }
}

function scriptedReply(history: ChatMessage[]): ChatMessage {
  const aiSoFar = history.filter((m) => m.from === "ai").length;
  const next = CONV_SCRIPT[Math.min(aiSoFar, CONV_SCRIPT.length - 1)];
  return { from: "ai", text: next.text, en: next.en };
}

async function generateReply(
  client: import("@anthropic-ai/sdk").default,
  persona: Persona,
  scenario: Scenario,
  difficulty: RequestBody["difficulty"],
  history: ChatMessage[],
): Promise<ChatMessage> {
  const system = buildSystemPrompt(persona, scenario, difficulty);

  const apiMessages = history.map((m) => ({
    role: m.from === "ai" ? ("assistant" as const) : ("user" as const),
    content: m.text,
  }));

  // If this is the opening, prime the assistant with an empty user turn so the
  // SDK accepts the request (Claude requires alternating user/assistant turns
  // starting with user).
  if (apiMessages.length === 0) {
    apiMessages.push({ role: "user", content: "(start the conversation in character)" });
  }

  const result = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system,
    messages: apiMessages,
  });

  const text = result.content
    .filter((block): block is { type: "text"; text: string } => block.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const parsed = parseReply(text);

  let coach: CoachNote | undefined;
  const lastUser = [...history].reverse().find((m) => m.from === "user");
  if (lastUser) {
    coach = await coachPass(client, persona, scenario, difficulty, lastUser.text);
  }

  return { from: "ai", text: parsed.text, en: parsed.en, coach };
}

function buildSystemPrompt(
  persona: Persona,
  scenario: Scenario,
  difficulty: RequestBody["difficulty"],
): string {
  return [
    `You are ${persona.name}, ${persona.role}. Stay fully in character — never break role or mention being an AI.`,
    `Scenario: ${scenario.title}. ${scenario.sub}`,
    `Speak Spanish appropriate for a CEFR ${difficulty} learner: short sentences, common vocabulary, natural register.`,
    `Tags: ${persona.tags.join(", ")}.`,
    "",
    "Respond using this exact format and nothing else:",
    "ES: <one Spanish reply, 1–3 sentences>",
    "EN: <faithful English translation>",
    "",
    "Do not include any other commentary, stage directions, or coaching.",
  ].join("\n");
}

function parseReply(raw: string): ParsedReply {
  const es = raw.match(/^ES:\s*(.+)$/im)?.[1]?.trim();
  const en = raw.match(/^EN:\s*(.+)$/im)?.[1]?.trim();
  if (es) return { text: es, en };
  // Fallback: treat the whole response as Spanish if the model ignored the format.
  return { text: raw, en: undefined };
}

async function coachPass(
  client: import("@anthropic-ai/sdk").default,
  persona: Persona,
  scenario: Scenario,
  difficulty: RequestBody["difficulty"],
  userText: string,
): Promise<CoachNote | undefined> {
  const system = [
    "You are a Spanish language coach. Evaluate a single learner sentence.",
    `Learner level: CEFR ${difficulty}.`,
    `Context: ${scenario.title} with ${persona.name} (${persona.role}).`,
    "",
    "Respond with valid JSON only, no prose or markdown fences, in this exact shape:",
    `{"ok": true} when the sentence is natural and correct, OR`,
    `{"ok": false, "label": "<short praise + summary, e.g. 'Nice — minor polish'>", "html": "<one-sentence explanation that may use <ins> for the corrected text and <s> for what to drop>"}`,
    "",
    "Be encouraging. Only flag genuine grammar, vocabulary, or naturalness issues.",
  ].join("\n");

  const result = await client.messages.create({
    model: MODEL,
    max_tokens: 250,
    system,
    messages: [{ role: "user", content: userText }],
  });

  const raw = result.content
    .filter((b): b is { type: "text"; text: string } => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  try {
    const json = JSON.parse(raw) as { ok: boolean; label?: string; html?: string };
    if (json.ok || !json.label || !json.html) return undefined;
    return { label: json.label, html: json.html };
  } catch {
    return undefined;
  }
}
