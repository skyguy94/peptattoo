// Shared molecular drawing primitives used by AminoAcidNode and ConnectedChain.
import { INK, STICK, THIN } from './chem-tokens'

const ATOM_R    = { N: 6, O: 6, S: 6, Se: 6, Ca: 5, C: 4 }
const ATOM_FILL = { N: '#4a7fa8', O: '#b05c5c', S: '#a8892a', Se: '#9e5c88', Ca: '#e5e7eb', C: '#d1d5db' }

// SVG <defs> shared across the whole PeptideChain SVG.
// Must be rendered once inside the <svg> root before any child components.
export function SvgSharedDefs() {
  return (
    <defs>
      {/* Tile card drop shadow */}
      <filter id="tile-drop" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.11" />
      </filter>
    </defs>
  )
}

export function Atom({ x, y, type, r }) {
  // eslint-disable-next-line security/detect-object-injection -- type is always a known atom key (N/O/S/Se/Ca/C)
  const radius = r ?? ATOM_R[type]
  // eslint-disable-next-line security/detect-object-injection
  const fill   = ATOM_FILL[type]
  // Specular highlight: small bright circle at upper-left gives sphere illusion
  const hlR = Math.max(radius * 0.32, 1.4)
  const hlX = x - radius * 0.26
  const hlY = y - radius * 0.28
  return (
    <>
      <circle cx={x} cy={y} r={radius}
        fill={fill} stroke={INK}
        strokeWidth={type === 'Ca' ? 1.5 : 1} />
      <circle cx={hlX} cy={hlY} r={hlR}
        fill="rgba(255,255,255,0.52)" stroke="none" />
    </>
  )
}

// ── Ring helpers ─────────────────────────────────────────────────────────────

function pts(n, cx, cy, r, offsetDeg) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i * (360 / n) + offsetDeg) * Math.PI / 180
    return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)]
  })
}
function polyPath(p) {
  return p.map((v, i) => `${i === 0 ? 'M' : 'L'}${v[0]},${v[1]}`).join(' ') + 'Z'
}

export function BenzeneRing({ cx, cy, r = 12 }) {
  const outer = pts(6, cx, cy, r, -90)
  const inner = pts(6, cx, cy, r * 0.6, -90)
  return (
    <g>
      <path d={polyPath(outer)} {...STICK} />
      {[0, 2, 4].map(i => {
        const [x1, y1] = inner[i]        // eslint-disable-line security/detect-object-injection
        const [x2, y2] = inner[(i+1)%6]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...THIN} />
      })}
    </g>
  )
}

export function ImidazoleRing({ cx, cy, r = 10 }) {
  const p = pts(5, cx, cy, r, -90)
  return (
    <g>
      <path d={polyPath(p)} {...STICK} />
      <Atom x={p[0][0]} y={p[0][1]} type="N" r={5} />
      <Atom x={p[2][0]} y={p[2][1]} type="N" r={5} />
    </g>
  )
}

export function IndoleRing({ cx, cy }) {
  const hex = pts(6, cx - 7, cy, 11, -90)
  const pen = pts(5, cx + 9, cy,  9, -90)
  return (
    <g>
      <path d={polyPath(hex)} {...STICK} />
      <path d={polyPath(pen)} {...STICK} />
      <Atom x={pen[0][0]} y={pen[0][1]} type="N" r={5} />
    </g>
  )
}

// ── Side chains ───────────────────────────────────────────────────────────────
// caX / caY: position just below Cα (backbone y + a small offset)

