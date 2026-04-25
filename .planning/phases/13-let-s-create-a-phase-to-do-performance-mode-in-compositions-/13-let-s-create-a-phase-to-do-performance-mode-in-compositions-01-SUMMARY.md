---
phase: 13-let-s-create-a-phase-to-do-performance-mode-in-compositions
plan: 01
subsystem: ui
 tags:
  - react
  - react-router
  - performance-mode
  - composition

requires:
  - phase: 10-performance-print-redesign
    provides: PerformanceView single-sheet reading surface with instrument tabs, grouped/mono toggle, and print-aware markup

provides:
  - Shared performance rendering module (performance-shared.tsx) extracting grouped chords, percussion lanes, mono cues, and arrangement notes
  - Reusable PerformanceSheetContent component for both sheet and composition performance surfaces
  - Dedicated /composition/:id/performance route with CompositionPerformanceView page component
  - Single active instrument context across an entire composition collated view

affects:
  - Phase 13 Plan 02 (section boundaries and polish)
  - Any future phases that need to render sheet performance content outside PerformanceView

tech-stack:
  added: []
  patterns:
    - "Extract shared renderer: PerformanceSheetContent is a pure presentational component consumed by both sheet and composition performance views"
    - "Route-level performance mode: composition performance is a dedicated route, not an inline editor toggle"

key-files:
  created:
    - src/components/performance-shared.tsx
    - src/components/CompositionPerformanceView.tsx
  modified:
    - src/components/PerformanceView.tsx
    - src/App.tsx

key-decisions:
  - "Extracted shared renderer instead of duplicating cue/lyrics formatting logic across sheet and composition views"
  - "Kept PerformanceView behavior unchanged — it now delegates to PerformanceSheetContent while retaining its own chrome (tabs, toggle, Back to edit)"

patterns-established:
  - "performance-shared.tsx: single source of truth for instrument labels, tab classes, and sheet performance rendering"
  - "Route-based composition performance mode avoids overloading CompositionEditor with a second large surface"

requirements-completed:
  - CPERF-01
  - CPERF-02

duration: 15min
completed: 2026-04-24
---

# Phase 13 Plan 01: Shared Performance Renderer + Composition Performance Route

**Extracted reusable sheet-performance rendering and wired a dedicated `/composition/:id/performance` route with shared instrument controls across collated sheets.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-24T23:00:00Z
- **Completed:** 2026-04-24T23:15:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Extracted `performance-shared.tsx` with `PerformanceSheetContent`, `instrumentLabels`, and `instrumentTabClasses`
- Refactored `PerformanceView.tsx` to import shared renderer while preserving existing chrome and `performance-mode-active` body treatment
- Created `CompositionPerformanceView.tsx` as the dedicated composition performance reader
- Wired `/composition/:id/performance` route in `App.tsx` alongside existing routes

## Task Commits

1. **Task 1: Extract shared sheet-performance rendering for reuse** - Extracted `performance-shared.tsx` and updated `PerformanceView.tsx` to consume it
2. **Task 2: Add composition performance route and shared-instrument surface** - Created `CompositionPerformanceView.tsx` and added route in `App.tsx`

## Files Created/Modified

- `src/components/performance-shared.tsx` — Shared `PerformanceSheetContent`, `instrumentLabels`, `instrumentTabClasses`
- `src/components/CompositionPerformanceView.tsx` — Composition-level performance surface with shared instrument tabs and ordered section rendering
- `src/components/PerformanceView.tsx` — Updated to import shared renderer; preserves single-sheet route behavior
- `src/App.tsx` — Added `/composition/:id/performance` route

## Decisions Made

- Followed the plan exactly: extracted shared renderer first, then built composition route on top
- Kept `PerformanceView` behavior unchanged to avoid regressions in the existing single-sheet performance flow

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Shared renderer is ready for Plan 02 to add section boundaries, empty states, missing-sheet warnings, and print polish
- Route is live and resolving compositions from `CompositionContext`

---
*Phase: 13-let-s-create-a-phase-to-do-performance-mode-in-compositions*
*Completed: 2026-04-24*
