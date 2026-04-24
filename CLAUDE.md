# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Peptattoo** is an amino acid tattoo generator. Users type a word or phrase; the app converts each letter to its corresponding amino acid using standard single-letter codes and renders the result as a scientifically accurate peptide chain visualization — suitable for export as tattoo-ready SVG/PNG artwork.

Inspired by: tattoos that spell names/phrases using amino acid molecular structures (e.g. "I AM STARSTUFF").

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node + Express
- **Styling:** Tailwind CSS
- **Database:** Postgres + Prisma
- **Auth:** TBD

## Commands

```bash
# Install dependencies (run in both /client and /server)
npm install

# Run frontend dev server
cd client && npm run dev

# Run backend dev server
cd server && npm run dev

# Build frontend for production
cd client && npm run build

# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Lint
npm run lint

# Database migrations
cd server && npx prisma migrate dev
cd server && npx prisma migrate deploy   # production

# Generate Prisma client after schema changes
cd server && npx prisma generate
```

## Repository Structure

```
/client        # React + Vite frontend
/server        # Node + Express backend
```

## Domain Knowledge

### Amino Acid Single-Letter Codes

The 20 standard amino acids and their single-letter codes:

| Letter | Amino Acid    | Letter | Amino Acid    |
|--------|---------------|--------|---------------|
| A      | Alanine       | M      | Methionine    |
| C      | Cysteine      | N      | Asparagine    |
| D      | Aspartate     | P      | Proline       |
| E      | Glutamate     | Q      | Glutamine     |
| F      | Phenylalanine | R      | Arginine      |
| G      | Glycine       | S      | Serine        |
| H      | Histidine     | T      | Threonine     |
| I      | Isoleucine    | V      | Valine        |
| K      | Lysine        | W      | Tryptophan    |
| L      | Leucine       | Y      | Tyrosine      |

**Unsupported letters:** B, J, O, U, X, Z have no standard amino acid. The app must handle these gracefully (skip, substitute, or prompt the user).

### Molecular Rendering

Each amino acid has a backbone (N-Cα-C=O) plus a unique side chain (R group). The visualization connects them via peptide bonds into a linear chain. Key rendering considerations:

- **Atom colors (CPK convention):** Carbon = gray/black sticks, Nitrogen = blue, Oxygen = red, Sulfur = yellow
- **Aromatic rings** (F, W, Y, H): draw explicit double bonds between carbons rather than a circle — more accurate and tattoo-accurate per community feedback
- **Stereochemistry** (wedge/dash bonds): optional for tattoo style; the reference tattoo omits them from side chains for cleanliness
- **Selenocysteine (U):** if ever supported, use pink not yellow for the selenium atom (yellow is associated with sulfur)
- The reference tattoo style uses ball-and-stick with colored spheres for heteroatoms and lines for C-C bonds

### SVG Rendering Approach

Molecular structures should be rendered as SVG (not canvas) so output is resolution-independent for tattoo use. Each amino acid is a self-contained SVG component positioned along a horizontal chain, connected by peptide bond lines.

## Architecture

The core data flow is:

1. User inputs text → strip unsupported characters / warn
2. Each letter maps to an amino acid data record (name, single-letter code, SVG path data or atom graph)
3. A layout engine positions the amino acids left-to-right, connecting backbone atoms with peptide bonds
4. SVG is rendered in the browser and can be downloaded

The backend handles saved designs (Postgres via Prisma) and will eventually handle user accounts. The molecular rendering logic lives entirely on the frontend.

## Key Design Decisions

- **SVG over canvas** for export quality
- **Frontend rendering** — no server-side chemistry lib needed; atom coordinates are hardcoded per amino acid
- Letters with no amino acid equivalent must be handled explicitly — don't silently drop them