export function SideChain({ letter, caX, caY }) {
  const b1 = caY + 18
  const b2 = caY + 34
  const b3 = caY + 50
  const b4 = caY + 66

  switch (letter) {
    case 'G':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={caY + 10} {...THIN} />
          <text x={caX} y={caY + 20} textAnchor="middle"
                fill={INK} fontSize={10} fontFamily="monospace">H</text>
        </g>
      )
    case 'A':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="C" />
        </g>
      )
    case 'V':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX-12} y2={b2} {...STICK} />
          <line x1={caX} y1={b1} x2={caX+12} y2={b2} {...STICK} />
          <Atom x={caX-12} y={b2} type="C" />
          <Atom x={caX+12} y={b2} type="C" />
        </g>
      )
    case 'L':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="C" />
          <line x1={caX} y1={b2} x2={caX-11} y2={b3} {...STICK} />
          <line x1={caX} y1={b2} x2={caX+11} y2={b3} {...STICK} />
          <Atom x={caX-11} y={b3} type="C" />
          <Atom x={caX+11} y={b3} type="C" />
        </g>
      )
    case 'I':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX-12} y2={b2} {...STICK} />
          <Atom x={caX-12} y={b2} type="C" />
          <line x1={caX} y1={b1} x2={caX+10} y2={b2} {...STICK} />
          <Atom x={caX+10} y={b2} type="C" />
          <line x1={caX+10} y1={b2} x2={caX+10} y2={b3} {...STICK} />
          <Atom x={caX+10} y={b3} type="C" />
        </g>
      )
    case 'P':
      return (
        <path d={`M${caX},${caY} C${caX-18},${caY+22} ${caX-24},${caY-12} ${caX-28},${caY-4}`}
              {...STICK} />
      )
    case 'S':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="O" />
        </g>
      )
    case 'T':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX-12} y2={b2} {...STICK} />
          <Atom x={caX-12} y={b2} type="O" />
          <line x1={caX} y1={b1} x2={caX+11} y2={b2} {...STICK} />
          <Atom x={caX+11} y={b2} type="C" />
        </g>
      )
    case 'C':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="S" />
        </g>
      )
    case 'M':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="S" />
          <line x1={caX} y1={b2} x2={caX+11} y2={b3} {...STICK} />
          <Atom x={caX+11} y={b3} type="C" />
        </g>
      )
    case 'D':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX-11} y2={b2} {...STICK} />
          <line x1={caX-3} y1={b1+3} x2={caX-13} y2={b2-3} {...THIN} />
          <Atom x={caX-11} y={b2} type="O" />
          <line x1={caX} y1={b1} x2={caX+11} y2={b2} {...STICK} />
          <Atom x={caX+11} y={b2} type="O" />
        </g>
      )
    case 'E':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="C" />
          <line x1={caX} y1={b2} x2={caX-10} y2={b3} {...STICK} />
          <line x1={caX-2} y1={b2+3} x2={caX-12} y2={b3-3} {...THIN} />
          <Atom x={caX-10} y={b3} type="O" />
          <line x1={caX} y1={b2} x2={caX+10} y2={b3} {...STICK} />
          <Atom x={caX+10} y={b3} type="O" />
        </g>
      )
    case 'N':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX-11} y2={b2} {...STICK} />
          <line x1={caX-3} y1={b1+3} x2={caX-13} y2={b2-3} {...THIN} />
          <Atom x={caX-11} y={b2} type="O" />
          <line x1={caX} y1={b1} x2={caX+11} y2={b2} {...STICK} />
          <Atom x={caX+11} y={b2} type="N" />
        </g>
      )
    case 'Q':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="C" />
          <line x1={caX} y1={b2} x2={caX-10} y2={b3} {...STICK} />
          <line x1={caX-2} y1={b2+3} x2={caX-12} y2={b3-3} {...THIN} />
          <Atom x={caX-10} y={b3} type="O" />
          <line x1={caX} y1={b2} x2={caX+10} y2={b3} {...STICK} />
          <Atom x={caX+10} y={b3} type="N" />
        </g>
      )
    case 'K':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b4} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <Atom x={caX} y={b2} type="C" />
          <Atom x={caX} y={b3} type="C" />
          <Atom x={caX} y={b4} type="N" />
        </g>
      )
    case 'R':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <Atom x={caX} y={b2} type="C" />
          <line x1={caX} y1={b2} x2={caX} y2={b3} {...STICK} />
          <Atom x={caX} y={b3} type="N" />
          <line x1={caX} y1={b3} x2={caX-10} y2={b4} {...STICK} />
          <line x1={caX} y1={b3} x2={caX+10} y2={b4} {...STICK} />
          <Atom x={caX-10} y={b4} type="N" />
          <Atom x={caX+10} y={b4} type="N" />
        </g>
      )
    case 'H':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2-4} {...STICK} />
          <ImidazoleRing cx={caX} cy={b2+8} r={10} />
        </g>
      )
    case 'F':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2-2} {...STICK} />
          <BenzeneRing cx={caX} cy={b2+10} r={12} />
        </g>
      )
    case 'Y':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2-2} {...STICK} />
          <BenzeneRing cx={caX} cy={b2+10} r={12} />
          <line x1={caX} y1={b2+22} x2={caX} y2={b2+28} {...THIN} />
          <Atom x={caX} y={b2+32} type="O" r={5} />
        </g>
      )
    case 'W':
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2-4} {...STICK} />
          <IndoleRing cx={caX} cy={b2+8} />
        </g>
      )
    case 'U': // Selenocysteine: like Cysteine but Se (pink) replaces S
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="Se" />
        </g>
      )

    // ── Non-standard / ambiguity codes ────────────────────────────────────────
    // Dashed first bond signals "approximate". Real structures where possible.

    case 'B': { // Asx: Asp or Asn — fork into both O (left) and N (right)
      const dash = { ...STICK, strokeDasharray: '4 2' }
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...dash} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX-11} y2={b2} {...STICK} />
          <line x1={caX-3} y1={b1+3} x2={caX-13} y2={b2-3} {...THIN} />
          <Atom x={caX-11} y={b2} type="O" />
          <line x1={caX} y1={b1} x2={caX+11} y2={b2} {...STICK} />
          <Atom x={caX+11} y={b2} type="N" />
        </g>
      )
    }
    case 'J': { // Xle: Leu or Ile — branched hydrophobic (drawn as Leu)
      const dash = { ...STICK, strokeDasharray: '4 2' }
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...dash} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="C" />
          <line x1={caX} y1={b2} x2={caX-11} y2={b3} {...STICK} />
          <line x1={caX} y1={b2} x2={caX+11} y2={b3} {...STICK} />
          <Atom x={caX-11} y={b3} type="C" />
          <Atom x={caX+11} y={b3} type="C" />
        </g>
      )
    }
    case 'O': { // Pyrrolysine: lysine chain capped with a 5-membered pyrroline ring
      const ringCy = b2 + 20
      const rPts   = pts(5, caX, ringCy, 9, -90)
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b2}        {...STICK} />
          <Atom x={caX} y={b1} type="C" />
          <Atom x={caX} y={b2} type="N" />
          <line x1={caX} y1={b2} x2={caX} y2={ringCy - 9} {...STICK} />
          <path d={polyPath(rPts)}                          {...STICK} />
          <Atom x={rPts[0][0]} y={rPts[0][1]} type="N" r={5} />
        </g>
      )
    }
    case 'X': { // Xaa: unknown residue — short dashed stub + "?"
      const dash = { ...STICK, strokeDasharray: '3 2' }
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={caY + 16} {...dash} />
          <text x={caX} y={caY + 28} textAnchor="middle"
                fill="#8a8a8a" fontSize={12} fontWeight="700">?</text>
        </g>
      )
    }
    case 'Z': { // Glx: Glu or Gln — 2-C chain forked into O (left) and N (right)
      const dash = { ...STICK, strokeDasharray: '4 2' }
      return (
        <g>
          <line x1={caX} y1={caY} x2={caX} y2={b1} {...dash} />
          <Atom x={caX} y={b1} type="C" />
          <line x1={caX} y1={b1} x2={caX} y2={b2} {...STICK} />
          <Atom x={caX} y={b2} type="C" />
          <line x1={caX} y1={b2} x2={caX-10} y2={b3} {...STICK} />
          <line x1={caX-2} y1={b2+3} x2={caX-12} y2={b3-3} {...THIN} />
          <Atom x={caX-10} y={b3} type="O" />
          <line x1={caX} y1={b2} x2={caX+10} y2={b3} {...STICK} />
          <Atom x={caX+10} y={b3} type="N" />
        </g>
      )
    }

    default:
      return null
  }
}
