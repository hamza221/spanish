import type { TtsLocale } from "./types";

/**
 * Speaks `text` using the browser's Web Speech API. Silently no-ops on
 * environments without `speechSynthesis` (e.g. SSR, tests, older browsers).
 */
export function speak(text: string, locale: TtsLocale = "es-ES"): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    // Browser TTS is best-effort. Forvo upgrade lives in the API layer.
  }
}
