// Brand footer — a stylized 80s milk carton "have you seen me?" panel as the
// logo for Child Left Behind Software. The photo slot is intentionally an
// abstract placeholder (dashed rectangle + faded ?) so the reference lands
// without depicting an actual missing person.

function MilkCartonLogo() {
  return (
    <svg
      width="96" height="132"
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Child Left Behind Software logo — 80s milk carton"
    >
      {/* Carton silhouette: rectangular body + pentagonal gable top */}
      <path
        d="M 10 135 L 10 48 L 50 12 L 90 48 L 90 135 Z"
        fill="#faf6ec"
        stroke="#2a2520"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Horizontal line where the gable meets the body */}
      <line x1="10" y1="48" x2="90" y2="48"
            stroke="#2a2520" strokeWidth="1.3" />

      {/* Center fold line on the gable */}
      <line x1="50" y1="12" x2="50" y2="48"
            stroke="#2a2520" strokeWidth="0.9" opacity="0.45" />

      {/* Spout tab at the peak */}
      <rect x="45.5" y="10" width="9" height="5"
            fill="#faf6ec" stroke="#2a2520" strokeWidth="1.1"
            strokeLinejoin="round" />

      {/* "HAVE YOU SEEN ME?" header — classic muted red */}
      <text x="50" y="61" textAnchor="middle"
            fontSize="6.5" fontWeight="700" fill="#a05050"
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="0.5">
        HAVE YOU SEEN ME?
      </text>

      {/* Photo placeholder — dashed border, faded question mark inside */}
      <rect x="24" y="66" width="52" height="44"
            fill="none"
            stroke="#2a2520"
            strokeWidth="0.9"
            strokeDasharray="2.5 2"
            opacity="0.55" />
      <text x="50" y="97" textAnchor="middle"
            fontSize="24" fontWeight="700" fill="#2a2520"
            fontFamily="Georgia, 'Times New Roman', serif"
            opacity="0.22">
        ?
      </text>

      {/* Company wordmark across the bottom */}
      <text x="50" y="121" textAnchor="middle"
            fontSize="5.2" fontWeight="700" fill="#2a2520"
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="0.7">
        CHILD LEFT BEHIND
      </text>
      <text x="50" y="130" textAnchor="middle"
            fontSize="5.2" fontWeight="700" fill="#2a2520"
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="0.7">
        SOFTWARE
      </text>
    </svg>
  )
}

export default function BrandFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8 gap-2">
      <MilkCartonLogo />
      <div className="text-[11px] text-stone-500 tracking-widest uppercase"
           style={{ fontFamily: "'Courier New', monospace" }}>
        a child left behind software joint
      </div>
    </footer>
  )
}
