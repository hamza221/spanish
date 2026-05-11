import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null = null;

/**
 * Returns a shared Anthropic client, or `null` when no API key is configured.
 * The conversation route falls back to a scripted demo when the client is null.
 */
export function getAnthropic(): Anthropic | null {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  cached = new Anthropic({ apiKey });
  return cached;
}

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
