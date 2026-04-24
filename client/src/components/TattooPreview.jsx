import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Decal } from '@react-three/drei'
import {
  MeshStandardMaterial,
  Vector2,
  CanvasTexture,
  SRGBColorSpace,
} from 'three'
import KnucklesView from './KnucklesView'

// ── Torso profile (unchanged) ─────────────────────────────────────────────────
const TORSO_PROFILE = [
  [0.06,  0.76],
  [0.14,  0.80],
  [0.175, 0.86],
  [0.188, 0.91],
  [0.176, 0.97],
  [0.132, 1.07],
  [0.148, 1.14],
  [0.171, 1.24],
  [0.183, 1.33],
  [0.176, 1.40],
  [0.166, 1.455],
  [0.068, 1.510],
  [0.056, 1.555],
].map(([x, y]) => new Vector2(x, y))

const SKIN_TONES = [
  { label: 'Fair',   color: '#f0d0a8' },
  { label: 'Light',  color: '#d9a068' },
  { label: 'Medium', color: '#a06035' },
  { label: 'Dark',   color: '#5a2e12' },
]

// ── Body part configuration ──────────────────────────────────────────────────
// target = approximate world-space center of the part (camera looks here)
// camOffset = camera position offset from target (front-right angled view so the
// rest of the body reads as faded context behind the hero part)
const PARTS = {
  bicep:   { label: 'Bicep',   target: [0.222, 1.320, 0], camOffset: [0.48, 0.10, 0.55] },
  forearm: { label: 'Forearm', target: [0.271, 1.075, 0], camOffset: [0.50, 0.08, 0.55] },
  thigh:   { label: 'Thigh',   target: [0.107, 0.620, 0], camOffset: [0.45, 0.05, 0.65] },
  calf:    { label: 'Calf',    target: [0.109, 0.240, 0], camOffset: [0.45, 0.05, 0.55] },
  face:    { label: 'Face',    target: [0.000, 1.660, 0], camOffset: [0.12, 0.02, 0.55] },
}

// Local-Z offset (distance into the parent mesh's local space) used to place
// the decal on the part's front surface. Matches each part's capsule radius
// (or head-sphere radius for face).
const DECAL_SURFACE = {
  bicep:   0.050,
  forearm: 0.040,
  thigh:   0.072,
  calf:    0.050,
  face:    0.115,
}

// Half of the cylindrical portion of each capsule — used to bound the vertical
// slide so the decal stays on the shaft and off the end caps.
const CAPSULE_HALF_LEN = {
  bicep:   0.085,
  forearm: 0.090,
  thigh:   0.110,
  calf:    0.150,
}

// Map (horiz, vert) in [-1, 1] to a surface position + outward-facing rotation.
// tatRot is the user's "spin on skin" rotation, applied around the surface
// normal AFTER the part-specific orientation. XYZ Euler order is intrinsic in
// Three.js, so [0, θ, tatRot] composes cleanly: Y rotation re-aims +Z outward,
// then Z rotation around the new (outward) axis spins the tattoo.
function decalTransform(part, horiz, vert, tatRot) {
  // eslint-disable-next-line security/detect-object-injection -- part is a key from PARTS
  const r = DECAL_SURFACE[part]

  if (part === 'face') {
    const lon = horiz * Math.PI * 0.35   // ±63° around the head
    const lat = vert  * Math.PI * 0.28   // ±50° up / down
    return {
      position: [
        r * Math.cos(lat) * Math.sin(lon),
        r * Math.sin(lat),
        r * Math.cos(lat) * Math.cos(lon),
      ],
      rotation: [-lat, lon, tatRot],
    }
  }

  // eslint-disable-next-line security/detect-object-injection -- part is a key from PARTS
  const halfLen = CAPSULE_HALF_LEN[part]
  const theta = horiz * Math.PI * 0.9    // almost full wraparound
  const yOff  = vert * halfLen * 0.85    // stay on the cylinder, off the caps
  return {
    position: [r * Math.sin(theta), yOff, r * Math.cos(theta)],
    rotation: [0, theta, tatRot],
  }
}

