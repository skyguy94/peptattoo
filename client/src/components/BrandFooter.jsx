// Brand footer — stylized 80s milk carton in 3/4 perspective with the
// "HAVE YOU SEEN ME?" header and an abstract placeholder in the photo slot.
// The wordmark is NOT on the carton itself; it lives in the tagline below.

function MilkCartonLogo() {
  return (
    <svg
      width="118" height="140"
      viewBox="0 0 118 140"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Child Left Behind logo — 80s milk carton"
    >
      {/* Ground shadow for depth */}
      <ellipse cx="52" cy="126" rx="48" ry="3"
               fill="rgba(42, 37, 32, 0.22)" />

      {/* Right body face (shadow side, darker) */}
      <path
        d="M 78 36 L 100 29 L 100 113 L 78 120 Z"
        fill="#d9cfb5"
        stroke="#2a2520"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Right roof face (slanted gable, mid-tone) */}
      <path
        d="M 43 10 L 65 3 L 100 29 L 78 36 Z"
        fill="#e8dec6"
        stroke="#2a2520"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Front face (lightest, carries the printed content) */}
      <path
        d="M 8 120 L 8 36 L 43 10 L 78 36 L 78 120 Z"
        fill="#faf6ec"
        stroke="#2a2520"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Horizontal fold line where the front gable meets the body */}
      <line x1="8" y1="36" x2="78" y2="36"
            stroke="#2a2520" strokeWidth="1.3" />

      {/* Top ridge line — from front peak back to back peak */}
      <line x1="43" y1="10" x2="65" y2="3"
            stroke="#2a2520" strokeWidth="1.1" opacity="0.55" />

      {/* "HAVE YOU SEEN ME?" header — smaller font, no letter-spacing, so
           it fits the narrower front face in 3/4 view */}
      <text x="43" y="49" textAnchor="middle"
            fontSize="5" fontWeight="700" fill="#a05050"
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="0.15">
        HAVE YOU SEEN ME?
      </text>

      {/* Photo slot — dashed placeholder. Now occupies the whole lower
           front face since the wordmark has moved to the tagline. */}
      <rect x="16" y="55" width="54" height="58"
            fill="none"
            stroke="#2a2520"
            strokeWidth="0.9"
            strokeDasharray="2.5 2"
            opacity="0.55" />
      <text x="43" y="94" textAnchor="middle"
            fontSize="30" fontWeight="700" fill="#2a2520"
            fontFamily="Georgia, 'Times New Roman', serif"
            opacity="0.22">
        ?
      </text>
    </svg>
  )
}

export default function BrandFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8 gap-1">
      <MilkCartonLogo />

      {/* Wordmark — "Child Left Behind" reads as the brand (serif,
          slightly larger, darker ink) and "a software project" sits
          underneath as a subtitle (mono caps, muted) */}
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
