import { useEffect, useRef, useState } from 'react'
import { NOVELTY_DISCLAIMER } from '../lib/noveltyDisclaimer'

export default function ExportButton() {
  const [showModal, setShowModal] = useState(false)
  const confirmBtnRef = useRef(null)

  function doExport() {
    const svg = document.getElementById('peptide-svg')
    if (!svg) return

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tattoo-vibe.svg'
    a.click()
    URL.revokeObjectURL(url)

    setShowModal(false)
  }

  // While modal is open: focus primary button, close on ESC
  useEffect(() => {
    if (!showModal) return
    confirmBtnRef.current?.focus()
    function onKey(e) {
      if (e.key === 'Escape') setShowModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal])

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="border border-stone-300 hover:border-stone-500 hover:bg-stone-700 hover:text-white text-stone-500 px-3 py-1 rounded text-xs transition-colors tracking-wide bg-white/80 backdrop-blur-sm"
      >
        Export SVG
      </button>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(30, 25, 20, 0.55)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full rounded-lg border border-stone-300"
            style={{
              background: '#fbf6eb',
              boxShadow: '0 12px 44px rgba(0, 0, 0, 0.25)',
              padding: '24px 28px',
            }}
          >
            <h3
              id="export-modal-title"
              className="text-stone-800 font-semibold mb-3"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '1.15rem',
              }}
            >
              Before you export
            </h3>

            <p className="text-stone-600 text-sm leading-relaxed">
              {NOVELTY_DISCLAIMER}
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="border border-stone-300 hover:border-stone-500 text-stone-600 px-4 py-1.5 rounded text-sm transition-colors tracking-wide bg-white"
              >
                Cancel
              </button>
              <button
                ref={confirmBtnRef}
                onClick={doExport}
                className="border border-stone-700 bg-stone-700 hover:bg-stone-800 text-white px-4 py-1.5 rounded text-sm transition-colors tracking-wide"
              >
                Export SVG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
