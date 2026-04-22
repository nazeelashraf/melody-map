# Melody Map

A browser-based song sheet editor for musicians who need to write, organize, and perform with multi-instrument lyrics and cues — no account, no backend, no install.

**Status: v1.0 complete.** Phase 6 (Instrument-Specific Cues + Editor Precision) is underway.

## Features

- **Multi-instrument sheet editor** — write lyrics with character-aligned cues for piano, guitar, and percussion
- **Percussion lanes** — five named lanes (Crash, Hi-hat, Ride, Snare, Bass) stacked above the lyric line
- **Performance view** — switch between instruments and see cues in a clean, readable layout
- **Composition builder** — assemble ordered setlists from your saved sheets
- **Local persistence** — all data stays in your browser's localStorage
- **JSON import/export** — back up and share sheets as `.json` files, validated with Zod
- **Print stylesheet** — optimized print output for physical song sheets

## Tech Stack

React 18 + TypeScript 5 + Vite 5 + Tailwind CSS v4 + shadcn/ui + Zod 3

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run TypeScript type-checking only |

## Data Model

Each sheet contains:

- `title` — song name
- `tempo` — BPM (20–300)
- `lyricsLines` — array of lyric lines, each with per-instrument cue data for piano, guitar, and drums
- `arrangements` — freeform section notes per instrument

Composures are ordered collections of sheets (for setlists and rehearsal ordering).

## Architecture

- `src/context/SheetContext.tsx` — Sheet state with useReducer
- `src/context/CompositionContext.tsx` — Composition state with useReducer
- `src/hooks/useLocalStorage.ts` — Persistence hook
- `src/schemas/sheet.schema.ts` — Zod validation schemas
- `src/lib/lyrics-utils.ts` — Cue normalization and lyric sync utilities

## Phase History

| Phase | Goal | Status |
|-------|------|--------|
| 1 | App Foundation | ✓ Complete |
| 2 | Sheet Editor | ✓ Complete |
| 3 | Composition Builder | ✓ Complete |
| 4 | Import/Export + Polish | ✓ Complete |
| 5 | UI Overhaul | ✓ Complete |
| 6 | Instrument-Specific Cues + Editor Precision | In Progress |

See [ROADMAP.md](./.planning/ROADMAP.md) for full requirements and success criteria.
