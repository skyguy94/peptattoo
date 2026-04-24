import { SideChain, SvgSharedDefs } from './chemistry'

// ── Two-fist knuckle-tattoo view ─────────────────────────────────────────────
// Pose reference: both fists pressed together in front of the viewer,
// knuckles forward, fingers pointing down, thumbs tucked BEHIND the fists
// (not visible). Each knuckle carries its amino acid's side-chain structure
// in ink; letters appear as small captions, matching the main chain panel.

const SVG_W = 420
const SVG_H = 380

// ── helpers ─────────────────────────────────────────────────────────────────

function darken(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amount)))
  const g = Math.max(0, Math.round(((n >> 8)  & 0xff) * (1 - amount)))
  const b = Math.max(0, Math.round((n         & 0xff) * (1 - amount)))
  return `rgb(${r}, ${g}, ${b})`
}

function splitLetters(letters) {
  const upper = letters.toUpperCase().slice(0, 8)
  const mid = Math.ceil(upper.length / 2)
  /* eslint-disable security/detect-object-injection -- i bounded 0..3, upper is string */
  return {
    left:  [0, 1, 2, 3].map(i => upper[i]       || ''),
    right: [0, 1, 2, 3].map(i => upper[mid + i] || ''),
  }
  /* eslint-enable security/detect-object-injection */
}

// ── Hand geometry ──────────────────────────────────────────────────────────
// Drawn in the hand's local coordinates (0,0) at the top-left of its bounding
// box. cx/cy parameters then translate it into the final position. Symmetric
// so the same drawing works for both hands (thumbs are hidden in this pose).

const HAND_W = 130
const HAND_H = 200

// 4 knuckle x-positions across the top of each hand.
const KNUCKLE_CENTERS_X = [24, 54, 84, 112]
const KNUCKLE_Y_BASE = 30
const KNUCKLE_Y_OFFSETS = [4, -2, -2, 5]   // outer knuckles sit a touch lower
const KNUCKLE_R = 17

