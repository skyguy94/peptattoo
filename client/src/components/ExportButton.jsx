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
      className="border border-stone-300 hover:border-stone-500 hover:bg-stone-700 hover:text-white text-stone-500 px-3 py-1 rounded text-xs transition-colors tracking-wide bg-white/80 backdrop-blur-sm"
    >
      Export SVG
    </button>
  )
}
