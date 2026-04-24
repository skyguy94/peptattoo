// Brand footer — stylized half-pint school-lunch milk carton in 3/4
// perspective with the "MISSING" panel as our logo face. Gable-top
// construction with the distinctive fin/seam at the peak, tall-narrow
// proportions, and a slight lean so it reads as sitting on a surface.

function MilkCartonLogo() {
  return (
    <svg
      width="128" height="160"
      viewBox="0 0 128 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Child Left Behind logo — school-lunch milk carton"
    >
      <defs>
        <filter id="photo-shadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="1.2" dy="1.4" stdDeviation="0.9"
                        floodColor="rgba(42, 37, 32, 0.35)" />
        </filter>
      </defs>

      {/* Ground shadow (stays level; doesn't rotate with the carton) */}
      <ellipse cx="58" cy="148" rx="52" ry="3.5"
               fill="rgba(42, 37, 32, 0.24)" />

      {/* The entire carton leans a few degrees left, like it's sitting on a
           cafeteria tray at an angle. Ground shadow is outside this group so
           it stays horizontal. */}
      <g transform="rotate(-4.5 58 78)">

        {/* ── Right body face — parallelogram, receding, darker (shadow side) ── */}
        <path
          d="M 62 34 L 86 22 L 86 116 L 62 120 Z"
          fill="#cfc4a8"
          stroke="#2a2520"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* ── Right roof face — slanted gable panel, mid-tone ── */}
        <path
          d="M 34 10 L 58 -2 L 86 22 L 62 34 Z"
          fill="#e3d8bd"
          stroke="#2a2520"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* ── Fin/seam at the top — the iconic gable-top "tab" where the two
             roof panels are pressed together. Thin parallelogram rising
             above the ridge line. ── */}
        <path
          d="M 34 10 L 58 -2 L 58 -8 L 34 4 Z"
          fill="#b8ac8e"
          stroke="#2a2520"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* ── Front face pentagon — carries the printed content ── */}
        <path
          d="M 6 120 L 6 34 L 34 10 L 62 34 L 62 120 Z"
          fill="#fbf7ed"
          stroke="#2a2520"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Horizontal fold line — where front gable meets front body */}
        <line x1="6" y1="34" x2="62" y2="34"
              stroke="#2a2520" strokeWidth="1.2" />

        {/* Diagonal fold creases on the front gable — hinting at folded
             paper construction (both sides of the gable triangle) */}
        <line x1="6" y1="34" x2="34" y2="10"
              stroke="#2a2520" strokeWidth="0.7" opacity="0.4" />
        <line x1="62" y1="34" x2="34" y2="10"
              stroke="#2a2520" strokeWidth="0.7" opacity="0.4" />

        {/* Subtle side-face label so it reads as a half-pint carton */}
        <text x="74" y="75"
              fontSize="2.8" fontWeight="700" fill="#4a4338"
              fontFamily="'Courier New', monospace"
              letterSpacing="0.3"
              transform="rotate(-25 74 75)"
              opacity="0.55">
          1/2 PT
        </text>

        {/* ── MISSING header — the iconic 80s milk carton headline ── */}
        <text x="34" y="50" textAnchor="middle"
              fontSize="8.5" fontWeight="900" fill="#a64545"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="1.2">
          MISSING
        </text>

        {/* ── Photo slot — drop-shadowed inset rectangle with a faded ? ── */}
        <g filter="url(#photo-shadow)">
          <rect x="11" y="57" width="46" height="50"
                fill="#ffffff"
                stroke="#2a2520"
                strokeWidth="0.9" />
        </g>
        <rect x="11" y="57" width="46" height="50"
              fill="none"
              stroke="#2a2520"
              strokeWidth="0.9"
              strokeDasharray="2 1.8"
              opacity="0.6" />
        <text x="34" y="92" textAnchor="middle"
              fontSize="28" fontWeight="700" fill="#2a2520"
              fontFamily="Georgia, 'Times New Roman', serif"
              opacity="0.22">
          ?
        </text>

        {/* Small "Have You Seen Me?" subtext beneath the photo slot */}
        <text x="34" y="115" textAnchor="middle"
              fontSize="3.4" fontWeight="700" fill="#4a4338"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="0.3">
          HAVE YOU SEEN ME?
        </text>

      </g>
    </svg>
  )
}

export default function BrandFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8 gap-1">
      <MilkCartonLogo />

      {/* Stylized wordmark — "Child Left Behind" is the brand (serif,
          emphasized), "A SOFTWARE PROJECT" is a subtitle. */}
      <div className="flex flex-col items-center gap-0.5 mt-1">
        <div
          className="text-stone-700 font-semibold"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '15px',
            letterSpacing: '0.04em',
          }}
        >
          Child Left Behind
        </div>
        <div
          className="text-stone-400"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9.5px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
          }}
        >
          a software project
        </div>
      </div>
    </footer>
  )
}
