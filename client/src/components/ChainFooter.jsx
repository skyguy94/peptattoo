import { NOVELTY_DISCLAIMER } from '../lib/noveltyDisclaimer'

const NONSTANDARD_LETTERS = ['B', 'J', 'O', 'X', 'Z']

const NONSTANDARD_NOTES = {
  B: 'B → Asx  (Asp or Asn ambiguity)',
  J: 'J → Xle  (Leu or Ile ambiguity)',
  O: 'O → Pyl  (Pyrrolysine, 22nd amino acid)',
  X: 'X → Xaa  (unknown residue)',
  Z: 'Z → Glx  (Glu or Gln ambiguity)',
}

export default function ChainFooter({ chain }) {
  const presentSet = new Set(
    chain.filter(aa => aa.nonstandard).map(aa => aa.letter),
  )

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-2 space-y-2 text-stone-400 text-xs leading-relaxed">
      <p>
        <span className="font-semibold text-stone-500">Note:</span>{' '}
        Five letters (B, J, O, X, Z) have no standard amino acid. On the keyboard
        they are marked with a leading <span className="font-mono">~</span> and are
        rendered using their IUPAC ambiguity or rare-residue code:{' '}
        {NONSTANDARD_LETTERS.map((l, i) => {
          const present = presentSet.has(l)
          return (
            <span key={l}>
              {i > 0 && <span className="mx-1 text-stone-300">·</span>}
              <span
                className={`font-mono ${present ? 'text-stone-700 font-semibold' : 'text-stone-500'}`}
                /* eslint-disable-next-line security/detect-object-injection -- l is one of NONSTANDARD_LETTERS */
              >{NONSTANDARD_NOTES[l]}</span>
            </span>
          )
        })}.{' '}
        Their structures on this site are best-effort approximations.
      </p>
      <p>{NOVELTY_DISCLAIMER}</p>
    </div>
  )
}
