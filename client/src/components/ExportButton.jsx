export default function ExportButton() {
  function handleExport() {
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
  }

  return (
    <button
      onClick={handleExport}
      className="mt-6 border border-stone-400 hover:border-stone-700 hover:bg-stone-800 hover:text-white text-stone-700 px-6 py-2 rounded-lg text-sm transition-colors tracking-wide"
    >
      Export SVG
    </button>
  )
}
