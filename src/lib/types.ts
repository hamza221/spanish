export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type CardStatus = "new" | "learning" | "known" | "ignored";

export interface Flashcard {
  id: number;
  es: string;
  pos: string;
  en: string;
  level: CefrLevel;
  sentence: string;
  sentenceEn: string;
  frequencyRank?: number;
  // SM-2 fields
  ease?: number;
  interval?: number;
  due?: string;
  status?: CardStatus;
}

export type TtsLocale = "es-ES" | "es-MX" | "es-AR";

export interface Persona {
  id: string;
  name: string;
  role: string;
  emoji: string;
  bgColor: string;
  tags: string[];
  ttsLocale: TtsLocale;
}

export interface Scenario {
  id: string;
  emoji: string;
  title: string;
  sub: string;
}

export interface CoachNote {
  label: string;
  html: string;
}

export interface ChatMessage {
  from: "ai" | "user";
  text: string;
  en?: string;
  coach?: CoachNote;
}

export interface ConversationSetup {
  persona: Persona;
  scenario: Scenario;
  difficulty: "A2" | "B1" | "B2";
}

export interface SessionResult {
  known: number;
  learning: number;
  total: number;
}
