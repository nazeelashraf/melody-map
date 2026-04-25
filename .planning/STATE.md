---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: "**Completed:** 2026-04-22"
current_phase: 13 — Composition Performance Mode
status: complete
last_updated: "2026-04-25T02:30:00.000Z"
progress:
  total_phases: 13
  completed_phases: 13
  total_plans: 26
  completed_plans: 19
  percent: 100
---

# State: Melody Map

**Project:** Melody Map
**Last updated:** 2026-04-23 after Phase 9 Sheet Canvas Redesign verification and completion

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-22)

**Core value:** A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.

**Milestone:** Melody Map v1.1 — DESIGN.md Implementation — In Progress
**Current phase:** 10 — Performance + Print Redesign

## Phase Status

| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1 — App Foundation | ✓ Complete | 3/3 | 100% |
| 2 — Sheet Editor | ✓ Complete | direct build | 100% |
| 3 — Composition Builder | ✓ Complete | direct build | 100% |
| 4 — Import/Export + Polish | ✓ Complete | direct build | 100% |
| 5 — UI Overhaul | ✓ Complete | 3/3 | 100% |
| 6 — Instrument-Specific Cues + Editor Precision | ✓ Complete | 3/3 | 100% |
| 7 — Design Foundations | ✓ Complete | 1/1 | 100% |
| 8 — Shell + Library Redesign | ✓ Complete | 3/3 | 100% |
| 9 — Sheet Canvas Redesign | ✓ Complete | 3/3 | 100% |
| 10 — Performance + Print Redesign | ✓ Complete | 3/3 | 100% |
| 11 — Responsive + Motion Polish | Planned | — | 0% |
| 12 — Chord Transposition | ✓ Complete | 2/2 | 100% |
| 13 — Composition Performance Mode | ✓ Complete | 2/2 | 100% |

## Active Context

**Current session:** Phase 13 — Composition Performance Mode
**Completed steps:**

- v1.0 milestone complete (Phases 1–6)
- v1.1 milestone planning complete:
  - Requirements drafted and approved (20 requirements across 5 categories)
  - Roadmap drafted and approved (Phases 7–11)
  - Research completed: Tailwind v4 theming, shadcn customization, WCAG focus/contrast, reduced-motion
  - Brownfield gap analysis completed
- Planning docs updated for v1.1:
  - `.planning/MILESTONES.md` created
  - `.planning/STATE.md` updated
  - `.planning/PROJECT.md` updated
  - `.planning/REQUIREMENTS.md` updated
  - `.planning/ROADMAP.md` updated
- Phase 7 — Design Foundations: design tokens, typography, focus/selection language implemented
- Phase 8 Plan 01 — Shell Library Redesign: AppLayout, Sidebar, TopBar redesigned with warm-canvas/dark-shell split
- Phase 8 Plan 02 — Shared UI Primitives Redesign: ConfirmDialog, ImportDialog, EmptyState redesigned with cohesive card-based visual language
- Phase 8 Plan 03 — Library Components Redesign: SheetList, SheetCard, CompositionCard redesigned with instrument identity hints, sheet order visualization, and responsive grid
- Phase 9 Plan 01 — SheetEditor Canvas-First Redesign: minimal chrome header, compact metadata bar, full-width editing surface, reduced-chrome arrangements at bottom
- Phase 9 Plan 02 — Per-line Lane Styling Refinements: distinct instrument-colored cue lanes, underline-style lyric inputs, compact floating action buttons
- Phase 9 Plan 03 — Track-style Instrument Controls + PerformanceView: track-header global toggle, per-line colored pills, PerformanceView track-style tabs with instrument identity colors
- Phase 10 Plan 01 — Performance Surface Redesign: reading-first view with large title, tempo badge, shell recession, Back to edit affordance, generous blank line spacing
- Phase 10 Plan 02 — Grouped Chord Format + Notes: grouped lead-sheet chord renderer with mono/grouped toggle and collapsible instrument-linked notes section
- Phase 10 Plan 03 — Purposeful Print Stylesheet: purposeful print layout with selective hiding, readable typography, page-break rules, and expanded instrument notes for clean paper output
- Phase 13 Plan 01 — Shared Performance Renderer + Composition Performance Route: extracted reusable `PerformanceSheetContent`, wired `/composition/:id/performance` route with shared instrument tabs across collated sheets
- Phase 13 Plan 02 — Composition Editor Entry + Section Polish + Print Completion: added `Performance mode` entry link, per-sheet section boundaries with index/title/tempo, missing-sheet warnings, empty-state surface, and print-aware section separators

