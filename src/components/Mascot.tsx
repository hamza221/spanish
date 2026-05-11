type Mood = "happy" | "thinking" | "wave" | "sleep";

interface MascotProps {
  size?: number;
  mood?: Mood;
  style?: React.CSSProperties;
}

/**
 * Lumi the axolotl — the app mascot. Pure SVG, no external assets.
 * Four moods: happy (default), thinking, wave, sleep.
 */
export function Mascot({ size = 120, mood = "happy", style }: MascotProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      style={style}
      aria-label="Lumi the axolotl"
    >
      <defs>
        <radialGradient id="lumi-body" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#FFC8D7" />
          <stop offset="100%" stopColor="#FF8FAB" />
        </radialGradient>
        <radialGradient id="lumi-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FF6B8E" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF6B8E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(28, 56)">
        <ellipse cx="0" cy="0" rx="10" ry="14" fill="#FFB6C8" transform="rotate(-30)" />
        <ellipse cx="-4" cy="14" rx="10" ry="14" fill="#FFB6C8" transform="rotate(-10)" />
        <ellipse cx="2" cy="28" rx="10" ry="14" fill="#FFB6C8" transform="rotate(15)" />
      </g>
      <g transform="translate(132, 56)">
        <ellipse cx="0" cy="0" rx="10" ry="14" fill="#FFB6C8" transform="rotate(30)" />
        <ellipse cx="4" cy="14" rx="10" ry="14" fill="#FFB6C8" transform="rotate(10)" />
        <ellipse cx="-2" cy="28" rx="10" ry="14" fill="#FFB6C8" transform="rotate(-15)" />
      </g>

      <ellipse cx="80" cy="92" rx="50" ry="44" fill="url(#lumi-body)" />
      <ellipse cx="80" cy="108" rx="34" ry="20" fill="#FFE2EB" opacity="0.7" />
      <ellipse cx="48" cy="100" rx="10" ry="6" fill="url(#lumi-cheek)" />
      <ellipse cx="112" cy="100" rx="10" ry="6" fill="url(#lumi-cheek)" />

      {mood === "sleep" ? (
        <>
          <path
            d="M58 84 Q66 90 74 84"
            stroke="#1A2238"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M86 84 Q94 90 102 84"
            stroke="#1A2238"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <ellipse cx="66" cy="86" rx="5" ry="6" fill="#1A2238" />
          <ellipse cx="94" cy="86" rx="5" ry="6" fill="#1A2238" />
          <circle cx="67.5" cy="84" r="1.6" fill="#fff" />
          <circle cx="95.5" cy="84" r="1.6" fill="#fff" />
        </>
      )}

      {mood === "thinking" ? (
        <ellipse cx="80" cy="104" rx="3" ry="2.5" fill="#C44766" />
      ) : (
        <path
          d="M72 102 Q80 110 88 102"
          stroke="#C44766"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}

      <path
        d="M70 50 Q80 38 90 50"
        stroke="#E66888"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {mood === "wave" && (
        <g transform="translate(128, 86) rotate(-20)">
          <ellipse cx="0" cy="0" rx="9" ry="7" fill="url(#lumi-body)" />
          <circle cx="-4" cy="-2" r="1.5" fill="#C44766" />
          <circle cx="2" cy="-3" r="1.5" fill="#C44766" />
          <circle cx="4" cy="2" r="1.5" fill="#C44766" />
        </g>
      )}
    </svg>
  );
}
