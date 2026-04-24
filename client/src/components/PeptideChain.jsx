import ConnectedChain, { CHAIN_H } from './ConnectedChain'
import { SvgSharedDefs } from './chemistry'

const PAD_X = 48
const PAD_Y = 20
const MIN_W = 400

export default function PeptideChain({ chain }) {
  const aas = chain.filter(aa => !aa.space)
  const n = aas.length

  const UNIT_W = 73.9
  const DX     = 22.94
  const chainW = n > 0 ? (n - 1) * UNIT_W + 2 * DX : 0
  const svgW   = Math.max(chainW + PAD_X * 2, MIN_W)
  const svgH   = CHAIN_H + PAD_Y * 2

  return (
    <div id="peptide-svg-container" className="overflow-x-auto w-full">
      <svg
        id="peptide-svg"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto block"
        style={{ background: '#fbf6eb', borderRadius: 10 }}
      >
        <SvgSharedDefs />
        {n === 0 ? (
          <text
            x={svgW / 2}
            y={svgH / 2 + 6}
            textAnchor="middle"
            fill="#c0bab2"
            fontSize={14}
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="2"
          >
            start typing…
          </text>
        ) : (
          <ConnectedChain
            aas={aas}
            svgWidth={svgW}
            sectionY={PAD_Y}
          />
        )}
      </svg>
    </div>
  )
}
