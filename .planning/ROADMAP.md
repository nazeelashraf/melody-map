# Roadmap: Melody Map

**Project:** Melody Map
**Milestone:** v1.0 — ✓ COMPLETE
**Phases:** 6 (Coarse granularity)
**Requirements:** 45 mapped | 4 unmapped
**Generated:** 2026-04-20
**Last Updated:** 2026-04-22 (milestone completion)

---

## Phase 1: App Foundation

**Status:** ✓ Complete
**Plans:** 3 plans in 2 waves

**Plans:**
- [x] 01-01-PLAN.md — Types + Schemas + localStorage hook
- [x] 01-02-PLAN.md — Context providers + App routing
- [x] 01-03-PLAN.md — SheetList + SheetCard UI

**Goal:** Data model, local persistence, context providers, and sheet list UI

**Requirements:** SHEET-01, SHEET-02, SHEET-03, SHEET-04, SHEET-05, SAVE-01, SAVE-02

**Success Criteria:**
1. User can create a new sheet and see it appear in the sheet list
2. User can click a sheet to open it (editor view, even if empty)
3. User can rename a sheet title inline
4. User can delete a sheet with confirmation and see it removed from the list
5. User can refresh the page and all existing sheets/compositions are still present
6. Sheet metadata (title, tempo) is visible in the editor view

**Delivered Artifacts:**
- `src/types/index.ts` — Sheet, Composition, InstrumentType interfaces
- `src/schemas/sheet.schema.ts` — Zod schemas for Sheet and Composition
- `src/context/SheetContext.tsx` — Sheet state with useReducer
- `src/context/CompositionContext.tsx` — Composition state with useReducer
- `src/hooks/useLocalStorage.ts` — Debounced localStorage persistence hook
- `src/App.tsx` — Routing: sheet list, sheet editor, composition editor
- `src/components/SheetList.tsx` — Home view with sheet cards
- `src/components/SheetCard.tsx` — Individual sheet preview card

---

## Phase 2: Sheet Editor

**Status:** ✓ Complete

**Goal:** Full sheet editing with lyrics, tempo, chords, and three instrument arrangements

**Requirements:** LYR-01, LYR-02, LYR-03, LYR-04, ARR-01, ARR-02, ARR-03, ARR-04, ARR-05, ARR-06, ARR-07, ARR-08

**Success Criteria:**
1. User can type lyrics in a textarea and see preserved line breaks rendered below
2. User can set and change tempo (BPM) with a numeric input (20–300 range)
3. User can add chord markers above specific character positions in each lyric line
4. Chord markers stay character-aligned when lyric text is edited (chords shift to stay above correct syllable)
5. Chord lines render visually above their corresponding lyric lines in the correct character positions
6. User sees three instrument panels (Piano, Guitar, Drums) in the sheet editor
7. Editing piano content does not affect guitar or drum content
8. Editing any field auto-saves to localStorage (debounced)
9. Sheet editor shows the sheet title and is editable
10. User can navigate back to sheet list from editor

**Delivered Artifacts:**
- `src/components/SheetEditor.tsx` — Sheet metadata editor, lyrics textarea, per-line chord editing, rendered preview, and three arrangement panels
- `src/App.tsx` — Live sheet editor route wiring for `/sheet/:id`
- `src/context/SheetContext.tsx` — StrictMode-safe sheet hydration and persistence backing editor updates
- `src/context/CompositionContext.tsx` — StrictMode-safe composition hydration to avoid duplicate persisted entries in development

---

## Phase 3: Composition Builder

**Status:** ✓ Complete

**Goal:** Create and manage compositions made from multiple sheets

**Requirements:** COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, COMP-07

**Success Criteria:**
1. User can create a new composition with a title
2. User can view a list of all compositions
3. User can open a composition to edit it
4. User can add existing sheets to a composition from a sheet picker
5. User can remove a sheet from a composition
6. User can reorder sheets within a composition using up/down buttons or drag-and-drop
7. User can rename a composition
8. User can delete a composition with confirmation
9. Composition state persists to localStorage

**Delivered Artifacts:**
- `src/components/SheetList.tsx` — Library home view showing both compositions and sheets with create flows
- `src/components/CompositionCard.tsx` — Composition preview card with rename, delete, and open actions
- `src/components/CompositionEditor.tsx` — Composition editing view with add/remove/reorder controls and missing-sheet handling
- `src/App.tsx` — Live composition editor route wiring for `/composition/:id`

---

## Phase 4: Import/Export + Polish

**Status:** ✓ Complete
**Plans:** 2 plans in 2 waves

**Plans:**
- [x] 04-01-PLAN.md — Data import/export with Zod validation and error handling
- [x] 04-02-PLAN.md — UX polish with ConfirmDialog, EmptyState, and print stylesheet

**Goal:** JSON import/export for sheets and compositions, UX polish, print styles

**Requirements:** DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06

