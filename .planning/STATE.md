---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: "**Completed:** 2026-04-22"
current_phase: 10 — Performance + Print Redesign
status: unknown
last_updated: "2026-04-23T04:57:45Z"
progress:
  total_phases: 11
  completed_phases: 5
  total_plans: 20
  completed_plans: 16
  percent: 80
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

## Active Context

**Current session:** Phase 10 — Performance + Print Redesign
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

**Current work:** Phase 10 — Performance + Print Redesign (Complete)

**Next step:** Phase 11 — Responsive + Motion Polish

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
