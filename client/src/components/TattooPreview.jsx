import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'

const SKIN_TONES = [
  { label: 'Fair',   color: '#f0d0a8' },
  { label: 'Light',  color: '#d9a068' },
  { label: 'Medium', color: '#a06035' },
  { label: 'Dark',   color: '#5a2e12' },
]

// ── Mannequin ─────────────────────────────────────────────────────────────────
// Procedural figure built from primitives.
// Y=0 is floor; figure is ~1.75 units tall.
// Arms in A-pose (~20° from vertical) so the full torso and limbs are visible.
//
// Rotation sign convention: rotation.z = side * k
//   side = -1 (left), side = +1 (right)
//   Positive k makes the top of each cylinder lean toward the body center,
//   bottom lean outward — correct for both arms and legs.
function Mannequin({ color }) {
  const mat = useMemo(
    () => new MeshStandardMaterial({ color, roughness: 0.82, metalness: 0 }),
    [color],
  )
  useEffect(() => () => mat.dispose(), [mat])

  return (
    <group>
      {/* ── Head ── */}
      <mesh position={[0, 1.65, 0]} material={mat}>
        <sphereGeometry args={[0.11, 32, 32]} />
      </mesh>

      {/* ── Neck ── */}
      <mesh position={[0, 1.525, 0]} material={mat}>
        <cylinderGeometry args={[0.055, 0.062, 0.11, 16]} />
      </mesh>

      {/* ── Torso (three segments: chest / waist / hips) ── */}
      <mesh position={[0, 1.27, 0]} material={mat}>
        <boxGeometry args={[0.40, 0.30, 0.22]} />
      </mesh>
      <mesh position={[0, 1.05, 0]} material={mat}>
        <boxGeometry args={[0.27, 0.14, 0.20]} />
      </mesh>
      <mesh position={[0, 0.87, 0]} material={mat}>
        <boxGeometry args={[0.37, 0.20, 0.22]} />
      </mesh>

      {/* ── Limbs (mirrored: side = -1 left, +1 right) ── */}
      {[-1, 1].map(side => (
        <group key={side}>

          {/* Shoulder cap */}
          <mesh position={[side * 0.21, 1.44, 0]} material={mat}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[side * 0.235, 1.305, 0]}
                rotation={[0, 0, side * 0.24]} material={mat}>
            <cylinderGeometry args={[0.050, 0.056, 0.28, 16]} />
          </mesh>
          {/* Elbow cap */}
          <mesh position={[side * 0.265, 1.168, 0]} material={mat}>
            <sphereGeometry args={[0.052, 16, 16]} />
          </mesh>
          {/* Lower arm */}
          <mesh position={[side * 0.286, 1.046, 0]}
                rotation={[0, 0, side * 0.15]} material={mat}>
            <cylinderGeometry args={[0.040, 0.048, 0.24, 16]} />
          </mesh>
          {/* Hand */}
          <mesh position={[side * 0.305, 0.912, 0]} material={mat}>
            <sphereGeometry args={[0.040, 16, 16]} />
          </mesh>

          {/* Hip cap */}
          <mesh position={[side * 0.105, 0.775, 0]} material={mat}>
            <sphereGeometry args={[0.070, 16, 16]} />
          </mesh>
          {/* Upper leg */}
          <mesh position={[side * 0.106, 0.575, 0]}
                rotation={[0, 0, side * 0.04]} material={mat}>
            <cylinderGeometry args={[0.065, 0.074, 0.38, 16]} />
          </mesh>
          {/* Knee cap */}
          <mesh position={[side * 0.108, 0.385, 0]} material={mat}>
            <sphereGeometry args={[0.062, 16, 16]} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[side * 0.108, 0.215, 0]} material={mat}>
            <cylinderGeometry args={[0.046, 0.058, 0.30, 16]} />
          </mesh>
          {/* Ankle cap */}
          <mesh position={[side * 0.108, 0.07, 0]} material={mat}>
            <sphereGeometry args={[0.046, 16, 16]} />
          </mesh>
          {/* Foot */}
          <mesh position={[side * 0.108, 0.038, 0.065]} material={mat}>
            <boxGeometry args={[0.088, 0.058, 0.19]} />
          </mesh>

        </group>
      ))}
    </group>
  )
}

// ── TattooPreview ─────────────────────────────────────────────────────────────
export default function TattooPreview() {
  const [toneIdx, setToneIdx] = useState(0)
  // eslint-disable-next-line security/detect-object-injection -- toneIdx is a bounded index [0..3]
  const { color } = SKIN_TONES[toneIdx]

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      <div className="text-center">
        <h2 className="text-base font-semibold text-stone-600 tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}>
          Body Preview
        </h2>
        <p className="text-xs text-stone-400 mt-0.5">Drag to rotate · scroll to zoom</p>
      </div>

      <div className="w-full rounded-xl overflow-hidden" style={{ height: 480 }}>
        <Canvas camera={{ position: [0, 1.1, 2.8], fov: 45 }}>
          <color attach="background" args={['#ede8df']} />

          <ambientLight intensity={0.55} />
          <directionalLight position={[2, 4, 2]}   intensity={0.85} />
          <directionalLight position={[-1.5, 2, -1]} intensity={0.25} />

          <Mannequin color={color} />

          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={0.4}
            scale={2}
            blur={1.5}
            far={1.2}
          />

          <OrbitControls
            target={[0, 0.9, 0]}
            minDistance={0.8}
            maxDistance={5}
            enablePan={false}
          />
        </Canvas>
      </div>

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
