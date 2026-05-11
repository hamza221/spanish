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

export type CorrectionCategory = "grammar" | "vocabulary" | "style" | "spelling";

export interface WritingAnnotation {
  /** Substring of the original text that should be replaced. */
  original: string;
  /** Suggested replacement. Empty string means "delete". */
  corrected: string;
  /** Plain-language explanation of why the change is suggested. */
  explanation: string;
  /** Short label of the rule or category, e.g. "ser vs. estar". */
  rule: string;
  category: CorrectionCategory;
}

export type WritingMode = "beginner" | "advanced";

export interface WritingReview {
  annotations: WritingAnnotation[];
  /** Full corrected version of the text, for the side-by-side view. */
  corrected: string;
  /** One-paragraph high-level feedback. */
  summary: string;
}
