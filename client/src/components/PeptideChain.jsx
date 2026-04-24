import AminoAcidNode from './AminoAcidNode'
import ConnectedChain, { CHAIN_H } from './ConnectedChain'
import { SvgSharedDefs } from './chemistry'

const NODE_W  = 90
const NODE_H  = 148
const SPACING = 22
const PAD     = 36
const EQ_H    = 60   // height of the "=" separator band

export default function PeptideChain({ chain, inputText }) {
  const aas = chain.filter(aa => !aa.space)
  const n = aas.length
  if (!n) return null

  // Width is driven by the key row (individual tiles)
  const keyRowW = n * (NODE_W + SPACING) - SPACING
  const svgW    = keyRowW + PAD * 2

  const keyRowY   = PAD
  const chainSecY = PAD + NODE_H + EQ_H
  // Extra space at bottom for the original-phrase label
  const svgH = chainSecY + CHAIN_H + 48

  return (
    <div id="peptide-svg-container" className="mt-10 overflow-x-auto w-full">
      <svg
        id="peptide-svg"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto block"
        style={{ background: '#faf9f7', borderRadius: 10 }}
      >
        {/* ── Shared SVG defs (gradients, filters) — must come first ── */}
        <SvgSharedDefs />

        {/* ── Row 1: individual amino acids ── */}
        {aas.map((aa, i) => (
          <AminoAcidNode
            key={`key-${i}`}
            aa={aa}
            x={PAD + i * (NODE_W + SPACING)}
            y={keyRowY}
            width={NODE_W}
            height={NODE_H}
          />
        ))}

        {/* ── "=" separator ── */}
        <text
          x={svgW / 2}
          y={PAD + NODE_H + EQ_H / 2 + 12}
          textAnchor="middle"
          fill="#374151"
          fontSize={40}
          fontWeight="300"
          fontFamily="Georgia, 'Times New Roman', serif"
        >=</text>

        {/* ── Row 2: true continuous peptide chain ── */}
        <ConnectedChain
          aas={aas}
          svgWidth={svgW}
          sectionY={chainSecY}
          inputText={inputText}
        />
      </svg>
    </div>
  )
}
