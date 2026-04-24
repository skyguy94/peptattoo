import { textToAminoAcids } from '../lib/aminoAcids'
import ConnectedChain, { CHAIN_H } from './ConnectedChain'
import { SvgSharedDefs } from './chemistry'

// Curated sample words — mix of standard-only chains and a few that include
// nonstandard letters (O, X, Z) so the ticker quietly demonstrates those too.
const TICKER_WORDS = [
  'LIFE', 'DNA', 'CELL', 'HELIX', 'PEPTIDE', 'SCIENCE',
  'ATOM', 'CHAIN', 'PROTEIN', 'AMINO', 'I AM STARSTUFF',
]

const SCALE    = 0.42
const UNIT_W   = 73.9     // matches ConnectedChain
const DX       = 22.94
const ITEM_PAD = 18
const GAP      = 56       // gap after each item (via marginRight for seamless loop)

function TickerItem({ word }) {
  const aas = textToAminoAcids(word).filter(aa => !aa.space)
  if (!aas.length) return null

  const chainNatW = (aas.length - 1) * UNIT_W + 2 * DX
  const vW = chainNatW + ITEM_PAD * 2
  const vH = CHAIN_H
  const displayW = vW * SCALE
  const displayH = vH * SCALE

  return (
    <div
      className="flex flex-col items-center shrink-0 select-none"
      style={{ marginRight: GAP, opacity: 0.82 }}
    >
      <svg
        width={displayW} height={displayH}
        viewBox={`0 0 ${vW} ${vH}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <SvgSharedDefs />
        <ConnectedChain aas={aas} svgWidth={vW} sectionY={0} />
      </svg>
      <span
        className="text-[11px] uppercase text-stone-500 mt-1"
        style={{
          letterSpacing: '0.28em',
          fontFamily: "'Courier New', monospace",
        }}
      >
        {word}
      </span>
    </div>
  )
}

export default function PeptideTicker() {
  // Duplicate the list so the scroll loop has identical content at 0% and -50%
  // (marginRight on every item — including the last — keeps spacing uniform
  // across the seam, which gap:N cannot guarantee).
  const items = [...TICKER_WORDS, ...TICKER_WORDS]

  return (
    <>
      <style>{`
        @keyframes peptide-ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .peptide-ticker-track {
          animation: peptide-ticker-scroll 140s linear infinite;
          width: max-content;
        }
        .peptide-ticker-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .peptide-ticker-track { animation: none; }
        }
      `}</style>
      <div
        className="w-full overflow-hidden py-3"
        style={{
          background:   '#ede5d0',
          borderTop:    '1px solid rgba(80, 70, 55, 0.10)',
          borderBottom: '1px solid rgba(80, 70, 55, 0.10)',
        }}
        aria-label="Sample peptide chains"
      >
        <div className="peptide-ticker-track flex items-center">
          {items.map((word, i) => (
            <TickerItem key={i} word={word} />
          ))}
        </div>
      </div>
    </>
  )
}
