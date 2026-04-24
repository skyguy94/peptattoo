import { useState } from 'react'
import PeptideChain from './components/PeptideChain'
import ExportButton from './components/ExportButton'
import TattooPreview from './components/TattooPreview'
import VirtualKeyboard from './components/VirtualKeyboard'
import ChainFooter from './components/ChainFooter'
import PeptideTicker from './components/PeptideTicker'
import BrandFooter from './components/BrandFooter'
import { textToAminoAcids } from './lib/aminoAcids'
import { containsProfanity } from './lib/contentFilter'

const DEFAULT_WORD = 'PEPTIDE'

export default function App() {
  const [inputText, setInputText] = useState(DEFAULT_WORD)
  const [chain,     setChain]     = useState(() => textToAminoAcids(DEFAULT_WORD))
  const [blocked,   setBlocked]   = useState(false)

  function handleInput(text) {
    setInputText(text)
    if (containsProfanity(text)) {
      setBlocked(true)
      setChain([])
    } else {
      setBlocked(false)
      setChain(textToAminoAcids(text))
    }
  }

  const hasChain = chain.length > 0

  return (
    <div
      className="min-h-screen text-stone-800"
      style={{
        // Warm cream page with a subtle dot grid — evokes a lab notebook
        // without being loud. Dots are only ~6% opacity so they read as texture.
        background: `
          radial-gradient(circle at 1px 1px, rgba(80, 70, 55, 0.09) 1px, transparent 0) 0 0 / 22px 22px,
          #f3ecdc
        `,
      }}
    >

      {/* ── Masthead ── */}
      <header className="text-center pt-12 pb-4 px-4">
        <h1
          className="font-bold text-stone-800 mb-2"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '2.75rem',
            letterSpacing: '0.015em',
          }}
        >
          Peptattoo
        </h1>
        <p className="text-stone-500 text-sm italic max-w-2xl mx-auto whitespace-nowrap"
           style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Every letter is an amino acid — type a word and see the peptide it spells.
        </p>
      </header>

      {/* ── Body ── */}
      <div className="flex gap-10 px-6 pt-4 pb-10 max-w-screen-2xl mx-auto items-start flex-col xl:flex-row">

        {/* Left: chain output + keyboard + footnotes */}
        <div className="flex flex-col items-center gap-0 flex-1 min-w-0 w-full">

          {/* Chain output — always visible; sits above the keyboard like paper in a typewriter */}
          <div className="relative w-full">
            <PeptideChain chain={chain} blocked={blocked} />
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

        {/* Right: 3D mannequin preview (sticky sidebar) */}
        {hasChain && (
          <div className="xl:sticky xl:top-8 xl:w-[400px] shrink-0 w-full">
            <TattooPreview chain={chain} />
          </div>
        )}
      </div>

      {/* ── Ticker — sample words rendered as scrolling peptide chains ── */}
      <PeptideTicker />

      {/* ── Brand footer ── */}
      <BrandFooter />

    </div>
  )
}