// ── Hook: turn the on-page peptide chain SVG into a Three.js texture ─────────
// The chain is already being rendered (id="peptide-svg"). We clone that node,
// strip its cream background so the raster has transparency, then rasterize
// it to a canvas and wrap that in a CanvasTexture for use as a decal map.
//
// State is only written from the async image-load callback — never from the
// effect body synchronously — so we don't trip react-hooks/set-state-in-effect.
// An empty chain simply skips the load; callers gate decal rendering on
// chain.length separately.
function useChainTexture(chain, showLetters) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const aas = chain.filter(aa => !aa.space)
    if (!aas.length) return

    const svgEl = document.getElementById('peptide-svg')
    if (!svgEl) return

    const clone = svgEl.cloneNode(true)
    clone.style.background = 'transparent'
    if (!showLetters) {
      clone.querySelectorAll('.aa-letter-label').forEach(el => el.remove())
    }
    const svgString = new XMLSerializer().serializeToString(clone)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const img = new Image()
    let cancelled = false

    img.onload = () => {
      URL.revokeObjectURL(url)
      if (cancelled) return
      const w = img.naturalWidth  || 800
      const h = img.naturalHeight || 200
      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const tex = new CanvasTexture(canvas)
      tex.colorSpace = SRGBColorSpace
      tex.needsUpdate = true
      setTexture(tex)
    }
    img.onerror = () => { URL.revokeObjectURL(url) }
    img.src = url

    return () => { cancelled = true }
  }, [chain, showLetters])

  // Dispose superseded textures so GPU memory doesn't leak as the chain edits
  useEffect(() => () => { texture?.dispose?.() }, [texture])

  return texture
}

// ── CameraRig ────────────────────────────────────────────────────────────────
// Snaps the camera + orbit target to the focused part whenever selection
// changes. Kept instant (not tweened) for simplicity; orbit/zoom after the
// snap is interactive as usual.
function CameraRig({ focusedPart }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!controlsRef.current) return
    // eslint-disable-next-line security/detect-object-injection -- focusedPart is a key from PARTS
    const cfg = PARTS[focusedPart]
    if (!cfg) return
    const [tx, ty, tz] = cfg.target
    const [ox, oy, oz] = cfg.camOffset
    camera.position.set(tx + ox, ty + oy, tz + oz)
    controlsRef.current.target.set(tx, ty, tz)
    controlsRef.current.update()
  }, [focusedPart, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={0.25}
      maxDistance={3.5}
    />
  )
}

