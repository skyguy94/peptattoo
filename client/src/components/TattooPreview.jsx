import { useState } from 'react'
import ConnectedChain, { CHAIN_H } from './ConnectedChain'

const ARM_W = 360
const ARM_H = 200

// Cylinder geometry
const EL_CX = 52,  ARM_CY = 100, EL_RY = 50   // elbow (left)
const WR_CX = 318, WR_RY  = 36                  // wrist (right, tapers)

const EL_TOP = ARM_CY - EL_RY   // 50
const EL_BOT = ARM_CY + EL_RY   // 150
const WR_TOP = ARM_CY - WR_RY   // 64
const WR_BOT = ARM_CY + WR_RY   // 136

const ARM_BODY = [
  `M ${EL_CX},${EL_TOP}`,
  `C 160,42 255,60 ${WR_CX},${WR_TOP}`,
  `L ${WR_CX},${WR_BOT}`,
  `C 255,140 160,156 ${EL_CX},${EL_BOT}`,
  'Z',
].join(' ')

// Tattoo sits on the dorsal (top-facing) surface of the cylinder
const TATTOO_CY      = 73    // vertical center of dorsal surface
const TATTOO_COMPRESS = 0.40  // vertical squish — simulates surface wrap

// Real-world calibration
const ARM_INNER_PX = 230
const ARM_INNER_IN = 9.5

const BOND_L = 28
const DX     = BOND_L * Math.cos(35 * Math.PI / 180)
const UNIT_W = 2 * DX + BOND_L

const SKIN_TONES = [
  { label: 'Fair',   hi: '#fce8d2', mid: '#edcba0', lo: '#c49060' },
  { label: 'Light',  hi: '#e8c090', mid: '#d09050', lo: '#a06020' },
  { label: 'Medium', hi: '#bf8c68', mid: '#986040', lo: '#6c3818' },
  { label: 'Dark',   hi: '#7a5040', mid: '#583028', lo: '#361808' },
]

export default function TattooPreview({ chain }) {
  const aas = chain.filter(aa => !aa.space)
  const [scale,   setScale]   = useState(0.44)
  const [toneIdx, setToneIdx] = useState(0)

  if (!aas.length) return null

  // eslint-disable-next-line security/detect-object-injection -- toneIdx is a bounded array index [0..3]
  const tone = SKIN_TONES[toneIdx]

  const chainNatW = (aas.length - 1) * UNIT_W + 2 * DX
  const PAD = 22
  const vW  = chainNatW + PAD * 2
  const vH  = CHAIN_H

  const scaledW = vW * scale
  const scaledH = vH * scale * TATTOO_COMPRESS

  const svgX = (ARM_W - scaledW) / 2
  const svgY = TATTOO_CY - scaledH / 2

  const wIn = (chainNatW * scale) / ARM_INNER_PX * ARM_INNER_IN
  const wCm = wIn * 2.54

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      <div className="text-center">
        <h2 className="text-base font-semibold text-stone-600 tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}>
          Arm Preview
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">Approximate — drag to resize</p>
      </div>

      <svg width={ARM_W} height={ARM_H}
           viewBox={`0 0 ${ARM_W} ${ARM_H}`}
           className="mx-auto block"
           style={{ borderRadius: 12, background: '#ede8df' }}
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Cylindrical shading: lit from directly above */}
          <linearGradient id="prv3-body"
                          x1="0" y1={EL_TOP} x2="0" y2={EL_BOT}
                          gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={tone.hi} />
            <stop offset="28%"  stopColor={tone.mid} />
            <stop offset="78%"  stopColor={tone.mid} stopOpacity="0.88" />
            <stop offset="100%" stopColor={tone.lo} />
          </linearGradient>

          {/* Elbow end-cap: radial — slightly lighter in center */}
          <radialGradient id="prv3-el"
                          cx={EL_CX} cy={ARM_CY} r={EL_RY}
                          gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={tone.mid} stopOpacity="0.55" />
            <stop offset="100%" stopColor={tone.lo}  stopOpacity="1" />
          </radialGradient>

          {/* Wrist end-cap */}
          <radialGradient id="prv3-wr"
                          cx={WR_CX} cy={ARM_CY} r={WR_RY}
                          gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={tone.mid} stopOpacity="0.6" />
            <stop offset="100%" stopColor={tone.lo}  stopOpacity="1" />
          </radialGradient>

          <filter id="prv3-shadow" x="-25%" y="-50%" width="150%" height="250%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx={ARM_W / 2} cy={ARM_H - 10} rx="152" ry="14"
                 fill="rgba(0,0,0,0.20)" filter="url(#prv3-shadow)" />

        {/* Arm body */}
        <path d={ARM_BODY} fill="url(#prv3-body)" />
        <path d={ARM_BODY} fill="none" stroke={tone.lo} strokeWidth={1.5} opacity={0.30} />

        {/* Wrist end-cap */}
        <ellipse cx={WR_CX} cy={ARM_CY} rx={14} ry={WR_RY}
                 fill="url(#prv3-wr)" stroke={tone.lo} strokeWidth={1} />

        {/* Elbow end-cap */}
        <ellipse cx={EL_CX} cy={ARM_CY} rx={18} ry={EL_RY}
                 fill="url(#prv3-el)" stroke={tone.lo} strokeWidth={1} />

        {/* Broad highlight band on dorsal ridge */}
        <path d={`M ${EL_CX+5},${EL_TOP+7} C 165,44 255,62 ${WR_CX-5},${WR_TOP+7}`}
              fill="none" stroke={tone.hi}
              strokeWidth="16" strokeLinecap="round" opacity="0.30" />

        {/* Tight specular streak */}
        <path d={`M ${EL_CX+6},${EL_TOP+9} C 165,47 255,64 ${WR_CX-6},${WR_TOP+9}`}
              fill="none" stroke="rgba(255,255,255,0.62)"
              strokeWidth="3" strokeLinecap="round" />

        {/* Tattoo — vertically compressed onto dorsal surface */}
        <g opacity={0.92}>
          <svg x={svgX} y={svgY}
               width={scaledW} height={scaledH}
               viewBox={`0 0 ${vW} ${vH}`}
               preserveAspectRatio="none"
               overflow="visible">
            <ConnectedChain
              aas={aas}
              svgWidth={vW}
              sectionY={0}
              inputText=""
            />
          </svg>
        </g>
      </svg>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        <span className="text-xs font-medium text-stone-600 tabular-nums">
          {wCm.toFixed(1)} cm&nbsp;/&nbsp;{wIn.toFixed(1)}&Prime; wide
        </span>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-stone-400">S</span>
          <input type="range" min={0.15} max={1.0} step={0.01}
                 value={scale}
                 onChange={e => setScale(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
          <span className="text-xs text-stone-400">L</span>
        </div>

        <div className="flex items-center gap-2.5">
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
