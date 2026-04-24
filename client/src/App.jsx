import { useState } from 'react'
import PeptideChain from './components/PeptideChain'
import ExportButton from './components/ExportButton'
import TattooPreview from './components/TattooPreview'
import VirtualKeyboard from './components/VirtualKeyboard'
import ChainFooter from './components/ChainFooter'
import { textToAminoAcids } from './lib/aminoAcids'

const DEFAULT_WORD = 'PEPTIDE'

export default function App() {
  const [inputText, setInputText] = useState(DEFAULT_WORD)
  const [chain,     setChain]     = useState(() => textToAminoAcids(DEFAULT_WORD))

  function handleInput(text) {
    setInputText(text)
    setChain(textToAminoAcids(text))
  }

  const hasChain = chain.length > 0

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">

      {/* Header */}
      <div className="text-center pt-10 pb-6 px-4">
        <h1 className="text-4xl font-bold tracking-tight mb-1.5"
            style={{ fontFamily: 'Georgia, serif' }}>
          Peptattoo
        </h1>
        <p className="text-stone-500 text-sm tracking-wide">
          Type a word — every letter becomes its amino acid.
        </p>
      </div>

      {/* Body */}
      <div className="flex gap-10 px-6 pb-20 max-w-screen-2xl mx-auto items-start flex-col xl:flex-row">

        {/* Left: chain + keyboard */}
        <div className="flex flex-col items-center gap-0 flex-1 min-w-0 w-full">

          {/* Chain output — always visible; sits above the keyboard like paper in a typewriter */}
          <div className="relative w-full">
            <PeptideChain chain={chain} />
            {hasChain && (
              <div className="absolute top-2 right-4">
                <ExportButton />
              </div>
            )}
          </div>

          {/* Virtual keyboard */}
          <div className="overflow-x-auto w-full flex justify-center pt-2 pb-2">
            <VirtualKeyboard inputText={inputText} onChange={handleInput} />
          </div>

          <ChainFooter chain={chain} />
        </div>

        {/* Right: arm preview (sticky sidebar) */}
        {hasChain && (
          <div className="xl:sticky xl:top-8 xl:w-[400px] shrink-0 w-full">
            <TattooPreview chain={chain} />
          </div>
        )}
      </div>

    </div>
  )
}
