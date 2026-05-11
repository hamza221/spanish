import type { Flashcard } from "@/lib/types";

/**
 * Seed deck. In production this will be replaced by the Hermit Dave frequency
 * list enriched with Wiktionary definitions and Tatoeba example sentences.
 * See PLAN.md → Phase 1 for the full pipeline.
 */
export const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    es: "aprovechar",
    pos: "verb",
    en: "to take advantage of",
    level: "B1",
    sentence: "Quiero aprovechar el buen tiempo para salir.",
    sentenceEn: "I want to take advantage of the good weather to go out.",
    frequencyRank: 942,
  },
  {
    id: 2,
    es: "madrugada",
    pos: "noun · feminine",
    en: "early morning, dawn",
    level: "B1",
    sentence: "Volvimos a casa de madrugada.",
    sentenceEn: "We came back home at dawn.",
    frequencyRank: 1284,
  },
  {
    id: 3,
    es: "soler",
    pos: "verb",
    en: "to usually (do something)",
    level: "A2",
    sentence: "Suelo desayunar café con tostadas.",
    sentenceEn: "I usually have coffee and toast for breakfast.",
    frequencyRank: 626,
  },
  {
    id: 4,
    es: "ajeno",
    pos: "adjective",
    en: "belonging to someone else, foreign",
    level: "B2",
    sentence: "No te metas en asuntos ajenos.",
    sentenceEn: "Don't meddle in other people's business.",
    frequencyRank: 1820,
  },
  {
    id: 5,
    es: "tardar",
    pos: "verb",
    en: "to take time, to delay",
    level: "A2",
    sentence: "¿Cuánto tardas en llegar al trabajo?",
    sentenceEn: "How long does it take you to get to work?",
    frequencyRank: 520,
  },
  {
    id: 6,
    es: "sobremesa",
    pos: "noun · feminine",
    en: "after-meal conversation",
    level: "B2",
    sentence: "Pasamos dos horas de sobremesa.",
    sentenceEn: "We spent two hours chatting after the meal.",
    frequencyRank: 1402,
  },
  {
    id: 7,
    es: "imprescindible",
    pos: "adjective",
    en: "essential, indispensable",
    level: "B2",
    sentence: "Es imprescindible llegar a tiempo.",
    sentenceEn: "It's essential to arrive on time.",
    frequencyRank: 1965,
  },
  {
    id: 8,
    es: "echar de menos",
    pos: "expression",
    en: "to miss (someone or something)",
    level: "B1",
    sentence: "Echo de menos a mi familia.",
    sentenceEn: "I miss my family.",
    frequencyRank: 1110,
  },
];
