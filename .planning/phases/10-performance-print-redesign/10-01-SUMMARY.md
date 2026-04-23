---
phase: 10-performance-print-redesign
plan: 01
subsystem: ui
tags: [react, typescript, tailwindcss, performance-view, shell-recession, reading-mode]

# Dependency graph
requires:
  - phase: 9-sheet-canvas-redesign
    provides: PerformanceView component, SheetEditor view mode toggle, instrument tab styling
provides:
  - Reading-first performance surface with minimal chrome
  - Shell recession CSS rules for performance mode
  - Back to edit affordance in performance view
  - Large stage-reading typography (text-3xl title, text-lg mono cues)
affects:
  - 10-performance-print-redesign (Plan 02 - print styles)
  - 11-responsive-motion-polish

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "document.body classList toggle via useEffect for global UI state"
    - "CSS attribute selectors ([data-sidebar], [data-topbar]) for shell recession"
    - "Responsive opacity recession (0.2 desktop / 0.4 mobile)"

key-files:
  created: []
  modified:
    - src/components/PerformanceView.tsx
    - src/components/SheetEditor.tsx
    - src/index.css

key-decisions:
  - "Kept instrumentTabClasses object structure unchanged, only updated inactive styling per plan"
  - "Preserved single pre block for piano/guitar mono rendering to maintain formatPreviewLine compatibility"
  - "Used pointer-events: none on recessed sidebar but pointer-events: auto on topbar children to keep dark-mode toggle usable"

patterns-established:
  - "Performance mode shell recession: body.performance-mode-active + data-attribute selectors"
  - "Reading-first layout: h-full flex flex-col with flex-1 overflow-y-auto content area"

requirements-completed:
  - PERF-04

# Metrics
duration: 8min
completed: 2026-04-23
---

# Phase 10 Plan 01: Performance Surface Redesign Summary

**Reading-first performance view with shell recession, large stage-reading typography, and Back to edit affordance**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-23T04:20:00Z
- **Completed:** 2026-04-23T04:28:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Redesigned PerformanceView into a reading-first surface with minimal chrome
- Added `onBackToEdit` prop and Back to edit button with Edit3 icon
- Implemented `performance-mode-active` body class toggle on mount/unmount
- Added shell recession CSS: sidebar and topbar fade to 20% opacity with smooth transition
- Increased blank lyric line spacing to `h-12` for generous verse pacing
- Restyled instrument tabs: removed border-b, smaller `px-3 py-1.5` sizing, gap-1

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign PerformanceView as reading-first surface** - `df5550a` (feat)
2. **Task 2: Wire shell recession and back-to-edit flow** - `3d3898d` (feat)

**Plan metadata:** `TBD` (docs: complete plan)

## Files Created/Modified
- `src/components/PerformanceView.tsx` - Redesigned into reading-first surface with large title, tempo badge, minimal header, restyled tabs, plain-canvas content area
- `src/components/SheetEditor.tsx` - Wired `onBackToEdit={() => setViewMode('edit')}` prop to PerformanceView call
- `src/index.css` - Added `.performance-mode-active` shell recession rules for `[data-sidebar]` and `[data-topbar]`

## Decisions Made
- Followed plan as specified for all styling and structural changes
- Kept existing `instrumentTabClasses` object and tab logic unchanged except for inactive styling tweaks
- Preserved percussion lane rendering logic and arrangement notes section
- Maintained single `<pre>` block for piano/guitar mono cue rendering (formatPreviewLine returns plain text)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - typecheck and build both passed on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Performance surface redesign complete, ready for Plan 02 (print styles)
- Shell recession pattern established and reusable for any future full-screen reading modes

---
*Phase: 10-performance-print-redesign*
*Completed: 2026-04-23*
