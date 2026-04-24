import { useState } from 'react'
import TextInput from './components/TextInput'
import PeptideChain from './components/PeptideChain'
import ExportButton from './components/ExportButton'
import TattooPreview from './components/TattooPreview'
import { textToAminoAcids } from './lib/aminoAcids'

const DEFAULT_WORD = 'PEPTIDE'

export default function App() {
  const [inputText, setInputText] = useState(DEFAULT_WORD)
  const [chain, setChain] = useState(() => textToAminoAcids(DEFAULT_WORD))

  function handleGenerate(text) {
    setChain(textToAminoAcids(text))
  }

  const hasChain = chain.length > 0

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">

      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: 'Georgia, serif' }}>
          Peptattoo
        </h1>
        <p className="text-stone-500 text-sm tracking-wide">
          Spell any word in amino acids — tattoo-ready SVG output.
        </p>
      </div>

      {/* Body */}
      <div className={`flex gap-10 px-6 pb-20 max-w-7xl mx-auto items-start
        ${hasChain ? 'flex-col lg:flex-row' : 'flex-col items-center'}`}>

        {/* Left: input + chain visualization */}
        <div className="flex flex-col items-center gap-4 flex-1 min-w-0 w-full">
          <TextInput value={inputText} onChange={setInputText} onGenerate={handleGenerate} />
          <p className="text-stone-400 text-xs text-center max-w-sm">
            Each letter maps to its amino acid single-letter code. Try your name, a word, or a phrase.
            <span className="block mt-1">
              Letters <span className="font-mono tracking-widest">B J O X Z</span> use approximate non-standard residues.
            </span>
          </p>
          {hasChain && (
            <>
              <PeptideChain chain={chain} inputText={inputText} />
              <ExportButton />
            </>
          )}
        </div>

        {/* Right: arm preview — sticky sidebar on large screens */}
        {hasChain && (
          <div className="lg:sticky lg:top-8 lg:w-[390px] shrink-0 w-full">
            <TattooPreview chain={chain} />
          </div>
        )}
      </div>

    </div>
  )
}