**Success Criteria:**
1. User can click "Export" on any sheet and download a `.json` file with that sheet's data
2. User can click "Import" and select a `.json` file; valid files create a new sheet
3. Importing a malformed `.json` shows a clear error message (not a crash) and preserves existing state
4. User can export a composition as JSON
5. User can import a composition from JSON
6. Sheet list and composition list show friendly empty states with call-to-action
7. Delete actions show a confirmation dialog
8. App has basic print stylesheet — printing a sheet shows readable output without UI chrome

**Delivered Artifacts:**
- `src/components/ExportButton.tsx` — JSON export button that serializes Sheet or Composition to .json download
- `src/components/ImportDialog.tsx` — File picker dialog with Zod validation and error display
- `src/components/ConfirmDialog.tsx` — Reusable confirmation modal used by SheetCard and CompositionCard
- `src/components/EmptyState.tsx` — Empty list placeholder with CTA, used in SheetList
- `src/styles/print.css` — Print media stylesheet that hides UI chrome
- `src/main.tsx` — Updated with print.css side-effect import
- `src/components/SheetEditor.tsx` — Added ExportButton in header
- `src/components/CompositionEditor.tsx` — Added ExportButton in header
- `src/components/SheetList.tsx` — Added import buttons and EmptyState refactor
- `src/components/SheetCard.tsx` — Refactored delete confirmation to use ConfirmDialog
- `src/components/CompositionCard.tsx` — Refactored delete confirmation to use ConfirmDialog

---

## Phase 5: UI Overhaul — Modernize and Improve Usability

**Status:** ✓ Complete
**Plans:** 3 plans in 3 waves

**Plans:**
- [x] 05-01-PLAN.md — Tailwind + shadcn/ui setup + ThemeProvider + holy grail layout
- [x] 05-02-PLAN.md — Library component migration to Tailwind + shadcn
- [x] 05-03-PLAN.md — Editor redesign with Edit/Performance modes + responsive + print

**Goal:** Overhaul the visual design and interaction patterns to make the app more user-friendly and modern. The current inline-style UI is functional but visually lacking — improve layout, typography, spacing, responsiveness, and overall polish.

**Depends on:** Phases 1–4

**Requirements:** VIS-01, VIS-02

**Success Criteria:**
1. All inline `style={{}}` objects replaced with Tailwind utility classes across all 9 components
2. Holy grail layout with collapsible sidebar and top bar renders on desktop and mobile
3. Dark mode toggle works and persists across page refresh
4. Sheet editor has Edit and Performance view modes with visible toggle
5. Performance mode shows single instrument focus with Piano/Guitar/Drums tabs and large readable chords
6. Responsive design: sidebar collapses to hamburger menu on narrow screens, content stacks on mobile
7. shadcn/ui Dialog and AlertDialog replace custom ConfirmDialog and ImportDialog
8. Print stylesheet hides layout chrome and shows clean readable output
9. All existing functionality preserved (CRUD, import/export, navigation, persistence)

**Delivered Artifacts:**
- `src/index.css` — Tailwind v4 directives, dark mode CSS variables, Inter font
- `src/context/ThemeProvider.tsx` — Dark mode context with localStorage persistence
- `src/components/layout/AppLayout.tsx` — Holy grail grid layout with responsive sidebar
- `src/components/layout/Sidebar.tsx` — Navigation sidebar with sheet/composition links
- `src/components/layout/TopBar.tsx` — Top bar with dark mode toggle
- `src/components/ui/` — 12 shadcn component primitives
- `src/lib/utils.ts` — cn() utility function
- `src/lib/lyrics-utils.ts` — Shared chord/lyrics formatting utilities
- `src/components/PerformanceView.tsx` — Performance mode with instrument tabs
- `src/components/ConfirmDialog.tsx` — Migrated to shadcn AlertDialog
- `src/components/ImportDialog.tsx` — Migrated to shadcn Dialog
- `src/components/ExportButton.tsx` — Restyled with shadcn Button + Lucide Download
- `src/components/EmptyState.tsx` — Restyled with Tailwind + Lucide Inbox
- `src/components/SheetCard.tsx` — Restyled with Tailwind + Lucide icons
- `src/components/CompositionCard.tsx` — Restyled with Tailwind + Lucide icons
- `src/components/SheetList.tsx` — Restyled with responsive grid
- `src/components/SheetEditor.tsx` — Redesigned with Edit/Performance toggle, Tailwind styling
- `src/components/CompositionEditor.tsx` — Redesigned with Tailwind styling
- `src/styles/print.css` — Updated for new layout chrome
- `src/App.tsx` — Updated with ThemeProvider, TooltipProvider, AppLayout wrappers

---

## Phase 6: Instrument-Specific Cues + Editor Precision

**Status:** ✓ Complete
**Plans:** 3 plans in 3 waves

**Plans:**
- [x] 06-01-PLAN.md — Verify data model: types, schema, utilities
- [x] 06-02-PLAN.md — SheetEditor cue editor verification: stable caret, linked fields, copy actions
- [x] 06-03-PLAN.md — PerformanceView instrument-specific rendering with distinct styles and percussion lanes

