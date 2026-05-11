import type { Persona, Scenario } from "@/lib/types";

export const PERSONAS: Persona[] = [
  {
    id: "lucia",
    name: "Lucía",
    role: "Barista in Madrid",
    emoji: "☕",
    bgColor: "#FFE0B2",
    tags: ["Spain", "Casual", "Beginner-friendly"],
    ttsLocale: "es-ES",
  },
  {
    id: "diego",
    name: "Diego",
    role: "Street vendor in CDMX",
    emoji: "🌮",
    bgColor: "#FFCDD2",
    tags: ["Mexico", "Fast-paced", "Slang"],
    ttsLocale: "es-MX",
  },
  {
    id: "valentina",
    name: "Valentina",
    role: "Friend from Buenos Aires",
    emoji: "🧉",
    bgColor: "#E1BEE7",
    tags: ["Argentina", "Voseo", "Idioms"],
    ttsLocale: "es-AR",
  },
  {
    id: "doctor",
    name: "Dr. Ramos",
    role: "General practitioner",
    emoji: "🩺",
    bgColor: "#C8E6C9",
    tags: ["Formal", "Medical vocab"],
    ttsLocale: "es-ES",
  },
  {
    id: "abuela",
    name: "Abuela Rosa",
    role: "Grandmother from Granada",
    emoji: "👵",
    bgColor: "#FFF9C4",
    tags: ["Patient", "Stories", "A2+"],
    ttsLocale: "es-ES",
  },
  {
    id: "interviewer",
    name: "Carlos",
    role: "Job interviewer",
    emoji: "💼",
    bgColor: "#B3E5FC",
    tags: ["Formal", "Professional"],
    ttsLocale: "es-ES",
  },
];

export const SCENARIOS: Scenario[] = [
  { id: "coffee", emoji: "☕", title: "Order a coffee", sub: "Café, croissant, small talk." },
  {
    id: "directions",
    emoji: "🗺️",
    title: "Ask for directions",
    sub: "Getting to a museum across town.",
  },
  { id: "rent", emoji: "🏠", title: "View an apartment", sub: "Questions about a Madrid piso." },
  { id: "doctor", emoji: "💊", title: "Describe a symptom", sub: "Headache for three days." },
  {
    id: "smalltalk",
    emoji: "💬",
    title: "Catch up with a friend",
    sub: "Weekend plans, weather, work.",
  },
  {
    id: "complaint",
    emoji: "😤",
    title: "Return a faulty item",
    sub: "Bring back a broken kettle.",
  },
];

export const SUGGESTIONS = [
  { es: "No, gracias.", en: "no thanks" },
  { es: "Sí, un croissant también.", en: "yes, a croissant too" },
  { es: "¿De qué los tienes?", en: "what kinds do you have?" },
];

/**
 * Fallback scripted conversation used when the Anthropic API is not configured
 * or unavailable. Mirrors the design prototype.
 */
export const CONV_SCRIPT = [
  {
    from: "ai" as const,
    text: "¡Hola, buenos días! ¿Qué te pongo?",
    en: "Hi, good morning! What can I get you?",
  },
  {
    from: "ai" as const,
    text: "Claro, ¿lo quieres para tomar aquí o para llevar?",
    en: "Sure, do you want it for here or to go?",
  },
  {
    from: "ai" as const,
    text: "Son dos con veinte. ¿Algo más? Tenemos croissants recién hechos.",
    en: "That's two twenty. Anything else? We have fresh croissants.",
  },
  {
    from: "ai" as const,
    text: "¡Perfecto! Ahora mismo te lo preparo. Que tengas un buen día.",
    en: "Perfect! I'll get it ready right now. Have a good day.",
  },
];
