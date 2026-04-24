import { SideChain, SvgSharedDefs } from './chemistry'

// ── Two-fist knuckle-tattoo view ─────────────────────────────────────────────
// Each knuckle displays the AMINO ACID structure (not just the letter) since
// that's the whole premise of the app. Letters appear as small captions
// beneath each knuckle to tie back to the main chain's visual language.
//
// Anatomy: subject is facing the viewer with fists raised, knuckles forward,
// fingers pointing down. Subject's right hand is on viewer's LEFT with its
// thumb on the OUTER (far-left) side; subject's left hand mirrors on the
// viewer's right. This is the classic "knuckle tattoo" display pose.

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
  /* eslint-disable security/detect-object-injection -- i is bounded 0..3, upper is a string */
  return {
    left:  [0, 1, 2, 3].map(i => upper[i]       || ''),
    right: [0, 1, 2, 3].map(i => upper[mid + i] || ''),
  }
  /* eslint-enable security/detect-object-injection */
}

// Symmetric knuckle layout. Slight dip on outer knuckles (pinky & index
// positions) matches how a real fist reads from straight on.
const KNUCKLE_R = 19
const KNUCKLE_Y_OFFSETS = [3, -1, -1, 3]

// ── Hand component ─────────────────────────────────────────────────────────
// `flip` = -1 for viewer's-left hand (subject's right, thumb on far left)
//          +1 for viewer's-right hand (subject's left, thumb on far right)
function Hand({ letters, cx, cy, skin, flip, shadowId }) {
  const skinShade   = darken(skin, 0.10)
  const strokeColor = darken(skin, 0.45)

  const knuckleYBase = cy - 88
  const knuckleXs = [0, 1, 2, 3].map(i => cx - 51 + i * 34)

  return (
    <g>
      {/* ─── SKIN (drop-shadowed so the hand reads as a volumetric object) ─── */}
      <g filter={`url(#${shadowId})`}>
        {/* Wrist — behind the palm */}
        <rect
          x={cx - 34} y={cy + 76}
          width={68} height={42} rx={10}
          fill={skinShade}
        />

        {/* Thumb — behind the palm, on the OUTER side */}
        <ellipse
          cx={cx + flip * 52} cy={cy - 10}
          rx={22} ry={42}
          fill={skinShade}
        />

        {/* Palm — main body */}
        <ellipse
          cx={cx} cy={cy + 8}
          rx={58} ry={92}
          fill={skin}
        />

        {/* 4 knuckle bumps at the top of the fist */}
        {knuckleXs.map((kx, i) => (
          <circle
            key={`kn-${i}`}
            cx={kx}
            /* eslint-disable-next-line security/detect-object-injection -- i is 0..3 */
            cy={knuckleYBase + KNUCKLE_Y_OFFSETS[i]}
            r={KNUCKLE_R}
            fill={skin}
          />
        ))}
      </g>

      {/* ─── DETAIL LINES (no shadow — they're surface markings) ─── */}
      {/* Finger separations */}
      {[0, 1, 2].map(i => {
        /* eslint-disable-next-line security/detect-object-injection -- i is 0..2 */
        const x = (knuckleXs[i] + knuckleXs[i + 1]) / 2
        return (
          <line
            key={`sep-${i}`}
            x1={x} y1={knuckleYBase + 8}
            x2={x} y2={knuckleYBase + 48}
            stroke={strokeColor}
            strokeWidth={1.5}
            strokeOpacity={0.38}
          />
        )
      })}

      {/* Soft arc on top of each knuckle to suggest the bump's curvature */}
      {knuckleXs.map((kx, i) => {
        /* eslint-disable-next-line security/detect-object-injection -- i is 0..3 */
        const ky = knuckleYBase + KNUCKLE_Y_OFFSETS[i]
        return (
          <path
            key={`karc-${i}`}
            d={`M ${kx - 15} ${ky - 3} Q ${kx} ${ky - 18} ${kx + 15} ${ky - 3}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1.3}
            strokeOpacity={0.30}
          />
        )
      })}

      {/* Thumb-palm boundary curve */}
      <path
        d={`M ${cx + flip * 28} ${cy - 38}
            Q ${cx + flip * 38} ${cy - 5}
              ${cx + flip * 30} ${cy + 35}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.4}
        strokeOpacity={0.4}
      />

      {/* Thumbnail */}
      <path
        d={`M ${cx + flip * 58} ${cy - 36}
            Q ${cx + flip * 64} ${cy - 30}
              ${cx + flip * 60} ${cy - 22}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.2}
        strokeOpacity={0.5}
      />

      {/* Wrist side-tapers (subtle vertical shading) */}
      <line x1={cx - 26} y1={cy + 85} x2={cx - 26} y2={cy + 112}
            stroke={strokeColor} strokeWidth={1.2} strokeOpacity={0.3} />
      <line x1={cx + 26} y1={cy + 85} x2={cx + 26} y2={cy + 112}
            stroke={strokeColor} strokeWidth={1.2} strokeOpacity={0.3} />

      {/* ─── AMINO ACID TATTOOS on each knuckle ─── */}
      {/* Each knuckle gets its residue's side-chain structure rendered as    */}
      {/* monochrome ink on skin. Letter caption beneath matches the main     */}
      {/* chain panel's labeling style.                                        */}
      {knuckleXs.map((kx, i) => {
        /* eslint-disable-next-line security/detect-object-injection -- i is 0..3 */
        const letter = letters[i]
        if (!letter) return null
        /* eslint-disable-next-line security/detect-object-injection -- i is 0..3 */
        const ky = knuckleYBase + KNUCKLE_Y_OFFSETS[i]
        return (
          <g key={`aa-${i}`}>
            <g
              transform={`translate(${kx}, ${ky + 2}) scale(0.32)`}
              style={{ filter: 'grayscale(100%)' }}
            >
              <SideChain letter={letter} caX={0} caY={-12} />
            </g>
            <text
              x={kx} y={ky + 40}
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
  const cxLeft  = SVG_W / 2 - 102
  const cxRight = SVG_W / 2 + 102
  const cy = SVG_H / 2 + 10

  return (
    <svg
      width="100%" height="100%"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: '#ede8df' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Shared chemistry gradients/filters used by the Atom rendering */}
      <SvgSharedDefs />

      <defs>
        <filter id="hand-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4"
                        floodColor="rgba(0, 0, 0, 0.18)" />
        </filter>
      </defs>

      {/* Subject's right hand — viewer's left, thumb on outer (far) left */}
      <Hand letters={left}
            cx={cxLeft}  cy={cy}
            skin={skinColor} flip={-1}
            shadowId="hand-shadow" />

      {/* Subject's left hand — viewer's right, thumb on outer (far) right */}
      <Hand letters={right}
            cx={cxRight} cy={cy}
            skin={skinColor} flip={1}
            shadowId="hand-shadow" />
    </svg>
  )
}