**Goal:** Replace the shared lyric-line chord model with instrument-specific cues, improve cue editing precision, and update performance view so each player sees their own readable cues.

**Depends on:** Phases 1–5

**Requirements:** CUE-01, CUE-02, CUE-03, CUE-04, CUE-05, EDIT-01, EDIT-02, EDIT-03, PERF-01, PERF-02, PERF-03

**Success Criteria:**
1. Each lyric line stores separate cue content for piano, guitar, and percussion instead of one shared `chords` string
2. Piano and guitar can display different cues for the same lyric line in both edit and performance views
3. Percussion editing supports five aligned lanes (`C`, `H`, `R`, `S`, `B`) with simultaneous hits at the same lyric position
4. The lyric-line editor uses vertically linked monospace cue/lyric inputs with substantially clearer position targeting than the current split layout
5. Entering multi-character chord names such as `Bm` or `Am` preserves caret position and does not jump to the end unexpectedly
6. A per-line action lets the user copy the current instrument cue pattern to the other instruments
7. Performance view renders cues in a visually distinct monospace style above lyrics for piano/guitar and as stacked lanes for percussion
8. Existing v1 sheet data compatibility is not preserved; the new schema is allowed to replace the old one without migration

**Delivered Artifacts:**
- `src/types/index.ts` — Updated lyric-line and instrument cue types
- `src/schemas/sheet.schema.ts` — Updated sheet schema for instrument-specific cues
- `src/lib/lyrics-utils.ts` — Cue normalization and lyric-sync utilities for multiple instruments
- `src/components/SheetEditor.tsx` — Redesigned per-line cue editor with linked cue/lyric fields and copy action
- `src/components/PerformanceView.tsx` — Instrument-specific cue rendering with distinct typography and percussion lanes
- `src/context/SheetContext.tsx` — Updated persistence for the new sheet shape
- `src/components/CompositionEditor.tsx` — Any required compatibility updates for the revised sheet model

---

## Phase Map

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | App Foundation | Project scaffold, data model, persistence, navigation | SHEET-01–05, SAVE-01–02 | 6 criteria |
| 2 | Sheet Editor | Full sheet editing: lyrics, tempo, chord-aligned markers, three instrument arrangements | LYR-01–04, ARR-01–08 | 10 criteria |
| 3 | Composition Builder | Create and manage compositions from multiple sheets | COMP-01–07 | 9 criteria |
| 4 | Import/Export + Polish | JSON import/export, error handling, print styles, empty states | DATA-01–06 | 8 criteria |
| 5 | UI Overhaul — Modernize and Improve Usability | Improve layout, typography, spacing, responsiveness, and overall polish | VIS-01, VIS-02 | 9 criteria |
| 6 | Instrument-Specific Cues + Editor Precision | Replace shared chord lines with instrument-specific cues and improve cue editing/performance readability | CUE-01–05, EDIT-01–03, PERF-01–03 | 8 criteria |

---

## Phase Order Rationale

1. **Foundation first** — Data model (Zod schemas), persistence, and routing must be solid before building any features on top
2. **Sheet editor next** — The core differentiator (multi-instrument arrangements alongside lyrics) must work before composition building
3. **Composition third** — Depends entirely on sheets existing; straightforward once sheet editor is complete
4. **Import/export + polish last** — Cross-cutting concern that benefits from having real data to test with; polish rounds out the experience

---

## Verification

After each phase, the **Verifier** agent will confirm:
- All success criteria are demonstrable
- No previously working features regressed
- All mapped requirements are checked off in REQUIREMENTS.md traceability table

## Backlog

- **PDF Import** — Add PDF ingestion for song sheets once a stable, machine-readable source format is available. Scope should cover extracting lyrics, section markers, and instrument cues without weakening the JSON-first import path.

---

## Milestone Completion — v1.0

**Completed:** 2026-04-22

All 6 phases have been successfully implemented and verified:

| Phase | Plans | Status |
|-------|-------|--------|
| 1 — App Foundation | 3/3 | ✓ Complete |
| 2 — Sheet Editor | direct | ✓ Complete |
| 3 — Composition Builder | direct | ✓ Complete |
| 4 — Import/Export + Polish | 2/2 | ✓ Complete |
| 5 — UI Overhaul | 3/3 | ✓ Complete |
| 6 — Instrument-Specific Cues + Editor Precision | 3/3 | ✓ Complete |

**Verification:**
- `npm run typecheck` — PASSED
- `npm run build` — PASSED (2037 modules, 2.01s)

**Delivered Features:**
- Sheet creation, editing, and deletion with localStorage persistence
- Multi-instrument arrangements (Piano, Guitar, Drums) alongside lyrics
- Instrument-specific cues that align to lyric lines
- Composition builder for organizing multiple sheets
- JSON import/export with Zod validation
- Dark mode support with theme persistence
- Responsive design with collapsible sidebar
- Print stylesheet for clean output
- Modern UI with Tailwind CSS and shadcn/ui components
