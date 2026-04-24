import { describe, it, expect } from 'vitest'
import { textToAminoAcids, AMINO_ACIDS, UNSUPPORTED_LETTERS } from '../aminoAcids'

describe('AMINO_ACIDS map', () => {
  it('contains all 20 standard amino acids plus selenocysteine (U)', () => {
    const standard = 'ACDEFGHIKLMNPQRSTVWY'
    for (const letter of standard) {
      // eslint-disable-next-line security/detect-object-injection -- iterating hardcoded string
      expect(AMINO_ACIDS[letter], `missing ${letter}`).toBeDefined()
    }
    expect(AMINO_ACIDS['U'], 'missing selenocysteine U').toBeDefined()
    expect(Object.keys(AMINO_ACIDS)).toHaveLength(21)
  })

  it('each entry has name, letter, and color', () => {
    for (const [key, aa] of Object.entries(AMINO_ACIDS)) {
      expect(aa.letter).toBe(key)
      expect(aa.name).toBeTruthy()
      expect(aa.color).toMatch(/^#/)
    }
  })
})

describe('UNSUPPORTED_LETTERS', () => {
  it('is empty — all 26 A-Z letters now map to an amino acid entry', () => {
    expect(UNSUPPORTED_LETTERS.size).toBe(0)
  })

  it('does not flag any standard or non-standard letter', () => {
    for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      expect(UNSUPPORTED_LETTERS.has(ch)).toBe(false)
    }
  })
})

describe('textToAminoAcids()', () => {
  it('maps a single valid letter to its amino acid', () => {
    const result = textToAminoAcids('A')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ letter: 'A', name: 'Alanine' })
  })

  it('is case-insensitive', () => {
    const lower = textToAminoAcids('a')
    const upper = textToAminoAcids('A')
    expect(lower[0].letter).toBe(upper[0].letter)
  })

  it('converts a phrase to the correct sequence', () => {
    const result = textToAminoAcids('ACE')
    expect(result.map(aa => aa.letter)).toEqual(['A', 'C', 'E'])
  })

  it('preserves spaces as space tokens', () => {
    const result = textToAminoAcids('A E')
    expect(result).toHaveLength(3)
    expect(result[1]).toMatchObject({ letter: ' ', space: true })
  })

  it('maps non-standard ambiguity codes (B J O X Z) as non-standard entries', () => {
    for (const ch of ['B', 'J', 'O', 'X', 'Z']) {
      const [result] = textToAminoAcids(ch)
      expect(result.letter).toBe(ch)
      expect(result.nonstandard).toBe(true)
      expect(result.code).toBeTruthy()
    }
  })

  it('B resolves to Asx (Asp/Asn ambiguity)', () => {
    const [b] = textToAminoAcids('B')
    expect(b).toMatchObject({ letter: 'B', code: 'ASX', nonstandard: true })
  })

  it('O resolves to Pyrrolysine', () => {
    const [o] = textToAminoAcids('O')
    expect(o).toMatchObject({ letter: 'O', code: 'PYL', nonstandard: true })
  })

  it('filters out non-alphabetic characters', () => {
    const result = textToAminoAcids('A1!A')
    expect(result).toHaveLength(2)
    expect(result.every(aa => aa.letter === 'A')).toBe(true)
  })

  it('returns empty array for empty string', () => {
    expect(textToAminoAcids('')).toEqual([])
  })

  it('handles a long phrase — I AM STARSTUFF', () => {
    const result = textToAminoAcids('I AM STARSTUFF')
    const letters = result.filter(aa => !aa.space).map(aa => aa.letter)
    expect(letters).toEqual(['I', 'A', 'M', 'S', 'T', 'A', 'R', 'S', 'T', 'U', 'F', 'F'])
    const u = result.find(aa => aa.letter === 'U')
    expect(u).toMatchObject({ letter: 'U', name: 'Selenocysteine' })
  })
})
