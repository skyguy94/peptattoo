// Brand footer — stylized 8oz school-lunch milk carton (half-pint) in 3/4
// perspective. Proportions match a real US half-pint: 2.25" x 2.25" x 2.75",
// so width:height ≈ 1:1.22.
//
// Face layout:
//   FRONT face  — MISSING panel (our logo's "face")
//   RIGHT face  — "MILK" brand text, skewed to sit flat on the slanted face
//   TOP         — slanted gable roof + the iconic fin/seam tab

function MilkCartonLogo() {
  // Side-face projection matrix.
  //
  // The right side face's "horizontal" axis in image space runs from front to
  // back at a slope of (dx=24, dy=-11), magnitude 26.4. Unit vector:
  //   (24/26.4, -11/26.4) = (0.909, -0.417)
  // The face's "vertical" axis in image space is just straight up/down: (0, 1).
  //
  // So text placed inside a <g transform="matrix(0.909 -0.417 0 1 tx ty)">
  // has its local +X mapped onto the face's horizontal (slanted) direction
  // while its local +Y stays image-vertical. This SHEARS the text so its
  // baseline follows the slant of the face while the letters themselves
  // remain upright — which is how real printed branding on a 3D box reads.
  // A simple <text transform="rotate()"> would tilt the letters, which
  // looks wrong.
  const sideMatrix = 'matrix(0.909 -0.417 0 1 76 44)'

  return (
    <svg
      width="120" height="101"
      viewBox="0 -8 110 93"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Child Left Behind logo — school-lunch milk carton"
    >
      <defs>
        <filter id="photo-shadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="1" dy="1.2" stdDeviation="0.8"
                        floodColor="rgba(42, 37, 32, 0.4)" />
        </filter>
      </defs>

      {/* Whole carton leans slightly — reads as sitting tilted, not floating */}
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

        {/* Fin/seam tab at the top — defining gable-top feature */}
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

        {/* Diagonal fold creases on the front gable triangle */}
        <line x1="10" y1="26" x2="37" y2="10"
              stroke="#2a2520" strokeWidth="0.6" opacity="0.4" />
        <line x1="64" y1="26" x2="37" y2="10"
              stroke="#2a2520" strokeWidth="0.6" opacity="0.4" />

        {/* ── FRONT FACE content: MISSING panel ── */}

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

        <text x="37" y="72" textAnchor="middle"
              fontSize="2.6" fontWeight="700" fill="#4a4338"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="0.25">
          HAVE YOU SEEN ME?
        </text>

        {/* ── RIGHT SIDE FACE content: MILK brand ── */}
        {/* Grouped under the side-face projection matrix so both lines sit     */}
        {/* flat on the slanted face with proper perspective, not just tilted.  */}
        <g transform={sideMatrix}>
          <text textAnchor="middle"
                fontSize="7" fontWeight="900" fill="#2a2520"
                fontFamily="Georgia, 'Times New Roman', serif"
                letterSpacing="1.2">
            MILK
          </text>
          <text y="7" textAnchor="middle"
                fontSize="2.6" fontWeight="700" fill="#4a4338"
                fontFamily="'Courier New', monospace"
                letterSpacing="0.3"
                opacity="0.7">
            1/2 PT
          </text>
        </g>

      </g>
    </svg>
  )
}

export default function BrandFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center pt-6 pb-8">
      <MilkCartonLogo />

      {/* Wordmark sits right under the carton — no gap, no ground shadow
          between them. "Child Left Behind" reads as the brand; the line
          below is its subtitle. */}
      <div className="flex flex-col items-center -mt-1">
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
          className="text-stone-400 mt-0.5"
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