**Current work:** Phase 13 — Composition Performance Mode (Complete)

**Next step:** Phase 11 — Responsive + Motion Polish

## Accumulated Context

### Roadmap Evolution

- Phase 12 added: before phase 11 (can be phase 12 out of order), I need to allow transposition of chords in chorded instruments. for example A chord with 2 half steps up will be a B chord. Since the guitar is sometimes play with a capo, it's better to allow half step transposes. System should consider any sequence of letters between spaces in the cues to be a chord. for example ` Bm `. While the true note will be Bm still, the user is given the option to `transpose` the chords. the system will look at a pre-defined state machine to transition it to the right chords based on the half step selected. All chords in the current instrument will be shifted accordingly. sometimes, the chord length can change from Am to A#m, which increases the length of the cue and possible truncates the chords at the end. this should not happen. instead, pad the lyrics with spaces (at the end) where possible to create more space in the cues. the position of the chords MUST NOT CHANGE relative to the lyrics when transposing. The same transpose can be applied to the piano also. the transpose should be an edit in place of ALL the cues in the currently selected instrument. For chords that are not recognizable, leave them as such and do not modify them.
- Phase 13 added: let's create a phase to do performance mode in compositions. it is the same as performance mode in sheets but the sheets are collated and displayed in the order of the composition. there should be clear breaks between sheets to show the separation.

## Notes

- All six v1.0 phases implemented and verified
- Lyrics remain the root model; instrument-specific cues replace shared chords
- The sheet/composition providers hydrate from localStorage via reducer initializers
- Composition ordering is stored as `sheetIds`
- Import assigns a new UUID to avoid collisions; Zod safeParse validates all imported data
- Print styles hide interactive chrome (buttons, inputs, links) and show content with readable fonts
- Dark mode toggle persists to localStorage key `melody-map-theme`
- AppLayout now uses clear warm-canvas / dark-shell zoning with responsive sidebar
- SheetEditor has Edit/Performance view mode toggle; PerformanceView shows instrument tabs
- Zero inline `style={{}}` patterns remain in application components
- Phase 6 breaks existing v1 sheet data; migration is explicitly out of scope
- PDF import is deferred to backlog

## v1.1 Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Preserve dark-mode toggle | Already shipped and validated in v1.0 | Both light and dark themes will share the warm-canvas/dark-shell language |
| Adapt to cues (not chord chips) | Phase 6 already delivered instrument-specific cue model | Visual language adapts to cue rows/lanes instead of reverting to chord chips |
| Visual-only collaboration | DESIGN.md references collaboration motifs | No real-time or multi-user features; only styling hints |
| Subtle motion only | User preference for smooth but not flashy | Short transitions, reduced-motion support via `prefers-reduced-motion` |
| Kept component interfaces unchanged during shell redesign | Avoid downstream breakage in SheetEditor and CompositionEditor | AppLayout, Sidebar, TopBar props unchanged; all existing navigation flows preserved |
| Used cross-context read in CompositionCard for sheet titles | CompositionCard needs sheet titles for mini preview; both providers always mounted | `useSheet()` inside CompositionCard is safe and avoids prop drilling |
| Replaced ExportButton with inline ghost button in SheetEditor header | ExportButton does not accept variant/className props; design spec requires ghost styling | Inline button preserves export logic while matching canvas-first minimal chrome design |
| Extracted InstrumentTabContent sub-component | Need per-tab useState without violating Rules of Hooks | Each instrument tab manages its own notesOpen state independently |
| Used controlled Tabs for view toggle visibility | Need to conditionally hide mono/grouped toggle when percussion is active | activeTab state drives both tab selection and toggle visibility |
| Used data-print-hide attribute selector for print hiding | Broad `button, input, textarea, a` selectors hide meaningful text like links | Only elements explicitly marked with data-print-hide or .no-print are hidden in print |
| Split notes into separate screen/print DOM branches | CSS-only override of collapsible behavior is fragile and requires specificity battles | Screen notes remain collapsible; print notes always render expanded via separate branch |

**Completed Phase:** 13 (Composition Performance Mode) — 2 plans — 2026-04-25T02:30:00.000Z
