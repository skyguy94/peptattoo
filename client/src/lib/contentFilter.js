import { Filter } from 'bad-words'

// English profanity comes from the bad-words community list.
// We append a curated Spanish set covering common curses; expand as needed.
// Matching is whole-word, case-insensitive — kept intentionally forgiving so
// ordinary amino-acid sequences never register (e.g. Ala-Ser-Ser must not
// trip "ass").
const SPANISH_PROFANITY = [
  'puta', 'puto', 'putas', 'putos',
  'mierda', 'joder', 'jodido', 'jodida',
  'coño', 'cono',
  'cabron', 'cabrón', 'cabrones', 'cabrona',
  'pendejo', 'pendejos', 'pendeja', 'pendejas',
  'gilipollas', 'capullo',
  'hijoputa', 'hijueputa', 'hijodeputa',
  'maricón', 'maricon', 'maricones',
  'chingar', 'chingado', 'chingada', 'chinga', 'chingue',
  'pinche', 'verga', 'pichula',
  'culero', 'culera', 'culeros', 'culeras',
  'polla', 'pollas',
  'tetas', 'teta',
  'zorra', 'zorras',
  'perra', 'perras',
]

const filter = new Filter()
filter.addWords(...SPANISH_PROFANITY)

export function containsProfanity(text) {
  if (!text || !text.trim()) return false
  try {
    return filter.isProfane(text)
  } catch {
    // Defensive: never let a filter error block legitimate input
    return false
  }
}
