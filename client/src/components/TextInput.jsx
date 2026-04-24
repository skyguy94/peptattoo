import { UNSUPPORTED_LETTERS } from '../lib/aminoAcids'

export default function TextInput({ value, onChange, onGenerate }) {
  const unsupported = [...value.toUpperCase()].filter(
    ch => ch !== ' ' && UNSUPPORTED_LETTERS.has(ch)
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onGenerate(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Type a word or phrase..."
          className="flex-1 bg-white border border-stone-300 rounded-lg px-4 py-3 text-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500"
        />
        <button
          type="submit"
          className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-3 rounded-lg font-medium transition-colors tracking-wide"
        >
          Generate
        </button>
      </div>
      {unsupported.length > 0 && (
        <p className="text-amber-700 text-sm">
          Letters with no amino acid: {[...new Set(unsupported)].join(', ')} — these will be skipped.
        </p>
      )}
    </form>
  )
}
