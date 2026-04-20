# Melody Map — Project Guide

**Project:** Melody Map
**Core value:** A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.
**Stack:** React 18 + TypeScript 5 + Vite 5 + Zod 3.24

## Phase Status

| Phase | Status | Progress |
|-------|--------|----------|
| 1 — App Foundation | ○ Not Started | 0% |
| 2 — Sheet Editor | ○ Not Started | 0% |
| 3 — Composition Builder | ○ Not Started | 0% |
| 4 — Import/Export + Polish | ○ Not Started | 0% |

## Key Constraints

- **Frontend only** — no backend, no server, no database
- **localStorage persistence** — all data survives page refresh
- **JSON import/export** — primary sharing/backup mechanism; always validate with Zod before importing
- **localStorage sync** — use `useLocalStorage` hook; debounce writes; never call localStorage inside a reducer

## Data Model (Zod Schemas)

- `Sheet`: id, title, tempo, lyrics, arrangements (record: instrument → content)
- `Composition`: id, title, sheetIds (ordered array)
- All JSON imports must be validated against Zod schema — never accept unvalidated external data

## Architecture

- `src/context/SheetContext.tsx` — Sheet state with useReducer
- `src/context/CompositionContext.tsx` — Composition state with useReducer
- `src/hooks/useLocalStorage.ts` — Persistence hook
- `src/schemas/sheet.schema.ts` — Zod schemas (Sheet, Composition)

## Routing

- `/` — Sheet list (home)
- `/sheet/:id` — Sheet editor
- `/composition/:id` — Composition editor

## Next Step

Run `/gsd-plan-phase 1` to plan the App Foundation phase.

---

*Last updated: 2026-04-20 after initialization*
