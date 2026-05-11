import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        "bg-soft": "var(--bg-soft)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-mute": "var(--ink-mute)",
        line: "var(--line)",
        primary: "var(--primary)",
        "primary-ink": "var(--primary-ink)",
        accent: "var(--accent)",
        coral: "var(--coral)",
        "coral-deep": "var(--coral-deep)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        spanish: "var(--font-spanish)",
      },
    },
  },
  plugins: [],
};

export default config;
