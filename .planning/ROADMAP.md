# Roadmap: Melody Map

**Project:** Melody Map
**Phases:** 4 (Coarse granularity)
**Requirements:** 32 mapped | 0 unmapped
**Generated:** 2026-04-20

---

## Phase 1: App Foundation

**Status:** ● In Progress
**Plans:** 3 plans in 2 waves

**Plans:**
- [ ] 01-01-PLAN.md — Types + Schemas + localStorage hook
- [ ] 01-02-PLAN.md — Context providers + App routing
- [ ] 01-03-PLAN.md — SheetList + SheetCard UI

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
- `src/components/SheetEditor.tsx` — Main sheet editing view
- `src/components/LyricsEditor.tsx` — Lyrics textarea with preview
- `src/components/TempoInput.tsx` — BPM numeric input with range validation
- `src/components/ChordMarkerInput.tsx` — Chord/section marker editor
- `src/components/InstrumentPanel.tsx` — Per-instrument arrangement text editor
- `src/components/InstrumentTabs.tsx` — Tabbed or split view for piano/guitar/drums

---

## Phase 3: Composition Builder

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
- `src/components/CompositionList.tsx` — Home view for compositions
- `src/components/CompositionEditor.tsx` — Composition editing view
- `src/components/SheetPicker.tsx` — Modal to select sheets to add to composition
- `src/components/CompositionSheetItem.tsx` — Sheet entry in composition with reorder controls

---

## Phase 4: Import/Export + Polish

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
- `src/components/ExportButton.tsx` — Serialize entity to JSON, trigger download
- `src/components/ImportDialog.tsx` — File picker + Zod validation + error display
- `src/components/ConfirmDialog.tsx` — Reusable confirmation modal
- `src/components/EmptyState.tsx` — Empty list placeholder with CTA
- `src/styles/print.css` — Print media stylesheet

---

## Phase Map

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | App Foundation | Project scaffold, data model, persistence, navigation | SHEET-01–05, SAVE-01–02 | 6 criteria |
| 2 | Sheet Editor | Full sheet editing: lyrics, tempo, chord-aligned markers, three instrument arrangements | LYR-01–04, ARR-01–08 | 10 criteria |
| 3 | Composition Builder | Create and manage compositions from multiple sheets | COMP-01–07 | 9 criteria |
| 4 | Import/Export + Polish | JSON import/export, error handling, print styles, empty states | DATA-01–06 | 8 criteria |

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
