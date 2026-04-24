// 2D stylized knuckle-tattoo view. Two fists face the viewer with one letter
// on each of the four top knuckles per hand. Letters are split left/right:
// Math.ceil(n/2) on the left hand, remainder on the right, filling from the
// first knuckle. Empty slots still render the knuckle shape without a letter.

const SVG_W = 400
const SVG_H = 380

const PALM_W = 130
const PALM_H = 190
const KNUCKLE_R = 17

function splitLetters(letters) {
  const upper = letters.toUpperCase().slice(0, 8)
  const mid = Math.ceil(upper.length / 2)
  return {
    /* eslint-disable security/detect-object-injection -- i is bounded 0..3, upper is a string */
    left:  [0, 1, 2, 3].map(i => upper[i]       || ''),
    right: [0, 1, 2, 3].map(i => upper[mid + i] || ''),
    /* eslint-enable security/detect-object-injection */
  }
}

// Darken a #rrggbb hex color by an amount in [0, 1]
function darken(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amount)))
  const g = Math.max(0, Math.round(((n >> 8)  & 0xff) * (1 - amount)))
  const b = Math.max(0, Math.round((n        & 0xff) * (1 - amount)))
  return `rgb(${r}, ${g}, ${b})`
}

function Hand({ letters, cx, cy, skinColor, strokeColor }) {
  const knuckleY = cy - PALM_H / 2 + 22
  const leftEdge = cx - PALM_W / 2

  return (
    <g>
      {/* Fist body */}
      <rect
        x={leftEdge} y={cy - PALM_H / 2}
        width={PALM_W} height={PALM_H}
        rx={22} ry={22}
        fill={skinColor} stroke={strokeColor} strokeWidth={2}
      />

      {/* Subtle finger separations */}
      {[1, 2, 3].map(i => {
        const lx = leftEdge + (PALM_W / 4) * i
        return (
          <line
            key={`sep-${i}`}
            x1={lx} y1={cy - PALM_H / 2 + 10}
            x2={lx} y2={cy - PALM_H / 2 + 44}
            stroke={strokeColor} strokeWidth={1.4} opacity={0.35}
          />
        )
      })}

      {/* Knuckles + letters */}
      {[0, 1, 2, 3].map(i => {
        const kx = leftEdge + (PALM_W / 4) * (i + 0.5)
        // eslint-disable-next-line security/detect-object-injection -- i is bounded 0..3, letters is a 4-entry array
        const letter = letters[i]
        return (
          <g key={`kn-${i}`}>
            <circle
              cx={kx} cy={knuckleY} r={KNUCKLE_R}
              fill={skinColor} stroke={strokeColor} strokeWidth={1.8}
            />
            {letter && (
              <text
                x={kx} y={knuckleY + 7}
                textAnchor="middle"
                fontSize={21} fontWeight={700}
                fontFamily="Georgia, 'Times New Roman', serif"
                fill="#1a1a1a"
              >
                {letter}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

export default function KnucklesView({ letters, skinColor }) {
  const { left, right } = splitLetters(letters)
  const strokeColor = darken(skinColor, 0.35)
  const cxLeft  = SVG_W / 2 - 90
  const cxRight = SVG_W / 2 + 90
  const cy = SVG_H / 2 + 10

  return (
    <svg
      width="100%" height="100%"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: '#ede8df' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <Hand letters={left}
            cx={cxLeft}  cy={cy}
            skinColor={skinColor} strokeColor={strokeColor} />
      <Hand letters={right}
            cx={cxRight} cy={cy}
            skinColor={skinColor} strokeColor={strokeColor} />
    </svg>
  )
}
