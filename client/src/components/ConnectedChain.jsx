// Renders a peptide chain with a chemically accurate zig-zag backbone.
//
// Real backbone geometry: N-Cα-C bond angle ≈ 111° (tetrahedral at Cα).
// In 2D projection this means the backbone zig-zags — Cα sits ABOVE the N–C
// baseline at ~35° bond angles, giving exactly 110° at Cα.
//
//   Cα            Cα            Cα
//  /  \          /  \          /  \
// N    C ——— N    C ——— N    C
//      ‖          ‖          ‖
//      O          O          O   (C=O straight up, double bond)
//      |          |          |
//     R₁         R₂         R₃   (side chains hang down from Cα)
//
// Bond geometry (all lengths = BOND_L = 28px):
//   N→Cα : UP-RIGHT at ZIG_DEG above horizontal
//   Cα→C : DOWN-RIGHT at ZIG_DEG below horizontal  (back to baseline)
//   C→N' : HORIZONTAL right  (peptide bond, planar)
//   C→O  : STRAIGHT UP  (C=O carbonyl, double bond)
//
// Rendering order (back→front): side chains → bonds → atoms → labels

import { Atom, SideChain } from './chemistry'
import { INK, STICK, THIN } from './chem-tokens'

const BOND_L   = 28                              // px, all backbone bonds
const ZIG_DEG  = 35                              // degrees above/below horizontal
const ZIG_RAD  = ZIG_DEG * Math.PI / 180
const DX       = BOND_L * Math.cos(ZIG_RAD)     // ≈ 22.94px horizontal component
const DY       = BOND_L * Math.sin(ZIG_RAD)     // ≈ 16.06px vertical component
const UNIT_W   = 2 * DX + BOND_L                // ≈ 73.9px per amino acid
const CO_LEN   = 22                              // px, C=O bond (slightly shorter)

// Section layout (relative to sectionY):
const BB_ABOVE = 38    // space above backbone for O atoms (CO_LEN + Cα height + margin)
const BB_BELOW = 108   // space below backbone for side chains + label
export const CHAIN_H = BB_ABOVE + BB_BELOW       // 146px

export default function ConnectedChain({ aas, svgWidth, sectionY, inputText }) {
  const n = aas.length
  if (!n) return null

  // Center the chain horizontally within the SVG
  const chainW = (n - 1) * UNIT_W + 2 * DX   // N(0) to C(n-1)
  const startX  = (svgWidth - chainW) / 2
  const bbY     = sectionY + BB_ABOVE           // backbone baseline (N, C sit here)

  // Atom position helpers
  const nX  = i => startX + i * UNIT_W
  const caX = i => startX + i * UNIT_W + DX
  const caY = bbY - DY                          // ALL Cα atoms this many px above baseline
  const cX  = i => startX + i * UNIT_W + 2 * DX
  const oY  = bbY - CO_LEN                      // ALL O atoms straight up from C

  // Side chain hangs from just below Cα
  const scY = caY + 8

  return (
    <g>

      {/* ══ PASS 1: side chains (behind backbone) ══ */}
      {aas.map((aa, i) =>
        aa.unsupported ? null : (
          <SideChain key={`sc-${i}`} letter={aa.letter} caX={caX(i)} caY={scY} />
        )
      )}

      {/* ══ PASS 2: backbone bonds (on top of side chains) ══ */}
      {aas.map((_, i) => (
        <g key={`bonds-${i}`}>
          {/* N–Cα  (up-right) */}
          <line x1={nX(i)}  y1={bbY}  x2={caX(i)} y2={caY} {...STICK} />
          {/* Cα–C  (down-right) */}
          <line x1={caX(i)} y1={caY}  x2={cX(i)}  y2={bbY} {...STICK} />
          {/* Peptide bond C→N(next)  (horizontal) */}
          {i < n - 1 && (
            <line x1={cX(i)} y1={bbY} x2={nX(i+1)} y2={bbY} {...STICK} />
          )}
          {/* C=O primary bond (vertical) */}
          <line x1={cX(i)}   y1={bbY} x2={cX(i)}   y2={oY} {...STICK} />
          {/* C=O second line (double bond indicator, offset 3px right) */}
          <line x1={cX(i)+3} y1={bbY} x2={cX(i)+3} y2={oY} {...THIN}  />
        </g>
      ))}

      {/* ══ PASS 3: atoms on top of all bonds ══ */}
      {aas.map((aa, i) => (
        <g key={`atoms-${i}`}>
          <Atom x={nX(i)}  y={bbY} type="N"  />   {/* blue */}
          <Atom x={caX(i)} y={caY} type="Ca" />   {/* gray, slightly larger */}
          <Atom x={cX(i)}  y={bbY} type="C"  />   {/* dark gray */}
          <Atom x={cX(i)}  y={oY}  type="O"  />   {/* red */}
          {/* unsupported: question-mark stub */}
          {aa.unsupported && (
            <g>
              <line x1={caX(i)} y1={caY+6} x2={caX(i)} y2={caY+24}
                    stroke="#dc2626" strokeWidth={1.5} strokeDasharray="3 2" />
              <text x={caX(i)} y={caY+36} textAnchor="middle"
                    fill="#dc2626" fontSize={10} fontWeight="600">?</text>
            </g>
          )}
        </g>
      ))}

      {/* ══ PASS 4: letter labels below side chain area ══ */}
      {aas.map((aa, i) => (
        <text
          key={`lbl-${i}`}
          x={caX(i)}
          y={sectionY + BB_ABOVE + BB_BELOW - 8}
          textAnchor="middle"
          fill={INK}
          fontSize={13}
          fontWeight="700"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="0.5"
        >
          {aa.letter}
        </text>
      ))}

      {/* ══ Original phrase below chain ══ */}
      {inputText && (
        <text
          x={svgWidth / 2}
          y={sectionY + CHAIN_H + 30}
          textAnchor="middle"
          fill={INK}
          fontSize={18}
          fontWeight="400"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="5"
        >
          {inputText.toUpperCase()}
        </text>
      )}
    </g>
  )
}
