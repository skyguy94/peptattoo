import { useEffect, useRef, useState } from 'react'
import { AMINO_ACIDS, NONSTANDARD_AAS } from '../lib/aminoAcids'
import { SideChain } from './chemistry'

// ── Geometry ──────────────────────────────────────────────────────────────────
const G = 4    // gap (px)
const H = 62   // key height — all keys same height
const U = 60   // 1-unit body width

function u(n) { return Math.round(n * (U + G) - G) }

// ── Amino acid lookup ─────────────────────────────────────────────────────────
function getAa(letter) {
  // eslint-disable-next-line security/detect-object-injection
  return AMINO_ACIDS[letter] ?? NONSTANDARD_AAS[letter]
}

// ── Layout (4 rows, number row removed, ⌫ moved to Q-row end) ─────────────────
// All rows total 956 px (14–15 key widths + gaps).
const ltr = (ch) => ({ id: ch, label: ch, w: u(1), letter: ch })
const key = (id, label, units, action) => ({
  id, label, w: u(units), ...(action ? { action } : {}),
})

const ROWS = [
  // Q-row: Tab + Q…P + [ ] + ⌫   (14 keys → 956 px)
  [
    key('tab',  'Tab', 1.5),
    ltr('Q'), ltr('W'), ltr('E'), ltr('R'), ltr('T'),
    ltr('Y'), ltr('U'), ltr('I'), ltr('O'), ltr('P'),
    key('[', '[', 1), key(']', ']', 1),
    key('bksp', '⌫', 1.5, 'backspace'),
  ],
  // A-row: Caps + A…L + ; ' + Enter   (13 keys → 956 px)
  [
    key('caps',  'Caps',  1.75),
    ltr('A'), ltr('S'), ltr('D'), ltr('F'), ltr('G'),
    ltr('H'), ltr('J'), ltr('K'), ltr('L'),
    key(';', ';', 1), key("'", "'", 1),
    key('enter', '↵', 2.25),
  ],
  // Z-row: LShift + Z…M + , . / + RShift   (12 keys → 956 px)
  [
    key('lshift', '⇧', 2.25),
    ltr('Z'), ltr('X'), ltr('C'), ltr('V'), ltr('B'),
    ltr('N'), ltr('M'),
    key(',', ',', 1), key('.', '.', 1), key('/', '/', 1),
    key('rshift', '⇧', 2.75),
  ],
  // Bottom row: Ctrl ⊞ Alt [Space] Alt ⊞ Ctrl   (7 keys → 956 px)
  [
    key('lctrl', 'Ctrl', 1.25), key('lwin', '⊞', 1.25), key('lalt', 'Alt', 1.25),
    key('space', '', 7.5, 'space'),
    key('ralt', 'Alt', 1.25), key('rwin', '⊞', 1.25), key('rctrl', 'Ctrl', 1.25),
  ],
]

