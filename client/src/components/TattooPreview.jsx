import { useEffect, useRef, useState } from 'react'
import ConnectedChain, { CHAIN_H } from './ConnectedChain'
import { SvgSharedDefs } from './chemistry'

const SVG_W = 300
const SVG_H = 560

// Front-view human silhouette, single clockwise outline path (300×560 space).
// Order: head → right shoulder → right arm (outer↓ hand inner↑) → right torso →
//        right leg → crotch → left leg → left torso → left arm (outer↓ hand inner↑) →
//        left shoulder → neck → head.
const FIGURE_PATH = [
  'M 150,12',
  'C 188,14 190,85 162,88',    // right side of head → chin-right
  'C 164,94 172,110 172,116',  // neck right → collar right
  'C 200,118 222,118 238,122', // right shoulder
  'C 264,134 274,198 274,278', // outer right arm → elbow
  'C 274,318 268,364 262,386', // right forearm → wrist outer
  'C 259,396 247,396 243,384', // right hand
  'C 241,364 240,318 240,278', // inner right arm up
  'C 240,224 232,182 216,166', // up to right armpit
  'C 210,186 204,246 200,294', // down right torso → waist
  'C 200,326 212,344 214,350', // right hip
  'C 214,396 212,468 210,536', // right outer leg → foot
  'L 180,536',                 // right foot
  'C 180,468 176,400 172,386', // up right inner leg
  'C 166,362 156,352 150,374', // crotch right side
  'C 144,352 134,362 128,386', // crotch left side
  'C 124,400 120,468 120,536', // down left inner leg
  'L 90,536',                  // left foot
  'C 88,468 86,396 86,350',   // up left outer leg
  'C 86,344 98,326 100,294',  // left hip → waist
  'C 96,246 90,186 84,166',   // up left torso → armpit
  'C 68,182 56,240 52,278',   // outer left arm → elbow
  'C 52,318 56,364 60,386',   // left forearm → wrist outer
  'C 62,396 76,396 78,384',   // left hand
  'C 78,364 76,318 76,278',   // inner left arm up
  'C 78,230 86,178 90,128',   // up to left shoulder inner
  'C 92,120 110,118 140,112', // left shoulder → neck left
  'C 140,106 138,96 138,88',  // neck left → chin left
  'C 112,84 110,12 150,12 Z', // left side of head → top
].join(' ')

const SKIN_TONES = [
  { label: 'Fair',   hi: '#fce8d2', mid: '#edcba0', lo: '#c49060' },
  { label: 'Light',  hi: '#e8c090', mid: '#d09050', lo: '#a06020' },
  { label: 'Medium', hi: '#bf8c68', mid: '#986040', lo: '#6c3818' },
  { label: 'Dark',   hi: '#7a5040', mid: '#583028', lo: '#361808' },
]

const BOND_L = 28
const DX     = BOND_L * Math.cos(35 * Math.PI / 180)
const UNIT_W = 2 * DX + BOND_L

export default function TattooPreview({ chain }) {
  const aas = chain.filter(aa => !aa.space)

  const [toneIdx, setToneIdx]   = useState(0)
  const [scale, setScale]       = useState(0.28)
  const [rotation, setRotation] = useState(0)
  const [pos, setPos]           = useState({ x: 150, y: 260 })
  const [dragging, setDragging] = useState(false)

  const dragOffset = useRef({ x: 0, y: 0 })
  const svgRef     = useRef(null)

  useEffect(() => {
    if (!dragging) return
    const svg = svgRef.current

    function getCoords(e) {
      if (!svg) return { x: 0, y: 0 }
      const rect   = svg.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      return {
        x: (clientX - rect.left) * (SVG_W / rect.width),
        y: (clientY - rect.top)  * (SVG_H / rect.height),
      }
    }

    function onMove(e) {
      e.preventDefault()
      const c = getCoords(e)
      setPos({ x: c.x - dragOffset.current.x, y: c.y - dragOffset.current.y })
    }
    function onUp() { setDragging(false) }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging])

  if (!aas.length) return null

  // eslint-disable-next-line security/detect-object-injection -- toneIdx is a bounded index [0..3]
  const tone = SKIN_TONES[toneIdx]

  const chainNatW = (aas.length - 1) * UNIT_W + 2 * DX
  const PAD = 22
  const vW  = chainNatW + PAD * 2
  const vH  = CHAIN_H

  function onPointerDown(e) {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect   = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = (clientX - rect.left) * (SVG_W / rect.width)
    const y = (clientY - rect.top)  * (SVG_H / rect.height)
    dragOffset.current = { x: x - pos.x, y: y - pos.y }
    setDragging(true)
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      <div className="text-center">
        <h2 className="text-base font-semibold text-stone-600 tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}>
          Body Preview
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">Drag to position · resize and rotate below</p>
      </div>

      <svg
        ref={svgRef}
        width={SVG_W} height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="mx-auto block"
        style={{ borderRadius: 12, background: '#ede8df', touchAction: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <SvgSharedDefs />

        <defs>
          <linearGradient id="prv-body" x1="0" y1="12" x2="0" y2="536"
                          gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={tone.hi} />
            <stop offset="28%"  stopColor={tone.mid} />
            <stop offset="100%" stopColor={tone.lo} />
          </linearGradient>
          <filter id="prv-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx={150} cy={SVG_H - 8} rx={58} ry={9}
                 fill="rgba(0,0,0,0.18)" filter="url(#prv-shadow)" />

        {/* Body silhouette */}
        <path d={FIGURE_PATH}
              fill="url(#prv-body)"
              stroke={tone.lo} strokeWidth={1.2} />

        {/* Tattoo — drag to reposition */}
        <g
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          transform={`translate(${pos.x} ${pos.y}) rotate(${rotation})`}
          opacity={0.90}
        >
          <g transform={`scale(${scale}) translate(${-vW / 2} ${-vH / 2})`}>
            <ConnectedChain aas={aas} svgWidth={vW} sectionY={0} />
          </g>
        </g>
      </svg>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-stone-400 w-10 text-right">Size</span>
          <input type="range" min={0.10} max={0.70} step={0.01}
                 value={scale} onChange={e => setScale(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-stone-400 w-10 text-right">Rotate</span>
          <input type="range" min={-180} max={180} step={1}
                 value={rotation} onChange={e => setRotation(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          <span className="text-xs text-stone-500">Skin</span>
          {SKIN_TONES.map((t, i) => (
            <button key={t.label} title={t.label}
                    onClick={() => setToneIdx(i)}
                    style={{
                      background: t.mid, width: 20, height: 20,
                      borderRadius: '50%', cursor: 'pointer', outline: 'none',
                      border: `2.5px solid ${i === toneIdx ? '#1a1a1a' : 'transparent'}`,
                    }} />
          ))}
        </div>
      </div>

    </div>
  )
}
