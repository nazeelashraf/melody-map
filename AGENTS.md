# Melody Map — Project Guide

**Project:** Melody Map
**Core value:** A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.
**Stack:** React 18 + TypeScript 5 + Vite 5 + Zod 3.24

## Phase Status

| Phase | Status | Progress |
|-------|--------|----------|
| 1 — App Foundation | ✓ Complete | 100% |
| 2 — Sheet Editor | ✓ Complete | 100% |
| 3 — Composition Builder | ✓ Complete | 100% |
| 4 — Import/Export + Polish | ○ Not Started | 0% |

## Key Constraints

- **Frontend only** — no backend, no server, no database
- **localStorage persistence** — all data survives page refresh
- **JSON import/export** — primary sharing/backup mechanism; always validate with Zod before importing
- **localStorage sync** — use `useLocalStorage` hook; debounce writes; never call localStorage inside a reducer

## Data Model (Zod Schemas)

- `Sheet`: id, title, tempo, lyricsLines (array of {lyrics: string, chords: string}), arrangements (`piano`, `guitar`, `drums` text fields)
- `Composition`: id, title, sheetIds (ordered array)
- **Lyrics are the root.** Each lyric line has a character-aligned chord line above it. The `chords` string is the same length as `lyrics` — each position is either a chord name or a space/`-` (no chord). Editing lyric text automatically shifts chord markers.
- All JSON imports must be validated against Zod schema — never accept unvalidated external data

## Architecture

- `src/context/SheetContext.tsx` — Sheet state with useReducer
- `src/context/CompositionContext.tsx` — Composition state with useReducer
- `src/hooks/useLocalStorage.ts` — Persistence hook
- `src/schemas/sheet.schema.ts` — Zod schemas (Sheet, Composition)
- `src/components/SheetList.tsx` — Library home with sheets and compositions
- `src/components/SheetEditor.tsx` — Sheet editor with lyrics, chords, tempo, and arrangement panels
- `src/components/CompositionEditor.tsx` — Composition editor with ordered sheet management
- `src/components/CompositionCard.tsx` — Composition preview card for the home library

## Routing

- `/` — Library home (sheets + compositions)
- `/sheet/:id` — Sheet editor
- `/composition/:id` — Composition editor

## Next Step

Run `/gsd-plan-phase 4` to plan Import/Export + Polish.

---

*Last updated: 2026-04-20 after Phase 3 implementation*
