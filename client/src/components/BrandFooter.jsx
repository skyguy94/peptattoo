// Brand footer — stylized 8oz school-lunch milk carton (half-pint) in 3/4
// perspective. Proportions match a real US half-pint: 2.25"×2.25"×2.75",
// so width:height ≈ 1:1.22. Previous versions were too tall and read more
// like a juice box.
//
// Face layout:
//   FRONT face  — MISSING panel (our logo's "face")
//   RIGHT face  — "MILK" brand text, rotated to match the perspective
//   TOP         — slanted gable roof + the iconic fin/seam tab

function MilkCartonLogo() {
  // Depth projection offsets (how far the back of the carton sits relative
  // to the front): dx right, dy up. Chosen to give a clear 3/4 read without
  // exaggerating proportions.
  //
  // Using these coordinate blocks for readability:
  //   front gable peak  (37, 10)
  //   front gable base  (10, 26) – (64, 26)    width = 54
  //   front body bottom (10, 76) – (64, 76)    body height = 50, gable = 16
  //                                            total height = 66  (54:66 = 1:1.22)
  //   back peak         (61, -1)  (+24, -11 offset)
  //   back top          (34, 15) – (88, 15)
  //   back bottom       (88, 65)

  return (
    <svg
      width="120" height="115"
      viewBox="0 0 110 105"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Child Left Behind logo — school-lunch milk carton"
    >
      <defs>
        <filter id="photo-shadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="1" dy="1.2" stdDeviation="0.8"
                        floodColor="rgba(42, 37, 32, 0.4)" />
        </filter>
      </defs>

      {/* Ground shadow (outside the rotation group so it stays level) */}
      <ellipse cx="48" cy="86" rx="48" ry="3"
               fill="rgba(42, 37, 32, 0.25)" />

      {/* Whole carton leans slightly — reads as sitting on a cafeteria tray */}
      <g transform="rotate(-4 52 44)">

        {/* Right body face — parallelogram, shadow side */}
        <path
          d="M 64 26 L 88 15 L 88 65 L 64 76 Z"
          fill="#cec3a7"
          stroke="#2a2520"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* Right roof face — slanted gable */}
        <path
          d="M 37 10 L 61 -1 L 88 15 L 64 26 Z"
          fill="#e1d6ba"
          stroke="#2a2520"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* Fin/seam tab at the top — the defining gable-top feature */}
        <path
          d="M 37 10 L 61 -1 L 61 -5 L 37 6 Z"
          fill="#b6ab8c"
          stroke="#2a2520"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Front face pentagon — carries the MISSING panel */}
        <path
          d="M 10 76 L 10 26 L 37 10 L 64 26 L 64 76 Z"
          fill="#fbf7ed"
          stroke="#2a2520"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Horizontal fold line: front gable base */}
        <line x1="10" y1="26" x2="64" y2="26"
              stroke="#2a2520" strokeWidth="1.1" />

        {/* Diagonal fold creases on the front gable (each side of the triangle) */}
        <line x1="10" y1="26" x2="37" y2="10"
              stroke="#2a2520" strokeWidth="0.6" opacity="0.4" />
        <line x1="64" y1="26" x2="37" y2="10"
              stroke="#2a2520" strokeWidth="0.6" opacity="0.4" />

        {/* ── FRONT FACE content: the MISSING panel ── */}

        {/* MISSING headline */}
        <text x="37" y="37" textAnchor="middle"
              fontSize="7.5" fontWeight="900" fill="#a64545"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="1.2">
          MISSING
        </text>

        {/* Photo slot with drop shadow */}
        <g filter="url(#photo-shadow)">
          <rect x="14" y="42" width="46" height="25"
                fill="#ffffff"
                stroke="#2a2520"
                strokeWidth="0.8" />
        </g>
        <rect x="14" y="42" width="46" height="25"
              fill="none"
              stroke="#2a2520"
              strokeWidth="0.8"
              strokeDasharray="1.8 1.6"
              opacity="0.55" />
        <text x="37" y="60" textAnchor="middle"
              fontSize="16" fontWeight="700" fill="#2a2520"
              fontFamily="Georgia, 'Times New Roman', serif"
              opacity="0.22">
          ?
        </text>

        {/* Small subtext below photo */}
        <text x="37" y="72" textAnchor="middle"
              fontSize="2.6" fontWeight="700" fill="#4a4338"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="0.25">
          HAVE YOU SEEN ME?
        </text>

        {/* ── RIGHT SIDE FACE content: MILK brand ── */}
        {/* Rotated to match the perspective of the side face.              */}
        {/* Side-face "horizontal" axis goes from (64,51) front to (88,40)  */}
        {/* back — angle atan2(-11,24) ≈ -24.6° from image horizontal.       */}
        <text
          x="76" y="44"
          textAnchor="middle"
          fontSize="8" fontWeight="900" fill="#2a2520"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="1.5"
          transform="rotate(-24.6 76 44)"
        >
          MILK
        </text>

        {/* Tiny 1/2 PT label beneath MILK on the side, matching rotation */}
        <text
          x="77" y="52"
          textAnchor="middle"
          fontSize="2.6" fontWeight="700" fill="#4a4338"
          fontFamily="'Courier New', monospace"
          letterSpacing="0.3"
          transform="rotate(-24.6 77 52)"
          opacity="0.7"
        >
          1/2 PT
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
          emphasized), "A SOFTWARE PROJECT" sits below as subtitle. */}
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