// ── Key component ─────────────────────────────────────────────────────────────
function Key({ k, active, onAction }) {
  const isLetter     = !!k.letter
  const isFunctional = k.action === 'backspace' || k.action === 'space'
  const isInert      = !isLetter && !isFunctional

  const data = isLetter ? getAa(k.letter) : null

  let bg, border, labelColor, codeColor

  if (isInert) {
    bg = '#d8d2c8'; border = '#cec7bd'; labelColor = '#a69f95'; codeColor = 'transparent'
  } else if (active && isLetter) {
    bg = data?.color ?? '#6b7280'; border = bg; labelColor = 'white'; codeColor = 'rgba(255,255,255,0.75)'
  } else if (active) {
    bg = '#7a716a'; border = '#6a615a'; labelColor = 'white'; codeColor = 'transparent'
  } else if (isLetter) {
    bg = 'white'; border = data?.color ?? '#c0bab2'
    labelColor = '#333'; codeColor = data?.color ?? '#999'
  } else {
    bg = '#c8c2ba'; border = '#aca6a0'; labelColor = '#555'; codeColor = 'transparent'
  }

  return (
    <button
      onClick={isInert ? undefined : () => onAction(k)}
      style={{
        width: k.w, height: H,
        border: `2px solid ${border}`,
        borderRadius: 6,
        background: bg,
        boxShadow: active && !isInert
          ? 'inset 0 2px 4px rgba(0,0,0,0.22)'
          : isInert
          ? '0 1px 0 rgba(128, 115, 95, 0.22)'
          : '0 3px 0 #9a9088, 0 1px 3px rgba(0,0,0,0.10)',
        transform: active && !isInert ? 'translateY(2px)' : 'none',
        cursor: isInert ? 'default' : 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
        padding: '0 4px',
        outline: 'none', userSelect: 'none',
        opacity: 1,
        transition: 'transform 0.08s, box-shadow 0.08s, background 0.10s, border-color 0.10s',
        WebkitTapHighlightColor: 'transparent',
        pointerEvents: isInert ? 'none' : 'auto',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Monochrome amino acid side-chain watermark */}
      {isLetter && data && (
        <svg
          width="100%" height="100%"
          viewBox="0 0 60 68"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            filter: 'grayscale(100%) opacity(0.18)',
            zIndex: 0,
          }}
        >
          <SideChain letter={k.letter} caX={30} caY={14} />
        </svg>
      )}

      {/* Primary label */}
      <span style={{
        fontSize: isLetter ? 20 : k.id === 'bksp' ? 18 : 11,
        fontWeight: 700,
        lineHeight: 1,
        color: labelColor,
        fontFamily: isLetter ? "Georgia, 'Times New Roman', serif" : 'system-ui, sans-serif',
        letterSpacing: isLetter ? '0.5px' : 0,
        position: 'relative',
        zIndex: 1,
      }}>
        {k.label}
      </span>
      {/* Secondary: 3-letter amino acid code on letter keys */}
      {isLetter && data && (
        <span style={{
          fontSize: 8, fontWeight: 600, lineHeight: 1,
          color: codeColor,
          fontFamily: "'Courier New', monospace",
          letterSpacing: '1px',
          position: 'relative',
          zIndex: 1,
        }}>
          {data.nonstandard ? `~${data.code}` : data.code}
        </span>
      )}
    </button>
  )
}

// ── VirtualKeyboard ───────────────────────────────────────────────────────────
export default function VirtualKeyboard({ inputText, onChange }) {
  const [activeKey, setActiveKey] = useState(null)

  const inputRef    = useRef(inputText)
  const onChangeRef = useRef(onChange)
  useEffect(() => { inputRef.current    = inputText }, [inputText])
  useEffect(() => { onChangeRef.current = onChange  }, [onChange])

  function flash(id) {
    setActiveKey(id)
    setTimeout(() => setActiveKey(null), 150)
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const ch = e.key
      if (/^[a-zA-Z]$/.test(ch)) {
        e.preventDefault()
        const up = ch.toUpperCase()
        flash(up)
        onChangeRef.current(inputRef.current + up)
      } else if (ch === 'Backspace') {
        e.preventDefault()
        flash('bksp')
        onChangeRef.current(inputRef.current.slice(0, -1))
      } else if (ch === ' ') {
        e.preventDefault()
        flash('space')
        onChangeRef.current(inputRef.current + ' ')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleAction(k) {
    if (k.letter)                  { flash(k.letter); onChange(inputText + k.letter) }
    else if (k.action === 'backspace') { flash('bksp');  onChange(inputText.slice(0, -1)) }
    else if (k.action === 'space')     { flash('space'); onChange(inputText + ' ') }
  }

  return (
    <div
      className="select-none"
      style={{
        padding: 10,
        background: '#c8c2b9',
        borderRadius: 14,
        display: 'inline-flex',
        flexDirection: 'column',
        gap: G,
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.16)',
      }}
    >
      {ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: G }}>
          {row.map(k => (
            <Key key={k.id} k={k} active={activeKey === k.id} onAction={handleAction} />
          ))}
        </div>
      ))}
    </div>
  )
}
