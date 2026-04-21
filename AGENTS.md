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
| 4 — Import/Export + Polish | ✓ Complete | 100% |
| 5 — UI Overhaul | ✓ Complete | 100% |
| 6 — Instrument-Specific Cues + Editor Precision | ○ Planned | 0% |

## Key Constraints

- **Frontend only** — no backend, no server, no database
- **localStorage persistence** — all data survives page refresh
- **JSON import/export** — primary sharing/backup mechanism; always validate with Zod before importing
- **localStorage sync** — use `useLocalStorage` hook; debounce writes; never call localStorage inside a reducer

## Data Model (Zod Schemas)

- `Sheet`: id, title, tempo, lyricsLines (currently shared `chords`; Phase 6 will replace this with instrument-specific cues), arrangements (`piano`, `guitar`, `drums` text fields)
- `Composition`: id, title, sheetIds (ordered array)
- **Lyrics are the root.** Each lyric line has a character-aligned chord line above it. The `chords` string is the same length as `lyrics` — each position is either a chord name or a space/`-` (no chord). Editing lyric text automatically shifts chord markers.
- All JSON imports must be validated against Zod schema — never accept unvalidated external data

## Architecture

- `src/context/SheetContext.tsx` — Sheet state with useReducer
- `src/context/CompositionContext.tsx` — Composition state with useReducer
- `src/hooks/useLocalStorage.ts` — Persistence hook
- `src/schemas/sheet.schema.ts` — Zod schemas (Sheet, Composition)
- `src/components/SheetList.tsx` — Library home with sheets and compositions
- `src/components/SheetEditor.tsx` — Sheet editor with lyrics, chords, tempo, and arrangement panels; includes ExportButton
- `src/components/CompositionEditor.tsx` — Composition editor with ordered sheet management; includes ExportButton
- `src/components/CompositionCard.tsx` — Composition preview card for the home library
- `src/components/SheetCard.tsx` — Sheet preview card for the home library
- `src/components/ExportButton.tsx` — JSON export button for sheets and compositions
- `src/components/ImportDialog.tsx` — File picker dialog with Zod validation and error display
- `src/components/ConfirmDialog.tsx` — Reusable confirmation modal for delete actions
- `src/components/EmptyState.tsx` — Reusable empty list placeholder with CTA
- `src/styles/print.css` — Print media stylesheet

## Routing

- `/` — Library home (sheets + compositions)
- `/sheet/:id` — Sheet editor
- `/composition/:id` — Composition editor

## Next Step

Phase 6 is now defined. Possible next steps:
- Run `/gsd-spec-phase 6` to lock the phase requirements
- Run `/gsd-plan-phase 6` to produce executable plans
- Run `/gsd-complete-milestone` later if you want to close out v1 formally first

---

*Last updated: 2026-04-21 after Phase 6 scope definition*