// ── Mannequin ────────────────────────────────────────────────────────────────
// Two shared materials:
//   matHero  = full opacity — applied only to the focused part
//   matGhost = faded, no depth-write — applied to everything else
// The single-point-of-control `mat(partKey)` selects between them so every
// mesh declaratively says "I am part X" and gets the right material.
//
// The Decal is a child of the focused part's mesh — Drei walks up to find
// the parent geometry and projects the peptide chain texture onto its
// surface at the local-Z offset for that part's radius.
function Mannequin({ color, focusedPart, tattooTexture, decalPosition, decalRotation, tattooScale, showTattoo }) {
  const matHero = useMemo(() => new MeshStandardMaterial({
    color, roughness: 0.78, metalness: 0,
    transparent: true, opacity: 1,
  }), [color])

  const matGhost = useMemo(() => new MeshStandardMaterial({
    color, roughness: 0.78, metalness: 0,
    transparent: true, opacity: 0.18,
    depthWrite: false,
  }), [color])

  useEffect(() => () => {
    matHero.dispose()
    matGhost.dispose()
  }, [matHero, matGhost])

  const mat = (partKey) => (focusedPart === partKey ? matHero : matGhost)

  const texAspect = tattooTexture?.image
    ? tattooTexture.image.width / tattooTexture.image.height
    : 4

  const decal = showTattoo && tattooTexture && (
    <Decal
      position={decalPosition}
      rotation={decalRotation}
      scale={[tattooScale * texAspect, tattooScale, 0.3]}
    >
      <meshStandardMaterial
        map={tattooTexture}
        transparent
        alphaTest={0.05}
        polygonOffset
        polygonOffsetFactor={-4}
        roughness={0.85}
        metalness={0}
      />
    </Decal>
  )

  return (
    <group>
      {/* Head (focusable as "face") */}
      <mesh position={[0, 1.66, 0]} scale={[1, 1.06, 0.90]} material={mat('face')}>
        <sphereGeometry args={[0.11, 32, 24]} />
        {focusedPart === 'face' && decal}
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.645, 0.107]} scale={[0.55, 0.50, 1]} material={mat('face')}>
        <sphereGeometry args={[0.022, 12, 10]} />
      </mesh>

      {/* Ears */}
      {[-1, 1].map(side => (
        <mesh key={`ear${side}`} position={[side * 0.112, 1.655, 0]}
              scale={[0.28, 0.55, 0.42]} material={mat('face')}>
          <sphereGeometry args={[0.045, 12, 10]} />
        </mesh>
      ))}

      {/* Neck — always ghost (context only) */}
      <mesh position={[0, 1.590, 0]} scale={[1, 1, 0.84]} material={matGhost}>
        <capsuleGeometry args={[0.058, 0.06, 8, 16]} />
      </mesh>

      {/* Torso — always ghost */}
      <mesh scale={[1.15, 1, 0.78]} material={matGhost}>
        <latheGeometry args={[TORSO_PROFILE, 48]} />
      </mesh>

      {/* Crotch cap — always ghost */}
      <mesh position={[0, 0.762, 0]} rotation={[-Math.PI / 2, 0, 0]}
            scale={[1.15 * 0.06, 0.78 * 0.06, 1]} material={matGhost}>
        <circleGeometry args={[1, 32]} />
      </mesh>

      {/* Limbs — only the subject's right side (side = +1) is focusable;
           the left side is always ghost to serve as anatomical context. */}
      {[-1, 1].map(side => {
        const isRight = side === 1
        return (
          <group key={side}>

            <mesh position={[side * 0.222, 1.320, 0]}
                  rotation={[0, 0, side * 0.24]}
                  material={isRight ? mat('bicep') : matGhost}>
              <capsuleGeometry args={[0.050, 0.17, 8, 16]} />
              {isRight && focusedPart === 'bicep' && decal}
            </mesh>

            <mesh position={[side * 0.271, 1.075, 0]}
                  rotation={[0, 0, side * 0.15]}
                  material={isRight ? mat('forearm') : matGhost}>
              <capsuleGeometry args={[0.040, 0.18, 8, 16]} />
              {isRight && focusedPart === 'forearm' && decal}
            </mesh>

            <mesh position={[side * 0.107, 0.620, 0]}
                  rotation={[0, 0, side * 0.04]}
                  material={isRight ? mat('thigh') : matGhost}>
              <capsuleGeometry args={[0.072, 0.22, 8, 16]} />
              {isRight && focusedPart === 'thigh' && decal}
            </mesh>

            <mesh position={[side * 0.109, 0.240, 0]}
                  material={isRight ? mat('calf') : matGhost}>
              <capsuleGeometry args={[0.050, 0.30, 8, 16]} />
              {isRight && focusedPart === 'calf' && decal}
            </mesh>

          </group>
        )
      })}
    </group>
  )
}