function Hand({ letters, cx, cy, skin, shadowId }) {
  const skinShade   = darken(skin, 0.08)  // used on finger/wrist segments behind
  const strokeColor = darken(skin, 0.50)

  const knuckles = KNUCKLE_CENTERS_X.map((kx, i) => ({
    cx: cx + kx,
    /* eslint-disable-next-line security/detect-object-injection -- i is 0..3 */
    cy: cy + KNUCKLE_Y_BASE + KNUCKLE_Y_OFFSETS[i],
  }))

  // Silhouette path — traces a tight fist with 4 knuckle bumps at the top,
  // straight-ish sides, and a tapered wrist at the bottom. Coords are
  // relative to (cx, cy) = top-left of the hand's bounding box.
  const px = (x) => cx + x
  const py = (y) => cy + y

  const silhouette = [
    // start: outer-top of leftmost knuckle bump
    `M ${px(10)} ${py(36)}`,
    // curve up the outer edge of the pinky
    `Q ${px(8)} ${py(22)} ${px(14)} ${py(16)}`,
    // pinky knuckle bump (1)
    `Q ${px(24)} ${py(4)}  ${px(34)} ${py(16)}`,
    `Q ${px(38)} ${py(20)} ${px(42)} ${py(22)}`,
    // ring knuckle bump (2)
    `Q ${px(44)} ${py(2)}  ${px(54)} ${py(0)}`,
    `Q ${px(64)} ${py(2)}  ${px(70)} ${py(22)}`,
    // middle knuckle bump (3) - tallest
    `Q ${px(74)} ${py(4)}  ${px(84)} ${py(0)}`,
    `Q ${px(94)} ${py(2)}  ${px(100)} ${py(22)}`,
    // index knuckle bump (4)
    `Q ${px(104)} ${py(4)} ${px(114)} ${py(16)}`,
    `Q ${px(122)} ${py(22)} ${px(122)} ${py(38)}`,
    // down the inner (index-side) edge
    `L ${px(122)} ${py(138)}`,
    // wrist taper right
    `Q ${px(120)} ${py(168)} ${px(108)} ${py(178)}`,
    `L ${px(98)} ${py(200)}`,
    // wrist bottom
    `L ${px(32)} ${py(200)}`,
    // wrist taper left
    `L ${px(22)} ${py(178)}`,
    `Q ${px(10)} ${py(168)} ${px(8)} ${py(138)}`,
    // up the outer (pinky-side) edge
    `L ${px(10)} ${py(36)}`,
    `Z`,
  ].join(' ')

  return (
    <g>
      {/* Drop-shadowed skin layer: silhouette + knuckle bumps on top */}
      <g filter={`url(#${shadowId})`}>
        <path d={silhouette} fill={skin} />

        {/* Subtle finger-segment shading (slightly darker band below knuckles) */}
        <path
          d={`M ${px(14)} ${py(38)} L ${px(118)} ${py(38)} L ${px(118)} ${py(88)} L ${px(14)} ${py(88)} Z`}
          fill={skinShade}
          opacity={0.5}
        />

        {/* Knuckle bumps — raised spheres on top of the fingers */}
        {knuckles.map((k, i) => (
          <circle
            key={`k-${i}`}
            cx={k.cx} cy={k.cy} r={KNUCKLE_R}
            fill={skin}
          />
        ))}
      </g>

      {/* ─── DETAIL LAYER (no shadow — surface markings) ─── */}

      {/* Finger separations — dark vertical grooves below the knuckles */}
      {[0, 1, 2].map(i => {
        /* eslint-disable-next-line security/detect-object-injection -- i is 0..2 */
        const x = (knuckles[i].cx + knuckles[i + 1].cx) / 2
        return (
          <line
            key={`sep-${i}`}
            x1={x} y1={py(32)}
            x2={x} y2={py(130)}
            stroke={strokeColor}
            strokeWidth={1.5}
            strokeOpacity={0.38}
          />
        )
      })}

      {/* Soft curve on top of each knuckle — suggests the bump's highlight/shadow */}
      {knuckles.map((k, i) => (
        <path
          key={`karc-${i}`}
          d={`M ${k.cx - 14} ${k.cy - 2} Q ${k.cx} ${k.cy - 16} ${k.cx + 14} ${k.cy - 2}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.3}
          strokeOpacity={0.30}
        />
      ))}

      {/* Lower knuckle crease — horizontal line below the MCP bumps where
           the fingers begin, to suggest the proximal phalanx division */}
      <path
        d={`M ${px(12)} ${py(56)} Q ${px(65)} ${py(64)} ${px(120)} ${py(56)}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.2}
        strokeOpacity={0.35}
      />

      {/* Outer silhouette stroke — subtle contour so the hand reads even on
           a matching background. Redraws the silhouette with stroke only. */}
      <path
        d={silhouette}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.6}
        strokeOpacity={0.55}
      />

      {/* ─── AMINO ACID TATTOOS ─── */}
      {knuckles.map((k, i) => {
        /* eslint-disable-next-line security/detect-object-injection -- i is 0..3 */
        const letter = letters[i]
        if (!letter) return null
        return (
          <g key={`aa-${i}`}>
            <g
              transform={`translate(${k.cx}, ${k.cy + 2}) scale(0.32)`}
              style={{ filter: 'grayscale(100%)' }}
            >
              <SideChain letter={letter} caX={0} caY={-12} />
            </g>
            <text
              x={k.cx} y={k.cy + 40}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill={strokeColor}
              fontFamily="Georgia, 'Times New Roman', serif"
              opacity={0.8}
            >
              {letter}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function KnucklesView({ letters, skinColor }) {
  const { left, right } = splitLetters(letters)

  // Two hands pressed together with a narrow center gap (~10px).
  // Each hand's bounding box origin (cx, cy) is top-left.
  const gap = 10
  const totalW = HAND_W * 2 + gap
  const leftX  = (SVG_W - totalW) / 2
  const rightX = leftX + HAND_W + gap
  const topY   = (SVG_H - HAND_H) / 2

  return (
    <svg
      width="100%" height="100%"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: '#ede8df' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <SvgSharedDefs />
      <defs>
        <filter id="hand-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4"
                        floodColor="rgba(0, 0, 0, 0.20)" />
        </filter>
      </defs>

      <Hand letters={left}
            cx={leftX}  cy={topY}
            skin={skinColor}
            shadowId="hand-shadow" />

      <Hand letters={right}
            cx={rightX} cy={topY}
            skin={skinColor}
            shadowId="hand-shadow" />
    </svg>
  )
}
