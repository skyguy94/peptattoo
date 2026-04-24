# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Peptattoo** is an amino acid tattoo generator. Users type a word or phrase; the app converts each letter to its corresponding amino acid using standard single-letter codes and renders the result as a scientifically accurate peptide chain visualization — suitable for export as tattoo-ready SVG artwork.

Inspired by: tattoos that spell names/phrases using amino acid molecular structures (e.g. "I AM STARSTUFF").

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **3D:** Three.js via @react-three/fiber and @react-three/drei

Static site — no backend. Everything (chain rendering, 3D preview, SVG export, content filter) runs in the browser.

## Commands

```bash
# Install client deps
cd client && npm install

# Dev server
cd client && npm run dev
# or from repo root:
npm run dev

# Production build
cd client && npm run build
# or from repo root:
npm run build

# Tests (vitest)
cd client && npm test

# Lint
cd client && npm run lint

# Security scan (secrets + npm audit + eslint-plugin-security)
npm run security
```

## Repository Structure

```
/client        # React + Vite frontend (the whole app)
```

## Domain Knowledge

### Amino Acid Single-Letter Codes

The 20 standard amino acids plus selenocysteine (21st), and 5 nonstandard ambiguity codes used when a letter has no real amino acid:

| Letter | Amino Acid    | Letter | Amino Acid        |
|--------|---------------|--------|-------------------|
| A      | Alanine       | M      | Methionine        |
| C      | Cysteine      | N      | Asparagine        |
| D      | Aspartate     | P      | Proline           |
| E      | Glutamate     | Q      | Glutamine         |
| F      | Phenylalanine | R      | Arginine          |
| G      | Glycine       | S      | Serine            |
| H      | Histidine     | T      | Threonine         |
| I      | Isoleucine    | V      | Valine            |
| K      | Lysine        | W      | Tryptophan        |
| L      | Leucine       | Y      | Tyrosine          |
| U      | Selenocysteine (21st) |   |                   |

**Nonstandard (IUPAC ambiguity / rare-residue codes), rendered with a `~` prefix:**

| Letter | Maps to | Meaning                          |
|--------|---------|----------------------------------|
| B      | Asx     | Asp or Asn ambiguity             |
| J      | Xle     | Leu or Ile ambiguity             |
| O      | Pyl     | Pyrrolysine (22nd amino acid)    |
| X      | Xaa     | Unknown residue                  |
| Z      | Glx     | Glu or Gln ambiguity             |

Every A–Z letter therefore maps to some entry; the app never silently drops input.

### Molecular Rendering

Each amino acid has a backbone (N-Cα-C=O) plus a unique side chain (R group). The visualization connects them via peptide bonds into a linear chain. Key rendering considerations:

- **Atom colors (CPK-inspired, muted):** Nitrogen = blue, Oxygen = red, Carbon = dark gray, Sulfur = muted amber. Side-chain element palette is intentionally desaturated for an ink-friendly look.
- **Aromatic rings** (F, W, Y, H): draw explicit double bonds between carbons rather than a circle — more accurate and tattoo-accurate per community feedback.
- **Stereochemistry** (wedge/dash bonds): omitted from side chains for visual cleanliness.
- **Selenocysteine (U):** pink for selenium, not yellow (yellow is reserved for sulfur).

### SVG Rendering Approach

Molecular structures render as SVG (not canvas) so output is resolution-independent for tattoo use. Each amino acid is positioned along a horizontal chain, connected by peptide bond lines. The exported SVG is the same SVG shown on the page.

## Architecture

Client-only flow:

1. User types on the virtual keyboard (or physical keyboard while focused) → `inputText` state
2. `textToAminoAcids(text)` maps each letter to an amino acid record (or space marker)
3. `PeptideChain` renders the zig-zag backbone + per-residue side chain as SVG
4. `TattooPreview` captures that SVG as a `CanvasTexture` and projects it onto a 3D mannequin part via a `DecalGeometry`
5. Export button downloads the on-page chain SVG

## Key Design Decisions

- **SVG over canvas** for export quality.
- **Client-only** — no backend, no persistence. Hosted as a static site.
- **Content filter** (`bad-words` + a curated Spanish list) runs client-side. Determined users can bypass by editing JS; acceptable for a novelty tool, not for anything that gates serious content.
- **Letters with no standard amino acid are never silently dropped** — they render with the `~` prefix and their IUPAC ambiguity/rare-residue code.