// ── TattooPreview ────────────────────────────────────────────────────────────
export default function TattooPreview({ chain }) {
  const [focusedPart, setFocusedPart] = useState('bicep')
  const [toneIdx,     setToneIdx]     = useState(0)
  const [tatRot,      setTatRot]      = useState(0)     // degrees
  const [tatSize,     setTatSize]     = useState(0.08)  // decal "height" along surface
  const [tatHoriz,    setTatHoriz]    = useState(0)     // -1..+1 around / longitude
  const [tatVert,     setTatVert]     = useState(0)     // -1..+1 along  / latitude
  const [showLetters, setShowLetters] = useState(false) // letters visible on tattoo

  const tattooTexture = useChainTexture(chain, showLetters)
  const aaLetters = chain.filter(aa => !aa.space).map(aa => aa.letter).join('')
  const hasChain = aaLetters.length > 0
  const canShowKnuckles = aaLetters.length > 0 && aaLetters.length <= 8

  // Treat focusedPart as intent; fall back to bicep if knuckles is no longer
  // a valid choice (chain grew past 8 letters or was emptied/filtered).
  const effectivePart = (focusedPart === 'knuckles' && !canShowKnuckles)
    ? 'bicep'
    : focusedPart
  const isKnuckles = effectivePart === 'knuckles'

  const { position: decalPosition, rotation: decalRotation } = useMemo(
    () => decalTransform(
      isKnuckles ? 'bicep' : effectivePart,
      tatHoriz, tatVert, tatRot * Math.PI / 180,
    ),
    [effectivePart, isKnuckles, tatHoriz, tatVert, tatRot],
  )

  // eslint-disable-next-line security/detect-object-injection -- toneIdx is a bounded index [0..3]
  const tone = SKIN_TONES[toneIdx]

  // Initial camera position derived from the default focused part so the
  // first frame is already framed correctly (no pop from a full-body shot).
  const initCam = useMemo(() => {
    const cfg = PARTS.bicep
    return [
      cfg.target[0] + cfg.camOffset[0],
      cfg.target[1] + cfg.camOffset[1],
      cfg.target[2] + cfg.camOffset[2],
    ]
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      <div className="text-center">
        <h2 className="text-base font-semibold text-stone-600 tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}>
          Tattoo Placement
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">
          Pick a body part · drag to rotate the view · sliders resize and rotate the tattoo
        </p>
      </div>

      {/* Part picker */}
      <div className="flex flex-wrap justify-center gap-1.5 w-full px-2">
        {Object.entries(PARTS).map(([key, cfg]) => (
          <button key={key}
                  onClick={() => setFocusedPart(key)}
                  className={`px-3 py-1 rounded text-xs tracking-wide transition-colors border ${
                    effectivePart === key
                      ? 'bg-stone-700 text-white border-stone-700'
                      : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
                  }`}>
            {cfg.label}
          </button>
        ))}
        {canShowKnuckles && (
          <button
            onClick={() => setFocusedPart('knuckles')}
            className={`px-3 py-1 rounded text-xs tracking-wide transition-colors border ${
              effectivePart === 'knuckles'
                ? 'bg-stone-700 text-white border-stone-700'
                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
            }`}
          >
            Knuckles
          </button>
        )}
      </div>

      {/* View — 3D mannequin for body parts, 2D hands for knuckles */}
      <div className="w-full rounded-xl overflow-hidden" style={{ height: 400 }}>
        {isKnuckles ? (
          <KnucklesView letters={aaLetters} skinColor={tone.color} />
        ) : (
          <Canvas camera={{ position: initCam, fov: 45 }}>
            <color attach="background" args={['#ede8df']} />

            <ambientLight intensity={0.52} />
            <directionalLight position={[2,   4,  2]}  intensity={0.88} />
            <directionalLight position={[-1.5, 2, -1]} intensity={0.26} />

            <Mannequin
              color={tone.color}
              focusedPart={effectivePart}
              tattooTexture={tattooTexture}
              decalPosition={decalPosition}
              decalRotation={decalRotation}
              tattooScale={tatSize}
              showTattoo={hasChain}
            />

            <ContactShadows
              position={[0, 0.001, 0]}
              opacity={0.32}
              scale={2}
              blur={1.6}
              far={1.2}
            />

            <CameraRig focusedPart={effectivePart} />
          </Canvas>
        )}
      </div>

      {/* Tattoo controls — only meaningful for the 3D decal views */}
      {!isKnuckles && (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 w-14 text-right">Slide ←→</span>
          <input type="range" min={-1} max={1} step={0.01} value={tatHoriz}
                 onChange={e => setTatHoriz(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 w-14 text-right">Slide ↑↓</span>
          <input type="range" min={-1} max={1} step={0.01} value={tatVert}
                 onChange={e => setTatVert(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 w-14 text-right">Rotate</span>
          <input type="range" min={-180} max={180} step={1} value={tatRot}
                 onChange={e => setTatRot(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 w-14 text-right">Size</span>
          <input type="range" min={0.03} max={0.18} step={0.002} value={tatSize}
                 onChange={e => setTatSize(Number(e.target.value))}
                 className="flex-1 accent-stone-700" />
        </div>

        <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer select-none mt-1 pl-1">
          <input
            type="checkbox"
            checked={showLetters}
            onChange={e => setShowLetters(e.target.checked)}
            className="accent-stone-700"
          />
          Show letters on tattoo
        </label>
      </div>
      )}

      {/* Skin tone */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-stone-500">Skin</span>
        {SKIN_TONES.map((t, i) => (
          <button key={t.label} title={t.label}
                  onClick={() => setToneIdx(i)}
                  style={{
                    background: t.color, width: 20, height: 20,
                    borderRadius: '50%', cursor: 'pointer', outline: 'none',
                    border: `2.5px solid ${i === toneIdx ? '#1a1a1a' : 'transparent'}`,
                  }} />
        ))}
      </div>

    </div>
  )
}
