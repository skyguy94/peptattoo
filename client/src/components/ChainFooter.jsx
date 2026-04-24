const NONSTANDARD_NOTES = {
  B: 'B → Asx  (Asp or Asn ambiguity)',
  J: 'J → Xle  (Leu or Ile ambiguity)',
  O: 'O → Pyl  (Pyrrolysine, 22nd amino acid)',
  X: 'X → Xaa  (unknown residue)',
  Z: 'Z → Glx  (Glu or Gln ambiguity)',
}

export default function ChainFooter({ chain }) {
  const present = chain
    .filter(aa => aa.nonstandard)
    .map(aa => aa.letter)
    .filter((l, i, arr) => arr.indexOf(l) === i)   // dedupe

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-2 space-y-2 text-stone-400 text-xs leading-relaxed">
      {present.length > 0 && (
        <p>
          <span className="font-semibold text-stone-500">Note:</span>{' '}
          Letters marked <span className="font-mono">~</span> have no standard amino acid assignment
          and are rendered using their IUPAC ambiguity or rare-residue code:{' '}
          {present.map((l, i) => (
            <span key={l}>
              {i > 0 && <span className="mx-1 text-stone-300">·</span>}
              {/* eslint-disable-next-line security/detect-object-injection -- l is filtered to nonstandard aa.letter values from aminoAcids.js */}
          <span className="font-mono text-stone-500">{NONSTANDARD_NOTES[l]}</span>
            </span>
          ))}.
          These structures are best-effort approximations.
        </p>
      )}
      <p>
        Molecular structures are artistic interpretations for novelty and tattoo-design
        purposes only. Side-chain geometry, stereochemistry, and bond angles are
        simplified for visual clarity and <em>may not reflect actual biochemistry</em>.
        If you plan to get this tattooed, please verify the structures with a qualified
        biochemist before your appointment.
      </p>
    </div>
  )
}
