import { Atom, SideChain } from './chemistry'
import { INK, STICK, THIN } from './chem-tokens'

// ── Tile backbone geometry (zig-zag, fits 90 px wide tile) ───────────────────
//
//   code (3-letter)              ← y + 14
//
//         O   (r=7, red)         ← y + 30  [above C, straight up]
//         ‖
//    Cα (r=6)                    ← y + 35  [peak of zig-zag]
//   /        \
//  N (r=7)    C (r=5)            ← y + 52  [backbone baseline]
//  x+10      x+74
//  |
//  side chain
//
//   letter (1-letter)            ← y + 142

const TN_X    = 10   // N x-offset from tile left
const TCA_X   = 42   // Cα x-offset (near center)
const TC_X    = 74   // C x-offset from tile left
const TCA_DY  = 17   // Cα rises this many px above baseline
const TCO_LEN = 22   // C=O length (straight up)
const TBB_Y   = 52   // backbone baseline y-offset from tile top

function TileBackbone({ x, y }) {
  const nX  = x + TN_X
  const caX = x + TCA_X
  const cX  = x + TC_X
  const bbY = y + TBB_Y
  const caY = bbY - TCA_DY
  const oY  = bbY - TCO_LEN

  return (
    <g>
      {/* N–Cα bond (up-right) */}
      <line x1={nX}  y1={bbY} x2={caX} y2={caY} {...STICK} />
      {/* Cα–C bond (down-right) */}
      <line x1={caX} y1={caY} x2={cX}  y2={bbY} {...STICK} />
      {/* C=O primary bond (straight up) */}
      <line x1={cX}   y1={bbY} x2={cX}   y2={oY} {...STICK} />
      {/* C=O secondary (double-bond indicator, offset 3 px left) */}
      <line x1={cX-3} y1={bbY-1} x2={cX-3} y2={oY+1} {...THIN}  />
      {/* Atoms — slightly larger than chain defaults for tile legibility */}
      <Atom x={nX}  y={bbY} type="N"  r={7} />
      <Atom x={caX} y={caY} type="Ca" r={6} />
      <Atom x={cX}  y={bbY} type="C"  r={5} />
      <Atom x={cX}  y={oY}  type="O"  r={7} />
    </g>
  )
}

export default function AminoAcidNode({ aa, x, y, width, height }) {
  const cx  = x + width / 2
  const caX = x + TCA_X
  const bbY = y + TBB_Y
  const caY = bbY - TCA_DY
  const scY = caY + 8    // side chain root just below Cα

  if (aa.unsupported) {
    return (
      <g>
        <rect x={x+2} y={y+2} width={width-4} height={height-4} rx={8}
              fill="#fff5f5" stroke="#dc2626" strokeWidth={1.5} strokeDasharray="4 3"
              filter="url(#tile-drop)" />
        <text x={cx} y={y + height/2 + 6} textAnchor="middle"
              fill="#dc2626" fontSize={26} fontWeight="700" fontFamily="monospace">
          {aa.letter}
        </text>
        <text x={cx} y={y + height - 10} textAnchor="middle"
              fill="#dc2626" fontSize={9}>unsupported</text>
      </g>
    )
  }

  return (
    <g>
      {/* ── Tile card — dashed border for non-standard / ambiguity residues ── */}
      <rect x={x+2} y={y+2} width={width-4} height={height-4} rx={8}
            fill="white" stroke={aa.color}
            strokeWidth={aa.nonstandard ? 1.5 : 2}
            strokeDasharray={aa.nonstandard ? '5 3' : null}
            filter="url(#tile-drop)" />
      {/* Very subtle type-color tint over the white */}
      <rect x={x+3} y={y+3} width={width-6} height={height-6} rx={7}
            fill={aa.color} fillOpacity={0.06} stroke="none" />

      {/* ── 3-letter code — prefixed with ~ for non-standard residues ── */}
      <text x={cx} y={y + 14} textAnchor="middle"
            fill={aa.color} fontSize={9} fontWeight="700" letterSpacing="1.5"
            fontFamily="'Courier New', monospace">
        {aa.nonstandard ? `~${aa.code}` : aa.code}
      </text>

      {/* ── Side chain (behind backbone atoms) ── */}
      <SideChain letter={aa.letter} caX={caX} caY={scY} />

      {/* ── Zig-zag backbone + atoms (front layer) ── */}
      <TileBackbone x={x} y={y} />

      {/* ── 1-letter code at bottom ── */}
      <text x={cx} y={y + height - 6} textAnchor="middle"
            fill={INK} fontSize={15} fontWeight="700"
            fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="1">
        {aa.letter}
      </text>
    </g>
  )
}
