// Standard single-letter amino acid codes
// Colors grouped by amino acid type — muted, ink-friendly palette:
//   hydrophobic  → slate gray   #7c8594
//   sulfur-cont. → muted amber  #a8892a
//   acidic (−)   → dusty rose   #b05c5c
//   aromatic     → muted indigo #6b62a8
//   basic (+)    → steel blue   #4a7fa8
//   amide polar  → sage green   #3d8a6a
//   hydroxyl     → terra cotta  #b06838
//   selenium     → dusty mauve  #9e5c88
export const AMINO_ACIDS = {
  A: { name: 'Alanine',        letter: 'A', code: 'ALA', color: '#7c8594' },
  C: { name: 'Cysteine',       letter: 'C', code: 'CYS', color: '#a8892a' },
  D: { name: 'Aspartate',      letter: 'D', code: 'ASP', color: '#b05c5c' },
  E: { name: 'Glutamate',      letter: 'E', code: 'GLU', color: '#b05c5c' },
  F: { name: 'Phenylalanine',  letter: 'F', code: 'PHE', color: '#6b62a8', aromatic: true },
  G: { name: 'Glycine',        letter: 'G', code: 'GLY', color: '#9aa0aa' },
  H: { name: 'Histidine',      letter: 'H', code: 'HIS', color: '#4a7fa8', aromatic: true },
  I: { name: 'Isoleucine',     letter: 'I', code: 'ILE', color: '#7c8594' },
  K: { name: 'Lysine',         letter: 'K', code: 'LYS', color: '#4a7fa8' },
  L: { name: 'Leucine',        letter: 'L', code: 'LEU', color: '#7c8594' },
  M: { name: 'Methionine',     letter: 'M', code: 'MET', color: '#a8892a' },
  N: { name: 'Asparagine',     letter: 'N', code: 'ASN', color: '#3d8a6a' },
  P: { name: 'Proline',        letter: 'P', code: 'PRO', color: '#7c8594' },
  Q: { name: 'Glutamine',      letter: 'Q', code: 'GLN', color: '#3d8a6a' },
  R: { name: 'Arginine',       letter: 'R', code: 'ARG', color: '#4a7fa8' },
  S: { name: 'Serine',         letter: 'S', code: 'SER', color: '#b06838' },
  T: { name: 'Threonine',      letter: 'T', code: 'THR', color: '#b06838' },
  V: { name: 'Valine',         letter: 'V', code: 'VAL', color: '#7c8594' },
  W: { name: 'Tryptophan',     letter: 'W', code: 'TRP', color: '#6b62a8', aromatic: true },
  Y: { name: 'Tyrosine',       letter: 'Y', code: 'TYR', color: '#6b62a8', aromatic: true },
  // Selenocysteine: rare 21st amino acid, uses UGA stop codon. Se = pink (not yellow — yellow = sulfur).
  U: { name: 'Selenocysteine', letter: 'U', code: 'SEC', color: '#9e5c88' },
}

// Non-standard / ambiguity-code amino acids (IUPAC + rare 22nd AA).
// These render with a dashed tile border and ~CODE label to signal "approximate."
//   B = Asx  (Asp or Asn ambiguity)
//   J = Xle  (Leu or Ile ambiguity)
//   O = Pyl  (Pyrrolysine — real 22nd amino acid, archaea)
//   X = Xaa  (unknown residue)
//   Z = Glx  (Glu or Gln ambiguity)
export const NONSTANDARD_AAS = {
  B: { name: 'Asx',        letter: 'B', code: 'ASX', color: '#8a7060', nonstandard: true },
  J: { name: 'Xle',        letter: 'J', code: 'XLE', color: '#7c8594', nonstandard: true },
  O: { name: 'Pyrrolysine',letter: 'O', code: 'PYL', color: '#3d8a7a', nonstandard: true },
  X: { name: 'Xaa',        letter: 'X', code: 'XAA', color: '#8a8a8a', nonstandard: true },
  Z: { name: 'Glx',        letter: 'Z', code: 'GLX', color: '#8a7060', nonstandard: true },
}

// All letters A–Z now map to some amino acid entry; nothing is truly unsupported.
export const UNSUPPORTED_LETTERS = new Set()

/**
 * Convert a text string to an array of amino acid entries.
 * Unsupported characters are preserved as { letter, unsupported: true }.
 */
export function textToAminoAcids(text) {
  return text
    .toUpperCase()
    .split('')
    .filter(ch => /[A-Z\s]/.test(ch))
    .map(ch => {
      if (ch === ' ') return { letter: ' ', space: true }
      // eslint-disable-next-line security/detect-object-injection -- ch is filtered to /[A-Z]/ above
      if (AMINO_ACIDS[ch])     return AMINO_ACIDS[ch]
      // eslint-disable-next-line security/detect-object-injection
      if (NONSTANDARD_AAS[ch]) return NONSTANDARD_AAS[ch]
      return { letter: ch, unsupported: true }
    })
}
