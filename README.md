# Peptattoo

*Every letter becomes an amino acid. Type a word and see the peptide it spells.*

Peptattoo is a novelty tool that turns names and phrases into scientifically-grounded peptide chain artwork — the kind of thing you might eventually want on your skin, or at least in a lab notebook.

## Inspiration

Amino-acid tattoos have a small but devoted following — people spell their names or a meaningful phrase using the standard single-letter codes (`A`=Alanine, `L`=Leucine, and so on) and have the resulting peptide chain rendered in the classic ball-and-stick molecular style. The best-known example in the wild is the "I AM STARSTUFF" tattoo, where a 13-residue peptide spells Carl Sagan's phrase.

Getting that kind of artwork designed usually means commissioning it or wrestling with chemistry drawing software that wasn't built for the purpose. Peptattoo takes the friction out: you type, the peptide renders, and you can preview it on a body part before deciding whether to send the SVG to an artist.

## Live demo

**[peptide-tattoo.com](https://peptide-tattoo.com)**

## What it does

- **Type on the virtual keyboard** (or use your physical keyboard while the page is focused). Each key shows the amino acid's three-letter code and a faint watermark of its side-chain structure, so you can see what you're building before you press the key.
- **Watch the peptide chain assemble in real time** above the keyboard — N, Cα, C, and O atoms; peptide bonds; C=O double bonds; and the unique side chain for each of the 20 standard amino acids plus selenocysteine (the 21st).
- **Letters without a standard amino acid** (B, J, O, X, Z) are rendered using their IUPAC ambiguity or rare-residue codes (Asx, Xle, Pyl, Xaa, Glx) with a leading `~` so you know they're best-effort approximations, not real residues.
- **Preview the tattoo on a 3D mannequin.** Pick a body part (bicep, forearm, thigh, calf, or face), orbit/zoom the view, then slew / rotate / resize the tattoo as a projected decal on that surface. Change skin tone to see how the ink will read. Toggle whether the per-residue letter labels render on the tattoo itself.
- **Export as SVG** for sending to a tattoo artist or just saving for later. A confirmation modal restates the novelty disclaimer before the download fires.
- **Scrolling peptide ticker** at the bottom of the page shows sample words (LIFE, DNA, HELIX, I AM STARSTUFF, and others) rendered as mini peptide chains — a passive demo of the translation.
- **Client-side profanity filter** covers English (via `bad-words`) and a curated Spanish list, matched whole-word and case-insensitive. Blocked input clears the chain panel with a gentle "try a different word" message rather than hard-blocking typing.

## Amino acid reference

All 26 letters map to something; the app never silently drops input.

**Standard (1–20) + Selenocysteine (21):**

| | | | | | | |
|--|--|--|--|--|--|--|
| A Alanine | C Cysteine | D Aspartate | E Glutamate | F Phenylalanine | G Glycine | H Histidine |
| I Isoleucine | K Lysine | L Leucine | M Methionine | N Asparagine | P Proline | Q Glutamine |
| R Arginine | S Serine | T Threonine | V Valine | W Tryptophan | Y Tyrosine | U Selenocysteine |

**Non-standard (IUPAC ambiguity / rare-residue codes, rendered with `~`):**

| Letter | Maps to | Meaning |
|--------|---------|---------|
| B | Asx | Asp or Asn ambiguity |
| J | Xle | Leu or Ile ambiguity |
| O | Pyl | Pyrrolysine (22nd amino acid, archaea) |
| X | Xaa | Unknown residue |
| Z | Glx | Glu or Gln ambiguity |

## Tech stack

- **React + Vite** — app shell and dev loop
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D mannequin, orbit controls, and decal projection onto the selected body part
- **Tailwind CSS** — styling, paired with Georgia serif + Courier mono for a lab-notebook feel
- **Vitest** — test runner
- **`bad-words`** (plus a curated Spanish supplement) — client-side content filter

No backend. No database. No API calls. The app is a fully static site.

## How it works

1. User types → `inputText` state updates
2. `textToAminoAcids(text)` maps each character to an amino acid record (or space marker)
3. `PeptideChain` renders the zig-zag backbone and labeled side chains as SVG in real time
4. `TattooPreview` clones that SVG, strips its background for transparency, rasterizes it to a canvas, wraps it in a Three.js `CanvasTexture`, and projects it onto the focused body part's surface via `DecalGeometry`
5. "Export SVG" downloads the on-page chain SVG after the novelty disclaimer is acknowledged

Molecular structures render as **SVG rather than canvas** so the exported image is resolution-independent — tattoo artists typically prefer vector input.

### Rendering notes

- **Atom palette** is CPK-inspired but intentionally desaturated ("muted slate", "steel blue", "dusty rose", etc.) so side-chain colors don't fight the paper background or each other.
- **Aromatic rings** (F, W, Y, H) draw explicit double bonds between ring carbons rather than the simplified circle — more scientifically accurate, and the community feedback on real tattoos was that explicit bonds read better under skin.
- **Stereochemistry** (wedge/dash bonds) is omitted from side chains for visual cleanliness.
- **Selenocysteine (U)** uses pink for the selenium atom, not yellow (yellow is reserved for sulfur per convention).

## Getting started

```bash
git clone git@github.com:skyguy94/peptattoo.git
cd peptattoo/client
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`. Edits hot-reload.

### Other useful commands

All run from the repo root:

```bash
npm run build      # production build (client/dist/)
npm run security   # secretlint + npm audit + eslint-plugin-security
```

From `client/`:

```bash
npm test           # vitest
npm run lint       # eslint
```

## Repository layout

```
/client              # The entire application
  /src
    /components      # React components (PeptideChain, VirtualKeyboard, TattooPreview, …)
    /lib             # Amino-acid data, content filter, shared disclaimer JSX
  /public            # Static assets served as-is
  wrangler.jsonc     # Cloudflare Workers deploy config (static assets only)
/.husky              # Git pre-commit hooks (runs client tests)
CLAUDE.md            # Guidance for Claude Code when working in this repo
```

## Deployment

The site is hosted on **Cloudflare Workers** with static assets at [peptide-tattoo.com](https://peptide-tattoo.com). The `client/wrangler.jsonc` config points Workers at the Vite build output (`./dist`) and marks the site as a single-page-application for 404 handling.

To deploy manually from a local checkout:

```bash
cd client
npm install
npm run build
npx wrangler login          # one-time
npx wrangler deploy
```

CI auto-deploy on push is wired via Cloudflare's GitHub App (Workers Builds). Build settings in the Cloudflare dashboard:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Path | `/client` |
| Production branch | `master` |

## Disclaimer

Molecular structures are artistic interpretations for novelty and tattoo-design purposes only. Side-chain geometry, stereochemistry, and bond angles are simplified for visual clarity and *may not reflect actual biochemistry*. If you plan to get this tattooed, please verify the structures with a qualified biochemist before your appointment.

## Acknowledgements

Peptattoo exists because of [this r/tattoos thread](https://www.reddit.com/r/tattoos/comments/1si6y1l/can_someone_help_me/) where [u/Individual_Talk_6149](https://www.reddit.com/user/Individual_Talk_6149/) asked the internet for help turning their last name into a peptide tattoo in the "I am star stuff" style. The chemists who showed up in the replies shaped how the app actually renders:

- [u/Turtle1391](https://www.reddit.com/user/Turtle1391/) — PhD organic chemist who makes peptides for a living. Laid out the atom palette convention ("blue ball for nitrogen, red ball for oxygen, simple stick drawings for the carbons"), noted that selenocysteine is vanishingly rare, and clarified that "there is no B, J, O, X, or Z" amino acid but that those letters do get used for IUPAC codes. The entire rendering strategy — CPK-inspired atom colors, the `~` prefix on nonstandard residues, treating U as a standard 21st residue — comes from their guidance.
- [u/Ishmael128](https://www.reddit.com/user/Ishmael128/) — introduced the canonical vs non-canonical amino acid distinction and linked [PepDraw](https://www2.tulane.edu/~biochem/WW/PepDraw/) as a reference structure tool.
- [u/edrz](https://www.reddit.com/user/edrz/) — linked the [IUPAC ambiguity code reference](https://www.dnastar.com/manuals/genvisionpro/17.4/en/topic/iupac-codes) that backs our Asx / Xle / Pyl / Xaa / Glx fallbacks.
- [u/Labrat15415](https://www.reddit.com/user/Labrat15415/) — casually mentioned that when their colleague got a grant, they synthesized a custom expression plasmid that *literally expresses a polypeptide spelling the colleague's name*, which is either the end state of this hobby or a cautionary tale.
- [u/sck178](https://www.reddit.com/user/sck178/) — correctly pointed out that the [Amino Acid Wikipedia page](https://en.wikipedia.org/wiki/Amino_acid) has everything a motivated amateur needs.

And to everyone in the thread who chimed in with "this person proteins" — that's the spirit of the whole project.

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2026 Child Left Behind.
