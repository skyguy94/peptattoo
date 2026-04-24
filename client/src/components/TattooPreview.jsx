import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { MeshStandardMaterial, Vector2 } from 'three'

// ── Torso profile ─────────────────────────────────────────────────────────────
// LatheGeometry rotates this (radius, y) curve 360° around the Y axis.
// Mesh is then scaled [1.15, 1, 0.78] to give an oval cross-section
// (wider side-to-side than front-to-back, like a real torso).
const TORSO_PROFILE = [
  [0.06,  0.76],   // crotch
  [0.14,  0.80],
  [0.175, 0.86],
  [0.188, 0.91],   // widest hip
  [0.176, 0.97],
  [0.132, 1.07],   // waist (narrowest)
  [0.148, 1.14],
  [0.171, 1.24],
  [0.183, 1.33],   // upper chest
  [0.176, 1.40],
  [0.166, 1.455],  // shoulder — wide enough to accept arm capsules
  [0.068, 1.510],  // neck base
  [0.056, 1.555],  // neck top
].map(([x, y]) => new Vector2(x, y))

const SKIN_TONES = [
  { label: 'Fair',   color: '#f0d0a8' },
  { label: 'Light',  color: '#d9a068' },
  { label: 'Medium', color: '#a06035' },
  { label: 'Dark',   color: '#5a2e12' },
]

// ── Mannequin ─────────────────────────────────────────────────────────────────
// Key geometry choices:
//   Torso     — LatheGeometry gives smooth organic waist/hip/shoulder curves
//   Limbs     — CapsuleGeometry eliminates sharp cylinder ends; joints overlap naturally
//   Head      — sphere with nose + ears so it reads as a face immediately
//   Hands     — flattened oval (not a ball)
//   Feet      — elongated scaled sphere (not a box)
//
// Rotation sign rule: rotation.z = side * k
//   Three.js rotation.z > 0 → +Y tilts toward −X.
//   For left arm (side=−1): rotation.z = −k → +Y tilts toward +X (shoulder toward body). ✓
//   For right arm (side=+1): rotation.z = +k → +Y tilts toward −X (shoulder toward body). ✓
function Mannequin({ color }) {
  const mat = useMemo(
    () => new MeshStandardMaterial({ color, roughness: 0.78, metalness: 0 }),
    [color],
  )
  useEffect(() => () => mat.dispose(), [mat])

  return (
    <group>

      {/* ── Head ── slightly taller than wide, slightly flat in Z */}
      <mesh position={[0, 1.66, 0]} scale={[1.0, 1.06, 0.90]} material={mat}>
        <sphereGeometry args={[0.11, 32, 24]} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.645, 0.107]} scale={[0.55, 0.50, 1.0]} material={mat}>
        <sphereGeometry args={[0.022, 12, 10]} />
      </mesh>

      {/* Ears */}
      {[-1, 1].map(side => (
        <mesh key={`ear${side}`}
              position={[side * 0.112, 1.655, 0]}
              scale={[0.28, 0.55, 0.42]} material={mat}>
          <sphereGeometry args={[0.045, 12, 10]} />
        </mesh>
      ))}

      {/* ── Neck capsule — bridges head and torso top ── */}
      <mesh position={[0, 1.590, 0]} scale={[1.0, 1.0, 0.84]} material={mat}>
        <capsuleGeometry args={[0.058, 0.06, 8, 16]} />
      </mesh>

      {/* ── Torso — lathe geometry, oval scale ── */}
      <mesh scale={[1.15, 1, 0.78]} material={mat}>
        <latheGeometry args={[TORSO_PROFILE, 48]} />
      </mesh>

      {/* Crotch cap so torso bottom isn't open when camera looks up */}
      <mesh position={[0, 0.762, 0]} rotation={[-Math.PI / 2, 0, 0]}
            scale={[1.15 * 0.06, 0.78 * 0.06, 1]} material={mat}>
        <circleGeometry args={[1, 32]} />
      </mesh>

      {/* ── Limbs (side = −1 left, +1 right) ── */}
      {[-1, 1].map(side => (
        <group key={side}>

          {/* Shoulder cap — bridges arm and torso */}
          <mesh position={[side * 0.196, 1.443, 0]} material={mat}>
            <sphereGeometry args={[0.064, 16, 16]} />
          </mesh>

          {/* Upper arm  (CapsuleGeometry: radius, cylinderLength, capSegs, radialSegs) */}
          {/* total half-height = radius + length/2 = 0.050 + 0.085 = 0.135              */}
          <mesh position={[side * 0.234, 1.307, 0]}
                rotation={[0, 0, side * 0.24]} material={mat}>
            <capsuleGeometry args={[0.050, 0.17, 8, 16]} />
          </mesh>

          {/* Elbow cap */}
          <mesh position={[side * 0.266, 1.170, 0]} material={mat}>
            <sphereGeometry args={[0.046, 14, 14]} />
          </mesh>

          {/* Lower arm */}
          <mesh position={[side * 0.284, 1.046, 0]}
                rotation={[0, 0, side * 0.15]} material={mat}>
            <capsuleGeometry args={[0.040, 0.15, 8, 16]} />
          </mesh>

          {/* Hand — flattened oval, wider than tall */}
          <mesh position={[side * 0.302, 0.908, 0]}
                scale={[1.12, 0.66, 0.54]} material={mat}>
            <sphereGeometry args={[0.052, 16, 12]} />
          </mesh>

          {/* Hip cap */}
          <mesh position={[side * 0.108, 0.776, 0]} material={mat}>
            <sphereGeometry args={[0.072, 16, 16]} />
          </mesh>

          {/* Upper leg — top penetrates torso slightly for clean join */}
          <mesh position={[side * 0.107, 0.575, 0]}
                rotation={[0, 0, side * 0.04]} material={mat}>
            <capsuleGeometry args={[0.072, 0.22, 8, 16]} />
          </mesh>

          {/* Knee cap */}
          <mesh position={[side * 0.109, 0.380, 0]} material={mat}>
            <sphereGeometry args={[0.060, 14, 14]} />
          </mesh>

          {/* Lower leg */}
          <mesh position={[side * 0.109, 0.210, 0]} material={mat}>
            <capsuleGeometry args={[0.050, 0.18, 8, 16]} />
          </mesh>

          {/* Ankle cap */}
          <mesh position={[side * 0.109, 0.072, 0]} material={mat}>
            <sphereGeometry args={[0.046, 14, 14]} />
          </mesh>

          {/* Foot — elongated egg shape, slight downward angle at toe */}
          <mesh position={[side * 0.109, 0.052, 0.066]}
                rotation={[0.20, 0, 0]}
                scale={[1.0, 0.50, 2.10]} material={mat}>
            <sphereGeometry args={[0.058, 16, 12]} />
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

          <ambientLight intensity={0.52} />
          <directionalLight position={[2,   4,  2]}  intensity={0.88} />
          <directionalLight position={[-1.5, 2, -1]} intensity={0.26} />

          <Mannequin color={color} />

          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={0.38}
            scale={2}
            blur={1.6}
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
